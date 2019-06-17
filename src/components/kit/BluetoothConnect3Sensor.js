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
    Animated,
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
import { AlertHelper, AppUtil, } from '../../lib';
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
const FIRST_TIME_EXPERIENCE_PREFIX = '3Sensor-Onboarding-';

/* Component ==================================================================== */
class BluetoothConnect3Sensor extends Component {

    constructor(props) {
        super(props);
        const { user, } = this.props;
        let filteredFirstTimeExperience = _.filter(user.first_time_experience, o => /^3Sensor-Onboarding-/.test(o));
        filteredFirstTimeExperience = _.map(filteredFirstTimeExperience, o => _.toInteger(o.substring((o.lastIndexOf('-') + 1), o.length)));
        let largestCheckpoint = _.max(filteredFirstTimeExperience);
        let updatedPageIndex = largestCheckpoint ?
            largestCheckpoint
            :
            0;
        this.state = {
            availableNetworks:     [],
            bounceValue:           new Animated.Value(100),
            currentWifiConnection: false,
            loading:               false,
            pageIndex:             _.toInteger(updatedPageIndex),
            isDialogVisible:       false,
            isVideoMuted:          false,
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
        // update user obj to say user is on first page
        if(!this.props.user.first_time_experience.includes(`${FIRST_TIME_EXPERIENCE_PREFIX}0`)) {
            this._updateUserCheckpoint(0);
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
                    return this._connect(closestDevice[0]);
                }
                return Alert.alert(
                    '',
                    'We\'re not able to find your Kit. Try bringing your phone closer.',
                    [
                        {
                            text:    'Exit Tutorial',
                            onPress: () => Actions.pop(),
                            style:   'cancel',
                        },
                        {
                            text:    'Try Again',
                            onPress: () => this._renderNextPage(this.state.pageIndex - 1),
                        },
                    ],
                    { cancelable: false, }
                );
            });
    }

    _connect = data => {
        const { bluetooth, getBLEMacAddress, stopConnect, user, } = this.props;
        return getBLEMacAddress(data.id)
            .then(() => this._toggleAlertNotification(data.id, user.id))
            .catch(err => {
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
        let sensorId = bluetooth.accessoryData.sensor_pid;
        let ssid = currentWifiConnection.ssid;
        let password = currentWifiConnection.password;
        let securityByte = currentWifiConnection.security.toByte;
        return writeWifiDetailsToSensor(sensorId, ssid, password, securityByte)
            .then(res => {
                // setup variables
                let newUserPayloadObj = {};
                newUserPayloadObj.sensor_data = {};
                newUserPayloadObj.sensor_data.sensor_pid = bluetooth.accessoryData.wifiMacAddress;
                newUserPayloadObj.sensor_data.mobile_udid = bluetooth.accessoryData.mobile_udid;
                newUserPayloadObj.sensor_data.sensor_networks = [currentWifiConnection.ssid];
                newUserPayloadObj.sensor_data.system_type = '3-sensor';
                let newUserObj = _.cloneDeep(user);
                newUserObj.sensor_data.sensor_pid = bluetooth.accessoryData.wifiMacAddress;
                newUserObj.sensor_data.mobile_udid = bluetooth.accessoryData.mobile_udid;
                newUserObj.sensor_data.sensor_networks = [currentWifiConnection.ssid];
                newUserObj.sensor_data.system_type = '3-sensor';
                // update reducer as API might take too long to return a value
                store.dispatch({
                    type: DispatchActions.USER_REPLACE,
                    data: newUserObj
                });
                // send commands
                return updateUser(newUserPayloadObj, user.id) // 1. PATCH user specific endpoint
                    .then(() => assignKitIndividual({wifiMacAddress: bluetooth.accessoryData.wifiMacAddress,}, user)) // 2. PATCH hardware specific endpoint
                    .then(() => startDisconnection(sensorId, true)) // 3. disconnect from sensor
                    .then(() => this.setState({ loading: false, }, () => {this._timer = _.delay(() => this._renderNextPage(), 500)} )) // 4. route to next page
                    .catch(err => this.setState({ loading: false, }, () => {this._timer = _.delay(() => AppUtil.handleAPIErrorAlert(err), 500)} ));
            })
            .catch(err => this.setState({ loading: false, }, () => {this._timer = _.delay(() => AppUtil.handleAPIErrorAlert(err), 500)} ));
    }

    _handleAlertHelper = (title = '', message, isCancelable) => {
        Actions.pop();
        if(isCancelable) {
            AlertHelper.showCancelableDropDown('custom', title, message);
        } else {
            AlertHelper.showDropDown('custom', title, message);
        }
    }

    _handleAlertPress = () => {
        Alert.alert(
            '',
            'Oops! Your Sensors need to finish syncing with the Smart Charger.\n\nPlease return all of the Sensors to the Charger, firmly close the lid, & wait for the LEDs to finish breathing green.',
            [
                {
                    text:  'OK',
                    style: 'cancel',
                },
            ],
            { cancelable: false, }
        );
    }

    _handleBLEPair = () => {
        const { startScan, } = this.props;
        startScan(60);
    }

    _handleFormChange = (name, value) => {
        let newFormFields = _.update( this.state.currentWifiConnection, name, () => value);
        this.setState({ ['currentWifiConnection']: newFormFields, });
    }

    _handleNetworkPress = network => {
        _.map(this._wifiTimers, (timer, i) => clearInterval(this._wifiTimers[i]));
        this.setState({ currentWifiConnection: network, isDialogVisible: true, isWifiScanDone: true, });
    }

    _handleWifiNotInRange = () => {
        const { user, }= this.props;
        Alert.alert(
            '',
            'To configure wifi, your Kit needs to be in range of the network. If not currently in range, please set up wifi later to sync your training data.',
            [
                {
                    text:    'I\'ll do it later',
                    onPress: () => {
                        Actions.pop();
                        if(user && user.sensor_data && (!user.sensor_data.mobile_udid || !user.sensor_data.sensor_pid)) {
                            this._handleAlertHelper('FINISH WIFI SET-UP TO SYNC YOUR DATA.', 'Tap here once in range of your preferred wifi.', false);
                        }
                    },
                },
                {
                    text:  'Configure Now',
                    style: 'cancel',
                },
            ],
            { cancelable: false, }
        );
    }

    _handleWifiScan = () => {
        const { bluetooth, getScannedWifiConnections, getSingleWifiConnection, } = this.props;
        this.setState({ availableNetworks: [], isWifiScanDone: false, });
        return getScannedWifiConnections(bluetooth.accessoryData.sensor_pid)
            .then(res => {
                if(res === 0) {
                    this.setState({ availableNetworks: [], isWifiScanDone: true, });
                }
                for(let i = 1; i <= res; i += 1) {
                    this._wifiTimers[i] = _.delay(() => {
                        getSingleWifiConnection(bluetooth.accessoryData.sensor_pid, i)
                            .then(response => {
                                let newAvailableNetworks = _.cloneDeep(this.state.availableNetworks);
                                newAvailableNetworks.push(response);
                                newAvailableNetworks = _.uniqBy(newAvailableNetworks, 'ssid');
                                this.setState({ availableNetworks: newAvailableNetworks, isWifiScanDone: i === res, });
                            })
                            .catch(error => this.setState({ isWifiScanDone: true, }));
                    }, 500 * i);
                }
            })
            .catch(err => this.setState({ availableNetworks: [], isWifiScanDone: true, }, () => AppUtil.handleAPIErrorAlert(err)));
    }

    _onPageScrollEnd = currentPage => {
        const checkpointPages = [0, 1, 9, 12, 15, 19];
        if(checkpointPages.includes(currentPage)) { // we're on a checkpoint page, update user obj
            this._updateUserCheckpoint(currentPage);
        } else if(currentPage === 17) { // connect to accessory
            this._handleBLEPair();
            Animated.sequence([
	              Animated.delay(750),
                Animated.spring(
                    this.state.bounceValue,
                    {
                        friction: 8,
                        tension:  2,
                        toValue:  0,
                        velocity: 3,
                    }
                )
            ]).start();
        } else if(currentPage === 18) { // wifi list, start scan
            this._timer = _.delay(() => this._handleWifiScan(), 1000);
        }
    }

    _renderNextPage = page => {
        let nextPageIndex = page ? page : (this.state.pageIndex + 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    _renderPreviousPage = () => {
        let nextPageIndex = (this.state.pageIndex - 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    _submitPasswordInput = inputText => {
        let newCurrentWifiConnection = _.cloneDeep(this.state.currentWifiConnection);
        newCurrentWifiConnection.password = inputText;
        this.setState(
            { currentWifiConnection: newCurrentWifiConnection, isDialogVisible: false, },
            () => {
                this._timer = _.delay(() => {
                    this.setState(
                        { loading: true, },
                        () => this._connectSensorToWifi(),
                    );
                }, 500);
            },
        );
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
                        this._renderNextPage(this.state.pageIndex - 1);
                        return stopConnect();
                    },
                    style: 'cancel',
                },
                {
                    text:    'Yes',
                    onPress: () => this._renderNextPage(),
                },
            ],
            { cancelable: false, }
        );
    }

    _updateUserCheckpoint = page => {
        const { updateUser, user, } = this.props;
        // setup variables
        let value = `${FIRST_TIME_EXPERIENCE_PREFIX}${page}`;
        if(!this.props.user.first_time_experience.includes(value)) {
            let newUserPayloadObj = {};
            newUserPayloadObj.first_time_experience = [value];
            let newUserObj = _.cloneDeep(user);
            newUserObj.first_time_experience.push(value);
            // update reducer as API might take too long to return a value
            store.dispatch({
                type: DispatchActions.USER_REPLACE,
                data: newUserObj
            });
            // update user object
            updateUser(newUserPayloadObj, user.id, false);
        }
    }

    render = () => {
        const { availableNetworks, bounceValue, currentWifiConnection, pageIndex, isDialogVisible, isVideoMuted, isWifiScanDone, } = this.state;
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

                    {/* Welcome Screen - page 0 */}
                    <CVP
                        nextBtn={this._renderNextPage}
                    />

                    {/* Placement Tutorial - pages 1-8 */}
                    <Placement
                        currentPage={pageIndex === 1}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={0}
                    />
                    <Placement
                        currentPage={pageIndex === 2}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={1}
                    />
                    <Placement
                        currentPage={pageIndex === 3}
                        handleAlertPress={() => this._handleAlertPress()}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={2}
                    />
                    <Placement
                        currentPage={pageIndex === 4}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={3}
                    />
                    <Placement
                        currentPage={pageIndex === 5}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={4}
                    />
                    <Placement
                        currentPage={pageIndex === 6}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={5}
                    />
                    <Placement
                        currentPage={pageIndex === 7}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={6}
                    />
                    <Placement
                        currentPage={pageIndex === 8}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={7}
                    />

                    {/* Calibration - pages 9-11 */}
                    <Calibration
                        currentPage={pageIndex === 9}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={0}
                    />
                    <Calibration
                        currentPage={pageIndex === 10}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={1}
                    />
                    <Calibration
                        currentPage={pageIndex === 11}
                        handleUpdateVolume={() => this.setState({ isVideoMuted: !this.state.isVideoMuted, })}
                        isVideoMuted={isVideoMuted}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={2}
                    />

                    {/* Session - pages 12-14 */}
                    <Session
                        currentPage={pageIndex === 12}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() => this._handleAlertHelper('RETURN TO TUTORIAL', 'after training to end your workout & sync your data! Tap here.', true)}
                        page={0}
                    />
                    <Session
                        currentPage={pageIndex === 13}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={1}
                    />
                    <Session
                        currentPage={pageIndex === 14}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={2}
                    />

                    {/* Connect - pages 15-19 */}
                    <Connect
                        currentPage={pageIndex === 15}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() => this._handleAlertHelper('RETURN TO TUTORIAL', 'to connect to wifi and sync your data. Tap here.', true)}
                        page={0}
                    />
                    <Connect
                        currentPage={pageIndex === 16}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={1}
                    />
                    <Connect
                        bounceValue={bounceValue}
                        currentPage={pageIndex === 17}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={2}
                    />
                    <Connect
                        availableNetworks={availableNetworks}
                        currentPage={pageIndex === 18}
                        handleNetworkPress={network => this._handleNetworkPress(network)}
                        handleNotInRange={() => this._handleWifiNotInRange()}
                        handleWifiScan={() => this._handleWifiScan()}
                        isWifiScanDone={isWifiScanDone}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() => this._handleAlertHelper('FINISH WIFI SET-UP TO SYNC YOUR DATA.', 'Tap here once in range of your preferred wifi.', false)}
                        page={3}
                    />
                    <Connect
                        currentPage={pageIndex === 19}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={4}
                    />

                    {/* Battery - page 20 */}
                    <Battery
                        currentPage={pageIndex === 20}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                    />

                    {/* End - page 21 */}
                    <Complete
                        nextBtn={() => Actions.pop()}
                        onBack={this._renderPreviousPage}
                    />

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
                    submitInput={inputText => this._submitPasswordInput(inputText)}
                    submitText={'Save'}
                    title={'Connect to Network'}
                />

                { this.state.loading ?
                    <Loading
                        text={'SAVING...'}
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