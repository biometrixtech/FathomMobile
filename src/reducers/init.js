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
    case Actions.UPDATE_CURRENT_TAB:
        return Object.assign({}, state, {
            currentSelectedTab: action.tab,
        });
    case Actions.UPDATE_SCHEDULED_MAINTENANCE:
        return Object.assign({}, state, {
            scheduledMaintenance: {
                addressed:  action.data.addressed,
                end_date:   action.data.end_date,
                start_date: action.data.start_date,
            },
        });
    case Actions.LOGIN:
        return Object.assign({}, state, {
            email:         action.email || state.email,
            password:      action.password || state.password,
            jwt:           action.jwt || state.jwt,
            session_token: action.session_token || state.session_token,
            expires:       action.expires || state.expires,
        });
    case Actions.GET_MY_PLAN: // double reducer for editing 2 stores
        return Object.assign({}, state, {
            notification: false, // so we can receive notifications when the app is active too
        });
    case Actions.NOTIFICATION_RECEIVED:
        return Object.assign({}, state, {
            notification: action.data || false,
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
    case Actions.SET_ACCOUNT_CODE:
        return Object.assign({}, state, {
            account_code: action.code || '',
            account_role: action.role || 'athlete',
        });
    case Actions.LOGOUT:
        return Object.assign({}, initialState, {
            token: state.token,
        });
    case Actions.SIGN_UP_SUCCESS:
    case Actions.SIGN_UP_FAILURE:
    case Actions.FORGOT_PASSWORD_SUCCESS:
        return Object.assign({}, state, {
            email: action.emailAddress.email || state.email,
        });
    case Actions.FORGOT_PASSWORD_FAILURE:
    case Actions.RESET_PASSWORD_SUCCESS:
    case Actions.RESET_PASSWORD_FAILURE:
    default:
        return state;
    }
}