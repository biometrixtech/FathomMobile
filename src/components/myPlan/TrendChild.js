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
import { Button, DeckCards, Spacer, TabIcon, Text, Tooltip, } from '../custom';
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
        fontSize: AppFonts.scaleFont(15),
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
        backgroundColor: AppColors.white,
        borderRadius:    6,
        marginBottom:    AppSizes.paddingSml,
        width:           '48%',
    },
});

/* Component ==================================================================== */
const TooltipContent = ({ handleTooltipClose, }) => (
    <View style={{padding: AppSizes.paddingSml,}}>
        <View>
            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginBottom: AppSizes.padding,}}>{'Your Recovery Efficiency Score'}</Text>
            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), marginBottom: AppSizes.padding,}}>{'Your RES measures your training sustainability by estimating if your tissues are accumulating micro-damage overtime in response to training.\n\nTo increase your score, increase your rate of recovery by engaging in more Fathom Recovery activities or decrease your training volume.'}</Text>
            <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.successLight, borderRadius: 6, height: '100%', justifyContent: 'center', marginRight: AppSizes.paddingSml, width: '20%',}}>
                    <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(14),}}>{'50-100'}</Text>
                </View>
                <Text robotoLight style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12),}}>{'Your recovery and training balance are sustainable'}</Text>
            </View>
            <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.warningLight, borderRadius: 6, height: '100%', justifyContent: 'center', marginRight: AppSizes.paddingSml, width: '20%',}}>
                    <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(14),}}>{'25-49'}</Text>
                </View>
                <Text robotoLight style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12),}}>{'Recovery should be a high priority to restore balance'}</Text>
            </View>
            <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', marginBottom: AppSizes.padding,}}>
                <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.errorLight, borderRadius: 6, height: '100%', justifyContent: 'center', marginRight: AppSizes.paddingSml, width: '20%',}}>
                    <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(14),}}>{'0-24'}</Text>
                </View>
                <Text robotoLight style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12),}}>{'Recovery should be a higher priority than your training'}</Text>
            </View>
        </View>
        <TouchableOpacity onPress={handleTooltipClose} style={{alignSelf: 'flex-end',}}>
            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22),}}>
                {'GOT IT'}
            </Text>
        </TouchableOpacity>
    </View>
);

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
            currentCardIndex: adjustedIndex === -1 ? 0 : adjustedIndex,
            isCardSwiping:    false,
            isToolTipOpen:    false,
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
        const { currentCardIndex, isCardSwiping, isToolTipOpen, } = this.state;
        let {
            currentAlert,
            insightDetails,
            insightTitle,
            startSliceValue,
        } = PlanLogic.handleTrendChildRenderLogic(currentCardIndex, insightType, plan);
        let currentAlertText = PlanLogic.handleChartTitleRenderLogic(currentAlert, styles.cardSubtitle, isToolTipOpen);
        return (
            <ScrollView
                contentContainerStyle={{flexDirection: 'column', flexGrow: 1,}}
                automaticallyAdjustContentInsets={false}
                bounces={false}
                nestedScrollEnabled={true}
                scrollEnabled={!isCardSwiping}
            >

                <LinearGradient
                    colors={['rgb(255, 255, 255)', 'rgb(254, 254, 254)', 'rgb(240, 240, 240)']}
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
                        <View style={{paddingHorizontal: AppSizes.paddingLrg,}}>
                            <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(28),}}>
                                {_.toUpper(insightTitle)}
                            </Text>
                            { currentAlertText && currentAlert.visualization_type === 5 ?
                                <Tooltip
                                    animated
                                    childrenExtraStyles={{alignItems: 'flex-start',}}
                                    childrenViewStyle={{flex: 1,}}
                                    content={
                                        <TooltipContent
                                            handleTooltipClose={() => this.setState({ isToolTipOpen: false, })}
                                        />
                                    }
                                    isVisible={isToolTipOpen}
                                    onClose={() => {}}
                                    parentViewStyle={{flex: 1,}}
                                    tooltipStyle={{left: 30, width: (AppSizes.screen.width - 60),}}
                                >
                                    <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                        {currentAlertText}
                                        <TabIcon
                                            color={isToolTipOpen ? AppColors.white : AppColors.zeplin.slateXLight}
                                            containerStyle={[{marginLeft: AppSizes.paddingSml,}]}
                                            icon={'help-circle'}
                                            onPress={() => this.setState({ isToolTipOpen: true, },)}
                                            size={20}
                                            type={'material-community'}
                                        />
                                    </View>
                                </Tooltip>
                                : currentAlertText ?
                                    currentAlertText
                                    :
                                    null
                            }
                        </View>
                    </View>

                    <View style={{marginBottom: AppSizes.padding,}}>
                        <FathomCharts
                            barData={PlanLogic.handleBarChartRenderLogic(plan, startSliceValue)}
                            containerWidth={AppSizes.screen.width}
                            currentAlert={currentAlert}
                            startSliceValue={startSliceValue}
                        />
                    </View>

                    <View style={{borderRadius: 6, marginBottom: AppSizes.padding,}}>
                        <DeckCards
                            cards={insightDetails.alerts}
                            dragEnd={() => this.setState({ isCardSwiping: false, })}
                            dragStart={() => this.setState({ isCardSwiping: true, })}
                            handleReadInsight={index => this._handleDeckCardsSwipe(index)}
                            infinite={true}
                            isVisible={true}
                            shouldNavigate={false}
                            showDate={false}
                            startIndex={currentCardIndex}

                        />
                    </View>

                    <View style={{marginBottom: AppSizes.paddingLrg, marginHorizontal: AppSizes.paddingLrg,}}>
                        <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18),}}>
                            {'OPTIMAL ROUTINE'}
                        </Text>
                        { insightDetails.cta.length === 0 ?
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), marginTop: AppSizes.paddingSml,}}>{'Recovery isn’t high priority today, but you can tap the "+" on the Plan page for a recovery-focused Mobilize on demand.'}</Text>
                            :
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), marginTop: AppSizes.paddingSml,}}>
                                {'In order to '}
                                <Text robotoBold>
                                    {insightDetails.goals.join(', ')}
                                </Text>
                                {' we’ll add the following activities to your plan at the optimal time:'}
                            </Text>
                        }
                        <View style={[styles.tilesContainer,]}>
                            {_.map(insightDetails.cta, (cta, key) => {
                                let imageSource = require('../../../assets/images/standard/mobilize_tab.png');
                                switch (cta.name) {
                                case 'active_recovery':
                                    imageSource = require('../../../assets/images/standard/active_recovery_tab.png');
                                    break;
                                case 'heat':
                                    imageSource = require('../../../assets/images/standard/heat_tab.png');
                                    break;
                                case 'ice':
                                    imageSource = require('../../../assets/images/standard/ice_tab.png');
                                    break;
                                case 'cwi':
                                    imageSource = require('../../../assets/images/standard/cwi_tab.png');
                                    break;
                                default:
                                    imageSource = require('../../../assets/images/standard/mobilize_tab.png');
                                }
                                return (
                                    <ImageBackground
                                        imageStyle={{borderRadius: 10,}}
                                        key={key}
                                        resizeMode={'cover'}
                                        source={imageSource}
                                        style={[styles.tile,]}
                                    >
                                        <View style={[styles.ctaWrapper,]}>
                                            <Text numberOfLines={1} oswaldRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15),}}>{_.toUpper(cta.header)}</Text>
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