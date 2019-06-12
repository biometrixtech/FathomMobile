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
        };
    },

    /**
    * Handles Sensor Files Session Render Logic
    * - SensorFilesPage
    */
    handleSessionRenderLogic: session => {
        let updateEndDateTimeString = moment(session.upload_end_date).format('M/D h:mma');
        let leftIconString = moment(session.event_date).format('M/D');
        let subtitle = session.status === 0 ?
            'Session processing, keep Kit in wifi'
            : session.status === 1 ?
                `upload complete ${updateEndDateTimeString}`
                :
                'Oops something went wrong. We\'re working on it.';
        let title = `${moment(session.event_date).format('h:mmA')}, ${SensorLogic.convertMinutesToHrsMins(session.duration)}`;
        return {
            leftIconString,
            subtitle,
            title,
        };
    },

    getPlacementContent: styles => {
        return [
            {}, // will be manually set up
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   <Text robotoLight style={[styles.subtitleStyle,]}>{'Clean & dry your lower back & outside ankles'}</Text>,
                title:      <Text oswaldRegular style={[styles.titleStyle,]}>{'PREP SKIN'}</Text>,
                video:      'https://dd4o7zw7l62dt.cloudfront.net/9.mp4',
            },
            {
                buttonText: 'Next',
                image:      require('../../assets/images/sensor/sensor_prep.png'),
                subtitle:
                    <Text robotoLight style={[styles.subtitleStyle,]}>
                        {'Remove Sensors from your SmartBase & wait for Sensor LEDs to turn '}
                        <Text robotoBold style={{color: AppColors.zeplin.success,}}>{'solid Green'}</Text>
                    </Text>,
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PREP SENSORS'}</Text>,
                video: false,
            },
            {
                buttonText: 'Next',
                image:      require('../../assets/images/sensor/adhesive_prep.png'),
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Grab '}
                        <Text robotoBold>{'3 adhesives'}</Text>
                        {' provided in your carrying case'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>{'(We\'ll use them in the next step)'}</Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PREP ADHESIVES'}</Text>,
                video: false,
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Remove the white liner on 2 adhesives and  stick to '}
                        <Text robotoBold>{'back'}</Text>
                        {' of the two ankle sensors'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'The '}
                        <Text robotoBold>{'BACK'}</Text>
                        {' has 4 gold dots, NO LED.'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PREP ANKLE SENSORS'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/9.mp4',
            },
            {
                buttonText: 'Next',
                image:      require('../../assets/images/sensor/f_sensor_placement.png'),
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Peel away the tan liner. Stick ankle sensors above & behind each outer ankle.'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'Once placed, sensor should '}
                        <Text robotoBold>{'not'}</Text>
                        {' touch your shoe'}
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
                        {'Remove the white liner & stick to the '}
                        <Text robotoBold>{'back'}</Text>
                        {' of your hip sensor'}
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'The '}
                        <Text robotoBold>{'BACK'}</Text>
                        {' has 4 gold dots, NO LED.'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PREP HIP SENSORS'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/9.mp4',
            },
            {
                buttonText: 'Finish Placement!',
                image:      require('../../assets/images/sensor/h_sensor_placement.png'),
                subtitle:   <Text robotoLight style={[styles.subtitleStyle,]}>{'Peel away the tan liner. Stick just above the tailbone in the center of your spine.'}</Text>,
                title:      <Text oswaldRegular style={[styles.titleStyle,]}>{'PLACE HIP SENSOR'}</Text>,
                video:      false,
            },
        ];
    },

    getSessionContent: styles => {
        return [
            {}, // will be manually set up
            {
                buttonText: 'Next',
                image:      false,
                subtitle:
                    <Text robotoLight style={[styles.subtitleStyle,]}>
                        {'When you’re ready click the '}
                        <Text robotoBold>{'End Button'}</Text>
                        {' to stop data capture & end your workout.'}
                    </Text>,
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'PREP SENSORS'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/9.mp4',
            },
            {
                buttonText: 'Next',
                image:      require('../../assets/images/sensor/return_sensors.png'),
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle, {marginBottom: AppSizes.paddingSml,}]}>
                        {'Remove adhesive & return to the Case. '}
                        <Text robotoBold>{'Firmly close the lid.'}</Text>
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'The SmartBase should '}
                        <Text robotoBold>{'"snap"'}</Text>
                        {' when fully closed.'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'RETURN SENSORS TO BASE'}</Text>,
                video: false,
            },
        ];
    },

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
                        <Text robotoLight>{' until LED turuns '}</Text>
                        <Text robotoBold style={{color: 'blue',}}>{'blue.'}</Text>
                    </Text>,
                    <Text key={1} robotoLight style={[styles.subtitleStyle, {fontSize: AppFonts.scaleFont(15),}]}>
                        {'Make sure your phone’s Bluetooth is "On".'}
                    </Text>
                ],
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'TURN ON BLUETOOTH'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/9.mp4',
            },
            {
                animatedImage: require('../../assets/images/sensor/bluetooth_connect_phone.png'),
                buttonText:    false,
                image:         require('../../assets/images/sensor/bluetooth_connect_kit.png'),
                subtitle:      false,
                title:         <Text oswaldRegular style={[styles.titleStyle,]}>{'BRING PHONE NEAR THE KIT TO PAIR'}</Text>,
                video:         false,
            },
            {
                buttonText: false,
                image:      false,
                subtitle:   <Text robotoLight style={[styles.smallerText, {textAlign: 'center',}]}>{'You\'ll need wifi to upload your data after you train. Select the network you\'ll have in range after using the system.'}</Text>,
                title:      <Text oswaldRegular style={[styles.titleStyle,]}>{'CONNECT TO WIFI'}</Text>,
                video:      false,
            },
            {
                buttonText: 'Next',
                image:      false,
                subtitle:   [
                    <Text key={0} robotoLight style={[styles.subtitleStyle,]}>{'Your kit will now upload your training data.'}</Text>,
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
                title: <Text oswaldRegular style={[styles.titleStyle,]}>{'SUCCESS YOU\'RE CONNECTED'}</Text>,
                video: 'https://dd4o7zw7l62dt.cloudfront.net/9.mp4',
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
                video: 'https://dd4o7zw7l62dt.cloudfront.net/9.mp4',
            },
        ];
    },

};

/* Export ==================================================================== */
export default SensorLogic;