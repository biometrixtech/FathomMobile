/**
 * BluetoothConnect
 *
    <BluetoothConnect
        assignKitIndividual={assignKitIndividual}
        bluetooth={bluetooth}
        getSensorFiles={getSensorFiles}
        network={network}
        updateUser={updateUser}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    Keyboard,
    Platform,
    PermissionsAndroid,
    View,
} from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, } from '../../constants';
import { AlertHelper, AppUtil, SensorLogic, } from '../../lib';
import { Battery, CVP, Calibration, Complete, Connect, Placement, Session, } from './ConnectScreens';
import { Loading, } from '../general';
import { ble, } from '../../actions';
import { store, } from '../../store';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import DialogInput from 'react-native-dialog-input';
import Toast, { DURATION } from 'react-native-easy-toast';

// setup consts
const FIRST_TIME_EXPERIENCE_PREFIX = '3Sensor-Onboarding-';
const WIFI_PAGE_NUMBER = 16;

/* Component ==================================================================== */
class BluetoothConnect extends Component {

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
            isSubmittingDetails:   false,
            isVideoMuted:          false,
            isWifiScanDone:        false,
            loading:               false,
            pageIndex:             updatedPageIndex,
        };
        this._isMounted = false;
        this._pages = {};
        this._timer = null;
    }

    componentDidMount = () => {
        AlertHelper.closeCancelableDropDown();
        AlertHelper.closeDropDown();
        // update user obj to say user is on first page
        if(!this.props.user.first_time_experience.includes(`${FIRST_TIME_EXPERIENCE_PREFIX}0`)) {
            this._updateUserCheckpoint(0);
        }
        this._isMounted = true;
    }

    componentWillMount = () => {
        // monitor when the BLE state changes
        ble.startMonitor(state => this.setState({ bleState: state, }));
    }

    componentWillUnmount = () => {
        this._pages = {};
        ble.destroyInstance();
        clearInterval(this._timer);
        this._isMounted = false;
    }

    _connectSensorToWifi = () => {
        Keyboard.dismiss();
        const { assignKitIndividual, bluetooth, getSensorFiles, updateUser, user, } = this.props;
        const { currentWifiConnection, } = this.state;
        // setup ble write variables
        let device = _.find(bluetooth.devicesFound, ['id', bluetooth.accessoryData.sensor_pid]);
        let ssid = currentWifiConnection.ssid;
        let password = currentWifiConnection.password;
        let securityByte = currentWifiConnection.security ? currentWifiConnection.security.toByte : 'OPEN';
        let macAddress = bluetooth.accessoryData.wifiMacAddress;
        // setup user variables
        let newUserPayloadObj = {};
        newUserPayloadObj.sensor_data = {};
        newUserPayloadObj.sensor_data.sensor_pid = bluetooth.accessoryData.wifiMacAddress;
        newUserPayloadObj.sensor_data.mobile_udid = bluetooth.accessoryData.mobile_udid;
        newUserPayloadObj.sensor_data.system_type = '3-sensor';
        let newUserNetworksPayloadObj = {};
        newUserNetworksPayloadObj['@sensor_data'] = {};
        newUserNetworksPayloadObj['@sensor_data'].sensor_networks = [currentWifiConnection.ssid];
        let newUserObj = _.cloneDeep(user);
        newUserObj.first_time_experience.push(`${FIRST_TIME_EXPERIENCE_PREFIX}18`);
        newUserObj.sensor_data.sensor_pid = bluetooth.accessoryData.wifiMacAddress;
        newUserObj.sensor_data.mobile_udid = bluetooth.accessoryData.mobile_udid;
        newUserObj.sensor_data.sensor_networks = [currentWifiConnection.ssid];
        newUserObj.sensor_data.system_type = '3-sensor';
        return ble.writeWifiDetailsToSensor(device, ssid, password, securityByte) // 1. write details to sensor
            .then(() => updateUser(newUserPayloadObj, user.id)) // 2a. PATCH user specific endpoint - handles everything except for network name
            .then(() => updateUser(newUserNetworksPayloadObj, user.id)) // 2b. PATCH user specific endpoint - handles network names
            .then(() => assignKitIndividual({wifiMacAddress: macAddress,}, user)) // 3. PATCH hardware specific endpoint
            .then(() => getSensorFiles(newUserObj)) // 4. grab sensor files as they may have changed
            .then(() =>
                this.setState(
                    { loading: false, },
                    () => _.delay(() => this._renderNextPage(), 500),
                ) // 3. route to next page
            )
            .catch(err => {
                this.setState({ isSubmittingDetails: false, loading: false, }, () => _.delay(() => {
                    if(err.errorMapping.errorCode === -2) {
                        return AppUtil.handleAPIErrorAlert(err.errorMapping.message, 'Error!');
                    } else if(err.isConnected && err.rssi < SensorLogic.getMinRSSIDBM()) {
                        return this._toggleWeakRSSIAlertNotification();
                    } else if(!err.isConnected || err.errorMapping.errorCode === 102) {
                        return this._toggleTimedoutBringCloserAlert(false, isExit => _.delay(() => {
                            if(isExit) {
                                this._handleAlertHelper('FINISH WIFI SET-UP TO SYNC YOUR DATA.', 'Tap here once in range of your preferred wifi.', false);
                            }
                            this._renderPreviousPage(2);
                        }, 500));
                    } else if(err.isConnected && (err.errorMapping.errorCode === -1 || !err.errorMapping.errorCode)) {
                        return AppUtil.handleAPIErrorAlert(SensorLogic.errorMessages().errorWifiConnection, 'Please Try Again');
                    }
                    // TODO: THIS NEEDS TO BE FLUSHED OUT
                    let message = `rssi: ${err.rssi}\nreason: ${err.errorMapping.reason}\niosErrorCode: ${err.errorMapping.iosErrorCode}\nandroidErrorCode: ${err.errorMapping.androidErrorCode}\nattErrorCode: ${err.errorMapping.attErrorCode}`;
                    let header = `STOP! _connectSensorToWifi-exception hit. Code: ${err.errorMapping.errorCode} Message: ${err.errorMapping.message}`;
                    return AppUtil.handleAPIErrorAlert(message, header);
                }, 500));
            });
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
        if(!this._timer) {
            this._timer = _.delay(() => this._toggleTimedoutBringCloserAlert(true, () =>
                ble.startMonitor(state =>
                    this.setState(
                        { bleState: state === 'Unknown' && this.state.bleState === 'PoweredOn' ? this.state.bleState : state, }
                    )
                )
            ), 60000);
        }
        ble.startDeviceScan((error, response, device, state) => {
            if(!this._isMounted) {
                return '';
            }
            if(state) {
                this.setState(
                    { bleState: state === 'Unknown' && this.state.bleState === 'PoweredOn' ? this.state.bleState : state, }
                );
            }
            if(error) {
                if (
                    this.props.bluetooth.accessoryData &&
                    !this.props.bluetooth.accessoryData.sensor_pid &&
                    !this.props.bluetooth.accessoryData.mobile_udid &&
                    !this.props.bluetooth.accessoryData.wifiMacAddress
                ) {
                    this.refs.toast.show(SensorLogic.errorMessages().pairError, (DURATION.LENGTH_SHORT * 2));
                    return this._handleDisconnection(device, () => this._renderPreviousPage());
                }
                return this._toggleTimedoutBringCloserAlert(true, () => ble.startMonitor(newState => this.setState({ bleState: newState, })));
            }
            if(!response.accessory.owner_id) {
                clearTimeout(this._timer);
                return this._toggleAlertNotification();
            }
            return this._handleDisconnection(device, () => this._handleBLEPair(), false, false);
        });
    }

    _handleDisconnection = (device, callback, shouldExitKitSetup, updateState = true) => {
        const { bluetooth, } = this.props;
        if(!this._isMounted) {
            return '';
        }
        return this.setState(
            { isConnectingToSensor: updateState ? false : true, },
            () => {
                if(shouldExitKitSetup) {
                    if(!device) {
                        device = _.find(bluetooth.devicesFound, ['id', bluetooth.accessoryData.sensor_pid]);
                    }
                    return ble.exitKitSetup(device)
                        .then(res => callback && callback())
                        .catch(err => {
                            if(!this._isMounted) {
                                return '';
                            }
                            // TODO: THIS NEEDS TO BE FLUSHED OUT
                            let message = `rssi: ${err.rssi}\nreason: ${err.errorMapping.reason}\niosErrorCode: ${err.errorMapping.iosErrorCode}\nandroidErrorCode: ${err.errorMapping.androidErrorCode}\nattErrorCode: ${err.errorMapping.attErrorCode}`;
                            let header = `STOP! _handleDisconnection-exitKitSetup-exception hit. Code: ${err.errorMapping.errorCode} Message: ${err.errorMapping.message}`;
                            AppUtil.handleAPIErrorAlert(message, header);
                            return callback && callback();
                        });
                }
                if(!device) {
                    device = _.find(bluetooth.devicesFound, ['id', bluetooth.accessoryData.sensor_pid]);
                    if(!device && callback) {
                        return callback();
                    }
                }
                return device.cancelConnection()
                    .then(() => callback && callback())
                    .catch(async err => {
                        if(!this._isMounted) {
                            return '';
                        }
                        let errorObj = await ble.handleError(err, device);
                        // TODO: THIS NEEDS TO BE FLUSHED OUT
                        let message = `rssi: ${err.rssi}\nreason: ${errorObj.errorMapping.reason}\niosErrorCode: ${errorObj.errorMapping.iosErrorCode}\nandroidErrorCode: ${errorObj.errorMapping.androidErrorCode}\nattErrorCode: ${errorObj.errorMapping.attErrorCode}`;
                        let header = `STOP! _handleDisconnection-cancelConnection-exception hit. Code: ${errorObj.errorMapping.errorCode} Message: ${errorObj.errorMapping.message}`;
                        AppUtil.handleAPIErrorAlert(message, header);
                        return callback && callback();
                    });
            }
        );
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
                            { isSubmittingDetails: true, loading: true, },
                            () => this._connectSensorToWifi(),
                        );
                    }, 500);
                },
            );
        }
    }

    _handleSyncOnBack = () => {
        this.setState(
            { isConnectingToSensor: false, },
            () => {
                clearTimeout(this._timer);
                this._timer = null;
                ble.destroyInstance();
                _.delay(() => this._renderPreviousPage(), 500);
            },
        );
    }

    _handleSingleWifiConnectionFetch = (device, numberOfConnections, currentIndex) => {
        if(!this._isMounted) {
            return '';
        }
        if(
            (numberOfConnections === 0 && currentIndex > numberOfConnections) ||
            this.state.isWifiScanDone
        ) {
            return this.setState({ isWifiScanDone: true, });
        }
        return ble.getSingleWifiConnection(device, currentIndex)
            .then(res => {
                let newAvailableNetworks = _.cloneDeep(this.state.availableNetworks);
                newAvailableNetworks.push(res);
                newAvailableNetworks = _.uniqBy(newAvailableNetworks, 'ssid');
                newAvailableNetworks = _.filter(newAvailableNetworks, o => o.ssid.length > 0);
                newAvailableNetworks = _.filter(newAvailableNetworks, o => o.rssi > SensorLogic.getMinRSSIDBM());
                if(!this._isMounted) {
                    return '';
                }
                return this.setState(
                    { availableNetworks: newAvailableNetworks, },
                    () => _.delay(() => {
                        if(currentIndex === numberOfConnections) {
                            this.setState({ isWifiScanDone: true, });
                        } else {
                            this._handleSingleWifiConnectionFetch(device, numberOfConnections, (currentIndex + 1))
                        }
                    }, 750),
                );
            })
            .catch(err => {
                if(!this._isMounted) {
                    return '';
                }
                return this.setState({ availableNetworks: [], isWifiScanDone: true, }, () => {
                    if(err.isConnected && err.rssi < SensorLogic.getMinRSSIDBM()) {
                        return this._toggleWeakRSSIAlertNotification();
                    } else if(!err.isConnected || err.errorMapping.errorCode === 102) {
                        return this._toggleTimedoutBringCloserAlert(false, isExit => _.delay(() => {
                            if(isExit) {
                                this._handleAlertHelper('FINISH WIFI SET-UP TO SYNC YOUR DATA.', 'Tap here once in range of your preferred wifi.', false);
                            }
                            this._renderPreviousPage();
                        }, 500));
                    } else if(err.errorMapping.errorCode === -1) {
                        return this.setState({ isWifiScanDone: true, }, () => this._toggleTimedoutBringCloserAlert(false, () => this._handleWifiScan()));
                    } else if(currentIndex === numberOfConnections) {
                        return this.setState({ isWifiScanDone: true, });
                    }
                    return this._handleSingleWifiConnectionFetch(device, numberOfConnections, (currentIndex + 1));
                });
            });
    };

    _handleWifiNotInRange = () => {
        Alert.alert(
            '',
            'To configure wifi, your Kit needs to be in range of the network. If not currently in range, please set up wifi later to sync your training data.',
            [
                {
                    text:    'I\'ll do it later',
                    onPress: () => {
                        this._handleDisconnection(false, () => {
                            if(this.props.user && this.props.user.sensor_data && (!this.props.user.sensor_data.mobile_udid || !this.props.user.sensor_data.sensor_pid)) {
                                this._handleAlertHelper('FINISH WIFI SET-UP TO SYNC YOUR DATA.', 'Tap here once in range of your preferred wifi.', false);
                            } else {
                                Actions.pop();
                            }
                        }, true);
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
        const { bluetooth, } = this.props;
        if(!this._isMounted) {
            return '';
        }
        this.setState({ availableNetworks: [], isWifiScanDone: false, });
        let device = _.find(bluetooth.devicesFound, ['id', bluetooth.accessoryData.sensor_pid]);
        return ble.getScannedWifiConnections(device)
            .then(res => {
                if(!this._isMounted) {
                    return '';
                }
                if(res === 0) {
                    this.setState({ availableNetworks: [], isWifiScanDone: true, });
                }
                return this._handleSingleWifiConnectionFetch(device, res, 1);
            })
            .catch(err => {
                if(!this._isMounted) {
                    return '';
                }
                return this.setState({ availableNetworks: [], isWifiScanDone: true, }, () => {
                    if(err.isConnected && err.rssi < SensorLogic.getMinRSSIDBM()) {
                        return this._toggleWeakRSSIAlertNotification();
                    } else if(!err.isConnected || err.errorMapping.errorCode === 102) {
                        return this._toggleTimedoutBringCloserAlert(false, isExit => _.delay(() => {
                            if(isExit) {
                                this._handleAlertHelper('FINISH WIFI SET-UP TO SYNC YOUR DATA.', 'Tap here once in range of your preferred wifi.', false);
                            }
                            this._renderPreviousPage();
                        }, 500));
                    } else if(err.errorMapping.errorCode === -1) {
                        // timedout
                        return AppUtil.handleAPIErrorAlert(SensorLogic.errorMessages().outOfRange, 'Please Try Again!');
                    }
                    // TODO: THIS NEEDS TO BE FLUSHED OUT
                    let message = `rssi: ${err.rssi}\nreason: ${err.errorMapping.reason}\niosErrorCode: ${err.errorMapping.iosErrorCode}\nandroidErrorCode: ${err.errorMapping.androidErrorCode}\nattErrorCode: ${err.errorMapping.attErrorCode}`;
                    let header = `STOP! _handleWifiScan-exception hit. Code: ${err.errorMapping.errorCode} Message: ${err.errorMapping.message}`;
                    return AppUtil.handleAPIErrorAlert(message, header);
                });
            });
    }

    _onPageScrollEnd = currentPage => {
        const checkpointPages = [0, 1, 8, 11, 14, WIFI_PAGE_NUMBER];
        if(checkpointPages.includes(currentPage)) { // we're on a checkpoint page, update user obj
            this._updateUserCheckpoint(currentPage);
        }
        if(currentPage === 15) { // turn on BLE & connect to accessory
            if (Platform.OS === 'android') {
                ble.enable();
            }
            if (Platform.OS === 'android' && Platform.Version >= 23) {
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then(result => {
                    if (result) {
                        console.log('Permission is OK');
                    } else {
                        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
                            .then(res =>
                                this.setState({
                                    bleState: res === 'granted' ? 'PoweredOn' : res,
                                })
                            );
                    }
                });
            }
        } else if(currentPage === WIFI_PAGE_NUMBER) { // wifi list, start scan
            this._timer = _.delay(() => this._handleWifiScan(), 2000);
        } else if(currentPage === (WIFI_PAGE_NUMBER + 1)) { // after we've successfully completed our actions, exit kit setup
            this._timer = _.delay(() => this._handleDisconnection(false, () => ble.destroyInstance(), true), 2000);
        }
    }

    _renderNextPage = () => {
        let nextPageIndex = (this.state.pageIndex + 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    _renderPreviousPage = (numberOfPages = 1) => {
        let nextPageIndex = (this.state.pageIndex - numberOfPages);
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
                        { isSubmittingDetails: true, loading: true, },
                        () => this._connectSensorToWifi(),
                    );
                }, 500);
            },
        );
    }

    _toggleAlertNotification = () => {
        if(this.state.pageIndex === (WIFI_PAGE_NUMBER - 1)) {
            Alert.alert(
                '',
                'Did the LED turn green?',
                [
                    {
                        text:    'No',
                        onPress: () => this.setState({ isConnectingToSensor: false, }, () => this._handleDisconnection(false, () => this._renderPreviousPage())),
                        style:   'cancel',
                    },
                    {
                        text:    'Yes',
                        onPress: () => this.setState({ isConnectingToSensor: false, }, () => {this._timer = _.delay(() => this._renderNextPage(), 500)}),
                    },
                ],
                { cancelable: false, }
            );
        }
    }

    _toggleWeakRSSIAlertNotification = () => {
        // TODO: CONFIRM MESSAGE WITH BIZ TEAM
        Alert.alert(
            '',
            'Please bring your Kit closer to phone and try again.',
            [
                {
                    text:  'Try Again',
                    style: 'cancel',
                },
            ],
            { cancelable: false, }
        );
    }

    _toggleTimedoutBringCloserAlert = (destroyInstance, callback) => {
        if(destroyInstance) {
            clearTimeout(this._timer);
            this._timer = null;
            ble.destroyInstance();
        }
        Alert.alert(
            '',
            'We\'re not able to find your Kit. Try bringing your phone closer.',
            [
                {
                    text:    'Exit Tutorial',
                    onPress: () => this.setState({ isConnectingToSensor: false, }, () => this._handleDisconnection(false, () => callback && callback(true))),
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
            isSubmittingDetails,
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

                    {/* Placement Tutorial - pages 1-7 */}
                    <Placement
                        currentPage={pageIndex === 1}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={0}
                    />
                    <Placement
                        currentPage={pageIndex === 2}
                        handleAlertPress={() => this._handleAlertPress()}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={1}
                    />
                    <Placement
                        currentPage={pageIndex === 3}
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

                    {/* Calibration - pages 8-10 */}
                    <Calibration
                        currentPage={pageIndex === 8}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={0}
                    />
                    <Calibration
                        currentPage={pageIndex === 9}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={1}
                    />
                    <Calibration
                        currentPage={pageIndex === 10}
                        handleUpdateVolume={() => this.setState({ isVideoMuted: !this.state.isVideoMuted, })}
                        isVideoMuted={isVideoMuted}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={2}
                    />

                    {/* Session - pages 11-13 */}
                    <Session
                        currentPage={pageIndex === 11}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() => this._handleAlertHelper('RETURN TO TUTORIAL', 'after training to end your workout & sync your data! Tap here.', true)}
                        page={0}
                    />
                    <Session
                        currentPage={pageIndex === 12}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() => this._handleAlertHelper('RETURN TO TUTORIAL', 'after training to end your workout & sync your data! Tap here.', true)}
                        page={1}
                    />
                    <Session
                        currentPage={pageIndex === 13}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() => this._handleAlertHelper('RETURN TO TUTORIAL', 'after training to end your workout & sync your data! Tap here.', true)}
                        page={2}
                    />

                    {/* Connect - pages 14-17 */}
                    <Connect
                        currentPage={pageIndex === 14}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        onClose={() => this._handleAlertHelper('RETURN TO TUTORIAL', 'to connect to wifi and sync your data. Tap here.', true)}
                        page={0}
                    />
                    <Connect
                        currentPage={pageIndex === 15}
                        isLoading={isConnectingToSensor}
                        isNextDisabled={bleState !== 'PoweredOn'}
                        nextBtn={() => this.setState({ isConnectingToSensor: true, }, () => this._handleBLEPair())}
                        onBack={isConnectingToSensor ? null : () => this._handleSyncOnBack()}
                        onClose={() =>
                            this._handleDisconnection(false, () => this._handleAlertHelper('RETURN TO TUTORIAL', 'to connect to wifi and sync your data. Tap here.', true))
                        }
                        page={1}
                    />
                    <Connect
                        availableNetworks={availableNetworks}
                        currentPage={pageIndex === WIFI_PAGE_NUMBER}
                        handleNetworkPress={network => isDialogVisible || isSubmittingDetails ? {} : this._handleNetworkPress(network)}
                        handleNotInRange={() => isDialogVisible || isSubmittingDetails ? {} : this._handleWifiNotInRange()}
                        handleWifiScan={() => isDialogVisible || isSubmittingDetails ? {} : this._handleWifiScan()}
                        isWifiScanDone={isWifiScanDone}
                        nextBtn={this._renderNextPage}
                        onBack={() => {
                            this._handleDisconnection(false, () => {}, true);
                            this._renderPreviousPage();
                        }}
                        onClose={() =>{
                            this._handleDisconnection(false, () => {}, true);
                            this._handleAlertHelper('FINISH WIFI SET-UP TO SYNC YOUR DATA.', 'Tap here once in range of your preferred wifi.', false);
                        }}
                        page={3}
                    />
                    <Connect
                        currentPage={pageIndex === 17}
                        nextBtn={this._renderNextPage}
                        onClose={() => Actions.pop()}
                        page={4}
                    />

                    {/* Battery - page 18 */}
                    <Battery
                        currentPage={pageIndex === 18}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                    />

                    {/* End - page 19 */}
                    <Complete
                        currentPage={pageIndex === 19}
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

BluetoothConnect.propTypes = {
    assignKitIndividual: PropTypes.func.isRequired,
    bluetooth:           PropTypes.object.isRequired,
    getSensorFiles:      PropTypes.func.isRequired,
    network:             PropTypes.object.isRequired,
    updateUser:          PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};

BluetoothConnect.defaultProps = {};

BluetoothConnect.componentName = 'BluetoothConnect';

/* Export Component ================================================================== */
export default BluetoothConnect;