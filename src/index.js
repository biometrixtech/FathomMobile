/*
 * @Author: Vir Desai
 * @Date: 2018-04-30 13:21:21
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:06:59
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { NetInfo, Platform, PushNotificationIOS, } from 'react-native';

// import components
import { Actions } from './constants';
import { AppUtil } from './lib';
import Routes from './routes';

// import third-party libraries
import { Router, Stack } from 'react-native-router-flux';
import PushNotification from 'react-native-push-notification';

// Hide StatusBar on Android as it overlaps tabs
// if (Platform.OS === 'android') {
//     StatusBar.setHidden(true);
// }

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

        /*
         * NetInfo exposes info about online/offline status
         */
        NetInfo.getConnectionInfo()
            .then(connectionInfo => {
                console.log(`Initial, type: ${connectionInfo.type}, effectiveType: ${connectionInfo.effectiveType}`);
                this.props.store.dispatch({
                    type: Actions.UPDATE_CONNECTION,
                    data: { connectionType: connectionInfo.type }
                });
            });
        NetInfo.isConnected.fetch()
            .then(isConnected => {
                console.log('First, is ' + (isConnected ? 'online' : 'offline'));
                this.props.store.dispatch({
                    type: Actions.UPDATE_CONNECTION,
                    data: { online: isConnected }
                });
            });
    }

    componentWillMount = () => {
        NetInfo.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleIsConnectedConnectivityChange
        );
    }

    componentWillUnmount = () => {
        NetInfo.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleIsConnectedConnectivityChange
        );
    }

    componentDidMount = () => {
        AppUtil.getMaintenanceWindow();
    }

    _handleConnectivityChange = (connectionInfo) => {
        console.log(`First change, type: ${connectionInfo.type}, effectiveType: ${connectionInfo.effectiveType}`);
        this.props.store.dispatch({
            type: Actions.UPDATE_CONNECTION,
            data: { connectionType: connectionInfo.type }
        });
    }

    _handleIsConnectedConnectivityChange = (isConnected) => {
        console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
        this.props.store.dispatch({
            type: Actions.UPDATE_CONNECTION,
            data: { online: isConnected }
        });
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
        // if we ever get a notification, we need to address it regardless or any boolean
        this.props.store.dispatch({
            type: Actions.NOTIFICATION_RECEIVED
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

    render = () => (
        <Provider store={this.props.store}>
            <PersistGate
                loading={null}
                persistor={this.props.persistor}
            >
                <Router>
                    <Stack key={'root'}>
                        {Routes}
                    </Stack>
                </Router>
            </PersistGate>
        </Provider>
    );
}

export default Root;
