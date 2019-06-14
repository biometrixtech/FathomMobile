/**
 * Bluetooth Actions
 */
// constants, libs, store, ...
import { Actions, AppConfig, BLEConfig, } from '../constants';
import { AppAPI, AppUtil, } from '../lib';
import { store } from '../store';

// import third-party libraries
import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import * as Fabric from 'react-native-fabric';
import moment from 'moment';

// Fabric specific
const Answers = Fabric.Answers;

// constants
const commands = BLEConfig.commands;
const networkTypes = BLEConfig.networkTypes;
const state = BLEConfig.state;
const timeoutValue = 30500;

/**
  * UTILITY FUNCTIONS
  */
const validateReadData = (response, dataArray) => {
    return response[0] === 0 && response[2] === dataArray[0] && response[3] === 0;
};

const read = (id, dataArray, is3Sensor) => {
    let serviceUUID = is3Sensor ? BLEConfig.serviceUUID3Sensor : BLEConfig.serviceUUID;
    let characteristicUUID = is3Sensor ? BLEConfig.characteristicUUID3Sensor : BLEConfig.characteristicUUID;
    return BleManager.read(id, serviceUUID, characteristicUUID)
        .then(data => {
            // Answers.logCustom('BLE read', {
            //     data,
            //     deviceInfo: AppConfig.deviceInfo,
            //     id,
            // });
            if(dataArray && validateReadData(data, dataArray)) {
                return data;
            } else if(!dataArray) {
                return data;
            }
            return read(id, dataArray, is3Sensor);
        });
};

const write = (id, data, is3Sensor) => {
    // Answers.logCustom('BLE write', {
    //     data,
    //     deviceInfo: AppConfig.deviceInfo,
    //     id,
    // });
    let serviceUUID = is3Sensor ? BLEConfig.serviceUUID3Sensor : BLEConfig.serviceUUID;
    let characteristicUUID = is3Sensor ? BLEConfig.characteristicUUID3Sensor : BLEConfig.characteristicUUID;
    return BleManager.write(id, serviceUUID, characteristicUUID, data)
        .then(() => read(id, data, is3Sensor));
};

/**
  * Convert string to byte array
  * eg.
  *   'test'
  *   [116,101,115,116]
  */
const convertStringToByteArray = string => {
    return string.split('').map(char => char.charCodeAt(0));
};

/**
  * Convert byte array to string
  * eg.
  *   [116,101,115,116]
  *   'test'
  */
const convertByteArrayToString = array => {
    return array.map(byte =>  byte && byte > 31 && byte < 127 ? String.fromCharCode(byte) : '').join('');
};

const convertDecimal = array => {
    return array.map(byte => `0${byte.toString(16).toUpperCase()}`.slice(-2)).join(':');
};

const convertHex = value => {
    return parseInt(value, 16);
};

const convertToUnsigned32BitIntByteArray = value => {
    return value.toString(16).match(/.{1,2}/g).map(val => convertHex(val));
};

const sleeper = (ms = 500) => {
    return x => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    }
};

// Creating a promise wrapper for setTimeout
// const wait = (delay = 0) => new Promise(resolve => setTimeout(resolve, delay));

const getOwnerFlag = id => {
    let dataArray = [commands.GET_OWNER_FLAG, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            return dispatch({
                type: Actions.GET_OWNER_FLAG,
                data: response[3] === 0 && response[4] === 1
            });
        });
};

const getKitName = id => {
    let dataArray = [commands.GET_KIT_NAME, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            return convertByteArrayToString(response.slice(4,20));
        })
        .then(name => {
            return dispatch({
                type: Actions.GET_KIT_NAME,
                data: name
            });
        })
}

const assignType = type => {
    return dispatch => dispatch({
        type: Actions.ASSIGN_TYPE,
        data: type
    });
};

const checkState = () => {
    return dispatch => new Promise(resolve => resolve(BleManager.checkState()))
        .then(() => dispatch({
            type: Actions.CHECK_STATE
        }));
};

const changeState = kitState => {
    return dispatch => dispatch({
        type: Actions.CHANGE_STATE,
        data: kitState
    });
};

const enableBluetooth = () => {
    return dispatch => BleManager.enableBluetooth()
        .then(() => dispatch({
            type: Actions.ENABLE_BLUETOOTH
        }))
        .catch(err => { console.log(err); return Promise.reject(err); });
};

const startBluetooth = () => {
    let currentBLEState = store.getState().ble;
    if(currentBLEState.bleStarted) {
        return Promise.resolve();
    }
    return BleManager.start({ showAlert: true })
        .then(() => {
            store.dispatch({
                type: Actions.START_BLUETOOTH
            });
            return Promise.resolve();
        })
        .catch(err => { console.log(err); return Promise.reject(err); });
};

const startScan = (seconds = 30) => {
    return dispatch => BleManager.scan([], seconds, false, { scanMode: 2 })
        .then(() => dispatch({
            type: Actions.START_SCAN
        }))
        .catch(err => { console.log(err); return Promise.reject(err); });
};

const stopScan = () => {
    return dispatch => BleManager.stopScan()
        .then(() => dispatch({
            type: Actions.STOP_SCAN
        }))
        .catch(err => { console.log(err); return Promise.reject(err); });
};

const deviceFound = data => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.DEVICE_FOUND,
            data
        })
    );
};

const startConnect = () => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.START_CONNECT
        })
    )
        .catch(err => Promise.reject(err));
};

const stopConnect = () => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.STOP_CONNECT
        })
    )
        .catch(err => Promise.reject(err));
};

const setKitTime = id => {
    let dataArray = [commands.SET_TIME, convertHex('0x04')];
    dataArray = dataArray.concat(convertToUnsigned32BitIntByteArray(Math.round((new Date()).getTime() / 1000))); // unholy command to convert current time since epoch to a hex string to an array of hex to an array of decimal representations of the hex values to send
    console.log(id, dataArray);
    return dispatch => write(id, dataArray)
        .then(result => {
            return dispatch({
                type: Actions.SET_KIT_TIME
            });
        });
};

const startDisconnection = (sensorId, is3Sensor) => {
    if(is3Sensor) {
        return dispatch => BleManager.disconnect(sensorId)
            .catch(err => BleManager.disconnect(sensorId))
            .then(() => Promise.resolve('successfully disconnected'))
            .catch(err => Promise.reject(err)); // ble err will always return the same string 'Device not connected'
    }
    return BleManager.disconnect(sensorId)
        .catch(err => BleManager.disconnect(sensorId))
        .then(() => Promise.resolve('successfully disconnected'))
        .catch(err => Promise.reject(err)); // ble err will always return the same string 'Device not connected'
};

const startConnection = sensorId => {
    // NOTE: timeout function added due to - 'Attempts to connect to a peripheral do not time out' (iOS documentation)
    let timeout = null;
    let startingToConnect = new Promise((resolve, reject) => {
        return startDisconnection(sensorId)
            .catch(err => {
                // ble err will always return the same string 'Device not connected'
                // continue normally if startDisconnection failed (could be because we don't have an open connection)
                return true;
            })
            .then(() => startBluetooth())
            .then(() => BleManager.connect(sensorId))
            .catch(err => BleManager.connect(sensorId))
            .then(() => {
                clearTimeout(timeout);
                return resolve('successfully connected');
            })
            .catch(err => reject(err));
    });
    return Promise.race([
        startingToConnect,
        new Promise((resolve, reject) => {
            timeout = setTimeout(() => reject('could not connect'), timeoutValue);
            return timeout;
        })
    ])
        .then(response => Promise.resolve(response))
        .catch(err => Promise.reject(err));
};

/**
  * converts UTC epoch time to local string needed to send to API
  */
const convertUTCEpochTimeToLocalString = epoch => {
    return `${moment.unix(epoch).toISOString(true).split('.')[0]}Z`;
};

/**
  * converts our unsigned 32-bit integer to epoch time
  * NOTE: array must be reversed once pulled
  * start_time = array.slice(4, 8).reverse();
  * end_time = array.slice(8, 12).reverse();
  */
const convertUnsigned32BitIntToEpochTime = array => {
    let timestamp = 0;
    _.map(array, (i, key) => {
        timestamp += i << 8 * (3 - key);
    });
    return convertUTCEpochTimeToLocalString(timestamp);
};

/**
  * converts to bytes then converts to unsigned 32-bit integer then converts to a float value
  * NOTE: array must be reversed once pulled
  * https://jsfiddle.net/L0y7ohtr/82/
  */
const convertAccelerationToFloat = array => {
    let unsigned32BitInt = 0;
    _.map(array, (i, key) => {
        let newValue = typeof i === 'string' ? parseInt(i, 16) : i;
        unsigned32BitInt += newValue << 8 * (3 - key);
    });
  	let intData = new Uint32Array(1);
    intData[0] = unsigned32BitInt;
    let dataAsFloat = new Float32Array(intData.buffer);
    return Math.ceil(dataAsFloat[0]);
};

/**
  * converts unsigned 16-bit integer to value
  * NOTE: array must be reversed once pulled
  * https://jsfiddle.net/L0y7ohtr/81/
  */
const convertDurationToInt = array => {
    let unsigned16BitInt = 0;
    _.map(array, (i, key) => {
        let newValue = typeof i === 'string' ? parseInt(i, 16) : i;
        unsigned16BitInt += newValue << 8 * (1 - key);
    });
  	return unsigned16BitInt;
};

/**
  * NEW FUNCTIONS
  * - 1 Sensor System
  */
const connectToAccessory = data => {
    const getSetupModeArray = [commands.IS_SINGLE_SENSOR_IN_SETUP_MODE, convertHex('0x00')];
    let setKitTimeArray = [commands.SET_TIME, convertHex('0x04')];
    setKitTimeArray = setKitTimeArray.concat(convertToUnsigned32BitIntByteArray(Math.round((new Date()).getTime() / 1000))); // unholy command to convert current time since epoch to a hex string to an array of hex to an array of decimal representations of the hex values to send
    return dispatch => BleManager.disconnect(data.id)
        .catch(err => BleManager.disconnect(data.id))
        .then(() => BleManager.connect(data.id))
        .catch(err => BleManager.connect(data.id))
        .then(() => BleManager.retrieveServices(data.id))
        .catch(err => BleManager.retrieveServices(data.id))
        .then(peripheralInfo => {
            return write(peripheralInfo.id, setKitTimeArray) // set kit time - 0x35
                .then(() => write(peripheralInfo.id, getSetupModeArray)); // get setup mode - 0x74
        })
        .then(response => Promise.resolve(
            dispatch({
                type: Actions.CONNECT_TO_ACCESSORY,
                data
            })
        ))
        .catch(err => Promise.reject(err));
};

const getUserSensorData = userId => {
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.get_user.get({userId})
            .then(result => {
                let cleanedResult = {};
                cleanedResult.sensor_pid = result.user.sensor_pid;
                cleanedResult.mobile_udid = result.user.mobile_udid;
                dispatch({
                    type: Actions.CONNECT_TO_ACCESSORY,
                    data: cleanedResult,
                });
                return resolve(result);
            })
            .catch(err => {
                dispatch({
                    type: Actions.CONNECT_TO_ACCESSORY,
                });
                return reject(err);
            });
    });
};

const postUserSensorData = userId => {
    return dispatch => new Promise((resolve, reject) => {
        let currentState = store.getState();
        // mobile uuid
        const uniqueId = AppUtil.getDeviceUUID();
        // build object to submit
        let dataObj = {};
        dataObj.sensor_pid = currentState.ble.accessoryData.id;
        dataObj.mobile_udid = uniqueId;
        return AppAPI.update_user.patch({ userId }, dataObj)
            .then(result => {
                let cleanedResult = {};
                cleanedResult.sensor_pid = result.sensor_pid;
                cleanedResult.mobile_udid = result.mobile_udid;
                dispatch({
                    type: Actions.CONNECT_TO_ACCESSORY,
                    data: cleanedResult,
                });
                return resolve(result);
            })
            .catch(err => {
                dispatch({
                    type: Actions.CONNECT_TO_ACCESSORY,
                });
                return reject(err);
            });
    });
};

const deleteUserSensorData = () => {
    return dispatch => new Promise((resolve, reject) => {
        let currentState = store.getState();
        // get user id
        let userId = currentState.user.id;
        // build object to submit
        let dataObj = {};
        dataObj.sensor_pid = null;
        dataObj.mobile_udid = null;
        return AppAPI.update_user.patch({ userId }, dataObj)
            .then(result => {
                dispatch({
                    type: Actions.BLUETOOTH_DISCONNECT
                });
                return resolve(result);
            })
            .catch(err => {
                dispatch({
                    type: Actions.BLUETOOTH_DISCONNECT
                });
                return reject(err);
            });
    });
};

const getSingleSensorStatus = sensorId => {
    // NOTE: timeout function added due to - 'Attempts to connect to a peripheral do not time out' (iOS documentation)
    let timeout = null;
    let gettingSensorStatus = new Promise((resolve, reject) => {
        return BleManager.retrieveServices(sensorId)
            .catch(err => BleManager.retrieveServices(sensorId))
            .then(peripheralInfo => {
                const dataArray = [commands.GET_ENTIRE_SYSTEM_STATUS, convertHex('0x00')];
                return write(peripheralInfo.id, dataArray); // get entire system status - 0x7D
            })
            .then(response => {
                let returnObj = {};
                returnObj.systemStatus = response[4];
                returnObj.batteryCharge = response[5] > 100 ? 100 : response[5];
                returnObj.numberOfPractices = response[6];
                store.dispatch({
                    type:          Actions.UPDATE_BLE_STATUSES,
                    batteryCharge: returnObj.batteryCharge,
                    systemStatus:  returnObj.systemStatus,
                });
                clearTimeout(timeout);
                return resolve(returnObj);
            })
            .catch(err => {
                return reject(err);
            });
    });
    return Promise.race([
        gettingSensorStatus,
        new Promise((resolve, reject) => {
            timeout = setTimeout(() => {
                let systemStatus = 0;
                let batteryCharge = 0;
                store.dispatch({
                    type:          Actions.UPDATE_BLE_STATUSES,
                    batteryCharge: batteryCharge,
                    systemStatus:  systemStatus,
                });
                return reject('could not connect');
            }, timeoutValue);
            return timeout;
        })
    ])
        .then(response => Promise.resolve(response))
        .catch(err => Promise.reject(err));
};

const getAllPracticeDetails = (sensorId, practiceIndex = 0) => {
    // NOTE: timeout function added due to - 'Attempts to connect to a peripheral do not time out' (iOS documentation)
    let timeout = null;
    let gettingAllPracticeDetails = new Promise((resolve, reject) => {
        let returnObj = {};
        return BleManager.retrieveServices(sensorId)
            .then(peripheralInfo => {
                let timestampsArray = [commands.GET_PRACTICE_TIMESTAMPS, convertHex('0x01'), convertHex(practiceIndex)];
                return write(peripheralInfo.id, timestampsArray); // get single sensor practice timestamps - 0x76
            })
            .then(response => {
                returnObj.start_time = convertUnsigned32BitIntToEpochTime(response.slice(4, 8).reverse());
                returnObj.end_time = convertUnsigned32BitIntToEpochTime(response.slice(8, 12).reverse());
                return response;
            })
            .then(res => {
                const accelerationsArray = [commands.GET_PRACTICE_ACCELERATIONS, convertHex('0x01'), convertHex(practiceIndex)];
                return write(sensorId, accelerationsArray); // get single sensor practice accelerations - 0x77
            })
            .then(res2 => {
                returnObj.inactive_accel = convertAccelerationToFloat(res2.slice(4, 8).reverse());
                returnObj.low_accel = convertAccelerationToFloat(res2.slice(8, 12).reverse());
                returnObj.mod_accel = convertAccelerationToFloat(res2.slice(12, 16).reverse());
                returnObj.high_accel = convertAccelerationToFloat(res2.slice(16, 20).reverse());
                return res2;
            })
            .then(res3 => {
                const durationsArray = [commands.GET_PRACTICE_DURATION, convertHex('0x01'), convertHex(practiceIndex)];
                return write(sensorId, durationsArray); // get single sensor practice windows duration - 0x78
            })
            .then(res4 => {
                returnObj.inactive_duration = convertDurationToInt(res4.slice(4, 6).reverse());
                returnObj.low_duration = convertDurationToInt(res4.slice(6, 8).reverse());
                returnObj.mod_duration = convertDurationToInt(res4.slice(8, 10).reverse());
                returnObj.high_duration = convertDurationToInt(res4.slice(10, 12).reverse());
                return resolve(returnObj);
            })
            .catch(err => reject(err));
    });
    return Promise.race([
        gettingAllPracticeDetails,
        new Promise((resolve, reject) => {
            timeout = setTimeout(() => reject('could not connect'), timeoutValue);
            return timeout;
        })
    ])
        .then(response => Promise.resolve(response))
        .catch(err => Promise.reject(err));
};

const deleteAllSingleSensorPractices = sensorId => {
    // NOTE: timeout function added due to - 'Attempts to connect to a peripheral do not time out' (iOS documentation)
    let timeout = null;
    let deletingAllPractices = new Promise((resolve, reject) => {
        const dataArray = [commands.DELETE_ALL_PRACTICES, convertHex('0x00')];
        return BleManager.retrieveServices(sensorId)
            .then(peripheralInfo => write(peripheralInfo.id, dataArray)) // delete single sensor practice - 0x79
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
    return Promise.race([
        deletingAllPractices,
        new Promise((resolve, reject) => {
            timeout = setTimeout(() => reject('could not connect'), timeoutValue);
            return timeout;
        })
    ])
        .then(response => Promise.resolve(response))
        .catch(err => Promise.reject(err));
};

const deleteSinglePractice = (sensorId, practiceIndex = 0) => {
    // NOTE: timeout function added due to - 'Attempts to connect to a peripheral do not time out' (iOS documentation)
    let timeout = null;
    let deletingPractice = new Promise((resolve, reject) => {
        const dataArray = [commands.DELETE_SINGLE_PRACTICE, convertHex('0x01'), convertHex(practiceIndex)];
        return BleManager.retrieveServices(sensorId)
            .then(peripheralInfo => write(peripheralInfo.id, dataArray)) // delete single sensor practice - 0x79
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
    return Promise.race([
        deletingPractice,
        new Promise((resolve, reject) => {
            timeout = setTimeout(() => reject('could not connect'), timeoutValue);
            return timeout;
        })
    ])
        .then(response => Promise.resolve(response))
        .catch(err => Promise.reject(err));
};

/**
  * NEW FUNCTIONS
  * - 3 Sensor System
  */
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
        rssi:     wifiArray[5],
        security: returnNetworkMapping(wifiArray[4]),
        ssid:     convertByteArrayToString(_.slice(wifiArray, 6, wifiArray.length)),
    }
};

const getBLEMacAddress = sensorId => {
    // NOTE: timeout function added due to - 'Attempts to connect to a peripheral do not time out' (iOS documentation)
    let timeout = null;
    return dispatch => {
        let fetchMacAddress = new Promise((resolve, reject) => {
            const dataArray = [commands.GET_MAC_ADDRESS, convertHex('0x00')];
            return BleManager.disconnect(sensorId)
                .catch(err => BleManager.disconnect(sensorId))
                .then(() => BleManager.connect(sensorId))
                .catch(err => BleManager.connect(sensorId))
                .then(() => BleManager.retrieveServices(sensorId))
                .catch(err => BleManager.retrieveServices(sensorId))
                .then(peripheralInfo => write(peripheralInfo.id, dataArray, true))
                .then(response => response[3] === 1 ? write(sensorId, dataArray, true) : convertDecimal(response.slice(4, 10)))
                .then(macAddress => {
                    if(macAddress === '00:00:00:00:00:00') {
                        return write(sensorId, dataArray, true);
                    }
                    return resolve(
                        dispatch({
                            type: Actions.GET_WIFI_MAC_ADDRESS,
                            data: {
                                macAddress:  macAddress,
                                mobile_udid: AppUtil.getDeviceUUID(),
                                sensor_pid:  sensorId,
                            },
                        })
                    );
                })
                .catch(err => reject(err));
        });
        return Promise.race([
            fetchMacAddress,
            new Promise((resolve, reject) => {
                timeout = setTimeout(() => reject('Error fetching MAC Address'), timeoutValue);
                return timeout;
            })
        ])
            .then(response => Promise.resolve(response))
            .catch(err => Promise.reject(err));
    };
};

const writeWifiDetailsToSensor = (sensorId, ssid, password, securityByte) => {
    // NOTE: timeout function added due to - 'Attempts to connect to a peripheral do not time out' (iOS documentation)
    let timeout = null;
    return dispatch => {
        let fetchingWifiConnections = new Promise((resolve, reject) => {
            // setup consts needed
            const ssidDataArray = convertStringToByteArray(ssid);
            const passwordDataArray = convertStringToByteArray(password);
            let shortSlicedPswDataArray = _.slice(passwordDataArray, 0, 18);
            let longSlicedPswDataArray = _.slice(passwordDataArray, 18, 32);
            let shortPswDataArray = returnCleaned3SensorDataArray(shortSlicedPswDataArray, commands.WRITE_WIFI_PSW_SHORT);
            let longPswDataArray = returnCleaned3SensorDataArray(longSlicedPswDataArray, commands.WRITE_WIFI_PSW_LONG);
            let shortSlicedSsidDataArray = _.slice(ssidDataArray, 0, 18);
            let longSlicedSsidDataArray = _.slice(ssidDataArray, 18, 32);
            let shortSsidDataArray = returnCleaned3SensorDataArray(shortSlicedSsidDataArray, commands.WRITE_WIFI_SSID_SHORT);
            let longSsidDataArray = returnCleaned3SensorDataArray(longSlicedSsidDataArray, commands.WRITE_WIFI_SSID_LONG);
            let connectDataArray = [commands.WRITE_WIFI_CONNECT, convertHex('0x01'), securityByte];
            let readConnectDataArray = [commands.READ_WIFI_CONNECT, convertHex('0x00')];
            // check if ssid & password are out of scope of ble
            if(ssidDataArray && (ssidDataArray.length === 0 || ssidDataArray.length > 32)) {
                return reject('This network name is longer than we can support. Please select a different network or change your password to be <32 characters.');
            } else if(passwordDataArray && (passwordDataArray.length === 0 || passwordDataArray.length > 32)) {
                return reject('This password is longer than we can support. Please select a different network or change your password to be <32 characters.');
            }
            // checks done, now update sensor
            return BleManager.disconnect(sensorId)
                .catch(err => BleManager.disconnect(sensorId))
                .then(() => BleManager.connect(sensorId))
                .catch(err => BleManager.connect(sensorId))
                .then(() => BleManager.retrieveServices(sensorId))
                .catch(err => BleManager.retrieveServices(sensorId))
                .then(peripheralInfo => write(peripheralInfo.id, shortSsidDataArray, true)) // 1. write short wifi
                .then(res => BleManager.retrieveServices(sensorId))
                .then(peripheralInfo => longSlicedSsidDataArray.length === 0 ? peripheralInfo : write(peripheralInfo.id, longSsidDataArray, true)) // 2. check if long wifi -> write if needed
                .then(res => BleManager.retrieveServices(sensorId))
                .then(peripheralInfo => write(peripheralInfo.id, shortPswDataArray, true)) // 3. write short psw
                .then(res => BleManager.retrieveServices(sensorId))
                .then(peripheralInfo => longSlicedPswDataArray.length === 0 ? peripheralInfo : write(peripheralInfo.id, longPswDataArray, true)) // 4. check if long psw -> write if needed
                .then(res => BleManager.retrieveServices(sensorId))
                .then(peripheralInfo => write(peripheralInfo.id, connectDataArray, true)) // 4. write connect
                .then(res => _.delay(() => BleManager.retrieveServices(sensorId), 2000))
                .then(peripheralInfo => write(peripheralInfo.id, readConnectDataArray, true)) // 5. write to check if connection was successful (2s later)
                .then(res => {
                    if(res[4] === 0) {
                        return _.delay(() => BleManager.retrieveServices(sensorId), 2000);
                    }
                    return resolve(
                        dispatch({
                            type: Actions.WIFI
                        })
                    );
                })
                .then(peripheralInfo => write(peripheralInfo.id, readConnectDataArray, true)) // 5. write to check if connection was successful (4s later)
                .then(res => {
                    if(res[4] === 0) {
                        return _.delay(() => BleManager.retrieveServices(sensorId), 2000);
                    }
                    return resolve(
                        dispatch({
                            type: Actions.WIFI
                        })
                    );
                })
                .then(peripheralInfo => write(peripheralInfo.id, readConnectDataArray, true)) // 5. write to check if connection was successful (6s later)
                .then(res => {
                    if(res[4] === 0) {
                        return reject('Your Kit was not able to connect to wifi. Your stored password may not be correct.');
                    }
                    return resolve(
                        dispatch({
                            type: Actions.WIFI
                        })
                    );
                })
                .catch(err => resolve(err));
        });
        return Promise.race([
            fetchingWifiConnections,
            new Promise((resolve, reject) => {
                timeout = setTimeout(() => reject('Error saving WIFI connection'), timeoutValue);
                return timeout;
            })
        ])
            .then(response => Promise.resolve(response))
            .catch(err => Promise.reject(err));
    };
};

const getScannedWifiConnections = sensorId => {
    // NOTE: timeout function added due to - 'Attempts to connect to a peripheral do not time out' (iOS documentation)
    let timeout = null;
    return dispatch => {
        let fetchingWifiConnections = new Promise((resolve, reject) => {
            const writeDataArray = [commands.WRITE_WIFI_SCAN, convertHex('0x00')];
            return BleManager.disconnect(sensorId)
                .catch(err => BleManager.disconnect(sensorId))
                .then(() => BleManager.connect(sensorId))
                .catch(err => BleManager.connect(sensorId))
                .then(() => BleManager.retrieveServices(sensorId))
                .catch(err => BleManager.retrieveServices(sensorId))
                .then(peripheralInfo => write(peripheralInfo.id, writeDataArray, true))
                .then(response => resolve(response[4]))
                .catch(err => reject('Error fetching WIFI connections'));
        });
        return Promise.race([
            fetchingWifiConnections,
            new Promise((resolve, reject) => {
                timeout = setTimeout(() => reject('Error fetching WIFI connections'), timeoutValue);
                return timeout;
            })
        ])
            .then(response => Promise.resolve(response))
            .catch(err => Promise.reject(err));
    };
};

const getSingleWifiConnection = (sensorId, index) => {
    // NOTE: timeout function added due to - 'Attempts to connect to a peripheral do not time out' (iOS documentation)
    let timeout = null;
    return dispatch => {
        let fetchingWifiConnection = new Promise((resolve, reject) => {
            const readDataArray = [commands.READ_WIFI_SCAN_SHORT, convertHex('0x01'), convertHex(`0x${index}`)];
            const readLongDataArray = [commands.READ_WIFI_SCAN_LONG, convertHex('0x01'), convertHex(`0x${index}`)];
            let singleWifiConnectionArray = [];
            return BleManager.retrieveServices(sensorId)
                .catch(err => BleManager.retrieveServices(sensorId))
                .then(peripheralInfo => write(peripheralInfo.id, readDataArray, true))
                .then(response => {
                    if(response[1] > 18) {
                        singleWifiConnectionArray = response;
                        return BleManager.retrieveServices(sensorId)
                            .catch(err => BleManager.retrieveServices(sensorId))
                            .then(peripheralInfo => write(peripheralInfo.id, readLongDataArray, true))
                            .then(res => resolve(cleanSingleWifiArray(_.concat(singleWifiConnectionArray, res))));
                    }
                    return resolve(cleanSingleWifiArray(response));
                })
                .catch(err => reject('Error fetching WIFI Details'));
        });
        return Promise.race([
            fetchingWifiConnection,
            new Promise((resolve, reject) => {
                timeout = setTimeout(() => reject('Error fetching WIFI Details'), timeoutValue);
                return timeout;
            })
        ])
            .then(response => Promise.resolve(response))
            .catch(err => Promise.reject(err));
    };
};

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
    return dispatch =>  new Promise((resolve, reject) => {
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
}

/**
  * OLD FUNCTIONS
  * - 3 Sensor System
  */
const loginToAccessory = accessoryData => {
    let dataArray = [commands.LOGIN, convertHex('0x04')];
    if (!accessoryData.settingsKey) {
        return dispatch => BleManager.disconnect(accessoryData.id)
            .then(() => dispatch({
                type: Actions.BLUETOOTH_DISCONNECT
            }));
    }
    dataArray = dataArray.concat(convertToUnsigned32BitIntByteArray(accessoryData.settingsKey));
    return dispatch => write(accessoryData.id, dataArray)
        .then(response => {
            return (response[3] === 1 && response[2] === 88) || response[2] !== 88 ? write(accessoryData.id, dataArray) : Promise.resolve(response);
        })
        .then(response => {
            dispatch({
                type: Actions.CONNECT_TO_ACCESSORY,
                data: (response[3] === 1 && response[2] === 88) || response[2] !== 88 ? {} : accessoryData
            });
            if (response[3] === 1) {
                return BleManager.disconnect(accessoryData.id)
                    .then(() => dispatch({
                        type: Actions.BLUETOOTH_DISCONNECT
                    }));
            }
            return Promise.resolve();
        })
        .catch(err => Promise.reject(err));
}

const setWiFiSSID = (id, ssid) => {
    let byteString = convertStringToByteArray(ssid);
    let dataArray = [];
    dataArray.push(commands.SET_WIFI_SSID_HEAD);
    dataArray.push(byteString.length);
    for (let i = 2; i < 20 && i-2 < byteString.length; i+=1) {
        dataArray.push(byteString[i-2]);
    }
    for (let i = byteString.length + 2; i < 20; i+=1) {
        dataArray.push(convertHex('0x00'));
    }
    console.log('SSID Data Array: ', dataArray);
    return dispatch => write(id, dataArray)
        .then(() => {
            if (byteString.length <= 18) {
                return null;
            }
            dataArray = [];
            dataArray.push(commands.SET_WIFI_SSID_CONT);
            dataArray.push(byteString.length - 18);
            for (let i = 2; i - 2 < byteString.length - 18; i+=1) {
                dataArray.push(byteString[i+16]);
            }
            for (let i = byteString.length - 16; i < 20; i+=1) {
                dataArray.push(convertHex('0x00'));
            }
            console.log('SSID Data Array 2: ', dataArray);
            return write(id, dataArray);
        })
        .then(result => {
            return dispatch({
                type: Actions.WIFI
            });
        });
};

const setWiFiPassword = (id, pass) => {
    let byteString = convertStringToByteArray(pass);
    let dataArray = [];
    dataArray.push(commands.SET_WIFI_PSW_HEAD);
    dataArray.push(byteString.length);
    for (let i = 2; i < 20 && i-2 < byteString.length; i+=1) {
        dataArray.push(byteString[i-2]);
    }
    for (let i = byteString.length + 2; i < 20; i+=1) {
        dataArray.push(convertHex('0x00'));
    }
    console.log('Password Data Array: ', dataArray);
    return dispatch => write(id, dataArray)
        .then(() => {
            if (byteString.length <= 18) {
                return null;
            }
            dataArray = [];
            dataArray.push(commands.SET_WIFI_PSW_CONT);
            dataArray.push(byteString.length - 18);
            for (let i = 2; i - 2 < byteString.length - 18; i+=1) {
                dataArray.push(byteString[i+16]);
            }
            for (let i = byteString.length - 16; i < 20; i+=1) {
                dataArray.push(convertHex('0x00'));
            }
            console.log('Password Data Array 2: ', dataArray);
            return write(id, dataArray);
        })
        .then(result => {
            return dispatch({
                type: Actions.WIFI
            });
        });
};

const connectWiFi = (id, networkType) => {
    let dataArray = [];
    dataArray.push(commands.CONNECT_WIFI);
    dataArray.push(convertHex('0x01'));
    dataArray.push(networkType)
    return dispatch => write(id, dataArray)
        .then(result => {
            return dispatch({
                type: Actions.WIFI,
                data: result[3]
            });
        });
};

const readSSID = id => {
    return id ? dispatch => read(id)
        .then(response => {
            console.log(response);
            return dispatch({
                type: Actions.NETWORK_DISCOVERED,
                data: response[3] === 1 ? '' : convertByteArrayToString(response.slice(3))
            });
        })
        .catch(err => console.log(err)) : null;
};

const scanWiFi = id => {
    let dataArray = [commands.WIFI_SCAN, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            return dispatch({
                type: Actions.WIFI_SCAN
            });
        })
        .catch(err => Promise.reject(err));
};

const resetAccessory = accessory => {
    let dataArray = [commands.FACTORY_RESET, convertHex('0x00')];
    return dispatch => write(accessory.id, dataArray)
        .then(response => {
            return (response[2] === 31 && response[2] === 1) || response[2] !== 31 ? write(accessory.id, dataArray) : Promise.resolve(response);
        })
        .then(response => {
            return dispatch({
                type:    Actions.ACCESSORY_RESET,
                success: response[2] === 31 && response[3] === 0
            });
        })
        .catch(err => {
            dispatch({
                type:    Actions.ACCESSORY_RESET,
                success: false
            })
            return Promise.reject(err);
        });
};

const systemReset = id => {
    let resetCmd = [commands.SYS_RESET, convertHex('0x00')];
    return dispatch => write(id, resetCmd)
        .then(response => {
            return (response[2] === 2 && response[3] === 1) || response[2] !== 2 ? write(id, resetCmd) : Promise.resolve(response);
        })
        .then(response => {
            return dispatch({
                type:    Actions.ACCESSORY_RESET,
                success: response[2] === 2 && response[3] === 0
            })
        })
        .catch(err => {
            dispatch({
                type:    Actions.ACCESSORY_RESET,
                success: false
            })
            return Promise.reject(err);
        });
}

const assignKitName = (id, name) => {
    let dataArray = [commands.SET_KIT_NAME, name.length];
    dataArray = dataArray.concat(convertStringToByteArray(name));
    return dispatch => write(id, dataArray)
        .then(response => {
            return dispatch({
                type: Actions.ASSIGN_KIT_NAME,
                data: name
            });
        });
};

const storeParams = accessory => {
    let dataArray = [commands.STORE_PARAMS, convertHex('0X00')];
    return dispatch => write(accessory.id, dataArray)
        .then(response => {
            return dispatch({
                type: Actions.STORE_PARAMS
            })
        })
}

const setOwnerFlag = (id, value) => {
    let dataArray = [commands.SET_OWNER_FLAG, convertHex('0x01'), convertHex(value ? '0x01' : '0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            return response[3] === 1 ? write(id, dataArray) : Promise.resolve(response);
        })
        .then(response => {
            return dispatch({
                type: Actions.SET_OWNER_FLAG,
            });
        });
};

const assignKitTeam = (accessory, team) => {
    let data = accessory;
    data.team = team;
    data.team_id = team.id;
    return dispatch => Promise.resolve(dispatch({
        type: Actions.CONNECT_TO_ACCESSORY,
        data
    }))
        .catch(err => Promise.reject(err));
};

const assignKitOrganization = (accessory, organization) => {
    let data = accessory;
    data.organization = organization;
    data.organization_id = organization.id;
    return dispatch => Promise.resolve(dispatch({
        type: Actions.CONNECT_TO_ACCESSORY,
        data
    }))
        .catch(err => Promise.reject(err));
};

const setKitState = (id, stateUsed) => {
    let dataArray = [commands.SET_STATE, convertHex('0x01'), state[stateUsed]];
    return dispatch => write(id, dataArray)
        .then(result => {
            return dispatch({
                type: Actions.SET_KIT_STATE
            });
        })
        .catch(err => Promise.reject(err));
};

const disconnect = id => {
    let dataArray = [commands.SET_STATE, convertHex('0x01'), state.APP_IDLE];
    return dispatch => write(id, dataArray)
        .catch(err => console.log(err))
        .then(() => BleManager.disconnect(id))
        .catch(err => console.log(err))
        .then(() => dispatch({
            type: Actions.BLUETOOTH_DISCONNECT
        }))
        .catch(err => Promise.reject(err));
};

const handleDisconnect = id => {
    return dispatch => BleManager.isPeripheralConnected(id, [])
        .then(isConnected => isConnected ? null : BleManager.connect(id))
        .then(() => BleManager.retrieveServices(id))
        .then(services => dispatch({
            type: Actions.HANDLE_DISCONNECT
        }));
};

const setIdentity = (id, identity) => {
    let byteString = convertStringToByteArray(identity);
    let dataArray = [];
    dataArray.push(commands.SET_IDENTITY_HEAD);
    dataArray.push(byteString.length);
    for (let i = 2; i < 20 && i-2 < byteString.length; i+=1) {
        dataArray.push(byteString[i-2]);
    }
    for (let i = byteString.length + 2; i < 20; i+=1) {
        dataArray.push(convertHex('0x00'));
    }
    console.log('Identity Data Array: ', dataArray);
    return dispatch => write(id, dataArray)
        .then(() => {
            if (byteString.length <= 18) {
                return null;
            }
            dataArray = [];
            dataArray.push(commands.SET_IDENTITY_CONT);
            dataArray.push(byteString.length - 18);
            for (let i = 2; i - 2 < byteString.length - 18; i+=1) {
                dataArray.push(byteString[i+16]);
            }
            for (let i = byteString.length - 16; i < 20; i+=1) {
                dataArray.push(convertHex('0x00'));
            }
            console.log('Identity Data Array 2: ', dataArray);
            return write(id, dataArray);
        })
        .then(result => {
            return dispatch({
                type: Actions.WIFI
            });
        });
};

const setAnonymousIdentity = (id, anonymousIdentity) => {
    let byteString = convertStringToByteArray(anonymousIdentity);
    let dataArray = [];
    dataArray.push(commands.SET_ANONYMOUS_IDENTITY_HEAD);
    dataArray.push(byteString.length);
    for (let i = 2; i < 20 && i-2 < byteString.length; i+=1) {
        dataArray.push(byteString[i-2]);
    }
    for (let i = byteString.length + 2; i < 20; i+=1) {
        dataArray.push(convertHex('0x00'));
    }
    console.log('Anonymous Identity Data Array: ', dataArray);
    return dispatch => write(id, dataArray)
        .then(() => {
            if (byteString.length <= 18) {
                return null;
            }
            dataArray = [];
            dataArray.push(commands.SET_ANONYMOUS_IDENTITY_CONT);
            dataArray.push(byteString.length - 18);
            for (let i = 2; i - 2 < byteString.length - 18; i+=1) {
                dataArray.push(byteString[i+16]);
            }
            for (let i = byteString.length - 16; i < 20; i+=1) {
                dataArray.push(convertHex('0x00'));
            }
            console.log('Anonymous Identity Data Array 2: ', dataArray);
            return write(id, dataArray);
        })
        .then(result => {
            return dispatch({
                type: Actions.WIFI
            });
        });
};

const setEAPType = (id, type) => {
    let dataArray = [commands.SET_EAP_TYPE, convertHex('0x01'), BLEConfig.eapTypes[type] || 0];
    console.log('EAP Type Data Array: ', dataArray);
    return dispatch => write(id, dataArray)
        .then(result => {
            return dispatch({
                type: Actions.WIFI
            });
        })
};

const setGyroCalibration = (id, type) => {
    let dataArray = [commands.SET_GYRO_CALIBRATION, convertHex('0x01'), type];
    console.log('Gyro Calibration Offset Data Array: ', dataArray);
    return dispatch => write(id, dataArray)
        .then(result => {
            return dispatch({
                type: Actions.SET_GYRO_CALIBRATION
            });
        });
};

const getAccessoryKey = (id, user) => {
    return dispatch => AppAPI.hardware.accessory.get({ wifiMacAddress: id })
        .then(response => {
            return dispatch({
                type:        Actions.GET_ACCESSORY_KEY,
                settingsKey: response.accessory.settings_key,
                user_id:     response.accessory.owner_id,
                user
            });
        })
        .catch(err => {
            console.log(err);
            return Promise.reject(err);
        });
}

export default {
    assignKitIndividual,
    assignKitName,
    assignKitOrganization,
    assignKitTeam,
    assignType,
    changeState,
    checkState,
    connectToAccessory,
    connectWiFi,
    deleteAllSingleSensorPractices,
    deleteSinglePractice,
    deleteUserSensorData,
    deviceFound,
    disconnect,
    enableBluetooth,
    getAccessoryKey,
    getAllPracticeDetails,
    getBLEMacAddress,
    getKitName,
    getOwnerFlag,
    getScannedWifiConnections,
    getSensorFiles,
    getSingleSensorStatus,
    getSingleWifiConnection,
    getUserSensorData,
    handleDisconnect,
    loginToAccessory,
    postUserSensorData,
    readSSID,
    resetAccessory,
    scanWiFi,
    setAnonymousIdentity,
    setEAPType,
    setGyroCalibration,
    setIdentity,
    setKitState,
    setKitTime,
    setOwnerFlag,
    setWiFiPassword,
    setWiFiSSID,
    startBluetooth,
    startConnect,
    startConnection,
    startDisconnection,
    startScan,
    stopConnect,
    stopScan,
    storeParams,
    systemReset,
    writeWifiDetailsToSensor,
};