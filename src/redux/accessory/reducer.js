/**
 * Accessory Reducer
 */

const Actions = require('../actionTypes');

// Set initial state
const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.UPSERT_ACCESSORY:
        return {
            ...state,
            accessory: action.data,
        };
    default:
        return state;
    }
}
