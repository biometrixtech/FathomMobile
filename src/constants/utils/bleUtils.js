// import third-party libraries

// import actions, utils
import { ble as BLEActions } from '../../actions';
import { AppUtil } from '../../lib';

const bleUtils = {

    handleBLESteps(ble) {
        console.log('ble',ble);
        // setup variables
        const imagePrefix = '../../../assets/images/sensor/';
        let animated = false;
        let bleImage = null;
        // make sure we have a sensor paired
        if(ble.accessoryData && ble.accessoryData.sensor_uid && ble.accessoryData.mobile_uid === AppUtil.getDeviceUUID()) {
            const sensorData = BLEActions.getSingleSensorSavedPractices(ble.accessoryData.sensor_uid);
            console.log('sensorData',sensorData);
            if(!ble.bluetoothOn) {
                // bluetooth off => iconSensorStatusBtOff.png
                bleImage = require(`${imagePrefix}iconSensorStatusBtOff.png`);
            } else {
                if(sensorData.isSensorConnected) {
                    // sensor connected no operation => iconSensorStatusConnected.png
                    // sensor connected sensor in session => iconSensorStatusInSession.png
                    // sensor connected operation in process - no operation (rotate as loading) => iconSensorSyncingConnected.png
                    // sensor connected operation in process - sensor in session (rotate as loading) => iconSensorSyncingInSession.png

                    // animated = true;
                    // bleImage = require(`${imagePrefix}iconSensorSyncingConnected.png`);
                } else {
                    // sensor not connected => iconSensorStatusNotConnected.png
                    bleImage = require(`${imagePrefix}iconSensorStatusNotConnected.png`);
                }
            }
        }
        return {
            animated,
            bleImage,
        };
    },

}

export default bleUtils;
