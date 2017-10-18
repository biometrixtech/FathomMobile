/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:17:47 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-12 11:18:58
 */

/**
 * Load the App component (All the fun stuff happens in "/src/index.js")
 */

import { AppRegistry } from 'react-native';
import codePush from 'react-native-code-push';
import AppContainer from './src';

let codePushOptions = {
    updateDialog: false,
    installMode:  codePush.InstallMode.IMMEDIATE
};

AppRegistry.registerComponent('Fathom', () => codePush(codePushOptions)(AppContainer));
