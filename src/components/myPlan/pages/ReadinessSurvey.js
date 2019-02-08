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
const step0CircleSize = ((AppSizes.screen.width - (AppSizes.padding * 6)) / 3);

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
    lockIconStyle: {
        alignSelf:      'center',
        justifyContent: 'center',
    },
    lockIconWrapperStyle: {
        alignItems:      'center',
        alignSelf:       'center',
        backgroundColor: AppColors.zeplin.seaBlue,
        borderRadius:    AppFonts.scaleFont(40) / 2,
        height:          AppFonts.scaleFont(40),
        justifyContent:  'center',
        width:           AppFonts.scaleFont(40),
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 3 },
        shadowRadius:  6,
        shadowOpacity: 1,
    },
    step0Circle: {
        alignSelf:         'center',
        backgroundColor:   AppColors.zeplin.superLight,
        borderRadius:      step0CircleSize / 2,
        height:            step0CircleSize,
        justifyContent:    'center',
        marginBottom:      20,
        paddingHorizontal: AppSizes.paddingSml,
        width:             step0CircleSize,
    },
});

/* Components ================================================================= */
class ReadinessSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            androidShowMoreOptions:  false,
            isActionButtonVisible:   false,
            isAppleHealthKitLoading: false,
            isCloseToBottom:         false,
            isSlideUpPanelExpanded:  true,
            isSlideUpPanelOpen:      false,
            pageIndex:               0,
        };
        this.myActivityTargetComponents = [];
        this.myAreasOfSorenessComponent = {};
        this.myClickedSorenessComponents = [];
        this.myPrevSorenessComponents = [];
        this.myRPEComponents = [];
        this.positionsComponents = [];
        this.scrollViewActivityTargetRef = {};
        this.scrollViewClickedSorenessRef = {};
        this.scrollViewHealthKitRef = {};
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

    _renderNextPage = (currentPage, isFormValidItems, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, sportBuilderRPEIndex, areaOfSorenessClicked, isHealthKitValid) => {
        const { dailyReadiness, healthKitWorkouts, } = this.props;
        let { isValid, pageNum, } = PlanLogic.handleReadinessSurveyNextPage(this.state, dailyReadiness, currentPage, isFormValidItems, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, sportBuilderRPEIndex, areaOfSorenessClicked, healthKitWorkouts, isHealthKitValid);
        if(isValid) {
            this.pages.scrollToPage(pageNum);
            this.setState({ pageIndex: pageNum, });
        }
    }

    _checkNextStep = (currentPage, isHealthKitValid) => {
        const { dailyReadiness, soreBodyParts, } = this.props;
        let {
            isFirstFunctionalStrength,
            isFormValidItems,
            isSecondFunctionalStrength,
            newSoreBodyParts,
        } = PlanLogic.handleReadinessSurveyRenderLogic(dailyReadiness, soreBodyParts, this.areasOfSorenessRef);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, dailyReadiness.soreness);
        _.delay(() => {
            this._renderNextPage(currentPage, isFormValidItems, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, null, areaOfSorenessClicked, isHealthKitValid);
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
        this._checkNextStep(4);
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

    _resetSportBuilder = () => {
        _.map(this.sportScheduleBuilderRefs, (sportScheduleBuilderRef, index) => {
            if(sportScheduleBuilderRef) {
                sportScheduleBuilderRef._resetStep();
            }
        });
    }

    _handleEnableAppleHealthKit = (firstTimeExperienceValue, healthKitFlag) => {
        this.setState({ isAppleHealthKitLoading: true, });
        AppUtil.getAppleHealthKitDataAsync(null, () => {
            this.setState({ isAppleHealthKitLoading: false, });
            this.props.handleUpdateFirstTimeExperience(firstTimeExperienceValue);
            this.props.handleUpdateUserHealthKitFlag(healthKitFlag);
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
        const { isActionButtonVisible, isCloseToBottom, pageIndex, } = this.state;
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
        let pageIndexOffset = dailyReadiness.sessions.length > 0 ? (dailyReadiness.sessions.length - 1) : 0;
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
                                        <Text oswaldMedium style={{color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(30), lineHeight: AppFonts.scaleFont(40),}}>{`GOOD ${partOfDay}, ${user.personal_data.first_name.toUpperCase()}!`}</Text>
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
                                            onPress={() => this._renderNextPage(0, isFormValidItems, isFirstFunctionalStrength, isSecondFunctionalStrength)}
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
                        { isFirstFunctionalStrength &&
                            <View style={{flex: 1,}}>
                                <Spacer size={50} />
                                <View style={[styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {alignSelf: 'center', backgroundColor: AppColors.white, borderRadius: 5, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingMed, width: AppSizes.screen.widthFourFifths,}]}>
                                    <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(32),}]}>{`CONGRATS ${user.personal_data.first_name.toUpperCase()}!`}</Text>
                                    <Spacer size={15} />
                                    <TabIcon
                                        color={AppColors.white}
                                        containerStyle={[styles.lockIconWrapperStyle,]}
                                        icon={'lock-open-outline'}
                                        iconStyle={[styles.lockIconStyle,]}
                                        raised={false}
                                        size={AppFonts.scaleFont(26)}
                                        type={'material-community'}
                                    />
                                    <Spacer size={15} />
                                    <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(22),}]}>{'You\'ve unlocked\nFunctional Strength!'}</Text>
                                </View>
                                <Spacer size={60} />
                                <View>
                                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                        {'What activity would you like to target?'}
                                    </Text>
                                    <Spacer size={10} />
                                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: AppSizes.padding, paddingHorizontal: AppSizes.paddingSml,}}>
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
                                                <TouchableOpacity
                                                    key={i}
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
                                                    style={[
                                                        styles.step0Circle,
                                                        styles.shadowEffect,
                                                        Platform.OS === 'ios' ? {} : {elevation: 2,},
                                                        ((i + 1) % 3 === 0) ? {} : {marginRight: AppSizes.padding,},
                                                        isSelected ? {backgroundColor: AppColors.zeplin.yellow,} : {},
                                                    ]}
                                                >
                                                    <Text oswaldMedium style={{color: isSelected ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>
                                                        {sessionName.toUpperCase()}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
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
                                            <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: AppSizes.padding, paddingHorizontal: AppSizes.paddingSml,}}>
                                                { _.map(selectedSportPositions, (position, i) => {
                                                    let isSelected = dailyReadiness.current_position === i;
                                                    return(
                                                        <TouchableOpacity
                                                            key={i}
                                                            onPress={() => {
                                                                handleFormChange('current_position', i);
                                                                this._scrollToBottom(this.scrollViewActivityTargetRef);
                                                            }}
                                                            style={[
                                                                styles.step0Circle,
                                                                styles.shadowEffect,
                                                                Platform.OS === 'ios' ? {} : {elevation: 2,},
                                                                ((i + 1) % 3 === 0) ? {} : {marginRight: AppSizes.padding,},
                                                                isSelected ? {backgroundColor: AppColors.zeplin.yellow,} : {},
                                                            ]}
                                                        >
                                                            <Text oswaldMedium style={{color: isSelected ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>
                                                                {position.toUpperCase()}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </View>
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
                                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: AppSizes.padding, paddingHorizontal: AppSizes.paddingSml,}}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleFormChange('wants_functional_strength', true);
                                                this._checkNextStep(1);
                                            }}
                                            style={[
                                                styles.step0Circle,
                                                styles.shadowEffect,
                                                Platform.OS === 'ios' ? {} : {elevation: 2,},
                                                {marginRight: AppSizes.padding,},
                                                dailyReadiness.wants_functional_strength ? {backgroundColor: AppColors.zeplin.yellow,} : {},
                                            ]}
                                        >
                                            <Text oswaldMedium style={{color: dailyReadiness.wants_functional_strength ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                                                {'YES'}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleFormChange('wants_functional_strength', false);
                                                this._checkNextStep(1);
                                            }}
                                            style={[
                                                styles.step0Circle,
                                                styles.shadowEffect,
                                                Platform.OS === 'ios' ? {} : {elevation: 2,},
                                                dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? {} : {backgroundColor: AppColors.zeplin.yellow,},
                                            ]}
                                        >
                                            <Text oswaldMedium style={{color: dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? AppColors.zeplin.blueGrey : AppColors.white, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                                                {'NO'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Spacer size={50} />
                            </View>
                        }
                    </ScrollView>

                    <ScrollView
                        contentContainerStyle={{flexGrow: 1,}}
                        keyboardShouldPersistTaps={'always'}
                        ref={ref => {this.scrollViewHealthKitRef = ref;}}
                    >
                        { healthKitWorkouts && healthKitWorkouts.length > 0 &&
                            <View style={{flex: 1,}}>
                                <ProgressPill currentStep={1} totalSteps={3} />
                                <Spacer size={20} />
                                <HealthKitWorkouts
                                    handleHealthDataFormChange={handleHealthDataFormChange}
                                    handleNextStep={isHealthKitValid => this._renderNextPage(2, isFormValidItems, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, null, areaOfSorenessClicked, isHealthKitValid)}
                                    handleToggleSurvey={() => this._renderNextPage(2, isFormValidItems, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, null, areaOfSorenessClicked, true)}
                                    scrollToArea={xyObject => {
                                        this._scrollTo(xyObject, this.scrollViewHealthKitRef);
                                    }}
                                    workouts={healthKitWorkouts}
                                />
                                <Spacer size={40} />
                            </View>
                        }
                    </ScrollView>

                    <View style={{flex: 1,}}>
                        { !healthKitWorkouts &&
                            <View style={{flex: 1,}}>
                                <ProgressPill currentStep={1} totalSteps={3} />
                                <View style={[AppStyles.containerCentered, {flex: 1, paddingHorizontal: AppSizes.paddingXLrg,}]}>
                                    <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>{'Have you already trained today?'}</Text>
                                    <Spacer size={20} />
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 220,}}>
                                        <TouchableHighlight
                                            onPress={() => {
                                                handleFormChange('already_trained_number', false);
                                                this._checkNextStep(3);
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
                                                this._resetSportBuilder();
                                                handleFormChange('already_trained_number', 1);
                                                this._checkNextStep(3);
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
                            </View>
                        }
                    </View>

                    { dailyReadiness.sessions && dailyReadiness.sessions.length > 0 ? _.map(dailyReadiness.sessions, (session, index) => {
                        const { isRPEValid, isSportValid, sportText, } = PlanLogic.handleSingleSessionValidation(session, this.sportScheduleBuilderRefs[index]);
                        return(
                            <ScrollView
                                contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                                key={index}
                                ref={ref => {this.scrollViewSportBuilderRefs[index] = ref;}}
                            >
                                <ProgressPill currentStep={1} totalSteps={3} />
                                <Spacer size={20} />
                                <SportScheduleBuilder
                                    handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                        handleFormChange(`sessions[${index}].${location}`, value, isPain, bodyPartMapIndex, bodyPartSide);
                                        if(location === 'post_session_survey.RPE' && value >= 0) {
                                            this._scrollToBottom(this.scrollViewSportBuilderRefs[index]);
                                        }
                                    }}
                                    postSession={session}
                                    ref={ref => {this.sportScheduleBuilderRefs[index] = ref;}}
                                    scrollTo={() => null}
                                    scrollToArea={xyObject => {
                                        this._scrollTo(xyObject, this.scrollViewSportBuilderRefs[index]);
                                    }}
                                    scrollToTop={() => this._scrollToTop(this.scrollViewSportBuilderRefs[index])}
                                    typicalSessions={typicalSessions}
                                />
                                <Spacer size={20} />
                                { isRPEValid && isSportValid ?
                                    <BackNextButtons
                                        handleFormSubmit={() => this._checkNextStep(4)}
                                        isValid={isRPEValid && isSportValid}
                                        onBackClick={() => this._addSession()}
                                        onNextClick={() => isRPEValid && isSportValid ? this._checkNextStep(4) : null}
                                        showAddBtn={true}
                                        showSubmitBtn={true}
                                        submitBtnText={'Continue'}
                                    />
                                    :
                                    null
                                }
                            </ScrollView>
                        )
                    }) : <View />}

                    <View style={{flex: 1,}}>
                        <ProgressPill currentStep={2} totalSteps={3} />
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
                                        handleFormChange('sessions_planned', false);
                                        this._checkNextStep(5);
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
                                        handleFormChange('sessions_planned', true);
                                        this._checkNextStep(5);
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
                    </View>

                    <View style={{flex: 1,}}>
                        { pageIndex === (6 + pageIndexOffset) &&
                            <View style={{flex: 1,}}>
                                <ProgressPill currentStep={2} totalSteps={3} />
                                <View style={[AppStyles.containerCentered, {flex: 1, paddingHorizontal: AppSizes.paddingXLrg,}]}>
                                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                        {'Would you like to add Functional Strength to your training plan today?'}
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
                                            onPress={() => {
                                                handleFormChange('wants_functional_strength', true);
                                                this._checkNextStep(6);
                                            }}
                                            style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                                backgroundColor: dailyReadiness.wants_functional_strength === true ? AppColors.zeplin.yellow : AppColors.primary.white.hundredPercent,
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
                                            onPress={() => {
                                                handleFormChange('wants_functional_strength', false);
                                                this._checkNextStep(6);
                                            }}
                                            style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                                backgroundColor: dailyReadiness.wants_functional_strength === false ? AppColors.zeplin.yellow : AppColors.primary.white.hundredPercent,
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
                            </View>
                        }
                    </View>

                    <ScrollView
                        bounces={false}
                        contentContainerStyle={{flexGrow: 1,}}
                        nestedScrollEnabled={true}
                        overScrollMode={'never'}
                        ref={ref => {this.scrollViewPrevSorenessRef = ref;}}
                    >
                        { pageIndex === (7 + pageIndexOffset) &&
                            <View style={{flex: 1,}}>
                                <ProgressPill currentStep={3} totalSteps={3} />
                                <View style={{flexDirection: 'column', flexGrow: 1, paddingVertical: AppSizes.padding, justifyContent: 'center',}}>
                                    { _.map(newSoreBodyParts, (bodyPart, i) =>
                                        <View
                                            key={i}
                                            onLayout={event => {this.myPrevSorenessComponents[i] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 50}}}
                                            style={{paddingVertical: AppSizes.padding,}}
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
                                                    this._checkNextStep(7);
                                                }}
                                                handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                                                isPrevSoreness={true}
                                                surveyObject={dailyReadiness}
                                                toggleSlideUpPanel={this._toggleSlideUpPanel}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                        }
                    </ScrollView>

                    <ScrollView
                        bounces={false}
                        contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                        nestedScrollEnabled={true}
                        onScrollEndDrag={event => this._scrollViewEndDrag(event)}
                        overScrollMode={'never'}
                        ref={ref => {this.myAreasOfSorenessComponent = ref;}}
                        style={{flex: 1,}}
                    >
                        <ProgressPill currentStep={3} totalSteps={3} />
                        <AreasOfSoreness
                            handleAreaOfSorenessClick={(body, isAllGood) => {
                                if(!isCloseToBottom) {
                                    this.setState({ isActionButtonVisible: true, });
                                }
                                handleAreaOfSorenessClick(body, true, isAllGood);
                            }}
                            handleFormChange={handleFormChange}
                            handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
                            headerTitle={`Do you have any${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' other ' : ' new '}pain or soreness?`}
                            ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
                            scrollToArea={xyObject => {
                                this._scrollTo(xyObject, this.myAreasOfSorenessComponent);
                                this.setState({ isCloseToBottom: true, });
                            }}
                            soreBodyParts={soreBodyParts}
                            soreBodyPartsState={dailyReadiness.soreness}
                            surveyObject={dailyReadiness}
                            toggleSlideUpPanel={this._toggleSlideUpPanel}
                            user={user}
                        />
                        <BackNextButtons
                            handleFormSubmit={() => handleFormSubmit()}
                            isValid={isFormValidItems.selectAreasOfSorenessValid}
                            onNextClick={() => {
                                this.setState({ isActionButtonVisible: false, });
                                this._renderNextPage(8, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked);
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
                                    surveyObject={dailyReadiness}
                                    toggleSlideUpPanel={this._toggleSlideUpPanel}
                                />
                            </View>
                        ))}
                        <BackNextButtons
                            handleFormSubmit={() => handleFormSubmit()}
                            isValid={isFormValidItems.areAreasOfSorenessValid}
                            onNextClick={() => this._renderNextPage(9, isFormValidItems)}
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
                    handleSkip={value => handleUpdateFirstTimeExperience(value)}
                    handleEnableAppleHealthKit={this._handleEnableAppleHealthKit}
                    isLoading={this.state.isAppleHealthKitLoading}
                    isModalOpen={!user.first_time_experience.includes('apple_healthkit') && !user.health_enabled && Platform.OS === 'ios'}
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