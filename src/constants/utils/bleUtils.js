// import reactnative components
import { AsyncStorage } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

// import actions, utils
import { ble as BLEActions, plan as planActions } from '../../actions';
import { AppColors } from '../../constants';
import { AppUtil } from '../../lib';

const bleUtils = {

    handleBLESteps(ble, userId) {
        // setup variables
        const imagePrefix = '../../../assets/images/sensor/';
        let animated = false;
        let sensorStatusResults = null;
        // make sure we have a sensor paired
        if(ble.accessoryData && ble.accessoryData.sensor_pid && ble.accessoryData.mobile_udid === AppUtil.getDeviceUUID()) {
            return BLEActions.startConnection(ble.accessoryData.sensor_pid)
                .then(res => {
                    return BLEActions.getSingleSensorStatus(ble.accessoryData.sensor_pid);
                })
                .then(sensorStatusResult => {
                    console.log('getSingleSensorStatus',sensorStatusResult);
                    sensorStatusResults = sensorStatusResult;
                    return AppUtil._retrieveAsyncStorageData('practices');
                })
                .then(asyncStorageResult => {
                    if(asyncStorageResult && asyncStorageResult.length > 0) {
                        // we still have items in our local storage, send to API
                        console.log('we still have items in our local storage, send to API', asyncStorageResult);
                        // TODO: what do we want to do here??????
                    }
                    return bleUtils.loopThroughPractices(sensorStatusResults.numberOfPractices, ble.accessoryData.sensor_pid, userId);
                })
                .then(() => {
                    return BLEActions.startDisconnection(ble.accessoryData.sensor_pid);
                })
                .then(res => {
                    console.log('res-startDisconnection',res);
                    return Promise.resolve({ animated, bleImage: require(`${imagePrefix}sensor.png`), });
                })
                .catch(err => {
                    console.log('err---',err);
                    BLEActions.startDisconnection(ble.accessoryData.sensor_pid);
                    return Promise.reject({ bleImage: require(`${imagePrefix}sensor.png`) });
                });
        }
        return Promise.resolve({ animated, bleImage: null });
    },

    async loopThroughPractices(numberOfPractices, sensor_pid, userId) {
        // setup variables
        let currentIndex = 0;
        let practices = [];
        // loop through our practices
        for (let i = 0; i < numberOfPractices; i += 1) {
            currentIndex = i;
            /*eslint no-loop-func:*/
            /*eslint-env es6*/
            await new Promise((resolve, reject) => {
                return BLEActions.getAllPracticeDetails(sensor_pid, currentIndex)
                    .then(allPracticeDetails => {
                        let isLast = (currentIndex + 1) === numberOfPractices;
                        console.log(`allPracticeDetails - ${currentIndex}`,allPracticeDetails);
                        practices.push(allPracticeDetails);
                        if(isLast) {
                            // save 'practices' to AsyncStore
                            AppUtil._storeAsyncStorageData('practices', practices);
                        }
                        return practices.length === numberOfPractices ? practices : null;
                    })
                    .then(sessionsArray => {
                        console.log('sessionsArray',sessionsArray);
                        if(sessionsArray && sessionsArray.length > 0) {
                            let dataObj = {};
                            dataObj.user_id = userId;
                            dataObj.sessions = sessionsArray;
                            dataObj.last_sensor_sync = `${moment().toISOString(true).split('.')[0]}Z`;
                            planActions.postSingleSensorData(dataObj)
                                .then(result => {
                                    // TODO: BRING BACK TWO FUNCTIONS
                                    // delete AsyncStorage record
                                    // AppUtil._removeAsyncStorageData('practices');
                                    // 0x79 (BLEActions.deleteSinglePractice) -> delete practice
                                    // bleUtils.deleteSesnorData(sensor_pid, numberOfPractices);
                                    return resolve('done!');
                                });
                        }
                        return resolve();
                    })
                    .catch(error => {
                        console.log('ERROR - allPracticeDetails',error);
                    });
            });
        }
    },

    deleteSesnorData(sensorId, total) {
        let currentIndex = 0;
        let promiseChain = Promise.resolve();
        for (let i = 0; i < total; i += 1) {
            currentIndex = i;
            /*eslint no-shadow: ["error", { "allow": ["currentIndex"] }]*/
            /*eslint-env es6*/
            const makeNextPromise = currentIndex => () => {
                return BLEActions.deleteSinglePractice(sensorId, i);
            }
            promiseChain = promiseChain.then(makeNextPromise(currentIndex));
        }
    },

    systemStatusMapping(status) {
        let color = AppColors.sensor.notConnected;
        switch (status) {
        case 0:
            color = AppColors.sensor.notConnected;
            break;
        case 1:
            color = AppColors.sensor.charging;
            break;
        case 2:
            color = AppColors.sensor.good;
            break;
        case 3:
            color = AppColors.sensor.good;
            break;
        case 4:
            color = AppColors.sensor.unabled;
            break;
        case 5:
            color = AppColors.sensor.unabled;
            break;
        default:
            color = AppColors.sensor.notConnected;
        }
        return color;
    },

    sensorStatusBar(status, batteryLevel) {
        let backgroundColor = AppColors.sensor.notConnected;
        let batteryFollowUp = false;
        let followUpText = 'NOT CONNECTED';
        let lastSyncFollowUp = false;
        switch (status) {
        case 0:
            backgroundColor = AppColors.sensor.notConnectedBackground;
            followUpText = 'NOT CONNECTED';
            lastSyncFollowUp = true;
            break;
        case 1:
            backgroundColor = AppColors.sensor.chargingBackground;
            batteryFollowUp = `${(batteryLevel * 0.095).toFixed(1)}hrs`;
            followUpText = 'CHARGING';
            break;
        case 2:
            backgroundColor = AppColors.sensor.good;
            batteryFollowUp = `${(batteryLevel * 0.095).toFixed(1)}hrs`;
            followUpText = 'READY FOR PLAY';
            break;
        case 3:
            backgroundColor = AppColors.sensor.good;
            batteryFollowUp = `${(batteryLevel * 0.095).toFixed(1)}hrs`;
            followUpText = 'LOGGING ACTIVITY';
            break;
        case 4:
            backgroundColor = AppColors.sensor.unabled;
            followUpText = 'LOW BATTERY, RETURN TO KIT';
            break;
        case 5:
            backgroundColor = AppColors.sensor.wrongKit;
            followUpText = 'SENSOR PLACE IN WRONG KIT';
            break;
        default:
            backgroundColor = AppColors.sensor.notConnected;
            followUpText = 'NOT CONNECTED';
        }
        return {
            backgroundColor,
            batteryFollowUp,
            followUpText,
            lastSyncFollowUp,
        };
    },

}

export default bleUtils;
