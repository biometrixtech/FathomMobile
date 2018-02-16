/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:20:59 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-02-13 13:06:09
 */

/**
 * User Actions
 */

import jwtDecode from 'jwt-decode';

import { AppAPI } from '@lib/';

const Actions = require('../actionTypes');

const DAY_IN_MS = 86400000;

/**
  * Login to API and receive Token
  */
const login = (credentials, freshLogin) => {
    return dispatch => new Promise(async (resolve, reject) => {
        const userCreds = credentials || null;

        // Force logout, before logging in
        if (freshLogin && AppAPI.deleteToken) { await AppAPI.deleteToken(); }

        if (!AppAPI.getToken) { return resolve(); }

        // Get a new token from API
        return AppAPI.getToken(userCreds)
            .then((response) => {
                let decodedToken = '';
                let token = response.user.jwt;

                try {
                    decodedToken = jwtDecode(token);
                } catch (err) {
                    return reject('Token decode failed.');
                }

                if (!decodedToken || !decodedToken.user_id) {
                    return reject('Token decode failed.');
                }

                // TODO: auth check on authorized account role

                // Get user details from API, using my token
                return AppAPI.user.get()
                    .then(userData => {
                        delete response.user;
                        let storedObject = {
                            ...userData,
                            ...response,
                            password: userCreds.password
                        };
                        return dispatch({
                            type: Actions.USER_REPLACE,
                            data: storedObject,
                        });
                    })
                    .then(() => AppAPI.teams.get())
                    .then(teams => {
                        return dispatch({
                            type: Actions.GET_TEAMS,
                            data: teams
                        });
                    })
                    .then(() => AppAPI.accessories.get())
                    .then(accessories => dispatch({
                        type: Actions.GET_ACCESSORIES,
                        data: accessories
                    }))
                    .then(() => resolve())
                    .catch(err => reject(err));
            }).catch(err => reject(err));
    });
};

/**
  * Logout
  */
const logout = () => {
    return dispatch => AppAPI.deleteToken()
        .then(() => {
            dispatch({
                type: Actions.USER_REPLACE,
                data: {},
            });
        });
};

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
  * POST Forgot Password Email
  */
const forgotPassword = (email) => {
    return dispatch => AppAPI.forgotPassword.post(email)
        .then((result) => {
            dispatch({
                type: Actions.FORGOT_PASSWORD_SUCCESS,
                data: result,
            });
            return result;
        })
        .catch((err) => {
            dispatch({
                type: Actions.FORGOT_PASSWORD_FAILED,
            });
            return err;
        });
};

/**
  * POST SignUp form data
  */
const signUp = (credentials) => {
    return dispatch => AppAPI.user.post(credentials)
        .then((result) => {
            dispatch({
                type: Actions.SIGN_UP_SUCCESS,
                data: result,
            });
            return result;
        })
        .catch((err) => {
            dispatch({
                type: Actions.SIGN_UP_FAILED,
            });
            return err;
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
        data: index
    });
};

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

const formatDate = (date) => `${date < 10 ? '0' : ''}${date}`;

const getTeams = () => {
    let tempTeams = [];
    let todaysDate = new Date();
    let dayOfWeek = todaysDate.getDay();
    let startOfWeekOffset = dayOfWeek === 1 ? 0 : (dayOfWeek+6)%7;
    let endOfWeekOffset = !dayOfWeek ? 0 : 7-dayOfWeek;
    let startDateObject = new Date(todaysDate.getTime() - startOfWeekOffset * DAY_IN_MS);
    let endDateObject = new Date(todaysDate.getTime() + endOfWeekOffset * DAY_IN_MS);
    let startDate = `${startDateObject.getFullYear()}-${formatDate(startDateObject.getMonth()+1)}-${formatDate(startDateObject.getDate())}`;
    let endDate = `${endDateObject.getFullYear()}-${formatDate(endDateObject.getMonth()+1)}-${formatDate(endDateObject.getDate())}`;
    return dispatch => AppAPI.teams.get()
        .then(teams => {
            tempTeams = teams.teams.map(team => team.id);
            return dispatch({
                type: Actions.GET_TEAMS,
                data: teams
            });
        })
        .then(() => Promise.all(tempTeams.map((teamId) => AppAPI.stats.team_movement_quality_details.post(null, { teamId, startDate, endDate })
            .then(stats => dispatch({
                type: Actions.GET_TEAM_STATS,
                data: { teamId, stats, weekOffset: 0, startDate, endDate }
            }))
            .catch(err => dispatch({
                type: Actions.GET_TEAM_STATS,
                data: { teamId, stats: null, weekOffset: 0, startDate, endDate }
            }))
        )));
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

const getTeamStats = (teamId, weekOffset) => {
    let date = new Date();
    date.setTime(date.getTime() + weekOffset * 7 * DAY_IN_MS);
    let dayOfWeek = date.getDay();
    let startOfWeekOffset = dayOfWeek === 1 ? 0 : (dayOfWeek+6)%7;
    let endOfWeekOffset = !dayOfWeek ? 0 : 7-dayOfWeek;
    let startDateObject = new Date(date.getTime() - startOfWeekOffset * DAY_IN_MS);
    let endDateObject = new Date(date.getTime() + endOfWeekOffset * DAY_IN_MS);
    let startDate = `${startDateObject.getFullYear()}-${formatDate(startDateObject.getMonth()+1)}-${formatDate(startDateObject.getDate())}`;
    let endDate = `${endDateObject.getFullYear()}-${formatDate(endDateObject.getMonth()+1)}-${formatDate(endDateObject.getDate())}`;
    return dispatch => AppAPI.stats.team_movement_quality_details.post(null, { teamId, startDate, endDate })
        .then(stats => {
            return dispatch({
                type: Actions.GET_TEAM_STATS,
                data: { teamId, stats, weekOffset, startDate, endDate }
            });
        })
        .catch(err => dispatch({
            type: Actions.GET_TEAM_STATS,
            data: { teamId, stats: null, weekOffset, startDate, endDate }
        }));
};

export {
    login,
    logout,
    getUser,
    updateUser,
    forgotPassword,
    signUp,
    getTrainingGroups,
    createTrainingGroup,
    patchTrainingGroup,
    removeTrainingGroup,
    teamSelect,
    selectTrainingGroup,
    removeUser,
    startSession,
    stopSession,
    getTeams,
    getAccessories,
    getTeamStats,
    setStatsCategory
};
