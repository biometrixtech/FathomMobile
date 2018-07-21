/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 03:55:33 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:11:00
 */

/**
 * User Reducer
 */

import { Actions } from '../constants';

import Store from '../store/user';

const initialState = Store;

export default function userReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.USER_REPLACE:
        return  Object.assign({}, state, {
            ...action.data,
        });
    case Actions.LOGOUT:
        return initialState;
    case Actions.START_REQUEST:
        return Object.assign({}, state, {
            loading: true
        });
    case Actions.STOP_REQUEST:
        return Object.assign({}, state, {
            loading: false
        });
    default:
        return state;
    }
}