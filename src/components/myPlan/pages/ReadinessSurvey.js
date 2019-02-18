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
        typicalSessions={this.props.plan.typicalSessions}
        user={user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, Platform, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Pages, Spacer, TabIcon, Text, } from '../../custom';
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
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import LinearGradient from 'react-native-linear-gradient';

// consts
const helloPageText = 'Let us know how you feel so we can adapt your Recovery Plan to your body. This simple survey shouldn\'t take more than 2-minutes.';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
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
            androidShowMoreOptions:     false,
            isActionButtonVisible:      false,
            isAppleHealthKitLoading:    false,
            isAppleHealthModalOpen:     !user.first_time_experience.includes('apple_healthkit') && !user.health_enabled && Platform.OS === 'ios',
            isCloseToBottom:            false,
            isSlideUpPanelExpanded:     true,
            isSlideUpPanelOpen:         false,
            lockAlreadyTrainedBtn:      false,
            lockTrainLaterBtn:          false,
            pageIndex:                  0,
            resetHealthKitFirstPage:    false,
            resetSportBuilderFirstPage: false,
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

    _renderNextPage = (currentPage, isFormValidItems, newSoreBodyParts, sportBuilderRPEIndex, areaOfSorenessClicked, isHealthKitValid) => {
        const { dailyReadiness, healthKitWorkouts, } = this.props;
        let { isValid, pageNum, } = PlanLogic.handleReadinessSurveyNextPage(this.state, dailyReadiness, currentPage, isFormValidItems, newSoreBodyParts, sportBuilderRPEIndex, areaOfSorenessClicked, healthKitWorkouts, isHealthKitValid);
        if(isValid) {
            this._updatePageIndex(pageNum);
        }
    }

    _renderPreviousPage = (currentPage, isSessions) => {
        this.setState({ isActionButtonVisible: false, });
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

    _updatePageIndex = pageNum => {
        this.pages.scrollToPage(pageNum);
        this.setState({ pageIndex: pageNum, });
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
            handleFormChange(`sessions[${lastSessionsIndex}].post_session_survey.RPE`, null);
            this.sportScheduleBuilderRefs[lastSessionsIndex]._resetStep(false);
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
        _.delay(() => {
            this._renderNextPage(currentPage, isFormValidItems, newSoreBodyParts, null, areaOfSorenessClicked, isHealthKitValid);
        }, 500);
    }

    _addSession = () => {
        let newSession = {
            description:         '',
            duration:            null,
            event_date:          null,
            post_session_survey: {
                RPE:        null,
                event_date: null,
                soreness:   [],
            },
            session_type:                   null,
            sport_name:                     null,
            strength_and_conditioning_type: null,
        };
        let newSessions = _.cloneDeep(this.props.dailyReadiness.sessions);
        newSessions.push(newSession);
        this.props.handleFormChange('sessions', newSessions);
        this._checkNextStep(this.state.pageIndex);
    }

    _handleSportScheduleBuilderGoBack = index => {
        const { handleFormChange, } = this.props;
        const { pageIndex, } = this.state;
        if(index === 0) { // going back to trained already screen
            this.setState({ lockAlreadyTrainedBtn: !this.state.lockAlreadyTrainedBtn, });
            handleFormChange('already_trained_number', null);
        } else {
            handleFormChange(`sessions[${(index - 1)}].post_session_survey.RPE`, null);
            this.sportScheduleBuilderRefs[(index - 1)]._resetStep(false);
        }
        this._updatePageIndex(pageIndex - 1);
    }

    _scrollToBottom = scrollViewRef => {
        _.delay(() => {
            scrollViewRef.scrollToEnd({ animated: true, });
        }, 500);
    }

    _scrollTo = (myComponentsLocation, scrollViewRef) => {
        if(myComponentsLocation) {
            _.delay(() => {
                scrollViewRef.scrollTo({
                    x:        myComponentsLocation.x,
                    y:        myComponentsLocation.y,
                    animated: true,
                });
            }, 500);
        }
    }

    _scrollToTop = (scrollViewRef) => {
        _.delay(() => {
            scrollViewRef.scrollTo({x: 0, y: 0, animated: true});
        }, 500);
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
        AppUtil.getAppleHealthKitData(user.id, user.health_sync_date, user.historic_health_sync_date)
            .then(() => {
                AppUtil.getAppleHealthKitDataPrevious(user.id, user.health_sync_date, user.historic_health_sync_date)
                    .then(() => {
                        this.props.handleUpdateFirstTimeExperience(firstTimeExperienceValue, () => {
                            this.props.handleUpdateUserHealthKitFlag(healthKitFlag, () => {
                                this.setState({ isAppleHealthKitLoading: false, isAppleHealthModalOpen: false, });
                            });
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
            typicalSessions,
            user,
        } = this.props;
        const { isActionButtonVisible, isCloseToBottom, pageIndex, resetHealthKitFirstPage, resetSportBuilderFirstPage, } = this.state;
        let {
            functionalStrengthTodaySubtext,
            isFirstFunctionalStrength,
            isFormValidItems,
            isSecondFunctionalStrength,
            newSoreBodyParts,
            partOfDay,
            selectedSportPositions,
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
                    ref={(pages) => { this.pages = pages; }}
                    startPlay={pageIndex}
                >

                    <View style={{flex: 1,}}>
                        <ImageBackground
                            source={require('../../../../assets/images/standard/start_page_background.png')}
                            style={[styles.imageBackgroundStyle]}
                        >
                            <LinearGradient
                                colors={['#ffffff00', 'white']}
                                start={{x: 0.0, y: 0.0}}
                                end={{x: 0.0, y: 0.65}}
                                style={[styles.linearGradientStyle]}
                            >
                                <View style={{flex: 1, justifyContent: 'space-between',}}>
                                    <View />
                                    <View>
                                        <Text oswaldMedium style={{color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(30), lineHeight: AppFonts.scaleFont(40),}}>{`GOOD ${partOfDay}, ${userFirstName}!`}</Text>
                                        <Spacer size={5} />
                                        <Text robotoLight style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15), lineHeight: AppFonts.scaleFont(25),}}>{helloPageText}</Text>
                                        <Spacer size={10} />
                                        <Button
                                            backgroundColor={AppColors.zeplin.yellow}
                                            buttonStyle={{borderRadius: 5, width: '100%',}}
                                            containerViewStyle={{marginLeft: 0, marginRight: 0}}
                                            color={AppColors.white}
                                            fontFamily={AppStyles.robotoBold.fontFamily}
                                            fontWeight={AppStyles.robotoBold.fontWeight}
                                            leftIcon={{
                                                color: AppColors.zeplin.yellow,
                                                name:  'chevron-right',
                                                size:  AppFonts.scaleFont(24),
                                                style: {flex: 1,},
                                            }}
                                            outlined={false}
                                            onPress={() => this._renderNextPage(0, isFormValidItems)}
                                            raised={false}
                                            rightIcon={{
                                                color: AppColors.white,
                                                name:  'chevron-right',
                                                size:  AppFonts.scaleFont(24),
                                                style: {flex: 1,},
                                            }}
                                            textStyle={{ flex: 8, fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                                            title={'Begin'}
                                        />
                                    </View>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </View>

                    <View style={{flex: 1,}}>
                        { healthKitWorkouts && healthKitWorkouts.length > 0 &&
                            <HealthKitWorkouts
                                handleHealthDataFormChange={handleHealthDataFormChange}
                                handleNextStep={isHealthKitValid => this._renderNextPage(1, isFormValidItems, newSoreBodyParts, null, areaOfSorenessClicked, isHealthKitValid)}
                                handleToggleSurvey={() => this._renderNextPage(1, isFormValidItems, newSoreBodyParts, null, areaOfSorenessClicked, true)}
                                resetFirstPage={resetHealthKitFirstPage}
                                workouts={healthKitWorkouts}
                            />
                        }
                    </View>

                    <View style={{flex: 1,}}>
                        { !healthKitWorkouts &&
                            <View style={{flex: 1,}}>
                                <ProgressPill
                                    currentStep={1}
                                    onBack={healthKitWorkouts ? () => this._renderPreviousPage(2) : null}
                                    totalSteps={3}
                                />
                                <View style={[AppStyles.containerCentered, {flex: 1, paddingHorizontal: AppSizes.paddingXLrg,}]}>
                                    <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>{'Have you already trained today?'}</Text>
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
                                                        color:    dailyReadiness.already_trained_number === false ? AppColors.white : AppColors.zeplin.blueGrey,
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
                                                        color:    dailyReadiness.already_trained_number === 1 ? AppColors.white : AppColors.zeplin.blueGrey,
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
                        }
                    </View>

                    { dailyReadiness.sessions && dailyReadiness.sessions.length > 0 ? _.map(dailyReadiness.sessions, (session, index) => {
                        const { isRPEValid, isSportValid, sportText, } = PlanLogic.handleSingleSessionValidation(session, this.sportScheduleBuilderRefs[index]);
                        return(
                            <View key={index} style={{flex: 1,}}>
                                <SportScheduleBuilder
                                    backNextButtonOptions={{
                                        isValid:  isRPEValid && isSportValid,
                                        onBack:   () => this._addSession(),
                                        onSubmit: () => this._checkNextStep(3),
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
                            <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>{'Will you train later today?'}</Text>
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
                                                { lockTrainLaterBtn: !this.state.lockTrainLaterBtn},
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
                                                color:    dailyReadiness.sessions_planned === false ? AppColors.white : AppColors.zeplin.blueGrey,
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
                                                { lockTrainLaterBtn: !this.state.lockTrainLaterBtn},
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
                                                color:    dailyReadiness.sessions_planned === true ? AppColors.white : AppColors.zeplin.blueGrey,
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
                                        let yLocation = !(i === 0) && !(i === (newSoreBodyParts.length - 1)) ?
                                            (event.nativeEvent.layout.y - ((AppSizes.statusBarHeight + AppSizes.progressPillsHeight)))
                                            :
                                            event.nativeEvent.layout.y;
                                        this.myPrevSorenessComponents[i] = {x: event.nativeEvent.layout.x, y: yLocation};
                                    }}
                                >
                                    <SoreBodyPart
                                        bodyPart={bodyPart}
                                        bodyPartSide={bodyPart.side}
                                        firstTimeExperience={user.first_time_experience}
                                        handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                            handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide, bodyPart.isClearCandidate);
                                            if(shouldScroll && (i + 1) === (newSoreBodyParts.length - 1)) {
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
                            handleAreaOfSorenessClick={(body, isAllGood, showFAB, resetSections) => {
                                if(!isCloseToBottom || (!body && showFAB)) {
                                    this.setState({ isActionButtonVisible: true, });
                                }
                                if(!body && isAllGood) {
                                    this.setState({ isActionButtonVisible: false, });
                                }
                                handleAreaOfSorenessClick(body, true, isAllGood, resetSections);
                            }}
                            handleFormChange={handleFormChange}
                            handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                            headerTitle={`Do you have any${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' other ' : ' new '}pain or soreness?`}
                            ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
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
                        <BackNextButtons
                            handleFormSubmit={() => handleFormSubmit()}
                            isValid={this.areasOfSorenessRef && this.areasOfSorenessRef.state && !this.areasOfSorenessRef.state.isAllGood && !this.areasOfSorenessRef.state.showWholeArea ?
                                false
                                :
                                isFormValidItems.selectAreasOfSorenessValid
                            }
                            onNextClick={() => {
                                this.setState({ isActionButtonVisible: false, });
                                this._renderNextPage(6, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked);
                            }}
                            showSubmitBtn={
                                (this.areasOfSorenessRef && this.areasOfSorenessRef.state && this.areasOfSorenessRef.state.showWholeArea) ?
                                    false
                                    :
                                    true
                            }
                        />
                    </ScrollView>

                    <ScrollView
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
                                    let yLocation = !(i === 0) && !(i === (areaOfSorenessClicked.length - 1)) ?
                                        (event.nativeEvent.layout.y - ((AppSizes.statusBarHeight + AppSizes.progressPillsHeight)))
                                        :
                                        event.nativeEvent.layout.y;
                                    this.myClickedSorenessComponents[i] = {x: event.nativeEvent.layout.x, y: yLocation, height: event.nativeEvent.layout.height,};
                                }}
                            >
                                <SoreBodyPart
                                    bodyPart={MyPlanConstants.bodyPartMapping[area.body_part]}
                                    bodyPartSide={area.side}
                                    firstTimeExperience={user.first_time_experience}
                                    handleFormChange={handleFormChange}
                                    handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                        handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                                        if(!(i === (areaOfSorenessClicked.length - 1)) && shouldScroll && (i + 1) === (areaOfSorenessClicked.length - 1)) {
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
                            handleFormSubmit={() => handleFormSubmit()}
                            isValid={isFormValidItems.areAreasOfSorenessValid}
                            onNextClick={() => this._renderNextPage(7, isFormValidItems)}
                            showSubmitBtn={true}
                        />
                    </ScrollView>

                </Pages>

                { isFABVisible ?
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
                }

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
    typicalSessions:                 PropTypes.array,
    user:                            PropTypes.object.isRequired,
};

ReadinessSurvey.defaultProps = {
    healthKitWorkouts: null,
    typicalSession:    [],
};

ReadinessSurvey.componentName = 'ReadinessSurvey';

/* Export Component ================================================================== */
export default ReadinessSurvey;