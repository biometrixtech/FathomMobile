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
        delete action.data.created_at;
        return {
            ...state,
            ...action.data,
        };
    case Actions.SIGN_UP_SUCCESS:
        return {
            ...state,
        };
    case Actions.FORGOT_PASSWORD_SUCCESS:
        return {
            ...state,
        };
    case Actions.GET_TRAINING_GROUPS:
        return {
            ...state,
            ...action.data,
        };
    case Actions.GET_TEAMS:
        return {
            ...state,
            ...action.data,
        };
    case Actions.ADD_TG:
        return {
            user:           state.user,
            regimens:       state.regimens,
            trainingGroups: state.trainingGroups.concat([action.data]),
        };
    case Actions.EDIT_TG:
        return {
            user:           state.user,
            regimens:       state.regimens,
            trainingGroups: (state.trainingGroups[state.trainingGroups.findIndex(trainingGroup => trainingGroup.id === action.data.id)] = action.data),
        };
    case Actions.REMOVE_TG:
        return {
            user:           state.user,
            regimens:       state.regimens,
            trainingGroups: state.trainingGroups.filter(group => group.id !== action.data),
        };
    case Actions.ADD_R:
        return {
            user:           state.user,
            regimens:       state.regimens.concat([action.data]),
            trainingGroups: state.trainingGroups,
        };
    case Actions.EDIT_R:
        return {
            user:           state.user,
            regimens:       (state.regimens[state.regimens.findIndex(regimen => regimen.id === action.data.id)] = action.data),
            trainingGroups: state.trainingGroups,
        };
    case Actions.REMOVE_R:
        return {
            user:           state.user,
            regimens:       state.regimens.filter(regimen => regimen.id !== action.data),
            trainingGroups: state.trainingGroups,
        };
    case Actions.ADD_A:
        return { ...state };
    case Actions.EDIT_A:
        return { ...state };
    case Actions.REMOVE_A:
        return { ...state };
    default:
        return state;
    }
}
