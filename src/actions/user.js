/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:20:59
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:28:08
 */

/**
 * User Actions
 */

import { Actions, } from '../constants';
import { AppAPI, AppUtil, } from '../lib';
import { store } from '../store';

// import third-party libraries
import moment from 'moment';

/**
  * Get My User Data
  */
const getUser = userId => {
    return dispatch => AppAPI.get_user.get({userId})
        .then(userData => {
            dispatch({
                type: Actions.USER_REPLACE,
                data: userData.user,
            });
            let cleanedResult = {};
            cleanedResult.sensor_pid = userData.user.sensor_pid;
            cleanedResult.mobile_udid = userData.user.mobile_udid;
            dispatch({
                type: Actions.CONNECT_TO_ACCESSORY,
                data: cleanedResult,
            });
            return Promise.resolve(userData);
        })
        .catch(err => Promise.reject(err));
};

/**
  * Update My User Data
  * - Receives complete user data in return
  */
const updateUser = (payload, userId) => {
    return dispatch => AppAPI.update_user.patch({userId}, payload)
        .then(userData => {
            dispatch({
                type:     Actions.LOGIN,
                email:    userData.user.personal_data.email || store.getState().init.email,
                password: userData.user.password || store.getState().init.password,
            });
            dispatch({
                type: Actions.USER_REPLACE,
                data: userData.user
            });
            return Promise.resolve(userData);
        })
        .catch(err => Promise.reject(err));
};

/**
  * Create User
  */
const createUser = (payload) => {
    return dispatch => AppAPI.create_user.post(false, payload)
        .then(userData => Promise.resolve(userData))
        .catch(err => {
            console.log('err',err);
            return Promise.reject(err);
        });
};

/**
  * User Join Account
  */
const userJoinAccount = (userId, payload) => {
    return dispatch => AppAPI.join_account.post({userId}, payload)
        .then(userData => {
            let accountObj = userData;
            return AppAPI.get_user.get({userId})
                .then(getUserData => {
                    dispatch({
                        type: Actions.USER_REPLACE,
                        data: getUserData.user,
                    });
                    let cleanedResult = {};
                    cleanedResult.sensor_pid = getUserData.user.sensor_pid;
                    cleanedResult.mobile_udid = getUserData.user.mobile_udid;
                    dispatch({
                        type: Actions.CONNECT_TO_ACCESSORY,
                        data: cleanedResult,
                    });
                    return Promise.resolve(accountObj);
                })
                .catch(error => Promise.reject(error));
        })
        .catch(err => Promise.reject(err));
};

/**
  * Check Account Code
  */
const checkAccountCode = account_code => {
    return dispatch => AppAPI.check_account_code.get({account_code})
        .then(userData => Promise.resolve(userData))
        .catch(err => Promise.reject(err));
};

/**
  * Clear User data
  * - WARNING: this will clear the users data for my plan and reset the reducer!
  */
const clearUserData = () => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    return AppAPI.clear_user_data.post(false, bodyObj)
        .then(response => {
            store.dispatch({
                type: Actions.NOTIFICATION_RECEIVED
            });
            store.dispatch({
                type: Actions.GET_SORE_BODY_PARTS,
                data: {body_parts: []},
            });
            return Promise.resolve(response);
        })
        .catch(err => {
            return Promise.reject(err);
        });
};

/**
 * GET Training Groups
 */
const getTrainingGroups = () => {
    return dispatch => AppAPI.training_groups.get()
        .then((trainingGroups) => {
            dispatch({
                type: Actions.GET_TRAINING_GROUPS,
                data: trainingGroups,
            });
            return trainingGroups;
        });
};

/**
 * Create Training Group
 */
const createTrainingGroup = trainingGroup => {
    trainingGroup = Object.assign({}, trainingGroup, {
        user_ids: Object.keys(trainingGroup.user_ids)
    });
    return dispatch => AppAPI.training_groups.post(null, trainingGroup)
        .then(newTrainingGroup => dispatch({
            type: Actions.CREATE_TRAINING_GROUP,
            data: newTrainingGroup,
        }));
};

/**
 * Patch Training Group
 */
const patchTrainingGroup = trainingGroup => {
    let id = trainingGroup.id;
    delete trainingGroup.id;
    trainingGroup.user_ids = Object.entries(trainingGroup.user_ids).filter(group => group[1]).map(group => group[0]);
    return dispatch => AppAPI.training_groups.patch(id, trainingGroup)
        .then(patchedTrainingGroup => dispatch({
            type: Actions.PATCH_TRAINING_GROUP,
            data: patchedTrainingGroup,
        }));
};

/**
 * Remove Training Group
 */
const removeTrainingGroup = trainingGroupId => {
    return dispatch => AppAPI.training_groups.delete(trainingGroupId)
        .then(() => dispatch({
            type: Actions.REMOVE_TRAINING_GROUP,
            data: trainingGroupId,
        }));
};

const teamSelect = index => {
    return dispatch => dispatch({
        type: Actions.TEAM_SELECT,
        index
    });
};

const userSelect = index => {
    return dispatch => dispatch({
        type: Actions.USER_SELECT,
        index
    });
}

const selectTrainingGroup = trainingGroup => {
    return dispatch => dispatch({
        type: Actions.TRAINING_GROUP_SELECT,
        data: trainingGroup
    });
};

const removeUser = (trainingGroupId, userId) => {
    return dispatch => AppAPI.remove_user.post({ trainingGroupId }, { user_id: userId })
        .then(() => AppAPI.teams.get())
        .then(newTeams => dispatch({
            type: Actions.REMOVE_USER,
            data: {
                newTeams,
                userId
            }
        }));
};

const startSession = accessoryId => {
    return dispatch => AppAPI.start_session.post({ accessoryId }, { capture_mode: 'log' })
        .then(() => AppAPI.accessories.get())
        .then(accessories => dispatch({
            type: Actions.GET_ACCESSORIES,
            data: accessories
        }))
        .catch(err => Promise.reject(err));
};

const stopSession = accessoryId => {
    return dispatch => AppAPI.stop_session.post({ accessoryId })
        .then(() => AppAPI.accessories.get())
        .then(accessories => dispatch({
            type: Actions.GET_ACCESSORIES,
            data: accessories
        }))
        .catch(err => Promise.reject(err));
};

const getStartAndEndDate = weekOffset => {
    let date = new Date();
    date.setTime(date.getTime() + weekOffset * AppUtil.MS_IN_WEEK);
    let dayOfWeek = date.getDay();
    let startOfWeekOffset = dayOfWeek === 1 ? 0 : (dayOfWeek+6)%7;
    let endOfWeekOffset = !dayOfWeek ? 0 : 7-dayOfWeek;
    let startDateObject = new Date(date.getTime() - startOfWeekOffset * AppUtil.MS_IN_DAY);
    let endDateObject = new Date(date.getTime() + endOfWeekOffset * AppUtil.MS_IN_DAY);
    let startDate = `${startDateObject.getFullYear()}-${AppUtil.formatDate(startDateObject.getMonth()+1)}-${AppUtil.formatDate(startDateObject.getDate())}`;
    let endDate = `${endDateObject.getFullYear()}-${AppUtil.formatDate(endDateObject.getMonth()+1)}-${AppUtil.formatDate(endDateObject.getDate())}`;
    return ({ startDate, endDate });
};

const getTeams = ({ statsStartDate, statsEndDate, weekOffset = 0 }) => {
    let tempTeams = [];
    let { startDate, endDate } = getStartAndEndDate(weekOffset);
    if (startDate === statsStartDate && endDate === statsEndDate) {
        return dispatch => dispatch({
            type: Actions.STOP_REQUEST
        });
    }
    let previousWeek = getStartAndEndDate(-1);
    let nextWeek = getStartAndEndDate(+1);
    let previousWeekStartDate = previousWeek.startDate;
    let previousWeekEndDate = previousWeek.endDate;
    let nextWeekStartDate = nextWeek.startDate;
    let nextWeekEndDate = nextWeek.endDate;
    return dispatch => AppAPI.teams.get()
        .then(teams => {
            tempTeams = teams.teams.map(team => team.id);
            return dispatch({
                type: Actions.GET_TEAMS,
                data: teams
            });
        })
        .then(() => Promise.all(tempTeams.map(teamId => AppAPI.stats.team_movement_quality_details.post(null, { teamId, startDate, endDate })
            .then(stats => AppAPI.stats.team_movement_quality_details.post(null, { teamId, startDate: previousWeekStartDate, endDate: previousWeekEndDate })
                .then(previousWeekStats => AppAPI.preprocessing.status.post(null, { start_date: startDate, end_date: endDate })
                    .then(preprocessing => Promise.resolve({ teamId, stats, previousWeekStats, preprocessing: preprocessing.sessions }))
                    .catch(err => Promise.resolve({ teamId, stats, previousWeekStats, preprocessing: null }))
                )
                .catch(err => Promise.resolve({ teamId, stats, previousWeekStats: null, preprocessing: null }))
            )
            .catch(err => Promise.resolve({ teamId, stats: null, previousWeekStats: null, preprocessing: null }))
        )))
        .then(teamsStats => dispatch({
            type: Actions.GET_TEAM_STATS,
            data: { teamsStats, weekOffset: 0, startDate, endDate, previousWeekStartDate, previousWeekEndDate, nextWeekStartDate, nextWeekEndDate }
        }));
};

const getAccessories = () => {
    return dispatch => AppAPI.accessories.get()
        .then(accessories => dispatch({
            type: Actions.GET_ACCESSORIES,
            data: accessories
        }));
};

const setStatsCategory = (athlete, athleteId) => {
    return dispatch => dispatch({
        type: Actions.SELECT_STATS_CATEGORY,
        data: { athlete, athleteId }
    });
};

const getTeamStats = ({ weekOffset, teams }, change) => {
    if (change === 0) {
        return dispatch => dispatch({
            type: Actions.STOP_REQUEST
        });
    }
    let newWeekOffset = weekOffset + change;
    let { startDate, endDate } = getStartAndEndDate(newWeekOffset);
    let previousWeek = getStartAndEndDate(newWeekOffset-1);
    let nextWeek = getStartAndEndDate(newWeekOffset+1);
    let previousWeekStartDate = previousWeek.startDate;
    let previousWeekEndDate = previousWeek.endDate;
    let nextWeekStartDate = nextWeek.startDate;
    let nextWeekEndDate = nextWeek.endDate;
    if (Math.abs(change) > 1) {
        return dispatch => Promise.all(teams.map(team => AppAPI.stats.team_movement_quality_details.post(null, { teamId: team.id, startDate, endDate })
            .then(stats => AppAPI.stats.team_movement_quality_details.post(null, { teamId: team.id, startDate: previousWeekStartDate, endDate: previousWeekEndDate })
                .then(previousWeekStats => AppAPI.preprocessing.status.post(null, { start_date: startDate, end_date: endDate })
                    .then(preprocessing => Promise.resolve({ teamId: team.id, stats, previousWeekStats, preprocessing: preprocessing.sessions }))
                    .catch(err => Promise.resolve({ teamId: team.id, stats, previousWeekStats, preprocessing: null }))
                )
                .catch(err => Promise.resolve({ teamId: team.id, stats, previousWeekStats: null, preprocessing: null }))
            )
            .catch(err => Promise.resolve({ teamId: team.id, stats: null, previousWeekStats: null, preprocessing: null }))
        ))
            .then(teamsStats => dispatch({
                type: Actions.GET_TEAM_STATS,
                data: { teamsStats, weekOffset: newWeekOffset, startDate, endDate, previousWeekStartDate, previousWeekEndDate, nextWeekStartDate, nextWeekEndDate }
            }));
    }
    return dispatch => Promise.all(teams.map(team => AppAPI.stats.team_movement_quality_details.post(null, { teamId: team.id, startDate: change === -1 ? previousWeekStartDate : startDate, endDate: change === -1 ? previousWeekEndDate : endDate })
        .then(stats => AppAPI.preprocessing.status.post(null, { start_date: startDate, end_date: endDate })
            .then(preprocessing => Promise.resolve({ teamId: team.id, stats: change === -1 ? null : stats, previousWeekStats: change === -1 ? stats : null, preprocessing: preprocessing.sessions }))
            .catch(err => Promise.resolve({ teamId: team.id, stats: change === -1 ? null : stats, previousWeekStats: change === -1 ? stats : null, preprocessing: null }))
        )
        .catch(err => Promise.resolve({ teamId: team.id, stats: null, previousWeekStats: null, preprocessing: null }))
    ))
        .then(teamsStats => dispatch({
            type: Actions.GET_TEAM_STATS,
            data: { teamsStats, weekOffset: newWeekOffset, startDate, endDate, previousWeekStartDate, previousWeekEndDate, nextWeekStartDate, nextWeekEndDate }
        }));
};

const startRequest = () => {
    return dispatch => Promise.resolve(dispatch({
        type: Actions.START_REQUEST,
    }));
};

const stopRequest = () => {
    return dispatch => Promise.resolve(dispatch({
        type: Actions.STOP_REQUEST,
    }));
};

const selectGraph = selectedGraphIndex => {
    return dispatch => Promise.resolve(dispatch({
        type: Actions.SELECT_GRAPH,
        selectedGraphIndex,
    }));
};

export default {
    checkAccountCode,
    clearUserData,
    createTrainingGroup,
    createUser,
    getAccessories,
    getTeams,
    getTeamStats,
    getTrainingGroups,
    getUser,
    patchTrainingGroup,
    removeTrainingGroup,
    removeUser,
    selectGraph,
    selectTrainingGroup,
    setStatsCategory,
    startRequest,
    startSession,
    stopRequest,
    stopSession,
    teamSelect,
    updateUser,
    userJoinAccount,
    userSelect,
};
