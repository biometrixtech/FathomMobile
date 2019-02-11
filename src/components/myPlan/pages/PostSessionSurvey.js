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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Pages, Spacer, TabIcon, Text, } from '../../custom';
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
import _ from 'lodash';
import ActionButton from 'react-native-action-button';

/* Component ==================================================================== */
class PostSessionSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActionButtonVisible:  false,
            isSlideUpPanelExpanded: true,
            isSlideUpPanelOpen:     false,
            pageIndex:              0,
        };
        this.areasOfSorenessRef = {};
        this.myAreasOfSorenessComponent = {};
        this.myClickedSorenessComponents = [];
        this.myPrevSorenessComponents = [];
        this.pages = {};
        this.scrollViewClickedSorenessRef = {};
        this.scrollViewPrevSorenessRef = {};
        this.scrollViewRPERef = {};
        this.scrollViewSportBuilderRef = {};
        this.sportScheduleBuilderRef = {};
    }

    _renderNextPage = (currentPage, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked, isHealthKitValid) => {
        let { isValid, pageNum, } = PlanLogic.handlePostSessionSurveyNextPage(currentPage, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked, isHealthKitValid);
        if(isValid) {
            this._updatePageIndex(pageNum);
        }
    }

    _updatePageIndex = pageNum => {
        this.pages.scrollToPage(pageNum);
        this.setState({ pageIndex: pageNum, });
    }

    _checkNextStep = (currentStep, isHealthKitValid) => {
        const {
            postSession,
            soreBodyParts,
        } = this.props;
        let { isFormValidItems, newSoreBodyParts, } = PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, this.areasOfSorenessRef);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, postSession.soreness);
        _.delay(() => {
            this._renderNextPage(currentStep, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked, isHealthKitValid);
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

    _scrollToBottom = scrollViewRef => {
        _.delay(() => {
            scrollViewRef.scrollToEnd({ animated: true, });
        }, 500);
    }

    _scrollToTop = (scrollViewRef) => {
        _.delay(() => {
            scrollViewRef.scrollTo({x: 0, y: 0, animated: true});
        }, 500);
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
        const { isActionButtonVisible, isCloseToBottom, isSlideUpPanelExpanded, isSlideUpPanelOpen, pageIndex, } = this.state
        let { isFormValidItems, newSoreBodyParts, } = PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, this.areasOfSorenessRef);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, postSession.soreness);
        let isFABVisible = areaOfSorenessClicked && isActionButtonVisible && areaOfSorenessClicked.length > 0;
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1,}}>

                <Pages
                    indicatorPosition={'none'}
                    ref={(pages) => { this.pages = pages; }}
                    startPlay={pageIndex}
                >

                    <ScrollView
                        contentContainerStyle={{flexGrow: 1,}}
                        keyboardShouldPersistTaps={'always'}
                        ref={ref => {this.scrollViewSportBuilderRef = ref;}}
                    >
                        <ProgressPill currentStep={1} onClose={handleTogglePostSessionSurvey} totalSteps={2} />
                        { healthKitWorkouts && healthKitWorkouts.length > 0 ?
                            <HealthKitWorkouts
                                handleHealthDataFormChange={handleHealthDataFormChange}
                                handleNextStep={isHealthKitValid => this._checkNextStep(0, isHealthKitValid)}
                                handleToggleSurvey={handleFormSubmit}
                                scrollToArea={xyObject => {
                                    this._scrollTo(xyObject, this.scrollViewSportBuilderRef);
                                }}
                                workouts={healthKitWorkouts}
                            />
                            :
                            <SportScheduleBuilder
                                handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                    handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                                    if(location === 'RPE' && value >= 0) {
                                        this._checkNextStep(0);
                                    }
                                }}
                                isPostSession={true}
                                postSession={postSession}
                                ref={ref => {this.sportScheduleBuilderRef = ref;}}
                                scrollTo={() => null}
                                scrollToArea={xyObject => {
                                    this._scrollTo(xyObject, this.scrollViewSportBuilderRef);
                                }}
                                scrollToTop={() => this._scrollToTop(this.scrollViewSportBuilderRef)}
                                typicalSessions={typicalSessions}
                            />
                        }
                        <Spacer size={40} />
                    </ScrollView>

                    <ScrollView
                        contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                        ref={ref => {this.scrollViewPrevSorenessRef = ref;}}
                    >
                        { pageIndex === 1 &&
                            <View style={{flex: 1,}}>
                                <ProgressPill currentStep={2} onClose={handleTogglePostSessionSurvey} totalSteps={2} />
                                { _.map(newSoreBodyParts, (bodyPart, i) =>
                                    <View
                                        key={i}
                                        onLayout={event => {this.myPrevSorenessComponents[i] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y}}}
                                    >
                                        <SoreBodyPart
                                            bodyPart={bodyPart}
                                            bodyPartSide={bodyPart.side}
                                            firstTimeExperience={user.first_time_experience}
                                            handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                                handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide, bodyPart.isClearCandidate);
                                                if(shouldScroll && newSoreBodyParts.length !== (i + 1) && (newSoreBodyParts.length - 1) !== (i + 1)) {
                                                    this._scrollTo(this.myPrevSorenessComponents[i + 1], this.scrollViewPrevSorenessRef);
                                                } else if(shouldScroll) {
                                                    this._scrollToBottom(this.scrollViewPrevSorenessRef);
                                                }
                                                this._checkNextStep(1);
                                            }}
                                            handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                                            isFirst={i === 0}
                                            isPrevSoreness={true}
                                            surveyObject={postSession}
                                            toggleSlideUpPanel={this._toggleSlideUpPanel}
                                        />
                                    </View>
                                )}
                            </View>
                        }
                    </ScrollView>

                    <ScrollView
                        bounces={false}
                        contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                        nestedScrollEnabled={true}
                        onMomentumScrollEnd={event => this._scrollViewEndDrag(event)}
                        onScrollEndDrag={event => this._scrollViewEndDrag(event)}
                        overScrollMode={'never'}
                        ref={ref => {this.myAreasOfSorenessComponent = ref;}}
                    >
                        <ProgressPill currentStep={2} onClose={handleTogglePostSessionSurvey} totalSteps={2} />
                        <AreasOfSoreness
                            handleAreaOfSorenessClick={(body, isAllGood, showFAB) => {
                                if(!isCloseToBottom || (!body && showFAB)) {
                                    this.setState({ isActionButtonVisible: true, });
                                }
                                if(body) {
                                    handleAreaOfSorenessClick(body, false, isAllGood);
                                }
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
                            isValid={isFormValidItems.selectAreasOfSorenessValid}
                            onNextClick={() => {
                                this.setState({ isActionButtonVisible: false, });
                                this._renderNextPage(2, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked);
                            }}
                            showSubmitBtn={areaOfSorenessClicked.length === 0}
                        />
                    </ScrollView>

                    <ScrollView
                        contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                        nestedScrollEnabled={true}
                        ref={ref => {this.scrollViewClickedSorenessRef = ref;}}
                    >
                        <ProgressPill currentStep={2} onClose={handleTogglePostSessionSurvey} totalSteps={2} />
                        {_.map(areaOfSorenessClicked, (area, i) => (
                            <View
                                key={`AreasOfSoreness1${i}`}
                                onLayout={event => {this.myClickedSorenessComponents[i] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y, height: event.nativeEvent.layout.height,}}}
                            >
                                <SoreBodyPart
                                    bodyPart={MyPlanConstants.bodyPartMapping[area.body_part]}
                                    bodyPartSide={area.side}
                                    firstTimeExperience={user.first_time_experience}
                                    handleFormChange={handleFormChange}
                                    handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                        handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                                        if(shouldScroll && areaOfSorenessClicked.length !== (i + 1) && (areaOfSorenessClicked.length - 1) !== (i + 1)) {
                                            this._scrollTo(this.myClickedSorenessComponents[i + 1], this.scrollViewClickedSorenessRef);
                                        } else if(shouldScroll) {
                                            this._scrollToBottom(this.scrollViewClickedSorenessRef);
                                        }
                                    }}
                                    handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                                    isFirst={i === 0}
                                    surveyObject={postSession}
                                    toggleSlideUpPanel={this._toggleSlideUpPanel}
                                />
                            </View>
                        ))}
                        <BackNextButtons
                            handleFormSubmit={() => handleFormSubmit()}
                            isValid={isFormValidItems.areAreasOfSorenessValid}
                            onBackClick={() => this._updatePageIndex(pageIndex - 1)}
                            onNextClick={() => this._renderNextPage(3, isFormValidItems)}
                            showBackBtn={true}
                            showSubmitBtn={true}
                        />
                    </ScrollView>

                </Pages>

                { isFABVisible ?
                    <ActionButton
                        buttonColor={AppColors.primary.yellow.hundredPercent}
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