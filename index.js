/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:17:47 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-09 21:37:20
 */

/**
 * Load the App component (All the fun stuff happens in "/src/native/index.js")
 */

import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import Root from './src/';
import {configureStore} from './src/store/';
import codePush from 'react-native-code-push';


YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Remote debugger']);

let codePushOptions = {
    updateDialog: false,
    installMode:  codePush.InstallMode.IMMEDIATE
};

const { persistor, store } = configureStore();

const App = () => <Root store={store} persistor={persistor}/>;

AppRegistry.registerComponent('Fathom', () => codePush(codePushOptions)(App));
