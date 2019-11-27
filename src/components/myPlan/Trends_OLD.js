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
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { BiomechanicsCharts, InsightsCharts, } from './graphs';
import { AppUtil, PlanLogic, } from '../../lib';
import { FathomModal, ParsedText, SVGImage, Spacer, TabIcon, Text, } from '../custom';
import { ContactUsModal, } from '../general';
import { store } from '../../store';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

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
            isContactUsOpen:  false,
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
                    this.props.clearPlanAlert(item.insight_type, this.props.user.id);
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

    _toggleContactUsWebView = () => this.setState({ isContactUsOpen: !this.state.isContactUsOpen, })

    render = () => {
        const { isCoachModalOpen, isContactUsOpen, } = this.state;
        const { plan, } = this.props;
        let {
            biomechanicsAnklePitch,
            biomechanicsApt,
            biomechanicsHipDrop,
            bodyResponse,
            extraBottomPadding,
            isBiomechanicsAnklePitchLocked,
            isBiomechanicsAptLocked,
            isBiomechanicsHipDropLocked,
            isBodyResponseLocked,
            isWorkloadLocked,
            workload,
        } = PlanLogic.handleTrendsRenderLogic(plan, Platform.OS);
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
        let {
            leftPieInnerRadius,
            leftPieWidth,
            pieData,
            pieLeftWrapperWidth,
            pieRightWrapperWidth,
            rightPieInnerRadius,
            rightPieWidth,
            selectedAptSession,
        } = PlanLogic.handleBiomechanicsAptRenderLogic(plan, _.findLastIndex(biomechanicsApt.sessions));
        let {
            biomechanicsAlertText:  biomechanicsAptAlertText,
            parsedBiomechanicsData: parsedBiomechanicsAptData,
            sessionColor:           sessionAptColor,
            sessionSport:           sessionAptSport,
        } = PlanLogic.handleBiomechanicsSelectedSessionRenderLogic(selectedAptSession, 0);
        let {
            leftPieInnerRadius:   leftPieInnerRadiusAnklePitch,
            leftPieWidth:         leftPieWidthAnklePitch,
            pieData:              pieDataAnklePitch,
            pieLeftWrapperWidth:  pieLeftWrapperWidthAnklePitch,
            pieRightWrapperWidth: pieRightWrapperWidthAnklePitch,
            rightPieInnerRadius:  rightPieInnerRadiusAnklePitch,
            rightPieWidth:        rightPieWidthAnklePitch,
            selectedAnklePitchSession,
        } = PlanLogic.handleBiomechanicsAnklePitchRenderLogic(plan, _.findLastIndex(biomechanicsAnklePitch.sessions));
        let {
            biomechanicsAlertText:  biomechanicsAnklePitchAlertText,
            parsedBiomechanicsData: parsedBiomechanicsAnklePitchData,
            sessionColor:           sessionAnklePitchColor,
            sessionSport:           sessionAnklePitchSport,
        } = PlanLogic.handleBiomechanicsSelectedSessionRenderLogic(selectedAnklePitchSession, 1);
        let {
            leftPieInnerRadius:   leftPieInnerRadiusHipDrop,
            leftPieWidth:         leftPieWidthHipDrop,
            pieData:              pieDataHipDrop,
            pieLeftWrapperWidth:  pieLeftWrapperWidthHipDrop,
            pieRightWrapperWidth: pieRightWrapperWidthHipDrop,
            rightPieInnerRadius:  rightPieInnerRadiusHipDrop,
            rightPieWidth:        rightPieWidthHipDrop,
            selectedHipDropSession,
        } = PlanLogic.handleBiomechanicsHipDropRenderLogic(plan, _.findLastIndex(biomechanicsHipDrop.sessions))
        let {
            biomechanicsAlertText:  biomechanicsHipDropAlertText,
            parsedBiomechanicsData: parsedBiomechanicsHipDropData,
            sessionColor:           sessionHipDropColor,
            sessionSport:           sessionHipDropSport,
        } = PlanLogic.handleBiomechanicsSelectedSessionRenderLogic(selectedHipDropSession, 2);
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

                    <View style={{paddingHorizontal: AppSizes.paddingMed, paddingTop: AppSizes.padding,}}>
                        <Text robotoRegular style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(28),}}>{'Trends'}</Text>
                        <Spacer size={AppSizes.paddingXSml} />
                        <Spacer isDivider />
                        <Spacer size={AppSizes.padding} />
                        { !isBiomechanicsAptLocked &&
                            <TouchableOpacity
                                activeOpacity={0.2}
                                onPress={() => AppUtil.pushToScene('biomechanics', {dataType: 0,})}
                                style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                            >
                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.padding, paddingHorizontal: AppSizes.padding,}}>
                                    <Text robotoRegular style={[styles.cardTitle, {paddingHorizontal: 0,}]}>{'Pelvic Tilt'}</Text>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(13),}}>{moment(selectedAptSession.event_date_time.replace('Z', '')).format('M/D, h:mma')}</Text>
                                </View>
                                <BiomechanicsCharts
                                    dataType={0}
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
                                    showDetails={false}
                                />
                                { (selectedAptSession && selectedAptSession.asymmetry && selectedAptSession.asymmetry.apt) &&
                                    <View style={{borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, marginTop: AppSizes.paddingSml,}}>
                                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingSml, paddingTop: AppSizes.paddingMed,}}>
                                            { sessionAptSport ?
                                                <Image
                                                    source={sessionAptSport.imagePath}
                                                    style={{height: 20, marginRight: AppSizes.paddingSml, tintColor: PlanLogic.returnInsightColorString(sessionAptColor), width: 20,}}
                                                />
                                                :
                                                null
                                            }
                                            <ParsedText
                                                parse={parsedBiomechanicsAptData}
                                                style={[AppStyles.robotoRegular, {color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),},]}
                                            >
                                                {biomechanicsAptAlertText}
                                            </ParsedText>
                                        </View>
                                    </View>
                                }
                            </TouchableOpacity>
                        }
                        { !isBiomechanicsHipDropLocked &&
                            <TouchableOpacity
                                activeOpacity={0.2}
                                onPress={() => AppUtil.pushToScene('biomechanics', {dataType: 2,})}
                                style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                            >
                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.padding, paddingHorizontal: AppSizes.padding,}}>
                                    <Text robotoRegular style={[styles.cardTitle, {paddingHorizontal: 0,}]}>{'Hip Drop'}</Text>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(13),}}>{moment(selectedHipDropSession.event_date_time.replace('Z', '')).format('M/D, h:mma')}</Text>
                                </View>
                                <BiomechanicsCharts
                                    dataType={2}
                                    pieDetails={{
                                        leftPieInnerRadius:   leftPieInnerRadiusHipDrop,
                                        leftPieWidth:         leftPieWidthHipDrop,
                                        pieData:              pieDataHipDrop,
                                        pieLeftWrapperWidth:  pieLeftWrapperWidthHipDrop,
                                        pieRightWrapperWidth: pieRightWrapperWidthHipDrop,
                                        rightPieInnerRadius:  rightPieInnerRadiusHipDrop,
                                        rightPieWidth:        rightPieWidthHipDrop,
                                    }}
                                    selectedSession={selectedHipDropSession}
                                    showDetails={false}
                                />
                                { (selectedHipDropSession && selectedHipDropSession.asymmetry && selectedHipDropSession.asymmetry.hip_drop) &&
                                    <View style={{borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, marginTop: AppSizes.paddingSml,}}>
                                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingSml, paddingTop: AppSizes.paddingMed,}}>
                                            { sessionHipDropSport ?
                                                <Image
                                                    source={sessionHipDropSport.imagePath}
                                                    style={{height: 20, marginRight: AppSizes.paddingSml, tintColor: PlanLogic.returnInsightColorString(sessionHipDropColor), width: 20,}}
                                                />
                                                :
                                                null
                                            }
                                            <ParsedText
                                                parse={parsedBiomechanicsHipDropData}
                                                style={[AppStyles.robotoRegular, {color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),},]}
                                            >
                                                {biomechanicsHipDropAlertText}
                                            </ParsedText>
                                        </View>
                                    </View>
                                }
                            </TouchableOpacity>
                        }
                        { !isBiomechanicsAnklePitchLocked &&
                            <TouchableOpacity
                                activeOpacity={0.2}
                                onPress={() => AppUtil.pushToScene('biomechanics', {dataType: 1,})}
                                style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                            >
                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.padding, paddingHorizontal: AppSizes.padding,}}>
                                    <Text robotoRegular style={[styles.cardTitle, {paddingHorizontal: 0,}]}>{'Leg Extension'}</Text>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(13),}}>{moment(selectedAnklePitchSession.event_date_time.replace('Z', '')).format('M/D, h:mma')}</Text>
                                </View>
                                <BiomechanicsCharts
                                    dataType={1}
                                    pieDetails={{
                                        leftPieInnerRadius:   leftPieInnerRadiusAnklePitch,
                                        leftPieWidth:         leftPieWidthAnklePitch,
                                        pieData:              pieDataAnklePitch,
                                        pieLeftWrapperWidth:  pieLeftWrapperWidthAnklePitch,
                                        pieRightWrapperWidth: pieRightWrapperWidthAnklePitch,
                                        rightPieInnerRadius:  rightPieInnerRadiusAnklePitch,
                                        rightPieWidth:        rightPieWidthAnklePitch,
                                    }}
                                    selectedSession={selectedAnklePitchSession}
                                    showDetails={false}
                                />
                                { (selectedAnklePitchSession && selectedAnklePitchSession.asymmetry && selectedAnklePitchSession.asymmetry.ankle_pitch) &&
                                    <View style={{borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, marginTop: AppSizes.paddingSml,}}>
                                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingSml, paddingTop: AppSizes.paddingMed,}}>
                                            { sessionAnklePitchSport ?
                                                <Image
                                                    source={sessionAnklePitchSport.imagePath}
                                                    style={{height: 20, marginRight: AppSizes.paddingSml, tintColor: PlanLogic.returnInsightColorString(sessionAnklePitchColor), width: 20,}}
                                                />
                                                :
                                                null
                                            }
                                            <ParsedText
                                                parse={parsedBiomechanicsAnklePitchData}
                                                style={[AppStyles.robotoRegular, {color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),},]}
                                            >
                                                {biomechanicsAnklePitchAlertText}
                                            </ParsedText>
                                        </View>
                                    </View>
                                }
                            </TouchableOpacity>
                        }
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
                                <View style={{borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, marginTop: AppSizes.paddingSml,}}>
                                    <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingSml, paddingTop: AppSizes.paddingMed,}}>
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
                                <View style={{borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, marginTop: AppSizes.paddingSml,}}>
                                    <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingSml, paddingTop: AppSizes.paddingMed,}}>
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
                                </View>
                            }
                        </TouchableOpacity>
                        { isBiomechanicsAptLocked &&
                            <View style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}>
                                <BiomechanicsCharts
                                    dataType={0}
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
                                    showDetails={false}
                                />
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this._toggleContactUsWebView()}
                                    style={[styles.lockedCardWrapper,]}
                                >
                                    <View style={{justifyContent: 'center',}}>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'Optimize your recovery & prevention with the world\'s most advanced biomechanics AI system.'}</Text>
                                        <Spacer size={AppSizes.paddingMed} />
                                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(12),}}>{'Request access to Fathom\'s Pro Sensors.'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
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

                <ContactUsModal
                    handleModalToggle={this._toggleContactUsWebView}
                    isModalOpen={isContactUsOpen}
                />

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
