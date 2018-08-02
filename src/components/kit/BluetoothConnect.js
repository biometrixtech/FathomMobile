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
import Collapsible from 'react-native-collapsible';
import LinearGradient from 'react-native-linear-gradient';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Modal from 'react-native-modalbox';
import Toast, { DURATION } from 'react-native-easy-toast';

// Consts and Libs
import { Roles, BLEConfig, AppColors, AppStyles, AppSizes } from '../../constants';

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
                containerStyle={[{alignSelf: 'flex-end'}]}
                icon={'ios-arrow-back'}
                iconStyle={[{color: backButtonColor || AppColors.white}]}
                onPress={onBackPress}
                reverse={false}
                size={34}
                type={'ionicon'}
            />
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 8,}}>
            <Text style={[AppStyles.h3, {color: titleColor || AppColors.white, fontWeight: 'bold',}]}>{title}</Text>
        </View>
        <View style={{justifyContent: 'center', flex: 1,}}></View>
    </View>
);

class BluetoothConnectView extends Component {
    static componentName = 'BluetoothConnectView';

    static propTypes = {
        bluetooth:                     PropTypes.shape({}),
        changeState:                   PropTypes.func.isRequired,
        checkState:                    PropTypes.func.isRequired,
        connectToAccessory:            PropTypes.func.isRequired,
        deviceFound:                   PropTypes.func.isRequired,
        disconnect:                    PropTypes.func.isRequired,
        enableBluetooth:               PropTypes.func.isRequired,
        getAccessoryKey:               PropTypes.func.isRequired,
        getOwnerFlag:                  PropTypes.func.isRequired,
        getSingleSensorSavedPractices: PropTypes.func.isRequired,
        getUserSensorData:             PropTypes.func.isRequired,
        getWifiMacAddress:             PropTypes.func.isRequired,
        loginToAccessory:              PropTypes.func.isRequired,
        postUserSensorData:            PropTypes.func.isRequired,
        setKitTime:                    PropTypes.func.isRequired,
        startBluetooth:                PropTypes.func.isRequired,
        startConnect:                  PropTypes.func.isRequired,
        startScan:                     PropTypes.func.isRequired,
        stopConnect:                   PropTypes.func.isRequired,
        stopScan:                      PropTypes.func.isRequired,
        user:                          PropTypes.shape({}),
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
    }

    componentWillUnmount = () => {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerState.remove();
        this.pages = null;
    }

    startBluetooth = () => {
        return this.props.startBluetooth()
            .then(() => {
                this.props.checkState();
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
                            return navigator.geolocation.getCurrentPosition((position) => this.props.enableBluetooth(), error => console.log(error), { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
                        })
                        .catch((error) => {
                            console.log(error.message);
                            return Promise.reject(error);
                        });
                }
                return Promise.resolve();
            })
            .catch(error => {
                this.setState({ index: 1 });
                this.pages.progress = 1;
            });
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
            this.startBluetooth();
            this.setState({ index: 2 });
            this.pages.progress = 2;
        }
        return this.props.changeState(data.state);
    }

    connect = (data) => {
        return this.props.stopScan()
            .then(() => this.props.connectToAccessory(data))
            .catch(err => this.props.connectToAccessory(data))
            .catch(err => this.props.stopConnect())
            .then(() => {
                this._toggleAlertNotification();
                return this.props.stopConnect();
            })
            .catch(err => {
                console.log('err in BluetoothConnect #4',err);
                if (this.props.bluetooth.accessoryData && !this.props.bluetooth.accessoryData.sensor_pid) {
                    this.refs.toast.show('Failed to connect to kit', DURATION.LENGTH_LONG);
                }
                return this.props.stopConnect();
            });
    }

    _onLayoutDidChange = (e) => {
        const layout = e.nativeEvent.layout;
        this.setState({ size: { width: layout.width, height: layout.height } });
    }

    _toggleAlertNotification() {
        Alert.alert(
            '',
            'Did your sensor\'s light blink green?',
            [
                {
                    text:    'No',
                    onPress: () => {
                        this.setState({ index: 0 });
                        this.pages.progress = 0;
                        return this.props.checkState();
                    },
                    style: 'cancel',
                },
                {
                    text:    'Yes',
                    onPress: () => {
                        return this.props.postUserSensorData()
                            .then(() => {
                                if (this.props.bluetooth.accessoryData && !this.props.bluetooth.accessoryData.sensor_pid) {
                                    this.refs.toast.show('Failed to connect to kit', DURATION.LENGTH_LONG);
                                }
                                this.setState({ index: 3 });
                                this.pages.progress = 3;
                                return this.props.checkState();
                            });
                    }
                },
            ],
            { cancelable: false }
        )
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

    render = () => (
        <View style={{ backgroundColor: '#FFFFFF', flex: 1, }} onLayout={this._onLayoutDidChange}>
            <Pages
                indicatorPosition={'none'}
                ref={(pages) => { this.pages = pages; }}
                startPlay={this.state.index}
            >

                <LinearGradient
                    colors={[AppColors.gradient.light_blue.gradientStart, AppColors.gradient.light_blue.gradientEnd]}
                    style={[AppStyles.containerCentered, AppStyles.paddingHorizontalSml, { flex: 1, flexDirection: 'column', justifyContent: 'space-between', paddingTop: AppSizes.paddingSml }]}
                >
                    <NavBar
                        onBackPress={() => Actions.pop()}
                        title={'PAIR YOUR KIT'}
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
                        <FormLabel labelStyle={[AppStyles.h3, AppStyles.textCenterAligned, {fontWeight: 'bold'}]}>{accessoryDiscoverabilityInstruction}</FormLabel>
                    </View>
                    <View style={{flex: 1,}}>
                        <Button
                            backgroundColor={AppColors.primary.yellow.hundredPercent}
                            buttonStyle={{borderRadius: 0, height: '100%', width: AppSizes.screen.width}}
                            onPress={() => {
                                this.setState({ index: 1 });
                                this.pages.progress = 1;
                                return this.props.checkState()
                                    .then(() => this.startBluetooth())
                                    .then(() => this.toggleScanning(true));
                            }}
                            raised={false}
                            title={'Next Step'}
                        />
                    </View>
                </LinearGradient>

                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <Text p style={[AppStyles.paddingHorizontal, {color: AppColors.primary.grey.hundredPercent}]}>{'START BLUETOOTH SCAN'}</Text>
                    <TabIcon
                        containerStyle={[{ alignSelf: 'center', backgroundColor: AppColors.primary.yellow.hundredPercent }]}
                        icon={'bluetooth'}
                        iconStyle={[{color: AppColors.white}]}
                        onPress={() => {
                            this.startBluetooth().then(() => this.toggleScanning(true));
                            this.setState({ index: 2 });
                            this.pages.progress = 2;
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
                    />
                    <View style={[AppStyles.paddingLrg, {flex: 1,}]}>
                        <Text h3 style={[AppStyles.textCenterAligned, {fontWeight: 'bold'}]}>{sensorListTitle}</Text>
                        <Text p style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalSml]}>{sensorListSubtitle}</Text>
                    </View>
                    <View style={[AppStyles.paddingTopSml, {flex: 7,}]}>
                        <Toast
                            position={'top'}
                            ref={'toast'}
                        />
                        <View style={[AppStyles.paddingSml, {alignItems: 'center', flexDirection: 'row',}]}>
                            <Text p style={[AppStyles.paddingHorizontalSml, {color: AppColors.primary.grey.hundredPercent, fontWeight: 'bold', textAlignVertical: 'center',}]}>{'AVAILABLE DEVICES'}</Text>
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
                                    onRefresh={() => this.startBluetooth().then(() => this.toggleScanning(true))}
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
                                            titleStyle={{color: AppColors.black}}
                                        />
                                    })}
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
                            onPress={() => {
                                this.toggleScanning(false);
                                this.setState({ index: 0 });
                                this.pages.progress = 0;
                                return this.props.checkState();
                            }}
                            raised={false}
                            textColor={AppColors.primary.yellow.hundredPercent}
                            title={'I don\'t see my sensor\'s serial number'}
                        />
                    </View>
                </View>

                <View style={[AppStyles.paddingMed, {backgroundColor: AppColors.primary.yellow.hundredPercent, flex: 1}]}>
                    <TabIcon
                        containerStyle={[{alignSelf: 'flex-end'}]}
                        icon={'close'}
                        iconStyle={[{color: AppColors.white}]}
                        onPress={() => Actions.settings()}
                        type={'material-community'}
                        size={30}
                    />
                    <View style={[AppStyles.containerCentered, {flex: 1}]}>
                        <Text h3 style={{color: AppColors.white, fontWeight: 'bold'}}>{successfullyConnected[0]}</Text>
                        <Text h3 style={{color: AppColors.white, fontWeight: 'bold'}}>{successfullyConnected[1]}</Text>
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
