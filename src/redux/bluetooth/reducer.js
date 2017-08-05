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
        console.log(action.data);
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                ...action.data
            },
            devicesFound: [],
            indicator:    false
        });
    case Actions.CHANGE_STATE:
        console.log(action.data === 'on' ? state.accessoryData : {});
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
        console.log(tempAccessory);
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                ...tempAccessory
            },
            networks: []
        });
    case Actions.WIFI_SCAN:
        return Object.assign({}, state, {
            wifiScan: true
        });
    case Actions.ASSIGN_KIT_NAME:
        console.log(`Fathom_kit_${action.data}`);
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                name: `Fathom_kit_${action.data}`
            }
        });
    case Actions.GET_KIT_INDIVIDUAL:
        console.log(action.data);
        let assignIndividualTeam = action.data.user.teams.find(checkTeam => checkTeam.users_with_training_groups.some(user => user.id === action.data.id));
        let individual = assignIndividualTeam ? assignIndividualTeam.users_with_training_groups.find(user => user.id === action.data.id) : null;
        console.log(individual);
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                individual
            }
        });
    case Actions.GET_KIT_TEAM:
        console.log(action.data);
        let team = action.data.user.teams.find(checkTeam => checkTeam.id === action.data.id) || null;
        console.log(team);
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                team
            }
        });
    case Actions.GET_KIT_ORGANIZATION:
        console.log(action.data);
        let organization = action.data.user.organization.id === action.data.id ? action.data.user.organization : null;
        console.log(organization);
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                organization
            }
        });
    case Actions.GET_KIT_NAME:
        let name = `Fathom_kit_${action.data}`;
        console.log(name === 'Fathom_kit_' ? state.accessoryData.name : name);
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                name: name === 'Fathom_kit_' ? state.accessoryData.name : name
            }
        });
    case Actions.NETWORK_DISCOVERED:
        let networks = state.networks.some(network => network.label === action.data) || action.data === '' ? state.networks : state.networks.concat([{ key: state.networks.length, label: action.data }]);
        return Object.assign({}, state, {
            networks
        });
    case Actions.GET_CONFIGURATION:
        console.log(action.data);
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                configuration: action.data
            }
        });
    case Actions.BLUETOOTH_DISCONNECT:
        return Object.assign({}, state, {
            accessoryData: {},
            networks:      [],
            devicesFound:  []
        });
    case Actions.WIFI:
        console.log(action.data ? action.data === 0 : false);
        return Object.assign({}, state, {
            accessoryData: {
                ...state.accessoryData,
                wifiConnected: action.data === 0 ? true : false
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
