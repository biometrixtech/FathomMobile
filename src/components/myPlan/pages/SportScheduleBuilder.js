/**
 * SportScheduleBuilder
 *
    <SportScheduleBuilder
        handleFormChange={this._handleFormChange}
        postSession={postSession}
        scrollTo={() => this._scrollTo(0)}
        typicalSessions={typicalSessions}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Spacer, TabIcon, Text, WheelScrollPicker, } from '../../custom';

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
class SportScheduleBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            durationValueGroups: {
                minutes: 2,
                label:   1,
            },
            isFormValid:       false,
            pickerScrollCount: 0,
            step:              props.typicalSessions.length === 0 ? 1 : 0,
            timeValueGroups:   {
                hours:   2,
                minutes: 2,
                amPM:    1,
            },
        };
    }

    _nextStep = newStep => {
        this.setState({ step: newStep });
    }

    _resetStep = () => {
        this.setState(
            {
                durationValueGroups: {
                    minutes: 2,
                    label:   1,
                },
                isFormValid:       false,
                pickerScrollCount: 0,
                step:              this.props.typicalSessions.length === 0 ? 1 : 0,
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
                pickerScrollCount:        this.state.pickerScrollCount + 1,
            },
            () => {
                this._validateForm();
            },
        );
    }

    _validateForm = () => {
        let { pickerScrollCount, } = this.state;
        if(pickerScrollCount > 0) {
            let duration = this._getDateTimeDurationFromState().duration;
            let event_date = `${this._getDateTimeDurationFromState().event_date.toISOString(true).split('.')[0]}Z`;
            this.setState(
                {
                    isFormValid: true,
                },
                () => {
                    this.props.handleFormChange('event_date', event_date);
                    this.props.handleFormChange('duration', duration);
                },
            );
        }
    }

    _getDateTimeDurationFromState = () => {
        let { durationValueGroups, timeValueGroups, } = this.state;
        let now = moment();
        now = now.set('second', 0);
        now = now.set('millisecond', 0);
        let hoursIn24 = timeValueGroups.amPM === 0 ? (timeValueGroups.hours + 1) : ((timeValueGroups.hours + 1) + 12);
        hoursIn24 = hoursIn24 === 12 ? 0 : hoursIn24;
        hoursIn24 = hoursIn24 === 24 ? 12 : hoursIn24;
        now = now.set('hour', hoursIn24);
        now = now.set('minute', Number(MyPlanConstants.timeOptionGroups.minutes[timeValueGroups.minutes]));
        let duration = Number(MyPlanConstants.durationOptionGroups.minutes[durationValueGroups.minutes]);
        return {
            duration,
            event_date: now
        };
    }

    render = () => {
        const { handleFormChange, postSession, scrollTo, typicalSessions, } = this.props;
        const { isFormValid, step, timeValueGroups, } = this.state;
        let filteredTeamSports = _.filter(MyPlanConstants.teamSports, o => o.order && o.order > 0);
        let teamSports = _.orderBy(filteredTeamSports, ['order'], ['asc']);
        let filteredStrengthConditioningTypes = _.filter(MyPlanConstants.strengthConditioningTypes, o => o.order && o.order > 0);
        let strengthConditioningTypes = _.orderBy(filteredStrengthConditioningTypes, ['order'], ['asc']);
        let filteredSessionTypes = _.filter(MyPlanConstants.availableSessionTypes, o => o.order && o.order > 0);
        let sessionTypes = _.orderBy(filteredSessionTypes, ['order'], ['asc']);
        let filteredSport = postSession.sport_name || postSession.sport_name === 0 ? _.filter(teamSports, ['index', postSession.sport_name]) : postSession.strength_and_conditioning_type || postSession.strength_and_conditioning_type === 0 ? _.filter(strengthConditioningTypes, ['index', postSession.strength_and_conditioning_type]) : null;
        let selectedSport = filteredSport && filteredSport.length > 0 ? filteredSport[0].label.toLowerCase().replace(' training', '') : '';
        let filteredSessionType = postSession.session_type || postSession.session_type === 0 ? _.filter(sessionTypes, ['index', postSession.session_type]) : null;
        let selectedSessionType = filteredSessionType && filteredSessionType.length > 0 ? filteredSessionType[0].label.toLowerCase() : postSession.session_type === 1 ? 'training' : '';
        let selectedStartTime = isFormValid ? this._getDateTimeDurationFromState().event_date : '';
        let selectedDuration = isFormValid ? this._getDateTimeDurationFromState().duration : '';
        let sportText = step === 0 || step === 1 ? 'activity' : step === 2 ? `${selectedSport}...` : `${selectedSport} ${selectedSessionType}`;
        let startTimeText = (step === 3 || step === 4) && !isFormValid ? 'time' : (step === 3 || step === 4) && isFormValid ? `${selectedStartTime.format('h:mm')}` : '';
        let durationText = step === 3 && !isFormValid ? 'duration' : `${selectedDuration}`;
        return (
            <View style={{flex: 1,}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1,}}>
                        { (this.props.typicalSessions.length > 0 && step >= 1) || step > 1 ?
                            <TabIcon
                                containerStyle={[{alignSelf: 'flex-end'},]}
                                icon={'chevron-left'}
                                iconStyle={[{color: AppColors.black}]}
                                onPress={this._resetStep}
                                reverse={false}
                                size={32}
                                type={'material-community'}
                            />
                            :
                            null
                        }
                    </View>
                    <View style={{flex: 9,}}>
                        <Text robotoLight style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32), textAlign: 'center'}}>
                            {`Today I ${step > 2 ? 'had' : 'did'}`}
                        </Text>
                        <Text style={{flexWrap: 'wrap', fontSize: AppFonts.scaleFont(32), lineHeight: AppFonts.scaleFont(32), textAlign: 'center',}}>
                            <Text
                                robotoBold
                                style={{
                                    color:              step >= 3 ? AppColors.zeplin.darkGrey : AppColors.primary.yellow.hundredPercent,
                                    textDecorationLine: step >= 3 ? 'none' : 'underline',
                                }}
                            >
                                {sportText}
                            </Text>
                            { step >= 3 ?
                                <Text robotoLight style={{color: AppColors.zeplin.darkGrey,}}>{' at'}</Text>
                                :
                                <Text style={{fontSize: AppFonts.scaleFont(32), lineHeight: AppFonts.scaleFont(32),}}>
                                    <Text robotoLight style={{color: AppColors.zeplin.darkGrey,}}>{' at '}</Text>
                                    <Text robotoMedium style={{color: 'rgba(117, 117, 117, 0.5)',}}>{'time'}</Text>
                                    <Text robotoLight style={{color: AppColors.zeplin.darkGrey,}}>{' for '}</Text>
                                    <Text robotoMedium style={{color: 'rgba(117, 117, 117, 0.5)',}}>{'duration'}</Text>
                                </Text>
                            }
                        </Text>
                        { step >= 3 ?
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                                <View style={{borderBottomColor: AppColors.primary.yellow.hundredPercent, borderBottomWidth: 2,}}>
                                    <Text robotoBold style={{color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(32), height: (AppFonts.scaleFont(32) + 5),}}>
                                        {startTimeText}
                                        <Text robotoBold style={{color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(14), textAlignVertical: 'bottom',}}>{(step === 3 || step === 4) && isFormValid ? `${timeValueGroups.amPM === 0 ? 'AM' : 'PM'}` : ''}</Text>
                                    </Text>
                                </View>
                                <Text robotoLight style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32), height: (AppFonts.scaleFont(32) + 5),}}>{' for '}</Text>
                                <View style={{borderBottomColor: AppColors.primary.yellow.hundredPercent, borderBottomWidth: 2,}}>
                                    <Text robotoBold style={{color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(32), height: (AppFonts.scaleFont(32) + 5),}}>
                                        {durationText}
                                        <Text robotoBold style={{color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(14), textAlignVertical: 'bottom',}}>{(step === 3 || step === 4) && isFormValid ? 'MIN' : ''}</Text>
                                    </Text>
                                </View>
                            </View>
                            :
                            null
                        }
                    </View>
                    <View style={{flex: 1}}></View>
                </View>
                <Spacer size={26} />
                <View>
                    { step === 0 ?
                        <View style={[AppStyles.containerCentered,]}>
                            <Text oswaldMedium style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(12),}}>{'MOST RECENT'}</Text>
                            <Spacer size={7} />
                            <View style={[AppStyles.containerCentered,]}>
                                { _.map(typicalSessions, (session, i) => {
                                    let sportName = session.sport_name || session.sport_name === 0 ?
                                        _.filter(MyPlanConstants.teamSports, ['index', session.sport_name])[0].label.toUpperCase()
                                        : session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0 ?
                                            _.filter(MyPlanConstants.strengthConditioningTypes, ['index', session.strength_and_conditioning_type])[0].label.toUpperCase().replace(' TRAINING', '')
                                            :
                                            '';
                                    let sessionType = session.session_type === 1 ?
                                        'TRAINING'
                                        :
                                        _.filter(MyPlanConstants.availableSessionTypes, ['index', session.session_type])[0].label.toUpperCase();
                                    let displayName = `${sportName} ${sessionType}`;
                                    return(
                                        <Button
                                            backgroundColor={AppColors.white}
                                            buttonStyle={[styles.pill, {width: AppSizes.screen.widthThreeQuarters,}]}
                                            fontFamily={AppStyles.oswaldRegular.fontFamily}
                                            fontWeight={AppStyles.oswaldRegular.fontWeight}
                                            key={i}
                                            onPress={() => {
                                                this._nextStep(3);
                                                handleFormChange('sport_name', session.sport_name);
                                                handleFormChange('session_type', session.session_type);
                                                handleFormChange('strength_and_conditioning_type', session.strength_and_conditioning_type);
                                                handleFormChange('event_date', session.event_date);
                                                handleFormChange('duration', session.duration);
                                            }}
                                            outlined
                                            raised={false}
                                            textStyle={{ color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14) }}
                                            title={displayName}
                                        />
                                    )
                                })}
                            </View>
                            <Spacer size={12} />
                            <View style={[AppStyles.containerCentered,]}>
                                <Button
                                    backgroundColor={AppColors.white}
                                    buttonStyle={[styles.pill, {width: AppSizes.screen.widthThreeQuarters,}]}
                                    fontFamily={AppStyles.oswaldRegular.fontFamily}
                                    fontWeight={AppStyles.oswaldRegular.fontWeight}
                                    leftIcon={{
                                        color: AppColors.zeplin.darkBlue,
                                        name:  'add',
                                        size:  AppFonts.scaleFont(14),
                                    }}
                                    onPress={() => this._nextStep(1)}
                                    outlined
                                    raised={false}
                                    textStyle={{ color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14) }}
                                    title={'MORE OPTIONS'}
                                />
                            </View>
                        </View>
                        : step === 1 ?
                            <View style={[AppStyles.containerCentered,]}>
                                <Text oswaldMedium style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(12),}}>{'TEAM SPORTS'}</Text>
                                <Spacer size={7} />
                                <View style={[AppStyles.containerCentered, {flexDirection: 'row', flexWrap: 'wrap',}]}>
                                    { _.map(teamSports, sport =>
                                        <Button
                                            backgroundColor={AppColors.white}
                                            buttonStyle={[styles.pill,]}
                                            fontFamily={AppStyles.oswaldRegular.fontFamily}
                                            fontWeight={AppStyles.oswaldRegular.fontWeight}
                                            key={sport.index}
                                            onPress={() => {
                                                this._nextStep(2);
                                                handleFormChange('sport_name', sport.index);
                                            }}
                                            outlined
                                            raised={false}
                                            textStyle={{ color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14) }}
                                            title={sport.label.toUpperCase()}
                                        />
                                    )}
                                </View>
                                <Spacer size={12} />
                                <Text oswaldMedium style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(12),}}>{'FITNESS TRAINING'}</Text>
                                <Spacer size={7} />
                                <View style={[AppStyles.containerCentered, {flexDirection: 'row', flexWrap: 'wrap',}]}>
                                    { _.map(strengthConditioningTypes, (strengthConditioningType, i) =>
                                        <Button
                                            backgroundColor={AppColors.white}
                                            buttonStyle={[styles.pill,]}
                                            fontFamily={AppStyles.oswaldRegular.fontFamily}
                                            fontWeight={AppStyles.oswaldRegular.fontWeight}
                                            key={strengthConditioningType.index}
                                            onPress={() => {
                                                this._nextStep(3);
                                                handleFormChange('strength_and_conditioning_type', strengthConditioningType.index);
                                                handleFormChange('session_type', 1);
                                            }}
                                            outlined
                                            raised={false}
                                            textStyle={{ color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14) }}
                                            title={strengthConditioningType.label.toUpperCase()}
                                        />
                                    )}
                                </View>
                            </View>
                            : step === 2 ?
                                <View style={[AppStyles.containerCentered,]}>
                                    <Text oswaldMedium style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(12),}}>{`${selectedSport.toUpperCase()} SESSION TYPE`}</Text>
                                    <Spacer size={7} />
                                    <View style={[AppStyles.containerCentered, {flexDirection: 'row', flexWrap: 'wrap',}]}>
                                        { _.map(sessionTypes, (session, i) =>
                                            <Button
                                                backgroundColor={AppColors.white}
                                                buttonStyle={[styles.pill, {width: (AppSizes.screen.width * 0.75)}]}
                                                fontFamily={AppStyles.oswaldRegular.fontFamily}
                                                fontWeight={AppStyles.oswaldRegular.fontWeight}
                                                key={i}
                                                onPress={() => {
                                                    this._nextStep(3);
                                                    handleFormChange('session_type', session.index);
                                                }}
                                                outlined
                                                raised={false}
                                                textStyle={{ color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14) }}
                                                title={session.label.toUpperCase()}
                                            />
                                        )}
                                    </View>
                                </View>
                                : step === 3 ?
                                    <View>
                                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <View style={{flex: 5,}}>
                                                <Text oswaldMedium style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>{'START TIME'}</Text>
                                                <Spacer size={10} />
                                                <View style={{flexDirection: 'row',}}>
                                                    <WheelScrollPicker
                                                        activeItemColor={AppColors.zeplin.darkGrey}
                                                        activeItemHighlight={'#EBBA2D4D'}
                                                        dataSource={MyPlanConstants.timeOptionGroups.hours}
                                                        highlightBorderWidth={2}
                                                        highlightColor={AppColors.primary.yellow.hundredPercent}
                                                        itemColor={AppColors.primary.grey.fiftyPercent}
                                                        itemHeight={AppFonts.scaleFont(18) + 10}
                                                        selectedIndex={this.state.timeValueGroups.hours}
                                                        onValueChange={(data, selectedIndex) => {
                                                            this._handleScrollFormChange('timeValueGroups', 'hours', data, selectedIndex);
                                                        }}
                                                        wrapperBackground={AppColors.transparent}
                                                        wrapperHeight={180}
                                                        wrapperWidth={(AppSizes.screen.width / 8)}
                                                    />
                                                    <WheelScrollPicker
                                                        activeItemColor={AppColors.zeplin.darkGrey}
                                                        activeItemHighlight={'#EBBA2D4D'}
                                                        dataSource={MyPlanConstants.timeOptionGroups.minutes}
                                                        highlightBorderWidth={2}
                                                        highlightColor={AppColors.primary.yellow.hundredPercent}
                                                        itemColor={AppColors.primary.grey.fiftyPercent}
                                                        itemHeight={AppFonts.scaleFont(18) + 10}
                                                        selectedIndex={this.state.timeValueGroups.minutes}
                                                        onValueChange={(data, selectedIndex) => {
                                                            this._handleScrollFormChange('timeValueGroups', 'minutes', data, selectedIndex);
                                                        }}
                                                        wrapperBackground={AppColors.transparent}
                                                        wrapperHeight={180}
                                                        wrapperWidth={(AppSizes.screen.width / 8)}
                                                    />
                                                    <WheelScrollPicker
                                                        activeItemColor={AppColors.zeplin.darkGrey}
                                                        activeItemHighlight={'#EBBA2D4D'}
                                                        dataSource={MyPlanConstants.timeOptionGroups.amPM}
                                                        highlightBorderWidth={2}
                                                        highlightColor={AppColors.primary.yellow.hundredPercent}
                                                        itemColor={AppColors.primary.grey.fiftyPercent}
                                                        itemHeight={AppFonts.scaleFont(18) + 10}
                                                        selectedIndex={this.state.timeValueGroups.amPM}
                                                        onValueChange={(data, selectedIndex) => {
                                                            this._handleScrollFormChange('timeValueGroups', 'amPM', data, selectedIndex);
                                                        }}
                                                        wrapperBackground={AppColors.transparent}
                                                        wrapperHeight={180}
                                                        wrapperWidth={(AppSizes.screen.width / 8)}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{flex: 5,}}>
                                                <Text oswaldMedium style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>{'DURATION'}</Text>
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
                                                        wrapperWidth={(AppSizes.screen.width / 8)}
                                                    />
                                                    <WheelScrollPicker
                                                        activeItemColor={AppColors.zeplin.darkGrey}
                                                        activeItemHighlight={'#EBBA2D4D'}
                                                        dataSource={MyPlanConstants.durationOptionGroups.minutes}
                                                        highlightBorderWidth={2}
                                                        highlightColor={AppColors.primary.yellow.hundredPercent}
                                                        itemColor={AppColors.primary.grey.fiftyPercent}
                                                        itemHeight={AppFonts.scaleFont(18) + 10}
                                                        selectedIndex={this.state.durationValueGroups.minutes}
                                                        onValueChange={(data, selectedIndex) => {
                                                            this._handleScrollFormChange('durationValueGroups', 'minutes', data, selectedIndex);
                                                        }}
                                                        wrapperBackground={AppColors.transparent}
                                                        wrapperHeight={180}
                                                        wrapperWidth={(AppSizes.screen.width / 8)}
                                                    />
                                                    <WheelScrollPicker
                                                        activeItemColor={AppColors.zeplin.darkGrey}
                                                        activeItemHighlight={'#EBBA2D4D'}
                                                        dataSource={MyPlanConstants.durationOptionGroups.label}
                                                        highlightBorderWidth={2}
                                                        highlightColor={AppColors.primary.yellow.hundredPercent}
                                                        itemColor={AppColors.primary.grey.fiftyPercent}
                                                        itemHeight={AppFonts.scaleFont(18) + 10}
                                                        scrollEnabled={false}
                                                        selectedIndex={this.state.durationValueGroups.label}
                                                        onValueChange={(data, selectedIndex) => {
                                                            this._handleScrollFormChange('durationValueGroups', 'label', data, selectedIndex);
                                                        }}
                                                        wrapperBackground={AppColors.transparent}
                                                        wrapperHeight={180}
                                                        wrapperWidth={(AppSizes.screen.width / 8)}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        <Spacer size={30} />
                                        <Button
                                            backgroundColor={this.state.isFormValid ? AppColors.primary.yellow.hundredPercent : AppColors.white}
                                            buttonStyle={{
                                                borderColor:  this.state.isFormValid ? AppColors.white : AppColors.zeplin.lightGrey,
                                                borderRadius: 10,
                                                borderWidth:  1,
                                                width:        AppSizes.screen.widthThird,
                                            }}
                                            color={this.state.isFormValid ? AppColors.white : AppColors.zeplin.lightGrey}
                                            containerViewStyle={{alignItems: 'center', justifyContent: 'center',}}
                                            fontFamily={AppStyles.robotoBold.fontFamily}
                                            fontWeight={AppStyles.robotoBold.fontWeight}
                                            onPress={() => this.state.isFormValid ? scrollTo() : null}
                                            outlined
                                            raised={false}
                                            textStyle={{ fontSize: AppFonts.scaleFont(14) }}
                                            title={'Next'}
                                        />
                                    </View>
                                    :
                                    null
                    }
                </View>
            </View>
        )
    }
}

SportScheduleBuilder.propTypes = {
    handleFormChange: PropTypes.func.isRequired,
    postSession:      PropTypes.object.isRequired,
    scrollTo:         PropTypes.func.isRequired,
    typicalSessions:  PropTypes.array.isRequired,
};
SportScheduleBuilder.defaultProps = {};
SportScheduleBuilder.componentName = 'SportScheduleBuilder';

/* Export Component ================================================================== */
export default SportScheduleBuilder;