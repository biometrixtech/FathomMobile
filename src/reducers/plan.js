/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 09:00:00
 * @Last Modified by: Mazen Chami
 * @Last Modified time: 2018-07-12 09:00:00
 */

/**
 * My Plan Reducer
 */

import { Actions } from '../constants/';

import Store from '../store/plan';

const initialState = Store;

export default function userReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.ATHLETE_SEASON_SUCCESS:
        return  Object.assign({}, state, {
            ...action.data,
        });
    case Actions.ATHLETE_SEASON_FAILED:
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