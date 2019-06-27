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
import { AppUtil, PlanLogic, } from '../../lib';
import { FathomModal, TabIcon, Text, } from '../custom';
import { store } from '../../store';

// import third-party libraries
import _ from 'lodash';

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
    lockedCardText: {
        color:             AppColors.white,
        fontSize:          AppFonts.scaleFont(15),
        paddingHorizontal: AppSizes.padding,
        textAlign:         'center',
    },
    lockedCardWrapper: {
        backgroundColor: `${AppColors.zeplin.slateLight}B3`,
        borderRadius:    6,
        bottom:          0,
        flex:            1,
        left:            0,
        paddingVertical: AppSizes.padding,
        position:        'absolute',
        right:           0,
        top:             0,
        width:           '100%',
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
        this.state = {
            isCoachModalOpen: false,
        };
        this._timer = null;
    }

    componentDidMount = () => {
        const { user, } = this.props;
        if(!user.first_time_experience.includes('trends_coach')) {
            this._timer = _.delay(() => this.setState({ isCoachModalOpen: true, }), 1000);
        }
    }

    componentWillUnmount = () => {
        // clear timers
        clearInterval(this._timer);
    }

    _handleUpdateFirstTimeExperience = (value, callback) => {
        const { updateUser, user, } = this.props;
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
        const { isCoachModalOpen, } = this.state;
        const { plan, } = this.props;
        let {
            currentBiomechanicsAlert,
            currentResponseAlert,
            currentStressAlert,
            extraBottomPadding,
            isBiomechanicsLocked,
            isResponseLocked,
            isStressLocked,
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
                            activeOpacity={isStressLocked ? 1 : 0.2}
                            onPress={() => isStressLocked ? () => {} : AppUtil.pushToScene('trendChild', { insightType: 0, })}
                            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                        >
                            { !isStressLocked &&
                                <Text oswaldRegular style={[styles.cardTitle,]}>{'STRESS'}</Text>
                            }
                            { (currentStressAlertText && !isStressLocked) &&
                                currentStressAlertText
                            }
                            <FathomCharts
                                barData={PlanLogic.handleBarChartRenderLogic(plan, 7)}
                                containerWidth={AppSizes.screen.width - (AppSizes.paddingMed * 2)}
                                currentAlert={currentStressAlert}
                                startSliceValue={7}
                            />
                            { isStressLocked &&
                                <View style={[styles.lockedCardWrapper,]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text oswaldRegular style={[styles.cardTitle, {color: AppColors.white,}]}>{'STRESS'}</Text>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'Insufficient data. Keep logging workouts in Fathom to unlock Stress Trends!'}</Text>
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={isResponseLocked ? 1 : 0.2}
                            onPress={() => isResponseLocked ? () => {} : AppUtil.pushToScene('trendChild', { insightType: 1, })}
                            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                        >
                            { !isResponseLocked &&
                                <Text oswaldRegular style={[styles.cardTitle,]}>{'RESPONSE'}</Text>
                            }
                            { (currentResponseAlertText && !isResponseLocked) &&
                                currentResponseAlertText
                            }
                            <FathomCharts
                                barData={PlanLogic.handleBarChartRenderLogic(plan, 7)}
                                containerWidth={AppSizes.screen.width - (AppSizes.paddingMed * 2)}
                                currentAlert={currentResponseAlert}
                                startSliceValue={7}
                            />
                            { isResponseLocked &&
                                <View style={[styles.lockedCardWrapper,]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text oswaldRegular style={[styles.cardTitle, {color: AppColors.white,}]}>{'RESPONSE'}</Text>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'No Response Trends yet. Keep logging symptoms for insight into how your body responds to training.'}</Text>
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={isBiomechanicsLocked ? 1 : 0.2}
                            onPress={() => isBiomechanicsLocked ? () => {} : AppUtil.pushToScene('trendChild', { insightType: 2, })}
                            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                        >
                            { !isBiomechanicsLocked &&
                                <Text oswaldRegular style={[styles.cardTitle,]}>{'BIOMECHANICS'}</Text>
                            }
                            { (currentBiomechanicsAlertText && !isBiomechanicsLocked) &&
                                currentBiomechanicsAlertText
                            }
                            <FathomCharts
                                barData={PlanLogic.handleBarChartRenderLogic(plan, 0)}
                                containerWidth={AppSizes.screen.width - (AppSizes.paddingMed * 2)}
                                currentAlert={currentBiomechanicsAlert}
                                startSliceValue={0}
                            />
                            { isBiomechanicsLocked &&
                                <View style={[styles.lockedCardWrapper,]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text oswaldRegular style={[styles.cardTitle, {color: AppColors.white,}]}>{'BIOMECHANICS'}</Text>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'No Biomechanics Trends yet. Keep logging symptoms to help us identify possible weaknesses or strength imbalances.'}</Text>
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>
                    </View>

                </ScrollView>

                <FathomModal
                    hasBackdrop={false}
                    isVisible={isCoachModalOpen}
                >
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end',}}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.setState({ isCoachModalOpen: false, } , () => this._handleUpdateFirstTimeExperience('trends_coach'))}
                            style={{backgroundColor: AppColors.white, elevation: 4, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingLrg, shadowColor: 'rgba(0, 0, 0, 0.16)', shadowOffset: { height: 3, width: 0, }, shadowOpacity: 1, shadowRadius: 20,}}
                        >
                            <Text robotoMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), marginBottom: AppSizes.paddingSml,}}>{'Welcome to your Trends'}</Text>
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginBottom: AppSizes.padding,}}>{'Here, you\'ll find your data & any meaningful trends & insights that our AI system finds!'}</Text>
                            <Text robotoMedium style={{alignSelf: 'flex-end', color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(22),}}>
                                {'GOT IT'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </FathomModal>

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