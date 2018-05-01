/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:20:59 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-30 13:00:05
 */

/**
 * Initial Base Actions
 */

import jwtDecode from 'jwt-decode';
import { Actions } from '../constants/';
import { AppAPI } from '../lib/';

/**
  * Login to API and receive Token
  */
const login = (credentials, reload) => {
    return dispatch => new Promise(async (resolve, reject) => {
        const userCreds = credentials || null;
        dispatch({
            type: Actions.START_REQUEST,
        });

        // Get a new token from API
        return (reload ? Promise.resolve({ user: userCreds }) : AppAPI.getToken(userCreds))
            .then(response => {
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

                dispatch({
                    type:     Actions.LOGIN,
                    email:    userCreds.email,
                    password: userCreds.password,
                    jwt:      token,
                });

                // TODO: auth check on authorized account role

                // Get user details from API, using my token
                let user = response.user;
                return AppAPI.user.get()
                    .then(userData => {
                        delete response.user;
                        let storedObject = {
                            ...userData,
                            ...response,
                            jwt:      token,
                            password: userCreds.password
                        };
                        // return Promise.resolve(dispatch({
                        //     type: Actions.USER_REPLACE,
                        //     data: storedObject,
                        // }));
                        return Promise.resolve(dispatch({
                            type:     Actions.LOGIN,
                            email:    userCreds.email,
                            password: userCreds.password,
                            jwt:      token,
                        }))
                            .then(() => {
                                // dispatch({
                                //     type:     Actions.LOGIN,
                                //     email:    userCreds.email,
                                //     password: userCreds.password,
                                //     jwt:      token,
                                // });
                                return dispatch({
                                    type: Actions.USER_REPLACE,
                                    data: storedObject,
                                });
                            });
                    })
                    .then(() => AppAPI.teams.get())
                    .then(teams => {
                        dispatch({
                            type: Actions.STOP_REQUEST,
                        });
                        return dispatch({
                            type: Actions.GET_TEAMS,
                            data: teams
                        });
                    })
                    .then(() => resolve(user))
                    .catch(err => reject(err));
            }).catch(err => reject(err));
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
    login,
    logout,
    forgotPassword,
    signUp,
    setEnvironment,
};