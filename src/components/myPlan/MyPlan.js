/**
 * MyPlan View
      <MyPlan
          clearCompletedCoolDownExercises={clearCompletedCoolDownExercises}
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
import { AppState, BackHandler, Image, Platform, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import { GoogleAnalyticsTracker, } from 'react-native-google-analytics-bridge';
import * as MagicMove from 'react-native-magic-move';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import LottieView from 'lottie-react-native';
import Placeholder, { Line, Media, } from 'rn-placeholder';
import moment from 'moment';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, } from '../../constants';
import { AppUtil, PlanLogic, } from '../../lib';
import { store } from '../../store';
import defaultPlanState from '../../states/plan';

// Components
import { TabIcon, Text, } from '../custom';
import { FathomModal, } from '../custom';
import { DefaultListGap, PostSessionSurvey, ReadinessSurvey, SessionsCompletionModal, } from './pages';
import { Loading, } from '../general';

// global constants
// const highSorenessMessage = 'Based on your reported discomfort we recommend you rest & utilize self-care techniques like heat, ice, or massage to help reduce swelling, ease pain, & speed up healing.\n\nIf you have pain or swelling that gets worse or doesn\'t go away, please seek appropriate medical attention.';
const numberOfPlaceholders = 8;
// const offDayLoggedText = 'Make the most of your training by resting well today: hydrate, eat well and sleep early.';
const timerDelay = 30000; // delay for X ms

// setup GA Tracker
const GATracker = new GoogleAnalyticsTracker('UA-127040201-1');

/* Styles ==================================================================== */

/* Component ==================================================================== */
const ActivityTab = ({
    backgroundImage = require('../../../assets/images/standard/active_rest_locked.png'),
    completed = false,
    id,
    locked = false,
    onLayout = () => {},
    onPress = () => {},
    paddingStyle = {paddingVertical: AppSizes.paddingMed,},
    showBottomGap = true,
    subtitle,
    title = 'CARE & ACTIVATE',
}) => (
    <View onLayout={event => onLayout(event)}>
        <View style={{flex: 1, flexDirection: 'row',}}>
            { completed ?
                <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                    <LottieView
                        autoPlay={true}
                        loop={false}
                        source={require('../../../assets/animation/checkmark-circle.json')}
                    />
                </View>
                :
                <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                    <TabIcon
                        color={AppColors.zeplin.lightSlate}
                        containerStyle={[{width: AppFonts.scaleFont(24),}]}
                        icon={locked ? 'lock' : 'check-circle'}
                        size={AppFonts.scaleFont(24)}
                        type={locked ? 'material' : 'material-community'}
                    />
                </View>
            }
            <View style={{borderRadius: AppSizes.padding, flex: 1, marginLeft: AppSizes.padding,}}>
                <TouchableOpacity activeOpacity={locked ? 1 : 0.2} onPress={locked ? () => {} : onPress} style={{flex: 1, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.padding,}}>
                    <MagicMove.Image
                        disabled={true}
                        id={`${id}.image`}
                        resizeMode={'cover'}
                        source={backgroundImage}
                        style={[{borderRadius: AppSizes.padding, height: 'auto', width: null,}, StyleSheet.absoluteFill,]}
                        useNativeDriver={false}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                        <View>
                            <MagicMove.Text
                                disabled={true}
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
                        { !locked && !completed &&
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

const MyPlanNavBar = ({
    onLeft = () => {},
}) => (
    <View>
        <View style={{backgroundColor: AppColors.white, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
        <View style={{backgroundColor: AppColors.white, flexDirection: 'row', height: AppSizes.navbarHeight,}}>
            <View style={{flex: 1, justifyContent: 'center', paddingLeft: AppSizes.paddingXSml,}}>
                <TabIcon
                    icon={'dehaze'}
                    iconStyle={[{color: AppColors.zeplin.darkSlate,}]}
                    onPress={() => onLeft()}
                    size={26}
                />
            </View>
            <Image
                source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
            />
            <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingXSml,}} />
        </View>
    </View>
);

class MyPlan extends Component {
    static componentName = 'MyPlan';

    static propTypes = {
        clearCompletedCoolDownExercises: PropTypes.func.isRequired,
        clearCompletedExercises:         PropTypes.func.isRequired,
        clearHealthKitWorkouts:          PropTypes.func.isRequired,
        getMyPlan:                       PropTypes.func.isRequired,
        getSoreBodyParts:                PropTypes.func.isRequired,
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

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        // scroll to first active activity tab
        this._scrollToFirstActiveActivityTab();
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
        this._timer = _.delay(() => {
            this.setState({ isReadinessSurveyModalOpen: !planObj.daily_readiness_survey_completed, });
        }, 600);
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
        // const areObjectsDifferent = _.isEqual(prevProps.plan, plan);
        // if(
        //     !areObjectsDifferent &&
        //     plan.dailyPlan[0] &&
        //     prevProps.plan.dailyPlan[0] &&
        //     prevProps.plan.dailyPlan[0].landing_screen !== plan.dailyPlan[0].landing_screen
        // ) {
        //     // TODO: this should now scroll??
        //     this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(plan.dailyPlan[0]));
        // }
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
        // const { goToScreen, } = this.state;
        this.setState(
            {
                isTrainSessionsCompletionModalOpen: false,
                postSession:                        _.cloneDeep(defaultPlanState.postSession),
            },
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
        this.setState({ isPageLoading: isFromPushNotification ? false : true, });
        getMyPlan(userId, moment().format('YYYY-MM-DD'))
            .then(response => {
                if(shouldClearCompletedExercises) {
                    clearCompletedExercises();
                    clearCompletedCoolDownExercises();
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
                // scroll to first active activity tab
                this._scrollToFirstActiveActivityTab();
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
        const { clearCompletedCoolDownExercises, clearCompletedExercises, clearHealthKitWorkouts, postReadinessSurvey, } = this.props;
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
                    this.setState({ isPrepareSessionsCompletionModalOpen: nonDeletedSessions.length !== 0, });
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
                clearCompletedCoolDownExercises();
            })
            .catch(error => {
                this.setState({ isPrepCalculating: false, isRecoverCalculating: false, });
                AppUtil.handleAPIErrorAlert(ErrorMessages.postReadinessSurvey);
            });
    }

    _handlePostSessionSurveySubmit = areAllDeleted => {
        const { clearCompletedCoolDownExercises, clearCompletedExercises, clearHealthKitWorkouts, postSessionSurvey, } = this.props;
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
                    clearCompletedCoolDownExercises();
                }
                // scroll to first active activity tab
                this._scrollToFirstActiveActivityTab();
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
            healthData,
            isPageLoading,
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
        let { noSessions, plan, user, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        const {
            completedModalities,
            isCWIActive,
            isCWICompleted,
            isHeatActive,
            isHeatCompleted,
            isIceActive,
            isIceCompleted,
            isReadinessSurveyCompleted,
        } = PlanLogic.handleMyPlanRenderLogic(dailyPlanObj);
        return (
            <MagicMove.Scene debug={false} disabled={true} id={'myPlanScene'} style={{flex: 1, backgroundColor: AppColors.white,}} useNativeDriver={false}>

                <MyPlanNavBar
                    onLeft={() => Actions.settings()}
                />

                <Placeholder
                    isReady={!isRecoverCalculating || !isPrepCalculating}
                    animation={'fade'}
                    whenReadyRender={() =>
                        <View style={{flexGrow: 1, padding: AppSizes.paddingMed,}}>
                            { isReadinessSurveyCompleted ?
                                <ScrollView
                                    ref={ref => {this._scrollViewRef = ref;}}
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
                                >

                                    {/*OFF DAY*/}
                                    { dailyPlanObj && !dailyPlanObj.sessions_planned &&
                                        <ActivityTab
                                            backgroundImage={require('../../../assets/images/standard/active_rest.png')}
                                            completed={true}
                                            showBottomGap={true}
                                            title={'OFF DAY'}
                                        />
                                    }

                                    {/* completed modalities (ordered) */}
                                    { _.map(completedModalities, (activity, key) =>
                                        <ActivityTab
                                            backgroundImage={require('../../../assets/images/standard/active_rest.png')}
                                            completed={true}
                                            key={key}
                                            showBottomGap={true}
                                            title={activity.title}
                                        />
                                    )}

                                    {/*pre_active_rest*/}
                                    {_.map(dailyPlanObj.pre_active_rest, (activeRest, key) => {
                                        const {
                                            isActive,
                                            isCompleted,
                                            isLastIndex,
                                            isLocked,
                                        } = PlanLogic.handleSingleExerciseModalityRenderLogic(activeRest, key, dailyPlanObj.pre_active_rest);
                                        if(!isActive) { return(null); }
                                        return (
                                            <ActivityTab
                                                backgroundImage={isLocked ? require('../../../assets/images/standard/active_rest_locked.png') : require('../../../assets/images/standard/active_rest.png')}
                                                completed={isCompleted}
                                                id={'prepareCareActivate'}
                                                key={key}
                                                locked={isLocked}
                                                onLayout={isActive ? ev => this._onLayoutOfActivityTabs(ev) : null}
                                                onPress={() => Actions.exerciseModality({ index: key, modality: 'prepare', })}
                                                showBottomGap={isLastIndex ? (isHeatActive || isHeatCompleted || dailyPlanObj.cool_down.length > 0 || dailyPlanObj.post_active_rest.length === 0 || dailyPlanObj.post_active_rest.length > 0) : true}
                                                subtitle={isLocked ? false : 'Anytime before training'} // TODO: ADD LOCKED TEXT
                                                title={'CARE & ACTIVATE'}
                                            />
                                        );
                                    })}

                                    {/*heat*/}
                                    { (isHeatActive || isHeatCompleted) && !isPrepCalculating &&
                                        <ActivityTab
                                            backgroundImage={require('../../../assets/images/standard/heat.png')}
                                            completed={isHeatCompleted}
                                            id={'heat'}
                                            onLayout={isHeatActive ? ev => this._onLayoutOfActivityTabs(ev) : null}
                                            onPress={() => Actions.bodyModality({ modality: 'heat', })}
                                            showBottomGap={false}
                                            subtitle={'30 minutes before training'}
                                            title={'HEAT'}
                                        />
                                    }

                                    {/*cool_down*/}
                                    {_.map(dailyPlanObj.cool_down, (activeRest, key) => {
                                        const {
                                            cooldownTitle,
                                            isActive,
                                            isCompleted,
                                        } = PlanLogic.handleSingleExerciseModalityRenderLogic(activeRest, key, dailyPlanObj.cool_down);
                                        if(!isActive) { return(null); }
                                        return (
                                            <ActivityTab
                                                backgroundImage={require('../../../assets/images/standard/cool_down.png')}
                                                completed={isCompleted}
                                                id={'coolDown'}
                                                key={key}
                                                onLayout={isActive ? ev => this._onLayoutOfActivityTabs(ev) : null}
                                                onPress={() => Actions.exerciseModality({ index: key, modality: 'coolDown', })}
                                                showBottomGap={true}
                                                subtitle={'Immediately after training'}
                                                title={cooldownTitle}
                                            />
                                        );
                                    })}

                                    {/*LOG TRAINING...(TEXT)*/}
                                    { dailyPlanObj && dailyPlanObj.sessions_planned &&
                                        <View style={{flexDirection: 'row',}}>
                                            <DefaultListGap
                                                size={AppSizes.paddingLrg}
                                            />
                                            <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', marginLeft: (AppSizes.paddingMed + AppSizes.padding), justifyContent: 'center',}}>
                                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(10), textAlign: 'right', marginVertical: AppSizes.paddingMed, paddingRight: AppSizes.paddingXSml,}}>{'Log training or off day'}</Text>
                                                <TabIcon
                                                    color={AppColors.white}
                                                    containerStyle={[Platform.OS === 'ios' ? AppStyles.scaleButtonShadowEffect : {elevation: 2,}, {backgroundColor: AppColors.zeplin.yellow, borderRadius: (20 / 2),}]}
                                                    icon={'add'}
                                                    size={20}
                                                />
                                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(10), textAlign: 'left', marginVertical: AppSizes.paddingMed, paddingLeft: AppSizes.paddingXSml,}}>{'to update your recovery'}</Text>
                                            </View>
                                        </View>
                                    }

                                    {/*post_active_rest*/}
                                    {dailyPlanObj.post_active_rest.length === 0 ?
                                        <ActivityTab
                                            backgroundImage={require('../../../assets/images/standard/active_rest_locked.png')}
                                            id={'recoverCareActivate'}
                                            locked={true}
                                            showBottomGap={false}
                                            subtitle={'Log an activity to generate a Recovery'}
                                            title={'CARE & ACTIVATE'}
                                        />
                                        :
                                        _.map(dailyPlanObj.post_active_rest, (activeRest, key) => {
                                            const {
                                                isActive,
                                                isCompleted,
                                                isLastIndex,
                                                isLocked,
                                            } = PlanLogic.handleSingleExerciseModalityRenderLogic(activeRest, key, dailyPlanObj.post_active_rest);
                                            if(!isActive || !isCompleted || !isLocked) {
                                                return(
                                                    <ActivityTab
                                                        backgroundImage={require('../../../assets/images/standard/active_rest_locked.png')}
                                                        id={'recoverCareActivate'}
                                                        locked={true}
                                                        showBottomGap={false}
                                                        subtitle={'Log an activity to generate a Recovery'}
                                                        title={'CARE & ACTIVATE'}
                                                    />
                                                );
                                            }
                                            return (
                                                <ActivityTab
                                                    backgroundImage={isLocked ? require('../../../assets/images/standard/active_rest_locked.png') : require('../../../assets/images/standard/active_rest.png')}
                                                    completed={isCompleted}
                                                    id={'recoverCareActivate'}
                                                    key={key}
                                                    locked={isLocked}
                                                    onLayout={isActive ? ev => this._onLayoutOfActivityTabs(ev) : null}
                                                    onPress={() => Actions.exerciseModality({ index: key, modality: 'recover', })}
                                                    showBottomGap={isLastIndex ? (isIceActive || isIceCompleted) : true}
                                                    subtitle={isLocked ? false : 'Anytime after training'} // TODO: ADD LOCKED TEXT
                                                    title={'CARE & ACTIVATE'}
                                                />
                                            );
                                        })
                                    }

                                    {/*ice*/}
                                    { (isIceActive || isIceCompleted) && !isRecoverCalculating &&
                                        <ActivityTab
                                            backgroundImage={require('../../../assets/images/standard/ice.png')}
                                            completed={isIceCompleted}
                                            id={'ice'}
                                            onLayout={isIceActive ? ev => this._onLayoutOfActivityTabs(ev) : null}
                                            onPress={() => Actions.bodyModality({ modality: 'ice', })}
                                            showBottomGap={isCWIActive || isCWICompleted}
                                            subtitle={'After all training is complete'}
                                            title={'ICE'}
                                        />
                                    }

                                    {/*cold_water_immersion*/}
                                    { (isCWIActive || isCWICompleted) && !isRecoverCalculating &&
                                        <ActivityTab
                                            backgroundImage={require('../../../assets/images/standard/cwi.png')}
                                            completed={isCWICompleted}
                                            id={'cwi'}
                                            onLayout={isCWIActive ? ev => this._onLayoutOfActivityTabs(ev) : null}
                                            onPress={() => Actions.bodyModality({ modality: 'cwi', })}
                                            showBottomGap={false}
                                            subtitle={'After all training is complete'}
                                            title={'COLD WATER BATH'}
                                        />
                                    }

                                </ScrollView>
                                :
                                null
                            }

                            { isReadinessSurveyCompleted ?
                                <ActionButton
                                    bgColor={'rgba(15, 19, 32, 0.8)'}
                                    buttonColor={AppColors.zeplin.yellow}
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
                                >
                                    <ActionButton.Item
                                        buttonColor={AppColors.zeplin.yellow}
                                        onPress={() => noSessions().catch(() => AppUtil.handleAPIErrorAlert(ErrorMessages.noSessions))}
                                        textContainerStyle={{backgroundColor: AppColors.white, borderRadius: 10, height: (AppFonts.scaleFont(22) + 16),}}
                                        textStyle={[AppStyles.oswaldRegular, {color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(22),}]}
                                        title={'OFF DAY'}
                                    >
                                        <Image
                                            source={require('../../../assets/images/sports_images/icons8-meditation-200.png')}
                                            style={{height: 32, tintColor: AppColors.white, width: 32,}}
                                        />
                                    </ActionButton.Item>
                                    <ActionButton.Item
                                        buttonColor={AppColors.zeplin.yellow}
                                        onPress={() => this._togglePostSessionSurveyModal()}
                                        textContainerStyle={{backgroundColor: AppColors.white, borderRadius: 10, height: (AppFonts.scaleFont(22) + 16),}}
                                        textStyle={[AppStyles.oswaldRegular, {color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(22),}]}
                                        title={'LOG TRAINING'}
                                    >
                                        <Image
                                            source={require('../../../assets/images/sports_images/icons8-exercise-200.png')}
                                            style={{height: 32, tintColor: AppColors.white, width: 32,}}
                                        />
                                    </ActionButton.Item>
                                </ActionButton>
                                :
                                null
                            }
                        </View>
                    }
                >
                    {_.times(numberOfPlaceholders, key =>
                        <View key={key} style={{paddingTop: AppSizes.paddingMed,}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', height: 100, padding: AppSizes.paddingMed,}}>
                                <Media
                                    color={AppColors.zeplin.superLight}
                                    hasRadius
                                    size={AppFonts.scaleFont(24)}
                                />
                                <Line
                                    color={AppColors.zeplin.superLight}
                                    noMargin
                                    style={{alignSelf: 'center', flex: 1, marginLeft: AppSizes.paddingMed,}}
                                    textSize={100}
                                />
                            </View>
                            <View style={{marginLeft: AppSizes.paddingMed,}}>
                                <DefaultListGap
                                    size={AppSizes.paddingLrg}
                                />
                            </View>
                        </View>
                    )}
                </Placeholder>

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