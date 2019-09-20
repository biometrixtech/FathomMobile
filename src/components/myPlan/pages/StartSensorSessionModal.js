/**
 * StartSensorSessionModal
 *
    <StartSensorSessionModal
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
import { Alert, Platform, StyleSheet, View, } from 'react-native';

// Compoenents
import { Calibration, ExtraPages, Placement, TopNav, } from '../../kit/ConnectScreens';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Button, FathomModal, Spacer, TabIcon, Text, } from '../../custom';
import { store, } from '../../../store';

// import third-party libraries
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import Accordion from 'react-native-collapsible/Accordion';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video';

// setup consts
const ACCORDION_SECTIONS = [
    { index: 1, sectionEndTime: 3, sectionStartTime: 1, time: 3, title: 'Adjust Posture', },
    { index: 2, sectionEndTime: 8, sectionStartTime: 4, time: 5, title: 'Stand Very Still', },
    { index: 3, sectionEndTime: 16, sectionStartTime: 9, time: 8, title: 'March in Place', },
];
const START_SESSION_FIRST_TIME_EXPERIENCE = 'Start-Session-Tutorial';

/* Component ==================================================================== */
const Calibrating = ({ onClose, pageIndex, renderAccordionHeader, startOver, }) => (
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
                muted={true}
                paused={pageIndex}
                repeat={true}
                resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                source={{uri: 'https://d2xll36aqjtmhz.cloudfront.net/calibration.mp4'}}
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
                style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, paddingTop: AppSizes.paddingXLrg,}}
            >
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.splashLight, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthThird,}}
                    containerStyle={{marginTop: AppSizes.padding, width: AppSizes.screen.widthThird,}}
                    onPress={startOver}
                    raised={true}
                    title={'Start over'}
                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
            </LinearGradient>
        </View>
    </View>
);

const CalibrationComplete = ({ onClose, startOver, }) => (
    <View style={{flex: 1,}}>
        <TopNav darkColor={true} onClose={onClose} step={false} />
        <View style={{flex: 1, justifyContent: 'space-between',}}>
            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                <LottieView
                    autoPlay={true}
                    loop={true}
                    source={require('../../../../assets/animation/calibrationalert.json')} // TODO: NEEDS TO BE UPDATED
                    style={{height: AppSizes.screen.widthThird, width: AppSizes.screen.widthThird,}}
                />
                <Spacer size={AppSizes.padding} />
                <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(32), textAlign: 'center',}}>{'Calibration done!'}</Text>
                <Spacer size={AppSizes.padding} />
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                    {'If you '}
                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textDecorationLine: 'underline',}}>{'missed or delayed'}</Text>
                    {' a step, we may not be able to analyze your data.'}
                </Text>
                <Spacer size={AppSizes.padding} />
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'If needed, tap "start over" to re-do calibration.'}</Text>
            </View>
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, paddingHorizontal: AppSizes.paddingSml,}}>
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.splashLight, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: '100%',}}
                    containerStyle={{marginTop: AppSizes.padding, marginRight: AppSizes.paddingMed, width: AppSizes.screen.widthThird,}}
                    onPress={startOver}
                    raised={true}
                    title={'Start over'}
                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                />
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: '100%',}}
                    containerStyle={{marginTop: AppSizes.padding, width: AppSizes.screen.widthHalf,}}
                    onPress={onClose}
                    raised={true}
                    title={'Start Workout'}
                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
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
            isFirstTimeExperience: !user.first_time_experience.includes(START_SESSION_FIRST_TIME_EXPERIENCE),
            pageIndex:             0,
            sessionId:             null,
            showLEDPage:           false,
            showPlacementPages:    false,
            timer:                 0,
        };
        this._pages = {};
        this.timerId = null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevState.timer !== this.state.timer && this.state.timer > 16) {
            clearInterval(this.timerId);
            this.setState(
                { timer: 0, },
                () => {
                    this.timerId = _.delay(this._renderNextPage, 500);
                },
            );
        }
        if(prevState.timer !== this.state.timer && this.state.timer === 16 && this.state.createError) {
            Alert.alert(
                'Error creating session',
                this.state.createError,
                [
                    {
                        text:  'OK',
                        style: 'cancel',
                    },
                ],
                { cancelable: false, }
            );
        }
    }

    componentWillUnmount = () => {
        this._pages = {};
        clearInterval(this.timerId);
        this.setState({ timer: 0, });
    }

    _onClose = async patchSession => {
        const { onClose, updateSensorSession, } = this.props;
        const { sessionId, } = this.state;
        onClose();
        if(patchSession) {
            updateSensorSession(false, patchSession, sessionId)
                .then(res => console.log('res',res))
                .catch(err => console.log('err',err));
        }
    }

    _onPageScrollEnd = currentPage => {
        const { user, } = this.props;
        const { showLEDPage, showPlacementPages, } = this.state;
        if(
            currentPage === 2 &&
            !showLEDPage &&
            !showPlacementPages &&
            user.first_time_experience.includes(START_SESSION_FIRST_TIME_EXPERIENCE)
        ) {
            this.timerId = _.delay(this._renderNextPage, 2000);
        } else if(
            currentPage === 3 &&
            !showLEDPage &&
            !showPlacementPages &&
            user.first_time_experience.includes(START_SESSION_FIRST_TIME_EXPERIENCE)
        ) {
            this.timerId = setInterval(() => {
                let newTimerValue = parseInt((this.state.timer + 1), 10);
                this.setState({ timer: newTimerValue, },);
            }, 1000);
        }
        const checkpointPages = [7];
        if(checkpointPages.includes(currentPage)) { // we're on a checkpoint page, update user obj
            this._updateUserCheckpoint();
        }
    }

    _renderAccordionHeader = section => {
        const { timer, } = this.state;
        let isActive = section.sectionStartTime <= timer || timer >= section.sectionEndTime;
        let widthValue = (timer - section.sectionStartTime) * (100 / (section.sectionEndTime - section.sectionStartTime));
        let animatedStyles = {
            backgroundColor: AppColors.zeplin.slateXLight,
            flex:            1,
            width:           widthValue >= 0 ? `${widthValue}%` : '0%',
        };
        let specificTextColor = isActive ? AppColors.zeplin.splash : AppColors.zeplin.slateLight;
        let specificCircleColor = isActive ? AppColors.zeplin.splashXLight : AppColors.zeplin.slateXLight;
        return (
            <View
                style={[
                    section.index === 3 ? {borderBottomColor: AppColors.zeplin.slateXLight, borderBottomWidth: 2,} : {},
                    {
                        alignItems:      'center',
                        backgroundColor: AppColors.white,
                        borderTopColor:  AppColors.zeplin.slateXLight,
                        borderTopWidth:  2,
                        flexDirection:   'row',
                        justifyContent:  'space-between',
                        padding:         AppSizes.padding,
                    }
                ]}
            >
                <View style={[StyleSheet.absoluteFill, animatedStyles,]} />
                <View style={{alignItems: 'center', flexDirection: 'row',}}>
                    <View
                        style={{
                            alignItems:      'center',
                            backgroundColor: specificCircleColor,
                            borderRadius:    (45 / 2),
                            height:          45,
                            justifyContent:  'center',
                            marginRight:     AppSizes.paddingSml,
                            width:           45,
                        }}
                    >
                        <Text robotoRegular style={{color: specificTextColor, fontSize: AppFonts.scaleFont(26),}}>{section.index}</Text>
                    </View>
                    <Text robotoBold={isActive} robotoRegular={!isActive} style={{color: specificTextColor, fontSize: AppFonts.scaleFont(25),}}>{section.title}</Text>
                </View>
                <Text robotoBold={isActive} robotoRegular={!isActive} style={{color: specificTextColor, fontSize: AppFonts.scaleFont(22),}}>{`${section.time} sec`}</Text>
            </View>
        );
    };

    _renderNextPage = (numberOfPages = 1) => {
        let nextPageIndex = (this.state.pageIndex + numberOfPages);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
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
        const { createSensorSession, getSensorFiles, user, } = this.props;
        const timesyncApiCall = await fetch('http://worldtimeapi.org/api/timezone/UTC');
        const timesyncResponse = await timesyncApiCall.json();
        let dateTimeReturned = timesyncResponse.utc_datetime;
        let indexOfDot = dateTimeReturned.indexOf('.');
        dateTimeReturned = dateTimeReturned.substr(0, (indexOfDot + 3)) + 'Z';
        createSensorSession(dateTimeReturned, user)
            .then(res => this.setState({ sessionId: res.session.id, }))
            .then(() => _.delay(() => getSensorFiles(user), 5000))
            .catch(err => this.setState({ createError: err.message, }));
    }

    _startOver = (numberOfPagesBack, patchSession) => {
        const { sessionId, } = this.state;
        const { updateSensorSession, } = this.props;
        clearInterval(this.timerId);
        this.setState(
            { timer: 0, },
            () => {
                if(patchSession) {
                    updateSensorSession(false, patchSession, sessionId)
                        .then(res => console.log('res',res))
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
        const { isFirstTimeExperience, pageIndex, showLEDPage, showPlacementPages, } = this.state;
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
                        <Placement
                            currentPage={pageIndex === 1}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={this._onClose}
                            page={2}
                            showTopNavStep={false}
                        />
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
                            <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'Follow along to calibrate'}</Text>
                        </View>

                        {/* Start Session - pages 10 (Adjust Posture, Stand Still, March in Place) */}
                        <Calibrating
                            onClose={() => this._onClose('CREATE_ATTEMPT_FAILED')}
                            pageIndex={pageIndex === 10}
                            renderAccordionHeader={this._renderAccordionHeader}
                            startOver={() => this._startOver(2, 'CREATE_ATTEMPT_FAILED')}
                        />

                        {/* Start Session - pages 11 (Calibration Complete) */}
                        <CalibrationComplete
                            onClose={() => this._onClose()}
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
                key={0}
                nextBtn={this._renderNextPage}
                nextBtnText={'Confirm Placement'}
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
                <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'Follow along to calibrate'}</Text>
            </View>,
            <Calibrating
                key={8}
                onClose={() => this._onClose('CREATE_ATTEMPT_FAILED')}
                pageIndex={showPlacementPages ? pageIndex === 7 : showLEDPage ? pageIndex === 4 : pageIndex === 3}
                renderAccordionHeader={this._renderAccordionHeader}
                startOver={() => this._startOver(2, 'CREATE_ATTEMPT_FAILED')}
            />,
            <CalibrationComplete
                key={9}
                onClose={() => this._onClose()}
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