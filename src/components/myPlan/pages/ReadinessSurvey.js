/**
 * ReadinessSurvey
 *
    <ReadinessSurvey
        dailyReadiness={this.state.dailyReadiness}
        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
        handleFormChange={this._handleFormChange}
        handleFormSubmit={this._handleReadinessSurveySubmit}
        handleHealthDataFormChange={this._handleHealthDataFormChange}
        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
        handleUpdateUserHealthKitFlag={this._handleUpdateUserHealthKitFlag}
        healthKitWorkouts={this.state.healthData.workouts.length > 0 ? this.state.healthData.workouts : null}
        soreBodyParts={this.state.soreBodyParts}
        trainingSessions={dailyPlanObj.training_sessions}
        typicalSessions={this.props.plan.typicalSessions}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, Platform, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Checkbox, FathomModal, Spacer, TabIcon, Text, } from '../../custom';
import { EnableAppleHealthKit, } from '../../general';
import { AppUtil, PlanLogic, } from '../../../lib';

// Components
import {
    AreasOfSoreness,
    BackNextButtons,
    HealthKitWorkouts,
    ProgressPill,
    SoreBodyPart,
    SportScheduleBuilder,
    SurveySlideUpPanel,
} from './';

// import third-party libraries
import { ButtonGroup, } from 'react-native-elements';
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';

// consts
const helloPageText = 'Take a minute to complete your daily Readiness Survey and we\'ll update your Plan to your body and training.';
const firstTimeHelloPageText = 'This daily Readiness Survey helps us build the optimal Plan of pre & post training activities for your body & training habits.';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    floatingBottomButtons: {
        bottom:            0,
        flexDirection:     'row',
        justifyContent:    'space-between',
        paddingHorizontal: AppSizes.paddingSml,
        position:          'absolute',
        right:             0,
    },
    imageBackgroundStyle: {
        alignItems:      'center',
        alignSelf:       'stretch',
        backgroundColor: AppColors.transparent,
        flex:            1,
        justifyContent:  'center',
    },
    linearGradientStyle: {
        alignItems:        'center',
        alignSelf:         'stretch',
        flex:              1,
        overflow:          'visible',
        paddingHorizontal: 50,
        paddingVertical:   50,
    },
    modalButtonWrapper: {
        backgroundColor:   AppColors.zeplin.yellow,
        borderRadius:      100,
        paddingHorizontal: AppSizes.paddingXLrg,
        paddingVertical:   AppSizes.paddingMed,
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 3 },
        shadowRadius:  6,
        shadowOpacity: 1,
    },
});

/* Components ================================================================= */
class ReadinessSurvey extends Component {
    constructor(props) {
        super(props);
        const { user, } = this.props;
        this.state = {
            androidShowMoreOptions:      false,
            isActionButtonVisible:       false,
            isAppleHealthKitLoading:     false,
            isAppleHealthModalOpen:      !user.first_time_experience.includes('apple_healthkit') && !user.health_enabled && Platform.OS === 'ios',
            isBodyOverlayFront:          true,
            isCloseToBottom:             false,
            isDontAskChecked:            false,
            isFromHKAddSession:          false,
            isFromHKContinue:            false,
            isFromManualSessionContinue: false,
            isSlideUpPanelExpanded:      true,
            isSlideUpPanelOpen:          false,
            isSubmitSurveyModalOpen:     false,
            lockAlreadyTrainedBtn:       false,
            lockTrainLaterBtn:           false,
            pageIndex:                   0,
            resetHealthKitFirstPage:     false,
            resetSportBuilderFirstPage:  false,
        };
        this.myActivityTargetComponents = [];
        this.myAreasOfSorenessComponent = {};
        this.myClickedSorenessComponents = [];
        this.myPrevSorenessComponents = [];
        this.myRPEComponents = [];
        this.positionsComponents = [];
        this.scrollViewActivityTargetRef = {};
        this.scrollViewClickedSorenessRef = {};
        this.scrollViewPrevSorenessRef = {};
        this.sportScheduleBuilderRefs = [];
        this.pages = {};
        this.pickerTrainedAlreadyRefs = {};
        this.timer = {};
    }

    componentWillUnmount = () => {
        // clear timer
        clearInterval(this.timer);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(this.state.pageIndex === 1 && prevState.pageIndex !== this.state.pageIndex) { // reset HealthKit
            this.setState({ resetHealthKitFirstPage: true, }, () => this.setState({ resetHealthKitFirstPage: false, }));
        }
    }

    _toggleSlideUpPanel = (isExpanded = true) => {
        this.setState({
            isSlideUpPanelExpanded: isExpanded,
            isSlideUpPanelOpen:     !this.state.isSlideUpPanelOpen,
        });
    }

    _renderNextPage = (currentPage, isFormValidItems, newSoreBodyParts, sportBuilderRPEIndex, areaOfSorenessClicked, isHealthKitValid, isHKNextStep) => {
        const { dailyReadiness, healthKitWorkouts, } = this.props;
        let { isValid, pageNum, } = PlanLogic.handleReadinessSurveyNextPage(this.state, dailyReadiness, currentPage, isFormValidItems, newSoreBodyParts, sportBuilderRPEIndex, areaOfSorenessClicked, healthKitWorkouts, isHealthKitValid, isHKNextStep);
        if(isValid) {
            this._updatePageIndex(pageNum);
        }
        // set true so we know to go back here from train later
        if(isHKNextStep === 'add_session' || isHKNextStep === 'continue') {
            this.setState({
                isFromHKAddSession: isHKNextStep === 'add_session',
                isFromHKContinue:   isHKNextStep === 'continue',
            });
        }
    }

    _renderPreviousPage = (currentPage, isSessions) => {
        this.setState({ isActionButtonVisible: false, });
        if(currentPage === 4 && this.state.isFromHKContinue) {
            // lets go back to HK
            this.setState(
                { isFromHKContinue: false, },
                () => this._updatePageIndex(1),
            );
            this._resetStep(currentPage, 1, false);
        } else if(currentPage === 4 && this.state.isFromManualSessionContinue) {
            // lets go back to sport builder
            this.setState(
                { isFromManualSessionContinue: false, },
                () => this._updatePageIndex((this.state.pageIndex - 1)),
            );
            this._resetStep(currentPage, (this.state.pageIndex - 1), true);
        } else {
            const {
                dailyReadiness,
                healthKitWorkouts,
                soreBodyParts,
            } = this.props;
            let { newSoreBodyParts, } = PlanLogic.handleReadinessSurveyRenderLogic(dailyReadiness, soreBodyParts, this.areasOfSorenessRef);
            let { isTrainLater, pageNum, } = PlanLogic.handleReadinessSurveyPreviousPage(this.state, currentPage, newSoreBodyParts, healthKitWorkouts, dailyReadiness);
            this._updatePageIndex(pageNum);
            this._resetStep(currentPage, pageNum, isSessions, isTrainLater);
        }
    }

    _updatePageIndex = (pageNum, callback) => {
        this.pages.scrollToPage(pageNum);
        this.setState(
            { pageIndex: pageNum, },
            () => callback && callback()
        );
    }

    _resetStep = (currentStep, nextStep, isSessions, isTrainLater) => {
        const { dailyReadiness, handleFormChange, } = this.props;
        if((currentStep === 3 || currentStep === 4) && nextStep === 2) { // reset trained already?
            this.setState({ lockAlreadyTrainedBtn: !this.state.lockAlreadyTrainedBtn, });
            handleFormChange('already_trained_number', null);
        } else if(isTrainLater) { // reset train later?
            this.setState({ lockTrainLaterBtn: !this.state.lockTrainLaterBtn, });
            handleFormChange('sessions_planned', null);
        }
        if(isSessions) {
            let lastSessionsIndex = _.findLastIndex(dailyReadiness.sessions);
            if(lastSessionsIndex === 0 || lastSessionsIndex > 0) {
                handleFormChange(`sessions[${lastSessionsIndex}].post_session_survey.RPE`, null);
                this.sportScheduleBuilderRefs[lastSessionsIndex]._resetStep(false);
            }
        }
    }

    _resetSportBuilder = () => {
        _.map(this.sportScheduleBuilderRefs, (sportScheduleBuilderRef, index) => {
            if(sportScheduleBuilderRef) {
                sportScheduleBuilderRef._resetStep();
            }
        });
    }

    _checkNextStep = (currentPage, isHealthKitValid) => {
        const { dailyReadiness, soreBodyParts, } = this.props;
        let {
            isFormValidItems,
            newSoreBodyParts,
        } = PlanLogic.handleReadinessSurveyRenderLogic(dailyReadiness, soreBodyParts, this.areasOfSorenessRef);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, dailyReadiness.soreness);
        this.timer = _.delay(() => {
            this._renderNextPage(currentPage, isFormValidItems, newSoreBodyParts, null, areaOfSorenessClicked, isHealthKitValid);
        }, 500);
    }

    _addSession = () => {
        let newSessions = _.cloneDeep(this.props.dailyReadiness.sessions);
        newSessions.push(PlanLogic.returnEmptySession());
        this.props.handleFormChange('sessions', newSessions);
        this._checkNextStep(3);
    }

    _handleSportScheduleBuilderGoBack = index => {
        const { dailyReadiness, handleFormChange, } = this.props;
        const { pageIndex, } = this.state;
        if(index === 0 && this.state.isFromHKAddSession) {
            // lets go back to HK
            this.setState(
                { isFromHKAddSession: false, },
                () => this._updatePageIndex(1),
            );
            this.setState({ resetHealthKitFirstPage: true, }, () => this.setState({ resetHealthKitFirstPage: false, }));
        } else if(index === 0 && !this.state.isFromHKAddSession) { // going back to trained already screen
            this.setState({ lockAlreadyTrainedBtn: !this.state.lockAlreadyTrainedBtn, });
            handleFormChange('already_trained_number', null);
        } else {
            handleFormChange(`sessions[${(index - 1)}].post_session_survey.RPE`, null);
            this.sportScheduleBuilderRefs[(index - 1)]._resetStep(false);
        }
        this._updatePageIndex((pageIndex - 1), () => {
            if(index !== 0) {
                // remove index
                let newSessions = _.cloneDeep(dailyReadiness.sessions);
                newSessions = _.filter(newSessions, (session, i) => i !== index || (session.post_session_survey.RPE === 0 || session.post_session_survey.RPE > 0));
                handleFormChange('sessions', newSessions);
            }
        });
    }

    _scrollToBottom = scrollViewRef => {
        if(scrollViewRef) {
            this.timer = _.delay(() => {
                scrollViewRef.scrollToEnd({ animated: true, });
            }, 500);
        }
    }

    _scrollTo = (myComponentsLocation, scrollViewRef) => {
        if(myComponentsLocation && scrollViewRef) {
            this.timer = _.delay(() => {
                scrollViewRef.scrollTo({
                    x:        myComponentsLocation.x,
                    y:        myComponentsLocation.y,
                    animated: true,
                });
            }, 500);
        }
    }

    _scrollToTop = scrollViewRef => {
        if(scrollViewRef) {
            this.timer = _.delay(() => {
                scrollViewRef.scrollTo({x: 0, y: 0, animated: true});
            }, 500);
        }
    }

    _scrollViewEndDrag = event => {
        const offset = event.nativeEvent.contentOffset.y;
        let isCloseToBottom = event.nativeEvent.layoutMeasurement.height + offset >= event.nativeEvent.contentSize.height - 80;
        let isActionButtonVisible = (
            !isCloseToBottom // is NOT close to the bottom
        );
        this.setState({
            isActionButtonVisible,
            isCloseToBottom,
        });
    }

    _handleEnableAppleHealthKit = (firstTimeExperienceValue, healthKitFlag) => {
        const { user, } = this.props;
        this.setState({ isAppleHealthKitLoading: true, });
        AppUtil.getAppleHealthKitDataPrevious(user, user.health_sync_date, user.historic_health_sync_date)
            .then(() => AppUtil.getAppleHealthKitData(user, user.health_sync_date, user.historic_health_sync_date))
            .then(() => {
                this.props.handleUpdateFirstTimeExperience(firstTimeExperienceValue, () => {
                    this.props.handleUpdateUserHealthKitFlag(healthKitFlag, () => {
                        this.setState({ isAppleHealthKitLoading: false, isAppleHealthModalOpen: false, });
                    });
                });
            });
    }

    _handleSkipAppleHealthKit = value => {
        this.setState({ isAppleHealthKitLoading: true, });
        this.props.handleUpdateFirstTimeExperience(value, () => {
            this.setState({ isAppleHealthKitLoading: false, isAppleHealthModalOpen: false, });
        });
    }

    render = () => {
        const {
            dailyReadiness,
            handleAreaOfSorenessClick,
            handleFormChange,
            handleFormSubmit,
            handleHealthDataFormChange,
            handleUpdateFirstTimeExperience,
            healthKitWorkouts,
            soreBodyParts,
            trainingSessions,
            typicalSessions,
            user,
        } = this.props;
        const {
            isActionButtonVisible,
            isBodyOverlayFront,
            isCloseToBottom,
            isDontAskChecked,
            isSubmitSurveyModalOpen,
            pageIndex,
            resetHealthKitFirstPage,
            resetSportBuilderFirstPage,
        } = this.state;
        let {
            isFormValidItems,
            isSecondFunctionalStrength,
            newSoreBodyParts,
            partOfDay,
        } = PlanLogic.handleReadinessSurveyRenderLogic(dailyReadiness, soreBodyParts, this.areasOfSorenessRef);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, dailyReadiness.soreness);
        let isFABVisible = areaOfSorenessClicked && isActionButtonVisible && areaOfSorenessClicked.length > 0;
        let userFirstName = user && user.personal_data && user.personal_data.first_name && user.personal_data.first_name.length > 0 ?
            user.personal_data.first_name.toUpperCase()
            :
            '';
        /*eslint no-return-assign: 0*/
        return(
            <View style={{backgroundColor: AppColors.white, flex: 1,}}>

                <Pages
                    indicatorPosition={'none'}
                    ref={pages => { this.pages = pages; }}
                    scrollEnabled={false}
                    startPage={pageIndex}
                >

                    <View style={{flex: 1,}}>
                        <ImageBackground
                            source={require('../../../../assets/images/standard/tutorial_background_white.png')}
                            style={[styles.imageBackgroundStyle]}
                        >
                            <View style={[styles.linearGradientStyle]}>
                                <View style={{flex: 1, justifyContent: 'space-between',}}>
                                    <View />
                                    <View>
                                        <Text oswaldMedium style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(30), lineHeight: AppFonts.scaleFont(40),}}>
                                            {!user.first_time_experience.includes('rs_begin_page') ?
                                                'LET\'S CREATE YOUR FIRST ACTIVITIES!'
                                                :
                                                `GOOD ${partOfDay}, ${userFirstName}!`
                                            }
                                        </Text>
                                        <Spacer size={5} />
                                        <Text robotoLight style={{color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(15), lineHeight: AppFonts.scaleFont(25),}}>
                                            {!user.first_time_experience.includes('rs_begin_page') ?
                                                firstTimeHelloPageText
                                                :
                                                helloPageText
                                            }
                                        </Text>
                                        <Spacer size={10} />
                                        <Button
                                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, width: '100%',}}
                                            containerStyle={{alignItems: 'center',}}
                                            onPress={() => {
                                                this._renderNextPage(0, isFormValidItems)
                                            }}
                                            iconRight={true}
                                            title={'Begin'}
                                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(16), textAlign: 'center', width: '100%',}}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>

                    <View style={{flex: 1,}}>
                        { healthKitWorkouts && healthKitWorkouts.length > 0 &&
                            <HealthKitWorkouts
                                handleHealthDataFormChange={handleHealthDataFormChange}
                                handleNextStep={(isHealthKitValid, isHKNextStep) => this._renderNextPage(1, isFormValidItems, newSoreBodyParts, null, areaOfSorenessClicked, isHealthKitValid, isHKNextStep)}
                                handleToggleSurvey={() => this._renderNextPage(1, isFormValidItems, newSoreBodyParts, null, areaOfSorenessClicked, true)}
                                resetFirstPage={resetHealthKitFirstPage}
                                trainingSessions={trainingSessions}
                                user={user}
                                workouts={healthKitWorkouts}
                            />
                        }
                    </View>

                    <View style={{flex: 1,}}>
                        <ProgressPill
                            currentStep={1}
                            onBack={healthKitWorkouts ? () => this._renderPreviousPage(2) : null}
                            totalSteps={3}
                        />
                        <View style={[AppStyles.containerCentered, {flex: 1, paddingHorizontal: AppSizes.paddingXLrg,}]}>
                            <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(32),}]}>{'Have you already trained today?'}</Text>
                            <Spacer size={20} />
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 220,}}>
                                <TouchableHighlight
                                    onPress={() => {
                                        if(!this.state.lockAlreadyTrainedBtn) {
                                            this.setState(
                                                { lockAlreadyTrainedBtn: !this.state.lockAlreadyTrainedBtn},
                                                () => {
                                                    handleFormChange('already_trained_number', false);
                                                    this._checkNextStep(this.state.pageIndex);
                                                }
                                            );
                                        }
                                    }}
                                    style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.already_trained_number === false ? AppColors.zeplin.yellow : AppColors.primary.white.hundredPercent,
                                    }]}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text
                                        oswaldMedium
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:    dailyReadiness.already_trained_number === false ? AppColors.white : AppColors.zeplin.slate,
                                                fontSize: AppFonts.scaleFont(27),
                                            }
                                        ]}
                                    >
                                        {'NO'}
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => {
                                        if(!this.state.lockAlreadyTrainedBtn) {
                                            this.setState(
                                                { lockAlreadyTrainedBtn: !this.state.lockAlreadyTrainedBtn},
                                                () => {
                                                    this._resetSportBuilder();
                                                    handleFormChange('already_trained_number', 1);
                                                    this._checkNextStep(this.state.pageIndex);
                                                }
                                            );
                                        }
                                    }}
                                    style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.already_trained_number === 1 ? AppColors.zeplin.yellow : AppColors.primary.white.hundredPercent,
                                    }]}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text
                                        oswaldMedium
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:    dailyReadiness.already_trained_number === 1 ? AppColors.white : AppColors.zeplin.slate,
                                                fontSize: AppFonts.scaleFont(27),
                                            }
                                        ]}
                                    >
                                        {'YES'}
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <Spacer size={AppSizes.progressPillsHeight + AppSizes.statusBarHeight} />
                    </View>

                    { dailyReadiness.sessions && dailyReadiness.sessions.length > 0 ? _.map(dailyReadiness.sessions, (session, index) => {
                        const { isRPEValid, isSportValid, } = PlanLogic.handleSingleSessionValidation(session, this.sportScheduleBuilderRefs[index]);
                        return(
                            <View key={index} style={{flex: 1,}}>
                                <SportScheduleBuilder
                                    backNextButtonOptions={{
                                        isValid:  isRPEValid && isSportValid,
                                        onBack:   () => this._addSession(),
                                        onSubmit: () => this.setState({ isFromManualSessionContinue: true, } , () => this._checkNextStep(3)),
                                    }}
                                    goBack={() => this._handleSportScheduleBuilderGoBack(index)}
                                    handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                        handleFormChange(`sessions[${index}].${location}`, value, isPain, bodyPartMapIndex, bodyPartSide);
                                    }}
                                    postSession={session}
                                    ref={ref => {this.sportScheduleBuilderRefs[index] = ref;}}
                                    resetFirstPage={resetSportBuilderFirstPage}
                                    typicalSessions={typicalSessions}
                                />
                            </View>
                        )
                    }) : <View />}

                    <View style={{flex: 1,}}>
                        <ProgressPill
                            currentStep={2}
                            onBack={() => this._renderPreviousPage(4, dailyReadiness.sessions && dailyReadiness.sessions.length > 0)}
                            totalSteps={3}
                        />
                        <View style={[AppStyles.containerCentered, {flex: 1, paddingHorizontal: AppSizes.paddingXLrg,}]}>
                            <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(32),}]}>{'Will you train later today?'}</Text>
                            <Spacer size={20} />
                            <View
                                style={{
                                    flexDirection:  'row',
                                    justifyContent: 'space-between',
                                    width:          220,
                                }}
                            >
                                <TouchableHighlight
                                    onPress={() => {
                                        if(!this.state.lockTrainLaterBtn) {
                                            this.setState(
                                                { lockTrainLaterBtn: !this.state.lockTrainLaterBtn, },
                                                () => {
                                                    handleFormChange('sessions_planned', false);
                                                    this._checkNextStep(4);
                                                }
                                            );
                                        }
                                    }}
                                    style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.sessions_planned === false ? AppColors.zeplin.yellow : AppColors.primary.white.hundredPercent,
                                    }]}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text
                                        oswaldMedium
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:    dailyReadiness.sessions_planned === false ? AppColors.white : AppColors.zeplin.slate,
                                                fontSize: AppFonts.scaleFont(27),
                                            }
                                        ]}
                                    >
                                        {'NO'}
                                    </Text>
                                </TouchableHighlight>
                                <Spacer size={20} />
                                <TouchableHighlight
                                    onPress={() => {
                                        if(!this.state.lockTrainLaterBtn) {
                                            this.setState(
                                                { lockTrainLaterBtn: !this.state.lockTrainLaterBtn, },
                                                () => {
                                                    handleFormChange('sessions_planned', true);
                                                    this._checkNextStep(4);
                                                }
                                            );
                                        }
                                    }}
                                    style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.sessions_planned === true ? AppColors.zeplin.yellow : AppColors.primary.white.hundredPercent,
                                    }]}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text
                                        oswaldMedium
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:    dailyReadiness.sessions_planned === true ? AppColors.white : AppColors.zeplin.slate,
                                                fontSize: AppFonts.scaleFont(27),
                                            }
                                        ]}
                                    >
                                        {'YES'}
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <Spacer size={AppSizes.progressPillsHeight + AppSizes.statusBarHeight} />
                    </View>

                    { newSoreBodyParts.length > 0 ?
                        <ScrollView
                            bounces={false}
                            contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                            nestedScrollEnabled={true}
                            overScrollMode={'never'}
                            ref={ref => {this.scrollViewPrevSorenessRef = ref;}}
                            stickyHeaderIndices={[0]}
                        >
                            <ProgressPill
                                currentStep={3}
                                onBack={() => this._renderPreviousPage(5)}
                                totalSteps={3}
                            />
                            { _.map(newSoreBodyParts, (bodyPart, i) =>
                                <View
                                    key={i}
                                    onLayout={event => {
                                        let yLocation = (event.nativeEvent.layout.y - ((AppSizes.statusBarHeight + AppSizes.progressPillsHeight)));
                                        this.myPrevSorenessComponents[i] = {x: event.nativeEvent.layout.x, y: yLocation};
                                    }}
                                >
                                    <SoreBodyPart
                                        bodyPart={bodyPart}
                                        bodyPartSide={bodyPart.side}
                                        firstTimeExperience={user.first_time_experience}
                                        handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll, isMovementValue) => {
                                            handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide, bodyPart.isClearCandidate, isMovementValue);
                                            if(shouldScroll && (i + 1) === (newSoreBodyParts.length)) {
                                                this._scrollToBottom(this.scrollViewPrevSorenessRef);
                                            } else if(shouldScroll) {
                                                this._scrollTo(this.myPrevSorenessComponents[i + 1], this.scrollViewPrevSorenessRef);
                                            }
                                        }}
                                        handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                                        isFirst={i === 0}
                                        isLast={i === (newSoreBodyParts.length - 1)}
                                        isPrevSoreness={true}
                                        surveyObject={dailyReadiness}
                                        toggleSlideUpPanel={this._toggleSlideUpPanel}
                                    />
                                </View>
                            )}
                            <BackNextButtons
                                isValid={isFormValidItems.isPrevSorenessValid}
                                onNextClick={() => this._checkNextStep(5)}
                                showNextBtn={true}
                            />
                        </ScrollView>
                        :
                        <View />
                    }

                    <View style={{flex: 1,}}>
                        <ScrollView
                            bounces={false}
                            contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                            nestedScrollEnabled={true}
                            onScrollEndDrag={event => this._scrollViewEndDrag(event)}
                            overScrollMode={'never'}
                            ref={ref => {this.myAreasOfSorenessComponent = ref;}}
                            stickyHeaderIndices={[0]}
                        >
                            <ProgressPill
                                currentStep={3}
                                onBack={() => this._renderPreviousPage(6)}
                                totalSteps={3}
                            />
                            <AreasOfSoreness
                                handleAreaOfSorenessClick={(body, isAllGood, showFAB, resetSections, side, callback) => {
                                    // if(!isCloseToBottom || (!body && showFAB)) {
                                    //     this.setState({ isActionButtonVisible: true, });
                                    // }
                                    // if(!body && isAllGood) {
                                    //     this.setState({ isActionButtonVisible: false, });
                                    // }
                                    handleAreaOfSorenessClick(body, true, isAllGood, resetSections, side, callback);
                                }}
                                handleFormChange={handleFormChange}
                                handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                                headerTitle={'Do you have any areas of discomfort?'}//`Do you have any${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' other ' : ' new '}pain or soreness?`}
                                isBodyOverlayFront={isBodyOverlayFront}
                                ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
                                newSoreBodyParts={newSoreBodyParts}
                                scrollToArea={xyObject => {
                                    this._scrollTo(xyObject, this.myAreasOfSorenessComponent);
                                    this.setState({ isCloseToBottom: true, });
                                }}
                                scrollToTop={() => this._scrollToTop(this.myAreasOfSorenessComponent)}
                                soreBodyParts={soreBodyParts}
                                soreBodyPartsState={dailyReadiness.soreness}
                                surveyObject={dailyReadiness}
                                toggleSlideUpPanel={this._toggleSlideUpPanel}
                                user={user}
                            />
                        </ScrollView>
                        <View style={[styles.floatingBottomButtons,]}>
                            <View style={{flex: 1,}}>
                                <ButtonGroup
                                    buttons={['Front', 'Back']}
                                    containerStyle={{backgroundColor: `${AppColors.zeplin.splashXLight}${PlanLogic.returnHexOpacity(0.8)}`, borderRadius: AppSizes.paddingLrg, borderWidth: 0, marginLeft: 0, marginTop: 0,}}
                                    innerBorderStyle={{width: 0,}}
                                    onPress={selectedIndex => this.setState({ isBodyOverlayFront: (selectedIndex === 0), })}
                                    selectedButtonStyle={{backgroundColor: `${AppColors.zeplin.splashLight}${PlanLogic.returnHexOpacity(0.8)}`,}}
                                    selectedIndex={isBodyOverlayFront ? 0 : 1}
                                    selectedTextStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                                    textStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                                />
                            </View>
                            <View style={{flex: 1,}}>
                                <BackNextButtons
                                    addOpacityToSubmitBtn={0.8}
                                    handleFormSubmit={areaOfSorenessClicked.length > 0 || user.first_time_experience.includes('LAST_CHANCE_MODAL') ? () => handleFormSubmit(isSecondFunctionalStrength) : () => this.setState({ isSubmitSurveyModalOpen: true, })}
                                    isValid={this.areasOfSorenessRef && this.areasOfSorenessRef.state && !this.areasOfSorenessRef.state.isAllGood && !this.areasOfSorenessRef.state.showWholeArea ?
                                        true
                                        :
                                        isFormValidItems.selectAreasOfSorenessValid
                                    }
                                    onNextClick={() => {
                                        this.setState({ isActionButtonVisible: false, });
                                        this._renderNextPage(6, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked);
                                    }}
                                    showSubmitBtn={true}
                                    submitBtnText={areaOfSorenessClicked.length === 0 ? 'No, All Good!' : 'Submit'}
                                />
                            </View>
                        </View>
                    </View>

                    {/*<ScrollView
                        contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                        nestedScrollEnabled={true}
                        ref={ref => {this.scrollViewClickedSorenessRef = ref;}}
                        stickyHeaderIndices={[0]}
                    >
                        <ProgressPill
                            currentStep={3}
                            onBack={() => this._renderPreviousPage(7)}
                            totalSteps={3}
                        />
                        {_.map(areaOfSorenessClicked, (area, i) => (
                            <View
                                key={`AreasOfSoreness1${i}`}
                                onLayout={event => {
                                    let yLocation = (event.nativeEvent.layout.y - ((AppSizes.statusBarHeight + AppSizes.progressPillsHeight)));
                                    this.myClickedSorenessComponents[i] = {x: event.nativeEvent.layout.x, y: yLocation, height: event.nativeEvent.layout.height,};
                                }}
                            >
                                <SoreBodyPart
                                    bodyPart={MyPlanConstants.bodyPartMapping[area.body_part]}
                                    bodyPartSide={area.side}
                                    firstTimeExperience={user.first_time_experience}
                                    handleFormChange={handleFormChange}
                                    handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll, isMovementValue) => {
                                        handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide, false, isMovementValue);
                                        if(!(i === (areaOfSorenessClicked.length)) && shouldScroll && (i + 1) === (areaOfSorenessClicked.length)) {
                                            this._scrollToBottom(this.scrollViewClickedSorenessRef);
                                        } else if(!(i === (areaOfSorenessClicked.length - 1)) && shouldScroll) {
                                            this._scrollTo(this.myClickedSorenessComponents[i + 1], this.scrollViewClickedSorenessRef);
                                        }
                                    }}
                                    handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                                    isFirst={i === 0}
                                    isLast={i === (areaOfSorenessClicked.length - 1)}
                                    surveyObject={dailyReadiness}
                                    toggleSlideUpPanel={this._toggleSlideUpPanel}
                                />
                            </View>
                        ))}
                        <BackNextButtons
                            handleFormSubmit={() => handleFormSubmit(isSecondFunctionalStrength)}
                            isValid={isFormValidItems.areAreasOfSorenessValid}
                            onNextClick={() => this._renderNextPage(7, isFormValidItems)}
                            showSubmitBtn={true}
                        />
                    </ScrollView>*/}

                </Pages>

                {/* isFABVisible ?
                    <ActionButton
                        buttonColor={AppColors.zeplin.yellow}
                        degrees={0}
                        hideShadow
                        onPress={() => {this._scrollToBottom(this.myAreasOfSorenessComponent); this.setState({ isActionButtonVisible: false, isCloseToBottom: true, });}}
                        renderIcon={() =>
                            <TabIcon
                                color={AppColors.white}
                                icon={'chevron-down'}
                                raised={false}
                                type={'material-community'}
                            />
                        }
                        style={{flex: 1,}}
                    />
                    :
                    null
                */}

                <SurveySlideUpPanel
                    expandSlideUpPanel={() => this.setState({ isSlideUpPanelExpanded: true, })}
                    isSlideUpPanelExpanded={this.state.isSlideUpPanelExpanded}
                    isSlideUpPanelOpen={this.state.isSlideUpPanelOpen}
                    toggleSlideUpPanel={isExpanded => this._toggleSlideUpPanel(isExpanded)}
                />

                <EnableAppleHealthKit
                    handleSkip={value => this._handleSkipAppleHealthKit(value)}
                    handleEnableAppleHealthKit={this._handleEnableAppleHealthKit}
                    isLoading={this.state.isAppleHealthKitLoading}
                    isModalOpen={this.state.isAppleHealthModalOpen}
                />

                <FathomModal
                    isVisible={isSubmitSurveyModalOpen}
                    onBackdropPress={() => this.setState({ isSubmitSurveyModalOpen: false, })}
                >
                    <View style={{alignItems: 'center', justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(32), textAlign: 'center',}}>
                            {'Are you sure you\'re ready to submit?'}
                        </Text>
                        <Spacer size={AppSizes.paddingXLrg} />
                        <TouchableOpacity
                            onPress={() => this.setState({ isSubmitSurveyModalOpen: false, }, () => _.delay(() => handleFormSubmit(isSecondFunctionalStrength, this.state.isDontAskChecked ? 'LAST_CHANCE_MODAL' : false), 250))}
                            style={[styles.modalButtonWrapper,]}
                        >
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}>{'Submit Survey'}</Text>
                        </TouchableOpacity>
                        <Spacer size={AppSizes.padding} />
                        <TouchableOpacity
                            onPress={() => this.setState({ isSubmitSurveyModalOpen: false, })}
                            style={[styles.modalButtonWrapper,]}
                        >
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}>{'Log a symptom'}</Text>
                        </TouchableOpacity>
                        <Spacer size={AppSizes.paddingXLrg} />
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                            <Checkbox
                                checked={isDontAskChecked}
                                checkedIcon={'check-box'}
                                iconType={'material'}
                                onPress={() => this.setState({ isDontAskChecked: !this.state.isDontAskChecked, })}
                                uncheckedIcon={'check-box-outline-blank'}
                            />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15),}}>{'Don\'t ask me this again'}</Text>
                        </View>
                    </View>
                </FathomModal>

            </View>
        )
    }
}

ReadinessSurvey.propTypes = {
    dailyReadiness:                  PropTypes.object.isRequired,
    handleAreaOfSorenessClick:       PropTypes.func.isRequired,
    handleFormChange:                PropTypes.func.isRequired,
    handleFormSubmit:                PropTypes.func.isRequired,
    handleHealthDataFormChange:      PropTypes.func.isRequired,
    handleUpdateFirstTimeExperience: PropTypes.func.isRequired,
    healthKitWorkouts:               PropTypes.array,
    soreBodyParts:                   PropTypes.object.isRequired,
    trainingSessions:                PropTypes.array,
    typicalSessions:                 PropTypes.array,
    user:                            PropTypes.object.isRequired,
};

ReadinessSurvey.defaultProps = {
    healthKitWorkouts: null,
    trainingSessions:  [],
    typicalSession:    [],
};

ReadinessSurvey.componentName = 'ReadinessSurvey';

/* Export Component ================================================================== */
export default ReadinessSurvey;