/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:21:27 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:21:27 
 */

/**
 * Bluetooth Reducer
 */
const Actions = require('../actionTypes');

// Set initial state
const initialState = {
    assignType:    '',
    bluetoothOn:   false,
    scanning:      false,
    devicesFound:  [],
    accessoryData: {},
    networks:      [{ key: 0, label: 'Other' }],
    indicator:     false
};

export default function bluetoothReducer(state = initialState, action) {
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
        let tempAccessory = state.accessoryData;
        tempAccessory.organizationId = null;
        tempAccessory.last_user_id = null;
        tempAccessory.team_id = null;
        tempAccessory.emailWritten = false;
        tempAccessory.passwordWritten = false;
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                ...tempAccessory,
                configuration: 0,
                configured:    false
            },
            networks: [{ key: 0, label: 'Other' }]
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
    case Actions.GET_KIT_INDIVIDUAL:
        let assignIndividualTeam = action.data.user.teams.find(checkTeam => checkTeam.users_with_training_groups.some(user => user.id === action.data.id));
        let individual = assignIndividualTeam ? assignIndividualTeam.users_with_training_groups.find(user => user.id === action.data.id) : null;
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                individual
            }
        });
    case Actions.GET_KIT_TEAM:
        let team = action.data.user.teams.find(checkTeam => checkTeam.id === action.data.id) || null;
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                team
            }
        });
    case Actions.GET_KIT_ORGANIZATION:
        let organization = action.data.user.organization.id === action.data.id ? action.data.user.organization : null;
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                organization
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
    case Actions.GET_CONFIGURATION:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                ...action.data
            }
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
    case Actions.ACCESSORY_LOGIN_EMAIL:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                emailWritten: action.data === 0 ? true : false
            }
        });
    case Actions.ACCESSORY_LOGIN_PASSWORD:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                passwordWritten: action.data === 0 ? true : false
            }
        });
    case Actions.GET_WIFI_MAC_ADDRESS:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                wifiMacAddress: action.data !== '00:00:00:00:00:00' ? action.data : null
            }
        });
    case Actions.HANDLE_DISCONNECT:
    case Actions.CHECK_STATE:
    case Actions.ENABLE_BLUETOOTH:
    case Actions.START_BLUETOOTH:
    case Actions.SET_KIT_TIME:
    case Actions.SET_KIT_STATE:
    case Actions.STORE_PARAMS:
    default:
        return state;
    }
}
