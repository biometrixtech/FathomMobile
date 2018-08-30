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

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

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
            require('../../../assets/images/sensor/sensor-operation.png')
            :
            null;
        this.state = {
            BLEData: {
                animated: true,
                bleImage: bleImageToDisplay,
            },
            bluetoothOn:    currentState.ble.bluetoothOn || false,
            fetchBleData:   fetchBleData,
            isSensorUIOpen: false,
        }
        this.handleBleStateChange = this.handleBleStateChange.bind(this);
    }

    componentWillMount = () => {
        // trigger check state
        BleManager.checkState();
    }

    componentDidMount = () => {
        StatusBar.setBarStyle('dark-content');
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor(AppColors.primary.grey.twentyPercent);
        }
        this.handlerState = bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleBleStateChange );
        // start timer
        if(this.state.fetchBleData) {
            this._triggerBLESteps();
        }
    }

    _triggerBLESteps = () => {
        this.setState({
            BLEData: {
                animated: true,
                bleImage: require('../../../assets/images/sensor/sensor-operation.png'),
            }
        }, () => {
            bleUtils.handleBLESteps(store.getState().ble, store.getState().user.id)
                .then(BLEData => {
                    this.setState({ BLEData, isSensorUIOpen: !this.state.isSensorUIOpen });
                })
                .catch(BLEData => {
                    this.setState({ BLEData, isSensorUIOpen: !this.state.isSensorUIOpen });
                });
        });
    }

    componentWillUnmount = () => {
        this.handlerState.remove();
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
        return BleManager.start({ showAlert: true })
            .then(() => {
                store.dispatch({
                    type: DispatchActions.START_BLUETOOTH
                });
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
            return (
                <Image
                    source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                    style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center'}]}
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
            Animated.timing(
                iconGrow,
                {
                    duration:        2000,
                    easing:          Easing.ease,
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
        const scaleIcon = iconGrow.interpolate({
            inputRange:  [0, 1],
            outputRange: [0.5, 1]
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
                                    () => this._triggerBLESteps(),
                                )
                            }
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
                                    onPress={() => null}
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
        let sensorStatusBarObj = bleUtils.sensorStatusBar(store.getState().ble.systemStatus, store.getState().ble.batteryCharge);
        return(
            <View
                style={{
                    backgroundColor: sensorStatusBarObj.backgroundColor,
                    paddingLeft:     AppSizes.paddingMed,
                    paddingVertical: AppSizes.paddingMed,
                }}
            >
                <Text oswaldRegular style={{color: AppColors.primary.white.hundredPercent, fontSize: AppFonts.scaleFont(14)}}>
                    {'SENSOR STATUS: '}
                    <Text oswaldRegular style={{color: AppColors.white, opacity: 0.5,}}>
                        {`${sensorStatusBarObj.followUpText} ${sensorStatusBarObj.batteryFollowUp ? sensorStatusBarObj.batteryFollowUp : sensorStatusBarObj.lastSyncFollowUp ? '| synced ' : ''}`}
                    </Text>
                </Text>
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
                { this.state.isSensorUIOpen ?
                    this._renderSensorUI()
                    :
                    null
                }
            </View>
        );
    }

}

/* Export Component ==================================================================== */
export default CustomNavBar;
