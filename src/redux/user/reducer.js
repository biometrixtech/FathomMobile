/**
 * User Reducer
 */

const Actions = require('../actionTypes');

// Set initial state
const initialState = {
    teams:          [],
    trainingGroups: [],
};

/* eslint-disable max-len */
export default function userReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.USER_REPLACE:
    case Actions.GET_TRAINING_GROUPS:
    case Actions.CREATE_TRAINING_GROUPS:
    case Actions.PATCH_TRAINING_GROUPS:
    case Actions.REMOVE_TRAINING_GROUPS:
    case Actions.GET_TEAMS:
    case Actions.ADD_TG:
    case Actions.EDIT_TG:
    case Actions.REMOVE_TG:
    case Actions.ADD_R:
    case Actions.EDIT_R:
    case Actions.REMOVE_R:
        return  Object.assign({}, state, {
            ...action.data,
        });
    case Actions.SIGN_UP_SUCCESS:
    case Actions.FORGOT_PASSWORD_SUCCESS:
    case Actions.ADD_A:
    case Actions.EDIT_A:
    case Actions.REMOVE_A:
    default:
        return state;
    }
}
