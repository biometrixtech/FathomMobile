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
import { ImageBackground, LayoutAnimation, ScrollView, StyleSheet, TouchableHighlight, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants, AppSizes, AppFonts, } from '../../../constants';
import { Button, FathomSlider, Pages, Spacer, TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

// Components
import { AreasOfSoreness, ScaleButton, SlideUpPanel, SoreBodyPart, } from './';

// import third-party libraries
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

// Consts
const readinessSurveyWelcomeText = 'Let us know how you feel so we can adapt your Recovery Plan to your body. This simple survey should take less than 2-minutes.';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    backNextCircle: {
        backgroundColor: AppColors.white,
        borderColor:     AppColors.primary.yellow.hundredPercent,
        borderRadius:    (50 / 2),
        borderWidth:     1,
        height:          50,
        justifyContent:  'center',
        marginBottom:    AppSizes.paddingXSml,
        marginRight:     AppSizes.paddingSml,
        width:           50,
    },
    backNextCircleText: {
        color:             AppColors.primary.yellow.hundredPercent,
        fontSize:          AppFonts.scaleFont(12),
        paddingHorizontal: AppSizes.paddingXSml,
        paddingVertical:   AppSizes.paddingSml,
    },
    pill: {
        borderColor:     AppColors.zeplin.darkGrey,
        borderRadius:    5,
        borderWidth:     1,
        marginVertical:  AppSizes.paddingXSml,
        paddingVertical: AppSizes.paddingXSml,
        width:           (AppSizes.screen.widthThreeQuarters / 2),
    },
    progressPill: {
        backgroundColor: AppColors.border,
        borderRadius:    5,
        height:          10,
        marginRight:     1,
        width:           35,
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius:  6,
    },
});

/* Component ==================================================================== */
class ReadinessSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActionButtonVisible:  false,
            isSlideUpPanelExpanded: true,
            isSlideUpPanelOpen:     false,
            pageNum:                0,
        };
        this._scrollViewContentHeight = 0;
        this.headerComponent = {};
        this.myComponents = [];
        this.pages = {};
        this.positionsComponents = [];
        this.scrollViewRef = {};
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
            this._scrollToXY(myComponentsLocation.x, myComponentsLocation.y, true);
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
        if(
            this.areasOfSorenessRef &&
            this.areasOfSorenessRef.soreBodyPartRef &&
            this.areasOfSorenessRef.soreBodyPartRef.y &&
            ((AppSizes.screen.height + actualSoreBodyPartRefY) - this._scrollViewContentHeight) <= 0
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

    _updatePageNumber = pageNum => {
        // 0: welcome page
        // 1: isFirstFunctionalStrength
        // 2: train and rested?
        // 3: isSecondFunctionalStrength
        // 4: previous soreness
        // 5: AreasOfSoreness
        // 6: AreasOfSoreness clicked
        this.pages.progress = pageNum;
        this.setState({ pageNum: pageNum, });
    }

    _renderButtons = (prevPageNum, NextPageNum, isNextValid) => {
        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: AppSizes.padding,}}>
                <TouchableHighlight
                    onPress={() => this._updatePageNumber(prevPageNum)}
                    style={[styles.backNextCircle,]}
                    underlayColor={AppColors.transparent}
                >
                    <Text
                        robotoMedium
                        style={[
                            AppStyles.textCenterAligned,
                            styles.backNextCircleText,
                        ]}
                    >
                        {'Back'}
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    disabled={!isNextValid}
                    onPress={() => this._updatePageNumber(NextPageNum)}
                    style={[styles.backNextCircle, isNextValid ? styles.shadowEffect : {borderColor: AppColors.zeplin.lightGrey}]}
                    underlayColor={AppColors.transparent}
                >
                    <Text
                        robotoMedium
                        style={[
                            AppStyles.textCenterAligned,
                            styles.backNextCircleText,
                            isNextValid ? {} : {color: AppColors.zeplin.lightGrey}
                        ]}
                    >
                        {'Next'}
                    </Text>
                </TouchableHighlight>
            </View>
        )
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
        console.log('isFormValid',isFormValid);
        // isFunctionalStrengthValid
        // areQuestionsValid
        // isPrevSorenessValid
        // areAreasOfSorenessValid
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, dailyReadiness.soreness);
        let isFABVisible = areaOfSorenessClicked && this.state.isActionButtonVisible && areaOfSorenessClicked.length > 0;
        let questionCounter = 0; // TODO: REMOVE
        // return(
        //     <View style={{ backgroundColor: AppColors.white, flex: 1, }}>
        //
        //         { this.pages.progress > 1 ?
        //             <View>
        //                 <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
        //                 <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.lightGrey, flexDirection: 'row', height: AppSizes.paddingXLrg, justifyContent: 'center',}}>
        //                     <View style={[styles.progressPill, this.pages.progress >= 2 ? {backgroundColor: AppColors.primary.yellow.hundredPercent,} : {}]} />
        //                     <View style={[styles.progressPill, this.pages.progress >= 4 ? {backgroundColor: AppColors.primary.yellow.hundredPercent,} : {}]} />
        //                     <View style={[styles.progressPill, this.pages.progress >= 5 ? {backgroundColor: AppColors.primary.yellow.hundredPercent,} : {}]} />
        //                 </View>
        //             </View>
        //             :
        //             null
        //         }
        //
        //         <Pages
        //             indicatorPosition={'none'}
        //             ref={(pages) => { this.pages = pages; }}
        //             startPage={0}
        //         >
        //
        //             <ImageBackground
        //                 source={require('../../../../assets/images/standard/start_page_background.png')}
        //                 style={{alignItems: 'center', flex: 1,}}
        //             >
        //                 <LinearGradient
        //                     colors={['transparent', 'rgba(255, 255, 255, 1)']}
        //                     style={[AppStyles.containerCentered, {flex: 1, justifyContent: 'flex-end',}]}
        //                 >
        //                     <View style={{paddingHorizontal: AppSizes.paddingXLrg, paddingBottom: AppSizes.paddingXLrg,}}>
        //                         <Text oswaldMedium style={{color: AppColors.zeplin.green, fontSize: AppFonts.scaleFont(30),}}>{`GOOD ${partOfDay}, ${user.personal_data.first_name.toUpperCase()}!`}</Text>
        //                         <Spacer size={10} />
        //                         <Text robotoLight style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}}>{readinessSurveyWelcomeText}</Text>
        //                         <Spacer size={10} />
        //                         <Button
        //                             backgroundColor={AppColors.primary.yellow.hundredPercent}
        //                             buttonStyle={{width: '100%',}}
        //                             color={AppColors.white}
        //                             containerViewStyle={{marginLeft: 0, marginRight: 0}}
        //                             fontFamily={AppStyles.robotoMedium.fontFamily}
        //                             fontWeight={AppStyles.robotoMedium.fontWeight}
        //                             leftIcon={{
        //                                 color: AppColors.primary.yellow.hundredPercent,
        //                                 name:  'chevron-right',
        //                                 size:  AppFonts.scaleFont(24),
        //                                 style: {flex: 1,},
        //                             }}
        //                             onPress={() => this._updatePageNumber(isFirstFunctionalStrength ? 1 : 2)}
        //                             raised={false}
        //                             rightIcon={{
        //                                 color: AppColors.white,
        //                                 name:  'chevron-right',
        //                                 size:  AppFonts.scaleFont(24),
        //                                 style: {flex: 1,},
        //                             }}
        //                             textStyle={{flex: 8, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}
        //                             title={'Begin'}
        //                         />
        //                     </View>
        //                 </LinearGradient>
        //             </ImageBackground>
        //
        //             <View style={{flex: 1,}}>
        //                 <Text>{'isFirstFunctionalStrength'}</Text>
        //             </View>
        //
        //             <View style={{flex: 1,}}>
        //                 <View style={{flex: 8,}}>
        //                     <Spacer size={50} />
        //                     <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
        //                         {'How ready do you feel to train?'}
        //                     </Text>
        //                     <Spacer size={20} />
        //                     <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg}}>
        //                         { _.map(MyPlanConstants.overallReadiness, (value, key) => {
        //                             if(key === 0) { return; }
        //                             let isSelected = (dailyReadiness.readiness / 2) === key;
        //                             let opacity = isSelected ? 1 : (key * 0.2);
        //                             /*eslint consistent-return: 0*/
        //                             return(
        //                                 <ScaleButton
        //                                     isSelected={isSelected}
        //                                     key={value+key}
        //                                     keyLabel={key}
        //                                     opacity={opacity}
        //                                     sorenessPainMappingLength={MyPlanConstants.overallReadiness.length}
        //                                     updateStateAndForm={() => handleFormChange('readiness', (key * 2))}
        //                                     valueLabel={value}
        //                                 />
        //                             )
        //                         })}
        //                     </View>
        //                     <Spacer size={60} />
        //                     <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
        //                         {'How well rested do you feel?'}
        //                     </Text>
        //                     <Spacer size={20} />
        //                     <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg}}>
        //                         { _.map(MyPlanConstants.sleepQuality, (value, key) => {
        //                             if(key === 0) { return; }
        //                             let isSelected = (dailyReadiness.sleep_quality / 2) === key;
        //                             let opacity = isSelected ? 1 : (key * 0.2);
        //                             /*eslint consistent-return: 0*/
        //                             return(
        //                                 <ScaleButton
        //                                     isSelected={isSelected}
        //                                     key={value+key}
        //                                     keyLabel={key}
        //                                     opacity={opacity}
        //                                     sorenessPainMappingLength={MyPlanConstants.sleepQuality.length}
        //                                     updateStateAndForm={() => handleFormChange('sleep_quality', (key * 2))}
        //                                     valueLabel={value}
        //                                 />
        //                             )
        //                         })}
        //                     </View>
        //                 </View>
        //                 {this._renderButtons(isFirstFunctionalStrength ? 1 : 0, isSecondFunctionalStrength ? 3 : newSoreBodyParts.length > 0 ? 4 : 5, isFormValid.areQuestionsValid)}
        //             </View>
        //
        //             <View style={{flex: 1,}}>
        //                 <Text>{'isSecondFunctionalStrength'}</Text>
        //             </View>
        //
        //             <View style={{flex: 1,}}>
        //                 <Text>{'previous soreness'}</Text>
        //             </View>
        //
        //             <View
        //                 style={{flex: 1,}}
        //             >
        //                 <View
        //                     style={{flex: 8,}}
        //                     onLayout={event => {this.myComponents[5] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 50, height: event.nativeEvent.layout.height}}}
        //                 >
        //                     <Spacer size={50} />
        //                     <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
        //                         {`Is anything${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' else ' : ' '}bothering you?`}
        //                     </Text>
        //                     <AreasOfSoreness
        //                         handleAreaOfSorenessClick={(body, isAllGood) => { this.setState({ isActionButtonVisible: true, }); handleAreaOfSorenessClick(body, true, isAllGood); }}
        //                         handleFormChange={handleFormChange}
        //                         handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
        //                         ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
        //                         scrollToBottom={this._scrollToBottom}
        //                         soreBodyParts={soreBodyParts}
        //                         soreBodyPartsState={dailyReadiness.soreness}
        //                         surveyObject={dailyReadiness}
        //                         toggleSlideUpPanel={this._toggleSlideUpPanel}
        //                         user={user}
        //                     />
        //                 </View>
        //                 {this._renderButtons(newSoreBodyParts.length > 0 ? 4 : isSecondFunctionalStrength ? 3 : 2, isFormValid.areAreasOfSorenessValid ? console.log('submit') : 6, isFormValid.areAreasOfSorenessValid)}
        //             </View>
        //
        //             <View style={{flex: 1,}}>
        //                 <Text>{'AreasOfSoreness clicked'}</Text>
        //             </View>
        //
        //         </Pages>
        //
        //         { isFABVisible ?
        //             <ActionButton
        //                 buttonColor={AppColors.primary.yellow.hundredPercent}
        //                 degrees={0}
        //                 hideShadow
        //                 onPress={() => this._fabScrollClicked(this.myComponents[isFirstFunctionalStrength || isSecondFunctionalStrength ? (newSoreBodyParts.length + 3) : (newSoreBodyParts.length + 2)])}
        //                 renderIcon={() =>
        //                     <TabIcon
        //                         color={AppColors.white}
        //                         icon={'chevron-down'}
        //                         raised={false}
        //                         type={'material-community'}
        //                     />
        //                 }
        //                 style={{flex: 1,}}
        //             />
        //             :
        //             null
        //         }
        //
        //         <SlideUpPanel
        //             expandSlideUpPanel={() => this.setState({ isSlideUpPanelExpanded: true, })}
        //             isSlideUpPanelOpen={this.state.isSlideUpPanelOpen}
        //             isSlideUpPanelExpanded={this.state.isSlideUpPanelExpanded}
        //             toggleSlideUpPanel={isExpanded => this._toggleSlideUpPanel(isExpanded)}
        //         />
        //
        //     </View>
        // )
        /*eslint no-return-assign: 0*/
        return(
            <View style={{flex: 1,}}>
                <ScrollView
                    bounces={false}
                    onContentSizeChange={(contentWidth, contentHeight) => {this._scrollViewContentHeight = contentHeight}}
                    onScrollEndDrag={event => this._scrollViewEndDrag(event, this.myComponents[isFirstFunctionalStrength || isSecondFunctionalStrength ? (newSoreBodyParts.length + 3) : (newSoreBodyParts.length + 2)])}
                    overScrollMode={'never'}
                    ref={ref => {this.scrollViewRef = ref}}
                    style={{flex: isFABVisible ? 9 : 10,}}
                >
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
                                firstTimeExperience={user.first_time_experience}
                                handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                    handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                                    if(shouldScroll) {
                                        this._scrollTo(isFirstFunctionalStrength || isSecondFunctionalStrength ? (i + 4) : (i + 3));
                                    }
                                }}
                                handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                                index={isFirstFunctionalStrength ? (i + 5) : isSecondFunctionalStrength ? (i + 4) : (i + 3)}
                                isPrevSoreness={true}
                                surveyObject={dailyReadiness}
                                toggleSlideUpPanel={this._toggleSlideUpPanel}
                            />
                            <Spacer size={100} />
                        </View>
                    )}
                    <View onLayout={event => {this.myComponents[isFirstFunctionalStrength || isSecondFunctionalStrength ? (newSoreBodyParts.length + 3) : (newSoreBodyParts.length + 2)] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 50, height: event.nativeEvent.layout.height}}}>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {isFirstFunctionalStrength ? (newSoreBodyParts.length + 5) : isSecondFunctionalStrength ? (newSoreBodyParts.length + 4) : (newSoreBodyParts.length + 3)}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`Is anything${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' else ' : ' '}bothering you?`}
                        </Text>
                        <AreasOfSoreness
                            handleAreaOfSorenessClick={(body, isAllGood) => { this.setState({ isActionButtonVisible: true, }); handleAreaOfSorenessClick(body, true, isAllGood); }}
                            handleFormChange={handleFormChange}
                            handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
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
                { isFABVisible ?
                    <ActionButton
                        buttonColor={AppColors.primary.yellow.hundredPercent}
                        degrees={0}
                        hideShadow
                        onPress={() => this._fabScrollClicked(this.myComponents[isFirstFunctionalStrength || isSecondFunctionalStrength ? (newSoreBodyParts.length + 3) : (newSoreBodyParts.length + 2)])}
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