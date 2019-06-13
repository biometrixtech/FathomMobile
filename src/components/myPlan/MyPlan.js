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
import React, { Component, } from 'react';
import {
    AppState,
    BackHandler,
    Image,
    ImageBackground,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import { GoogleAnalyticsTracker, } from 'react-native-google-analytics-bridge';
import * as MagicMove from 'react-native-magic-move';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import Collapsible from 'react-native-collapsible';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Placeholder, { Line, Media, } from 'rn-placeholder';
import moment from 'moment';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, MyPlan as MyPlanConstants, } from '../../constants';
import { AppUtil, PlanLogic, } from '../../lib';
import { store } from '../../store';
import defaultPlanState from '../../states/plan';

// Components
import { DeckCards, TabIcon, Text, } from '../custom';
import { FathomModal, } from '../custom';
import { PostSessionSurvey, ReadinessSurvey, SessionsCompletionModal, } from './pages';
import { Loading, } from '../general';

// global constants
const numberOfPlaceholders = 8;
const timerDelay = 30000; // delay for X ms
const UNREAD_NOTIFICATIONS_HEIGHT_WIDTH = (AppFonts.scaleFont(13) + (AppSizes.paddingXSml * 2));

// setup GA Tracker
const GATracker = new GoogleAnalyticsTracker('UA-127040201-1');

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    completedSubtitle: {
        fontSize: AppFonts.scaleFont(14),
    },
    completedTitle: {
        fontSize: AppFonts.scaleFont(18),
    },
    lockedSubtitle: {
        fontSize: AppFonts.scaleFont(12),
        opacity:  0.4,
    },
    lockedTitle: {
        fontSize: AppFonts.scaleFont(18),
        opacity:  0.4,
    },
    unreadNotificationsWrapper: {
        alignItems:      'center',
        backgroundColor: AppColors.zeplin.error,
        borderRadius:    (UNREAD_NOTIFICATIONS_HEIGHT_WIDTH / 2),
        height:          UNREAD_NOTIFICATIONS_HEIGHT_WIDTH,
        justifyContent:  'center',
        position:        'absolute',
        right:           (UNREAD_NOTIFICATIONS_HEIGHT_WIDTH / 3),
        top:             (UNREAD_NOTIFICATIONS_HEIGHT_WIDTH / 3),
        width:           UNREAD_NOTIFICATIONS_HEIGHT_WIDTH,
    },
});

/* Component ==================================================================== */
const ActivityTab = ({
    backgroundImage = false,
    completed,
    id,
    locked,
    onLayout,
    onPress ,
    subtitle,
    timing,
    title,
}) => (
    <View onLayout={onLayout ? event => onLayout(event) : null} style={{marginBottom: AppSizes.paddingMed,}}>
        { completed || locked ?
            <View style={{backgroundColor: AppColors.zeplin.superLight, borderRadius: 10, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.paddingSml,}}>
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
                        <Text
                            oswaldRegular
                            style={[completed ? styles.completedTitle : styles.lockedTitle, {color: AppColors.zeplin.slate,}]}
                        >{title}</Text>
                        { (subtitle && subtitle.length > 0) &&
                            <Text
                                numberOfLines={1}
                                robotoRegular
                                style={[completed ? styles.completedSubtitle : styles.lockedSubtitle, {color: AppColors.zeplin.slate,}]}
                            >{subtitle}</Text>
                        }
                    </View>
                </View>
            </View>
            :
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={onPress}
                style={[AppStyles.scaleButtonShadowEffect, {borderRadius: 10,}, Platform.OS === 'ios' ? {} : {elevation: 2,}]}
            >
                {/*<MagicMove.Image
                    disabled={true}
                    id={`${id}.image`}
                    resizeMode={'contain'}
                    source={backgroundImage}
                    style={[StyleSheet.absoluteFill, {borderRadius: 10, height: 'auto', width: 'auto',}]}
                    useNativeDriver={false}
                />*/}
                <ImageBackground
                    imageStyle={{borderRadius: 10,}}
                    resizeMode={'cover'}
                    source={backgroundImage}
                    style={{backgroundColor: AppColors.white, borderRadius: 10, height: 'auto', width: 'auto',}}
                >
                    <LinearGradient
                        colors={['rgba(112, 190, 199, 0.8)', 'rgba(112, 190, 199, 0.3)']}
                        end={{x: 1.0, y: 1.0}}
                        onPress={onPress}
                        start={{x: 0.1, y: 0.1}}
                        style={[{alignItems: 'flex-start', borderRadius: 10, padding: AppSizes.paddingMed,}]}
                    >
                        <TabIcon
                            color={AppColors.white}
                            icon={'check-circle-outline'}
                            size={AppFonts.scaleFont(24)}
                            type={'material-community'}
                        />
                        <View style={{marginTop: AppSizes.paddingLrg,}}>
                            <MagicMove.Text
                                allowFontScaling={false}
                                disabled={true}
                                id={`${id}.title`}
                                style={[AppStyles.oswaldRegular, {color: AppColors.white, fontSize: AppFonts.scaleFont(26),}]}
                                useNativeDriver={false}
                            >
                                {title}
                            </MagicMove.Text>
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

const MyPlanNavBar = ({
    cards = [],
    handleReadInsight,
    expandNotifications,
    onLeft,
    onRight,
    user,
}) => (
    <View style={{backgroundColor: AppColors.white,}}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={{flexDirection: 'row', height: AppSizes.navbarHeight, marginTop: AppSizes.statusBarHeight,}}>
            { user && user.sensor_data && user.sensor_data.mobile_udid && user.sensor_data.sensor_pid ?
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => Actions.sensorFiles()}
                    style={{flex: 1, justifyContent: 'center', marginLeft: AppSizes.paddingSml, paddingLeft: AppSizes.paddingSml,}}
                >
                    <Image
                        resizeMode={'contain'}
                        source={require('../../../assets/images/sensor/sensor_slate.png')}
                        style={{height: 20, width: 20,}}
                    />
                </TouchableOpacity>
                :
                <View style={{flex: 1, justifyContent: 'center',}} />
            }
            <Image
                source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
            />
            { cards.length > 0 ?
                <View style={{flex: 1, justifyContent: 'center', paddingRight: AppSizes.paddingSml,}}>
                    <TabIcon
                        icon={'notifications'}
                        iconStyle={[{color: AppColors.zeplin.slate,}]}
                        onPress={() => onRight()}
                        size={26}
                    />
                    {_.filter(cards, ['read', false]).length > 0 &&
                        <TouchableOpacity onPress={() => onRight()} style={[styles.unreadNotificationsWrapper,]}>
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(11),}}>{_.filter(cards, ['read', false]).length}</Text>
                        </TouchableOpacity>
                    }
                </View>
                :
                <View style={{flex: 1, justifyContent: 'center',}} />
            }
        </View>
        { cards.length > 0 &&
            <Collapsible collapsed={!expandNotifications}>
                <DeckCards
                    cards={cards}
                    handleReadInsight={index => handleReadInsight(index)}
                    hideDeck={() => onRight()}
                    isVisible={expandNotifications}
                    shrinkNumberOfLines={true}
                    unreadNotificationsCount={_.filter(cards, ['read', false]).length}
                />
            </Collapsible>
        }
    </View>
);

class MyPlan extends Component {
    static componentName = 'MyPlan';

    static propTypes = {
        clearCompletedCoolDownExercises: PropTypes.func.isRequired,
        clearCompletedExercises:         PropTypes.func.isRequired,
        clearHealthKitWorkouts:          PropTypes.func.isRequired,
        getMobilize:                     PropTypes.func.isRequired,
        getMyPlan:                       PropTypes.func.isRequired,
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
        scheduledMaintenance: PropTypes.object,
        setAppLogs:           PropTypes.func.isRequired,
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
        const { notification, plan, scheduledMaintenance, user, } = this.props;
        const { healthData, } = this.state;
        AppState.addEventListener('change', this._handleAppStateChange);
        if(!scheduledMaintenance.addressed) {
            let apiMaintenanceWindow = { end_date: scheduledMaintenance.end_date, start_date: scheduledMaintenance.start_date };
            let parseMaintenanceWindow = ErrorMessages.getScheduledMaintenanceMessage(apiMaintenanceWindow);
            AppUtil.handleScheduledMaintenanceAlert(parseMaintenanceWindow.displayAlert, parseMaintenanceWindow.header, parseMaintenanceWindow.message);
        }
        if(notification) {
            this._handlePushNotification(this.props);
        }
        // set GA variables
        GATracker.setUser(user.id);
        GATracker.setAppVersion(AppUtil.getAppBuildNumber().toString());
        GATracker.setAppName(`Fathom-${store.getState().init.environment}`);
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
                    () => this._togglePostSessionSurveyModal(),
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

    _closePrepareSessionsCompletionModal = () => {
        this.goToPageTimer = _.delay(() => {
            this.setState(
                {
                    dailyReadiness:                       _.cloneDeep(defaultPlanState.dailyReadiness),
                    isPrepareSessionsCompletionModalOpen: false,
                },
                () => this._scrollToFirstActiveActivityTab(),
            );
        }, 500);
    }

    _closeTrainSessionsCompletionModal = () => {
        this.goToPageTimer = _.delay(() => {
            this.setState(
                {
                    isTrainSessionsCompletionModalOpen: false,
                    postSession:                        _.cloneDeep(defaultPlanState.postSession),
                },
                () => this._scrollToFirstActiveActivityTab(),
            );
        }, 500);
    }

    _handleAppStateChange = nextAppState => {
        const { lastOpened, notification, user, } = this.props;
        let clearMyPlan = (
            !lastOpened ||
            !lastOpened.date ||
            lastOpened.userId !== user.id ||
            !moment().isSame(lastOpened.date, 'day')
        );
        if(nextAppState === 'active' && notification) {
            this._handleEnteringApp(() => this._handlePushNotification(this.props));
        } else if(nextAppState === 'active' && (!lastOpened.date || clearMyPlan)) {
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
    }

    _handleAreaOfSorenessClick = (areaClicked, isDailyReadiness, isAllGood, resetSections) => {
        const { plan, } = this.props;
        const { dailyReadiness, postSession, } = this.state;
        let stateObject = isDailyReadiness ? dailyReadiness : postSession;
        let newSorenessFields = PlanLogic.handleAreaOfSorenessClick(stateObject, areaClicked, isAllGood, plan.soreBodyParts, resetSections);
        let newFormFields = _.update( stateObject, 'soreness', () => newSorenessFields);
        if (isDailyReadiness) {
            this.setState({ dailyReadiness: newFormFields, });
        } else {
            this.setState({ postSession: newFormFields, });
        }
    }

    _handleDailyReadinessFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate, isMovementValue) => {
        const { dailyReadiness, } = this.state;
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, dailyReadiness, isClearCandidate, isMovementValue);
        this.setState({ dailyReadiness: newFormFields, });
    }

    _handleDailyReadinessSurveySubmit = isSecondFunctionalStrength => {
        const { clearCompletedCoolDownExercises, clearCompletedExercises, clearHealthKitWorkouts, postReadinessSurvey, user, } = this.props;
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
                expandNotifications:        false,
                dailyReadiness:             newDailyReadinessState,
                healthData:                 _.cloneDeep(defaultPlanState.healthData),
                isPageCalculating:          true,
                isReadinessSurveyModalOpen: false,
                prepare:                    newPrepareObject,
                recover:                    newRecoverObject,
            },
            () => {
                this.goToPageTimer = _.delay(() => {
                    this.setState({ isPrepareSessionsCompletionModalOpen: nonDeletedSessions.length !== 0, });
                }, 500)
            },
        );
        postReadinessSurvey(newDailyReadiness)
            .then(response => {
                this.setState(
                    { isPageCalculating: false, },
                    () => {
                        clearHealthKitWorkouts();
                        clearCompletedExercises();
                        clearCompletedCoolDownExercises();
                    }
                );
            })
            .catch(error => {
                this.setState(
                    { isPageCalculating: false, },
                    () => AppUtil.handleAPIErrorAlert(ErrorMessages.postReadinessSurvey),
                );
            });
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
                    getSoreBodyParts()
                        .then(soreBodyParts => {
                            let newDailyReadiness = _.cloneDeep(dailyReadiness);
                            newDailyReadiness.soreness = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts.readiness);
                            this.setState({ dailyReadiness: newDailyReadiness, });
                            setAppLogs();
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

    _handleExerciseListRefresh = (shouldClearCompletedExercises, isFromPushNotification) => {
        const { clearCompletedCoolDownExercises, clearCompletedExercises, getMyPlan, user, } = this.props;
        const { dailyReadiness, } = this.state;
        // clear timer
        clearInterval(this._timer);
        let userId = user.id;
        this.setState(
            { isPageLoading: isFromPushNotification ? false : true, },
            () => {
                getMyPlan(userId, moment().format('YYYY-MM-DD'))
                    .then(response => {
                        if(shouldClearCompletedExercises) {
                            clearCompletedExercises();
                            clearCompletedCoolDownExercises();
                        }
                        let newDailyReadiness = _.cloneDeep(dailyReadiness);
                        this.setState({
                            dailyReadiness:             newDailyReadiness,
                            isPageCalculating:          false,
                            isPageLoading:              false,
                            isReadinessSurveyModalOpen: !response.daily_plans[0].daily_readiness_survey_completed,
                        });
                    })
                    .catch(error => this.setState({ isPageLoading: false, }));
            }
        );
    }

    _handleGetMobilize = () => {
        const { getMobilize, } = this.props;
        this.setState(
            { expandNotifications: false, isPageCalculating: true, },
            () =>
                getMobilize()
                    .then(res => this.setState({ isPageCalculating: false, }))
                    .catch(() => this.setState({ isPageCalculating: false, }, () => AppUtil.handleAPIErrorAlert(ErrorMessages.noSessions)))
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

    _handleNoSessions = () => {
        const { noSessions, } = this.props;
        this.setState(
            { expandNotifications: false, isPageCalculating: true, },
            () =>
                noSessions()
                    .then(res => this.setState({ isPageCalculating: false, }))
                    .catch(() => this.setState({ isPageCalculating: false, }, () => AppUtil.handleAPIErrorAlert(ErrorMessages.noSessions)))
        );
    }

    _handlePostSessionFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate, isMovementValue) => {
        const { postSession, } = this.state;
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, postSession, isClearCandidate, isMovementValue);
        this.setState({ postSession: newFormFields, });
    }

    _handlePostSessionSurveySubmit = areAllDeleted => {
        const { clearCompletedCoolDownExercises, clearCompletedExercises, clearHealthKitWorkouts, postSessionSurvey, user, } = this.props;
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
            () => { this.goToPageTimer = _.delay(() => this.setState({ isTrainSessionsCompletionModalOpen: !areAllDeleted, }), 500); }
        );
        clearHealthKitWorkouts() // clear HK workouts right away
            .then(() => postSessionSurvey(newPostSession))
            .then(response => {
                this.setState({ isPageCalculating: false, });
                if(!areAllDeleted) {
                    clearCompletedExercises();
                    clearCompletedCoolDownExercises();
                }
                // scroll to first active activity tab
                this._scrollToFirstActiveActivityTab();
            })
            .catch(error => {
                this.setState({ isPageCalculating: false, });
                AppUtil.handleAPIErrorAlert(ErrorMessages.postSessionSurvey);
            });
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

    _togglePostSessionSurveyModal = () => {
        const { clearCompletedCoolDownExercises, clearCompletedExercises, getSoreBodyParts, } = this.props;
        const { isPostSessionSurveyModalOpen, } = this.state;
        let isLoading = Platform.OS === 'ios';
        this.setState({ loading: isLoading, showLoadingText: true, });
        if (!isPostSessionSurveyModalOpen) {
            getSoreBodyParts()
                .then(soreBodyParts => {
                    let newPostSession = _.cloneDeep(defaultPlanState.postSession);
                    newPostSession.soreness = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts.readiness);
                    this.goToPageTimer = _.delay(() =>
                        this.setState({
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
                        isPostSessionSurveyModalOpen: true,
                        loading:                      false,
                        postSession:                  newPostSession,
                        showLoadingText:              false,
                    });
                    AppUtil.handleAPIErrorAlert(ErrorMessages.getSoreBodyParts);
                });
        } else {
            clearCompletedExercises();
            clearCompletedCoolDownExercises();
            this.goToPageTimer = _.delay(() => {
                this.setState({
                    isPostSessionSurveyModalOpen: false,
                    loading:                      false,
                    postSession:                  _.cloneDeep(defaultPlanState.postSession),
                    showLoadingText:              false,
                });
            }, 500);
        }
    }

    render = () => {
        let {
            dailyReadiness,
            expandNotifications,
            healthData,
            isPageCalculating,
            isPageLoading,
            isPostSessionSurveyModalOpen,
            isPrepareSessionsCompletionModalOpen,
            isReadinessSurveyModalOpen,
            isTrainSessionsCompletionModalOpen,
            loading,
            postSession,
            showLoadingText,
            trainLoadingScreenText,
        } = this.state;
        let { handleReadInsight, plan, user, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        const {
            activeAfterModalities,
            activeBeforeModalities,
            afterCompletedLockedModalities,
            askForNewMobilize,
            beforeCompletedLockedModalities,
            filteredTrainingSessions,
            isReadinessSurveyCompleted,
            offDaySelected,
            triggerStep,
        } = PlanLogic.handleMyPlanRenderLogic(dailyPlanObj);
        return (
            <MagicMove.Scene debug={false} disabled={true} id={'myPlanScene'} style={{flex: 1, backgroundColor: AppColors.white,}} useNativeDriver={false}>

                <MyPlanNavBar
                    cards={dailyPlanObj.insights}
                    expandNotifications={expandNotifications}
                    handleReadInsight={index => handleReadInsight(dailyPlanObj, index)}
                    onLeft={() => Actions.settings()}
                    onRight={() => this.setState({ expandNotifications: !this.state.expandNotifications, })}
                    user={isReadinessSurveyCompleted && !isPageCalculating ? user : false}
                />

                <Placeholder
                    isReady={!isPageCalculating}
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
                                    refreshControl={
                                        <RefreshControl
                                            colors={[AppColors.zeplin.yellow]}
                                            onRefresh={() => this._handleExerciseListRefresh(false)}
                                            refreshing={isPageLoading}
                                            title={'Loading...'}
                                            titleColor={AppColors.zeplin.yellow}
                                            tintColor={AppColors.zeplin.yellow}
                                        />
                                    }
                                >

                                    { !triggerStep &&
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginBottom: AppSizes.paddingMed,}}>{'Before training'}</Text>
                                    }

                                    { offDaySelected &&
                                        <ActivityTab
                                            completed={true}
                                            title={'OFF DAY'}
                                        />
                                    }

                                    {_.map(beforeCompletedLockedModalities, (completedLockedModality, key) => (
                                        <ActivityTab
                                            completed={completedLockedModality.isCompleted}
                                            key={key}
                                            locked={completedLockedModality.isLocked}
                                            subtitle={completedLockedModality.subtitle}
                                            title={completedLockedModality.title}
                                        />
                                    ))}

                                    {_.map(activeBeforeModalities, (activeModality, key) => (
                                        <ActivityTab
                                            backgroundImage={activeModality.backgroundImage}
                                            id={activeModality.modality}
                                            key={key}
                                            onLayout={ev => this._onLayoutOfActivityTabs(ev)}
                                            onPress={() => activeModality.isBodyModality ? Actions.bodyModality({ modality: activeModality.modality, }) : Actions.exerciseModality({ index: key, modality: activeModality.modality, })}
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

                                    { (afterCompletedLockedModalities.length > 0 || activeAfterModalities.length > 0) &&
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginBottom: AppSizes.paddingMed,}}>{'After training'}</Text>
                                    }

                                    {_.map(afterCompletedLockedModalities, (completedLockedModality, key) => (
                                        <ActivityTab
                                            completed={completedLockedModality.isCompleted}
                                            key={key}
                                            locked={completedLockedModality.isLocked}
                                            subtitle={completedLockedModality.subtitle}
                                            title={completedLockedModality.title}
                                        />
                                    ))}

                                    {_.map(activeAfterModalities, (activeModality, key) => (
                                        <ActivityTab
                                            backgroundImage={activeModality.backgroundImage}
                                            id={activeModality.modality}
                                            key={key}
                                            onLayout={ev => this._onLayoutOfActivityTabs(ev)}
                                            onPress={() => activeModality.isBodyModality ? Actions.bodyModality({ modality: activeModality.modality, }) : Actions.exerciseModality({ index: key, modality: activeModality.modality, })}
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
                                style={{alignSelf: 'center', borderRadius: 10, flex: 1,}}
                                textSize={150}
                            />
                        </View>
                    )}
                </Placeholder>

                { isReadinessSurveyCompleted && !isPageCalculating &&
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
                                textContainerStyle={{backgroundColor: AppColors.white, borderRadius: 10, height: (AppFonts.scaleFont(22) + 16),}}
                                textStyle={[AppStyles.oswaldRegular, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22),}]}
                                title={'OFF DAY'}
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
                            onPress={() => this._togglePostSessionSurveyModal()}
                            spaceBetween={Platform.OS === 'android' ? 0 : AppSizes.paddingMed}
                            textContainerStyle={{backgroundColor: AppColors.white, borderRadius: 10, height: (AppFonts.scaleFont(22) + 16),}}
                            textStyle={[AppStyles.oswaldRegular, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22),}]}
                            title={'LOG TRAINING'}
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
                                onPress={() => this._handleGetMobilize()}
                                spaceBetween={Platform.OS === 'android' ? 0 : AppSizes.paddingMed}
                                textContainerStyle={{backgroundColor: AppColors.white, borderRadius: 10, height: (AppFonts.scaleFont(22) + 16),}}
                                textStyle={[AppStyles.oswaldRegular, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22),}]}
                                title={'ADD MOBILIZE'}
                                useNativeFeedback={false}
                            >
                                <Image
                                    source={require('../../../assets/images/sports_images/icons8-warm-up-200.png')}
                                    style={{height: 32, tintColor: AppColors.white, width: 32,}}
                                />
                            </ActionButton.Item>
                        }
                    </ActionButton>
                }

                <FathomModal
                    isVisible={isReadinessSurveyModalOpen}
                >
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
                        typicalSessions={plan.typicalSessions}
                        user={user}
                    />
                </FathomModal>
                <FathomModal
                    isVisible={isPostSessionSurveyModalOpen}
                >
                    <PostSessionSurvey
                        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                        handleFormChange={this._handlePostSessionFormChange}
                        handleFormSubmit={areAllDeleted => this._handlePostSessionSurveySubmit(areAllDeleted)}
                        handleHealthDataFormChange={this._handleHealthDataFormChange}
                        handleTogglePostSessionSurvey={this._togglePostSessionSurveyModal}
                        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                        healthKitWorkouts={healthData && healthData.workouts && healthData.workouts.length > 0 ? healthData.workouts : null}
                        postSession={postSession}
                        soreBodyParts={plan.soreBodyParts}
                        typicalSessions={plan.typicalSessions}
                        user={user}
                    />
                </FathomModal>
                <SessionsCompletionModal
                    isModalOpen={isPrepareSessionsCompletionModalOpen}
                    onClose={this._closePrepareSessionsCompletionModal}
                    sessions={dailyReadiness.sessions && dailyReadiness.sessions.length > 0 ? dailyReadiness.sessions : []}
                />
                <SessionsCompletionModal
                    isModalOpen={isTrainSessionsCompletionModalOpen}
                    onClose={this._closeTrainSessionsCompletionModal}
                    sessions={postSession && postSession.sessions && postSession.sessions.length > 0 ? postSession.sessions : []}
                />
                { loading ?
                    <Loading
                        text={showLoadingText ? trainLoadingScreenText : null}
                    />
                    :
                    null
                }

            </MagicMove.Scene>
        );
    }
}

/* Export Component ==================================================================== */
export default MyPlan;