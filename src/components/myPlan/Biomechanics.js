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
import { Platform, ScrollView, StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { AnimatedCircularProgress, Button, ParsedText, Spacer, TabIcon, Text, TrendsTabBar, } from '../custom';
import { BiomechanicsCharts, } from './graphs';
import { Loading, } from '../general';
import { AppUtil, PlanLogic, SensorLogic, } from '../../lib';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import moment from 'moment';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    dataCard: {
        backgroundColor: AppColors.white,
        borderRadius:    12,
        elevation:       4,
        flexDirection:   'row',
        marginTop:       AppSizes.paddingMed,
        padding:         AppSizes.paddingMed,
        shadowColor:     'rgba(0, 0, 0, 0.08)',
        shadowOffset:    { height: 4, width: 0, },
        shadowOpacity:   1,
        shadowRadius:    10,
    },
});

/* Component ==================================================================== */
const BiomechanicsTabView = ({ data, session, }) => {
    // TODO: MOVE TO UTIL FUNCTION
    let sessionData = session[data.index];
    let parsedDescriptionTextData = [];
    if(sessionData.description.active) {
        parsedDescriptionTextData = _.map(sessionData.description.bold_text, prop => {
            let newParsedData = {};
            newParsedData.pattern = new RegExp(prop.text, 'i');
            newParsedData.style = [AppStyles.robotoBold];
            return newParsedData;
        });
    }
    let parsedAsymmetryDetailTextData = [];
    if(sessionData && sessionData.asymmetry && sessionData.asymmetry.detail_text.length > 0) {
        parsedAsymmetryDetailTextData = _.map(sessionData.asymmetry.detail_bold_text, prop => {
            let newParsedData = {};
            newParsedData.pattern = new RegExp(prop.text, 'i');
            newParsedData.style = [AppStyles.robotoBold, {color: PlanLogic.returnInsightColorString(prop.color),}];
            return newParsedData;
        });
    }
    const extraInnerRadiusToRemove = Platform.OS === 'ios' ? 0 : 20;
    const pieWrapperWidth = (AppSizes.screen.widthHalf);
    const pieInnerRadius = (AppSizes.padding * 4);
    const pieDetails = {
        pieData:        sessionData.summary_data,
        pieHeight:      pieWrapperWidth,
        pieInnerRadius: (pieInnerRadius - extraInnerRadiusToRemove),
        piePadding:     AppSizes.paddingSml,
        pieWidth:       pieWrapperWidth,
    };
    let chartLegend = (sessionData && sessionData.asymmetry && sessionData.asymmetry.detail_legend) || [];
    let chartActiveLegend = _.find(chartLegend, legend => legend.active);
    let chartInactiveLegend = _.find(chartLegend, legend => !legend.active);
    let chartData = (sessionData && sessionData.asymmetry && sessionData.asymmetry.detail_data) || [];
    let updatedChartData = _.map(chartData, (chartDetails, index) => {
        let newDataObjLeft = {};
        newDataObjLeft.x = chartDetails.x;
        newDataObjLeft.y = chartDetails.y1;
        newDataObjLeft.color = PlanLogic.returnInsightColorString(chartDetails.flag === 1 ? chartActiveLegend.color[0] : chartInactiveLegend.color[0]);
        let newDataObjRight = {};
        newDataObjRight.x = chartDetails.x;
        newDataObjRight.y = chartDetails.y2;
        newDataObjRight.color = PlanLogic.returnInsightColorString(chartDetails.flag === 1 ? chartActiveLegend.color[1] : chartInactiveLegend.color[1]);
        return [newDataObjLeft, newDataObjRight];
    });
    let sessionHours = _.floor(session.duration / 3600);
    let updatedTime = session.duration - sessionHours * 3600;
    let sessionMinutes = _.floor(updatedTime / 60);
    let sessionSeconds = (new Array(2 + 1).join('0') + (updatedTime - sessionMinutes * 60)).slice(-2);
    let sessionDuration = `${sessionHours > 0 ? `${sessionHours}:` : ''}${sessionMinutes === 0 ? '00' : sessionHours > 0 && sessionMinutes < 10 ? `0${sessionMinutes}` : sessionMinutes}:${sessionSeconds === 0 ? '00' : sessionSeconds}`;
    return (
        <View style={{flex: 1,}}>
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
                dataType={data.dataType}
                pieDetails={pieDetails}
                selectedSession={sessionData}
            />
            <Spacer size={sessionData.data_cards.length > 0 ? AppSizes.paddingSml : 0} />
            {_.map(sessionData.data_cards, (card, key) => {
                let parsedCardSummaryTextTextData = [];
                if(card.summary_text.active) {
                    parsedCardSummaryTextTextData = _.map(card.summary_text.bold_text, prop => {
                        let newParsedData = {};
                        newParsedData.pattern = new RegExp(prop.text, 'i');
                        newParsedData.style = [AppStyles.robotoBold];
                        return newParsedData;
                    });
                }
                return (
                    <View
                        key={key}
                        style={[styles.dataCard,]}
                    >
                        { card.type === 0 ?
                            <View>{/*cell bars*/}</View>
                            : card.type === 1 ?
                                <AnimatedCircularProgress
                                    arcSweepAngle={320}
                                    backgroundColor={AppColors.zeplin.superLight}
                                    fill={card.value}
                                    lineCap={'round'}
                                    rotation={200}
                                    size={AppSizes.screen.widthQuarter}
                                    style={{marginRight: AppSizes.paddingSml, paddingHorizontal: AppSizes.paddingXSml, paddingVertical: AppSizes.paddingXSml,}}
                                    tintColor={PlanLogic.returnInsightColorString(card.color)}
                                    width={15}

                                    childrenContainerStyle={{marginLeft: 5, marginTop: AppSizes.paddingXSml,}}
                                >
                                    {
                                        (fill) => (
                                            <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(card.color), fontSize: AppFonts.scaleFont(18),}}>
                                                {`${card.value}%`}
                                            </Text>
                                        )
                                    }
                                </AnimatedCircularProgress>
                                :
                                <View>{/*fatigue*/}</View>
                        }
                        <View style={{flexShrink: 1, justifyContent: 'center', marginLeft: AppSizes.paddingMed,}}>
                            <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(card.color), fontSize: AppFonts.scaleFont(18),}}>
                                {card.title_text}
                            </Text>
                            {(card.summary_text.active && card.summary_text.text.length > 0) &&
                                <ParsedText
                                    parse={parsedCardSummaryTextTextData || []}
                                    style={{...AppStyles.robotoRegular, color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12), lineHeight: AppFonts.scaleFont(18), marginTop: AppSizes.paddingSml,}}
                                >
                                    {card.summary_text.text}
                                </ParsedText>
                            }
                            {_.map(card.summary_text.text_items, (text, i) => {
                                let parsedTextItemsData = _.map(card.summary_text.text_items.bold_text, prop => {
                                    let newParsedData = {};
                                    newParsedData.pattern = new RegExp(prop.text, 'i');
                                    newParsedData.style = [AppStyles.robotoBold];
                                    return newParsedData;
                                });
                                return (
                                    <View key={i} style={{flexShrink: 1, flexDirection: 'row',}}>
                                        <ParsedText
                                            parse={parsedTextItemsData || []}
                                            style={{...AppStyles.robotoLight, color: AppColors.zeplin.slate, flexShrink: 1, flexWrap: 'wrap', fontSize: AppFonts.scaleFont(12), lineHeight: AppFonts.scaleFont(18),}}
                                        >
                                            {`\u2022 ${text.text}`}
                                        </ParsedText>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                );
            })}
            <View style={{marginBottom: AppSizes.paddingMed, marginTop: AppSizes.paddingLrg,}}>
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginBottom: AppSizes.paddingSml, marginHorizontal: AppSizes.paddingLrg,}}>{'Workout Timeline'}</Text>
                <BiomechanicsCharts
                    chartData={_.flatten(updatedChartData)}
                    dataType={data.dataType}
                    isRichDataView={true}
                    sessionDuration={sessionDuration}
                    selectedSession={session}
                    showTitle={false}
                />
            </View>
            {(sessionData && sessionData.asymmetry && sessionData.asymmetry.detail_text.length > 0) &&
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
        </View>
    );
}

class Biomechanics extends PureComponent {
    constructor(props) {
        super(props);
        const { dataType, index, session, } = props;
        const dataToDisplay = _.filter(PlanLogic.returnTrendsTabs(), tab => tab.dataType || tab.dataType === 0);  // session.data_point; // TODO: FIX NME
        const initialPage = _.find(dataToDisplay, o => o.dataType === dataType && o.index === index).page || 0;
        this.state  = {
            currentTabDetails: {
                from: 0,
                i:    initialPage,
                ref:  {},
            },
            dataToDisplay,
            initialPage,
            loading: false,
        };
    }

    componentDidMount = () => {
        _.delay(() => this._toggleRichDataView(), 10);
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
        const { dataToDisplay, initialPage, loading, } = this.state;
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
            <View style={{flex: 1,}}>

                <ScrollView
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
                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(13),}}>
                                {`${sportName}, `}
                                <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(session.score.color), fontSize: AppFonts.scaleFont(13),}}>
                                    {`${session.score.value}%`}
                                </Text>
                            </Text>
                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11),}}>
                                {`${sessionDateTime}, ${sessionDuration}`}
                            </Text>
                        </View>
                    </View>

                    <ScrollableTabView
                        initialPage={initialPage}
                        onChangeTab={details => this.setState({ currentTabDetails: details, })}
                        renderTabBar={() => <TrendsTabBar />}
                        style={{marginTop: AppSizes.paddingLrg,}}
                        tabBarActiveTextColor={AppColors.zeplin.slateLight}
                        tabBarInactiveTextColor={AppColors.zeplin.slateXLight}
                        tabBarUnderlineStyle={{borderColor: AppColors.zeplin.slateLight, borderRadius: 100, borderWidth: 4,}}
                        tabStyle={{backgroundColor: 'red',}}
                    >
                        {_.map(dataToDisplay, (data, i) =>
                            <View
                                key={i}
                                tabLabel={session[data.index].child_title}
                                style={{flex: 1, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.padding,}}
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

            </View>
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
