/**
 * Bluetooth Actions
 */
import BleManager from 'react-native-ble-manager';
import { BLEConfig } from '@constants';

const Actions = require('../actionTypes');

function write(id, data) {
    return BleManager.write(id, BLEConfig.serviceUUID, BLEConfig.characteristicUUID, data);
}

/**
  * Convert string to byte array
  * eg.
  *   'test'
  *   [116,101,115,116]
  */
function convertStringToByteArray(string) {
    return string.split('').map(char => char.charCodeAt(0));
}

function convertHex(value) {
    return parseInt(value, 16);
}

export function checkState() {
    return dispatch => new Promise(resolve => resolve(BleManager.checkState()))
        .then(() => dispatch({
            type: Actions.CHECK_STATE
        }));
}

export function changeState(state) {
    return dispatch => dispatch({
        type: Actions.CHANGE_STATE,
        data: state
    });
}

export function enableBluetooth() {
    return dispatch => BleManager.enableBluetooth()
        .then(() => dispatch({
            type: Actions.ENABLE_BLUETOOTH
        }));
}

export function startBluetooth() {
    return dispatch => BleManager.start({ showAlert: true })
        .then(() => dispatch({
            type: Actions.START_BLUETOOTH
        }));
}

export function startScan() {
    return dispatch => BleManager.scan([], 30, false)
        .then(() => dispatch({
            type: Actions.START_SCAN
        }));
}

export function stopScan () {
    return dispatch => BleManager.stopScan()
        .then(() => dispatch({
            type: Actions.STOP_SCAN
        }));
}

export function deviceFound(data) {
    return dispatch => dispatch({
        type: Actions.DEVICE_FOUND,
        data
    });
}

export function connectToAccessory(data, {role, id}) {
    return dispatch => BleManager.connect(data.id)
        .then(() => BleManager.retrieveServices(data.id))
        // .then(() => {
        //     let dataArray = new Array(20);
        //     dataArray[0] = BLEConfig.commands.LOGIN;
        //     dataArray[1] = convertHex('0x11');
        //     dataArray[2] = BLEConfig.roles[];
        //     return BleManager.write(data.id, );
        // })
        .then(() => dispatch({
            type: Actions.CONNECT_TO_ACCESSORY,
            data: {
                accessoryConnected: true,
                id:                 data.id,
                name:               data.name
            }
        }))
        .catch(err => {
            console.log(err);
            return err;
        })
}
