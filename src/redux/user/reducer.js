/**
 * User Reducer
 */

const Actions = require('../actionTypes');

// Set initial state
const initialState = {
    teamIndex:             0,
    teams:                 [],
    selectedTrainingGroup: {}
};

/* eslint-disable max-len */
export default function userReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.USER_REPLACE:
    case Actions.GET_TRAINING_GROUPS:
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
    case Actions.CREATE_TRAINING_GROUP:
        let postCreateTeams = state.teams.map((team, index) => {
            if (index !== state.teamIndex) {
                return team;
            }
            team.training_groups.push(action.data);
            return team;
        });
        return Object.assign({}, state, {
            teams: postCreateTeams
        });
    case Actions.PATCH_TRAINING_GROUP:
        let postPatchTeams = state.teams.map((team, index) => {
            if (index !== state.teamIndex) {
                return team;
            }
            team.training_groups = team.training_groups.map(training_group => training_group.id === action.data.id ? action.data : training_group);
            return team;
        });
        return Object.assign({}, state, {
            teams:                 postPatchTeams,
            selectedTrainingGroup: action.data
        });
    case Actions.REMOVE_TRAINING_GROUP:
        let postRemoveTeams = state.teams.map((team, index) => {
            if (index !== state.teamIndex) {
                return team;
            }
            team.training_groups = team.training_groups.filter(training_group => training_group.id !== action.data);
            return team;
        });
        return Object.assign({}, state, {
            teams: postRemoveTeams
        });
    case Actions.TEAM_SELECT:
        return Object.assign({}, state, {
            teamIndex: parseInt(action.data, 10)
        });
    case Actions.TRAINING_GROUP_SELECT:
        return Object.assign({}, state, {
            selectedTrainingGroup: action.data
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
