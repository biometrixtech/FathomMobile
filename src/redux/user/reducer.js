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
    case Actions.ADD_TG:
    case Actions.EDIT_TG:
    case Actions.REMOVE_TG:
    case Actions.ADD_R:
    case Actions.EDIT_R:
    case Actions.REMOVE_R:
        return  Object.assign({}, state, {
            ...action.data,
        });
    case Actions.GET_TEAMS:
        let teams = action.data.teams.map(team => {
            let wholeTeamTrainingGroup = {
                active: true,
                id: 1,
                name: 'Full Team',
                team_id: team.id,
                tier: 'primary',
                user_id: null,
                users: team.users_with_training_groups
            };
            team.training_groups.push(wholeTeamTrainingGroup);
            return team;
        });
        return Object.assign({}, state, {
            teams
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
    case Actions.REMOVE_USER:
        let updatedSelectedTrainingGroup = state.selectedTrainingGroup.users.filter(user => user.id !== action.data.userId);
        let updatedUserIds = state.selectedTrainingGroup.user_ids;
        updatedUserIds[action.data.userId] = false;
        return Object.assign({}, state, {
            teams:                 action.data.newTeams.teams,
            selectedTrainingGroup: {
                ...state.selectedTrainingGroup,
                user_ids: updatedUserIds,
                users:    updatedSelectedTrainingGroup
            }
        });
    case Actions.TEAM_SELECT:
        return Object.assign({}, state, {
            teamIndex: parseInt(action.data, 10)
        });
    case Actions.TRAINING_GROUP_SELECT:
        let trainingGroup = action.data;
        trainingGroup.user_ids = trainingGroup.users.reduce((ids, user) => { ids[user.id] = true; return ids; }, {}) || {};
        return Object.assign({}, state, {
            selectedTrainingGroup: trainingGroup
        });
    case Actions.GET_ACCESSORIES:
        let accessories = action.data.users.filter(user => user.accessories.length).reduce((totalAccessories, accessory) => totalAccessories.concat(accessory.accessories), []);
        return Object.assign({}, state, {
            accessories
        });
    case Actions.SIGN_UP_SUCCESS:
    case Actions.FORGOT_PASSWORD_SUCCESS:
    default:
        return state;
    }
}
