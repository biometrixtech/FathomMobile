import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Provider, } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Image, Platform, PushNotificationIOS, StatusBar, StyleSheet, View, } from 'react-native';

// import components
import { Actions, AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, } from './constants';
import { AlertHelper, AppUtil, } from './lib';
import { Spacer, TabIcon, Text, } from './components/custom';
import { store } from './store';
import Routes from './routes';

// import third-party libraries
import 'react-native-magic-move';
import { Actions as RouterActions, Router, Stack, } from 'react-native-router-flux';
import { NetworkMonitor } from 'react-native-redux-connectivity';
import * as Fabric from 'react-native-fabric';
import * as MagicMove from 'react-native-magic-move';
import DeviceInfo from 'react-native-device-info';
import DropdownAlert from 'react-native-dropdownalert';
import PushNotification from 'react-native-push-notification';

// setup consts
const Crashlytics = Fabric.Crashlytics;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius:  6,
    },
});

/* Component ==================================================================== */
class Root extends Component {
    static propTypes = {
        store:     PropTypes.shape({}).isRequired,
        persistor: PropTypes.shape({}).isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        };
        this._networkMonitor = new NetworkMonitor(this.props.store);
        this._dropdown = null;
    }

    componentDidMount = () => {
        /**
         * Setting up Push Notifications here as this encapsulates
         * all of the embedded components so we'll be able to receive
         * a Push Notification and react to it while in any component.
         */
        PushNotification.configure({
            // (required) Called when a remote or local notification is opened or received
            onNotification: notification => this._onNotificationReceived(notification),

            // (optional) Called when Token is generated (iOS and Android)
            onRegister: token => this._onRegisterForPushNotifications(token),

            requestPermissions: true,
            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID:           Platform.OS === 'ios' ? null : '394820950629', // Both the Android and iOS senderID in Firebase
        });
        /*
         * Maintenance Window
         */
        AppUtil.getMaintenanceWindow();
        // clear PN flag
        PushNotification.setApplicationIconBadgeNumber(0);
    }

    componentWillMount = () => {
        this._networkMonitor.start();
    }

    componentWillUnmount = () => {
        this._networkMonitor.stop();
    }

    componentDidCatch = (error, info) => {
        // Example 'componentStack':
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App
        // logComponentStackToMyService(info.componentStack);
        const userId = store.getState().user.id;
        this.setState({ hasError: true, });
        Crashlytics.setUserIdentifier(userId);
        if(Platform.OS === 'ios') {
            Crashlytics.recordError(`${error.toString()}`);
        } else {
            Crashlytics.logException(`${error.toString()}`);
        }
    }

    _showDropdownAlert = () => {
        this._dropdown.alertWithType('custom', '', ErrorMessages.noInternetConnection);
    }

    _closeDropdownAlert = () => {
        this._dropdown.close();
    }

    _renderDropdownImage = (props, side, onPress = () => {}) => (
        <TabIcon
            containerStyle={[{justifyContent: 'center',}]}
            icon={side === 'cancel' ? 'close' : 'cloud-off'}
            iconStyle={[{color: AppColors.white,}]}
            onPress={onPress}
            reverse={false}
            type={side === 'cancel' ? 'material-community' : 'material'}
        />
    )

    /**
     *
     * Example Notification Object:
     *
     * {
     *      foreground:      false,                     // BOOLEAN: If the notification was received in foreground or not
     *      userInteraction: false,                     // BOOLEAN: If the notification was opened by the user from the notification area or not
     *      message:         'My Notification Message', // STRING: The notification message
     *      data:            {},                        // OBJECT: The push data
     * }
     *
     */
    _onNotificationReceived = notification => {
        console.log( 'NOTIFICATION:', notification );
        /**
         * Unsure if this logic below will work for redux in active and inactive
         */
        // return notification.foreground
        //     ? Promise.resolve(this.props.store.dispatch({
        //         type: Actions.NOTIFICATION_RECEIVED
        //     }))
        //         // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        //         .then(() => Platform.OS === 'ios'
        //             ? notification.finish(PushNotificationIOS.FetchResult.NoData)
        //             : notification.finish()
        //         )
        //     : null;
        // PushNotification.getApplicationIconBadgeNumber(numBadges => {
        //     let newNumBadges = numBadges + 1;
        //     PushNotification.setApplicationIconBadgeNumber(newNumBadges);
        // });
        let pnCallToAction = Platform.OS === 'ios' ? notification.data.biometrix.call_to_action : JSON.parse(notification.biometrix).call_to_action;
        this.props.store.dispatch({
            type: Actions.NOTIFICATION_RECEIVED,
            data: pnCallToAction,
        });
        return Platform.OS === 'ios' ?
            notification.finish(PushNotificationIOS.FetchResult.NoData)
            :
            notification.finish();
    }

    _onRegisterForPushNotifications = registration => {
        console.log(`about to register with deviceToken: ${registration.token}`);
        return this.props.store.dispatch({
            type:  Actions.SEND_DEVICE_TOKEN,
            token: registration.token,
        });
    }

    render = () => {
        if(this.state.hasError || DeviceInfo.isTablet()) {
            return(
                <View style={{flex: 1, justifyContent: 'space-between', marginTop: AppSizes.statusBarHeight,}}>
                    <View style={{alignItems: 'center', flex: 1,}}>
                        <Image
                            source={require('../assets/images/standard/fathom-gold-and-grey.png')}
                            style={[AppStyles.navbarImageTitle]}
                        />
                    </View>
                    <View style={{alignItems: 'center', flex: 8, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <View style={[styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {backgroundColor: AppColors.zeplin.superLight, borderRadius: 5,}]}>
                            <View style={{backgroundColor: AppColors.zeplin.error, borderTopLeftRadius: 5, borderTopRightRadius: 5, paddingVertical: AppSizes.paddingXSml,}}>
                                <TabIcon
                                    color={AppColors.white}
                                    icon={'alert'}
                                    size={30}
                                    type={'material-community'}
                                />
                            </View>
                            <View style={{padding: AppSizes.padding,}}>
                                <Text oswaldMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(35), textAlign: 'center',}}>{'UH OH!'}</Text>
                                <Spacer size={AppSizes.padding} />
                                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>
                                    {
                                        this.state.hasError ?
                                            'We\'ve encountered an error. Please restart the app and try again.'
                                            :
                                            'Sorry, the Fathom mobile app is not compatible on this device.'
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', flex: 1,}} />
                </View>
            );
        }
        return(
            <MagicMove.Provider disabled={true}>
                <View style={{flex: 1,}}>
                    <StatusBar backgroundColor={AppColors.transparent} barStyle={'dark-content'} />
                    <Provider store={this.props.store}>
                        <PersistGate
                            loading={null}
                            persistor={this.props.persistor}
                        >
                            <Router
                                closeDropdownAlert={this._closeDropdownAlert}
                                showDropdownAlert={this._showDropdownAlert}
                            >
                                <Stack key={'root'}>
                                    {Routes}
                                </Stack>
                            </Router>
                        </PersistGate>
                    </Provider>
                    <DropdownAlert
                        closeInterval={0}
                        containerStyle={{backgroundColor: AppColors.zeplin.error,}}
                        defaultContainer={{flexDirection: 'row', padding: AppSizes.paddingSml, paddingTop: AppSizes.statusBarHeight,}}
                        defaultTextContainer={{flex: 1, padding: AppSizes.paddingSml,}}
                        messageStyle={{...AppStyles.oswaldRegular, color: AppColors.white,}}
                        messageTextProps={{allowFontScaling: false,}}
                        onCancel={data => {}}
                        onClose={data => {}}
                        ref={ref => {this._dropdown = ref;}}
                        renderCancel={props => this._renderDropdownImage(props, 'cancel')}
                        renderImage={props => this._renderDropdownImage(props, 'left')}
                        showCancel={true}
                        translucent={Platform.OS === 'ios' ? false : true}
                        updateStatusBar={Platform.OS === 'ios' ? true : false}
                        useNativeDriver={true}
                    />
                    <DropdownAlert
                        closeInterval={0}
                        containerStyle={{backgroundColor: AppColors.zeplin.error,}}
                        messageStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(15),}}
                        messageTextProps={{allowFontScaling: false,}}
                        onClose={data => data.action === 'tap' ? RouterActions.bluetoothConnect3Sensor() : {}}
                        panResponderEnabled={false}
                        ref={ref => AlertHelper.setCancelableDropDown(ref)}
                        renderCancel={props => this._renderDropdownImage(props, 'cancel', () => AlertHelper.closeCancelableDropDown())}
                        showCancel={true}
                        titleStyle={{...AppStyles.robotoBold, color: AppColors.white, fontSize: AppFonts.scaleFont(15),}}
                        titleTextProps={{allowFontScaling: false,}}
                        translucent={Platform.OS === 'ios' ? false : true}
                        updateStatusBar={Platform.OS === 'ios' ? true : false}
                        useNativeDriver={true}
                    />
                    <DropdownAlert
                        closeInterval={0}
                        containerStyle={{backgroundColor: AppColors.zeplin.error,}}
                        messageStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(15),}}
                        messageTextProps={{allowFontScaling: false,}}
                        onClose={data => RouterActions.bluetoothConnect3Sensor()}
                        panResponderEnabled={false}
                        ref={ref => AlertHelper.setDropDown(ref)}
                        titleStyle={{...AppStyles.robotoBold, color: AppColors.white, fontSize: AppFonts.scaleFont(15),}}
                        titleTextProps={{allowFontScaling: false,}}
                        translucent={Platform.OS === 'ios' ? false : true}
                        updateStatusBar={Platform.OS === 'ios' ? true : false}
                        useNativeDriver={true}
                    />
                </View>
            </MagicMove.Provider>
        );
    }
}

export default Root;
