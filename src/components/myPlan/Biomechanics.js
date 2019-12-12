/**
 * Biomechanics
 *
    <Biomechanics
        dataType={dataType}
        getBiomechanicsDetails={getBiomechanicsDetails}
        index={index}
        plan={plan}
        session={session}
        user={user}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Platform, ScrollView, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { Button, ParsedText, Spacer, TabIcon, Text, TrendsTabBar, } from '../custom';
import { BiomechanicsCharts, } from './graphs';
import { Loading, } from '../general';
import { AppUtil, PlanLogic, SensorLogic, } from '../../lib';
import { BiomechanicsDataCard, } from './pages';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import moment from 'moment';

/* Component ==================================================================== */
const TabViewWrapper = props => Platform.OS === 'ios' ?
    <View style={{flex: 1, paddingHorizontal: AppSizes.paddingMed,}}>
        {props.children}
    </View>
    :
    <ScrollView contentContainerStyle={{flexGrow: 1, paddingHorizontal: AppSizes.paddingMed,}} showsVerticalScrollIndicator={false}>
        {props.children}
    </ScrollView>;

const BiomechanicsTabView = ({ data, session, }) => {
    const {
        parsedAsymmetryDetailTextData,
        parsedDescriptionTextData,
        pieDetails,
        sessionData,
        sessionDuration,
        updatedChartData,
    } = PlanLogic.handleBiomechanicsTabViewRenderLogic(session, data);
    return (
        <TabViewWrapper>
            <View
                style={{
                    alignSelf:       'center',
                    backgroundColor: AppColors.zeplin.slateLight,
                    borderRadius:    100,
                    height:          4,
                    marginBottom:    AppSizes.padding,
                    width:           AppSizes.screen.widthThird,
                }}
            />
            {sessionData.description.active &&
                <View style={{paddingHorizontal: AppSizes.paddingSml,}}>
                    <ParsedText
                        parse={parsedDescriptionTextData || []}
                        style={{...AppStyles.robotoRegular, color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12), lineHeight: AppFonts.scaleFont(18), marginBottom: AppSizes.paddingMed, textAlign: 'center',}}
                    >
                        {sessionData.description.text}
                    </ParsedText>
                    {_.map(sessionData.description.text_items, (text, i) => {
                        let parsedTextItemsData = _.map(sessionData.description.text_items.bold_text, (prop, key) => {
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
            <BiomechanicsCharts
                dataType={data.data_type}
                pieDetails={pieDetails}
                selectedSession={sessionData}
            />
            <Spacer size={sessionData && sessionData.data_cards.length > 0 ? AppSizes.paddingSml : 0} />
            {_.map(sessionData.data_cards, (card, key) =>
                <BiomechanicsDataCard
                    card={card}
                    key={key}
                />
            )}
            <View style={{marginBottom: AppSizes.paddingMed, marginTop: AppSizes.paddingLrg,}}>
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginBottom: AppSizes.paddingSml, marginHorizontal: AppSizes.paddingLrg,}}>{'Workout Timeline'}</Text>
                <BiomechanicsCharts
                    chartData={_.flatten(updatedChartData)}
                    dataType={data.data_type}
                    isRichDataView={true}
                    sessionDuration={sessionDuration}
                    selectedSession={session}
                    showTitle={false}
                />
            </View>
            {(sessionData && sessionData.asymmetry && sessionData.asymmetry.detail_text && sessionData.asymmetry.detail_text.length > 0) &&
                <ParsedText
                    parse={parsedAsymmetryDetailTextData || []}
                    style={{...AppStyles.robotoRegular, color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(18), lineHeight: AppFonts.scaleFont(22), marginBottom: AppSizes.paddingMed, textAlign: 'center',}}
                >
                    {sessionData.asymmetry.detail_text}
                </ParsedText>
            }
            <Button
                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthTwoThirds,}}
                containerStyle={{alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, marginTop: AppSizes.padding, width: AppSizes.screen.widthTwoThirds,}}
                onPress={() => AppUtil.pushToScene('myPlan')}
                raised={true}
                title={'Go to your plan'}
                titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
            />
        </TabViewWrapper>
    );
}

class Biomechanics extends PureComponent {
    constructor(props) {
        super(props);
        const { session, } = props;
        const dataToDisplay = _.filter(session.data_points, tab => tab.data_type || tab.data_type === 0);
        this.state  = {
            currentTabDetails: {
                from: 0,
                i:    0,
                ref:  {},
            },
            dataToDisplay,
            initialPage: 0,
            loading:     false,
        };
        this.tabView = {};
    }

    componentDidMount = () => {
        _.delay(() => this._toggleRichDataView(), 10);
        _.delay(() => {
            const initialPage = _.find(this.state.dataToDisplay, o => o.data_type === this.props.dataType && o.index === this.props.index).page || 0;
            return this.tabView && this.tabView.goToPage && this.tabView.goToPage(initialPage);
        }, 500);
    }

    _toggleRichDataView = () => {
        const { getBiomechanicsDetails, plan, session, user, } = this.props;
        const { dataToDisplay, } = this.state;
        const userId = user.id;
        const sessionId = session.id;
        let doWeHaveRichData = true;
        _.map(dataToDisplay, data => {
            if(!session[data.index].asymmetry) {
                doWeHaveRichData = false;
            }
        });
        let currentPlan = plan.dailyPlan[0];
        this.setState(
            {
                isToggleBtnDisabled: true,
                loading:             !doWeHaveRichData,
            },
            () => {
                if(!doWeHaveRichData) {
                    return getBiomechanicsDetails(userId, sessionId, currentPlan, dataToDisplay)
                        .then(res => this.setState({ loading: false, }))
                        .catch(err => this.setState({ loading: false, }));
                }
                return false;
            },
        );
    }

    render = () => {
        const { plan, session, } = this.props;
        const { currentTabDetails, dataToDisplay, initialPage, loading, } = this.state;
        let sportName = _.find(MyPlanConstants.teamSports, o => o.index === session.sport_name).label || '';
        const sessionDateMoment = moment(session.event_date_time.replace('Z', ''));
        let isToday = moment().isSame(sessionDateMoment, 'day');
        let sessionDateTime = isToday ? `Today, ${sessionDateMoment.format('hh:mma')}` : sessionDateMoment.format('MMM DD, hh:mma');
        let sessionDuration = SensorLogic.convertMinutesToHrsMins(session.duration, true);
        const dailyPlanObj = plan.dailyPlan[0] || false;
        let trends = dailyPlanObj ? dailyPlanObj.trends : false;
        let biomechanicsSummary = trends && trends.biomechanics_summary ? trends.biomechanics_summary : false;
        let sessionDetails = biomechanicsSummary && _.find(biomechanicsSummary.sessions, s => s.id === session.id) || {};
        return (
            <ScrollView
                contentContainerStyle={Platform.OS === 'ios' ? {} : {flex: 1,}}
                nestedScrollEnabled={true}
                style={{backgroundColor: AppColors.white, flex: 1,}}
            >

                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',  paddingHorizontal: AppSizes.padding, paddingTop: AppSizes.statusBarHeight > 0 ? (AppSizes.statusBarHeight + AppSizes.paddingSml) : AppSizes.paddingLrg,}}>
                    <TabIcon
                        color={AppColors.zeplin.slateLight}
                        icon={'chevron-left'}
                        onPress={() => Actions.pop()}
                        reverse={false}
                        size={30}
                        type={'material-community'}
                    />
                    <View>
                        <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(session.score.color), fontSize: AppFonts.scaleFont(13), textAlign: 'right',}}>
                            {`${session.score.value}`}
                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(13),}}>
                                {'/100'}
                            </Text>
                        </Text>
                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11), textAlign: 'right',}}>
                            {sessionDateTime}
                        </Text>
                    </View>
                </View>

                <ScrollableTabView
                    initialPage={initialPage}
                    onChangeTab={details => this.setState({ currentTabDetails: details, })}
                    page={currentTabDetails && currentTabDetails.i ? currentTabDetails.i : initialPage}
                    ref={tabView => { this.tabView = tabView; }}
                    renderTabBar={() =>
                        <ScrollableTabBar
                            renderTab={(name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle) =>
                                TrendsTabBar.renderTab(
                                    name,
                                    page,
                                    isTabActive,
                                    onPressHandler,
                                    onLayoutHandler,
                                    subtitle,
                                    this.tabView
                                )
                            }
                            style={{backgroundColor: AppColors.white, borderBottomWidth: 0,}}
                        />
                    }
                    style={{flex: 1, marginTop: AppSizes.paddingLrg,}}
                    tabBarActiveTextColor={AppColors.zeplin.slateLight}
                    tabBarInactiveTextColor={AppColors.zeplin.slateXLight}
                    // tabBarUnderlineStyle={{borderColor: AppColors.zeplin.slateLight, borderRadius: 100, borderWidth: 4,}}
                    tabBarUnderlineStyle={{backgroundColor: AppColors.white, borderColor: AppColors.white, borderBottomWidth: 0, height: 0,}}
                >
                    {_.map(dataToDisplay, (data, i) =>
                        <View
                            key={i}
                            tabLabel={session[data.index].child_title}
                            style={{flex: 1,}}
                        >
                            <BiomechanicsTabView
                                data={data}
                                session={sessionDetails}
                            />
                        </View>
                    )}
                </ScrollableTabView>

                { loading ?
                    <Loading
                        text={'Loading data...'}
                    />
                    :
                    null
                }

            </ScrollView>
        );
    }
}

Biomechanics.propTypes = {
    dataType:               PropTypes.number.isRequired,
    getBiomechanicsDetails: PropTypes.func.isRequired,
    index:                  PropTypes.string.isRequired,
    plan:                   PropTypes.object.isRequired,
    session:                PropTypes.object.isRequired,
    user:                   PropTypes.object.isRequired,
};

Biomechanics.defaultProps = {};

Biomechanics.componentName = 'Biomechanics';

/* Export Component ================================================================== */
export default Biomechanics;
