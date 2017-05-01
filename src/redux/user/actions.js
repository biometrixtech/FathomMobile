/**
 * User Actions
 */

import jwtDecode from 'jwt-decode';

import AppAPI from '@lib/api';

const Actions = require('../actionTypes');

/**
  * Login to API and receive Token
  */
export function login(credentials, freshLogin) {
    return dispatch => new Promise(async (resolve, reject) => {
        const userCreds = credentials || null;

        // Force logout, before logging in
        if (freshLogin && AppAPI.deleteToken) { await AppAPI.deleteToken(); }

        if (!AppAPI.getToken) { return resolve(); }

        // Get a new token from API
        return AppAPI.getToken(userCreds)
          .then((token) => {
              let decodedToken = '';

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
                  .then((userData) => {
                      dispatch({
                          type: Actions.USER_REPLACE,
                          data: userData,
                      });

                      return resolve(userData);
                  })
                //   .then(() => AppAPI.training_group.get()
                //   .then((trainingGroups) => {
                //       dispatch({
                //           type: Actions.GET_TRAINING_GROUPS,
                //           data: trainingGroups,
                //       });

                //       return resolve(trainingGroups);
                //   }))
                  .catch(err => reject(err));
          }).catch(err => reject(err));
    });
}

/**
  * Logout
  */
export function logout() {
    return dispatch => AppAPI.deleteToken()
      .then(() => {
          dispatch({
              type: Actions.USER_REPLACE,
              data: {},
          });
      });
}

/**
  * Get My User Data
  */
export function getUser() {
    return dispatch => AppAPI.user.get()
      .then((userData) => {
          dispatch({
              type: Actions.USER_REPLACE,
              data: userData,
          });

          return userData;
      });
}

/**
  * Update My User Data
  * - Receives complete user data in return
  */
export function updateUser(payload) {
    return dispatch => AppAPI.user.patch(payload)
      .then((userData) => {
          dispatch({
              type: Actions.USER_REPLACE,
              data: userData,
          });

          return userData;
      });
}

/**
  * POST Forgot Password Email
  */
export function forgotPassword(email) {
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
}

/**
  * POST SignUp form data
  */
export function signUp(credentials) {
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
}

/**
 * GET Training Groups
 */
export function getTrainingGroups() {
    return dispatch => AppAPI.training_group.get()
        .then((trainingGroups) => {
            dispatch({
                type: Actions.GET_TRAINING_GROUPS,
                data: trainingGroups,
            });
            return trainingGroups;
        });
}

/**
 * Remove Training Group
 */
export function removeTrainingGroup() {
    return dispatch => AppAPI.training_group.patch()
        .then((trainingGroups) => {
            dispatch({
                type: Actions.UPDATE_TRAINING_GROUPS,
                data: trainingGroups,
            });
        });
}

/**
 * Remove Regimen Type
 */
export function removeRegimen() {
    return dispatch => AppAPI.regimen.patch()
        .then((regimens) => {
            dispatch({
                type: Actions.UPDATE_REGIMEN,
                data: regimens,
            });
        });
}

export function addTG(data) {
    return dispatch => dispatch({
        type: Actions.ADD_TG,
        data,
    });
}

export function editTG(data) {
    return dispatch => dispatch({
        type: Actions.EDIT_TG,
        data,
    });
}

export function removeTG(id) {
    return dispatch => dispatch({
        type: Actions.REMOVE_TG,
        data: id,
    });
}

export function addR(data) {
    return dispatch => dispatch({
        type: Actions.ADD_R,
        data,
    });
}

export function editR(data) {
    return dispatch => dispatch({
        type: Actions.EDIT_R,
        data,
    });
}

export function removeR(id) {
    return dispatch => dispatch({
        type: Actions.REMOVE_R,
        data: id,
    });
}

export function addA(data) {
    return dispatch => dispatch({
        type: Actions.ADD_A,
        data,
    });
}

export function removeA(data) {
    return dispatch => dispatch({
        type: Actions.REMOVE_A,
        data,
    });
}
