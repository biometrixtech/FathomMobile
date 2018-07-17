/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:24:08 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 21:21:29
 */

import DeviceInfo from 'react-native-device-info';

const appName = 'Fathom';
let deviceInfo, deviceOS;

try {
    // Build user agent string
    deviceInfo = `${appName} ${DeviceInfo.getVersion()}; ${DeviceInfo.getSystemName()} ` +
        `${DeviceInfo.getSystemVersion()}; ${DeviceInfo.getBrand()} ${DeviceInfo.getDeviceId()}`;
    deviceOS = DeviceInfo.getSystemName();
} catch (e) {
    deviceInfo = `${appName}`;
    deviceOS = '';
}

/* global __DEV__ */
export default {
    // App Details
    appName,

    // Build Configuration - eg. Debug or Release?
    DEV: __DEV__,

    deviceInfo,
    deviceOS,
};
