/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 11:06:00
 * @Last Modified by: Mazen Chami
 * @Last Modified time: 2018-07-12 11:06:00
 */

/**
 * MyPlan Actions
 */

import { Actions } from '../constants/';
import { AppAPI, AppUtil } from '../lib/';

// import third-party libraries
import moment from 'moment';

/**
  * Get My Plan Data
  */
const getMyPlan = (userId, startDate, endDate) => {
    let myPlanObj = {};
    myPlanObj.user_id = userId;
    myPlanObj.start_date = startDate ? startDate : moment().format('YYYY-MM-DD');
    if(endDate) {
        myPlanObj.end_date = endDate;
    }
    console.log('myPlanObj',myPlanObj);
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.get_my_plan.post(false, myPlanObj)
            .then((myPlanData) => {
                // dispatch({
                //     type: Actions.USER_REPLACE,
                //     data: myPlanData,
                // });
                console.log('myPlanData',myPlanData);
                return resolve(myPlanData);
            }).catch(err => {
                console.log('err',err);
                const error = AppAPI.handleError(err);
                return reject(error);
            });
    });
};

/**
  * Get Readiness Survey Data
  */
const postReadinessSurvey = (userId, startDate, endDate) => {
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.post_readiness_survey.post(false, {})
            .then((myPlanData) => {
                // dispatch({
                //     type: Actions.USER_REPLACE,
                //     data: myPlanData,
                // });
                console.log('myPlanData',myPlanData);
                return resolve(myPlanData);
            }).catch(err => {
                console.log('err',err);
                const error = AppAPI.handleError(err);
                return reject(error);
            });
    });
};

/**
  * Get Sore Body Parts Data
  */
const getSoreBodyParts = (user_id) => {
    return dispatch => new Promise((resolve, reject) => {
        return AppAPI.get_sore_body_parts.get()
            .then((soreBodyParts) => {
                // dispatch({
                //     type: Actions.USER_REPLACE,
                //     data: soreBodyParts,
                // });
                console.log('soreBodyParts',soreBodyParts);
                return resolve(soreBodyParts);
            }).catch(err => {
                console.log('err',err);
                const error = AppAPI.handleError(err);
                return reject(error);
            });
    });
};

export default {
    getMyPlan,
    getSoreBodyParts,
    postReadinessSurvey,
};
