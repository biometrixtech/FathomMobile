/**
 * CoachesDashboard View
 */
import React, { Component } from 'react';
import { Animated, BackHandler, Platform, RefreshControl, ScrollView, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, View, } from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import { GoogleAnalyticsTracker, } from 'react-native-google-analytics-bridge';
import _ from 'lodash';
import Modal from 'react-native-modalbox';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, AppFonts, ErrorMessages, MyPlan as MyPlanConstants, } from '../../constants/';
import { store } from '../../store';
import { AppUtil, PlanLogic, } from '../../lib';

// Components
import { CoachesDashboardTabBar, FathomPicker, Spacer, TabIcon, Text, } from '../custom/';

// Tabs titles
const tabs = ['TODAY', 'THIS WEEK'];

// setup GA Tracker
const GATracker = new GoogleAnalyticsTracker('UA-127040201-1');

// constants
const circleSize = 65;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    athleteCircle: {
        borderRadius:   (circleSize / 2),
        height:         circleSize,
        justifyContent: 'center',
        marginBottom:   AppSizes.paddingXSml,
        marginRight:    AppSizes.paddingSml,
        width:          circleSize,
    },
    athleteCircleText: {
        color:             AppColors.white,
        fontSize:          AppFonts.scaleFont(15),
        paddingHorizontal: AppSizes.paddingXSml,
        paddingVertical:   AppSizes.paddingSml,
    },
    athleteComplianceBtn: {
        borderRadius:    5,
        flexDirection:   'row',
        paddingLeft:     AppSizes.paddingXSml,
        paddingVertical: AppSizes.paddingXSml,
    },
    complianceModalAthleteNameWrapper: {
        alignSelf:         'center',
        borderBottomColor: AppColors.zeplin.shadow,
        borderBottomWidth: 1,
        borderStyle:       'solid',
        width:             (AppSizes.screen.widthThreeQuarters - (AppSizes.paddingLrg + AppSizes.paddingLrg)),
    },
    sortByPickerSelect: {
        ...AppFonts.robotoLight,
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
        user:                    PropTypes.object.isRequired,
    }

    static defaultProps = {
        scheduledMaintenance: null,
    }

    constructor(props) {
        super(props);
        this.state = {
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
        this._handleEnteringApp();
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
        this.setState({ isPageLoading: true, });
        this.props.getCoachesDashboardData(userId)
            .then(res => this.setState({ isPageLoading: false, }))
            .catch(err => {
                this.setState({ isPageLoading: false, });
                AppUtil.handleAPIErrorAlert(ErrorMessages.patchFunctionalStrength);
            });
    }

    renderTab = (name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle) => {
        const textStyle = AppStyles.tabHeaders;
        const fontSize = isTabActive ? AppFonts.scaleFont(20) : AppFonts.scaleFont(16);
        let { page0, page1, } = this.state;
        let currentPage = this.tabView ? this.tabView.state.currentPage : 0;
        let page0Width = currentPage === 0 ? AppSizes.screen.widthThreeQuarters : AppSizes.screen.widthQuarter;
        let page1Width = currentPage === 1 ? AppSizes.screen.widthThreeQuarters : AppSizes.screen.widthQuarter;
        let page0ExtraStyles = currentPage === 0 ? {paddingLeft: AppSizes.screen.widthQuarter} : {};
        let page1ExtraStyles = currentPage === 1 ? {paddingRight: AppSizes.screen.widthQuarter} : {};
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
                onPress={() => isScrollLocked ? null : onPressHandler(page)}
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
                                        color: isTabActive ? AppColors.activeTabText : AppColors.inactiveTabText,
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

    renderComplianceModal = (complianceColor, numOfCompletedAthletes, numOfTotalAthletes, incompleteAtheltes) => {
        return(
            <ScrollView>
                <TabIcon
                    containerStyle={[{alignSelf: 'flex-end',}]}
                    icon={'close'}
                    iconStyle={[{color: AppColors.black, paddingRight: AppSizes.paddingLrg, paddingTop: AppSizes.paddingLrg,}]}
                    onPress={this._toggleComplianceModal}
                    reverse={false}
                    size={30}
                    type={'material-community'}
                />
                <Spacer size={25} />
                <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(30), paddingHorizontal: AppSizes.paddingLrg,}}>
                    {'COMPLIANCE'}
                </Text>
                <Spacer size={15} />
                <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, paddingVertical: AppSizes.paddingSml,}}>
                    <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(12), paddingHorizontal: AppSizes.paddingLrg,}}>
                        {`READINESS SURVEYS COMPLETE ${moment().format('MM/DD/YY')}`}
                    </Text>
                    <Text oswaldRegular style={{color: complianceColor, fontSize: AppFonts.scaleFont(28), paddingHorizontal: AppSizes.paddingLrg,}}>
                        {numOfCompletedAthletes}
                        <Text oswaldRegular style={{color: complianceColor, fontSize: AppFonts.scaleFont(12),}}>
                            {` / ${numOfTotalAthletes} ATHLETES`}
                        </Text>
                    </Text>
                </View>
                <Spacer size={15} />
                <Text robotoRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(17), paddingHorizontal: AppSizes.paddingLrg,}}>
                    {`Athletes without Readiness Survey ${moment().format('MM/DD/YY')}:`}
                </Text>
                <Spacer size={10} />
                { _.map(incompleteAtheltes, (athlete, index) =>
                    <View key={index}>
                        <View style={[styles.complianceModalAthleteNameWrapper]}>
                            <Text
                                oswaldRegular
                                style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15), paddingBottom: AppSizes.padding,}}
                            >
                                {`${athlete.first_name} ${athlete.last_name}`}
                            </Text>
                        </View>
                        <Spacer size={15} />
                    </View>
                )}
                <Spacer size={20} />
            </ScrollView>
        )
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
                            <View>
                                <View style={{flexDirection: 'row', paddingHorizontal: AppSizes.paddingLrg,}}>
                                    <TabIcon
                                        containerStyle={[AppStyles.containerCentered,]}
                                        icon={'checkbox-marked-circle'}
                                        iconStyle={[{color: mainColor}]}
                                        reverse={false}
                                        type={'material-community'}
                                    />
                                    <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(20), paddingLeft: AppSizes.paddingSml,}}>{'WE RECOMMEND...'}</Text>
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
                            <View>
                                <View style={{flexDirection: 'row', paddingHorizontal: AppSizes.paddingLrg,}}>
                                    <TabIcon
                                        containerStyle={[AppStyles.containerCentered,]}
                                        icon={'checkbox-marked-circle'}
                                        iconStyle={[{color: mainColor}]}
                                        reverse={false}
                                        type={'material-community'}
                                    />
                                    <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(20), paddingLeft: AppSizes.paddingSml,}}>{'BECAUSE WE\'VE NOTICED…'}</Text>
                                </View>
                                <Spacer size={10} />
                                <ScrollView>
                                    {_.map(selectedAthlete.insights, (rec, index) => (
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
                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'row',justifyContent: 'space-between', paddingBottom: AppSizes.padding, paddingRight: AppSizes.paddingLrg,}}>
                            <View style={{paddingLeft: AppSizes.paddingLrg,}}>
                                <Text robotoRegular style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(11),}}>
                                    {selectedAthlete.didUserCompleteReadinessSurvey ? '' : '*survey not completed today'}
                                </Text>
                            </View>
                            <TouchableHighlight onPress={() => this.setState({ selectedAthletePage: 1, })} underlayColor={AppColors.transparent}>
                                <View style={{flexDirection: 'row',}}>
                                    <Text oswaldRegular style={[AppStyles.containerCentered, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(16),}]}>
                                        {'VIEW WHY'}
                                    </Text>
                                    <TabIcon
                                        containerStyle={[AppStyles.containerCentered,]}
                                        icon={'chevron-right'}
                                        iconStyle={[{color: AppColors.zeplin.darkGrey}]}
                                        reverse={false}
                                        type={'material-community'}
                                    />
                                </View>
                            </TouchableHighlight>
                        </View>
                        :
                        <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: AppSizes.padding, paddingLeft: AppSizes.paddingLrg,}}>
                            <TouchableHighlight onPress={() => this.setState({ selectedAthletePage: 0, })} underlayColor={AppColors.transparent}>
                                <View style={{flexDirection: 'row',}}>
                                    <TabIcon
                                        containerStyle={[AppStyles.containerCentered,]}
                                        icon={'chevron-left'}
                                        iconStyle={[{color: AppColors.zeplin.darkGrey}]}
                                        reverse={false}
                                        type={'material-community'}
                                    />
                                    <Text oswaldRegular style={[AppStyles.containerCentered, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(16),}]}>
                                        {'VIEW RECOMMENDATIONS'}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    }
                </View>
            </View>
        )
    }

    renderSearchArea = (isThisWeek, complianceColor) => {
        const { todayFilter, thisWeekFilter, } = this.state;
        return(
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
                            label: 'Sort by',
                            value: null,
                        }}
                        style={{
                            inputAndroid:     [styles.sortByPickerSelect],
                            inputIOS:         [styles.sortByPickerSelect],
                            placeholderColor: AppColors.zeplin.darkGrey,
                        }}
                        value={isThisWeek ? thisWeekFilter : todayFilter}
                    />
                </View>
            </View>
        )
    }

    renderSection = (descriptionObj, items, athletes, key, compliance) => {
        if(items.length === 0) {
            return(null)
        }
        return(
            <View key={key}>
                <View>
                    <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, borderRadius: 5, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml,}}>
                        <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}}>{descriptionObj.label}</Text>
                        <Spacer size={5} />
                        <Text robotoRegular style={{color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(12),}}>{descriptionObj.description}</Text>
                    </View>
                    <Spacer size={25} />
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: AppSizes.padding,}}>
                        {_.map(items, (item, index) => {
                            let { athleteName, backgroundColor, filteredAthlete, } = PlanLogic.handleRenderCoachesDashboardSection(athletes, item, compliance);
                            return(
                                <TouchableHighlight
                                    key={index}
                                    onPress={() => this.setState({ isAthleteCardModalOpen: true, selectedAthlete: filteredAthlete, })}
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
                </View>
                <Spacer size={40} />
            </View>
        )
    }

    renderToday = (index, insights, athletes, compliance, complianceColor) => {
        const { isPageLoading, todayFilter, } = this.state;
        let { sections, } = PlanLogic.handleRenderTodayAndThisWeek(true, insights, athletes, todayFilter, compliance, this.renderSection);
        return (
            <ScrollView
                contentContainerStyle={{ backgroundColor: AppColors.white, paddingHorizontal: AppSizes.padding, }}
                refreshControl={
                    <RefreshControl
                        colors={[AppColors.primary.yellow.hundredPercent]}
                        onRefresh={() => this._handleEnteringApp()}
                        refreshing={isPageLoading}
                        title={'Updating...'}
                        titleColor={AppColors.primary.yellow.hundredPercent}
                        tintColor={AppColors.primary.yellow.hundredPercent}
                    />
                }
                tabLabel={tabs[index]}
            >
                <Spacer size={20} />
                {this.renderSearchArea(false, complianceColor)}
                <Spacer size={20} />
                {sections}
            </ScrollView>
        )
    }

    renderThisWeek = (index, insights, athletes, compliance, complianceColor) => {
        const { isPageLoading, thisWeekFilter, } = this.state;
        let { sections, } = PlanLogic.handleRenderTodayAndThisWeek(false, insights, athletes, thisWeekFilter, compliance, this.renderSection);
        return (
            <ScrollView
                contentContainerStyle={{ backgroundColor: AppColors.white, paddingHorizontal: AppSizes.padding, }}
                refreshControl={
                    <RefreshControl
                        colors={[AppColors.primary.yellow.hundredPercent]}
                        onRefresh={() => this._handleEnteringApp()}
                        refreshing={isPageLoading}
                        title={'Loading...'}
                        titleColor={AppColors.primary.yellow.hundredPercent}
                        tintColor={AppColors.primary.yellow.hundredPercent}
                    />
                }
                tabLabel={tabs[index]}
            >
                <Spacer size={20} />
                {this.renderSearchArea(true)}
                <Spacer size={20} />
                {sections}
            </ScrollView>
        )
    }

    render = () => {
        const { selectedTeamIndex, } = this.state;
        const { coachesDashboardData, } = this.props;
        const {
            coachesTeams,
            complianceColor,
            incompleteAtheltes,
            numOfCompletedAthletes,
            numOfTotalAthletes,
            selectedTeam,
        } = PlanLogic.handleCoachesDashboardRenderLogic(coachesDashboardData, selectedTeamIndex);
        // making sure we can only drag horizontally if our modals are closed and nothing is loading
        let isScrollLocked = !this.state.isPageLoading ? false : true;
        return(
            <View style={{flex: 1,}}>
                <ScrollableTabView
                    locked={isScrollLocked}
                    onChangeTab={tabLocation => this._onChangeTab(tabLocation)}
                    ref={tabView => { this.tabView = tabView; }}
                    renderTabBar={() =>
                        <CoachesDashboardTabBar
                            headerItems={{
                                coachesTeams,
                                selectedTeam,
                                selectedTeamIndex,
                                updateState: value => this.setState({ selectedTeamIndex: value ? value : 0, })
                            }}
                            locked
                            renderTab={this.renderTab}
                            style={{backgroundColor: AppColors.primary.grey.twentyPercent, borderBottomWidth: 0,}}
                        />
                    }
                    style={{backgroundColor: AppColors.white,}}
                    tabBarActiveTextColor={AppColors.secondary.blue.hundredPercent}
                    tabBarInactiveTextColor={AppColors.primary.grey.hundredPercent}
                    tabBarUnderlineStyle={{height: 0,}}
                >
                    {this.renderToday(0, selectedTeam ? selectedTeam.daily_insights : [], selectedTeam ? selectedTeam.athletes : [], selectedTeam ? selectedTeam.compliance : [], complianceColor)}
                    {this.renderThisWeek(1, selectedTeam ? selectedTeam.weekly_insights : [], selectedTeam ? selectedTeam.athletes : [], selectedTeam ? selectedTeam.compliance : [])}
                </ScrollableTabView>
                <Modal
                    backdropOpacity={0.75}
                    backdropPressToClose={false}
                    coverScreen={true}
                    isOpen={this.state.isComplianceModalOpen}
                    position={'center'}
                    style={{
                        borderRadius: 5,
                        height:       AppSizes.screen.heightThreeQuarters,
                        width:        AppSizes.screen.widthThreeQuarters,
                    }}
                    swipeToClose={false}
                >
                    {this.renderComplianceModal(complianceColor, numOfCompletedAthletes, numOfTotalAthletes, incompleteAtheltes)}
                </Modal>
                <Modal
                    backdropOpacity={0.75}
                    backdropPressToClose={false}
                    coverScreen={true}
                    isOpen={this.state.isAthleteCardModalOpen}
                    position={'center'}
                    style={{
                        borderRadius: 5,
                        height:       AppSizes.screen.heightThreeQuarters,
                        width:        AppSizes.screen.width * 0.9,
                    }}
                    swipeToClose={false}
                >
                    {this.renderAthleteCardModal()}
                </Modal>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default CoachesDashboard;