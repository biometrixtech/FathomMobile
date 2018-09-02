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
import { AppAPI, AppUtil } from '../lib';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

/**
  * Get My Plan Data
  */
const getMyPlan = (userId, startDate, endDate, updateNotificationFlag) => {
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
            if(updateNotificationFlag) {
                dispatch({
                    type: Actions.NOTIFICATION_ADDRESSED
                });
            }
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
        }).then(myPlanData => Promise.resolve(myPlanData))
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Get Sore Body Parts Data
  */
const getSoreBodyParts = user_id => {
    return dispatch => AppAPI.get_sore_body_parts.get()
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
const patchActiveRecovery = (user_id, recovery_type) => {
    let bodyObj = {};
    bodyObj.user_id = user_id;
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.recovery_type = recovery_type;
    return dispatch => AppAPI.active_recovery.patch(false, bodyObj)
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

export default {
    clearMyPlanData,
    getMyPlan,
    getSoreBodyParts,
    patchActiveRecovery,
    postReadinessSurvey,
    postSessionSurvey,
    postSingleSensorData,
};
