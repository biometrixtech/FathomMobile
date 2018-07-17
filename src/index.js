/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:21:21 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-17 00:17:12
 */

import React, { Component } from 'react';
// import { StatusBar, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Stack } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { plan as PlanActions, init as InitActions } from '@actions';
import { AppConfig } from '@constants';
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
        /**
         * Setting up Push Notifications here as this encapsulates
         * all of the embedded components so we'll be able to receive
         * a Push Notification and react to it while in any component.
         */
        PushNotification.configure({
            onRegister: token => {
                this._onRegisterForPushNotifications(token)
            },
            onNotification: notification => {
                this._onNotificationReceived(notification)
            },
            requestPermissions: true
        });
    }

    _onNotificationReceived(notification) {
        this.setState({
            notificationPayload: notification,
        });
        /**
         * Unsure if this logic below will work for the redux actions
         * 
         * Other option is to change a store property which triggers
         * a refresh of data in whatever other component we're in?
         */
        return PlanActions.getMyPlan();
    }
    
    _onRegisterForPushNotifications = (deviceToken) => {
        console.log(`about to register with deviceToken: ${deviceToken}`);
        return InitActions.sendDeviceToken(deviceToken, AppConfig.deviceOS).then(success => {
            console.log('registration done, success?', success)
            // TODO: If the API call fails to register?
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
