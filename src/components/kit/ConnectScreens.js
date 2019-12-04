import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, ImageBackground, Platform, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { Button, ListItem, Spacer, TabIcon, Text, } from '../custom';
import { PlanLogic, SensorLogic, } from '../../lib';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    circleBackground: {
        alignItems:      'center',
        alignSelf:       'flex-start',
        backgroundColor: AppColors.zeplin.slateXLight,
        borderRadius:    (25 / 2),
        height:          25,
        justifyContent:  'center',
        marginRight:     AppSizes.padding,
        width:           25,
    },
    ledStyle: {
        borderRadius:  (10 / 2),
        height:        10,
        shadowOffset:  { height: 1, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  (10 / 2),
        width:         10,
    },
    smallerText: {
        color:    AppColors.zeplin.slate,
        fontSize: AppFonts.scaleFont(18),
    },
    subtitleStyle: {
        color:     AppColors.zeplin.slate,
        fontSize:  AppFonts.scaleFont(20),
        textAlign: 'center',
    },
    titleStyle: {
        color:     AppColors.zeplin.splashLight,
        fontSize:  AppFonts.scaleFont(28),
        textAlign: 'center',
    },
});

/* Components =================================================================== */
const TopNav = ({ darkColor, onBack, onClose, showClose = true, step, title, }) => {
    let color = darkColor ? AppColors.zeplin.slateLight : AppColors.white;
    return(
        <View>
            <View style={{backgroundColor: AppColors.transparent, height: AppSizes.statusBarHeight,}} />
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingHorizontal: AppSizes.paddingSml, paddingVertical: AppSizes.padding,}}>
                <View style={{flex: 1,}}>
                    { onBack &&
                        <TabIcon
                            color={color}
                            icon={'chevron-left'}
                            onPress={() => onBack()}
                            reverse={false}
                            size={30}
                            type={'material-community'}
                        />
                    }
                </View>
                { step ?
                    <View style={{flex: 8, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <View
                            style={{borderBottomColor: step === 1 ? color : AppColors.transparent, borderBottomWidth: 1, marginRight: AppSizes.paddingXLrg, paddingBottom: AppSizes.paddingXSml,}}
                        >
                            <Text
                                robotoBold={step === 1}
                                robotoLight={step !== 1}
                                style={{color: color, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}
                            >
                                {'Connect'}
                            </Text>
                        </View>
                        <View
                            style={{borderBottomColor: step === 2 ? color : AppColors.transparent, borderBottomWidth: 1, paddingBottom: AppSizes.paddingXSml,}}
                        >
                            <Text
                                robotoBold={step === 2}
                                robotoLight={step !== 2}
                                style={{color: color, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}
                            >
                                {'Train'}
                            </Text>
                        </View>
                    </View>
                    : title ?
                        <View style={{flex: 8, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                            <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{title}</Text>
                        </View>
                        :
                        <View style={{flex: 8,}} />
                }
                <View style={{flex: 1,}}>
                    { showClose &&
                        <TabIcon
                            color={color}
                            icon={'close'}
                            onPress={onClose ? () => onClose() : () => Actions.pop()}
                            reverse={false}
                            size={30}
                        />
                    }
                </View>
            </View>
        </View>
    );
};

const CVP = ({ currentPage, nextBtn, onClose, toggleLearnMore = null, }) => (
    <View style={{flex: 1,}}>
        <Video
            paused={!currentPage}
            repeat={true}
            resizeMode={'cover'}
            source={require('../../../assets/videos/cvp.mp4')}
            style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.black,} : {}, {height: AppSizes.screen.height, width: AppSizes.screen.width,}]}
        />
        <View style={{backgroundColor: `${AppColors.zeplin.darkNavy}${PlanLogic.returnHexOpacity(0.4)}`, height: AppSizes.screen.height, position: 'absolute', width: AppSizes.screen.width,}}>
            <TopNav darkColor={false} onBack={null} onClose={onClose} step={false} />
            <View style={{alignItems: 'center', flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingLrg,}}>
                <View style={{paddingHorizontal: AppSizes.paddingLrg,}}>
                    <Text robotoMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(32), textAlign: 'center',}}>{'Fathom PRO Kit'}</Text>
                    <Text robotoLight style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'the world\'s most advanced biomechanics tracking system'}</Text>
                </View>
                <View style={{alignItems: 'center', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}>
                    <Text robotoLight style={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'Unlock precision prep, recovery & functional exercise perfectly designed for your body.'}</Text>
                    <Spacer size={AppSizes.paddingLrg} />
                    <Button
                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                        containerStyle={{alignItems: 'center', marginVertical: AppSizes.paddingLrg, justifyContent: 'center', width: '75%',}}
                        onPress={() => nextBtn()}
                        raised={true}
                        title={'Let\'s Get Started'}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={toggleLearnMore}
                        style={{width: AppSizes.screen.width,}}
                    >
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center', textDecorationLine: 'underline',}}>
                            {'Don\'t have Fathom PRO? Learn more'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Spacer size={Platform.OS === 'android' ? AppSizes.padding : 0} />
        </View>
    </View>
);

const Placement = ({ currentPage, handleAlertPress, nextBtn, onBack, onClose, nextBtnText, page, showTopNavStep = true, }) => {
    let content = SensorLogic.getPlacementContent(styles)[page];
    if(page > 0) {
        return (
            <View style={{flex: 1,}}>
                <TopNav darkColor={true} onBack={onBack} onClose={onClose} step={showTopNavStep ? 1 : false} />
                <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                    {content.title}
                </View>
                { content.image ?
                    <Image
                        resizeMode={'contain'}
                        source={content.image}
                        style={{alignSelf: 'center', height: AppSizes.screen.heightTwoFifths, width: AppSizes.screen.width,}}
                    />
                    : content.video ?
                        <Video
                            paused={!currentPage}
                            repeat={true}
                            resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                            source={{uri: content.video}}
                            style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                        />
                        :
                        null
                }
                <View style={{alignItems: 'center', flex: 1, paddingTop: AppSizes.padding,}}>
                    <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.padding,}}>
                        <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.padding,}}>
                            {content.subtitle}
                        </View>
                        { page === 1 &&
                            <Text onPress={() => handleAlertPress()} robotoMedium style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14), paddingVertical: AppSizes.padding, textAlign: 'center',}}>{'What if my sensor LEDs are blinking blue?'}</Text>
                        }
                    </View>
                    <Button
                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                        containerStyle={{alignItems: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, width: '60%',}}
                        onPress={() => nextBtn()}
                        raised={true}
                        title={nextBtnText ? nextBtnText : content.buttonText}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />
                </View>
            </View>
        );
    }
    return (
        <ImageBackground
            source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/start_tutorial.png'}}
            style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
        >
            <TopNav darkColor={false} onBack={onBack} step={showTopNavStep ? 1 : false} />
            <View style={{flex: 1, justifyContent: 'flex-end',}}>
                <LinearGradient
                    colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                    style={{justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                >
                    <View>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), marginBottom: AppSizes.paddingSml,}}>{'About to Workout?\nLet\'s Track It!'}</Text>
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginBottom: AppSizes.paddingSml,}}>{'First, we\'ll teach you how to use your Fathom PRO Kit during your workout to optimize your recovery & prevention.'}</Text>
                    </View>
                    <View style={{justifyContent: 'space-between', marginBottom: AppSizes.paddingSml,}}>
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginBottom: AppSizes.paddingSml,}}>{'YOU\'LL NEED:'}</Text>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                            <TabIcon
                                color={AppColors.zeplin.yellow}
                                containerStyle={[{padding: AppSizes.paddingXSml,}]}
                                icon={'access-time'}
                                reverse={false}
                                size={20}
                            />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'10 minutes'}</Text>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                            <TabIcon
                                color={AppColors.zeplin.yellow}
                                containerStyle={[{padding: AppSizes.paddingXSml,}]}
                                icon={'directions-run'}
                                reverse={false}
                                size={22}
                            />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'Ready to workout'}</Text>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                            <View style={{padding: AppSizes.paddingXSml,}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/sensor/sensor_yellow.png')}
                                    style={{height: 20, width: 20,}}
                                />
                            </View>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'Fathom PRO Kit'}</Text>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row',}}>
                            <View style={{backgroundColor: AppColors.white, padding: AppSizes.paddingXSml,}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/sensor/sensor_yellow.png')}
                                    style={{height: 20, width: 20,}}
                                />
                            </View>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'Sensor Adhesives'}</Text>
                        </View>
                    </View>
                    <Button
                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                        containerStyle={{alignSelf: 'center',marginTop: AppSizes.padding, width: '75%',}}
                        onPress={() => nextBtn()}
                        raised={true}
                        title={'Start Tutorial'}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />
                </LinearGradient>
            </View>
        </ImageBackground>
    );
};

const Calibration = ({ currentPage, handleUpdatePauseState, isVideoPaused, nextBtn, nextBtnText, onBack, onClose, page, showTopNavStep = true, }) => {
    if(page === 0) {
        return (
            <ImageBackground
                source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/start_calibration.png'}}
                style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
            >
                <TopNav darkColor={false} onBack={onBack} onClose={onClose} step={showTopNavStep ? 2 : false} />
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <LinearGradient
                        colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                        style={{justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                    >
                        <View>
                            <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), marginBottom: AppSizes.paddingSml,}}>{'Now, Let\'s Start Tracking Data!'}</Text>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginBottom: AppSizes.paddingSml,}}>{'Every PRO workout starts with a short calibration! If you forget how, you can view these instructions again later.'}</Text>
                        </View>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignSelf: 'center', marginTop: AppSizes.padding, width: '75%',}}
                            onPress={() => nextBtn()}
                            raised={true}
                            title={'Start Calibration'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </LinearGradient>
                </View>
            </ImageBackground>
        );
    }
    return (
        <View style={{flex: 1,}}>
            <TopNav darkColor={true} onBack={onBack} onClose={onClose} step={showTopNavStep ? 2 : false} />
            <View style={{flex: 1, justifyContent: 'space-between',}}>
                { page === 1 ?
                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <LottieView
                            autoPlay={true}
                            loop={true}
                            source={require('../../../assets/animation/calibrationalert.json')}
                            style={{height: AppSizes.screen.widthThird, width: AppSizes.screen.widthThird,}}
                        />
                        <Spacer size={AppSizes.padding} />
                        <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(32), textAlign: 'center',}}>{'Calibrate before your daily run'}</Text>
                        <Spacer size={AppSizes.padding} />
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textDecorationLine: 'underline',}}>
                                {'Stand up'}
                            </Text>
                            {' in neutral posture, then tap "Start Calibration".'}
                        </Text>
                    </View>
                    :
                    <View style={{flex: 1, paddingHorizontal: AppSizes.padding,}}>
                        <Text robotoRegular style={[styles.titleStyle, {paddingBottom: AppSizes.padding,}]}>
                            {page === 2 ? 'Where to Start a Workout' : 'Calibrate Before Every Workout'}
                        </Text>
                        <View>
                            {/*<TabIcon
                                color={AppColors.zeplin.slateLight}
                                containerStyle={[{position: 'absolute', right: 10, top: 40, zIndex: 100,}]}
                                icon={isVideoPaused ? 'pause' : 'play-arrow'}
                                onPress={() => handleUpdatePauseState()}
                                size={20}
                            />*/}
                            <Video
                                paused={isVideoPaused}
                                repeat={true}
                                resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                                source={{uri: page === 2 ? 'https://d2xll36aqjtmhz.cloudfront.net/startworkout.mp4' : 'https://d2xll36aqjtmhz.cloudfront.net/calibration.mp4'}}
                                style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                            />
                        </View>
                        <View style={{flex: 1, justifyContent: 'flex-end', marginHorizontal: AppSizes.paddingLrg, marginTop: AppSizes.padding,}}>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(20), textAlign: 'center',}}>
                                {page === 2 ?
                                    'Start a Workout by tapping the "+" button on the Plan page & follow along with calibration.'
                                    :
                                    'Stand up. Stand still. Then March.  After that, your workout has started.'
                                }
                            </Text>
                        </View>
                    </View>
                }
                {/* page !== 1 &&
                    <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',}}>
                        <Text robotoLight style={[styles.smallerText, {fontSize: AppFonts.scaleFont(15),}]}>
                            {'(Workout started when '}
                            <Text robotoBold>{'Running LED'}</Text>
                            {' is solid green)'}
                        </Text>
                    </View>
                */}
                { page === 1 ?
                    <Button
                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                        containerStyle={{alignSelf: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, marginTop: AppSizes.padding, width: '75%',}}
                        onPress={() => nextBtn()}
                        raised={true}
                        title={nextBtnText ? nextBtnText : 'Next'}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />
                    :
                    <View style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignItems: 'center', marginTop: AppSizes.paddingLrg, justifyContent: 'center', width: '75%',}}
                            onPress={() => nextBtn()}
                            raised={true}
                            title={nextBtnText ? nextBtnText : (page === 1 || page === 2) ? 'Next' : 'Done'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>
                }
            </View>
        </View>
    );
};

const Session = ({ currentPage, nextBtn, onBack, onClose, page, showTopNavStep = true, }) => {
    let content = SensorLogic.getSessionContent(styles)[page];
    if(page === 0) {
        return (
            <ImageBackground
                source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/start_training.png'}}
                style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
            >
                <TopNav darkColor={false} onBack={onBack} onClose={onClose} step={showTopNavStep ? 3 : true} />
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <LinearGradient
                        colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                        style={{justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                    >
                        <View>
                            <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), marginBottom: AppSizes.paddingSml,}}>{'Go Workout & Come Back After!'}</Text>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginBottom: AppSizes.paddingSml,}}>{'Go workout for at least 10 minutes. When you\'re done come back & tap the button below to learn how to end your session.'}</Text>
                        </View>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignSelf: 'center', marginTop: AppSizes.padding, width: '75%',}}
                            onPress={() => nextBtn()}
                            raised={true}
                            title={'End Workout'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </LinearGradient>
                </View>
            </ImageBackground>
        );
    }
    return (
        <View style={{flex: 1,}}>
            <TopNav darkColor={true} onBack={onBack} onClose={onClose} step={showTopNavStep ? 3 : false} />
            <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                {content.title}
            </View>
            { content.image ?
                <Image
                    resizeMode={'contain'}
                    source={content.image}
                    style={{alignSelf: 'center', height: AppSizes.screen.heightTwoFifths, width: AppSizes.screen.width,}}
                />
                : content.video ?
                    <Video
                        paused={!currentPage}
                        repeat={true}
                        resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                        source={{uri: content.video}}
                        style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                    />
                    :
                    null
            }
            <View style={{flex: 1, paddingTop: AppSizes.padding,}}>
                <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.padding,}}>
                    {content.subtitle}
                </View>
                <Button
                    buttonStyle={StyleSheet.flatten([AppStyles.buttonVerticalPadding, {backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, width: '100%',}])}
                    containerStyle={{justifyContent: 'flex-end', width: '100%',}}
                    onPress={() => nextBtn()}
                    title={content.buttonText}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
            </View>
        </View>
    );
};

const Battery = ({ currentPage, nextBtn, onBack, showTopNavStep = true, }) => (
    <View style={{flex: 1,}}>
        <TopNav darkColor={true} onBack={onBack} step={showTopNavStep ? 4 : false} />
        <View style={{flex: 1, justifyContent: 'space-between',}}>
            <View style={{paddingHorizontal: AppSizes.paddingLrg,}}>
                <Text oswaldRegular style={[styles.titleStyle,]}>{'CHECK BATTERY'}</Text>
            </View>
            <Video
                paused={!currentPage}
                repeat={true}
                resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/charge_battery.mp4'}}
                style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
            />
            <View style={[nextBtn ? {} : {paddingBottom: AppSizes.paddingLrg,}, {paddingHorizontal: AppSizes.paddingLrg,}]}>
                <Text robotoLight style={[styles.subtitleStyle,]}>{'With Sensors inside & lid closed click the Button to check battery:'}</Text>
                <View style={{marginHorizontal: AppSizes.paddingLrg, marginVertical: AppSizes.paddingMed,}}>
                    <View style={{alignItems: 'center', flexDirection: 'row', paddingBottom: AppSizes.paddingXSml,}}>
                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'flex-end',}}>
                            <View style={[styles.ledStyle, {backgroundColor: 'green', shadowColor: 'green',}]} />
                        </View>
                        <Text robotoLight style={[styles.smallerText, {flex: 7, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}]}>{'Green = Charged'}</Text>
                    </View>
                    <View style={{alignItems: 'center', flexDirection: 'row', paddingBottom: AppSizes.paddingXSml,}}>
                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'flex-end',}}>
                            <View style={[styles.ledStyle, {backgroundColor: 'blue', shadowColor: 'blue',}]} />
                        </View>
                        <Text robotoLight style={[styles.smallerText, {flex: 7, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}]}>{'Blue = Low Battery'}</Text>
                    </View>
                </View>
            </View>
            { nextBtn &&
                <Button
                    buttonStyle={StyleSheet.flatten([AppStyles.buttonVerticalPadding, {backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, width: '100%',}])}
                    containerStyle={{justifyContent: 'flex-end', width: '100%',}}
                    onPress={() => nextBtn()}
                    title={'Next'}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
            }
        </View>
    </View>
);

const Complete = ({ animationRef, currentNetwork, currentPage, isLoading, onBack, onClose, nextBtn, nextBtnText = 'Next', showTopNavStep = true, }) => (
    <View style={{flex: 1,}}>
        <TopNav darkColor={true} showClose={false} step={showTopNavStep ? 2 : false} />
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'space-between',}}>
            <View style={{alignItems: 'center', flex: 6, justifyContent: 'space-between',}}>
                <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{'Success, you\'re connected!'}</Text>
                <Spacer size={AppSizes.paddingMed} />
                <LottieView
                    loop={false}
                    ref={animation => animationRef(animation)}
                    source={require('../../../assets/animation/bluetoothloading.json')}
                    style={{height: AppSizes.screen.widthThird, width: AppSizes.screen.widthThird,}}
                />
                <Spacer size={AppSizes.paddingMed} />
            </View>
            <View style={{alignItems: 'center', flex: 4, justifyContent: 'flex-end', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(20), textAlign: 'center',}}>
                    {'Return your kit to'}
                    <Text robotoBold>{` ${currentNetwork ? currentNetwork : ''} `}</Text>
                    {'after every workout to upload data.'}
                </Text>
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginTop: AppSizes.paddingLrg, textAlign: 'center',}}>
                    {'The Wifi LED will turn'}
                    <Text robotoBold style={{color: AppColors.zeplin.success,}}>{' solid green '}</Text>
                    {'when your sensor data is uploading.'}
                </Text>
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                    containerStyle={{alignItems: 'center', marginTop: AppSizes.paddingLrg, justifyContent: 'center', width: '75%',}}
                    disabled={isLoading}
                    disabledStyle={{backgroundColor: AppColors.zeplin.slateXLight,}}
                    disabledTitleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    loading={isLoading}
                    loadingProps={{color: AppColors.zeplin.yellow,}}
                    onPress={() => nextBtn()}
                    raised={true}
                    title={nextBtnText}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
            </View>
        </View>
    </View>
);

const Train = ({ currentPage, nextBtn, onBack, page, showTopNavStep = true, }) => {
    if(page === 0) {
        return (
            <ImageBackground
                source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/traincheckpoint10.png'}}
                style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
            >
                <TopNav darkColor={false} onBack={onBack} showClose={false} step={showTopNavStep ? 2 : false} />
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <LinearGradient
                        colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                        style={{justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                    >
                        <View>
                            <Text robotoMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), marginBottom: AppSizes.paddingSml,}}>{'Learn how to start a workout!'}</Text>
                        </View>
                        <View style={{justifyContent: 'space-between', marginBottom: AppSizes.paddingSml,}}>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginBottom: AppSizes.paddingSml,}}>{'You\'ll need:'}</Text>
                            <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                <View style={{alignItems: 'center', height: 20, justifyContent: 'center', width: 40,}}>
                                    <TabIcon
                                        color={AppColors.zeplin.yellow}
                                        icon={'phone-iphone'}
                                        reverse={false}
                                        size={20}
                                    />
                                </View>
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginLeft: AppSizes.padding,}}>{'Mobile Device'}</Text>
                            </View>
                            <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                    <Image
                                        resizeMode={'contain'}
                                        source={require('../../../assets/images/standard/kitactive.png')}
                                        style={{height: 20, tintColor: AppColors.zeplin.yellow, width: 40,}}
                                    />
                                    <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginLeft: AppSizes.padding,}}>{'Fathom PRO'}</Text>
                                </View>
                            </View>
                        </View>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignSelf: 'center',marginTop: AppSizes.padding, width: '75%',}}
                            onPress={() => nextBtn()}
                            raised={true}
                            title={'Continue'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </LinearGradient>
                </View>
            </ImageBackground>
        );
    }
    return (
        <View style={{flex: 1,}}>
            <TopNav darkColor={true} onBack={onBack} showClose={false} step={showTopNavStep ? 2 : false} />
            <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                <Text robotoMedium style={[styles.titleStyle,]}>{'Start a Workout'}</Text>
            </View>
            <Video
                paused={!currentPage}
                repeat={true}
                resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/startworkout.mp4'}}
                style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
            />
            <View style={{alignItems: 'center', flex: 1, paddingTop: AppSizes.padding,}}>
                <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.padding,}}>
                    <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.padding,}}>
                        <Text robotoLight style={[styles.subtitleStyle,]}>{'Tap "+" on the Plan page to start a workout. We\'ll pick up the tutorial from there when you\'re ready to train!'}</Text>
                    </View>
                </View>
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                    containerStyle={{alignItems: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, width: '65%',}}
                    onPress={() => nextBtn()}
                    raised={true}
                    title={'Continue To My Plan'}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
            </View>
        </View>
    );
};

const ExtraPages = ({ currentPage, nextBtn, nextBtnText, onBack, onClose, onHelp, page, showTopNavStep = false, }) => {
    if(page === 'start-workout') {
        return (
            <ImageBackground
                imageStyle={{resizeMode: 'cover',}}
                source={require('../../../assets/images/standard/placement18.png')}
                style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
            >
                <TopNav darkColor={false} onBack={onBack} onClose={onClose} step={showTopNavStep ? 3 : false} />
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <LinearGradient
                        colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                        style={{justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                    >
                        <View>
                            <Text robotoMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(30), marginBottom: AppSizes.paddingSml,}}>{'Now, you\'re ready to calibrate your sensors!'}</Text>
                        </View>
                        <View style={{justifyContent: 'space-between', marginBottom: AppSizes.paddingSml,}}>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginBottom: AppSizes.paddingSml,}}>{'You\'ll need:'}</Text>
                            <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                <View style={{alignItems: 'center', height: 20, justifyContent: 'center', width: 40,}}>
                                    <TabIcon
                                        color={AppColors.zeplin.yellow}
                                        icon={'phone-iphone'}
                                        reverse={false}
                                        size={20}
                                    />
                                </View>
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginLeft: AppSizes.padding,}}>{'Smart Phone with wifi or service'}</Text>
                            </View>
                            <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                    <Image
                                        resizeMode={'contain'}
                                        source={require('../../../assets/images/standard/kitactive.png')}
                                        style={{height: 20, tintColor: AppColors.zeplin.yellow, width: 40,}}
                                    />
                                    <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginLeft: AppSizes.padding,}}>{'Fathom PRO Sensors placed'}</Text>
                                </View>
                            </View>
                        </View>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignSelf: 'center',marginTop: AppSizes.padding, width: '75%',}}
                            onPress={() => nextBtn()}
                            raised={true}
                            title={nextBtnText}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </LinearGradient>
                </View>
            </ImageBackground>
        );
    }
    if(page === 'confirm-placement') {
        return (
            <View style={{flex: 1,}}>
                <TopNav darkColor={true} onBack={onBack} onClose={onClose} step={showTopNavStep ? 3 : false} />
                <View style={{flex: 1, justifyContent: 'space-between',}}>
                    <View style={{alignItems: 'center', marginHorizontal: AppSizes.padding,}}>
                        <Text robotoBold style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(35), marginBottom: AppSizes.paddingSml, textAlign: 'center',}}>{'Place PRO Sensors'}</Text>
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(20), textAlign: 'center',}}>{'Before starting your workout, make sure your sensors are on correctly and the LEDs are green.'}</Text>
                    </View>
                    <Video
                        paused={!currentPage}
                        repeat={true}
                        resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                        source={require('../../../assets/videos/placementconfirm.mp4')}
                        style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightOneThird,}]}
                    />
                    <View style={{alignItems: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}>
                        <Text robotoBold style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}>{'Need Help?'}</Text>
                        <Spacer size={AppSizes.paddingMed} />
                        <Text
                            onPress={() => onHelp('sensor-led')}
                            robotoRegular
                            style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}
                        >
                            {'What do I do if my LEDs are Blue?'}
                        </Text>
                        <Spacer size={AppSizes.paddingMed} />
                        <Text
                            onPress={() => onHelp('sensor-placement')}
                            robotoRegular
                            style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}
                        >
                            {'Remind me how to place the sensors.'}
                        </Text>
                        <Spacer size={AppSizes.paddingLrg} />
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignSelf: 'center', marginTop: AppSizes.padding, width: '75%',}}
                            onPress={() => nextBtn()}
                            raised={true}
                            title={nextBtnText}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>
                </View>
            </View>
        );
    }
    return (
        <View />
    );
};

const Connect = ({
    availableNetworks = [],
    bounceValue,
    currentPage,
    handleNetworkPress = () => {},
    handleNotInRange = () => {},
    handleWifiScan = () => {},
    isLoading,
    isNextDisabled,
    isWifiScanDone = true,
    onBack,
    onClose,
    nextBtn,
    page,
    pageFirst,
    showTopNavStep = true,
    toggleLearnMore = null,
}) => {
    if(page === 6) {
        return (
            <View style={{flex: 1,}}>
                <TopNav darkColor={true} onBack={null} onClose={onClose} title={'Connect to Wifi'} />
                <Image
                    resizeMode={'contain'}
                    source={require('../../../assets/images/standard/settingsnetwork.png')}
                    style={{alignSelf: 'center', height: AppSizes.screen.heightTwoFifths, width: AppSizes.screen.widthThreeQuarters,}}
                />
                <View style={{flex: 1,}}>
                    <View style={{flex: 1, justifyContent: 'space-between',}}>
                        <View style={{justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg, paddingBottom: AppSizes.padding,}}>
                            <View style={{flexDirection: 'row',}}>
                                <View style={[styles.circleBackground,]}>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16),}}>{'1'}</Text>
                                </View>
                                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), textAlign: 'left',}}>
                                    {'Open your phone’s Wifi settings'}
                                </Text>
                            </View>
                            <Spacer size={AppSizes.paddingLrg} />
                            <View style={{flexDirection: 'row',}}>
                                <View style={[styles.circleBackground,]}>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16),}}>{'2'}</Text>
                                </View>
                                <View>
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), textAlign: 'left',}}>
                                        {'Connect to network '}
                                        <Text robotoBold>{'"FathomPRO"'}</Text>
                                    </Text>
                                    <Spacer size={AppSizes.paddingXSml} />
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), textAlign: 'left',}}>
                                        {'It may take up to 1 min to show up in your wifi list.'}
                                    </Text>
                                </View>
                            </View>
                            <Spacer size={AppSizes.paddingLrg} />
                            <View style={{flexDirection: 'row',}}>
                                <View style={[styles.circleBackground,]}>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16),}}>{'3'}</Text>
                                </View>
                                <View style={{flex: 1,}}>
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), textAlign: 'left',}}>
                                        {'Then come back to the Fathom App'}
                                    </Text>
                                    <Spacer size={AppSizes.paddingXSml} />
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), textAlign: 'left',}}>
                                        {'If you see a notification saying '}
                                        <Text robotoBold>
                                            {Platform.OS === 'ios' ? '"FathomPRO does not appear to be connected to the Internet"' : '"Wi-Fi has no internet access."'}
                                        </Text>
                                        {Platform.OS === 'ios' ? ' Tap "Keep Trying Wi-Fi"' : ' Tap it and select "Yes"'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => onBack()}
                        >
                            <Text robotoLight style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(12), textAlign: 'center', textDecorationLine: 'underline',}}>
                                {'Don\'t see the solid Blue LED?'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'center', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}>
                        <Button
                            buttonStyle={{backgroundColor: page === 1 ? AppColors.blue : AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignItems: 'center', marginTop: AppSizes.paddingLrg, justifyContent: 'center', width: '75%',}}
                            disabled={isNextDisabled || isLoading}
                            disabledStyle={{backgroundColor: AppColors.zeplin.slateXLight,}}
                            disabledTitleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                            loading={isLoading}
                            loadingProps={{color: AppColors.zeplin.yellow,}}
                            loadingStyle={{alignItems: 'center', justifyContent: 'center', width: '100%',}}
                            onPress={() => nextBtn()}
                            raised={true}
                            title={'I\'m Connected'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>
                </View>
            </View>
        );
    }
    let content = SensorLogic.getConnectContent(styles)[page];
    if(page > 0) {
        return (
            <View style={{flex: 1,}}>
                <TopNav darkColor={true} onBack={isWifiScanDone && onBack ? () => onBack() : null} onClose={onClose} step={showTopNavStep ? 1 : false} title={content.navTitle} />
                <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                    {content.title}
                </View>
                { content.image ?
                    <Image
                        resizeMode={'contain'}
                        source={content.image}
                        style={{alignSelf: 'center', height: AppSizes.screen.heightTwoFifths, width: AppSizes.screen.widthThreeQuarters,}}
                    />
                    : content.video ?
                        <Video
                            paused={!currentPage}
                            repeat={true}
                            resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                            source={content.video.localFile ? content.video.localFile : {uri: content.video}}
                            style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                        />
                        :
                        null
                }
                { page !== 3 &&
                    <View style={{flex: 1, paddingTop: AppSizes.padding,}}>
                        <View style={{flex: 1, justifyContent: 'space-between',}}>
                            { content.subtitle &&
                                <View style={{flex: 1, justifyContent: content.subtitle.length > 1 ? 'space-between' : 'flex-end', paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.padding,}}>
                                    {content.subtitle}
                                </View>
                            }
                            { page === 5 &&
                                <Text onPress={() => handleNotInRange()} robotoRegular style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14), marginVertical: AppSizes.paddingLrg, paddingHorizontal: AppSizes.paddingLrg, textAlign: 'center',}}>{'Is your Wifi LED off?'}</Text>
                            }
                        </View>
                        { (content.buttonText && nextBtn) &&
                            <View style={{alignItems: 'center', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}>
                                <Button
                                    buttonStyle={{backgroundColor: page === 1 ? AppColors.zeplin.blue : AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                    containerStyle={{alignItems: 'center', marginTop: AppSizes.paddingLrg, justifyContent: 'center', width: '75%',}}
                                    disabled={isNextDisabled || isLoading}
                                    disabledStyle={{backgroundColor: AppColors.zeplin.slateXLight,}}
                                    disabledTitleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                                    loading={isLoading}
                                    loadingProps={{color: AppColors.zeplin.yellow,}}
                                    loadingStyle={{alignItems: 'center', justifyContent: 'center', width: '100%',}}
                                    onPress={() => nextBtn()}
                                    raised={true}
                                    title={isNextDisabled ? 'Turn on Bluetooth to continue' : content.buttonText}
                                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                                />
                            </View>
                        }
                    </View>
                }
                { (page === 3 && content.subtitle) &&
                    <View style={{paddingHorizontal: AppSizes.paddingLrg, paddingTop: AppSizes.padding,}}>
                        {content.subtitle}
                    </View>
                }
                { (page === 3 && content.buttonText && nextBtn) &&
                    <Button
                        buttonStyle={StyleSheet.flatten([AppStyles.buttonVerticalPadding, {backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}])}
                        containerStyle={{flex: 1, justifyContent: 'flex-end', width: '100%',}}
                        disabled={isNextDisabled}
                        disabledStyle={StyleSheet.flatten([AppStyles.buttonVerticalPadding, {backgroundColor: AppColors.zeplin.slateXLight, borderRadius: 0, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}])}
                        disabledTitleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        onPress={() => nextBtn()}
                        title={isNextDisabled ? 'Turn on Bluetooth to continue' : content.buttonText}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />
                }
                { page === 3 &&
                    <View style={{flex: 1, paddingTop: AppSizes.padding,}}>
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: AppSizes.paddingMed, paddingBottom: AppSizes.paddingSml,}}>
                            <Text robotoBold style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16),}}>
                                {'Networks In Range'}
                            </Text>
                            { !isWifiScanDone ?
                                <ActivityIndicator
                                    animating={true}
                                    color={AppColors.zeplin.slate}
                                    size={'small'}
                                />
                                :
                                <Text onPress={handleWifiScan} robotoRegular style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(12), textDecorationLine: 'none',}}>{'Search again'}</Text>
                            }
                        </View>
                        <Spacer isDivider />
                        <ScrollView>
                            {_.map(availableNetworks, (network, i) =>
                                <ListItem
                                    bottomDivider={true}
                                    containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding,}}
                                    key={i}
                                    onPress={() => handleNetworkPress(network)}
                                    rightIcon={
                                        <TabIcon
                                            color={AppColors.zeplin.slateXLight}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={SensorLogic.toByteAndRssiToIcon(network.rssi, network.security.toByte)}
                                            size={24}
                                            type={'material-community'}
                                        />
                                    }
                                    title={network.ssid}
                                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}
                                />
                            )}
                        </ScrollView>
                        <Text onPress={() => handleNotInRange()} robotoMedium style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14), marginVertical: AppSizes.paddingLrg, paddingHorizontal: AppSizes.paddingLrg, textAlign: 'center',}}>{'I\'m not in range of my preferred wifi network'}</Text>
                    </View>
                }
            </View>
        );
    }
    return (
        <ImageBackground
            source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/start_owner.png'}}
            style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
        >
            <TopNav darkColor={false} onBack={onBack} onClose={onClose} step={showTopNavStep ? 1 : false} />
            <View style={{flex: 1, justifyContent: 'flex-end',}}>
                <LinearGradient
                    colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                    style={{justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                >
                    <Text robotoMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), marginBottom: (AppSizes.paddingSml + AppSizes.paddingMed),}}>
                        {pageFirst ? 'First, let\'s connect PRO to your account' : 'Let\'s Connect Fathom PRO to Wifi!'}
                    </Text>
                    <View style={{justifyContent: 'space-between', marginBottom: AppSizes.paddingSml,}}>
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(25), marginBottom: AppSizes.paddingSml,}}>{'You\'ll need:'}</Text>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                            <View style={{alignItems: 'center', height: 20, justifyContent: 'center', width: 40,}}>
                                <TabIcon
                                    color={AppColors.zeplin.yellow}
                                    icon={pageFirst ? 'bluetooth' : 'wifi'}
                                    reverse={false}
                                    size={24}
                                />
                            </View>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.paddingMed,}}>{pageFirst ? 'Mobile Bluetooth ON' : 'Home Wifi In Range'}</Text>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                            <View style={{alignItems: 'center', height: 24, justifyContent: 'center', width: 40,}}>
                                <TabIcon
                                    color={AppColors.zeplin.yellow}
                                    icon={'textbox-password'}
                                    reverse={false}
                                    size={24}
                                    type={'material-community'}
                                />
                            </View>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.paddingMed,}}>{'Wifi Password'}</Text>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                            <Image
                                resizeMode={'contain'}
                                source={require('../../../assets/images/standard/kitactive.png')}
                                style={{height: 20, tintColor: AppColors.zeplin.yellow, width: 40,}}
                            />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.paddingMed,}}>{'Fathom PRO'}</Text>
                        </View>
                    </View>
                    { !pageFirst &&
                        <View>
                            <Button
                                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                containerStyle={{alignSelf: 'center', marginVertical: AppSizes.padding, width: '75%',}}
                                onPress={() => nextBtn()}
                                raised={true}
                                title={'Connect Wifi Now'}
                                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                            />
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={toggleLearnMore}
                                style={{width: (AppSizes.screen.width - (AppSizes.paddingLrg * 2)),}}
                            >
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center', textDecorationLine: 'underline',}}>
                                    {'Don\'t have Fathom PRO? Learn more'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {/*<Button
                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                        containerStyle={{alignSelf: 'center', marginTop: AppSizes.padding, width: '75%',}}
                        onPress={() => nextBtn(!pageFirst ? 3 : 1, !pageFirst)}
                        raised={true}
                        title={pageFirst ? 'Continue' : 'Connect Wifi Later'}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />*/}
                </LinearGradient>
            </View>
        </ImageBackground>
    );
};

const ReturnSensors = ({ currentPage, onBack, onClose, nextBtn, page, }) => {
    let content = SensorLogic.getReturnSensorsContent(styles)[page];
    return (
        <View style={{flex: 1,}}>
            <TopNav darkColor={true} onBack={onBack} onClose={onClose} step={false} />
            <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                {content.title}
            </View>
            { content.image ?
                <Image
                    resizeMode={'contain'}
                    source={content.image}
                    style={{alignSelf: 'center', height: AppSizes.screen.heightTwoFifths, width: AppSizes.screen.width,}}
                />
                : content.video ?
                    <Video
                        paused={!currentPage}
                        repeat={true}
                        resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                        source={{uri: content.video}}
                        style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                    />
                    :
                    null
            }
            <View style={{alignItems: 'center', flex: 1, paddingTop: AppSizes.padding,}}>
                <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.padding,}}>
                    <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.padding,}}>
                        {content.subtitle}
                    </View>
                    { page === 3 &&
                        <View style={{marginHorizontal: AppSizes.paddingXLrg, marginBottom: AppSizes.padding,}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', paddingBottom: AppSizes.paddingXSml,}}>
                                <View style={[styles.ledStyle, {backgroundColor: 'green', shadowColor: 'green', marginRight: AppSizes.paddingSml,}]} />
                                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}>{'Green = Charged'}</Text>
                            </View>
                            <View style={{alignItems: 'center', flexDirection: 'row', paddingBottom: AppSizes.paddingXSml,}}>
                                <View style={[styles.ledStyle, {backgroundColor: 'blue', shadowColor: 'blue', marginRight: AppSizes.paddingSml,}]} />
                                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}>{'Blue = Low Battery'}</Text>
                            </View>
                        </View>
                    }
                </View>
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                    containerStyle={{alignItems: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, width: '60%',}}
                    onPress={() => nextBtn()}
                    raised={true}
                    title={content.buttonText}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
            </View>
        </View>
    );
}

/* Export Components ================================================================= */
export {
    Battery,
    CVP,
    Calibration,
    Complete,
    Connect,
    ExtraPages,
    Placement,
    ReturnSensors,
    Session,
    TopNav,
    Train,
};