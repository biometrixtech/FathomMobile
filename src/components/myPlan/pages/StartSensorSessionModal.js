/**
 * StartSensorSessionModal
 *
    <StartSensorSessionModal
        appState={appState}
        createSensorSession={createSensorSession}
        isModalOpen={isStartSensorSessionModalOpen}
        onClose={() => this.setState({ isStartSensorSessionModalOpen: false, })}
        updateSensorSession={updateSensorSession}
        updateUser={updateUser}
        user={user}
    />
 *
 */
/* global fetch console */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Animated, Alert, Easing, Platform, StyleSheet, View, } from 'react-native';

// Compoenents
import { Calibration, ExtraPages, Placement, TopNav, } from '../../kit/ConnectScreens';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { AnimatedProgressBar, Button, FathomModal, Spacer, TabIcon, Text, } from '../../custom';
import { store, } from '../../../store';
import { PlanLogic, } from '../../../lib';

// import third-party libraries
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import Accordion from 'react-native-collapsible/Accordion';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video';

// setup consts
const ACCORDION_SECTIONS = [
    { index: 1, sectionEndTime: 12, sectionStartTime: 14, time: 3, title: 'Adjust posture', },
    { index: 2, sectionEndTime: 9, sectionStartTime: 11, time: 3, title: 'Stand still', },
    { index: 3, sectionEndTime: 1, sectionStartTime: 8, time: 8, title: 'March', },
];
const START_SESSION_FIRST_TIME_EXPERIENCE = 'Start-Session-Tutorial';
const ERROR_HEADER = 'Poor connection!';
const ERROR_STRING = 'We were unable to start your workout due to poor wifi or network connection.\n\nMake sure your mobile device is connected to a reliable wifi or cellular network to start your workout.';

/* Component ==================================================================== */
const Calibrating = ({ onClose, pageIndex, renderAccordionHeader, startOver, videoEvents, }) => (
    <View style={{alignItems: 'center', flex: 1,}}>
        <View>
            <TabIcon
                color={AppColors.zeplin.slateLight}
                containerStyle={[{position: 'absolute', right: 10, top: 40, zIndex: 100,}]}
                icon={'close'}
                onPress={onClose}
                reverse={false}
                size={30}
            />
            <Video
                paused={!pageIndex}
                repeat={true}
                ref={ref => videoEvents(ref)}
                resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                source={require('../../../../assets/videos/calibration.mp4')}
                style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightHalf, width: AppSizes.screen.width,}]}
            />
        </View>
        <View style={{flex: 1, justifyContent: 'space-between', width: AppSizes.screen.width,}}>
            <Accordion
                activeSections={[]}
                onChange={activeSections => console.log('activeSections',activeSections)}
                renderContent={section => <View />}
                renderHeader={renderAccordionHeader}
                sections={ACCORDION_SECTIONS}
            />
            <LinearGradient
                colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.75)', 'rgba(255, 255, 255, 1)']}
                style={{
                    alignItems:     'center',
                    bottom:         0,
                    flexDirection:  'row',
                    justifyContent: 'center',
                    left:           0,
                    paddingBottom:  AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,
                    paddingTop:     AppSizes.paddingXLrg,
                    position:       'absolute',
                    right:          0,
                }}
            >
                <Button
                    buttonStyle={{alignItems: 'center', backgroundColor: AppColors.zeplin.splashLight, borderRadius: AppSizes.paddingLrg, justifyContent: 'center', paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: '100%',}}
                    containerStyle={{marginTop: AppSizes.padding, width: AppSizes.screen.widthThird,}}
                    icon={{
                        color:          AppColors.white,
                        containerStyle: { margin: 0, padding: 0, },
                        iconStyle:      { alignSelf: 'flex-end', margin: 0, },
                        name:           'restore-clock',
                        size:           25,
                        type:           'material-community',
                    }}
                    onPress={startOver}
                    raised={true}
                    title={'Start over'}
                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
            </LinearGradient>
        </View>
    </View>
);

const CalibrationComplete = ({ onClose, pageIndex, startOver, }) => (
    <View style={{flex: 1,}}>
        <TopNav darkColor={true} onClose={onClose} step={false} />
        <View style={{flex: 1, justifyContent: 'space-between',}}>
            <View />
            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                <LottieView
                    autoPlay={pageIndex}
                    loop={false}
                    source={require('../../../../assets/animation/calibrationcomplete.json')}
                    style={{height: AppSizes.screen.widthThird, width: AppSizes.screen.widthThird,}}
                />
                <Spacer size={AppSizes.padding} />
                <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(32), textAlign: 'center',}}>{'Calibration done!'}</Text>
                <Spacer size={AppSizes.padding} />
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                    {'Proper calibration is required to analyze your data.'}
                </Text>
                <Spacer size={AppSizes.padding} />
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'If needed, tap "Start over" to re-do calibration.'}</Text>
            </View>
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, paddingHorizontal: AppSizes.paddingSml,}}>
                <Button
                    buttonStyle={{alignItems: 'center', backgroundColor: AppColors.zeplin.splashLight, borderRadius: AppSizes.paddingLrg, justifyContent: 'center', paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: '100%',}}
                    containerStyle={{marginTop: AppSizes.padding, marginRight: AppSizes.paddingMed, width: AppSizes.screen.widthThird,}}
                    icon={{
                        color:          AppColors.white,
                        containerStyle: { margin: 0, padding: 0, },
                        iconStyle:      { alignSelf: 'flex-end', margin: 0, },
                        name:           'restore-clock',
                        size:           25,
                        type:           'material-community',
                    }}
                    onPress={startOver}
                    raised={true}
                    title={'Start over'}
                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
                <Button
                    buttonStyle={{alignItems: 'center', backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, justifyContent: 'center', paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: '100%',}}
                    containerStyle={{marginTop: AppSizes.padding, width: AppSizes.screen.widthHalf,}}
                    icon={{
                        color:          AppColors.white,
                        containerStyle: { margin: 0, padding: 0, },
                        iconStyle:      { alignSelf: 'flex-end', margin: 0, },
                        name:           'directions-run',
                        size:           25,
                    }}
                    onPress={onClose}
                    raised={true}
                    title={'Continue'}
                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginLeft: AppSizes.paddingSml,}}
                />
            </View>
        </View>
    </View>
);

class StartSensorSessionModal extends PureComponent {
    constructor(props) {
        super(props);
        const { user, } = this.props;
        this.state = {
            createError:           null,
            followAlongTimer:      0,
            isFirstTimeExperience: !user.first_time_experience.includes(START_SESSION_FIRST_TIME_EXPERIENCE),
            pageIndex:             0,
            sessionId:             null,
            showLEDPage:           false,
            showPlacementPages:    false,
            timer:                 15,
        };
        this._pages = {};
        this._video = {};
        this.timerId = null;
        this.widthAnimation = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps.appState !== this.props.appState) {
            this._handleAppStateChange(this.props.appState);
        }
        if(prevState.timer !== this.state.timer && this.state.timer === -1 && !this.state.createError) {
            clearInterval(this.timerId);
            this._renderNextPage(1, () => this.setState({ timer: 15, }, () => {this.widthAnimation = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];}));
        }
        if(prevState.timer !== this.state.timer && this.state.timer === 0 && this.state.createError) {
            this._pages.scrollToPage(0);
            this.setState(
                { pageIndex: 0, timer: 15, },
                () => {
                    this.widthAnimation = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];
                    Alert.alert(
                        ERROR_HEADER,
                        this.state.createError,
                        [
                            {
                                onPress: () => this.props.onClose(),
                                style:   'cancel',
                                text:    'OK',
                            },
                        ],
                        { cancelable: false, }
                    );
                },
            );
        }
    }

    componentWillUnmount = () => {
        this._pages = {};
        clearInterval(this.timerId);
        this.setState(
            { timer: 15, sessionId: null, },
            () => {this.widthAnimation = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];}
        );
    }

    _handleAppStateChange = nextAppState => {
        const { isFirstTimeExperience, pageIndex, showLEDPage, showPlacementPages, } = this.state;
        if(
            nextAppState === 'background' &&
            (
                (isFirstTimeExperience && (pageIndex === 9 || pageIndex === 10)) ||
                (!isFirstTimeExperience &&
                    ((showPlacementPages && pageIndex === 6) || (showLEDPage && pageIndex === 3) || pageIndex === 2) ||
                    ((showPlacementPages && pageIndex === 7) || (showLEDPage && pageIndex === 4) || pageIndex === 3)
                )
            )
        ) {
            this._onClose('CREATE_ATTEMPT_FAILED');
        }
    }

    _onClose = async patchSession => {
        const { onClose, updateSensorSession, user, } = this.props;
        const { sessionId, } = this.state;
        onClose();
        if(patchSession) {
            updateSensorSession(false, patchSession, sessionId, user)
                .then(res => console.log('res',res))
                .catch(err => console.log('err',err));
        }
    }

    _onPageScrollEnd = currentPage => {
        const { user, } = this.props;
        const { showLEDPage, showPlacementPages, } = this.state;
        this._video.seek(0);
        if(
            (currentPage === 2 || currentPage === 9) &&
            !showLEDPage &&
            !showPlacementPages &&
            user.first_time_experience.includes(START_SESSION_FIRST_TIME_EXPERIENCE)
        ) {
            this.timerId = setInterval(() => {
                let newTimerValue = parseInt((this.state.followAlongTimer + 100), 10);
                this.setState(
                    { followAlongTimer: newTimerValue, },
                    () => {
                        if(this.state.followAlongTimer === 100) {
                            clearInterval(this.timerId);
                            this.timerId = _.delay(() => this._renderNextPage(1, () => this.setState({ followAlongTimer: 0, })), 2500);
                        }
                    },
                );
            }, 500);
        } else if(
            (currentPage === 3 || currentPage === 10) &&
            !showLEDPage &&
            !showPlacementPages &&
            user.first_time_experience.includes(START_SESSION_FIRST_TIME_EXPERIENCE)
        ) {
            this.timerId = setInterval(() => {
                let newTimerValue = parseInt((this.state.timer - 1), 10);
                this.setState({ timer: newTimerValue, });
            }, 1000);
        }
        const checkpointPages = [7];
        if(checkpointPages.includes(currentPage)) { // we're on a checkpoint page, update user obj
            this._updateUserCheckpoint();
        }
    }

    _renderAccordionHeader = section => {
        const { timer, } = this.state;
        let isActive = section.sectionStartTime >= timer || timer <= section.sectionEndTime;
        let countdownTimer = ((timer - section.sectionEndTime) + 1);
        let specificTextColor = countdownTimer <= 0 ? AppColors.zeplin.slateLight : isActive ? AppColors.zeplin.splashLight : AppColors.zeplin.slateLight;
        let specificCircleColor = countdownTimer <= 0 ? AppColors.zeplin.slateXLight : isActive ? `${AppColors.zeplin.splashXLight}${PlanLogic.returnHexOpacity(0.5)}` : AppColors.zeplin.superLight;
        let updatedTimer = countdownTimer <= 0 ? 'Done!' : countdownTimer >= section.time ? `${section.time} sec` : `${countdownTimer} sec`;
        let circleSize = isActive || countdownTimer >= 0 ? 40 : 30;
        if(isActive && countdownTimer >= 0 && this.widthAnimation[(section.index - 1)]._value === 0) {
            const toValue = AppSizes.screen.width;
            Animated.timing(this.widthAnimation[(section.index - 1)], {
                duration: (section.time * 1000),
                easing:   Easing.linear,
                toValue:  toValue > 0 ? toValue : 0,
            }).start();
        }
        let animatedStyles = {
            backgroundColor: AppColors.zeplin.superLight,
            width:           this.widthAnimation[(section.index - 1)],
        };
        return (
            <View
                style={[
                    section.index === 3 ? {borderBottomColor: AppColors.zeplin.superLight, borderBottomWidth: 2,} : {},
                    {
                        alignItems:      'center',
                        backgroundColor: AppColors.white,
                        borderTopColor:  AppColors.zeplin.superLight,
                        borderTopWidth:  2,
                        flexDirection:   'row',
                        justifyContent:  'space-between',
                        padding:         AppSizes.padding,
                    }
                ]}
            >
                <Animated.View style={[StyleSheet.absoluteFill, animatedStyles,]} />
                <View style={{alignItems: 'center', flexDirection: 'row',}}>
                    <View
                        style={{
                            alignItems:      'center',
                            backgroundColor: specificCircleColor,
                            borderRadius:    (circleSize / 2),
                            height:          circleSize,
                            justifyContent:  'center',
                            marginRight:     AppSizes.paddingSml,
                            width:           circleSize,
                        }}
                    >
                        <Text
                            robotoRegular
                            style={{color: specificTextColor, fontSize: AppFonts.scaleFont(!isActive || countdownTimer <= 0 ? 15 : 19),}}
                        >
                            {section.index}
                        </Text>
                    </View>
                    <Text
                        robotoBold={isActive && countdownTimer >= 0}
                        robotoRegular={!isActive || countdownTimer <= 0}
                        style={{color: specificTextColor, fontSize: AppFonts.scaleFont(!isActive || countdownTimer <= 0 ? 18 : 22),}}
                    >
                        {section.title}
                    </Text>
                </View>
                <Text
                    robotoBold={isActive && countdownTimer >= 0}
                    robotoRegular={!isActive || countdownTimer <= 0}
                    style={{color: specificTextColor, fontSize: AppFonts.scaleFont(!isActive || countdownTimer <= 0 ? 18 : 22),}}
                >
                    {updatedTimer}
                </Text>
            </View>
        );
    };

    _renderNextPage = (numberOfPages = 1, callback) => {
        let nextPageIndex = (this.state.pageIndex + numberOfPages);
        this._pages.scrollToPage(nextPageIndex);
        this.setState(
            { pageIndex: nextPageIndex, },
            () => callback && callback()
        );
    }

    _renderPreviousPage = (numberOfPages = 1, callback, animate = true) => {
        let nextPageIndex = (this.state.pageIndex - numberOfPages);
        this._pages.scrollToPage(nextPageIndex, animate);
        this.setState(
            { pageIndex: nextPageIndex, },
            () => callback && callback(),
        );
    }

    _startCalibration = async () => {
        const { updateSensorSession, user, } = this.props;
        const { sessionId, } = this.state;
        if(sessionId) {
            return updateSensorSession(false, 'CREATE_ATTEMPT_FAILED', sessionId, user)
                .then(res => this.setState({ createError: null, sessionId: null, }, () => this._createSession()))
                .catch(err => this._createSession());
        }
        return this._createSession();
    }

    _createSession = async () => {
        const { createSensorSession, getSensorFiles, user, } = this.props;
        try {
            const timesyncApiCall = await fetch('http://worldtimeapi.org/api/timezone/America/New_York');
            const timesyncResponse = await timesyncApiCall.json();
            let dateTimeReturned = timesyncResponse.utc_datetime;
            let indexOfDot = dateTimeReturned.indexOf('.');
            dateTimeReturned = dateTimeReturned.substr(0, (indexOfDot + 3)) + 'Z';
            createSensorSession(dateTimeReturned, user)
                .then(res => this.setState({ sessionId: res.session.id, }))
                .then(() => getSensorFiles(user))
                .catch(err => this.setState({ createError: ERROR_STRING, }));
        } catch (e) {
            let dateErrorString = 'ERROR';
            createSensorSession(dateErrorString, user)
                .then(res => this.setState({ sessionId: res.session.id, }))
                .then(() => getSensorFiles(user))
                .catch(err => this.setState({ createError: ERROR_STRING, }));
        }
    }

    _startOver = (numberOfPagesBack, patchSession) => {
        const { sessionId, } = this.state;
        const { updateSensorSession, user, } = this.props;
        clearInterval(this.timerId);
        this.setState(
            { timer: 15, },
            () => {
                this.widthAnimation = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];
                if(patchSession) {
                    updateSensorSession(false, patchSession, sessionId, user)
                        .then(res => this.setState({ createError: null, sessionId: null, }))
                        .catch(err => console.log('err',err));
                }
                this._renderPreviousPage(numberOfPagesBack);
            }
        );
    }

    _updateUserCheckpoint = () => {
        const { updateUser, user, } = this.props;
        let value = START_SESSION_FIRST_TIME_EXPERIENCE;
        if(!user.first_time_experience.includes(value)) {
            let newUserPayloadObj = {};
            newUserPayloadObj.first_time_experience = [value];
            let newUserObj = _.cloneDeep(user);
            newUserObj.first_time_experience.push(value);
            // update reducer as API might take too long to return a value
            store.dispatch({
                type: DispatchActions.USER_REPLACE,
                data: newUserObj
            });
            // update user object
            updateUser(newUserPayloadObj, user.id, false);
        }
    }

    render = () => {
        const { isModalOpen, } = this.props;
        const { followAlongTimer, isFirstTimeExperience, pageIndex, showLEDPage, showPlacementPages, } = this.state;
        if(isFirstTimeExperience) {
            return(
                <FathomModal
                    isVisible={isModalOpen}
                >

                    <Pages
                        containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                        indicatorPosition={'none'}
                        onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)}
                        ref={pages => { this._pages = pages; }}
                        scrollEnabled={false}
                        startPage={pageIndex}
                    >

                        {/* Placement - page 0-6 */}
                        <Placement
                            currentPage={pageIndex === 0}
                            handleAlertPress={() => this._renderNextPage()}
                            nextBtn={() => this._renderNextPage(2)}
                            onClose={this._onClose}
                            page={1}
                            showTopNavStep={false}
                        />
                        { (pageIndex === 1) ?
                            <Placement
                                currentPage={pageIndex === 1}
                                nextBtn={this._renderNextPage}
                                onBack={this._renderPreviousPage}
                                onClose={this._onClose}
                                page={2}
                                showTopNavStep={false}
                            />
                            :
                            <View />
                        }
                        <Placement
                            currentPage={pageIndex === 2}
                            nextBtn={this._renderNextPage}
                            onBack={() => this._renderPreviousPage(2)}
                            onClose={this._onClose}
                            page={3}
                            showTopNavStep={false}
                        />
                        <Placement
                            currentPage={pageIndex === 3}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={this._onClose}
                            page={4}
                            showTopNavStep={false}
                        />
                        <Placement
                            currentPage={pageIndex === 4}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={this._onClose}
                            page={5}
                            showTopNavStep={false}
                        />
                        <Placement
                            currentPage={pageIndex === 5}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={this._onClose}
                            page={6}
                            showTopNavStep={false}
                        />
                        <Placement
                            currentPage={pageIndex === 6}
                            nextBtn={this._renderNextPage}
                            nextBtnText={'Next'}
                            onBack={this._renderPreviousPage}
                            onClose={this._onClose}
                            page={7}
                            showTopNavStep={false}
                        />

                        {/* Tutorial End - page 7 */}
                        <ExtraPages
                            nextBtn={this._renderNextPage}
                            nextBtnText={'Start Workout'}
                            onBack={this._renderPreviousPage}
                            onClose={this._onClose}
                            page={'start-workout'}
                        />

                        {/* Calibration - page 8 */}
                        <Calibration
                            currentPage={pageIndex === 8}
                            nextBtn={() => { this._renderNextPage(); this._startCalibration(); }}
                            nextBtnText={'Start Calibration'}
                            onClose={this._onClose}
                            page={1}
                            showTopNavStep={false}
                        />

                        {/* Start Session - page 9 (Follow Along) */}
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                            <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'Prepare to follow along'}</Text>
                            <View style={{alignItems: 'center', justifyContent: 'center', marginTop: AppSizes.paddingLrg,}}>
                                <AnimatedProgressBar
                                    backgroundColor={AppColors.zeplin.splashLight}
                                    barAnimationDuration={2000}
                                    borderColor={AppColors.zeplin.superLight}
                                    borderRadius={12}
                                    value={followAlongTimer}
                                    width={AppSizes.screen.widthTwoThirds}
                                    wrapperBackgroundColor={AppColors.zeplin.superLight}
                                />
                            </View>
                        </View>

                        {/* Start Session - pages 10 (Adjust Posture, Stand Still, March in Place) */}
                        <Calibrating
                            onClose={() => this._onClose('CREATE_ATTEMPT_FAILED')}
                            pageIndex={pageIndex === 10}
                            renderAccordionHeader={this._renderAccordionHeader}
                            startOver={() => this._startOver(2, 'CREATE_ATTEMPT_FAILED')}
                            videoEvents={ev => {this._video = ev;}}
                        />

                        {/* Start Session - pages 11 (Calibration Complete) */}
                        <CalibrationComplete
                            onClose={() => this._onClose()}
                            pageIndex={pageIndex === 11}
                            startOver={() => this._startOver(3, 'CREATE_ATTEMPT_FAILED')}
                        />

                    </Pages>

                </FathomModal>
            );
        }
        /*
          Confirm Placement - page 0
          Sensor LED - page 1
          Placement Pages - pages 1-4
          Calibration - showPlacementPages ? page 5 : showLEDPage ? page 2 : page 1
          Start Session - showPlacementPages ? page 6 : showLEDPage ? page 3 : page 2 (Follow Along)
          Start Session - showPlacementPages ? page 7 : showLEDPage ? page 4 : page 3 (Adjust Posture, Stand Still, March in Place)
          Start Session - showPlacementPages ? page 8 : showLEDPage ? page 5 : page 4 (Calibration Complete)
        */
        let LEDPageChildren = showLEDPage ?
            <Placement
                currentPage={pageIndex === 1}
                key={1}
                nextBtn={() => this._renderPreviousPage(1, () => this.setState({ showLEDPage: false, }))}
                nextBtnText={'Got It'}
                onBack={() => this._renderPreviousPage(1, () => this.setState({ showLEDPage: false, }))}
                onClose={this._onClose}
                page={2}
                showTopNavStep={false}
            />
            :
            false;
        let placementPagesChildren = showPlacementPages ?
            [
                <Placement
                    currentPage={pageIndex === 1}
                    key={2}
                    nextBtn={this._renderNextPage}
                    onBack={() => this._renderPreviousPage(1, () => this.setState({ showPlacementPages: false, }))}
                    onClose={this._onClose}
                    page={4}
                    showTopNavStep={false}
                />,
                <Placement
                    currentPage={pageIndex === 2}
                    key={3}
                    nextBtn={this._renderNextPage}
                    onBack={this._renderPreviousPage}
                    onClose={this._onClose}
                    page={5}
                    showTopNavStep={false}
                />,
                <Placement
                    currentPage={pageIndex === 3}
                    key={4}
                    nextBtn={this._renderNextPage}
                    onBack={this._renderPreviousPage}
                    onClose={this._onClose}
                    page={6}
                    showTopNavStep={false}
                />,
                <Placement
                    currentPage={pageIndex === 4}
                    key={5}
                    nextBtn={() => this._renderPreviousPage(4, () => this.setState({ showPlacementPages: false, }))}
                    nextBtnText={'Got It'}
                    onBack={this._renderPreviousPage}
                    onClose={this._onClose}
                    page={7}
                    showTopNavStep={false}
                />
            ]
            :
            false;
        let children = [
            <ExtraPages
                currentPage={pageIndex === 0}
                key={0}
                nextBtn={this._renderNextPage}
                nextBtnText={'Next'}
                onClose={this._onClose}
                onHelp={step => step === 'sensor-led' ?
                    this.setState({ showLEDPage: true, }, () => this._renderNextPage())
                    : step === 'sensor-placement' ?
                        this.setState({ showPlacementPages: true, }, () => this._renderNextPage())
                        :
                        null
                }
                page={'confirm-placement'}
            />,
            LEDPageChildren,
            placementPagesChildren,
            <Calibration
                currentPage={showPlacementPages ? pageIndex === 5 : showLEDPage ? pageIndex === 2 : pageIndex === 1}
                key={6}
                nextBtn={() => { this._renderNextPage(); this._startCalibration(); }}
                nextBtnText={'Start Calibration'}
                onClose={this._onClose}
                page={1}
                showTopNavStep={false}
            />,
            <View key={7} style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'Prepare to follow along'}</Text>
                <View style={{alignItems: 'center', justifyContent: 'center', marginTop: AppSizes.paddingLrg,}}>
                    <AnimatedProgressBar
                        backgroundColor={AppColors.zeplin.splashLight}
                        barAnimationDuration={2000}
                        borderColor={AppColors.zeplin.superLight}
                        borderRadius={12}
                        value={followAlongTimer}
                        width={AppSizes.screen.widthTwoThirds}
                        wrapperBackgroundColor={AppColors.zeplin.superLight}
                    />
                </View>
            </View>,
            <Calibrating
                key={8}
                onClose={() => this._onClose('CREATE_ATTEMPT_FAILED')}
                pageIndex={showPlacementPages ? pageIndex === 7 : showLEDPage ? pageIndex === 4 : pageIndex === 3}
                renderAccordionHeader={this._renderAccordionHeader}
                startOver={() => this._startOver(2, 'CREATE_ATTEMPT_FAILED')}
                videoEvents={ev => {this._video = ev;}}
            />,
            <CalibrationComplete
                key={9}
                onClose={() => this._onClose()}
                pageIndex={showPlacementPages ? pageIndex === 8 : showLEDPage ? pageIndex === 5 : pageIndex === 4}
                startOver={() => this._startOver(3, 'CREATE_ATTEMPT_FAILED')}
            />
        ];
        let updatedChildren = _.filter(_.flatten(children));
        return (
            <FathomModal
                isVisible={isModalOpen}
            >
                <Pages
                    containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                    indicatorPosition={'none'}
                    onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)}
                    ref={pages => { this._pages = pages; }}
                    scrollEnabled={false}
                    startPage={pageIndex}
                >

                    {updatedChildren}

                </Pages>
            </FathomModal>
        );
    }
}

StartSensorSessionModal.propTypes = {
    appState:            PropTypes.string.isRequired,
    createSensorSession: PropTypes.func.isRequired,
    getSensorFiles:      PropTypes.func.isRequired,
    isModalOpen:         PropTypes.bool.isRequired,
    onClose:             PropTypes.func.isRequired,
    updateSensorSession: PropTypes.func.isRequired,
    updateUser:          PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};

StartSensorSessionModal.defaultProps = {};

StartSensorSessionModal.componentName = 'StartSensorSessionModal';

/* Export Component ================================================================== */
export default StartSensorSessionModal;