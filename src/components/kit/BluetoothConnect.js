/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:34:33
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:34:32
 */

/**
 * Bluetooth Connect Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    Alert,
    Image,
    NativeEventEmitter,
    NativeModules,
    PermissionsAndroid,
    Platform,
    RefreshControl,
    ScrollView,
    View,
} from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import BleManager from 'react-native-ble-manager';
import Collapsible from 'react-native-collapsible';
import LinearGradient from 'react-native-linear-gradient';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Modal from 'react-native-modalbox';
import Toast, { DURATION } from 'react-native-easy-toast';

// Consts and Libs
import { Roles, BLEConfig, AppColors, AppFonts, AppStyles, AppSizes } from '../../constants';
import { bleUtils } from '../../constants/utils';
import { ble as BLEActions } from '../../actions';
import { store } from '../../store';

// Components
import { Button, Coach, FormLabel, ListItem, Pages, Spacer, TabIcon, Text, } from '../custom';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const accessoryDiscoverabilityInstruction = 'To enter setup, hold both buttons until the sensor light begins to breathe blue.';
const coachDiscoverabilityInstruction = 'Now let\'s pair wth your sensor. Your sensor will only sync data with one phone, so be sure this is the device you\'ll be using daily.';
const sensorListTitle = 'What is your sensor\'s serial number?';
const sensorListSubtitle = 'Your sensor\'s serial number can be found on the paper insert that came with your kit.';
const successfullyConnected = ['Congrats!', 'You\'re all set up.'];

/* Component ==================================================================== */
const NavBar = ({ backButtonColor, onBackPress, title, titleColor, wrapperStyle }) => (
    <View style={[wrapperStyle, {flexDirection: 'row', height: AppSizes.navbarHeight, justifyContent: 'space-between',}]}>
        <View style={{justifyContent: 'center', flex: 1,}}>
            <TabIcon
                containerStyle={[{alignSelf: 'flex-start'}]}
                icon={'ios-arrow-back'}
                iconStyle={[{color: backButtonColor || AppColors.white}]}
                onPress={onBackPress}
                reverse={false}
                size={34}
                type={'ionicon'}
            />
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 8,}}>
            <Text oswaldRegular style={[{color: titleColor || AppColors.white, fontSize: AppFonts.scaleFont(20),}]}>{title}</Text>
        </View>
        <View style={{justifyContent: 'center', flex: 1,}}></View>
    </View>
);

class BluetoothConnectView extends Component {
    static componentName = 'BluetoothConnectView';

    static propTypes = {
        bluetooth:          PropTypes.shape({}),
        changeState:        PropTypes.func.isRequired,
        checkState:         PropTypes.func.isRequired,
        connectToAccessory: PropTypes.func.isRequired,
        deviceFound:        PropTypes.func.isRequired,
        disconnect:         PropTypes.func.isRequired,
        enableBluetooth:    PropTypes.func.isRequired,
        getAccessoryKey:    PropTypes.func.isRequired,
        getOwnerFlag:       PropTypes.func.isRequired,
        getUserSensorData:  PropTypes.func.isRequired,
        getWifiMacAddress:  PropTypes.func.isRequired,
        loginToAccessory:   PropTypes.func.isRequired,
        postUserSensorData: PropTypes.func.isRequired,
        setKitTime:         PropTypes.func.isRequired,
        startBluetooth:     PropTypes.func.isRequired,
        startConnect:       PropTypes.func.isRequired,
        startScan:          PropTypes.func.isRequired,
        stopConnect:        PropTypes.func.isRequired,
        stopScan:           PropTypes.func.isRequired,
        user:               PropTypes.shape({}),
    }

    static defaultProps = {
        bluetooth: {},
        user:      {},
    }

    constructor(props) {
        super(props);

        this.state = {
            data:             null,
            index:            0,
            isAlertModalOpen: false,
            isCollapsed:      true,
            size:             {},
        };

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.props.stopScan.bind(this);
        this.handleBleStateChange = this.handleBleStateChange.bind(this);
    }

    componentDidMount = () => {
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
        this.handlerState = bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleBleStateChange );

        this.props.checkState();
        this._startBluetooth();
    }

    componentWillUnmount = () => {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerState.remove();
        this.pages = null;
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(!store.getState().network.connected) {
            this.props.showDropdownAlert();
        }
    }

    _startBluetooth = () => {
        return BLEActions.startBluetooth()
            .then(() => {
                BleManager.checkState();
                if (Platform.OS === 'android') {
                    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
                        .then(result => {
                            if (!result) {
                                return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
                                    .then(res => {
                                        if (res === 'denied') {
                                            throw new Error('Bluetooth inactive');
                                        }
                                        return null;
                                    });
                            }
                            return null;
                        })
                        .then(() => LocationServicesDialogBox.checkLocationServicesIsEnabled({
                            message:            '<h2>Use Location?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, or cell network for location<br/>',
                            ok:                 'YES',
                            cancel:             'NO',
                            enableHighAccuracy: false,
                        }))
                        .then(success => {
                            /* eslint-disable no-undef */
                            return navigator.geolocation.getCurrentPosition((position) => BleManager.enableBluetooth(), error => console.log(error), { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
                        })
                        .catch((error) => {
                            console.log(error.message);
                            return Promise.reject(error);
                        });
                }
                return Promise.resolve();
            })
            .catch(error => Promise.reject(error));
    }

    handleScan = () => {
        return this.props.startScan();
    }

    toggleScanning = (bool) => {
        return bool ? this.props.startScan() : this.props.stopScan();
    }

    handleDiscoverPeripheral = (data) => {
        if (data.advertising && data.advertising.kCBAdvDataLocalName) {
            data.name = data.advertising.kCBAdvDataLocalName;
        }
        // return data.name && /Fathom_kit_/i.test(data.name) ? this.props.deviceFound(data) : null; // 3 sensor solution
        return data.name && /fathomS[*]_/i.test(data.name) ? this.props.deviceFound(data) : null; // single sensor solution
    }

    handleBleStateChange = (data) => {
        if (data.state === 'off') {
            if (this.pages && this.pages.progress > 1) {
                this.setState({ index: 1 });
                this.pages.progress = 1;
            } else if (!this.pages) {
                return Promise.resolve(this.props.changeState(data.state))
                    .then(() => Actions.settings());
            }
        } else if (data.state === 'on' && this.pages && this.pages.progress === 1) {
            this.setState(
                { index: 2 },
                () => {
                    this.pages.progress = 2;
                }
            );
        }
        return this.props.changeState(data.state);
    }

    connect = (data) => {
        return this.props.stopScan()
            .then(() => this.props.connectToAccessory(data))
            .catch(err => this.props.connectToAccessory(data))
            .catch(err => this.props.stopConnect())
            .then(() => {
                this._toggleAlertNotification(data.id, this.props.user.id);
            })
            .catch(err => {
                console.log('err in BluetoothConnect #4',err);
                if (this.props.bluetooth.accessoryData && !this.props.bluetooth.accessoryData.sensor_pid) {
                    this.refs.toast.show('Failed to PAIR to sensor', (DURATION.LENGTH_SHORT * 2));
                }
                return this.props.stopConnect();
            });
    }

    _onLayoutDidChange = (e) => {
        const layout = e.nativeEvent.layout;
        this.setState({ size: { width: layout.width, height: layout.height } });
    }

    _toggleAlertNotification(sensorId, userId) {
        Alert.alert(
            '',
            'Did your sensor\'s light blink green?',
            [
                {
                    text:    'No',
                    onPress: () => {
                        this.setState({ index: 0 });
                        this.pages.progress = 0;
                        return this.props.checkState()
                            .then(() => BleManager.disconnect(sensorId));
                    },
                    style: 'cancel',
                },
                {
                    text:    'Yes',
                    onPress: () => {
                        let ble = {};
                        ble.accessoryData = {};
                        ble.accessoryData.sensor_pid = sensorId;
                        return bleUtils.handleBLESingleSensorStatus(ble, false)
                            .then(res => {
                                if(res.numberOfPractices > 0) {
                                    return this._togglePracticesAlertNotification(userId, sensorId);
                                }
                                return this.props.postUserSensorData(userId)
                                    .then(() => BleManager.disconnect(sensorId))
                                    .catch(err => BleManager.disconnect(sensorId))
                                    .then(() => {
                                        if (this.props.bluetooth.accessoryData && !this.props.bluetooth.accessoryData.sensor_pid) {
                                            this.refs.toast.show('Failed to PAIR to sensor', (DURATION.LENGTH_SHORT * 2));
                                        }
                                        this.setState({ index: 3 });
                                        this.pages.progress = 3;
                                        this.props.stopConnect();
                                        return this.props.checkState();
                                    });
                            });
                    }
                },
            ],
            { cancelable: false }
        );
    }

    componentWillReceiveProps(nextProps) {
        if(
            this.state.index === 2 &&
            !nextProps.bluetooth.scanning &&
            !this.props.bluetooth.scanning &&
            this.props.bluetooth.devicesFound.length === 0 &&
            this.props.bluetooth.accessoryData.sensor_pid
        ) {
            // on BLE list page, trigger search
            this.toggleScanning(true);
        }
    }

    _togglePracticesAlertNotification = (userId, sensorId) => {
        Alert.alert(
            '',
            'Data found on this sensor, is it yours?',
            [
                {
                    text:    'No',
                    onPress: () => {
                        return bleUtils.deleteAllSingleSensorPractices(sensorId)
                            .then(() => this.props.postUserSensorData(userId))
                            .then(res => {
                                if (this.props.bluetooth.accessoryData && !this.props.bluetooth.accessoryData.sensor_pid) {
                                    this.refs.toast.show(res, (DURATION.LENGTH_SHORT * 2));
                                }
                                this.setState({ index: 3 });
                                this.pages.progress = 3;
                                this.props.stopConnect();
                                BleManager.disconnect(sensorId)
                                return this.props.checkState();
                            })
                            .catch(err => {
                                if (this.props.bluetooth.accessoryData && !this.props.bluetooth.accessoryData.sensor_pid) {
                                    this.refs.toast.show(err, (DURATION.LENGTH_SHORT * 2));
                                }
                                this.setState({ index: 3 });
                                this.pages.progress = 3;
                                this.props.stopConnect();
                                BleManager.disconnect(sensorId)
                                return this.props.checkState();
                            });
                    },
                    style: 'cancel',
                },
                {
                    text:    'Yes',
                    onPress: () => {
                        return this.props.postUserSensorData(userId)
                            .then(() => BleManager.disconnect(sensorId))
                            .catch(err => BleManager.disconnect(sensorId))
                            .then(() => {
                                if (this.props.bluetooth.accessoryData && !this.props.bluetooth.accessoryData.sensor_pid) {
                                    this.refs.toast.show('Failed to PAIR to sensor', (DURATION.LENGTH_SHORT * 2));
                                }
                                this.setState({ index: 3 });
                                this.pages.progress = 3;
                                this.props.stopConnect();
                                return this.props.checkState();
                            });
                    }
                },
            ],
            { cancelable: false }
        );
    }

    render = () => (
        <View style={{ backgroundColor: '#FFFFFF', flex: 1, }} onLayout={this._onLayoutDidChange}>
            <Pages
                indicatorPosition={'none'}
                ref={(pages) => { this.pages = pages; }}
                startPlay={this.state.index}
            >

                <View
                    style={[AppStyles.containerCentered, AppStyles.paddingHorizontalSml, { flex: 1, flexDirection: 'column', justifyContent: 'space-between', paddingTop: AppSizes.paddingSml }]}
                >
                    <NavBar
                        backButtonColor={AppColors.black}
                        onBackPress={() => Actions.pop()}
                        title={'PAIR YOUR KIT'}
                        titleColor={AppColors.black}
                        wrapperStyle={{flex: 1,}}
                    />
                    <Coach
                        text={coachDiscoverabilityInstruction}
                    />
                    <View style={[AppStyles.containerCentered, AppStyles.padding, {flex: 6,}]}>
                        <Image
                            resizeMode={'contain'}
                            source={require('../../../assets/images/standard/kit-activation-1-sensor.png')}
                            style={{flex: 1, width: AppSizes.screen.widthFourFifths}}
                        />
                        <Text robotoBold style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(20)}]}>{accessoryDiscoverabilityInstruction}</Text>
                    </View>
                    <View style={{flex: 1,}}>
                        <Button
                            backgroundColor={AppColors.primary.yellow.hundredPercent}
                            buttonStyle={{borderRadius: 0, height: '100%', width: AppSizes.screen.width}}
                            color={AppColors.white}
                            fontFamily={AppStyles.robotoBold.fontFamily}
                            fontWeight={AppStyles.robotoBold.fontWeight}
                            onPress={() => {
                                this.setState(
                                    { index: 1 },
                                    () => {
                                        this.pages.progress = 1;
                                        return this.props.checkState()
                                            .then(() => this.toggleScanning(true));
                                    }
                                );
                            }}
                            raised={false}
                            textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                            title={'Next Step'}
                        />
                    </View>
                </View>

                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <Text robotoRegular style={[AppStyles.paddingHorizontal, {color: AppColors.primary.grey.hundredPercent, fontSize: AppFonts.scaleFont(16),}]}>{'START BLUETOOTH SCAN'}</Text>
                    <TabIcon
                        containerStyle={[{ alignSelf: 'center', backgroundColor: AppColors.primary.yellow.hundredPercent }]}
                        icon={'bluetooth'}
                        iconStyle={[{color: AppColors.white}]}
                        onPress={() => {
                            this.setState(
                                { index: 2 },
                                () => {
                                    this.pages.progress = 2;
                                    return this._startBluetooth()
                                        .then(() => this.toggleScanning(true));
                                }
                            );

                        }}
                        raised
                        reverse
                        size={30}
                    />
                </View>

                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', paddingTop: AppSizes.paddingSml }}>
                    <NavBar
                        backButtonColor={AppColors.black}
                        onBackPress={() =>  {
                            this.toggleScanning(false);
                            this.setState({ index: 0 });
                            this.pages.progress = 0;
                        }}
                        title={'PAIR YOUR KIT'}
                        titleColor={AppColors.black}
                        wrapperStyle={[AppStyles.paddingHorizontalSml, {flex: 1,}]}
                    />
                    <View style={[AppStyles.paddingLrg, {flex: 1,}]}>
                        <Text robotoBold style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(20)}]}>{sensorListTitle}</Text>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalSml, {fontSize: AppFonts.scaleFont(15)}]}>{sensorListSubtitle}</Text>
                    </View>
                    <View style={[AppStyles.paddingTopSml, {flex: 7,}]}>
                        <Toast
                            position={'top'}
                            ref={'toast'}
                        />
                        <View style={[AppStyles.paddingSml, {alignItems: 'center', flexDirection: 'row',}]}>
                            <Text oswaldRegular style={[AppStyles.paddingHorizontalSml, {color: AppColors.primary.grey.hundredPercent, fontSize: AppFonts.scaleFont(12), textAlignVertical: 'center',}]}>{'AVAILABLE DEVICES'}</Text>
                            { this.props.bluetooth.scanning ?
                                <ActivityIndicator
                                    animating={true}
                                    color={AppColors.primary.yellow.hundredPercent}
                                    size={'small'}
                                />
                                :
                                null
                            }
                        </View>
                        <ScrollView
                            contentContainerStyle={{flex: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border,}}
                            refreshControl={
                                <RefreshControl
                                    colors={[AppColors.primary.yellow.hundredPercent]}
                                    onRefresh={() => this.toggleScanning(true)}
                                    refreshing={false}
                                    title={'Refreshing...'}
                                    titleColor={AppColors.primary.yellow.hundredPercent}
                                    tintColor={AppColors.primary.yellow.hundredPercent}
                                />
                            }
                        >
                            { this.props.bluetooth.devicesFound.length > 0 || this.props.bluetooth.scanning ?
                                <View style={this.props.bluetooth.devicesFound.length > 0 ? {} : [AppStyles.containerCentered, {flex: 1}]}>
                                    { this.props.bluetooth.devicesFound.map(device => {
                                        return <ListItem
                                            containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding}}
                                            hideChevron
                                            key={device.id}
                                            onPress={() => {
                                                this.toggleScanning(false);
                                                return this.props.startConnect(device).then(() => this.connect(device))
                                            }}
                                            title={device.name.replace('fathomS*_','')}
                                            titleStyle={{color: AppColors.black, fontSize: AppFonts.scaleFont(15), fontFamily: 'Roboto', fontWeight: '400', }}
                                        />
                                    })}
                                </View>
                                : this.props.bluetooth.devicesFound.length === 0 && !this.props.bluetooth.scanning ?
                                    <View style={[AppStyles.containerCentered, {flex: 1}]}>
                                        <Button
                                            backgroundColor={AppColors.primary.yellow.hundredPercent}
                                            buttonStyle={{borderRadius: 3}}
                                            color={AppColors.white}
                                            fontFamily={AppStyles.robotoBold.fontFamily}
                                            fontWeight={AppStyles.robotoBold.fontWeight}
                                            onPress={() => {
                                                return this.props.checkState()
                                                    .then(() => this.toggleScanning(true));
                                            }}
                                            raised={false}
                                            textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                                            title={'SCAN AGAIN'}
                                        />
                                    </View>
                                    :
                                    null
                            }
                        </ScrollView>
                    </View>
                    <View style={[AppStyles.containerCentered, {flex: 1}]}>
                        <Button
                            backgroundColor={AppColors.white}
                            buttonStyle={{borderRadius: 0, flex: 1, width: AppSizes.screen.width}}
                            color={AppColors.primary.yellow.hundredPercent}
                            fontFamily={AppStyles.robotoBold.fontFamily}
                            fontWeight={AppStyles.robotoBold.fontWeight}
                            onPress={() => {
                                this.toggleScanning(false);
                                this.setState({ index: 0 });
                                this.pages.progress = 0;
                                return this.props.checkState();
                            }}
                            raised={false}
                            textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                            title={'I don\'t see my sensor\'s serial number'}
                        />
                    </View>
                </View>

                <View style={[AppStyles.paddingMed, {backgroundColor: AppColors.primary.yellow.hundredPercent, flex: 1}]}>
                    <TabIcon
                        containerStyle={[{alignSelf: 'flex-end', paddingTop: 20,}]}
                        icon={'close'}
                        iconStyle={[{color: AppColors.white}]}
                        onPress={() => Actions.settings()}
                        type={'material-community'}
                        size={30}
                    />
                    <View style={[AppStyles.containerCentered, {flex: 1}]}>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20),}}>{successfullyConnected[0]}</Text>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20),}}>{successfullyConnected[1]}</Text>
                    </View>
                </View>

            </Pages>
            <Modal
                backdropPressToClose={false}
                coverScreen={true}
                isOpen={this.state.isAlertModalOpen}
                swipeToClose={false}
            >
                <View style={{backgroundColor: AppColors.black, flex: 1}}></View>
            </Modal>
        </View>
    );
}

/* Export Component ==================================================================== */
export default BluetoothConnectView;
