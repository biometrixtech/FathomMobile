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
import { Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';
// import { Image, Platform, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { Badge, Divider, } from 'react-native-elements';
import { Spacer, TabIcon, Text, } from '../custom';
// import { BodyOverlay, } from '../custom';
// import { InsightsCharts, } from './graphs';
import { Loading, } from '../general';
import { AppUtil, PlanLogic, } from '../../lib';

// import third-party libraries
import * as V from 'victory-native';
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import moment from 'moment';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    circleStyle: (circleSize) => ({
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
class YAxisLabels extends PureComponent {
    render = () => {
        const { data, index, text, x, y, } = this.props;
        const currentData = data[index];
        console.log('this.props',this.props);
        // console.log('currentData',data,index,currentData);
        if(!currentData) {
            return (null);
        }
        return (
            <View style={{left: (x - this.props.style.padding), position: 'absolute', top: y,}}>
                <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(6),}}>{text}</Text>
            </View>
        );
    }
}

class Biomechanics extends PureComponent {
    constructor(props) {
        super(props);
        this.state  = {
            currentIndex:   _.findLastIndex(this.props.plan.dailyPlan[0].trends.biomechanics_summary.sessions),
            isRichDataView: false,
            loading:        false,
        };
    }

    _toggleRichDataView = () => {
        const { getBiomechanicsDetails, plan, } = this.props;
        const { currentIndex, } = this.state;
        let doWeHaveRichData = plan.dailyPlan[0].trends.biomechanics_summary.sessions[currentIndex].asymmetry.apt.detail_data;
        this.setState(
            {
                isRichDataView: !this.state.isRichDataView,
                loading:        !doWeHaveRichData,
            },
            () => {
                if(this.state.isRichDataView && !doWeHaveRichData) {
                    getBiomechanicsDetails(plan.dailyPlan[0])
                        .then(res => this.setState({ loading: false, }))
                        .catch(err => this.setState({ loading: false, }));
                }
            },
        );
    }

    _toggleSelectedDate = newIndex => {
        this.setState({ currentIndex: newIndex, });
    }

    render = () => {
        const { plan, } = this.props;
        const { currentIndex, isRichDataView, loading, } = this.state;
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
        console.log('selectedSession',selectedSession);
        console.log('updatedChartData',updatedChartData);
        console.log('pieData',pieData);
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1,}}>

                <View style={{backgroundColor: AppColors.white, height: AppSizes.statusBarHeight,}} />

                <ScrollView
                    contentContainerStyle={{flexDirection: 'column', flexGrow: 1,}}
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

                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.padding,}}>
                        { _.map(sessions, (session, index) => {
                            let remainingWidth = AppSizes.screen.width - (AppSizes.padding * 2);
                            let size = (remainingWidth - (AppSizes.paddingMed * (sessions.length - 1))) / sessions.length;
                            let circleSize = _.floor(size) > 50 ? 50 : _.floor(size);
                            let sessionColor = session.asymmetry.body_side === 1 ?
                                1
                                : session.asymmetry.body_side === 2 ?
                                    4
                                    :
                                    null;
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    key={index}
                                    onPress={() => this._toggleSelectedDate(index)}
                                    style={{marginRight: index === (sessions.length - 1) ? 0 : AppSizes.paddingMed,}}
                                >
                                    <View style={[AppStyles.scaleButtonShadowEffect, styles.circleStyle(circleSize),]}>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>
                                            {moment(session.start_date_time).format('M/D')}
                                        </Text>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10), textAlign: 'center',}}>
                                            {moment(session.start_date_time).format('h:mma')}
                                        </Text>
                                    </View>
                                    { index === currentIndex ?
                                        <Divider style={{backgroundColor: AppColors.zeplin.warningLight, height: 1,}} />
                                        :
                                        <Divider style={{backgroundColor: AppColors.white, height: 1,}} />
                                    }
                                    { sessionColor &&
                                        <Badge
                                            containerStyle={{
                                                left:     0,
                                                position: 'absolute',
                                                top:      0,
                                            }}
                                            badgeStyle={{
                                                backgroundColor: PlanLogic.returnInsightColorString(sessionColor),
                                                minWidth:        14,
                                                height:          14,
                                                borderRadius:    (14 / 2),
                                            }}
                                            status={'success'}
                                        />
                                    }
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Spacer size={AppSizes.paddingMed} />

                    <Divider style={{backgroundColor: AppColors.zeplin.superLight, height: 2,}} />

                    <Spacer size={AppSizes.padding} />

                    <View style={{flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingMed,}}>
                        <View style={{alignItems: 'center', flex: 1.5,}} />
                        <View style={{alignItems: 'center', flex: 7, justifyContent: 'center',}}>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(17), textAlign: 'center',}}>{sessionSportName}</Text>
                            <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{sessionStartTimeDuration}</Text>
                        </View>
                        <View style={{flex: 1.5, alignItems: 'center', justifyContent: 'center',}}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this._toggleRichDataView()}
                                style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 10, padding: AppSizes.paddingSml,}]}
                            >
                                <Text>{isRichDataView ? 'B' : 'A'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    { isRichDataView && !loading ?
                        <View style={{marginHorizontal: AppSizes.paddingMed, marginTop: AppSizes.paddingMed,}}>
                            <TouchableOpacity
                                onPress={() => AppUtil.pushToScene('biomechanicsSummary', { title: 'Rich Data Title', type: 2, })}
                                style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 12,}]}
                            >
                                <View style={{marginTop: AppSizes.paddingMed, paddingLeft: AppSizes.paddingLrg, paddingRight: AppSizes.paddingSml,}}>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14),}}>{'Rich Data Title'}</Text>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.paddingXSml, marginTop: AppSizes.paddingSml,}}>
                                        <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{'00:00'}</Text>
                                        <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{sessionDuration}</Text>
                                    </View>
                                    <Text robotoRegular style={{color: AppColors.zeplin.warningLight, fontSize: AppFonts.scaleFont(8),}}>{'left'}</Text>
                                </View>
                                <V.VictoryChart
                                    domain={{ y: [10, -10], }}
                                    padding={{bottom: AppSizes.paddingSml, left: AppSizes.paddingLrg, right: AppSizes.paddingSml, top: AppSizes.paddingSml,}}
                                    width={(AppSizes.screen.width - (AppSizes.paddingMed * 2))}
                                >
                                    {/* Y-Axis */}
                                    <V.VictoryAxis
                                        crossAxis={false}
                                        dependentAxis
                                        style={{
                                            axis:       { stroke: AppColors.transparent, size: 0, },
                                            grid:       { stroke: AppColors.zeplin.superLight, size: 0.5, },
                                            tickLabels: { ...AppFonts.robotoLight, color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(6), },
                                        }}
                                        tickCount={20}
                                        tickFormat={t => t < 0 ? (t * -1) : t}
                                    />
                                    {/* X-Axis */}
                                    <V.VictoryAxis
                                        style={{
                                            axis: { stroke: AppColors.white, size: 1, },
                                            grid: { stroke: AppColors.transparent, },
                                        }}
                                        tickFormat={t => ' '}
                                    />
                                    {/* Bar Chart */}
                                    <V.VictoryBar
                                        data={updatedChartData}
                                        style={{ data: { fill: d => d.color, }, }}
                                    />
                                </V.VictoryChart>
                                <View style={{marginBottom: AppSizes.paddingMed, paddingLeft: AppSizes.paddingLrg, paddingRight: AppSizes.paddingSml,}}>
                                    <Text robotoRegular style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(8),}}>{'right'}</Text>
                                </View>
                                <View style={{alignItems: 'center', justifyContent: 'center', marginHorizontal: AppSizes.paddingMed, marginBottom: AppSizes.paddingMed,}}>
                                    {_.map(selectedSession.asymmetry.apt.detail_legend, (legend, i) => (
                                        <View
                                            key={i}
                                            style={{flexDirection: 'row', marginBottom: i !== (selectedSession.asymmetry.apt.detail_legend.length - 1) ? AppSizes.paddingSml : 0,}}
                                        >
                                            {_.map(legend.color, (color, index) =>
                                                <View
                                                    key={index}
                                                    style={{
                                                        backgroundColor: PlanLogic.returnInsightColorString(color),
                                                        borderRadius:    (10 / 2),
                                                        height:          10,
                                                        marginRight:     AppSizes.paddingSml,
                                                        width:           10,
                                                    }}
                                                />
                                            )}
                                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(11),}}>{legend.text}</Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={{marginBottom: AppSizes.paddingMed, paddingRight: AppSizes.paddingSml,}}>
                                    <TabIcon
                                        color={AppColors.zeplin.slateXLight}
                                        containerStyle={[{alignSelf: 'flex-end',}]}
                                        icon={'chevron-right'}
                                        size={20}
                                        type={'material-community'}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{marginHorizontal: AppSizes.paddingMed, marginTop: AppSizes.paddingMed,}}>
                            <TouchableOpacity
                                onPress={() => AppUtil.pushToScene('biomechanicsSummary', { title: 'Pelvic Tilt', type: 1, })}
                                style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 12, flexDirection: 'row',}]}
                            >
                                <ImageBackground
                                    imageStyle={{borderRadius: 12,}}
                                    source={require('../../../assets/images/standard/apt_notilt.png')}
                                    style={{height: pieLeftWrapperWidth, width: pieLeftWrapperWidth,}}
                                >
                                    <V.VictoryPie
                                        cornerRadius={7}
                                        data={[
                                            {markTransparent: true, x: 0, y: 1.5,},
                                            {markTransparent: false, x: 1, y: pieData.right_y,},
                                        ]}
                                        height={pieLeftWrapperWidth}
                                        innerRadius={rightPieInnerRadius}
                                        labels={d => ''}
                                        startAngle={pieData.right_start_angle}
                                        style={{
                                            data: { fill: d => d.markTransparent ? AppColors.zeplin.splashLight : AppColors.transparent, },
                                        }}
                                        width={rightPieWidth}
                                    />
                                    <View style={{alignSelf: 'center', position: 'absolute', width: leftPieWidth,}}>
                                        <V.VictoryPie
                                            cornerRadius={7}
                                            data={[
                                                {markTransparent: true, x: 0, y: 1,},
                                                {markTransparent: false, x: 1, y: pieData.left_y,},
                                            ]}
                                            height={pieLeftWrapperWidth}
                                            innerRadius={leftPieInnerRadius}
                                            labels={d => ''}
                                            startAngle={pieData.left_start_angle}
                                            style={{
                                                data: { fill: d => d.markTransparent ? AppColors.zeplin.warningLight : AppColors.transparent, },
                                            }}
                                            width={leftPieWidth}
                                        />
                                    </View>
                                </ImageBackground>
                                <View style={{justifyContent: 'space-between', marginBottom: AppSizes.paddingSml, marginTop: AppSizes.paddingMed, paddingRight: AppSizes.paddingSml, width: pieRightWrapperWidth,}}>
                                    <View>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(24),}}>{'Pelvic Tilt'}</Text>
                                        <Spacer size={AppSizes.paddingXSml} />
                                        <Text robotoRegular style={{color: AppColors.zeplin.warningLight, fontSize: AppFonts.scaleFont(38),}}>{'[X]%'}</Text>
                                        <Spacer size={AppSizes.paddingXSml} />
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'[asymmetric static text]'}</Text>
                                    </View>
                                    <View>
                                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                                            <View
                                                style={{
                                                    backgroundColor: AppColors.zeplin.warningLight,
                                                    borderRadius:    (10 / 2),
                                                    height:          10,
                                                    marginRight:     AppSizes.paddingSml,
                                                    width:           10,
                                                }}
                                            />
                                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'Left side ROM'}</Text>
                                        </View>
                                        <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                            <View
                                                style={{
                                                    backgroundColor: AppColors.zeplin.splashLight,
                                                    borderRadius:    (10 / 2),
                                                    height:          10,
                                                    marginRight:     AppSizes.paddingSml,
                                                    width:           10,
                                                }}
                                            />
                                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'Right side ROM'}</Text>
                                        </View>
                                        <TabIcon
                                            color={AppColors.zeplin.slateXLight}
                                            containerStyle={[{alignSelf: 'flex-end',}]}
                                            icon={'chevron-right'}
                                            size={20}
                                            type={'material-community'}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={{flexDirection: 'row', marginHorizontal: AppSizes.paddingMed, marginVertical: AppSizes.padding,}}>
                        <TouchableOpacity
                            onPress={() => AppUtil.pushToScene('biomechanicsSummary', { title: 'Effects of Asymmetry', type: 3, })}
                            style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 12, marginRight: AppSizes.paddingSml, padding: AppSizes.paddingMed, width: ((AppSizes.screen.width - ((AppSizes.paddingMed * 2) + AppSizes.paddingSml)) / 2),}]}
                        >
                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{'Effects of Asymmetry'}</Text>
                            <TabIcon
                                color={AppColors.zeplin.slateXLight}
                                containerStyle={[{alignSelf: 'flex-end',}]}
                                icon={'chevron-right'}
                                size={20}
                                type={'material-community'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => AppUtil.pushToScene('biomechanicsSummary', { title: 'Searching for Insights', type: 4, })}
                            style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 12, padding: AppSizes.paddingMed, width: ((AppSizes.screen.width - ((AppSizes.paddingMed * 2) + AppSizes.paddingSml)) / 2),}]}
                        >
                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{'Searching for Insights'}</Text>
                            <Image
                                resizeMode={'contain'}
                                source={require('../../../assets/images/standard/research.png')}
                                style={{alignSelf: 'center', height: 75, marginTop: AppSizes.padding, width: 75,}}
                            />
                            <TabIcon
                                color={AppColors.zeplin.slateXLight}
                                containerStyle={[{alignSelf: 'flex-end',}]}
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
};

Biomechanics.defaultProps = {};

Biomechanics.componentName = 'Biomechanics';

/* Export Component ================================================================== */
export default Biomechanics;