/**
 * MyPlan View
      <MyPlan
          clearCompletedExercises={clearCompletedExercises}
          clearHealthKitWorkouts={clearHealthKitWorkouts}
          getMyPlan={getMyPlan}
          getSoreBodyParts={getSoreBodyParts}
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
    Platform,
    RefreshControl,
    ScrollView,
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
import LottieView from 'lottie-react-native';
import Placeholder, { Line, Media, } from 'rn-placeholder';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import moment from 'moment';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, MyPlan as MyPlanConstants, } from '../../constants';
import { AppUtil, PlanLogic, } from '../../lib';
import { store } from '../../store';
import defaultPlanState from '../../states/plan';

// Components
import { TabIcon, Text, } from '../custom';
import { Button, FathomModal, Spacer, } from '../custom';
import {
    DefaultListGap,
    PostSessionSurvey,
    ReadinessSurvey,
    RenderMyPlanTab,
    SessionsCompletionModal,
} from './pages';
import { Loading, } from '../general';

// Tabs titles
const tabs = ['PREPARE', 'TRAIN', 'RECOVER'];

// global constants
// const highSorenessMessage = 'Based on your reported discomfort we recommend you rest & utilize self-care techniques like heat, ice, or massage to help reduce swelling, ease pain, & speed up healing.\n\nIf you have pain or swelling that gets worse or doesn\'t go away, please seek appropriate medical attention.';
const offDayLoggedText = 'Make the most of your training by resting well today: hydrate, eat well and sleep early.';
const timerDelay = 30000; // delay for X ms

// setup GA Tracker
const GATracker = new GoogleAnalyticsTracker('UA-127040201-1');

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
    scrollViewContainerStyle: {
        backgroundColor: AppColors.white,
        flexGrow:        1,
        paddingLeft:     AppSizes.padding,
        paddingRight:    AppSizes.paddingLrg,
        paddingVertical: AppSizes.paddingLrg,
    },
});

/* Component ==================================================================== */
const ActivityTab = ({
    backgroundImage = require('../../../assets/images/standard/active_rest_locked.png'),
    completed = false,
    id,
    locked = true,
    onPress = () => {},
    paddingStyle = {paddingVertical: AppSizes.paddingMed,},
    showBottomGap = true,
    subtitle = 'Anytime before training',
    title = 'CARE & ACTIVATE',
}) => (
    completed ?
        <View>
            <View style={[paddingStyle, {flex: 1, flexDirection: 'row',}]}>
                <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                    <LottieView
                        autoPlay={true}
                        loop={false}
                        source={require('../../../assets/animation/checkmark-circle.json')}
                    />
                </View>
                <Text oswaldRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(24), marginLeft: (AppSizes.padding + AppSizes.paddingMed),}}>{title}</Text>
            </View>
            { showBottomGap &&
                <DefaultListGap
                    size={AppSizes.paddingLrg}
                />
            }
        </View>
        :
        <View>
            <View style={{flex: 1, flexDirection: 'row',}}>
                <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                    <TabIcon
                        color={AppColors.zeplin.lightSlate}
                        containerStyle={[{width: AppFonts.scaleFont(24),}]}
                        icon={locked ? 'lock' : 'check-circle'}
                        size={AppFonts.scaleFont(24)}
                        type={locked ? 'material' : 'material-community'}
                    />
                </View>
                <View style={{borderRadius: AppSizes.padding, flex: 1, marginLeft: AppSizes.padding,}}>
                    <TouchableOpacity onPress={locked ? () => {} : onPress} style={{flex: 1, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.padding,}}>
                        <MagicMove.Image
                            id={`${id}.image`}
                            resizeMode={'cover'}
                            source={backgroundImage}
                            style={[{borderRadius: AppSizes.padding, height: 'auto', width: null,}, StyleSheet.absoluteFill,]}
                            useNativeDriver={false}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                            <View>
                                <MagicMove.Text
                                    id={`${id}.title`}
                                    style={[AppStyles.oswaldRegular, {color: AppColors.white, fontSize: AppFonts.scaleFont(24),}]}
                                    useNativeDriver={false}
                                >
                                    {title}
                                </MagicMove.Text>
                                { subtitle && subtitle.length > 0 &&
                                    <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(12), marginTop: AppSizes.paddingXSml,}}>{subtitle}</Text>
                                }
                            </View>
                            { !locked &&
                                <TabIcon
                                    color={AppColors.white}
                                    containerStyle={[{justifyContent: 'center',}]}
                                    icon={'chevron-right'}
                                    size={AppFonts.scaleFont(28)}
                                    type={'material-community'}
                                />
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            { showBottomGap &&
                <DefaultListGap
                    size={AppSizes.paddingLrg}
                />
            }
        </View>
);

class MyPlan extends Component {
    static componentName = 'MyPlan';

    static propTypes = {
        clearCompletedExercises: PropTypes.func.isRequired,
        clearHealthKitWorkouts:  PropTypes.func.isRequired,
        getMyPlan:               PropTypes.func.isRequired,
        getSoreBodyParts:        PropTypes.func.isRequired,
        healthData:              PropTypes.object.isRequired,
        lastOpened:              PropTypes.object.isRequired,
        network:                 PropTypes.object.isRequired,
        noSessions:              PropTypes.func.isRequired,
        notification:            PropTypes.oneOfType([
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
        let defaultState = _.cloneDeep(defaultPlanState);
        defaultState.healthData = props.healthData;
        defaultState.isReadinessSurveyCompleted = !props.plan.dailyPlan[0].daily_readiness_survey_completed;
        this.state = defaultState;
        this.tabView = null;
        this.renderTab = this.renderTab.bind(this);
        this.goToPageTimer = null;
        this._timer = null;
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        // we've already fetched MyPlan, make necessary state updates
        const { plan, } = this.props;
        const { dailyReadiness, } = this.state;
        let planObj = plan.dailyPlan[0] || {};
        if(planObj.daily_readiness_survey_completed) {
            this.goToPageTimer = _.delay(() => this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(planObj)), 500);
        } else {
            let newDailyReadiness = _.cloneDeep(dailyReadiness);
            newDailyReadiness.soreness = PlanLogic.handleNewSoreBodyPartLogic(plan.soreBodyParts);
            this.setState({
                dailyReadiness:             newDailyReadiness,
                isReadinessSurveyModalOpen: true,
            });
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
            this._goToScrollviewPage(1, () => {
                this._togglePostSessionSurveyModal();
            });
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const {
            isPrepCalculating,
            isPrepareSessionsCompletionModalOpen,
            isPostSessionSurveyModalOpen,
            isReadinessSurveyModalOpen,
            isRecoverCalculating,
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
            this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(plan.dailyPlan[0]));
        }
        // if we have workouts, handle RS or PSS
        if(!_.isEqual(prevProps.healthData, healthData) && healthData && healthData.workouts && healthData.workouts.length > 0) {
            let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
            if(dailyPlanObj.daily_readiness_survey_completed) {
                this._goToScrollviewPage(1, () => {
                    this.setState(
                        { healthData: healthData, },
                        () => this._togglePostSessionSurveyModal(),
                    );
                });
            } else {
                this.setState({ healthData: healthData, });
            }
        }
        // handle if PN is delayed to come in
        if(
            (
                (prevState.isPrepCalculating !== isPrepCalculating && isPrepCalculating) ||
                (prevState.isRecoverCalculating !== isRecoverCalculating && isRecoverCalculating)
            ) &&
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
        } else if(
            (prevState.isPrepCalculating !== isPrepCalculating && !isPrepCalculating) ||
            (prevState.isRecoverCalculating !== isRecoverCalculating && !isRecoverCalculating)
        ) {
            // clear timer
            clearInterval(this._timer);
        }
    }

    _handleEnteringApp = callback => {
        const { getMyPlan, getSoreBodyParts, lastOpened, setAppLogs, user, } = this.props;
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
                if(response.daily_plans[0].daily_readiness_survey_completed) {
                    this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(response.daily_plans[0]));
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
        const { clearCompletedExercises, getMyPlan, user, } = this.props;
        const { dailyReadiness, } = this.state;
        // clear timer
        clearInterval(this._timer);
        let userId = user.id;
        this.setState({ isPageLoading: isFromPushNotification ? false : true, });
        getMyPlan(userId, moment().format('YYYY-MM-DD'))
            .then(response => {
                const dailyPlanObj = response.daily_plans && response.daily_plans[0] ? response.daily_plans[0] : false;
                this.goToPageTimer = _.delay(() => this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(dailyPlanObj)), 500);
                if(shouldClearCompletedExercises) {
                    clearCompletedExercises();
                }
                let newDailyReadiness = _.cloneDeep(dailyReadiness);
                this.setState({
                    dailyReadiness:       newDailyReadiness,
                    isPageLoading:        false,
                    isPrepCalculating:    false,
                    isRecoverCalculating: false,
                });
            })
            .catch(error => this.setState({ isPageLoading: false, }));
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
                this._goToScrollviewPage(pushNotificationUpdate.page, () => {
                    if(pushNotificationUpdate.stateName !== '' || pushNotificationUpdate.newStateFields !== '') {
                        this.setState({
                            [pushNotificationUpdate.stateName]: pushNotificationUpdate.newStateFields,
                            isPrepCalculating:                  false,
                            isRecoverCalculating:               false,
                        });
                    }
                    if(pushNotificationUpdate.updateExerciseList) {
                        this._handleExerciseListRefresh(true, true);
                    }
                    if(pushNotificationUpdate.updatePushNotificationFlag) {
                        AppUtil.updatePushNotificationFlag();
                    }
                });
            }
        );
    }

    _handleDailyReadinessFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate, isMovementValue) => {
        const { dailyReadiness, } = this.state;
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, dailyReadiness, isClearCandidate, isMovementValue);
        this.setState({ dailyReadiness: newFormFields, });
    }

    _handlePostSessionFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate, isMovementValue) => {
        const { postSession, } = this.state;
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, postSession, isClearCandidate, isMovementValue);
        this.setState({ postSession: newFormFields, });
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

    _handleReadinessSurveySubmit = isSecondFunctionalStrength => {
        const { clearCompletedExercises, clearHealthKitWorkouts, postReadinessSurvey, } = this.props;
        const { dailyReadiness, healthData, prepare, recover, } = this.state;
        let {
            newDailyReadiness,
            newDailyReadinessState,
            newPrepareObject,
            newRecoverObject,
            nonDeletedSessions,
        } = PlanLogic.handleReadinessSurveySubmitLogic(dailyReadiness, prepare, recover, healthData);
        this.setState(
            {
                dailyReadiness:             newDailyReadinessState,
                healthData:                 _.cloneDeep(defaultPlanState.healthData),
                isPrepCalculating:          newDailyReadiness.sessions_planned,
                isReadinessSurveyModalOpen: false,
                isRecoverCalculating:       !newDailyReadiness.sessions_planned,
                prepare:                    newPrepareObject,
                recover:                    newRecoverObject,
            },
            () => {
                this.goToPageTimer = _.delay(() => {
                    this.setState(
                        { isPrepareSessionsCompletionModalOpen: nonDeletedSessions.length !== 0, },
                        () => { if(!newDailyReadiness.sessions_planned) { this._goToScrollviewPage(2); } }
                    );
                }, 500)
            },
        );
        postReadinessSurvey(newDailyReadiness)
            .then(response => {
                if(nonDeletedSessions.length === 0) {
                    this.setState({ isPrepCalculating: false, isRecoverCalculating: false, });
                }
                clearHealthKitWorkouts();
                clearCompletedExercises();
            })
            .catch(error => {
                this.setState({ isPrepCalculating: false, isRecoverCalculating: false, });
                AppUtil.handleAPIErrorAlert(ErrorMessages.postReadinessSurvey);
            });
    }

    _handlePostSessionSurveySubmit = areAllDeleted => {
        const { clearCompletedExercises, clearHealthKitWorkouts, postSessionSurvey, } = this.props;
        const { healthData, postSession, recover, train, } = this.state;
        let {
            landingScreen,
            newPostSession,
            newPostSessionSessions,
            newRecoverObject,
            newTrainObject,
        } = PlanLogic.handlePostSessionSurveySubmitLogic(postSession, train, recover, healthData);
        this.setState(
            {
                goToScreen:                   landingScreen,
                healthData:                   [],
                train:                        newTrainObject,
                isPostSessionSurveyModalOpen: false,
                isRecoverCalculating:         !areAllDeleted,
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
                this.setState({ isRecoverCalculating: false, });
                if(!areAllDeleted) {
                    clearCompletedExercises();
                }
                let newLandingScreen = response.daily_plans[0].landing_screen;
                this._goToScrollviewPage(newLandingScreen);
            })
            .catch(error => {
                this.setState({ isRecoverCalculating: false, });
                AppUtil.handleAPIErrorAlert(ErrorMessages.postSessionSurvey);
            });
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

    _togglePostSessionSurveyModal = () => {
        const { clearCompletedExercises, getSoreBodyParts, } = this.props;
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

    _closePrepareSessionsCompletionModal = () => {
        const { dailyReadiness, } = this.state;
        this.goToPageTimer = _.delay(() => {
            this.setState(
                {
                    dailyReadiness:                       _.cloneDeep(defaultPlanState.dailyReadiness),
                    isPrepCalculating:                    false,
                    isPrepareSessionsCompletionModalOpen: false,
                    isRecoverCalculating:                 false,
                },
                () => {
                    if(!dailyReadiness.sessions_planned && dailyReadiness.sessions.length > 0) { this._goToScrollviewPage(2); }
                }
            );
        }, 500);
    }

    _closeTrainSessionsCompletionModal = () => {
        const { goToScreen, } = this.state;
        this.setState(
            {
                isTrainSessionsCompletionModalOpen: false,
                postSession:                        _.cloneDeep(defaultPlanState.postSession),
            },
            () => { this.goToPageTimer = _.delay(() => this._goToScrollviewPage(goToScreen), 500); }
        );
    }

    _goToScrollviewPage = (pageIndex, callback) => {
        const {
            isPostSessionSurveyModalOpen,
            isPrepareSessionsCompletionModalOpen,
            isReadinessSurveyModalOpen,
            isTrainSessionsCompletionModalOpen,
            loading,
        } = this.state;
        // only scroll to page when we
        if(!pageIndex && callback) {
            callback();
        } else if(
            this.tabView &&
            !isReadinessSurveyModalOpen &&
            !isPostSessionSurveyModalOpen &&
            !isPrepareSessionsCompletionModalOpen &&
            !isTrainSessionsCompletionModalOpen &&
            !loading &&
            (pageIndex || pageIndex === 0)
        ) {
            this.goToPageTimer = _.delay(() => {
                this.tabView.goToPage(pageIndex);
                if(callback) {
                    callback();
                }
            }, 300);
        }
    }

    _onChangeTab = tabLocation => {
        const currentScreenName = tabLocation.i === 0 ? 'PREPARE' : tabLocation.i === 1 ? 'TRAIN' : tabLocation.i === 2 ? 'RECOVER' : '';
        const fromScreenName = tabLocation.from === 0 ? 'PREPARE' : tabLocation.from === 1 ? 'TRAIN' : tabLocation.from === 2 ? 'RECOVER' : '';
        GATracker.trackScreenView(currentScreenName, { from: fromScreenName, });
        this.setState({ currentTabLocation: tabLocation.i, });
    }

    renderTab = (name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle) => {
        const { plan, } = this.props;
        const { isPostSessionSurveyModalOpen, isReadinessSurveyModalOpen, loading, } = this.state;
        return(
            <RenderMyPlanTab
                isPostSessionSurveyModalOpen={isPostSessionSurveyModalOpen}
                isReadinessSurveyModalOpen={isReadinessSurveyModalOpen}
                isTabActive={isTabActive}
                key={`${name}_${page}`}
                loading={loading}
                name={name}
                onLayoutHandler={onLayoutHandler}
                onPressHandler={onPressHandler}
                page={page}
                plan={plan}
                statePages={{
                    page0: this.state.page0,
                    page1: this.state.page1,
                    page2: this.state.page2,
                }}
                subtitle={subtitle}
                tabView={this.tabView}
                updatePageState={(page0, page1, page2) =>
                    this.setState({
                        page0,
                        page1,
                        page2,
                    })
                }
            />
        );
    }

    renderPrepare = index => {
        let { dailyReadiness, isPageLoading, isPrepCalculating, isPrepareSessionsCompletionModalOpen, isRecoverCalculating, } = this.state;
        let { plan, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let {
            compiledActivities,
            isCareAndActivateActive,
            isCareAndActivateCompleted,
            isCareAndActivateLocked,
            isHeatActive,
            isReadinessSurveyCompleted,
        } = PlanLogic.handleMyPlanRenderPrepareTabLogic(dailyPlanObj);
        return (
            <ScrollView
                contentContainerStyle={[customStyles.scrollViewContainerStyle]}
                refreshControl={
                    isPrepCalculating || isRecoverCalculating ?
                        null
                        :
                        <RefreshControl
                            colors={[AppColors.zeplin.yellow]}
                            onRefresh={() => this._handleExerciseListRefresh(false)}
                            refreshing={isPageLoading}
                            title={'Loading...'}
                            titleColor={AppColors.zeplin.yellow}
                            tintColor={AppColors.zeplin.yellow}
                        />
                }
                tabLabel={tabs[index]}
            >
                { isReadinessSurveyCompleted &&
                    <Placeholder
                        isReady={!isPrepCalculating}
                        animation={'fade'}
                        whenReadyRender={() =>
                            <View>
                                <View>
                                    <View style={{flex: 1, flexDirection: 'row', paddingBottom: AppSizes.paddingMed,}}>
                                        <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                                            <LottieView
                                                autoPlay={true}
                                                loop={false}
                                                source={require('../../../assets/animation/checkmark-circle.json')}
                                            />
                                        </View>
                                        <Text oswaldRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(24), marginLeft: (AppSizes.padding + AppSizes.paddingMed),}}>{'READINESS SURVEY'}</Text>
                                    </View>
                                    { (isCareAndActivateActive || isCareAndActivateCompleted || isCareAndActivateLocked) &&
                                        <DefaultListGap
                                            size={AppSizes.paddingLrg}
                                        />
                                    }
                                </View>
                                { _.map(compiledActivities, (activity, key) =>
                                    <ActivityTab
                                        completed={true}
                                        key={key}
                                        showBottomGap={true}
                                        title={activity.title}
                                    />
                                )}
                                { (isCareAndActivateActive || isCareAndActivateCompleted || isCareAndActivateLocked) &&
                                    <ActivityTab
                                        backgroundImage={isCareAndActivateLocked ? require('../../../assets/images/standard/active_rest_locked.png') : require('../../../assets/images/standard/active_rest.png')}
                                        completed={isCareAndActivateCompleted}
                                        id={'prepareCareActivate'}
                                        locked={isCareAndActivateLocked}
                                        onPress={() => Actions.exerciseList()}
                                        showBottomGap={isHeatActive}
                                        subtitle={isCareAndActivateLocked ? '' : 'Anytime before training'} // TODO: ADD LOCKED TEXT
                                        title={'CARE & ACTIVATE'}
                                    />
                                }
                                {/* isHeatActive && !isPrepCalculating &&
                                    <ActivityTab
                                        backgroundImage={require('../../../assets/images/standard/heat.png')}
                                        id={'prepareHeat'}
                                        onPress={() => console.log('hi from RENDERPREPARE - HEAT')}
                                        showBottomGap={false}
                                        subtitle={'30 minutes before training'}
                                        title={'HEAT'}
                                    />
                                  */}
                            </View>
                        }
                    >
                        <View>
                            <View style={{flex: 1, flexDirection: 'row',}}>
                                <Media
                                    hasRadius
                                    size={AppFonts.scaleFont(24)}
                                />
                                <Line
                                    color={AppColors.zeplin.superLight}
                                    style={{flex: 1, marginLeft: AppSizes.paddingMed,}}
                                    textSize={AppFonts.scaleFont(24)}
                                />
                            </View>
                            <DefaultListGap
                                size={AppSizes.paddingLrg}
                            />
                            <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', height: 100,}}>
                                <Media
                                    hasRadius
                                    size={AppFonts.scaleFont(24)}
                                />
                                <Line
                                    color={AppColors.zeplin.superLight}
                                    style={{flex: 1, marginLeft: AppSizes.paddingMed,}}
                                    textSize={100}
                                />
                            </View>
                        </View>
                    </Placeholder>
                }
                <SessionsCompletionModal
                    isModalOpen={isPrepareSessionsCompletionModalOpen}
                    onClose={this._closePrepareSessionsCompletionModal}
                    sessions={dailyReadiness.sessions && dailyReadiness.sessions.length > 0 ? dailyReadiness.sessions : []}
                />
            </ScrollView>
        );
    }

    renderTrain = index => {
        let { isTrainSessionsCompletionModalOpen, postSession, } = this.state;
        let { noSessions, plan, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let {
            filteredTrainingSessions,
            isDailyReadinessSurveyCompleted,
            logActivityButtonBackgroundColor,
            logActivityButtonColor,
            logActivityButtonOutlined,
            offDaySelected,
        } = PlanLogic.handleMyPlanRenderTrainTabLogic(dailyPlanObj, store.getState().plan);
        return (
            <ScrollView
                contentContainerStyle={[customStyles.scrollViewContainerStyle]}
                tabLabel={tabs[index]}
            >
                { (dailyPlanObj && !dailyPlanObj.sessions_planned) && filteredTrainingSessions && filteredTrainingSessions.length === 0 ?
                    <View>
                        <View style={{flex: 1, flexDirection: 'row', paddingBottom: AppSizes.paddingMed,}}>
                            <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                                <LottieView
                                    autoPlay={true}
                                    loop={false}
                                    source={require('../../../assets/animation/checkmark-circle.json')}
                                />
                            </View>
                            <Text oswaldRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(24), marginLeft: (AppSizes.padding + AppSizes.paddingMed),}}>{'OFF DAY'}</Text>
                        </View>
                        <View style={{flexDirection: 'row',}}>
                            <View style={{borderRightColor: AppColors.primary.grey.thirtyPercent, borderRightWidth: 1, width: (AppFonts.scaleFont(24) / 2),}} />{/* standard padding of 10 and 5 for half the default size of icons */}
                            <View style={{flex: 1, margin: 20,}}>
                                <Text robotoRegular style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(16),}]}>{offDayLoggedText}</Text>
                            </View>
                        </View>
                    </View>
                    :
                    null
                }
                {_.map(filteredTrainingSessions, (postPracticeSurvey, i) => {
                    let cleanedPostSessionName = MyPlanConstants.cleanedPostSessionName(postPracticeSurvey).fullName;
                    return(
                        <View key={`postPracticeSurveys${i}`}>
                            <View style={[{flex: 1, flexDirection: 'row',}, i > 0 ? {paddingVertical: AppSizes.paddingMed,} : {paddingBottom: AppSizes.paddingMed,},]}>
                                <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                                    <LottieView
                                        autoPlay={true}
                                        loop={false}
                                        source={require('../../../assets/animation/checkmark-circle.json')}
                                    />
                                </View>
                                <Text oswaldRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(24), marginLeft: (AppSizes.padding + AppSizes.paddingMed),}}>{cleanedPostSessionName}</Text>
                            </View>
                            <DefaultListGap
                                size={24}
                            />
                        </View>
                    );
                })}
                <Spacer size={15} />
                <Button
                    buttonStyle={{backgroundColor: logActivityButtonBackgroundColor, borderColor: isDailyReadinessSurveyCompleted ? logActivityButtonBackgroundColor : AppColors.zeplin.greyText, justifyContent: 'space-between',}}
                    icon={{
                        color: logActivityButtonColor,
                        name:  isDailyReadinessSurveyCompleted ? 'add' : 'lock',
                        size:  isDailyReadinessSurveyCompleted ? AppFonts.scaleFont(30) : 20,
                    }}
                    onPress={() => isDailyReadinessSurveyCompleted ? this._togglePostSessionSurveyModal() : null}
                    title={'Log completed activity'}
                    titleStyle={{color: logActivityButtonColor, flex: 8, fontSize: AppFonts.scaleFont(18), textAlign: 'left',}}
                    type={logActivityButtonOutlined ? 'outline' : 'solid'}
                />
                <Spacer size={10} />
                { !offDaySelected ?
                    <Button
                        buttonStyle={{backgroundColor: AppColors.white, borderColor: isDailyReadinessSurveyCompleted ? AppColors.zeplin.yellow : AppColors.zeplin.greyText, justifyContent: 'space-between',}}
                        icon={{
                            color: isDailyReadinessSurveyCompleted ? AppColors.zeplin.yellow : AppColors.zeplin.greyText,
                            name:  isDailyReadinessSurveyCompleted ? 'add' : 'lock',
                            size:  isDailyReadinessSurveyCompleted ? AppFonts.scaleFont(30) : 20,
                        }}
                        onPress={() => isDailyReadinessSurveyCompleted ? noSessions().catch(() => AppUtil.handleAPIErrorAlert(ErrorMessages.noSessions)) : null}
                        title={'Off day'}
                        titleStyle={{color: isDailyReadinessSurveyCompleted ? AppColors.zeplin.yellow : AppColors.zeplin.greyText, flex: 8, fontSize: AppFonts.scaleFont(18), textAlign: 'left',}}
                        type={'outline'}
                    />
                    :
                    null
                }
                <SessionsCompletionModal
                    isModalOpen={isTrainSessionsCompletionModalOpen}
                    onClose={this._closeTrainSessionsCompletionModal}
                    sessions={postSession && postSession.sessions && postSession.sessions.length > 0 ? postSession.sessions : []}
                />
            </ScrollView>
        );
    }

    renderRecover = index => {
        let { isPageLoading, isPrepCalculating, isRecoverCalculating, } = this.state;
        let { plan, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let {
            compiledActivities,
            isCareAndActivateActive,
            isCareAndActivateCompleted,
            isCareAndActivateLocked,
            isIceActive,
        } = PlanLogic.handleMyPlanRenderRecoverTabLogic(dailyPlanObj);
        return (
            <ScrollView
                contentContainerStyle={[customStyles.scrollViewContainerStyle]}
                refreshControl={
                    isPrepCalculating || isRecoverCalculating ?
                        null
                        :
                        <RefreshControl
                            colors={[AppColors.zeplin.yellow]}
                            onRefresh={() => this._handleExerciseListRefresh(false)}
                            refreshing={isPageLoading}
                            title={'Loading...'}
                            titleColor={AppColors.zeplin.yellow}
                            tintColor={AppColors.zeplin.yellow}
                        />
                }
                tabLabel={tabs[index]}
            >
                <Placeholder
                    isReady={!isRecoverCalculating}
                    animation={'fade'}
                    whenReadyRender={() =>
                        <View>
                            { _.map(compiledActivities, (activity, key) =>
                                <ActivityTab
                                    completed={true}
                                    key={key}
                                    paddingStyle={key === 0 ? {paddingBottom: AppSizes.paddingMed,} : {paddingVertical: AppSizes.paddingMed,}}
                                    showBottomGap={true}
                                    title={activity.title}
                                />
                            )}
                            { (isCareAndActivateActive || isCareAndActivateCompleted || isCareAndActivateLocked) ?
                                <ActivityTab
                                    backgroundImage={isCareAndActivateLocked ? require('../../../assets/images/standard/active_rest_locked.png') : require('../../../assets/images/standard/active_rest.png')}
                                    completed={isCareAndActivateCompleted}
                                    id={'recoverCareActivate'}
                                    locked={isCareAndActivateLocked}
                                    onPress={() => Actions.exerciseList()}
                                    paddingStyle={isCareAndActivateCompleted && compiledActivities.length === 0 ? {paddingBottom: AppSizes.paddingMed,} : {paddingVertical: AppSizes.paddingMed,}}
                                    showBottomGap={isIceActive}
                                    subtitle={isCareAndActivateLocked ? '' : 'Anytime before training'} // TODO: ADD LOCKED TEXT
                                    title={'CARE & ACTIVATE'}
                                />
                                :
                                <ActivityTab
                                    backgroundImage={require('../../../assets/images/standard/active_rest_locked.png')}
                                    id={'recoverCareActivate'}
                                    locked={true}
                                    showBottomGap={false}
                                    subtitle={'Log an activity to generate a Recovery'}
                                    title={'CARE & ACTIVATE'}
                                />
                            }
                            {/* isIceActive && !isRecoverCalculating &&
                                <ActivityTab
                                    backgroundImage={require('../../../assets/images/standard/ice.png')}
                                    id={'recoverIce'}
                                    onPress={() => console.log('hi from RENDERRECOVER - ICE')}
                                    showBottomGap={false}
                                    subtitle={'After all training complete'}
                                    title={'ICE'}
                                />
                            */}
                        </View>
                    }
                >
                    <View>
                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', height: 100,}}>
                            <Media
                                hasRadius
                                size={AppFonts.scaleFont(24)}
                            />
                            <Line
                                color={AppColors.zeplin.superLight}
                                style={{flex: 1, marginLeft: AppSizes.paddingMed,}}
                                textSize={100}
                            />
                        </View>
                    </View>
                </Placeholder>
            </ScrollView>
        )
    }

    render = () => {
        // making sure we can only drag horizontally if our modals are closed and nothing is loading
        const { plan, user, } = this.props;
        const {
            dailyReadiness,
            healthData,
            isPostSessionSurveyModalOpen,
            isPrepCalculating,
            isPrepareSessionsCompletionModalOpen,
            isReadinessSurveyModalOpen,
            isRecoverCalculating,
            isTrainSessionsCompletionModalOpen,
            loading,
            postSession,
            showLoadingText,
            trainLoadingScreenText,
        } = this.state;
        let isScrollLocked = (
            isReadinessSurveyModalOpen ||
            isPostSessionSurveyModalOpen ||
            loading ||
            isPrepareSessionsCompletionModalOpen ||
            isTrainSessionsCompletionModalOpen ||
            isPrepCalculating ||
            isRecoverCalculating
        );
        return(
            <MagicMove.Scene debug={false} id={'myPlanScene'} style={{flex: 1, backgroundColor: AppColors.white,}} useNativeDriver={false}>
                <View style={{flex: 1,}}>
                    <ScrollableTabView
                        locked={isScrollLocked}
                        onChangeTab={tabLocation => this._onChangeTab(tabLocation)}
                        ref={tabView => { this.tabView = tabView; }}
                        renderTabBar={() => <ScrollableTabBar renderTab={this.renderTab} style={{backgroundColor: AppColors.white, borderBottomWidth: 0,}} />}
                        style={{backgroundColor: AppColors.white,}}
                        tabBarActiveTextColor={AppColors.secondary.blue.hundredPercent}
                        tabBarInactiveTextColor={AppColors.primary.grey.hundredPercent}
                        tabBarUnderlineStyle={{height: 0,}}
                    >
                        {this.renderPrepare(0)}
                        {this.renderTrain(1)}
                        {this.renderRecover(2)}
                    </ScrollableTabView>
                    <FathomModal
                        isVisible={isReadinessSurveyModalOpen}
                        style={{margin: 0,}}
                    >
                        <ReadinessSurvey
                            dailyReadiness={dailyReadiness}
                            handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                            handleFormChange={this._handleDailyReadinessFormChange}
                            handleFormSubmit={this._handleReadinessSurveySubmit}
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
                        style={{margin: 0,}}
                        useNativeDriver={true}
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
                    { loading ?
                        <Loading
                            text={showLoadingText ? trainLoadingScreenText : null}
                        />
                        :
                        null
                    }
                </View>
            </MagicMove.Scene>
        );
    }
}

/* Export Component ==================================================================== */
export default MyPlan;