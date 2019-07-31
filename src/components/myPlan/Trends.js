/**
 * Trends
 *
    <Trends
        clearPlanAlert={clearPlanAlert}
        plan={plan}
        updateUser={updateUser}
        user={user}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { FathomCharts, InsightsCharts, } from './graphs';
import { AppUtil, PlanLogic, } from '../../lib';
import { FathomModal, SVGImage, Spacer, TabIcon, Text, } from '../custom';
import { store } from '../../store';

// import third-party libraries
import _ from 'lodash';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: AppColors.white,
        borderRadius:    12,
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
        color:             AppColors.zeplin.slateLight,
        fontSize:          AppFonts.scaleFont(16),
        paddingHorizontal: AppSizes.padding,
    },
    categoryCard: {
        alignSelf:       'flex-start',
        backgroundColor: AppColors.white,
        borderRadius:    12,
        padding:         AppSizes.paddingMed,
        width:           AppSizes.screen.widthTwoThirds,
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
    trendCategoryIcon: {
        backgroundColor: AppColors.zeplin.error,
        borderRadius:    (AppSizes.padding / 2),
        top:             -(AppSizes.padding / 2),
        height:          AppSizes.padding,
        position:        'absolute',
        right:           -(AppSizes.padding / 2),
        width:           AppSizes.padding,
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
        this._carousel = {};
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

    _renderItem = item => {
        /*if((index + 1) === numberOfItems) {
            return (
                <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.splashLight, borderRadius: 12, flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingXLrg,}}>
                    <Image
                        resizeMode={'contain'}
                        source={require('../../../assets/images/standard/allcaughtup.png')}
                        style={{height: 60, marginBottom: AppSizes.paddingSml, width: 60,}}
                    />
                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>{'You’re all caught up! Come back later for updates to your Trends.'}</Text>
                </View>
            );
        }*/
        let newBodyPart = _.cloneDeep(item.body_part);
        newBodyPart.side = newBodyPart.side ? newBodyPart.side : 0;
        let bodyPart = PlanLogic.handleBodyModalityBodyPart(newBodyPart);
        return (
            <TouchableOpacity
                onPress={() => {
                    AppUtil.pushToScene('trendChild', { insightType: item.insight_type, });
                    this.props.clearPlanAlert(item.insight_type);
                }}
                style={[styles.categoryCard, AppStyles.scaleButtonShadowEffect,]}
            >
                { item.unread_alerts &&
                    <View style={[styles.trendCategoryIcon,]} />
                }
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginHorizontal: AppSizes.paddingSml,}}>{item.title}</Text>
                <View style={{backgroundColor: `${AppColors.zeplin.splashLight}1A`, borderRadius: 12, flexDirection: 'row', marginTop: AppSizes.paddingSml, padding: AppSizes.paddingSml,}}>
                    <SVGImage
                        image={bodyPart.bodyImage}
                        isBlue={true}
                        selected={true}
                        style={{height: 50, width: 50,}}
                    />
                    <View style={{flex: 1, justifyContent: 'center', marginLeft: AppSizes.paddingMed,}}>
                        <Text robotoRegular style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(12),}}>{item.text}</Text>
                        <Spacer size={AppSizes.paddingXSml} />
                        <Text robotoBold style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(14),}}>{item.body_part_text}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render = () => {
        const { isCoachModalOpen, } = this.state;
        const { plan, } = this.props;
        let {
            biomechanics,
            bodyResponse,
            currentBiomechanicsAlert,
            currentBodyResponseAlert,
            currentResponseAlert,
            currentStressAlert,
            currentWorkloadAlert,
            extraBottomPadding,
            isBiomechanicsLocked,
            isBodyResponseLocked,
            isResponseLocked,
            isStressLocked,
            isWorkloadLocked,
            trendCategories,
            workload,
        } = PlanLogic.handleTrendsRenderLogic(plan, Platform.OS);
        let currentStressAlertText = PlanLogic.handleChartTitleRenderLogic(currentStressAlert, styles.cardSubtitle);
        let currentResponseAlertText = PlanLogic.handleChartTitleRenderLogic(currentResponseAlert, styles.cardSubtitle);
        let currentBiomechanicsAlertText = PlanLogic.handleChartTitleRenderLogic(currentBiomechanicsAlert, styles.cardSubtitle);
        let currentBodyResponseAlertText = PlanLogic.handleTrendsTitleRenderLogic(bodyResponse && bodyResponse.status ? bodyResponse.status.bolded_text : [], bodyResponse && bodyResponse.status ? bodyResponse.status.text : '');
        let currentWorkloadAlertText = PlanLogic.handleTrendsTitleRenderLogic(workload && workload.status ? workload.status.bolded_text : [], workload && workload.status ? workload.status.text : '');
        let {
            icon: workloadIcon,
            iconType: workloadIconType,
            imageSource: workloadImageSource,
            subtitleColor: workloadSubtitleColor,
            sportName: workloadSportName,
        } = PlanLogic.handleTrendRenderLogic(workload);
        let {
            icon: bodyResponseIcon,
            iconType: bodyResponseIconType,
            imageSource: bodyResponseImageSource,
            subtitleColor: bodyResponseSubtitleColor,
            sportName: bodyResponseSportName,
        } = PlanLogic.handleTrendRenderLogic(bodyResponse);
        return (
            <View style={{flex: 1,}}>

                <ScrollView
                    nestedScrollEnabled={true}
                    style={{backgroundColor: AppColors.white, flex: 1, paddingBottom: (AppSizes.paddingLrg + AppSizes.paddingMed + 20 + AppFonts.scaleFont(11) + extraBottomPadding),}}
                >

                    <View style={{paddingHorizontal: AppSizes.paddingMed,}}>
                        <View style={{flexDirection: 'row', height: AppSizes.navbarHeight, justifyContent: 'center', marginTop: AppSizes.statusBarHeight,}}>
                            <View style={{flex: 1, justifyContent: 'center',}} />
                            <Image
                                source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                                style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
                            />
                            <View style={{flex: 1, justifyContent: 'center', paddingRight: AppSizes.paddingSml,}} />
                        </View>
                    </View>

                    <View style={{paddingHorizontal: AppSizes.paddingMed, paddingTop: AppSizes.paddingLrg,}}>
                        <Text robotoRegular style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(28),}}>{'This week'}</Text>
                        <Spacer size={AppSizes.paddingXSml} />
                        <Spacer isDivider />
                        <Spacer size={AppSizes.padding} />

                        <View style={{alignItems: 'center', flex: 1,}}>
                            {trendCategories.length === 1 ?
                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingHorizontal: AppSizes.paddingXLrg,}}>
                                    <Image
                                        resizeMode={'contain'}
                                        source={require('../../../assets/images/standard/research.png')}
                                        style={{height: 60, marginRight: AppSizes.paddingSml, width: 60,}}
                                    />
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'No Trends right now. We\'ll keep looking.'}</Text>
                                </View>
                                :
                                this._renderItem(trendCategories[0])
                            }
                        </View>
                        <Spacer size={AppSizes.paddingLrg} />
                        <TouchableOpacity
                            activeOpacity={isWorkloadLocked ? 1 : 0.2}
                            onPress={isWorkloadLocked ? () => {} : () => AppUtil.pushToScene('insight', { insightType: 8, })}
                            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                        >
                            { !isWorkloadLocked &&
                                <Text robotoRegular style={[styles.cardTitle,]}>{'Workouts'}</Text>
                            }
                            <InsightsCharts
                                currentAlert={workload}
                                data={workload.data}
                                showSelection={false}
                            />
                            { isWorkloadLocked &&
                                <View style={[styles.lockedCardWrapper,]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text robotoRegular style={[styles.cardTitle, {color: AppColors.white,}]}>{'Workouts'}</Text>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'No Workout data yet.\nKeep logging symptoms for insight into how your body responds to training.'}</Text>
                                    </View>
                                </View>
                            }
                            { currentWorkloadAlertText &&
                                <View style={{alignItems: 'center', borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingSml, paddingHorizontal: AppSizes.paddingSml, paddingTop: AppSizes.paddingMed,}}>
                                    { workloadIcon ?
                                        <TabIcon
                                            color={workloadSubtitleColor}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={workloadIcon}
                                            size={20}
                                            type={workloadIconType}
                                        />
                                        : workloadSportName ?
                                            <Image
                                                source={workloadImageSource}
                                                style={{height: 20, marginRight: AppSizes.paddingSml, tintColor: workloadSubtitleColor, width: 20,}}
                                            />
                                            :
                                            null
                                    }
                                    {currentWorkloadAlertText}
                                </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={isBodyResponseLocked ? 1 : 0.2}
                            onPress={isBodyResponseLocked ? () => {} : () => AppUtil.pushToScene('insight', { insightType: 7, })}
                            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                        >
                            { !isBodyResponseLocked &&
                                <Text robotoRegular style={[styles.cardTitle,]}>{'Pain & Soreness'}</Text>
                            }
                            <InsightsCharts
                                currentAlert={bodyResponse}
                                data={bodyResponse.data}
                                showSelection={false}
                            />
                            { isBodyResponseLocked &&
                                <View style={[styles.lockedCardWrapper,]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text robotoRegular style={[styles.cardTitle, {color: AppColors.white,}]}>{'Pain & Soreness'}</Text>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'No Body Response data yet.\nKeep logging symptoms for insight into how your body responds to training.'}</Text>
                                    </View>
                                </View>
                            }
                            { currentBodyResponseAlertText &&
                                <View style={{alignItems: 'center', borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingSml, paddingHorizontal: AppSizes.paddingSml, paddingTop: AppSizes.paddingMed,}}>
                                    { bodyResponseIcon ?
                                        <TabIcon
                                            color={bodyResponseSubtitleColor}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={bodyResponseIcon}
                                            size={20}
                                            type={bodyResponseIconType}
                                        />
                                        : bodyResponseSportName ?
                                            <Image
                                                source={bodyResponseImageSource}
                                                style={{height: 20, marginRight: AppSizes.paddingSml, tintColor: bodyResponseSubtitleColor, width: 20,}}
                                            />
                                            :
                                            null
                                    }
                                    {currentBodyResponseAlertText}
                                </View>
                            }
                        </TouchableOpacity>
                        <View style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}>
                            <InsightsCharts
                                currentAlert={biomechanics}
                                data={biomechanics.data}
                                showSelection={false}
                            />
                            <View style={[styles.lockedCardWrapper,]}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                    <Text robotoRegular style={[styles.cardTitle, {color: AppColors.white,}]}>{'Biomechanics'}</Text>
                                    <TabIcon
                                        color={AppColors.white}
                                        containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                        icon={'lock'}
                                        iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                        size={40}
                                    />
                                </View>
                                <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                    <Text robotoRegular style={[styles.lockedCardText,]}>{'The world\'s most advance biomechanics tracking system coming soon.'}</Text>
                                </View>
                            </View>
                        </View>
                        {/*<TouchableOpacity
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
                        </TouchableOpacity>*/}
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
    clearPlanAlert: PropTypes.func.isRequired,
    plan:           PropTypes.object.isRequired,
    updateUser:     PropTypes.func.isRequired,
    user:           PropTypes.object.isRequired,
};

Trends.defaultProps = {};

Trends.componentName = 'Trends';

/* Export Component ================================================================== */
export default Trends;