/**
 * CoachesDashboard View
 */
import React, { Component } from 'react';
import { BackHandler, Platform, ScrollView, TouchableHighlight, TouchableWithoutFeedback, View, } from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import { GoogleAnalyticsTracker, } from 'react-native-google-analytics-bridge';
import _ from 'lodash';
import Modal from 'react-native-modalbox';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, AppFonts, } from '../../constants/';
import { store } from '../../store';
import { AppUtil, } from '../../lib';

// Components
import { Spacer, TabIcon, Text, } from '../custom/';

// Tabs titles
const tabs = ['TODAY', 'THIS WEEK'];

// setup GA Tracker
const GATracker = new GoogleAnalyticsTracker('UA-127040201-1');

/* Component ==================================================================== */
class CoachesDashboard extends Component {
    static componentName = 'CoachesDashboard';

    static propTypes = {
        coachesDashboardData:    PropTypes.array.isRequired,
        getCoachesDashboardData: PropTypes.func.isRequired,
        lastOpened:              PropTypes.object.isRequired,
        network:                 PropTypes.object.isRequired,
        user:                    PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            isAthleteCardModalOpen: false,
            isComplianceModalOpen:  false,
            page0:                  {},
            page1:                  {},
            selectedTeamIndex:      0,
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
        let userId = this.props.user.id;
        if(
            !this.props.lastOpened.date ||
            moment(this.props.lastOpened.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD') ||
            this.props.coachesDashboardData.length === 0
        ) {
            this.props.getCoachesDashboardData(userId);
        }
        // set GA variables
        GATracker.setUser(this.props.user.id);
        GATracker.setAppVersion(AppUtil.getAppBuildNumber().toString());
        GATracker.setAppName(`Fathom-${store.getState().init.environment}`);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
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
        return(
            <TouchableWithoutFeedback
                key={`${name}_${page}`}
                accessible={true}
                accessibilityLabel={name}
                accessibilityTraits={'button'}
                onPress={() => onPressHandler(page)}
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

    renderSearchArea = (isThisWeek, complianceColor) => {
        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                { isThisWeek ?
                    <View />
                    :
                    <TouchableHighlight onPress={() => this._toggleComplianceModal()} underlayColor={AppColors.transparent}>
                        <View style={[AppStyles.containerCentered, { backgroundColor: complianceColor, borderRadius: 5, flexDirection: 'row', paddingLeft: AppSizes.paddingXSml, paddingVertical: AppSizes.paddingXSml,}]}>
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
                    <Text robotoRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}}>
                        {'Sort by'}
                    </Text>
                    <Spacer size={15} />
                    <TabIcon
                        containerStyle={[AppStyles.containerCentered,]}
                        icon={'chevron-down'}
                        iconStyle={[{color: AppColors.zeplin.darkGrey}]}
                        reverse={false}
                        size={20}
                        type={'material-community'}
                    />
                </View>
            </View>
        )
    }

    renderToday = (index, insights, athletes, complianceColor) => {
        console.log('renderToday');
        console.log('insights',insights);
        console.log('athletes',athletes);
        console.log('--------');
        return (
            <ScrollView
                contentContainerStyle={{ backgroundColor: AppColors.white, paddingHorizontal: AppSizes.padding, }}
                tabLabel={tabs[index]}
            >
                <Spacer size={20} />
                {this.renderSearchArea(false, complianceColor)}
                <Spacer size={20} />
            </ScrollView>
        )
    }

    renderThisWeek = (index, insights, athletes, complianceColor) => {
        console.log('renderThisWeek');
        console.log('insights',insights);
        console.log('athletes',athletes);
        console.log('--------');
        return (
            <ScrollView
                contentContainerStyle={{ backgroundColor: AppColors.white, paddingHorizontal: AppSizes.padding, }}
                tabLabel={tabs[index]}
            >
                <Spacer size={20} />
                {this.renderSearchArea(true)}
                <Spacer size={20} />
            </ScrollView>
        )
    }

    render() {
        const { selectedTeamIndex, } = this.state;
        const { coachesDashboardData, } = this.props;
        let selectedTeam = coachesDashboardData.length > 0 ? coachesDashboardData[selectedTeamIndex] : false;
        let teamName = selectedTeam ? selectedTeam.name.toUpperCase() : '';
        // compliance modal data
        let complianceObj = selectedTeam ? selectedTeam.compliance : false;
        let numOfCompletedAthletes = complianceObj ? complianceObj.complete.length : 0;
        let numOfIncompletedAthletes = complianceObj ? complianceObj.incomplete.length : 0;
        let numOfTotalAthletes = numOfCompletedAthletes + numOfIncompletedAthletes;
        let incompleteAtheltes = complianceObj ? complianceObj.incomplete : [];
        let completedPercent = (numOfIncompletedAthletes / numOfTotalAthletes) * 100;
        let complianceColor = completedPercent <= 33 ?
            AppColors.zeplin.error
            : completedPercent >= 34 && completedPercent <= 66 ?
                AppColors.zeplin.warning
                :
                AppColors.zeplin.success;
        return(
            <View style={{flex: 1,}}>
                <View style={[AppStyles.containerCentered, {backgroundColor: AppColors.white, flexDirection: 'row', justifyContent: 'center', paddingBottom: AppSizes.paddingSml,}]}>
                    <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(30),}}>
                        {teamName}
                    </Text>
                    <Spacer size={coachesDashboardData.length > 1 ? 15 : 0} />
                    { coachesDashboardData.length > 1 ?
                        <TabIcon
                            containerStyle={[AppStyles.containerCentered,]}
                            icon={'chevron-down'}
                            iconStyle={[{color: AppColors.zeplin.darkGrey}]}
                            reverse={false}
                            type={'material-community'}
                        />
                        :
                        null
                    }
                </View>
                <ScrollableTabView
                    locked={false}
                    onChangeTab={tabLocation => this._onChangeTab(tabLocation)}
                    ref={tabView => { this.tabView = tabView; }}
                    renderTabBar={() => <ScrollableTabBar locked renderTab={this.renderTab} style={{backgroundColor: AppColors.primary.grey.twentyPercent, borderBottomWidth: 0,}} />}
                    style={{backgroundColor: AppColors.white,}}
                    tabBarActiveTextColor={AppColors.secondary.blue.hundredPercent}
                    tabBarInactiveTextColor={AppColors.primary.grey.hundredPercent}
                    tabBarUnderlineStyle={{height: 0,}}
                >
                    {this.renderToday(0, selectedTeam.daily_insights, selectedTeam.athletes, complianceColor)}
                    {this.renderThisWeek(1, selectedTeam.weekly_insights, selectedTeam.athletes)}
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
                        <Spacer size={30} />
                        <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(30), paddingHorizontal: AppSizes.paddingLrg,}}>
                            {'COMPLIANCE'}
                        </Text>
                        <Spacer size={20} />
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
                        <Spacer size={20} />
                        <Text robotoRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(17), paddingHorizontal: AppSizes.paddingLrg,}}>
                            {`Athletes without Readiness Survey ${moment().format('MM/DD/YY')}:`}
                        </Text>
                        <Spacer size={20} />
                        { _.map(incompleteAtheltes, (athlete, index) =>
                            <View
                                key={index}
                                style={{alignSelf: 'center', borderBottomColor: AppColors.zeplin.shadow, borderBottomWidth: 1, borderStyle: 'solid', width: (AppSizes.screen.widthThreeQuarters - (AppSizes.paddingLrg + AppSizes.paddingLrg)),}}
                            >
                                <Text
                                    oswaldRegular
                                    style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15), paddingBottom: AppSizes.padding,}}
                                >
                                    {`${athlete.first_name} ${athlete.last_name}`}
                                </Text>
                            </View>
                        )}
                        <Spacer size={20} />
                    </ScrollView>
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
                    <View style={{flex: 1, flexDirection: 'row',}}>
                        <View style={{backgroundColor: AppColors.zeplin.success, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, width: 5,}} />
                        <View style={{flex: 1,}}>
                            <TabIcon
                                containerStyle={[{alignSelf: 'flex-end',}]}
                                icon={'close'}
                                iconStyle={[{color: AppColors.black, paddingRight: AppSizes.paddingLrg, paddingTop: AppSizes.paddingLrg,}]}
                                onPress={this._toggleComplianceModal}
                                reverse={false}
                                size={30}
                                type={'material-community'}
                            />
                            <Spacer size={10} />
                            <Text oswaldRegular style={{color: AppColors.zeplin.success, fontSize: AppFonts.scaleFont(25), paddingHorizontal: AppSizes.paddingLrg,}}>
                                {'MAZEN CHAMI'}
                            </Text>
                            <Spacer size={5} />
                            <Text robotoRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(13), paddingHorizontal: AppSizes.paddingLrg,}}>
                                {'Train as normal'}
                            </Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default CoachesDashboard;