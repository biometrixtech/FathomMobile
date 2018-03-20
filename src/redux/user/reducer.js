/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:20:51 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-19 02:14:38
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
    userIndex:             null,
    users:                 [],
    selectedTrainingGroup: {},
    weekOffset:            0,
    loading:               false,
    statsStartDate:        `20${date[2]}-${date[0]}-${date[1]}`,
    statsEndDate:          `20${date[2]}-${date[0]}-${date[1]}`,
    selectedStats:         {
        athlete:   false,
        athleteId: null,
    },
    selectedGraph:      null,
    selectedGraphIndex: null,
};

const teamSort = (teamA, teamB) => {
    return teamA.name.toUpperCase().localeCompare(teamB.name.toUpperCase());
}

const userSort = (userA, userB) => {
    return `${userA.first_name} ${userA.last_name}`.toUpperCase().localeCompare(`${userB.first_name} ${userB.last_name}`.toUpperCase());
}

const removeDuplicatesById = (array) => {
    return array.reduce((prev, current) => {
        if (prev.every(element => element.id !== current.id)) {
            prev.push(current);
        }
        return prev;
    }, []);
}

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
        let users = [];
        let teams = action.data.teams.map(team => {
            let wholeTeamTrainingGroup = {
                active:  true,
                id:      1,
                name:    'Full Team',
                team_id: team.id,
                tier:    'primary',
                user_id: null,
                users:   team.users_with_training_groups.filter(user => state.role === Roles.athlete ? user.id === state.id : true)
            };
            team.training_groups.push(wholeTeamTrainingGroup);
            users = users.concat(wholeTeamTrainingGroup.users);
            return team;
        });
        teams.sort(teamSort);
        users = removeDuplicatesById(users);
        users.sort(userSort);
        let group = Object.keys(state.selectedTrainingGroup).length === 0 ? {} 
            : teams[state.teamIndex].training_groups.find(trainingGroup => trainingGroup.id === state.selectedTrainingGroup.id);
        return Object.assign({}, state, {
            teams,
            users,
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
            teamIndex:     action.index === null ? action.index : parseInt(action.index, 10),
            selectedStats: {
                athlete:   state.role === Roles.athlete ? true : false,
                athleteId: state.role === Roles.athlete ? state.id : null,
            }
        });
    case Actions.USER_SELECT:
        return Object.assign({}, state, {
            userIndex:     action.index === null ? action.index : parseInt(action.index, 10),
            selectedStats: {
                athlete:   state.role === Roles.athlete ? true : false,
                athleteId: state.role === Roles.athlete ? state.id : null,
            },
            selectedGraph:      (action.index === null ? action.index : parseInt(action.index, 10)) === state.userIndex ? state.selectedGraph : null,
            selectedGraphIndex: (action.index === null ? action.index : parseInt(action.index, 10)) === state.userIndex ? state.selectedGraphIndex : null,
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
        let usersForStats = state.users.slice(0);
        let teamsForStats = state.teams.map((team, index) => {
            if (team.id !== action.data.teamId) {
                return team;
            }
            team.stats = state.role !== Roles.athlete || action.data.stats.AthleteMovementQualityData.some(athlete => athlete.userId === state.id) ? action.data.stats : null;
            team.previousWeekStats = state.role !== Roles.athlete || action.data.previousWeekStats.AthleteMovementQualityData.some(athlete => athlete.userId === state.id) ? action.data.previousWeekStats : null;
            usersForStats = usersForStats.slice(0).map(user => {
                user.stats = null;
                user.previousWeekStats = null;
                user.preprocessing = null;
                if (action.data.stats && action.data.stats.AthleteMovementQualityData.length) {
                    action.data.stats.AthleteMovementQualityData.forEach(athleteData => {
                        if (athleteData.userId === user.id) {
                            user.stats = athleteData;
                        }
                    });
                }
                if (action.data.previousWeekStats && action.data.previousWeekStats.AthleteMovementQualityData.length) {
                    action.data.previousWeekStats.AthleteMovementQualityData.forEach(athleteData => {
                        if (athleteData.userId === user.id) {
                            user.previousWeekStats = athleteData;
                        }
                    });
                }
                if (action.data.preprocessing) {
                    Object.keys(action.data.preprocessing).forEach(preprocessingType => {
                        if (preprocessingType.length) {
                            action.data.preprocessing[preprocessingType].forEach(typeData => {
                                if (typeData.user_id === user.id) {
                                    if (!user.preprocessing) {
                                        user.preprocessing = {};
                                    }
                                    user.preprocessing[preprocessingType] = [typeData];
                                }
                            })
                        }
                    });
                }
                return user;
            });
            team.preprocessing = action.data.preprocessing;
            return team;
        });
        return Object.assign({}, state, {
            users:                      usersForStats,
            teams:                      teamsForStats,
            weekOffset:                 action.data.weekOffset,
            statsStartDate:             action.data.startDate,
            statsEndDate:               action.data.endDate,
            previousWeekStatsStartDate: action.data.previousWeekStartDate,
            previousWeekStatsEndDate:   action.data.previousWeekEndDate,
            nextWeekStatsStartDate:     action.data.nextWeekStartDate,
            nextWeekStatsEndDate:       action.data.nextWeekEndDate,
            selectedGraph:              null,
            selectedGraphIndex:         null,
        });
    case Actions.SELECT_STATS_CATEGORY:
        return Object.assign({}, state, {
            selectedStats: {
                ...action.data
            }
        });
    case Actions.START_REQUEST:
        return Object.assign({}, state, {
            loading: true
        });
    case Actions.STOP_REQUEST:
        return Object.assign({}, state, {
            loading: false
        });
    case Actions.SELECT_GRAPH:
        return Object.assign({}, state, {
            selectedGraph:      state.selectedGraph === action.selectedGraph && state.selectedGraphIndex === action.selectedGraphIndex ? null : action.selectedGraph,
            selectedGraphIndex: state.selectedGraph === action.selectedGraph && state.selectedGraphIndex === action.selectedGraphIndex ? null : action.selectedGraphIndex,
        });
    case Actions.SIGN_UP_SUCCESS:
    case Actions.FORGOT_PASSWORD_SUCCESS:
    default:
        return state;
    }
}
