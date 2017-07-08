/**
 * Accessory Reducer
 */
import BleManager from 'react-native-ble-manager';

const Actions = require('../actionTypes');

// Set initial state
const initialState = {
    BleManager
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.UPSERT_ACCESSORY:
        return {
            ...state,
            accessory: action.data,
        };
    case Actions.CONNECT_TO_ACCESSORY:
        return {
            ...state,
            accessoryData: {
                name: action.data.name,
                id:   action.data.id
            }
        }
    default:
        return state;
    }
}
