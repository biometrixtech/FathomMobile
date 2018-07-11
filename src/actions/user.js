/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:20:59 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 18:54:59
 */

/**
 * User Actions
 */

import { Actions } from '../constants/';
import { AppAPI, AppUtil } from '../lib/';

/**
  * Get My User Data
  */
const getUser = () => {
    return dispatch => AppAPI.user.get()
        .then((userData) => {
            dispatch({
                type: Actions.USER_REPLACE,
                data: userData,
            });

            return userData;
        });
};

/**
  * Update My User Data
  * - Receives complete user data in return
  */
const updateUser = (payload) => {
    return dispatch => AppAPI.user.patch(payload)
        .then((userData) => {
            dispatch({
                type: Actions.USER_REPLACE,
                data: userData,
            });

            return userData;
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
const createTrainingGroup = (trainingGroup) => {
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
const patchTrainingGroup = (trainingGroup) => {
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
const removeTrainingGroup = (trainingGroupId) => {
    return dispatch => AppAPI.training_groups.delete(trainingGroupId)
        .then(() => dispatch({
            type: Actions.REMOVE_TRAINING_GROUP,
            data: trainingGroupId,
        }));
};

const teamSelect = (index) => {
    return dispatch => dispatch({
        type: Actions.TEAM_SELECT,
        index
    });
};

const userSelect = (index) => {
    return dispatch => dispatch({
        type: Actions.USER_SELECT,
        index
    });
}

const selectTrainingGroup = (trainingGroup) => {
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

const startSession = (accessoryId) => {
    return dispatch => AppAPI.start_session.post({ accessoryId }, { capture_mode: 'log' })
        .then(() => AppAPI.accessories.get())
        .then(accessories => dispatch({
            type: Actions.GET_ACCESSORIES,
            data: accessories
        }))
        .catch(err => Promise.reject(err));
};

const stopSession = (accessoryId) => {
    return dispatch => AppAPI.stop_session.post({ accessoryId })
        .then(() => AppAPI.accessories.get())
        .then(accessories => dispatch({
            type: Actions.GET_ACCESSORIES,
            data: accessories
        }))
        .catch(err => Promise.reject(err));
};

const getStartAndEndDate = (weekOffset) => {
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

const selectGraph = (selectedGraphIndex) => {
    return dispatch => Promise.resolve(dispatch({
        type: Actions.SELECT_GRAPH,
        selectedGraphIndex,
    }));
};

export default {
    getUser,
    updateUser,
    getTrainingGroups,
    createTrainingGroup,
    patchTrainingGroup,
    removeTrainingGroup,
    teamSelect,
    userSelect,
    selectTrainingGroup,
    removeUser,
    startSession,
    stopSession,
    getTeams,
    getAccessories,
    getTeamStats,
    setStatsCategory,
    startRequest,
    stopRequest,
    selectGraph,
};