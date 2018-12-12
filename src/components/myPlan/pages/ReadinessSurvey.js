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
import { ImageBackground, Platform, ScrollView, StyleSheet, TouchableHighlight, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants, AppSizes, AppFonts, } from '../../../constants';
import { Button, FathomPicker, Pages, Spacer, TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

// Components
import { AreasOfSoreness, ScaleButton, SlideUpPanel, SoreBodyPart, SportScheduleBuilder, } from './';

// import third-party libraries
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

// consts
const helloPageText = 'Let us know how you feel so we can adapt your Recovery Plan to your body. This simple survey shouldn\'t take more than 2-minutes.';
const progressPillHeight = AppSizes.screen.height * 0.08;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    pickerSelect: {
        ...AppFonts.oswaldMedium,
        color:    AppColors.zeplin.darkGrey,
        fontSize: AppFonts.scaleFont(17),
    },
    backNextWrapper: {
        flexDirection:     'row',
        justifyContent:    'space-between',
        paddingBottom:     AppSizes.paddingMed,
        paddingHorizontal: AppSizes.paddingMed,
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
    progressPill: {
        backgroundColor: AppColors.border,
        borderRadius:    5,
        height:          10,
        width:           35,
    },
    progressPillCurrent: {
        backgroundColor: AppColors.primary.yellow.hundredPercent,
    },
    progressPillWrapper: {
        alignItems:     'center',
        flex:           1,
        flexDirection:  'row',
        height:         progressPillHeight,
        justifyContent: 'center',
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 3 },
        shadowRadius:  6,
        shadowOpacity: 1,
    },
});

/* Components ================================================================= */
const ProgressPill = ({ currentStep, }) => (
    <View style={{backgroundColor: '#FAFAFA', height: (progressPillHeight + AppSizes.statusBarHeight),}}>
        <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
        <View style={[styles.progressPillWrapper]}>
            <View style={[styles.progressPill, {marginRight: 2}, currentStep >= 1 ? styles.progressPillCurrent : {}]} />
            <View style={[styles.progressPill, {marginRight: 2}, currentStep >= 2 ? styles.progressPillCurrent : {}]} />
            <View style={[styles.progressPill, {marginRight: 2}, currentStep >= 3 ? styles.progressPillCurrent : {}]} />
            <View style={[styles.progressPill, {marginRight: 2}, currentStep >= 4 ? styles.progressPillCurrent : {}]} />
            <View style={[styles.progressPill, currentStep >= 5 ? styles.progressPillCurrent : {}]} />
        </View>
    </View>
);

const BackNextButtons = ({ handleFormSubmit, isValid, onBackClick, onNextClick, showSubmitBtn, }) => (
    <View style={[styles.backNextWrapper,]}>
        <TouchableHighlight
            onPress={onBackClick}
            style={[AppStyles.backNextCircleButtons, {
                backgroundColor: AppColors.white,
                borderColor:     AppColors.primary.yellow.hundredPercent,
                borderWidth:     1,
            }]}
            underlayColor={AppColors.transparent}
        >
            <Text
                robotoMedium
                style={[
                    AppStyles.textCenterAligned,
                    {
                        color:    AppColors.primary.yellow.hundredPercent,
                        fontSize: AppFonts.scaleFont(12),
                    }
                ]}
            >
                {'Back'}
            </Text>
        </TouchableHighlight>
        { showSubmitBtn ?
            <Button
                backgroundColor={isValid ? AppColors.primary.yellow.hundredPercent : AppColors.white}
                buttonStyle={[AppStyles.paddingVerticalSml, AppStyles.paddingHorizontal, {justifyContent: 'center',}]}
                color={isValid ? AppColors.white : AppColors.zeplin.lightGrey}
                containerViewStyle={{ alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf, }}
                disabled={!isValid}
                disabledStyle={{backgroundColor: AppColors.white, borderColor: AppColors.zeplin.lightGrey, borderWidth: 1,}}
                fontFamily={AppStyles.robotoMedium.fontFamily}
                fontWeight={AppStyles.robotoMedium.fontWeight}
                onPress={() => isValid && handleFormSubmit ? handleFormSubmit() : null}
                raised={false}
                textColor={isValid ? AppColors.white : AppColors.zeplin.lightGrey}
                textStyle={{ fontSize: AppFonts.scaleFont(18), textAlign: 'center', width: '100%', }}
                title={'Submit'}
            />
            :
            <TouchableHighlight
                onPress={isValid ? onNextClick : null}
                style={[AppStyles.backNextCircleButtons, {
                    backgroundColor: isValid ? AppColors.primary.yellow.hundredPercent : AppColors.white,
                    borderColor:     isValid ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.lightGrey,
                    borderWidth:     1,
                }]}
                underlayColor={AppColors.transparent}
            >
                <Text
                    robotoMedium
                    style={[
                        AppStyles.textCenterAligned,
                        isValid ? styles.shadowEffect : {},
                        Platform.OS === 'ios' ? {} : {elevation: 2,},
                        {
                            color:    isValid ? AppColors.white : AppColors.zeplin.lightGrey,
                            fontSize: AppFonts.scaleFont(12),
                        }
                    ]}
                >
                    {'Next'}
                </Text>
            </TouchableHighlight>
        }
    </View>
);

class ReadinessSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActionButtonVisible:  false,
            isCloseToBottom:        false,
            isSlideUpPanelExpanded: true,
            isSlideUpPanelOpen:     false,
            pageIndex:              0,
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
        this.scrollViewSportBuilderRefs = [];
        this.sportScheduleBuilderRefs = [];
        this.pages = {};
        this.pickerTrainedAlreadyRefs = {};
    }

    _toggleSlideUpPanel = (isExpanded = true) => {
        this.setState({
            isSlideUpPanelExpanded: isExpanded,
            isSlideUpPanelOpen:     !this.state.isSlideUpPanelOpen,
        });
    }

    _renderNextPage = (currentPage, isFormValidItems, isBackBtn, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, sportBuilderRPEIndex, areaOfSorenessClicked) => {
        const { dailyReadiness, } = this.props;
        let { isValid, pageNum, } = PlanLogic.handleReadinessSurveyNextPage(this.state, dailyReadiness, currentPage, isFormValidItems, isBackBtn, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, sportBuilderRPEIndex, areaOfSorenessClicked);
        if(isValid || isBackBtn) {
            this.pages.progress = pageNum;
            this.setState({ pageIndex: pageNum, });
        }
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
        let isCloseToBottom = event.nativeEvent.layoutMeasurement.height + offset >= event.nativeEvent.contentSize.height - 20;
        let isActionButtonVisible = (
            !isCloseToBottom // is NOT close to the bottom
        );
        this.setState({
            isActionButtonVisible,
            isCloseToBottom,
        });
    }

    _resetSportBuilder = () => {
        _.map(this.sportScheduleBuilderRefs, (sportScheduleBuilderRef, index) => {
            if(sportScheduleBuilderRef) {
                sportScheduleBuilderRef._resetStep();
            }
        });
    }

    render = () => {
        const {
            dailyReadiness,
            handleAreaOfSorenessClick,
            handleFormChange,
            handleFormSubmit,
            handleUpdateFirstTimeExperience,
            pageIndex,
            soreBodyParts,
            typicalSessions,
            user,
        } = this.props;
        let {
            functionalStrengthTodaySubtext,
            isFirstFunctionalStrength,
            isFormValid,
            isFormValidItems,
            isSecondFunctionalStrength,
            newSoreBodyParts,
            partOfDay,
            selectedSportPositions,
        } = PlanLogic.handleReadinessSurveyRenderLogic(dailyReadiness, soreBodyParts, this.areasOfSorenessRef);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, dailyReadiness.soreness);
        let isFABVisible = areaOfSorenessClicked && this.state.isActionButtonVisible && areaOfSorenessClicked.length > 0;
        /*eslint no-return-assign: 0*/
        return(
            <View style={{backgroundColor: AppColors.white, flex: 1,}} onLayout={this._onLayoutDidChange}>

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
                                end={{x: 0.0, y: 0.75}}
                                style={[styles.linearGradientStyle]}
                            >
                                <View style={{flex: 1, justifyContent: 'space-between',}}>
                                    <View />
                                    <View>
                                        <Text oswaldMedium style={{color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(30),}}>{`GOOD ${partOfDay}, ${user.personal_data.first_name.toUpperCase()}!`}</Text>
                                        <Spacer size={5} />
                                        <Text robotoLight style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}}>{helloPageText}</Text>
                                        <Spacer size={10} />
                                        <Button
                                            backgroundColor={AppColors.primary.yellow.hundredPercent}
                                            buttonStyle={{borderRadius: 5, width: '100%',}}
                                            containerViewStyle={{marginLeft: 0, marginRight: 0}}
                                            color={AppColors.white}
                                            fontFamily={AppStyles.robotoBold.fontFamily}
                                            fontWeight={AppStyles.robotoBold.fontWeight}
                                            leftIcon={{
                                                color: AppColors.primary.yellow.hundredPercent,
                                                name:  'chevron-right',
                                                size:  AppFonts.scaleFont(24),
                                                style: {flex: 1,},
                                            }}
                                            outlined={false}
                                            onPress={() => this._renderNextPage(0, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength)}
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

                    <ScrollView
                        bounces={false}
                        nestedScrollEnabled={true}
                        overScrollMode={'never'}
                        ref={ref => {this.scrollViewActivityTargetRef = ref}}
                        style={{flex: 1,}}
                    >
                        <Spacer size={50} />
                        <View style={[styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {alignSelf: 'center', backgroundColor: AppColors.white, borderRadius: 5, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingXLrg, width: AppSizes.screen.widthFourFifths,}]}>
                            <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(32),}]}>{`CONGRATS ${user.personal_data.first_name.toUpperCase()}!`}</Text>
                            <Spacer size={15} />
                            <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(24),}]}>{'You\'ve unlocked\nFunctional Strength!'}</Text>
                        </View>
                        <Spacer size={60} />
                        <View>
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
                                                            this._scrollTo(this.positionsComponents[0], this.scrollViewActivityTargetRef);
                                                        } else {
                                                            this._scrollTo(this.myActivityTargetComponents[0], this.scrollViewActivityTargetRef);
                                                        }
                                                    }
                                                } else if(isStrengthConditioning) {
                                                    if(isSelected) {
                                                        handleFormChange('current_sport_name', null);
                                                        handleFormChange('current_position', null);
                                                    } else {
                                                        handleFormChange('current_sport_name', null);
                                                        handleFormChange('current_position', session.strength_and_conditioning_type);
                                                        this._scrollToBottom(this.scrollViewActivityTargetRef);
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
                                                        this._scrollToBottom(this.scrollViewActivityTargetRef);
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
                        <View onLayout={event => {this.myActivityTargetComponents[0] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y, height: event.nativeEvent.layout.height,}}}>
                            <Spacer size={100} />
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
                                onPress={() => handleFormChange('wants_functional_strength', true)}
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
                                onPress={() => handleFormChange('wants_functional_strength', false)}
                                outlined={dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? true : false}
                                raised={false}
                                textStyle={{ fontSize: AppFonts.scaleFont(14), }}
                                title={'NO'}
                            />
                        </View>
                        <Spacer size={50} />
                        <BackNextButtons
                            isValid={isFormValidItems.isFunctionalStrengthValid}
                            onBackClick={() => this._renderNextPage(1, isFormValidItems, true, isFirstFunctionalStrength, isSecondFunctionalStrength)}
                            onNextClick={() => this._renderNextPage(1, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength)}
                        />
                    </ScrollView>

                    <View style={{flex: 1,}}>
                        <ProgressPill currentStep={1} />
                        <Spacer size={50} />
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {'How mentally ready do you feel?'}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}>
                            { _.map(MyPlanConstants.overallReadiness, (value, key) => {
                                if(key === 0) { return; }
                                let isSelected = (dailyReadiness.readiness / 2) === key;
                                let opacity = isSelected ? 1 : (key * 0.2);
                                /*eslint consistent-return: 0*/
                                return(
                                    <ScaleButton
                                        isSelected={isSelected}
                                        key={value+key}
                                        keyLabel={key}
                                        opacity={opacity}
                                        sorenessPainMappingLength={MyPlanConstants.overallReadiness.length}
                                        updateStateAndForm={() => handleFormChange('readiness', (key * 2))}
                                        valueLabel={value}
                                    />
                                )
                            })}
                        </View>
                        <Spacer size={50} />
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {'How rested do you feel?'}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}>
                            { _.map(MyPlanConstants.sleepQuality, (value, key) => {
                                if(key === 0) { return; }
                                let isSelected = (dailyReadiness.sleep_quality / 2) === key;
                                let opacity = isSelected ? 1 : (key * 0.2);
                                /*eslint consistent-return: 0*/
                                return(
                                    <ScaleButton
                                        isSelected={isSelected}
                                        key={value+key}
                                        keyLabel={key}
                                        opacity={opacity}
                                        sorenessPainMappingLength={MyPlanConstants.sleepQuality.length}
                                        updateStateAndForm={() => handleFormChange('sleep_quality', (key * 2))}
                                        valueLabel={value}
                                    />
                                )
                            })}
                        </View>
                        <BackNextButtons
                            isValid={isFormValidItems.areQuestionsValid}
                            onBackClick={() => this._renderNextPage(2, isFormValidItems, true, isFirstFunctionalStrength, isSecondFunctionalStrength)}
                            onNextClick={() => this._renderNextPage(2, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength)}
                        />
                    </View>

                    <View style={{flex: 1,}}>
                        <ProgressPill currentStep={2} />
                        <View style={[AppStyles.containerCentered, {flex: 1, paddingHorizontal: AppSizes.paddingXLrg,}]}>
                            <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>{'Have you already trained today?'}</Text>
                            <Spacer size={20} />
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: (AppSizes.screen.width - (AppSizes.paddingXLrg * 2))}}>
                                <TouchableHighlight
                                    onPress={() => handleFormChange('already_trained_number', false)}
                                    style={[AppStyles.xLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.already_trained_number === false ? AppColors.primary.yellow.hundredPercent : AppColors.primary.white.hundredPercent,
                                    }]}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text
                                        oswaldMedium
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:    dailyReadiness.already_trained_number === false ? AppColors.white : AppColors.zeplin.blueGrey,
                                                fontSize: AppFonts.scaleFont(17),
                                            }
                                        ]}
                                    >
                                        {'NO'}
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => {
                                        this._resetSportBuilder();
                                        handleFormChange('already_trained_number', 1);
                                    }}
                                    style={[AppStyles.xLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.already_trained_number === 1 ? AppColors.primary.yellow.hundredPercent : AppColors.primary.white.hundredPercent,
                                    }]}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text
                                        oswaldMedium
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:    dailyReadiness.already_trained_number === 1 ? AppColors.white : AppColors.zeplin.blueGrey,
                                                fontSize: AppFonts.scaleFont(17),
                                            }
                                        ]}
                                    >
                                        {'ONCE'}
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => {
                                        console.log('this.pickerTrainedAlreadyRefs',this.pickerTrainedAlreadyRefs);
                                        this.pickerTrainedAlreadyRefs.togglePicker(true);
                                    }}
                                    style={[AppStyles.xLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.already_trained_number > 1 ? AppColors.primary.yellow.hundredPercent : AppColors.primary.white.hundredPercent,
                                    }]}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text
                                        oswaldMedium
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:    dailyReadiness.already_trained_number > 1 ? AppColors.white : AppColors.zeplin.blueGrey,
                                                fontSize: AppFonts.scaleFont(17),
                                            }
                                        ]}
                                    >
                                        {'MORE+'}
                                    </Text>
                                </TouchableHighlight>
                            </View>
                            <FathomPicker
                                enabled={true}
                                hideIcon={true}
                                items={MyPlanConstants.alreadyTrainedNumber}
                                onValueChange={value => {
                                    this._resetSportBuilder();
                                    handleFormChange('already_trained_number', value);
                                }}
                                placeholder={{
                                    label: 'Select a Value',
                                    value: null,
                                }}
                                placeholderTextColor={AppColors.white}
                                ref={ref => {this.pickerTrainedAlreadyRefs = ref;}}
                                style={{
                                    inputAndroid:     [styles.pickerSelect, {color: AppColors.white,}],
                                    inputIOS:         [styles.pickerSelect, {color: AppColors.white,}],
                                    placeholderColor: AppColors.white,
                                    underline:        {borderTopColor: AppColors.white, borderTopWidth: 0,},
                                }}
                                useNativeAndroidPickerStyle={false}
                                value={dailyReadiness.already_trained_number}
                            />
                        </View>
                        <BackNextButtons
                            isValid={isFormValidItems.isTrainedTodayValid}
                            onBackClick={() => this._renderNextPage(3, isFormValidItems, true, isFirstFunctionalStrength, isSecondFunctionalStrength)}
                            onNextClick={() => this._renderNextPage(3, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts)}
                        />
                    </View>

                    { dailyReadiness.sessions && dailyReadiness.sessions.length > 0 ? _.map(dailyReadiness.sessions, (session, index) => {
                        const { isRPEValid, isSportValid, sportText, } = PlanLogic.handleSingleSessionValidation(session, this.sportScheduleBuilderRefs[index]);
                        return(
                            <ScrollView
                                key={index}
                                ref={ref => {this.scrollViewSportBuilderRefs[index] = ref;}}
                                style={{flex: 1,}}
                            >
                                <ProgressPill currentStep={3} />
                                <Spacer size={20} />
                                <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22),}]}>
                                    {'Build the sentence'}
                                </Text>
                                <Spacer size={20} />
                                <SportScheduleBuilder
                                    handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                        handleFormChange(`sessions[${index}].${location}`, value, isPain, bodyPartMapIndex, bodyPartSide);
                                    }}
                                    postSession={session}
                                    ref={ref => {this.sportScheduleBuilderRefs[index] = ref;}}
                                    scrollTo={() => this._scrollTo(this.myRPEComponents[index], this.scrollViewSportBuilderRefs[index])}
                                    scrollToTop={() => this._scrollToTop(this.scrollViewSportBuilderRefs[index])}
                                    typicalSessions={typicalSessions}
                                />
                                <Spacer size={40} />
                                <View
                                    onLayout={event => {this.myRPEComponents[index] = {x: event.nativeEvent.layout.x, y: (event.nativeEvent.layout.y - 5)}}}
                                    style={{flex: 1, justifyContent: 'center', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}
                                >
                                    { isSportValid ?
                                        <View>
                                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                                {`How was your ${sportText}?`}
                                            </Text>
                                            <View style={{flex: 1, paddingTop: AppSizes.paddingSml,}}>
                                                { _.map(MyPlanConstants.postSessionFeel, (value, key) => {
                                                    let isSelected = dailyReadiness.sessions[index].post_session_survey.RPE === key;
                                                    let opacity = isSelected ? 1 : (key * 0.1);
                                                    return(
                                                        <TouchableHighlight
                                                            key={value+key}
                                                            onPress={() => {
                                                                handleFormChange(`sessions[${index}].post_session_survey.RPE`, key);
                                                                this._scrollToBottom(this.scrollViewSportBuilderRefs[index]);
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
                                                                            handleFormChange(`sessions[${index}].post_session_survey.RPE`, key);
                                                                            this._scrollToBottom(this.scrollViewSportBuilderRefs[index]);
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
                                        </View>
                                        :
                                        null
                                    }
                                    <Spacer size={20} />
                                </View>
                                <BackNextButtons
                                    isValid={isRPEValid && isSportValid}
                                    onBackClick={() => this._renderNextPage(4, isFormValidItems, true, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, index)}
                                    onNextClick={() => isRPEValid && isSportValid ? this._renderNextPage(4, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, index) : null}
                                />
                            </ScrollView>
                        )
                    }) : <View />}

                    <ScrollView
                        bounces={false}
                        nestedScrollEnabled={true}
                        overScrollMode={'never'}
                        ref={ref => {this.scrollViewPrevSorenessRef = ref;}}
                        style={{flex: 1,}}
                    >
                        <ProgressPill currentStep={4} />
                        { _.map(newSoreBodyParts, (bodyPart, i) =>
                            <View key={i} onLayout={event => {this.myPrevSorenessComponents[i] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 50}}}>
                                <Spacer size={50} />
                                <SoreBodyPart
                                    bodyPart={bodyPart}
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
                                    surveyObject={dailyReadiness}
                                    toggleSlideUpPanel={this._toggleSlideUpPanel}
                                />
                                <Spacer size={50} />
                            </View>
                        )}
                        <BackNextButtons
                            isValid={isFormValidItems.isPrevSorenessValid}
                            onBackClick={() => this._renderNextPage(5, isFormValidItems, true, isFirstFunctionalStrength, isSecondFunctionalStrength)}
                            onNextClick={() => this._renderNextPage(5, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength)}
                        />
                    </ScrollView>

                    <ScrollView
                        bounces={false}
                        nestedScrollEnabled={true}
                        onMomentumScrollEnd={event => this._scrollViewEndDrag(event)}
                        overScrollMode={'never'}
                        ref={ref => {this.myAreasOfSorenessComponent = ref;}}
                        style={{flex: 1,}}
                    >
                        <ProgressPill currentStep={4} />
                        <Spacer size={50} />
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`Is anything${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' else ' : ' '}bothering you?`}
                        </Text>
                        <AreasOfSoreness
                            handleAreaOfSorenessClick={(body, isAllGood) => {
                                if(!this.state.isCloseToBottom) {
                                    this.setState({ isActionButtonVisible: true, });
                                }
                                handleAreaOfSorenessClick(body, true, isAllGood);
                            }}
                            handleFormChange={handleFormChange}
                            handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                            ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
                            scrollToBottom={() => {
                                this._scrollToBottom(this.myAreasOfSorenessComponent);
                                this.setState({ isCloseToBottom: true, });
                            }}
                            soreBodyParts={soreBodyParts}
                            soreBodyPartsState={dailyReadiness.soreness}
                            surveyObject={dailyReadiness}
                            toggleSlideUpPanel={this._toggleSlideUpPanel}
                            user={user}
                        />
                        <BackNextButtons
                            isValid={isFormValidItems.selectAreasOfSorenessValid}
                            onBackClick={() => {
                                this.setState({ isActionButtonVisible: false, });
                                this._renderNextPage(6, isFormValidItems, true, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, null, areaOfSorenessClicked);
                            }}
                            onNextClick={() => {
                                this.setState({ isActionButtonVisible: false, });
                                this._renderNextPage(6, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, null, areaOfSorenessClicked);
                            }}
                        />
                    </ScrollView>

                    <ScrollView
                        nestedScrollEnabled={true}
                        ref={ref => {this.scrollViewClickedSorenessRef = ref;}}
                        style={{flex: 1,}}
                    >
                        <ProgressPill currentStep={4} />
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
                                    surveyObject={dailyReadiness}
                                    toggleSlideUpPanel={this._toggleSlideUpPanel}
                                />
                            </View>
                        ))}
                        <BackNextButtons
                            isValid={isFormValidItems.areAreasOfSorenessValid}
                            onBackClick={() => this._renderNextPage(7, isFormValidItems, true, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, null, areaOfSorenessClicked)}
                            onNextClick={() => this._renderNextPage(7, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, null, areaOfSorenessClicked)}
                        />
                    </ScrollView>

                    <View style={{flex: 1,}}>
                        <ProgressPill currentStep={5} />
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
                                    onPress={() => handleFormChange('sessions_planned', true)}
                                    style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.sessions_planned === true ? AppColors.primary.yellow.hundredPercent : AppColors.primary.white.hundredPercent,
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
                                <Spacer size={20} />
                                <TouchableHighlight
                                    onPress={() => handleFormChange('sessions_planned', false)}
                                    style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.sessions_planned === false ? AppColors.primary.yellow.hundredPercent : AppColors.primary.white.hundredPercent,
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
                            </View>
                        </View>
                        <BackNextButtons
                            handleFormSubmit={() => handleFormSubmit()}
                            isValid={isFormValidItems.willTrainLaterValid}
                            onBackClick={() => this._renderNextPage(8, isFormValidItems, true, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, null, areaOfSorenessClicked)}
                            onNextClick={() => this._renderNextPage(8, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength)}
                            showSubmitBtn={!isSecondFunctionalStrength}
                        />
                    </View>

                    <View style={{flex: 1,}}>
                        <ProgressPill currentStep={5} />
                        <View style={[AppStyles.containerCentered, {flex: 1, paddingHorizontal: AppSizes.paddingXLrg,}]}>
                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                {'Would you like to add functional strength to your training plan today?'}
                            </Text>
                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}]}>
                                {functionalStrengthTodaySubtext}
                            </Text>
                            <Spacer size={20} />
                            <View
                                style={{
                                    flexDirection:  'row',
                                    justifyContent: 'space-between',
                                    width:          220,
                                }}
                            >
                                <TouchableHighlight
                                    onPress={() => handleFormChange('wants_functional_strength', true)}
                                    style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.wants_functional_strength === true ? AppColors.primary.yellow.hundredPercent : AppColors.primary.white.hundredPercent,
                                    }]}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text
                                        oswaldMedium
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:    dailyReadiness.wants_functional_strength === true ? AppColors.white : AppColors.zeplin.blueGrey,
                                                fontSize: AppFonts.scaleFont(27),
                                            }
                                        ]}
                                    >
                                        {'YES'}
                                    </Text>
                                </TouchableHighlight>
                                <Spacer size={20} />
                                <TouchableHighlight
                                    onPress={() => handleFormChange('wants_functional_strength', false)}
                                    style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                        backgroundColor: dailyReadiness.wants_functional_strength === false ? AppColors.primary.yellow.hundredPercent : AppColors.primary.white.hundredPercent,
                                    }]}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text
                                        oswaldMedium
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:    dailyReadiness.wants_functional_strength === false ? AppColors.white : AppColors.zeplin.blueGrey,
                                                fontSize: AppFonts.scaleFont(27),
                                            }
                                        ]}
                                    >
                                        {'NO'}
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <BackNextButtons
                            handleFormSubmit={() => handleFormSubmit()}
                            isValid={isFormValidItems.isSecondFunctionalStrengthValid}
                            onBackClick={() => this._renderNextPage(9, isFormValidItems, true, isFirstFunctionalStrength, isSecondFunctionalStrength)}
                            onNextClick={() => this._renderNextPage(9, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength)}
                            showSubmitBtn={true}
                        />
                    </View>

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