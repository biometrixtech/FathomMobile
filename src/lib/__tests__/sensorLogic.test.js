/* global it expect jest */
/* global it expect describe */
/* global it expect beforeEach */
import 'react-native';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

// import logic file(s)
import { ble as BleActions, } from '../../actions';
import { SensorLogic, } from '../';

// setup helper functions
const helperFunctions = {

    getUserFirstTimeExperince: pages => {
        return _.map(pages, page => `3Sensor-Onboarding-${page}`);
    },

    getSessionObject: (duration, event_date, status, upload_end_date) => {
        return {
            duration,
            event_date,
            status,
            upload_end_date,
        };
    },

    getSessionsExpectedResult: (iconName, leftIconString, subtitle, title) => {
        return {
            iconName,
            leftIconString,
            subtitle,
            title,
        };
    },

    getSensorDataObject: (battery_level, last_sync_date) => {
        return {
            accessory: {
                battery_level,
                last_sync_date,
            },
            sensor_networks: [ 'FathomAI', 'belkin-test', 'NETGEAR-83-5G', ],
        };
    },

    getBatteryIconProps: (color, icon, iconStyle, size, type) => {
        return {
            color,
            icon,
            iconStyle,
            size,
            type,
        };
    },

    getBatteryTextProps: (color, fontSize, marginLeft, opacity) => {
        return {
            color,
            fontSize,
            marginLeft,
            opacity,
        };
    },

    getSensorFileExpectedResult: (batteryIconProps, batteryTextProps, batteryTextString, lastSyncString, sensorNetwork) => {
        return {
            batteryIconProps,
            batteryTextProps,
            batteryTextString,
            lastSyncString,
            sensorNetwork,
        };
    },

};

/*describe('3Sensor Tests', () => {
    beforeEach(() => jest.resetModules());
    it('Get BLE Mac Address', async () => {
        const dispatch = jest.fn();
        jest.mock('NativeModules', () => ({
            BleManager: {
                addListener:      jest.fn(),
                checkState:       jest.fn(),
                connect:          jest.fn(() => Promise.resolve()),
                disconnect:       jest.fn(() => Promise.resolve()),
                read:             jest.fn(),
                retrieveServices: jest.fn(() => Promise.resolve({ id: '00:00:00:00:00', })),
                write:            jest.fn(),
            }
        }));
        let macAddressRes = BleActions.getBLEMacAddress('testing')(dispatch)
            // .then(res => console.log('res',res))
            // .catch(err => console.log('err',err));
        // expect(macAddressRes).toEqual('00:00:00:00:00');
        await expect(macAddressRes).resolves.toBe('00:00:00:00:00');
        // expect(BleActions.getBLEMacAddress('testing')(dispatch)).rejects.toBe('00:00:00:00:00');
    });
});*/

describe('Handles Sensor File Render Logic', () => {
    it('Not much data', () => {
        let sensorData = helperFunctions.getSensorDataObject();
        let batteryIconProps = helperFunctions.getBatteryIconProps('#EA6F4A', 'battery-alert', [], 20, 'material-community');
        let batteryTextProps = helperFunctions.getBatteryTextProps('#757D8A', 32, 5, 1);
        let expectedResult = helperFunctions.getSensorFileExpectedResult(batteryIconProps, batteryTextProps, 'CHARGE NOW', '0 hr ago', sensorData.sensor_networks[0]);
        expect(SensorLogic.handleSensorFileRenderLogic(sensorData)).toEqual(expectedResult);
    });
    it('Within the last 24hrs', () => {
        let sensorData = helperFunctions.getSensorDataObject(0.62, `${moment().subtract(7, 'hours').format('YYYY-MM-DDTHH:MM:ss')}Z`);
        let batteryIconProps = helperFunctions.getBatteryIconProps('#4EC1A6', 'battery-50', [], 20, 'material-community');
        let batteryTextProps = helperFunctions.getBatteryTextProps('#757D8A', 32, 5, 1);
        let expectedResult = helperFunctions.getSensorFileExpectedResult(batteryIconProps, batteryTextProps, 'CHARGE SOON', '7 hrs ago', sensorData.sensor_networks[0]);
        expect(SensorLogic.handleSensorFileRenderLogic(sensorData)).toEqual(expectedResult);
    });
    it('24 & 48hrs', () => {
        let sensorData = helperFunctions.getSensorDataObject(0.3, `${moment().subtract(31, 'hours').format('YYYY-MM-DDTHH:MM:ss')}Z`);
        let batteryIconProps = helperFunctions.getBatteryIconProps('#EBBA2D', 'battery-20', [{opacity: 0.5,}], 20, 'material-community');
        let batteryTextProps = helperFunctions.getBatteryTextProps('#757D8A', 32, 5, 0.5);
        let expectedResult = helperFunctions.getSensorFileExpectedResult(batteryIconProps, batteryTextProps, 'CHARGE SOON', '31 hrs ago', sensorData.sensor_networks[0]);
        expect(SensorLogic.handleSensorFileRenderLogic(sensorData)).toEqual(expectedResult);
    });
    it('48 & 72hrs', () => {
        let sensorData = helperFunctions.getSensorDataObject(0.8, `${moment().subtract(70, 'hours').format('YYYY-MM-DDTHH:MM:ss')}Z`);
        let batteryIconProps = helperFunctions.getBatteryIconProps('#E2E4E6', 'battery-80', [], 20, 'material-community');
        let batteryTextProps = helperFunctions.getBatteryTextProps('#E2E4E6', 32, 5, 1);
        let expectedResult = helperFunctions.getSensorFileExpectedResult(batteryIconProps, batteryTextProps, 'CHARGED', '2 days ago', sensorData.sensor_networks[0]);
        expect(SensorLogic.handleSensorFileRenderLogic(sensorData)).toEqual(expectedResult);
    });
    it('Greater than 72hrs', () => {
        let sensorData = helperFunctions.getSensorDataObject(0.8, `${moment().subtract(3, 'days').format('YYYY-MM-DDTHH:MM:ss')}Z`);
        let batteryIconProps = helperFunctions.getBatteryIconProps('#E2E4E6', 'battery-unknown', [], 20, 'material');
        let batteryTextProps = helperFunctions.getBatteryTextProps('#E2E4E6', 32, 5, 1);
        let expectedResult = helperFunctions.getSensorFileExpectedResult(batteryIconProps, batteryTextProps, 'UNKNOWN', '3 days ago', sensorData.sensor_networks[0]);
        expect(SensorLogic.handleSensorFileRenderLogic(sensorData)).toEqual(expectedResult);
    });
});

describe('Handles Sensor Files Session Render Logic', () => {
    it('Status - UPLOAD_IN_PROGRESS', () => {
        let session = helperFunctions.getSessionObject(45, '2019-06-28T04:01:37Z', 'UPLOAD_IN_PROGRESS', '2019-06-28T09:03:37Z');
        let expectedResult = helperFunctions.getSessionsExpectedResult(
            'sync',
            moment(session.event_date).format('M/D'),
            'Syncing your data! Do not remove from wifi.',
            `${moment(session.event_date.replace('Z', '')).format('h:mmA')}, ${SensorLogic.convertMinutesToHrsMins(session.duration)}`
        );
        expect(SensorLogic.handleSessionRenderLogic(session)).toEqual(expectedResult);
    });
    it('Status - PROCESSING_COMPLETE', () => {
        let session = helperFunctions.getSessionObject(12, '2019-06-28T04:01:37Z', 'PROCESSING_COMPLETE', '2019-06-28T09:03:37Z');
        let updateEndDateTimeString = moment(session.upload_end_date.replace('Z', '')).format('M/D, h:mma');
        let expectedResult = helperFunctions.getSessionsExpectedResult(
            'check-circle',
            moment(session.event_date).format('M/D'),
            `Synced & processed at ${updateEndDateTimeString}`,
            `${moment(session.event_date.replace('Z', '')).format('h:mmA')}, ${SensorLogic.convertMinutesToHrsMins(session.duration)}`
        );
        expect(SensorLogic.handleSessionRenderLogic(session)).toEqual(expectedResult);
    });
    it('Status - PROCESSING_FAILED', () => {
        let session = helperFunctions.getSessionObject(72, '2019-06-28T04:01:37Z', 'PROCESSING_FAILED', '2019-06-28T09:03:37Z');
        let expectedResult = helperFunctions.getSessionsExpectedResult(
            false,
            moment(session.event_date).format('M/D'),
            'Hmm...something went wrong. We\'re working on it!',
            `${moment(session.event_date.replace('Z', '')).format('h:mmA')}, ${SensorLogic.convertMinutesToHrsMins(session.duration)}`
        );
        expect(SensorLogic.handleSessionRenderLogic(session)).toEqual(expectedResult);
    });
});

describe('Handles Sensor File Render Logic', () => {
    it('FIRST PAGE', () => {
        let user = { first_time_experience: helperFunctions.getUserFirstTimeExperince(), };
        let wifiPageNumber = 17;
        let expectedResult = 0;
        expect(SensorLogic.handleFirstPageIndexRenderLogic(user, wifiPageNumber)).toEqual(expectedResult);
    });
    it('ONE CHECKPOINT', () => {
        let user = { first_time_experience: helperFunctions.getUserFirstTimeExperince([0]), };
        let wifiPageNumber = 17;
        let expectedResult = 0;
        expect(SensorLogic.handleFirstPageIndexRenderLogic(user, wifiPageNumber)).toEqual(expectedResult);
    });
    it('TWO CHECKPOINTS', () => {
        let user = { first_time_experience: helperFunctions.getUserFirstTimeExperince([0, 1]), };
        let wifiPageNumber = 17;
        let expectedResult = 1;
        expect(SensorLogic.handleFirstPageIndexRenderLogic(user, wifiPageNumber)).toEqual(expectedResult);
    });
    it('THREE CHECKPOINTS', () => {
        let user = { first_time_experience: helperFunctions.getUserFirstTimeExperince([0, 1, 9]), };
        let wifiPageNumber = 17;
        let expectedResult = 9;
        expect(SensorLogic.handleFirstPageIndexRenderLogic(user, wifiPageNumber)).toEqual(expectedResult);
    });
    it('FOUR CHECKPOINTS', () => {
        let user = { first_time_experience: helperFunctions.getUserFirstTimeExperince([0, 1, 9, 12]), };
        let wifiPageNumber = 17;
        let expectedResult = 12;
        expect(SensorLogic.handleFirstPageIndexRenderLogic(user, wifiPageNumber)).toEqual(expectedResult);
    });
    it('FIVE CHECKPOINTS', () => {
        let user = { first_time_experience: helperFunctions.getUserFirstTimeExperince([0, 1, 9, 12, 15]), };
        let wifiPageNumber = 17;
        let expectedResult = 15;
        expect(SensorLogic.handleFirstPageIndexRenderLogic(user, wifiPageNumber)).toEqual(expectedResult);
    });
    it('SIX CHECKPOINTS', () => {
        let user = { first_time_experience: helperFunctions.getUserFirstTimeExperince([0, 1, 9, 12, 15, 17]), };
        let wifiPageNumber = 17;
        let expectedResult = 15; // should go to previous page, catch for dropdown to let user know they have to finish 3Sensor system
        expect(SensorLogic.handleFirstPageIndexRenderLogic(user, wifiPageNumber)).toEqual(expectedResult);
    });
});
