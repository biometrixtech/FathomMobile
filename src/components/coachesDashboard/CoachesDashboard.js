/**
 * CoachesDashboard View
 */
import React, { Component, } from 'react';
import {
    Animated,
    BackHandler,
    ImageBackground,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import { GoogleAnalyticsTracker, } from 'react-native-google-analytics-bridge';
import _ from 'lodash';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import moment from 'moment';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppSizes, AppStyles, AppFonts, ErrorMessages, MyPlan as MyPlanConstants, } from '../../constants/';
import { store } from '../../store';
import { AppUtil, PlanLogic, } from '../../lib';

// Components
import { AthleteComplianceModal, } from './pages';
import { Button, CoachesDashboardTabBar, FathomModal, FathomPicker, Spacer, TabIcon, Text, } from '../custom/';

// Tabs titles
const tabs = ['TODAY', 'THIS WEEK'];

// setup GA Tracker
const GATracker = new GoogleAnalyticsTracker('UA-127040201-1');

// constants
const circleSize = ((AppSizes.screen.width - ((AppSizes.paddingMed * 3) + (AppSizes.padding * 3))) / 3);
const iconCircleSize = 40;
const thisWeekPopupText = 'Here you\'ll find insights regarding soreness, pain, workload, and other trends which focus on mitigating injury risk and improving training readiness!\n\nInsights found here are derived from data spanning a 7 to 28 day timeframe.';
const thisWeekInsufficientDataText = 'Return here later for insights regarding trends spanning a 7 day to 28 day timeframe.\n\nEncourage athletes to complete their survey before & after every practice for most accurate insights and recommendations.';
const todayInsufficientDataText = 'For up to date status & recommendations athletes must submit pre & post-training surveys.\n\nTap the "Athlete Compliance" tab above to see which athletes still have to submit a survey.';
const todayPopupText = 'Here you\'ll find daily readiness status, injury risk mitigation suggestions & underlying training & soreness insights for each athlete.\n\nTap on any athlete name to see all of the athlete\'s suggestions. Flip the card to see the trends causing the suggestion.';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    athleteCardBottomWrapper: {
        alignItems:        'center',
        flex:              1,
        flexDirection:     'row',
        justifyContent:    'space-between',
        paddingBottom:     AppSizes.paddingXSml,
        paddingHorizontal: AppSizes.padding,
    },
    athleteCircle: {
        borderRadius:   (circleSize / 2),
        height:         circleSize,
        justifyContent: 'center',
        marginBottom:   AppSizes.paddingXSml,
        marginRight:    AppSizes.paddingSml,
        width:          circleSize,
    },
    athleteCircleText: {
        color:           AppColors.white,
        fontSize:        AppFonts.scaleFont(15),
        paddingVertical: AppSizes.paddingSml,
    },
    athleteComplianceBtn: {
        borderRadius:    5,
        flexDirection:   'row',
        paddingLeft:     AppSizes.paddingXSml,
        paddingVertical: AppSizes.paddingXSml,
    },
    iconCircle: {
        backgroundColor: AppColors.zeplin.iconCircle,
        borderRadius:    (iconCircleSize / 2),
        height:          iconCircleSize,
        width:           iconCircleSize,
    },
    overlayWrapper: {
        alignContent:      'center',
        height:            '100%',
        justifyContent:    'center',
        paddingHorizontal: AppSizes.padding,
        position:          'absolute',
        width:             '100%',
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius:  5,
    },
    sortByPickerSelectAndroid: {
        color: AppColors.zeplin.darkGrey,
    },
    sortByPickerSelectIOS: {
        ...AppFonts.oswaldMedium,
        color:    AppColors.zeplin.darkGrey,
        fontSize: AppFonts.scaleFont(15),
    },
    ul: {
        alignSelf:  'flex-start',
        color:      AppColors.zeplin.darkGrey,
        fontSize:   AppFonts.scaleFont(30),
        lineHeight: AppFonts.scaleFont(28),
    },
    ulText: {
        color:       AppColors.primary.grey.fiftyPercent,
        flex:        1,
        fontSize:    AppFonts.scaleFont(15),
        paddingLeft: AppSizes.paddingXSml,
    },
    ulWrapper: {
        flexDirection:     'row',
        paddingHorizontal: AppSizes.paddingLrg,
        paddingVertical:   AppSizes.paddingSml,
    },
});

/* Component ==================================================================== */
class CoachesDashboard extends Component {
    static componentName = 'CoachesDashboard';

    static propTypes = {
        coachesDashboardData:    PropTypes.array.isRequired,
        getCoachesDashboardData: PropTypes.func.isRequired,
        lastOpened:              PropTypes.object.isRequired,
        network:                 PropTypes.object.isRequired,
        scheduledMaintenance:    PropTypes.object,
        updateUser:              PropTypes.func.isRequired,
        user:                    PropTypes.object.isRequired,
    }

    static defaultProps = {
        scheduledMaintenance: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            hideTodayStartState:    false,
            hideThisWeekStartState: false,
            isAthleteCardModalOpen: false,
            isComplianceModalOpen:  false,
            isPageLoading:          false,
            page0:                  {},
            page1:                  {},
            selectedAthlete:        null,
            selectedAthletePage:    0,
            selectedTeamIndex:      0,
            todayFilter:            'view_all',
            thisWeekFilter:         'view_all',
        };
        this.renderTab = this.renderTab.bind(this);
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
    }

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    componentDidMount = () => {
        // scheduled maintenance
        if(!this.props.scheduledMaintenance.addressed) {
            let apiMaintenanceWindow = { end_date: this.props.scheduledMaintenance.end_date, start_date: this.props.scheduledMaintenance.start_date };
            let parseMaintenanceWindow = ErrorMessages.getScheduledMaintenanceMessage(apiMaintenanceWindow);
            AppUtil.handleScheduledMaintenanceAlert(parseMaintenanceWindow.displayAlert, parseMaintenanceWindow.header, parseMaintenanceWindow.message);
        }
        // fetch coaches dashboard data
        _.delay(() => {
            this._handleEnteringApp();
        }, 500);
        // set GA variables
        GATracker.setUser(this.props.user.id);
        GATracker.setAppVersion(AppUtil.getAppBuildNumber().toString());
        GATracker.setAppName(`Fathom-${store.getState().init.environment}`);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
    }

    _handleEnteringApp = () => {
        // fetch coaches dashboard data
        let userId = this.props.user.id;
        if(!this.state.isPageLoading) {
            this.setState({ isPageLoading: true, });
            this.props.getCoachesDashboardData(userId)
                .then(res => this.setState({ isPageLoading: false, }))
                .catch(err => {
                    this.setState({ isPageLoading: false, });
                    AppUtil.handleAPIErrorAlert(ErrorMessages.coachesDashboardData);
                });
        }
    }

    renderTab = (name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle, selectedTeam) => {
        const textStyle = AppStyles.tabHeaders;
        const fontSize = isTabActive ? AppFonts.scaleFont(22) : AppFonts.scaleFont(18);
        let { page0, page1, } = this.state;
        let currentPage = this.tabView ? this.tabView.state.currentPage : 0;
        let page0Width = AppSizes.screen.widthHalf;
        let page1Width = AppSizes.screen.widthHalf;
        let page0ExtraStyles = {borderBottomColor: currentPage === 0 ? AppColors.zeplin.darkBlue : AppColors.zeplin.light, borderBottomWidth: 3,};
        let page1ExtraStyles = {borderBottomColor: currentPage === 1 ? AppColors.zeplin.darkBlue : AppColors.zeplin.light, borderBottomWidth: 3,};
        let page0Styles = [AppStyles.leftTabBar, page0ExtraStyles, {width: page0Width,}];
        let page1Styles = [AppStyles.rightTabBar, page1ExtraStyles, {width: page1Width,}];
        // making sure we can only drag horizontally if our modals are closed and nothing is loading
        let isScrollLocked = !this.state.isPageLoading ? false : true;
        return(
            <TouchableWithoutFeedback
                key={`${name}_${page}`}
                accessible={true}
                accessibilityLabel={name}
                accessibilityTraits={'button'}
                onPress={() => isScrollLocked || !selectedTeam ? null : onPressHandler(page)}
                onLayout={onLayoutHandler}
            >
                <View style={[page === 0 ? page0Styles : page === 1 ? page1Styles : {}]}>
                    <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                        <View>
                            <Text
                                onLayout={event =>
                                    this.setState({
                                        page0: page === 0 ? event.nativeEvent.layout : page0,
                                        page1: page === 1 ? event.nativeEvent.layout : page1,
                                    })
                                }
                                style={[
                                    textStyle,
                                    {
                                        color: !selectedTeam ? AppColors.primary.grey.twentyPercent : isTabActive ? AppColors.zeplin.darkBlue : AppColors.zeplin.lightSlate,
                                        fontSize,
                                    }
                                ]}
                            >
                                {name}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _onChangeTab = tabLocation => {
        const currentScreenName = tabLocation.i === 0 ? 'TODAY' : tabLocation.i === 1 ? 'THIS WEEK' : '';
        const fromScreenName = tabLocation.from === 0 ? 'TODAY' : tabLocation.from === 1 ? 'THIS WEEK' : '';
        GATracker.trackScreenView(currentScreenName, { from: fromScreenName, });
    }

    _toggleComplianceModal = () => {
        this.setState({ isComplianceModalOpen: !this.state.isComplianceModalOpen, });
    }

    renderAthleteCardModal = () => {
        const { selectedAthlete, selectedAthletePage, } = this.state;
        // render empty information - athlete not selected
        if(!selectedAthlete) {
            return(null)
        }
        const { athleteName, mainColor, subHeader, } = PlanLogic.handleAthleteCardModalRenderLogic(selectedAthlete);
        // render information - athlete selected
        return(
            <View style={{flex: 1, flexDirection: 'row',}}>
                <View style={{backgroundColor: mainColor, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, width: 5,}} />
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <View style={{flex: 9,}}>
                        <TabIcon
                            containerStyle={[{alignSelf: 'flex-end',}]}
                            icon={'close'}
                            iconStyle={[{color: AppColors.black, paddingRight: AppSizes.paddingLrg, paddingTop: AppSizes.paddingLrg,}]}
                            onPress={() => this.setState({ isAthleteCardModalOpen: false, selectedAthlete: null, selectedAthletePage: 0, })}
                            reverse={false}
                            size={30}
                            type={'material-community'}
                        />
                        <Spacer size={10} />
                        <Text oswaldRegular style={{color: mainColor, fontSize: AppFonts.scaleFont(25), paddingHorizontal: AppSizes.paddingLrg,}}>
                            {athleteName}
                        </Text>
                        <Spacer size={5} />
                        <Text robotoRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(13), paddingHorizontal: AppSizes.paddingLrg,}}>
                            {subHeader}
                        </Text>
                        <Spacer size={15} />
                        { selectedAthletePage === 0 ?
                            <View style={{flex: 1,}}>
                                <View style={{flexDirection: 'row', paddingHorizontal: AppSizes.paddingLrg,}}>
                                    <TabIcon
                                        containerStyle={[AppStyles.containerCentered,]}
                                        icon={'checkbox-marked-circle'}
                                        iconStyle={[{color: mainColor}]}
                                        reverse={false}
                                        type={'material-community'}
                                    />
                                    <Text oswaldMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22), paddingLeft: AppSizes.paddingSml,}}>{'WE RECOMMEND...'}</Text>
                                </View>
                                <Spacer size={10} />
                                <ScrollView>
                                    { selectedAthlete.daily_recommendation.length > 0 ?
                                        <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15), paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingSml,}}>{'TODAY'}</Text>
                                        :
                                        null
                                    }
                                    {_.map(selectedAthlete.daily_recommendation, (rec, index) => (
                                        <View key={index} style={styles.ulWrapper}>
                                            <Text robotoRegular style={styles.ul}>{'\u2022'}</Text>
                                            <Text robotoRegular style={styles.ulText}>{rec}</Text>
                                        </View>
                                    ))}
                                    { selectedAthlete.weekly_recommendation.length > 0 ?
                                        <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15), paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingSml,}}>{'THIS WEEK'}</Text>
                                        :
                                        null
                                    }
                                    {_.map(selectedAthlete.weekly_recommendation, (rec, index) => (
                                        <View key={index} style={styles.ulWrapper}>
                                            <Text robotoRegular style={styles.ul}>{'\u2022'}</Text>
                                            <Text robotoRegular style={styles.ulText}>{rec}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                            :
                            <View style={{flex: 1,}}>
                                <View style={{flexDirection: 'row', paddingHorizontal: AppSizes.paddingLrg,}}>
                                    <TabIcon
                                        containerStyle={[AppStyles.containerCentered,]}
                                        icon={'checkbox-marked-circle'}
                                        iconStyle={[{color: mainColor}]}
                                        reverse={false}
                                        type={'material-community'}
                                    />
                                    <Text oswaldMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22), paddingLeft: AppSizes.paddingSml,}}>{'BECAUSE WE NOTICED...'}</Text>
                                </View>
                                <Spacer size={10} />
                                <ScrollView>
                                    { selectedAthlete.daily_insights.length > 0 ?
                                        <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15), paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingSml,}}>{'TODAY'}</Text>
                                        :
                                        null
                                    }
                                    {_.map(selectedAthlete.daily_insights, (rec, index) => (
                                        <View key={index} style={styles.ulWrapper}>
                                            <Text robotoRegular style={styles.ul}>{'\u2022'}</Text>
                                            <Text robotoRegular style={styles.ulText}>{rec}</Text>
                                        </View>
                                    ))}
                                    { selectedAthlete.weekly_insights.length > 0 ?
                                        <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15), paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingSml,}}>{'THIS WEEK'}</Text>
                                        :
                                        null
                                    }
                                    {_.map(selectedAthlete.weekly_insights, (rec, index) => (
                                        <View key={index} style={styles.ulWrapper}>
                                            <Text robotoRegular style={styles.ul}>{'\u2022'}</Text>
                                            <Text robotoRegular style={styles.ulText}>{rec}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                                <Spacer size={10} />
                            </View>
                        }
                    </View>
                    { selectedAthletePage === 0 ?
                        <View style={[styles.athleteCardBottomWrapper,]}>
                            <View style={{alignItems: 'flex-start', flex: 5,}}>
                                <Text robotoRegular style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(10),}}>
                                    {selectedAthlete && selectedAthlete.didUserCompleteReadinessSurvey ? '' : '*reduced certainty considering low survey compliance'}
                                </Text>
                            </View>
                            <TouchableHighlight
                                onPress={() => this.setState({ selectedAthletePage: 1, })}
                                style={{alignItems: 'flex-end', flex: 5,}}
                                underlayColor={AppColors.transparent}
                            >
                                <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                    <Text oswaldMedium style={[AppStyles.containerCentered, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(16),}]}>
                                        {'VIEW INSIGHTS'}
                                    </Text>
                                    <TabIcon
                                        icon={'chevron-right'}
                                        iconStyle={[{color: AppColors.zeplin.darkGrey}]}
                                        reverse={false}
                                        type={'material-community'}
                                    />
                                </View>
                            </TouchableHighlight>
                        </View>
                        :
                        <View style={[styles.athleteCardBottomWrapper,]}>
                            <TouchableHighlight
                                onPress={() => this.setState({ selectedAthletePage: 0, })}
                                style={{alignItems: 'flex-start', flex: 7,}}
                                underlayColor={AppColors.transparent}
                            >
                                <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                    <TabIcon
                                        icon={'chevron-left'}
                                        iconStyle={[{color: AppColors.zeplin.darkGrey}]}
                                        reverse={false}
                                        type={'material-community'}
                                    />
                                    <Text oswaldMedium style={[AppStyles.containerCentered, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(16),}]}>
                                        {'VIEW RECOMMENDATIONS'}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            <View style={{alignItems: 'flex-end', flex: 3,}}>
                                <Text robotoRegular style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(10),}}>
                                    {selectedAthlete && selectedAthlete.didUserCompleteReadinessSurvey ? '' : '*reduced certainty considering low survey compliance'}
                                </Text>
                            </View>
                        </View>
                    }
                </View>
            </View>
        )
    }

    renderSearchArea = (isThisWeek, numberOfAthletes, complianceColor, doWeHaveInsights, compliance, insights, weeklyInsights) => {
        const { todayFilter, thisWeekFilter, } = this.state;
        const { doWeHaveWeeklyInsights, } = PlanLogic.coachesDashboardSearchAreaRenderLogic(weeklyInsights);
        return(
            <View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                    { isThisWeek ?
                        <View />
                        :
                        <TouchableHighlight onPress={() => this._toggleComplianceModal()} underlayColor={AppColors.transparent}>
                            <View style={[AppStyles.containerCentered, styles.athleteComplianceBtn, {backgroundColor: complianceColor,}]}>
                                <Text oswaldRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(13),}}>
                                    {'ATHLETE COMPLIANCE'}
                                </Text>
                                <Spacer size={15} />
                                <TabIcon
                                    containerStyle={[AppStyles.containerCentered,]}
                                    icon={'chevron-right'}
                                    iconStyle={[{color: AppColors.white}]}
                                    reverse={false}
                                    size={20}
                                    type={'material-community'}
                                />
                            </View>
                        </TouchableHighlight>
                    }
                    { numberOfAthletes > 0 && doWeHaveInsights ?
                        <View style={[AppStyles.containerCentered, {flexDirection: 'row',}]}>
                            <FathomPicker
                                hideIcon={false}
                                items={MyPlanConstants.coachesDashboardSortBy}
                                onValueChange={value => {
                                    if(isThisWeek) {
                                        this.setState({ thisWeekFilter: value, });
                                    } else {
                                        this.setState({ todayFilter: value, });
                                    }
                                }}
                                placeholder={{
                                    label: 'SORT BY',
                                    value: null,
                                }}
                                style={{
                                    headlessAndroidContainer: [{alignItems: 'flex-end', justifyContent: 'center',}],
                                    inputAndroid:             [styles.sortByPickerSelectIOS, {textAlignVertical: 'center',}],
                                    inputIOS:                 [styles.sortByPickerSelectIOS],
                                    placeholderColor:         AppColors.zeplin.darkGrey,
                                    underline:                {borderTopColor: AppColors.white, borderTopWidth: 0,},
                                    viewContainer:            [{}],
                                }}
                                useNativeAndroidPickerStyle={false}
                                value={isThisWeek ? thisWeekFilter : todayFilter}
                            />
                        </View>
                        :
                        null
                    }
                </View>
                { isThisWeek && !doWeHaveInsights ?
                    <View
                        style={[
                            AppStyles.containerCentered,
                            styles.shadowEffect,
                            Platform.OS === 'ios' ? {} : {elevation: 2},
                            {backgroundColor: AppColors.primary.grey.twentyPercent, borderRadius: 5, marginTop: AppSizes.paddingMed, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.padding,}
                        ]}
                    >
                        <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.warning, fontSize: AppFonts.scaleFont(18),}]}>{'INSUFFICIENT TREND DATA'}</Text>
                        <Spacer size={20} />
                        <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}]}>{thisWeekInsufficientDataText}</Text>
                        <Spacer size={20} />
                    </View>
                    : !isThisWeek && complianceColor === AppColors.zeplin.coachesDashError ?
                        <View
                            style={[
                                AppStyles.containerCentered,
                                styles.shadowEffect,
                                Platform.OS === 'ios' ? {} : {elevation: 2},
                                {backgroundColor: AppColors.primary.grey.twentyPercent, borderRadius: 5, marginTop: AppSizes.paddingMed, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.padding,}
                            ]}
                        >
                            <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.warning, fontSize: AppFonts.scaleFont(18),}]}>{`${compliance.complete.length} ${compliance.complete.length === 1 ? 'SURVEY' : 'SURVEYS'} COMPLETED`}</Text>
                            <Spacer size={20} />
                            <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}]}>{todayInsufficientDataText}</Text>
                            <Spacer size={20} />
                        </View>
                        : !isThisWeek && numberOfAthletes === insights.all_good.length && complianceColor === AppColors.zeplin.success ?
                            <ImageBackground
                                resizeMode={'contain'}
                                source={require('../../../assets/images/standard/soccer_player.png')}
                                style={{height: AppSizes.screen.heightOneThird, width: (AppSizes.screen.width - (AppSizes.padding * 2)),}}
                            >
                                <View style={[styles.overlayWrapper, {alignItems: 'flex-end'}]}>
                                    <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.black, fontSize: AppFonts.scaleFont(20),}]}>
                                        {!doWeHaveWeeklyInsights ? 'NICE WORK COACH!' : 'READY FOR TODAY!'}
                                    </Text>
                                    <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.black, fontSize: AppFonts.scaleFont(14),}]}>
                                        {!doWeHaveWeeklyInsights ? 'All athletes are ready to\ntrain as normal' : 'Check "THIS WEEK" tab for\nnadditional suggestions'}
                                    </Text>
                                </View>
                            </ImageBackground>
                            :
                            null
                }
            </View>
        )
    }

    renderSection = (descriptionObj, items, athletes, key, compliance) => {
        if(!descriptionObj || items.length === 0) {
            return(null)
        }
        return(
            <View key={key}>
                <View
                    style={[
                        styles.shadowEffect,
                        Platform.OS === 'ios' ? {} : {elevation: 2},
                        {backgroundColor: AppColors.primary.grey.twentyPercent, borderRadius: 5, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml,}
                    ]}
                >
                    <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}}>{descriptionObj.label}</Text>
                    <Spacer size={5} />
                    <Text robotoRegular style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(12),}}>{descriptionObj.description}</Text>
                </View>
                <Spacer size={25} />
                <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: AppSizes.paddingMed,}}>
                    {_.map(items, (item, index) => {
                        let { athleteName, backgroundColor, filteredAthlete, } = PlanLogic.handleRenderCoachesDashboardSection(athletes, item, compliance);
                        return(
                            <TouchableHighlight
                                key={index}
                                onPress={() => {
                                    this.setState({ isAthleteCardModalOpen: true, selectedAthlete: filteredAthlete, });
                                }}
                                style={[styles.athleteCircle, {backgroundColor: backgroundColor,}]}
                                underlayColor={backgroundColor}
                            >
                                <Text
                                    oswaldRegular
                                    style={[
                                        AppStyles.textCenterAligned,
                                        styles.athleteCircleText,
                                    ]}
                                >
                                    {athleteName}
                                </Text>
                            </TouchableHighlight>
                        )
                    })}
                </View>
                <Spacer size={30} />
            </View>
        )
    }

    renderToday = (index, insights, athletes, compliance, complianceColor, weeklyInsights) => {
        const { hideTodayStartState, isPageLoading, todayFilter, } = this.state;
        const { user, } = this.props;
        let { doWeHaveInsights, sections, } = PlanLogic.handleRenderTodayAndThisWeek(true, insights, athletes, todayFilter, compliance, this.renderSection);
        return (
            <ScrollView
                contentContainerStyle={{ backgroundColor: AppColors.white, }}
                refreshControl={
                    <RefreshControl
                        colors={[AppColors.zeplin.yellow]}
                        onRefresh={() => this._handleEnteringApp()}
                        refreshing={isPageLoading}
                        title={'Updating...'}
                        titleColor={AppColors.zeplin.yellow}
                        tintColor={AppColors.zeplin.yellow}
                    />
                }
                tabLabel={tabs[index]}
            >
                <View style={{flex: 1, paddingHorizontal: AppSizes.padding,}}>
                    { insights.length === 0 ?
                        this.renderNoDataSection()
                        : !user.first_time_experience.includes('coaches_today_popup') && !hideTodayStartState ?
                            <View
                                style={[
                                    AppStyles.containerCentered,
                                    styles.shadowEffect,
                                    Platform.OS === 'ios' ? {} : {elevation: 2},
                                    {backgroundColor: AppColors.primary.grey.twentyPercent, borderRadius: 5, marginTop: AppSizes.paddingMed, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.padding,}
                                ]}
                            >
                                <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.warning, fontSize: AppFonts.scaleFont(25),}]}>{'LET\'S GET STARTED!'}</Text>
                                <Spacer size={20} />
                                <TabIcon
                                    containerStyle={[styles.iconCircle,]}
                                    icon={'directions-run'}
                                    iconStyle={[{color: AppColors.white,}]}
                                    reverse={false}
                                    size={25}
                                />
                                <Spacer size={5} />
                                <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(15),}]}>{todayPopupText}</Text>
                                <Spacer size={20} />
                                <Button
                                    backgroundColor={AppColors.zeplin.yellow}
                                    buttonStyle={[AppStyles.paddingVerticalSml, AppStyles.paddingHorizontalLrg, {borderRadius: 5,}]}
                                    fontFamily={AppStyles.oswaldRegular.fontFamily}
                                    fontWeight={AppStyles.oswaldRegular.fontWeight}
                                    onPress={() => this._toggleGotItBtn(true)}
                                    raised={false}
                                    textColor={AppColors.white}
                                    textStyle={{ fontSize: AppFonts.scaleFont(14) }}
                                    title={'GOT IT'}
                                />
                                <Spacer size={20} />
                            </View>
                            :
                            <View style={{flex: 1,}}>
                                <Spacer size={20} />
                                {this.renderSearchArea(false, athletes.length, complianceColor, doWeHaveInsights, compliance, insights, weeklyInsights)}
                                <Spacer size={20} />
                                { athletes.length === 0 ?
                                    this._renderNoAthletes(true)
                                    :
                                    sections
                                }
                            </View>
                    }
                </View>
            </ScrollView>
        )
    }

    renderThisWeek = (index, insights, athletes, compliance, complianceColor) => {
        const { hideThisWeekStartState, isPageLoading, thisWeekFilter, } = this.state;
        const { user, } = this.props;
        let { doWeHaveInsights, sections, } = PlanLogic.handleRenderTodayAndThisWeek(false, insights, athletes, thisWeekFilter, compliance, this.renderSection);
        return (
            <ScrollView
                contentContainerStyle={{ backgroundColor: AppColors.white, }}
                refreshControl={
                    <RefreshControl
                        colors={[AppColors.zeplin.yellow]}
                        onRefresh={() => this._handleEnteringApp()}
                        refreshing={isPageLoading}
                        title={'Updating...'}
                        titleColor={AppColors.zeplin.yellow}
                        tintColor={AppColors.zeplin.yellow}
                    />
                }
                tabLabel={tabs[index]}
            >
                <View style={{flex: 1, paddingHorizontal: AppSizes.padding,}}>
                    { insights.length === 0 ?
                        this.renderNoDataSection()
                        : !user.first_time_experience.includes('coaches_this_week_popup') && !hideThisWeekStartState ?
                            <View
                                style={[
                                    AppStyles.containerCentered,
                                    styles.shadowEffect,
                                    Platform.OS === 'ios' ? {} : {elevation: 2},
                                    {backgroundColor: AppColors.primary.grey.twentyPercent, borderRadius: 5, marginTop: AppSizes.paddingMed, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.padding,}
                                ]}
                            >
                                <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.warning, fontSize: AppFonts.scaleFont(25),}]}>{'TRENDING INSIGHTS\nLIVE HERE!'}</Text>
                                <Spacer size={10} />
                                <TabIcon
                                    containerStyle={[styles.iconCircle,]}
                                    icon={'trending-up'}
                                    iconStyle={[{color: AppColors.white,}]}
                                    reverse={false}
                                    size={25}
                                />
                                <Spacer size={5} />
                                <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(15),}]}>{thisWeekPopupText}</Text>
                                <Spacer size={20} />
                                <Button
                                    backgroundColor={AppColors.zeplin.yellow}
                                    buttonStyle={[AppStyles.paddingVerticalSml, AppStyles.paddingHorizontalLrg, {borderRadius: 5,}]}
                                    fontFamily={AppStyles.oswaldRegular.fontFamily}
                                    fontWeight={AppStyles.oswaldRegular.fontWeight}
                                    onPress={() => this._toggleGotItBtn(false)}
                                    raised={false}
                                    textColor={AppColors.white}
                                    textStyle={{ fontSize: AppFonts.scaleFont(14) }}
                                    title={'GOT IT'}
                                />
                                <Spacer size={20} />
                            </View>
                            :
                            <View style={{flex: 1,}}>
                                <Spacer size={20} />
                                {this.renderSearchArea(true, athletes.length, complianceColor, doWeHaveInsights, compliance, insights)}
                                <Spacer size={20} />
                                { !doWeHaveInsights ?
                                    this._renderNoAthletes(false)
                                    :
                                    sections
                                }
                            </View>
                    }
                </View>
            </ScrollView>
        )
    }

    renderNoDataSection = () => {
        return(
            <View style={{flex: 1,}}>
                <Spacer size={20} />
                <View
                    style={[
                        AppStyles.containerCentered,
                        styles.athleteComplianceBtn,
                        {backgroundColor: AppColors.zeplin.darkWhite, height: 30, width: AppSizes.screen.widthHalf,}
                    ]}
                />
                <Spacer size={25} />
                <View style={{backgroundColor: AppColors.zeplin.darkWhite, borderRadius: 5, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingXLrg,}} />
                <Spacer size={25} />
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',}}>
                    <View style={[styles.athleteCircle, {backgroundColor: AppColors.zeplin.darkWhite,}]} />
                    <View style={[styles.athleteCircle, {backgroundColor: AppColors.zeplin.darkWhite,}]} />
                    <View style={[styles.athleteCircle, {backgroundColor: AppColors.zeplin.darkWhite,}]} />
                </View>
                <Spacer size={40} />
                <View style={{backgroundColor: AppColors.zeplin.darkWhite, borderRadius: 5, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingXLrg,}} />
                <Spacer size={25} />
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',}}>
                    <View style={[styles.athleteCircle, {backgroundColor: AppColors.zeplin.darkWhite,}]} />
                    <View style={[styles.athleteCircle, {backgroundColor: AppColors.zeplin.darkWhite,}]} />
                    <View style={[styles.athleteCircle, {backgroundColor: AppColors.zeplin.darkWhite,}]} />
                </View>
            </View>
        )
    }

    _toggleGotItBtn = isToday => {
        const { numberOfTotalAthletes, } = PlanLogic.gotItButtonLogic(this.props.coachesDashboardData);
        if(numberOfTotalAthletes > 0) {
            // setup variables
            let newUserPayloadObj = {};
            newUserPayloadObj.first_time_experience = [isToday ? 'coaches_today_popup' : 'coaches_this_week_popup'];
            let newUserObj = _.cloneDeep(this.props.user);
            newUserObj.first_time_experience = [isToday ? 'coaches_today_popup' : 'coaches_this_week_popup'];
            // update reducer as API might take too long to return a value
            store.dispatch({
                type: DispatchActions.USER_REPLACE,
                data: newUserObj
            });
            // update user object
            this.props.updateUser(newUserPayloadObj, this.props.user.id);
        } else {
            // if we don't have users, just update the state and hide message
            if(isToday) {
                this.setState({ hideTodayStartState: true, });
            } else {
                this.setState({ hideThisWeekStartState: true, });
            }
        }
    }

    _renderNoAthletes = isToday => {
        let coachesDashboardCardsData = MyPlanConstants.coachesDashboardCardsData(isToday);
        return (
            _.map(coachesDashboardCardsData, (section, index) =>
                <View key={index}>
                    <View
                        style={[
                            styles.shadowEffect,
                            Platform.OS === 'ios' ? {} : {elevation: 2},
                            {backgroundColor: AppColors.primary.grey.twentyPercent, borderRadius: 5, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml,}
                        ]}
                    >
                        <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}}>{section.label}</Text>
                    </View>
                    <Spacer size={25} />
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',}}>
                        <View style={[styles.athleteCircle, {backgroundColor: AppColors.primary.grey.twentyPercent,}]} />
                        <View style={[styles.athleteCircle, {backgroundColor: AppColors.primary.grey.twentyPercent,}]} />
                        <View style={[styles.athleteCircle, {backgroundColor: AppColors.primary.grey.twentyPercent,}]} />
                        { section.overlayText ?
                            <View style={[styles.overlayWrapper,]}>
                                <Text
                                    robotoRegular
                                    style={[
                                        AppStyles.textCenterAligned,
                                        {
                                            alignSelf: 'center',
                                            color:     AppColors.primary.grey.fiftyPercent,
                                            fontSize:  AppFonts.scaleFont(15),
                                        }
                                    ]}
                                >
                                    {section.overlayText}
                                </Text>
                            </View>
                            :
                            null
                        }
                    </View>
                    <Spacer size={30} />
                </View>
            )
        )
    }

    render = () => {
        const { isAthleteCardModalOpen, isComplianceModalOpen, isPageLoading, selectedTeamIndex, } = this.state;
        const { coachesDashboardData, } = this.props;
        const {
            coachesTeams,
            completedAthletes,
            complianceColor,
            incompleteAthletes,
            numOfCompletedAthletes,
            numOfIncompletedAthletes,
            numOfTotalAthletes,
            selectedTeam,
            trainingCompliance,
        } = PlanLogic.handleCoachesDashboardRenderLogic(coachesDashboardData, selectedTeamIndex);
        // making sure we can only drag horizontally if our modals are closed and nothing is loading
        let isScrollLocked = !isPageLoading ? false : true;
        return(
            <View style={{flex: 1,}}>
                <ScrollableTabView
                    locked={isScrollLocked || !selectedTeam}
                    onChangeTab={tabLocation => this._onChangeTab(tabLocation)}
                    ref={tabView => { this.tabView = tabView; }}
                    renderTabBar={() =>
                        <CoachesDashboardTabBar
                            disabled={isPageLoading}
                            headerItems={{
                                coachesTeams,
                                onRefresh:   () => this._handleEnteringApp(),
                                refreshing:  isPageLoading,
                                selectedTeam,
                                selectedTeamIndex,
                                updateState: value => this.setState({ selectedTeamIndex: value ? value : 0, })
                            }}
                            renderTab={(name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle) => this.renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle, selectedTeam)}
                            style={{backgroundColor: AppColors.white, borderBottomWidth: 0,}}
                        />
                    }
                    style={{backgroundColor: AppColors.white,}}
                    tabBarActiveTextColor={AppColors.secondary.blue.hundredPercent}
                    tabBarInactiveTextColor={AppColors.primary.grey.hundredPercent}
                    tabBarUnderlineStyle={{height: 0,}}
                >
                    {this.renderToday(0, selectedTeam ? selectedTeam.daily_insights : [], selectedTeam ? selectedTeam.athletes : [], selectedTeam ? selectedTeam.compliance : [], complianceColor, selectedTeam ? selectedTeam.weekly_insights : [])}
                    {this.renderThisWeek(1, selectedTeam ? selectedTeam.weekly_insights : [], selectedTeam ? selectedTeam.athletes : [], selectedTeam ? selectedTeam.compliance : [])}
                </ScrollableTabView>
                <FathomModal
                    isVisible={isComplianceModalOpen}
                    style={{alignItems: 'center',}}
                >
                    <View
                        style={[
                            AppStyles.modalShadowEffect,
                            Platform.OS === 'ios' ? {} : {elevation: 2},
                            {
                                backgroundColor: AppColors.white,
                                borderRadius:    5,
                                height:          AppSizes.screen.heightThreeQuarters,
                                width:           AppSizes.screen.width * 0.85,
                            }
                        ]}
                    >
                        <AthleteComplianceModal
                            completedAthletes={completedAthletes}
                            complianceColor={complianceColor}
                            incompleteAthletes={incompleteAthletes}
                            numOfCompletedAthletes={numOfCompletedAthletes}
                            numOfIncompletedAthletes={numOfIncompletedAthletes}
                            numOfTotalAthletes={numOfTotalAthletes}
                            toggleComplianceModal={this._toggleComplianceModal}
                            trainingCompliance={trainingCompliance}
                        />
                    </View>
                </FathomModal>
                <FathomModal
                    isVisible={isAthleteCardModalOpen}
                    style={{alignItems: 'center',}}
                >
                    <View
                        style={[
                            AppStyles.modalShadowEffect,
                            Platform.OS === 'ios' ? {} : {elevation: 2},
                            {
                                backgroundColor: AppColors.white,
                                borderRadius:    5,
                                height:          AppSizes.screen.heightThreeQuarters,
                                width:           AppSizes.screen.width * 0.9,
                            }
                        ]}
                    >
                        {this.renderAthleteCardModal()}
                    </View>
                </FathomModal>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default CoachesDashboard;