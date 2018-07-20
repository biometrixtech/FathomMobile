/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:21:27 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:44:21
 */

/**
 * Bluetooth Reducer
 */

import { Actions } from '@constants';

import Store from '@store/ble';

const initialState = Store;

export default function bleReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.START_CONNECT:
        return Object.assign({}, state, {
            indicator: true
        });
    case Actions.STOP_CONNECT:
        return Object.assign({}, state, {
            indicator: false
        });
    case Actions.CONNECT_TO_ACCESSORY:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                ...action.data
            },
            devicesFound: [],
            indicator:    false
        });
    case Actions.CHANGE_STATE:
        return Object.assign({}, state, {
            bluetoothOn:   action.data === 'on',
            accessoryData: action.data === 'on' ? state.accessoryData : {}
        });
    case Actions.DEVICE_FOUND:
        if (state.devicesFound.every(device => device.id !== action.data.id)) {
            return Object.assign({}, state, {
                devicesFound: state.devicesFound.concat([action.data])
            });
        }
        return state;
    case Actions.START_SCAN:
        return Object.assign({}, state, {
            scanning:     true,
            devicesFound: []
        });
    case Actions.STOP_SCAN:
        return Object.assign({}, state, {
            scanning: false,
        });
    case Actions.ASSIGN_TYPE:
        return Object.assign({}, state, {
            assignType: action.data
        });
    case Actions.ACCESSORY_RESET:
        if (action.success) {
            let tempAccessory = state.accessoryData;
            tempAccessory.organization = null;
            tempAccessory.organizationId = null;
            tempAccessory.team = null;
            tempAccessory.team_id = null;
            tempAccessory.last_user_id = null;
            tempAccessory.individual = null;
            return Object.assign({}, state, {
                accessoryData: {
                    ...state.accessoryData,
                    ...tempAccessory,
                    ownerFlag: false,
                },
                resetFailed: null,
                networks:    [{ key: 0, label: 'Other' }]
            });
        }
        return Object.assign({}, state, {
            resetFailed: true
        });
    case Actions.WIFI_SCAN:
        return Object.assign({}, state, {
            wifiScan: true
        });
    case Actions.ASSIGN_KIT_NAME:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                name: `Fathom_kit_${action.data}`
            }
        });
    case Actions.GET_KIT_NAME:
        let name = `Fathom_kit_${action.data}`;
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                name: name === 'Fathom_kit_' ? state.accessoryData.name : name
            }
        });
    case Actions.NETWORK_DISCOVERED:
        let networks = state.networks.some(network => network.label === action.data) || action.data.trim() === '' || action.data.trim() === 'Network Not Found' || action.data.trim() === '\\x00\\x00\\x00\\x00\\' ? state.networks : state.networks.concat([{ key: state.networks.length, label: action.data }]);
        return Object.assign({}, state, {
            networks
        });
    case Actions.BLUETOOTH_DISCONNECT:
        return Object.assign({}, state, {
            accessoryData: {},
            networks:      [{ key: 0, label: 'Other' }],
            devicesFound:  []
        });
    case Actions.WIFI:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                wifiConnected: action.data === 0 ? true : false
            }
        });
    case Actions.GET_OWNER_FLAG:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                ownerFlag: action.data
            }
        });
    case Actions.GET_WIFI_MAC_ADDRESS:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                wifiMacAddress: action.data !== '00:00:00:00:00:00' ? action.data : null
            }
        });
    case Actions.GET_ACCESSORY_KEY:
        let user = action.user;
        let team = user.teams.find(checkTeam => checkTeam.users_with_training_groups.some(individual => individual.id === action.user_id));
        let individual = team ? team.users_with_training_groups.find(checkUser => checkUser.id === action.user_id) : null;
        let organization = !!team && !!individual ? action.user.organization : null;
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                settingsKey:     action.settingsKey,
                last_user_id:    action.user_id,
                organization,
                organization_id: organization ? organization.id : null,
                team,
                team_id:         team ? team.id : null,
                individual
            }
        });
    case Actions.ENABLE_BLUETOOTH:
    case Actions.CHECK_STATE:
    case Actions.HANDLE_DISCONNECT:
    case Actions.SET_GYRO_CALIBRATION:
    case Actions.SET_KIT_STATE:
    case Actions.SET_KIT_TIME:
    case Actions.SET_OWNER_FLAG:
    case Actions.START_BLUETOOTH:
    case Actions.STORE_PARAMS:
    default:
        return state;
    }
}