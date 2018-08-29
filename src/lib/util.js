/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:08:55
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 11:41:51
 */

import { Alert, AsyncStorage } from 'react-native';

// import third-party libraries
import DeviceInfo from 'react-native-device-info';
import uuidByString from 'uuid-by-string';
import { AppColors, AppFonts, AppStyles } from '../constants';
import { store } from '../store';
import _ from 'lodash';
import { Actions as DispatchActions, ErrorMessages, } from '../constants';

import { init as InitActions, } from '../actions';

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

    getNetworkStatus: () => {
        // if connection wifi || cellular
            // ping our server (???)
                // T -> status >= 500
                    // T -> ping always available server
                        // T -> ErrorMessages.serverUnavailable; !!!MSG!!!
                        // F -> ErrorMessages.noInternetConnection; !!!MSG!!!
                    // F -> we good!
                // F -> ping always available server
                    // T -> ErrorMessages.serverUnavailable; !!!MSG!!!
                    // F -> ErrorMessages.noInternetConnection; !!!MSG!!!
        // else -> ErrorMessages.noInternetConnection; !!!MSG!!!
        return new Promise((resolve, reject) => {
            const serverToTest = 'https://www.google.com/';
            let currentState = store.getState();
            let connectionInfo = currentState.init.connectionInfo;
            let returnObj = {
                connectionInfo: connectionInfo,
                displayMessage: false,
                message:        null,
            };
            console.log('connectionInfo',connectionInfo);
            if(connectionInfo.online && (connectionInfo.connectionType === 'wifi' || connectionInfo.connectionType === 'cellular') ) {
                InitActions.getMaintenanceWindow()
                    .then(response => {
                        console.log('RESPONSE+',response);
                        if(response.status >= 500) {
                            /*global fetch*/
                            fetch(serverToTest)
                                .then(res => {
                                    if(res.status >= 400) {
                                        returnObj.message = ErrorMessages.serverUnavailable;
                                        returnObj.displayMessage = true;
                                    }
                                    return resolve(returnObj);
                                })
                                .catch(error => {
                                    returnObj.message = ErrorMessages.noInternetConnection;
                                    returnObj.displayMessage = true;
                                    return resolve(returnObj);
                                });
                        }
                    })
                    .catch(err => {
                        returnObj.displayMessage = true;
                        /*global fetch*/
                        fetch(serverToTest)
                            .then(res => {
                                if(res.status >= 400) {
                                    returnObj.message = ErrorMessages.serverUnavailable;
                                }
                                return resolve(returnObj);
                            })
                            .catch(error => {
                                returnObj.message = ErrorMessages.noInternetConnection;
                                return resolve(returnObj);
                            });
                    });
            }
            // no internet
            returnObj.message = ErrorMessages.noInternetConnection;
            returnObj.displayMessage = true;
            return resolve(returnObj);
        });
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
        return await AsyncStorage.getItem(key)
            .then(result => {
                if (result) {
                    try {
                        result = JSON.parse(result);
                    } catch (error) {
                        console.log('error from _retrieveAsyncStorageData', error);
                    }
                }
                return result;
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
