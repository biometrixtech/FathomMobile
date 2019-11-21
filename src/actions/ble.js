/**
 * Bluetooth Actions
 */
// constants, libs, store, ...
import { Actions, BLEConfig, } from '../constants';
import { AppAPI, AppUtil, SensorLogic, } from '../lib';
import { store } from '../store';

// import third-party libraries
import _ from 'lodash';
// import { BleManager, } from 'react-native-ble-plx';
// import { Buffer } from 'buffer';
import moment from 'moment';

// constants
// const commands = BLEConfig.commands;
// const networkTypes = BLEConfig.networkTypes;
// const serviceUUID = BLEConfig.serviceUUID3Sensor;
// const characteristicUUID = BLEConfig.characteristicUUID3Sensor;
//
// let bleManager = null;

/**
  * UTILITY FUNCTIONS
  *
const convertDecimal = array => array.map(byte => `0${byte.toString(16).toUpperCase()}`.slice(-2)).join(':');

const convertHex = value => parseInt(value, 16);

const validateReadData = (response, dataArray) => (response[0] === 0 && response[2] === dataArray[0] && response[3] === 0);

/**
  * Convert byte array to string
  * eg.
  *   [116,101,115,116]
  *   'test'
  *
const convertByteArrayToString = array => array.map(byte => byte && byte > 31 && byte < 127 ? String.fromCharCode(byte) : '').join('');

/**
  * Convert string to byte array
  * eg.
  *   'test'
  *   [116,101,115,116]
  *
const convertStringToByteArray = string => string.split('').map(char => char.charCodeAt(0));

/**
  * Convert string to byte array
  * eg.
  *   'AAjUADygZ1csEgAAAAAAAAAAAAA='
  *   [00 08 d4 00 3c a0 67 57 2c 12 00 00 00 00 00 00 00 00 00 00]
  *
const convertBase64ToHex = string => {
    let hexString = new Buffer.from(string, 'base64').toString('hex');
    return hexString.match(/.{1,2}/g).map(val => convertHex(val))
};

const convertEpochTimeToBase64 = (command, time) => {
    let returnArray = [command];
    let hexArray = parseInt(time, 10).toString(16).toUpperCase().match(/.{1,2}/g).reverse();
    hexArray = hexArray.map(byte => convertHex(`0x${byte}`));
    returnArray.push(hexArray.length);
    returnArray.push(hexArray);
    let cleanedReturnArray = _.flatten(returnArray);
    return new Buffer(cleanedReturnArray).toString('base64');
};

const unsignedToSignedInt = int => (int <<24 >>24);

const sleeper = (ms = 500) => new Promise(resolve => setTimeout(() => resolve(), ms));

const read = async (device, base64Value, transactionId) => {
    return await new Promise(async (resolve, reject) => {
        return await device.readCharacteristicForService(serviceUUID, characteristicUUID, transactionId)
            .then(async characteristic => {
                if(!characteristic.value) {
                    return _.delay(() => read(device, base64Value, transactionId), 2000);
                }
                let value = convertBase64ToHex(characteristic.value);
                let base64WriteValue = convertBase64ToHex(base64Value);
                if(!validateReadData(value, base64WriteValue)) {
                    /*eslint no-use-before-define: 0*
                    return _.delay(() => write(device, base64Value, transactionId), 2000);
                } else if(value[3] === 1) {
                    let errorObj = await handleError({mesasge: 'object not valid - read',}, device);
                    return reject(errorObj);
                }
                return resolve(value);
            })
            .catch(async error => {
                let errorObj = await handleError(error, device);
                return reject(errorObj);
            });
    });
};

const write = async (device, base64Value, transactionId) => {
    return await new Promise(async (resolve, reject) => {
        const characteristicWrite = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Value, transactionId);
        try {
            const sleep = await sleeper(2000);
            const returnHex = await read(device, base64Value, transactionId);
            return resolve(returnHex);
        } catch(error) {
            let errorObj = await handleError(error, device);
            return reject(errorObj);
        }
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
        rssi:     unsignedToSignedInt(wifiArray[1]),
        security: returnNetworkMapping(wifiArray[0]),
        ssid:     convertByteArrayToString(_.slice(wifiArray, 2, wifiArray.length)),
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

const handleError = async (error, device) => {
    if(!error) { error = {}; }
    let errorMappingObj = {
        androidErrorCode: error.androidErrorCode,
        attErrorCode:     error.attErrorCode,
        errorCode:        error.errorCode,
        iosErrorCode:     error.iosErrorCode,
        message:          error.message,
        reason:           error.reason,
    };
    if(!bleManager || !device) {
        return {
            errorMapping: errorMappingObj,
            isConnected:  false,
            rssi:         null,
        };
    }
    return bleManager.isDeviceConnected(device.id)
        .then(async isConnected => {
            const rssiCharacteristic = isConnected ? await device.readRSSI() : null;
            return {
                errorMapping: {},
                isConnected,
                rssi:         rssiCharacteristic.rssi,
            };
        })
        .catch(err => {
            return {
                errorMapping: {},
                isConnected:  false,
                rssi:         null,
            };
        });
};*/

/**
  * API CALL FUNCTIONS
  */
const assignKitIndividual = (accessory, user) => {
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.hardware.accessory.patch({ wifiMacAddress: accessory.wifiMacAddress }, { owner_id: user.id })
            .then(response => {
                let data = accessory;
                data.individual = user;
                data.last_user_id = user.id;
                dispatch({
                    type: Actions.CONNECT_TO_ACCESSORY,
                    data
                });
                return resolve(response);
            })
            .catch(err => reject(err));
    });
};

const getSensorDetails =  userObj => {
    let payload = {};
    payload.accessory_id = userObj.sensor_data.sensor_pid;
    payload.timezone = AppUtil.getFormattedTimezoneString();
    store.dispatch({
        type: Actions.START_REQUEST,
    });
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.preprocessing.details.post({userId: userObj.id}, payload)
            .then(response => {
                let newUserObj = _.cloneDeep(userObj);
                newUserObj.sensor_data.accessory = response.accessory || {};
                newUserObj.sensor_data.sessions = response.sessions;
                dispatch({
                    type: Actions.USER_REPLACE,
                    data: newUserObj,
                });
                dispatch({
                    type: Actions.STOP_REQUEST,
                });
                return resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: Actions.STOP_REQUEST,
                });
                return reject(error);
            });
    });
};

const getSensorFiles = (userObj, cleanSessions, days = 14) => {
    const userHas3SensorSystem = userObj && userObj.sensor_data && userObj.sensor_data.system_type && userObj.sensor_data.system_type === '3-sensor';
    const has3SensorConnected = userObj && userObj.sensor_data && userObj.sensor_data.mobile_udid && userObj.sensor_data.sensor_pid;
    if(!userHas3SensorSystem || !has3SensorConnected) {
        return dispatch => new Promise((resolve, reject) => resolve());
    }
    let payload = {};
    payload.timezone = AppUtil.getFormattedTimezoneString();
    if(cleanSessions) {
        payload.cleanSessions = true;
    }
    store.dispatch({
        type: Actions.START_REQUEST,
    });
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.preprocessing.status.post({userId: userObj.id}, payload)
            .then(response => {
                let newUserObj = _.cloneDeep(userObj);
                newUserObj.sensor_data.accessory = response.accessory || {};
                newUserObj.sensor_data.sessions = response.sessions;
                dispatch({
                    type: Actions.USER_REPLACE,
                    data: newUserObj,
                });
                dispatch({
                    type: Actions.STOP_REQUEST,
                });
                return resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: Actions.STOP_REQUEST,
                });
                return reject(error);
            });
    });
};

const createSensorSession = (dateTime, userObj) => {
    let payload = {};
    payload.event_date = dateTime;
    payload.accessory_id = userObj.sensor_data.sensor_pid;
    payload.sensors = [];
    payload.user_id = userObj.id;
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.preprocessing.create_session.post(false, payload)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
};

const updateSensorSession = (endDate, sessionStatus, sessionId, userObj, backendPatch) => {
    if(!sessionId) {
        return dispatch => new Promise((resolve, reject) => {
            reject('Session not found, please try again!');
        });
    }
    let payload = {};
    if(endDate) {
        payload.end_date = endDate;
    } else if(sessionStatus) {
        payload.session_status = sessionStatus;
    } else if(backendPatch) {
        payload.set_end_date = true;
    }
    return dispatch => new Promise((resolve, reject) => {
        if(sessionStatus && sessionStatus === 'CREATE_ATTEMPT_FAILED') {
            let newUserObj = _.cloneDeep(userObj);
            let newSensorSessions = _.cloneDeep(newUserObj.sensor_data.sessions);
            let sessionIndex = _.findIndex(newSensorSessions, { id: sessionId, });
            if(sessionIndex >= 0) {
                newSensorSessions.splice(sessionIndex, 1);
                newSensorSessions = _.filter(newSensorSessions, o => o.status !== 'CREATE_ATTEMPT_FAILED');
                newUserObj.sensor_data.sessions = newSensorSessions;
                dispatch({
                    type: Actions.USER_REPLACE,
                    data: newUserObj,
                });
            }
        }
        return AppAPI.preprocessing.update_session.patch({sessionId}, payload)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
};

/**
  * REDUCER CALLS
  */
const deviceFound = data => {
    return Promise.resolve(
        store.dispatch({
            type: Actions.DEVICE_FOUND,
            data
        })
    );
};

/**
  * 3-SENSOR SYSTEM FUNCTIONS
  *
const checkRSSI = async (device, characteristic) => {
    return await device.readRSSI()
        .then(async rssiCharacteristic => {
            if(rssiCharacteristic.rssi > SensorLogic.getMinRSSIDBM()) {
                return Promise.resolve(characteristic ? characteristic : device);
            }
            return Promise.reject({});
        })
        .catch(async error => {
            let errorObj = await handleError(error, device);
            return Promise.reject(errorObj);
        });
};

const enable = () => {
    // NOTE: ANDROID ONLY FUNCTION
    if(bleManager) {
        return bleManager.enable()
            .then(res => res)
            .catch(async err => {
                let errorObj = await handleError(err);
                return errorObj;
            });
    }
    bleManager = new BleManager();
    return bleManager.enable()
        .then(res => res)
        .catch(async err => {
            let errorObj = await handleError(err);
            return errorObj;
        });
};

const startMonitor = callback => {
    // NOTE: CAN ADD SUBSCRIPTION HERE IF NEEDED
    bleManager = new BleManager();
    bleManager.onStateChange(callback, true);
};

const destroyInstance = () => {
    if(bleManager) {
        bleManager.destroy();
        bleManager = null;
    }
};

const startConnection = async (device) => {
    const macAddressWriteBase64 = new Buffer([commands.GET_MAC_ADDRESS, convertHex('0x00')]).toString('base64');
    const startConnectionTransactionId = 'start-connection';
    return await new Promise(async (resolve, reject) => {
        return device.connect()
            .then(connectedDevice => connectedDevice.discoverAllServicesAndCharacteristics())
            .then(async deviceInfo => {
                const startConnectionCharacteristic = await write(deviceInfo, macAddressWriteBase64, startConnectionTransactionId);
                try {
                    const macAddress = convertDecimal(startConnectionCharacteristic.slice(4, 10));
                    store.dispatch({
                        type: Actions.GET_WIFI_MAC_ADDRESS,
                        data: {
                            macAddress:  macAddress,
                            mobile_udid: AppUtil.getDeviceUUID(),
                            sensor_pid:  device.id,
                        },
                    });
                    return resolve(macAddress);
                } catch(error) {
                    let errorObj = await handleError(error, device);
                    return reject(errorObj);
                }
            })
            .catch(async err => {
                let errorObj = await handleError(err, device);
                return reject(errorObj);
            });
    });
};

const handleDiscoveredPeripherals = async (error, device, callback, state) => {
    return !error && device.name && device.name === 'fathomKit' ?
        deviceFound(device)
            .then(() => {
                bleManager.stopDeviceScan();
                startConnection(device)
                    .then(macAddress => AppAPI.hardware.accessory.get({ wifiMacAddress: macAddress }))
                    .then(response => callback(null, response, device, state))
                    .catch(err => callback(err, null));
            })
        :
        null;
};

const startDeviceScan = callback => {
    if(!bleManager) {
        startMonitor(state => {
            bleManager.startDeviceScan(
                null,
                { allowDuplicates: false, scanMode: 2, },
                (error, device) => handleDiscoveredPeripherals(error, device, callback, state),
            );
        });
    } else {
        bleManager.startDeviceScan(
            null,
            { allowDuplicates: false, scanMode: 2, },
            (error, device) => handleDiscoveredPeripherals(error, device, callback),
        );
    }
};

const getScannedWifiConnections = device => {
    const wifiScanBase64 = new Buffer([commands.WRITE_WIFI_SCAN, convertHex('0x00')]).toString('base64');
    let wifiScanTransactionId = 'wifi-scan';
    return new Promise((resolve, reject) => {
        return device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, wifiScanBase64, wifiScanTransactionId)
            .then(async characteristic => await checkRSSI(device, characteristic))
            .then(characteristic => {
                let rejectionTimer = _.delay(async () => {
                    bleManager.cancelTransaction(wifiScanTransactionId);
                    let errorObj = await handleError({errorCode: -1,}, device);
                    return reject(errorObj);
                }, 60000);
                let noReturnTimer = _.delay(async () => {
                    let writeCharacterristic = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, wifiScanBase64, wifiScanTransactionId);
                    try {
                        let characteristicBase64 = writeCharacterristic.value;
                        let characteristicHex = convertBase64ToHex(characteristicBase64);
                        return resolve(characteristicHex[4]);
                    } catch(error) {
                        let errorObj = await handleError(error, device);
                        return reject(errorObj);
                    }
                }, 10000);
                characteristic.monitor(
                    async (error, monitoredCharacteristic) => {
                        clearTimeout(rejectionTimer);
                        clearTimeout(noReturnTimer);
                        bleManager.cancelTransaction(wifiScanTransactionId);
                        if(error) {
                            let errorObj = await handleError(error, device);
                            return reject(errorObj);
                        }
                        let monitoredCharacteristicBase64 = monitoredCharacteristic.value;
                        let monitoredCharacteristicHex = convertBase64ToHex(monitoredCharacteristicBase64);
                        return resolve(monitoredCharacteristicHex[4]);
                    },
                    wifiScanTransactionId
                );
            })
            .catch(async error => {
                let errorObj = await handleError(error, device);
                return reject(errorObj);
            });
    });
};

const getSingleWifiConnection = async (device, index) => {
    return await new Promise(async (resolve, reject) => {
        const readSingleWifiShortHex = [commands.READ_WIFI_SCAN_SHORT, convertHex('0x01'), convertHex(`0x${index}`)];
        const readSingleWifiShortBase64 = new Buffer(readSingleWifiShortHex).toString('base64');
        const readSingleWifiLongHex = [commands.READ_WIFI_SCAN_LONG, convertHex('0x01'), convertHex(`0x${index}`)];
        const readSingleWifiLongBase64 = new Buffer(readSingleWifiLongHex).toString('base64');
        const singleWifiShortTransactionId = `single-wifi-short-connection-${index}`;
        const singleWifiLongTransactionId = `single-wifi-long-connection-${index}`;
        let responseHex = [];
        return await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, readSingleWifiShortBase64, singleWifiShortTransactionId)
            .then(async characteristic => await checkRSSI(device, characteristic))
            .then(async shortWifiCharacteristic => {
                let shortWifiSleep = await sleeper(1000);
                let response = await shortWifiCharacteristic.read(singleWifiShortTransactionId);
                responseHex = convertBase64ToHex(response.value);
                if(responseHex[1] > 18) {
                    return await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, readSingleWifiLongBase64, singleWifiLongTransactionId);
                }
                return resolve(cleanSingleWifiArray(responseHex.slice(4, responseHex.length)));
            })
            .then(async longWifiCharacteristic => {
                let longWifiSleep = await sleeper(1000);
                let longCharacteristic = await longWifiCharacteristic.read(singleWifiLongTransactionId);
                let longResponseHex = convertBase64ToHex(longCharacteristic.value);
                if(convertByteArrayToString(longResponseHex) === '\\' || convertByteArrayToString(longResponseHex) === '/') {
                    let errorObj = await handleError({}, device);
                    return reject(errorObj);
                }
                return resolve(cleanSingleWifiArray(_.concat(responseHex.slice(4, responseHex.length), longResponseHex)));
            })
            .catch(async error => {
                let errorObj = await handleError(error, device);
                return reject(errorObj);
            });
    });
};

const validateWriteWifiDetailsResponse = async (characteristic, writeBase64Value, device, transactionId) => {
    let timeout = sleeper(1000);
    let responseValidation = new Promise(async (resolve, reject) => {
        const sleep = await sleeper(1000);
        return await device.readCharacteristicForService(serviceUUID, characteristicUUID, transactionId)
            .then(readCharacteristic => {
                let responseHex = convertBase64ToHex(readCharacteristic.value);
                let writeHex = convertBase64ToHex(writeBase64Value);
                let isValid = validateReadData(responseHex, writeHex);
                if(!isValid) {
                    return reject({});
                }
                return resolve();
            })
            .catch(error => reject(error));
    });
    return Promise
        .all([responseValidation, timeout])
        .then(res => Promise.resolve(res))
        .catch(err => Promise.reject(err));
};

const checkCharacteristicForChange = async (device, readConnectBase64, transactionId, startTime) => {
    const timeLimit = 12;
    const readConnectSleep = await sleeper(1000);
    return await write(device, readConnectBase64, transactionId)
        .then(readConnectCharacteristic => {
            let timeDiff = moment().diff(startTime, 'seconds');
            if(readConnectCharacteristic[4] !== 1 && timeDiff <= timeLimit) {
                return checkCharacteristicForChange(device, readConnectBase64, transactionId, startTime);
            } else if(readConnectCharacteristic[4] !== 1 && timeDiff >= timeLimit) {
                return Promise.reject({});
            }
            return Promise.resolve(readConnectCharacteristic);
        })
        .catch(error => Promise.reject(error));
};

const writeWifiDetailsToSensor = async (device, ssid, password, securityByte) => {
    const ssidDataArray = convertStringToByteArray(ssid);
    const passwordDataArray = convertStringToByteArray(password ? password : '');
    let shortSlicedPswDataArray = _.slice(passwordDataArray, 0, 18);
    let longSlicedPswDataArray = _.slice(passwordDataArray, 18, 32);
    let shortPswBase64 = new Buffer(returnCleaned3SensorDataArray(shortSlicedPswDataArray, commands.WRITE_WIFI_PSW_SHORT)).toString('base64');
    let longPswBase64 = new Buffer(returnCleaned3SensorDataArray(longSlicedPswDataArray, commands.WRITE_WIFI_PSW_LONG)).toString('base64');
    let shortSlicedSsidDataArray = _.slice(ssidDataArray, 0, 18);
    let longSlicedSsidDataArray = _.slice(ssidDataArray, 18, 32);
    let shortSsidBase64 = new Buffer(returnCleaned3SensorDataArray(shortSlicedSsidDataArray, commands.WRITE_WIFI_SSID_SHORT)).toString('base64');
    let longSsidBase64 = new Buffer(returnCleaned3SensorDataArray(longSlicedSsidDataArray, commands.WRITE_WIFI_SSID_LONG)).toString('base64');
    let connectBase64 = new Buffer([commands.WRITE_WIFI_CONNECT, convertHex('0x01'), convertHex(`0x${securityByte}`)]).toString('base64');
    let readConnectBase64 = new Buffer([commands.READ_WIFI_CONNECT, convertHex('0x00')]).toString('base64');
    // check if ssid & password are out of scope of ble
    if(ssidDataArray && (ssidDataArray.length === 0 || ssidDataArray.length > 32)) {
        let errorObj = await handleError({errorCode: -2, message: SensorLogic.errorMessages().longSSID,});
        return Promise.reject(errorObj);
    } else if(securityByte !== 0 && passwordDataArray && (passwordDataArray.length === 0 || passwordDataArray.length > 32)) {
        let errorObj = await handleError({errorCode: -2, message: SensorLogic.errorMessages().longPass,});
        return Promise.reject(errorObj);
    }
    // send commands
    return await new Promise(async (resolve, reject) => {
        let rejectionTimer = _.delay(async () => {
            let errorObj = await handleError({errorCode: -1,}, device);
            return reject(errorObj);
        }, 240000);
        return await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, shortSsidBase64, 'short-ssid') // 1. write short wifi
            .then(async characteristic => await checkRSSI(device, characteristic))
            .then(async shortSSIDCharacteristic => await validateWriteWifiDetailsResponse(shortSSIDCharacteristic, shortSsidBase64, device, 'short-ssid'))
            .then(async validateResponse => {
                if(longSlicedSsidDataArray.length > 0) {
                    return await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, longSsidBase64, 'long-ssid'); // 2. check if long wifi -> write if needed
                }
                return '';
            })
            .then(async longSSIDCharacteristic => {
                if(longSSIDCharacteristic !== '') {
                    return await validateWriteWifiDetailsResponse(longSSIDCharacteristic, longSsidBase64, device, 'long-ssid');
                }
                return '';
            })
            .then(async () => {
                const longSSIDSleep = await sleeper(1000);
                if(securityByte > 0) {
                    return await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, shortPswBase64, 'long-password'); // 3. write short psw
                }
                return '';
            })
            .then(async shortPswCharacteristic => {
                if(shortPswCharacteristic !== '') {
                    return await validateWriteWifiDetailsResponse(shortPswCharacteristic, shortPswBase64, device, 'long-password');
                }
                return '';
            })
            .then(async () => {
                const shortPswSleep = await sleeper(1000);
                if(longSlicedPswDataArray.length > 0) {
                    return await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, longPswBase64, 'long-password'); // 4. check if long psw -> write if needed
                }
                return '';
            })
            .then(async longPswCharacteristic => {
                if(longPswCharacteristic !== '') {
                    return await validateWriteWifiDetailsResponse(longPswCharacteristic, longPswBase64, device, 'long-password');
                }
                return '';
            })
            .then(async () => {
                const longPswSleep = await sleeper(1000);
                return await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, connectBase64, 'connect-wifi'); // 5. write connect
            })
            .then(async connectCharacteristic => await validateWriteWifiDetailsResponse(connectCharacteristic, connectBase64, device, 'connect-wifi'))
            .then(async () => {
                let connectSleep = await sleeper(1000);
                return await checkCharacteristicForChange(device, readConnectBase64, 'read-connect-wifi', moment());
            })
            .then(async res => {
                clearTimeout(rejectionTimer);
                return resolve(
                    store.dispatch({
                        type: Actions.WIFI
                    })
                );
            })
            .catch(async err => {
                let errorObj = await handleError(err, device);
                return reject(errorObj);
            });
    });
};

const exitKitSetup = async device => {
    const disconnectBase64 = new Buffer([convertHex('0x02'), convertHex('0x01'), convertHex('0x01')]).toString('base64');
    return await new Promise(async (resolve, reject) => {
        return device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, disconnectBase64, 'exit-kit-setup')
            .then(characteristic => resolve(characteristic))
            .catch(async error => {
                let errorObj = await handleError(error, device);
                return reject(errorObj);
            });
    });
};

const writeWifiNetworkReset = device => {
    const resetWifiNetworkBase64 = new Buffer([commands.WRITE_WIFI_NETWORK_RESET, convertHex('0x00')]).toString('base64');
    let resetWifiTransactionId = 'reset-wifi-network';
    return new Promise((resolve, reject) => {
        return device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, resetWifiNetworkBase64, resetWifiTransactionId)
            .then(async characteristic => await checkRSSI(device, characteristic))
            .then(characteristic => resolve(characteristic))
            .catch(async error => {
                let errorObj = await handleError(error, device);
                return reject(errorObj);
            });
    });
};

const writeAccessoryTime = async device => {
    let writeTimeBase64 = '';
    let writeTimeTransactionId = 'write-time';
    return await new Promise(async (resolve, reject) => {
        return AppAPI.hardware.get_utc_time.get()
            .then(async response => {
                let responseDate = response.current_date;
                let currentUTCTime = moment(responseDate, 'YYYY-MM-DDTHH:mm:ssZ').utc();
                let currentUTCEpochTime = currentUTCTime.unix();
                writeTimeBase64 = convertEpochTimeToBase64(commands.WRITE_TIME, currentUTCEpochTime);
                return await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, writeTimeBase64, writeTimeTransactionId)
            })
            .then(async writeCharacteristic => await validateWriteWifiDetailsResponse(writeCharacteristic, writeTimeBase64, device, writeTimeTransactionId))
            .then(res => resolve())
            .catch(err => resolve());
    });
};*/

export default {
    assignKitIndividual,
    createSensorSession,
    // destroyInstance,
    // enable,
    // exitKitSetup,
    // getScannedWifiConnections,
    getSensorDetails,
    getSensorFiles,
    // getSingleWifiConnection,
    // handleError,
    // sleeper,
    // startDeviceScan,
    // startMonitor,
    updateSensorSession,
    // writeAccessoryTime,
    // writeWifiDetailsToSensor,
    // writeWifiNetworkReset,
};