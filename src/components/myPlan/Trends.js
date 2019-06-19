/**
 * Trends
 *
    <Trends
        plan={plan}
        updateUser={updateUser}
        user={user}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { FathomCharts, } from './graphs';
import { PlanLogic, } from '../../lib';
import { Text, } from '../custom';
import { store } from '../../store';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import SlidingUpPanel from 'rn-sliding-up-panel';

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
        this._panel = {};
        this._timer = null;
    }

    componentDidMount = () => {
        const { user, } = this.props;
        if(!user.first_time_experience.includes('trends_coach')) {
            this._timer = _.delay(() => this._panel.show(), 1000);
        }
    }

    componentWillUnmount = () => {
        // clear timers
        clearInterval(this._timer);
    }

    _handleUpdateFirstTimeExperience = (value, callback) => {
        const { updateUser, user, } = this.props;
        // hide panel
        this._panel.hide();
        // setup variables
        let newUserPayloadObj = {};
        newUserPayloadObj.first_time_experience = [value];
        let newUserObj = _.cloneDeep(user);
        newUserObj.first_time_experience.push(value);
        // update reducer as API might take too long to return a value
        store.dispatch({
            type: DispatchActions.USER_REPLACE,
            data: newUserObj
        });
        // update user object
        updateUser(newUserPayloadObj, user.id)
            .then(res => {
                if(callback) {
                    callback();
                }
            });
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
            <View style={{flex: 1,}}>

                <ScrollView
                    nestedScrollEnabled={true}
                    style={{backgroundColor: AppColors.white, flex: 1, paddingBottom: (AppSizes.paddingLrg + AppSizes.paddingMed + 20 + AppFonts.scaleFont(11) + extraBottomPadding),}}
                >

                    <View style={{paddingHorizontal: AppSizes.paddingMed,}}>
                        <View style={{flexDirection: 'row', height: AppSizes.navbarHeight, justifyContent: 'center', marginBottom: AppSizes.padding, marginTop: AppSizes.statusBarHeight,}}>
                            <View style={{flex: 1, justifyContent: 'center',}} />
                            <Image
                                source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
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

                <SlidingUpPanel
                    allowDragging={false}
                    showBackdrop={false}
                    ref={ref => {this._panel = ref;}}
                >
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end',}}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this._handleUpdateFirstTimeExperience('trends_coach')}
                            style={{backgroundColor: AppColors.white, elevation: 4, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingLrg, shadowColor: 'rgba(0, 0, 0, 0.16)', shadowOffset: { height: 3, width: 0, }, shadowOpacity: 1, shadowRadius: 20,}}
                        >
                            <Text robotoMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), marginBottom: AppSizes.paddingSml,}}>{'Welcome to your Trends'}</Text>
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginBottom: AppSizes.padding,}}>{'Here, you\'ll find your data & any meaningful trends & insights that our AI system finds!'}</Text>
                            <Text robotoMedium style={{alignSelf: 'flex-end', color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(22),}}>
                                {'GOT IT'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SlidingUpPanel>

            </View>
        );
    }
}

Trends.propTypes = {
    plan:       PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
    user:       PropTypes.object.isRequired,
};

Trends.defaultProps = {};

Trends.componentName = 'Trends';

/* Export Component ================================================================== */
export default Trends;