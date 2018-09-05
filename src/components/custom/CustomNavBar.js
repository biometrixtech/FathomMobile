/**
 * CustomNavBar
 *
     <CustomNavBar />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    AppState,
    Easing,
    Image,
    NativeEventEmitter,
    NativeModules,
    PermissionsAndroid,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppSizes, AppStyles, AppFonts, } from '../../constants';
import { TabIcon, Text, } from './';
import { store } from '../../store';
import { bleUtils } from '../../constants/utils';
import { AppUtil } from '../../lib';
import { ble as BLEActions, } from '../../actions';
import { Button, } from './'; // TODO: remove when done validating sensor data

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import Egg from 'react-native-egg'; // TODO: remove when done validating sensor data
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Modal from 'react-native-modalbox'; // TODO: remove when done validating sensor data
import Toast, { DURATION } from 'react-native-easy-toast';
import moment from 'moment';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.white,
        flexDirection:   'row',
        height:          AppSizes.navbarHeight,
    },
});

/* Component ==================================================================== */
class CustomNavBar extends Component {
    static propTypes = {}

    static defaultProps = {}

    constructor(props) {
        super(props);
        let currentState = store.getState();
        let fetchBleData = (
            currentState.ble.accessoryData &&
            currentState.ble.accessoryData.sensor_pid &&
            currentState.ble.accessoryData.mobile_udid === AppUtil.getDeviceUUID() &&
            this.props.routeName === 'home'
        ) ?
            true
            :
            false;
        let bleImageToDisplay = fetchBleData ?
            require('../../../assets/images/sensor/sensor.png')
            :
            null;
        this.state = {
            BLEData: {
                animated:  false,
                bleImage:  bleImageToDisplay,
                isFetched: false,
            },
            bluetoothOn:     currentState.ble.bluetoothOn || false,
            fetchBleData:    fetchBleData,
            isModalOpen:     false, // TODO: remove when done validating sensor data
            isSensorUIOpen:  false,
            storedPractices: [], // TODO: remove when done validating sensor data
        }
        this.handleBleStateChange = this.handleBleStateChange.bind(this);

        this._interval = null;
    }

    componentWillMount = () => {
        // trigger check state
        BleManager.checkState();
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidMount = () => {
        StatusBar.setBarStyle('dark-content');
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor(AppColors.primary.grey.twentyPercent);
        }
        this.handlerState = bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleBleStateChange);
        AppState.addEventListener('change', this._handleAppStateChange);
        // start bluetooth related items
        this._startBluetooth();
        if(this.state.fetchBleData) {
            this._triggerBLESteps(true);
        }
        // TODO: remove when done validating sensor data
        AppUtil._retrieveAsyncStorageData('practices')
            .then(practices => {
                console.log('practices',practices);
                this.setState({ storedPractices: practices && practices.length > 0 ? practices : [], })
            });
    }

    componentWillUnmount = () => {
        this.handlerState.remove();
        this._handleClearInterval();
    }

    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps, this.props) && nextProps.routeName === 'home') {
            let currentState = store.getState();
            if(
                currentState.ble.accessoryData &&
                currentState.ble.accessoryData.sensor_pid &&
                currentState.ble.accessoryData.mobile_udid === AppUtil.getDeviceUUID()
            ) {
                this.setState(
                    {
                        BLEData: {
                            animated: false,
                            bleImage: require('../../../assets/images/sensor/sensor.png'),
                        },
                        bluetoothOn:    currentState.ble.bluetoothOn || false,
                        fetchBleData:   true,
                        isSensorUIOpen: false,
                    },
                    () => this._triggerBLESteps(true)
                );
            } else {
                this.setState(
                    {
                        BLEData: {
                            animated: false,
                            bleImage: null,
                        },
                        bluetoothOn:    currentState.ble.bluetoothOn || false,
                        fetchBleData:   false,
                        isSensorUIOpen: false,
                    },
                );
            }
        }
    }

    _handleClearInterval = () => {
        clearInterval(this._interval);
    }

    _handleSetInterval = () => {
        this._interval = setInterval(() => {
            this._triggerBLESteps();
        }, 30000);
    }

    _handleAppStateChange = nextAppState => {
        if(nextAppState === 'active') {
            this._triggerBLESteps(true);
        } else if(nextAppState === 'background') {
            this._handleClearInterval();
        }
    }

    _triggerBLESteps = (openSensorStatusUI = false) => {
        this._handleClearInterval();
        this.setState({ isFetched: false, isSensorUIOpen: openSensorStatusUI ? openSensorStatusUI : this.state.isSensorUIOpen, });
        bleUtils.handleBLESingleSensorStatus(store.getState().ble)
            .then(sensorStatusResponse => {
                console.log(sensorStatusResponse.sensorStatusResults);
                if(sensorStatusResponse.sensorStatusResults.numberOfPractices > 0) {
                    this.setState({
                        BLEData: {
                            animated: true,
                            bleImage: require('../../../assets/images/sensor/sensor-operation.png'),
                        }
                    }, () => {
                        bleUtils.handleBLESteps(store.getState().ble, store.getState().user.id)
                            .then(BLEData => {
                                this.setState({ BLEData, isFetched: true, isSensorUIOpen: openSensorStatusUI ? openSensorStatusUI : this.state.isSensorUIOpen, });
                                this.refs.toast.show('SENSOR SYNCED', DURATION.LENGTH_LONG);
                                this._handleSetInterval();
                            })
                            .catch(BLEData => {
                                this.setState({ BLEData, isFetched: true, isSensorUIOpen: openSensorStatusUI ? openSensorStatusUI : this.state.isSensorUIOpen, });
                                this._handleSetInterval();
                            });
                    });
                } else {
                    this.setState({ isFetched: true, isSensorUIOpen: openSensorStatusUI ? openSensorStatusUI : this.state.isSensorUIOpen, });
                    this._handleSetInterval();
                }
            })
            .catch(err => {
                this.setState({ isFetched: true, });
                this._handleSetInterval();
            });
    }

    handleBleStateChange = (data) => {
        this.setState({
            bluetoothOn: data.state === 'on' ? true : false,
        }, () => {
            store.dispatch({
                type: DispatchActions.CHANGE_STATE,
                data: data.state,
            });
        });
    }

    _startBluetooth = () => {
        return BLEActions.startBluetooth()
            .then(() => {
                BleManager.checkState();
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
                            return navigator.geolocation.getCurrentPosition((position) => BleManager.enableBluetooth(), error => console.log(error), { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
                        })
                        .catch((error) => {
                            console.log(error.message);
                            return Promise.reject(error);
                        });
                }
                return Promise.resolve();
            })
            .catch(error => {
                console.log('error starting bluetooth');
            });
    }

    _renderLeft = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', paddingLeft: AppSizes.paddingXSml}}>
                { this.props.routeName === 'onboarding' && !store.getState().user.id ?
                    <TabIcon
                        icon={'arrow-left'}
                        iconStyle={[{color: AppColors.black,}]}
                        onPress={Actions.currentParams.onLeft}
                        reverse={false}
                        size={26}
                        type={'simple-line-icon'}
                    />
                    : Actions.currentParams.onLeft && this.props.routeName !== 'onboarding' ?
                        <TabIcon
                            icon={this.props.routeName === 'home' ? 'settings' : 'arrow-left'}
                            iconStyle={[{color: AppColors.black,}]}
                            onPress={Actions.currentParams.onLeft}
                            reverse={false}
                            size={26}
                            type={this.props.routeName === 'home' ? 'material-community' : 'simple-line-icon'}
                        />
                        :
                        null
                }
            </View>
        )
    }

    _renderMiddle = () => {
        if(this.props.routeName === 'home') {
            // TODO: remove EGG and update image styles when done validating sensor data
            return (
                <Egg
                    onCatch={() => this.setState({ isModalOpen: true, })}
                    setps={'TTT'}
                    style={{alignItems: 'center', flex: 8, justifyContent: 'center'}}
                >
                    <Image
                        source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                        // style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
                        style={[AppStyles.navbarImageTitle,]}
                    />
                </Egg>
            )
        }
        return (
            <View style={{flex: 8, justifyContent: 'center',}}>
                <Text style={[AppStyles.h3, {color: AppColors.black, textAlign: 'center'}]}>{Actions.currentParams.title}</Text>
            </View>
        )
    }

    _renderRight = () => {
        if(this.props.routeName === 'home') {
            return(
                this.state.fetchBleData ?
                    this._renderSensorImage()
                    :
                    <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingXSml,}}></View>
            );
        }
        return(<View style={{flex: 1}}></View>)
    }

    _renderSensorImage = () => {
        // set animated values
        const spinValue = new Animated.Value(0);
        const iconGrow = new Animated.Value(0);
        // First set up animation
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    duration:        3000,
                    easing:          Easing.linear,
                    toValue:         1,
                    useNativeDriver: true,
                }
            )
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(
                    iconGrow,
                    {
                        duration:        2000,
                        easing:          Easing.ease,
                        toValue:         1,
                        useNativeDriver: true,
                    }
                ),
                Animated.timing(
                    iconGrow,
                    {
                        duration:        2000,
                        easing:          Easing.ease,
                        toValue:         0,
                        useNativeDriver: true,
                    }
                ),
            ])
        ).start();
        // Second interpolate beginning and end values (in this case 0 and 1)
        const spin = spinValue.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        const scaleIcon = iconGrow.interpolate({
            inputRange:  [0, 1],
            outputRange: [0.5, 1],
        });
        // set other variables
        const imageWidth = 26;
        const indicatorSize = 10;
        return(
            <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingXSml,}}>
                { this.state.bluetoothOn && this.state.BLEData.bleImage && this.state.BLEData.animated ?
                    <Animated.Image
                        resizeMode={'contain'}
                        source={this.state.BLEData.bleImage}
                        style={{transform: [{rotate: spin}], width: imageWidth,}}
                    />
                    : this.state.bluetoothOn && this.state.BLEData.bleImage && !this.state.BLEData.animated ?
                        <TouchableOpacity
                            onPress={() =>
                                this.setState(
                                    { isSensorUIOpen: !this.state.isSensorUIOpen },
                                )
                            }
                            style={{width: imageWidth}}
                        >
                            <Image
                                resizeMode={'contain'}
                                source={this.state.BLEData.bleImage}
                                style={{width: imageWidth,}}
                            />
                            { this.state.isFetched && store.getState().ble.systemStatus === 1 ?
                                <TabIcon
                                    containerStyle={[{
                                        borderRadius: (indicatorSize + 10) / 2,
                                        height:       (indicatorSize + 10),
                                        position:     'absolute',
                                        right:        0,
                                        top:          0,
                                    }]}
                                    icon={'bolt'}
                                    iconStyle={[{color: bleUtils.systemStatusMapping(store.getState().ble.systemStatus),}]}
                                    onPress={() =>
                                        this.setState(
                                            { isSensorUIOpen: !this.state.isSensorUIOpen },
                                        )
                                    }
                                    reverse={false}
                                    size={(indicatorSize + 10)}
                                    type={'font-awesome'}
                                />
                                : this.state.isFetched && store.getState().ble.systemStatus === 2 ?
                                    <Animated.View
                                        style={{
                                            backgroundColor: bleUtils.systemStatusMapping(store.getState().ble.systemStatus),
                                            borderRadius:    indicatorSize / 2,
                                            height:          indicatorSize,
                                            position:        'absolute',
                                            right:           0,
                                            top:             2,
                                            transform:       [{scale: scaleIcon}],
                                            width:           indicatorSize,
                                        }}
                                    />
                                    : this.state.isFetched ?
                                        <View
                                            style={{
                                                backgroundColor: bleUtils.systemStatusMapping(store.getState().ble.systemStatus),
                                                borderRadius:    indicatorSize / 2,
                                                height:          indicatorSize,
                                                position:        'absolute',
                                                right:           0,
                                                top:             4,
                                                width:           indicatorSize,
                                            }}
                                        />
                                        :
                                        null
                            }
                        </TouchableOpacity>
                        : !this.state.bluetoothOn ?
                            <TabIcon
                                icon={'bluetooth-off'}
                                iconStyle={[{color: AppColors.black,}]}
                                onPress={() => this._startBluetooth()}
                                reverse={false}
                                size={imageWidth}
                                type={'material-community'}
                            />
                            :
                            <View style={{width: imageWidth}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={this.state.BLEData.bleImage}
                                    style={{width: imageWidth,}}
                                />
                                <View
                                    style={{
                                        backgroundColor: AppColors.sensor.notConnected,
                                        borderRadius:    10 / 2,
                                        height:          10,
                                        position:        'absolute',
                                        right:           0,
                                        top:             4,
                                        width:           10,
                                    }}
                                />
                            </View>
                }
            </View>
        )
    }

    _renderSensorUI = () => {
        // set animated values
        const spinValue = new Animated.Value(0);
        // First set up animation
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    duration:        3000,
                    easing:          Easing.linear,
                    toValue:         1,
                    useNativeDriver: true,
                }
            )
        ).start();
        // Second interpolate beginning and end values (in this case 0 and 1)
        const spin = spinValue.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        let currentState = store.getState();
        let bleStore = currentState.ble;
        let planStore = currentState.plan.dailyPlan && currentState.plan.dailyPlan.length > 0 ? currentState.plan.dailyPlan[0] : false;
        let sensorStatusBarObj = bleUtils.sensorStatusBar(bleStore.systemStatus, bleStore.batteryCharge);
        let batteryIconChargeLevelRounded = _.round(bleStore.batteryCharge, -1);
        let batteryIconChargeLevel = batteryIconChargeLevelRounded === 100 ? 'battery-full' : `battery-${batteryIconChargeLevelRounded}`;
        let batteryIconType = batteryIconChargeLevelRounded === 100 ? 'material' : 'material-community';
        let now = moment();
        let last_sync = moment(planStore.last_sensor_sync).toISOString();
        let lastSyncDaysDiff = now.diff(last_sync, 'days');
        let lastSyncHoursDiff = now.diff(last_sync, 'hours');
        let daysDiff = lastSyncDaysDiff === 0 ? `${lastSyncHoursDiff}${lastSyncHoursDiff === 1 ? 'hr' : 'hrs'} ago` : `${lastSyncDaysDiff}${lastSyncDaysDiff === 1 ? 'day' : 'days'} ago`;
        let notchHeightWidth = 24;
        return(
            <View>
                <View style={{backgroundColor: AppColors.white, flexDirection: 'row', height: (notchHeightWidth / 2)}}>
                    <View style={{flex: 1,}} />
                    <View style={{flex: 8,}} />
                    <View style={{flex: 1, overflow: 'visible', paddingHorizontal: AppSizes.paddingXSml,}}>
                        <View
                            style={{
                                backgroundColor: sensorStatusBarObj.backgroundColor,
                                height:          notchHeightWidth,
                                marginTop:       Platform.OS === 'ios' ? 0 : 5,
                                transform:       [{ rotate: '45deg', }],
                                width:           notchHeightWidth,
                            }}
                        />
                    </View>
                </View>
                <View
                    style={{
                        alignItems:      'center',
                        backgroundColor: sensorStatusBarObj.backgroundColor,
                        flexDirection:   'row',
                        paddingLeft:     AppSizes.paddingSml,
                        paddingVertical: AppSizes.paddingMed,
                    }}
                >
                    <Animated.View style={!this.state.isFetched ? {transform: [{rotate: spin}],} : {}}>
                        <TabIcon
                            icon={'sync'}
                            iconStyle={[{color: AppColors.primary.white.hundredPercent,}]}
                            onPress={() => this._triggerBLESteps()}
                            reverse={false}
                            size={AppFonts.scaleFont(20)}
                            type={'material-community'}
                        />
                    </Animated.View>
                    <Text oswaldMedium style={{color: AppColors.primary.white.hundredPercent, fontSize: AppFonts.scaleFont(14), paddingHorizontal: AppSizes.paddingXSml,}}>
                        {'SENSOR STATUS:'}
                    </Text>
                    { !this.state.isFetched ?
                        <Text oswaldMedium style={{color: 'rgba(255, 255, 255, 0.5)',}}>{'SEARCHING...'}</Text>
                        : sensorStatusBarObj.batteryFollowUp ?
                            <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                <View style={{borderRightColor: 'rgba(255, 255, 255, 0.5)', borderRightWidth: 1,}}>
                                    <Text oswaldMedium style={{color: 'rgba(255, 255, 255, 0.5)', paddingRight: AppSizes.paddingXSml,}}>
                                        {`${sensorStatusBarObj.followUpText}`}
                                    </Text>
                                </View>
                                <TabIcon
                                    containerStyle={[{paddingHorizontal: AppSizes.paddingXSml,}]}
                                    icon={batteryIconChargeLevel}
                                    iconStyle={[{color: 'rgba(255, 255, 255, 0.5)', transform: [{ rotate: '90deg'}],}]}
                                    reverse={false}
                                    size={AppFonts.scaleFont(20)}
                                    type={batteryIconType}
                                />
                                <Text oswaldMedium style={{color: 'rgba(255, 255, 255, 0.5)',}}>{sensorStatusBarObj.batteryFollowUp}</Text>
                            </View>
                            : sensorStatusBarObj.lastSyncFollowUp ?
                                <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                    <Text oswaldMedium style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: AppFonts.scaleFont(14), paddingRight: AppSizes.paddingXSml,}}>
                                        {`${sensorStatusBarObj.followUpText}`}
                                    </Text>
                                    { planStore.last_sensor_sync ?
                                        <View style={{borderLeftColor: 'rgba(255, 255, 255, 0.5)', borderLeftWidth: 1,}}>
                                            <Text robotoLight style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>
                                                {`synced ${daysDiff}`}
                                            </Text>
                                        </View>
                                        :
                                        null
                                    }
                                </View>
                                :
                                <Text oswaldMedium style={{color: 'rgba(255, 255, 255, 0.5)',}}>
                                    {sensorStatusBarObj.followUpText}
                                </Text>
                    }
                </View>
            </View>
        )
    }

    render = () => {
        // TODO: remove MODAL when done validating sensor data
        return (
            <View>
                <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
                <View style={[styles.container , this.props.routeName === 'settings' ? {borderBottomColor: AppColors.border, borderBottomWidth: 2,} : {}]}>
                    {this._renderLeft()}
                    {this._renderMiddle()}
                    {this._renderRight()}
                </View>
                {  this.state.isSensorUIOpen && this.props.routeName === 'home' ?
                    this._renderSensorUI()
                    :
                    null
                }
                <Toast
                    position={'bottom'}
                    ref={'toast'}
                />
                <Modal
                    backButtonClose
                    coverScreen
                    isOpen={this.state.isModalOpen}
                    onClosed={() => this.setState({ isModalOpen: false })}
                    position={'center'}
                    style={[AppStyles.containerCentered, { backgroundColor: AppColors.transparent, height: AppSizes.screen.height, width: AppSizes.screen.width, }]}
                    swipeToClose={false}
                >
                    <View style={[AppStyles.containerCentered, {backgroundColor: AppColors.white, height: AppSizes.screen.height, width: AppSizes.screen.width,}]}>
                        { this.state.storedPractices && this.state.storedPractices.length === 0 ?
                            <Text>{'NO STORED PRACTICES'}</Text>
                            :
                            null
                        }
                        { _.map(this.state.storedPractices, (practice, index) => {
                            return(
                                <View key={i} style={{paddingVertical: 10,}}>
                                    <Text>{`Practice #${i}`}</Text>
                                    <Text>{`Start Time: ${moment(result.start_time).utc().format('MMMM Do YYYY, h:mm:ss a')}`}</Text>
                                    <Text>{`End Time: ${moment(result.end_time).utc().format('MMMM Do YYYY, h:mm:ss a')}`}</Text>
                                    <Text>{`Inactive Accel: ${result.inactive_accel} (m/s^2)`}</Text>
                                    <Text>{`Low Accel: ${result.low_accel} (m/s^2)`}</Text>
                                    <Text>{`Mod Accel: ${result.mod_accel} (m/s^2)`}</Text>
                                    <Text>{`High Accel: ${result.high_accel} (m/s^2)`}</Text>
                                    <Text>{`Inactive Duration: ${result.inactive_duration} (seconds)`}</Text>
                                    <Text>{`Low Duration: ${result.low_duration} (seconds)`}</Text>
                                    <Text>{`Mod Duration: ${result.mod_duration} (seconds)`}</Text>
                                    <Text>{`High Duration: ${result.high_duration} (seconds)`}</Text>
                                </View>
                            )
                        })}
                        <Button
                            backgroundColor={AppColors.primary.grey.fiftyPercent}
                            onPress={() => this.setState({ isModalOpen: false })}
                            title={'Close'}
                        />
                    </View>
                </Modal>
            </View>
        );
    }

}

/* Export Component ==================================================================== */
export default CustomNavBar;
