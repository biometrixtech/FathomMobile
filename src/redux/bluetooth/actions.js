/**
 * Bluetooth Actions
 */
import BleManager from 'react-native-ble-manager';
import { BLEConfig } from '@constants';
import AppAPI from '@lib/api';

const Actions = require('../actionTypes');
const commands = BLEConfig.commands;
const state = BLEConfig.state

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
    return array.map(byte =>  byte ? String.fromCharCode(byte) : '').join('');
};

const convertHex = (value) => {
    return parseInt(value, 16);
};

// Creating a promise wrapper for setTimeout
const wait = (delay = 0) => new Promise(resolve => setTimeout(resolve, delay));

const getOwnerOrganization = (id, user) => {
    let dataArray = [commands.GET_OWNER_ORG, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            return BLEConfig.unparse(response.slice(4,20));
        })
        .then(organizationUUID => {
            return dispatch({
                type: Actions.GET_KIT_ORGANIZATION,
                data: {
                    id: organizationUUID,
                    user
                }
            });
        })
        .catch(err => Promise.reject(err));
};

const getOwnerTeam = (id, user) => {
    let dataArray = [commands.GET_OWNER_TEAM, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            console.log(response);
            return BLEConfig.unparse(response.slice(4,20));
        })
        .then(teamUUID => {
            return dispatch({
                type: Actions.GET_KIT_TEAM,
                data: {
                    id: teamUUID,
                    user
                }
            });
        })
        .catch(err => Promise.reject(err));
};

const getOwnerUser = (id, user) => {
    let dataArray = [commands.GET_OWNER_USER, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            return BLEConfig.unparse(response.slice(4,20));
        })
        .then(userUUID => {
            return dispatch({
                type: Actions.GET_KIT_INDIVIDUAL,
                data: {
                    id: userUUID,
                    user
                }
            });
        })
        .catch(err => Promise.reject(err));
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

const getConfiguration = (id) => {
    let dataArray = [commands.GET_CONFIGURATION, convertHex('0x00')];
    return dispatch => write(id, dataArray)
        .then(response => {
            return dispatch({
                type: Actions.GET_CONFIGURATION,    
                data: response[4]
            });
        })
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

const connectToAccessory = (data) => {
    return dispatch => BleManager.connect(data.id)
        .then(() => BleManager.retrieveServices(data.id))
        .then(services => {
            return dispatch({
                type: Actions.CONNECT_TO_ACCESSORY,
                data: {
                    accessoryConnected: true,
                    ...data
                }
            });
        })
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
        // .then(accessoryLoginResult => {
        //     return AppAPI.accessories.patch(data.id, data);
        // })
        .then(uploadedAccessory => {
            return dispatch({
                type: Actions.CONNECT_TO_ACCESSORY,
                data: {
                    accessoryConnected: true,
                    ...data
                }
            });
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

const connectWiFi = (id) => {
    let dataArray = [];
    dataArray.push(convertHex('0x08'));
    dataArray.push(convertHex('0x00'));
    for (let i = 2; i < 20; i+=1) {
        dataArray.push(convertHex('0x00'));
    }
    return dispatch => write(id, dataArray)
        .then(result => {
            return dispatch({
                type: Actions.WIFI,
                data: result[3]
            });
        });
};

const readSSID = (id) => {
    return dispatch => wait(100)
        .then(() => BleManager.read(id, BLEConfig.serviceUUID, BLEConfig.characteristicUUID))
        .then(response => {
            console.log(response);
            return dispatch({
                type: Actions.NETWORK_DISCOVERED,
                data: response[3] === 1 ? '' : convertByteArrayToString(response.slice(3))
            });
        })
        .catch(err => console.log(err));
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
        // .then(response => {
        //     let data = accessory;
        //     data.team_id = null;
        //     data.organization_id = null;
        //     data.name = `Fathom_kit_${data.id.slice(-2)}`;
        //     return AppAPI.accessories.patch(data.id, data);
        // })
        .then(response => {
            return dispatch({
                type: Actions.ACCESSORY_RESET
            });
        })
        .catch(err => Promise.reject(err));
};

const systemReset = (id) => {
    let resetCmd = [commands.SYS_RESET, convertHex('0x00')];
    return dispatch => write(id, resetCmd)
        .then(response => {
            return dispatch({
                type: Actions.ACCESSORY_RESET
            })
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
        // .then(response => {
        //     return AppAPI.accessories.patch(accessory.id, accessory);
        // })
        .then(response => {
            return dispatch({
                type: Actions.STORE_PARAMS
            })
        })
}

const assignKitIndividual = (accessory, user) => {
    let dataArray = [commands.SET_OWNER_USER, convertHex('0x10')];
    let data;
    return dispatch => Promise.resolve(dispatch({
        type: Actions.START_CONNECT
    }))
        .then(() => BLEConfig.parse(user.id))
        .then(userUUID => {
            dataArray = dataArray.concat(userUUID);
            return write(accessory.id, dataArray);
        })
        .then(uploadedAccessory => {
            data = accessory;
            data.individual = user;
            data.last_user_id = user.id;
            dispatch({
                type: Actions.CONNECT_TO_ACCESSORY,
                data: {
                    accessoryConnected: true,
                    ...data
                }
            })
            dispatch({
                type: Actions.STOP_CONNECT
            });
            return null;
        })
        .catch(err => Promise.reject(err))
};

const assignKitTeam = (accessory, team) => {
    let dataArray = [commands.SET_OWNER_TEAM, convertHex('0x10')];
    let data;
    return dispatch => Promise.resolve(dispatch({
        type: Actions.START_CONNECT
    }))
        .then(() => BLEConfig.parse(team.id))
        .then(teamUUID => {
            dataArray = dataArray.concat(teamUUID);
            return write(accessory.id, dataArray);
        })
        .then(uploadedAccessory => {
            data = accessory;
            data.team = team;
            data.team_id = team.id;
            dispatch({
                type: Actions.CONNECT_TO_ACCESSORY,
                data: {
                    accessoryConnected: true,
                    ...data
                }
            })
            dispatch({
                type: Actions.STOP_CONNECT
            });
            return null;
        })
        .catch(err => Promise.reject(err))
};

const assignKitOrganization = (accessory, organization) => {
    let dataArray = [commands.SET_OWNER_ORG, convertHex('0x10')];
    let data;
    return dispatch => Promise.resolve(dispatch({
        type: Actions.START_CONNECT
    }))
        .then(() => BLEConfig.parse(organization.id))
        .then(orgUUID => {
            dataArray = dataArray.concat(orgUUID)
            return write(accessory.id, dataArray);
        })
        .then(uploadedAccessory => {
            data = accessory;
            data.organization = organization;
            data.organization_id = organization.id;
            dispatch({
                type: Actions.CONNECT_TO_ACCESSORY,
                data: {
                    accessoryConnected: true,
                    ...data
                }
            })
            dispatch({
                type: Actions.STOP_CONNECT
            });
            return null;
        })
        .catch(err => Promise.reject(err))
};

const setKitState = (id, stateUsed) => {
    let dataArray = [commands.SET_STATE, convertHex('0x01'), state[stateUsed]];
    return dispatch => write(id, dataArray)
        .then(result => dispatch({
            type: Actions.SET_KIT_STATE
        }));
};

const disconnect = (id) => {
    return dispatch => Promise.resolve(setKitState(id, 'APP_IDLE'))
        .then(() => BleManager.disconnect(id))
        .then(() => BleManager.removePeripheral(id))
        .then(() => dispatch({
            type: Actions.BLUETOOTH_DISCONNECT
        }));
};

const handleDisconnect = (id) => {
    return dispatch => BleManager.isPeripheralConnected(id, [])
        .then(isConnected => isConnected ? null : BleManager.connect(id))
        .then(() => BleManager.retrieveServices(id))
        .then(services => dispatch({
            type: Actions.HANDLE_DISCONNECT
        }));
};

const setKitTime = (id) => {
    let dataArray = [commands.SET_TIME, convertHex('0x04')];
    return dispatch => write(id, dataArray.concat(Math.round((new Date()).getTime() / 1000).toString(16).match(/.{1,2}/g).map(val => convertHex(val)))) // unholy command to convert current time since epoch to a hex string to an array of hex to an array of decimal representations of the hex values to send
        .then(result => {
            return dispatch({
                type: Actions.SET_KIT_TIME
            });
        });
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
    startConnect,
    stopConnect,
    connectToAccessory,
    loginToAccessory,
    setWiFiSSID,
    setWiFiPassword,
    connectWiFi,
    getOwnerOrganization,
    getOwnerTeam,
    getOwnerUser,
    getKitName,
    resetAccessory,
    systemReset,
    readSSID,
    scanWiFi,
    assignKitName,
    assignKitIndividual,
    assignKitTeam,
    assignKitOrganization,
    disconnect,
    handleDisconnect,
    setKitTime,
    setKitState,
    getConfiguration,
    storeParams
};