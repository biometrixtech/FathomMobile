/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:20:59 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-10 01:33:49
 */

/**
 * Initial Base Actions
 */

import jwtDecode from 'jwt-decode';
import { Actions } from '../constants/';
import { AppAPI } from '../lib/';

// Components
import { Platform } from 'react-native';

// import third-party libraries
import DeviceInfo from 'react-native-device-info';
import uuidByString from 'uuid-by-string';

import { ErrorMessages } from '../constants/';

/**
  * Authorize User
  * - will get new token
  */
const authorizeUser = (authorization, user, userCreds) => {
    let session_token = authorization.session_token;
    let userId = user.id;
    return dispatch => AppAPI.authorize.post({ userId }, { session_token })
        .then(response => {
            let decodedToken;
            let token = response.authorization.jwt;
            try {
                decodedToken = jwtDecode(token);
            } catch (err) {
                return Promise.reject('Token decode failed.');
            }

            if (!decodedToken || !decodedToken.user_id) {
                return Promise.reject('Token decode failed.');
            }

            return Promise.resolve(response);
        })
        .catch(err => {
            dispatch({
                type: Actions.STOP_REQUEST
            })
            return Promise.reject(err);
        });
};

/**
  * Regsiter DeviceInfo
  * - IoT certificate check and save
  */
const registerDevice = () => {
    return dispatch => new Promise((resolve, reject) => {
        // register the device
        let uniqueId = DeviceInfo.getUniqueID();
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if(!uuidRegex.test(uniqueId)) {
            // not a uuid, lets unparse it
            uniqueId = uuidByString(uniqueId);
        }
        uniqueId = uniqueId.toLowerCase();
        const device_type = Platform.OS;

        return AppAPI.register_device.post({ device_uuid: uniqueId }, { device_type })
            .then(response => {
                dispatch({
                    type:        Actions.REGISTER_DEVICE,
                    certificate: response.certificate,
                });

                return resolve(response);
            })
            .catch(err => {
                if (err && err.message && err.message === ErrorMessages.deviceRegistered) {
                    return resolve();
                }
                console.log('err',err);
                dispatch({
                    type: Actions.STOP_REQUEST
                })
                return reject(err);
            });
    });
};

/**
  * Finalize Login
  * - universal login steps
  */
const finalizeLogin = (user, userCreds, token) => {
    return dispatch => new Promise((resolve, reject) => {
        dispatch({
            type:     Actions.LOGIN,
            email:    userCreds.Email,
            password: userCreds.Password,
            jwt:      token,
        });

        // Get user details from API, using my token
        dispatch({
            type: Actions.USER_REPLACE,
            data: user
        });
        dispatch({
            type: Actions.STOP_REQUEST
        });

        return resolve(user);
    });
};

/**
  * Start Login to API and receive Token
  */
const startLogin = (credentials, reload) => {
    return dispatch => new Promise((resolve, reject) => {
        const userCreds = credentials || null;
        dispatch({
            type: Actions.START_REQUEST,
        });

        // Get a new token from API or use the stored one
        return (reload ? Promise.resolve({ user: userCreds }) : AppAPI.getToken(userCreds))
            .then(response => {
                let decodedToken;
                let token = response && response.authorization ? response.authorization.jwt : null;
                try {
                    decodedToken = jwtDecode(token);
                } catch (err) {
                    return reject('Token decode failed.');
                }

                if (!decodedToken || !decodedToken.user_id) {
                    return reject('Token decode failed.');
                }

                // we need to add this here incase we make a call and need jwt in the header
                dispatch({
                    type:     Actions.LOGIN,
                    email:    userCreds.Email,
                    password: userCreds.Password,
                    jwt:      token,
                });

                return resolve(response);
            }).catch(err => {
                dispatch({
                    type: Actions.STOP_REQUEST,
                });
                return reject(err);
            });
    });
};

/**
  * Logout
  */
const logout = () => {
    return dispatch => Promise.resolve(dispatch({
        type: Actions.LOGOUT
    }));
};

/**
  * POST Forgot Password Email
  */
const forgotPassword = (email) => {
    return dispatch => AppAPI.forgotPassword.post(email)
        .then(result => {
            dispatch({
                type: Actions.FORGOT_PASSWORD_SUCCESS,
                data: result,
            });
            return result;
        })
        .catch(err => {
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
        .then(result => {
            dispatch({
                type: Actions.SIGN_UP_SUCCESS,
                data: result,
            });
            return result;
        })
        .catch(err => {
            dispatch({
                type: Actions.SIGN_UP_FAILED,
            });
            return err;
        });
};

/**
 *
 * @param {new environment to be used} environment
 */
const setEnvironment = (environment) => {
    return dispatch => dispatch({
        type: Actions.SET_ENVIRONMENT,
        environment
    });
};


export default {
    forgotPassword,
    registerDevice,
    authorizeUser,
    startLogin,
    finalizeLogin,
    logout,
    setEnvironment,
    signUp,
};