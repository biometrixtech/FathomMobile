/**
 * TrendChild
 *
    <TrendChild
        insightType={insightType}
        plan={plan}
        triggerType={triggerType}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { Button, DeckCards, Spacer, TabIcon, Text, } from '../custom';
import { FathomCharts, } from './graphs';
import { PlanLogic, } from '../../lib';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    cardSubtitle: {
        color:    AppColors.zeplin.slate,
        fontSize: AppFonts.scaleFont(13),
    },
    ctaWrapper: {
        backgroundColor: AppColors.zeplin.splash,
        borderRadius:    6,
        opacity:         0.8,
        paddingBottom:   AppSizes.paddingSml,
        paddingLeft:     AppSizes.paddingMed,
        paddingTop:      AppSizes.paddingLrg,
    },
    tilesContainer: {
        alignItems:     'flex-start',
        flex:           1,
        flexDirection:  'row',
        flexWrap:       'wrap',
        justifyContent: 'space-between',
        marginTop:      AppSizes.paddingMed,
    },
    tile: {
        backgroundColor: '#82AEB9',
        borderRadius:    6,
        marginBottom:    AppSizes.paddingSml,
        width:           '48%',
    },
});

/* Component ==================================================================== */
class TrendChild extends PureComponent {
    constructor(props) {
        super(props);
        const { insightType, plan, } = props;
        const insightTitle = insightType === 0 ? 'stress' : insightType === 1 ? 'response' : 'biomechanics';
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let trends = dailyPlanObj ? dailyPlanObj.trends : {};
        let insightDetails = trends[insightTitle] ? trends[insightTitle] : { alerts: [], cta: [], goals: [], };
        let adjustedIndex = props.triggerType ? _.findIndex(insightDetails.alerts, ['trigger_type', props.triggerType]) : 0;
        this.state  = {
            currentCardIndex: adjustedIndex,
        };
    }

    _handleDeckCardsSwipe = index => {
        const { insightType, plan, } = this.props;
        const insightTitle = insightType === 0 ? 'stress' : insightType === 1 ? 'response' : 'biomechanics';
        let newIndex = (index + 1);
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let trends = dailyPlanObj ? dailyPlanObj.trends : {};
        let insightDetails = trends[insightTitle] ? trends[insightTitle] : { alerts: [], cta: [], goals: [], };
        let nextAlert = insightDetails.alerts[newIndex];
        this.setState({ currentCardIndex: nextAlert ? newIndex : 0, });
    }

    render = () => {
        const { insightType, plan, } = this.props;
        const { currentCardIndex, } = this.state;
        let {
            currentAlert,
            insightDetails,
            insightTitle,
            startSliceValue,
        } = PlanLogic.handleTrendChildRenderLogic(currentCardIndex, insightType, plan);
        let currentAlertText = PlanLogic.handleChartTitleRenderLogic(currentAlert, styles.cardSubtitle);
        return (
            <ScrollView
                contentContainerStyle={{flexDirection: 'column', flexGrow: 1,}}
                automaticallyAdjustContentInsets={false}
                bounces={false}
                nestedScrollEnabled={true}
            >

                <LinearGradient
                    colors={['rgb(255, 255, 255)', 'rgb(255, 255, 255)', 'rgb(255, 255, 255)']}//['rgb(255, 255, 255)', 'rgba(242, 242, 244, 0.05)', 'rgba(8, 24, 50, 0.05)']}
                    end={{x: 0.0, y: 1}}
                    locations={[0, 0.85, 0.95]}
                    start={{x: 0.0, y: 0.0}}
                    style={{flex: 1,}}
                >

                    <View style={{justifyContent: 'center', marginBottom: AppSizes.padding, marginTop: AppSizes.statusBarHeight,}}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => Actions.trends()}
                            style={{alignSelf: 'flex-start', padding: AppSizes.padding,}}
                        >
                            <TabIcon
                                color={AppColors.zeplin.slate}
                                icon={'chevron-left'}
                                size={40}
                                type={'material-community'}
                            />
                        </TouchableOpacity>
                        <View style={{paddingLeft: AppSizes.paddingLrg,}}>
                            <Text oswaldRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(25),}}>
                                {_.toUpper(insightTitle)}
                            </Text>
                            { currentAlertText &&
                                currentAlertText
                            }
                        </View>
                    </View>

                    <View style={{marginBottom: AppSizes.padding,}}>
                        <FathomCharts barData={PlanLogic.handleBarChartRenderLogic(plan, startSliceValue)} currentAlert={currentAlert} startSliceValue={startSliceValue} />
                    </View>

                    <View style={{backgroundColor: AppColors.white, borderRadius: 6, marginBottom: AppSizes.padding,}}>
                        <DeckCards
                            cards={insightDetails.alerts}
                            handleReadInsight={index => this._handleDeckCardsSwipe(index)}
                            infinite={true}
                            isVisible={true}
                            showDate={false}
                            startIndex={currentCardIndex}
                        />
                    </View>

                    <View style={{marginBottom: AppSizes.paddingLrg, marginHorizontal: AppSizes.paddingLrg,}}>
                        <Text oswaldRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(18),}}>
                            {'WHAT WE\'LL DO'}
                        </Text>
                        {/* NOTES: SO IF NO CTA, display next with 'Add an activity on My Plan' slate 13 robotoLight */}
                        <Text robotoLight style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(13), marginTop: AppSizes.paddingSml,}}>
                            {'In order to '}
                            <Text robotoBold>
                                {insightDetails.goals.join(', ')}
                            </Text>
                            {' we’ve added the following activities to your plan:'}
                        </Text>
                        <View style={[styles.tilesContainer,]}>
                            {_.map(insightDetails.cta, (cta, key) => {
                                let imageSource = require('../../../assets/images/standard/mobilize.png');
                                switch (cta.name) {
                                case 'active_recovery':
                                    imageSource = require('../../../assets/images/standard/active_recovery.png');
                                    break;
                                case 'heat':
                                    imageSource = require('../../../assets/images/standard/heat.png');
                                    break;
                                case 'ice':
                                    imageSource = require('../../../assets/images/standard/ice.png');
                                    break;
                                case 'cwi':
                                    imageSource = require('../../../assets/images/standard/cwi.png');
                                    break;
                                default:
                                    imageSource = require('../../../assets/images/standard/mobilize.png');
                                }
                                return (
                                    <ImageBackground
                                        key={key}
                                        resizeMode={'contain'}
                                        source={imageSource}
                                        style={[styles.tile,]}
                                    >
                                        <View style={[styles.ctaWrapper,]}>
                                            <Text numberOfLines={1} oswaldRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15),}}>{cta.header}</Text>
                                            <Text numberOfLines={1} robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(11),}}>{cta.benefit}</Text>
                                            <Text numberOfLines={1} robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(10),}}>{cta.proximity}</Text>
                                        </View>
                                    </ImageBackground>
                                );
                            })}
                        </View>
                    </View>

                    <View style={[AppStyles.containerCentered]}>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, width: AppSizes.screen.widthThird,}}
                            containerStyle={[{width: AppSizes.screen.widthThird,}]}
                            onPress={() => Actions.myPlan()}
                            raised={true}
                            title={'My Plan'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                        />
                    </View>

                    <Spacer size={AppSizes.paddingLrg} />

                </LinearGradient>

            </ScrollView>
        );
    }
}

TrendChild.propTypes = {
    insightType: PropTypes.number.isRequired,
    triggerType: PropTypes.number,
};

TrendChild.defaultProps = {
    triggerType: null,
};

TrendChild.componentName = 'TrendChild';

/* Export Component ================================================================== */
export default TrendChild;