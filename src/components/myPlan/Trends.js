/**
 * Trends
 *
    <Trends
        plan={plan}
        updateUser={updateUser}
        user={user}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { AppState, Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, } from '../../constants';
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { BiomechanicsCharts, InsightsCharts, } from './graphs';
import { AppUtil, PlanLogic, SensorLogic, } from '../../lib';
import { AnimatedCircularProgress, Button, FathomModal, ParsedText, TabIcon, Text, } from '../custom';
import { ContactUsModal, } from '../general';
import { store } from '../../store';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';
import SlidingUpPanel from 'rn-sliding-up-panel';

const extraInnerRadiusToRemove = Platform.OS === 'ios' ? 0 : 20;
const pieWrapperWidth = (AppSizes.screen.widthQuarter);

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: AppColors.white,
        borderRadius:    12,
        elevation:       2,
        marginBottom:    AppSizes.padding,
        paddingVertical: AppSizes.padding,
    },
    cardTitle: {
        color:             AppColors.zeplin.slateLight,
        fontSize:          AppFonts.scaleFont(16),
        paddingHorizontal: AppSizes.padding,
    },
    datesWrapper: (isDateActive, sessionIndex, dateObjLength) => ({
        marginLeft:        AppSizes.paddingLrg,
        paddingHorizontal: AppSizes.paddingSml,
        paddingVertical:   AppSizes.paddingXSml,
    }),
    lockedCardText: {
        color:             AppColors.white,
        fontSize:          AppFonts.scaleFont(15),
        paddingHorizontal: AppSizes.padding,
        textAlign:         'center',
    },
    lockedCardWrapper: {
        backgroundColor: `${AppColors.zeplin.slateLight}B3`,
        borderRadius:    12,
        bottom:          0,
        flex:            1,
        left:            0,
        paddingVertical: AppSizes.padding,
        position:        'absolute',
        right:           0,
        top:             0,
        width:           '100%',
        zIndex:          100,
    },
    modalTouchable: {
        backgroundColor:   AppColors.white,
        elevation:         4,
        paddingHorizontal: AppSizes.paddingLrg,
        paddingVertical:   AppSizes.paddingLrg,
        shadowColor:       'rgba(0, 0, 0, 0.16)',
        shadowOffset:      { height: 3, width: 0, },
        shadowOpacity:     1,
        shadowRadius:      20,
    },
    pillsWrapper: (color, isLast) => ({
        backgroundColor:   `${PlanLogic.returnInsightColorString(color)}${PlanLogic.returnHexOpacity(0.15)}`,
        borderRadius:      100,
        marginRight:       isLast ? 0 :AppSizes.paddingXSml,
        marginTop:         AppSizes.paddingSml,
        paddingHorizontal: AppSizes.paddingSml,
        paddingVertical:   AppSizes.paddingXSml,
    }),
    sessionDataLineWrapper: (isFirst, isLast, isLockedState) => ({
        borderTopColor:    AppColors.zeplin.superLight,
        borderTopWidth:    2,
        marginTop:         !isLockedState && isFirst ? AppSizes.padding : 0,
        paddingBottom:     isLast ? 0 : AppSizes.paddingXSml,
        paddingHorizontal: AppSizes.padding,
        paddingTop:        AppSizes.paddingXSml,
    }),
});

/* Component ==================================================================== */
const BiomechanicsSummary = ({
    extraWrapperStyles = {},
    isLockedState,
    plan,
    session,
    toggleSlideUpPanel = () => {},
    userHas3SensorSystem,
}) => {
    const dataToDisplay = session.data_points;
    return (
        <View
            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect, {paddingBottom: AppSizes.paddingXSml, paddingTop: AppSizes.paddingLrg,}, extraWrapperStyles,]}
        >

            {isLockedState &&
                <View style={[styles.lockedCardWrapper, {paddingVertical: 0,}]}>
                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                        <TabIcon
                            color={AppColors.white}
                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                            icon={'lock'}
                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                            size={40}
                        />
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), marginVertical: AppSizes.padding, textAlign: 'center',}}>
                            {'Wear Fathom PRO in your workout to unlock your session analysis.'}
                        </Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthTwoThirds,}}
                            containerStyle={{alignItems: 'center', alignSelf: 'center', justifyContent: 'center', width: AppSizes.screen.widthTwoThirds,}}
                            onPress={userHas3SensorSystem ?
                                () => AppUtil.pushToScene('myPlan')
                                :
                                () => AppUtil.pushToScene('bluetoothConnect')
                            }
                            title={userHas3SensorSystem ? 'Start a PRO Session' : 'Re-Connect Fathom PRO'}
                            titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                        />
                    </View>
                </View>
            }

            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: isLockedState ? 0 : AppSizes.paddingSml, paddingHorizontal: AppSizes.padding,}}>
                <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(24),}}>
                    {_.find(MyPlanConstants.teamSports, o => o.index === session.sport_name) ? _.find(MyPlanConstants.teamSports, o => o.index === session.sport_name).label : ''}
                </Text>
                {!isLockedState &&
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11),}}>
                        {`${moment(session.event_date_time.replace('Z', '')).format('hh:mma')}, ${SensorLogic.convertMinutesToHrsMins(session.duration, true)}`}
                    </Text>
                }
            </View>

            {isLockedState &&
                <View style={{paddingBottom: AppSizes.paddingSml, paddingHorizontal: AppSizes.padding,}}>
                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>
                        {'No data to create score'}
                    </Text>
                </View>
            }

            { session.score.active &&
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: AppSizes.padding,}}>
                    <AnimatedCircularProgress
                        arcSweepAngle={320}
                        backgroundColor={AppColors.zeplin.superLight}
                        childrenContainerStyle={{marginLeft: 5, marginTop: AppSizes.paddingXSml,}}
                        fill={session.score.value}
                        lineCap={'round'}
                        rotation={200}
                        size={AppSizes.screen.widthQuarter}
                        style={{marginRight: AppSizes.paddingSml, paddingHorizontal: AppSizes.paddingXSml, paddingVertical: AppSizes.paddingXSml,}}
                        tintColor={PlanLogic.returnInsightColorString(session.score.color)}
                        width={AppSizes.paddingSml}
                    >
                        {
                            (fill) => (
                                <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(session.score.color), fontSize: AppFonts.scaleFont(30),}}>
                                    {session.score.value}
                                </Text>
                            )
                        }
                    </AnimatedCircularProgress>
                    <View style={[{alignSelf: 'flex-end', flex: 1, flexDirection: 'row', justifyContent: 'space-between'}, Platform.OS === 'ios' ? {} : {marginRight: AppSizes.padding,}]}>
                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(20),}}>
                            {session.score.text}
                        </Text>
                        {session.score.text.length > 0 &&
                            <TabIcon
                                color={AppColors.zeplin.slateXLight}
                                containerStyle={[{justifyContent: 'flex-end',}]}
                                icon={'help-circle-outline'}
                                onPress={toggleSlideUpPanel}
                                size={20}
                                type={'material-community'}
                            />
                        }
                    </View>
                </View>
            }

            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', paddingTop: isLockedState ? 0 : AppSizes.paddingSml, paddingHorizontal: AppSizes.padding,}}>
                { _.map(session.summary_pills, (pill, i) =>
                    <View key={i} style={[styles.pillsWrapper(pill.color, (i + 1) === session.summary_pills.length),]}>
                        <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(pill.color), fontSize: AppFonts.scaleFont(12),}}>
                            {pill.text}
                        </Text>
                    </View>
                )}
            </View>

            { _.map(dataToDisplay, (data, i) => {
                const sessionData = session[data.index];
                let platformRadiusAddOn = Platform.OS === 'ios' ? 0 : AppSizes.padding;
                let pieInnerRadius = ((AppSizes.padding * 2) + AppSizes.paddingSml);
                pieInnerRadius = data.data_type === 3 ? (AppSizes.paddingSml) : pieInnerRadius;
                const pieDetails = {
                    pieData:        sessionData.summary_data,
                    pieHeight:      pieWrapperWidth,
                    pieInnerRadius: data.data_type === 3 ? ((pieInnerRadius - extraInnerRadiusToRemove) + platformRadiusAddOn) : (AppSizes.paddingSml + (pieWrapperWidth * 0.35)),
                    piePadding:     data.data_type === 3 ? AppSizes.paddingXSml : AppSizes.paddingSml,
                    pieWidth:       pieWrapperWidth,
                };
                if(sessionData.active && (data.data_type || data.data_type === 0)) {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.2}
                            key={i}
                            onPress={() => AppUtil.pushToScene('biomechanics', {dataType: data.data_type, index: data.index, session: session,})}
                            style={[styles.sessionDataLineWrapper(i === 0, (i + 1) === dataToDisplay.length, isLockedState),]}
                        >
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',}}>
                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                    <View style={{marginRight: AppSizes.paddingMed,}}>
                                        <BiomechanicsCharts
                                            dataType={data.data_type}
                                            pieDetails={pieDetails}
                                            selectedSession={sessionData}
                                            showRightSideDetails={false}
                                            showDetails={false}
                                        />
                                    </View>
                                    <View>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14),}}>
                                            {sessionData.dashboard_title}
                                        </Text>
                                        <View style={{alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-start',}}>
                                            { sessionData.score.active &&
                                                <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(sessionData.score.color), fontSize: AppFonts.scaleFont(25),}}>
                                                    {sessionData.score.value}
                                                    <Text robotoRegular style={{color: AppColors.zeplin.slateXLight, fontSize: AppFonts.scaleFont(12),}}>
                                                        {' /100'}
                                                    </Text>
                                                </Text>
                                            }
                                            { sessionData.change.active &&
                                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginLeft: AppSizes.paddingSml,}}>
                                                    <TabIcon
                                                        color={PlanLogic.returnInsightColorString(sessionData.change.color)}
                                                        containerStyle={[{marginRight: AppSizes.paddingXSml,}]}
                                                        icon={Platform.OS === 'ios' ?
                                                            sessionData.change.value >= 0 ? 'caretup' : 'caretdown'
                                                            :
                                                            sessionData.change.value >= 0 ? 'caret-up' : 'caret-down'
                                                        }
                                                        size={15}
                                                        type={Platform.OS === 'ios' ? 'antdesign' : 'font-awesome'}
                                                    />
                                                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>
                                                        {`${sessionData.change.value || sessionData.change.value === 0 ? Math.abs(sessionData.change.value) : '--'} ${sessionData.change.text}`}
                                                    </Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </View>
                                { (sessionData.active && !isLockedState) &&
                                    <TabIcon
                                        color={`${AppColors.zeplin.slateLight}${PlanLogic.returnHexOpacity(0.8)}`}
                                        containerStyle={[{alignItems: 'flex-end', justifyContent: 'center',}]}
                                        icon={'arrow-right'}
                                        size={20}
                                        type={'simple-line-icon'}
                                    />
                                }
                            </View>
                        </TouchableOpacity>
                    );
                }
                return (null);
            })}

        </View>
    );
}

class Trends extends PureComponent {

    constructor(props) {
        super(props);
        const {
            datesAsArray,
            paginagedDates,
        } = this._handleComponentMount();
        this.state = {
            counter:                 0,
            dates:                   datesAsArray,
            datesPage:               _.findLastIndex(paginagedDates),
            isCoachModalOpen:        false,
            isContactUsOpen:         false,
            isMounted:               true,
            isSlideUpPanelModalOpen: false,
            sessionDateIndex:        _.findLastIndex(datesAsArray),
            selectedTimeIndex:       0,
            visualDates:             paginagedDates,
        };
        this._carousel = {};
        this._panel = {};
        this._scrollViewRef = {};
        this._smoothPickerRef = {};
        this._timer = null;
    }

    componentDidMount = () => {
        const { user, } = this.props;
        AppState.addEventListener('change', this._handleAppStateChange);
        if(!user.first_time_experience.includes('trends_coach')) {
            this._timer = _.delay(() => this.setState({ isCoachModalOpen: true, }), 1000);
        }
        this._timer = _.delay(() => {
            if(this._smoothPickerRef && this._smoothPickerRef.refs && this._smoothPickerRef.refs.smoothPicker) {
                let newIndex = this.state.sessionDateIndex === 0 || this.state.sessionDateIndex < 0 ? this.state.sessionDateIndex : (this.state.sessionDateIndex - 1);
                this._smoothPickerRef.refs.smoothPicker.scrollToIndex({
                    animated:   true,
                    index:      newIndex,
                    viewOffset: -AppSizes.paddingMed,
                });
            }
        }, 500);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(prevProps.currentSelectedTab !== this.props.currentSelectedTab) {
            this._checkAppState(this.props.currentSelectedTab === 'trends' ? 'active' : 'background');
        }
    }

    componentWillUnmount = () => {
        this._checkAppState('background');
    }

    _checkAppState = nextAppState => {
        const {
            datesAsArray,
            paginagedDates,
        } = this._handleComponentMount();
        this.setState(
            {
                counter:                 (this.state.counter + 1),
                dates:                   datesAsArray,
                datesPage:               _.findLastIndex(paginagedDates),
                isCoachModalOpen:        false,
                isContactUsOpen:         false,
                isMounted:               nextAppState === 'active',
                isSlideUpPanelModalOpen: false,
                sessionDateIndex:        _.findLastIndex(datesAsArray),
                selectedTimeIndex:       0,
                visualDates:             paginagedDates,
            },
            () => {
                if(nextAppState === 'background') {
                    // clear timers
                    clearInterval(this._timer);
                } else if(nextAppState === 'active') {
                    this._timer = null;
                }
            },
        );
    }

    _handleAppStateChange = nextAppState => {
        this._checkAppState(nextAppState);
    }

    _handleComponentMount = () => {
        const dailyPlanObj = this.props.plan.dailyPlan[0] || false;
        let trends = dailyPlanObj ? dailyPlanObj.trends : false;
        let biomechanicsSummary = trends && trends.biomechanics_summary ? trends.biomechanics_summary : { active: false, };
        let dates = {};
        if(biomechanicsSummary && biomechanicsSummary.sessions && biomechanicsSummary.sessions.length > 0) {
            let newSessionsObj = _.orderBy(_.cloneDeep(biomechanicsSummary.sessions), session => moment(session.event_date_time.replace('Z', '')), ['asc']);
            _.map(newSessionsObj, (session, key) => {
                const sessionDateMoment = moment(session.event_date_time.replace('Z', ''));
                let isToday = moment().isSame(sessionDateMoment, 'day');
                let sessionDate = isToday ? 'Today' : sessionDateMoment.format('MMM DD');
                let sessionTime = sessionDateMoment.format('hh:mma');
                dates[sessionDate] = dates[sessionDate] ? dates[sessionDate] : [];
                dates[sessionDate].push({
                    sessionId: session.id,
                    timeText:  sessionTime,
                });
            });
        }
        let datesAsArray = _.map(dates, (date, key,) => {
            let newObj = {};
            newObj.data = date;
            newObj.text = key;
            return newObj;
        });
        let paginagedDates = _.map(
            _.reverse(_.chunk(_.reverse(_.cloneDeep(datesAsArray)), 4)),
            item => _.reverse(item)
        );
        return {
            datesAsArray,
            paginagedDates,
        };
    }

    _handleUpdateFirstTimeExperience = (value, callback) => {
        const { updateUser, user, } = this.props;
        // setup variables
        let newUserPayloadObj = {};
        newUserPayloadObj.first_time_experience = [value];
        let newUserObj = _.cloneDeep(user);
        newUserObj.first_time_experience.push(value);
        // update reducer as API might take too long to return a value
        store.dispatch({
            type: DispatchActions.USER_REPLACE,
            data: newUserObj
        });
        // update user object
        updateUser(newUserPayloadObj, user.id)
            .then(res => {
                if(callback) {
                    callback();
                }
            });
    }

    _returnEmptyBiomechanicsSummaryData = (active, title) => {
        let object = {
            active,
            body_side:    0,
            change:       {active: false,},
            description:  {active: false,},
            score:        {active: false,},
            summary_data: {
                right_y:              0,
                right_y_legend:       0,
                right_y_legend_color: 26,
                right_start_angle:    0,
                left_y:               0,
                left_y_legend:        0,
                left_y_legend_color:  10,
                left_start_angle:     0,
            },
            summary_text: {active: false,},
        };
        if(title) {
            object.child_title = title;
            object.dashboard_title = title;
        }
        return object;
    }

    _toggleContactUsWebView = () => this.setState({ isContactUsOpen: !this.state.isContactUsOpen, })

    render = () => {
        const {
            dates,
            datesPage,
            isCoachModalOpen,
            isContactUsOpen,
            isMounted,
            isSlideUpPanelModalOpen,
            sessionDateIndex,
            selectedTimeIndex,
            visualDates,
        } = this.state;
        const { plan, user, } = this.props;
        let {
            biomechanicsSummary,
            bodyResponse,
            bodyResponseIcon,
            bodyResponseIconType,
            bodyResponseImageSource,
            bodyResponseSportName,
            bodyResponseSubtitleColor,
            currentBodyResponseAlertText,
            currentWorkloadAlertText,
            isBodyResponseLocked,
            isWorkloadLocked,
            parsedSummaryTextData,
            recoveryQuality,
            selectedBiomechanicsSession,
            times,
            userHas3SensorSystem,
            workload,
            workloadIcon,
            workloadIconType,
            workloadImageSource,
            workloadSportName,
            workloadSubtitleColor,
        } = PlanLogic.handleTrendsRenderLogic(plan, user, dates, sessionDateIndex, selectedTimeIndex);
        if(!isMounted) {
            return(<View style={{flex: 1,}} />);
        }
        return (
            <View style={{flex: 1,}}>

                <ScrollView
                    nestedScrollEnabled={true}
                    style={{backgroundColor: AppColors.white, flex: 1,}}
                >

                    <View style={{paddingHorizontal: AppSizes.paddingLrg, paddingBottom: AppSizes.paddingLrg, paddingTop: AppSizes.statusBarHeight > 0 ? AppSizes.statusBarHeight : AppSizes.paddingLrg,}}>
                        <View style={{flexDirection: 'row', height: AppSizes.navbarHeight, justifyContent: 'center',}}>
                            <View style={{flex: 1, justifyContent: 'center',}} />
                            <Image
                                source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                                style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
                            />
                            <View style={{flex: 1, justifyContent: 'center', paddingRight: AppSizes.paddingSml,}} />
                        </View>
                        { recoveryQuality.active &&
                            <View style={{flex: 1,}}>
                                { recoveryQuality.change.active &&
                                    <View>
                                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end',}}>
                                            <TabIcon
                                                color={PlanLogic.returnInsightColorString(recoveryQuality.change.color)}
                                                containerStyle={[{marginRight: AppSizes.paddingXSml,}]}
                                                icon={Platform.OS === 'ios' ?
                                                    recoveryQuality.change.value >= 0 ? 'caretup' : 'caretdown'
                                                    :
                                                    recoveryQuality.change.value >= 0 ? 'caret-up' : 'caret-down'
                                                }
                                                size={15}
                                                type={Platform.OS === 'ios' ? 'antdesign' : 'font-awesome'}
                                            />
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>
                                                {`${recoveryQuality.change.value || recoveryQuality.change.value === 0 ? Math.abs(recoveryQuality.change.value) : '--'} ${recoveryQuality.change.text}`}
                                            </Text>
                                        </View>
                                        { (recoveryQuality.change.value && recoveryQuality.change.value !== 0) &&
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10), textAlign: 'right',}}>
                                                {`${recoveryQuality.change.value && recoveryQuality.change.value > 0 ? 'more' : 'less'} than usual`}
                                            </Text>
                                        }
                                    </View>
                                }
                                { recoveryQuality.score.active &&
                                    <View>
                                        <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(recoveryQuality.score.color), fontSize: AppFonts.scaleFont(61), lineHeight: AppFonts.scaleFont(61),}}>
                                            {recoveryQuality.score.value || recoveryQuality.score.value === 0 ? recoveryQuality.score.value : '--'}
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateXLight, fontSize: AppFonts.scaleFont(20), lineHeight: AppFonts.scaleFont(61),}}>
                                                {'/100'}
                                            </Text>
                                        </Text>
                                        <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(recoveryQuality.score.color), fontSize: AppFonts.scaleFont(15), lineHeight: AppFonts.scaleFont(15),}}>
                                            {recoveryQuality.score.text}
                                        </Text>
                                    </View>
                                }
                                { recoveryQuality.summary_text.active &&
                                    <View style={{marginTop: AppSizes.paddingMed,}}>
                                        { (recoveryQuality.summary_text.text && recoveryQuality.summary_text.text.length > 0) &&
                                            <ParsedText
                                                parse={parsedSummaryTextData || []}
                                                style={{...AppStyles.robotoLight, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), lineHeight: AppFonts.scaleFont(18),}}
                                            >
                                                {recoveryQuality.summary_text.text}
                                            </ParsedText>
                                        }
                                        {_.map(recoveryQuality.summary_text.text_items, (text, i) => {
                                            let parsedTextItemsData = _.map(recoveryQuality.summary_text.text_items.bold_text, (prop, key) => {
                                                let newParsedData = {};
                                                newParsedData.pattern = new RegExp(prop.text, 'i');
                                                newParsedData.style = [AppStyles.robotoBold];
                                                return newParsedData;
                                            });
                                            return (
                                                <ParsedText
                                                    key={i}
                                                    parse={parsedTextItemsData || []}
                                                    style={{...AppStyles.robotoLight, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), lineHeight: AppFonts.scaleFont(18),}}
                                                >
                                                    {`\u2022 ${text.text}`}
                                                </ParsedText>
                                            );
                                        })}
                                    </View>
                                }
                            </View>
                        }
                    </View>

                    {((userHas3SensorSystem || biomechanicsSummary.has_three_sensor_data) && biomechanicsSummary.active) ?
                        <View>

                            <View
                                style={{
                                    alignItems:        'center',
                                    flex:              1,
                                    flexDirection:     'row',
                                    justifyContent:    visualDates.length === 0 ? 'center' : 'space-between',
                                    paddingHorizontal: AppSizes.paddingMed,
                                }}
                            >
                                <TabIcon
                                    color={datesPage === 0 ? AppColors.white : AppColors.zeplin.slateXLight}
                                    icon={'chevron-left'}
                                    onPress={visualDates.length > 1 && datesPage === 0 ? () => null : () => this.setState({ datesPage: (this.state.datesPage - 1), })}
                                    size={30}
                                />
                                <View
                                    style={{
                                        alignItems:     'center',
                                        flexDirection:  'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {_.map(visualDates[datesPage], (date, i) => {
                                        let isDateActive = dates[sessionDateIndex].text === date.text;
                                        let selectedIndex = _.findIndex(dates, ['text', date.text]);
                                        return(
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => this.setState({ sessionDateIndex: selectedIndex, selectedTimeIndex: 0, })}
                                                style={{
                                                    marginHorizontal:  AppSizes.paddingXSml,
                                                    paddingHorizontal: AppSizes.paddingSml,
                                                    paddingVertical:   AppSizes.paddingXSml,
                                                }}
                                            >
                                                <Text
                                                    robotoBold={isDateActive}
                                                    robotoRegular={!isDateActive}
                                                    style={{
                                                        color:    isDateActive ? AppColors.zeplin.slateLight : `${AppColors.zeplin.slateLight}${PlanLogic.returnHexOpacity(0.5)}`,
                                                        fontSize: AppFonts.scaleFont(isDateActive ? 19 : 14),
                                                    }}
                                                >
                                                    {date.text}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                                <TabIcon
                                    color={visualDates.length === (datesPage + 1) ? AppColors.white : AppColors.zeplin.slateXLight}
                                    icon={'chevron-right'}
                                    onPress={visualDates.length > 1 && visualDates.length === (datesPage + 1) ? () => null : () => this.setState({ datesPage: (this.state.datesPage + 1), })}
                                    size={30}
                                />
                            </View>

                            {(times.length > 1) &&
                                <View
                                    style={{
                                        alignItems:       'center',
                                        flex:             1,
                                        flexDirection:    'row',
                                        justifyContent:   times.length >= 3 ? 'space-between' : 'center',
                                        marginHorizontal: AppSizes.paddingLrg,
                                    }}
                                >
                                    {_.map(times, (time, i) =>
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => this.setState({ selectedTimeIndex: i, })}
                                            style={[times.length >= 3 ? {} : {marginHorizontal: AppSizes.paddingXLrg,}, {padding: AppSizes.paddingSml,}]}
                                        >
                                            <Text
                                                robotoBold={i === selectedTimeIndex}
                                                robotoRegular={i !== selectedTimeIndex}
                                                style={{
                                                    color:    i === selectedTimeIndex ? `${AppColors.zeplin.slate}${PlanLogic.returnHexOpacity(0.5)}` : AppColors.zeplin.slateLight,
                                                    fontSize: AppFonts.scaleFont(i === selectedTimeIndex ? 15 : 12),
                                                }}
                                            >
                                                {time.timeText}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            }

                            <View style={{paddingHorizontal: AppSizes.paddingMed, paddingTop: AppSizes.padding,}}>
                                { biomechanicsSummary.active &&
                                    _.map(selectedBiomechanicsSession, (session, i) =>
                                        <BiomechanicsSummary
                                            key={i}
                                            plan={plan}
                                            session={session}
                                            toggleSlideUpPanel={() => this.setState({ isSlideUpPanelModalOpen: true, })}
                                        />
                                    )
                                }
                            </View>

                        </View>
                        : ((biomechanicsSummary.has_three_sensor_data || !biomechanicsSummary.has_three_sensor_data) && !biomechanicsSummary.active) ?
                            <View style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect, {marginHorizontal: AppSizes.paddingMed, marginTop: AppSizes.padding, paddingVertical: 0,}]}>
                                <BiomechanicsSummary
                                    extraWrapperStyles={{marginBottom: 0, paddingBottom: 0,}}
                                    isLockedState={true}
                                    plan={plan}
                                    session={{
                                        ankle_pitch:     this._returnEmptyBiomechanicsSummaryData(true, 'Leg Extension'),
                                        apt:             this._returnEmptyBiomechanicsSummaryData(true, 'Pelvic Tilt'),
                                        data_points:     PlanLogic.returnTrendsTabs(),
                                        duration:        0,
                                        event_date_time: '',
                                        hip_drop:        this._returnEmptyBiomechanicsSummaryData(true, 'Hip Drop'),
                                        hip_rotation:    this._returnEmptyBiomechanicsSummaryData(false),
                                        id:              'empty',
                                        knee_valgus:     this._returnEmptyBiomechanicsSummaryData(false),
                                        score:           this._returnEmptyBiomechanicsSummaryData(false),
                                        sport_name:      17,
                                    }}
                                    userHas3SensorSystem={userHas3SensorSystem}
                                />
                            </View>
                            :
                            null
                    }

                    <View style={{paddingHorizontal: AppSizes.paddingMed,}}>

                        <TouchableOpacity
                            activeOpacity={isWorkloadLocked ? 1 : 0.2}
                            onPress={isWorkloadLocked ? () => {} : () => AppUtil.pushToScene('insight', { insightType: 8, })}
                            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                        >
                            { !isWorkloadLocked &&
                                <Text robotoRegular style={[styles.cardTitle,]}>{'Workouts'}</Text>
                            }
                            <InsightsCharts
                                currentAlert={workload}
                                data={workload.data}
                                showSelection={false}
                            />
                            { isWorkloadLocked &&
                                <View style={[styles.lockedCardWrapper,]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text robotoRegular style={[styles.cardTitle, {color: AppColors.white,}]}>{'Workouts'}</Text>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'No Workout data yet.\nKeep logging symptoms for insight into how your body responds to training.'}</Text>
                                    </View>
                                </View>
                            }
                            { currentWorkloadAlertText &&
                                <View style={{borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, marginHorizontal: AppSizes.paddingSml, marginTop: AppSizes.paddingSml,}}>
                                    <View style={{alignSelf: 'flex-start', alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.paddingMed,}}>
                                        { workloadIcon ?
                                            <TabIcon
                                                color={workloadSubtitleColor}
                                                containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                                icon={workloadIcon}
                                                size={20}
                                                type={workloadIconType}
                                            />
                                            : workloadSportName ?
                                                <Image
                                                    source={workloadImageSource}
                                                    style={{height: 20, marginRight: AppSizes.paddingSml, tintColor: workloadSubtitleColor, width: 20,}}
                                                />
                                                :
                                                null
                                        }
                                        {currentWorkloadAlertText}
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={isBodyResponseLocked ? 1 : 0.2}
                            onPress={isBodyResponseLocked ? () => {} : () => AppUtil.pushToScene('insight', { insightType: 7, })}
                            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                        >
                            { !isBodyResponseLocked &&
                                <Text robotoRegular style={[styles.cardTitle,]}>{'Pain & Soreness'}</Text>
                            }
                            <InsightsCharts
                                currentAlert={bodyResponse}
                                data={bodyResponse.data}
                                showSelection={false}
                            />
                            { isBodyResponseLocked &&
                                <View style={[styles.lockedCardWrapper,]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text robotoRegular style={[styles.cardTitle, {color: AppColors.white,}]}>{'Pain & Soreness'}</Text>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'No Pain & Soreness data yet.\nKeep logging symptoms for insight into how your body responds to training.'}</Text>
                                    </View>
                                </View>
                            }
                            { currentBodyResponseAlertText &&
                                <View style={{borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, marginTop: AppSizes.paddingSml,}}>
                                    <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingSml, paddingTop: AppSizes.paddingMed,}}>
                                        { bodyResponseIcon ?
                                            <TabIcon
                                                color={bodyResponseSubtitleColor}
                                                containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                                icon={bodyResponseIcon}
                                                size={20}
                                                type={bodyResponseIconType}
                                            />
                                            : bodyResponseSportName ?
                                                <Image
                                                    source={bodyResponseImageSource}
                                                    style={{height: 20, marginRight: AppSizes.paddingSml, tintColor: bodyResponseSubtitleColor, width: 20,}}
                                                />
                                                :
                                                null
                                        }
                                        {currentBodyResponseAlertText}
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>

                        {(!userHas3SensorSystem && !biomechanicsSummary.has_three_sensor_data) &&
                            <View style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}>
                                <View style={{alignItems: 'center', justifyContent: 'center',}}>
                                    <BiomechanicsCharts
                                        dataType={0}
                                        pieDetails={{
                                            pieData: {
                                                right_y:              0,
                                                right_y_legend:       0,
                                                right_y_legend_color: 26,
                                                right_start_angle:    0,
                                                left_y:               0,
                                                left_y_legend:        0,
                                                left_y_legend_color:  10,
                                                left_start_angle:     0,
                                            },
                                            pieHeight:      (pieWrapperWidth * 2),
                                            pieInnerRadius: (((AppSizes.padding * 2) + AppSizes.paddingSml) - extraInnerRadiusToRemove),
                                            piePadding:     AppSizes.paddingSml,
                                            pieWidth:       (pieWrapperWidth * 2),
                                        }}
                                        selectedSession={{ body_side: 0, }}
                                        showDetails={false}
                                    />
                                </View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this._toggleContactUsWebView()}
                                    style={[styles.lockedCardWrapper,]}
                                >
                                    <View style={{justifyContent: 'center',}}>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'The world\'s most advance biomechanics tracking system coming soon.'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }

                    </View>

                </ScrollView>

                <FathomModal
                    hasBackdrop={false}
                    isVisible={isCoachModalOpen}
                >
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end',}}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.setState({ isCoachModalOpen: false, } , () => this._handleUpdateFirstTimeExperience('trends_coach'))}
                            style={[styles.modalTouchable,]}
                        >
                            <Text robotoMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), marginBottom: AppSizes.paddingSml,}}>
                                {'Welcome to your Trends'}
                            </Text>
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginBottom: AppSizes.padding,}}>
                                {'Here, you\'ll find your data & any meaningful trends & insights that our AI system finds!'}
                            </Text>
                            <Text robotoMedium style={{alignSelf: 'flex-end', color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(22),}}>
                                {'GOT IT'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </FathomModal>

                <ContactUsModal
                    handleModalToggle={this._toggleContactUsWebView}
                    isModalOpen={isContactUsOpen}
                />

                <FathomModal
                    hasBackdrop={true}
                    isVisible={isSlideUpPanelModalOpen}
                    onModalShow={() => this._panel.show()}
                >
                    <SlidingUpPanel
                        allowDragging={false}
                        ref={ref => {this._panel = ref;}}
                        showBackdrop={false}
                    >
                        <View style={{flex: 1, flexDirection: 'column',}}>
                            <View style={{flex: 1,}} />
                            <View style={{backgroundColor: AppColors.white,}}>
                                <View style={{backgroundColor: AppColors.primary.white.hundredPercent, flexDirection: 'row', padding: AppSizes.padding,}}>
                                    <Text robotoMedium style={{color: AppColors.zeplin.slate, flex: 9, fontSize: AppFonts.scaleFont(22),}}>
                                        {selectedBiomechanicsSession[0] && selectedBiomechanicsSession[0].score && selectedBiomechanicsSession[0].score.text ?
                                            _.startCase(_.toLower(selectedBiomechanicsSession[0].score.text))
                                            :
                                            'Movement Efficiency Score'
                                        }
                                    </Text>
                                    <TabIcon
                                        containerStyle={[{flex: 1,}]}
                                        icon={'close'}
                                        iconStyle={[{color: AppColors.zeplin.slate,}]}
                                        onPress={() => this.setState({ isSlideUpPanelModalOpen: false, }, () => this._panel.hide())}
                                        reverse={false}
                                        size={30}
                                        type={'material-community'}
                                    />
                                </View>
                                <View style={{padding: AppSizes.paddingLrg,}}>
                                    {/*<Text robotoBold style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginBottom: AppSizes.padding,}}>
                                        {'What is my Movement Efficiency Score?'}
                                    </Text>*/}
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                                        {'Each session is analyzed by combining discrete measures of functional efficiency from your hip and lower extremity movement into a single assessment of how well you moved in your workout.\n\nFunctional efficiency is the ability of the neuromuscular system to recruit and activate optimal muscle synergies, at the right time, and with the appropriate amount of force to perform functional tasks. The goal is to perform a task with the least amount of energy expended and stress concentrated on the body. This helps prevent overtraining and the development of movement impairment syndromes and subsequently, preventable injury.'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </SlidingUpPanel>
                </FathomModal>

            </View>
        );
    }

}

Trends.propTypes = {
    currentSelectedTab: PropTypes.string.isRequired,
    plan:               PropTypes.object.isRequired,
    updateUser:         PropTypes.func.isRequired,
    user:               PropTypes.object.isRequired,
};

Trends.defaultProps = {};

Trends.componentName = 'Trends';

/* Export Component ================================================================== */
export default Trends;
