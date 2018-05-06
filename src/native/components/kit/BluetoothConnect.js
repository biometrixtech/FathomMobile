/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:33 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-05-05 21:44:34
 */

/**
 * Bluetooth Connect Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    ScrollView,
    View,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    ActivityIndicator
} from 'react-native';
import { Icon } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';
import { Actions } from 'react-native-router-flux';
import Toast, { DURATION } from 'react-native-easy-toast';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

// Consts and Libs
import { AppStyles, AppSizes } from '../../theme/';
import { Roles, BLEConfig, AppColors } from '../../../constants/';

// Components
import { Spacer, Button, FormLabel, Text, ListItem, Pages } from '../custom/';
import { Placeholder } from '../general/';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const accessoryDiscoverabilityInstruction = 'press & hold buttons simultaneously until the Bluetooth light breathes blue';
const successfullyConnected = ['Your kit is connected!', 'Ensure the bluetooth light on the accessory is green, then to assigning this kit to an athlete and connect it to a WiFi network by clicking the back button to return to the main menu.'];

/* Component ==================================================================== */
class BluetoothConnectView extends Component {
    static componentName = 'BluetoothConnectView';

    static propTypes = {
        user:               PropTypes.shape({}),
        bluetooth:          PropTypes.shape({}),
        connectToAccessory: PropTypes.func.isRequired,
        checkState:         PropTypes.func.isRequired,
        changeState:        PropTypes.func.isRequired,
        startBluetooth:     PropTypes.func.isRequired,
        enableBluetooth:    PropTypes.func.isRequired,
        startScan:          PropTypes.func.isRequired,
        stopScan:           PropTypes.func.isRequired,
        deviceFound:        PropTypes.func.isRequired,
        startConnect:       PropTypes.func.isRequired,
        stopConnect:        PropTypes.func.isRequired,
        disconnect:         PropTypes.func.isRequired,
        loginToAccessory:   PropTypes.func.isRequired,
        getOwnerFlag:       PropTypes.func.isRequired,
        getAccessoryKey:    PropTypes.func.isRequired,
        getWifiMacAddress:  PropTypes.func.isRequired,
    }

    static defaultProps = {
        user:      {},
        bluetooth: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            index:       0,
            isCollapsed: true,
            size:        {},
            data:        null
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
        return data.name && /Fathom_kit_/i.test(data.name) ? this.props.deviceFound(data) : null;
    }

    handleBleStateChange = (data) => {
        if (data.state === 'off') {
            if (this.pages && this.pages.progress > 1) {
                this.setState({ index: 1 });
                this.pages.progress = 1;
            } else if (!this.pages) {
                return Promise.resolve(this.props.changeState(data.state))
                    .then(() => Actions.kitManagement());
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
            .catch(err => {
                console.log(err);
                return this.props.connectToAccessory(data);
            })
            .catch(err => this.props.stopConnect())
            .then(() => this.props.getWifiMacAddress(this.props.bluetooth.accessoryData.id))
            .catch(err => {
                console.log(err);
                return this.props.getWifiMacAddress(this.props.bluetooth.accessoryData.id);
            })
            .then(() => this.props.getAccessoryKey(this.props.bluetooth.accessoryData.wifiMacAddress, this.props.user))
            .catch(err => {
                console.log(err);
                return this.props.getAccessoryKey(this.props.bluetooth.accessoryData.wifiMacAddress, this.props.user);
            })
            .then(() => this.props.loginToAccessory(this.props.bluetooth.accessoryData))
            .catch((err) => {
                console.log(err);
                return this.props.loginToAccessory(this.props.bluetooth.accessoryData);
            })
            .then(() => {
                return !this.props.bluetooth.accessoryData.id ? Promise.resolve() : this.props.getOwnerFlag(this.props.bluetooth.accessoryData.id);
            })
            .then(() => {
                if (Object.keys(this.props.bluetooth.accessoryData).length === 0 && this.props.bluetooth.accessoryData.constructor === Object) {
                    this.refs.toast.show('Failed to connect to kit', DURATION.LENGTH_LONG);
                } else {
                    this.setState({ index: 3 });
                    this.pages.progress = 3;
                }
                return this.props.stopConnect();
            })
            .catch((err) => {
                console.log(err);
                if (Object.keys(this.props.bluetooth.accessoryData).length === 0 && this.props.bluetooth.accessoryData.constructor === Object) {
                    this.refs.toast.show('Failed to connect to kit', DURATION.LENGTH_LONG);
                } else {
                    this.setState({ index: 3 });
                    this.pages.progress = 3;
                }
                return this.props.stopConnect();
            })
            .catch((err) => this.props.stopConnect());
    }

    _onLayoutDidChange = (e) => {
        const layout = e.nativeEvent.layout;
        this.setState({ size: { width: layout.width, height: layout.height } });
    }

    adminView = () => (
        <Placeholder />
    );

    athleteView = () => (
        <Placeholder />
    );

    biometrixAdminView = () => (
        <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange}>
            <View style={{ alignItems: 'center', backgroundColor: AppColors.secondary.light_blue.seventyPercent }}>
                <Spacer size={25}/>
                <Text h1>
                    {
                        this.state.index === 0 ? 'Activate Kit' : this.state.index === 1 ? 'Turn on Bluetooth' : this.state.index === 2 ? 'Scan for Kit' : 'Connected'
                    }
                </Text>
                <Spacer size={50}/>
            </View>
            <Pages
                ref={(pages) => { this.pages = pages; }}
                startPlay={this.state.index}
                containerStyle={{
                    position:        'absolute',
                    elevation:       10,
                    bottom:          15,
                    backgroundColor: '#FFFFFF',
                    alignSelf:       'center',
                    shadowOffset:    { width: 1, height: 3 },
                    shadowOpacity:   0.7,
                    shadowRadius:    2,
                    width:           AppSizes.screen.widthFourFifths,
                    height:          AppSizes.screen.heightThreeQuarters
                }}
                indicatorColor={AppColors.secondary.blue.hundredPercent}
            >
                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <View style={{ flex: 1 }} />
                    <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                        <Image style={{resizeMode: 'contain', width: 400, height: 400}} source={require('../../../assets/images/kit-activation.png')}/>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormLabel labelStyle={[AppStyles.h4]} >
                            { accessoryDiscoverabilityInstruction }
                        </FormLabel>
                        <Spacer />
                        <Button
                            title={'Next'}
                            onPress={() => {
                                this.setState({ index: 1 });
                                this.pages.progress = 1;
                                return this.props.checkState();
                            }}
                            raised
                        />
                    </View>
                    <View style={{ flex: 1 }} />
                </View>


                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 1 }} >
                        <Icon name="bluetooth" containerStyle={{ alignSelf: 'center' }} size={30} color={AppColors.secondary.blue.hundredPercent} reverse onPress={() => this.startBluetooth()} raised />
                    </View>
                    <View style={{ flex: 1 }} />
                </View>


                <View style={{ flex: 1 }}>
                    <View style={[AppStyles.containerCentered, { flex: 3 }]}>
                        <Button
                            title={this.props.bluetooth.scanning ? 'Stop Scan' : 'Start Scan'}
                            icon={{ name: `${this.props.bluetooth.scanning ? 'stop' : 'play-arrow'}` }}
                            buttonStyle={{ backgroundColor: `${this.props.bluetooth.scanning ? AppColors.secondary.red.hundredPercent : AppColors.secondary.blue.hundredPercent}` }}
                            onPress={() => this.toggleScanning(!this.props.bluetooth.scanning)}
                            raised
                        />
                        <Spacer size={5}/>
                        <Text style={{ color: AppColors.primary.yellow.hundredPercent }} onPress={() => this.setState({ isCollapsed: !this.state.isCollapsed })}>{'Can\'t find your device?'}</Text>
                        <Spacer size={5}/>
                        <Collapsible collapsed={this.state.isCollapsed} >
                            <FormLabel labelStyle={[AppStyles.h4]} >
                                { `${accessoryDiscoverabilityInstruction}. Then rescan.` }
                            </FormLabel>
                        </Collapsible>
                    </View>
                    <Spacer />
                    <View style={{ flex: 4 }}>
                        <Toast 
                            ref={'toast'}
                            position={'top'}
                        />
                        <ScrollView>
                            {
                                this.props.bluetooth.devicesFound.map(device => {
                                    return <ListItem
                                        key={device.id}
                                        title={device.name}
                                        onPress={() => this.props.startConnect(device).then(() => this.connect(device))}
                                        titleContainerStyle={{ alignSelf: 'center' }}
                                        hideChevron
                                    />
                                })
                            }
                        </ScrollView>
                    </View>
                    <View style={{ flex: 1 }}/>
                    { this.props.bluetooth.indicator ? 
                        <ActivityIndicator
                            style={[AppStyles.activityIndicator]}
                            size={'large'}
                            color={'#C1C5C8'}
                        /> : null
                    }
                </View>

                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <View style={{ flex: 1 }}/>
                    <View style={{ flex: 1 }}>
                        <Text h2>{successfullyConnected[0]}</Text>
                    </View>
                    <Icon containerStyle={{ flex: 1 }} name={'checkbox-marked-circle'} type={'material-community'} color={AppColors.primary.yellow.hundredPercent} size={100}/>
                    <Spacer />
                    <View style={[AppStyles.containerCentered, { flex: 1, paddingLeft: 25, paddingRight: 25 }]}>
                        <Text>{successfullyConnected[1]}</Text>
                    </View>
                    <View style={{ flex: 1 }}/>
                </View>
            </Pages>
        </View>
    );

    managerView = () => (
        <Placeholder />
    );

    researcherView = () => (
        <Placeholder />
    );

    render = () => {
        return this.props.user.role ? this.biometrixAdminView() : <Placeholder />;
        // switch(this.props.user.role) {
        // case Roles.admin:
        //     return this.adminView();
        // case Roles.athlete:
        //     return this.athleteView();
        // case Roles.biometrixAdmin:
        //     return this.biometrixAdminView();
        // case Roles.superAdmin:
        //     return this.biometrixAdminView();
        // case Roles.manager:
        //     return this.biometrixAdminView();
        // case Roles.researcher:
        //     return this.researcherView();
        // default:
        //     return <Placeholder />;
        // }
    }
}

/* Export Component ==================================================================== */
export default BluetoothConnectView;
