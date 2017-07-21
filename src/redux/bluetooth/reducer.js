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
    resetCount:    0
};

export default function bluetoothReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.CONNECT_TO_ACCESSORY:
        return Object.assign({}, state, {
            accessoryData: {
                ...action.data
            }
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
            scanning: false
        });
    case Actions.ASSIGN_TYPE:
        return Object.assign({}, state, {
            assignType: action.data
        });
    case Actions.ACCESSORY_RESET:
        return Object.assign({}, state, {
            resetCount: state.resetCount + 1
        });
    case Actions.WIFI_SCAN:
        return Object.assign({}, state, {
            wifiScan: true
        });
    case Actions.ASSIGN_KIT_INDIVIDUAL:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                individual: action.data
            }
        });
    case Actions.ASSIGN_KIT_TEAM:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                team: action.data
            }
        });
    case Actions.ASSIGN_KIT_ORGANIZATION:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                organization: action.data
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
    case Actions.NETWORKS_DISCOVERED:
        return Object.assign({}, state, {
            wifiScan: false,
            networks: action.data
        });
    case Actions.CHECK_STATE:
    case Actions.ENABLE_BLUETOOTH:
    case Actions.START_BLUETOOTH:
    default:
        return state;
    }
}
