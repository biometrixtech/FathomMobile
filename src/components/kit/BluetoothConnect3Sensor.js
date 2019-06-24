/**
 * BluetoothConnect3Sensor
 *
    <BluetoothConnect3Sensor
        assignKitIndividual={assignKitIndividual}
        bluetooth={bluetooth}
        deviceFound={deviceFound}
        getAccessoryKey={getAccessoryKey}
        getBLEMacAddress={getBLEMacAddress}
        getScannedWifiConnections={getScannedWifiConnections}
        getSensorFiles={getSensorFiles}
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
    Alert,
    Keyboard,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    View,
} from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, } from '../../constants';
import { AlertHelper, AppUtil, SensorLogic, } from '../../lib';
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
const WIFI_PAGE_NUMBER = 17;

/* Component ==================================================================== */
class BluetoothConnect3Sensor extends Component {

    constructor(props) {
        super(props);
        const { user, } = this.props;
        const updatedPageIndex = SensorLogic.handleFirstPageIndexRenderLogic(user, WIFI_PAGE_NUMBER);
        this.state = {
            availableNetworks:     [],
            bleState:              '',
            currentWifiConnection: false,
            isConnectingToSensor:  false,
            isDialogVisible:       false,
            isVideoMuted:          false,
            isWifiScanDone:        false,
            loading:               false,
            pageIndex:             updatedPageIndex,
        };
        this._pages = {};
        this._timer = null;
        this.handleBLEUpdateState = this.handleBLEUpdateState.bind(this);
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    }

    componentDidMount = () => {
        AlertHelper.closeCancelableDropDown();
        AlertHelper.closeDropDown();
        BleManager.start({ showAlert: false, });
        BleManager.checkState();
        this.handlerCheck = bleManagerEmitter.addListener('BleManagerDidUpdateState', args => this.handleBLEUpdateState(args));
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        // update user obj to say user is on first page
        if(!this.props.user.first_time_experience.includes(`${FIRST_TIME_EXPERIENCE_PREFIX}0`)) {
            this._updateUserCheckpoint(0);
        }
    }

    componentWillUnmount = () => {
        this._pages = {};
        clearInterval(this._timer);
        this.handlerCheck.remove();
        this.handlerDiscover.remove();
    }

    handleBLEUpdateState = args => this.setState({ bleState: args.state, })

    handleDiscoverPeripheral = data => {
        const { deviceFound, } = this.props;
        if (data.advertising && data.advertising.kCBAdvDataLocalName) {
            data.name = data.advertising.kCBAdvDataLocalName;
        }
        return data.name && data.name === 'fathomKit' && this.props.bluetooth.devicesFound.length === 0 ? deviceFound(data).then(() => this._handleStopScan()) : null; // 3-sensor solution
        // return data.name && /fathomS[*]_/i.test(data.name) ? deviceFound(data) : null; // 1-sensor solution
    }

    _connect = data => {
        const { getAccessoryKey, getBLEMacAddress, startDisconnection, user, } = this.props;
        return getBLEMacAddress(data.id)
            .then(macAddress => getAccessoryKey(macAddress))
            .then(response => {
                if(!response.accessory.owner_id) {
                    return this._toggleAlertNotification(data.id, user.id);
                }
                return startDisconnection(data.id, true).then(() => this._handleBLEPair());
            })
            .catch(err => {
                if (
                    this.props.bluetooth.accessoryData &&
                    !this.props.bluetooth.accessoryData.sensor_pid &&
                    !this.props.bluetooth.accessoryData.mobile_udid &&
                    !this.props.bluetooth.accessoryData.wifiMacAddress
                ) {
                    this.refs.toast.show(SensorLogic.errorMessages().pairError, (DURATION.LENGTH_SHORT * 2));
                    return this._handleDisconnection(() => this._renderPreviousPage());
                }
                return console.log(err);
            });
    }

    _connectSensorToWifi = () => {
        Keyboard.dismiss();
        const { assignKitIndividual, bluetooth, getSensorFiles, startDisconnection, updateUser, user, writeWifiDetailsToSensor, } = this.props;
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
                newUserPayloadObj.sensor_data.system_type = '3-sensor';
                let newUserNetworksPayloadObj = {};
                newUserNetworksPayloadObj['@sensor_data'].sensor_networks = [currentWifiConnection.ssid];
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
                return updateUser(newUserPayloadObj, user.id) // 1a. PATCH user specific endpoint - handles everything except for network name
                    .then(() => updateUser(newUserNetworksPayloadObj, user.id)) // 1b. PATCH user specific endpoint - handles network names
                    .then(() => assignKitIndividual({wifiMacAddress: bluetooth.accessoryData.wifiMacAddress,}, user)) // 2. PATCH hardware specific endpoint
                    .then(() => getSensorFiles(newUserObj)) // 3. grab sensor files as they may have changed
                    .then(() => startDisconnection(sensorId, true)) // 4. disconnect from sensor
                    .then(() => this.setState({ loading: false, }, () => {this._timer = _.delay(() => this._renderNextPage(), 500)} )) // 5. route to next page
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
        this._timer = _.delay(() => this._toggleSensorsConnectedAlert(), 60000);
    }

    _handleDisconnection = callback => {
        const { bluetooth, startDisconnection, } = this.props;
        if(bluetooth.accessoryData && bluetooth.accessoryData.sensor_pid && bluetooth.accessoryData.mobile_udid) {
            startDisconnection(bluetooth.accessoryData.sensor_pid, true)
                .then(() => callback())
                .catch(() => callback());
        } else {
            callback();
        }
    }

    _handleNetworkPress = network => {
        if(network.security.toByte !== 0) {
            this.setState({ currentWifiConnection: network, isDialogVisible: true, isWifiScanDone: true, });
        } else {
            let newCurrentWifiConnection = _.cloneDeep(this.state.currentWifiConnection);
            newCurrentWifiConnection.password = false;
            this.setState(
                { currentWifiConnection: newCurrentWifiConnection, isWifiScanDone: true, },
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
    }

    _handleSingleWifiConnectionFetch = (sensorId, numberOfConnections, currentIndex) => {
        const { getSingleWifiConnection, } = this.props;
        if(numberOfConnections === 0 && currentIndex > numberOfConnections) {
            this.setState({ isWifiScanDone: true, });
        } else {
            getSingleWifiConnection(sensorId, currentIndex)
                .then(res => {
                    let newAvailableNetworks = _.cloneDeep(this.state.availableNetworks);
                    newAvailableNetworks.push(res);
                    newAvailableNetworks = _.uniqBy(newAvailableNetworks, 'ssid');
                    newAvailableNetworks = _.filter(newAvailableNetworks, o => o.ssid.length > 0);
                    return this.setState(
                        { availableNetworks: newAvailableNetworks, },
                        () => _.delay(() => {
                            if(currentIndex === numberOfConnections) {
                                this.setState({ isWifiScanDone: true, });
                            } else {
                                this._handleSingleWifiConnectionFetch(sensorId, numberOfConnections, (currentIndex + 1))
                            }
                        }, 750),
                    );
                })
                .catch(err => {
                    if(err === 'TIMEDOUT') {
                        return this.setState({ isWifiScanDone: true, }, () => this._toggleTimedoutBringCloserAlert(() => this._handleWifiScan()));
                    } else if(currentIndex === numberOfConnections) {
                        return this.setState({ isWifiScanDone: true, });
                    }
                    return this._handleSingleWifiConnectionFetch(sensorId, numberOfConnections, (currentIndex + 1));
                });
        }
    };

    _handleStopScan = () => {
        const { stopScan, } = this.props;
        clearInterval(this._timer);
        return stopScan()
            .then(() => this._toggleSensorsConnectedAlert());
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
                        this._handleDisconnection(() => Actions.pop());
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
        const { bluetooth, getScannedWifiConnections, } = this.props;
        this.setState({ availableNetworks: [], isWifiScanDone: false, });
        return getScannedWifiConnections(bluetooth.accessoryData.sensor_pid)
            .then(res => {
                if(res === 0) {
                    this.setState({ availableNetworks: [], isWifiScanDone: true, });
                }
                return this._handleSingleWifiConnectionFetch(bluetooth.accessoryData.sensor_pid, res, 1);
            })
            .catch(err => {
                return this.setState({ availableNetworks: [], isWifiScanDone: true, }, () => {
                    if(err === 'TIMEDOUT') {
                        this._toggleTimedoutBringCloserAlert(() => this._handleWifiScan())
                    } else {
                        AppUtil.handleAPIErrorAlert(err, 'Please Try Again!');
                    }
                });
            });
    }

    _onPageScrollEnd = currentPage => {
        const checkpointPages = [0, 1, 9, 12, 15, WIFI_PAGE_NUMBER, 18];
        if(checkpointPages.includes(currentPage)) { // we're on a checkpoint page, update user obj
            this._updateUserCheckpoint(currentPage);
        }
        if(currentPage === 16) { // turn on BLE & connect to accessory
            if (Platform.OS === 'android') {
                BleManager.enableBluetooth();
            }
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
        } else if(currentPage === WIFI_PAGE_NUMBER) { // wifi list, start scan
            this._timer = _.delay(() => this._handleWifiScan(), 2000);
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
        Alert.alert(
            '',
            'Did the LED turn green?',
            [
                {
                    text:    'No',
                    onPress: () => this.setState({ isConnectingToSensor: false, }, () => this._handleDisconnection(() => this._renderPreviousPage())),
                    style:   'cancel',
                },
                {
                    text:    'Yes',
                    onPress: () => this.setState({ isConnectingToSensor: false, }, () => {this._timer = _.delay(() => this._renderNextPage(), 1000)}),
                },
            ],
            { cancelable: false, }
        );
    }

    _toggleSensorsConnectedAlert = () => {
        const { bluetooth, } = this.props;
        let closestDevice = _.orderBy(bluetooth.devicesFound, ['rssi'], ['desc']);
        if(closestDevice.length > 0) {
            return this._connect(closestDevice[0]);
        }
        return this._toggleTimedoutBringCloserAlert(() => {});
    }

    _toggleTimedoutBringCloserAlert = callback => {
        Alert.alert(
            '',
            'We\'re not able to find your Kit. Try bringing your phone closer.',
            [
                {
                    text:    'Exit Tutorial',
                    onPress: () => this.setState({ isConnectingToSensor: false, }, () => this._handleDisconnection(() => Actions.pop())),
                    style:   'cancel',
                },
                {
                    text:    'Try Again',
                    onPress: () => this.setState({ isConnectingToSensor: false, }, () => callback && callback()),
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
        const {
            availableNetworks,
            bleState,
            currentWifiConnection,
            pageIndex,
            isConnectingToSensor,
            isDialogVisible,
            isVideoMuted,
            isWifiScanDone,
        } = this.state;
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
                        onClose={() => this._handleAlertHelper('RETURN TO TUTORIAL', 'after training to end your workout & sync your data! Tap here.', true)}
                        page={1}
                    />
                    <Session
                        currentPage={pageIndex === 14}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() => this._handleAlertHelper('RETURN TO TUTORIAL', 'after training to end your workout & sync your data! Tap here.', true)}
                        page={2}
                    />

                    {/* Connect - pages 15-18 */}
                    <Connect
                        currentPage={pageIndex === 15}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() => this._handleAlertHelper('RETURN TO TUTORIAL', 'to connect to wifi and sync your data. Tap here.', true)}
                        page={0}
                    />
                    <Connect
                        currentPage={pageIndex === 16}
                        isLoading={isConnectingToSensor}
                        isNextDisabled={bleState !== 'on' || isConnectingToSensor}
                        nextBtn={() => this.setState({ isConnectingToSensor: true, }, () => this._handleBLEPair())}
                        onBack={this._renderPreviousPage}
                        onClose={() =>
                            this._handleDisconnection(() =>
                                this._handleAlertHelper('RETURN TO TUTORIAL', 'to connect to wifi and sync your data. Tap here.', true)
                            )
                        }
                        page={1}
                    />
                    <Connect
                        availableNetworks={availableNetworks}
                        currentPage={pageIndex === WIFI_PAGE_NUMBER}
                        handleNetworkPress={network => this._handleNetworkPress(network)}
                        handleNotInRange={() => this._handleWifiNotInRange()}
                        handleWifiScan={() => this._handleWifiScan()}
                        isWifiScanDone={isWifiScanDone}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() =>
                            this._handleDisconnection(() =>
                                this._handleAlertHelper('FINISH WIFI SET-UP TO SYNC YOUR DATA.', 'Tap here once in range of your preferred wifi.', false)
                            )
                        }
                        page={3}
                    />
                    <Connect
                        currentPage={pageIndex === 18}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() => Actions.pop()}
                        page={4}
                    />

                    {/* Battery - page 19 */}
                    <Battery
                        currentPage={pageIndex === 19}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                    />

                    {/* End - page 20 */}
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
    getAccessoryKey:           PropTypes.func.isRequired,
    getBLEMacAddress:          PropTypes.func.isRequired,
    getScannedWifiConnections: PropTypes.func.isRequired,
    getSensorFiles:            PropTypes.func.isRequired,
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