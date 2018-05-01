/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 03:55:41 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-30 00:23:40
 */

/**
 * User Reducer
 */

import { Actions } from '../constants/';

import Store from '../store/init';

const initialState = Store;

export default function initReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.LOGIN:
        return Object.assign({}, state, {
            email:    action.email,
            password: action.password,
            jwt:      action.jwt,
        });
    case Actions.SET_ENVIRONMENT:
        return Object.assign({}, state, {
            environment: action.environment
        });
    case Actions.LOGOUT:
        return Object.assign({}, initialState, {
            environment: state.environment
        });
        // return initialState;
    case Actions.SIGN_UP_SUCCESS:
    case Actions.FORGOT_PASSWORD_SUCCESS:
    default:
        return state;
    }
}
