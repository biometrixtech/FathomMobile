/**
 * SensorFilesPage View
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    BackHandler,
    Keyboard,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
} from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import { BleManager, } from 'react-native-ble-plx';
import DialogInput from 'react-native-dialog-input';
import Toast, { DURATION } from 'react-native-easy-toast';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppUtil, SensorLogic, } from '../../lib';
import { Battery, Calibration, Connect, Placement, Session, } from './ConnectScreens';
import { Loading, } from '../general';
import { ListItem, Spacer, TabIcon, Text, } from '../custom';
import { ble, } from '../../actions';
import { store, } from '../../store';

/* Component ==================================================================== */
const TopNavBar = () => (
    <View>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={{backgroundColor: AppColors.white, flexDirection: 'row', marginHorizontal: AppSizes.padding, marginTop: AppSizes.statusBarHeight, paddingVertical: AppSizes.paddingSml,}}>
            <View style={{flex: 1, justifyContent: 'center',}}>
                <TabIcon
                    color={AppColors.zeplin.slateLight}
                    icon={'chevron-left'}
                    onPress={() => Actions.pop()}
                    size={40}
                />
            </View>
            <View style={{flex: 8, justifyContent: 'center',}} />
            <View style={{flex: 1, justifyContent: 'center',}} />
        </View>
    </View>
);

class SensorFilesPage extends Component {
    static componentName = 'SensorFilesPage';

    static propTypes = {
        assignKitIndividual: PropTypes.func.isRequired,
        bluetooth:           PropTypes.shape({}).isRequired,
        getSensorFiles:      PropTypes.func.isRequired,
        pageStep:            PropTypes.string.isRequired,
        updateUser:          PropTypes.func.isRequired,
        user:                PropTypes.shape({}).isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            availableNetworks:     [],
            bleState:              '',
            currentWifiConnection: false,
            isConnectingToSensor:  false,
            isDialogVisible:       false,
            isVideoPaused:         false,
            isWifiScanDone:        false,
            loading:               false,
            pageIndex:             0,
        };
        this._isMounted = false;
        this._pages = {};
        this._timer = null;
    }

    componentDidMount = () => {
        this._isMounted = true;
        if(this.state.pageIndex === 0 && this.props.pageStep === 'connect') { // turn on BLE & connect to accessory
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
        }
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        // monitor when the BLE state changes
        ble.startMonitor(state => this.setState({ bleState: state, }));
    }

    componentWillUnmount = () => {
        this._pages = {};
        ble.destroyInstance();
        clearInterval(this._timer);
        this._isMounted = false;
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
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
                        return this._toggleTimedoutBringCloserAlert(false, isExit => _.delay(() => isExit ? Actions.pop() : this._renderPreviousPage(), 500));
                    } else if(err.isConnected && (err.errorMapping.errorCode === -1 || !err.errorMapping.errorCode)) {
                        return AppUtil.handleAPIErrorAlert(SensorLogic.errorMessages().errorWifiConnection, 'Please Try Again');
                    }
                    // TODO: THIS NEEDS TO BE FLUSHED OUT
                    // let message = `rssi: ${err.rssi}\nreason: ${err.errorMapping.reason}\niosErrorCode: ${err.errorMapping.iosErrorCode}\nandroidErrorCode: ${err.errorMapping.androidErrorCode}\nattErrorCode: ${err.errorMapping.attErrorCode}`;
                    // let header = `STOP! _connectSensorToWifi-exception hit. Code: ${err.errorMapping.errorCode} Message: ${err.errorMapping.message}`;
                    // return AppUtil.handleAPIErrorAlert(message, header);
                    return console.log(err);
                }, 500));
            });
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
                    return this._handleDisconnection(device, () => this._renderPreviousPage(), false, true);
                }
                return this._toggleTimedoutBringCloserAlert(true, () => ble.startMonitor(newState => this.setState({ bleState: newState, })));
            }
            if(
                !response.accessory.owner_id ||
                (response.accessory.owner_id && response.accessory.owner_id !== this.props.user.id)
            ) {
                return this._handleDisconnection(device, () => this._handleBLEPair(), false, false);
            }
            clearTimeout(this._timer);
            return this._toggleAlertNotification();
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
                        if(!device) {
                            return callback && callback();
                        }
                    }
                    return ble.exitKitSetup(device)
                        .then(res => callback && callback())
                        .catch(err => {
                            if(!this._isMounted) {
                                return '';
                            }
                            // TODO: THIS NEEDS TO BE FLUSHED OUT
                            // let message = `rssi: ${err.rssi}\nreason: ${err.errorMapping.reason}\niosErrorCode: ${err.errorMapping.iosErrorCode}\nandroidErrorCode: ${err.errorMapping.androidErrorCode}\nattErrorCode: ${err.errorMapping.attErrorCode}`;
                            // let header = `STOP! _handleDisconnection-exitKitSetup-exception hit. Code: ${err.errorMapping.errorCode} Message: ${err.errorMapping.message}`;
                            // AppUtil.handleAPIErrorAlert(message, header);
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
                        // TODO: THIS NEEDS TO BE FLUSHED OUT
                        // let errorObj = await ble.handleError(err, device);
                        // let message = `rssi: ${err.rssi}\nreason: ${errorObj.errorMapping.reason}\niosErrorCode: ${errorObj.errorMapping.iosErrorCode}\nandroidErrorCode: ${errorObj.errorMapping.androidErrorCode}\nattErrorCode: ${errorObj.errorMapping.attErrorCode}`;
                        // let header = `STOP! _handleDisconnection-cancelConnection-exception hit. Code: ${errorObj.errorMapping.errorCode} Message: ${errorObj.errorMapping.message}`;
                        // AppUtil.handleAPIErrorAlert(message, header);
                        return callback && callback();
                    });
            }
        );
    }

    _handleNotInRange = () => {
        Alert.alert(
            '',
            'You may be out of range of your preferred network. If you have data on your kit pending upload, bring your kit into range of your preferred network.\n\nIf you do not have any recent workouts to upload, you do not need to be in range of your preferred network.',
            [
                {
                    text:  'OK',
                    style: 'cancel',
                },
            ],
            { cancelable: false, }
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
                        return this._toggleTimedoutBringCloserAlert(false, isExit => _.delay(() => isExit ? Actions.pop() : this._renderPreviousPage(), 500));
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
                        this._handleDisconnection(false, () => Actions.pop(), true);
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
                        return this._toggleTimedoutBringCloserAlert(false, isExit => _.delay(() => isExit ? Actions.pop() : this._renderPreviousPage(), 500));
                    } else if(err.errorMapping.errorCode === -1) {
                        // timedout
                        return AppUtil.handleAPIErrorAlert(SensorLogic.errorMessages().outOfRange, 'Please Try Again!');
                    }
                    // TODO: THIS NEEDS TO BE FLUSHED OUT
                    // let message = `rssi: ${err.rssi}\nreason: ${err.errorMapping.reason}\niosErrorCode: ${err.errorMapping.iosErrorCode}\nandroidErrorCode: ${err.errorMapping.androidErrorCode}\nattErrorCode: ${err.errorMapping.attErrorCode}`;
                    // let header = `STOP! _handleWifiScan-exception hit. Code: ${err.errorMapping.errorCode} Message: ${err.errorMapping.message}`;
                    // return AppUtil.handleAPIErrorAlert(message, header);
                    return console.log(err);
                });
            });
    }

    _onPageScrollEnd = currentPage => {
        const { pageStep, } = this.props;
        if(currentPage === 1 && pageStep === 'connect') { // wifi list, start scan
            this._timer = _.delay(() => this._handleWifiScan(), 2000);
        } else if(currentPage === 2 && pageStep === 'connect') { // after we've successfully completed our actions, exit kit setup
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
        if(this.state.pageIndex === 0 && this.props.pageStep === 'connect') {
            Alert.alert(
                '',
                'Did the LED turn green?',
                [
                    {
                        text:    'No',
                        onPress: () => this.setState({ isConnectingToSensor: false, }, () => this._handleDisconnection(false, () => {})),
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

    render = () => {
        const { pageStep, user, } = this.props;
        const {
            availableNetworks,
            bleState,
            currentWifiConnection,
            isConnectingToSensor,
            isDialogVisible,
            isSubmittingDetails,
            isVideoPaused,
            isWifiScanDone,
            pageIndex,
        } = this.state;
        if(pageStep !== 'sessions') {
            return(
                <View style={{backgroundColor: AppColors.white, flex: 1,}}>
                    { pageStep === 'connect' ?
                        <Pages
                            containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                            indicatorPosition={'none'}
                            onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)}
                            ref={pages => { this._pages = pages; }}
                            scrollEnabled={false}
                            startPage={pageIndex}
                        >
                            <Connect
                                currentPage={pageIndex === 0}
                                isLoading={isConnectingToSensor}
                                isNextDisabled={bleState !== 'PoweredOn'}
                                nextBtn={() => this.setState({ isConnectingToSensor: true, }, () => this._handleBLEPair())}
                                onClose={() => this._handleDisconnection(false, () => Actions.pop(), true)}
                                page={1}
                                showTopNavStep={false}
                            />
                            <Connect
                                availableNetworks={availableNetworks}
                                currentPage={pageIndex === 1}
                                handleNetworkPress={network => isDialogVisible || isSubmittingDetails ? {} : this._handleNetworkPress(network)}
                                handleNotInRange={() => isDialogVisible || isSubmittingDetails ? {} : this._handleWifiNotInRange()}
                                handleWifiScan={() => isDialogVisible || isSubmittingDetails ? {} : this._handleWifiScan()}
                                isWifiScanDone={isWifiScanDone}
                                nextBtn={this._renderNextPage}
                                onBack={() => {
                                    this._handleDisconnection(false, () => {}, true);
                                    this._renderPreviousPage();
                                }}
                                onClose={() => {
                                    this._handleDisconnection(false, () => {}, true);
                                    Actions.pop();
                                }}
                                page={3}
                                showTopNavStep={false}
                            />
                            <Connect
                                currentPage={pageIndex === 2}
                                nextBtn={() => Actions.pop()}
                                page={4}
                                showTopNavStep={false}
                            />
                        </Pages>
                        : pageStep === 'calibrate' ?
                            <Pages
                                containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                                indicatorPosition={'none'}
                                ref={pages => { this._pages = pages; }}
                                scrollEnabled={false}
                                startPage={pageIndex}
                            >
                                <Calibration
                                    currentPage={pageIndex === 0}
                                    handleUpdatePauseState={() => this.setState({ isVideoPaused: !this.state.isVideoPaused, })}
                                    isVideoPaused={isVideoPaused}
                                    nextBtn={() => Actions.pop()}
                                    page={2}
                                    showTopNavStep={false}
                                />
                            </Pages>
                            : pageStep === 'placement' ?
                                <Pages
                                    containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                                    indicatorPosition={'none'}
                                    ref={pages => { this._pages = pages; }}
                                    scrollEnabled={false}
                                    startPage={pageIndex}
                                >
                                    <Placement
                                        currentPage={pageIndex === 0}
                                        nextBtn={this._renderNextPage}
                                        page={4}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 1}
                                        nextBtn={this._renderNextPage}
                                        onBack={this._renderPreviousPage}
                                        page={5}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 2}
                                        nextBtn={this._renderNextPage}
                                        onBack={this._renderPreviousPage}
                                        page={6}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 3}
                                        nextBtn={() => Actions.pop()}
                                        onBack={this._renderPreviousPage}
                                        page={7}
                                        showTopNavStep={false}
                                    />
                                </Pages>
                                : pageStep === 'end' ?
                                    <Pages
                                        containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                                        indicatorPosition={'none'}
                                        ref={pages => { this._pages = pages; }}
                                        scrollEnabled={false}
                                        startPage={pageIndex}
                                    >
                                        <Session
                                            currentPage={pageIndex === 0}
                                            nextBtn={this._renderNextPage}
                                            page={1}
                                            showTopNavStep={false}
                                        />
                                        <Session
                                            currentPage={pageIndex === 1}
                                            nextBtn={this._renderNextPage}
                                            onBack={this._renderPreviousPage}
                                            page={2}
                                            showTopNavStep={false}
                                        />
                                        <Connect
                                            currentPage={pageIndex === 2}
                                            handleNotInRange={() => this._handleNotInRange()}
                                            nextBtn={() => Actions.pop()}
                                            onBack={this._renderPreviousPage}
                                            page={5}
                                            showTopNavStep={false}
                                        />
                                    </Pages>
                                    : pageStep === 'battery' ?
                                        <Battery
                                            currentPage={true}
                                            showTopNavStep={false}
                                        />
                                        : pageStep === 'session' ?
                                            <Connect
                                                currentPage={true}
                                                handleNotInRange={() => this._handleNotInRange()}
                                                page={5}
                                                showTopNavStep={false}
                                            />
                                            :
                                            <View />
                    }

                    <Toast
                        position={'bottom'}
                        ref={'toast'}
                    />

                    <DialogInput
                        closeDialog={() => this.setState({ currentWifiConnection: false, isDialogVisible: false, })}
                        dialogStyle={{marginBottom: 100,}}
                        isDialogVisible={isDialogVisible}
                        message={`"${currentWifiConnection ? currentWifiConnection.ssid : ''}"`}
                        modalStyle={{backgroundColor: `${AppColors.zeplin.darkNavy}CC`,}}
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
            );
        }
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1, flexDirection: 'column', justifyContent: 'space-between',}}>
                <TopNavBar />
                <View style={{flex: 1,}}>
                    <Text oswaldRegular style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{'RECORDED WORKOUTS'}</Text>
                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginHorizontal: AppSizes.padding, marginVertical: AppSizes.padding, textAlign: 'center',}}>{'Here you\'ll find the upload & processing status of all workouts tracked with the Fathom PRO Kit!\n\nIf you don\'t see a workout, make sure your system is charged & in a paired wifi network to start upload.'}</Text>
                    <Spacer isDivider />
                    { user && user.sensor_data && user.sensor_data.sessions && user.sensor_data.sessions.length > 0 ?
                        <ScrollView contentContainerStyle={{flexGrow: 1,}}>
                            {_.map(user.sensor_data.sessions, (session, key) => {
                                const {
                                    iconName,
                                    iconType,
                                    leftIconString,
                                    subtitle,
                                    title,
                                } = SensorLogic.handleSessionRenderLogic(session);
                                return (
                                    <View key={key}>
                                        <ListItem
                                            containerStyle={{paddingVertical: AppSizes.padding,}}
                                            leftIcon={
                                                <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.superLight, borderRadius: (40 / 2), height: 40, justifyContent: 'center', width: 40,}}>
                                                    <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{leftIconString}</Text>
                                                </View>
                                            }
                                            subtitle={
                                                <View style={{alignItems: 'center', flexDirection: 'row', paddingLeft: AppSizes.paddingMed,}}>
                                                    { iconName &&
                                                        <TabIcon
                                                            color={AppColors.zeplin.slateXLight}
                                                            containerStyle={[{marginRight: AppSizes.paddingXSml,}]}
                                                            icon={iconName}
                                                            size={AppFonts.scaleFont(15)}
                                                            type={iconType}
                                                        />
                                                    }
                                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{subtitle}</Text>
                                                </View>
                                            }
                                            title={title}
                                            titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                                            titleStyle={{...AppStyles.oswaldRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
                                        />
                                        <Spacer isDivider />
                                    </View>
                                )
                            })}
                        </ScrollView>
                        :
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                            <Text oswaldRegular style={{color: AppColors.zeplin.slateXLight, fontSize: AppFonts.scaleFont(33), textAlign: 'center',}}>{'NO WORKOUTS YET!'}</Text>
                        </View>
                    }
                </View>
                <TouchableOpacity
                    onPress={() => Actions.sensorFilesPage({ pageStep: 'session', })}
                    style={{paddingVertical: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}
                >
                    <Text
                        robotoMedium
                        style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14), textAlign: 'center', textDecorationLine: 'underline',}}
                    >
                        {'Remind me how to update data'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default SensorFilesPage;
