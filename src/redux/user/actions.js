/**
 * User Actions
 */

import jwtDecode from 'jwt-decode';

import AppAPI from '@lib/api';

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

              dispatch({
                  type: 'LOGIN_SUCCESS',
                  data: decodedToken,
              });

              return resolve(decodedToken);

              // Get user details from API, using my token
              // return AppAPI.users.get(decodedToken.data.user.id)
              //   .then((userData) => {
              //       dispatch({
              //           type: 'USER_REPLACE',
              //           data: userData,
              //       });
              //
              //       return resolve(userData);
              //   }).catch(err => reject(err));
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
              type: 'USER_REPLACE',
              data: {},
          });
      });
}

/**
  * Get My User Data
  */
export function getMe() {
    return dispatch => AppAPI.me.get()
      .then((userData) => {
          dispatch({
              type: 'USER_REPLACE',
              data: userData,
          });

          return userData;
      });
}

/**
  * Update My User Data
  * - Receives complete user data in return
  */
export function updateMe(payload) {
    return dispatch => AppAPI.me.post(payload)
      .then((userData) => {
          dispatch({
              type: 'USER_REPLACE',
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
                type: 'FORGOT_PASSWORD_SUCCESS',
                data: result,
            });
            return result;
        })
        .catch((err) => {
            dispatch({
                type: 'FORGOT_PASSWORD_FAILED',
            });
            return err;
        });
}

/**
  * POST SignUp form data
  */
export function signUp(credentials) {
    return dispatch => AppAPI.signUp.post(credentials)
        .then((result) => {
            dispatch({
                type: 'SIGN_UP_SUCCESS',
                data: result,
            });
            return result;
        })
        .catch((err) => {
            dispatch({
                type: 'SIGN_UP_FAILED',
            });
            return err;
        });
}
