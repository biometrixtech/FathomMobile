/**
 * Sensor Onboarding Educational Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import AppIntroSlider from 'react-native-app-intro-slider';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppStyles, AppSizes, } from '../../constants';

// Components
import { Spacer, Text, } from '../custom/';

/* Slides ==================================================================== */
const slides = [
    {
        backgroundColor: AppColors.white,
        key:             'sensorOnboarding-0',
        subtext:         'Here is a short intro into how it works.',
        text:            'monitors your workload for in-field and on court activity.',
        title:           'Your Fathom Sensor',
    },
    {
        backgroundColor: AppColors.white,
        image:           require('../../../assets/images/sensor/kitSingleSensor.png'),
        key:             'sensorOnboarding-1',
        subtext:         'Open it up and inside you’ll find your sensor and adhesives.',
        text:            'a smart charging hub for your sensor.',
        title:           'Your Base',
    },
    {
        backgroundColor:         AppColors.white,
        image:                   require('../../../assets/images/sensor/kitSingleSensor.png'),
        imageRight:              require('../../../assets/images/sensor/sensorInPractice.png'),
        imageRightStyles:        {flex: 1, width: AppSizes.screen.widthQuarter,},
        imageRightWrapperStyles: {alignItems: 'center', width: AppSizes.screen.widthHalf,},
        key:                     'sensorOnboarding-2',
        subtext:                 'A detailed tutorial for how and where to place the sensor will be provided later.',
        text:                    'Wear your sensor during all in-field, court and running activities.',
        title:                   'Your Sensor',
    },
    {
        backgroundColor:         AppColors.white,
        image:                   require('../../../assets/images/sensor/kitSingleSensor.png'),
        imageRight:              require('../../../assets/images/sensor/iPhone.png'),
        imageRightStyles:        {flex: 1, width: AppSizes.screen.widthThreeQuarters,},
        imageRightWrapperStyles: {alignItems: 'flex-start', width: AppSizes.screen.widthHalf,},
        key:                     'sensorOnboarding-3',
        subtext:                 'Sync the sensor with your mobile app to update your recovery plan.',
        text:                    'Return the sensor to your base after activity to recharge.',
        title:                   'Your Activity',
    },
    {
        backgroundColor:         AppColors.white,
        image:                   require('../../../assets/images/sensor/kitSingleSensor.png'),
        imageLeftWrapperStyles:  {alignItems: 'flex-end', width: AppSizes.screen.widthTwoThirds,},
        imageRight:              require('../../../assets/images/sensor/usb.png'),
        imageRightStyles:        {flex: 1, width: AppSizes.screen.widthQuarter,},
        imageRightWrapperStyles: {alignItems: 'flex-end', width: AppSizes.screen.widthThird,},
        key:                     'sensorOnboarding-4',
        text:                    'Plan to refill adhesives and recharge your base every few days.',
        title:                   'Prepare',
    },
    {
        backgroundColor: AppColors.white,
        key:             'sensorOnboarding-5',
        linkStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoMedium, color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(14), textDecorationLine: 'none',},
        linkText:        'No, I\'ll do it later in Settings.',
        subtext:         'This will only take 1min and must be completed to sync your activity.',
        subtextStyle:    {...AppStyles.textCenterAligned, ...AppStyles.robotoRegular, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14),},
        text:            'Are you ready to connect your sensor to your account?',
        textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoBold, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(20),},
    },
];

/* Component ==================================================================== */
class SensorOnboarding extends Component {
    static componentName = 'SensorOnboarding';

    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    static defaultProps = {};

    _onDone = () => {
        // TODO: add logic here to maybe update user to know we've completed this process
        Actions.settings();
    }

    _routeToNextPage = () => {
        // TODO: add logic here to where to go next
        Actions.myPlan();
    }

    _renderItem = props => {
        const style = {
            backgroundColor: props.backgroundColor ? props.backgroundColor : AppColors.white,
            flex:            1,
            height:          props.height,
            paddingBottom:   props.bottomSpacer,
            paddingTop:      props.topSpacer,
            width:           props.width,
        }
        return(
            <View style={[style, AppStyles.containerCentered]}>
                <View style={{flex: props.image ? 4 : 0, overflow: 'hidden',}}>
                    { props.image && props.imageRight ?
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                            <View style={[props.imageLeftWrapperStyles ? props.imageLeftWrapperStyles : {alignItems: 'flex-end', width: AppSizes.screen.widthHalf,}]}>
                                <Image
                                    resizeMode={'contain'}
                                    source={props.image}
                                    style={{flex: 1, width: AppSizes.screen.widthFourFifths,}}
                                />
                            </View>
                            <View style={[props.imageRightWrapperStyles]}>
                                <Image
                                    resizeMode={'contain'}
                                    source={props.imageRight}
                                    style={[props.imageRightStyles]}
                                />
                            </View>
                        </View>
                        : props.image ?
                            <View style={{justifyContent: 'center',}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={props.image}
                                    style={{width: AppSizes.screen.widthFourFifths,}}
                                />
                            </View>
                            :
                            null
                    }
                </View>
                <View style={{flex: props.image ? 5 : 9, justifyContent: props.image ? 'flex-start' : 'center', paddingTop: props.image ? AppSizes.padding : 0, width: AppSizes.screen.widthTwoThirds,}}>
                    <Text
                        oswaldMedium
                        style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(28),}]}
                    >
                        {props.title}
                    </Text>
                    <Spacer size={20} />
                    <Text
                        robotoRegular
                        style={props.textStyle ? [props.textStyle] : [AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(16),}]}
                    >
                        {props.text}
                    </Text>
                    { props.subtext ?
                        <View>
                            <Spacer size={20} />
                            <Text
                                robotoRegular
                                style={props.subtextStyle ? [props.subtextStyle] : [AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(16),}]}
                            >
                                {props.subtext}
                            </Text>
                        </View>
                        :
                        null
                    }
                </View>
                { props.linkText ?
                    <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: AppSizes.padding,}}>
                        <Text onPress={this._routeToNextPage} style={[props.linkStyle]}>{props.linkText}</Text>
                    </View>
                    :
                    null
                }
            </View>
        );
    }

    render = () => (
        <AppIntroSlider
            activeDotStyle={{backgroundColor: AppColors.zeplin.darkGrey}}
            buttonTextStyle={{color: AppColors.zeplin.darkGrey,}}
            dotStyle={{backgroundColor: AppColors.zeplin.lightGrey}}
            onDone={this._onDone}
            onSkip={this._routeToNextPage}
            renderItem={this._renderItem}
            showSkipButton={true}
            slides={slides}
        />
    )
}

/* Export Component ==================================================================== */
export default SensorOnboarding;
