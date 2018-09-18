/*
 * @Author: Vir Desai
 * @Date: 2018-07-13 02:44:48
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:44:28
 */

/**
 * MyPlan Reducer
 */

import { Actions } from '../constants';

import Store from '../store/plan';

const initialState = Store;

export default function planReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.CLEAR_COMPLETED_EXERCISES:
        return Object.assign({}, state, {
            completedExercises: [],
        });
    case Actions.SET_COMPLETED_EXERCISES:
        return Object.assign({}, state, {
            completedExercises: action.data,
        });
    case Actions.GET_SORE_BODY_PARTS:
        return Object.assign({}, state, {
            soreBodyParts: action.data,
        });
    case Actions.GET_MY_PLAN:
        return Object.assign({}, state, {
            dailyPlan: action.data.daily_plans,
        });
    case Actions.CLEAR_MY_PLAN:
        return Object.assign({}, state, {
            completedExercises: [],
            dailyPlan:          [],
            postSession:        {},
            soreBodyParts:      {},
        });
    case Actions.SET_TYPICAL_SESSIONS:
        return Object.assign({}, state, {
            typicalSessions: action.data,
        });
    case Actions.POST_READINESS_SURVEY:
        return Object.assign({}, state, {});
    case Actions.POST_SESSION_SURVEY:
        return Object.assign({}, state, {});
    default:
        return state;
    }
}