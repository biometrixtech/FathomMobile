/**
 * PostSessionSurvey
 *
    <PostSessionSurvey
        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
        handleFormChange={this._handleFormChange}
        handleFormSubmit={this._handlePostSessionSurveySubmit}
        handleHealthDataFormChange={this._handleHealthDataFormChange}
        handleTogglePostSessionSurvey={this._handleTogglePostSessionSurvey}
        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
        healthKitWorkouts={healthData.workouts.length > 0 ? healthData.workouts : null}
        postSession={this.state.postSession}
        soreBodyParts={this.state.soreBodyParts}
        typicalSessions={this.props.plan.typicalSessions}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, MyPlan as MyPlanConstants, } from '../../../constants';
import { Spacer, TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

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
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';

/* Component ==================================================================== */
class PostSessionSurvey extends Component {
    constructor(props) {
        super(props);
        const { healthKitWorkouts, } = this.props;
        this.state = {
            isActionButtonVisible:      false,
            isSlideUpPanelExpanded:     true,
            isSlideUpPanelOpen:         false,
            pageIndex:                  healthKitWorkouts && healthKitWorkouts.length > 0 ? 0 : 1,
            resetHealthKitFirstPage:    false,
            resetSportBuilderFirstPage: false,
        };
        this.areasOfSorenessRef = {};
        this.myAreasOfSorenessComponent = {};
        this.myClickedSorenessComponents = [];
        this.myPrevSorenessComponents = [];
        this.pages = {};
        this.scrollViewClickedSorenessRef = {};
        this.scrollViewPrevSorenessRef = {};
        this.scrollViewRPERef = {};
        this.sportScheduleBuilderRefs = [];
        this.timer = {};
    }

    componentWillUnmount = () => {
        // clear timer
        clearInterval(this.timer);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(prevState.pageIndex === 1 && this.state.pageIndex === 0) {
            this.setState(
                { resetHealthKitFirstPage: true, },
                () => this.setState({ resetHealthKitFirstPage: false, }),
            );
        }
    }

    _renderNextPage = (currentPage, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked, isHealthKitValid, isHKNextStep) => {
        let { isValid, pageNum, } = PlanLogic.handlePostSessionSurveyNextPage(this.state, currentPage, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked, isHealthKitValid, isHKNextStep);
        if(isValid) {
            this._updatePageIndex(pageNum);
        }
    }

    _renderPreviousPage = currentPage => {
        this.setState({ isActionButtonVisible: false, });
        const {
            healthKitWorkouts,
            postSession,
            soreBodyParts,
        } = this.props;
        let { newSoreBodyParts, } = PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, this.areasOfSorenessRef);
        let { pageNum, } = PlanLogic.handlePostSessionSurveyPreviousPage(this.state, currentPage, newSoreBodyParts, postSession.sessions, healthKitWorkouts);
        this._updatePageIndex(pageNum);
        this._resetStep(currentPage);
    }

    _updatePageIndex = (pageNum, callback) => {
        this.pages.scrollToPage(pageNum);
        this.setState(
            { isActionButtonVisible: false, pageIndex: pageNum, },
            () => callback && callback()
        );
    }

    _resetStep = currentStep => {
        const { handleFormChange, handleHealthDataFormChange, healthKitWorkouts, postSession, } = this.props;
        if(currentStep === 2 && healthKitWorkouts && healthKitWorkouts.length > 0) { // reset last index of AppleHealthKit
            let lastHealthKitIndex = _.findLastIndex(healthKitWorkouts);
            handleHealthDataFormChange(lastHealthKitIndex, 'deleted', false);
            handleHealthDataFormChange(lastHealthKitIndex, 'post_session_survey.RPE', null);
        } else if(currentStep === 2 || (healthKitWorkouts && healthKitWorkouts.length === 0)) { // reset SportScheduleBuilder
            let lastSessionsIndex = _.findLastIndex(postSession.sessions);
            this.sportScheduleBuilderRefs[lastSessionsIndex]._resetStep(false);
        }
    }

    _checkNextStep = (currentStep, isHealthKitValid, isHKNextStep) => {
        const {
            postSession,
            soreBodyParts,
        } = this.props;
        let { isFormValidItems, newSoreBodyParts, } = PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, this.areasOfSorenessRef);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, postSession.soreness);
        this.timer = _.delay(() => {
            this._renderNextPage(currentStep, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked, isHealthKitValid, isHKNextStep);
        }, 500);
    }

    _addSession = () => {
        const { pageIndex, } = this.state;
        let newSessions = _.cloneDeep(this.props.postSession.sessions);
        newSessions.push(PlanLogic.returnEmptySession());
        this.props.handleFormChange('sessions', newSessions);
        this._updatePageIndex((pageIndex + 1));
    }

    _handleSportScheduleBuilderGoBack = index => {
        const { handleFormChange, postSession, } = this.props;
        const { pageIndex, } = this.state;
        handleFormChange(`sessions[${(index - 1)}].post_session_survey.RPE`, null);
        this.sportScheduleBuilderRefs[(index - 1)]._resetStep(false);
        this._updatePageIndex((pageIndex - 1), () => {
            // remove index
            let newSessions = _.cloneDeep(postSession.sessions);
            newSessions = _.filter(newSessions, (session, i) => i !== index || (session.post_session_survey.RPE === 0 || session.post_session_survey.RPE > 0));
            handleFormChange('sessions', newSessions);
        });
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

    _scrollToBottom = scrollViewRef => {
        if(scrollViewRef) {
            this.timer = _.delay(() => {
                scrollViewRef.scrollToEnd({ animated: true, });
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

    _toggleSlideUpPanel = (isExpanded = true) => {
        this.setState({
            isSlideUpPanelExpanded: isExpanded,
            isSlideUpPanelOpen:     !this.state.isSlideUpPanelOpen,
        });
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

    render = () => {
        const {
            handleAreaOfSorenessClick,
            handleFormChange,
            handleFormSubmit,
            handleHealthDataFormChange,
            handleTogglePostSessionSurvey,
            handleUpdateFirstTimeExperience,
            healthKitWorkouts,
            postSession,
            soreBodyParts,
            typicalSessions,
            user,
        } = this.props;
        const {
            isActionButtonVisible,
            isCloseToBottom,
            isSlideUpPanelExpanded,
            isSlideUpPanelOpen,
            pageIndex,
            resetHealthKitFirstPage,
            resetSportBuilderFirstPage,
        } = this.state;
        let { isFormValidItems, newSoreBodyParts, } = PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, this.areasOfSorenessRef);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, postSession.soreness);
        let isFABVisible = areaOfSorenessClicked && isActionButtonVisible && areaOfSorenessClicked.length > 0;
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1,}}>

                <Pages
                    indicatorPosition={'none'}
                    ref={(pages) => { this.pages = pages; }}
                    scrollEnabled={false}
                    startPage={pageIndex}
                >

                    <View style={{flex: 1,}}>
                        { healthKitWorkouts && healthKitWorkouts.length > 0 &&
                            <HealthKitWorkouts
                                handleHealthDataFormChange={handleHealthDataFormChange}
                                handleNextStep={(isHealthKitValid, isHKNextStep) => this._checkNextStep(0, isHealthKitValid, isHKNextStep)}
                                handleTogglePostSessionSurvey={handleTogglePostSessionSurvey}
                                handleToggleSurvey={areAllDeleted => handleFormSubmit(areAllDeleted)}
                                isPostSession={true}
                                resetFirstPage={resetHealthKitFirstPage}
                                workouts={healthKitWorkouts}
                            />
                        }
                    </View>


                    { postSession.sessions && postSession.sessions.length > 0 ? _.map(postSession.sessions, (session, index) => {
                        const { isRPEValid, isSportValid, } = PlanLogic.handleSingleSessionValidation(session, this.sportScheduleBuilderRefs[index]);
                        return(
                            <View key={index} style={{flex: 1,}}>
                                <SportScheduleBuilder
                                    backNextButtonOptions={{
                                        isValid:  isRPEValid && isSportValid,
                                        onBack:   () => this._addSession(),
                                        onSubmit: () => this._checkNextStep(1),
                                    }}
                                    goBack={
                                        healthKitWorkouts && healthKitWorkouts.length > 0 && index === 0 ?
                                            () => this._renderPreviousPage(1)
                                            : index >= 1 ?
                                                () => this._handleSportScheduleBuilderGoBack(index)
                                                :
                                                null
                                    }
                                    handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                        handleFormChange(`sessions[${index}].${location}`, value, isPain, bodyPartMapIndex, bodyPartSide);
                                    }}
                                    handleTogglePostSessionSurvey={handleTogglePostSessionSurvey}
                                    postSession={session}
                                    ref={ref => {this.sportScheduleBuilderRefs[index] = ref;}}
                                    resetFirstPage={resetSportBuilderFirstPage}
                                    typicalSessions={typicalSessions}
                                />
                            </View>
                        )
                    }) : <View />}

                    { newSoreBodyParts.length > 0 ?
                        <ScrollView
                            contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                            nestedScrollEnabled={true}
                            ref={ref => {this.scrollViewPrevSorenessRef = ref;}}
                            stickyHeaderIndices={[0]}
                        >
                            <ProgressPill
                                currentStep={2}
                                onBack={() => this._renderPreviousPage(2)}
                                onClose={handleTogglePostSessionSurvey}
                                totalSteps={2}
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
                                        surveyObject={postSession}
                                        toggleSlideUpPanel={this._toggleSlideUpPanel}
                                    />
                                </View>
                            )}
                            <BackNextButtons
                                isValid={isFormValidItems.isPrevSorenessValid}
                                onNextClick={() => this._checkNextStep(2)}
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
                        onMomentumScrollEnd={event => this._scrollViewEndDrag(event)}
                        onScrollEndDrag={event => this._scrollViewEndDrag(event)}
                        overScrollMode={'never'}
                        ref={ref => {this.myAreasOfSorenessComponent = ref;}}
                        stickyHeaderIndices={[0]}
                    >
                        <ProgressPill
                            currentStep={2}
                            onBack={() => this._renderPreviousPage(3)}
                            onClose={handleTogglePostSessionSurvey}
                            totalSteps={2}
                        />
                        <AreasOfSoreness
                            handleAreaOfSorenessClick={(body, isAllGood, showFAB, resetSections) => {
                                if(!isCloseToBottom || (!body && showFAB)) {
                                    this.setState({ isActionButtonVisible: true, });
                                } else {
                                    this.setState({ isActionButtonVisible: false, });
                                }
                                handleAreaOfSorenessClick(body, false, isAllGood, resetSections);
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
                            soreBodyPartsState={postSession.soreness}
                            surveyObject={postSession}
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
                                this._renderNextPage(3, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked);
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
                            currentStep={2}
                            onBack={() => this._renderPreviousPage(4)}
                            onClose={handleTogglePostSessionSurvey}
                            totalSteps={2}
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
                                    surveyObject={postSession}
                                    toggleSlideUpPanel={this._toggleSlideUpPanel}
                                />
                            </View>
                        ))}
                        <BackNextButtons
                            handleFormSubmit={() => handleFormSubmit()}
                            isValid={isFormValidItems.areAreasOfSorenessValid}
                            onNextClick={() => this._renderNextPage(4, isFormValidItems)}
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
                    isSlideUpPanelExpanded={isSlideUpPanelExpanded}
                    isSlideUpPanelOpen={isSlideUpPanelOpen}
                    toggleSlideUpPanel={isExpanded => this._toggleSlideUpPanel(isExpanded)}
                />
            </View>
        )
    }
}

PostSessionSurvey.propTypes = {
    handleAreaOfSorenessClick:     PropTypes.func.isRequired,
    handleFormChange:              PropTypes.func.isRequired,
    handleFormSubmit:              PropTypes.func.isRequired,
    handleTogglePostSessionSurvey: PropTypes.func.isRequired,
    healthKitWorkouts:             PropTypes.array,
    postSession:                   PropTypes.object.isRequired,
    soreBodyParts:                 PropTypes.object.isRequired,
    typicalSessions:               PropTypes.array.isRequired,
    user:                          PropTypes.object.isRequired,
};

PostSessionSurvey.defaultProps = {
    healthKitWorkouts: null,
};

PostSessionSurvey.componentName = 'PostSessionSurvey';

/* Export Component ================================================================== */
export default PostSessionSurvey;