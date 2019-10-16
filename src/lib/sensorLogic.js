import React from 'react';
import { Platform, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../constants';
import { TabIcon, Text, } from '../components/custom';

const SensorLogic = {

    convertMinutesToHrsMins: (minutes, toLower = false) => {
        let num = minutes;
        let hours = (num / 60);
        let rhours = _.floor(hours);
        let min = (hours - rhours) * 60;
        let rminutes = _.round(min);
        if(rhours === 0) {
            return toLower ? `${rminutes} ${rminutes > 1 ? 'mins' : 'min'}` : `${rminutes} ${rminutes > 1 ? 'MINS' : 'MIN'}`;
        }
        return toLower ? `${rhours} ${rhours > 1 ? 'hrs' : 'hr'} ${rminutes} ${rminutes > 1 ? 'mins' : 'min'}` : `${rhours} ${rhours > 1 ? 'HRS' : 'HR'} ${rminutes} ${rminutes > 1 ? 'MINS' : 'MIN'}`;
    },

    errorMessages: () => {
        return {
            errorWifiConnection: 'Your Kit was not able to connect to wifi. Your stored password may not be correct.',
            longPass:            'This password is longer than we can support. Please select a different network or change your password to be <32 characters.',
            longSSID:            'This network name is longer than we can support. Please select a different network or change your password to be <32 characters.',
            macFetch:            'Error fetching MAC Address',
            outOfRange:          'Your Fathom PRO kit couldn\'t find a network in range. Please confirm you\'re within your preferred wifi network and try again once in range.',
            pairError:           'Oops! Error Pairing! Please try again.',
            wifiFetch:           'Error saving WIFI connection',
        };
    },

    toByteAndRssiToIcon: (rssi, toByte) => {
        if(!rssi) {
            return 'wifi-strength-1';
        }
        let iconStr = _.inRange(rssi, 126, -50) ?
        		'wifi-strength-4'
            : _.inRange(rssi, -60, -50) ?
            		'wifi-strength-3'
            		: _.inRange(rssi, -70, -60) ?
                		'wifi-strength-2'
                    :
                    'wifi-strength-1';
        let toByteStr = toByte !== 0 ? '-lock' : '';
    		return `${iconStr}${toByteStr}`;
    },

    /**
      * Handles Sensor File Render Logic
      * - SensorFiles
      */
    handleFirstPageIndexRenderLogic: (user, wifiPageNumber) => {
        let filteredFirstTimeExperience = _.cloneDeep(user.first_time_experience);
        filteredFirstTimeExperience = _.filter(filteredFirstTimeExperience, o => /^3Sensor-Onboarding-/.test(o) && o !== `3Sensor-Onboarding-${wifiPageNumber}`);
        filteredFirstTimeExperience = _.map(filteredFirstTimeExperience, o => _.toInteger(o.substring((o.lastIndexOf('-') + 1), o.length)));
        let largestCheckpoint = _.max(filteredFirstTimeExperience);
        let updatedPageIndex = largestCheckpoint ?
            largestCheckpoint
            :
            0;
        return _.toInteger(updatedPageIndex);
    },

    /**
      * Handles Sensor File Render Logic
      * - SensorFiles
      */
    handleSensorFileRenderLogic: sensorData => {
        // last sync logic
        let hoursAgo = sensorData && sensorData.accessory && sensorData.accessory.last_sync_date ? moment().diff(sensorData.accessory.last_sync_date.replace('Z', ''), 'hours') : 0;
        let daysAgo = sensorData && sensorData.accessory && sensorData.accessory.last_sync_date ? moment().diff(sensorData.accessory.last_sync_date.replace('Z', ''), 'days') : 0;
        let lastSyncTime = hoursAgo > 48 ? daysAgo : hoursAgo;
        let lastSyncExtraString = hoursAgo > 48 ? daysAgo === 1 || daysAgo === 0 ? 'day' : 'days' : hoursAgo === 1 || hoursAgo === 0 ? 'hr' : 'hrs';
        let lastSyncString = `${lastSyncTime} ${lastSyncExtraString} ago`;
        // battery logic
        let batteryLevel = sensorData && sensorData.accessory && sensorData.accessory.battery_level ? _.round(sensorData.accessory.battery_level * 100) : 0;
        let batteryIconProps = { color: AppColors.zeplin.slate, icon: 'battery', iconStyle: [], size: 20, type: 'material-community', };
        let batteryTextString = 'CHARGED';
        let batteryTextProps = { color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(17), marginLeft: AppSizes.paddingXSml, opacity: 1, };
        if(hoursAgo < 24) {
            if(batteryLevel < 15) {
                batteryIconProps.color = AppColors.zeplin.error;
                batteryIconProps.icon = 'battery-alert';
                batteryTextString = 'CHARGE NOW';
            } else if(batteryLevel >= 15 && batteryLevel < 30) {
                batteryIconProps.color = AppColors.zeplin.yellow;
                batteryIconProps.icon = 'battery-20';
                batteryTextString = 'CHARGE SOON';
            } else if(batteryLevel >= 30 && batteryLevel < 65) {
                batteryIconProps.color = AppColors.zeplin.success;
                batteryIconProps.icon = 'battery-50';
                batteryTextString = 'CHARGE SOON';
            } else if(batteryLevel >= 65 && batteryLevel < 80) {
                batteryIconProps.color = AppColors.zeplin.success;
                batteryIconProps.icon = 'battery-80';
            } else {
                batteryIconProps.color = AppColors.zeplin.success;
                batteryIconProps.icon = 'battery';
                batteryTextString = 'FULLY CHARGED';
            }
        } else if(hoursAgo >= 24 && hoursAgo < 48) {
            if(batteryLevel < 25) {
                batteryIconProps.color = AppColors.zeplin.error;
                batteryIconProps.icon = 'battery-alert';
                batteryIconProps.iconStyle = [{ opacity: 0.5, }];
                batteryTextString = 'CHARGE NOW';
                batteryTextProps.opacity = 0.5;
            } else if(batteryLevel >= 25 && batteryLevel < 40) {
                batteryIconProps.color = AppColors.zeplin.yellow;
                batteryIconProps.icon = 'battery-20';
                batteryIconProps.iconStyle = [{ opacity: 0.5, }];
                batteryTextString = 'CHARGE SOON';
                batteryTextProps.opacity = 0.5;
            } else if(batteryLevel >= 40 && batteryLevel < 75) {
                batteryIconProps.color = AppColors.zeplin.success;
                batteryIconProps.icon = 'battery-50';
                batteryIconProps.iconStyle = [{ opacity: 0.5, }];
                batteryTextString = 'CHARGE SOON';
                batteryTextProps.opacity = 0.5;
            } else if(batteryLevel >= 75 && batteryLevel < 90) {
                batteryIconProps.color = AppColors.zeplin.success;
                batteryIconProps.icon = 'battery-80';
                batteryIconProps.iconStyle = [{ opacity: 0.5, }];
                batteryTextProps.opacity = 0.5;
            } else {
                batteryIconProps.color = AppColors.zeplin.success;
                batteryIconProps.icon = 'battery';
                batteryIconProps.iconStyle = [{ opacity: 0.5, }];
                batteryTextString = 'FULLY CHARGED';
                batteryTextProps.opacity = 0.5;
            }
        } else if(hoursAgo >= 48 && hoursAgo < 72) {
            if(batteryLevel < 30) {
                batteryIconProps.color = AppColors.zeplin.slateXLight;
                batteryIconProps.icon = 'battery-alert';
                batteryTextString = 'CHARGE NOW';
                batteryTextProps.color = AppColors.zeplin.slateXLight;
            } else if(batteryLevel >= 30 && batteryLevel < 45) {
                batteryIconProps.color = AppColors.zeplin.slateXLight;
                batteryIconProps.icon = 'battery-20';
                batteryTextString = 'CHARGE SOON';
                batteryTextProps.color = AppColors.zeplin.slateXLight;
            } else if(batteryLevel >= 45 && batteryLevel < 75) {
                batteryIconProps.color = AppColors.zeplin.slateXLight;
                batteryIconProps.icon = 'battery-50';
                batteryTextString = 'CHARGE SOON';
                batteryTextProps.color = AppColors.zeplin.slateXLight;
            } else {
                batteryIconProps.color = AppColors.zeplin.slateXLight;
                batteryIconProps.icon = 'battery-80';
                batteryTextProps.color = AppColors.zeplin.slateXLight;
            }
        } else {
            batteryIconProps.color = AppColors.zeplin.slateXLight;
            batteryIconProps.icon = 'battery-unknown';
            batteryIconProps.type = 'material';
            batteryTextString = 'UNKNOWN';
            batteryTextProps.color = AppColors.zeplin.slateXLight;
        }
        // return variables
        return {
            batteryIconProps,
            batteryTextProps,
            batteryTextString,
            lastSyncString,
            sensorNetwork: sensorData.sensor_networks[0],
        };
    },

    /**
      * Handles Sensor Files Session Render Logic
      * - SensorFilesPage
      */
    handleSessionRenderLogic: session => {
        let updateEndDateTimeString = session && session.upload_end_date ? moment(session.upload_end_date.replace('Z', '')).format('M/D, h:mma') : moment().format('M/D, h:mma');
        let leftIconString = moment(session.event_date).format('M/D');
        let subtitle = session.status === 'UPLOAD_PAUSED' ?
            'Return your Kit to wifi to finish uploading.'
            : session.status === 'PROCESSING_IN_PROGRESS' ?
                'Analyzing your data, we\'ll have results soon.'
                : session.status === 'PROCESSING_FAILED' ?
                    'We were not able to analyze your data.'
                    : session.status === 'UPLOAD_IN_PROGRESS' ?
                        'Uploading your data! Do not remove from wifi.'
                        : session.status === 'PROCESSING_COMPLETE' ?
                            `Synced & processed at ${updateEndDateTimeString}`
                            :
                            'Hmm...something went wrong. We\'re working on it!';
        let iconName = session.status === 'UPLOAD_IN_PROGRESS' ?
            'sync'
            : session.status === 'PROCESSING_COMPLETE' ?
                'check-circle'
                : session.status === 'PROCESSING_FAILED' ?
                    'alert'
                    :
                    false;
        let iconType = session.status === 'PROCESSING_FAILED' ? 'material-community' : 'material';
        let title = `${moment(session.event_date.replace('Z', '')).format('h:mmA')}, ${SensorLogic.convertMinutesToHrsMins(session.duration)}`;
        return {
            iconName,
            iconType,
            leftIconString,
            subtitle,
            title,
        };
    },

    /**
      * Content for Placement pages
      */
    getPlacementContent: styles => {
        return [
            {}, // will be manually set up
            {
                buttonText: 'Next',
                image:      {uri: 'https://d2xll36aqjtmhz.cloudfront.net/sensor_prep.png'},
                subtitle:   <Text robotoLight style={[styles.subtitleStyle,]}>{'Open Lid, Remove Sensors. Sensor LEDs will turn green.'}</Text>,
                title:      <Text robotoMedium style={[styles.titleStyle,]}>{'Remove PRO Sensors'}</Text>,
                video:      false,
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Place sensors back in kit. Firmly close the lid.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle,]}>
                        {'Wait for Sensor LEDs to turn off. Open lid & remove sensors. Wait for sensor LEDs to turn green.'}
                    </Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Sensor LEDs Blue?'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/ledsblue.mp4',
            },
            {
                buttonText: 'Next',
                image:      {uri: 'https://d2xll36aqjtmhz.cloudfront.net/adhesive_prep.png'},
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Grab a strip of '}
                        <Text robotoBold>{'3 adhesives,'}</Text>
                        {' one for each Sensor.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'We\'ll use them in the next step'}
                    </Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Locate Adhesives'}</Text>,
                video: false,
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Remove the white liner & stick to the corresponding sensor.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'Do '}
                        <Text robotoBold>{'not'}</Text>
                        {' cover the green LED'}
                    </Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Apply Adhesives to Sensors'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/adhesive_f_sensor.mp4',
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle,]}>
                        {'Remove '}
                        <Text robotoBold>{'ALL'}</Text>
                        {' lotion, dirt & sweat from lower back & outside ankles'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15), textDecorationLine: 'underline',}]}>{'This is critical to your sensors sticking'}</Text>,
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Clean Your Skin'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/skin_prep.mp4',
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle,]}>{'Peel the tan, hip sensor liner. Stick just above the tailbone, in the center of your spine.'}</Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>{'The sensor should be below the waistband'}</Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Place Hip Sensor'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/h_sensor_placement.mp4',
            },
            {
                buttonText: 'Finish Placement!',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Peel the tan, ankle sensor liner. Stick the sensors above & behind each outer ankle.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'Make sure the sensors '}
                        <Text robotoBold>{'don\'t touch'}</Text>
                        {' your shoe'}
                    </Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Place Ankle Sensor'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/f_sensor_placement.mp4',
            },
        ];
    },

    /**
      * Content for Session pages
      */
    getSessionContent: styles => {
        return [
            {}, // will be manually set up
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle,]}>
                        {'When done with your workout, '}
                        <Text robotoBold>{'click the Button'}</Text>
                        {' to stop data capture & end session.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.smallerText, {fontSize: AppFonts.scaleFont(15), textAlign: 'center',}]}>
                        {'('}
                        <Text robotoBold>{'Running LED'}</Text>
                        {' will turn OFF when your workout has ended)'}
                    </Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'End Workout'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/end_session.mp4',
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Remove Adhesives & return Sensors to the Smart Charger.\n'}
                        <Text robotoBold>{'Firmly close the lid.'}</Text>
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(you\'ll hear a '}
                        <Text robotoBold>{'"click"'}</Text>
                        {' when fully closed)'}
                    </Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Return Sensors'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/return_sensors.mp4',
            },
        ];
    },

    /**
      * Content for Connect pages
      */
    getConnectContent: styles => {
        return [
            {}, // will be manually set up
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Hold the button for 3 sec until battery LED turns '}
                        <Text robotoBold style={{color: AppColors.blue,}}>{'solid blue'}</Text>
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(make sure your phone\'s bluetooth is "on")'}
                    </Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Turn on Bluetooth'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/bluetooth_on.mp4',
            },
            {
                animatedImage: Platform.OS === 'ios' ? {uri: 'https://d2xll36aqjtmhz.cloudfront.net/bluetooth_connect_phone.png'} : {uri: 'https://d2xll36aqjtmhz.cloudfront.net/bluetooth_connect_phone_android.png'},
                buttonText:    false,
                image:         {uri: 'https://d2xll36aqjtmhz.cloudfront.net/bluetooth_connect_kit.png'},
                subtitle:      false,
                title:         <Text robotoMedium style={[styles.titleStyle,]}>{'Bring The Phone Near Your Kit to Pair'}</Text>,
                video:         false,
            },
            {
                buttonText: false,
                image:      false,
                subtitle:   <Text robotoLight style={[styles.smallerText, {textAlign: 'center',}]}>{'You\'ll need wifi to upload data after your workout. Select the wifi network that you\'ll have access to most reliably after training.'}</Text>,
                title:      <Text robotoMedium style={[styles.titleStyle,]}>{'Connect to Wifi'}</Text>,
                video:      false,
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginTop: AppSizes.padding,}]}>
                        {'The '}
                        <Text robotoBold>{'Wifi LED'}</Text>
                        {' is green while your workout data is uploading.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle,]}>{'Don\'t remove your Kit from wifi while uploading.'}</Text>,
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Success, you\'re connected!'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/upload_instructions.mp4',
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle,]}>
                        {'Bring the SmartBase into a '}
                        <Text robotoBold>{'paired wifi network.'}</Text>
                    </Text>,
                    <View key={1} style={{flexDirection: 'row', marginTop: AppSizes.padding,}}>
                        <TabIcon
                            color={AppColors.zeplin.slateLight}
                            icon={'wifi'}
                            reverse={false}
                            size={20}
                        />
                        <Text robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(14), marginLeft: AppSizes.paddingSml,}]}>{'LED will turn green when data upload begins. Data upload should take 10-12 minutes.'}</Text>
                    </View>,
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Bring Kit to Wifi'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/upload_instructions.mp4',
            },
        ];
    },

    /**
      * Content for Return Sensors pages
      */
    getReturnSensorsContent: styles => {
        return [
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Remove adhesives & return sensors to the Smart Charger. '}
                        <Text robotoBold>{'Firmly close the lid.'}</Text>
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(you\'ll here a '}
                        <Text robotoBold>{'"click"'}</Text>
                        {' when fully closed)'}
                    </Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Now, Return your Sensors'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/return_sensors.mp4',
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'The sensors will "breathe" green while syncing with the kit.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(Keep lid '}
                        <Text robotoBold>{'closed'}</Text>
                        {' while sensors sync)'}
                    </Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Allow Sensors to Sync'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/sensorsgreen.mp4',
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Bring the kit into your home wifi & wait for your data to upload!'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'If you haven\'t already, you can connect the Kit to wifi on your Plan page.'}
                    </Text>
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Bring Kit into Wifi'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/upload_instructions.mp4',
            },
            {
                buttonText: 'Continue To My Plan',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginTop: AppSizes.padding,}]}>
                        {'Charge your Kit between workouts. Click the Button to check battery.'}
                    </Text>,
                ],
                title: <Text robotoMedium style={[styles.titleStyle,]}>{'Charge After Training'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/check_battery.mp4',
            },
        ];
    },

    getMinRSSIDBM: () => -75,

};

/* Export ==================================================================== */
export default SensorLogic;