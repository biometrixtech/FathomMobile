/**
 * Sensor Onboarding Educational Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import AppIntroSlider from 'react-native-app-intro-slider';
import Video from 'react-native-video';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppStyles, AppSizes, } from '../../constants';
import { AppUtil, } from '../../lib';

// Components
import { Spacer, Text, } from '../custom/';

/* Slides ==================================================================== */
const SINGLE_SENSOR_SLIDES = {
    showSkipButton: true,
    slides:         [
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-0',
            subtext:         'Here is a short intro into how it works.',
            text:            'monitors your workload for in-field and on court activity.',
            title:           'Your Fathom Sensor',
        },
        {
            backgroundColor: AppColors.white,
            image:           require('../../../assets/images/sensor/kitSingleSensor.png'),
            key:             'tutorial-1',
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
            key:                     'tutorial-2',
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
            key:                     'tutorial-3',
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
            key:                     'tutorial-4',
            text:                    'Plan to refill adhesives and recharge your base every few days.',
            title:                   'Prepare',
        },
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-5',
            linkStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoMedium, color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(14), textDecorationLine: 'none',},
            linkText:        'No, I\'ll do it later in Settings.',
            subtext:         'This will only take 1min and must be completed to sync your activity.',
            subtextStyle:    {...AppStyles.textCenterAligned, ...AppStyles.robotoRegular, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14),},
            text:            'Are you ready to connect your sensor to your account?',
            textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoBold, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(20),},
        },
    ],
};

const TUTORIAL_SLIDES = {
    showSkipButton: false,
    slides:         [
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-0',
            title:           'App Tutorial',
        },
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-1',
            text:            'Every morning tell us how you feel so we can design your daily recovery plan',
            title:           'Readiness Survey',
            videoLink:       'https://s3.amazonaws.com/onboarding-content/readiness.mp4',
        },
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-2',
            text:            'Access your recovery plan before and after training',
            title:           'Prep & Recover',
            videoLink:       'https://s3.amazonaws.com/onboarding-content/readiness.mp4',
        },
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-3',
            text:            'Log your activity & soreness so we canupdate your recovery plan',
            title:           'Train',
            videoLink:       'https://s3.amazonaws.com/onboarding-content/readiness.mp4',
        },
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-4',
            text:            'Recover well and often to unlock functional strength',
            title:           'Functional Strength',
            videoLink:       'https://s3.amazonaws.com/onboarding-content/readiness.mp4',
        },
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-5',
            title:           'You\'re ready to use the app!',
        },
    ],
};

const VALUE_EDUCATION_SLIDES = {
    showSkipButton: true,
    slides:         [
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-0',
            title:           'Welcome to Sustainable Training',
        },
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-1',
            text:            'Fathom is designed to perfectly supplement your sport and support your body.',
            title:           'Curated to You',
        },
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-2',
            text:            'Your recovery plan adapts every day to your workouts, soreness, injuries, and goals.',
            title:           'Adapts Daily',
        },
        {
            backgroundColor: AppColors.white,
            key:             'tutorial-3',
            text:            'We implement clinical knowledge to optimize your work and reduce soreness.',
            title:           'Validated In Practice',
        },
    ],
};

const EMPTY_SLIDES = {
    showSkipButton: true,
    slides:         [],
};

/* Component ==================================================================== */
class Tutorial extends Component {
    static componentName = 'Tutorial';

    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            uniqueValue: 0,
        }
    }

    componentDidMount = () => {
        // this seems to be needed to "refresh" the page to get new router information :(
        this.setState({ uniqueValue: this.state.uniqueValue + 1, });
    }

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
                <View style={{flex: props.videoLink ? 0 : props.image ? 4 : 0, overflow: 'hidden',}}>
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
                <View style={{flex: props.videoLink ? 2 : props.image ? 5 : 9, justifyContent: props.image ? 'flex-start' : 'center', paddingTop: props.image ? AppSizes.padding : 0, width: AppSizes.screen.widthTwoThirds,}}>
                    <Text
                        oswaldMedium
                        style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(28),}]}
                    >
                        {props.title}
                    </Text>
                    { props.text ?
                        <View>
                            <Spacer size={20} />
                            <Text
                                robotoRegular
                                style={props.textStyle ? [props.textStyle] : [AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(16),}]}
                            >
                                {props.text}
                            </Text>
                        </View>
                        :
                        null
                    }
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
                { props.videoLink ?
                    <View style={{flex: 8,}}>
                        <Video
                            paused={false}
                            repeat={true}
                            resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                            source={{uri: props.videoLink}}
                            style={{flex: 1, width: AppSizes.screen.widthTwoThirds,}}
                        />
                    </View>
                    :
                    null
                }
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

    render = () => {
        // setup constants
        const step = Actions.currentParams.step;
        const slides = step === 'single-sensor' ?
            SINGLE_SENSOR_SLIDES.slides
            : step === 'educational' ?
                VALUE_EDUCATION_SLIDES.slides
                : step === 'tutorial' ?
                    TUTORIAL_SLIDES.slides
                    :
                    EMPTY_SLIDES.slides;
        const showSkipButton = step === 'single-sensor' ?
            SINGLE_SENSOR_SLIDES.showSkipButton
            : step === 'educational' ?
                VALUE_EDUCATION_SLIDES.showSkipButton
                : step === 'tutorial' ?
                    TUTORIAL_SLIDES.showSkipButton
                    :
                    EMPTY_SLIDES.showSkipButton;
        // render page
        return(
            <AppIntroSlider
                activeDotStyle={{backgroundColor: AppColors.zeplin.darkGrey}}
                buttonTextStyle={{color: AppColors.zeplin.darkGrey,}}
                doneLabel={'done'}
                dotStyle={{backgroundColor: AppColors.zeplin.lightGrey}}
                nextLabel={'next'}
                onDone={this._onDone}
                onSkip={this._routeToNextPage}
                renderItem={this._renderItem}
                showSkipButton={showSkipButton}
                skipLabel={'skip'}
                slides={slides}
            />
        )
    }
}

/* Export Component ==================================================================== */
export default Tutorial;
