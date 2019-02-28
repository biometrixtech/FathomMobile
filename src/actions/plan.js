/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 11:06:00
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-30 17:30:55
 */

/**
 * MyPlan Actions
 */

// RN Specific
import { Platform, } from 'react-native';

// consts & libs
import { Actions } from '../constants';
import { store } from '../store';
import { AppAPI, } from '../lib';

// import third-party libraries
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
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
        .then(response => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: response.daily_plans,
            });
            if(!response.daily_plans[0].daily_readiness_survey_completed) {
                dispatch({
                    type: Actions.GET_SORE_BODY_PARTS,
                    data: response.readiness,
                });
                dispatch({
                    type: Actions.SET_TYPICAL_SESSIONS,
                    data: response.typical_sessions,
                });
            }
            return Promise.resolve(response);
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
  * Clear HealthKit Workouts
  */
const clearHealthKitWorkouts = () => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.SET_HEALTH_DATA,
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
    let newTrainingSessions = _.cloneDeep(newCurrentPlan.training_sessions);
    let newTrainingSession = {};
    newTrainingSession.sport_name = postSessionObj.sessions[0] && postSessionObj.sessions[0].sport_name ? postSessionObj.sessions[0].sport_name : null;
    newTrainingSession.strength_and_conditioning_type = postSessionObj.sessions[0] && postSessionObj.sessions[0].strength_and_conditioning_type ? postSessionObj.sessions[0].strength_and_conditioning_type : null;
    newTrainingSession.session_type = postSessionObj.sessions[0] && postSessionObj.sessions[0].session_type ? postSessionObj.sessions[0].session_type : null;
    newTrainingSession.event_date = postSessionObj.sessions[0] && postSessionObj.sessions[0].event_date ? postSessionObj.sessions[0].event_date : null;
    newTrainingSession.end_date = postSessionObj.sessions[0] && postSessionObj.sessions[0].end_date ? postSessionObj.sessions[0].end_date : null;
    newTrainingSession.deleted = postSessionObj.sessions[0] && postSessionObj.sessions[0].deleted ? true : false;
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
                data: newPlan.daily_plans,
            });
            return myPlanData;
        })
        .then(myPlanData => Promise.resolve(newPlan))
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
        .then(response => {
            dispatch({
                type: Actions.GET_SORE_BODY_PARTS,
                data: response.readiness,
            });
            dispatch({
                type: Actions.SET_TYPICAL_SESSIONS,
                data: response.typical_sessions,
            });
            return Promise.resolve(response);
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
                data: myPlanData.daily_plans,
            });
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
  * Patch Active Time
  */
const patchActiveTime = (user_id, active_time) => {
    let bodyObj = {};
    bodyObj.user_id = user_id;
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.active_time = active_time;
    return dispatch => AppAPI.active_time.patch(false, bodyObj)
        .then(myPlanData => {
            return Promise.resolve(myPlanData);
        })
        .catch(err => {
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
                data: myPlanData.daily_plans,
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
                data: myPlanData.daily_plans,
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
  * Activate Functional Strength
  */
const activateFunctionalStrength = payload => {
    return dispatch => AppAPI.activate_fs.post(false, payload)
        .then(myPlanData => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: [myPlanData.daily_plan],
            });
            return Promise.resolve(myPlanData);
        })
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
}

/**
  * Mark Started Recovery - recovery_type of pre or post
  */
const markStartedRecovery = (user_id, recovery_type, newMyPlan) => {
    let bodyObj = {};
    bodyObj.user_id = user_id;
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.recovery_type = recovery_type;
    return dispatch => AppAPI.active_recovery.post(false, bodyObj)
        .then(response => Promise.resolve(response))
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
        .then(response => Promise.resolve(response))
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Get Coaches Dashboard Data
  */
const getCoachesDashboardData = (user_id) => {
    return dispatch => AppAPI.coach_dashboard.get({user_id})
        .then(coachesDashboardData => {
            let cleanedTeams = [];
            _.map(coachesDashboardData.teams, (team, key) => {
                cleanedTeams[key] = {};
                cleanedTeams[key].athletes = [];
                cleanedTeams[key].athletes = team.athletes;
                cleanedTeams[key].compliance = {};
                cleanedTeams[key].compliance = team.compliance;
                cleanedTeams[key].name = team.name.toUpperCase();
                cleanedTeams[key].daily_insights = {};
                cleanedTeams[key].daily_insights.seek_med_eval_to_clear_for_training = team.daily_insights.seek_med_eval_to_clear_for_training;
                cleanedTeams[key].daily_insights.adapt_training_to_avoid_symptoms = team.daily_insights.adapt_training_to_avoid_symptoms;
                cleanedTeams[key].daily_insights.monitor_modify_if_needed = team.daily_insights.monitor_modify_if_needed;
                cleanedTeams[key].daily_insights.recovery_day_recommended = team.daily_insights.recovery_day_recommended;
                cleanedTeams[key].daily_insights.all_good = team.daily_insights.all_good;
                cleanedTeams[key].weekly_insights = {};
                cleanedTeams[key].weekly_insights.seek_med_eval_to_clear_for_training = team.weekly_insights.seek_med_eval_to_clear_for_training;
                cleanedTeams[key].weekly_insights.at_risk_of_time_loss_injury = team.weekly_insights.at_risk_of_time_loss_injury;
                cleanedTeams[key].weekly_insights.at_risk_of_overtraining = team.weekly_insights.at_risk_of_overtraining;
                cleanedTeams[key].weekly_insights.low_variability_inhibiting_recovery = team.weekly_insights.low_variability_inhibiting_recovery;
                cleanedTeams[key].weekly_insights.at_risk_of_undertraining = team.weekly_insights.at_risk_of_undertraining;
            });
            cleanedTeams = _.orderBy(cleanedTeams, ['name']);
            // update coaches dashboard data
            dispatch({
                type: Actions.GET_COACHES_DASHBOARD,
                data: cleanedTeams,
            });
            // update last opened flag
            store.dispatch({
                type:   Actions.UPDATE_LAST_OPENED,
                userId: user_id,
                date:   moment().format(),
            });
            return Promise.resolve(coachesDashboardData);
        }).catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Log Device/App Information and Usage
  */
const setAppLogs = () => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.os_name = DeviceInfo.getSystemName();
    bodyObj.os_version = DeviceInfo.getSystemVersion();
    bodyObj.app_version = Platform.OS === 'ios' ? DeviceInfo.getBuildNumber() : DeviceInfo.getVersion();
    return dispatch => AppAPI.app_logs.post(false, bodyObj)
        .then(response => Promise.resolve(response))
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
};

/**
  * Post Survey
  */
const postSurvey = (userId, payload) => {
    return dispatch => AppAPI.survey.post({userId}, payload)
        .then(data => Promise.resolve(data))
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
}

/**
  * Post Health Data
  */
const postHealthData = (payload) => {
    return AppAPI.health_data.post(false, payload)
        .then(data => Promise.resolve(data))
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
}

/**
  * Patch Session
  */
const patchSession = (session_id, payload) => {
    return AppAPI.patch_sessions.patch({session_id}, payload)
        .then(data => Promise.resolve(data))
        .catch(err => {
            const error = AppAPI.handleError(err);
            return Promise.reject(error);
        });
}

export default {
    activateFunctionalStrength,
    clearCompletedExercises,
    clearCompletedFSExercises,
    clearHealthKitWorkouts,
    clearMyPlanData,
    getCoachesDashboardData,
    getMyPlan,
    getSoreBodyParts,
    markStartedFunctionalStrength,
    markStartedRecovery,
    noSessions,
    patchActiveRecovery,
    patchActiveTime,
    patchFunctionalStrength,
    patchSession,
    postHealthData,
    postReadinessSurvey,
    postSessionSurvey,
    postSingleSensorData,
    postSurvey,
    setAppLogs,
    setCompletedExercises,
    setCompletedFSExercises,
};
