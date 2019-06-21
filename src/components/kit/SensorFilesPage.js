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
    View,
} from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import DialogInput from 'react-native-dialog-input';
import Toast, { DURATION } from 'react-native-easy-toast';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppUtil, SensorLogic, } from '../../lib';
import { Battery, Calibration, Connect, Placement, Session, } from './ConnectScreens';
import { Loading, } from '../general';
import { ListItem, Spacer, TabIcon, Text, } from '../custom';
import { store, } from '../../store';

// setup consts
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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
        assignKitIndividual:       PropTypes.func.isRequired,
        bluetooth:                 PropTypes.shape({}).isRequired,
        deviceFound:               PropTypes.func.isRequired,
        getAccessoryKey:           PropTypes.func.isRequired,
        getBLEMacAddress:          PropTypes.func.isRequired,
        getScannedWifiConnections: PropTypes.func.isRequired,
        getSensorFiles:            PropTypes.func.isRequired,
        getSingleWifiConnection:   PropTypes.func.isRequired,
        pageStep:                  PropTypes.string.isRequired,
        startDisconnection:        PropTypes.func.isRequired,
        startScan:                 PropTypes.func.isRequired,
        stopConnect:               PropTypes.func.isRequired,
        stopScan:                  PropTypes.func.isRequired,
        updateUser:                PropTypes.func.isRequired,
        user:                      PropTypes.shape({}).isRequired,
        writeWifiDetailsToSensor:  PropTypes.func.isRequired,
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
            isVideoMuted:          false,
            isWifiScanDone:        false,
            loading:               false,
            pageIndex:             0,
        };
        this._pages = {};
        this._timer = null;
        this.handleBLEUpdateState = this.handleBLEUpdateState.bind(this);
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
    }

    componentDidMount = () => {
        BleManager.start({ showAlert: false, });
        BleManager.checkState();
        this.handlerCheck = bleManagerEmitter.addListener('BleManagerDidUpdateState', args => this.handleBLEUpdateState(args));
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
    }

    componentWillUnmount = () => {
        this._pages = {};
        this._timer = null;
        this.handlerCheck.remove();
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
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

    handleStopScan = () => {
        this._toggleSensorsConnectedAlert();
    }

    _connect = data => {
        const { getAccessoryKey, getBLEMacAddress, startDisconnection, user, } = this.props;
        return getBLEMacAddress(data.id)
            .then(macAddress => getAccessoryKey(macAddress.data.macAddress))
            .then(response => {
                // TODO: CONFIRM WITH GABBY
                if(
                    !response.accessory.owner_id ||
                    (response.accessory.owner_id && response.accessory.owner_id !== user.id)
                ) {
                    return startDisconnection(data.id, true).then(() => this._handleBLEPair());
                }
                return this._toggleAlertNotification(data.id, user.id);
            })
            .catch(err => {
                if (
                    this.props.bluetooth.accessoryData &&
                    !this.props.bluetooth.accessoryData.sensor_pid &&
                    !this.props.bluetooth.accessoryData.mobile_udid &&
                    !this.props.bluetooth.accessoryData.wifiMacAddress
                ) {
                    this.refs.toast.show('Failed to PAIR to sensor', (DURATION.LENGTH_SHORT * 2));
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
                newUserPayloadObj['@sensor_data'] = {};
                newUserPayloadObj['@sensor_data'].sensor_pid = bluetooth.accessoryData.wifiMacAddress;
                newUserPayloadObj['@sensor_data'].mobile_udid = bluetooth.accessoryData.mobile_udid;
                newUserPayloadObj['@sensor_data'].sensor_networks = [currentWifiConnection.ssid];
                newUserPayloadObj['@sensor_data'].system_type = '3-sensor';
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
                    .then(() => getSensorFiles(newUserObj)) // 3. grab sensor files as they may have changed
                    .then(() => startDisconnection(sensorId, true)) // 4. disconnect from sensor
                    .then(() => this.setState({ loading: false, }, () => {this._timer = _.delay(() => this._renderNextPage(), 500)} )) // 5. route to next page
                    .catch(err => this.setState({ loading: false, }, () => {this._timer = _.delay(() => AppUtil.handleAPIErrorAlert(err), 500)} ));
            })
            .catch(err => this.setState({ loading: false, }, () => {this._timer = _.delay(() => AppUtil.handleAPIErrorAlert(err), 500)} ));
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

    _handleDisconnection = callback => {
        const { bluetooth, startDisconnection, } = this.props;
        startDisconnection(bluetooth.accessoryData.sensor_pid, true)
            .then(() => callback())
            .catch(() => callback());
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

    _handleNotInRange = () => {
        Alert.alert(
            '',
            'IF WIFI LED BLINKING RED:\nYour Kit is not finding the configured wifi network. Move within wifi range.\n\nIF WIFI LED OFF:\n1. Come within range of the Wifi network configured on your Kit\n\n2. Click the button to wake your Kit\n\n3. Wait for the Wifi LED to respond\n\nIf the Wifi LED is still off, this may mean you don\'t have any files to sync.\nIf the Battery LED is red or off, you\'ll need to charge your Kit. Let it charge while in wifi to sync automatically.  ',
            [
                {
                    text:  'OK',
                    style: 'cancel',
                },
            ],
            { cancelable: false, }
        );
    }

    _handleSingleWifiConnectionFetch = (sensorId, numberOfConnections, currentIndex) => {
        const { getSingleWifiConnection, } = this.props;
        getSingleWifiConnection(sensorId, currentIndex)
            .then(res => {
                let newAvailableNetworks = _.cloneDeep(this.state.availableNetworks);
                newAvailableNetworks.push(res);
                newAvailableNetworks = _.uniqBy(newAvailableNetworks, 'ssid');
                newAvailableNetworks = _.filter(newAvailableNetworks, o => o.ssid.length > 0);
                return this.setState(
                    { availableNetworks: newAvailableNetworks, },
                    () => {
                        if(currentIndex === numberOfConnections) {
                            this.setState({ isWifiScanDone: true, });
                        } else {
                            _.delay(() => this._handleSingleWifiConnectionFetch(sensorId, numberOfConnections, (currentIndex + 1)), 750);
                        }
                    }
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
    };

    _handleStopScan = () => {
        const { stopScan, } = this.props;
        return stopScan();
    }

    _handleWifiNotInRange = () => {
        Alert.alert(
            '',
            'To configure wifi, your Kit needs to be in range of the network. If not currently in range, please set up wifi later to sync your training data.',
            [
                {
                    text:    'I\'ll do it later',
                    onPress: () => this._handleDisconnection(() => Actions.pop()),
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
        const { pageStep, } = this.props;
        if(currentPage === 0 && pageStep === 'connect') { // turn on BLE & connect to accessory
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
        } else if(currentPage === 2 && pageStep === 'connect') { // wifi list, start scan
            this._timer = _.delay(() => this._handleWifiScan(), 1500);
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
                    onPress: () => this.setState({ isConnectingToSensor: false, } , () => this._renderNextPage()),
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
        return this._toggleTimedoutBringCloserAlert(() => this._renderPreviousPage());
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

    render = () => {
        const { pageStep, user, } = this.props;
        const {
            availableNetworks,
            bleState,
            currentWifiConnection,
            isConnectingToSensor,
            isDialogVisible,
            isVideoMuted,
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
                                isNextDisabled={bleState !== 'on' || isConnectingToSensor}
                                nextBtn={() => this.setState({ isConnectingToSensor: true, }, () => this._handleBLEPair())}
                                page={1}
                                showTopNavStep={false}
                            />
                            <Connect
                                availableNetworks={availableNetworks}
                                currentPage={pageIndex === 1}
                                handleNetworkPress={network => this._handleNetworkPress(network)}
                                handleNotInRange={() => this._handleWifiNotInRange()}
                                handleWifiScan={() => this._handleWifiScan()}
                                isWifiScanDone={isWifiScanDone}
                                nextBtn={this._renderNextPage}
                                onBack={this._renderPreviousPage}
                                page={3}
                                showTopNavStep={false}
                            />
                            <Connect
                                currentPage={pageIndex === 2}
                                nextBtn={() => Actions.pop()}
                                onBack={this._renderPreviousPage}
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
                                    nextBtn={this._renderNextPage}
                                    page={1}
                                    showTopNavStep={false}
                                />
                                <Calibration
                                    currentPage={pageIndex === 1}
                                    handleUpdateVolume={() => this.setState({ isVideoMuted: !this.state.isVideoMuted, })}
                                    isVideoMuted={isVideoMuted}
                                    nextBtn={() => Actions.pop()}
                                    onBack={this._renderPreviousPage}
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
                                        page={1}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 1}
                                        handleAlertPress={() => this._handleAlertPress()}
                                        nextBtn={this._renderNextPage}
                                        onBack={this._renderPreviousPage}
                                        page={2}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 2}
                                        nextBtn={this._renderNextPage}
                                        onBack={this._renderPreviousPage}
                                        page={3}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 3}
                                        nextBtn={this._renderNextPage}
                                        onBack={this._renderPreviousPage}
                                        page={4}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 4}
                                        nextBtn={this._renderNextPage}
                                        onBack={this._renderPreviousPage}
                                        page={5}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 5}
                                        nextBtn={this._renderNextPage}
                                        onBack={this._renderPreviousPage}
                                        page={6}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 6}
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
            );
        }
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1, flexDirection: 'column', justifyContent: 'space-between',}}>
                <TopNavBar />
                <View style={{flex: 1,}}>
                    <Text oswaldRegular style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{'RECORDED WORKOUTS'}</Text>
                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginHorizontal: AppSizes.padding, marginVertical: AppSizes.padding, textAlign: 'center',}}>{'Here you\'ll find the upload & processing status of all workouts tracked with the Fathom PRO Kit!\n\nIf you don\'t see a workout, make sure your system is charged & in a paired wifi network to start upload.'}</Text>
                    <Spacer isDivider />
                    { user && user.sensor_data && user.sensor_data.sessions.length > 0 ?
                        <ScrollView contentContainerStyle={{flexGrow: 1,}}>
                            {_.map(user.sensor_data.sessions, (session, key) => {
                                const {
                                    iconName,
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
                <Text
                    onPress={() => Actions.sensorFilesPage({ pageStep: 'session', })}
                    robotoMedium
                    style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14), paddingVertical: AppSizes.padding, textAlign: 'center',}}
                >
                    {'Remind me how to update data'}
                </Text>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default SensorFilesPage;
