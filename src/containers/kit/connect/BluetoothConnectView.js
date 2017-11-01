/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:33 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-25 22:49:28
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
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { Icon } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';
import { Actions } from 'react-native-router-flux';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { Roles, BLEConfig } from '@constants/';

// Components
import { Spacer, Button, FormLabel, Text, ListItem, Pages } from '@ui/';
import { Placeholder } from '@general/';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const accessoryDiscoverabilityInstruction = 'press & hold buttons simultaneously until the Bluetooth light breathes blue';
const successfullyConnected = ['Your kit is connected!', 'Ensure the bluetooth light on the accessory is green, then to assigning this kit to an athlete and connect it to a WiFi network by clicking the back button to return to the main menu.'];

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    indicator: {
        position: 'absolute',
        left:     0,
        right:    0,
        bottom:   0,
        top:      0,
    }
});

/* Component ==================================================================== */
class BluetoothConnectView extends Component {
    static componentName = 'BluetoothConnectView';

    static propTypes = {
        user:                      PropTypes.object,
        bluetooth:                 PropTypes.object,
        connectToAccessory:        PropTypes.func.isRequired,
        checkState:                PropTypes.func.isRequired,
        changeState:               PropTypes.func.isRequired,
        startBluetooth:            PropTypes.func.isRequired,
        enableBluetooth:           PropTypes.func.isRequired,
        startScan:                 PropTypes.func.isRequired,
        stopScan:                  PropTypes.func.isRequired,
        deviceFound:               PropTypes.func.isRequired,
        startConnect:              PropTypes.func.isRequired,
        stopConnect:               PropTypes.func.isRequired,
        disconnect:                PropTypes.func.isRequired,
        loginToAccessory:          PropTypes.func.isRequired,
        setKitTime:                PropTypes.func.isRequired,
        getConfiguration:          PropTypes.func.isRequired,
        storeParams:               PropTypes.func.isRequired,
        setAccessoryLoginEmail:    PropTypes.func.isRequired,
        setAccessoryLoginPassword: PropTypes.func.isRequired
    }

    static defaultProps = {
        user: {},
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
                // this.pages.scrollToPage(1);
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
                // this.pages.scrollToPage(1);
                this.pages.progress = 1;
            } else if (!this.pages) {
                return Promise.resolve(this.props.changeState(data.state))
                    .then(() => Actions.kitManagement());
            }
        } else if (data.state === 'on' && this.pages && this.pages.progress === 1) {
            this.startBluetooth();
            this.setState({ index: 2 });
            // this.pages.scrollToPage(2);
            this.pages.progress = 2;
        }
        return this.props.changeState(data.state);
    }

    connect = (data) => {
        return this.props.stopScan()
            .then(() => this.props.connectToAccessory(data))
            .catch((err) => {
                console.log(err);
                return this.props.connectToAccessory(data);
            })
            .catch((err) => this.props.stopConnect())
            .then(() => this.props.loginToAccessory(this.props.bluetooth.accessoryData, this.props.user))
            .catch((err) => {
                console.log(err);
                return this.props.loginToAccessory(this.props.bluetooth.accessoryData, this.props.user);
            })
            .catch((err) => this.props.stopConnect())
            .then(() => this.props.setKitTime(this.props.bluetooth.accessoryData.id))
            .catch((err) => {
                console.log(err);
                return this.props.setKitTime(this.props.bluetooth.accessoryData.id);
            })
            .then(() => this.props.setAccessoryLoginEmail(this.props.bluetooth.accessoryData.id, this.props.user.email))
            .catch((err) => {
                console.log(err);
                return this.props.setAccessoryLoginEmail(this.props.bluetooth.accessoryData.id, this.props.user.email);
            })
            .then(() => this.props.setAccessoryLoginPassword(this.props.bluetooth.accessoryData.id, this.props.user.password))
            .catch((err) => {
                console.log(err);
                return this.props.setAccessoryLoginPassword(this.props.bluetooth.accessoryData.id, this.props.user.password);
            })
            .then(() => this.props.storeParams(this.props.bluetooth.accessoryData))
            .catch((err) => {
                console.log(err);
                return this.props.storeParams(this.props.bluetooth.accessoryData);
            })
            .then(() => this.props.getConfiguration(this.props.bluetooth.accessoryData.id))
            .catch((err) => {
                console.log(err);
                return this.props.getConfiguration(this.props.bluetooth.accessoryData.id);
            })
            .then(() => {
                console.log('success');
                // this.pages.scrollToPage(3);
                this.setState({ index: 3 });
                this.pages.progress = 3;
                return this.props.stopConnect();
            })
            .catch((err) => {
                console.log(err);
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
            <View style={{ alignItems: 'center', backgroundColor: AppColors.brand.light }}>
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
                indicatorColor={AppColors.brand.blue}
            >
                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <View style={{ flex: 1 }} />
                    <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                        <Image style={{resizeMode: 'contain', width: 400, height: 400}} source={require('@images/kit_activation.png')}/>
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
                                // this.pages.scrollToPage(1);
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
                        <Icon name="bluetooth" containerStyle={{ alignSelf: 'center' }} size={30} color={AppColors.brand.primary} reverse onPress={() => this.startBluetooth()} raised />
                    </View>
                    <View style={{ flex: 1 }} />
                </View>


                <View style={{ flex: 1 }}>
                    { this.props.bluetooth.indicator ? 
                        <View style={[styles.indicator, { justifyContent: 'center', alignItems: 'center'}]}>
                            <ActivityIndicator
                                animating={true}
                                size={'large'}
                                color={'#C1C5C8'}
                            />
                        </View> : null
                    }
                    <View style={[AppStyles.containerCentered, { flex: 3 }]}>
                        <Button
                            title={this.props.bluetooth.scanning ? 'Stop Scan' : 'Start Scan'}
                            icon={{ name: `${this.props.bluetooth.scanning ? 'stop' : 'play-arrow'}` }}
                            buttonStyle={{ backgroundColor: `${this.props.bluetooth.scanning ? AppColors.brand.red : AppColors.brand.primary}` }}
                            onPress={() => this.toggleScanning(!this.props.bluetooth.scanning)}
                            raised
                        />
                        <Spacer size={5}/>
                        <Text style={{ color: AppColors.brand.yellow }} onPress={() => this.setState({ isCollapsed: !this.state.isCollapsed })}>{'Can\'t find your device?'}</Text>
                        <Spacer size={5}/>
                        <Collapsible collapsed={this.state.isCollapsed} >
                            <FormLabel labelStyle={[AppStyles.h4]} >
                                { `${accessoryDiscoverabilityInstruction}. Then rescan.` }
                            </FormLabel>
                        </Collapsible>
                    </View>
                    <Spacer />
                    <View style={{ flex: 4 }}>
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
                </View>

                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <View style={{ flex: 1 }}/>
                    <View style={{ flex: 1 }}>
                        <Text h2>{successfullyConnected[0]}</Text>
                    </View>
                    <Icon containerStyle={{ flex: 1 }} name={'checkbox-marked-circle'} type={'material-community'} color={AppColors.brand.yellow} size={100}/>
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
