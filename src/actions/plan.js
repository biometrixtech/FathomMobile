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
import { Actions, MyPlan as MyPlanConstants, } from '../constants';
import { store } from '../store';
import { AppAPI, PlanLogic, } from '../lib';

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
    let myPlanObj = {};
    // Defaulting user id to whatever is in the store if nothing is sent for Push Notifications
    myPlanObj.start_date = startDate ? startDate : moment().format('YYYY-MM-DD');
    if(endDate) {
        myPlanObj.end_date = endDate;
    }
    myPlanObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    return dispatch => AppAPI.get_my_plan.post({userId}, myPlanObj)
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
            } else {
                // setup variables to be used
                let isPreActiveRest = response.daily_plans[0].pre_active_rest[0] && response.daily_plans[0].pre_active_rest[0].active;
                let activeRestObj = isPreActiveRest ? response.daily_plans[0].pre_active_rest[0] : response.daily_plans[0].post_active_rest[0];
                let exerciseListOrder = isPreActiveRest ? MyPlanConstants.preExerciseListOrder : MyPlanConstants.postExerciseListOrder;
                let coolDownGoals = PlanLogic.handleFindGoals(response.daily_plans[0].cool_down[0], MyPlanConstants.coolDownExerciseListOrder);
                let activeRestGoals = PlanLogic.handleFindGoals(activeRestObj, exerciseListOrder);
                let warmUpGoals = PlanLogic.handleFindGoals(response.daily_plans[0].warm_up[0], MyPlanConstants.warmUpExerciseListOrder);
                let currentActiveRestGoals = store.getState().plan.activeRestGoals;
                let areActiveRestGoalsAlreadySet = _.differenceBy(activeRestGoals, currentActiveRestGoals, 'goal_type').length;
                let currentCoolDownGoals = store.getState().plan.coolDownGoals;
                let areCoolDownGoalsAlreadySet = _.differenceBy(coolDownGoals, currentCoolDownGoals, 'goal_type').length;
                let currentWarmUpGoals = store.getState().plan.warmUpGoals;
                let areWarmUpGoalsAlreadySet = _.differenceBy(warmUpGoals, currentWarmUpGoals, 'goal_type').length;
                // update goals if readiness survey is completed
                dispatch({
                    type: Actions.SET_ACTIVE_REST_GOALS,
                    data: areActiveRestGoalsAlreadySet > 0 ? activeRestGoals : currentActiveRestGoals,
                });
                dispatch({
                    type: Actions.SET_COOL_DOWN_GOALS,
                    data: areCoolDownGoalsAlreadySet > 0 ? coolDownGoals : currentCoolDownGoals,
                });
                dispatch({
                    type: Actions.SET_WARM_UP_GOALS,
                    data: areWarmUpGoalsAlreadySet > 0 ? warmUpGoals : currentWarmUpGoals,
                });
            }
            return Promise.resolve(response);
        })
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Clear My Plan Alert
  */
const clearPlanAlert = (insightType, userId) => {
    let myPlanObj = {
        event_date:   `${moment().toISOString(true).split('.')[0]}Z`,
        insight_type: insightType,
    };
    return dispatch => AppAPI.clear_plan_alert.post({userId}, myPlanObj)
        .then(response => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: response.daily_plans,
            });
            return Promise.resolve(response);
        })
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Clear FTE for Category
  */
const clearFTECategory = (newPlan, insightType, userId) => {
    let myPlanObj = {
        event_date:   `${moment().toISOString(true).split('.')[0]}Z`,
        insight_type: insightType,
    };
    store.dispatch({
        type: Actions.GET_MY_PLAN,
        data: [newPlan],
    });
    return AppAPI.clear_fte_category.post({userId}, myPlanObj)
        .then(response => {
            store.dispatch({
                type: Actions.GET_MY_PLAN,
                data: response.daily_plans,
            });
            return Promise.resolve(response);
        })
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Clear FTE for View
  */
const clearFTEView = (newPlan, insightType, visualizationType, userId) => {
    let myPlanObj = {
        event_date:         `${moment().toISOString(true).split('.')[0]}Z`,
        insight_type:       insightType,
        visualization_type: visualizationType,
    };
    store.dispatch({
        type: Actions.GET_MY_PLAN,
        data: [newPlan],
    });
    return AppAPI.clear_fte_view.post({userId}, myPlanObj)
        .then(response => {
            store.dispatch({
                type: Actions.GET_MY_PLAN,
                data: response.daily_plans,
            });
            return Promise.resolve(response);
        })
        .catch(err => Promise.reject(AppAPI.handleError(err)));
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
  * Clear Completed Cool Down Exercises
  */
const clearCompletedCoolDownExercises = () => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.CLEAR_COMPLETED_COOL_DOWN_EXERCISES,
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
  * Set Completed Cool Down Exercise
  */
const setCompletedCoolDownExercises = exercise => {
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.SET_COMPLETED_COOL_DOWN_EXERCISES,
            data: exercise,
        })
    );
};

/**
  * Post Readiness Survey Data
  */
const postReadinessSurvey = (dailyReadinessObj, userId) => {
    // update daily_readiness_survey_completed flag
    let newDailyPlanObj = _.cloneDeep(store.getState().plan.dailyPlan);
    newDailyPlanObj[0].daily_readiness_survey_completed = true;
    // update reducer
    store.dispatch({
        type: Actions.START_REQUEST,
    });
    store.dispatch({
        type: Actions.GET_MY_PLAN,
        data: newDailyPlanObj,
    });
    // continue logic
    return dispatch => AppAPI.post_readiness_survey.post({userId}, dailyReadinessObj)
        .then(myPlanData => {
            // setup variables to be used
            let isPreActiveRest = myPlanData.daily_plans[0].pre_active_rest[0] && myPlanData.daily_plans[0].pre_active_rest[0].active;
            let activeRestObj = isPreActiveRest ? myPlanData.daily_plans[0].pre_active_rest[0] : myPlanData.daily_plans[0].post_active_rest[0];
            let exerciseListOrder = isPreActiveRest ? MyPlanConstants.preExerciseListOrder : MyPlanConstants.postExerciseListOrder;
            let activeRestGoals = PlanLogic.handleFindGoals(activeRestObj, exerciseListOrder);
            let coolDownGoals = PlanLogic.handleFindGoals(myPlanData.daily_plans[0].cool_down[0], MyPlanConstants.coolDownExerciseListOrder);
            let warmUpGoals = PlanLogic.handleFindGoals(myPlanData.daily_plans[0].warm_up[0], MyPlanConstants.warmUpExerciseListOrder);
            dispatch({
                type:            Actions.POST_READINESS_SURVEY,
                data:            myPlanData.daily_plans,
                activeRestGoals: activeRestGoals,
                coolDownGoals:   coolDownGoals,
                warmUpGoals:     warmUpGoals,
            });
            dispatch({
                type: Actions.STOP_REQUEST,
            });
            return Promise.resolve(myPlanData.daily_plans);
        })
        .catch(err => {
            dispatch({
                type: Actions.STOP_REQUEST,
            });
            return Promise.reject(AppAPI.handleError(err));
        });
};

/**
  * Post sensor data
  */
const postSingleSensorData = (dataObj, userId) => {
    return AppAPI.post_sensor_data.post({userId}, dataObj)
        .then(data => {
            let myPlanData = {};
            myPlanData.daily_plans = [data.daily_plan];
            store.dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData,
            });
            return Promise.resolve(data);
        })
        .catch(err => Promise.reject(AppAPI.handleError(err)));
}

/**
  * Post Session Survey Data
  */
const postSessionSurvey = (postSessionObj, userId) => {
    // call api
    store.dispatch({
        type: Actions.START_REQUEST,
    });
    return dispatch => AppAPI.post_session_survey.post({userId}, postSessionObj)
        .then(myPlanData => {
            // setup variables to be used
            let isPreActiveRest = myPlanData.daily_plans[0].pre_active_rest[0] && myPlanData.daily_plans[0].pre_active_rest[0].active;
            let activeRestObj = isPreActiveRest ? myPlanData.daily_plans[0].pre_active_rest[0] : myPlanData.daily_plans[0].post_active_rest[0];
            let exerciseListOrder = isPreActiveRest ? MyPlanConstants.preExerciseListOrder : MyPlanConstants.postExerciseListOrder;
            let activeRestGoals = PlanLogic.handleFindGoals(activeRestObj, exerciseListOrder);
            let coolDownGoals = PlanLogic.handleFindGoals(myPlanData.daily_plans[0].cool_down[0], MyPlanConstants.coolDownExerciseListOrder);
            let warmUpGoals = PlanLogic.handleFindGoals(myPlanData.daily_plans[0].warm_up[0], MyPlanConstants.warmUpExerciseListOrder);
            dispatch({
                type:            Actions.POST_SESSION_SURVEY,
                data:            myPlanData.daily_plans,
                activeRestGoals: activeRestGoals,
                coolDownGoals:   coolDownGoals,
                warmUpGoals:     warmUpGoals,
            });
            dispatch({
                type: Actions.STOP_REQUEST,
            });
            return Promise.resolve(myPlanData);
        })
        .catch(err => {
            dispatch({
                type: Actions.STOP_REQUEST,
            });
            return Promise.reject(AppAPI.handleError(err));
        });
};

/**
  * Get Sore Body Parts Data
  */
const getSoreBodyParts = userId => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    return dispatch => AppAPI.get_sore_body_parts.post({userId}, bodyObj)
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
        }).catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Patch Active Recovery
  */
const patchActiveRecovery = (completed_exercises, recovery_type, userId) => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.recovery_type = recovery_type;
    bodyObj.completed_exercises = completed_exercises;
    return dispatch => AppAPI.active_recovery.patch({userId}, bodyObj)
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
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Patch Body Active Recovery
  */
const patchBodyActiveRecovery = (completed_body_parts, recovery_type, userId) => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.recovery_type = recovery_type;
    bodyObj.completed_body_parts = completed_body_parts;
    return dispatch => AppAPI.body_active_recovery.patch({userId}, bodyObj)
        .then(myPlanData => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData.daily_plans,
            });
            return Promise.resolve(myPlanData);
        })
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Patch Active Time
  */
const patchActiveTime = (active_time, userId) => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.active_time = active_time;
    return dispatch => AppAPI.active_time.patch({userId}, bodyObj)
        .then(myPlanData => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: myPlanData.daily_plans,
            });
            return Promise.resolve(myPlanData);
        })
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * No Session
  */
const noSessions = userId => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    store.dispatch({
        type: Actions.START_REQUEST,
    });
    return dispatch => AppAPI.no_sessions.post({userId}, bodyObj)
        .then(data => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: data.daily_plans,
            });
            dispatch({
                type: Actions.STOP_REQUEST,
            });
            return Promise.resolve(data);
        })
        .catch(err => {
            dispatch({
                type: Actions.STOP_REQUEST,
            });
            return Promise.reject(AppAPI.handleError(err));
        });
};

/**
  * Patch Functional Strength
  */
const patchFunctionalStrength = (completed_exercises, userId) => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.completed_exercises = completed_exercises;
    return dispatch => AppAPI.functional_strength.patch({userId}, bodyObj)
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
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Activate Functional Strength
  */
const activateFunctionalStrength = (payload, userId) => {
    return dispatch => AppAPI.activate_fs.post({userId}, payload)
        .then(myPlanData => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: [myPlanData.daily_plan],
            });
            return Promise.resolve(myPlanData);
        })
        .catch(err => Promise.reject(AppAPI.handleError(err)));
}

/**
  * Mark Started Recovery - recovery_type of pre or post
  */
const markStartedRecovery = (recovery_type, userId) => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.recovery_type = recovery_type;
    return dispatch => AppAPI.active_recovery.post({userId}, bodyObj)
        .then(response => Promise.resolve(response))
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Mark Started Functional Strength
  */
const markStartedFunctionalStrength = (newMyPlan, userId) => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    return dispatch => AppAPI.functional_strength.post({userId}, bodyObj)
        .then(response => Promise.resolve(response))
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Get Coaches Dashboard Data
  */
const getCoachesDashboardData = userId => {
    return dispatch => AppAPI.coach_dashboard.get({userId})
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
                userId: userId,
                date:   moment().format(),
            });
            return Promise.resolve(coachesDashboardData);
        }).catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Log Device/App Information and Usage
  */
const setAppLogs = userId => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.os_name = DeviceInfo.getSystemName();
    bodyObj.os_version = DeviceInfo.getSystemVersion();
    bodyObj.app_version = Platform.OS === 'ios' ? DeviceInfo.getBuildNumber() : DeviceInfo.getVersion();
    return dispatch => AppAPI.app_logs.post({userId}, bodyObj)
        .then(response => Promise.resolve(response))
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

/**
  * Post Survey
  */
const postSurvey = (userId, payload) => {
    return dispatch => AppAPI.survey.post({userId}, payload)
        .then(data => Promise.resolve(data))
        .catch(err => Promise.reject(AppAPI.handleError(err)));
}

/**
  * Post Health Data
  */
const postHealthData = (userId, payload) => {
    return AppAPI.health_data.post({userId}, payload)
        .then(data => Promise.resolve(data))
        .catch(err => Promise.reject(AppAPI.handleError(err)));
}

/**
  * Patch Session
  */
const patchSession = (userId, session_id, payload) => {
    return AppAPI.patch_sessions.patch({ userId, session_id, }, payload)
        .then(data => Promise.resolve(data))
        .catch(err => Promise.reject(AppAPI.handleError(err)));
}

/**
  * toggle recovery goals
  */
const toggleCoolDownGoal = newGoals => {
    return dispatch => Promise.resolve(
        dispatch({
            type:          Actions.TOGGLE_COOL_DOWN_GOAL,
            coolDownGoals: newGoals,
        })
    );
};

/**
  * toggle recovery goals
  */
const toggleActiveRestGoal = newGoals => {
    return dispatch => Promise.resolve(
        dispatch({
            type:            Actions.TOGGLE_ACTIVE_REST_GOAL,
            activeRestGoals: newGoals,
        })
    );
};

/**
  * toggle recovery goals
  */
const toggleWarmUpGoal = newGoals => {
    return dispatch => Promise.resolve(
        dispatch({
            type:        Actions.TOGGLE_WARM_UP_GOAL,
            warmUpGoals: newGoals,
        })
    );
};

/**
  * handle body modality clicked
  */
const handleBodyPartClick = (dailyPlan, bodyPartyId, side, modality) => {
    let newDailyPlanObj = _.clone(dailyPlan);
    let bodyPartyIndex = _.findIndex(dailyPlan[modality].body_parts, o => o.body_part_location === bodyPartyId && o.side === side);
    newDailyPlanObj[modality].body_parts[bodyPartyIndex].active = !newDailyPlanObj[modality].body_parts[bodyPartyIndex].active;
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.GET_MY_PLAN,
            data: [newDailyPlanObj],
        })
    );
};

/**
  * Handle Read Insight
  */
const handleReadInsight = (dailyPlan, insightIndex, userId) => {
    if(!dailyPlan.insights[insightIndex]) {
        return dispatch => Promise.resolve();
    }
    let newDailyPlanObj = _.clone(dailyPlan);
    let wasInsightPreviouslyRead = !newDailyPlanObj.insights[insightIndex].read;
    newDailyPlanObj.insights[insightIndex].read = true;
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    bodyObj.insights = [newDailyPlanObj.insights[insightIndex]];
    if(wasInsightPreviouslyRead) {
        return dispatch => new Promise((resolve, reject) => {
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: [newDailyPlanObj],
            });
            return AppAPI.insights_read.post({userId}, bodyObj)
                .then(response => resolve(response))
                .catch(err => reject(AppAPI.handleError(err)));
        });
    }
    return dispatch => Promise.resolve(
        dispatch({
            type: Actions.GET_MY_PLAN,
            data: [newDailyPlanObj],
        })
    );
};

/**
  * Log Device/App Information and Usage
  */
const getMobilize = userId => {
    let bodyObj = {};
    bodyObj.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    store.dispatch({
        type: Actions.START_REQUEST,
    });
    return dispatch => AppAPI.get_mobilize.post({userId}, bodyObj)
        .then(data => {
            // update My Plan reducer
            store.dispatch({
                type: Actions.GET_MY_PLAN,
                data: data.daily_plans,
            });
            // setup variables to be used
            let isPreActiveRest = data.daily_plans[0].pre_active_rest[0] && data.daily_plans[0].pre_active_rest[0].active;
            let activeRestObj = isPreActiveRest ? data.daily_plans[0].pre_active_rest[0] : data.daily_plans[0].post_active_rest[0];
            let exerciseListOrder = isPreActiveRest ? MyPlanConstants.preExerciseListOrder : MyPlanConstants.postExerciseListOrder;
            let activeRestGoals = PlanLogic.handleFindGoals(activeRestObj, exerciseListOrder);
            let currentActiveRestGoals = store.getState().plan.activeRestGoals;
            let areActiveRestGoalsAlreadySet = _.differenceBy(activeRestGoals, currentActiveRestGoals, 'goal_type').length;
            // update goals if readiness survey is completed
            dispatch({
                type: Actions.SET_ACTIVE_REST_GOALS,
                data: areActiveRestGoalsAlreadySet > 0 ? activeRestGoals : currentActiveRestGoals,
            });
            dispatch({
                type: Actions.STOP_REQUEST,
            });
            // resolve promise
            return Promise.resolve(data);
        })
        .catch(err => {
            dispatch({
                type: Actions.STOP_REQUEST,
            });
            return Promise.reject(AppAPI.handleError(err));
        });
};

/**
  * Get Biomechanics Details
  */
const getBiomechanicsDetails = (currentPlan, userId) => {
    let payload = {};
    payload.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
    return dispatch => AppAPI.biomechanics_detail.post({userId}, payload)
        .then(response => {
            let newPlan = _.cloneDeep(currentPlan);
            let mergedSessions = _.map(newPlan.trends.biomechanics_summary.sessions, obj => {
                let clonedObj = _.cloneDeep(obj);
                let returnedSession = _.find(response.sessions, 'session_id');
                let mergedAsymmetryAptObj = _.merge(clonedObj.asymmetry.apt, returnedSession.asymmetry.apt);
                clonedObj.asymmetry.apt = mergedAsymmetryAptObj;
                return clonedObj;
            });
            newPlan.trends.biomechanics_summary.sessions = mergedSessions;
            dispatch({
                type: Actions.GET_MY_PLAN,
                data: [newPlan],
            });
            return Promise.resolve(response);
        })
        .catch(err => Promise.reject(AppAPI.handleError(err)));
};

export default {
    activateFunctionalStrength,
    clearCompletedCoolDownExercises,
    clearCompletedExercises,
    clearCompletedFSExercises,
    clearFTECategory,
    clearFTEView,
    clearHealthKitWorkouts,
    clearMyPlanData,
    clearPlanAlert,
    getBiomechanicsDetails,
    getCoachesDashboardData,
    getMobilize,
    getMyPlan,
    getSoreBodyParts,
    handleBodyPartClick,
    handleReadInsight,
    markStartedFunctionalStrength,
    markStartedRecovery,
    noSessions,
    patchActiveRecovery,
    patchActiveTime,
    patchBodyActiveRecovery,
    patchFunctionalStrength,
    patchSession,
    postHealthData,
    postReadinessSurvey,
    postSessionSurvey,
    postSingleSensorData,
    postSurvey,
    setAppLogs,
    setCompletedCoolDownExercises,
    setCompletedExercises,
    setCompletedFSExercises,
    toggleActiveRestGoal,
    toggleCoolDownGoal,
    toggleWarmUpGoal,
};
