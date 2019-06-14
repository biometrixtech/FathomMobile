import React from 'react';
import { View, } from 'react-native';

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

    /**
      * Handles Sensor File Render Logic
      * - SensorFiles
      */
    // TODO: UNIT TEST ME
    handleSensorFileRenderLogic: sensorData => {
        // last sync logic
        let hoursAgo = moment().diff(sensorData.accessory.last_sync_date, 'hours');
        let daysAgo = moment().diff(sensorData.accessory.last_sync_date, 'days');
        let lastSyncTime = hoursAgo > 48 ? daysAgo : hoursAgo;
        let lastSyncExtraString = hoursAgo > 48 ? daysAgo === 1 || daysAgo === 0 ? 'day' : 'days' : hoursAgo === 1 || hoursAgo === 0 ? 'hr' : 'hrs';
        let lastSyncString = `${lastSyncTime} ${lastSyncExtraString} ago`;
        // battery logic
        let batteryLevel = _.round(sensorData.accessory.battery_level * 100);
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
    // TODO: UNIT TEST ME
    handleSessionRenderLogic: session => {
        let updateEndDateTimeString = moment(session.upload_end_date).format('M/D, h:mma');
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
        let title = `${moment(session.event_date).format('h:mmA')}, ${SensorLogic.convertMinutesToHrsMins(session.duration)}`;
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
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle,]}>{'Clean, dry, & remove lotion from lower back & outside ankles.'}</Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>{'(This is where you\'ll place the Sensors)'}</Text>,
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PREP YOUR SKIN'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/207.mp4',
            },
            {
                buttonText: 'Next',
                image:      {uri: 'https://fathomai-app-content.s3-us-west-2.amazonaws.com/sensor_prep.png'},
                subtitle:   <Text robotoLight style={[styles.subtitleStyle,]}>{'Open lid, remove Sensors. Sensor LEDs will turn green.'}</Text>,
                title:      <Text oswaldRegular style={[styles.titleStyle,]}>{'REMOVE THE SENSORS'}</Text>,
                video:      false,
            },
            {
                buttonText: 'Next',
                image:      {uri: 'https://fathomai-app-content.s3-us-west-2.amazonaws.com/adhesive_prep.png'},
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Grab a strip of '}
                        <Text robotoBold>{'3 Adhesives,'}</Text>
                        {' one for each Sensor.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>{'(We\'ll use them in the next step)'}</Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'LOCATE THE ADHESIVES'}</Text>,
                video: false,
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Remove the white liner from the ankle adhesives & stick to '}
                        <Text robotoBold>{'back'}</Text>
                        {' of the two Ankle Sensors.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(Do not apply adhesive on LED side)'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'APPLY TO ANKLE SENSORS'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/207.mp4',
            },
            {
                buttonText: 'Next',
                image:      {uri: 'https://fathomai-app-content.s3-us-west-2.amazonaws.com/f_sensor_placement.png'},
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Peel away the tan liner. Stick Ankle Sensors above & behind each outer ankle.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(Make sure the sensors '}
                        <Text robotoBold>{'don\'t touch'}</Text>
                        {' your shoe)'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PLACE ANKLE SENSORS'}</Text>,
                video: false,
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Remove the white liner from the hip adhesive & stick to the '}
                        <Text robotoBold>{'back'}</Text>
                        {' of your Hip Sensor.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(Do not apply adhesive on LED side)'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'APPLY TO HIP SENSORS'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/207.mp4',
            },
            {
                buttonText: 'Finish Placement!',
                image:      {uri: 'https://fathomai-app-content.s3-us-west-2.amazonaws.com/h_sensor_placement.png'},
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle,]}>{'Peel away the tan liner. Stick Hip Sensor just above the tailbone in the center of your spine.'}</Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>{'(Your waistband should cover the sensor)'}</Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PLACE HIP SENSOR'}</Text>,
                video: false,
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
                    <View key={1} style={{alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',}}>
                        <Text robotoLight style={[styles.smallerText, {fontSize: AppFonts.scaleFont(15),}]}>
                            {'( '}
                        </Text>
                        <TabIcon
                            color={AppColors.zeplin.slate}
                            icon={'run'}
                            size={20}
                            type={'material-community'}
                        />
                        <Text robotoLight style={[styles.smallerText, {fontSize: AppFonts.scaleFont(15),}]}>
                            {' LED will turn OFF when your workout has ended)'}
                        </Text>
                    </View>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'END WORKOUT'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/207.mp4',
            },
            {
                buttonText: 'Next',
                image:      {uri: 'https://fathomai-app-content.s3-us-west-2.amazonaws.com/return_sensors.png'},
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
                video: false,
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
                    <View key={0} style={{alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: AppSizes.paddingSml,}}>
                        <Text robotoBold style={[styles.subtitleStyle,]}>
                            {'Hold'}
                            <Text robotoLight>{' the '}</Text>
                            {'Button'}
                            <Text robotoLight>{' until '}</Text>
                        </Text>
                        <TabIcon
                            color={AppColors.zeplin.slate}
                            icon={'battery-40'}
                            size={20}
                            type={'material-community'}
                        />
                        <Text robotoLight style={[styles.subtitleStyle,]}>
                            {' LED turns '}
                            <Text robotoBold style={{color: 'blue',}}>{'blue.'}</Text>
                        </Text>
                    </View>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'(Make sure your phone\'s Bluetooth is "ON")'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'TURN ON BLUETOOTH'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/207.mp4',
            },
            {
                animatedImage: {uri: 'https://fathomai-app-content.s3-us-west-2.amazonaws.com/bluetooth_connect_phone.png'},
                buttonText:    false,
                image:         {uri: 'https://fathomai-app-content.s3-us-west-2.amazonaws.com/bluetooth_connect_kit.png'},
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
                    <View key={0} style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: AppSizes.padding,}}>
                        <Text robotoLight style={[styles.subtitleStyle,]}>{'The '}</Text>
                        <TabIcon
                            color={AppColors.zeplin.slate}
                            icon={'wifi'}
                            reverse={false}
                            size={20}
                        />
                        <Text robotoLight style={[styles.subtitleStyle,]}>{' LED is green while your workout data is uploading.'}</Text>
                    </View>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle,]}>{'Don\'t remove your Kit from wifi while uploading.'}</Text>,
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'SUCCESS, YOU\'RE CONNECTED'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/207.mp4',
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
                video: 'https://dd4o7zw7l62dt.cloudfront.net/207.mp4',
            },
        ];
    },

};

/* Export ==================================================================== */
export default SensorLogic;