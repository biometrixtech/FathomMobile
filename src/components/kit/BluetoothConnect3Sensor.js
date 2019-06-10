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
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    ScrollView,
    View,
} from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, } from '../../constants';
import { AppUtil, } from '../../lib';
import { Loading, } from '../general';
import { store, } from '../../store';
import { Battery, CVP, Calibration, Complete, Connect, Placement, Session, } from './ConnectScreens';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import DialogInput from 'react-native-dialog-input';
import Toast, { DURATION } from 'react-native-easy-toast';

// setup consts
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

/* Component ==================================================================== */
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
        this._wifiTimers = [];
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
        this._pages = {};
        this._timer = null;
        _.map(this._wifiTimers, (timer, i) => clearInterval(this._wifiTimers[i]));
        this.handlerDiscover.remove();
        this.handlerStop.remove();
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
                    newUserPayloadObj.sensor_data = {};
                    newUserPayloadObj.sensor_data.sensor_pid = bluetooth.accessoryData.wifiMacAddress;
                    newUserPayloadObj.sensor_data.mobile_udid = bluetooth.accessoryData.mobile_udid;
                    newUserPayloadObj.sensor_data.sensor_networks = [];
                    newUserPayloadObj.sensor_data.system_type = '3-sensor';
                    let newUserObj = _.cloneDeep(user);
                    newUserObj.sensor_data.sensor_pid = bluetooth.accessoryData.wifiMacAddress;
                    newUserObj.sensor_data.mobile_udid = bluetooth.accessoryData.mobile_udid;
                    newUserObj.sensor_data.sensor_networks = [];
                    newUserObj.sensor_data.system_type = '3-sensor';
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

    _handleBLEPair = () => {
        const { startScan, } = this.props;
        startScan(10);
    }

    _handleFormChange = (name, value) => {
        let newFormFields = _.update( this.state.currentWifiConnection, name, () => value);
        this.setState({ ['currentWifiConnection']: newFormFields, });
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
                    this._wifiTimers[i] = _.delay(() => {
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

    _onPageScrollEnd = currentPage => {
        if(currentPage === 17) {
            this._handleBLEPair();
        } else if(currentPage === 18) {
            this._timer = _.delay(() => this._handleWifiScan(), 500);
        }
    }

    _renderNextPage = () => {
        let nextPageIndex = (this.state.pageIndex + 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    _renderPreviousPage = () => {
        let nextPageIndex = (this.state.pageIndex - 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
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

                    {/* Welcome Screen */}
                    <CVP nextBtn={this._renderNextPage} />

                    {/* Placement Tutorial */}
                    <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={0} />
                    <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={1} />
                    <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={2} />
                    <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={3} />
                    <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={4} />
                    <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={5} />
                    <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={6} />
                    <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={7} />

                    {/* Calibration */}
                    <Calibration nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={0} />
                    <Calibration nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={1} />
                    <Calibration nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={2} />

                    {/* Session */}
                    <Session nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={0} />
                    <Session nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={1} />
                    <Session nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={2} />

                    {/* Connect */}
                    <Connect nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={0} />
                    <Connect nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={1} />
                    <Connect nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={2} />
                    <Connect
                        availableNetworks={availableNetworks}
                        handleNetworkPress={network => this.setState({ currentWifiConnection: network, isDialogVisible: true, })}
                        handleWifiScan={() => this._handleWifiScan()}
                        isWifiScanDone={isWifiScanDone}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={3}
                    />
                    <Connect nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={4} />

                    {/* Battery */}
                    <Battery nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} />

                    {/* End */}
                    <Complete nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} />

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