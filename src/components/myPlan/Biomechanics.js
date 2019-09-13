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
import { Button, ParsedText, Spacer, TabIcon, Text, } from '../custom';
import { BiomechanicsCharts, } from './graphs';
import { Loading, } from '../general';
import { AppUtil, PlanLogic, } from '../../lib';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Badge, Divider, } from 'react-native-elements';
import _ from 'lodash';
import SlidingUpPanel from 'rn-sliding-up-panel';
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
        let currentIndex = props.dataType === 0 ?
            _.findLastIndex(this.props.plan.dailyPlan[0].trends.biomechanics_apt.sessions)
            :
            _.findLastIndex(this.props.plan.dailyPlan[0].trends.biomechanics_ankle_pitch.sessions);
        this.state  = {
            currentIndex:        currentIndex,
            isRichDataView:      false,
            isToggleBtnDisabled: false,
            loading:             false,
        };
        this.scrollView = {};
        this._panel = {};
    }

    componentDidMount = () => {
        _.delay(() => {
            this.scrollView.scrollToEnd({ animated: true, });
            this._toggleRichDataView();
        }, 10); // scroll view to end
    }

    _toggleRichDataView = () => {
        const { dataType, getBiomechanicsDetails, plan, user, } = this.props;
        const { currentIndex, } = this.state;
        let sessions = dataType === 0 ?
            plan.dailyPlan[0].trends.biomechanics_apt.sessions
            :
            plan.dailyPlan[0].trends.biomechanics_ankle_pitch.sessions;
        let asymmetryIndex = dataType === 0 ? 'apt' : 'ankle_pitch';
        let doWeHaveRichData = sessions[currentIndex].asymmetry[asymmetryIndex].detail_data;
        this.setState(
            {
                isRichDataView:      !this.state.isRichDataView,
                isToggleBtnDisabled: true,
                loading:             !doWeHaveRichData && !this.state.isRichDataView,
            },
            () => {
                if(this.state.isRichDataView && !doWeHaveRichData) {
                    return getBiomechanicsDetails(plan.dailyPlan[0], dataType, user.id)
                        .then(res => this.setState({ isToggleBtnDisabled: false, loading: false, }))
                        .catch(err => this.setState({ isToggleBtnDisabled: false, loading: false, }));
                }
                return _.delay(() => this.setState({ isToggleBtnDisabled: false, }), 250);
            },
        );
    }

    _toggleSelectedDate = newIndex => this.setState({ currentIndex: newIndex, })

    render = () => {
        const { dataType, plan, } = this.props;
        const { currentIndex, loading, } = this.state;
        if(dataType === 0) {
            let {
                leftPieInnerRadius,
                leftPieWidth,
                parsedData,
                pieData,
                pieLeftWrapperWidth,
                pieRightWrapperWidth,
                rightPieInnerRadius,
                rightPieWidth,
                selectedAptSession,
                sessionDuration,
                sessionSportName,
                sessionStartTimeDuration,
                sessions,
                updatedChartData,
            } = PlanLogic.handleBiomechanicsAptRenderLogic(plan, currentIndex);
            return (
                <View style={{backgroundColor: AppColors.white, flex: 1,}}>

                    <View style={{backgroundColor: AppColors.white, height: AppSizes.statusBarHeight,}} />

                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        bounces={false}
                        nestedScrollEnabled={true}
                    >

                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingMed,}}>
                            <TabIcon
                                color={AppColors.zeplin.slateLight}
                                containerStyle={[{flex: 1,}]}
                                icon={'chevron-left'}
                                onPress={() => Actions.pop()}
                                size={40}
                                type={'material-community'}
                            />
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 8, fontSize: AppFonts.scaleFont(24), textAlign: 'center',}}>{'Pelvic Tilt'}</Text>
                            <TabIcon
                                color={AppColors.zeplin.slateXLight}
                                containerStyle={[{flex: 1,}]}
                                icon={'help-circle-outline'}
                                onPress={() => this._panel.show()}
                                size={30}
                                type={'material-community'}
                            />
                        </View>

                        <Spacer size={AppSizes.padding} />

                        <ScrollView
                            centerContent={true}
                            contentContainerStyle={{flex: 1,}}
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
                            <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingXSml,}}>
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

                        <View style={{alignItems: 'center', justifyContent: 'center', marginHorizontal: AppSizes.paddingMed,}}>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(17), textAlign: 'center',}}>{sessionSportName}</Text>
                            <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{sessionStartTimeDuration}</Text>
                        </View>

                        <View style={{marginHorizontal: AppSizes.paddingMed, marginTop: AppSizes.paddingMed,}}>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginBottom: AppSizes.paddingSml, marginHorizontal: (AppSizes.paddingLrg - AppSizes.paddingMed),}}>{'Average Range of Motion'}</Text>
                            <BiomechanicsCharts
                                dataType={dataType}
                                pieDetails={{
                                    leftPieInnerRadius,
                                    leftPieWidth,
                                    pieData,
                                    pieLeftWrapperWidth,
                                    pieRightWrapperWidth,
                                    rightPieInnerRadius,
                                    rightPieWidth,
                                }}
                                selectedSession={selectedAptSession}
                                showTitle={false}
                            />
                        </View>

                        <View style={{marginBottom: AppSizes.paddingLrg, marginTop: AppSizes.paddingMed,}}>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginBottom: AppSizes.paddingSml, marginHorizontal: AppSizes.paddingLrg,}}>{'Asymmetry Timeline'}</Text>
                            <BiomechanicsCharts
                                chartData={updatedChartData}
                                dataType={dataType}
                                isRichDataView={true}
                                sessionDuration={sessionDuration}
                                selectedSession={selectedAptSession}
                                showTitle={false}
                            />
                        </View>

                        <ParsedText
                            parse={parsedData}
                            style={[AppStyles.robotoLight, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), marginHorizontal: AppSizes.paddingLrg,},]}
                        >
                            {selectedAptSession.asymmetry.apt.detail_text ? selectedAptSession.asymmetry.apt.detail_text : ''}
                        </ParsedText>

                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthTwoThirds,}}
                            containerStyle={{alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, marginTop: AppSizes.paddingLrg, width: AppSizes.screen.widthTwoThirds,}}
                            onPress={() => AppUtil.pushToScene('myPlan')}
                            raised={true}
                            title={'Go to your plan'}
                            titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                        />

                        { loading ?
                            <Loading
                                text={'Loading data...'}
                            />
                            :
                            null
                        }

                    </ScrollView>

                    <SlidingUpPanel
                        allowDragging={false}
                        backdropOpacity={0.8}
                        backdropStyle={{backgroundColor: AppColors.zeplin.navy,}}
                        ref={ref => {this._panel = ref;}}
                    >
                        <View style={{flex: 1, flexDirection: 'column',}}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this._panel.hide()}
                                style={{flex: 1,}}
                            />
                            <View style={{backgroundColor: AppColors.white,}}>
                                <View style={{backgroundColor: AppColors.zeplin.superLight, flexDirection: 'row', padding: AppSizes.padding,}}>
                                    <Text robotoMedium style={{color: AppColors.zeplin.slate, flex: 9, fontSize: AppFonts.scaleFont(22),}}>{'Pelvic Tilt Asymmetry'}</Text>
                                    <TabIcon
                                        containerStyle={[{flex: 1,}]}
                                        icon={'close'}
                                        iconStyle={[{color: `${AppColors.black}${PlanLogic.returnHexOpacity(0.3)}`,}]}
                                        onPress={() => this._panel.hide()}
                                        reverse={false}
                                        size={30}
                                        type={'material-community'}
                                    />
                                </View>
                                <ScrollView style={{padding: AppSizes.paddingLrg,}}>
                                    <Text robotoBold style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'What is Pelvic Tilt Asymmetry?'}</Text>
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'Anterior pelvic motion asymmetry can be caused by uneven terrain or by imbalance in the lats, hip flexors, and a nearly a dozen other muscles.\n\nChronic asymmetry is likely driven by imbalances like over-activity, tightness, under-activity, and weakness in these muscles which can lead to skeletal misalignments. This has sweeping influence on other muscular structures affecting performance and increasing overuse injury risk.\n\nCombined with other movement data, training data, soreness, pain, and more we try to identify your body part imbalances and the best corrective exercise to efficiently address them.'}</Text>
                                    <Spacer size={AppSizes.padding} />
                                    <Text robotoBold style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'How It\'s Measured:'}</Text>
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'The range of anterior pelvic tilt is measured by the motion of your hips when you arch your lower back. We measure this range of motion while left foot is in contact with the ground and compare that to right foot ground contacts to identify asymmetry. We\'ll try to identify and correct the imbalances at the source to avoid the potential effects.\n\nFor best results, remember to consistently place your "hip sensor" in the center of your spine and on your sacrum, just above the tailbone.'}</Text>
                                </ScrollView>
                            </View>
                        </View>
                    </SlidingUpPanel>

                </View>
            );
        } else if(dataType === 1) {
            let {
                leftPieInnerRadius,
                leftPieWidth,
                parsedData,
                pieData,
                pieLeftWrapperWidth,
                pieRightWrapperWidth,
                rightPieInnerRadius,
                rightPieWidth,
                sessionDuration,
                sessionSportName,
                sessionStartTimeDuration,
                selectedAnklePitchSession,
                sessions,
                updatedChartData,
            } = PlanLogic.handleBiomechanicsAnklePitchRenderLogic(plan, currentIndex);
            return (
                <View style={{backgroundColor: AppColors.white, flex: 1,}}>

                    <View style={{backgroundColor: AppColors.white, height: AppSizes.statusBarHeight,}} />

                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        bounces={false}
                        nestedScrollEnabled={true}
                    >

                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingMed,}}>
                            <TabIcon
                                color={AppColors.zeplin.slateLight}
                                containerStyle={[{flex: 1,}]}
                                icon={'chevron-left'}
                                onPress={() => Actions.pop()}
                                size={40}
                                type={'material-community'}
                            />
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 8, fontSize: AppFonts.scaleFont(24), textAlign: 'center',}}>{'Leg Extension'}</Text>
                            <TabIcon
                                color={AppColors.zeplin.slateXLight}
                                containerStyle={[{flex: 1,}]}
                                icon={'help-circle-outline'}
                                onPress={() => this._panel.show()}
                                size={30}
                                type={'material-community'}
                            />
                        </View>

                        <Spacer size={AppSizes.padding} />

                        <ScrollView
                            centerContent={true}
                            contentContainerStyle={{flex: 1,}}
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
                            <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingXSml,}}>
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

                        <View style={{alignItems: 'center', justifyContent: 'center', marginHorizontal: AppSizes.paddingMed,}}>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(17), textAlign: 'center',}}>{sessionSportName}</Text>
                            <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{sessionStartTimeDuration}</Text>
                        </View>

                        <View style={{marginHorizontal: AppSizes.paddingMed, marginTop: AppSizes.paddingMed,}}>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginBottom: AppSizes.paddingSml, marginHorizontal: (AppSizes.paddingLrg - AppSizes.paddingMed),}}>{'Average Range of Motion'}</Text>
                            <BiomechanicsCharts
                                dataType={dataType}
                                pieDetails={{
                                    leftPieInnerRadius,
                                    leftPieWidth,
                                    pieData,
                                    pieLeftWrapperWidth,
                                    pieRightWrapperWidth,
                                    rightPieInnerRadius,
                                    rightPieWidth,
                                }}
                                selectedSession={selectedAnklePitchSession}
                                showTitle={false}
                            />
                        </View>

                        <View style={{marginBottom: AppSizes.paddingLrg, marginTop: AppSizes.paddingMed,}}>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginBottom: AppSizes.paddingSml, marginHorizontal: AppSizes.paddingLrg,}}>{'Asymmetry Timeline'}</Text>
                            <BiomechanicsCharts
                                chartData={updatedChartData}
                                dataType={dataType}
                                isRichDataView={true}
                                sessionDuration={sessionDuration}
                                selectedSession={selectedAnklePitchSession}
                                showTitle={false}
                            />
                        </View>

                        <ParsedText
                            parse={parsedData}
                            style={[AppStyles.robotoLight, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), marginHorizontal: AppSizes.paddingLrg,},]}
                        >
                            {selectedAnklePitchSession.asymmetry.ankle_pitch.detail_text ? selectedAnklePitchSession.asymmetry.ankle_pitch.detail_text : ''}
                        </ParsedText>

                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthTwoThirds,}}
                            containerStyle={{alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding, marginTop: AppSizes.paddingLrg, width: AppSizes.screen.widthTwoThirds,}}
                            onPress={() => AppUtil.pushToScene('myPlan')}
                            raised={true}
                            title={'Go to your plan'}
                            titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                        />

                        { loading ?
                            <Loading
                                text={'Loading data...'}
                            />
                            :
                            null
                        }

                    </ScrollView>

                    <SlidingUpPanel
                        allowDragging={false}
                        backdropOpacity={0.8}
                        backdropStyle={{backgroundColor: AppColors.zeplin.navy,}}
                        ref={ref => {this._panel = ref;}}
                    >
                        <View style={{flex: 1, flexDirection: 'column',}}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this._panel.hide()}
                                style={{flex: 1,}}
                            />
                            <View style={{backgroundColor: AppColors.white,}}>
                                <View style={{backgroundColor: AppColors.zeplin.superLight, flexDirection: 'row', padding: AppSizes.padding,}}>
                                    <Text robotoMedium style={{color: AppColors.zeplin.slate, flex: 9, fontSize: AppFonts.scaleFont(22),}}>{'Leg Extension Asymmetry'}</Text>
                                    <TabIcon
                                        containerStyle={[{flex: 1,}]}
                                        icon={'close'}
                                        iconStyle={[{color: `${AppColors.black}${PlanLogic.returnHexOpacity(0.3)}`,}]}
                                        onPress={() => this._panel.hide()}
                                        reverse={false}
                                        size={30}
                                        type={'material-community'}
                                    />
                                </View>
                                <ScrollView style={{padding: AppSizes.paddingLrg,}}>
                                    <Text robotoBold style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'What is Leg Extension Asymmetry?'}</Text>
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'Leg Extension is the Range of Motion (ROM) of your leg through your stride. We use this to derive insights into your form, from ground contact all the way through leg extension at your hips.\n\nMany muscles can contribute to this asymmetry, but we try to isolate the source by synthesizing this with other movement patterns observed at your hips (like anterior rotation or hip drop).\n\nCommon culprits are asymmetrically tight or shortened psoas, quads, TFL, adductor complex, or sartorius muscles.'}</Text>
                                    <Spacer size={AppSizes.padding} />
                                    <Text robotoBold style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'How It\'s Measured:'}</Text>
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{'We look at the angle of your leg when your foot hits the ground and measure all the way through the highest point of your kick-back.\n\nWe then look for asymmetries between the way your left and right leg move under various cadences, speeds, and other conditions.\n\nAny imbalances in leg extension are considered in context and in combination with other movement variables to hone in on potential compensations, injury risk factors, and asymmetric stress distribution.'}</Text>
                                </ScrollView>
                            </View>
                        </View>
                    </SlidingUpPanel>

                </View>
            );
        }
        return (
            <View />
        );
    }
}

Biomechanics.propTypes = {
    dataType:               PropTypes.number.isRequired,
    getBiomechanicsDetails: PropTypes.func.isRequired,
    plan:                   PropTypes.object.isRequired,
    user:                   PropTypes.object.isRequired,
};

Biomechanics.defaultProps = {};

Biomechanics.componentName = 'Biomechanics';

/* Export Component ================================================================== */
export default Biomechanics;
