/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:08:55
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 11:41:51
 */

import { Alert, Platform, } from 'react-native';

// import third-party libraries
import { Actions as DispatchActions, MyPlan as MyPlanConstants, } from '../constants';
import { Actions as RouterActions, } from 'react-native-router-flux';
import { AppColors, AppStyles, } from '../constants';
import { AlertHelper, } from './';
import { init as InitActions, plan as PlanActions, } from '../actions';
import { store, } from '../store';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import AppleHealthKit from 'rn-apple-healthkit';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import uuidByString from 'uuid-by-string';

// get the available permissions from AppleHealthKit.Constants object
const PERMS = AppleHealthKit.Constants.Permissions;

/**
 * Global Util Functions
 */

// import * as scale from 'd3-scale';
// import * as shape from 'd3-shape';
// import * as d3Array from 'd3-array';

// const Entities = require('html-entities').AllHtmlEntities;

const MS_IN_DAY = 1000 * 60 * 60 * 24;

// const entities = new Entities();

// const d3 = {
//     scale,
//     shape,
// };

// function striptags(input) {
//     return input.replace(/(<([^>]+)>)/ig, '');
// }

const UTIL = {

    pushToScene: (destinationScene, props = {}) => {
        if (RouterActions.currentScene === destinationScene) {
            return;
        }
        return RouterActions[destinationScene](props);
    },

    getDeviceUUID: () => {
        // setup evn flag
        let currentState = store.getState();
        let env = currentState.init.environment;
        let envFlag = env === 'PROD' ? 'production' : env.toLowerCase();
        // mobile uuid
        let uniqueId = `${envFlag}_${DeviceInfo.getUniqueID()}`;
        let uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if(!uuidRegex.test(uniqueId)) {
            // not a uuid, lets unparse it
            uniqueId = uuidByString(uniqueId);
        }
        uniqueId = uniqueId.toLowerCase();
        return uniqueId;
    },

    getAppBuildNumber: () => {
        return DeviceInfo.getBuildNumber();
    },

    getNetworkStatus: (prevProps, network, Actions) => {
        const notConnectedTypes = ['none', 'unknown'];
        const connectedTypes = ['wifi', 'cellular'];
        const isNetworkDifferent = _.isEqual(prevProps.network, network);
        if(
            !isNetworkDifferent &&
            !network.connected &&
            notConnectedTypes.includes(network.connectionType)
        ) {
            Actions.currentParams.showDropdownAlert();
        } else if(
            !isNetworkDifferent &&
            network.connected &&
            connectedTypes.includes(network.connectionType)
        ) {
            Actions.currentParams.closeDropdownAlert();
        }
    },

    getMaintenanceWindow: () => {
        InitActions.getMaintenanceWindow(true);
    },

    handleScheduledMaintenanceAlert: (displayAlert, header, message) => {
        if(displayAlert) {
            let currentState = store.getState();
            let scheduledMaintenance = currentState.init.scheduledMaintenance;
            Alert.alert(
                header,
                message,
                [
                    {
                        text:    'OK',
                        onPress: () => {
                            store.dispatch({
                                type: DispatchActions.UPDATE_SCHEDULED_MAINTENANCE,
                                data: {
                                    addressed:  true,
                                    end_date:   scheduledMaintenance.end_date,
                                    start_date: scheduledMaintenance.start_date,
                                }
                            })
                        },
                        style: 'cancel',
                    },
                ],
                { cancelable: false }
            );
        }
    },

    updatePushNotificationFlag: () => {
        store.dispatch({
            type: DispatchActions.NOTIFICATION_ADDRESSED
        });
        PushNotification.setApplicationIconBadgeNumber(0);
    },

    getFormattedTimezoneString: () => {
        let now = moment().toISOString(true);
        let lastIndex = now.lastIndexOf('+') > -1 ? now.lastIndexOf('+') : now.lastIndexOf('-');
        let formattedTimezone = now.slice(lastIndex);
        return formattedTimezone;
    },

    handleAPIErrorAlert: (message, header = 'Error!') => {
        Alert.alert(
            header,
            message,
            [
                {
                    style: 'cancel',
                    text:  'OK',
                },
            ],
            { cancelable: false }
        );
    },

    routeOnLogin: (userObj, updateReducer = false) => {
        // WARNING: WORK IN PROGRESS
        /*
         * Update Reducer so we don't have to wait for API to return
         */
        if(updateReducer) {
            store.dispatch({
                type: DispatchActions.USER_REPLACE,
                data: userObj,
            });
        }
        /*
         * Items to look at
         *  - email_verified
         *  - onboarding_status
         * Steps:
         * 1. Download App
         * 2. Select Create Account
         * 3. Value Proposition Screens (WILL BE ADDED LATER)
         * 4. Onboarding
         * 5. App Tutorial Screen: simple, similar to single sensor
         * 6. ** Sensor tutorial
         */
        if(userObj) {
            // TODO: HANDLE FOR DISABLED ACCOUNTS & ACCOUNTS WHO HAVEN'T VERIFIED THEIR EMAIL YET
            // if(!userObj.email_verified) {
            //     RouterActions.accountDetails();
            // }
            // TODO: uncomment below when educational content is in
            // if(userObj.onboarding_status && !userObj.onboarding_status.includes('educational')) {
            //   RouterActions.tutorial({step: 'educational-tutorial'});
            // } else
            if(userObj.onboarding_status && !userObj.onboarding_status.includes('account_setup')) {
                RouterActions.onboarding();
            // TODO: uncomment below when single-sensor information is ready
            // } else if(userObj.onboarding_status && !userObj.onboarding_status.includes('single-sensor-tutorial')) {
            //     RouterActions.tutorial({step: 'single-sensor'});
            // } else if(userObj.onboarding_status && !userObj.onboarding_status.includes('coach-tutorial') && userObj.role === 'coach') {
            //     RouterActions.tutorial({step: 'coach-tutorial'});
            // } else if(userObj.onboarding_status && !userObj.onboarding_status.includes('tutorial-tutorial') && userObj.role === 'athlete') {
            //     // NOTE: THIS IS THE LAST SCREEN PRIOR TO MYPLAN
            //     RouterActions.tutorial({step: 'tutorial-tutorial'});
            // } else if(userObj.onboarding_status && !userObj.onboarding_status.includes('survey-questions')) {
            //     RouterActions.survey();
            } else {
                if(userObj.role === 'coach') {
                    RouterActions.coachesDashboard();
                } else {
                    // 3-Sensor Banner
                    let dailyPlanObj = store.getState().plan && store.getState().plan.dailyPlan && store.getState().plan.dailyPlan[0] ?
                        store.getState().plan.dailyPlan[0]
                        :
                        {};
                    UTIL._handle3SensorBanner(userObj, dailyPlanObj);
                    RouterActions.myPlan();
                }
            }
        }
    },

    _handle3SensorBanner: (user, plan) => {
        if(
            user.id &&
            plan.daily_readiness_survey_completed &&
            user.first_time_experience.includes('3Sensor-Onboarding-17') &&
            !user.first_time_experience.includes('3Sensor-Onboarding-18')
        ) {
            AlertHelper.showDropDown(
                'custom',
                'FINISH WIFI SET-UP TO SYNC YOUR DATA.',
                'Tap here once in range of your preferred wifi.'
            );
        }
    },

    _getAppleHealthKitPerms: () => {
        return {
            permissions: {
                read: [
                    PERMS.BiologicalSex,
                    PERMS.DateOfBirth,
                    PERMS.HeartRate,
                    PERMS.Height,
                    PERMS.SleepAnalysis,
                    PERMS.Weight,
                    PERMS.Workout,
                ],
                write: [],
            }
        };
    },

    initAppleHealthKit: () => {
        if(Platform.OS === 'ios') {
            let appleHealthKitPerms = UTIL._getAppleHealthKitPerms();
            AppleHealthKit.initHealthKit(appleHealthKitPerms, (err: String, results: Object) => {
                if(err) { return false; }
                return true;
            });
        }
        return false;
    },

    getAppleHealthKitPersonalData: () => {
        // grab permissions
        if(Platform.OS === 'ios') {
            let appleHealthKitPerms = UTIL._getAppleHealthKitPerms();
            let height = UTIL._getHealthHeight(appleHealthKitPerms, AppleHealthKit);
            let weight = UTIL._getWeightHeight(appleHealthKitPerms, AppleHealthKit);
            let dob = UTIL._getDOBHeight(appleHealthKitPerms, AppleHealthKit);
            let sex = UTIL._getSexHeight(appleHealthKitPerms, AppleHealthKit);
            return [height, weight, dob, sex];
        }
        return [];
    },

    _getHealthHeight: (appleHealthKitPerms, appleHealthKit) => {
        return new Promise((resolve, reject) => {
            appleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                appleHealthKit.getLatestHeight(null, (heightError: String, heightResults: Object) => {
                    if(heightError) { reject(heightError); }
                    // console.log('heightResults',heightResults);
                    resolve(heightResults);
                });
            });
        });
    },

    _getWeightHeight: (appleHealthKitPerms, appleHealthKit) => {
        let weightOptions = {
            unit: 'pound',
        };
        return new Promise((resolve, reject) => {
            appleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                appleHealthKit.getLatestWeight(weightOptions, (weightError: Object, weightResults: Object) => {
                    if(weightError) { reject(weightError); }
                    // console.log('weightResults',weightResults);
                    resolve(weightResults);
                });
            });
        });
    },

    _getDOBHeight: (appleHealthKitPerms, appleHealthKit) => {
        return new Promise((resolve, reject) => {
            appleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                appleHealthKit.getDateOfBirth(null, (dobError: Object, dobResults: Object) => {
                    if(dobError) { reject(dobError); }
                    // console.log('dobResults',dobResults);
                    resolve(dobResults);
                });
            });
        });
    },

    _getSexHeight: (appleHealthKitPerms, appleHealthKit) => {
        return new Promise((resolve, reject) => {
            appleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                appleHealthKit.getBiologicalSex(null, (sexError: Object, sexResults: Object) => {
                    if(sexError) { reject(sexError); }
                    // console.log('sexResults',sexResults);
                    resolve(sexResults);
                });
            });
        });
    },

    _getWorkoutSamples: (appleHealthKitPerms, startDate, endDate, appleHealthKit) => {
        // NOTE: successful resolving of an empty array so that Promise.all() works as desired
        let workoutOptions = {
            startDate,
            endDate,
            ascending: true,
        };
        return new Promise((resolve, reject) => {
            appleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { resolve([]); }
                appleHealthKit.getWorkout(workoutOptions, (workoutError: Object, workoutResults: Array<Object>) => {
                    if(workoutError) { resolve([]); }
                    // console.log('workoutResults',workoutResults);
                    resolve(workoutResults);
                });
            });
        });
    },

    _getHeartRateSamples: (appleHealthKitPerms, startDate, endDate, resolveEmpty, appleHealthKit) => {
        if(resolveEmpty) {
            return new Promise((resolve, reject) => resolve([]));
        }
        // NOTE: successful resolving of an empty array so that Promise.all() works as desired
        let heartRateOptions = {
            startDate,
            endDate,
        };
        return new Promise((resolve, reject) => {
            appleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { resolve([]); }
                appleHealthKit.getHeartRateSamples(heartRateOptions, (hrError: Object, hrResults: Array<Object>) => {
                    if(hrError) { resolve([]); }
                    // console.log('hrResults',hrResults);
                    resolve(hrResults);
                });
            });
        });
    },

    _getSleepSamples: (appleHealthKitPerms, startDate, endDate, resolveEmpty, appleHealthKit) => {
        if(resolveEmpty) {
            return new Promise((resolve, reject) => resolve([]));
        }
        // NOTE: successful resolving of an empty array so that Promise.all() works as desired
        let sleepOptions = {
            startDate,
            endDate,
        };
        return new Promise((resolve, reject) => {
            appleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { resolve([]); }
                appleHealthKit.getSleepSamples(sleepOptions, (sleepError: Object, sleepResults: Array<Object>) => {
                    if(sleepError) { resolve([]); }
                    // console.log('sleepResults',sleepResults);
                    resolve(sleepResults);
                });
            });
        });
    },

    _getAppleHealthTimes: (lastSyncDate, historicSyncDate, numberOfDaysAgo) => {
        let daysAgo = moment().subtract(numberOfDaysAgo, 'd').set('hour', 3).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString();
        let updatedLastSyncDate = !lastSyncDate && !historicSyncDate ?
            null
            : lastSyncDate && !historicSyncDate ?
                daysAgo
                : !lastSyncDate && historicSyncDate ?
                    historicSyncDate
                    : lastSyncDate && historicSyncDate && moment(lastSyncDate, 'YYYY-MM-DDThh:mm:ssZ').format('YYYY-MM-DD') === moment(historicSyncDate, 'YYYY-MM-DDThh:mm:ssZ').format('YYYY-MM-DD') ?
                        lastSyncDate
                        :
                        historicSyncDate;
        return {
            daysAgo,
            lastSync: updatedLastSyncDate ? moment(updatedLastSyncDate, 'YYYY-MM-DDThh:mm:ssZ').toISOString() : null,
            now:      moment().toISOString(),
            syncDate: updatedLastSyncDate ? moment(updatedLastSyncDate, 'YYYY-MM-DDThh:mm:ssZ').set('hour', 3).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString() : null,
            today3AM: moment().set('hour', 3).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString(),
        };
    },

    getAppleHealthKitDataPrevious: (userObj, lastSyncDate, historicSyncDate, numberOfDaysAgo = 35) => {
        return new Promise((resolve, reject) => {
            if(Platform.OS === 'ios') {
                // grab permissions
                let appleHealthKitPerms = UTIL._getAppleHealthKitPerms();
                // set start and end dates
                let { daysAgo, lastSync, now, syncDate, today3AM, } = UTIL._getAppleHealthTimes(lastSyncDate, historicSyncDate, numberOfDaysAgo);
                // setup variables
                let apiPromisesArray = [];
                // combine promises and trigger next step
                if(syncDate) {
                    // 1- syncDate - today3AM (workout/hr)
                    apiPromisesArray.push(UTIL._getWorkoutSamples(appleHealthKitPerms, syncDate, today3AM, AppleHealthKit));
                    apiPromisesArray.push(UTIL._getHeartRateSamples(appleHealthKitPerms, syncDate, today3AM, true, AppleHealthKit));
                    // 2- lastSync - now (sleep)
                    apiPromisesArray.push(UTIL._getSleepSamples(appleHealthKitPerms, lastSync, now, AppleHealthKit));
                } else {
                    // 1- daysAgo - today3AM (workout/hr)
                    apiPromisesArray.push(UTIL._getWorkoutSamples(appleHealthKitPerms, daysAgo, today3AM, AppleHealthKit));
                    apiPromisesArray.push(UTIL._getHeartRateSamples(appleHealthKitPerms, daysAgo, today3AM, true, AppleHealthKit));
                    // 2- daysAgo - now (sleep)
                    apiPromisesArray.push(UTIL._getSleepSamples(appleHealthKitPerms, daysAgo, now, AppleHealthKit));
                }
                // return function
                return UTIL._handleReturnedPromises(userObj, syncDate ? syncDate : daysAgo, apiPromisesArray, true)
                    .then(res => {
                        return resolve();
                    });
            }
            return resolve();
        });
    },

    getAppleHealthKitData: (userObj, lastSyncDate, historicSyncDate, numberOfDaysAgo = 35) => {
        return new Promise((resolve, reject) => {
            if(Platform.OS === 'ios') {
                // grab permissions
                let appleHealthKitPerms = UTIL._getAppleHealthKitPerms();
                // set start and end dates
                let { now, today3AM, } = UTIL._getAppleHealthTimes(lastSyncDate, historicSyncDate, numberOfDaysAgo);
                // setup variables
                let apiPromisesArray = [];
                // combine promises and trigger next step
                // 1- today3AM - now (workout/hr)
                apiPromisesArray.push(UTIL._getWorkoutSamples(appleHealthKitPerms, today3AM, now, AppleHealthKit));
                apiPromisesArray.push(UTIL._getHeartRateSamples(appleHealthKitPerms, today3AM, now, AppleHealthKit));
                apiPromisesArray.push(UTIL._getSleepSamples(false, false, false, true, AppleHealthKit)); // resolving empty
                // return function
                return UTIL._handleReturnedPromises(userObj, null, apiPromisesArray, false)
                    .then(res => {
                        return resolve();
                    });
            }
            return resolve();
        });
    },

    _handleReturnedPromises: (userObj, startDate, promisesArray, sendAPI) => {
        return Promise
            .all(promisesArray)
            .then(values => {
                // [0] = workoutValues, [1] = heartRateSamples, [2] = sleepSamples
                let possibleSleepValues = ['ASLEEP', 'INBED', 'UNKNOWN'];
                let { cleanedIgnoredWorkoutValues, cleanedWorkoutValues, } = UTIL._cleanWorkoutObject(values[0], values[1], sendAPI);
                let filteredSleepValues = _.filter(values[2], s => possibleSleepValues.includes(s.value));
                if(sendAPI) {
                    // send api
                    let payload = {
                        end_date:   moment().subtract(1, 'd').format('YYYY-MM-DD'),
                        event_date: `${moment().toISOString(true).split('.')[0]}Z`,
                        sessions:   cleanedWorkoutValues,
                        sleep_data: filteredSleepValues,
                        start_date: moment(startDate).format('YYYY-MM-DD'),
                        user_age:   moment().diff(moment(userObj.personal_data.birth_date, ['YYYY-MM-DD', 'YYYY/MM/DD']), 'years'),
                        user_id:    userObj.id,
                    };
                    PlanActions.postHealthData(payload)
                        .then(() => {
                            return;
                        });
                } else {
                    // remove already synced workouts
                    let trainingSessionsState = store.getState().plan.dailyPlan && store.getState().plan.dailyPlan[0] ?
                        store.getState().plan.dailyPlan[0].training_sessions
                        :
                        [];
                    let workoutsToPatch = _.map(cleanedWorkoutValues, o => {
                        let filteredTrainingSessionsState = _.filter(trainingSessionsState, item =>
                            o.sport_name === item.sport_name && item.source === 0 && UTIL._lessThanTwoHoursAgo(o.end_date, item.created_date)
                        );
                        if(filteredTrainingSessionsState && filteredTrainingSessionsState[0]) {
                            return {
                                event_date:   o.event_date,
                                end_date:     o.end_date,
                                session_type: 6,
                                sport_name:   o.sport_name,
                                duration:     filteredTrainingSessionsState[0].duration_minutes,
                                calories:     o.calories,
                                distance:     o.distance,
                                source:       1,
                                hr_data:      o.hr_data,
                                session_id:   filteredTrainingSessionsState[0].session_id,
                            }
                        }
                        return null;
                    })
                        .filter(a => a);
                    let updatedCleanedWorkoutValues = _.filter(cleanedWorkoutValues, o =>
                        !_.some(trainingSessionsState, item =>
                            o.sport_name === item.sport_name && o.end_date === item.end_date && o.event_date === item.event_date
                        ) &&
                        !_.some(trainingSessionsState, item =>
                            o.sport_name === item.sport_name && item.source === 0 && UTIL._lessThanTwoHoursAgo(o.end_date, item.created_date)
                        )
                    );
                    // store in reducer
                    store.dispatch({
                        type:               DispatchActions.SET_HEALTH_DATA,
                        ignoredWorkoutData: cleanedIgnoredWorkoutValues,
                        sleepData:          filteredSleepValues,
                        workoutData:        updatedCleanedWorkoutValues,
                    });
                    UTIL._patchWorkoutSession(workoutsToPatch, userObj.id);
                    return;
                }
            })
            .catch(err => {
                // console.log('err',err);
                return;
            });
    },

    _cleanWorkoutObject: (workouts, heartRates, isAPI) => {
        let cleanedWorkoutValues = [];
        let cleanedIgnoredWorkoutValues = [];
        if(workouts.length > 0) {
            let filteredHeartRateValues = [];
            // removing any workouts which duration is less than 0.5min (30 sec)
            let filteredWorkouts = _.filter(workouts, workout => moment(workout.end).diff(workout.start, 'seconds') > 30);
            _.map(filteredWorkouts, (workout, index) => {
                let newWorkout = {};
                filteredHeartRateValues = _.filter(heartRates, hr => moment(workout.start) <= moment(hr.startDate) && moment(workout.end) >= moment(hr.endDate));
                // TODO: filteredHeartRateValues DOESN'T SEEM TO WORK
                let otherIndex = _.filter(MyPlanConstants.teamSports, ['label', 'Other'])[0].index;
                let sportName = _.filter(MyPlanConstants.teamSports, (sport, i) => workout.activityName.toLowerCase() === sport.label.toLowerCase().replace(' ', '').replace(' ', '').replace(' ', '').replace('&', 'and'));
                newWorkout.sport_name = sportName[0] ? sportName[0].index : otherIndex;
                newWorkout.event_date = `${workout.start.split('.')[0]}Z`;
                newWorkout.end_date = `${workout.end.split('.')[0]}Z`;
                newWorkout.distance = workout.distance;
                newWorkout.calories = workout.calories;
                newWorkout.session_type = 6;
                newWorkout.source = 1;
                newWorkout.description = '';
                newWorkout.duration = isAPI ? null : workout.duration && workout.duration > 0 ? _.floor(workout.duration / 60) : moment(workout.end).diff(workout.start, 'minutes');
                newWorkout.deleted = false;
                newWorkout.ignored = false;
                newWorkout.hr_data = filteredHeartRateValues;
                newWorkout.post_session_survey = {
                    clear_candidates: [],
                    event_date:       `${moment().toISOString(true).split('.')[0]}Z`,
                    RPE:              null,
                    soreness:         [],
                }
                if(
                    newWorkout.duration &&
                    newWorkout.duration < 15 &&
                    !isAPI &&
                    newWorkout.sport_name === 66
                ) {
                    // 0.5-15 duration = hidden (is not API && is 'Walking' workout)
                    newWorkout.ignored = true;
                    cleanedIgnoredWorkoutValues.push(newWorkout);
                } else {
                    // 15+ = regular
                    cleanedWorkoutValues.push(newWorkout);
                }
            });
        }
        return {
            cleanedIgnoredWorkoutValues,
            cleanedWorkoutValues,
        };
    },

    _lessThanTwoHoursAgo: (startDate, endDate) => moment(startDate).isAfter(moment(endDate).subtract(2, 'hours')),

    _patchWorkoutSession: async (sessions, userId) => {
        _.map(sessions, o => {
            let newSession = {
                user_id:    userId,
                event_date: `${moment().toISOString(true).split('.')[0]}Z`,
                sessions:   [],
            };
            let cleanedSessionObj = {
                event_date:   o.event_date,
                end_date:     o.end_date,
                session_type: 6,
                sport_name:   o.sport_name,
                duration:     o.duration,
                calories:     o.calories,
                distance:     o.distance,
                source:       1,
                hr_data:      o.hr_data,
            };
            newSession.sessions.push(cleanedSessionObj);
            PlanActions.patchSession(o.session_id, newSession);
        });
    },

    /**
      * AsyncStorage save data
      * key -> index of data
      * data -> data to store (if object, will JSON.stringify)
      */
    _storeAsyncStorageData: async (key, data) => {
        let newData = typeof data === 'object' ? JSON.stringify(data) : data;
        try {
            await AsyncStorage.setItem(key, newData);
        } catch (error) {
            console.log('error from _storeAsyncStorageData', error);
        }
    },

    /**
      * AsyncStorage retrieve data
      * key -> index of data
      */
    _retrieveAsyncStorageData: async (key) => {
        /*eslint consistent-return: 0*/
        return await AsyncStorage.getItem(key)
            .then(result => {
                try {
                    return JSON.parse(result);
                } catch (error) {
                    console.log('error from _retrieveAsyncStorageData', error);
                }
            });
    },

    /**
      * AsyncStorage remove data
      * key -> index of data
      */
    _removeAsyncStorageData: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log('error from _removeAsyncStorageData', error);
        }
    },

    /**
      * Test if Obj is empty
      */
    objIsEmpty: (obj) => {
        if (typeof obj === 'object' && !(obj instanceof Array)) {
            if (Object.keys(obj).length === 0) { return true; }
        }
        return false;
    },

    /**
      * Convert Obj to Arr
      */
    objToArr: obj => {
        if (typeof obj === 'object' && !(obj instanceof Array)) {
            if (Object.keys(obj).length === 0) { return false; }
        }
        if (obj instanceof Array) {
            return false;
        }
        return Object.keys(obj).map(k => obj[k]);
    },

    /**
      * Limit characters, placing a ... at the end
      */
    limitChars: (str, limit = 15) => {
        if (str.length > limit) { return `${str.substr(0, limit).trim()}...`; }
        return str;
    },

    /**
      * Decode HTML Entites
      */
    // htmlEntitiesDecode: str => entities.decode(str),

    /**
      * Convert all HTMLEntities when Array
      */
    // convertHtmlEntitiesArray: (arr) => {
    //     const finalArr = arr;

    //     if (arr instanceof Array) {
    //         arr.forEach((item, key) => {
    //             if (item instanceof Array) {
    //                 finalArr[key] = UTIL.convertHtmlEntitiesArray(item);
    //             } else if (typeof item === 'object') {
    //                 finalArr[key] = UTIL.convertHtmlEntitiesObject(item);
    //             } else if (typeof item === 'string') {
    //                 finalArr[key] = entities.decode(striptags(item));
    //             }
    //         });
    //     }

    //     return finalArr;
    // },

    /**
      * Convert all HTMLEntities when Object
      */
    // convertHtmlEntitiesObject: (obj) => {
    //     const finalObj = obj;

    //     if (typeof obj === 'object' && !(obj instanceof Array)) {
    //         Object.keys(obj).forEach((key) => {
    //             const item = obj[key];

    //             if (item instanceof Array) {
    //                 finalObj[key] = UTIL.convertHtmlEntitiesArray(item);
    //             } else if (typeof item === 'object') {
    //                 finalObj[key] = UTIL.convertHtmlEntitiesObject(item);
    //             } else if (typeof item === 'string') {
    //                 finalObj[key] = entities.decode(striptags(item));
    //             }
    //         });
    //     }

    //     return finalObj;
    // },

    /**
      * Strips all HTML tags
      */
    // stripTags: str => striptags(str),

    /**
      * Create an time x-scale.
      * @param {number} start Start date.
      * @param {number} end End date.
      * @param {number} width Width to create the scale with.
      * @return {Function} D3 scale instance.
      */
    // createTimeScaleX: (start, end, width) => d3.scale.scaleTime()
    //     .domain([start, end])
    //     .range([0, width])
    //     .tickFormat(7, '%a %d'),

    /**
      * Create an x-scale.
      * @param {number} start Start value.
      * @param {number} end End value.
      * @param {number} width Width to create the scale with.
      * @return {Function} D3 scale instance.
      */
    // createScaleX: (start, end, width) => d3.scale.scaleLinear()
    //     .domain([start, end]).nice()
    //     .range([0, width]),

    /**
      * Create a y-scale.
      * @param {number} minY Minimum y value to use in our domain.
      * @param {number} maxY Maximum y value to use in our domain.
      * @param {number} height Height for our scale's range.
      * @return {Function} D3 scale instance.
      */
    // createScaleY: (minY, maxY, height, startY) => d3.scale.scaleLinear()
    //     .domain([minY, maxY]).nice()
    //     // We invert our range so it outputs using the axis that React uses.
    //     .range([height, startY])
    //     .clamp(true),

    /**
      * Creates a line graph SVG path that we can then use to render in our
      * React Native application with ART.
      * @param {Array.<Object>} options.data Array of data we'll use to create
      *   our graphs from.
      * @param {function} xAccessor Function to access the x value from our data.
      * @param {function} yAccessor Function to access the y value from our data.
      * @param {number} width Width our graph will render to.
      * @param {number} height Height our graph will render to.
      * @return {Object} Object with data needed to render.
      */
    // createLineGraph({
    //     data,
    //     xAccessor,
    //     yAccessor,
    //     width,
    //     height,
    // }) {
    //     const lastDatum = data[data.length - 1];

    //     const scaleX = this.createTimeScaleX(
    //         data[0].time,
    //         lastDatum.time,
    //         width
    //     );

    //     // Collect all y values.
    //     const allYValues = data.reduce((all, datum) => {
    //         all.push(yAccessor(datum));
    //         return all;
    //     }, []);
    //     // Get the min and max y value.
    //     const extentY = d3Array.extent(allYValues);
    //     const scaleY = this.createScaleY(extentY[0], extentY[1], height);

    //     const lineShape = d3.shape.line()
    //         .x(d => scaleX(xAccessor(d)))
    //         .y(d => scaleY(yAccessor(d)));

    //     return {
    //         data,
    //         scale: {
    //             x: scaleX,
    //             y: scaleY,
    //         },
    //         path:  lineShape(data),
    //         ticks: data.map((datum) => {
    //             const time = xAccessor(datum);
    //             const value = yAccessor(datum);

    //             return {
    //                 x: scaleX(time),
    //                 y: scaleY(value),
    //                 datum,
    //             };
    //         }),
    //     };
    // },
    MS_IN_DAY,
    MS_IN_WEEK:      MS_IN_DAY * 7,
    formatDate:      (date) => `${date < 10 ? '0' : ''}${date}`,
    getStartEndDate: (weekOffset, date = new Date()) => {
        date.setTime(date.getTime() + weekOffset * UTIL.MS_IN_WEEK);
        let dayOfWeek = date.getDay();
        let startOfWeekOffset = dayOfWeek === 1 ? 0 : (dayOfWeek+6)%7;
        let endOfWeekOffset = !dayOfWeek ? 0 : 7-dayOfWeek;
        let startDateObject = new Date(date.getTime() - startOfWeekOffset * UTIL.MS_IN_DAY);
        let endDateObject = new Date(date.getTime() + endOfWeekOffset * UTIL.MS_IN_DAY);
        let newStartDate = `${startDateObject.getFullYear()}-${UTIL.formatDate(startDateObject.getMonth()+1)}-${UTIL.formatDate(startDateObject.getDate())}`;
        let newEndDate = `${endDateObject.getFullYear()}-${UTIL.formatDate(endDateObject.getMonth()+1)}-${UTIL.formatDate(endDateObject.getDate())}`;
        return ({ newStartDate, newEndDate });
    },

    formatInputStyle(formValidationStyleSheet){
        let inputStyle = _.cloneDeep(formValidationStyleSheet);
        inputStyle.borderColor = AppColors.primary.grey.fiftyPercent;
        inputStyle.borderLeftWidth = 0;
        inputStyle.borderRightWidth = 0;
        inputStyle.borderTopWidth = 0;
        inputStyle.color = AppColors.zeplin.yellow;
        inputStyle.textAlign = 'center';
        inputStyle.fontFamily = AppStyles.robotoBold.fontFamily;
        inputStyle.fontWeight = AppStyles.robotoBold.fontWeight;
        return inputStyle;
    }
};

/* Export ==================================================================== */
export default UTIL;
