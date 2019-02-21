/**
 * SportScheduleBuilder
 *
    <SportScheduleBuilder
        backNextButtonOptions={{
            isValid:  isRPEValid && isSportValid,
            onBack:   () => this._addSession(),
            onSubmit: () => this._checkNextStep(3),
        }}
        goBack={() => this._updatePageIndex(pageIndex - 1)}
        handleFormChange={this._handleFormChange}
        handleTogglePostSessionSurvey={handleTogglePostSessionSurvey}
        isPostSession={true}
        postSession={postSession}
        resetFirstPage={resetFirstPage}
        typicalSessions={typicalSessions}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, SectionList, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Spacer, TabIcon, Text, WheelScrollPicker, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { BackNextButtons, ProgressPill, ScaleButton, } from './';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

const step0CircleSize = ((AppSizes.screen.width - (AppSizes.padding * 2) - (AppSizes.paddingSml * 4)) / 3);
const step1CircleSize = ((AppSizes.screen.width - (AppSizes.padding * 2) - (AppSizes.paddingSml * 5)) / 4);

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  {  height: 3, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  5,
    },
    sportBlockWrapper: {
        alignItems:      'center',
        backgroundColor: AppColors.zeplin.darkWhite,
        borderRadius:    7,
        flexDirection:   'row',
        marginBottom:    AppSizes.paddingMed,
        padding:         AppSizes.paddingSml,
        width:           AppSizes.screen.widthTwoThirds,
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
    step1Circle: {
        alignSelf:       'center',
        backgroundColor: AppColors.zeplin.superLight,
        borderRadius:    step1CircleSize / 2,
        height:          step1CircleSize,
        justifyContent:  'center',
        marginBottom:    20,
        width:           step1CircleSize,
    },
});

/* Component ==================================================================== */
const SportBlock = ({ displayName, filteredSession, onPress, }) => {
    if(!filteredSession) {
        return(null);
    }
    return(
        <TouchableOpacity
            onPress={() => onPress()}
            style={[
                Platform.OS === 'ios' ? {} : {elevation: 2,},
                styles.shadowEffect,
                styles.sportBlockWrapper,
            ]}
        >
            { filteredSession.icon && filteredSession.iconType ?
                <TabIcon
                    containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                    color={AppColors.zeplin.seaBlue}
                    icon={filteredSession.icon}
                    reverse={false}
                    size={32}
                    type={filteredSession.iconType}
                />
                :
                <Image
                    source={filteredSession.imagePath}
                    style={{height: 32, marginRight: AppSizes.paddingSml, tintColor: AppColors.zeplin.seaBlue, width: 32,}}
                />
            }
            <Text robotoMedium style={{color: AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(15),}}>{displayName}</Text>
        </TouchableOpacity>
    );
};

class SportScheduleBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delayTimerId:        null,
            durationValueGroups: {
                hours:   0,
                minutes: 0,
                label:   1,
            },
            isFormValid:       false,
            pickerScrollCount: 0,
            step:              0,
            timeValueGroups:   {
                hours:   2,
                minutes: 2,
                amPM:    1,
            },
        };
        this._activityRPERef = {};
        this._moreOptionsRef = {};
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(prevProps.resetFirstPage !== this.props.resetFirstPage) {
            this._resetStep(false);
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.state.delayTimerId);
    }

    _nextStep = newStep => {
        this.setState({ step: newStep });
    }

    _resetStep = resetWholeSelection => {
        const { handleFormChange, } = this.props;
        if(resetWholeSelection) {
            this.setState(
                {
                    durationValueGroups: {
                        hours:   0,
                        minutes: 0,
                        label:   1,
                    },
                    isFormValid:       false,
                    pickerScrollCount: 0,
                    step:              0,
                    timeValueGroups:   {
                        hours:   2,
                        minutes: 2,
                        amPM:    1,
                    },
                },
                () => {
                    handleFormChange('description', '');
                    handleFormChange('duration', 0);
                    handleFormChange('event_date', null);
                    handleFormChange('post_session_survey.event_date', null);
                    handleFormChange('session_type', null);
                    handleFormChange('sport_name', null);
                    handleFormChange('strength_and_conditioning_type', null);
                    handleFormChange(this.props.isPostSession ? 'RPE' : 'post_session_survey.RPE', null);
                },
            );
        } else {
            handleFormChange(this.props.isPostSession ? 'RPE' : 'post_session_survey.RPE', null);
        }
        this.setState(
            {
                delayTimerId: _.delay(() => this._scrollToTop(), 500)
            }
        );
    }

    _handleScrollFormChange = (stateIndex, name, data, selectedIndex) => {
        let newFormFields = _.update( this.state[stateIndex], name, () => selectedIndex);
        this.setState(
            {
                [this.state[stateIndex]]: newFormFields,
                pickerScrollCount:        this.state.durationValueGroups.hours !== 0 || this.state.durationValueGroups.minutes !== 0 ? 1 : 0,
            },
            () => {
                this._validateForm();
            },
        );
    }

    _validateForm = () => {
        let { pickerScrollCount, } = this.state;
        this.setState(
            {
                isFormValid: pickerScrollCount > 0 ? true : false,
            },
            () => {
                let dateTimeDurationFromState = PlanLogic.handleGetDateTimeDurationFromState(this.state.durationValueGroups, this.state.isFormValid, this.state.timeValueGroups);
                this.props.handleFormChange('event_date', this.state.isFormValid ? `${dateTimeDurationFromState.event_date.toISOString(true).split('.')[0]}Z` : dateTimeDurationFromState.event_date);
                this.props.handleFormChange('post_session_survey.event_date', `${moment().toISOString(true).split('.')[0]}Z`);
                this.props.handleFormChange('duration', dateTimeDurationFromState.duration);
            },
        );
    }

    _scrollTo = myComponentsLocation => {
        if(myComponentsLocation && this.scrollViewSportBuilderRef) {
            this.setState(
                {
                    delayTimerId: _.delay(() => {
                        this.scrollViewSportBuilderRef.scrollTo({
                            x:        myComponentsLocation.x,
                            y:        myComponentsLocation.y,
                            animated: true,
                        });
                    }, 500)
                }
            );
        }
    }

    _scrollToTop = () => {
        if(this.scrollViewSportBuilderRef) {
            this.setState(
                {
                    delayTimerId: _.delay(() => {
                        this.scrollViewSportBuilderRef.scrollTo({x: 0, y: 0, animated: true});
                    }, 500)
                }
            );
        }
    }

    _scrollToBottom = () => {
        if(this.scrollViewSportBuilderRef) {
            this.setState(
                {
                    delayTimerId: _.delay(() => {
                        this.scrollViewSportBuilderRef.scrollToEnd({ animated: true, });
                    }, 500)
                }
            );
        }
    }

    render = () => {
        const {
            backNextButtonOptions,
            goBack,
            handleFormChange,
            handleTogglePostSessionSurvey,
            isPostSession,
            postSession,
            typicalSessions,
        } = this.props;
        const { durationValueGroups, isFormValid, step, } = this.state;
        let { sportImage, sportText, } = PlanLogic.handleSportScheduleBuilderRenderLogic(postSession, this.state);
        let cleanedActivitiesList = MyPlanConstants.cleanedActivitiesList();
        let pillsHeight = (AppSizes.statusBarHeight + AppSizes.progressPillsHeight);
        return (
            <ScrollView
                contentContainerStyle={{flexGrow: 1,}}
                ref={ref => {this.scrollViewSportBuilderRef = ref;}}
                stickyHeaderIndices={[0]}
            >
                <ProgressPill
                    currentStep={1}
                    onBack={step === 1 ? () => this._resetStep(true) : step === 0 && !isPostSession ? () => goBack() : null}
                    onClose={handleTogglePostSessionSurvey}
                    totalSteps={2}
                />
                { step === 0 ?
                    <View>
                        <View style={[typicalSessions.length > 0 ? {height: (AppSizes.screen.height - pillsHeight), justifyContent: 'center', paddingBottom: pillsHeight,} : {}]}>
                            <Spacer size={typicalSessions.length > 0 ? 20 : 50} />
                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                {'What activity did you do?'}
                            </Text>
                            <Spacer size={20} />
                            { typicalSessions.length > 0 ?
                                <View style={{alignSelf: 'center', marginHorizontal: AppSizes.padding, paddingHorizontal: AppSizes.paddingSml,}}>
                                    { _.map(typicalSessions, (session, i) => {
                                        let filteredSession = session.sport_name || session.sport_name === 0 ?
                                            _.filter(MyPlanConstants.teamSports, ['index', session.sport_name])[0]
                                            : session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0 ?
                                                _.filter(MyPlanConstants.strengthConditioningTypes, ['index', session.strength_and_conditioning_type])[0]
                                                :
                                                false;
                                        let displayName = filteredSession ?
                                            filteredSession.label
                                            :
                                            '';
                                        return(
                                            <SportBlock
                                                displayName={displayName}
                                                filteredSession={filteredSession}
                                                key={i}
                                                onPress={() => {
                                                    let newSportName = MyPlanConstants.translateStrengthConditioningTypeToSport(session.sport_name, session.strength_and_conditioning_type);
                                                    this._nextStep(1);
                                                    handleFormChange('sport_name', newSportName);
                                                    handleFormChange('session_type', 6);
                                                    handleFormChange('strength_and_conditioning_type', null);
                                                    handleFormChange('event_date', null);
                                                    handleFormChange('post_session_survey.event_date', null);
                                                    handleFormChange('duration', session.duration);
                                                }}
                                            />
                                        )
                                    })}
                                    <SportBlock
                                        displayName={'More options'}
                                        filteredSession={{icon: 'add', iconType: 'material',}}
                                        onPress={() => this.setState({
                                            delayTimerId: _.delay(() => this._scrollTo(this._moreOptionsRef, 10))
                                        })}
                                    />
                                </View>
                                :
                                null
                            }
                        </View>
                        <View onLayout={event => {this._moreOptionsRef = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y,}}}>
                            <Spacer size={30} />
                            <SectionList
                                keyExtractor={(item, index) => item + index}
                                renderItem={({item, index, section}) =>
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            this._nextStep(1);
                                            handleFormChange('sport_name', item.index);
                                            handleFormChange('session_type', 6);
                                            this.setState({
                                                delayTimerId: _.delay(() => this._scrollToTop(),500)
                                            });
                                        }}
                                        style={[
                                            (index+1) === section.data.length ? {} : {borderBottomColor: AppColors.zeplin.shadow, borderBottomWidth: 1,},
                                            {alignItems: 'center', flexDirection: 'row', paddingHorizontal: AppSizes.paddingSml, paddingVertical: AppSizes.paddingMed,}
                                        ]}
                                    >
                                        <Image
                                            source={item.imagePath}
                                            style={{height: 25, marginRight: AppSizes.paddingSml, tintColor: AppColors.zeplin.seaBlue, width: 25,}}
                                        />
                                        <Text robotoMedium style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(15),}}>{item.label}</Text>
                                    </TouchableOpacity>
                                }
                                renderSectionHeader={({section: {title}}) =>
                                    <Text
                                        oswaldMedium
                                        style={{backgroundColor: AppColors.zeplin.lightSlate, color: AppColors.white, fontSize: AppFonts.scaleFont(15), paddingHorizontal: AppSizes.paddingSml, paddingVertical: AppSizes.paddingXSml,}}
                                    >
                                        {title.toUpperCase()}
                                    </Text>
                                }
                                sections={cleanedActivitiesList}
                            />
                        </View>
                    </View>
                    : step === 1 ?
                        <View>
                            <Spacer size={20} />
                            <View style={{alignItems: 'center',}}>
                                { sportImage ?
                                    <Image
                                        source={sportImage}
                                        style={[styles.shadowEffect, {height: AppSizes.screen.widthThird, shadowRadius: 6, tintColor: AppColors.zeplin.seaBlue, width: AppSizes.screen.widthThird,}]}
                                    />
                                    :
                                    null
                                }
                            </View>
                            <Spacer size={20} />
                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(32),}]}>
                                {'How long was '}
                                <Text robotoMedium>{sportText}</Text>
                                {'?'}
                            </Text>
                            <Spacer size={20} />
                            <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                <View style={{flex: 1,}}>
                                    <Text oswaldMedium style={{color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{'DURATION'}</Text>
                                    <Spacer size={10} />
                                    <View style={{flex: 1, flexDirection: 'row',}}>
                                        <WheelScrollPicker
                                            activeItemColor={AppColors.zeplin.darkGrey}
                                            activeItemHighlight={'#EBBA2D4D'}
                                            dataSource={[' ', ' ', ' ']}
                                            highlightBorderWidth={2}
                                            highlightColor={AppColors.primary.yellow.hundredPercent}
                                            itemColor={AppColors.primary.grey.fiftyPercent}
                                            itemHeight={AppFonts.scaleFont(18) + 10}
                                            scrollEnabled={false}
                                            selectedIndex={1}
                                            onValueChange={(data, selectedIndex) => null}
                                            wrapperBackground={AppColors.transparent}
                                            wrapperHeight={180}
                                        />
                                        <WheelScrollPicker
                                            activeItemColor={AppColors.zeplin.darkGrey}
                                            activeItemHighlight={'#EBBA2D4D'}
                                            dataSource={MyPlanConstants.durationOptionGroups.hours}
                                            highlightBorderWidth={2}
                                            highlightColor={AppColors.primary.yellow.hundredPercent}
                                            itemColor={AppColors.primary.grey.fiftyPercent}
                                            itemHeight={AppFonts.scaleFont(18) + 10}
                                            selectedIndex={durationValueGroups.hours}
                                            onValueChange={(data, selectedIndex) => this._handleScrollFormChange('durationValueGroups', 'hours', data, selectedIndex)}
                                            wrapperBackground={AppColors.transparent}
                                            wrapperFlex={3}
                                            wrapperHeight={180}
                                        />
                                        <WheelScrollPicker
                                            activeItemColor={AppColors.zeplin.darkGrey}
                                            activeItemHighlight={'#EBBA2D4D'}
                                            dataSource={MyPlanConstants.durationOptionGroups.hourLabel}
                                            highlightBorderWidth={2}
                                            highlightColor={AppColors.primary.yellow.hundredPercent}
                                            itemColor={AppColors.primary.grey.fiftyPercent}
                                            itemHeight={AppFonts.scaleFont(18) + 10}
                                            scrollEnabled={false}
                                            selectedIndex={durationValueGroups.label}
                                            onValueChange={(data, selectedIndex) => null}
                                            wrapperBackground={AppColors.transparent}
                                            wrapperHeight={180}
                                        />
                                        <WheelScrollPicker
                                            activeItemColor={AppColors.zeplin.darkGrey}
                                            activeItemHighlight={'#EBBA2D4D'}
                                            dataSource={MyPlanConstants.durationOptionGroups.minutes}
                                            highlightBorderWidth={2}
                                            highlightColor={AppColors.primary.yellow.hundredPercent}
                                            itemColor={AppColors.primary.grey.fiftyPercent}
                                            itemHeight={AppFonts.scaleFont(18) + 10}
                                            selectedIndex={durationValueGroups.minutes}
                                            onValueChange={(data, selectedIndex) => this._handleScrollFormChange('durationValueGroups', 'minutes', data, selectedIndex)}
                                            wrapperBackground={AppColors.transparent}
                                            wrapperFlex={3}
                                            wrapperHeight={180}
                                        />
                                        <WheelScrollPicker
                                            activeItemColor={AppColors.zeplin.darkGrey}
                                            activeItemHighlight={'#EBBA2D4D'}
                                            dataSource={MyPlanConstants.durationOptionGroups.minLabel}
                                            highlightBorderWidth={2}
                                            highlightColor={AppColors.primary.yellow.hundredPercent}
                                            itemColor={AppColors.primary.grey.fiftyPercent}
                                            itemHeight={AppFonts.scaleFont(18) + 10}
                                            scrollEnabled={false}
                                            selectedIndex={1}
                                            onValueChange={(data, selectedIndex) => null}
                                            wrapperBackground={AppColors.transparent}
                                            wrapperHeight={180}
                                        />
                                        <WheelScrollPicker
                                            activeItemColor={AppColors.zeplin.darkGrey}
                                            activeItemHighlight={'#EBBA2D4D'}
                                            dataSource={[' ', ' ', ' ']}
                                            highlightBorderWidth={2}
                                            highlightColor={AppColors.primary.yellow.hundredPercent}
                                            itemColor={AppColors.primary.grey.fiftyPercent}
                                            itemHeight={AppFonts.scaleFont(18) + 10}
                                            scrollEnabled={false}
                                            selectedIndex={1}
                                            onValueChange={(data, selectedIndex) => null}
                                            wrapperBackground={AppColors.transparent}
                                            wrapperHeight={180}
                                        />
                                    </View>
                                </View>
                            </View>
                            <Spacer size={30} />
                            <Button
                                backgroundColor={isFormValid ? AppColors.primary.yellow.hundredPercent : AppColors.white}
                                buttonStyle={{
                                    borderColor:  isFormValid ? AppColors.white : AppColors.zeplin.lightGrey,
                                    borderRadius: 10,
                                    borderWidth:  1,
                                    width:        AppSizes.screen.widthThird,
                                }}
                                color={isFormValid ? AppColors.white : AppColors.zeplin.lightGrey}
                                containerViewStyle={{alignItems: 'center', justifyContent: 'center',}}
                                fontFamily={AppStyles.robotoBold.fontFamily}
                                fontWeight={AppStyles.robotoBold.fontWeight}
                                onPress={() => isFormValid ? this._scrollTo(this._activityRPERef) : null}
                                outlined
                                raised={false}
                                textStyle={{ fontSize: AppFonts.scaleFont(14) }}
                                title={'Next'}
                            />
                            <Spacer size={30} />
                            { isFormValid ?
                                <View onLayout={event => {this._activityRPERef = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y,}}}>
                                    <Spacer size={20} />
                                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                        {'How was '}
                                        <Text robotoMedium>{sportText}</Text>
                                        {' today?'}
                                    </Text>
                                    <View style={{flex: 1, paddingTop: AppSizes.paddingSml,}}>
                                        { _.map(MyPlanConstants.postSessionFeel, (value, key) => {
                                            let RPEValue = isPostSession ? postSession.RPE : postSession.post_session_survey.RPE;
                                            let isSelected = RPEValue === key;
                                            let opacity = isSelected ? 1 : (key * 0.1);
                                            return(
                                                <TouchableHighlight
                                                    key={value+key}
                                                    onPress={() => {
                                                        handleFormChange(isPostSession ? 'RPE' : 'post_session_survey.RPE', key);
                                                        if(!isPostSession && (key === 0 || key >= 1)) {
                                                            this._scrollToBottom();
                                                        }
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
                                                                    handleFormChange(isPostSession ? 'RPE' : 'post_session_survey.RPE', key);
                                                                    if(!isPostSession && (key === 0 || key >= 1)) {
                                                                        this._scrollToBottom();
                                                                    }
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
                                    <Spacer size={20} />
                                    { !isPostSession && backNextButtonOptions.isValid ?
                                        <BackNextButtons
                                            handleFormSubmit={backNextButtonOptions.onSubmit}
                                            isValid={backNextButtonOptions.isValid}
                                            onBackClick={backNextButtonOptions.onBack}
                                            onNextClick={backNextButtonOptions.isValid ? backNextButtonOptions.onSubmit : null}
                                            showAddBtn={true}
                                            showSubmitBtn={true}
                                            submitBtnText={'Continue'}
                                        />
                                        :
                                        null
                                    }
                                </View>
                                :
                                null
                            }
                        </View>
                        :
                        null
                }
            </ScrollView>
        )
    }
}

SportScheduleBuilder.propTypes = {
    backNextButtonOptions:         PropTypes.object,
    goBack:                        PropTypes.func,
    handleFormChange:              PropTypes.func.isRequired,
    handleTogglePostSessionSurvey: PropTypes.func,
    isPostSession:                 PropTypes.bool,
    postSession:                   PropTypes.object.isRequired,
    resetFirstPage:                PropTypes.bool,
    typicalSessions:               PropTypes.array.isRequired,
};

SportScheduleBuilder.defaultProps = {
    backNextButtonOptions:         {},
    goBack:                        () => null,
    handleTogglePostSessionSurvey: null,
    isPostSession:                 false,
    resetFirstPage:                false,
};

SportScheduleBuilder.componentName = 'SportScheduleBuilder';

/* Export Component ================================================================== */
export default SportScheduleBuilder;