/**
 * Bluetooth Actions
 */
// constants, libs, store, ...
import { Actions, BLEConfig, } from '../constants';
import { AppAPI, AppUtil, SensorLogic, } from '../lib';
import { store } from '../store'; // TODO: CONFIRM IF NEEDED

// import third-party libraries
import _ from 'lodash';
import { BleManager, Device, } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import moment from 'moment'; // TODO: REMOVE ME

// constants
const commands = BLEConfig.commands;
const networkTypes = BLEConfig.networkTypes;
const bleManager = new BleManager();
const serviceUUID = BLEConfig.serviceUUID3Sensor;
const characteristicUUID = BLEConfig.characteristicUUID3Sensor;

// TODO: LOOK INTO TIMEOUT (of each funciton???)

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
    return hexString.match(/.{1,2}/g).map(val => convertHex(val))
};

const unsignedToSignedInt = int => (int <<24 >>24);

const sleeper = (ms = 500) => new Promise(resolve => setTimeout(() => resolve(), ms));

/*const read = (device, base64Value, transactionId) => {
    return new Promise((resolve, reject) => {
        // return bleManager.readCharacteristicForDevice(device.id, serviceUUID, characteristicUUID, transactionId)
        return device.readCharacteristicForService(serviceUUID, characteristicUUID, transactionId)
            .then(characteristic => {
                if(!characteristic.value) {
                    console.log('read-a-1', moment().format('H:m:s:SSS'));
                    return _.delay(() => {
                        console.log('read-a-2', moment().format('H:m:s:SSS'));
                        return read(device, base64Value, transactionId);
                    }, 2000);
                }
                let value = convertBase64ToHex(characteristic.value);
                let base64WriteValue = convertBase64ToHex(base64Value);
                console.log(
                    'read-response-1',
                    characteristic,
                    characteristic.value,
                    value,
                    base64WriteValue,
                    !validateReadData(value, base64WriteValue),
                    transactionId
                );
                // const validateReadData = (response, dataArray) =>
                //       (response[0] === 0 && response[2] === dataArray[0] && response[3] === 0);
                if(!validateReadData(characteristic.value, base64WriteValue)) {
                    console.log('read-b-1', moment().format('H:m:s:SSS'));
                    return _.delay(() => {
                        console.log('read-b-2', moment().format('H:m:s:SSS'));
                        return read(device, base64Value, transactionId);
                    }, 2000);
                } else if(value[3] === 1) {
                    return reject(''); // TODO: ERROR HANDLING!
                }
                console.log('read-response-2',characteristic,value,transactionId);
                return resolve(value);
            })
            .catch(err => {
                console.log('read-err',err);
                return reject(err);
            }); // TODO: ERROR HANDLING!
    });
};

const write = (device, base64Value, transactionId) => {
    return new Promise((resolve, reject) => {
        // return bleManager.writeCharacteristicWithResponseForDevice(device.id, serviceUUID, characteristicUUID, base64Value, transactionId)
        // return device.discoverAllServicesAndCharacteristics()
        //     .then(connectedDevice => connectedDevice.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Value, transactionId))
        return device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Value, transactionId)
            .then(characteristic => {
                console.log('write-response',characteristic);
                let base64WriteValue = convertBase64ToHex(base64Value);
                if(!characteristic.value || (characteristic.value && !validateReadData(characteristic.value, base64WriteValue))) {
                    return read(device, base64Value, transactionId)
                        .then(res => {console.log('write->read-response',characteristic, res); return resolve(res);})
                        .catch(error => {console.log('write->read-err',characteristic, error); return reject(error);}); // TODO: ERROR HANDLING!
                }
                let value = convertBase64ToHex(characteristic.value);
                return resolve(value);
            })
            .catch(err => console.log('write-err',err));
    });
};*/

const read = async (device, base64Value, transactionId) => {
    return await new Promise(async (resolve, reject) => {
        return await device.readCharacteristicForService(serviceUUID, characteristicUUID, transactionId)
            .then(characteristic => {
                if(!characteristic.value) {
                    console.log('read-a-0', moment().format('H:m:s:SSS'));
                    return _.delay(() => {
                        console.log('read-a-delay-0', moment().format('H:m:s:SSS'));
                        return read(device, base64Value, transactionId);
                    }, 2000);
                }
                let value = convertBase64ToHex(characteristic.value);
                let base64WriteValue = convertBase64ToHex(base64Value);
                // const validateReadData = (response, dataArray) =>
                //       (response[0] === 0 && response[2] === dataArray[0] && response[3] === 0);
                console.log(
                    'read-LOG',
                    moment().format('H:m:s:SSS'),
                    characteristic,
                    value,
                    base64WriteValue,
                    !validateReadData(value, base64WriteValue),
                    transactionId
                );
                if(!validateReadData(value, base64WriteValue)) {
                    console.log('read-b-1', moment().format('H:m:s:SSS'));
                    /*eslint no-use-before-define: 0*/
                    return _.delay(() => {
                        console.log('read-b-delay-1', moment().format('H:m:s:SSS'));
                        return write(device, base64Value, transactionId);
                    }, 2000);
                } else if(value[3] === 1) {
                    console.log('read-b-2', moment().format('H:m:s:SSS'));
                    return reject(''); // TODO: ERROR HANDLING!
                }
                console.log('read-LOG-2');
                return resolve(value);
            })
            .catch(error => {
                console.log('read-err-0', error, moment().format('H:m:s:SSS'));
                return reject(error);
            });
    });
};

const write = async (device, base64Value, transactionId) => {
    return await new Promise(async (resolve, reject) => {
        console.log('write-1', moment().format('H:m:s:SSS'), transactionId);
        const characteristicWrite = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Value, transactionId);
        console.log('write-2', characteristicWrite, moment().format('H:m:s:SSS'));
        // characteristicWrite.monitor(
        //     (error, monitoredCharacteristic) => {
        //         console.log('write-MONITORED',error,monitoredCharacteristic);
        //         // let characteristicBase64 = monitoredCharacteristic.value;
        //         // let characteristicHex = convertBase64ToHex(characteristicBase64);
        //         bleManager.cancelTransaction(transactionId);
        //         // TODO: ERROR HANDLING!
        //         // return resolve(characteristicHex[4]);
        //     },
        //     transactionId
        // );
        try {
            console.log('write-3-a', moment().format('H:m:s:SSS'));
            const sleep = await sleeper(2000);
            console.log('write-3-b', moment().format('H:m:s:SSS'));
            const returnHex = await read(device, base64Value, transactionId);
            console.log('write-4', returnHex, moment().format('H:m:s:SSS'));
            return resolve(returnHex);
        } catch(error) {
            console.log('write-err',error);
            return reject(error); // TODO: ERROR HANDLING!
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
  */
// base64 Strings needed for write/read

const startMonitor = callback => bleManager.onStateChange(callback, true);

const destoryInstance = () => bleManager.destroy();

const startConnection = async (device, callback) => {
    const macAddressWriteBase64 = new Buffer([commands.GET_MAC_ADDRESS, convertHex('0x00')]).toString('base64');
    const startConnectionTransactionId = 'start-connection';
    return await new Promise(async (resolve, reject) => {
        return device.connect()
            .then(connectedDevice => connectedDevice.discoverAllServicesAndCharacteristics())
            .then(async deviceInfo => {
                const startConnectionCharacteristic = await write(deviceInfo, macAddressWriteBase64, startConnectionTransactionId)
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
                    return reject(error); // TODO: ERROR HANDLING!
                }
            })
            .catch(err => {console.log('startConnection-err',err); return reject(err);}); // TODO: ERROR HANDLING!
    });
};

const handleDiscoveredPeripherals = (error, device, callback) => {
    return !error && device.isConnectable && device.name && device.name === 'fathomKit' ?
        deviceFound(device)
            .then(() => {
                bleManager.stopDeviceScan();
                startConnection(device)
                    // TODO: BRING ME BACK
                    // .then(macAddress => AppAPI.hardware.accessory.get({ wifiMacAddress: macAddress }))
                    .then(response => callback(null, response))
                    .catch(err => callback(err, null));  // TODO: ERROR HANDLING!
            })
        :
        null;
};

const startDeviceScan = callback => bleManager.startDeviceScan(
    null,
    { allowDuplicates: false, scanMode: 2, },
    (error, device) => handleDiscoveredPeripherals(error, device, callback));

const getScannedWifiConnections = device => {
    const wifiScanBase64 = new Buffer([commands.WRITE_WIFI_SCAN, convertHex('0x00')]).toString('base64');
    let transactionId = 'wifi-scan';
    return new Promise((resolve, reject) => {
        return device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, wifiScanBase64, transactionId)
            .then(characteristic => {
                console.log('getScannedWifiConnections-characteristic',characteristic);
                // _.delay(() => reject('TIMEDOUT'), 20000); // TODO: MIGHT NEED TO PUT THIS ON A TIMER!
                characteristic.monitor(
                    (error, monitoredCharacteristic) => {
                        let characteristicBase64 = monitoredCharacteristic.value;
                        let characteristicHex = convertBase64ToHex(characteristicBase64);
                        bleManager.cancelTransaction(transactionId);
                        console.log('getScannedWifiConnections-MONITORED',error,monitoredCharacteristic,characteristicHex);
                        // TODO: ERROR HANDLING!
                        return resolve(characteristicHex[4]);
                    },
                    transactionId
                );
            })
            .catch(error => reject(error)); // TODO: ERROR HANDLING!
    });
};

const getSingleWifiConnection = async (device, index) => {
    return await new Promise(async (resolve, reject) => {
        // console.log('getSingleWifiConnection-index',index);
        const readSingleWifiShortHex = [commands.READ_WIFI_SCAN_SHORT, convertHex('0x01'), convertHex(`0x${index}`)];
        const readSingleWifiShortBase64 = new Buffer(readSingleWifiShortHex).toString('base64');
        const readSingleWifiLongHex = [commands.READ_WIFI_SCAN_LONG, convertHex('0x01'), convertHex(`0x${index}`)];
        const readSingleWifiLongBase64 = new Buffer(readSingleWifiLongHex).toString('base64');
        const singleWifiShortTransactionId = `single-wifi-short-connection-${index}`;
        const singleWifiLongTransactionId = `single-wifi-long-connection-${index}`;
        let shortWifiCharacteristic = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, readSingleWifiShortBase64, singleWifiShortTransactionId);
        // console.log('getSingleWifiConnection-1',shortWifiCharacteristic,moment().format('H:m:s:SSS'));
        try {
            // const response = await device.readCharacteristicForService(serviceUUID, characteristicUUID, singleWifiShortTransactionId);
            let shortWifiSleep = await sleeper(2000);
            // console.log('getSingleWifiConnection-2',moment().format('H:m:s:SSS'));
            let response = await shortWifiCharacteristic.read(singleWifiShortTransactionId);
            // TODO: RE-READ IF ITEMS DONT MATCH/VALIDATION...???
            // if(!response.value || (response.value && !validateReadData(convertBase64ToHex(response.value), readSingleWifiShortHex))) {
            //     console.log('getSingleWifiConnection-HIIIII-1',response,readSingleWifiShortHex);
            //     shortWifiCharacteristic = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, readSingleWifiShortBase64, singleWifiShortTransactionId);
            //     shortWifiSleep = await sleeper(2000);
            //     response = await shortWifiCharacteristic.read(singleWifiShortTransactionId);
            //     console.log('getSingleWifiConnection-HIIIII-2',response,convertBase64ToHex(response.value),readSingleWifiShortHex);
            // }
            let responseHex = convertBase64ToHex(response.value);
            if(responseHex[1] > 18) {
                const longWifiCharacteristic = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, readSingleWifiLongBase64, singleWifiLongTransactionId);
                try {
                    let longWifiSleep = await sleeper(2000);
                    let longCharacteristic = await longWifiCharacteristic.read(singleWifiLongTransactionId);
                    // TODO: RE-READ IF ITEMS DONT MATCH/VALIDATION...???
                    let longResponseHex = convertBase64ToHex(longCharacteristic.value);
                    // console.log(
                    //     'getSingleWifiConnection-LONG',
                    //     longCharacteristic,
                    //     longResponseHex,
                    //     cleanSingleWifiArray(longResponseHex),
                    //     moment().format('H:m:s:SSS')
                    // );
                    return resolve(cleanSingleWifiArray(_.concat(responseHex.slice(4, responseHex.length), longResponseHex)));
                } catch(error) {
                    console.log('getSingleWifiConnection-LONG-err',error);
                    return reject(error); // TODO: ERROR HANDLING!
                }
            }
            // console.log(
            //     'getSingleWifiConnection-3',
            //     response,
            //     responseHex,
            //     cleanSingleWifiArray(responseHex),
            //     moment().format('H:m:s:SSS')
            // );
            return resolve(cleanSingleWifiArray(responseHex.slice(4, responseHex.length)));
        } catch(error) {
            console.log('getSingleWifiConnection-err',error);
            return reject(error); // TODO: ERROR HANDLING!
        }
    });
};

const validateWriteWifiDetailsResponse = async (characteristic, writeBase64Value, device, transactionId) => {
    let timeout = sleeper(2000);
    let responseValidation = new Promise(async (resolve, reject) => {
        const sleep = await sleeper(2000);
        let readCharacteristic = await device.readCharacteristicForService(serviceUUID, characteristicUUID, transactionId);
        console.log('validateWriteWifiDetailsResponse-1', readCharacteristic, writeBase64Value);
        let responseHex = convertBase64ToHex(readCharacteristic.value);
        let writeHex = convertBase64ToHex(writeBase64Value);
        // const validateReadData = (response, dataArray) =>
        //       (response[0] === 0 && response[2] === dataArray[0] && response[3] === 0);
        let isValid = validateReadData(responseHex, writeHex);
        console.log('validateWriteWifiDetailsResponse-2', responseHex, writeHex, isValid);
        if(!isValid) {
            return reject();
        }
        console.log('validateWriteWifiDetailsResponse-3', responseHex, writeHex, isValid);
        return resolve();
    });
    return Promise
        .all([responseValidation, timeout])
        .then(res => console.log('validateWriteWifiDetailsResponse-res',res))
        .catch(err => console.log('validateWriteWifiDetailsResponse-err',err));
};

const checkCharacteristicForChange = async (device, readConnectBase64, transactionId, startTime) => {
    return await new Promise(async (resolve, reject) => {
        const readConnectSleep = await sleeper(2000);
        const readConnectCharacteristic = await write(device, readConnectBase64, transactionId);
        console.log('readConnectCharacteristic',readConnectCharacteristic);
        try {
            let timeDiff = moment().diff(startTime, 'seconds');
            console.log('checkCharacteristicForChange-readCharacteristic',timeDiff,readConnectCharacteristic[4],readConnectCharacteristic);
            if(readConnectCharacteristic[4] !== 1 && timeDiff <= 10) {
                return checkCharacteristicForChange(device, readConnectBase64, transactionId, startTime);
            }
            return resolve(readConnectCharacteristic);
        } catch(error) {
            console.log('error',error);
            return reject(error, null);
        }
    });
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
        return Promise.reject(SensorLogic.errorMessages().longSSID);
    } else if(securityByte !== 0 && passwordDataArray && (passwordDataArray.length === 0 || passwordDataArray.length > 32)) {
        return Promise.reject(SensorLogic.errorMessages().longPass);
    }
    // send commands
    console.log('writeWifiDetailsToSensor-0');
    return await new Promise(async (resolve, reject) => {
        const shortSSIDCharacteristic = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, shortSsidBase64, 'short-ssid'); // 1. write short wifi
        const validateResponse = await validateWriteWifiDetailsResponse(shortSSIDCharacteristic, shortSsidBase64, device, 'short-ssid');
        // const shortSSIDSleep = await sleeper(2000);
        if(longSlicedSsidDataArray.length > 0) { console.log('writeWifiDetailsToSensor-is LONG SSID');
            const longSSIDCharacteristic = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, longSsidBase64, 'long-ssid'); // 2. check if long wifi -> write if needed
            const validateResponse2 = await validateWriteWifiDetailsResponse(longSSIDCharacteristic, longSsidBase64, device, 'long-ssid');
            // const longSSIDSleep = await sleeper(2000);
        }
        if(securityByte > 0) { console.log('writeWifiDetailsToSensor-has PSW');
            const shortPswCharacteristic = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, shortPswBase64, 'long-password'); // 3. write short psw
            const validateResponse3 = await validateWriteWifiDetailsResponse(shortPswCharacteristic, shortPswBase64, device, 'long-password');
            // const shortPswSleep = await sleeper(2000);
        }
        if(longSlicedPswDataArray.length > 0) { console.log('writeWifiDetailsToSensor-is LONG PSW');
            const longPswCharacteristic = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, longPswBase64, 'long-password'); // 4. check if long psw -> write if needed
            const validateResponse4 = await validateWriteWifiDetailsResponse(longPswCharacteristic, longPswBase64, device, 'long-password');
            // const longPswSleep = await sleeper(2000);
        }
        const connectCharacteristic = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, connectBase64, 'connect-wifi'); // 5. write connect
        const validateResponse4 = await validateWriteWifiDetailsResponse(connectCharacteristic, connectBase64, device, 'connect-wifi');
        // let connectSleep = await sleeper(2000);
        const readCharacteristic = await checkCharacteristicForChange(device, readConnectBase64, 'read-connect-wifi', moment())
            .then(res => {
                console.log('writeWifiDetailsToSensor-res',res);
                return resolve(
                    store.dispatch({
                        type: Actions.WIFI
                    })
                );
            })
            .catch(err => {
                console.log('writeWifiDetailsToSensor-err',err);
                reject(err);
            });
    });
};

const exitKitSetup = async device => {
    const disconnectBase64 = new Buffer([convertHex('0x02'), convertHex('0x01'), convertHex('0x01')]).toString('base64');
    return await new Promise(async (resolve, reject) => {
        const disconnectCharacteristic = await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, disconnectBase64, 'exit-kit-setup');
        try {
            console.log('disconnectCharacteristic',disconnectCharacteristic);
            return resolve(disconnectCharacteristic);
        } catch(error) {
            console.log('exitKitSetup-error',error);
            return reject(error);
        }
    });
};

export default {
    assignKitIndividual,
    destoryInstance,
    exitKitSetup,
    getScannedWifiConnections,
    getSensorFiles,
    getSingleWifiConnection,
    startDeviceScan,
    startMonitor,
    writeWifiDetailsToSensor,
};