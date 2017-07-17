/**
 * Bluetooth Actions
 */
import BleManager from 'react-native-ble-manager';
import { BLEConfig } from '@constants';
import AppAPI from '@lib/api';

const Actions = require('../actionTypes');
const commands = BLEConfig.commands;

const write = (id, data) => {
    return BleManager.write(id, BLEConfig.serviceUUID, BLEConfig.characteristicUUID, data);
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

const convertHex = (value) => {
    return parseInt(value, 16);
};

const getOwnerOrganization = (id) => {
    let dataArray = [convertHex(commands.GET_OWNER_ORG, '0x00')];
    return dispatch => write(id, dataArray)
        .then(response => console.log(response))
        .catch(err => Promise.reject(err));
};

const getOwnerTeam = (id) => {
    let dataArray = [convertHex(commands.GET_OWNER_TEAM, '0x00')];
    return dispatch => write(id, dataArray)
        .then(response => console.log(response))
        .catch(err => Promise.reject(err));
};

const getOwnerUser = (id) => {
    let dataArray = [convertHex(commands.GET_OWNER_USER, '0x00')];
    return dispatch => write(id, dataArray)
        .then(response => console.log(response))
        .catch(err => Promise.reject(err));
};



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

const changeState = (state) => {
    return dispatch => dispatch({
        type: Actions.CHANGE_STATE,
        data: state
    });
};

const enableBluetooth = () => {
    return dispatch => BleManager.enableBluetooth()
        .then(() => dispatch({
            type: Actions.ENABLE_BLUETOOTH
        }));
};

const startBluetooth = () => {
    return dispatch => BleManager.start({ showAlert: true })
        .then(() => dispatch({
            type: Actions.START_BLUETOOTH
        }));
};

const startScan = () => {
    return dispatch => BleManager.scan([], 30, false)
        .then(() => dispatch({
            type: Actions.START_SCAN
        }));
};

const stopScan = () => {
    return dispatch => BleManager.stopScan()
        .then(() => dispatch({
            type: Actions.STOP_SCAN
        }));
};

const deviceFound = (data) => {
    return dispatch => dispatch({
        type: Actions.DEVICE_FOUND,
        data
    });
};

const connectToAccessory = (data, {role, id}) => {
    return dispatch => BleManager.connect(data.id)
        .then(() => BleManager.retrieveServices(data.id))
        .then(services => BLEConfig.parse(id))
        .then(convertedUUID => {
            let dataArray = [];
            let hexRole = BLEConfig.roles[role];
            dataArray.push(commands.LOGIN);
            dataArray.push(convertHex('0x11'));
            dataArray.push(hexRole);
            dataArray = dataArray.concat(convertedUUID);
            return write(data.id, dataArray);
        })
        .then(() => AppAPI.accessories.patch(data.id, data))
        .then(uploadedAccessory => dispatch({
            type: Actions.CONNECT_TO_ACCESSORY,
            data: {
                accessoryConnected: true,
                ...uploadedAccessory
            }
        }))
        .catch(err => Promise.reject(err));
};

const setWiFiSSID = (data, ssid) => {
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
    return write(data.id, dataArray)
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
            return write(data.id, dataArray);
        });
};

const setWiFiPassword = (data, pass) => {
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
    return write(data.id, dataArray)
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
            return write(data.id, dataArray);
        });
};

const connectWiFi = (data) => {
    let dataArray = [];
    dataArray.push(convertHex('0x08'));
    dataArray.push(convertHex('0x00'));
    for (let i = 2; i < 20; i+=1) {
        dataArray.push(convertHex('0x00'));
    }
    return write(data.id, dataArray);
};

const scanWiFi = (id) => {
    let dataArray = [commands.WIFI_SCAN, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            console.log('------------------------------------');
            console.log({response});
            console.log('------------------------------------');
            return dispatch({
                type: Actions.WIFI_SCAN
            });
        })
        .then(() => BleManager.read(id, BLEConfig.serviceUUID, BLEConfig.dataUUID))
        .then(response =>  console.log({response}))
        .catch(err => Promise.reject(err));
};

const resetAccessory = (id) => {
    let dataArray = [commands.FACTORY_RESET, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(() => dispatch({
            type: Actions.ACCESSORY_RESET
        }))
        .catch(err => Promise.reject(err));
};

export {
    assignType,
    checkState,
    changeState,
    enableBluetooth,
    startBluetooth,
    startScan,
    stopScan,
    deviceFound,
    connectToAccessory,
    setWiFiSSID,
    setWiFiPassword,
    connectWiFi,
    getOwnerOrganization,
    getOwnerTeam,
    getOwnerUser,
    resetAccessory,
    scanWiFi
};