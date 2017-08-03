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
    networks:      [],
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
                ...action.data
            },
            indicator: false
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
        tempAccessory.accessoryConnected = false;
        tempAccessory.name = `Fathom_kit_${tempAccessory.id.slice(-2)}`;
        return Object.assign({}, state, {
            accessoryData: tempAccessory,
            networks:      []
        });
    case Actions.WIFI_SCAN:
        return Object.assign({}, state, {
            wifiScan: true
        });
    case Actions.ASSIGN_KIT_NAME:
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                name: action.data
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
    case Actions.NETWORK_DISCOVERED:
        let networks = state.networks.some(network => network.label === action.data) || action.data === '' ? state.networks : state.networks.concat([{ key: state.networks.length, label: action.data }]);
        return Object.assign({}, state, {
            networks
        });
    case Actions.BLUETOOTH_DISCONNECT:
        return Object.assign({}, state, {
            accessoryData: {},
            networks:      [],
            devicesFound:  []
        });
    case Actions.HANDLE_DISCONNECT:
    case Actions.WIFI:
    case Actions.CHECK_STATE:
    case Actions.ENABLE_BLUETOOTH:
    case Actions.START_BLUETOOTH:
    case Actions.SET_KIT_TIME:
    case Actions.SET_KIT_STATE:
    default:
        return state;
    }
}
