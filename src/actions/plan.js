/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 11:06:00
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-17 00:18:03
 */

/**
 * MyPlan Actions
 */

import { Actions } from '@constants';
import { store } from '@store';
import { AppAPI, AppUtil } from '@lib';

// import third-party libraries
import moment from 'moment';

/**
  * Get My Plan Data
  */
const getMyPlan = (userId, startDate, endDate) => {
    let currentState = store.getState();
    let myPlanObj = {};
    // Defaulting user id to whatever is in the store if nothing is sent for Push Notifications
    myPlanObj.user_id = userId || currentState.user.id;
    myPlanObj.start_date = startDate ? startDate : moment().format('YYYY-MM-DD');
    if(endDate) {
        myPlanObj.end_date = endDate;
    }
    console.log('myPlanObj',myPlanObj);
    return dispatch => AppAPI.get_my_plan.post(false, myPlanObj)
        .then(myPlanData => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData,
            });
            console.log('myPlanData',myPlanData);
            return Promise.resolve(myPlanData);
        }).catch(err => {
            console.log('err',err);
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
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
            console.log('myPlanData',myPlanData);
            return myPlanData;
        }).then(myPlanData => Promise.resolve(myPlanData))
        .catch(err => {
            console.log('err',err);
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Post Session Survey Data
  */
const postSessionSurvey = postSessionObj => {
    return dispatch => AppAPI.post_session_survey.post(false, postSessionObj)
        .then(myPlanData => {
            dispatch({
                type: Actions.POST_SESSION_SURVEY,
                data: postSessionObj,
            });
            console.log('myPlanData',myPlanData);
            return myPlanData;
        }).then(myPlanData => Promise.resolve(myPlanData))
        .catch(err => {
            console.log('err',err);
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
            console.log('soreBodyParts',soreBodyParts);
            return Promise.resolve(soreBodyParts);
        }).catch(err => {
            console.log('err',err);
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

export default {
    getMyPlan,
    getSoreBodyParts,
    postReadinessSurvey,
    postSessionSurvey,
};
