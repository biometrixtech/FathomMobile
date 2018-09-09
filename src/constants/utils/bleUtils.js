// import actions, utils
import { ble as BLEActions, plan as planActions, } from '../../actions';
import { AppColors, ErrorMessages, } from '../../constants';
import { AppUtil, } from '../../lib';

// import third-party libraries
import moment from 'moment';

const bleUtils = {

    handleBLESingleSensorStatus(ble, toDisconnect = true) {
        // setup variables
        let systemStatus = null;
        let batteryCharge = null;
        let numberOfPractices = null;
        // make sure we have a sensor paired
        return BLEActions.startConnection(ble.accessoryData.sensor_pid)
            .catch(err => {
                BLEActions.startDisconnection(ble.accessoryData.sensor_pid);
                return Promise.reject(ErrorMessages.sensor.connectionError);
            })
            .then(res => BLEActions.getSingleSensorStatus(ble.accessoryData.sensor_pid))
            .then(response => {
                systemStatus = response.systemStatus;
                batteryCharge = response.batteryCharge;
                numberOfPractices = response.numberOfPractices;
                if(toDisconnect) {
                    return BLEActions.startDisconnection(ble.accessoryData.sensor_pid);
                }
                return Promise.resolve({ systemStatus, batteryCharge, numberOfPractices });
            })
            .then(res => Promise.resolve({ systemStatus, batteryCharge, numberOfPractices }))
            .catch(err => {
                BLEActions.startDisconnection(ble.accessoryData.sensor_pid);
                return Promise.reject(ErrorMessages.sensor.connectionError);
            });
    },

    // handleBLESteps(ble, userId) {
    //     // setup variables
    //     const imagePrefix = '../../../assets/images/sensor/';
    //     let animated = false;
    //     let timestamps = [moment().format('MMMM Do YYYY, h:mm:ss.SSS a')];
    //     // make sure we have a sensor paired
    //     return BLEActions.startConnection(ble.accessoryData.sensor_pid)
    //         .catch(err => {
    //             BLEActions.startDisconnection(ble.accessoryData.sensor_pid);
    //             return Promise.reject(err);
    //         })
    //         .then(res => {
    //             timestamps = timestamps.concat([moment().format('MMMM Do YYYY, h:mm:ss.SSS a')]);
    //             return BLEActions.getSingleSensorStatus(ble.accessoryData.sensor_pid);
    //         })
    //         .then(sensorStatusResult => {
    //             timestamps = timestamps.concat([moment().format('MMMM Do YYYY, h:mm:ss.SSS a')]);
    //             return bleUtils.loopThroughPractices(sensorStatusResult.numberOfPractices, ble.accessoryData.sensor_pid, userId);
    //         })
    //         .then(() => {
    //             timestamps = timestamps.concat([moment().format('MMMM Do YYYY, h:mm:ss.SSS a')]);
    //             return BLEActions.startDisconnection(ble.accessoryData.sensor_pid);
    //         })
    //         .then(res => {
    //             timestamps = timestamps.concat([moment().format('MMMM Do YYYY, h:mm:ss.SSS a')]);
    //             console.log('handleBLESteps timestamps',timestamps);
    //             return Promise.resolve({ animated, bleImage: require(`${imagePrefix}sensor.png`), isFetched: true, });
    //         })
    //         .catch(err => {
    //             BLEActions.startDisconnection(ble.accessoryData.sensor_pid);
    //             return Promise.reject({ bleImage: require(`${imagePrefix}sensor.png`), isFetched: true, });
    //         });
    // },

    async processPractices(sensor_pid) {
        await BLEActions.getAllPracticeDetails(sensor_pid)
            .then(allPracticeDetails => {
                console.log(`allPracticeDetails - ${0}`,allPracticeDetails);
                return Promise.resolve();
            })
            .catch(err => Promise.reject(ErrorMessages.sensor.retreivalError));
    },

    // async loopThroughPractices(numberOfPractices, sensor_pid, userId) {
    //     // setup variables
    //     let currentIndex = 0;
    //     let practices = [];
    //     // loop through our practices
    //     for (let i = 0; i < numberOfPractices; i += 1) {
    //         currentIndex = i;
    //         let timestamps = [moment().format('MMMM Do YYYY, h:mm:ss.SSS a')];
    //         /*eslint no-loop-func:*/
    //         /*eslint-env es6*/
    //         await new Promise((resolve, reject) => {
    //             return BLEActions.getAllPracticeDetails(sensor_pid, currentIndex)
    //                 .then(allPracticeDetails => {
    //                     timestamps = timestamps.concat([moment().format('MMMM Do YYYY, h:mm:ss.SSS a')]);
    //                     let isLast = (currentIndex + 1) === numberOfPractices;
    //                     console.log(`allPracticeDetails - ${currentIndex}`,allPracticeDetails);
    //                     practices.push(allPracticeDetails);
    //                     if(isLast) {
    //                         // save 'practices' to AsyncStore
    //                         AppUtil._storeAsyncStorageData('practices', practices);
    //                     }
    //                     return practices.length === numberOfPractices ? practices : null;
    //                 })
    //                 .then(sessionsArray => {
    //                     console.log('sessionsArray',sessionsArray);
    //                     if(sessionsArray && sessionsArray.length > 0) {
    //                         let dataObj = {};
    //                         dataObj.user_id = userId;
    //                         dataObj.sessions = sessionsArray;
    //                         dataObj.last_sensor_sync = `${moment().toISOString(true).split('.')[0]}Z`;
    //                         return planActions.postSingleSensorData(dataObj)
    //                             .then(result => {
    //                                 timestamps = timestamps.concat([moment().format('MMMM Do YYYY, h:mm:ss.SSS a')]);
    //                                 // TODO: BRING BACK TWO FUNCTIONS
    //                                 // delete AsyncStorage record
    //                                 // AppUtil._removeAsyncStorageData('practices');
    //                                 // 0x7C (BLEActions.deleteAllSingleSensorPractices) -> delete all practices
    //                                 return BLEActions.deleteAllSingleSensorPractices(sensor_pid)
    //                                     .then(response => {
    //                                         timestamps = timestamps.concat([moment().format('MMMM Do YYYY, h:mm:ss.SSS a')]);
    //                                         console.log(`loopThroughPractices timestamps #${i}`,timestamps);
    //                                         console.log('response',response);
    //                                         return resolve();
    //                                     })
    //                                     .catch(err => {
    //                                         console.log('err',err);
    //                                         return reject();
    //                                     });
    //                             });
    //                     }
    //                     timestamps = timestamps.concat([moment().format('MMMM Do YYYY, h:mm:ss.SSS a')]);
    //                     console.log(`loopThroughPractices timestamps #${i}`,timestamps);
    //                     return resolve();
    //                 })
    //                 .catch(error => {
    //                     console.log('ERROR - allPracticeDetails',error);
    //                     return reject();
    //                 });
    //         });
    //     }
    // },

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
