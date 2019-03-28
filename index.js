/**
 * Load the App component (All the fun stuff happens in "/src/native/index.js")
 */

import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import Root from './src';
import {configureStore} from './src/store';

YellowBox.ignoreWarnings([
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader',
    'Remote debugger',
    'Did not receive response to shouldStartLoad in time, defaulting to YES',
    'Required dispatch_sync to load constants for RNDeviceInfo. This may lead to deadlocks',
    'startLoadWithResult invoked with invalid lockIdentifier'
]);

const { persistor, store } = configureStore();

const App = () => <Root store={store} persistor={persistor}/>;

AppRegistry.registerComponent('Fathom', () => App);
