/**
 * ReadinessSurvey
 *
    <ReadinessSurvey
        dailyReadiness={this.state.dailyReadiness}
        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
        handleFormChange={this._handleFormChange}
        handleFormSubmit={this._handleReadinessSurveySubmit}
        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
        soreBodyParts={this.state.soreBodyParts}
        typicalSessions={this.props.plan.typicalSessions}
        user={user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants, AppSizes, AppFonts, } from '../../../constants';
import { Button, FathomSlider, Spacer, TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

// Components
import { AreasOfSoreness, ScaleButton, SlideUpPanel, SoreBodyPart, } from './';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    pill: {
        borderColor:     AppColors.zeplin.darkGrey,
        borderRadius:    5,
        borderWidth:     1,
        marginVertical:  AppSizes.paddingXSml,
        paddingVertical: AppSizes.paddingXSml,
        width:           (AppSizes.screen.widthThreeQuarters / 2),
    },
});

/* Component ==================================================================== */
class ReadinessSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSlideUpPanelExpanded: true,
            isSlideUpPanelOpen:     false,
        };
        this.scrollViewRef = {};
        this.myComponents = [];
        this.positionsComponents = [];
        this.headerComponent = {};
    }

    _scrollTo = (index, scrollToPositions, isFromFS) => {
        let myComponentsLocation = this.myComponents[index];
        if(scrollToPositions) {
            myComponentsLocation = this.positionsComponents[index];
        }
        if(isFromFS && this.headerComponent) {
            myComponentsLocation.y = myComponentsLocation.y + this.headerComponent.height;
        }
        if(myComponentsLocation) {
            _.delay(() => {
                this.scrollViewRef.scrollTo({
                    x:        myComponentsLocation.x,
                    y:        myComponentsLocation.y,
                    animated: true,
                });
            }, 500);
        }
    }

    _scrollToBottom = () => {
        _.delay(() => {
            this.scrollViewRef.scrollToEnd({ animated: true, });
        }, 500);
    }

    _toggleSlideUpPanel = (isExpanded = true) => {
        this.setState({
            isSlideUpPanelExpanded: isExpanded,
            isSlideUpPanelOpen:     !this.state.isSlideUpPanelOpen,
        });
    }

    render = () => {
        const {
            dailyReadiness,
            handleAreaOfSorenessClick,
            handleFormChange,
            handleFormSubmit,
            handleUpdateFirstTimeExperience,
            soreBodyParts,
            typicalSessions,
            user,
        } = this.props;
        let {
            functionalStrengthTodaySubtext,
            isFirstFunctionalStrength,
            isFormValid,
            isSecondFunctionalStrength,
            newSoreBodyParts,
            partOfDay,
            selectedSportPositions,
        } = PlanLogic.handleReadinessSurveyRenderLogic(dailyReadiness, soreBodyParts, this.areasOfSorenessRef);
        let questionCounter = 0;
        /*eslint no-return-assign: 0*/
        return(
            <View style={{flex: 1,}}>
                <ScrollView ref={ref => {this.scrollViewRef = ref}}>
                    <View onLayout={event => {this.headerComponent = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y, height: event.nativeEvent.layout.height,}}} style={{backgroundColor: AppColors.primary.grey.twentyPercent, alignItems: 'center', width: AppSizes.screen.width}}>
                        { isFirstFunctionalStrength ?
                            <View style={{textAlign: 'center',}}>
                                <Text oswaldBold style={[AppStyles.h1, AppStyles.paddingHorizontalMed, {color: AppColors.black, paddingTop: AppSizes.paddingXLrg,}]}>{`Congrats, ${user.personal_data.first_name}!`}</Text>
                                <Spacer size={10} />
                                <Text oswaldBold style={[AppStyles.paddingHorizontalMed, {color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(24), paddingBottom: AppSizes.paddingXLrg, textAlign: 'center',}]}>{'You\'ve unlocked\nFunctional Strength'}</Text>
                            </View>
                            :
                            <Text oswaldBold style={[AppStyles.h1, AppStyles.paddingHorizontalMed, AppStyles.paddingVerticalXLrg, {color: AppColors.black,}]}>{`GOOD ${partOfDay}, ${user.personal_data.first_name.toUpperCase()}!`}</Text>
                        }
                    </View>
                    { isFirstFunctionalStrength ?
                        <View>
                            <Spacer size={50} />
                            <View>
                                <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                                    {questionCounter+=1}
                                </Text>
                                <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                    {'What activity would you like to target?'}
                                </Text>
                                <Spacer size={10} />
                                { _.map(typicalSessions, (session, i) => {
                                    let FSOptions = PlanLogic.handleFunctionalStrengthOptions(session);
                                    let isSport = FSOptions.isSport;
                                    let isStrengthConditioning = FSOptions.isStrengthConditioning;
                                    let sessionName = FSOptions.sessionName;
                                    let isSelected = false;
                                    if(isSport) {
                                        isSelected = dailyReadiness.current_sport_name === session.sport_name;
                                    } else if(isStrengthConditioning) {
                                        isSelected = dailyReadiness.current_sport_name === null && dailyReadiness.current_position === session.strength_and_conditioning_type;
                                    }
                                    return(
                                        <View key={i}>
                                            <Button
                                                backgroundColor={isSelected ? AppColors.primary.yellow.hundredPercent : AppColors.white}
                                                buttonStyle={{
                                                    alignSelf:       'center',
                                                    borderRadius:    5,
                                                    paddingVertical: 5,
                                                    width:           AppSizes.screen.widthTwoThirds,
                                                }}
                                                color={isSelected ? AppColors.white : AppColors.zeplin.darkGrey}
                                                fontFamily={AppStyles.oswaldRegular.fontFamily}
                                                fontWeight={AppStyles.oswaldRegular.fontWeight}
                                                onPress={() => {
                                                    if(isSport) {
                                                        if(isSelected) {
                                                            handleFormChange('current_sport_name', null);
                                                            handleFormChange('current_position', null);
                                                        } else {
                                                            handleFormChange('current_sport_name', session.sport_name);
                                                            handleFormChange('current_position', null);
                                                            let currentSportPositions = _.find(MyPlanConstants.teamSports, o => o.index === session.sport_name).positions;
                                                            if(currentSportPositions && currentSportPositions.length > 0) {
                                                                this._scrollTo(0, true, true);
                                                            } else {
                                                                this._scrollTo(0);
                                                            }
                                                        }
                                                    } else if(isStrengthConditioning) {
                                                        if(isSelected) {
                                                            handleFormChange('current_sport_name', null);
                                                            handleFormChange('current_position', null);
                                                        } else {
                                                            handleFormChange('current_sport_name', null);
                                                            handleFormChange('current_position', session.strength_and_conditioning_type);
                                                            this._scrollTo(0, false, true);
                                                        }
                                                    }
                                                }}
                                                outlined={isSelected ? false : true}
                                                raised={false}
                                                textStyle={{ fontSize: AppFonts.scaleFont(14), }}
                                                title={sessionName.toUpperCase()}
                                            />
                                            <Spacer size={8} />
                                        </View>
                                    )
                                })}
                            </View>
                            <View onLayout={event => {this.positionsComponents[0] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y}}}>
                                { dailyReadiness.current_sport_name !== null && selectedSportPositions && selectedSportPositions.length > 0 ?
                                    <View>
                                        <Spacer size={70} />
                                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                            {'What is your primary position in '}
                                            <Text robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                                {PlanLogic.handleFunctionalStrengthOptions({ sport_name: dailyReadiness.current_sport_name, }).sessionName.toLowerCase()}
                                            </Text>
                                            {'?'}
                                        </Text>
                                        <Spacer size={10} />
                                        { _.map(selectedSportPositions, (position, i) => {
                                            return(
                                                <View key={i}>
                                                    <Button
                                                        backgroundColor={dailyReadiness.current_position === i ? AppColors.primary.yellow.hundredPercent : AppColors.white}
                                                        buttonStyle={{
                                                            alignSelf:       'center',
                                                            borderRadius:    5,
                                                            paddingVertical: 5,
                                                            width:           AppSizes.screen.widthTwoThirds,
                                                        }}
                                                        color={dailyReadiness.current_position === i ? AppColors.white : AppColors.zeplin.darkGrey}
                                                        fontFamily={AppStyles.oswaldRegular.fontFamily}
                                                        fontWeight={AppStyles.oswaldRegular.fontWeight}
                                                        onPress={() => {
                                                            handleFormChange('current_position', i);
                                                            this._scrollTo(0, false, true);
                                                        }}
                                                        outlined={dailyReadiness.current_position === i ? false : true}
                                                        raised={false}
                                                        textStyle={{ fontSize: AppFonts.scaleFont(14), }}
                                                        title={position.toUpperCase()}
                                                    />
                                                    <Spacer size={8} />
                                                </View>
                                            )
                                        })}
                                    </View>
                                    :
                                    null
                                }
                            </View>
                            <View onLayout={event => {this.myComponents[0] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y}}}>
                                <Spacer size={100} />
                                <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                                    {questionCounter+=1}
                                </Text>
                                <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                    {'Would you like to add functional strength to your training plan today?'}
                                </Text>
                                <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}]}>
                                    {functionalStrengthTodaySubtext}
                                </Text>
                                <Spacer size={10} />
                                <Button
                                    backgroundColor={dailyReadiness.wants_functional_strength ? AppColors.primary.yellow.hundredPercent : AppColors.white}
                                    buttonStyle={{
                                        alignSelf:       'center',
                                        borderRadius:    5,
                                        paddingVertical: 5,
                                        width:           AppSizes.screen.widthTwoThirds,
                                    }}
                                    color={dailyReadiness.wants_functional_strength ? AppColors.white : AppColors.zeplin.darkGrey}
                                    fontFamily={AppStyles.robotoMedium.fontFamily}
                                    fontWeight={AppStyles.robotoMedium.fontWeight}
                                    onPress={() => {
                                        handleFormChange('wants_functional_strength', true);
                                        this._scrollTo(1);
                                    }}
                                    outlined={dailyReadiness.wants_functional_strength ? false : true}
                                    raised={false}
                                    textStyle={{ fontSize: AppFonts.scaleFont(14), }}
                                    title={'YES'}
                                />
                                <Spacer size={10} />
                                <Button
                                    backgroundColor={dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? AppColors.white : AppColors.primary.yellow.hundredPercent}
                                    buttonStyle={{
                                        alignSelf:       'center',
                                        borderRadius:    5,
                                        paddingVertical: 5,
                                        width:           AppSizes.screen.widthTwoThirds,
                                    }}
                                    color={dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? AppColors.zeplin.darkGrey : AppColors.white}
                                    fontFamily={AppStyles.robotoMedium.fontFamily}
                                    fontWeight={AppStyles.robotoMedium.fontWeight}
                                    onPress={() => {
                                        handleFormChange('wants_functional_strength', false);
                                        this._scrollTo(1);
                                    }}
                                    outlined={dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? true : false}
                                    raised={false}
                                    textStyle={{ fontSize: AppFonts.scaleFont(14), }}
                                    title={'NO'}
                                />
                            </View>
                            <Spacer size={50} />
                        </View>
                        :
                        null
                    }
                    <View onLayout={event => {this.myComponents[isFirstFunctionalStrength ? 1 : 0] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y}}}>
                        <Spacer size={50} />
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {questionCounter+=1}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {'How mentally ready do you feel for today?'}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}>
                            { _.map(MyPlanConstants.overallReadiness, (value, key) => {
                                if(key === 0) { return; }
                                /*eslint consistent-return: 0*/
                                return(
                                    <ScaleButton
                                        isSelected={(dailyReadiness.readiness / 2) === key}
                                        key={value+key}
                                        keyLabel={key}
                                        sorenessPainMappingLength={MyPlanConstants.overallReadiness.length}
                                        updateStateAndForm={() => {
                                            handleFormChange('readiness', (key * 2));
                                            this._scrollTo(isFirstFunctionalStrength ? 2 : 1);
                                        }}
                                        valueLabel={value}
                                    />
                                )
                            })}
                        </View>
                    </View>
                    <View onLayout={event => {this.myComponents[isFirstFunctionalStrength ? 2 : 1] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y}}}>
                        <Spacer size={100} />
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {questionCounter+=1}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {'How well did you sleep last night?'}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}>
                            { _.map(MyPlanConstants.sleepQuality, (value, key) => {
                                if(key === 0) { return; }
                                /*eslint consistent-return: 0*/
                                return(
                                    <ScaleButton
                                        isSelected={(dailyReadiness.sleep_quality / 2) === key}
                                        key={value+key}
                                        keyLabel={key}
                                        sorenessPainMappingLength={MyPlanConstants.sleepQuality.length}
                                        updateStateAndForm={() => {
                                            handleFormChange('sleep_quality', (key * 2));
                                            this._scrollTo(isFirstFunctionalStrength ? 3 : 2);
                                        }}
                                        valueLabel={value}
                                    />
                                )
                            })}
                        </View>
                    </View>
                    { isSecondFunctionalStrength ?
                        <View onLayout={event => {this.myComponents[2] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y}}}>
                            <Spacer size={100} />
                            <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                                {questionCounter+=1}
                            </Text>
                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                {'Would you like to add functional strength to your training plan today?'}
                            </Text>
                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}]}>
                                {functionalStrengthTodaySubtext}
                            </Text>
                            <Spacer size={10} />
                            <Button
                                backgroundColor={dailyReadiness.wants_functional_strength ? AppColors.primary.yellow.hundredPercent : AppColors.white}
                                buttonStyle={{
                                    alignSelf:       'center',
                                    borderRadius:    5,
                                    paddingVertical: 5,
                                    width:           AppSizes.screen.widthTwoThirds,
                                }}
                                color={dailyReadiness.wants_functional_strength ? AppColors.white : AppColors.zeplin.darkGrey}
                                fontFamily={AppStyles.robotoMedium.fontFamily}
                                fontWeight={AppStyles.robotoMedium.fontWeight}
                                onPress={() => {
                                    handleFormChange('wants_functional_strength', true);
                                    this._scrollTo(3);
                                }}
                                outlined={dailyReadiness.wants_functional_strength ? false : true}
                                raised={false}
                                textStyle={{ fontSize: AppFonts.scaleFont(14), }}
                                title={'YES'}
                            />
                            <Spacer size={10} />
                            <Button
                                backgroundColor={dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? AppColors.white : AppColors.primary.yellow.hundredPercent}
                                buttonStyle={{
                                    alignSelf:       'center',
                                    borderRadius:    5,
                                    paddingVertical: 5,
                                    width:           AppSizes.screen.widthTwoThirds,
                                }}
                                color={dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? AppColors.zeplin.darkGrey : AppColors.white}
                                fontFamily={AppStyles.robotoMedium.fontFamily}
                                fontWeight={AppStyles.robotoMedium.fontWeight}
                                onPress={() => {
                                    handleFormChange('wants_functional_strength', false);
                                    this._scrollTo(3);
                                }}
                                outlined={dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? true : false}
                                raised={false}
                                textStyle={{ fontSize: AppFonts.scaleFont(14), }}
                                title={'NO'}
                            />
                        </View>
                        :
                        null
                    }
                    <Spacer size={100} />
                    { _.map(newSoreBodyParts, (bodyPart, i) =>
                        <View onLayout={event => {this.myComponents[isFirstFunctionalStrength || isSecondFunctionalStrength ? (i + 3) : (i + 2)] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 100}}} key={i}>
                            <SoreBodyPart
                                bodyPart={bodyPart}
                                bodyPartSide={bodyPart.side}
                                firstTimeExperience={user.firstTimeExperience}
                                handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                    handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                                    if(shouldScroll) {
                                        this._scrollTo(isFirstFunctionalStrength || isSecondFunctionalStrength ? (i + 4) : (i + 3));
                                    }
                                }}
                                handleUpdateFirstTimeExperience={(name, value) => handleUpdateFirstTimeExperience(name, value)}
                                index={isFirstFunctionalStrength ? (i + 5) : isSecondFunctionalStrength ? (i + 4) : (i + 3)}
                                isPrevSoreness={true}
                                surveyObject={dailyReadiness}
                                toggleSlideUpPanel={this._toggleSlideUpPanel}
                            />
                            <Spacer size={100} />
                        </View>
                    )}
                    <View onLayout={event => {this.myComponents[isFirstFunctionalStrength || isSecondFunctionalStrength ? (newSoreBodyParts.length + 3) : (newSoreBodyParts.length + 2)] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 100}}}>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {isFirstFunctionalStrength ? (newSoreBodyParts.length + 5) : isSecondFunctionalStrength ? (newSoreBodyParts.length + 4) : (newSoreBodyParts.length + 3)}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`Is anything${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' else ' : ' '}bothering you?`}
                        </Text>
                        <AreasOfSoreness
                            handleAreaOfSorenessClick={(body, isAllGood) => handleAreaOfSorenessClick(body, true, isAllGood)}
                            handleFormChange={handleFormChange}
                            handleUpdateFirstTimeExperience={(name, value) => handleUpdateFirstTimeExperience(name, value)}
                            ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
                            scrollToBottom={this._scrollToBottom}
                            soreBodyParts={soreBodyParts}
                            soreBodyPartsState={dailyReadiness.soreness}
                            surveyObject={dailyReadiness}
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
                            width:           AppSizes.screen.widthTwoThirds,
                        }}
                        color={isFormValid ? AppColors.white : AppColors.zeplin.lightGrey}
                        fontFamily={AppStyles.robotoMedium.fontFamily}
                        fontWeight={AppStyles.robotoMedium.fontWeight}
                        onPress={() => isFormValid ? handleFormSubmit() : null}
                        outlined
                        textStyle={{ fontSize: AppFonts.scaleFont(18), }}
                        title={isFormValid ? 'Submit' : 'Select an Option'}
                    />
                </ScrollView>
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

ReadinessSurvey.propTypes = {
    dailyReadiness:            PropTypes.object.isRequired,
    handleAreaOfSorenessClick: PropTypes.func.isRequired,
    handleFormChange:          PropTypes.func.isRequired,
    handleFormSubmit:          PropTypes.func.isRequired,
    soreBodyParts:             PropTypes.object.isRequired,
    typicalSessions:           PropTypes.array,
    user:                      PropTypes.object.isRequired,
};

ReadinessSurvey.defaultProps = {
    typicalSession: [],
};

ReadinessSurvey.componentName = 'ReadinessSurvey';

/* Export Component ================================================================== */
export default ReadinessSurvey;