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

import moment from 'moment';

export default function planReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.CLEAR_COMPLETED_EXERCISES:
        return Object.assign({}, state, {
            completedExercises: {},
        });
    case Actions.CLEAR_COMPLETED_COOL_DOWN_EXERCISES:
        return Object.assign({}, state, {
            completedCoolDownExercises: [],
        });
    case Actions.SET_COMPLETED_EXERCISES:
        return Object.assign({}, state, {
            completedExercises: action.data,
        });
    case Actions.SET_COMPLETED_COOL_DOWN_EXERCISES:
        return Object.assign({}, state, {
            completedCoolDownExercises: action.data,
        });
    case Actions.CLEAR_COMPLETED_FS_EXERCISES:
        return Object.assign({}, state, {
            completedFSExercises: [],
        });
    case Actions.SET_COMPLETED_FS_EXERCISES:
        return Object.assign({}, state, {
            completedFSExercises: action.data,
        });
    case Actions.GET_SORE_BODY_PARTS:
        return Object.assign({}, state, {
            soreBodyParts: action.data,
        });
    case Actions.GET_MY_PLAN:
        return Object.assign({}, state, {
            dailyPlan: action.data,
        });
    case Actions.GET_COACHES_DASHBOARD:
        return Object.assign({}, state, {
            coachesDashboardData: action.data,
        });
    case Actions.CLEAR_MY_PLAN:
        return initialState;
    case Actions.SET_TYPICAL_SESSIONS:
        return Object.assign({}, state, {
            typicalSessions: action.data,
        });
    case Actions.SET_ACTIVE_REST_GOALS:
        return Object.assign({}, state, {
            activeRestGoals: action.data,
        });
    case Actions.SET_COOL_DOWN_GOALS:
        return Object.assign({}, state, {
            coolDownGoals: action.data,
        });
    case Actions.SET_WARM_UP_GOALS:
        return Object.assign({}, state, {
            warmUpGoals: action.data,
        });
    case Actions.SET_HEALTH_DATA:
        return Object.assign({}, state, {
            healthData: {
                ignoredWorkouts: action.ignoredWorkoutData || [],
                sleep:           action.sleepData || [],
                workouts:        action.workoutData || [],
            },
        });
    case Actions.POST_READINESS_SURVEY:
        return Object.assign({}, state, {
            activeRestGoals: action.activeRestGoals,
            coolDownGoals:   action.coolDownGoals,
            dailyPlan:       action.data,
            warmUpGoals:     action.warmUpGoals,
        });
    case Actions.POST_SESSION_SURVEY:
        return Object.assign({}, state, {
            activeRestGoals: action.activeRestGoals,
            coolDownGoals:   action.coolDownGoals,
            dailyPlan:       action.data,
            warmUpGoals:     action.warmUpGoals,
        });
    case Actions.TOGGLE_COOL_DOWN_GOAL:
        return Object.assign({}, state, {
            coolDownGoals: action.coolDownGoals,
        });
    case Actions.TOGGLE_ACTIVE_REST_GOAL:
        return Object.assign({}, state, {
            activeRestGoals: action.activeRestGoals,
        });
    case Actions.TOGGLE_WARM_UP_GOAL:
        return Object.assign({}, state, {
            warmUpGoals: action.warmUpGoals,
        });
    case Actions.UPDATE_LAST_OPENED:
        return Object.assign({}, state, {
            lastOpened: {
                date:   action.date || state.lastOpened.date || moment().format(),
                userId: action.userId || state.lastOpened.userId,
            },
        });
    default:
        return state;
    }
}