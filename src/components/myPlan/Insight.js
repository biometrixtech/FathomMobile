/**
 * Insight
 *
    <Insight
        insightType={insightType}
        plan={plan}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';
// import { ImageBackground, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { BodyOverlay, Spacer, TabIcon, Text, } from '../custom';
// import { Button, DeckCards, Tooltip, } from '../custom';
// import { FathomCharts, } from './graphs';
import { PlanLogic, } from '../../lib';
// import { AppUtil, } from '../../lib';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor:  AppColors.white,
        borderRadius:     12,
        elevation:        2,
        marginBottom:     AppSizes.padding,
        marginHorizontal: AppSizes.paddingMed,
        padding:          AppSizes.padding,
    },
});

/* Component ==================================================================== */
class Insight extends PureComponent {
    constructor(props) {
        super(props);
        const { insightType, plan, } = props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let trends = dailyPlanObj ? dailyPlanObj.trends : {};
        let currentAlert = insightType === 7 ? trends.body_response : insightType === 8 ? trends.workload : {};
        let newCurrentDataIndex = _.findLastIndex(currentAlert.data); // TODO: update to trim array down first?
        this.state  = {
            currentDataIndex: newCurrentDataIndex,
        };
    }

    _renderPreviousPage = () => {
        const { currentDataIndex, } = this.state;
        let newPage = (currentDataIndex - 1); // TODO: DONT LET GO PAST CERTAIN INDEX
        this.setState({ currentDataIndex: newPage, });
    }

    _renderNextPage = () => {
        const { currentDataIndex, } = this.state;
        let newPage = (currentDataIndex + 1);
        this.setState({ currentDataIndex: newPage, });
    }

    render = () => {
        const { insightType, plan, } = this.props;
        const { currentDataIndex, } = this.state;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let trends = dailyPlanObj ? dailyPlanObj.trends : {};
        let insightTitle = insightType === 7 ? 'BODY RESPONSE' : insightType === 8 ? 'WORKOUTS' : 'BIOMECHANICS';
        let currentAlert = insightType === 7 ? trends.body_response : insightType === 8 ? trends.workload : {};
        let showRightDateButton = currentDataIndex !== (currentAlert.data.length - 1);
        let showLeftDateButton = currentDataIndex > 7;
        let selectedDate = moment(currentAlert.data[currentDataIndex].date, 'YYYY-MM-DD').format('ddd. MMM Do');
        let sessions = currentAlert.data[currentDataIndex].sessions;
        let cardTitle = insightType === 7 ? 'TISSUE REPORT' : insightType === 8 ? 'WORKOUT SUMMARY' : '';
        let subtitleText = currentAlert.data[currentDataIndex].status.text;
        let subtitleBoldedText = currentAlert.data[currentDataIndex].status.bolded_text;
        console.log(currentDataIndex,currentAlert,currentAlert.data[currentDataIndex]);
        let {
            icon,
            iconType,
            imageSource,
            subtitleColor,
            sportName,
        } = PlanLogic.handleTrendRenderLogic(currentAlert.data[currentDataIndex]);
        let cleanedSubtitleText = PlanLogic.handleTrendsTitleRenderLogic(subtitleBoldedText, subtitleText);
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1, paddingBottom: AppSizes.iphoneXBottomBarPadding,}}>

                <View style={{backgroundColor: AppColors.white, height: AppSizes.statusBarHeight,}} />

                <ScrollView
                    contentContainerStyle={{flexDirection: 'column', flexGrow: 1,}}
                    automaticallyAdjustContentInsets={false}
                    bounces={false}
                    nestedScrollEnabled={true}
                >

                    <LinearGradient
                        colors={['rgb(255, 255, 255)', 'rgb(254, 254, 254)', 'rgb(240, 240, 240)']}
                        style={{flex: 1,}}
                    >

                        <View style={{justifyContent: 'center', marginBottom: AppSizes.padding,}}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => Actions.pop()}
                                style={{alignSelf: 'flex-start', padding: AppSizes.padding,}}
                            >
                                <TabIcon
                                    color={AppColors.zeplin.slate}
                                    icon={'chevron-left'}
                                    size={40}
                                    type={'material-community'}
                                />
                            </TouchableOpacity>
                            <View style={{paddingHorizontal: AppSizes.paddingLrg,}}>
                                <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(28),}}>
                                    {_.toUpper(insightTitle)}
                                </Text>
                                <View style={{alignItems: 'center', flexDirection: 'row', marginTop: AppSizes.paddingSml,}}>
                                    { icon ?
                                        <TabIcon
                                            color={subtitleColor}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={icon}
                                            size={20}
                                            type={iconType}
                                        />
                                        : sportName ?
                                            <Image
                                                source={imageSource}
                                                style={{height: 20, marginRight: AppSizes.paddingSml, tintColor: subtitleColor, width: 20,}}
                                            />
                                            :
                                            null
                                    }
                                    {cleanedSubtitleText}
                                </View>
                            </View>
                        </View>

                        {/*<View style={{marginBottom: AppSizes.padding,}}>
                            <FathomCharts
                                barData={PlanLogic.handleBarChartRenderLogic(plan, startSliceValue)}
                                containerWidth={AppSizes.screen.width}
                                currentAlert={currentAlert}
                                startSliceValue={startSliceValue}
                            />
                        </View>*/}

                        <View style={[AppStyles.scaleButtonShadowEffect, styles.cardStyle,]}>

                            <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22),}}>
                                    {cardTitle}
                                </Text>
                                <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                    { showLeftDateButton &&
                                        <TabIcon
                                            color={AppColors.zeplin.slateLight}
                                            containerStyle={[{marginRight: AppSizes.paddingXSml,}]}
                                            icon={'chevron-left'}
                                            onPress={() => this._renderPreviousPage()}
                                            size={20}
                                        />
                                    }
                                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(13),}}>
                                        {selectedDate}
                                    </Text>
                                    { showRightDateButton &&
                                        <TabIcon
                                            color={AppColors.zeplin.slateLight}
                                            containerStyle={[{marginLeft: AppSizes.paddingXSml,}]}
                                            icon={'chevron-right'}
                                            onPress={() => this._renderNextPage()}
                                            size={20}
                                        />
                                    }
                                </View>
                            </View>

                            {/* PAGES? */}
                            { insightType === 7 ?
                                <View>
                                    <View style={{alignItems: 'center', borderBottomColor: AppColors.zeplin.slateXLight, borderBottomWidth: 1, paddingVertical: AppSizes.padding,}}>
                                        {/* BODY PART STUFF HERE */}
                                        <BodyOverlay
                                            bodyParts={currentAlert.data[currentDataIndex].body_parts}
                                            remainingWidth={(AppSizes.screen.width - (AppSizes.paddingMed + AppSizes.padding))}
                                        />
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.padding,}}>
                                        <View style={{marginRight: AppSizes.padding,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>
                                                {'Soreness'}
                                            </Text>
                                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingSml,}}>
                                                <View style={{backgroundColor: AppColors.zeplin.warningLight, borderRadius: (20 / 2), height: 20, marginRight: AppSizes.paddingSml, width: 20,}} />
                                                <View style={{backgroundColor: AppColors.zeplin.warningLight, borderRadius: (20 / 2), height: 20, marginRight: AppSizes.paddingSml, opacity: 0.5, width: 20,}} />
                                                <View style={{backgroundColor: AppColors.zeplin.warningLight, borderRadius: (20 / 2), height: 20, opacity: 0.25, width: 20,}} />
                                            </View>
                                        </View>
                                        <View>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>
                                                {'Pain'}
                                            </Text>
                                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingSml,}}>
                                                <View style={{backgroundColor: AppColors.zeplin.errorLight, borderRadius: (20 / 2), height: 20, marginRight: AppSizes.paddingSml, width: 20,}} />
                                                <View style={{backgroundColor: AppColors.zeplin.errorLight, borderRadius: (20 / 2), height: 20, marginRight: AppSizes.paddingSml, opacity: 0.5, width: 20,}} />
                                                <View style={{backgroundColor: AppColors.zeplin.errorLight, borderRadius: (20 / 2), height: 20, opacity: 0.25, width: 20,}} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                :  insightType === 8 ?
                                    sessions.length > 0 ?
                                        <View>
                                            {_.map(sessions, (session, i) => {
                                                let {
                                                    distance,
                                                    duration,
                                                    imageSource: sessionImageSource,
                                                    rpe,
                                                    source,
                                                    sportTitle,
                                                } = PlanLogic.handleWorkloadSessionRenderLogic(session);
                                                return (
                                                    <View key={i} style={[{paddingVertical: AppSizes.padding,} , (sessions.length - 1) !== i ? {borderBottomColor: AppColors.zeplin.slateXLight, borderBottomWidth: 1,} : {}]}>
                                                        <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                                            <Image
                                                                source={sessionImageSource}
                                                                style={{height: 30, marginRight: AppSizes.paddingSml, tintColor: subtitleColor, width: 30,}}
                                                            />
                                                            <Text oswaldRegular style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(20),}}>
                                                                {sportTitle}
                                                            </Text>
                                                            { source === 1 &&
                                                                <Image
                                                                    source={require('../../../assets/images/standard/health-kit.png')}
                                                                    style={{height: 30, marginLeft: AppSizes.paddingSml, width: 30,}}
                                                                />
                                                            }
                                                        </View>
                                                        <View style={{paddingHorizontal: AppSizes.paddingSml,}}>
                                                            <View style={{alignItems: 'center', flexDirection: 'row', marginTop: AppSizes.paddingMed,}}>
                                                                <TabIcon
                                                                    color={AppColors.zeplin.yellowLight}
                                                                    containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                                                    icon={'clock-outline'}
                                                                    size={20}
                                                                    type={'material-community'}
                                                                />
                                                                <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(15),}}>{duration}</Text>
                                                            </View>
                                                            <View style={{alignItems: 'center', flexDirection: 'row', marginTop: AppSizes.paddingMed,}}>
                                                                <TabIcon
                                                                    color={AppColors.zeplin.successLight}
                                                                    containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                                                    icon={'flash-on'}
                                                                    size={20}
                                                                />
                                                                <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(15),}}>{rpe}</Text>
                                                            </View>
                                                            { distance &&
                                                                <View style={{alignItems: 'center', flexDirection: 'row', marginTop: AppSizes.paddingMed,}}>
                                                                    <TabIcon
                                                                        color={AppColors.zeplin.splashLight}
                                                                        containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                                                        icon={'map-marker'}
                                                                        size={20}
                                                                        type={'material-community'}
                                                                    />
                                                                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(15),}}>{`${distance} ${session.distance > 0 ? 'miles' : 'mile'}`}</Text>
                                                                </View>
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                        :
                                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'No workouts logged'}</Text>
                                    :
                                    null
                            }


                        </View>

                    </LinearGradient>

                </ScrollView>

            </View>
        );
    }
}

Insight.propTypes = {
    insightType: PropTypes.number.isRequired,
};

Insight.defaultProps = {};

Insight.componentName = 'Insight';

/* Export Component ================================================================== */
export default Insight;