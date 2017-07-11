/**
 * Bluetooth Reducer
 */
const Actions = require('../actionTypes');

// Set initial state
const initialState = {
    bluetoothOn:   false,
    scanning:      false,
    devicesFound:  [],
    accessoryData: {},
};

export default function bluetoothReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.CONNECT_TO_ACCESSORY:
        return Object.assign({}, state, {
            accessoryData: {
                accessoryConnected: action.data.accessoryConnected,
                id:                 action.data.id,
                name:               action.data.name
            }
        });
    case Actions.CHANGE_STATE:
        return Object.assign({}, state, {
            bluetoothOn: action.data === 'on'
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
    case Actions.CHECK_STATE:
    case Actions.ENABLE_BLUETOOTH:
    case Actions.START_BLUETOOTH:
    default:
        return state;
    }
}
