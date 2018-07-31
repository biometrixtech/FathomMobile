/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 03:55:41
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-28 18:48:10
 */

/**
 * User Reducer
 */

import { Actions } from '../constants';

import Store from '../store/init';

const initialState = Store;

export default function initReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.APP_LOADED:
        return Object.assign({}, state, {
            lastOpened: (new Date()).toLocaleDateString(),
        });
    case Actions.LOGIN:
        return Object.assign({}, state, {
            email:    action.email,
            password: action.password,
            jwt:      action.jwt,
        });
    case Actions.GET_MY_PLAN: // double reducer for editing 2 stores
        return Object.assign({}, state, {
            notification: false, // so we can receive notifications when the app is active too
        });
    case Actions.NOTIFICATION_RECEIVED:
        return Object.assign({}, state, {
            notification: true,
        });
    case Actions.NOTIFICATION_ADDRESSED:
        return Object.assign({}, state, {
            notification: false,
        });
    case Actions.REGISTER_DEVICE:
        return Object.assign({}, state, {
            certificate: action.certificate,
            device:      action.device,
        });
    case Actions.SEND_DEVICE_TOKEN:
        return Object.assign({}, state, {
            token: action.token,
        });
    case Actions.SET_ENVIRONMENT:
        return Object.assign({}, state, {
            environment: action.environment
        });
    case Actions.LOGOUT:
        return Object.assign({}, initialState, {
            certificate: state.certificate,
            device:      state.device,
            environment: state.environment,
        });
    case Actions.SIGN_UP_SUCCESS:
    case Actions.SIGN_UP_FAILURE:
    case Actions.FORGOT_PASSWORD_SUCCESS:
    case Actions.FORGOT_PASSWORD_FAILURE:
    default:
        return state;
    }
}