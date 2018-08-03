// import reactnative components
import { AsyncStorage } from 'react-native';

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
        if(ble.accessoryData && ble.accessoryData.sensor_pid && ble.accessoryData.mobile_udid === AppUtil.getDeviceUUID()) {
            const sensorData = BLEActions.getSingleSensorSavedPractices(ble.accessoryData.sensor_pid);
            console.log('sensorData',sensorData);
            // if(!ble.bluetoothOn) {
            //     // bluetooth off => iconSensorStatusBtOff.png
            //     bleImage = require(`${imagePrefix}iconSensorStatusBtOff.png`);
            // } else {
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
            // }
        }
        return {
            animated,
            bleImage,
        };
    },

    async _storeDataLocally(data) {
        // AsyncStorage.multiSet(data)
        // AsyncStorage.setItem(key, data)
            // .then(response => )
            // .catch(error => )

        // try {
        //     await AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.');
        // } catch (error) {
        //     // Error saving data
        // }
    },

    async _retrieveData() {
        // AsyncStorage.multiGet([])
        // AsyncStorage.getItem(key)
            // .then(response => )
            // .catch(error => )

        // try {
        //     const value = await AsyncStorage.getItem('TASKS');
        //     if (value !== null) {
        //         // We have data!!
        //         console.log(value);
        //     }
        // } catch (error) {
        //     // Error retrieving data
        // }
    },

    async _deleteData(index) {
        // AsyncStorage.multiRemove(keys,
        //     err => {
        //         console.log('Local storage user info removed!');
        //     }
        // );

        // AsyncStorage.removeItem(key)
            // .then(response => )
            // .catch(error => )

        // try {
        //     await AsyncStorage.removeItem(key);
        //     return true;
        // } catch (error) {
        //     // Error retrieving data
        // }
    },

}

export default bleUtils;
