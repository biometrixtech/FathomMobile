/**
 * Load the App component (All the fun stuff happens in "/src/index.js")
 */

import { AppRegistry } from 'react-native';
import codePush from 'react-native-code-push';
import AppContainer from './src/';

AppRegistry.registerComponent('Fathom', () => codePush(AppContainer));
