/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:24:08 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-29 19:17:28
 */

import DeviceInfo from 'react-native-device-info';

const appName = 'Fathom';
let deviceInfo;

try {
    // Build user agent string
    deviceInfo = `${appName} ${DeviceInfo.getVersion()}; ${DeviceInfo.getSystemName()} ` +
        `${DeviceInfo.getSystemVersion()}; ${DeviceInfo.getBrand()} ${DeviceInfo.getDeviceId()}`;
} catch (e) {
    deviceInfo = `${appName}`;
}

/* global __DEV__ */
export default {
    // App Details
    appName,

    // Build Configuration - eg. Debug or Release?
    DEV: __DEV__,

    deviceInfo,
};
