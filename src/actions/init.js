/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:20:59
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-28 18:41:57
 */

/**
 * Initial Base Actions
 */

import jwtDecode from 'jwt-decode';
import { Actions, ErrorMessages } from '../constants';
import { AppAPI, AppUtil } from '../lib';
import { store } from '../store';

// Components
import { Platform } from 'react-native';

// import third-party libraries
import moment from 'moment';

/**
  * Ping Maintenance API
  * - to know of upcoming, current, and future maintenance windows
  */
const getMaintenanceWindow = (updateReducer) => {
    return AppAPI.maintenance_status.get()
        .then(response => {
            if(updateReducer) {
                let currentState = store.getState();
                let scheduledMaintenance = currentState.init.scheduledMaintenance;
                let isNewWindow = (
                    response.maintenance_windows[0] &&
                    moment(scheduledMaintenance.end_date).isSame(moment(response.maintenance_windows[0].end_date)) &&
                    moment(scheduledMaintenance.start_date).isSame(moment(response.maintenance_windows[0].start_date))
                ) ?
                    false
                    :
                    true;
                let addressedFlag = isNewWindow ? false : true;
                let endDate = response.maintenance_windows[0] ? response.maintenance_windows[0].end_date : null;
                let startDate = response.maintenance_windows[0] ? response.maintenance_windows[0].start_date : null;
                store.dispatch({
                    type: Actions.UPDATE_SCHEDULED_MAINTENANCE,
                    data: {
                        addressed:  addressedFlag,
                        end_date:   endDate,
                        start_date: startDate,
                    }
                });
            }
            return Promise.resolve(response);
        })
        .catch(error => Promise.reject(error));
};

/**
  * Authorize User
  * - will get new token
  */
const authorizeUser = (authorization, user, userCreds) => {
    let session_token = authorization.session_token;
    let userId = user.id;
    let formattedTimezone = AppUtil.getFormattedTimezoneString();
    return dispatch => AppAPI.authorize.post({ userId }, { session_token, timezone: formattedTimezone })
        .then(response => {
            let decodedToken;
            let token = response.authorization.jwt;
            try {
                decodedToken = jwtDecode(token);
            } catch (err) {
                return Promise.reject('Token decode failed.');
            }

            if (!decodedToken || !decodedToken.sub) {
                return Promise.reject('Token decode failed.');
            }

            dispatch({
                type:          Actions.LOGIN,
                email:         userCreds.Email,
                password:      userCreds.Password,
                jwt:           response.authorization.jwt,
                session_token: session_token,
                expires:       response.authorization.expires,
            });

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
const registerDevice = (certificate, device, user) => {
    return dispatch => new Promise((resolve, reject) => {
        let uniqueId = AppUtil.getDeviceUUID();
        let device_type = Platform.OS;
        let currentState = store.getState();
        let push_notifications = currentState.init.token ? {
            token:   currentState.init.token,
            enabled: true,
        } : null;
        let bodyObj = { device_type };
        if (push_notifications) {
            bodyObj.push_notifications = push_notifications;
        }
        if(certificate && certificate.id && device) {
            bodyObj.owner_id = user.id;
            return AppAPI.register_device.patch({ device_uuid: uniqueId }, bodyObj)
                .then(response => {
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
        }
        return AppAPI.register_device.post({ device_uuid: uniqueId }, bodyObj)
            .then(response => {
                dispatch({
                    type:        Actions.REGISTER_DEVICE,
                    certificate: response.certificate,
                    device:      response.device,
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
const finalizeLogin = (user, userCreds, authorization) => {
    return dispatch => new Promise((resolve, reject) => {
        dispatch({
            type:          Actions.LOGIN,
            email:         userCreds.Email,
            password:      userCreds.Password,
            jwt:           authorization.jwt,
            session_token: authorization.session_token,
            expires:       authorization.expires,
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

                if (!decodedToken || !decodedToken.sub) {
                    return reject('Token decode failed.');
                }

                // we need to add this here incase we make a call and need jwt in the header
                dispatch({
                    type:     Actions.LOGIN,
                    email:    userCreds.email,
                    password: userCreds.password,
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
const logout = user_id => {
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.logout.post({ user_id })
            .then(() => {
                return resolve(
                    dispatch({
                        type: Actions.LOGOUT
                    })
                );
            })
            .catch(err => {
                console.log('err',err);
                // return reject(err);
                return resolve(
                    dispatch({
                        type: Actions.LOGOUT
                    })
                );
            });
    });
};

/**
  * POST Forgot Password Email
  */
const forgotPassword = (email) => {
    return dispatch => AppAPI.forgot_password.post(false, { personal_data: email })
        .then(result => {
            dispatch({
                type:         Actions.FORGOT_PASSWORD_SUCCESS,
                data:         result,
                emailAddress: email,
            });
            return Promise.resolve(result);
        })
        .catch(err => {
            dispatch({
                type:         Actions.FORGOT_PASSWORD_FAILED,
                data:         err,
                emailAddress: email,
            });
            console.log('error', err)
            return Promise.reject(err);
        });
};

/**
  * POST Reset Password form data
  */
const resetPassword = dataObj => {
    let payload = { personal_data: {email: dataObj.email}, confirmation_code: dataObj.confirmation_code, password: dataObj.password };
    return dispatch => AppAPI.reset_password.post(false,  payload)
        .then(result => {
            dispatch({
                type: Actions.RESET_PASSWORD_SUCCESS,
                data: result,
            });
            return Promise.resolve(result);
        })
        .catch(err => {
            dispatch({
                type: Actions.RESET_PASSWORD_FAILED,
                data: err,
            });
            console.log('error', err)
            return Promise.reject(err);
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
    return dispatch => Promise.resolve(dispatch({
        type: Actions.SET_ENVIRONMENT,
        environment
    }));
};

/**
 *
 * @param {push notification token for device} token
 */
const sendDeviceToken = (token) => {
    return dispatch => Promise.resolve(dispatch({
        type: Actions.SEND_DEVICE_TOKEN,
        token
    }));
};

export default {
    forgotPassword,
    resetPassword,
    getMaintenanceWindow,
    registerDevice,
    authorizeUser,
    startLogin,
    finalizeLogin,
    logout,
    sendDeviceToken,
    setEnvironment,
    signUp,
};