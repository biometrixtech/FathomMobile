// import actions, utils
import { ble as BLEActions, plan as planActions, } from '../../actions';
import { AppColors, ErrorMessages, } from '../../constants';
import { AppUtil, } from '../../lib';

// import third-party libraries
import _ from 'lodash';
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

    async processPractices(sensor_pid, userId) {
        let practiceDetails = null;
        let userPractices = null;
        // STEP 1a: grab all practice details
        await BLEActions.getAllPracticeDetails(sensor_pid)
            .then(allPracticeDetails => {
                practiceDetails = allPracticeDetails;
                // STEP 1b: grab all locally practice details
                return AppUtil._retrieveAsyncStorageData(userId);
            })
            .then(asyncResponse => {
                // STEP 2: store locally
                if(!asyncResponse) {
                    userPractices = {};
                    userPractices.practices = {};
                } else {
                    userPractices = asyncResponse;
                }
                userPractices.practices[moment(practiceDetails.start_time).unix()] = practiceDetails;
                return AppUtil._storeAsyncStorageData(userId, userPractices);
            })
            .then(() => {
                // STEP 3: delete off of sensor
                return BLEActions.deleteSinglePractice(sensor_pid);
            })
            .then(() => {
                return Promise.resolve();
            })
            .catch(err => Promise.reject(ErrorMessages.sensor.retreivalError));
    },

    deleteAllSingleSensorPractices(sensorId) {
        return BLEActions.deleteAllSingleSensorPractices(sensorId)
            .then(() => Promise.resolve('Successfully PAIRED to sensor'))
            .catch(() => Promise.reject('Failed to PAIR to sensor'));
    },

    finalizeBleData(practices, userId) {
        let sessionsArray = [];
        _.map(practices, (practice, key) => {
            sessionsArray.push(practice);
        });
        let dataObj = {};
        dataObj.user_id = userId;
        dataObj.sessions = sessionsArray;
        dataObj.last_sensor_sync = `${moment().toISOString(true).split('.')[0]}Z`;
        return planActions.postSingleSensorData(dataObj)
            .then(result => {
                // delete AsyncStorage record
                return AppUtil._removeAsyncStorageData(userId)
                    .then(() => Promise.resolve())
                    .catch(err => Promise.reject(ErrorMessages.sensor.serverError));
            })
            .catch(err => Promise.reject(ErrorMessages.sensor.serverError));
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
