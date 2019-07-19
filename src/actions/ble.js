/**
 * Bluetooth Actions
 */
// constants, libs, store, ...
import { Actions, BLEConfig, } from '../constants';
import { AppAPI, AppUtil, SensorLogic, } from '../lib';

// import third-party libraries
import _ from 'lodash';
import { Buffer } from 'buffer';
import moment from 'moment'; // TODO: REMOVE ME

// constants
const commands = BLEConfig.commands;
const networkTypes = BLEConfig.networkTypes;

/**
  * UTILITY FUNCTIONS
  */
const convertDecimal = array => array.map(byte => `0${byte.toString(16).toUpperCase()}`.slice(-2)).join(':');

const convertHex = value => parseInt(value, 16);

const validateReadData = (response, dataArray) => (response[0] === 0 && response[2] === dataArray[0] && response[3] === 0);

/**
  * Convert byte array to string
  * eg.
  *   [116,101,115,116]
  *   'test'
  */
const convertByteArrayToString = array => array.map(byte =>  byte && byte > 31 && byte < 127 ? String.fromCharCode(byte) : '').join('');

/**
  * Convert string to byte array
  * eg.
  *   'test'
  *   [116,101,115,116]
  */
const convertStringToByteArray = string => string.split('').map(char => char.charCodeAt(0));

/**
  * Convert string to byte array
  * eg.
  *   'AAjUADygZ1csEgAAAAAAAAAAAAA='
  *   [00 08 d4 00 3c a0 67 57 2c 12 00 00 00 00 00 00 00 00 00 00]
  */
const convertBase64ToHex = string => {
    let hexString = new Buffer.from(string, 'base64').toString('hex');
    console.log('hexString',hexString);
    return hexString.match(/.{1,2}/g).map(val => convertHex(val))
};

const unsignedToSignedInt = int => (int <<24 >>24);

const sleeper = (ms = 500) => new Promise(resolve => setTimeout(() => resolve(), ms));

const read = (device, dataArray, is3Sensor = true, numberOfTries = 0) => {
    let serviceUUID = is3Sensor ? BLEConfig.serviceUUID3Sensor : BLEConfig.serviceUUID;
    let characteristicUUID = is3Sensor ? BLEConfig.characteristicUUID3Sensor : BLEConfig.characteristicUUID;
    console.log('hi from read #1', moment().format('H:m:s:SSS'));
    return device.readCharacteristicForService(serviceUUID, characteristicUUID)
        .then(data => {
            let dataValue = convertBase64ToHex(data.value);
            console.log(
                'hi from read #2',
                numberOfTries,
                data.value,
                dataArray,
                dataValue,
                convertBase64ToHex(dataArray),
                validateReadData(dataValue, convertBase64ToHex(dataArray)),
                moment().format('H:m:s:SSS')
            );
            if(
                (dataArray && validateReadData(dataValue, convertBase64ToHex(dataArray))) ||
                !dataArray ||
                numberOfTries === 5
            ) {
                return dataValue;
            }
            return read(device, dataArray, is3Sensor, (numberOfTries + 1));
        });
};

const write = (device, data, is3Sensor = true, transactionId) => {
    let serviceUUID = is3Sensor ? BLEConfig.serviceUUID3Sensor : BLEConfig.serviceUUID;
    let characteristicUUID = is3Sensor ? BLEConfig.characteristicUUID3Sensor : BLEConfig.characteristicUUID;
    console.log('hi from write #1', moment().format('H:m:s:SSS'));
    return device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, data, transactionId)
        .then(() => {
            console.log('hi from write #2', moment().format('H:m:s:SSS'));
            return read(device, data, is3Sensor);
        });
};

const returnNetworkMapping = value => {
    let networkType = '';
    let toByte = '';
    switch (value) {
    case 0:
        networkType = 'WEP_OPEN';
        toByte = networkTypes[networkType];
        break;
    case 1:
        networkType = 'WEP_SHARED';
        toByte = networkTypes[networkType];
        break;
    case 2:
        networkType = 'WPA_PSK';
        toByte = networkTypes[networkType];
        break;
    case 3:
        networkType = 'WPA2_PSK';
        toByte = networkTypes[networkType];
        break;
    case 4:
        networkType = 'WPA_ENTERPRISE';
        toByte = networkTypes[networkType];
        break;
    case 5:
        networkType = 'WPA2_ENTERPRISE';
        toByte = networkTypes[networkType];
        break;
    case 6:
        networkType = 'OPEN';
        toByte = networkTypes[networkType];
        break;
    default:
        networkType = 'WEP_OPEN';
        toByte = networkTypes[networkType];
    }
    return {
        networkType,
        toByte,
    };
};

const cleanSingleWifiArray = wifiArray => {
    return {
        rssi:     unsignedToSignedInt(wifiArray[5]),
        security: returnNetworkMapping(wifiArray[4]),
        ssid:     convertByteArrayToString(_.slice(wifiArray, 6, wifiArray.length)),
    }
};

const returnCleaned3SensorDataArray = (byteString, command) => {
    let dataArray = [];
    dataArray.push(command);
    dataArray.push(byteString.length);
    for (let i = 2; i < 20 && i-2 < byteString.length; i+=1) {
        dataArray.push(byteString[i-2]);
    }
    for (let i = byteString.length + 2; i < 20; i+=1) {
        dataArray.push(convertHex('0x00'));
    }
    return dataArray;
};

/**
  * API CALL FUNCTIONS
  */
const assignKitIndividual = (accessory, user) => {
    return dispatch => AppAPI.hardware.accessory.patch({ wifiMacAddress: accessory.wifiMacAddress }, { owner_id: user.id })
        .then(response => {
            let data = accessory;
            data.individual = user;
            data.last_user_id = user.id;
            return dispatch({
                type: Actions.CONNECT_TO_ACCESSORY,
                data
            });
        })
        .catch(err => Promise.reject(err));
};

const getSensorFiles = (userObj, days = 14) => {
    let payload = {};
    payload.accessory_id = userObj.sensor_data.sensor_pid;
    payload.timezone = userObj.timezone;
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.preprocessing.status.post(false, payload)
            .then(response => {
                let newUserObj = _.cloneDeep(userObj);
                newUserObj.sensor_data.accessory = response.accessory;
                newUserObj.sensor_data.sessions = response.sessions;
                dispatch({
                    type: Actions.USER_REPLACE,
                    data: newUserObj,
                });
                return resolve(response);
            })
            .catch(error => reject(error));
    });
};

/**
  * 3-SENSOR SYSTEM FUNCTIONS
  */
const startConnection = device => {
    const dataArray = new Buffer([commands.GET_MAC_ADDRESS, convertHex('0x00')]).toString('base64');
    return dispatch => device.connect()
        .then(connectedDevice => connectedDevice.discoverAllServicesAndCharacteristics())
        .then(deviceInfo => write(deviceInfo, dataArray))
        .then(response => {
            let macAddress = convertDecimal(response.slice(4, 10));
            dispatch({
                type: Actions.GET_WIFI_MAC_ADDRESS,
                data: {
                    macAddress:  macAddress,
                    mobile_udid: AppUtil.getDeviceUUID(),
                    sensor_pid:  device.id,
                },
            });
            return macAddress;
        })
        .then(macAddress => AppAPI.hardware.accessory.get({ wifiMacAddress: macAddress }))
        // .then(() => '3C:A0:67:57:2C:12') // TODO: FIX ME PLS
        .then(response => Promise.resolve(response))
        .catch(error => Promise.reject(error));
};

const getScannedWifiConnections = device => {
    // TODO: MIGHT NEED TO PUT THIS ON A TIMER!
    console.log('hi from getScannedWifiConnections #1');
    const dataArray = new Buffer([commands.WRITE_WIFI_SCAN, convertHex('0x00')]).toString('base64');
    return dispatch => write(device, dataArray, true)
        .then(response => {
            console.log('hi from getScannedWifiConnections #2',response[4]);
            return Promise.resolve(response[4]);
        })
        .catch(error => Promise.reject(error));
};

const getSingleWifiConnection = (device, index) => {
    const readDataArray = new Buffer([commands.READ_WIFI_SCAN_SHORT, convertHex('0x01'), convertHex(`0x${index}`)]).toString('base64');
    const readLongDataArray = new Buffer([commands.READ_WIFI_SCAN_LONG, convertHex('0x01'), convertHex(`0x${index}`)]).toString('base64');
    let singleWifiConnectionArray = [];
    return dispatch => write(device, readDataArray, true)
        .then(response => {
            if(response[1] > 18) {
                singleWifiConnectionArray = response;
                return write(device, readLongDataArray, true)
                    .then(res => Promise.resolve(cleanSingleWifiArray(_.concat(singleWifiConnectionArray, res))));
            }
            console.log('hi from getSingleWifiConnection #1',response);
            return Promise.resolve(cleanSingleWifiArray(response));
        })
        .catch(error => Promise.reject(error));
};

const writeWifiDetailsToSensor = (device, ssid, password, securityByte) => {
    const ssidDataArray = convertStringToByteArray(ssid);
    const passwordDataArray = convertStringToByteArray(password ? password : '');
    let shortSlicedPswDataArray = _.slice(passwordDataArray, 0, 18);
    let longSlicedPswDataArray = _.slice(passwordDataArray, 18, 32);
    let shortPswDataArray = new Buffer(returnCleaned3SensorDataArray(shortSlicedPswDataArray, commands.WRITE_WIFI_PSW_SHORT)).toString('base64');
    let longPswDataArray = new Buffer(returnCleaned3SensorDataArray(longSlicedPswDataArray, commands.WRITE_WIFI_PSW_LONG)).toString('base64');
    let shortSlicedSsidDataArray = _.slice(ssidDataArray, 0, 18);
    let longSlicedSsidDataArray = _.slice(ssidDataArray, 18, 32);
    let shortSsidDataArray = new Buffer(returnCleaned3SensorDataArray(shortSlicedSsidDataArray, commands.WRITE_WIFI_SSID_SHORT)).toString('base64');
    let longSsidDataArray = new Buffer(returnCleaned3SensorDataArray(longSlicedSsidDataArray, commands.WRITE_WIFI_SSID_LONG)).toString('base64');
    let connectDataArray = new Buffer([commands.WRITE_WIFI_CONNECT, convertHex('0x01'), securityByte]).toString('base64');
    let readConnectDataArray = new Buffer([commands.READ_WIFI_CONNECT, convertHex('0x00')]).toString('base64');
    // check if ssid & password are out of scope of ble
    if(ssidDataArray && (ssidDataArray.length === 0 || ssidDataArray.length > 32)) {
        return Promise.reject(SensorLogic.errorMessages().longSSID);
    } else if(securityByte !== 0 && passwordDataArray && (passwordDataArray.length === 0 || passwordDataArray.length > 32)) {
        return Promise.reject(SensorLogic.errorMessages().longPass);
    }
    // send commands
    return dispatch => write(device, shortSsidDataArray) // 1. write short wifi
        .then(() => longSlicedSsidDataArray.length === 0 ? '' : write(device, longSsidDataArray)) // 2. check if long wifi -> write if needed
        .then(() => securityByte !== 0 ? write(device, shortPswDataArray) : '') // 3. write short psw
        .then(() => longSlicedPswDataArray.length === 0 ? '' : write(device, longPswDataArray)) // 4. check if long psw -> write if needed
        .then(() => write(device, connectDataArray)) // 5. write connect
        .then(() => sleeper(2000)) // wait 2secs
        .then(() => write(device, readConnectDataArray)) // 6a. write to check if connection was successful (2s later)
        .then(res => {
            console.log('2s later', res, moment().format('H:m:s:SSS'));
            if(res[4] === 0) {
                return sleeper(2000); // wait 2secs
            }
            return Promise.resolve(
                dispatch({
                    type: Actions.WIFI
                })
            );
        })
        .then(() => write(device, readConnectDataArray)) // 6b. write to check if connection was successful (4s later)
        .then(res => {
            console.log('4s later', res, moment().format('H:m:s:SSS'));
            if(res[4] === 0) {
                return sleeper(2000); // wait 2secs
            }
            return Promise.resolve(
                dispatch({
                    type: Actions.WIFI
                })
            );
        })
        .then(() => write(device, readConnectDataArray)) // 6b. write to check if connection was successful (6s later)
        .then(res => {
            console.log('6s later', res, moment().format('H:m:s:SSS'));
            if(res[4] === 0) {
                return sleeper(2000); // wait 2secs
            }
            return Promise.resolve(
                dispatch({
                    type: Actions.WIFI
                })
            );
        })
        .then(res => Promise.reject(SensorLogic.errorMessages().errorWifiConnection))
        .catch(err => Promise.reject(SensorLogic.errorMessages().errorWifiConnection));
};

const exitKitSetup = device => {
    const dataArray = new Buffer([convertHex('0x02'), convertHex('0x01'), convertHex('0x01')]).toString('base64');
    return dispatch => write(device, dataArray)
        .then(response => Promise.resolve(response))
        .catch(error => Promise.reject(error));
};

/**
  * REDUCER CALLS
  */
const deviceFound = data => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.DEVICE_FOUND,
            data
        })
    );
};

export default {
    assignKitIndividual,
    deviceFound,
    exitKitSetup,
    getScannedWifiConnections,
    getSensorFiles,
    getSingleWifiConnection,
    startConnection,
    writeWifiDetailsToSensor,
};