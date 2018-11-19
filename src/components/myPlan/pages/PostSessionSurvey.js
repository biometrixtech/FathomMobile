/**
 * ReadinessSurvey
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
import { Image, ScrollView, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, MyPlan as MyPlanConstants, AppFonts, } from '../../../constants';
import { Button, FathomSlider, Spacer, TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

// Components
import { AreasOfSoreness, ScaleButton, SlideUpPanel, SoreBodyPart, SportScheduleBuilder, } from './';

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
        };
        this._scrollViewContentHeight = 0;
        this.myComponents = [];
        this.scrollViewRef = {};
    }

    _scrollTo = (index) => {
        let myComponentsLocation = this.myComponents[index];
        if(myComponentsLocation) {
            this._scrollToXY(myComponentsLocation.x, myComponentsLocation.y, true);
        }
    }

    _scrollToBottom = () => {
        _.delay(() => {
            this.scrollViewRef.scrollToEnd({ animated: true, });
        }, 500);
    }

    _scrollToTop = () => {
        _.delay(() => {
            this.scrollViewRef.scrollTo({x: 0, y: 0, animated: true});
        }, 500);
    }

    _toggleSlideUpPanel = (isExpanded = true) => {
        this.setState({
            isSlideUpPanelExpanded: isExpanded,
            isSlideUpPanelOpen:     !this.state.isSlideUpPanelOpen,
        });
    }

    _scrollViewEndDrag = (event, areaOfSorenessComponent) => {
        const offset = event.nativeEvent.contentOffset.y;
        let actualSoreBodyPartRefY = (areaOfSorenessComponent.y + areaOfSorenessComponent.height) - (this.areasOfSorenessRef.soreBodyPartRef.height + 50)
        let isCloseToBottom = event.nativeEvent.layoutMeasurement.height + offset >= event.nativeEvent.contentSize.height - 100;
        let isActionButtonVisible = (
            areaOfSorenessComponent &&
            offset >= areaOfSorenessComponent.y && // have we scrolled past areaOfSorenessComponent
            offset <= actualSoreBodyPartRefY && // have we scrolled to the end of areaOfSorenessComponent
            !isCloseToBottom // is NOT close to the bottom
        );
        this.setState({ isActionButtonVisible, });
    }

    _fabScrollClicked = areaOfSorenessComponent => {
        let actualSoreBodyPartRefY = (areaOfSorenessComponent.y + areaOfSorenessComponent.height) - (this.areasOfSorenessRef.soreBodyPartRef.height + 50);
        let approxEndHeight = (actualSoreBodyPartRefY + this.areasOfSorenessRef.soreBodyPartRef.height);
        if(
            this.areasOfSorenessRef &&
            this.areasOfSorenessRef.soreBodyPartRef &&
            this.areasOfSorenessRef.soreBodyPartRef.y &&
            (this._scrollViewContentHeight - approxEndHeight) > 200
        ) {
            this._scrollToXY(this.areasOfSorenessRef.soreBodyPartRef.x, actualSoreBodyPartRefY, true);
        } else {
            this._scrollToBottom();
        }
        this.setState({ isActionButtonVisible: false, });
    }

    _scrollToXY = (x, y, shouldAnimate = true) => {
        _.delay(() => {
            this.scrollViewRef.scrollTo({
                x:        x,
                y:        y,
                animated: shouldAnimate,
            });
        }, 500);
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
        let { isFormValid, newSoreBodyParts, } = PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, this.areasOfSorenessRef);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, postSession.soreness);
        let isFABVisible = areaOfSorenessClicked && this.state.isActionButtonVisible && areaOfSorenessClicked.length > 0;
        return (
            <View style={{flex: 1,}}>
                <ScrollView
                    bounces={false}
                    onContentSizeChange={(contentWidth, contentHeight) => {this._scrollViewContentHeight = contentHeight}}
                    onScrollEndDrag={event => this._scrollViewEndDrag(event, this.myComponents[newSoreBodyParts ? newSoreBodyParts.length + 1 : 1])}
                    overScrollMode={'never'}
                    ref={ref => {this.scrollViewRef = ref}}
                    style={{flex: isFABVisible ? 9 : 10,}}
                >
                    <TabIcon
                        containerStyle={[{alignSelf: 'flex-end', paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.padding, paddingTop: (AppSizes.paddingSml + AppSizes.statusBarHeight),}]}
                        icon={'close'}
                        iconStyle={[{color: AppColors.black}]}
                        onPress={handleTogglePostSessionSurvey}
                        reverse={false}
                        size={30}
                        type={'material-community'}
                    />
                    <View>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {'1'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22),}]}>
                            {'Build the sentence'}
                        </Text>
                        <Spacer size={24} />
                        <SportScheduleBuilder
                            handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                            }}
                            postSession={postSession}
                            scrollTo={() => this._scrollTo(0)}
                            scrollToTop={this._scrollToTop}
                            typicalSessions={typicalSessions}
                        />
                    </View>
                    <View onLayout={event => {this.myComponents[0] = {x: event.nativeEvent.layout.x, y: (event.nativeEvent.layout.y + 75)}}}>
                        <Spacer size={100} />
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {'2'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {'How hard was your training session?'}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}>
                            <View style={{alignItems: 'flex-end', flex: 5, justifyContent: 'center', paddingHorizontal: AppSizes.paddingSml}}>
                                { _.map(MyPlanConstants.postSessionFeel, (value, key) => {
                                    if(key === 0) { return; }
                                    /*eslint consistent-return: 0*/
                                    return(
                                        <ScaleButton
                                            isSelected={postSession.RPE === key}
                                            key={value+key}
                                            keyLabel={key}
                                            sorenessPainMappingLength={MyPlanConstants.postSessionFeel.length}
                                            updateStateAndForm={() => {
                                                handleFormChange('RPE', key);
                                                this._scrollTo(1);
                                            }}
                                        />
                                    )
                                })}
                            </View>
                            <View style={{alignItems: 'flex-start', flex: 5, justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingMed}}>
                                { _.map(MyPlanConstants.postSessionFeel, (value, key) => {
                                    if(key === 0 || value.length === 0) { return; }
                                    const isLast = (MyPlanConstants.postSessionFeel.length - 1) === key;
                                    const isFirst = (MyPlanConstants.postSessionFeel.length - 1) === 1;
                                    /*eslint consistent-return: 0*/
                                    return(
                                        <Text
                                            oswaldRegular
                                            style={[
                                                AppStyles.textCenterAligned,
                                                {
                                                    color:           AppColors.primary.grey.fiftyPercent,
                                                    fontSize:        AppFonts.scaleFont(16),
                                                    paddingVertical: AppSizes.paddingSml,
                                                },
                                                isLast ?
                                                    {paddingVertical: AppSizes.paddingMed}
                                                    : isFirst ?
                                                        {paddingVertical: AppSizes.paddingXSml}
                                                        :
                                                        {},
                                            ]}
                                            key={value+key}
                                        >
                                            {value.toUpperCase()}
                                        </Text>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                    <Spacer size={100} />
                    { _.map(newSoreBodyParts, (bodyPart, i) =>
                        <View onLayout={event => {this.myComponents[i + 1] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 100}}} key={i}>
                            <SoreBodyPart
                                bodyPart={MyPlanConstants.bodyPartMapping[bodyPart.body_part]}
                                bodyPartSide={bodyPart.side}
                                firstTimeExperience={user.first_time_experience}
                                handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                    handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                                    if(shouldScroll) {
                                        this._scrollTo(i + 2);
                                    }
                                }}
                                handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                                index={i+3}
                                isPrevSoreness={true}
                                surveyObject={postSession}
                                toggleSlideUpPanel={this._toggleSlideUpPanel}
                            />
                            <Spacer size={100} />
                        </View>
                    )}
                    <View onLayout={event => {this.myComponents[newSoreBodyParts ? newSoreBodyParts.length + 1 : 1] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 50}}}>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {newSoreBodyParts.length > 0 ? newSoreBodyParts.length + 3 : '3'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`Is anything${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' else ' : ' '}bothering you?`}
                        </Text>
                        <AreasOfSoreness
                            handleAreaOfSorenessClick={(body, isAllGood) => { this.setState({ isActionButtonVisible: true, }); handleAreaOfSorenessClick(body, false, isAllGood); }}
                            handleFormChange={handleFormChange}
                            handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                            ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
                            scrollToBottom={this._scrollToBottom}
                            soreBodyParts={soreBodyParts}
                            soreBodyPartsState={postSession.soreness}
                            surveyObject={postSession}
                            toggleSlideUpPanel={this._toggleSlideUpPanel}
                            user={user}
                        />
                    </View>
                    <Button
                        backgroundColor={isFormValid ? AppColors.primary.yellow.hundredPercent : AppColors.white}
                        buttonStyle={{
                            alignSelf:       'center',
                            borderRadius:    5,
                            marginBottom:    AppSizes.padding,
                            paddingVertical: AppSizes.paddingMed,
                            width:           AppSizes.screen.widthTwoThirds
                        }}
                        color={isFormValid ? AppColors.white : AppColors.zeplin.lightGrey}
                        fontFamily={AppStyles.robotoMedium.fontFamily}
                        fontWeight={AppStyles.robotoMedium.fontWeight}
                        onPress={() => isFormValid ? handleFormSubmit() : null}
                        outlined
                        textStyle={{ fontSize: AppFonts.scaleFont(18) }}
                        title={isFormValid ? 'Submit' : 'Select an Option'}
                    />
                </ScrollView>
                { isFABVisible ?
                    <ActionButton
                        buttonColor={AppColors.primary.yellow.hundredPercent}
                        degrees={0}
                        hideShadow
                        onPress={() => this._fabScrollClicked(this.myComponents[newSoreBodyParts ? newSoreBodyParts.length + 1 : 1])}
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