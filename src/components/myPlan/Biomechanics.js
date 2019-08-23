/**
 * Biomechanics
 *
    <Biomechanics
        getBiomechanicsDetails={getBiomechanicsDetails}
        plan={plan}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { Badge, Divider, } from 'react-native-elements';
import { Spacer, TabIcon, Text, } from '../custom';
import { BiomechanicsCharts, } from './graphs';
import { Loading, } from '../general';
import { AppUtil, PlanLogic, } from '../../lib';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import moment from 'moment';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    circleStyle: circleSize => ({
        alignItems:      'center',
        backgroundColor: AppColors.white,
        borderRadius:    (circleSize / 2),
        height:          circleSize,
        justifyContent:  'center',
        marginBottom:    AppSizes.paddingSml,
        width:           circleSize,
    }),
});

/* Component ==================================================================== */
class Biomechanics extends PureComponent {
    constructor(props) {
        super(props);
        this.state  = {
            currentIndex:        _.findLastIndex(this.props.plan.dailyPlan[0].trends.biomechanics_summary.sessions),
            isRichDataView:      false,
            isToggleBtnDisabled: false,
            loading:             false,
        };
        this.scrollView = {};
    }

    componentDidMount = () => {
        _.delay(() => this.scrollView.scrollToEnd({animated: true}), 10); // scroll view to end
    }

    _toggleRichDataView = () => {
        const { getBiomechanicsDetails, plan, user, } = this.props;
        const { currentIndex, } = this.state;
        let doWeHaveRichData = plan.dailyPlan[0].trends.biomechanics_summary.sessions[currentIndex].asymmetry.apt.detail_data;
        this.setState(
            {
                isRichDataView:      !this.state.isRichDataView,
                isToggleBtnDisabled: true,
                loading:             !doWeHaveRichData && !this.state.isRichDataView,
            },
            () => {
                if(this.state.isRichDataView && !doWeHaveRichData) {
                    return getBiomechanicsDetails(plan.dailyPlan[0], user.id)
                        .then(res => this.setState({ isToggleBtnDisabled: false, loading: false, }))
                        .catch(err => this.setState({ isToggleBtnDisabled: false, loading: false, }));
                }
                return _.delay(() => this.setState({ isToggleBtnDisabled: false, }), 250);
            },
        );
    }

    _toggleSelectedDate = newIndex => {
        this.setState({ currentIndex: newIndex, });
    }

    render = () => {
        const { plan, } = this.props;
        const { currentIndex, isRichDataView, isToggleBtnDisabled, loading, } = this.state;
        let {
            leftPieInnerRadius,
            leftPieWidth,
            pieData,
            pieLeftWrapperWidth,
            pieRightWrapperWidth,
            rightPieInnerRadius,
            rightPieWidth,
            selectedSession,
            sessionDuration,
            sessionSportName,
            sessionStartTimeDuration,
            sessions,
            updatedChartData,
        } = PlanLogic.handleBiomechanicsRenderLogic(plan, currentIndex);
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1,}}>

                <View style={{backgroundColor: AppColors.white, height: AppSizes.statusBarHeight,}} />

                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    bounces={false}
                    nestedScrollEnabled={true}
                >

                    <View>
                        <TabIcon
                            color={AppColors.zeplin.slateLight}
                            containerStyle={[{alignSelf: 'flex-start',}]}
                            icon={'chevron-left'}
                            onPress={() => Actions.pop()}
                            size={40}
                            type={'material-community'}
                        />
                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'Biomechanics'}</Text>
                    </View>

                    <Spacer size={AppSizes.padding} />

                    <ScrollView
                        centerContent={true}
                        contentInset={{
                            bottom: 0,
                            left:   AppSizes.padding,
                            right:  AppSizes.padding,
                            top:    0,
                        }}
                        horizontal={true}
                        ref={scrollView => {this.scrollView = scrollView;}}
                        scrollEventThrottle={10}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={AppSizes.screen.width}
                    >
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingXSml,}}>
                            { _.map(sessions, (session, index) => {
                                // let remainingWidth = AppSizes.screen.width - (AppSizes.padding * 2);
                                // let size = (remainingWidth - (AppSizes.paddingMed * (sessions.length - 1))) / sessions.length;
                                let circleSize = 50;//_.floor(size) > 50 ? 50 : _.floor(size);
                                let sessionColor = session.asymmetry.body_side === 1 ?
                                    10
                                    : session.asymmetry.body_side === 2 ?
                                        4
                                        :
                                        13;
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        key={index}
                                        onPress={() => this._toggleSelectedDate(index)}
                                        style={{marginRight: index === (sessions.length - 1) ? 0 : AppSizes.paddingMed,}}
                                    >
                                        <View style={[AppStyles.scaleButtonShadowEffect, styles.circleStyle(circleSize),]}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>
                                                {moment(session.event_date_time).format('M/D')}
                                            </Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10), textAlign: 'center',}}>
                                                {moment(session.event_date_time).format('h:mma')}
                                            </Text>
                                        </View>
                                        { index === currentIndex ?
                                            <Divider style={{backgroundColor: sessionColor ? PlanLogic.returnInsightColorString(sessionColor) : AppColors.zeplin.slateLight, height: 2,}} />
                                            :
                                            <Divider style={{backgroundColor: AppColors.white, height: 2,}} />
                                        }
                                        { sessionColor &&
                                            <Badge
                                                containerStyle={{
                                                    elevation: 5,
                                                    left:      0,
                                                    position:  'absolute',
                                                    top:       0,
                                                }}
                                                badgeStyle={{
                                                    backgroundColor: PlanLogic.returnInsightColorString(sessionColor),
                                                    borderRadius:    (14 / 2),
                                                    height:          14,
                                                    minWidth:        14,
                                                }}
                                                status={'success'}
                                            />
                                        }
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    <Spacer size={AppSizes.paddingMed} />

                    <Divider style={{backgroundColor: AppColors.zeplin.superLight, height: 2,}} />

                    <Spacer size={AppSizes.padding} />

                    <View style={{flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingMed,}}>
                        <View style={{alignItems: 'center', flex: 2,}} />
                        <View style={{alignItems: 'center', flex: 6, justifyContent: 'center',}}>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(17), textAlign: 'center',}}>{sessionSportName}</Text>
                            <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{sessionStartTimeDuration}</Text>
                        </View>
                        <View style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center',}}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => isToggleBtnDisabled ? {} : this._toggleRichDataView()}
                                style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 10, paddingHorizontal: AppSizes.paddingSml,}]}
                            >
                                <Image
                                    resizeMode={'contain'}
                                    source={
                                        isRichDataView ?
                                            require('../../../assets/images/standard/summaryvisual.png')
                                            :
                                            require('../../../assets/images/standard/richdatavisual.png')
                                    }
                                    style={{alignSelf: 'center', height: 40, width: 40,}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    { isRichDataView && !loading ?
                        <View style={{marginHorizontal: AppSizes.paddingMed, marginTop: AppSizes.paddingMed,}}>
                            <TouchableOpacity
                                onPress={() => AppUtil.pushToScene('biomechanicsSummary', { currentIndex: currentIndex, step: 2, title: 'Pelvic Tilt Range of Motion', })}
                                style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 12,}]}
                            >
                                <BiomechanicsCharts
                                    chartData={updatedChartData}
                                    isRichDataView={true}
                                    sessionDuration={sessionDuration}
                                    selectedSession={selectedSession}
                                    showTitle={true}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{marginHorizontal: AppSizes.paddingMed, marginTop: AppSizes.paddingMed,}}>
                            <TouchableOpacity
                                onPress={() => AppUtil.pushToScene('biomechanicsSummary', { currentIndex: currentIndex, step: 1, title: 'Pelvic Tilt', })}
                                style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 12, flexDirection: 'row',}]}
                            >
                                <BiomechanicsCharts
                                    pieDetails={{
                                        leftPieInnerRadius,
                                        leftPieWidth,
                                        pieData,
                                        pieLeftWrapperWidth,
                                        pieRightWrapperWidth,
                                        rightPieInnerRadius,
                                        rightPieWidth,
                                    }}
                                    selectedSession={selectedSession}
                                    showTitle={true}
                                />
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={{flexDirection: 'row', marginHorizontal: AppSizes.paddingMed, marginVertical: AppSizes.padding,}}>
                        <TouchableOpacity
                            onPress={() => AppUtil.pushToScene('biomechanicsSummary', { currentIndex: currentIndex, step: 3, title: 'Effects of Asymmetry', })}
                            style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 12, marginRight: AppSizes.paddingSml, padding: AppSizes.paddingMed, width: ((AppSizes.screen.width - ((AppSizes.paddingMed * 2) + AppSizes.paddingSml)) / 2),}]}
                        >
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{'Effects of Asymmetry'}</Text>
                            <Image
                                resizeMode={'contain'}
                                source={require('../../../assets/images/standard/effectsasymmetry.png')}
                                style={{alignSelf: 'center', height: 125, marginTop: AppSizes.padding, width: 125,}}
                            />
                            <TabIcon
                                color={AppColors.zeplin.slateXLight}
                                containerStyle={[{bottom: AppSizes.paddingMed, position: 'absolute', right: AppSizes.paddingMed,}]}
                                icon={'chevron-right'}
                                size={20}
                                type={'material-community'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => AppUtil.pushToScene('biomechanicsSummary', { currentIndex: currentIndex, step: 4, title: 'Searching for Insights', })}
                            style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 12, padding: AppSizes.paddingMed, width: ((AppSizes.screen.width - ((AppSizes.paddingMed * 2) + AppSizes.paddingSml)) / 2),}]}
                        >
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{'Searching for Insights'}</Text>
                            <View style={{alignItems: 'center', alignSelf: 'center', height: 125, justifyContent: 'center', marginTop: AppSizes.padding, width: 125,}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/standard/research.png')}
                                    style={{height: 75, width: 75,}}
                                />
                            </View>
                            <TabIcon
                                color={AppColors.zeplin.slateXLight}
                                containerStyle={[{bottom: AppSizes.paddingMed, position: 'absolute', right: AppSizes.paddingMed,}]}
                                icon={'chevron-right'}
                                size={20}
                                type={'material-community'}
                            />
                        </TouchableOpacity>
                    </View>

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
    getBiomechanicsDetails: PropTypes.func.isRequired,
    plan:                   PropTypes.object.isRequired,
    user:                   PropTypes.object.isRequired,
};

Biomechanics.defaultProps = {};

Biomechanics.componentName = 'Biomechanics';

/* Export Component ================================================================== */
export default Biomechanics;
