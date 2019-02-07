/**
 * SportScheduleBuilder
 *
    <SportScheduleBuilder
        handleFormChange={this._handleFormChange}
        isPostSession={true}
        postSession={postSession}
        scrollTo={() => this._scrollTo(0)}
        scrollToArea={xyObject => {
            this._scrollTo(xyObject, this.scrollViewSportBuilderRef);
        }}
        scrollToTop={this._scrollToTop}
        typicalSessions={typicalSessions}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StyleSheet, TouchableHighlight, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Spacer, TabIcon, Text, WheelScrollPicker, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { ScaleButton, } from './';

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
            durationValueGroups: {
                hours:   0,
                minutes: 0,
                label:   1,
            },
            isFormValid:       false,
            pickerScrollCount: 0,
            showMoreOptions:   props.typicalSessions.length === 0 ? true : false,
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

    _nextStep = newStep => {
        this.setState({ step: newStep });
    }

    _resetStep = () => {
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
                this.props.handleFormChange('description', '');
                this.props.handleFormChange('duration', 0);
                this.props.handleFormChange('event_date', null);
                this.props.handleFormChange('post_session_survey.event_date', null);
                this.props.handleFormChange('session_type', null);
                this.props.handleFormChange('sport_name', null);
                this.props.handleFormChange('strength_and_conditioning_type', null);
            },
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

    render = () => {
        const { handleFormChange, isPostSession, postSession, scrollToArea, typicalSessions, } = this.props;
        const { durationValueGroups, isFormValid, showMoreOptions, step, } = this.state;
        let { sportImage, sportText, } = PlanLogic.handleSportScheduleBuilderRenderLogic(postSession, this.state);
        let cleanedActivitiesList = MyPlanConstants.cleanedActivitiesList();
        return (
            <View style={{flex: 1,}}>
                { step === 0 ?
                    <View>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {'What activity did you do?'}
                        </Text>
                        <Spacer size={20} />
                        { typicalSessions.length > 0 ?
                            <View style={{alignSelf: 'center', flex: 1, marginHorizontal: AppSizes.padding, paddingHorizontal: AppSizes.paddingSml,}}>
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
                                    onPress={() => this.setState({ showMoreOptions: !this.state.showMoreOptions, }, () => scrollToArea(this._moreOptionsRef))}
                                />
                            </View>
                            :
                            null
                        }
                        <View onLayout={event => {this._moreOptionsRef = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y,}}}>
                            <Spacer size={30} />
                            { showMoreOptions ?
                                _.map(cleanedActivitiesList, (activityItems, index) =>
                                    <View key={index}>
                                        <Text oswaldMedium style={{backgroundColor: AppColors.zeplin.lightSlate, color: AppColors.white, fontSize: AppFonts.scaleFont(15), paddingHorizontal: AppSizes.paddingSml, paddingVertical: AppSizes.paddingXSml,}}>{index.toUpperCase()}</Text>
                                        {_.map(activityItems, (activity, i) =>
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => {
                                                    this._nextStep(1);
                                                    handleFormChange('sport_name', activity.index);
                                                    handleFormChange('session_type', 6);
                                                }}
                                                style={[
                                                    (i+1) === activityItems.length ? {} : {borderBottomColor: AppColors.zeplin.shadow, borderBottomWidth: 1,},
                                                    {alignItems: 'center', flexDirection: 'row', paddingHorizontal: AppSizes.paddingSml, paddingVertical: AppSizes.paddingMed,}
                                                ]}
                                            >
                                                <Image
                                                    source={activity.imagePath}
                                                    style={{height: 25, marginRight: AppSizes.paddingSml, tintColor: AppColors.zeplin.seaBlue, width: 25,}}
                                                />
                                                <Text robotoMedium style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(15),}}>{activity.label}</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )
                                :
                                null
                            }
                        </View>
                    </View>
                    : step === 1 ?
                        <View>
                            <Spacer size={20} />
                            <View style={{alignItems: 'center',}}>
                                <Image
                                    source={sportImage}
                                    style={{height: 75, tintColor: AppColors.zeplin.seaBlue, width: 75,}}
                                />
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
                                onPress={() => isFormValid ? scrollToArea(this._activityRPERef) : null}
                                outlined
                                raised={false}
                                textStyle={{ fontSize: AppFonts.scaleFont(14) }}
                                title={'Next'}
                            />
                            <Spacer size={30} />
                            { isFormValid ?
                                <View onLayout={event => {this._activityRPERef = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y,}}}>
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
                        </View>
                        :
                        null
                }
            </View>
        )
    }
}

SportScheduleBuilder.propTypes = {
    handleFormChange: PropTypes.func.isRequired,
    isPostSession:    PropTypes.bool,
    postSession:      PropTypes.object.isRequired,
    scrollTo:         PropTypes.func.isRequired,
    scrollToArea:     PropTypes.func.isRequired,
    typicalSessions:  PropTypes.array.isRequired,
};

SportScheduleBuilder.defaultProps = {
    isPostSession: false,
};

SportScheduleBuilder.componentName = 'SportScheduleBuilder';

/* Export Component ================================================================== */
export default SportScheduleBuilder;