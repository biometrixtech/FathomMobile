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
import { AnimatedProgressBar, TabIcon, Text, } from './';
import { store } from '../../store';
import { bleUtils } from '../../constants/utils';
import { AppUtil } from '../../lib';
import { ble as BLEActions, } from '../../actions';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Toast, { DURATION } from 'react-native-easy-toast';
import moment from 'moment';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const sensorImagePrefix = '../../../assets/images/sensor/';

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
        let BLEDetails = this._handleBleDetails(this.props.routeName);
        this.state = {
            BLEData: {
                animated: false,
                bleImage: BLEDetails.bleImageToDisplay,
            },
            bluetoothOn:    currentState.ble.bluetoothOn || false,
            fetchBleData:   BLEDetails.fetchBleData,
            isFetchingData: false,
            isSensorUIOpen: false,
            progressBar:    0,
        }
        this.handleBleStateChange = this.handleBleStateChange.bind(this);
        this._interval = null;
    }

    _handleBleDetails = (routeName) => {
        let currentState = store.getState();
        let fetchBleData = (
            currentState.ble.accessoryData &&
            currentState.ble.accessoryData.sensor_pid &&
            currentState.ble.accessoryData.mobile_udid === AppUtil.getDeviceUUID() &&
            routeName === 'home'
        ) ?
            true
            :
            false;
        let bleImageToDisplay = fetchBleData ?
            require(`${sensorImagePrefix}sensor.png`)
            :
            null;
        return { fetchBleData, bleImageToDisplay };
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
        // start bluetooth/sensor related items
        if(this.state.fetchBleData) {
            this._handleBLEStepsOnLoad();
        }
    }

    componentWillUnmount = () => {
        this.handlerState.remove();
        this._handleClearInterval();
    }

    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps, this.props) && nextProps.routeName === 'home') {
            // headed to home page, start bluetooth/sensor related items
            let BLEDetails = this._handleBleDetails(nextProps.routeName)
            let currentState = store.getState();
            this.setState(
                {
                    BLEData: {
                        animated: false,
                        bleImage: BLEDetails.bleImageToDisplay,
                    },
                    bluetoothOn:    currentState.ble.bluetoothOn || false,
                    fetchBleData:   BLEDetails.fetchBleData,
                    isFetchingData: false,
                    isSensorUIOpen: false,
                    progressBar:    0,
                },
                () => this._handleSetInterval(false),
            );
        } else if(!_.isEqual(nextProps, this.props) && nextProps.routeName === 'settings') {
            // headed to settings page, clear interval
            this._handleClearInterval();
        }
    }

    _handleBLEStepsOnLoad = () => {
        this._startBluetooth()
            .then(() => {
                this.setState({
                    BLEData: {
                        animated: true,
                        bleImage: require(`${sensorImagePrefix}sensor-operation.png`),
                    },
                    isSensorUIOpen: false,
                }, () => {
                    return this._triggerBLESteps();
                });
            });
    }

    _handleClearInterval = () => {
        clearInterval(this._interval);
    }

    _handleSetInterval = () => {
        this._interval = setInterval(() => {
            this._triggerBLESteps(true, true);
        }, 30000);
    }

    _handleAppStateChange = nextAppState => {
        if(nextAppState === 'active') {
            this.setState(
                { isSensorUIOpen: false, },
                () => this._triggerBLESteps(true),
            );
        } else if(nextAppState === 'background') {
            this._handleClearInterval();
        }
    }

    _triggerBLESteps = (animate, isFromTimer = false) => {
        // setup constants
        const validFetchStates = [1, 2, 3];
        let batterCharge = 0;
        let numberOfPractices = 0;
        let systemStatus = 0;
        let userId = store.getState().user.id;
        // clear interval
        this._handleClearInterval();
        // catch variable
        if(animate) {
            this.setState({
                BLEData: {
                    animated: true,
                    bleImage: require(`${sensorImagePrefix}sensor-operation.png`),
                },
            });
        }
        // start logic
        bleUtils.handleBLESingleSensorStatus(store.getState().ble, false)
            .then(sensorStatusResponse => {
                batterCharge = sensorStatusResponse.batterCharge;
                numberOfPractices = sensorStatusResponse.numberOfPractices;
                systemStatus = sensorStatusResponse.systemStatus;
                return AppUtil._retrieveAsyncStorageData(userId);
            })
            .then(asyncRes => {
                if(asyncRes && asyncRes.practices && Object.keys(asyncRes.practices).length > 0) {
                    return bleUtils.finalizeBleData(asyncRes.practices, userId);
                }
                return true; // NOTE: returning true to drop in .then() because we don't have any practices locally stored
            })
            .then(() => {
                this.setState(
                    {
                        BLEData: {
                            animated: false,
                            bleImage: require(`${sensorImagePrefix}sensor.png`),
                        },
                        isFetchingData: true,
                        isSensorUIOpen: !(isFromTimer && numberOfPractices === 0),
                    },
                    () => {
                        if(numberOfPractices > 0 && validFetchStates.includes(systemStatus)) {
                            this._handlePractices(numberOfPractices)
                                .then(() => {
                                    this.setState({ isFetchingData: false, });
                                    return AppUtil._retrieveAsyncStorageData(userId);
                                })
                                .then(res => {
                                    return bleUtils.finalizeBleData(res.practices, userId);
                                })
                                .then(() => {
                                    this._handleSetInterval();
                                    this.refs.toast.show('SYNC SUCCESSFUL', DURATION.LENGTH_LONG);
                                })
                                .catch(err => {
                                    this.setState({ isFetchingData: false, });
                                    this.refs.toast.show(err, DURATION.LENGTH_LONG);
                                    this._handleSetInterval();
                                });
                        } else {
                            this.setState({ isFetchingData: false, });
                        }
                    },
                );
            })
            .catch(err => {
                this.refs.toast.show(err, DURATION.LENGTH_LONG);
                this._handleSetInterval();
            });
    }

    /*eslint consistent-return: 0*/
    _handlePractices = async (numberOfPractices) => {
        let shouldExit = false;
        let errMsg = '';
        for (let i = 0; i < numberOfPractices; i += 1) {
            if(shouldExit) {
                return Promise.reject(errMsg);
            }
            let progress = (parseFloat(((i+1)/numberOfPractices).toFixed(2))) * 100;
            this.setState({ progressBar: progress });
            await bleUtils.processPractices(store.getState().ble.accessoryData.sensor_pid, store.getState().user.id)
                /*eslint no-loop-func: 0*/
                /*eslint-env es6*/
                .catch(err => {
                    this.refs.toast.show(err, DURATION.LENGTH_LONG);
                    shouldExit = true;
                    errMsg = err;
                });
        }
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
                return Promise.reject(error);
            });
    }

    _renderLeft = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', paddingLeft: AppSizes.paddingXSml,}}>
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
            return (
                <Image
                    source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                    style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
                />
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
                            onPress={() => {
                                let oppositeSensorUIStatus = !this.state.isSensorUIOpen;
                                this.setState(
                                    {
                                        isSensorUIOpen: false,
                                    },
                                    () => oppositeSensorUIStatus ? this._triggerBLESteps(true) : null,
                                );
                            }}
                            style={{width: imageWidth}}
                        >
                            <Image
                                resizeMode={'contain'}
                                source={this.state.BLEData.bleImage}
                                style={{width: imageWidth,}}
                            />
                            { store.getState().ble.systemStatus === 1 ?
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
                                    onPress={() => {
                                        let oppositeSensorUIStatus = !this.state.isSensorUIOpen;
                                        this.setState(
                                            {
                                                isSensorUIOpen: false,
                                            },
                                            () => oppositeSensorUIStatus ? this._triggerBLESteps(true) : null,
                                        );
                                    }}
                                    reverse={false}
                                    size={(indicatorSize + 10)}
                                    type={'font-awesome'}
                                />
                                : store.getState().ble.systemStatus === 2 ?
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
        if(this.state.isFetchingData) {
            return(
                <AnimatedProgressBar
                    backgroundColor={sensorStatusBarObj.backgroundColor}
                    borderRadius={0}
                    borderWidth={0}
                    height={45}
                    maxValue={100}
                    value={this.state.progressBar}
                    width={AppSizes.screen.width}
                    wrapperBackgroundColor={AppColors.primary.grey.thirtyPercent}
                >
                    <View
                        style={{
                            alignItems:      'center',
                            backgroundColor: AppColors.transparent,
                            flexDirection:   'row',
                            paddingLeft:     AppSizes.paddingSml,
                            paddingVertical: AppSizes.paddingMed,
                            width:           AppSizes.screen.width,
                        }}
                    >
                        <Text oswaldMedium style={{color: AppColors.primary.white.hundredPercent, fontSize: AppFonts.scaleFont(14), paddingHorizontal: AppSizes.paddingXSml,}}>
                            {'SENSOR STATUS:'}
                        </Text>
                        <Text oswaldMedium style={{color: 'rgba(255, 255, 255, 0.5)', paddingRight: AppSizes.paddingXSml,}}>
                            {`SYNCING ${this.state.progressBar}%`}
                        </Text>
                    </View>
                </AnimatedProgressBar>
            )
        }
        return(
            <View>
                <View style={{backgroundColor: AppColors.white, elevation: 1, flexDirection: 'row', height: Platform.OS === 'ios' ? (notchHeightWidth / 6) : (notchHeightWidth / 2), zIndex: 1,}}>
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
                        zIndex:          0,
                    }}
                >
                    <Text oswaldMedium style={{color: AppColors.primary.white.hundredPercent, fontSize: AppFonts.scaleFont(14), paddingHorizontal: AppSizes.paddingXSml,}}>
                        {'SENSOR STATUS:'}
                    </Text>
                    { sensorStatusBarObj.batteryFollowUp ?
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
            </View>
        );
    }

}

/* Export Component ==================================================================== */
export default CustomNavBar;
