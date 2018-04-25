/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:17:47 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 10:24:20
 */

/**
 * Load the App component (All the fun stuff happens in "/src/native/index.js")
 */

import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import AppContainer from './src/newNative/';
import {configureStore} from './src/store/index';
import codePush from 'react-native-code-push';


YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Remote debugger']);

let codePushOptions = {
    updateDialog: false,
    installMode:  codePush.InstallMode.IMMEDIATE
};

const { persistor, store } = configureStore();

const App = () => {
    return <AppContainer store={store} persistor={persistor}/>;
}

AppRegistry.registerComponent('Fathom', () => codePush(codePushOptions)(App));
