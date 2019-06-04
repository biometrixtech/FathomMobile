/**
 * Trends
 *
    <Trends
        plan={plan}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { FathomCharts, } from './graphs';
import { PlanLogic, } from '../../lib';
import { Text, } from '../custom';

// import third-party libraries
import { Actions } from 'react-native-router-flux';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: AppColors.white,
        borderRadius:    6,
        elevation:       2,
        marginBottom:    AppSizes.padding,
        paddingVertical: AppSizes.padding,
    },
    cardSubtitle: {
        color:             AppColors.zeplin.slate,
        fontSize:          AppFonts.scaleFont(13),
        paddingHorizontal: AppSizes.padding,
    },
    cardTitle: {
        color:             AppColors.zeplin.slate,
        fontSize:          AppFonts.scaleFont(25),
        paddingHorizontal: AppSizes.padding,
    },
    yAxis: {
        color:     AppColors.zeplin.slate,
        fontSize:  AppFonts.scaleFont(11),
        transform: [{ rotate: '-90deg'}],
        textAlign: 'center',
        width:     200,
    },
});

/* Component ==================================================================== */
class Trends extends PureComponent {
    constructor(props) {
        super(props);
    }

    render = () => {
        const { plan, } = this.props;
        let {
            currentBiomechanicsAlert,
            currentResponseAlert,
            currentStressAlert,
            extraBottomPadding,
        } = PlanLogic.handleTrendsRenderLogic(plan, Platform.OS);
        let currentStressAlertText = PlanLogic.handleChartTitleRenderLogic(currentStressAlert, styles.cardSubtitle);
        let currentResponseAlertText = PlanLogic.handleChartTitleRenderLogic(currentResponseAlert, styles.cardSubtitle);
        let currentBiomechanicsAlertText = PlanLogic.handleChartTitleRenderLogic(currentBiomechanicsAlert, styles.cardSubtitle);
        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                bounces={false}
                nestedScrollEnabled={true}
                style={{backgroundColor: AppColors.white, flex: 1, paddingBottom: (AppSizes.paddingLrg + AppSizes.paddingMed + 20 + AppFonts.scaleFont(11) + extraBottomPadding),}}
            >

                <View style={{backgroundColor: AppColors.zeplin.splash, paddingHorizontal: AppSizes.paddingMed,}}>
                    <View style={{flexDirection: 'row', height: AppSizes.navbarHeight, justifyContent: 'center', marginBottom: AppSizes.padding, marginTop: AppSizes.statusBarHeight,}}>
                        <View style={{flex: 1, justifyContent: 'center',}} />
                        <Image
                            source={require('../../../assets/images/standard/fathom-gold-and-white.png')}
                            style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
                        />
                        <View style={{flex: 1, justifyContent: 'center', paddingRight: AppSizes.paddingSml,}} />
                    </View>
                </View>

                <View style={{paddingHorizontal: AppSizes.paddingMed, paddingTop: AppSizes.paddingLrg,}}>
                    <TouchableOpacity
                        onPress={() => Actions.trendChild({ insightType: 0, })}
                        style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                    >
                        <Text oswaldRegular style={[styles.cardTitle,]}>{'STRESS'}</Text>
                        { currentStressAlertText &&
                            currentStressAlertText
                        }
                        <FathomCharts
                            barData={PlanLogic.handleBarChartRenderLogic(plan, 7)}
                            containerWidth={AppSizes.screen.width - (AppSizes.paddingMed * 2)}
                            currentAlert={currentStressAlert}
                            startSliceValue={7}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => Actions.trendChild({ insightType: 1, })}
                        style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                    >
                        <Text oswaldRegular style={[styles.cardTitle,]}>{'RESPONSE'}</Text>
                        { currentResponseAlertText &&
                            currentResponseAlertText
                        }
                        <FathomCharts
                            barData={PlanLogic.handleBarChartRenderLogic(plan, 7)}
                            containerWidth={AppSizes.screen.width - (AppSizes.paddingMed * 2)}
                            currentAlert={currentResponseAlert}
                            startSliceValue={7}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => Actions.trendChild({ insightType: 2, })}
                        style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                    >
                        <Text oswaldRegular style={[styles.cardTitle,]}>{'BIOMECHANICS'}</Text>
                        { currentBiomechanicsAlertText &&
                            currentBiomechanicsAlertText
                        }
                        <FathomCharts
                            barData={PlanLogic.handleBarChartRenderLogic(plan, 0)}
                            containerWidth={AppSizes.screen.width - (AppSizes.paddingMed * 2)}
                            currentAlert={currentBiomechanicsAlert}
                            startSliceValue={0}
                        />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        );
    }
}

Trends.propTypes = {
    plan: PropTypes.object.isRequired,
};

Trends.defaultProps = {};

Trends.componentName = 'Trends';

/* Export Component ================================================================== */
export default Trends;