/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 11:06:00
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-30 17:30:55
 */

/**
 * MyPlan Actions
 */

import { Actions } from '../constants';
import { store } from '../store';
import { AppAPI, } from '../lib';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

/**
  * Get My Plan Data
  */
const getMyPlan = (userId, startDate, endDate, clearMyPlan = false) => {
    if(clearMyPlan) {
        // clear MyPlan to default plan
        store.dispatch({
            type: Actions.CLEAR_MY_PLAN,
        });
    }
    // update last opened flag
    store.dispatch({
        type:   Actions.UPDATE_LAST_OPENED,
        userId: userId,
        date:   moment().format(),
    });
    // continue logic
    let currentState = store.getState();
    let myPlanObj = {};
    // Defaulting user id to whatever is in the store if nothing is sent for Push Notifications
    myPlanObj.user_id = userId || currentState.user.id;
    myPlanObj.start_date = startDate ? startDate : moment().format('YYYY-MM-DD');
    if(endDate) {
        myPlanObj.end_date = endDate;
    }
    myPlanObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    return dispatch => AppAPI.get_my_plan.post(false, myPlanObj)
        .then(myPlanData => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData,
            });
            return Promise.resolve(myPlanData);
        }).catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Clear My Plan Data
  */
const clearMyPlanData = () => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.CLEAR_MY_PLAN
        })
    );
};

/**
  * Clear Completed Exercises
  */
const clearCompletedExercises = () => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.CLEAR_COMPLETED_EXERCISES,
        })
    );
};

/**
  * Clear Completed FS Exercises
  */
const clearCompletedFSExercises = () => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.CLEAR_COMPLETED_FS_EXERCISES,
        })
    );
};

/**
  * Set Completed Exercise
  */
const setCompletedExercises = exercise => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.SET_COMPLETED_EXERCISES,
            data: exercise,
        })
    );
};

/**
  * Set Completed FS Exercise
  */
const setCompletedFSExercises = exercise => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.SET_COMPLETED_FS_EXERCISES,
            data: exercise,
        })
    );
};

/**
  * Post Readiness Survey Data
  */
const postReadinessSurvey = dailyReadinessObj => {
    return dispatch => AppAPI.post_readiness_survey.post(false, dailyReadinessObj)
        .then(myPlanData => {
            dispatch({
                type: Actions.POST_READINESS_SURVEY,
                data: myPlanData,
            });
            return myPlanData;
        }).then(myPlanData => Promise.resolve(myPlanData))
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Post sensor data
  */
const postSingleSensorData = dataObj => {
    return AppAPI.post_sensor_data.post(false, dataObj)
        .then(data => {
            let myPlanData = {};
            myPlanData.daily_plans = [data.daily_plan];
            store.dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData,
            });
            return Promise.resolve(data);
        })
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
}

/**
  * Post Session Survey Data
  */
const postSessionSurvey = postSessionObj => {
    // we need to clear our exercises as they will be updated
    let currentState = store.getState();
    let newPlan = {};
    newPlan.daily_plans = [];
    let newCurrentPlan = _.cloneDeep(currentState.plan.dailyPlan[0]);
    newCurrentPlan.pre_recovery = null;
    newCurrentPlan.post_recovery = null;
    let newTrainingSessions = _.cloneDeep(newCurrentPlan.training_sessions);
    let newTrainingSession = {};
    newTrainingSession.sport_name = postSessionObj.sport_name;
    newTrainingSession.strength_and_conditioning_type = postSessionObj.strength_and_conditioning_type;
    newTrainingSession.session_type = postSessionObj.session_type;
    newTrainingSession.event_date = postSessionObj.event_date;
    newTrainingSessions.push(newTrainingSession);
    newCurrentPlan.training_sessions = newTrainingSessions;
    newPlan.daily_plans.push(newCurrentPlan);
    // call api
    return dispatch => AppAPI.post_session_survey.post(false, postSessionObj)
        .then(myPlanData => {
            dispatch({
                type: Actions.POST_SESSION_SURVEY,
                data: postSessionObj,
            });
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: newPlan,
            });
            return myPlanData;
        }).then(myPlanData => Promise.resolve(newPlan))
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Get Sore Body Parts Data
  */
const getSoreBodyParts = user_id => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    return dispatch => AppAPI.get_sore_body_parts.post(false, bodyObj)
        .then(soreBodyParts => {
            dispatch({
                type: Actions.GET_SORE_BODY_PARTS,
                data: soreBodyParts,
            });
            return Promise.resolve(soreBodyParts);
        }).catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Patch Active Recovery
  */
const patchActiveRecovery = (user_id, completed_exercises, recovery_type) => {
    let bodyObj = {};
    bodyObj.user_id = user_id;
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.recovery_type = recovery_type;
    bodyObj.completed_exercises = completed_exercises;
    return dispatch => AppAPI.active_recovery.patch(false, bodyObj)
        .then(myPlanData => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData,
            });
            return true;
        }).then(myPlanData => {
            dispatch({
                type: Actions.CLEAR_COMPLETED_EXERCISES,
            });
            return Promise.resolve(myPlanData);
        })
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Pre Readiness
  */
const preReadiness = (user_id) => {
    let bodyObj = {};
    bodyObj.user_id = user_id;
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    return dispatch => AppAPI.typical_sessions.post(false, bodyObj)
        .then(typicalSessionData => {
            dispatch({
                type: Actions.SET_TYPICAL_SESSIONS,
                data: typicalSessionData.typical_sessions,
            });
            return Promise.resolve(typicalSessionData);
        }).catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * No Session
  */
const noSessions = (user_id) => {
    let bodyObj = {};
    bodyObj.user_id = user_id;
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    return dispatch => AppAPI.no_sessions.post(false, bodyObj)
        .then(data => {
            let myPlanData = {};
            myPlanData.daily_plans = [data.daily_plan];
            store.dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData,
            });
            return Promise.resolve(data);
        }).catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Patch Functional Strength
  */
const patchFunctionalStrength = (user_id, completed_exercises) => {
    let bodyObj = {};
    bodyObj.user_id = user_id;
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.completed_exercises = completed_exercises;
    return dispatch => AppAPI.functional_strength.patch(false, bodyObj)
        .then(myPlanData => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData,
            });
            dispatch({
                type: Actions.CLEAR_COMPLETED_FS_EXERCISES,
            });
            return Promise.resolve(myPlanData);
        })
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Mark Started Recovery - recovery_type of pre or post
  */
const markStartedRecovery = (user_id, recovery_type, newMyPlan) => {
    let bodyObj = {};
    bodyObj.user_id = user_id;
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.recovery_type = recovery_type;
    return dispatch => AppAPI.active_recovery.post(false, bodyObj)
        .then(response => {
            let myPlanData = {};
            myPlanData.daily_plans = newMyPlan;
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData,
            });
            return Promise.resolve(response);
        })
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Mark Started Functional Strength
  */
const markStartedFunctionalStrength = (user_id, newMyPlan) => {
    let bodyObj = {};
    bodyObj.user_id = user_id;
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    return dispatch => AppAPI.functional_strength.post(false, bodyObj)
        .then(response => {
            let myPlanData = {};
            myPlanData.daily_plans = newMyPlan;
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData,
            });
            return Promise.resolve(response);
        })
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

export default {
    clearCompletedExercises,
    clearCompletedFSExercises,
    clearMyPlanData,
    getMyPlan,
    getSoreBodyParts,
    markStartedFunctionalStrength,
    markStartedRecovery,
    noSessions,
    patchActiveRecovery,
    patchFunctionalStrength,
    postReadinessSurvey,
    postSessionSurvey,
    postSingleSensorData,
    preReadiness,
    setCompletedExercises,
    setCompletedFSExercises,
};
