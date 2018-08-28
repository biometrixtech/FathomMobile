// import reactnative components
import { AsyncStorage } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

// import actions, utils
import { ble as BLEActions, plan as planActions } from '../../actions';
import { AppUtil } from '../../lib';

const bleUtils = {

    handleBLESteps(ble, userId) {
        console.log('ble',ble);
        // setup variables
        const imagePrefix = '../../../assets/images/sensor/';
        let animated = false;
        let bleImage = null;
        let currentIndex = 0;
        let practices = [];
        // make sure we have a sensor paired
        if(ble.accessoryData && ble.accessoryData.sensor_pid && ble.accessoryData.mobile_udid === AppUtil.getDeviceUUID()) {
            BLEActions.getSingleSensorStatus(ble.accessoryData.sensor_pid)
                .then(res => {
                    console.log('getSingleSensorStatus',res);
                    AppUtil._retrieveAsyncStorageData('practices')
                        .then(result => {
                            if(result && result.length > 0) {
                                // we still have items in our local storage, send to API
                                console.log('we still have items in our local storage, send to API', result);
                                // send built obj to AWS - planActions.postSingleSensorData(dataObj);
                            }
                        });
                    // res.systemStatus
                    // res.batteryCharge
                    // res.numberOfPractices
                    let promiseChain = Promise.resolve();
                    for (let i = 0; i < res.numberOfPractices; i += 1) {
                        currentIndex = i;
                        /*eslint no-shadow: ["error", { "allow": ["currentIndex"] }]*/
                        const makeNextPromise = currentIndex => () => {
                            return BLEActions.getAllPracticeDetails(ble.accessoryData.sensor_pid, currentIndex)
                                .then(allPracticeDetails => {
                                    let isLast = (currentIndex + 1) === res.numberOfPractices;
                                    console.log(`allPracticeDetails - ${currentIndex}`,allPracticeDetails);
                                    practices.push(allPracticeDetails);
                                    if(isLast) {
                                        // save 'practices' to AsyncStore
                                        AppUtil._storeAsyncStorageData('practices', practices);
                                    }
                                    return practices.length === res.numberOfPractices ? practices : null;
                                })
                                .catch(error => {
                                    console.log('ERROR - allPracticeDetails',error);
                                });
                        }
                        promiseChain = promiseChain
                            .then(makeNextPromise(currentIndex))
                            .then(sessionsArray => {
                                if(sessionsArray) {
                                    console.log('sessionsArray',sessionsArray);
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
                                            // bleUtils.deleteSesnorData(ble.accessoryData.sensor_pid, res.numberOfPractices);
                                        });
                                }
                            });
                    }
                    // if(!ble.bluetoothOn) {
                    //     // bluetooth off => iconSensorStatusBtOff.png
                    //     bleImage = require(`${imagePrefix}iconSensorStatusBtOff.png`);
                    // } else {
                    //     if(sensorData.isSensorConnected) {
                    //         // sensor connected no operation => iconSensorStatusConnected.png
                    //         // sensor connected sensor in session => iconSensorStatusInSession.png
                    //         // sensor connected operation in process - no operation (rotate as loading) => iconSensorSyncingConnected.png
                    //         // sensor connected operation in process - sensor in session (rotate as loading) => iconSensorSyncingInSession.png
                    //         animated = true;
                    //         bleImage = require(`${imagePrefix}iconSensorSyncingConnected.png`);
                    //     } else {
                    //         // sensor not connected => iconSensorStatusNotConnected.png
                    //         bleImage = require(`${imagePrefix}iconSensorStatusNotConnected.png`);
                    //     }
                    // }
                })
                .catch(err => {
                    console.log('err',err);
                });
        }
    },

    deleteSesnorData(sensorId, total) {
        let currentIndex = 0;
        let promiseChain = Promise.resolve();
        for (let i = 0; i < total; i += 1) {
            currentIndex = i;
            const makeNextPromise = currentIndex => () => {
                return BLEActions.deleteSinglePractice(sensorId, i);
            }
            promiseChain = promiseChain.then(makeNextPromise(currentIndex));
        }
    },

    systemStatusMapping(status) {
        // 0x00 - Undefined status
        // 0x01 - System in kit, charging or fully charged
        // 0x02 - System out of kit, can enter practice
        // 0x03 - System in practice
        // 0x04 - System battery low (<=5%)
        // 0x05 - System was placed in unknown kit
    },

}

export default bleUtils;
