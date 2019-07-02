import React from 'react';
import { Platform, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../constants';
import { TabIcon, Text, } from '../components/custom';

const SensorLogic = {

    convertMinutesToHrsMins: minutes => {
        let num = minutes;
        let hours = (num / 60);
        let rhours = _.floor(hours);
        let min = (hours - rhours) * 60;
        let rminutes = _.round(min);
        if(rhours === 0) {
            return `${rminutes} ${rminutes > 1 ? 'MINS' : 'MIN'}`;
        }
        return `${rhours} ${rhours > 1 ? 'HRS' : 'HR'} ${rminutes} ${rminutes > 1 ? 'MINS' : 'MIN'}`;
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
        let updateEndDateTimeString = moment(session.upload_end_date.replace('Z', '')).format('M/D, h:mma');
        let leftIconString = moment(session.event_date).format('M/D');
        let subtitle = session.status === 0 ?
            'Syncing your data! Do not remove from wifi.'
            : session.status === 1 ?
                `Synced & processed at ${updateEndDateTimeString}`
                :
                'Hmm...something went wrong. We\'re working on it!';
        let iconName = session.status === 0 ?
            'sync'
            : session.status === 1 ?
                'check-circle'
                :
                false;
        let title = `${moment(session.event_date.replace('Z', '')).format('h:mmA')}, ${SensorLogic.convertMinutesToHrsMins(session.duration)}`;
        return {
            iconName,
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
                subtitle:   <Text robotoLight style={[styles.subtitleStyle,]}>{'Open lid, remove Sensors. Sensor LEDs will turn green.'}</Text>,
                title:      <Text oswaldRegular style={[styles.titleStyle,]}>{'REMOVE THE SENSORS'}</Text>,
                video:      false,
            },
            {
                buttonText: 'Next',
                image:      {uri: 'https://d2xll36aqjtmhz.cloudfront.net/adhesive_prep.png'},
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Grab a strip of '}
                        <Text robotoBold>{'3 Adhesives,'}</Text>
                        {' one for each Sensor.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(WARNING: the adhesive is '}
                        <Text robotoBold>{'very strong.'}</Text>
                        {' Only complete this tutorial if you\'re planning to train & sweat.)'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'LOCATE THE ADHESIVES'}</Text>,
                video: false,
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Remove the white liner from the adhesives & stick to '}
                        <Text robotoBold>{'back'}</Text>
                        {' of the corresponding sensor.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(Do not apply adhesive on LED side)'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'APPLY TO SENSORS'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/adhesive_f_sensor.mp4',
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle,]}>{'Clean, dry, & remove lotion from lower back & outside ankles.'}</Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>{'(This is where you\'ll place the Sensors)'}</Text>,
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PREP YOUR SKIN'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/skin_prep.mp4',
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle,]}>{'Peel the tan, hip sensor liner. Stick just above the tailbone in the center of your spine.'}</Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>{'(Your waistband should cover the sensor)'}</Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PLACE HIP SENSOR'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/h_sensor_placement.mp4',
            },
            {
                buttonText: 'Finish Placement!',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Peel the tan, ankle sensor liner. Stick just above the tailbone in the center of your spine.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(Move foot, ensure sensors '}
                        <Text robotoBold>{'don\'t touch'}</Text>
                        {' your shoe)'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PLACE ANKLE SENSORS'}</Text>,
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
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'END WORKOUT'}</Text>,
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
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'RETURN SENSORS'}</Text>,
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
                    <Text key={0} robotoBold style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Hold'}
                        <Text robotoLight>{' the '}</Text>
                        {'Button'}
                        <Text robotoLight>{' until the '}</Text>
                        {'Battery LED'}
                        <Text robotoLight style={[styles.subtitleStyle,]}>
                            {' turns solid '}
                            <Text robotoBold style={{color: 'blue',}}>{'blue.'}</Text>
                        </Text>
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(All sensors must be in the Kit with the lid firmly closed & your phone\'s bluetooth must be "ON")'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'TURN ON BLUETOOTH'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/bluetooth_on.mp4',
            },
            {
                animatedImage: Platform.OS === 'ios' ? {uri: 'https://d2xll36aqjtmhz.cloudfront.net/bluetooth_connect_phone.png'} : {uri: 'https://d2xll36aqjtmhz.cloudfront.net/bluetooth_connect_phone_android.png'},
                buttonText:    false,
                image:         {uri: 'https://d2xll36aqjtmhz.cloudfront.net/bluetooth_connect_kit.png'},
                subtitle:      false,
                title:         <Text oswaldRegular style={[styles.titleStyle,]}>{'BRING THE PHONE NEAR YOUR KIT TO PAIR'}</Text>,
                video:         false,
            },
            {
                buttonText: false,
                image:      false,
                subtitle:   <Text robotoLight style={[styles.smallerText, {textAlign: 'center',}]}>{'You\'ll need wifi to upload data after your workout. Select the wifi network that you\'ll have access to most reliably after training.'}</Text>,
                title:      <Text oswaldRegular style={[styles.titleStyle,]}>{'CONNECT TO WIFI'}</Text>,
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
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'SUCCESS, YOU\'RE CONNECTED'}</Text>,
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
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'BRING KIT TO WIFI'}</Text>,
                video: 'https://d2xll36aqjtmhz.cloudfront.net/upload_instructions.mp4',
            },
        ];
    },

};

/* Export ==================================================================== */
export default SensorLogic;