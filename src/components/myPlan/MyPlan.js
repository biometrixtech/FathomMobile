/**
 * MyPlan View
      <MyPlan
          clearCompletedCoolDownExercises={clearCompletedCoolDownExercises}
          clearCompletedExercises={clearCompletedExercises}
          clearHealthKitWorkouts={clearHealthKitWorkouts}
          getMobilize={getMobilize}
          getMyPlan={getMyPlan}
          getSoreBodyParts={getSoreBodyParts}
          handleReadInsight={handleReadInsight}
          healthData={healthData}
          lastOpened={lastOpened}
          network={network}
          noSessions={noSessions}
          notification={notification}
          plan={plan}
          postReadinessSurvey={postReadinessSurvey}
          postSessionSurvey={postSessionSurvey}
          scheduledMaintenance={scheduledMaintenance}
          setAppLogs={setAppLogs}
          updateUser={updateUser}
          user={user}
      />
 */
/* global fetch console */
import React, { Component, } from 'react';
import {
    Alert,
    AppState,
    BackHandler,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import Collapsible from 'react-native-collapsible';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Placeholder, { Line, Media, } from 'rn-placeholder';
import moment from 'moment';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, } from '../../constants';
import { AppUtil, PlanLogic, } from '../../lib';
import { store } from '../../store';
import defaultPlanState from '../../states/plan';

// Components
import { CustomMyPlanNavBar, DeckCards, FathomModal, TabIcon, Text, } from '../custom';
import {
    LoadingState,
    LogSymptomsModal,
    PostSessionSurvey,
    ReadinessSurvey,
    ReturnSensorsModal,
    SessionsCompletionModal,
    StartSensorSessionModal,
} from './pages';
import { ContactUsModal, Loading, WebViewPageModal, } from '../general';

// global constants
const numberOfPlaceholders = 8;
const timerDelay = 30000; // delay for X ms
const UNREAD_NOTIFICATIONS_HEIGHT_WIDTH = (AppFonts.scaleFont(13) + (AppSizes.paddingXSml * 2));

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    animationWrapper: {
        alignSelf:      'center',
        height:         50,
        justifyContent: 'center',
        width:          50,
    },
    completedSubtitle: {
        fontSize: AppFonts.scaleFont(14),
    },
    completedTitle: {
        fontSize: AppFonts.scaleFont(18),
    },
    disabledFABBtn: {
        alignItems:      'center',
        backgroundColor: AppColors.zeplin.slateXLight,
        borderRadius:    (65 / 2),
        bottom:          30,
        elevation:       2,
        height:          65,
        justifyContent:  'center',
        position:        'absolute',
        right:           30,
        shadowColor:     AppColors.zeplin.slateXLight,
        shadowOffset:    { height: 3, width: 0, },
        shadowOpacity:   1,
        shadowRadius:    6,
        width:           65,
    },
    lockedSubtitle: {
        fontSize: AppFonts.scaleFont(12),
        opacity:  0.4,
    },
    lockedTitle: {
        fontSize: AppFonts.scaleFont(18),
        opacity:  0.4,
    },
    sensorSessionLoading: {
        alignItems:      'center',
        backgroundColor: `${AppColors.zeplin.slateLight}${PlanLogic.returnHexOpacity(0.8)}`,
        borderRadius:    12,
        bottom:          0,
        justifyContent:  'center',
        left:            0,
        position:        'absolute',
        right:           0,
        top:             0,
    },
    unreadNotificationsWrapper: {
        alignItems:      'center',
        backgroundColor: AppColors.zeplin.error,
        borderRadius:    (UNREAD_NOTIFICATIONS_HEIGHT_WIDTH / 2),
        height:          UNREAD_NOTIFICATIONS_HEIGHT_WIDTH,
        justifyContent:  'center',
        position:        'absolute',
        right:           0,
        top:             (UNREAD_NOTIFICATIONS_HEIGHT_WIDTH / 3),
        width:           UNREAD_NOTIFICATIONS_HEIGHT_WIDTH,
    },
});

/* Component ==================================================================== */
const ActivityTab = ({
    backgroundImage = false,
    completed,
    id,
    isSensorSession,
    locked,
    onLayout,
    onPress ,
    subtitle,
    timing,
    title,
}) => (
    <View onLayout={onLayout ? event => onLayout(event) : null} style={{marginBottom: AppSizes.paddingMed,}}>
        { completed || locked ?
            <View style={{backgroundColor: AppColors.zeplin.superLight, borderRadius: 12, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.paddingSml,}}>
                <View style={{flexDirection: 'row',}}>
                    { completed ?
                        <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                            <LottieView
                                autoPlay={false}
                                loop={false}
                                progress={1}
                                source={require('../../../assets/animation/checkmark-circle.json')}
                            />
                        </View>
                        :
                        <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                            <TabIcon
                                color={AppColors.zeplin.slate}
                                icon={'close-circle'}
                                iconStyle={[{opacity: 0.4,}]}
                                size={AppFonts.scaleFont(24)}
                                type={'material-community'}
                            />
                        </View>
                    }
                    <View style={{flex: 1, marginLeft: AppSizes.paddingSml,}}>
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',}}>
                            <Text
                                robotoRegular
                                style={[completed ? styles.completedTitle : styles.lockedTitle, {color: AppColors.zeplin.slate,}]}
                            >
                                {title}
                            </Text>
                            { isSensorSession &&
                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',}}>
                                    <Image
                                        resizeMode={'contain'}
                                        source={require('../../../assets/images/standard/kitactive.png')}
                                        style={{height: 15, marginRight: AppSizes.paddingSml, tintColor: AppColors.zeplin.slateLight, width: 30,}}
                                    />
                                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11),}}>
                                        {moment(isSensorSession.replace('Z', '')).format('M/D, h:mma')}
                                    </Text>
                                </View>
                            }
                        </View>
                        { (subtitle && subtitle.length > 0) &&
                            <Text
                                numberOfLines={1}
                                robotoRegular
                                style={[completed ? styles.completedSubtitle : styles.lockedSubtitle, {color: AppColors.zeplin.slate,}]}
                            >
                                {subtitle}
                            </Text>
                        }
                    </View>
                </View>
            </View>
            :
            <TouchableOpacity
                activeOpacity={onPress ? 0.5 : 1}
                onPress={onPress}
                style={[AppStyles.scaleButtonShadowEffect, {borderRadius: 12,}, Platform.OS === 'ios' ? {} : {elevation: 2,}]}
            >
                <ImageBackground
                    imageStyle={{borderRadius: 12,}}
                    resizeMode={'cover'}
                    source={backgroundImage}
                    style={{backgroundColor: AppColors.white, borderRadius: 12, height: 'auto', width: 'auto',}}
                >
                    <LinearGradient
                        colors={['rgba(112, 190, 199, 0.8)', 'rgba(112, 190, 199, 0.3)']}
                        end={{x: 1.0, y: 1.0}}
                        onPress={onPress}
                        start={{x: 0.1, y: 0.1}}
                        style={[{alignItems: 'flex-start', borderRadius: 12, padding: AppSizes.paddingMed,}]}
                    >
                        <TabIcon
                            color={AppColors.white}
                            icon={'check-circle-outline'}
                            size={AppFonts.scaleFont(24)}
                            type={'material-community'}
                        />
                        <View style={{marginTop: AppSizes.paddingLrg,}}>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(26),}}>
                                {title}
                            </Text>
                            <Text numberOfLines={1} robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(13),}}>{subtitle}</Text>
                            <Text numberOfLines={1} robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(12),}}>
                                {timing[0]}
                                <Text robotoRegular>{timing[1]}</Text>
                            </Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </TouchableOpacity>
        }
    </View>
);

const SensorSession = ({
    activity,
    activityIdLoading,
    askForNewMobilize,
    handleGetMobilize,
    handeRefresh,
    onLayout,
    toggleContactUsWebView,
    updateSensorSession,
    userSesnorData,
}) => {
    let {
        actionText,
        activityStatus,
        eventDate,
        iconColor,
        iconName,
        iconType,
        isCalculating,
        subtext,
        title,
    } = PlanLogic.handleSingleSensorSessionCardRenderLogic(activity, userSesnorData, activityIdLoading);
    return (
        <TouchableOpacity
            activeOpacity={1}
            onLayout={onLayout ? event => onLayout(event) : null}
            onPress={
                (isCalculating || activityIdLoading) ?
                    () => {}
                    : activityStatus === 'UPLOAD_IN_PROGRESS' || activityStatus === 'UPLOAD_PAUSED' || activityStatus === 'PROCESSING_IN_PROGRESS' || (activityStatus === 'CREATE_COMPLETE' && activity.end_date) ?
                        () => handeRefresh(activity.id)
                        : activityStatus === 'PROCESSING_FAILED' && activity.cause_of_failure === 'CALIBRATION' ?
                            () => AppUtil.pushToScene('sensorFilesPage', { pageStep: 'calibrate', startPage: 1, })
                            : activityStatus === 'PROCESSING_FAILED' && activity.cause_of_failure === 'PLACEMENT' ?
                                () => AppUtil.pushToScene('sensorFilesPage', { pageStep: 'placement', })
                                : activityStatus === 'PROCESSING_COMPLETE' ?
                                    () => handleGetMobilize()
                                    : activityStatus === 'CREATE_COMPLETE' && !activity.end_date ?
                                        () => updateSensorSession(activity)
                                        : activityStatus === 'NO_WIFI_SETUP' ?
                                            () => AppUtil.pushToScene('sensorFilesPage', { pageStep: 'connect', })
                                            : activityStatus === 'NO_DATA' ?
                                                () => {} // toggleContactUsWebView()
                                                :
                                                () => {}
            }
            style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 12, marginBottom: AppSizes.paddingMed, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.paddingMed,}]}
        >
            { activityStatus === 'CREATE_COMPLETE' && !activity.end_date ?
                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginBottom: AppSizes.paddingMed,}}>
                    { eventDate &&
                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11),}}>{eventDate}</Text>
                    }
                </View>
                :
                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.paddingMed,}}>
                    <View style={{flexDirection: 'row',}}>
                        { iconName && iconType ?
                            <TabIcon
                                color={iconColor}
                                icon={iconName}
                                size={AppFonts.scaleFont(24)}
                                type={iconType}
                            />
                            :
                            <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                                <LottieView
                                    autoPlay={false}
                                    loop={false}
                                    progress={1}
                                    source={require('../../../assets/animation/checkmark-circle.json')}
                                />
                            </View>
                        }
                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), marginLeft: AppSizes.paddingSml,}}>{title}</Text>
                        { isCalculating &&
                            <View
                                style={[StyleSheet.absoluteFill, {backgroundColor: AppColors.white,}]}
                            />
                        }
                    </View>
                    { eventDate &&
                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11),}}>{eventDate}</Text>
                    }
                </View>
            }
            <View style={{flex: 1, marginHorizontal: AppSizes.paddingMed,}}>
                { activityStatus === 'CREATE_COMPLETE' && !activity.end_date ?
                    <View style={{alignItems: 'center', flexDirection: 'row', height: (25 + (AppSizes.paddingMed * 2)), justifyContent: 'center', marginBottom: AppSizes.paddingMed,}}>
                        <LottieView
                            autoPlay={true}
                            loop={true}
                            source={require('../../../assets/animation/workoutongoing.json')}
                            style={{position: 'absolute', height: (2.5 * (25 + (AppSizes.paddingMed * 2))),}}
                        />
                        <Image
                            resizeMode={'contain'}
                            source={require('../../../assets/images/standard/kitactive.png')}
                            style={{height: 25, tintColor: AppColors.zeplin.yellow, width: 45,}}
                        />
                    </View>
                    : activity.isNoWifiOrSessionsState ?
                        <View />
                        :
                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: AppSizes.paddingMed,}}>
                            <Image
                                resizeMode={'contain'}
                                source={activityStatus === 'TOO_SHORT' ?
                                    require('../../../assets/images/standard/kitpaused.png')
                                    : activityStatus === 'NO_DATA' ?
                                        require('../../../assets/images/standard/kiterror.png')
                                        :
                                        require('../../../assets/images/standard/kitactive.png')
                                }
                                style={{height: 25, width: 45,}}
                            />
                            { activityStatus === 'UPLOAD_IN_PROGRESS' ?
                                <View style={{height: 50, marginHorizontal: AppSizes.paddingMed, width: 50,}}>
                                    <LottieView
                                        autoPlay={true}
                                        loop={true}
                                        progress={1}
                                        source={require('../../../assets/animation/sensorloading.json')}
                                    />
                                </View>
                                :
                                <Image
                                    resizeMode={'contain'}
                                    source={
                                        activityStatus === 'UPLOAD_PAUSED' || activityStatus === 'NO_WIFI_SETUP' || activityStatus === 'NO_DATA' || (activityStatus === 'CREATE_COMPLETE' && activity.end_date) ?
                                            require('../../../assets/images/standard/dotsdisabled.png')
                                            : activityStatus === 'TOO_SHORT' ?
                                                require('../../../assets/images/standard/dotserror.png')
                                                :
                                                require('../../../assets/images/standard/dotscompleted.png')
                                    }
                                    style={{height: activityStatus === 'PROCESSING_FAILED' || activityStatus === 'TOO_SHORT' ? 15 : 5, marginHorizontal: AppSizes.paddingMed, width: 50,}}
                                />
                            }
                            <TabIcon
                                color={activityStatus === 'UPLOAD_IN_PROGRESS' || activityStatus === 'UPLOAD_PAUSED' || activityStatus === 'NO_WIFI_SETUP' || activityStatus === 'TOO_SHORT' || activityStatus === 'NO_DATA' || (activityStatus === 'CREATE_COMPLETE' && activity.end_date) ? AppColors.zeplin.slateXLight : AppColors.zeplin.splashLight}
                                icon={activityStatus === 'UPLOAD_IN_PROGRESS' || activityStatus === 'UPLOAD_PAUSED' || activityStatus === 'NO_WIFI_SETUP' || activityStatus === 'TOO_SHORT' || activityStatus === 'NO_DATA' || (activityStatus === 'CREATE_COMPLETE' && activity.end_date) ? 'cloud' : 'cloud-done'}
                                size={30}
                                type={'material'}
                            />
                            { activityStatus === 'PROCESSING_IN_PROGRESS' ?
                                <View style={{height: 50, marginHorizontal: AppSizes.paddingMed, width: 50,}}>
                                    <LottieView
                                        autoPlay={true}
                                        loop={true}
                                        progress={1}
                                        source={require('../../../assets/animation/sensorloading.json')}
                                    />
                                </View>
                                :
                                <Image
                                    resizeMode={'contain'}
                                    source={
                                        activityStatus === 'PROCESSING_FAILED' ?
                                            require('../../../assets/images/standard/dotserror.png')
                                            : activityStatus === 'PROCESSING_COMPLETE' ?
                                                require('../../../assets/images/standard/dotscompleted.png')
                                                :
                                                require('../../../assets/images/standard/dotsdisabled.png')
                                    }
                                    style={{height: activityStatus === 'PROCESSING_FAILED' ? 15 : 5, marginHorizontal: AppSizes.paddingMed, width: 50,}}
                                />
                            }
                            <TabIcon
                                color={activityStatus === 'PROCESSING_COMPLETE' ? AppColors.zeplin.splashLight : AppColors.zeplin.slateXLight}
                                icon={'clipboard-text'}
                                size={30}
                                type={'material-community'}
                            />
                        </View>
                }
                { (subtext && activityStatus === 'UPLOAD_PAUSED') ?
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11), marginLeft: 10,}}>
                        {subtext[0]}
                        <Text robotoBold>{subtext[1]}</Text>
                        {subtext[2]}
                    </Text>
                    : subtext ?
                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11), marginLeft: 10,}}>
                            {subtext}
                        </Text>
                        :
                        null
                }
                { isCalculating &&
                    <View
                        style={[StyleSheet.absoluteFill, {backgroundColor: AppColors.white,}]}
                    />
                }
            </View>
            { activityStatus === 'PROCESSING_COMPLETE' ?
                <View style={{alignSelf: 'center', backgroundColor: AppColors.zeplin.yellow, borderRadius: 22, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthHalf,}}>
                    <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{`${askForNewMobilize ? 'Create' : 'Update'} Plan`}</Text>
                    { isCalculating &&
                        <View
                            style={[StyleSheet.absoluteFill, {backgroundColor: AppColors.white,}]}
                        />
                    }
                </View>
                : actionText ?
                    <View style={{alignItems: 'flex-end', paddingTop: AppSizes.paddingSml,}}>
                        <Text robotoRegular style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(11),}}>{actionText}</Text>
                        { isCalculating &&
                            <View
                                style={[StyleSheet.absoluteFill, {backgroundColor: AppColors.white,}]}
                            />
                        }
                    </View>
                    : activityStatus === 'CREATE_COMPLETE' && !activity.end_date ?
                        <View style={{alignSelf: 'center', backgroundColor: AppColors.zeplin.yellow, borderRadius: 22, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthHalf,}}>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'End Workout'}</Text>
                            { isCalculating &&
                                <View
                                    style={[StyleSheet.absoluteFill, {backgroundColor: AppColors.white,}]}
                                />
                            }
                        </View>
                        : activityStatus === 'NO_WIFI_SETUP' ?
                            <View style={{alignSelf: 'center', backgroundColor: AppColors.zeplin.yellow, borderRadius: 22, marginTop: AppSizes.paddingSml, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthHalf,}}>
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'Tap to connect wifi'}</Text>
                                { isCalculating &&
                                    <View
                                        style={[StyleSheet.absoluteFill, {backgroundColor: AppColors.white,}]}
                                    />
                                }
                            </View>
                            :
                            null
            }
            { isCalculating &&
                <View style={[styles.sensorSessionLoading,]}>
                    <LottieView
                        autoPlay={true}
                        loop={true}
                        progress={1}
                        source={require('../../../assets/animation/checkingstatus.json')}
                        style={[styles.animationWrapper,]}
                    />
                    <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), marginTop: AppSizes.paddingSml,}}>
                        {'Checking status...'}
                    </Text>
                </View>
            }
        </TouchableOpacity>
    );
};

class MyPlan extends Component {
    static componentName = 'MyPlan';

    static propTypes = {
        clearCompletedCoolDownExercises: PropTypes.func.isRequired,
        clearCompletedExercises:         PropTypes.func.isRequired,
        clearHealthKitWorkouts:          PropTypes.func.isRequired,
        createSensorSession:             PropTypes.func.isRequired,
        getMobilize:                     PropTypes.func.isRequired,
        getMyPlan:                       PropTypes.func.isRequired,
        getSensorFiles:                  PropTypes.func.isRequired,
        getSoreBodyParts:                PropTypes.func.isRequired,
        handleReadInsight:               PropTypes.func.isRequired,
        healthData:                      PropTypes.object.isRequired,
        lastOpened:                      PropTypes.object.isRequired,
        network:                         PropTypes.object.isRequired,
        noSessions:                      PropTypes.func.isRequired,
        notification:                    PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string,
        ]),
        plan:                 PropTypes.object.isRequired,
        postReadinessSurvey:  PropTypes.func.isRequired,
        postSessionSurvey:    PropTypes.func.isRequired,
        postSymptoms:         PropTypes.func.isRequired,
        scheduledMaintenance: PropTypes.object,
        setAppLogs:           PropTypes.func.isRequired,
        updateSensorSession:  PropTypes.func.isRequired,
        updateUser:           PropTypes.func.isRequired,
        user:                 PropTypes.object.isRequired,
    }

    static defaultProps = {
        scheduledMaintenance: null,
    };

    constructor(props) {
        super(props);
        // setup variables
        let defaultState = _.cloneDeep(defaultPlanState);
        let newDailyReadiness = _.cloneDeep(defaultState.dailyReadiness);
        newDailyReadiness.soreness = PlanLogic.handleNewSoreBodyPartLogic(props.plan.soreBodyParts);
        // update state
        defaultState.dailyReadiness = newDailyReadiness;
        defaultState.healthData = props.healthData;
        defaultState.isReadinessSurveyCompleted = !props.plan.dailyPlan[0].daily_readiness_survey_completed;
        this.state = defaultState;
        // set variables for MyPlan
        this._activeTabs = [];
        this._scrollViewRef = {};
        this._timer = null;
        this.goToPageTimer = null;
        this.scrollToTimer = null;
    }

    componentDidMount = () => {
        const { notification, plan, scheduledMaintenance, } = this.props;
        const { healthData, } = this.state;
        AppState.addEventListener('change', this._handleAppStateChange);
        // check if we have an open 3S session that needs a PSS
        this._checkThreeSensorSessions();
        if(!scheduledMaintenance.addressed) {
            let apiMaintenanceWindow = { end_date: scheduledMaintenance.end_date, start_date: scheduledMaintenance.start_date };
            let parseMaintenanceWindow = ErrorMessages.getScheduledMaintenanceMessage(apiMaintenanceWindow);
            AppUtil.handleScheduledMaintenanceAlert(parseMaintenanceWindow.displayAlert, parseMaintenanceWindow.header, parseMaintenanceWindow.message);
        }
        if(notification) {
            this._handlePushNotification(this.props);
        }
        let planObj = plan.dailyPlan[0] || {};
        if(
            planObj.daily_readiness_survey_completed &&
            healthData.workouts &&
            healthData.workouts.length > 0
        ) {
            this._togglePostSessionSurveyModal();
        }
        // should we open the RS survey
        if(!planObj.daily_readiness_survey_completed) {
            this._timer = _.delay(() => this.setState({ isReadinessSurveyModalOpen: !planObj.daily_readiness_survey_completed, }), 600);
        } else {
            // scroll to first active activity tab
            this._timer = _.delay(() => this._scrollToFirstActiveActivityTab(), 600);
        }
        // handle Coach related items
        this._checkCoachStatus();
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const {
            isPageCalculating,
            isPrepareSessionsCompletionModalOpen,
            isPostSessionSurveyModalOpen,
            isReadinessSurveyModalOpen,
            isTrainSessionsCompletionModalOpen,
            loading,
        } = this.state;
        const { healthData, network, notification, plan, } = this.props;
        AppUtil.getNetworkStatus(prevProps, network, Actions);
        // handle PN
        if(prevProps.notification && prevProps.notification !== notification) {
            this._handlePushNotification(this.props);
        }
        // navigate to new page if we have a new plan
        const areObjectsDifferent = _.isEqual(prevProps.plan, plan);
        if(
            !areObjectsDifferent &&
            plan.dailyPlan[0] &&
            prevProps.plan.dailyPlan[0] &&
            prevProps.plan.dailyPlan[0].landing_screen !== plan.dailyPlan[0].landing_screen
        ) {
            // scroll to first active activity tab
            this._scrollToFirstActiveActivityTab();
        }
        // if we have workouts, handle RS or PSS
        if(!_.isEqual(prevProps.healthData, healthData) && healthData && healthData.workouts && healthData.workouts.length > 0) {
            let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
            if(dailyPlanObj.daily_readiness_survey_completed) {
                this.setState(
                    { healthData: healthData, },
                    () => this.state.isPostSessionSurveyModalOpen ? {} : this._togglePostSessionSurveyModal(),
                );
            } else {
                this.setState({ healthData: healthData, });
            }
        }
        // handle if PN is delayed to come in
        if(
            (prevState.isPageCalculating !== isPageCalculating && isPageCalculating) &&
            (
                isReadinessSurveyModalOpen ||
                isPostSessionSurveyModalOpen ||
                isPrepareSessionsCompletionModalOpen ||
                isTrainSessionsCompletionModalOpen ||
                loading
            )
        ) {
            // start timer
            this._timer = _.delay(() => this._handleExerciseListRefresh(false, false), timerDelay);
        } else if(prevState.isPageCalculating !== isPageCalculating && !isPageCalculating) {
            // clear timer
            clearInterval(this._timer);
        }
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
    }

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
        AppState.removeEventListener('change', this._handleAppStateChange);
        // clear timers
        clearInterval(this._timer);
        clearInterval(this.goToPageTimer);
        clearInterval(this.scrollToTimer);
    }

    _checkCoachStatus = () => {
        const { plan, user, } = this.props;
        if(
            plan.dailyPlan[0] &&
            plan.dailyPlan[0].daily_readiness_survey_completed &&
            user.first_time_experience &&
            (
                !user.first_time_experience.includes('plan_coach_1') ||
                !user.first_time_experience.includes('plan_coach_2')
            ) &&
            !this.state.isPageCalculating
        ) {
            this._timer = _.delay(() => this.setState({ isCoachModalOpen: true, }), 1000);
        }
    }

    _closePrepareSessionsCompletionModal = () => {
        this.goToPageTimer = _.delay(() => {
            this.setState(
                { dailyReadiness: _.cloneDeep(defaultPlanState.dailyReadiness), },
                () => {
                    this._scrollToFirstActiveActivityTab();
                    this._timer = _.delay(() => this._checkCoachStatus(), 500);
                },
            );
        }, 500);
    }

    _checkThreeSensorSessions = () => {
        const { plan, user, } = this.props;
        const dailyPlan = plan.dailyPlan[0] || false;
        let trainingSessions = dailyPlan && dailyPlan.training_sessions ? dailyPlan.training_sessions : false;
        let processingSessions = user.sensor_data && user.sensor_data.sessions ? user.sensor_data.sessions : false;
        let inProcessSession = processingSessions ?
            _.find(
                processingSessions,
                session =>
                    session.status === 'PROCESSING_IN_PROGRESS' ||
                    session.status === 'UPLOAD_IN_PROGRESS' ||
                    session.status === 'UPLOAD_PAUSED'
            )
            :
            false;
        let nonCompleteThreeSensorSession = trainingSessions ?
            _.find(trainingSessions, session => session.source === 3 && !session.post_session_survey)
            :
            false;
        if(processingSessions && inProcessSession) {
            let plansSession = trainingSessions ?
                _.find(trainingSessions, session => session.source === 3 && session.session_id === inProcessSession.id)
                :
                false;
            if(trainingSessions && plansSession) {
                return false;
            }
            return this._preparePSSurvey(inProcessSession);
        } else if(trainingSessions && nonCompleteThreeSensorSession) {
            return this._preparePSSurvey(nonCompleteThreeSensorSession);
        }
        return false;
    }

    _closeTrainSessionsCompletionModal = () => {
        this.goToPageTimer = _.delay(() => {
            this.setState(
                { postSession: _.cloneDeep(defaultPlanState.postSession), },
                () => {
                    this._scrollToFirstActiveActivityTab();
                    this._timer = _.delay(() => this._checkCoachStatus(), 500);
                },
            );
        }, 500);
    }

    _handleAppStateChange = nextAppState => {
        const { lastOpened, notification, user, } = this.props;
        this.setState(
            { appState: nextAppState, },
            () => {
                // NOTE: THE FOLLOWING LINES ARE TO HELP US WITH OUR MEMOERY LEAK ISSUES
                if(nextAppState === 'background') {
                    if (Platform.OS === 'android') {
                        BackHandler.removeEventListener('hardwareBackPress');
                    }
                    AppState.removeEventListener('change', this._handleAppStateChange);
                    // clear timers
                    clearInterval(this._timer);
                    clearInterval(this.goToPageTimer);
                    clearInterval(this.scrollToTimer);
                } else if(nextAppState === 'active') {
                    if (Platform.OS === 'android') {
                        BackHandler.addEventListener('hardwareBackPress', () => true);
                    }
                    AppState.addEventListener('change', this._handleAppStateChange);
                    this._timer = null;
                    this.goToPageTimer = null;
                    this.scrollToTimer = null;
                    // check if we have an open 3S session that needs a PSS
                    this._checkThreeSensorSessions();
                }
                // NOTE: CONTINUE WITH OUR TRUE LOGIC
                let clearMyPlan = (
                    !lastOpened ||
                    !lastOpened.date ||
                    lastOpened.userId !== user.id ||
                    !moment().isSame(lastOpened.date, 'day')
                );
                if(nextAppState === 'active' && notification) {
                    this._handleEnteringApp(() => this._handlePushNotification(this.props));
                } else if(nextAppState === 'active' && (!lastOpened.date || !moment().isSame(lastOpened.date, 'day') || clearMyPlan)) {
                    Actions.reset('key1');
                } else if(
                    nextAppState === 'active' &&
                    user.health_enabled &&
                    (
                        !user.health_sync_date ||
                        (moment().diff(moment(user.health_sync_date), 'minutes') > 7)
                    )
                ) {
                    AppUtil.getAppleHealthKitData(user.id, user.health_sync_date, user.historic_health_sync_date);
                }
            },
        );
    }

    _handleAreaOfSorenessClick = (areaClicked, isDailyReadiness, isAllGood, resetSections, side, callback, isLogSymptoms) => {
        const { plan, } = this.props;
        const { dailyReadiness, logSymptoms, postSession, } = this.state;
        let stateObject = isDailyReadiness ? dailyReadiness : isLogSymptoms ? logSymptoms : postSession;
        let newSorenessFields = PlanLogic.handleAreaOfSorenessClick(stateObject, areaClicked, isAllGood, plan.soreBodyParts, resetSections, side);
        let newFormFields = _.update( stateObject, 'soreness', () => newSorenessFields);
        if (isDailyReadiness) {
            this.setState({ dailyReadiness: newFormFields, }, () => callback && callback());
        } else if(isLogSymptoms) {
            this.setState({ logSymptoms: newFormFields, }, () => callback && callback());
        } else {
            this.setState({ postSession: newFormFields, }, () => callback && callback());
        }
    }

    _handleDailyReadinessFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate, isMovementValue, callback) => {
        const { dailyReadiness, } = this.state;
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, dailyReadiness, isClearCandidate, isMovementValue);
        this.setState(
            { dailyReadiness: newFormFields, },
            () => callback && callback(),
        );
    }

    _handleDailyReadinessSurveySubmit = (isSecondFunctionalStrength, updateUserFlag) => {
        const { clearCompletedCoolDownExercises, clearCompletedExercises, clearHealthKitWorkouts, getSensorFiles, postReadinessSurvey, user, } = this.props;
        const { dailyReadiness, healthData, prepare, recover, } = this.state;
        let {
            newDailyReadiness,
            newDailyReadinessState,
            newPrepareObject,
            newRecoverObject,
            nonDeletedSessions,
        } = PlanLogic.handleReadinessSurveySubmitLogic(dailyReadiness, prepare, recover, healthData, user);
        this.setState(
            {
                apiIndex:                   nonDeletedSessions.length !== 0 ? 1 : 0,
                expandNotifications:        false,
                dailyReadiness:             newDailyReadinessState,
                healthData:                 _.cloneDeep(defaultPlanState.healthData),
                isPageCalculating:          true,
                isReadinessSurveyModalOpen: false,
                prepare:                    newPrepareObject,
                recover:                    newRecoverObject,
            },
            () => {
                postReadinessSurvey(newDailyReadiness, user.id)
                    .then(res => {
                        getSensorFiles(user);
                        return res;
                    })
                    .then(res => updateUserFlag ? this._handleUpdateFirstTimeExperience(updateUserFlag, () => res) : res)
                    .then(response => {
                        clearHealthKitWorkouts();
                        clearCompletedExercises();
                        clearCompletedCoolDownExercises();
                        // do we need to open 3-Sensor banner
                        AppUtil._handle3SensorBanner(user, response[0]);
                        // handle Coach related items
                        if(!this.state.isPrepareSessionsCompletionModalOpen) {
                            this._timer = _.delay(() => this._checkCoachStatus(), 500);
                        }
                        // udpate RS first_time_experience
                        if(!this.props.user.first_time_experience.includes('rs_begin_page')) {
                            this._handleUpdateFirstTimeExperience('rs_begin_page', () => this.setState({ apiIndex: null, isPageCalculating: false, }));
                        } else {
                            this.setState({ apiIndex: null, isPageCalculating: false, });
                        }
                    })
                    .catch(error =>
                        this.setState(
                            { apiIndex: null, isPageCalculating: false, },
                            () => _.delay(() => AppUtil.handleAPIErrorAlert(ErrorMessages.postReadinessSurvey), 500),
                        )
                    );
            }
        );
    }

    _handleEnteringApp = callback => {
        const { getMyPlan, getSoreBodyParts, healthData, lastOpened, plan, setAppLogs, user, } = this.props;
        const { dailyReadiness, } = this.state;
        // when we arrive, load MyPlan, if it hasn't been loaded today yet
        let userId = user.id;
        let clearMyPlan = (
            !lastOpened ||
            !lastOpened.date ||
            lastOpened.userId !== userId ||
            !moment().isSame(lastOpened.date, 'day')
        );
        this.setState({ isPageLoading: true, });
        getMyPlan(userId, moment().format('YYYY-MM-DD'), false, clearMyPlan)
            .then(response => {
                // reset state if clearMyPlan is true
                if(clearMyPlan) {
                    let defaultState = _.cloneDeep(defaultPlanState);
                    let newDailyReadiness = _.cloneDeep(defaultState.dailyReadiness);
                    newDailyReadiness.soreness = PlanLogic.handleNewSoreBodyPartLogic(plan.soreBodyParts);
                    // update state
                    defaultState.healthData = healthData;
                    defaultState.isReadinessSurveyCompleted = !plan.dailyPlan[0].daily_readiness_survey_completed;
                    defaultState.dailyReadiness = newDailyReadiness;
                    this.state = defaultState;
                }
                if(response.daily_plans[0].daily_readiness_survey_completed) {
                    // scroll to first active activity tab
                    this._scrollToFirstActiveActivityTab();
                    this.setState({ isPageLoading: false, });
                    if(callback) {
                        callback();
                    }
                } else {
                    this.setState({ isPageLoading: false, });
                    getSoreBodyParts(user.id)
                        .then(soreBodyParts => {
                            let newDailyReadiness = _.cloneDeep(dailyReadiness);
                            newDailyReadiness.soreness = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts.readiness);
                            this.setState({ dailyReadiness: newDailyReadiness, });
                            setAppLogs(user.id);
                            this.setState({
                                isPageLoading:              false,
                                isReadinessSurveyModalOpen: true,
                            });
                            if(callback) {
                                callback();
                            }
                        })
                        .catch(err => {
                            // if there was an error, maybe the survey wasn't created for yesterday so have them do it as a blank
                            let newDailyReadiness = _.cloneDeep(dailyReadiness);
                            newDailyReadiness.soreness = [];
                            this.setState({
                                dailyReadiness: newDailyReadiness,
                                isPageLoading:  false,
                            });
                            if(callback) {
                                callback();
                            }
                            AppUtil.handleAPIErrorAlert(ErrorMessages.getSoreBodyParts);
                        });
                }
            })
            .catch(error => {
                this.setState({ isPageLoading: false, });
                if(callback) {
                    callback();
                }
                AppUtil.handleAPIErrorAlert(ErrorMessages.getMyPlan);
            });
    }

    _handleExerciseListRefresh = (shouldClearCompletedExercises, isFromPushNotification, cleanSessions = false) => {
        const { clearCompletedCoolDownExercises, clearCompletedExercises, getMyPlan, getSensorFiles, user, } = this.props;
        const { dailyReadiness, } = this.state;
        // clear timer
        clearInterval(this._timer);
        let userId = user.id;
        this.setState(
            { isPageCalculating: isFromPushNotification ? false : true, isPageLoading: isFromPushNotification ? false : true, },
            () => {
                getMyPlan(userId, moment().format('YYYY-MM-DD'))
                    .then(() => getSensorFiles(user, cleanSessions))
                    .then(response => {
                        if(shouldClearCompletedExercises) {
                            clearCompletedExercises();
                            clearCompletedCoolDownExercises();
                        }
                        let newDailyReadiness = _.cloneDeep(dailyReadiness);
                        this.setState({
                            activityIdLoading:          null,
                            dailyReadiness:             newDailyReadiness,
                            isPageCalculating:          false,
                            isPageLoading:              false,
                            isReadinessSurveyModalOpen: !response.daily_plans[0].daily_readiness_survey_completed,
                        });
                    })
                    .catch(error => this.setState({ activityIdLoading: null, isPageCalculating: false, isPageLoading: false, }));
            }
        );
    }

    _handleGetMobilize = (isFromAddButton, type) => {
        const { getMobilize, user, } = this.props;
        this.setState(
            { apiIndex: isFromAddButton ? 3 : 2, expandNotifications: false, isPageCalculating: true, },
            () =>
                getMobilize(user.id, type)
                    .then(res => this.setState({ apiIndex: null, isPageCalculating: false, }))
                    .catch(() => this.setState({ apiIndex: null, isPageCalculating: false, }, () => AppUtil.handleAPIErrorAlert(ErrorMessages.noSessions)))
        );
    }

    _handleHealthDataFormChange = (index, name, value, callback) => {
        const { healthData, } = this.state;
        let newHealthData = _.cloneDeep(healthData.workouts);
        let newFormFields = _.update(newHealthData[index], name, () => value);
        if(name === 'deleted' && value === true) {
            newFormFields = _.update(newHealthData[index], 'post_session_survey.RPE', () => null);
        }
        newHealthData[index] = newFormFields;
        this.setState({
            healthData: {
                ignoredWorkouts: healthData.ignoredWorkouts,
                sleep:           healthData.sleep,
                workouts:        newHealthData,
            },
        }, () => {
            if(callback) { callback(); }
        });
    }

    _handleLogSymptomsFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate, isMovementValue, callback) => {
        const { logSymptoms, } = this.state;
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, logSymptoms, isClearCandidate, isMovementValue);
        this.setState(
            { logSymptoms: newFormFields, },
            () => callback && callback(),
        );
    }

    _handleLogSymptomsFormSubmit = () => {
        const { logSymptoms, } = this.state;
        const { postSymptoms, user, } = this.props;
        let clonedSoreness = _.cloneDeep(logSymptoms.soreness);
        let updatedSoreness = _.filter(clonedSoreness, s => s.tight || s.ache || s.sore || s.tender || s.knots || s.sharp);
        updatedSoreness = _.map(updatedSoreness, s => {
            let newSoreness = _.cloneDeep(s);
            newSoreness.ache = newSoreness.sore && newSoreness.sore > 0 ?
                newSoreness.sore
                : newSoreness.tender && newSoreness.tender > 0 ?
                    newSoreness.tender
                    :
                    newSoreness.ache;
            return newSoreness;
        });
        let newLogSymptoms = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
            soreness:   updatedSoreness,
        };
        this.setState(
            {
                apiIndex:               0,
                isLogSymptomsModalOpen: false,
                isPageCalculating:      true,
                logSymptoms:            {
                    soreness: [],
                },
            },
            () => postSymptoms(newLogSymptoms, user.id)
                .then(response =>
                    this.setState(
                        { apiIndex: null, isPageCalculating: false, },
                        () => {
                            // handle Coach related items
                            if(!this.state.isTrainSessionsCompletionModalOpen) {
                                this._timer = _.delay(() => this._checkCoachStatus(), 500);
                            }
                        }
                    )
                )
                .catch(error =>
                    this.setState(
                        { apiIndex: null, isPageCalculating: false, },
                        () => AppUtil.handleAPIErrorAlert(ErrorMessages.postSessionSurvey),
                    )
                ),
        );
    }

    _handleNoSessions = () => {
        const { noSessions, user, } = this.props;
        this.setState(
            { expandNotifications: false, isPageCalculating: true, },
            () =>
                noSessions(user.id)
                    .then(res => this.setState({ isPageCalculating: false, }))
                    .catch(() => this.setState({ isPageCalculating: false, }, () => AppUtil.handleAPIErrorAlert(ErrorMessages.noSessions)))
        );
    }

    _handlePostSessionFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate, isMovementValue, callback) => {
        const { postSession, } = this.state;
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, postSession, isClearCandidate, isMovementValue);
        this.setState(
            { postSession: newFormFields, },
            () => callback && callback(),
        );
    }

    _handlePostSessionSurveySubmit = (areAllDeleted, updateUserFlag) => {
        const { clearCompletedCoolDownExercises, clearCompletedExercises, clearHealthKitWorkouts, getSensorFiles, postSessionSurvey, user, } = this.props;
        const { healthData, postSession, recover, train, } = this.state;
        let {
            landingScreen,
            newPostSession,
            newPostSessionSessions,
            newRecoverObject,
            newTrainObject,
        } = PlanLogic.handlePostSessionSurveySubmitLogic(postSession, train, recover, healthData, user);
        this.setState(
            {
                apiIndex:                     1,
                expandNotifications:          false,
                goToScreen:                   landingScreen,
                healthData:                   [],
                train:                        newTrainObject,
                isPageCalculating:            true,
                isPostSessionSurveyModalOpen: false,
                postSession:                  {
                    description: '',
                    sessions:    newPostSessionSessions,
                    soreness:    [],
                },
                recover: newRecoverObject,
            },
            () => {
                clearHealthKitWorkouts() // clear HK workouts right away
                    .then(() => postSessionSurvey(newPostSession, user.id))
                    .then(() => getSensorFiles(user))
                    .then(res => updateUserFlag ? this._handleUpdateFirstTimeExperience(updateUserFlag, () => res) : res)
                    .then(response => {
                        this.setState(
                            { apiIndex: null, isPageCalculating: false, },
                            () => {
                                if(!areAllDeleted) {
                                    clearCompletedExercises();
                                    clearCompletedCoolDownExercises();
                                }
                                // scroll to first active activity tab
                                // this._scrollToFirstActiveActivityTab();
                                // handle Coach related items
                                if(!this.state.isTrainSessionsCompletionModalOpen) {
                                    this._timer = _.delay(() => this._checkCoachStatus(), 500);
                                }
                            }
                        );
                    })
                    .catch(error =>
                        this.setState(
                            { apiIndex: null, isPageCalculating: false, },
                            () => _.delay(() => AppUtil.handleAPIErrorAlert(ErrorMessages.postSessionSurvey), 500),
                        )
                    );
            }
        );
    }

    _handlePushNotification = props => {
        // need to update our state to clear all 'open' items
        this.setState(
            {
                isPostSessionSurveyModalOpen: false,
                isReadinessSurveyModalOpen:   false,
                loading:                      false,
            },
            () => {
                // continue current logic
                const pushNotificationUpdate = PlanLogic.handlePushNotification(props, this.state);
                // scroll to first active activity tab
                this._scrollToFirstActiveActivityTab();
                if(pushNotificationUpdate.stateName !== '' || pushNotificationUpdate.newStateFields !== '') {
                    this.setState({
                        [pushNotificationUpdate.stateName]: pushNotificationUpdate.newStateFields,
                        isPageCalculating:                  false,
                    });
                }
                if(pushNotificationUpdate.updateExerciseList) {
                    this._handleExerciseListRefresh(true, true);
                }
                if(pushNotificationUpdate.updatePushNotificationFlag) {
                    AppUtil.updatePushNotificationFlag();
                }
            }
        );
    }

    _handleSensorFilesRefresh = activityId => {
        const { getSensorFiles, user, } = this.props;
        this.setState(
            { activityIdLoading: activityId, isPageCalculating: true, },
            () => {
                getSensorFiles(user)
                    .then(res => this.setState({ activityIdLoading: null, isPageCalculating: false, }))
                    .catch(err =>
                        this.setState(
                            { activityIdLoading: null, isPageCalculating: false, },
                            () => AppUtil.handleAPIErrorAlert(ErrorMessages.getMyPlan),
                        )
                    );
            },
        );
    }

    _handleSingleSensorSessionFormChange = (name, value, callback) => {
        const { sensorSession, } = this.state;
        let newSensorData = _.cloneDeep(sensorSession);
        let newFormFields = _.update(newSensorData, name, () => value);
        if(name === 'deleted' && value === true) {
            newFormFields = _.update(newSensorData, 'post_session_survey.RPE', () => null);
        }
        newSensorData = newFormFields;
        this.setState({
            sensorSession: newSensorData,
        }, () => {
            if(callback) { callback(); }
        });
    }

    _handleSingleSensorPostSessionSurveySubmit = async () => {
        const {
            clearCompletedCoolDownExercises,
            clearCompletedExercises,
            clearHealthKitWorkouts,
            getSensorFiles,
            postSessionSurvey,
            updateSensorSession,
            user,
        } = this.props;
        const { healthData, postSession, recover, sensorSession, train, } = this.state;
        let updatedPostSession = _.cloneDeep(postSession);
        updatedPostSession.sessions.push(sensorSession);
        let savedSensorSession = _.cloneDeep(sensorSession);
        let {
            landingScreen,
            newPostSession,
            newPostSessionSessions,
            newRecoverObject,
            newTrainObject,
        } = PlanLogic.handlePostSessionSurveySubmitLogic(updatedPostSession, train, recover, healthData, user);
        this.setState(
            {
                apiIndex:                     1,
                expandNotifications:          false,
                goToScreen:                   landingScreen,
                healthData:                   [],
                train:                        newTrainObject,
                isPageCalculating:            true,
                isPostSessionSurveyModalOpen: false,
                postSession:                  {
                    description: '',
                    sessions:    newPostSessionSessions,
                    soreness:    [],
                },
                recover:       newRecoverObject,
                sensorSession: null,
            },
            () =>
                updateSensorSession(newPostSession.sessions[0].end_date, false, savedSensorSession.id || savedSensorSession.session_id, user, newPostSession.sessions[0].set_end_date)
                    .then(() => clearHealthKitWorkouts()) // clear HK workouts right away
                    .then(() => {
                        newPostSession.sessions[0].end_date = `${moment().toISOString(true).split('.')[0]}Z`;
                        return postSessionSurvey(newPostSession, user.id);
                    })
                    .then(() => getSensorFiles(user))
                    .then(response => {
                        this.setState(
                            {
                                apiIndex:                 null,
                                isPageCalculating:        false,
                                isReturnSensorsModalOpen: !this.props.user.first_time_experience.includes('RETURN_SENSORS_MODAL'),
                            },
                            () => {
                                clearCompletedExercises();
                                clearCompletedCoolDownExercises();
                                // scroll to first active activity tab
                                // this._scrollToFirstActiveActivityTab();
                                // handle Coach related items
                                if(!this.state.isTrainSessionsCompletionModalOpen) {
                                    this._timer = _.delay(() => this._checkCoachStatus(), 500);
                                }
                            },
                        );
                    })
                    .catch(error =>
                        this.setState(
                            { apiIndex: null, isPageCalculating: false, },
                            () => AppUtil.handleAPIErrorAlert(ErrorMessages.postSessionSurvey),
                        )
                    ),
        );
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

    _handleUpdateSensorSession = async activity => {
        const { updateSensorSession, user, } = this.props;
        let startTime = moment(activity.event_date.replace('Z', ''), 'YYYY-MM-DDTHH:mm:ssZ');
        if(moment().diff(startTime, 'minutes', true) >= 5) {
            return this.setState(
                { loading: true, showLoadingText: true, },
                async () => {
                    let newSensorSession = _.cloneDeep(activity);
                    newSensorSession.deleted = false;
                    newSensorSession.ignored = false;
                    newSensorSession.hr_data = [];
                    newSensorSession.session_type = 6;
                    newSensorSession.source = 3;
                    newSensorSession.sport_name = 17;
                    newSensorSession.post_session_survey = {
                        clear_candidates: [],
                        event_date:       `${moment().toISOString(true).split('.')[0]}Z`,
                        RPE:              null,
                        soreness:         [],
                    };
                    try {
                        const timesyncApiCall = await fetch('http://worldtimeapi.org/api/timezone/America/New_York');
                        const timesyncResponse = await timesyncApiCall.json();
                        let dateTimeReturned = timesyncResponse.utc_datetime;
                        let indexOfDot = dateTimeReturned.indexOf('.');
                        dateTimeReturned = dateTimeReturned.substr(0, (indexOfDot + 3)) + 'Z';
                        let endDateTime = moment(timesyncResponse.utc_datetime.replace('Z', ''));
                        let startDateTime = moment(newSensorSession.event_date.replace('Z', ''), 'YYYY-MM-DDTHH:mm:ssZ');
                        let duration = endDateTime.diff(startDateTime, 'minutes', true);
                        newSensorSession.duration = _.round(duration, 2);
                        newSensorSession.end_date = dateTimeReturned;
                        newSensorSession.set_end_date = false;
                        return this.setState(
                            { sensorSession: newSensorSession, },
                            () => this._togglePostSessionSurveyModal(),
                        );
                    } catch (e) {
                        newSensorSession.set_end_date = true;
                        newSensorSession.end_date = null;
                        return this.setState(
                            { sensorSession: newSensorSession, },
                            () => this._togglePostSessionSurveyModal(),
                        );
                    }
                },
            );
        }
        return Alert.alert(
            'Are you sure you want to end?',
            'Workouts less than 5 min don\'t have enough data to properly process.',
            [
                {
                    text:    'End Now',
                    onPress: () =>
                        this.setState(
                            { activityIdLoading: activity.id, isPageCalculating: true, },
                            () =>
                                updateSensorSession(false, 'TOO_SHORT', activity.id, user)
                                    .then(res => this._handleExerciseListRefresh(false, true))
                                    .catch(err => this.setState({ activityIdLoading: null, isPageCalculating: false, })),
                        )
                },
                {
                    text:  'Continue Run',
                    style: 'cancel',
                },
            ],
            { cancelable: false, }
        );
    }

    _handleUpdateUserHealthKitFlag = (flag, callback) => {
        const { updateUser, user, } = this.props;
        // setup variables
        let newUserPayloadObj = {};
        newUserPayloadObj.health_enabled = flag;
        let newUserObj = _.cloneDeep(user);
        newUserObj.health_enabled = flag;
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

    _onLayoutOfActivityTabs = ev => this._activeTabs.push({x: ev.nativeEvent.layout.x, y: ev.nativeEvent.layout.y,})

    _preparePSSurvey = threeSensorSession => {
        let newSensorSession = _.cloneDeep(threeSensorSession);
        newSensorSession.deleted = false;
        newSensorSession.ignored = false;
        newSensorSession.set_end_date = false;
        newSensorSession.hr_data = [];
        newSensorSession.session_id = newSensorSession.session_id || newSensorSession.id; 
        newSensorSession.sport_name = newSensorSession.sport_name || 17;
        newSensorSession.end_date = newSensorSession.end_date || `${moment().toISOString(true).split('.')[0]}Z`;
        newSensorSession.session_type = newSensorSession.session_type || 6;
        newSensorSession.source = newSensorSession.source || 3;
        newSensorSession.post_session_survey = {
            RPE:              null,
            clear_candidates: [],
            event_date:       `${moment().toISOString(true).split('.')[0]}Z`,
            soreness:         [],
        };
        return this.setState({
            sensorSession: newSensorSession,
        }, () => this._togglePostSessionSurveyModal());
    }

    _scrollToFirstActiveActivityTab = () => {
        if(this._activeTabs[0] && this._scrollViewRef) {
            this.goToPageTimer = _.delay(() => {
                this._scrollViewRef.scrollTo({
                    x:        this._activeTabs[0].x,
                    y:        this._activeTabs[0].y,
                    animated: true,
                });
            }, 500);
        }
    }

    _toggleContactUsWebView = () => this.setState({ isContactUsOpen: !this.state.isContactUsOpen, })

    _togglePostSessionSurveyModal = () => {
        const { clearCompletedCoolDownExercises, clearCompletedExercises, getSoreBodyParts, user, } = this.props;
        const { isPSSCloseLocked, isPostSessionSurveyModalOpen, } = this.state;
        let isLoading = Platform.OS === 'ios';
        this.setState(
            { isPSSCloseLocked: true, loading: isLoading, showLoadingText: true, },
            () => {
                if (!isPostSessionSurveyModalOpen && !isPSSCloseLocked) {
                    getSoreBodyParts(user.id)
                        .then(soreBodyParts => {
                            let newPostSession = _.cloneDeep(defaultPlanState.postSession);
                            newPostSession.soreness = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts.readiness);
                            this.goToPageTimer = _.delay(() =>
                                this.setState({
                                    isPSSCloseLocked:             false,
                                    isPostSessionSurveyModalOpen: true,
                                    loading:                      false,
                                    postSession:                  newPostSession,
                                    showLoadingText:              false,
                                })
                            , 500);
                        })
                        .catch(err => {
                            // if there was an error, maybe the survey wasn't created for yesterday so have them do it as a blank
                            let newPostSession = _.cloneDeep(defaultPlanState.postSession);
                            newPostSession.soreness = [];
                            this.setState({
                                isPSSCloseLocked:             false,
                                isPostSessionSurveyModalOpen: true,
                                loading:                      false,
                                postSession:                  newPostSession,
                                showLoadingText:              false,
                            });
                            AppUtil.handleAPIErrorAlert(ErrorMessages.getSoreBodyParts);
                        });
                } else if(!isPSSCloseLocked) {
                    clearCompletedExercises();
                    clearCompletedCoolDownExercises();
                    this.goToPageTimer = _.delay(() => {
                        this.setState({
                            isPSSCloseLocked:             false,
                            isPostSessionSurveyModalOpen: false,
                            loading:                      false,
                            postSession:                  _.cloneDeep(defaultPlanState.postSession),
                            showLoadingText:              false,
                        });
                    }, 500);
                }
            }
        );
    }

    render = () => {
        let {
            activityIdLoading,
            apiIndex,
            appState,
            dailyReadiness,
            expandNotifications,
            healthData,
            isCoachModalOpen,
            isContactUsOpen,
            isLogSymptomsModalOpen,
            isPageCalculating,
            isPageLoading,
            isPostSessionSurveyModalOpen,
            isPrepareSessionsCompletionModalOpen,
            isReadinessSurveyModalOpen,
            isReturnSensorsModalOpen,
            isStartSensorSessionModalOpen,
            isTrainSessionsCompletionModalOpen,
            loading,
            logSymptoms,
            postSession,
            sensorSession,
            showLoadingText,
            trainLoadingScreenText,
        } = this.state;
        let { createSensorSession, getSensorFiles, handleReadInsight, network, plan, updateSensorSession, updateUser, user, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        const {
            activeAfterModalities,
            activeBeforeModalities,
            askForNewMobilize,
            beforeCompletedLockedModalities,
            filteredTrainingSessions,
            hasActive3SensorSession,
            isReadinessSurveyCompleted,
            networkName,
            newInsights,
            offDaySelected,
            sensorSessions,
            trendCategories,
            trendDashboardCategories,
            triggerStep,
            userHas3SensorSystem,
        } = PlanLogic.handleMyPlanRenderLogic(dailyPlanObj, user);
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1,}}>

                <CustomMyPlanNavBar
                    categories={trendCategories}
                    handleReadInsight={insightType => {
                        let newDailyPlan = _.cloneDeep(plan.dailyPlan[0]);
                        let trendCategoryIndex = _.findIndex(newDailyPlan.trends.trend_categories, ['insight_type', insightType]);
                        newDailyPlan.trends.trend_categories[trendCategoryIndex].first_time_experience = false;
                        handleReadInsight(newDailyPlan, insightType, user.id);
                    }}
                    toggleCareModal={() => this.setState({ isLogSymptomsModalOpen: true, })}
                    togglePreventionModal={() => userHas3SensorSystem ? this.setState({ isStartSensorSessionModalOpen: true, }) : this.setState({ isNeedHelpModalOpen: true, })}
                    toggleRecoveryModal={() => this._togglePostSessionSurveyModal()}
                    user={isReadinessSurveyCompleted && !isPageCalculating ? user : {}}
                />

                <Placeholder
                    isReady={true}//!isPageCalculating}
                    animation={'fade'}
                    whenReadyRender={() =>
                        <View style={{flex: 1,}}>
                            { isReadinessSurveyCompleted ?
                                <ScrollView
                                    contentContainerStyle={{
                                        paddingBottom:     AppSizes.isIphoneX ? (AppSizes.iphoneXBottomBarPadding + AppSizes.paddingMed) : AppSizes.paddingMed,
                                        paddingHorizontal: AppSizes.paddingMed,
                                        paddingTop:        AppSizes.padding,
                                    }}
                                    ref={ref => {this._scrollViewRef = ref;}}
                                >

                                    { (userHas3SensorSystem && sensorSessions.length === 0 && !networkName) &&
                                        <SensorSession
                                            activity={{ status: 'NO_WIFI_SETUP', isNoWifiOrSessionsState: true, }}
                                            activityIdLoading={activityIdLoading}
                                            userSesnorData={user.sensor_data}
                                        />
                                    }

                                    { offDaySelected &&
                                        <ActivityTab
                                            completed={true}
                                            title={'Off Day'}
                                        />
                                    }

                                    {_.map(beforeCompletedLockedModalities, (completedLockedModality, key) => (
                                        <ActivityTab
                                            // completed={completedLockedModality.completed}
                                            completed={completedLockedModality.isCompleted}
                                            isSensorSession={completedLockedModality.source === 3 ? completedLockedModality.event_date : false}
                                            key={key}
                                            // locked={!completedLockedModality.active && !completedLockedModality.completed}
                                            locked={completedLockedModality.isLocked}
                                            subtitle={completedLockedModality.subtitle}
                                            title={completedLockedModality.title}
                                        />
                                    ))}

                                    {_.map(sensorSessions, (activity, key) =>
                                        <SensorSession
                                            activity={activity}
                                            activityIdLoading={activityIdLoading}
                                            askForNewMobilize={askForNewMobilize}
                                            handleGetMobilize={() => console.log('hi - PL should updat this to new api')} // TODO: UPDATE PLAN INSTEAD
                                            handeRefresh={this._handleSensorFilesRefresh}
                                            key={key}
                                            onLayout={ev => (key + 1) === sensorSessions.length && activity.status !== 'PROCESSING_COMPLETE' ? this._onLayoutOfActivityTabs(ev) : null}
                                            toggleContactUsWebView={this._toggleContactUsWebView}
                                            updateSensorSession={this._handleUpdateSensorSession}
                                            userSesnorData={user.sensor_data}
                                        />
                                    )}

                                    {_.map(activeBeforeModalities, (activeModality, key) => (
                                        <ActivityTab
                                            backgroundImage={activeModality.backgroundImage}
                                            id={activeModality.modality}
                                            key={key}
                                            onLayout={ev => this._onLayoutOfActivityTabs(ev)}
                                            onPress={
                                                activityIdLoading ?
                                                    null
                                                    : activeModality.isBodyModality ?
                                                        () => AppUtil.pushToScene('bodyModality', { modality: activeModality.modality, })
                                                        :
                                                        () => AppUtil.pushToScene('exerciseModality', { index: key, modality: activeModality.modality, })
                                            }
                                            subtitle={activeModality.subtitle}
                                            timing={activeModality.timing}
                                            title={activeModality.title}
                                        />
                                    ))}

                                    { triggerStep &&
                                        <View>
                                            <TabIcon
                                                color={AppColors.white}
                                                containerStyle={[{backgroundColor: AppColors.zeplin.splash, borderTopLeftRadius: 5, borderTopRightRadius: 5, paddingVertical: AppSizes.paddingSml,}]}
                                                icon={'check-circle'}
                                                size={28}
                                                type={'material-community'}
                                            />
                                            <View style={{backgroundColor: AppColors.zeplin.superLight, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed,}}>
                                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>{triggerStep}</Text>
                                            </View>
                                        </View>
                                    }

                                    { (dailyPlanObj.train_later && !triggerStep) &&
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), marginBottom: AppSizes.paddingMed, textAlign: 'center',}}>{'Tap "+" to log training or an off day'}</Text>
                                    }

                                    {_.map(activeAfterModalities, (activeModality, key) => (
                                        <ActivityTab
                                            backgroundImage={activeModality.backgroundImage}
                                            id={activeModality.modality}
                                            key={key}
                                            onLayout={ev => this._onLayoutOfActivityTabs(ev)}
                                            onPress={
                                                activityIdLoading ?
                                                    null
                                                    : activeModality.isBodyModality ?
                                                        () => AppUtil.pushToScene('bodyModality', { modality: activeModality.modality, })
                                                        :
                                                        () => AppUtil.pushToScene('exerciseModality', { index: key, modality: activeModality.modality, })
                                            }
                                            subtitle={activeModality.subtitle}
                                            timing={activeModality.timing}
                                            title={activeModality.title}
                                        />
                                    ))}

                                </ScrollView>
                                :
                                null
                            }
                        </View>
                    }
                >
                    {_.times(numberOfPlaceholders, key =>
                        <View key={key} style={{alignItems: 'center', height: 150, marginTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingMed,}}>
                            <Line
                                color={AppColors.zeplin.superLight}
                                key={key}
                                noMargin
                                style={{alignSelf: 'center', borderRadius: 12, flex: 1,}}
                                textSize={150}
                            />
                        </View>
                    )}
                </Placeholder>

                { (isReadinessSurveyCompleted && !isPageCalculating && !hasActive3SensorSession) ?
                    <ActionButton
                        activeOpacity={1}
                        bgColor={'rgba(15, 19, 32, 0.8)'}
                        buttonColor={AppColors.zeplin.yellow}
                        fixNativeFeedbackRadius={true}
                        renderIcon={() =>
                            <TabIcon
                                color={AppColors.white}
                                icon={'add'}
                                size={40}
                            />
                        }
                        shadowStyle={{
                            shadowColor:   'rgba(235, 186, 45, 0.4)',
                            shadowOffset:  { height: 3, width: 0, },
                            shadowOpacity: 1,
                            shadowRadius:  6,
                        }}
                        size={65}
                        useNativeFeedback={false}
                    >
                        { (!offDaySelected && filteredTrainingSessions.length === 0) &&
                            <ActionButton.Item
                                activeOpacity={1}
                                buttonColor={AppColors.zeplin.yellow}
                                fixNativeFeedbackRadius={true}
                                hideShadow={true}
                                onPress={() => this._handleNoSessions()}
                                spaceBetween={Platform.OS === 'android' ? 0 : AppSizes.paddingMed}
                                textContainerStyle={{backgroundColor: AppColors.white, borderRadius: 12, height: (AppFonts.scaleFont(22) + 12),}}
                                textStyle={[AppStyles.robotoRegular, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22),}]}
                                title={'Off Day'}
                                useNativeFeedback={false}
                            >
                                <Image
                                    source={require('../../../assets/images/sports_images/icons8-meditation-200.png')}
                                    style={{height: 32, tintColor: AppColors.white, width: 32,}}
                                />
                            </ActionButton.Item>
                        }
                        <ActionButton.Item
                            activeOpacity={1}
                            buttonColor={AppColors.zeplin.yellow}
                            fixNativeFeedbackRadius={true}
                            hideShadow={true}
                            onPress={() => _.delay(() => this.setState({ isLogSymptomsModalOpen: true, }), 200)}
                            spaceBetween={Platform.OS === 'android' ? 0 : AppSizes.paddingMed}
                            textContainerStyle={{backgroundColor: AppColors.white, borderRadius: 12, height: (AppFonts.scaleFont(22) + 12),}}
                            textStyle={[AppStyles.robotoRegular, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22),}]}
                            title={'Log Symptoms'}
                            useNativeFeedback={false}
                        >
                            <TabIcon
                                color={AppColors.white}
                                icon={'ios-body'}
                                size={32}
                                type={'ionicon'}
                            />
                        </ActionButton.Item>
                        <ActionButton.Item
                            activeOpacity={1}
                            buttonColor={AppColors.zeplin.yellow}
                            fixNativeFeedbackRadius={true}
                            hideShadow={true}
                            onPress={() => this._togglePostSessionSurveyModal()}
                            spaceBetween={Platform.OS === 'android' ? 0 : AppSizes.paddingMed}
                            textContainerStyle={{backgroundColor: AppColors.white, borderRadius: 12, height: (AppFonts.scaleFont(22) + 12),}}
                            textStyle={[AppStyles.robotoRegular, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22),}]}
                            title={'Log Training'}
                            useNativeFeedback={false}
                        >
                            <Image
                                source={require('../../../assets/images/sports_images/icons8-exercise-200.png')}
                                style={{height: 32, tintColor: AppColors.white, width: 32,}}
                            />
                        </ActionButton.Item>
                        { askForNewMobilize &&
                            <ActionButton.Item
                                activeOpacity={1}
                                buttonColor={AppColors.zeplin.yellow}
                                fixNativeFeedbackRadius={true}
                                hideShadow={true}
                                onPress={() => this._handleGetModality(true, 1)}
                                spaceBetween={Platform.OS === 'android' ? 0 : AppSizes.paddingMed}
                                textContainerStyle={{backgroundColor: AppColors.white, borderRadius: 12, height: (AppFonts.scaleFont(22) + 12),}}
                                textStyle={[AppStyles.robotoRegular, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22),}]}
                                title={'Add Mobilize'}
                                useNativeFeedback={false}
                            >
                                <Image
                                    source={require('../../../assets/images/sports_images/icons8-warm-up-200.png')}
                                    style={{height: 32, tintColor: AppColors.white, width: 32,}}
                                />
                            </ActionButton.Item>
                        }
                        { userHas3SensorSystem &&
                            <ActionButton.Item
                                activeOpacity={1}
                                buttonColor={AppColors.zeplin.yellow}
                                fixNativeFeedbackRadius={true}
                                hideShadow={true}
                                onPress={() => this.setState({ isStartSensorSessionModalOpen: true, })}
                                spaceBetween={Platform.OS === 'android' ? 0 : AppSizes.paddingMed}
                                textContainerStyle={{backgroundColor: AppColors.white, borderRadius: 12, height: (AppFonts.scaleFont(22) + 12),}}
                                textStyle={[AppStyles.robotoRegular, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22),}]}
                                title={'Start a run with PRO'}
                                useNativeFeedback={false}
                            >
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/standard/kitpaused.png')}
                                    style={{height: 32, tintColor: AppColors.white, width: 32,}}
                                />
                            </ActionButton.Item>
                        }
                    </ActionButton>
                    : (isReadinessSurveyCompleted && !isPageLoading && (hasActive3SensorSession || !!activityIdLoading)) ?
                        <View style={[styles.disabledFABBtn,]}>
                            <TabIcon
                                color={AppColors.white}
                                icon={'add'}
                                size={40}
                            />
                        </View>
                        :
                        null
                }

                <FathomModal isVisible={isReadinessSurveyModalOpen}>
                    <ReadinessSurvey
                        dailyReadiness={dailyReadiness}
                        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                        handleFormChange={this._handleDailyReadinessFormChange}
                        handleFormSubmit={this._handleDailyReadinessSurveySubmit}
                        handleHealthDataFormChange={this._handleHealthDataFormChange}
                        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                        handleUpdateUserHealthKitFlag={this._handleUpdateUserHealthKitFlag}
                        healthKitWorkouts={healthData && healthData.workouts && healthData.workouts.length > 0 ? healthData.workouts : null}
                        soreBodyParts={plan.soreBodyParts}
                        trainingSessions={dailyPlanObj.training_sessions}
                        typicalSessions={plan.typicalSessions}
                        user={user}
                    />
                </FathomModal>

                <FathomModal isVisible={isPostSessionSurveyModalOpen}>
                    <PostSessionSurvey
                        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                        handleFormChange={this._handlePostSessionFormChange}
                        handleFormSubmit={(areAllDeleted, updateUserFlag) => sensorSession ? this._handleSingleSensorPostSessionSurveySubmit() : this._handlePostSessionSurveySubmit(areAllDeleted, updateUserFlag)}
                        handleHealthDataFormChange={this._handleHealthDataFormChange}
                        handleSingleSensorSessionFormChange={this._handleSingleSensorSessionFormChange}
                        handleTogglePostSessionSurvey={this._togglePostSessionSurveyModal}
                        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                        healthKitWorkouts={healthData && healthData.workouts && healthData.workouts.length > 0 ? healthData.workouts : null}
                        postSession={postSession}
                        sensorSession={sensorSession}
                        soreBodyParts={plan.soreBodyParts}
                        trainingSessions={dailyPlanObj.training_sessions}
                        typicalSessions={plan.typicalSessions}
                        user={user}
                    />
                </FathomModal>

                {/*<SessionsCompletionModal
                    isModalOpen={isPrepareSessionsCompletionModalOpen}
                    onClose={this._closePrepareSessionsCompletionModal}
                    sessions={dailyReadiness.sessions && dailyReadiness.sessions.length > 0 ? dailyReadiness.sessions : []}
                />
                <SessionsCompletionModal
                    isModalOpen={isTrainSessionsCompletionModalOpen}
                    onClose={this._closeTrainSessionsCompletionModal}
                    sessions={postSession && postSession.sessions && postSession.sessions.length > 0 ? postSession.sessions : []}
                />*/}

                { isStartSensorSessionModalOpen &&
                    <StartSensorSessionModal
                        appState={appState}
                        createSensorSession={createSensorSession}
                        getSensorFiles={getSensorFiles}
                        isModalOpen={isStartSensorSessionModalOpen}
                        network={network}
                        onClose={refreshPlan => this.setState({ isStartSensorSessionModalOpen: false, }, () => refreshPlan ? this._handleExerciseListRefresh(false, false, true) : null)}
                        updateSensorSession={updateSensorSession}
                        updateUser={updateUser}
                        user={user}
                    />
                }

                { loading ?
                    <Loading
                        text={showLoadingText ? trainLoadingScreenText : null}
                    />
                    :
                    null
                }

                <FathomModal
                    hasBackdrop={false}
                    isVisible={isCoachModalOpen}
                >
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end',}}>
                        { (this.props.user && this.props.user.first_time_experience && this.props.user.first_time_experience.includes('plan_coach_1') && !this.props.user.first_time_experience.includes('plan_coach_2')) &&
                            <View style={{flex: 1,}}>
                                <View style={{backgroundColor: AppColors.transparent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
                                <View style={{
                                    alignItems:        'center',
                                    backgroundColor:   AppColors.transparent,
                                    justifyContent:    'center',
                                    paddingHorizontal: AppSizes.paddingMed,
                                }}>
                                    <View style={{
                                        alignItems:      'center',
                                        backgroundColor: AppColors.transparent,
                                        borderRadius:    (45 / 2),
                                        height:          45,
                                        justifyContent:  'center',
                                        marginBottom:    AppSizes.paddingXSml,
                                        width:           45,
                                    }} />
                                    <Text robotoRegular style={{color: AppColors.transparent, fontSize: AppFonts.scaleFont(10), marginBottom: AppSizes.paddingSml, textAlign: 'center',}}>
                                        {'Care'}
                                    </Text>
                                </View>
                                <View style={{backgroundColor: AppColors.zeplin.navy, flex: 1, opacity: 0.8,}} />
                            </View>
                        }
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                this._handleUpdateFirstTimeExperience(!this.props.user.first_time_experience.includes('plan_coach_1') ? 'plan_coach_1' : 'plan_coach_2');
                                if(this.props.user && this.props.user.first_time_experience && this.props.user.first_time_experience.includes('plan_coach_1') && !this.props.user.first_time_experience.includes('plan_coach_2')) {
                                    this.setState({ isCoachModalOpen: false, });
                                }
                            }}
                            style={{backgroundColor: AppColors.white, elevation: 4, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingLrg, shadowColor: 'rgba(0, 0, 0, 0.16)', shadowOffset: { height: 3, width: 0, }, shadowOpacity: 1, shadowRadius: 20,}}
                        >
                            { this.props.user && this.props.user.first_time_experience && !this.props.user.first_time_experience.includes('plan_coach_1') ?
                                <View>
                                    <Text robotoMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), marginBottom: AppSizes.paddingSml,}}>{'Welcome to your Plan'}</Text>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginBottom: AppSizes.padding,}}>{'Your activities & exercises will update here as we learn more about your body & training!'}</Text>
                                </View>
                                :
                                <View>
                                    <Text robotoMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), marginBottom: AppSizes.paddingSml,}}>{'Your Insights'}</Text>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginBottom: AppSizes.padding,}}>{'As you use Fathom, our AI system will look for insights in your data & notify you here!'}</Text>
                                </View>
                            }
                            <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                <View>
                                    <Text robotoMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(22),}}>
                                        {'GOT IT'}
                                    </Text>
                                </View>
                                <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                    <View style={{backgroundColor: this.props.user && this.props.user.first_time_experience && !this.props.user.first_time_experience.includes('plan_coach_1') ? AppColors.zeplin.slateLight : AppColors.zeplin.slateXLight, borderRadius: (10 / 2), height: 10, marginRight: AppSizes.paddingXSml, width: 10,}} />
                                    <View style={{backgroundColor: this.props.user && this.props.user.first_time_experience && this.props.user.first_time_experience.includes('plan_coach_1') && !this.props.user.first_time_experience.includes('plan_coach_2') ? AppColors.zeplin.slateLight : AppColors.zeplin.slateXLight, borderRadius: (10 / 2), height: 10, width: 10,}} />
                                </View>
                                <Text robotoMedium style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(22),}}>
                                    {'GOT IT'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </FathomModal>

                <ContactUsModal
                    handleModalToggle={this._toggleContactUsWebView}
                    isModalOpen={isContactUsOpen}
                />

                <ReturnSensorsModal
                    handleModalToggle={() => this.setState({ isReturnSensorsModalOpen: !this.state.isReturnSensorsModalOpen, })}
                    isModalOpen={isReturnSensorsModalOpen}
                    updateUser={updateUser}
                    user={user}
                />

                <LoadingState
                    apiIndex={apiIndex}
                    isModalOpen={activityIdLoading ? false : isPageCalculating}
                    onClose={() =>
                        this.setState(
                            { isPageCalculating: false, },
                            () => {
                                this._scrollToFirstActiveActivityTab();
                                this._timer = _.delay(() => this._checkCoachStatus(), 750);
                            }
                        )
                    }
                />

                <LogSymptomsModal
                    handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                    handleClose={() => this.setState({ isLogSymptomsModalOpen: false, })}
                    handleFormChange={this._handleLogSymptomsFormChange}
                    handleFormSubmit={this._handleLogSymptomsFormSubmit}
                    isModalOpen={isLogSymptomsModalOpen}
                    soreBodyParts={plan.soreBodyParts}
                    soreness={logSymptoms.soreness}
                    user={user}
                />

                <WebViewPageModal
                    handleModalToggle={() => this.setState({ isNeedHelpModalOpen: !this.state.isNeedHelpModalOpen, })}
                    isModalOpen={this.state.isNeedHelpModalOpen}
                    webViewPageSource={'https://intercom.help/fathomai/'}
                />

            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default MyPlan;
