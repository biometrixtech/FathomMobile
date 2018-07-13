/*
 * @Author: Vir Desai 
 * @Date: 2018-07-13 02:44:48 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-13 10:26:27
 */

/**
 * MyPlan Reducer
 */

import { Actions } from '../constants/';

import Store from '../store/plan';

const initialState = Store;

export default function planReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.GET_SORE_BODY_PARTS:
        return Object.assign({}, state, {
            soreBodyParts: action.data.body_parts,
        });
    case Actions.GET_MY_PLAN:
        return Object.assign({}, state, {
            dailyPlan: action.data.daily_plans,
        });
    case Actions.POST_READINESS_SURVEY:
        return Object.assign({}, state, {});
    default:
        return state;
    }
}