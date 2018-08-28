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
    View,
} from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, Actions as DispatchActions, } from '../../constants';
import { TabIcon, Text, } from './';
import { store } from '../../store';
import { bleUtils } from '../../constants/utils';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
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
        this.state = {
            BLEData: {},
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

        // // trigger BLE Steps function
        // let BLEData = bleUtils.handleBLESteps(store.getState().ble, store.getState().user.id);
        // // TODO: make sure to disconnect everytime...
        // // TODO: make sure to import all BLE update states...
        // console.log('++++BLEData',BLEData);
        // this.setState({ BLEData });

        this.handlerState = bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleBleStateChange );
    }

    componentWillUnmount = () => {
        this.handlerState.remove();
    }

    handleBleStateChange = (data) => {
        console.log('hi ble data', data);
        store.dispatch({
            type: DispatchActions.CHANGE_STATE,
            data: data.state,
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
                { Actions.currentScene === 'onboarding' && !store.getState().user.id ?
                    <TabIcon
                        icon={'arrow-left'}
                        iconStyle={[{color: AppColors.black,}]}
                        onPress={Actions.currentParams.onLeft}
                        reverse={false}
                        size={26}
                        type={'simple-line-icon'}
                    />
                    : Actions.currentParams.onLeft && Actions.currentScene !== 'onboarding' ?
                        <TabIcon
                            icon={Actions.currentScene === 'home' ? 'settings' : 'arrow-left'}
                            iconStyle={[{color: AppColors.black,}]}
                            onPress={Actions.currentParams.onLeft}
                            reverse={false}
                            size={26}
                            type={Actions.currentScene === 'home' ? 'material-community' : 'simple-line-icon'}
                        />
                        :
                        null
                }
            </View>
        )
    }

    _renderMiddle = () => {
        if(Actions.currentScene === 'home') {
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
        console.log('BLEData',this.state.BLEData);
        {/* this.state.BLEData.bleImage && this.state.BLEData.animated ?
            <Animated.Image
                resizeMode={'contain'}
                source={this.state.BLEData.bleImage}
                style={{transform: [{rotate: spin}], width: 34,}}
            />
            : this.state.BLEData.bleImage && !this.state.BLEData.animated ?
                <Image
                    resizeMode={'contain'}
                    source={this.state.BLEData.bleImage}
                    style={{width: 34,}}
                />
                :
                null
        */}
        if(Actions.currentScene === 'home') {
            return (
                <View style={{flex: 1, justifyContent: 'center', paddingRight: AppSizes.paddingXSml}}>
                    { currentState.ble.bluetoothOn ?
                        null
                        :
                        <TabIcon
                            icon={'bluetooth-off'}
                            iconStyle={[{color: AppColors.black,}]}
                            onPress={() => this._startBluetooth()}
                            reverse={false}
                            size={26}
                            type={'material-community'}
                        />
                    }
                </View>
            )
        }
        return(<View style={{flex: 1}}></View>)
    }

    render = () => {
        return (
            <View>
                <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
                <View style={[styles.container , Actions.currentScene === 'settings' ? {borderBottomColor: AppColors.border, borderBottomWidth: 2,} : {}]}>
                    {this._renderLeft()}
                    {this._renderMiddle()}
                    {this._renderRight()}
                </View>
            </View>
        );
    }

}

/* Export Component ==================================================================== */
export default CustomNavBar;
