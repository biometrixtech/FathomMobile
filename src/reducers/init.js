/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 03:55:41
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-17 18:01:19
 */

/**
 * User Reducer
 */

import { Actions } from '@constants';

import Store from '@store/init';

const initialState = Store;

export default function initReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.LOGIN:
        return Object.assign({}, state, {
            email:    action.email,
            password: action.password,
            jwt:      action.jwt,
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