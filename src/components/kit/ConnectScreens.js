import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Animated, Image, ImageBackground, Platform, ScrollView, StyleSheet, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { Button, ListItem, Spacer, TabIcon, Text, } from '../custom';

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
        fontSize:  AppFonts.scaleFont(22),
        textAlign: 'center',
    },
    titleStyle: {
        color:     AppColors.zeplin.splash,
        fontSize:  AppFonts.scaleFont(28),
        textAlign: 'center',
    },
});

/* Components =================================================================== */
const CVP = ({ nextBtn, }) => (
    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
        <View style={{flexDirection: 'row',}}>
            <View style={{flex: 1,}} />
            <View style={{flex: 8,}}>
                <Text oswaldRegular style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(25), textAlign: 'center',}}>
                    {'WELCOME TO THE WORLD\'S MOST ADVANCE BIOMECHANICS TRACKING SYSTEM'}
                </Text>
            </View>
            <View style={{flex: 1,}}>
                <TabIcon
                    color={AppColors.zeplin.slateLight}
                    icon={'close'}
                    iconStyle={[{alignSelf: 'flex-start',}]}
                    onPress={() => Actions.pop()}
                    reverse={false}
                    size={30}
                />
            </View>
        </View>
        <View style={{alignItems: 'center', marginHorizontal: ((AppSizes.screen.width - AppSizes.screen.widthFourFifths) / 2),}}>
            <Image
                resizeMode={'contain'}
                source={require('../../../assets/images/sensor/CVP.png')}
                style={{alignSelf: 'center', height: (AppSizes.screen.width - (AppSizes.screen.width - AppSizes.screen.widthFourFifths)), width: (AppSizes.screen.width - (AppSizes.screen.width - AppSizes.screen.widthFourFifths)),}}
            />
            <Text robotoLight style={[styles.subtitleStyle,]}>
                {'Your Fathom PRO Kit is very expensive and can do these things. Be impressed.'}
            </Text>
            <Button
                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                containerStyle={{alignItems: 'center', marginTop: AppSizes.paddingLrg, justifyContent: 'center', width: '100%',}}
                onPress={() => nextBtn()}
                raised={true}
                title={'Let\'s Get Started'}
                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
            />
        </View>
    </View>
);

const TopNav = ({ darkColor, onBack, onClose, step, }) => {
    let color = darkColor ? AppColors.zeplin.slateLight : AppColors.white;
    return(
        <View>
            <View style={{backgroundColor: AppColors.transparent, height: AppSizes.statusBarHeight,}} />
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingVertical: AppSizes.padding,}}>
                <View style={{flex: 1,}}>
                    <TabIcon
                        color={color}
                        icon={'chevron-left'}
                        onPress={() => onBack()}
                        reverse={false}
                        size={30}
                        type={'material-community'}
                    />
                </View>
                { step ?
                    <View style={{flex: 8, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: AppSizes.padding,}}>
                        <View
                            style={{borderBottomColor: step === 1 ? color : AppColors.transparent, borderBottomWidth: 1, paddingBottom: AppSizes.paddingXSml,}}
                        >
                            <Text
                                robotoBold={step === 1}
                                robotoLight={step !== 1}
                                style={{color: color, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}
                            >
                                {'Place'}
                            </Text>
                        </View>
                        <View
                            style={{borderBottomColor: step === 2 ? color : AppColors.transparent, borderBottomWidth: 1, paddingBottom: AppSizes.paddingXSml,}}
                        >
                            <Text
                                robotoBold={step === 2}
                                robotoLight={step !== 2}
                                style={{color: color, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}
                            >
                                {'Calibrate'}
                            </Text>
                        </View>
                        <View
                            style={{borderBottomColor: step === 3 ? color : AppColors.transparent, borderBottomWidth: 1, paddingBottom: AppSizes.paddingXSml,}}
                        >
                            <Text
                                robotoBold={step === 3}
                                robotoLight={step !== 3}
                                style={{color: color, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}
                            >
                                {'Train'}
                            </Text>
                        </View>
                        <View
                            style={{borderBottomColor: step === 4 ? color : AppColors.transparent, borderBottomWidth: 1, paddingBottom: AppSizes.paddingXSml,}}
                        >
                            <Text
                                robotoBold={step === 4}
                                robotoLight={step !== 4}
                                style={{color: color, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}
                            >
                                {'Connect'}
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

const PLACEMENT_CONTENT = [
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
        image:      require('../../../assets/images/sensor/sensor_prep.png'),
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
        image:      require('../../../assets/images/sensor/adhesive_prep.png'),
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
        image:      require('../../../assets/images/sensor/f_sensor_placement.png'),
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
        image:      require('../../../assets/images/sensor/h_sensor_placement.png'),
        subtitle:   <Text robotoLight style={[styles.subtitleStyle,]}>{'Peel away the tan liner. Stick just above the tailbone in the center of your spine.'}</Text>,
        title:      <Text oswaldRegular style={[styles.titleStyle,]}>{'PLACE HIP SENSOR'}</Text>,
        video:      false,
    },
];

const Placement = ({ onBack, nextBtn, page, showTopNavStep = true, }) => {
    let content = PLACEMENT_CONTENT[page];
    if(page > 0) {
        return (
            <View style={{flex: 1,}}>
                { showTopNavStep &&
                    <TopNav darkColor={true} onBack={onBack} step={1} />
                }
                <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                    {content.title}
                </View>
                { content.image ?
                    <Image
                        resizeMode={'contain'}
                        source={content.image}
                        style={{alignSelf: 'center', height: (AppSizes.screen.width - AppSizes.paddingLrg), width: (AppSizes.screen.width - AppSizes.paddingLrg),}}
                    />
                    : content.video ?
                        <Video
                            paused={false}
                            repeat={true}
                            resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                            source={{uri: content.video}}
                            style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                        />
                        :
                        null
                }
                <View style={{paddingHorizontal: AppSizes.paddingLrg, paddingTop: AppSizes.padding,}}>
                    {content.subtitle}
                </View>
                <View style={{flex: 1,}}>
                    <Button
                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                        containerStyle={{flex: 1, justifyContent: 'flex-end', width: '100%',}}
                        onPress={() => nextBtn()}
                        title={content.buttonText}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />
                </View>
            </View>
        );
    }
    return (
        <ImageBackground
            source={require('../../../assets/images/sensor/start_tutorial.png')}
            style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
        >
            { showTopNavStep &&
                <TopNav darkColor={false} onBack={onBack} step={1} />
            }
            <View style={{flex: 1, justifyContent: 'flex-end',}}>
                <LinearGradient
                    colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                    style={{height: AppSizes.screen.heightThreeQuarters, justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                >
                    <View>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), marginBottom: AppSizes.paddingSml,}}>{'Ready to use your sensors?'}</Text>
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}>{'We recommend continuing the tutorial only when you are about to train.'}</Text>
                    </View>
                    <View style={{justifyContent: 'space-between',}}>
                        <Text oswaldRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginBottom: AppSizes.paddingSml,}}>{'YOU\'LL NEED:'}</Text>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                            <TabIcon
                                color={AppColors.zeplin.yellow}
                                icon={'access-time'}
                                reverse={false}
                                size={20}
                            />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'10 minutes'}</Text>
                        </View>
                        <View>
                            <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/sensor/sensor_yellow.png')}
                                    style={{height: 20, width: 20,}}
                                />
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'Fathom PRO Kit'}</Text>
                            </View>
                            <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                <View style={{height: 20, width: 20,}} />
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(12), marginLeft: AppSizes.padding,}}>{'SmartBase, Sensors, Adhesives'}</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row',}}>
                            <TabIcon
                                color={AppColors.zeplin.yellow}
                                icon={'directions-run'}
                                reverse={false}
                                size={20}
                            />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'Training Ready'}</Text>
                        </View>
                    </View>
                    <View>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignSelf: 'center',marginTop: AppSizes.padding, width: '75%',}}
                            onPress={() => nextBtn()}
                            raised={true}
                            title={'Start Tutorial'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>
                </LinearGradient>
            </View>
        </ImageBackground>
    );
};

const Calibration = ({ onBack, nextBtn, page, showTopNavStep = true, }) => {
    if(page === 0) {
        return (
            <ImageBackground
                source={require('../../../assets/images/sensor/start_calibration.png')}
                style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
            >
                { showTopNavStep &&
                    <TopNav darkColor={false} onBack={onBack} step={2} />
                }
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <LinearGradient
                        colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                        style={{height: AppSizes.screen.heightHalf, justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                    >
                        <View>
                            <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), marginBottom: AppSizes.paddingSml,}}>{'Now, let\'s start training!'}</Text>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}>{'You will need to calibrate every time you train. If you forget how, you can access these instructions anytime.'}</Text>
                        </View>
                        <View>
                            <Button
                                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                containerStyle={{alignSelf: 'center', marginTop: AppSizes.padding, width: '75%',}}
                                onPress={() => nextBtn()}
                                raised={true}
                                title={'Start Calibration'}
                                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                            />
                        </View>
                    </LinearGradient>
                </View>
            </ImageBackground>
        );
    }
    return (
        <View style={{flex: 1,}}>
            { showTopNavStep &&
                <TopNav darkColor={true} onBack={onBack} step={2} />
            }
            <View style={{flex: 1, justifyContent: 'space-between',}}>
                { page === 1 ?
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingMed,}}>
                        <TabIcon
                            color={AppColors.white}
                            containerStyle={[{backgroundColor: AppColors.zeplin.error, borderTopLeftRadius: 5, borderTopRightRadius: 5, paddingVertical: AppSizes.paddingSml,}]}
                            icon={'alert'}
                            size={28}
                            type={'material-community'}
                        />
                        <View style={{backgroundColor: AppColors.zeplin.superLight, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed,}}>
                            <Text robotoRegular style={[styles.subtitleStyle,]}>
                                {'Calibration is important for data quality. You will need to do this '}
                                <Text robotoBold style={{textDecorationLine: 'underline',}}>{'every time you train.'}</Text>
                            </Text>
                            <Text robotoRegular style={[styles.subtitleStyle,]}>
                                {'Always begin calibration by standing still in '}
                                <Text robotoBold style={{textDecorationLine: 'underline',}}>{'neutral posture!'}</Text>
                            </Text>
                        </View>
                    </View>
                    :
                    <View>
                        <Text oswaldRegular style={[styles.titleStyle, {paddingBottom: AppSizes.padding,}]}>{'CALIBRATE SENSORS'}</Text>
                        <Video
                            paused={false}
                            repeat={true}
                            resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                            source={{uri: 'https://dd4o7zw7l62dt.cloudfront.net/9.mp4'}}
                            style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                        />
                        <View style={{marginHorizontal: AppSizes.padding, marginTop: AppSizes.padding,}}>
                            <View style={{flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                                <Text robotoLight style={[styles.smallerText, {paddingRight: AppSizes.paddingSml,}]}>
                                    {'1.'}
                                </Text>
                                <Text robotoBold style={[styles.smallerText, {flex: 1,}]}>
                                    {'Stand'}
                                    <Text robotoLight>{' in a neutral posture'}</Text>
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                                <Text robotoLight style={[styles.smallerText, {paddingRight: AppSizes.paddingSml,}]}>
                                    {'2.'}
                                </Text>
                                <Text robotoBold style={[styles.smallerText, {flex: 1,}]}>
                                    {'Click Button'}
                                    <Text robotoLight>{' & '}</Text>
                                    {'Walk In Place'}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                                <Text robotoLight style={[styles.smallerText, {paddingRight: AppSizes.paddingSml,}]}>
                                    {'3.'}
                                </Text>
                                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap',}}>
                                    <Text robotoLight style={[styles.smallerText,]}>
                                        {'Done & '}
                                        <Text robotoBold>{'Ready to train'}</Text>
                                        {' when the '}
                                    </Text>
                                    <TabIcon
                                        color={AppColors.zeplin.slate}
                                        icon={'run'}
                                        size={20}
                                        type={'material-community'}
                                    />
                                    <Text robotoLight style={[styles.smallerText,]}>
                                        {' LED is solid green.'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                }
                { page !== 1 &&
                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), textAlign: 'center', textDecorationLine: 'underline',}}>{'My Smart Case LEDs Turned Off'}</Text>
                }
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                    containerStyle={{justifyContent: 'flex-end', width: '100%',}}
                    onPress={() => nextBtn()}
                    title={page === 1 ? 'Next' : 'Finish Calibration'}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
            </View>
        </View>
    );
};

const SESSION_CONTENT = [
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
        image:      require('../../../assets/images/sensor/return_sensors.png'),
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

const Session = ({ onBack, onClose, nextBtn, page, showTopNavStep = true, }) => {
    let content = SESSION_CONTENT[page];
    if(page === 0) {
        return (
            <ImageBackground
                source={require('../../../assets/images/sensor/start_training.png')}
                style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
            >
                { showTopNavStep &&
                    <TopNav darkColor={false} onBack={onBack} onClose={onClose} step={3} />
                }
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <LinearGradient
                        colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                        style={{height: AppSizes.screen.heightHalf, justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                    >
                        <View>
                            <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), marginBottom: AppSizes.paddingSml,}}>{'Go train, come back later'}</Text>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}>{'Come back into the app when you are done training and tap the button below to learn how to end your training.'}</Text>
                        </View>
                        <View>
                            <Button
                                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                containerStyle={{alignSelf: 'center', marginTop: AppSizes.padding, width: '75%',}}
                                onPress={() => nextBtn()}
                                raised={true}
                                title={'Start Training'}
                                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                            />
                        </View>
                    </LinearGradient>
                </View>
            </ImageBackground>
        );
    }
    return (
        <View style={{flex: 1,}}>
            { showTopNavStep &&
                <TopNav darkColor={true} onBack={onBack} step={3} />
            }
            <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                {content.title}
            </View>
            { content.image ?
                <Image
                    resizeMode={'contain'}
                    source={content.image}
                    style={{alignSelf: 'center', height: (AppSizes.screen.width - AppSizes.paddingLrg), width: (AppSizes.screen.width - AppSizes.paddingLrg),}}
                />
                : content.video ?
                    <Video
                        paused={false}
                        repeat={true}
                        resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                        source={{uri: content.video}}
                        style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                    />
                    :
                    null
            }
            <View style={{paddingHorizontal: AppSizes.paddingLrg, paddingTop: AppSizes.padding,}}>
                {content.subtitle}
            </View>
            <View style={{flex: 1,}}>
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                    containerStyle={{flex: 1, justifyContent: 'flex-end', width: '100%',}}
                    onPress={() => nextBtn()}
                    title={content.buttonText}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
            </View>
        </View>
    );
};

const Battery = ({ onBack, nextBtn, showTopNavStep = true, }) => (
    <View style={{flex: 1,}}>
        { showTopNavStep &&
            <TopNav darkColor={true} onBack={onBack} step={4} />
        }
        <View style={{flex: 1, justifyContent: 'space-between',}}>
            <View style={{paddingHorizontal: AppSizes.paddingLrg,}}>
                <Text oswaldRegular style={[styles.titleStyle,]}>{'CHECK YOUR BATTERY'}</Text>
            </View>
            <Image
                resizeMode={'contain'}
                source={require('../../../assets/images/sensor/battery.png')}
                style={{alignSelf: 'center', height: (AppSizes.screen.width - AppSizes.paddingLrg), width: (AppSizes.screen.width - AppSizes.paddingLrg),}}
            />
            <View style={{paddingHorizontal: AppSizes.paddingLrg,}}>
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{'With sensors inside & lid firmly closed...'}</Text>
                <Text robotoLight style={[styles.subtitleStyle,]}>
                    {'Firmly click the '}
                    <Text robotoBold>{'Training'}</Text>
                    {' Button:'}
                </Text>
                <View style={{marginHorizontal: AppSizes.paddingLrg, marginVertical: AppSizes.paddingXSml,}}>
                    <View style={{alignItems: 'center', flexDirection: 'row', paddingBottom: AppSizes.paddingXSml,}}>
                        <View style={{flexDirection: 'row',}}>
                            <View style={[styles.ledStyle, {backgroundColor: AppColors.transparent, marginRight: AppSizes.paddingSml,}]} />
                            <View style={[styles.ledStyle, {backgroundColor: 'green', shadowColor: 'green',}]} />
                        </View>
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}>{'Solid Green = charged'}</Text>
                    </View>
                    <View style={{alignItems: 'center', flexDirection: 'row', paddingBottom: AppSizes.paddingXSml,}}>
                        <View style={{flexDirection: 'row',}}>
                            <View style={[styles.ledStyle, {backgroundColor: AppColors.transparent, marginRight: AppSizes.paddingSml,}]} />
                            <View style={[styles.ledStyle, {backgroundColor: 'blue', shadowColor: 'blue',}]} />
                        </View>
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}>{'Solid Blue = charge after workout'}</Text>
                    </View>
                    <View style={{alignItems: 'center', flexDirection: 'row', paddingBottom: AppSizes.paddingXSml,}}>
                        <View style={{flexDirection: 'row',}}>
                            <View style={[styles.ledStyle, {backgroundColor: 'blue', marginRight: AppSizes.paddingSml, shadowColor: 'blue',}]} />
                            <View style={[styles.ledStyle, {backgroundColor: 'blue', shadowColor: 'blue',}]} />
                        </View>
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}>{'Blink Blue = charge now'}</Text>
                    </View>
                    <View style={{alignItems: 'center', flexDirection: 'row', paddingBottom: AppSizes.paddingXSml,}}>
                        <View style={{flexDirection: 'row',}}>
                            <View style={[styles.ledStyle, {backgroundColor: AppColors.transparent, marginRight: AppSizes.paddingSml,}]} />
                            <View style={[styles.ledStyle, {backgroundColor: 'red', shadowColor: 'red',}]} />
                        </View>
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}>{'Red = dead battery'}</Text>
                    </View>
                </View>
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>
                    {'Additional charging information can be found in your '}
                    <Text robotoBold>{'Kit Case'}</Text>
                </Text>
            </View>
            <Button
                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                containerStyle={{justifyContent: 'flex-end', width: '100%',}}
                onPress={() => nextBtn()}
                title={'Next'}
                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
            />
        </View>
    </View>
);

const Complete = ({ onBack, nextBtn, showTopNavStep = true, }) => (
    <View style={{flex: 1,}}>
        { showTopNavStep &&
            <TopNav darkColor={true} onBack={onBack} step={4} />
        }
        <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
            <Text oswaldRegular style={[styles.titleStyle,]}>{'TUTORIAL COMPLETE!'}</Text>
            <Text robotoLight style={[styles.smallerText, {textAlign: 'center',}]}>{'You can access this tutorial at anytime by tapping on your sensor icon in the top left corner of your Fathom App!'}</Text>
        </View>
        <Image
            resizeMode={'contain'}
            source={require('../../../assets/images/sensor/end_tutorial.png')}
            style={{alignSelf: 'center', height: (AppSizes.screen.width - AppSizes.paddingLrg), width: (AppSizes.screen.width - AppSizes.paddingLrg),}}
        />
        <View style={{flex: 1,}}>
            <Button
                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                containerStyle={{flex: 1, justifyContent: 'flex-end', width: '100%',}}
                onPress={() => nextBtn()}
                title={'End Tutorial'}
                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
            />
        </View>
    </View>
);

const CONNECT_CONTENT = [
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
        animatedImage: require('../../../assets/images/sensor/bluetooth_connect_phone.png'),
        buttonText:    false,
        image:         require('../../../assets/images/sensor/bluetooth_connect_kit.png'),
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
]

const Connect = ({
    availableNetworks = [],
    bounceValue,
    handleNetworkPress = () => {},
    handleNotInRange = () => {},
    handleWifiScan = () => {},
    isWifiScanDone = true,
    onBack,
    onClose,
    nextBtn,
    page,
    showTopNavStep = true,
}) => {
    let content = CONNECT_CONTENT[page];
    if(page > 0) {
        return (
            <View style={{flex: 1,}}>
                { showTopNavStep &&
                    <TopNav darkColor={true} onBack={onBack} onClose={onClose} step={4} />
                }
                <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                    {content.title}
                </View>
                { content.image ?
                    <Image
                        resizeMode={'contain'}
                        source={content.image}
                        style={{alignSelf: 'center', height: (AppSizes.screen.width - AppSizes.paddingLrg), width: (AppSizes.screen.width - AppSizes.paddingLrg),}}
                    />
                    : content.video ?
                        <Video
                            paused={false}
                            repeat={true}
                            resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                            source={{uri: content.video}}
                            style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightTwoFifths,}]}
                        />
                        :
                        null
                }
                { (page === 2 && content.animatedImage) &&
                    <View style={{flex: 1,}}>
                        <Image
                            resizeMode={'contain'}
                            source={content.animatedImage}
                            style={{alignSelf: 'center', width: (AppSizes.screen.width - AppSizes.paddingLrg),}}
                        />
                    </View>
                }
                {/* (page === 2 && content.animatedImage) &&
                    <Animated.View
                        style={[{position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "red",
                            // height: 100,
                            transform: [{translateY: bounceValue}]}]}
                    >
                        <Image
                            resizeMode={'contain'}
                            source={content.animatedImage}
                            style={{alignSelf: 'center', width: (AppSizes.screen.width - AppSizes.paddingLrg),}}
                        />
                    </Animated.View>
                */}
                { content.subtitle &&
                    <View style={{paddingHorizontal: AppSizes.paddingLrg, paddingTop: AppSizes.padding,}}>
                        {content.subtitle}
                    </View>
                }
                { page === 4 &&
                    <Text onPress={() => {}} robotoMedium style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14), marginVertical: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg, textAlign: 'center',}}>{'Is your Wifi LED off or blinking red?'}</Text>
                }
                { content.buttonText &&
                    <Button
                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                        containerStyle={{flex: 1, justifyContent: 'flex-end', width: '100%',}}
                        onPress={() => nextBtn()}
                        title={content.buttonText}
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
                                    title={network.ssid}
                                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}
                                />
                            )}
                        </ScrollView>
                        <Text onPress={() => handleNotInRange()} robotoMedium style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14), marginVertical: AppSizes.paddingLrg, paddingHorizontal: AppSizes.paddingLrg, textAlign: 'center',}}>{'I\'m not in range of my preferred wifi network'}</Text>
                    </View>
                }
            </View>
        );
    }
    return (
        <ImageBackground
            source={require('../../../assets/images/sensor/start_owner.png')}
            style={{height: AppSizes.screen.height, width: AppSizes.screen.width,}}
        >
            { showTopNavStep &&
                <TopNav darkColor={false} onBack={onBack} step={4} />
            }
            <View style={{flex: 1, justifyContent: 'flex-end',}}>
                <LinearGradient
                    colors={[`${AppColors.zeplin.splash}D9`, `${AppColors.zeplin.splashDark}D9`]}
                    style={{height: AppSizes.screen.heightThreeQuarters, justifyContent: 'space-between', padding: AppSizes.paddingLrg,}}
                >
                    <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35),}}>{'Now, let\'s connect your SmartBase to your phone.'}</Text>
                    <View style={{justifyContent: 'space-between',}}>
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
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20), marginLeft: AppSizes.padding,}}>{'SmartBase'}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignSelf: 'center',marginTop: AppSizes.padding, width: '75%',}}
                            onPress={() => nextBtn()}
                            raised={true}
                            title={'Continue'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>
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
    Placement,
    Session,
    TopNav,
};