/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:21:21 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-17 18:57:33
 */

import React, { Component } from 'react';
// import { StatusBar, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Stack } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Actions } from '@constants';
import { plan as PlanActions, init as InitActions } from '@actions';
import { Platform, PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';

import Routes from './routes';

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
    }

    componentDidMount() {
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

            popInitialNotification: true,
            requestPermissions:     true,
            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID:               Platform.OS === 'ios' ? null : '394820950629', // Both the Android and iOS senderID in Firebase
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
         * Unsure if this logic below will work for the redux actions
         * 
         * Other option is to change a store property (see below) which
         * triggers a refresh of data in whatever component we're in?
         */
        return PlanActions.getMyPlan()
            // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
            .then(() => Platform.OS === 'ios' ? notification.finish(PushNotificationIOS.FetchResult.NoData) : null);
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
