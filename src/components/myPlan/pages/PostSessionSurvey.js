/**
 * PostSessionSurvey
 *
    <PostSessionSurvey
        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
        handleFormChange={this._handleFormChange}
        handleFormSubmit={this._handlePostSessionSurveySubmit}
        handleTogglePostSessionSurvey={this._handleTogglePostSessionSurvey}
        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
        postSession={this.state.postSession}
        soreBodyParts={this.state.soreBodyParts}
        typicalSessions={this.props.plan.typicalSessions}
        user={user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TouchableHighlight, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Pages, Spacer, TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

// Components
import { AreasOfSoreness, BackNextButtons, ProgressPill, ScaleButton, SlideUpPanel, SoreBodyPart, SportScheduleBuilder, } from './';

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

    _renderNextPage = (currentPage, isFormValidItems, isBackBtn, newSoreBodyParts, areaOfSorenessClicked) => {
        const { postSession, } = this.props;
        let { isValid, pageNum, } = PlanLogic.handlePostSessionSurveyNextPage(postSession, currentPage, isFormValidItems, isBackBtn, newSoreBodyParts, areaOfSorenessClicked);
        if(isValid || isBackBtn) {
            this.pages.progress = pageNum;
            this.setState({ pageIndex: pageNum, });
        }
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
        let isCloseToBottom = event.nativeEvent.layoutMeasurement.height + offset >= event.nativeEvent.contentSize.height - 20;
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
            handleTogglePostSessionSurvey,
            handleUpdateFirstTimeExperience,
            postSession,
            soreBodyParts,
            typicalSessions,
            user,
        } = this.props;
        let { isFormValid, isFormValidItems, newSoreBodyParts, } = PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, this.areasOfSorenessRef);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, postSession.soreness);
        let isFABVisible = areaOfSorenessClicked && this.state.isActionButtonVisible && areaOfSorenessClicked.length > 0;
        const { isRPEValid, isSportValid, sportText, } = PlanLogic.handleSingleSessionValidation(postSession, this.sportScheduleBuilderRef);
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1,}}>

                <Pages
                    indicatorPosition={'none'}
                    ref={(pages) => { this.pages = pages; }}
                    startPlay={this.state.pageIndex}
                >

                    <ScrollView
                        contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                        ref={ref => {this.scrollViewSportBuilderRef = ref;}}
                    >
                        <ProgressPill currentStep={1} totalSteps={3} />
                        <Spacer size={20} />
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22),}]}>
                            {'Build the sentence'}
                        </Text>
                        <Spacer size={20} />
                        <SportScheduleBuilder
                            handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                            }}
                            isPostSession={true}
                            postSession={postSession}
                            ref={ref => {this.sportScheduleBuilderRef = ref;}}
                            scrollTo={() => null}
                            scrollToTop={() => this._scrollToTop(this.scrollViewSportBuilderRef)}
                            typicalSessions={typicalSessions}
                        />
                        <Spacer size={40} />
                        <BackNextButtons
                            isValid={isSportValid}
                            onNextClick={() => this._renderNextPage(0, {isSportValid}, false)}
                            showBackBtn={false}
                        />
                    </ScrollView>

                    <ScrollView
                        ref={ref => {this.scrollViewRPERef = ref;}}
                        style={{flex: 1,}}
                    >
                        <ProgressPill currentStep={1} totalSteps={3} />
                        <Spacer size={20} />
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`How was your ${sportText}?`}
                        </Text>
                        <View style={{flex: 1, paddingTop: AppSizes.paddingSml,}}>
                            { _.map(MyPlanConstants.postSessionFeel, (value, key) => {
                                let isSelected = postSession.RPE === key;
                                let opacity = isSelected ? 1 : (key * 0.1);
                                return(
                                    <TouchableHighlight
                                        key={value+key}
                                        onPress={() => {
                                            handleFormChange('RPE', key);
                                            this._scrollToBottom(this.scrollViewRPERef);
                                        }}
                                        underlayColor={AppColors.transparent}
                                    >
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingVertical: AppSizes.paddingXSml,}}>
                                            <View style={{alignItems: 'flex-end', alignSelf: 'center', flex: 4, justifyContent: 'center',}}>
                                                <ScaleButton
                                                    isSelected={isSelected}
                                                    keyLabel={key}
                                                    opacity={opacity}
                                                    sorenessPainMappingLength={MyPlanConstants.postSessionFeel.length}
                                                    updateStateAndForm={() => {
                                                        handleFormChange('RPE', key);
                                                        this._scrollToBottom(this.scrollViewRPERef);
                                                    }}
                                                />
                                            </View>
                                            <View style={{flex: 6, justifyContent: 'center', paddingLeft: AppSizes.padding,}}>
                                                <Text
                                                    oswaldMedium
                                                    style={{
                                                        color:    isSelected ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.darkGrey,
                                                        fontSize: AppFonts.scaleFont(isSelected ? 22 : 14),
                                                    }}
                                                >
                                                    {value.toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                )
                            })}
                        </View>
                        <BackNextButtons
                            isValid={isRPEValid}
                            onBackClick={() => this._renderNextPage(1, {isRPEValid}, true, newSoreBodyParts)}
                            onNextClick={() => this._renderNextPage(1, {isRPEValid}, false, newSoreBodyParts)}
                        />
                    </ScrollView>

                    <ScrollView
                        contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                        ref={ref => {this.scrollViewPrevSorenessRef = ref;}}
                    >
                        <ProgressPill currentStep={2} totalSteps={3} />
                        <Spacer size={20} />
                        { _.map(newSoreBodyParts, (bodyPart, i) =>
                            <View key={i} onLayout={event => {this.myPrevSorenessComponents[i] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 50}}}>
                                <SoreBodyPart
                                    bodyPart={MyPlanConstants.bodyPartMapping[bodyPart.body_part]}
                                    bodyPartSide={bodyPart.side}
                                    firstTimeExperience={user.first_time_experience}
                                    handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                        handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                                        if(shouldScroll && newSoreBodyParts.length !== (i + 1) && (newSoreBodyParts.length - 1) !== (i + 1)) {
                                            this._scrollTo(this.myPrevSorenessComponents[i + 1], this.scrollViewPrevSorenessRef);
                                        } else if(shouldScroll) {
                                            this._scrollToBottom(this.scrollViewPrevSorenessRef);
                                        }
                                    }}
                                    handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                                    isPrevSoreness={true}
                                    surveyObject={postSession}
                                    toggleSlideUpPanel={this._toggleSlideUpPanel}
                                />
                                <Spacer size={50} />
                            </View>
                        )}
                        <BackNextButtons
                            isValid={isFormValidItems.isPrevSorenessValid}
                            onBackClick={() => this._renderNextPage(2, isFormValidItems, true)}
                            onNextClick={() => this._renderNextPage(2, isFormValidItems, false)}
                        />
                    </ScrollView>

                    <ScrollView
                        bounces={false}
                        nestedScrollEnabled={true}
                        onScrollEndDrag={event => this._scrollViewEndDrag(event)}
                        overScrollMode={'never'}
                        ref={ref => {this.myAreasOfSorenessComponent = ref;}}
                        style={{flex: 1,}}
                    >
                        <ProgressPill currentStep={3} totalSteps={3} />
                        <Spacer size={20} />
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`Is anything${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' else ' : ' '}bothering you?`}
                        </Text>
                        <AreasOfSoreness
                            handleAreaOfSorenessClick={(body, isAllGood) => {
                                if(!this.state.isCloseToBottom) {
                                    this.setState({ isActionButtonVisible: true, });
                                }
                                handleAreaOfSorenessClick(body, false, isAllGood);
                            }}
                            handleFormChange={handleFormChange}
                            handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                            ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
                            scrollToBottom={() => {
                                this._scrollToBottom(this.myAreasOfSorenessComponent);
                                this.setState({ isCloseToBottom: true, });
                            }}
                            soreBodyParts={soreBodyParts}
                            soreBodyPartsState={postSession.soreness}
                            surveyObject={postSession}
                            toggleSlideUpPanel={this._toggleSlideUpPanel}
                            user={user}
                        />
                        <Spacer size={20} />
                        <BackNextButtons
                            handleFormSubmit={() => handleFormSubmit()}
                            isValid={isFormValidItems.selectAreasOfSorenessValid}
                            onBackClick={() => {
                                this.setState({ isActionButtonVisible: false, });
                                this._renderNextPage(3, isFormValidItems, true, newSoreBodyParts);
                            }}
                            onNextClick={() => {
                                this.setState({ isActionButtonVisible: false, });
                                this._renderNextPage(3, isFormValidItems, false, newSoreBodyParts, areaOfSorenessClicked);
                            }}
                            showSubmitBtn={areaOfSorenessClicked.length === 0}
                        />
                    </ScrollView>

                    <ScrollView
                        contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                        nestedScrollEnabled={true}
                        ref={ref => {this.scrollViewClickedSorenessRef = ref;}}
                    >
                        <ProgressPill currentStep={3} totalSteps={3} />
                        {_.map(areaOfSorenessClicked, (area, i) => (
                            <View
                                key={`AreasOfSoreness1${i}`}
                                onLayout={event => {this.myClickedSorenessComponents[i] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 50, height: event.nativeEvent.layout.height,}}}
                                style={[AppStyles.paddingVertical]}
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
                                    surveyObject={postSession}
                                    toggleSlideUpPanel={this._toggleSlideUpPanel}
                                />
                            </View>
                        ))}
                        <BackNextButtons
                            handleFormSubmit={() => handleFormSubmit()}
                            isValid={isFormValidItems.areAreasOfSorenessValid}
                            onBackClick={() => this._renderNextPage(4, isFormValidItems, true)}
                            onNextClick={() => this._renderNextPage(4, isFormValidItems, false)}
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
                <SlideUpPanel
                    expandSlideUpPanel={() => this.setState({ isSlideUpPanelExpanded: true, })}
                    isSlideUpPanelOpen={this.state.isSlideUpPanelOpen}
                    isSlideUpPanelExpanded={this.state.isSlideUpPanelExpanded}
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
    postSession:                   PropTypes.object.isRequired,
    soreBodyParts:                 PropTypes.object.isRequired,
    typicalSessions:               PropTypes.array.isRequired,
    user:                          PropTypes.object.isRequired,
};

PostSessionSurvey.defaultProps = {};

PostSessionSurvey.componentName = 'PostSessionSurvey';

/* Export Component ================================================================== */
export default PostSessionSurvey;