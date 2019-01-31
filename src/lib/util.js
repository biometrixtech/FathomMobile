/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:08:55
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 11:41:51
 */

import { Alert, AsyncStorage, Platform, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import { Actions as DispatchActions, MyPlan as MyPlanConstants, } from '../constants';
import { Actions as RouterActions, } from 'react-native-router-flux';
import { AppColors, AppStyles } from '../constants';
import { store } from '../store';
import AppleHealthKit from 'rn-apple-healthkit';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import uuidByString from 'uuid-by-string';

import { init as InitActions, } from '../actions';

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

    routeOnLogin: (userObj) => {
        // WARNING: WORK IN PROGRESS
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
            } else if(userObj.onboarding_status && !userObj.onboarding_status.includes('coach-tutorial') && userObj.role === 'coach') {
                RouterActions.tutorial({step: 'coach-tutorial'});
            } else if(userObj.onboarding_status && !userObj.onboarding_status.includes('tutorial-tutorial') && userObj.role === 'athlete') {
                // NOTE: THIS IS THE LAST SCREEN PRIOR TO MYPLAN
                RouterActions.tutorial({step: 'tutorial-tutorial'});
            } else if(userObj.onboarding_status && !userObj.onboarding_status.includes('survey-questions')) {
                RouterActions.survey();
            } else {
                if(userObj.role === 'coach') {
                    RouterActions.coachesDashboard();
                } else {
                    RouterActions.myPlan();
                }
            }
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
            let height = UTIL._getHealthHeight(appleHealthKitPerms);
            let weight = UTIL._getWeightHeight(appleHealthKitPerms);
            let dob = UTIL._getDOBHeight(appleHealthKitPerms);
            let sex = UTIL._getSexHeight(appleHealthKitPerms);
            return [height, weight, dob, sex];
        }
        return [];
    },

    _getHealthHeight: appleHealthKitPerms => {
        return new Promise((resolve, reject) => {
            AppleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                AppleHealthKit.getLatestHeight(null, (heightError: String, heightResults: Object) => {
                    if(heightError) { reject(heightError); }
                    // console.log('heightResults',heightResults);
                    resolve(heightResults);
                });
            });
        });
    },

    _getWeightHeight: appleHealthKitPerms => {
        let weightOptions = {
            unit: 'pound',
        };
        return new Promise((resolve, reject) => {
            AppleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                AppleHealthKit.getLatestWeight(weightOptions, (weightError: Object, weightResults: Object) => {
                    if(weightError) { reject(weightError); }
                    // console.log('weightResults',weightResults);
                    resolve(weightResults);
                });
            });
        });
    },

    _getDOBHeight: appleHealthKitPerms => {
        return new Promise((resolve, reject) => {
            AppleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                AppleHealthKit.getDateOfBirth(null, (dobError: Object, dobResults: Object) => {
                    if(dobError) { reject(dobError); }
                    // console.log('dobResults',dobResults);
                    resolve(dobResults);
                });
            });
        });
    },

    _getSexHeight: appleHealthKitPerms => {
        return new Promise((resolve, reject) => {
            AppleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                AppleHealthKit.getBiologicalSex(null, (sexError: Object, sexResults: Object) => {
                    if(sexError) { reject(sexError); }
                    // console.log('sexResults',sexResults);
                    resolve(sexResults);
                });
            });
        });
    },

    _getAppleHealthTimes: (lastSyncDate, numberOfDaysAgo) => {
        return {
            daysAgo:      moment().subtract(numberOfDaysAgo, 'd').set('hour', 3).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString(),
            now:          moment().toISOString(),
            syncDate:     lastSyncDate && moment().diff(moment(lastSyncDate), 'days') > 0 ? moment(lastSyncDate).set('hour', 3).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString() : null,
            today3AM:     moment().set('hour', 3).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString(),
            yesterday5PM: moment().subtract(1, 'd').set('hour', 17).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString(),
        };
    },

    getAppleHealthKitData: (lastSyncDate, numberOfDaysAgo = 35) => {
        if(Platform.OS === 'ios') {
            // grab permissions
            let appleHealthKitPerms = UTIL._getAppleHealthKitPerms();
            // set start and end dates
            let { daysAgo, now, syncDate, today3AM, yesterday5PM, } = UTIL._getAppleHealthTimes(lastSyncDate, numberOfDaysAgo);
            // setup variables
            let reducersPromisesArray = [];
            let apiPromisesArray = [];
            // combine promises and trigger next step
            if(lastSyncDate) {
                // need to make 1 call
                // 1- today3AM - now (workout, & hr) (store locally for RS or PSS)
                reducersPromisesArray.push(UTIL._getWorkoutSamples(appleHealthKitPerms, today3AM, now));
                reducersPromisesArray.push(UTIL._getHeartRateSamples(appleHealthKitPerms, today3AM, now));
                // 2- yesterday5PM - now (sleep) (store locally for RS)
                reducersPromisesArray.push(UTIL._getSleepSamples(appleHealthKitPerms, yesterday5PM, now));
                // trigger API or reducer storage
                UTIL._handlePromises(reducersPromisesArray, false);
                if(
                    lastSyncDate &&
                    moment().diff(moment(lastSyncDate), 'days') > 0 &&
                    syncDate
                ) {
                    // need to another call
                    // 1- if lastSyncDate is not today, syncDate - today3AM (workout & hr) (send specific API)
                    apiPromisesArray.push(UTIL._getWorkoutSamples(appleHealthKitPerms, syncDate, today3AM));
                    apiPromisesArray.push(UTIL._getHeartRateSamples(appleHealthKitPerms, syncDate, today3AM));
                    // 2- syncDate - yesterday5PM (sleep) (send specific API)
                    apiPromisesArray.push(UTIL._getSleepSamples(appleHealthKitPerms, syncDate, yesterday5PM));
                    // trigger API or reducer storage
                    UTIL._handlePromises(apiPromisesArray, true);
                }
            } else {
                // need to make 2 calls
                // 1- today3AM - now (workout & hr) (store locally for RS or PSS)
                reducersPromisesArray.push(UTIL._getWorkoutSamples(appleHealthKitPerms, today3AM, now));
                reducersPromisesArray.push(UTIL._getHeartRateSamples(appleHealthKitPerms, today3AM, now));
                // 2- yesterday5PM - now (sleep) (store locally for RS)
                reducersPromisesArray.push(UTIL._getSleepSamples(appleHealthKitPerms, yesterday5PM, now));
                // trigger API or reducer storage
                UTIL._handlePromises(reducersPromisesArray, false);
                // 3- daysAgo - today3AM (workout & hr) (send specific API)
                apiPromisesArray.push(UTIL._getWorkoutSamples(appleHealthKitPerms, daysAgo, today3AM));
                apiPromisesArray.push(UTIL._getHeartRateSamples(appleHealthKitPerms, daysAgo, today3AM));
                // 4- daysAgo - yesterday5PM (sleep) (send specific API)
                apiPromisesArray.push(UTIL._getSleepSamples(appleHealthKitPerms, daysAgo, yesterday5PM));
                // trigger API or reducer storage
                UTIL._handlePromises(apiPromisesArray, true);
            }
        }
    },

    _getWorkoutSamples: (appleHealthKitPerms, startDate, endDate) => {
        let workoutOptions = {
            startDate,
            endDate,
        };
        return new Promise((resolve, reject) => {
            AppleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                AppleHealthKit.getWorkout(workoutOptions, (workoutError: Object, workoutResults: Array<Object>) => {
                    if(workoutError) { reject(workoutError); }
                    // console.log('workoutResults',workoutResults);
                    resolve(workoutResults);
                });
            });
        });
    },

    _getHeartRateSamples: (appleHealthKitPerms, startDate, endDate) => {
        let heartRateOptions = {
            startDate,
            endDate,
        };
        return new Promise((resolve, reject) => {
            AppleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                AppleHealthKit.getHeartRateSamples(heartRateOptions, (hrError: Object, hrResults: Array<Object>) => {
                    if(hrError) { reject(hrError); }
                    // console.log('hrResults',hrResults);
                    resolve(hrResults);
                });
            });
        });
    },

    _getSleepSamples: (appleHealthKitPerms, startDate, endDate) => {
        let sleepOptions = {
            startDate,
            endDate,
        };
        return new Promise((resolve, reject) => {
            AppleHealthKit.initHealthKit(appleHealthKitPerms, (initError: String, results: Object) => {
                if(initError) { reject(initError); }
                AppleHealthKit.getSleepSamples(sleepOptions, (sleepError: Object, sleepResults: Array<Object>) => {
                    if(sleepError) { reject(sleepError); }
                    // console.log('sleepResults',sleepResults);
                    resolve(sleepResults);
                });
            });
        });
    },

    _handlePromises: (promisesArray, sendAPI) => {
        // NOTE: when sending now to API, `${now.split('.')[0]}Z}`
        Promise
            .all(promisesArray)
            .then(values => {
                console.log(sendAPI,values);
                // [0] = workoutValues, [1] = heartRateSamples, [2] = sleepSamples
                let possibleSleepValues = ['ASLEEP', 'INBED', 'UNKNOWN'];
                let cleanedWorkoutValues = UTIL._cleanWorkoutObject(values[0], values[1]);
                let filteredSleepValues = _.filter(values[2], s => possibleSleepValues.includes(s.value));
                if(sendAPI) {
                    // send api
                    // TODO:
                } else {
                    // store in reducer
                    store.dispatch({
                        type:        DispatchActions.SET_HEALTH_DATA,
                        sleepData:   filteredSleepValues,
                        workoutData: cleanedWorkoutValues,
                    });
                }
            })
            .catch(err => {
                console.log('err',err);
            });
    },

    getAppleHealthKitFirstTimeData: (numberOfDaysAgo = 35, callback) => {
        if(Platform.OS === 'ios') {
            // grab permissions
            let appleHealthKitPerms = UTIL._getAppleHealthKitPerms();
            // set start and end dates
            let { daysAgo, now, today3AM, yesterday5PM, } = UTIL._getAppleHealthTimes(null, numberOfDaysAgo);
            // setup variables
            let reducersPromisesArray = [];
            let apiPromisesArray = [];
            // combine promises and trigger next step
            // need to make 2 calls
            // 1- today3AM - now (workout & hr) (store locally for RS or PSS)
            reducersPromisesArray.push(UTIL._getWorkoutSamples(appleHealthKitPerms, today3AM, now));
            reducersPromisesArray.push(UTIL._getHeartRateSamples(appleHealthKitPerms, today3AM, now));
            // 2- yesterday5PM - now (sleep) (store locally for RS)
            reducersPromisesArray.push(UTIL._getSleepSamples(appleHealthKitPerms, yesterday5PM, now));
            // trigger API or reducer storage
            return UTIL._handleReturnedPromises(reducersPromisesArray, false, () => {
                // 3- daysAgo - today3AM (workout & hr) (send specific API)
                apiPromisesArray.push(UTIL._getWorkoutSamples(appleHealthKitPerms, daysAgo, today3AM));
                apiPromisesArray.push(UTIL._getHeartRateSamples(appleHealthKitPerms, daysAgo, today3AM));
                // 4- daysAgo - yesterday5PM (sleep) (send specific API)
                apiPromisesArray.push(UTIL._getSleepSamples(appleHealthKitPerms, daysAgo, yesterday5PM));
                // trigger API or reducer storage
                UTIL._handleReturnedPromises(apiPromisesArray, true);
                callback();
            });
        }
    },

    _handleReturnedPromises: (promisesArray, sendAPI, callback) => {
        return Promise
            .all(promisesArray)
            .then(values => {
                // [0] = workoutValues, [1] = heartRateSamples, [2] = sleepSamples
                let possibleSleepValues = ['ASLEEP', 'INBED', 'UNKNOWN'];
                let cleanedWorkoutValues = UTIL._cleanWorkoutObject(values[0], values[1]);
                let filteredSleepValues = _.filter(values[2], s => possibleSleepValues.includes(s.value));
                if(sendAPI) {
                    // send api
                    // TODO:
                    if(callback) {
                        callback();
                    }
                } else {
                    // store in reducer
                    store.dispatch({
                        type:        DispatchActions.SET_HEALTH_DATA,
                        sleepData:   filteredSleepValues,
                        workoutData: cleanedWorkoutValues,
                    });
                    if(callback) {
                        callback();
                    }
                }
            })
            .catch(err => {
                console.log('err',err);
                if(callback) {
                    callback();
                }
            });
    },

    _cleanWorkoutObject: (workouts, heartRates) => {
        let cleanedWorkoutValues = [];
        if(workouts.length > 0) {
            let filteredHeartRateValues = [];
            _.map(workouts, (workout, index) => {
                let newWorkout = {};
                filteredHeartRateValues = _.filter(heartRates, hr => moment(workout.start) <= moment(hr.startDate) && moment(workout.end) >= moment(hr.endDate));
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
                newWorkout.duration = moment(workout.end).diff(workout.start, 'minutes');
                newWorkout.deleted = false;
                newWorkout.hr_data = filteredHeartRateValues;
                newWorkout.post_session_survey = {
                    clear_candidates: [],
                    event_date:       `${moment().toISOString(true).split('.')[0]}Z`,
                    RPE:              null,
                    soreness:         [],
                }
                cleanedWorkoutValues.push(newWorkout);
            });
        }
        return cleanedWorkoutValues;
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
        inputStyle.color = AppColors.primary.yellow.hundredPercent;
        inputStyle.textAlign = 'center';
        inputStyle.fontFamily = AppStyles.robotoBold.fontFamily;
        inputStyle.fontWeight = AppStyles.robotoBold.fontWeight;
        return inputStyle;
    }
};

/* Export ==================================================================== */
export default UTIL;
