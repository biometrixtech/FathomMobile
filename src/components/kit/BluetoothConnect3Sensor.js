/**
 * BluetoothConnect3Sensor
 *
    <BluetoothConnect3Sensor
        assignKitIndividual={assignKitIndividual}
        bluetooth={bluetooth}
        deviceFound={deviceFound}
        getBLEMacAddress={getBLEMacAddress}
        getScannedWifiConnections={getScannedWifiConnections}
        getSingleWifiConnection={getSingleWifiConnection}
        network={network}
        startDisconnection={startDisconnection}
        startScan={startScan}
        stopConnect={stopConnect}
        stopScan={stopScan}
        updateUser={updateUser}
        user={user}
        writeWifiDetailsToSensor={writeWifiDetailsToSensor}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Alert, Keyboard, NativeEventEmitter, NativeModules, Platform, PermissionsAndroid, ScrollView, View, } from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, } from '../../constants';
import { AppUtil, } from '../../lib';
import { Button, FormInput, ListItem, Spacer, ProgressBar, Text, } from '../custom';
import { Loading, } from '../general';
import { store, } from '../../store';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import DialogInput from 'react-native-dialog-input';
import Toast, { DURATION } from 'react-native-easy-toast';
import WifiManager from 'react-native-wifi';

// setup consts
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

/* Component ==================================================================== */
const TopNav = ({ currentStep, title, totalSteps, }) => (
    <View style={{backgroundColor: AppColors.transparent,}}>
        <View style={{alignItems: 'center', flexDirection: 'row', height: AppSizes.navbarHeight, justifyContent: 'center', marginTop: AppSizes.statusBarHeight,}}>
            <View style={{flex: 1,}}>
                {/*<TabIcon
                    containerStyle={[{flex: 1,}]}
                    color={AppColors.zeplin.slateXLightSlate}
                    icon={workout.deleted ? 'add' : 'close'}
                    onPress={() => handleHealthDataFormChange(!workout.deleted)}
                    reverse={false}
                    size={30}
                    type={'material'}
                />*/}
            </View>
            <View style={{flex: 8,}}>
                <Text oswaldMedium style={{color: AppColors.black, fontSize: AppFonts.scaleFont(20), textAlign: 'center',}}>{title}</Text>
            </View>
            <View style={{flex: 1,}} />
        </View>
        <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
        />
    </View>
);

class BluetoothConnect3Sensor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableNetworks:     [],
            currentWifiConnection: false,
            loading:               false,
            pageIndex:             0,
            isDialogVisible:       false,
            isWifiScanDone:        false,
        };
        this._pages = {};
        this._timer = null;
        this.wifiTimers = [];
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
    }

    componentDidMount = () => {
        BleManager.start({ showAlert: false, });
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then(result => {
                if (result) {
                    console.log('Permission is OK');
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then(res => {
                        if(res) {
                            console.log('User accept');
                        } else {
                            console.log('User refuse');
                        }
                    });
                }
            });
        }
    }

    componentWillUnmount = () => {
        this._pages = null;
        this._timer = null;
        _.map(this.wifiTimers, (timer, i) => clearInterval(this.wifiTimers[i]));
        this.handlerDiscover.remove();
        this.handlerStop.remove();
    }

    _onPageScrollEnd = currentPage => {
        console.log('currentPage',currentPage);
        if(currentPage === 2) {
            this._handleBLEPair();
        } else if(currentPage === 5) {
            this._timer = _.delay(() => {
                this._handleWifiScan();
                // console.log(WifiManager);
                // WifiManager.getCurrentWifiSSID()
                //     .then(networkDetails => {
                //         let currentWifiConnectionObj = Platform.OS === 'android' ? JSON.parse(networkDetails) : networkDetails;
                //         currentWifiConnectionObj.password = '';
                //         this.setState({ currentWifiConnection: currentWifiConnectionObj, })
                //     })
                //     .catch(error => console.log('Cannot get current SSID!',error));
                // if(Platform.OS === 'android') {
                //     WifiManager.loadWifiList(
                //         list => this.setState(
                //             { availableNetworks: _.filter(JSON.parse(list), o => o.frequency < 2500 && (o.capabilities.includes('WPA2') || o.capabilities.includes('WPA') || o.capabilities.includes('WEP') || o.capabilities.includes('ESS'))), },
                //             () => console.log('wifi list', _.filter(JSON.parse(list), o => o.frequency < 2500 && (o.capabilities.includes('WPA2') || o.capabilities.includes('WPA') || o.capabilities.includes('WEP') || o.capabilities.includes('ESS'))))
                //         ),
                //         error => console.log('Cannot get current LIST!', error)
                //     );
                // }
            }, 500);
        }
    }

    _handleWifiScan = () => {
        const { bluetooth, getScannedWifiConnections, getSingleWifiConnection, } = this.props;
        this.setState({ availableNetworks: [], });
        getScannedWifiConnections(bluetooth.accessoryData.sensor_pid)
            .then(res => {
                if(res === 0) {
                    this.setState({ availableNetworks: [], isWifiScanDone: true, });
                }
                let index = 0;
                for(let i = 1; i <= res; i += 1) {
                    this.wifiTimers[i] = _.delay(() => {
                        getSingleWifiConnection(bluetooth.accessoryData.sensor_pid, i)
                            .then(response => {
                                let newAvailableNetworks = _.cloneDeep(this.state.availableNetworks);
                                newAvailableNetworks.push(response);
                                newAvailableNetworks = _.uniq(newAvailableNetworks);
                                this.setState({ availableNetworks: newAvailableNetworks, isWifiScanDone: true, });
                            })
                            .catch(error => console.log('error-i',error));
                    }, 500 * index);
                    index = index + 1;
                }
            })
            .catch(err => this.setState({ availableNetworks: [], isWifiScanDone: true, }, () => AppUtil.handleAPIErrorAlert(err)));
    }

    _handleBLEPair = () => {
        const { startScan, } = this.props;
        startScan(10);
    }

    handleDiscoverPeripheral = data => {
        const { deviceFound, } = this.props;
        if (data.advertising && data.advertising.kCBAdvDataLocalName) {
            data.name = data.advertising.kCBAdvDataLocalName;
        }
        return data.name && data.name === 'fathomKit' ? deviceFound(data).then(() => this.handleStopScan()) : null; // 3-sensor solution
        // return data.name && /fathomS[*]_/i.test(data.name) ? deviceFound(data) : null; // 1-sensor solution
    }

    handleStopScan = () => {
        const { bluetooth, stopScan, } = this.props;
        return stopScan()
            .then(() => {
                let closestDevice = _.orderBy(bluetooth.devicesFound, ['rssi'], ['desc']);
                if(closestDevice.length > 0) {
                    this._connect(closestDevice[0]);
                }
            });
    }

    _connect = data => {
        const { bluetooth, getBLEMacAddress, stopConnect, stopScan, user, } = this.props;
        stopScan()
            .then(() => getBLEMacAddress(data.id))
            .then(() => this._toggleAlertNotification(data.id, user.id))
            .catch(err => {
                console.log('err in BluetoothConnect #4',err);
                if (bluetooth.accessoryData && !bluetooth.accessoryData.sensor_pid) {
                    this.refs.toast.show('Failed to PAIR to sensor', (DURATION.LENGTH_SHORT * 2));
                }
                return stopConnect();
            });
    }

    _toggleAlertNotification = (sensorId, userId) => {
        const { stopConnect, } = this.props;
        Alert.alert(
            '',
            'Did the LED turn green?',
            [
                {
                    text:    'No',
                    onPress: () => {
                        this.setState({ pageIndex: 0 });
                        this._pages.progress = 0;
                        return stopConnect();
                    },
                    style: 'cancel',
                },
                {
                    text:    'Yes',
                    onPress: () => this._renderNextPage(),
                },
            ],
            { cancelable: false }
        );
    }

    _connectSensorToWifi = () => {
        Keyboard.dismiss();
        const { assignKitIndividual, bluetooth, startDisconnection, updateUser, user, writeWifiDetailsToSensor, } = this.props;
        const { currentWifiConnection, } = this.state;
        if(currentWifiConnection && currentWifiConnection.password && currentWifiConnection.ssid && bluetooth.accessoryData.sensor_pid && bluetooth.accessoryData.sensor_pid !== 'None') {
            let sensorId = bluetooth.accessoryData.sensor_pid;
            let ssid = currentWifiConnection.ssid;
            let password = currentWifiConnection.password;
            let securityByte = currentWifiConnection.security.toByte;
            writeWifiDetailsToSensor(sensorId, ssid, password, securityByte)
                .then(res => {
                    // setup variables
                    let newUserPayloadObj = {};
                    newUserPayloadObj.sensor_pid = bluetooth.accessoryData.sensor_pid;
                    newUserPayloadObj.mobile_udid = bluetooth.accessoryData.mobile_udid;
                    let newUserObj = _.cloneDeep(user);
                    newUserObj.sensor_pid = bluetooth.accessoryData.sensor_pid;
                    newUserObj.mobile_udid = bluetooth.accessoryData.mobile_udid;
                    // update reducer as API might take too long to return a value
                    store.dispatch({
                        type: DispatchActions.USER_REPLACE,
                        data: newUserObj
                    });
                    // send commands
                    updateUser(newUserPayloadObj, user.id) // 1. PATCH user specific endpoint
                        .then(() => assignKitIndividual({wifiMacAddress: bluetooth.accessoryData.wifiMacAddress,}, user)) // 2. PATCH hardware specific endpoint
                        .then(() => startDisconnection(sensorId, true)) // 3. disconnect from sensor
                        .then(() => this.setState({ loading: false, }, () => this._renderNextPage())); // 4. route to next page
                })
                .catch(err => AppUtil.handleAPIErrorAlert(err));
        } else {
            AppUtil.handleAPIErrorAlert('Please make sure to select the right details');
        }
    }

    _renderNextPage = () => {
        let nextPageIndex = (this.state.pageIndex + 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    _handleFormChange = (name, value) => {
        let newFormFields = _.update( this.state.currentWifiConnection, name, () => value);
        this.setState({ ['currentWifiConnection']: newFormFields, });
    }

    render = () => {
        const { bluetooth, } = this.props;
        const { availableNetworks, currentWifiConnection, pageIndex, isDialogVisible, isWifiScanDone, } = this.state;
        return(
            <View style={{flex: 1,}}>

                <Pages
                    containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                    indicatorPosition={'none'}
                    onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)}
                    ref={pages => { this._pages = pages; }}
                    scrollEnabled={false}
                    startPage={pageIndex}
                >

                    <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.splash, flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'Now Let\'s Pair Your Power Case!'}</Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                            onPress={() => this._renderNextPage()}
                            title={'Next'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>

                    <View style={{flex: 1,}}>
                        <TopNav
                            currentStep={1}
                            title={'PAIR YOU SENSORS'}
                            totalSteps={5}
                        />
                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(30), textAlign: 'center',}}>{'Hold The Button Until The LED Turns Blue'}</Text>
                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}>
                            {'Note: Once connected, your sensors will only sync with '}
                            <Text robotoRegular style={{fontStyle: 'italic',}}>{'this user account.'}</Text>
                        </Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                            onPress={() => this._renderNextPage()}
                            title={'Next'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>

                    <View style={{flex: 1,}}>
                        <TopNav
                            currentStep={2}
                            title={'PAIR YOU SENSORS'}
                            totalSteps={5}
                        />
                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(30), textAlign: 'center',}}>{'Touch Your Phone To The Base to Pair'}</Text>
                        { bluetooth.devicesFound && bluetooth.devicesFound.length > 0 &&
                            _.map(bluetooth.devicesFound, (data, i) =>
                                <Text key={i} onPress={() => this._connect(data)}>{`${data.name} ${data.id} ${data.rssi}`}</Text>
                            )
                        }
                    </View>

                    <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.splash, flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'Pairing successful!'}</Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                            onPress={() => this._renderNextPage()}
                            title={'Next'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>

                    <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.splash, flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'Now let\'s connect wifi.'}</Text>
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'Your sensors will need wifi to upload data after training. On the next screen add your home network and any wifi networks you typically use right after training.'}</Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                            onPress={() => this._renderNextPage()}
                            title={'Next'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>

                    <View style={{flex: 1,}}>
                        <TopNav
                            currentStep={3}
                            title={'CONFIGURE WIFI'}
                            totalSteps={5}
                        />
                        {/* currentWifiConnection && currentWifiConnection.ssid &&
                            <View style={{flex: 1,}}>
                                <Text robotoBold style={{color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(20), padding: AppSizes.paddingLrg, paddingBottom: 0, textAlign: 'center',}}>
                                    {`Current Wifi Connection: ${currentWifiConnection.ssid} ${currentWifiConnection.frequency ? currentWifiConnection.frequency : ''}`}
                                </Text>
                                <FormInput
                                    autoCapitalize={'none'}
                                    blurOnSubmit={false}
                                    clearButtonMode={'never'}
                                    containerStyle={{alignSelf: 'center', paddingTop: AppSizes.paddingLrg, width: AppSizes.screen.widthTwoThirds,}}
                                    inputStyle={{color: AppColors.zeplin.yellow, textAlign: 'center',}}
                                    keyboardType={'default'}
                                    onChangeText={text => this._handleFormChange('password', text)}
                                    onSubmitEditing={() => this._connectSensorToWifi()}
                                    placeholder={'password'}
                                    placeholderTextColor={AppColors.zeplin.yellow}
                                    returnKeyType={'done'}
                                    value={currentWifiConnection.password}
                                />
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingVertical: 20,}}
                                    containerStyle={{paddingTop: AppSizes.paddingLrg,}}
                                    disabled={currentWifiConnection.password.length === 0}
                                    onPress={() => this._connectSensorToWifi()}
                                    title={'Update'}
                                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(16),}}
                                />
                            </View>
                        }*/}
                        <Text robotoBold style={{color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(20), padding: AppSizes.paddingLrg, textAlign: 'center',}}>{'Select a network you commonly use after training.'}</Text>
                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                            <Text
                                robotoBold
                                style={{color: AppColors.zeplin.navy, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                            >
                                {'Networks In Range'}
                            </Text>
                        </View>
                        <Spacer isDivider />
                        <View style={{flex: 1,}}>
                            { availableNetworks.length > 0 ?
                                <ScrollView>
                                    {_.map(availableNetworks, (network, i) =>
                                        <ListItem
                                            bottomDivider={true}
                                            containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding,}}
                                            key={i}
                                            onPress={() => this.setState({ currentWifiConnection: network, isDialogVisible: true, })}
                                            title={network.ssid}
                                            titleStyle={{color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                                        />
                                    )}
                                </ScrollView>
                                : availableNetworks.length === 0 && !isWifiScanDone ?
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', padding: AppSizes.padding,}}>
                                        <ActivityIndicator
                                            animating={true}
                                            color={AppColors.zeplin.yellow}
                                            size={'large'}
                                        />
                                    </View>
                                    :
                                    <View style={{flex: 1, padding: AppSizes.padding,}}>
                                        <Text robotoBold style={{color: AppColors.zeplin.navy, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}>{'No available broadcasting networks are compatible with our sensor.'}</Text>
                                        <Button
                                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                                            onPress={() => this._handleWifiScan()}
                                            title={'Try Again'}
                                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                                        />
                                    </View>
                            }
                            { availableNetworks.length > 0 && isWifiScanDone &&
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                                    containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                                    onPress={() => this._handleWifiScan()}
                                    title={'Try Again'}
                                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                                />
                            }
                        </View>
                    </View>

                    <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.splash, flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'You\'re now ready to use the system!'}</Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                            onPress={() => Actions.settings()}
                            title={'Done'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>

                </Pages>

                <Toast
                    position={'bottom'}
                    ref={'toast'}
                />

                <DialogInput
                    closeDialog={() => this.setState({ currentWifiConnection: false, isDialogVisible: false, })}
                    dialogStyle={{marginBottom: 100,}}
                    isDialogVisible={isDialogVisible}
                    message={`"${currentWifiConnection ? currentWifiConnection.ssid : ''}"`}
                    modalStyle={{backdropColor: AppColors.zeplin.darkNavy, backdropOpacity: 0.8,}}
                    submitInput={inputText => {
                        let newCurrentWifiConnection = _.cloneDeep(this.state.currentWifiConnection);
                        newCurrentWifiConnection.password = inputText;
                        this.setState(
                            { currentWifiConnection: newCurrentWifiConnection, isDialogVisible: false, loading: true, },
                            () => this._connectSensorToWifi(),
                        );
                    }}
                    submitText={'Save'}
                    title={'Connect to Network'}
                />

                { this.state.loading ?
                    <Loading
                        text={'Saving WiFi Connection...'}
                    />
                    :
                    null
                }

            </View>
        )
    }
}

BluetoothConnect3Sensor.propTypes = {
    assignKitIndividual:       PropTypes.func.isRequired,
    bluetooth:                 PropTypes.object.isRequired,
    deviceFound:               PropTypes.func.isRequired,
    getBLEMacAddress:          PropTypes.func.isRequired,
    getScannedWifiConnections: PropTypes.func.isRequired,
    getSingleWifiConnection:   PropTypes.func.isRequired,
    network:                   PropTypes.object.isRequired,
    startDisconnection:        PropTypes.func.isRequired,
    startScan:                 PropTypes.func.isRequired,
    stopConnect:               PropTypes.func.isRequired,
    stopScan:                  PropTypes.func.isRequired,
    updateUser:                PropTypes.func.isRequired,
    user:                      PropTypes.object.isRequired,
    writeWifiDetailsToSensor:  PropTypes.func.isRequired,
};

BluetoothConnect3Sensor.defaultProps = {};

BluetoothConnect3Sensor.componentName = 'BluetoothConnect3Sensor';

/* Export Component ================================================================== */
export default BluetoothConnect3Sensor;