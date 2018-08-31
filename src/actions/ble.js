/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:21:33
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:11:31
 */

/**
 * Bluetooth Actions
 */
// constants, libs, store, ...
import { Actions, AppConfig, BLEConfig } from '../constants';
import { AppAPI, AppUtil } from '../lib';
import { store } from '../store';

// import third-party libraries
import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import Fabric from 'react-native-fabric';
import moment from 'moment';

// Fabric specific
const { Answers } = Fabric;

// constants
const commands = BLEConfig.commands;
const state = BLEConfig.state;

/**
  * UTILITY FUNCTIONS
  */
const read = (id) => {
    return BleManager.read(id, BLEConfig.serviceUUID, BLEConfig.characteristicUUID)
        .then(data => {
            Answers.logCustom('BLE read', {
                data,
                deviceInfo: AppConfig.deviceInfo,
                id,
            });
            // NOTE: added to make sure our data is correct before returning
            if(data[0] === 0 && (data[3] === 0 || data[3] === 1)) {
                return data;
            }
            return read(id);
        });
};

const write = (id, data) => {
    Answers.logCustom('BLE write', {
        data,
        deviceInfo: AppConfig.deviceInfo,
        id,
    });
    return BleManager.write(id, BLEConfig.serviceUUID, BLEConfig.characteristicUUID, data)
        .then(() => read(id));
};

/**
  * Convert string to byte array
  * eg.
  *   'test'
  *   [116,101,115,116]
  */
const convertStringToByteArray = (string) => {
    return string.split('').map(char => char.charCodeAt(0));
};

/**
  * Convert byte array to string
  * eg.
  *   [116,101,115,116]
  *   'test'
  */
const convertByteArrayToString = (array) => {
    return array.map(byte =>  byte && byte > 31 && byte < 127 ? String.fromCharCode(byte) : '').join('');
};

const convertDecimal = (array) => {
    return array.map(byte => `0${byte.toString(16).toUpperCase()}`.slice(-2)).join(':');
};

const convertHex = (value) => {
    return parseInt(value, 16);
};

const convertToUnsigned32BitIntByteArray = (value) => {
    return value.toString(16).match(/.{1,2}/g).map(val => convertHex(val));
};

const sleeper = ms => {
    return x => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    }
};

// Creating a promise wrapper for setTimeout
// const wait = (delay = 0) => new Promise(resolve => setTimeout(resolve, delay));

const getOwnerFlag = (id) => {
    let dataArray = [commands.GET_OWNER_FLAG, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            return dispatch({
                type: Actions.GET_OWNER_FLAG,
                data: response[3] === 0 && response[4] === 1
            });
        });
};

const getKitName = (id) => {
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

const assignType = (type) => {
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

const changeState = (kitState) => {
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

const startScan = () => {
    return dispatch => BleManager.scan([], 30, false, { scanMode: 2 })
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

const deviceFound = (data) => {
    return dispatch => dispatch({
        type: Actions.DEVICE_FOUND,
        data
    });
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

const setKitTime = (id) => {
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

const startDisconnection = sensorId => {
    return BleManager.disconnect(sensorId)
        .catch(err => BleManager.disconnect(sensorId))
        .then(() => Promise.resolve('successfully disconnected'))
        .catch(err => Promise.reject(err)); // ble err will always return the same string 'Device not connected'
};

const startConnection = sensorId => {
    return startDisconnection(sensorId)
        .catch(err => {
            // ble err will always return the same string 'Device not connected'
            // continue normally if startDisconnection failed (could be because we don't have an open connection)
            return true;
        })
        .then(sleeper(1000))
        .then(() => startBluetooth())
        .then(() => BleManager.connect(sensorId))
        .catch(err => BleManager.connect(sensorId))
        .then(() => Promise.resolve('successfully connected'))
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
const connectToAccessory = (data) => {
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

const getUserSensorData = (userId) => {
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.sensor_mobile_pair.get({ userId })
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

const postUserSensorData = () => {
    return dispatch => new Promise((resolve, reject) => {
        let currentState = store.getState();
        // get user id
        let userId = currentState.user.id;
        // mobile uuid
        const uniqueId = AppUtil.getDeviceUUID();
        // build object to submit
        let dataObj = {};
        dataObj.sensor_pid = currentState.ble.accessoryData.id;
        dataObj.mobile_udid = uniqueId;
        return AppAPI.sensor_mobile_pair.post({ userId }, dataObj)
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
        return AppAPI.sensor_mobile_pair.delete({ userId })
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

const disconnectFromSingleSensor = (sensor_id) => {
    let dataArray = [commands.WIPE_SINGLE_SENSOR_DATA, convertHex('0x00')];
    let currentState = store.getState();
    let sensorId = sensor_id || currentState.ble.accessoryData.sensor_pid;
    return dispatch => startBluetooth()
        .then(() => BleManager.connect(sensorId))
        .then(() => BleManager.retrieveServices(sensorId))
        .then(peripheralInfo => write(peripheralInfo.id, dataArray)) // wipe single sensor data - 0x7B
        .then(() => BleManager.disconnect(sensorId))
        .then(() => Promise.resolve())
        .catch(err => Promise.reject(err));
};

const getSingleSensorStatus = (sensorId) => {
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
            })
            return Promise.resolve(returnObj);
        })
        .catch(err => {
            return Promise.reject(err)
        });
};

const getAllPracticeDetails = (sensorId, practiceIndex = 0) => {
    let returnObj = {};
    return BleManager.retrieveServices(sensorId)
        .then(sleeper(1000))
        .then(peripheralInfo => {
            let timestampsArray = [commands.GET_PRACTICE_TIMESTAMPS, convertHex('0x01'), convertHex(practiceIndex)];
            return write(peripheralInfo.id, timestampsArray); // get single sensor practice timestamps - 0x76
        })
        .then(response => {
            returnObj.start_time = convertUnsigned32BitIntToEpochTime(response.slice(4, 8).reverse());
            returnObj.end_time = convertUnsigned32BitIntToEpochTime(response.slice(8, 12).reverse());
            return response;
        })
        .then(sleeper(1000))
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
        .then(sleeper(1000))
        .then(res3 => {
            const durationsArray = [commands.GET_PRACTICE_DURATION, convertHex('0x01'), convertHex(practiceIndex)];
            return write(sensorId, durationsArray); // get single sensor practice windows duration - 0x78
        })
        .then(res4 => {
            returnObj.inactive_duration = convertDurationToInt(res4.slice(4, 6).reverse());
            returnObj.low_duration = convertDurationToInt(res4.slice(6, 8).reverse());
            returnObj.mod_duration = convertDurationToInt(res4.slice(8, 10).reverse());
            returnObj.high_duration = convertDurationToInt(res4.slice(10, 12).reverse());
            return Promise.resolve(returnObj);
        })
        .catch(err => {
            console.log('++++++++err',err);
            return Promise.reject(err)
        });
};

const deleteSinglePractice = (sensorId, practiceIndex = 0) => {
    const dataArray = [commands.DELETE_SINGLE_PRACTICE, convertHex('0x01'), convertHex(practiceIndex)];
    return BleManager.retrieveServices(sensorId)
        .then(sleeper(1000))
        .then(peripheralInfo => write(peripheralInfo.id, dataArray)) // delete single sensor practice - 0x79
        .then(response => {
            console.log('++++++++response',response);
            return Promise.resolve(response);
        })
        .catch(err => {
            console.log('++++++++err',err);
            return Promise.reject(err)
        });
};

/**
  * OLD FUNCTIONS
  * - 3 Sensor System
  */
const loginToAccessory = (accessoryData) => {
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

const readSSID = (id) => {
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

const scanWiFi = (id) => {
    let dataArray = [commands.WIFI_SCAN, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            return dispatch({
                type: Actions.WIFI_SCAN
            });
        })
        .catch(err => Promise.reject(err));
};

const resetAccessory = (accessory) => {
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

const systemReset = (id) => {
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

const storeParams = (accessory) => {
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

const disconnect = (id) => {
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

const handleDisconnect = (id) => {
    return dispatch => BleManager.isPeripheralConnected(id, [])
        .then(isConnected => isConnected ? null : BleManager.connect(id))
        .then(() => BleManager.retrieveServices(id))
        .then(services => dispatch({
            type: Actions.HANDLE_DISCONNECT
        }));
};

const getWifiMacAddress = (id) => {
    let dataArray = [commands.GET_MAC_ADDRESS, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            return response[3] === 1 ? write(id, dataArray) : Promise.resolve(response);
        })
        .then(response => {
            return convertDecimal(response.slice(4,10));
        })
        .then(macAddress => {
            return macAddress === '00:00:00:00:00:00' ? write(id, dataArray) : Promise.resolve(macAddress);
        })
        .then(macAddress => {
            return dispatch({
                type: Actions.GET_WIFI_MAC_ADDRESS,
                data: macAddress
            });
        })
        .catch(err => { console.log(err); return Promise.reject(err); });
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
    deleteSinglePractice,
    deleteUserSensorData,
    deviceFound,
    disconnect,
    disconnectFromSingleSensor,
    enableBluetooth,
    getAccessoryKey,
    getAllPracticeDetails,
    getKitName,
    getOwnerFlag,
    getSingleSensorStatus,
    getUserSensorData,
    getWifiMacAddress,
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
};