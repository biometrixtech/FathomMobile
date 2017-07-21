/**
 * Bluetooth Actions
 */
import BleManager from 'react-native-ble-manager';
import { BLEConfig } from '@constants';
import AppAPI from '@lib/api';

const Actions = require('../actionTypes');
const commands = BLEConfig.commands;

const write = (id, data) => {
    return BleManager.write(id, BLEConfig.serviceUUID, BLEConfig.characteristicUUID, data)
        .then(() => BleManager.read(id, BLEConfig.serviceUUID, BLEConfig.characteristicUUID));
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
    return array.map(byte => String.fromCharCode(byte)).join('');
};

const wasSuccessful = (response) => {
    return response[4];
}

const convertHex = (value) => {
    return parseInt(value, 16);
};

// Creating a promise wrapper for setTimeout
const wait = (delay = 0) => new Promise(resolve => setTimeout(resolve, 1000));

const getOwnerOrganization = (id, user) => {
    let dataArray = [convertHex(commands.GET_OWNER_ORG, '0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            console.log({response});
            return BLEConfig.unparse(response.slice(4,20))
        })
        .then(organizationUUID => dispatch({
            type: Actions.GET_KIT_ORGANIZATION,
            data: {
                id: organizationUUID,
                user
            }
        }))
        .catch(err => Promise.reject(err));
};

const getOwnerTeam = (id, user) => {
    let dataArray = [convertHex(commands.GET_OWNER_TEAM, '0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            console.log(response);
            return BLEConfig.unparse(response.slice(4,20));
        })
        .then(teamUUID => dispatch({
            type: Actions.GET_KIT_TEAM,
            data: {
                id: teamUUID,
                user
            }
        }))
        .catch(err => Promise.reject(err));
};

const getOwnerUser = (id, user) => {
    let dataArray = [convertHex(commands.GET_OWNER_USER, '0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            console.log(response);
            return BLEConfig.unparse(response.slice(4,20));
        })
        .then(userUUID => dispatch({
            type: Actions.GET_KIT_INDIVIDUAL,
            data: {
                id: userUUID,
                user
            }
        }))
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

const connectToAccessory = (data) => {
    return dispatch => BleManager.connect(data.id)
        .then(() => BleManager.retrieveServices(data.id))
        .then(services => dispatch({
            type: Actions.CONNECT_TO_ACCESSORY,
            data: {
                accessoryConnected: true,
                ...data
            }}
        ))
        .catch(err => Promise.reject(err));
};

const loginToAccessory = (data, {role, id}) => {
    return dispatch => BLEConfig.parse(id)
        .then(convertedUUID => {
            let dataArray = [];
            let hexRole = BLEConfig.roles[role];
            dataArray.push(commands.LOGIN);
            dataArray.push(convertHex('0x11'));
            dataArray.push(hexRole);
            dataArray = dataArray.concat(convertedUUID);
            return write(data.id, dataArray);
        })
        .then(accessoryLoginResult => {
            return AppAPI.accessories.patch(data.id, data);
        })
        .then(uploadedAccessory => dispatch({
            type: Actions.CONNECT_TO_ACCESSORY,
            data: {
                accessoryConnected: true,
                ...uploadedAccessory
            }
        }))
        .catch(err => Promise.reject(err));
}

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

const readSSID = (id, loopsLeft, wifiList) => {
    if (loopsLeft > 0) {
        return wait(100)
            .then(() => BleManager.read(id, BLEConfig.serviceUUID, BLEConfig.characteristicUUID))
            .then(response => {
                console.log(response);
                wifiList.push(convertByteArrayToString(response.slice(3)));
                return readSSID(id, loopsLeft-1, wifiList);
            });
    }
    return wifiList;
};

const scanWiFi = (id) => {
    let dataArray = [commands.WIFI_SCAN, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            console.log('------------------------------------');
            console.log({response});
            console.log('------------------------------------');
            dispatch({
                type: Actions.WIFI_SCAN
            });
            console.log((new Date().getTime()));
            return wait(1000);
        })
        .then(() => {
            console.log((new Date().getTime()));
            return BleManager.read(id, BLEConfig.serviceUUID, BLEConfig.characteristicUUID);
        })
        .then(response => {
            console.log('------------------------------------');
            console.log({response});
            console.log('------------------------------------');
            return readSSID(id, response[4], []);
        })
        .then(response => dispatch({
            type: Actions.NETWORKS_DISCOVERED,
            data: response
        }))
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

const assignKitName = (id, name) => {
    let newName = name.split('Fathom_kit_')[1];
    let dataArray = [commands.SET_KIT_NAME, newName.length];
    dataArray = dataArray.concat(convertStringToByteArray(newName));
    return dispatch => write(id, dataArray)
        .then(response => write(id, [commands.STORE_PARAMS, convertHex('0X00')]))
        .then(respones => dispatch({
            type: Actions.ASSIGN_KIT_NAME,
            data: name
        }));
};

const assignKitIndividual = (id, user) => {
    let dataArray = [commands.SET_OWNER_USER, convertHex('0x10')];
    return dispatch => BLEConfig.parse(user.id)
        .then(userUUID => write(id, dataArray.concat(userUUID)))
        .then(response => write(id, [commands.STORE_PARAMS, convertHex('0X00')]))
        .then(response => dispatch({
            type: Actions.ASSIGN_KIT_INDIVIDUAL,
            data: user
        }))
        .catch(err => Promise.reject(err))
};

const assignKitTeam = (id, team) => {
    let dataArray = [commands.SET_OWNER_TEAM, convertHex('0x10')];
    return dispatch => BLEConfig.parse(team.id)
        .then(teamUUID => write(id, dataArray.concat(teamUUID)))
        .then(response => write(id, [commands.STORE_PARAMS, convertHex('0X00')]))
        .then(response => dispatch({
            type: Actions.ASSIGN_KIT_TEAM,
            data: team
        }))
        .catch(err => Promise.reject(err))
};

const assignKitOrganization = (id, organization) => {
    let dataArray = [commands.SET_OWNER_ORG, convertHex('0x10')];
    return dispatch => BLEConfig.parse(organization.id)
        .then(orgUUID => {console.log(dataArray.concat(orgUUID)); return write(id, dataArray.concat(orgUUID)) })
        .then(response => {
            console.log({response});
            return write(id, [commands.STORE_PARAMS, convertHex('0X00')])
        })
        .then(response => {
            console.log(response);
            return dispatch({
                type: Actions.ASSIGN_KIT_ORGANIZATION,
                data: organization
            });
        })
        .catch(err => Promise.reject(err))
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
    loginToAccessory,
    setWiFiSSID,
    setWiFiPassword,
    connectWiFi,
    getOwnerOrganization,
    getOwnerTeam,
    getOwnerUser,
    resetAccessory,
    scanWiFi,
    assignKitName,
    assignKitIndividual,
    assignKitTeam,
    assignKitOrganization
};