/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 03:55:41 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:44:25
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
        });
    case Actions.SET_ENVIRONMENT:
        return Object.assign({}, state, {
            environment: action.environment
        });
    case Actions.LOGOUT:
        return Object.assign({}, initialState, {
            environment: state.environment,
            certificate: state.certificate,
        });
    case Actions.SIGN_UP_SUCCESS:
    case Actions.SIGN_UP_FAILURE:
    case Actions.FORGOT_PASSWORD_SUCCESS:
    case Actions.FORGOT_PASSWORD_FAILURE:
    default:
        return state;
    }
}