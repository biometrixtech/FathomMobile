/**
 * User Actions
 */

import jwtDecode from 'jwt-decode';

import AppAPI from '@lib/api';

const Actions = require('../actionTypes');

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

                if (!decodedToken || !decodedToken.role || !decodedToken.user_id) {
                    return reject('Token decode failed.');
                }

                // TODO: auth check on authorized account role

                // Get user details from API, using my token
                return AppAPI.user.get()
                    .then(userData => {
                        delete response.user;
                        let storedObject = {
                            ...userData,
                            ...response
                        };
                        return dispatch({
                            type: Actions.USER_REPLACE,
                            data: storedObject,
                        });
                    })
                    .then(() => AppAPI.teams.get())
                    .then(teams => dispatch({
                        type: Actions.GET_TEAMS,
                        data: teams
                    }))
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
    return dispatch => AppAPI.training_groups.post(trainingGroup)
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

const getTeams = () => {
    return dispatch => AppAPI.teams.get()
        .then(teams => dispatch({
            type: Actions.GET_TEAMS,
            data: teams
        }));
};

const getAccessories = () => {
    return dispatch => AppAPI.accessories.get()
        .then(accessories => dispatch({
            type: Actions.GET_ACCESSORIES,
            data: accessories
        }));
}

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
    getAccessories
};
