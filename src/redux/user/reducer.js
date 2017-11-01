/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:20:51 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-23 16:23:38
 */

/**
 * User Reducer
 */

import { Roles } from '@constants/';
const Actions = require('../actionTypes');

let date = (new Date()).toLocaleDateString().split('/');

// Set initial state
const initialState = {
    teamIndex:             0,
    teams:                 [],
    selectedTrainingGroup: {},
    weekOffset:            0,
    statsStartDate:        `20${date[2]}-${date[0]}-${date[1]}`,
    statsEndDate:          `20${date[2]}-${date[0]}-${date[1]}`,
    selectedStats:         {
        athlete:   false,
        athleteId: null,
    }
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
                active:  true,
                id:      1,
                name:    'Full Team',
                team_id: team.id,
                tier:    'primary',
                user_id: null,
                users:   team.users_with_training_groups
            };
            team.training_groups.push(wholeTeamTrainingGroup);
            return team;
        });
        let group = Object.keys(state.selectedTrainingGroup).length === 0 ? {} 
            : teams[state.teamIndex].training_groups.find(trainingGroup => trainingGroup.id === state.selectedTrainingGroup.id);
        return Object.assign({}, state, {
            teams,
            selectedTrainingGroup: group
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
            teamIndex:     parseInt(action.data, 10),
            selectedStats: {
                athlete:   state.role === Roles.athlete ? true : false,
                athleteId: state.role === Roles.athlete ? state.id : null,
            }
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
    case Actions.GET_TEAM_STATS:
        let teamsForStats = state.teams.map((team, index) => {
            if (team.id !== action.data.teamId) {
                return team;
            }
            team.stats = action.data.stats;
            return team;
        });
        return Object.assign({}, state, {
            teams:          teamsForStats,
            weekOffset:     action.data.weekOffset,
            statsStartDate: action.data.startDate,
            statsEndDate:   action.data.endDate,
        });
    case Actions.SELECT_STATS_CATEGORY:
        return Object.assign({}, state, {
            selectedStats: {
                ...action.data
            }
        });
    case Actions.SIGN_UP_SUCCESS:
    case Actions.FORGOT_PASSWORD_SUCCESS:
    default:
        return state;
    }
}
