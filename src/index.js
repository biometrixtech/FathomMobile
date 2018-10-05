import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { NetInfo, Platform, PushNotificationIOS, View, } from 'react-native';

// import components
import { Actions, AppColors, AppSizes, AppStyles, ErrorMessages, } from './constants';
import { AppUtil, } from './lib';
import Routes from './routes';
import { TabIcon, } from './components/custom';

// import third-party libraries
import { Router, Stack, } from 'react-native-router-flux';
import { NetworkMonitor } from 'react-native-redux-connectivity';
import DropdownAlert from 'react-native-dropdownalert';
import PushNotification from 'react-native-push-notification';

class Root extends Component {
    static propTypes = {
        store:     PropTypes.shape({}).isRequired,
        persistor: PropTypes.shape({}).isRequired,
    }

    constructor(props) {
        super(props);

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

        this._networkMonitor = new NetworkMonitor(this.props.store);
        this._dropdown = null;
    }

    componentDidMount = () => {
        /*
         * Maintenance Window
         */
        AppUtil.getMaintenanceWindow();
    }

    componentWillMount = () => {
        this._networkMonitor.start();
    }

    componentWillUnmount = () => {
        this._networkMonitor.stop();
    }

    _showDropdownAlert = () => {
        this._dropdown.alertWithType('custom', '', ErrorMessages.noInternetConnection);
    }

    _closeDropdownAlert = () => {
        this._dropdown.close();
    }

    _onCloseDropdown = (data) => {
        // data = {type, title, message, action}
        // action means how the alert was closed.
        // returns: automatic, programmatic, tap, pan or cancel
        console.log('_onCloseDropdown',data);
    }

    _renderDropdownImage = (props, side) => {
        return(
            <TabIcon
                icon={side === 'cancel' ? 'close' : 'cloud-off'}
                iconStyle={[{color: AppColors.white}]}
                reverse={false}
                type={side === 'cancel' ? 'material-community' : 'material'}
            />
        )
    }

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
    _onNotificationReceived = (notification) => {
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
        PushNotification.getApplicationIconBadgeNumber(numBadges => {
            let newNumBadges = numBadges + 1;
            PushNotification.setApplicationIconBadgeNumber(newNumBadges);
        });
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

    _onRegisterForPushNotifications = (registration) => {
        console.log(`about to register with deviceToken: ${registration.token}`);
        return this.props.store.dispatch({
            type:  Actions.SEND_DEVICE_TOKEN,
            token: registration.token,
        });
    }

    render = () => {
        return(
            <View style={{flex: 1,}}>
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
                    containerStyle={{backgroundColor: AppColors.alerts.errorBackground,}}
                    defaultContainer={{flexDirection: 'row', padding: AppSizes.paddingSml, paddingTop: AppSizes.statusBarHeight,}}
                    defaultTextContainer={{flex: 1, padding: AppSizes.paddingSml,}}
                    messageStyle={{...AppStyles.oswaldRegular, color: AppColors.white,}}
                    onCancel={data => this._onCloseDropdown(data)}
                    onClose={data => this._onCloseDropdown(data)}
                    ref={ref => {this._dropdown = ref;}}
                    renderCancel={props => this._renderDropdownImage(props, 'cancel')}
                    renderImage={props => this._renderDropdownImage(props, 'left')}
                    showCancel={true}
                    translucent={Platform.OS === 'ios' ? false : true}
                    updateStatusBar={Platform.OS === 'ios' ? true : false}
                    useNativeDriver={true}
                />
            </View>
        )
    }
}

export default Root;
