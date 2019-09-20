import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, ImageBackground, Platform, ScrollView, StyleSheet, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { Button, ListItem, Spacer, TabIcon, Text, } from '../custom';
import { SensorLogic, } from '../../lib';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
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
const TopNav = ({ darkColor, onBack, onClose, step, }) => {
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
                    <View style={{flex: 8, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <View
                            style={{borderBottomColor: step === 1 ? color : AppColors.transparent, borderBottomWidth: 1, paddingBottom: AppSizes.paddingXSml,}}
                        >
                            <Text
                                robotoBold={step === 1}
                                robotoLight={step !== 1}
                                style={{color: color, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}
                            >
                                {'Bluetooh'}
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
                                {'Wifi'}
                            </Text>
                        </View>
                        <View
                            style={{borderBottomColor: step === 3 ? color : AppColors.transparent, borderBottomWidth: 1, paddingBottom: AppSizes.paddingXSml,}}
                        >
                            <Text
                                robotoBold={step === 3}
                                robotoLight={step !== 3}
                                style={{color: color, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}
                            >
                                {'Train'}
                            </Text>
                        </View>
                    </View>
                    :
                    <View style={{flex: 8,}} />
                }
                <View style={{flex: 1,}}>
                    <TabIcon
                        color={color}
                        icon={'close'}
                        onPress={() => onClose ? onClose() : Actions.pop()}
                        reverse={false}
                        size={30}
                    />
                </View>
            </View>
        </View>
    );
};

const CVP = ({ currentPage, nextBtn, onClose, }) => (
    <View style={{backgroundColor: 'red', flex: 1,}}>
        <Video
            paused={!currentPage}
            repeat={true}
            resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
            source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/cvp.mp4'}}
            style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.black,} : {}, {height: AppSizes.screen.height, width: AppSizes.screen.width,}]}
        />
        <View style={{height: AppSizes.screen.height, position: 'absolute', width: AppSizes.screen.width,}}>
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
                        containerStyle={{alignItems: 'center', marginTop: AppSizes.paddingLrg, justifyContent: 'center', width: '75%',}}
                        onPress={() => nextBtn()}
                        raised={true}
                        title={'Let\'s Get Started'}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />
                </View>
            </View>
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
                        containerStyle={{alignItems: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, width: '45%',}}
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
                        <Text oswaldRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginBottom: AppSizes.paddingSml,}}>{'YOU\'LL NEED:'}</Text>
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

const Calibration = ({ currentPage, handleUpdateVolume, isVideoMuted, nextBtn, nextBtnText, onBack, onClose, page, showTopNavStep = true, }) => {
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
            <TopNav darkColor={true} onBack={onBack} step={showTopNavStep ? 2 : false} />
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
                        <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(32), textAlign: 'center',}}>{'Calibrate to start your run'}</Text>
                        <Spacer size={AppSizes.padding} />
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                            {'You will need to calibrate '}
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textDecorationLine: 'underline',}}>{'every time'}</Text>
                            {' before you train.'}
                        </Text>
                        <Spacer size={AppSizes.padding} />
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'Stand up in neutral posture\nThen tap start.'}</Text>
                    </View>
                    :
                    <View>
                        <Text oswaldRegular style={[styles.titleStyle, {paddingBottom: AppSizes.padding,}]}>{'CALIBRATE & START WORKOUT'}</Text>
                        <View>
                            <TabIcon
                                color={AppColors.zeplin.slateLight}
                                containerStyle={[{position: 'absolute', right: 10, top: 40, zIndex: 100,}]}
                                icon={isVideoMuted ? 'volume-off' : 'volume-up'}
                                onPress={() => handleUpdateVolume()}
                                size={20}
                            />
                            <Video
                                muted={isVideoMuted}
                                paused={!currentPage}
                                repeat={true}
                                resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                                source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/calibration.mp4'}}
                                style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                            />
                        </View>
                        <View style={{marginHorizontal: AppSizes.paddingLrg, marginTop: AppSizes.padding,}}>
                            <View style={{flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                                <Text robotoLight style={[styles.smallerText, {paddingRight: AppSizes.paddingSml,}]}>
                                    {'1.'}
                                </Text>
                                <Text robotoBold style={[styles.smallerText, {flex: 1,}]}>
                                    {'Stand'}
                                    <Text robotoLight>{' in neutral posture'}</Text>
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                                <Text robotoLight style={[styles.smallerText, {paddingRight: AppSizes.paddingSml,}]}>
                                    {'2.'}
                                </Text>
                                <Text robotoBold style={[styles.smallerText, {flex: 1,}]}>
                                    {'Click Button'}
                                    <Text robotoLight>{' & '}</Text>
                                    {'March'}
                                </Text>
                            </View>
                        </View>
                    </View>
                }
                { page !== 1 &&
                    <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',}}>
                        <Text robotoLight style={[styles.smallerText, {fontSize: AppFonts.scaleFont(15),}]}>
                            {'(Workout started when '}
                            <Text robotoBold>{'Running LED'}</Text>
                            {' is solid green)'}
                        </Text>
                    </View>
                }
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
                    <Button
                        buttonStyle={StyleSheet.flatten([AppStyles.buttonVerticalPadding, {backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, width: '100%',}])}
                        containerStyle={{justifyContent: 'flex-end', width: '100%',}}
                        onPress={() => nextBtn()}
                        title={nextBtnText ? nextBtnText : page === 1 ? 'Next' : 'Finish Calibration'}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />
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

const Complete = ({ currentNetwork, currentPage, isLoading, onBack, onClose, nextBtn, showTopNavStep = true, }) => (
    <View style={{flex: 1,}}>
        <TopNav darkColor={true} onBack={isLoading ? null : () => onBack()} onClose={isLoading ? null : () => onClose()} step={showTopNavStep ? 2 : false} />
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'space-between',}}>
            <View style={{flex: 6, justifyContent: 'center',}}>
                <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{'Success, You\'re Connected!'}</Text>
                <Spacer size={AppSizes.paddingMed} />
                <Video
                    paused={!currentPage}
                    repeat={true}
                    resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                    source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/upload_instructions.mp4'}}
                    style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                />
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
                    title={'Next'}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
            </View>
        </View>
    </View>
);

const Train = ({ currentPage, nextBtn, onBack, page, showTopNavStep = true, }) => (
    <View style={{flex: 1,}}>
        <TopNav darkColor={false} onBack={onBack} step={showTopNavStep ? 2 : false} />
    </View>
);

const ExtraPages = ({ nextBtn, nextBtnText, onBack, onClose, page, showTopNavStep = false, }) => {
    if(page === 'start-workout') {
        return (
            <ImageBackground
                source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/start_training.png'}} // TODO: UPDATE IMAGE
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
                                <TabIcon
                                    color={AppColors.zeplin.yellow}
                                    containerStyle={[{padding: AppSizes.paddingXSml,}]}
                                    icon={'access-time'} // TODO: UPDATE ICON
                                    reverse={false}
                                    size={20}
                                />
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginLeft: AppSizes.padding,}}>{'Mobile Device with service'}</Text>
                            </View>
                            <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                <TabIcon
                                    color={AppColors.zeplin.yellow}
                                    containerStyle={[{padding: AppSizes.paddingXSml,}]}
                                    icon={'directions-run'} // TODO: UPDATE ICON
                                    reverse={false}
                                    size={22}
                                />
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginLeft: AppSizes.padding,}}>{'Fathom PRO Sensors Placed'}</Text>
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
            <ImageBackground
                source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/start_training.png'}} // TODO: UPDATE IMAGE
                style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
            >
                <TopNav darkColor={false} onBack={onBack} onClose={onClose} step={showTopNavStep ? 3 : false} />
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <LinearGradient
                        colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                        style={{justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                    >
                        <View>
                            <Text robotoMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(30), marginBottom: AppSizes.paddingSml,}}>{'Place PRO Sensors'}</Text>
                        </View>
                        <View style={{justifyContent: 'space-between', marginBottom: AppSizes.paddingSml,}}>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginBottom: AppSizes.paddingSml,}}>{'You\'ll need:'}</Text>
                            <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                <TabIcon
                                    color={AppColors.zeplin.yellow}
                                    containerStyle={[{padding: AppSizes.paddingXSml,}]}
                                    icon={'access-time'} // TODO: UPDATE ICON
                                    reverse={false}
                                    size={20}
                                />
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginLeft: AppSizes.padding,}}>{'LEDs Green on Sensors'}</Text>
                            </View>
                            <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                <TabIcon
                                    color={AppColors.zeplin.yellow}
                                    containerStyle={[{padding: AppSizes.paddingXSml,}]}
                                    icon={'directions-run'} // TODO: UPDATE ICON
                                    reverse={false}
                                    size={22}
                                />
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginLeft: AppSizes.padding,}}>{'Proper Sensor Placement'}</Text>
                            </View>
                        </View>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignSelf: 'center', marginTop: AppSizes.padding, width: '75%',}}
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
    showTopNavStep = true,
}) => {
    let content = SensorLogic.getConnectContent(styles)[page];
    if(page > 0) {
        return (
            <View style={{flex: 1,}}>
                <TopNav darkColor={true} onBack={isWifiScanDone && onBack ? () => onBack() : null} onClose={onClose} step={showTopNavStep ? 4 : false} />
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
                { page !== 3 &&
                    <View style={{flex: 1, paddingTop: AppSizes.padding,}}>
                        <View style={{flex: 1, justifyContent: 'space-between',}}>
                            { content.subtitle &&
                                <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.padding,}}>
                                    {content.subtitle}
                                </View>
                            }
                            { page === 5 &&
                                <Text onPress={() => handleNotInRange()} robotoRegular style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14), marginVertical: AppSizes.paddingLrg, paddingHorizontal: AppSizes.paddingLrg, textAlign: 'center',}}>{'Is your Wifi LED off?'}</Text>
                            }
                        </View>
                        { (content.buttonText && nextBtn) &&
                            <Button
                                buttonStyle={StyleSheet.flatten([AppStyles.buttonVerticalPadding, {backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, width: '100%',}])}
                                containerStyle={{justifyContent: 'flex-end', width: '100%',}}
                                disabled={isNextDisabled || isLoading}
                                disabledStyle={{backgroundColor: AppColors.zeplin.slateXLight,}}
                                disabledTitleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                                loading={isLoading}
                                loadingProps={{color: AppColors.zeplin.yellow,}}
                                onPress={() => nextBtn()}
                                title={isNextDisabled ? 'Turn on Bluetooh to continue' : content.buttonText}
                                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                            />
                        }
                    </View>
                }
                { ( page === 3 && content.subtitle) &&
                    <View style={{paddingHorizontal: AppSizes.paddingLrg, paddingTop: AppSizes.padding,}}>
                        {content.subtitle}
                    </View>
                }
                { ( page === 3 && content.buttonText && nextBtn) &&
                    <Button
                        buttonStyle={StyleSheet.flatten([AppStyles.buttonVerticalPadding, {backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}])}
                        containerStyle={{flex: 1, justifyContent: 'flex-end', width: '100%',}}
                        disabled={isNextDisabled}
                        disabledStyle={StyleSheet.flatten([AppStyles.buttonVerticalPadding, {backgroundColor: AppColors.zeplin.slateXLight, borderRadius: 0, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}])}
                        disabledTitleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        onPress={() => nextBtn()}
                        title={isNextDisabled ? 'Turn on Bluetooh to continue' : content.buttonText}
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
                                <Text onPress={handleWifiScan} robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12), textDecorationLine: 'none',}}>{'Search again'}</Text>
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
            <TopNav darkColor={false} onBack={onBack} onClose={onClose} step={showTopNavStep ? 4 : false} />
            <View style={{flex: 1, justifyContent: 'flex-end',}}>
                <LinearGradient
                    colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                    style={{justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                >
                    <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), marginBottom: AppSizes.paddingSml,}}>{'Now, Let\'s Connect Wifi & Sync Workout'}</Text>
                    <View style={{justifyContent: 'space-between', marginBottom: AppSizes.paddingSml,}}>
                        <Text oswaldRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginBottom: AppSizes.paddingSml,}}>{'YOU\'LL NEED:'}</Text>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                            <TabIcon
                                color={AppColors.zeplin.yellow}
                                icon={'access-time'}
                                reverse={false}
                                size={20}
                            />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'2 minutes'}</Text>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                            <TabIcon
                                color={AppColors.zeplin.yellow}
                                icon={'bluetooth'}
                                reverse={false}
                                size={20}
                            />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'Mobile Bluetooth ON'}</Text>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                            <TabIcon
                                color={AppColors.zeplin.yellow}
                                icon={'wifi'}
                                reverse={false}
                                size={20}
                            />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'Preferred Wifi Network'}</Text>
                        </View>
                        <View>
                            <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/sensor/sensor_yellow.png')}
                                    style={{height: 20, width: 20,}}
                                />
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'Fathom PRO Kit'}</Text>
                            </View>
                        </View>
                    </View>
                    <Button
                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                        containerStyle={{alignSelf: 'center',marginTop: AppSizes.padding, width: '75%',}}
                        onPress={() => nextBtn()}
                        raised={true}
                        title={'Connect & Sync'}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />
                </LinearGradient>
            </View>
        </ImageBackground>
    );
};

/* Export Components ================================================================= */
export {
    Battery,
    CVP,
    Calibration,
    Complete,
    Connect,
    ExtraPages,
    Placement,
    Session,
    TopNav,
    Train,
};