/**
 * ReadinessSurvey
 *
    <ReadinessSurvey
        dailyReadiness={this.state.dailyReadiness}
        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
        handleFormChange={this._handleFormChange}
        handleFormSubmit={this._handleReadinessSurveySubmit}
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
import { Button, FathomSlider, Spacer, Text, } from '../../custom';

// Components
import { AreasOfSoreness, ScaleButton, SoreBodyPart, } from './';

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
        this.scrollViewRef = {};
        this.myComponents = [];
    }

    _scrollTo = (index) => {
        let myComponentsLocation = this.myComponents[index];
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

    _getFunctionalStrengthOptions = session => {
        let isSport = session.sport_name > 0 || session.sport_name === 0 ? true : false;
        let isStrengthConditioning = session.strength_and_conditioning_type > 0 || session.strength_and_conditioning_type === 0;
        let sessionName = isSport ?
            _.find(MyPlanConstants.teamSports, o => o.index === session.sport_name)
            : isStrengthConditioning ?
                _.find(MyPlanConstants.strengthConditioningTypes, o => o.index === session.strength_and_conditioning_type)
                :
                '';
        sessionName = sessionName.label && isSport ?
            sessionName.label
            : sessionName.label && isStrengthConditioning ?
                `${sessionName.label.replace(' Training', '')} TRAINING`
                :
                '';
        return {
            isSport,
            isStrengthConditioning,
            sessionName,
        };
    }

    render = () => {
        const {
            dailyReadiness,
            handleAreaOfSorenessClick,
            handleFormChange,
            handleFormSubmit,
            soreBodyParts,
            typicalSessions,
            user,
        } = this.props;
        let split_afternoon = 12 // 24hr time to split the afternoon
        let split_evening = 17 // 24hr time to split the evening
        let hourOfDay = moment().get('hour');
        let partOfDay = hourOfDay >= split_afternoon && hourOfDay <= split_evening ? 'AFTERNOON' : hourOfDay >= split_evening ? 'EVENING' : 'MORNING';
        let filteredAreasOfSoreness = _.filter(dailyReadiness.soreness, o => {
            let doesItInclude = _.filter(soreBodyParts.body_parts, a => a.body_part === o.body_part && a.side === o.side);
            return doesItInclude.length === 0;
        });
        let filteredSoreBodyParts = _.filter(dailyReadiness.soreness, o => {
            let doesItInclude = _.filter(soreBodyParts.body_parts, a => a.body_part === o.body_part && a.side === o.side);
            return doesItInclude.length > 0;
        });
        let areQuestionsValid = dailyReadiness.readiness > 0 && dailyReadiness.sleep_quality > 0;
        let areSoreBodyPartsValid = filteredSoreBodyParts.length > 0 ? _.filter(filteredSoreBodyParts, o => o.severity > 0 || o.severity === 0).length > 0 : true;
        let areAreasOfSorenessValid = (
            _.filter(filteredAreasOfSoreness, o => o.severity > 0 || o.severity === 0).length > 0 ||
            (this.areasOfSorenessRef && this.areasOfSorenessRef.state.isAllGood)
        );
        let selectedSportPositions = dailyReadiness.current_sport_name !== null ? _.find(MyPlanConstants.teamSports, o => o.index === dailyReadiness.current_sport_name).positions : [];
        const isFunctionalStrengthEligible = soreBodyParts.functional_strength_eligible;
        const isFirstFunctionalStrength = isFunctionalStrengthEligible && (!soreBodyParts.current_sport_name || soreBodyParts.current_sport_name !== 0) && (!soreBodyParts.current_position && soreBodyParts.current_position !== 0);
        let isSecondFunctionalStrength = isFunctionalStrengthEligible && (soreBodyParts.current_position === 0 || soreBodyParts.current_position > 0 || soreBodyParts.current_sport_name === 0 || soreBodyParts.current_sport_name > 0) && (soreBodyParts.completed_functional_strength_sessions === 0 || soreBodyParts.completed_functional_strength_sessions <= 2);
        let isFunctionalStrengthTargetValid = dailyReadiness.current_sport_name !== null ?
            dailyReadiness.current_sport_name !== null && dailyReadiness.current_position !== null
            : dailyReadiness.current_sport_name === null ?
                dailyReadiness.current_position !== null
                :
                false;
        let isFunctionalStrengthValid = isFunctionalStrengthEligible && isFirstFunctionalStrength ?
            dailyReadiness.wants_functional_strength !== null && isFunctionalStrengthTargetValid
            : isFunctionalStrengthEligible && isSecondFunctionalStrength ?
                dailyReadiness.wants_functional_strength !== null
                :
                true;
        let functionalStrengthTodaySubtext = isFunctionalStrengthEligible ?
            `(${soreBodyParts.completed_functional_strength_sessions}/2 completed in last 7 days${soreBodyParts.completed_functional_strength_sessions === 2 ? ', but you can go for 3!': ''})`
            :
            '';
        let isFormValid = isFunctionalStrengthValid && areQuestionsValid && (areSoreBodyPartsValid || dailyReadiness.soreness.length === 0) && areAreasOfSorenessValid;
        let newSoreBodyParts = _.cloneDeep(soreBodyParts.body_parts);
        newSoreBodyParts = _.orderBy(newSoreBodyParts, ['body_part', 'side'], ['asc', 'asc']);
        let questionCounter = 0;
        /*eslint no-return-assign: 0*/
        return(
            <View style={{flex: 1}}>
                <ScrollView ref={ref => {this.scrollViewRef = ref}}>
                    <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, alignItems: 'center', width: AppSizes.screen.width}}>
                        { isFirstFunctionalStrength ?
                            <Text oswaldBold style={[AppStyles.h1, AppStyles.paddingHorizontalMed, AppStyles.paddingVerticalXLrg, {color: AppColors.black}]}>{'Congrats!'}</Text>
                            :
                            <Text oswaldBold style={[AppStyles.h1, AppStyles.paddingHorizontalMed, AppStyles.paddingVerticalXLrg, {color: AppColors.black}]}>{`GOOD ${partOfDay}, ${user.personal_data.first_name.toUpperCase()}!`}</Text>
                        }
                    </View>
                    { isFirstFunctionalStrength ?
                        <View>
                            <Spacer size={50} />
                            <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22),}]}>{'You\'ve unlocked\nFunctional Strength!'}</Text>
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
                                    let isSport = this._getFunctionalStrengthOptions(session).isSport;
                                    let isStrengthConditioning = this._getFunctionalStrengthOptions(session).isStrengthConditioning;
                                    let sessionName = this._getFunctionalStrengthOptions(session).sessionName;
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
                                                        }
                                                    } else if(isStrengthConditioning) {
                                                        if(isSelected) {
                                                            handleFormChange('current_sport_name', null);
                                                            handleFormChange('current_position', null);
                                                        } else {
                                                            handleFormChange('current_sport_name', null);
                                                            handleFormChange('current_position', session.strength_and_conditioning_type);
                                                            this._scrollTo(0);
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
                                { dailyReadiness.current_sport_name !== null ?
                                    <View>
                                        <Spacer size={70} />
                                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                            {'What is your primary position in '}
                                            <Text robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                                {this._getFunctionalStrengthOptions({ sport_name: dailyReadiness.current_sport_name, }).sessionName.toLowerCase()}
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
                                                            this._scrollTo(0);
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
                                    textStyle={{ fontSize: AppFonts.scaleFont(18) }}
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
                                    textStyle={{ fontSize: AppFonts.scaleFont(18) }}
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
                                textStyle={{ fontSize: AppFonts.scaleFont(18) }}
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
                                textStyle={{ fontSize: AppFonts.scaleFont(18) }}
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
                                handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                    handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                                    if(shouldScroll) {
                                        this._scrollTo(isFirstFunctionalStrength || isSecondFunctionalStrength ? (i + 4) : (i + 3));
                                    }
                                }}
                                index={isFirstFunctionalStrength ? (i + 5) : isSecondFunctionalStrength ? (i + 4) : (i + 3)}
                                isPrevSoreness={true}
                                surveyObject={dailyReadiness}
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
                            ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
                            soreBodyParts={soreBodyParts}
                            soreBodyPartsState={dailyReadiness.soreness}
                            surveyObject={dailyReadiness}
                        />
                    </View>
                    { isFormValid ?
                        <Button
                            backgroundColor={AppColors.primary.yellow.hundredPercent}
                            buttonStyle={{
                                alignSelf:       'center',
                                borderRadius:    5,
                                marginBottom:    AppSizes.padding,
                                paddingVertical: AppSizes.paddingMed,
                                width:           AppSizes.screen.widthTwoThirds,
                            }}
                            color={AppColors.white}
                            fontFamily={AppStyles.robotoMedium.fontFamily}
                            fontWeight={AppStyles.robotoMedium.fontWeight}
                            onPress={handleFormSubmit}
                            raised={false}
                            textStyle={{ fontSize: AppFonts.scaleFont(18) }}
                            title={'Continue'}
                        />
                        :
                        <Button
                            backgroundColor={AppColors.white}
                            buttonStyle={{
                                alignSelf:       'center',
                                borderRadius:    5,
                                marginBottom:    AppSizes.padding,
                                paddingVertical: AppSizes.paddingMed,
                                width:           AppSizes.screen.widthTwoThirds,
                            }}
                            color={AppColors.zeplin.lightGrey}
                            fontFamily={AppStyles.robotoMedium.fontFamily}
                            fontWeight={AppStyles.robotoMedium.fontWeight}
                            onPress={() => null}
                            outlined
                            textStyle={{ fontSize: AppFonts.scaleFont(18) }}
                            title={'Select an Option'}
                        />
                    }
                </ScrollView>
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