/**
 * MyPlan View
 */
import React, { Component, } from 'react';
// import { AppState, RefreshControl, StyleSheet, } from 'react-native';
import { BackHandler, ImageBackground, Platform, ScrollView, TouchableOpacity, View, } from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import { GoogleAnalyticsTracker, } from 'react-native-google-analytics-bridge';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import Placeholder, { Line, Media, } from 'rn-placeholder';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
// import SplashScreen from 'react-native-splash-screen';
// import moment from 'moment';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, MyPlan as MyPlanConstants, } from '../../constants';
import { AppUtil, PlanLogic, } from '../../lib';
import { store } from '../../store';
import defaultPlanState from '../../states/plan';

// Components
import { ListItem, TabIcon, Text, } from '../custom';
import { Button, FathomModal, Spacer, } from '../custom';
import {
//     ActiveRecoveryBlocks,
//     ActiveTimeSlideUpPanel,
    DefaultListGap,
    // ExerciseCompletionModal,
//     ExerciseList,
//     Exercises,
//     FunctionalStrengthModal,
    PostSessionSurvey,
//     PrioritySlideUpPanel,
    ReadinessSurvey,
    RenderMyPlanTab,
    SessionsCompletionModal,
//     SingleExerciseItem,
} from './pages';
import { Loading, } from '../general';

// Tabs titles
const tabs = ['PREPARE', 'TRAIN', 'RECOVER'];

// global constants
// const activeRecoveryDisabledText = 'Log a new activity on the Train Screen to receive an Active Recovery!';
// const errorInARAPMessage = '\nPlease Swipe Down to Refresh!';
// const highSorenessMessage = 'Based on your reported discomfort we recommend you rest & utilize self-care techniques like heat, ice, or massage to help reduce swelling, ease pain, & speed up healing.\n\nIf you have pain or swelling that gets worse or doesn\'t go away, please seek appropriate medical attention.';
const offDayLoggedText = 'Make the most of your training by resting well today: hydrate, eat well and sleep early.';
// const timerDelay = 30000; // delay for X ms

// setup GA Tracker
const GATracker = new GoogleAnalyticsTracker('UA-127040201-1');

/* Styles ==================================================================== */
// const customStyles = StyleSheet.create({
//     alertMessageWrapper: {
//         alignSelf:    'center',
//         flex:         1,
//         marginRight:  9,
//         paddingLeft:  37,
//         paddingRight: 10,
//     },
//     alertMessageIconWrapper: {
//         alignSelf:            'stretch',
//         backgroundColor:      AppColors.zeplin.yellow,
//         borderTopLeftRadius:  5,
//         borderTopRightRadius: 5,
//         paddingVertical:      AppSizes.paddingSml,
//     },
//     alertMessageTextWrapper: {
//         backgroundColor:         AppColors.primary.grey.twentyPercent,
//         borderBottomLeftRadius:  5,
//         borderBottomRightRadius: 5,
//         flex:                    1,
//         padding:                 AppSizes.padding,
//     },
//     shadowEffect: {
//         shadowColor:   'rgba(0, 0, 0, 0.16)',
//         shadowOffset:  { height: 3, width: 0, },
//         shadowOpacity: 1,
//         shadowRadius:  4,
//     },
// });

/* Component ==================================================================== */
const ActivityTab = ({
    backgroundImage = require('../../../assets/images/standard/active_rest.png'),
    onPress = () => {},
    showBottomGap = true,
    subtitle = 'Anytime before training',
    title = 'CARE & ACTIVATE',
}) => (
    <View>
        <View style={{flex: 1, flexDirection: 'row',}}>
            <View style={{alignSelf: 'center', height: AppFonts.scaleFont(24), width: AppFonts.scaleFont(24),}}>
                <TabIcon
                    color={AppColors.zeplin.lightSlate}
                    containerStyle={[{width: AppFonts.scaleFont(24),}]}
                    icon={'check-circle'}
                    size={AppFonts.scaleFont(24)}
                    type={'material-community'}
                />
            </View>
            <View style={{flex: 1,}}>
                <ImageBackground
                    imageStyle={{borderRadius: AppSizes.padding,}}
                    source={backgroundImage}
                    style={{flex: 1, marginLeft: AppSizes.padding,}}
                >
                    <TouchableOpacity onPress={onPress} style={{flex: 1, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.padding,}}>
                        <ListItem
                            chevron={
                                <TabIcon
                                    color={AppColors.white}
                                    icon={'chevron-right'}
                                    size={AppFonts.scaleFont(28)}
                                    type={'material-community'}
                                />
                            }
                            containerStyle={{backgroundColor: 'transparent', padding: 0,}}
                            subtitle={subtitle}
                            subtitleStyle={[AppStyles.robotoRegular, {color: AppColors.white,}]}
                            title={title}
                            titleStyle={[AppStyles.oswaldRegular, {color: AppColors.white,}]}
                        />
                    </TouchableOpacity>
                </ImageBackground>
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
        // activateFunctionalStrength:    PropTypes.func.isRequired,
        // ble:                           PropTypes.object.isRequired,
        clearCompletedExercises:       PropTypes.func.isRequired,
        clearCompletedFSExercises:     PropTypes.func.isRequired,
        clearHealthKitWorkouts:        PropTypes.func.isRequired,
        // getSoreBodyParts:              PropTypes.func.isRequired,
        // healthData:                    PropTypes.object.isRequired,
        // lastOpened:                    PropTypes.object.isRequired,
        // markStartedFunctionalStrength: PropTypes.func.isRequired,
        // markStartedRecovery:           PropTypes.func.isRequired,
        // network:                       PropTypes.object.isRequired,
        noSessions:                    PropTypes.func.isRequired,
        // notification:                  PropTypes.oneOfType([
        //     PropTypes.bool,
        //     PropTypes.string,
        // ]),
        patchActiveRecovery:     PropTypes.func.isRequired,
        // patchActiveTime:         PropTypes.func.isRequired,
        // patchFunctionalStrength: PropTypes.func.isRequired,
        plan:                    PropTypes.object.isRequired,
        postReadinessSurvey:     PropTypes.func.isRequired,
        // postSessionSurvey:       PropTypes.func.isRequired,
        // setAppLogs:              PropTypes.func.isRequired,
        // setCompletedExercises:   PropTypes.func.isRequired,
        // setCompletedFSExercises: PropTypes.func.isRequired,
        // toggleRecoveryGoal:      PropTypes.func.isRequired,
        updateUser:              PropTypes.func.isRequired,
        user:                    PropTypes.object.isRequired,
    }

    static defaultProps = {};

    constructor(props) {
        super(props);
        let defaultState = _.cloneDeep(defaultPlanState);
        // let dailyPlan = props.plan && props.plan.dailyPlan[0] && props.plan.dailyPlan[0] ? props.plan.dailyPlan[0] : false;
        defaultState.healthData = props.healthData;
        // defaultState.prepare.finishedRecovery = dailyPlan && dailyPlan.pre_recovery_completed ? true : false;
        // defaultState.prepareSelectedActiveTime = dailyPlan && dailyPlan.pre_recovery && dailyPlan.pre_recovery.minutes_duration ? _.indexOf(MyPlanConstants.selectedActiveTimes().possibleActiveTimes, dailyPlan.pre_recovery.minutes_duration) : defaultState.prepareSelectedActiveTime;
        // defaultState.recoverSelectedActiveTime = dailyPlan && dailyPlan.post_recovery && dailyPlan.post_recovery.minutes_duration ? _.indexOf(MyPlanConstants.selectedActiveTimes().possibleActiveTimes, dailyPlan.post_recovery.minutes_duration) : defaultState.recoverSelectedActiveTime;
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
        let planObj = this.props.plan.dailyPlan[0] || {};
        if(planObj.daily_readiness_survey_completed) {
            // let postPracticeSurveys = planObj.training_sessions.map(session => session.post_session_survey
            //     ? {
            //         isPostPracticeSurveyCollapsed: true,
            //         isPostPracticeSurveyCompleted: true,
            //     } : {
            //         isPostPracticeSurveyCollapsed: false,
            //         isPostPracticeSurveyCompleted: false,
            //     }
            // );
            this.goToPageTimer = _.delay(() => this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(planObj)), 500);
            this.setState({
                prepare: Object.assign({}, this.state.prepare, {
                    // finishedRecovery:           planObj.pre_recovery_completed || this.state.prepare.finishedRecovery,
                    isActiveRecoveryCollapsed:  planObj.pre_recovery_completed || this.state.prepare.isActiveRecoveryCollapsed,
                    // isReadinessSurveyCollapsed: true,
                }),
                recover: Object.assign({}, this.state.recover, {
                    isActiveRecoveryCollapsed: planObj.post_active_rest && !planObj.pre_active_rest ? false : true,
                }),
                train: Object.assign({}, this.state.train, {
                    // completedPostPracticeSurvey: postPracticeSurveys[0] ? postPracticeSurveys[0].isPostPracticeSurveyCompleted : {},
                    // postPracticeSurveys
                }),
            });
        } else {
            let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
            newDailyReadiness.soreness = PlanLogic.handleNewSoreBodyPartLogic(this.props.plan.soreBodyParts);
            this.setState({
                dailyReadiness:             newDailyReadiness,
                isReadinessSurveyModalOpen: true,
                prepare:                    Object.assign({}, this.state.prepare, {
                    isActiveRecoveryCollapsed: true,
                }),
            });
        }
    }

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
        // AppState.removeEventListener('change', this._handleAppStateChange);
        // clear timers
        clearInterval(this._timer);
        clearInterval(this.goToPageTimer);
    }
/*
    componentDidMount = async () => {
        AppState.addEventListener('change', this._handleAppStateChange);
        if(!this.props.scheduledMaintenance.addressed) {
            let apiMaintenanceWindow = { end_date: this.props.scheduledMaintenance.end_date, start_date: this.props.scheduledMaintenance.start_date };
            let parseMaintenanceWindow = ErrorMessages.getScheduledMaintenanceMessage(apiMaintenanceWindow);
            AppUtil.handleScheduledMaintenanceAlert(parseMaintenanceWindow.displayAlert, parseMaintenanceWindow.header, parseMaintenanceWindow.message);
        }
        if(this.props.notification) {
            this._handlePushNotification(this.props);
        }
        // set GA variables
        GATracker.setUser(this.props.user.id);
        GATracker.setAppVersion(AppUtil.getAppBuildNumber().toString());
        GATracker.setAppName(`Fathom-${store.getState().init.environment}`);
        let planObj = this.props.plan.dailyPlan[0] || {};
        if(
            planObj.daily_readiness_survey_completed &&
            this.state.healthData.workouts &&
            this.state.healthData.workouts.length > 0
        ) {
            this._goToScrollviewPage(1, () => {
                this._togglePostSessionSurveyModal();
            });
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
        // handle PN
        if(prevProps.notification && prevProps.notification !== this.props.notification) {
            this._handlePushNotification(prevProps);
        }
        // navigate to new page if we have a new plan
        const areObjectsDifferent = _.isEqual(prevProps.plan, this.props.plan);
        if(
            !areObjectsDifferent &&
            this.props.plan.dailyPlan[0] &&
            prevProps.plan.dailyPlan[0] &&
            prevProps.plan.dailyPlan[0].landing_screen !== this.props.plan.dailyPlan[0].landing_screen &&
            (
                prevProps.plan.dailyPlan[0].post_recovery_completed ||
                prevProps.plan.dailyPlan[0].pre_recovery_completed
            )
        ) {
            this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(prevProps.plan.dailyPlan[0]));
        }
        // if we have workouts, handle RS or PSS
        if(!_.isEqual(prevProps.healthData, this.props.healthData) && this.props.healthData && this.props.healthData.workouts && this.props.healthData.workouts.length > 0) {
            let dailyPlanObj = this.props.plan ? this.props.plan.dailyPlan[0] : false;
            if(dailyPlanObj.daily_readiness_survey_completed) {
                this._goToScrollviewPage(1, () => {
                    this.setState(
                        { healthData: this.props.healthData, },
                        () => this._togglePostSessionSurveyModal(),
                    );
                });
            } else {
                this.setState({ healthData: this.props.healthData, });
            }
        }
        // handle if PN is delayed to come in
        if(
            (
                (prevState.isFSCalculating !== this.state.isFSCalculating && this.state.isFSCalculating) ||
                (prevState.isPrepCalculating !== this.state.isPrepCalculating && this.state.isPrepCalculating) ||
                (prevState.isRecoverCalculating !== this.state.isRecoverCalculating && this.state.isRecoverCalculating)
            ) &&
            (
                this.state.isReadinessSurveyModalOpen ||
                this.state.isPostSessionSurveyModalOpen ||
                this.state.isPrepareSessionsCompletionModalOpen ||
                this.state.isTrainSessionsCompletionModalOpen ||
                this.state.loading
            )
        ) {
            // start timer
            this._timer: _.delay(() => this._handleExerciseListRefresh(false, false), timerDelay);
        } else if(
            (prevState.isFSCalculating !== this.state.isFSCalculating && !this.state.isFSCalculating) ||
            (prevState.isPrepCalculating !== this.state.isPrepCalculating && !this.state.isPrepCalculating) ||
            (prevState.isRecoverCalculating !== this.state.isRecoverCalculating && !this.state.isRecoverCalculating)
        ) {
            // clear timer
            clearInterval(this._timer);
        }
    }

    _handleEnteringApp = (hideSplashScreen, callback) => {
        // when we arrive, load MyPlan, if it hasn't been loaded today yet
        let userId = this.props.user.id;
        let clearMyPlan = (
            this.props.lastOpened.userId !== this.props.user.id ||
            moment(this.props.lastOpened.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
        ) ?
            true
            :
            false;
        this.setState({ isPageLoading: true, });
        this.props.getMyPlan(userId, moment().format('YYYY-MM-DD'), false, clearMyPlan)
            .then(response => {
                if(response.daily_plans[0].daily_readiness_survey_completed) {
                    let postPracticeSurveys = response.daily_plans[0].training_sessions.map(session => session.post_session_survey
                        ? {
                            isPostPracticeSurveyCollapsed: true,
                            isPostPracticeSurveyCompleted: true,
                        } : {
                            isPostPracticeSurveyCollapsed: false,
                            isPostPracticeSurveyCompleted: false,
                        }
                    );
                    this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(response.daily_plans[0]));
                    this.setState({
                        isPageLoading: false,
                        prepare:       Object.assign({}, this.state.prepare, {
                            finishedRecovery:           response.daily_plans[0].pre_recovery_completed || this.state.prepare.finishedRecovery,
                            isActiveRecoveryCollapsed:  response.daily_plans[0].pre_recovery_completed || this.state.prepare.isActiveRecoveryCollapsed,
                            isReadinessSurveyCollapsed: true,
                        }),
                        recover: Object.assign({}, this.state.recover, {
                            isActiveRecoveryCollapsed: response.daily_plans[0].post_active_rest && !response.daily_plans[0].pre_active_rest ? false : true,
                        }),
                        train: Object.assign({}, this.state.train, {
                            completedPostPracticeSurvey: postPracticeSurveys[0] ? postPracticeSurveys[0].isPostPracticeSurveyCompleted : {},
                            postPracticeSurveys
                        }),
                    });
                    if(hideSplashScreen) {
                        SplashScreen.hide();
                    }
                    if(callback) {
                        callback();
                    }
                } else {
                    this.setState({
                        isPageLoading: false,
                        prepare:       Object.assign({}, this.state.prepare, {
                            isActiveRecoveryCollapsed:  true,
                            isReadinessSurveyCollapsed: false,
                        })
                    });
                    this.props.getSoreBodyParts()
                        .then(soreBodyParts => {
                            let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
                            newDailyReadiness.soreness = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts.readiness);
                            this.setState({ dailyReadiness: newDailyReadiness });
                            this.props.setAppLogs();
                            this.setState({ isReadinessSurveyModalOpen: true, isPageLoading: false, });
                            if(hideSplashScreen) {
                                SplashScreen.hide();
                            }
                            if(callback) {
                                callback();
                            }
                        })
                        .catch(err => {
                            // if there was an error, maybe the survey wasn't created for yesterday so have them do it as a blank
                            let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
                            newDailyReadiness.soreness = [];
                            this.setState({ dailyReadiness: newDailyReadiness });
                            if(hideSplashScreen) {
                                SplashScreen.hide();
                            }
                            if(callback) {
                                callback();
                            }
                            AppUtil.handleAPIErrorAlert(ErrorMessages.getSoreBodyParts);
                        });
                }
            })
            .catch(error => {
                this.setState({ isPageLoading: false, });
                if(hideSplashScreen) {
                    SplashScreen.hide();
                }
                if(callback) {
                    callback();
                }
                AppUtil.handleAPIErrorAlert(ErrorMessages.getMyPlan);
            });
    }

    _handleExerciseListRefresh = (shouldClearCompletedExercises, isFromPushNotification) => {
        // clear timer
        clearInterval(this._timer);
        let userId = this.props.user.id;
        this.setState({ isPageLoading: isFromPushNotification ? false : true, });
        this.props.getMyPlan(userId, moment().format('YYYY-MM-DD'))
            .then(response => {
                const dailyPlanObj = response.daily_plans && response.daily_plans[0] ? response.daily_plans[0] : false;
                let prepExerciseList = dailyPlanObj.pre_recovery.display_exercises ? MyPlanConstants.cleanExerciseList(dailyPlanObj.pre_recovery, this.state.preRecoveryPriority) : {};
                let recoverExerciseList = dailyPlanObj.post_recovery.display_exercises ? MyPlanConstants.cleanExerciseList(dailyPlanObj.post_recovery, this.state.postRecoveryPriority) : {};
                let isPrepActive = isFromPushNotification && dailyPlanObj.pre_recovery && dailyPlanObj.pre_recovery.display_exercises && !dailyPlanObj.pre_recovery.completed && prepExerciseList.totalLength > 0 ? true : false;
                let isRecoverActive = isFromPushNotification && dailyPlanObj.post_recovery && dailyPlanObj.post_recovery.display_exercises && !dailyPlanObj.post_recovery.completed && recoverExerciseList.totalLength > 0 ? true : false;
                let newRecover = _.cloneDeep(this.state.recover);
                newRecover.isActiveRecoveryCollapsed = isRecoverActive ? false : true;
                newRecover.finished = false;
                let newPrepare = _.cloneDeep(this.state.prepare);
                newPrepare.isActiveRecoveryCollapsed = isPrepActive ? false : true;
                newPrepare.isReadinessSurveyCollapsed = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ? true : false;
                newPrepare.isReadinessSurveyCompleted = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ? true : false;
                let newTrain = Object.assign({}, this.state.train, {
                    postPracticeSurveys: dailyPlanObj ? dailyPlanObj.training_sessions : [],
                });
                this.goToPageTimer = _.delay(() => this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(dailyPlanObj)), 500);
                if(shouldClearCompletedExercises) {
                    this.props.clearCompletedExercises();
                }
                let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
                this.setState({
                    dailyReadiness:       newDailyReadiness,
                    isFSCalculating:      false,
                    isPageLoading:        false,
                    isPrepCalculating:    false,
                    isRecoverCalculating: false,
                    prepare:              newPrepare,
                    recover:              newRecover,
                    train:                newTrain,
                });
            })
            .catch(error => {
                this.setState({ isPageLoading: false, });
            });
    }

    _handleAppStateChange = nextAppState => {
        let clearMyPlan = (
            this.props.lastOpened.userId !== this.props.user.id ||
            moment(this.props.lastOpened.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
        ) ?
            true
            :
            false;
        if(nextAppState === 'active' && this.props.notification) {
            this._handleEnteringApp(false, () => this._handlePushNotification(this.props));
        } else if(nextAppState === 'active' && (!this.props.lastOpened.date || clearMyPlan)) {
            Actions.reset('key1');
        } else if(
            nextAppState === 'active' &&
            this.props.user.health_enabled &&
            (
                !this.props.user.health_sync_date ||
                (moment().diff(moment(this.props.user.health_sync_date), 'minutes') > 7)
            )
        ) {
            AppUtil.getAppleHealthKitData(this.props.user.id, this.props.user.health_sync_date, this.props.user.historic_health_sync_date);
        }
    }

    _handlePushNotification = props => {
        // need to update our state to clear all 'open' items
        this.setState(
            {
                ...this.state,
                isPostSessionSurveyModalOpen: false,
                isReadinessSurveyModalOpen:   false,
                isSelectedExerciseModalOpen:  false,
                loading:                      false,
                selectedExercise:             {},
            },
            () => {
                // continue current logic
                const pushNotificationUpdate = PlanLogic.handlePushNotification(props, this.state);
                this._goToScrollviewPage(pushNotificationUpdate.page, () => {
                    if(pushNotificationUpdate.stateName !== '' || pushNotificationUpdate.newStateFields !== '') {
                        this.setState({
                            [pushNotificationUpdate.stateName]: pushNotificationUpdate.newStateFields,
                            isFSCalculating:                    false,
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
*/
    _handleDailyReadinessFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate, isMovementValue) => {
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, this.state.dailyReadiness, isClearCandidate, isMovementValue);
        this.setState({ dailyReadiness: newFormFields, });
    }

    _handlePostSessionFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate, isMovementValue) => {
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, this.state.postSession, isClearCandidate, isMovementValue);
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
/*
    _handleFSFormChange = (name, value) => {
        const newFormFields = _.update(this.state.functionalStrength, name, () => value);
        this.setState({ functionalStrength: newFormFields, });
    }

    _handleFSFormSubmit = () => {
        let payload = this.state.functionalStrength;
        this.setState({
            isFunctionalStrengthModalOpen: false,
            isFSCalculating:               true,
        })
        this.props.activateFunctionalStrength(payload)
            .then(response => this.setState({ isFSCalculating: false, }))
            .catch(error => {
                AppUtil.handleAPIErrorAlert(ErrorMessages.patchFunctionalStrength);
            });
    }
*/
    _handleReadinessSurveySubmit = isSecondFunctionalStrength => {
        let {
            newDailyReadiness,
            newDailyReadinessState,
            newPrepareObject,
            newRecoverObject,
            nonDeletedSessions,
        } = PlanLogic.handleReadinessSurveySubmitLogic(this.state.dailyReadiness, this.state.prepare, this.state.recover, this.state.healthData);
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
        this.props.postReadinessSurvey(newDailyReadiness)
            .then(response => {
                if(nonDeletedSessions.length === 0) {
                    this.setState({ isPrepCalculating: false, isRecoverCalculating: false, });
                }
                this.props.clearHealthKitWorkouts();
                this.props.clearCompletedExercises();
                this.props.clearCompletedFSExercises();
            })
            .catch(error => {
                this.setState({ isPrepCalculating: false, isRecoverCalculating: false, });
                AppUtil.handleAPIErrorAlert(ErrorMessages.postReadinessSurvey);
            });
    }

    _handlePostSessionSurveySubmit = areAllDeleted => {
        let {
            newPostSession,
            newPostSessionSessions,
            newRecoverObject,
            newTrainObject,
        } = PlanLogic.handlePostSessionSurveySubmitLogic(this.state.postSession, this.state.train, this.state.recover, this.state.healthData);
        this.setState(
            {
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
        this.props.clearHealthKitWorkouts() // clear HK workouts right away
            .then(() => this.props.postSessionSurvey(newPostSession))
            .then(response => {
                this.setState({ isRecoverCalculating: false, });
                if(!areAllDeleted) {
                    this.props.clearCompletedExercises();
                }
                let landingScreen = areAllDeleted ?
                    1
                    : newPostSession.sessions_planned ?
                        0
                        :
                        1;
                this._goToScrollviewPage(landingScreen);
            })
            .catch(error => {
                this.setState({ isRecoverCalculating: false, });
                AppUtil.handleAPIErrorAlert(ErrorMessages.postSessionSurvey);
            });
    }

    _handleAreaOfSorenessClick = (areaClicked, isDailyReadiness, isAllGood, resetSections) => {
        let stateObject = isDailyReadiness ? this.state.dailyReadiness : this.state.postSession;
        let newSorenessFields = PlanLogic.handleAreaOfSorenessClick(stateObject, areaClicked, isAllGood, this.props.plan.soreBodyParts, resetSections);
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
/*
    _handleUpdateUserHealthKitFlag = (flag, callback) => {
        // setup variables
        let newUserPayloadObj = {};
        newUserPayloadObj.health_enabled = flag;
        let newUserObj = _.cloneDeep(this.props.user);
        newUserObj.health_enabled = flag;
        // update reducer as API might take too long to return a value
        store.dispatch({
            type: DispatchActions.USER_REPLACE,
            data: newUserObj
        });
        // update user object
        this.props.updateUser(newUserPayloadObj, this.props.user.id)
            .then(res => {
                if(callback) {
                    callback();
                }
            });
    }

    // MOVED TO ExerciseList
    _handleCompleteExercise = (exerciseId, setNumber, recovery_type) => {
        let newExerciseId = setNumber ? `${exerciseId}-${setNumber}` : exerciseId;
        // add or remove exercise
        let newCompletedExercises = _.cloneDeep(store.getState().plan.completedExercises);
        if(newCompletedExercises && newCompletedExercises.indexOf(newExerciseId) > -1) {
            newCompletedExercises.splice(newCompletedExercises.indexOf(newExerciseId), 1)
        } else {
            newCompletedExercises.push(newExerciseId);
        }
        // Mark Recovery as started, if logic passes
        let clonedPlan = _.cloneDeep(this.props.plan);
        let startDate = recovery_type === 'pre' ?
            clonedPlan.dailyPlan[0].pre_recovery.start_date
            : recovery_type === 'post' ?
                clonedPlan.dailyPlan[0].post_recovery.start_date
                :
                true;
        if(newCompletedExercises.length === 1 && !startDate) {
            let newMyPlan =  _.cloneDeep(this.props.plan.dailyPlan);
            if(recovery_type === 'pre') {
                newMyPlan[0].pre_recovery.start_date = true;
            } else if(recovery_type === 'post') {
                newMyPlan[0].post_recovery.start_date = true;
            }
            this.props.markStartedRecovery(recovery_type, newMyPlan);
        }
        // continue by updating reducer and state
        this.props.setCompletedExercises(newCompletedExercises);
    }

    _handleCompleteFSExercise = (exerciseId, setNumber) => {
        let newFSExerciseId = setNumber ? `${exerciseId}-${setNumber}` : exerciseId;
        // add or remove exercise
        let newCompletedExercises = _.cloneDeep(store.getState().plan.completedFSExercises);
        if(newCompletedExercises && newCompletedExercises.indexOf(newFSExerciseId) > -1) {
            newCompletedExercises.splice(newCompletedExercises.indexOf(newFSExerciseId), 1)
        } else {
            newCompletedExercises.push(newFSExerciseId);
        }
        // Mark FS as started, if logic passes
        let clonedPlan = _.cloneDeep(this.props.plan);
        let startDate = clonedPlan.dailyPlan[0].functional_strength_session && clonedPlan.dailyPlan[0].functional_strength_session.start_date;
        if(newCompletedExercises && newCompletedExercises.length === 1 && !startDate) {
            let newMyPlan =  _.cloneDeep(this.props.plan.dailyPlan);
            newMyPlan[0].functional_strength_session.start_date = true;
            this.props.markStartedFunctionalStrength(newMyPlan);
        }
        // continue by updating reducer and state
        this.props.setCompletedFSExercises(newCompletedExercises);
    }

    // MOVED TO ExerciseList
    // _toggleSelectedExercise = (exerciseObj, isModalOpen) => {
    //     this.setState({
    //         isSelectedExerciseModalOpen: isModalOpen,
    //         selectedExercise:            exerciseObj ? exerciseObj : {},
    //     });
    // }

    _togglePrepareSlideUpPanel = () => {
        this.setState({ isPrepareSlideUpPanelOpen: !this.state.isPrepareSlideUpPanelOpen, });
    }

    _toggleRecoverSlideUpPanel = () => {
        this.setState({ isRecoverSlideUpPanelOpen: !this.state.isRecoverSlideUpPanelOpen, });
    }

    _toggleCompletedAMPMRecoveryModal = () => {
        this.props.clearCompletedExercises();
        this.setState({ isCompletedAMPMRecoveryModalOpen: !this.state.isCompletedAMPMRecoveryModalOpen, });
    }
*/
    _togglePostSessionSurveyModal = () => {
        let isLoading = Platform.OS === 'ios';
        this.setState({ loading: isLoading, showLoadingText: true, });
        if (!this.state.isPostSessionSurveyModalOpen) {
            this.props.getSoreBodyParts()
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
            this.props.clearCompletedExercises();
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
/*
    _toggleFunctionalStrengthModal = () => {
        this.setState({ loading: true, });
        if(!this.state.isFunctionalStrengthModalOpen) {
            this.props.getSoreBodyParts()
                .then(soreBodyParts => {
                    this.goToPageTimer = _.delay(() =>
                        this.setState({
                            functionalStrength: {
                                current_position:   null,
                                current_sport_name: null,
                                event_date:         `${moment().toISOString(true).split('.')[0]}Z`,
                            },
                            isFunctionalStrengthModalOpen: true,
                            loading:                       false,
                        })
                    , 500);
                })
                .catch(err => {
                    this.setState({
                        isFunctionalStrengthModalOpen: true,
                        loading:                       false,
                    });
                    AppUtil.handleAPIErrorAlert(ErrorMessages.getSoreBodyParts);
                });
        } else {
            this.goToPageTimer = _.delay(() => {
                this.setState({
                    functionalStrength: {
                        current_position:   null,
                        current_sport_name: null,
                        event_date:         `${moment().toISOString(true).split('.')[0]}Z`,
                    },
                    isFunctionalStrengthModalOpen: false,
                    loading:                       false,
                });
            }, 500);
        }
    }

    _toggleRecoveryGoal = selectedIndex => {
        const { plan, toggleRecoveryGoal, } = this.props;
        let newGoals = _.cloneDeep(plan.goals);
        newGoals = _.update(newGoals, `[${selectedIndex}].isSelected`, () => !plan.goals[selectedIndex].isSelected);
        toggleRecoveryGoal(newGoals);
    }

    _changeSelectedActiveTime = (selectedIndex, prepareOrRecover) => {
        this.setState({ [prepareOrRecover]: selectedIndex, });
    }
*/
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
        this.setState(
            {
                isTrainSessionsCompletionModalOpen: false,
                postSession:                        _.cloneDeep(defaultPlanState.postSession),
            },
            () => { this.goToPageTimer = _.delay(() => { this._goToScrollviewPage(2) }, 500); }
        );
    }

    _goToScrollviewPage = (pageIndex, callback) => {
        // only scroll to page when we
        // - HAVE a tabView
        // - DO NOT HAVE: isReadinessSurveyModalOpen & isPostSessionSurveyModalOpen & loading
        if(!pageIndex && callback) {
            callback();
        } else if(
            this.tabView &&
            !this.state.isReadinessSurveyModalOpen &&
            !this.state.isPostSessionSurveyModalOpen &&
            !this.state.isPrepareSessionsCompletionModalOpen &&
            !this.state.isTrainSessionsCompletionModalOpen &&
            !this.state.isSelectedExerciseModalOpen &&
            // !this.state.isFunctionalStrengthModalOpen &&
            !this.state.loading &&
            pageIndex
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
        return(
            <RenderMyPlanTab
                isPostSessionSurveyModalOpen={this.state.isPostSessionSurveyModalOpen}
                isReadinessSurveyModalOpen={this.state.isReadinessSurveyModalOpen}
                isTabActive={isTabActive}
                key={`${name}_${page}`}
                loading={this.state.loading}
                name={name}
                onLayoutHandler={onLayoutHandler}
                onPressHandler={onPressHandler}
                page={page}
                plan={this.props.plan}
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
/*
    renderPrepare = index => {
        let {
            dailyReadiness,
            isFSCalculating,
            isPageLoading,
            isPrepCalculating,
            isRecoverCalculating,
            prepare,
            preRecoveryPriority,
        } = this.state;
            // below are still in the works - state
            // isReadinessSurveyModalOpen,
            // isPreparePrioritySlideUpPanelOpen,
            // isPrepareSlideUpPanelOpen,
            // prepareSelectedActiveTime,
            // healthData,
            // isSelectedExerciseModalOpen,
            // selectedExercise,
            // isPrepareSessionsCompletionModalOpen,
            // isPrepareExerciseCompletionModalOpen,
        let { plan, user, } = this.props;
        let completedExercises = store.getState().plan.completedExercises;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let {
            disabled,
            exerciseList,
            isActive,
            isCompleted,
            isReadinessSurveyCompleted,
            recoveryObj,
        } = PlanLogic.handleMyPlanRenderPrepareTabLogic(dailyPlanObj, preRecoveryPriority, plan.goals);
        return (
            <ScrollView
                contentContainerStyle={{backgroundColor: AppColors.white,}}
                refreshControl={
                    isFSCalculating || isPrepCalculating || isRecoverCalculating ?
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
                <Spacer size={30} />
                { isReadinessSurveyCompleted ?
                    <View>
                        <ListItem
                            disabled={false}
                            hideChevron={true}
                            leftIcon={
                                <View style={[{height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}>
                                    <LottieView
                                        autoPlay={true}
                                        loop={false}
                                        source={require('../../../assets/animation/checkmark-circle.json')}
                                    />
                                </View>
                            }
                            title={'READINESS SURVEY'}
                            titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, {color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24),}]}
                        />
                        <DefaultListGap
                            size={24}
                        />
                    </View>
                    :
                    null
                }
                <ListItem
                    disabled={disabled}
                    hideChevron={true}
                    leftIcon={
                        isCompleted ?
                            <View style={[{height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}>
                                <LottieView
                                    autoPlay={true}
                                    loop={false}
                                    source={require('../../../assets/animation/checkmark-circle.json')}
                                />
                            </View>
                            :
                            <TabIcon
                                color={isCompleted ? AppColors.zeplin.yellow : AppColors.black}
                                containerStyle={[{marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}
                                icon={isCompleted ? 'check-circle' : disabled ? 'lock' : 'fiber-manual-record'}
                                size={isCompleted ? AppFonts.scaleFont(24) : AppFonts.scaleFont(20)}
                            />
                    }
                    title={'MOBILIZE'}
                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, {color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24),}]}
                />
                {
                    /* eslint-disable indent *
                    disabled && !isPrepCalculating ?
                        <View style={{flex: 1, flexDirection: 'row',}}>
                            <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                            <View style={{flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                                <ActiveRecoveryBlocks />
                            </View>
                        </View>
                    : disabled || isPrepCalculating ?
                        <View style={{flex: 1, flexDirection: 'row',}}>
                            <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                            <View style={{flex: 1, paddingLeft: 20, paddingRight: 15,}}>
                                <ActiveRecoveryBlocks />
                                <Spacer size={12}/>
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.white, borderColor: AppColors.zeplin.yellow, width: '100%',}}
                                    containerStyle={{flex: 1, marginLeft: 0, marginRight: 10,}}
                                    loading={isPrepCalculating}
                                    loadingProps={{color: AppColors.zeplin.yellow,}}
                                    onPress={() => null}
                                    title={'Calculating...'}
                                    titleStyle={{color: AppColors.zeplin.yellow, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                                    type={'outline'}
                                />
                            </View>
                        </View>
                    : isActive ?
                        exerciseList.unFilteredExerciseArray.length === 0 ?
                            <View style={{flex: 1,}}>
                                <Spacer size={10} />
                                <View style={[AppStyles.containerCentered, customStyles.alertMessageWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                                    <TabIcon
                                        color={AppColors.white}
                                        containerStyle={[customStyles.alertMessageIconWrapper, {backgroundColor: AppColors.zeplin.error,}]}
                                        icon={'alert'}
                                        size={AppFonts.scaleFont(26)}
                                        type={'material-community'}
                                    />
                                    <View style={[customStyles.alertMessageTextWrapper,]}>
                                        <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(13),}]}>{highSorenessMessage}</Text>
                                    </View>
                                </View>
                            </View>
                        : prepare.isActiveRecoveryCollapsed ?
                            <View style={{flex: 1, flexDirection: 'row',}}>
                                <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                                <View style={{flex: 1, paddingLeft: 20, paddingRight: 15,}}>
                                    <ActiveRecoveryBlocks
                                        goals={plan.goals}
                                        recoveryObj={recoveryObj}
                                        recoveryPriority={preRecoveryPriority}
                                        toggleActiveTimeSlideUpPanel={() => this.setState({ isPreparePrioritySlideUpPanelOpen: !this.state.isPreparePrioritySlideUpPanelOpen, })}//this._togglePrepareSlideUpPanel}
                                        toggleRecoveryGoal={this._toggleRecoveryGoal}
                                    />
                                    <Spacer size={12}/>
                                    <Button
                                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, width: '100%',}}
                                        containerStyle={{flex: 1, marginLeft: 0, marginRight: 10,}}
                                        onPress={() => this.setState({ prepare: Object.assign({}, prepare, { isActiveRecoveryCollapsed: !prepare.isActiveRecoveryCollapsed })}) }
                                        title={completedExercises && completedExercises.length > 0 ? 'Continue' : 'Start'}
                                        titleStyle={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                                    />
                                </View>
                            </View>
                            :
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row',}}>
                                    <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                                    <View style={{flex: 1, paddingLeft: 20, paddingRight: 15,}}>
                                        <ActiveRecoveryBlocks
                                            goals={plan.goals}
                                            recoveryObj={recoveryObj}
                                            recoveryPriority={preRecoveryPriority}
                                            toggleActiveTimeSlideUpPanel={() => this.setState({ isPreparePrioritySlideUpPanelOpen: !this.state.isPreparePrioritySlideUpPanelOpen, })}//this._togglePrepareSlideUpPanel}
                                            toggleRecoveryGoal={this._toggleRecoveryGoal}
                                        />
                                        <Spacer size={20}/>
                                        <Text
                                            onPress={() => this.setState({ prepare: Object.assign({}, prepare, { isActiveRecoveryCollapsed: !prepare.isActiveRecoveryCollapsed }) }) }
                                            robotoBold
                                            style={[AppStyles.textCenterAligned,
                                                {
                                                    color:              AppColors.zeplin.yellow,
                                                    fontSize:           AppFonts.scaleFont(14),
                                                    marginRight:        10,
                                                    textDecorationLine: 'none',
                                                }
                                            ]}
                                        >
                                            {'Hide Exercises ^'}
                                        </Text>
                                    </View>
                                </View>
                                <ExerciseList
                                    completedExercises={completedExercises}
                                    exerciseList={exerciseList}
                                    handleCompleteExercise={(exerciseId, setNumber) => this._handleCompleteExercise(exerciseId, setNumber, 'pre')}
                                    isPrep={true}
                                    toggleCompletedAMPMRecoveryModal={() => this.setState({ isPrepareExerciseCompletionModalOpen: true, })}
                                    toggleSelectedExercise={this._toggleSelectedExercise}
                                />
                            </View>
                    : isCompleted ?
                        <View style={{flex: 1, flexDirection: 'row',}}>
                            <View style={{borderRightColor: AppColors.white, borderRightWidth: 1,paddingLeft: 22,}} />
                            <View style={{flex: 1, paddingLeft: 30, paddingRight: 15,}}>
                                <ActiveRecoveryBlocks
                                    goals={plan.goals}
                                    recoveryObj={recoveryObj}
                                    recoveryPriority={preRecoveryPriority}
                                    toggleRecoveryGoal={this._toggleRecoveryGoal}
                                />
                            </View>
                        </View>
                    :
                    <View style={{flex: 1, flexDirection: 'row',}}>
                        <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                        <View style={{flex: 1, marginBottom: 30, marginLeft: 20, marginRight: 15,}}>
                            <Text robotoRegular style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(18),}]}>{errorInARAPMessage}</Text>
                        </View>
                    </View>
                }
                <FathomModal
                    isVisible={this.state.isReadinessSurveyModalOpen}
                    style={{margin: 0,}}
                >
                    <ReadinessSurvey
                        dailyReadiness={this.state.dailyReadiness}
                        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                        handleFormChange={this._handleDailyReadinessFormChange}
                        handleFormSubmit={this._handleReadinessSurveySubmit}
                        handleHealthDataFormChange={this._handleHealthDataFormChange}
                        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                        handleUpdateUserHealthKitFlag={this._handleUpdateUserHealthKitFlag}
                        healthKitWorkouts={this.state.healthData.workouts && this.state.healthData.workouts.length > 0 ? this.state.healthData.workouts : null}
                        soreBodyParts={this.props.plan.soreBodyParts}
                        typicalSessions={this.props.plan.typicalSessions}
                        user={this.props.user}
                    />
                </FathomModal>
                <FathomModal
                    isVisible={this.state.isSelectedExerciseModalOpen}
                    style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: AppColors.transparent, margin: 0,}]}
                >
                    <Exercises
                        closeModal={() => this.setState({ isSelectedExerciseModalOpen: false, })}
                        completedExercises={completedExercises}
                        exerciseList={exerciseList}
                        handleCompleteExercise={(exerciseId, setNumber, hasNextExercise, isUnChecked) => {
                            this._handleCompleteExercise(exerciseId, setNumber, 'pre');
                            if(!hasNextExercise && isUnChecked) {
                                this.setState(
                                    { isSelectedExerciseModalOpen: false, },
                                    () => { this.goToPageTimer = _.delay(() => this.setState({ isPrepareExerciseCompletionModalOpen: true, }), 750); }
                                );
                            }
                        }}
                        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                        selectedExercise={this.state.selectedExercise}
                        user={this.props.user}
                    />
                </FathomModal>
                <PrioritySlideUpPanel
                    changeSelectedPriority={selectedIndex => this._changeSelectedActiveTime((selectedIndex + 1), 'preRecoveryPriority')}
                    isSlideUpPanelOpen={this.state.isPreparePrioritySlideUpPanelOpen}
                    selectedPriority={this.state.preRecoveryPriority}
                    toggleSlideUpPanel={() => this.setState({ isPreparePrioritySlideUpPanelOpen: !this.state.isPreparePrioritySlideUpPanelOpen, })}
                />
                <ActiveTimeSlideUpPanel
                    changeSelectedActiveTime={(selectedIndex) => this._changeSelectedActiveTime(selectedIndex, 'prepareSelectedActiveTime')}
                    isSlideUpPanelOpen={this.state.isPrepareSlideUpPanelOpen}
                    selectedActiveTime={this.state.prepareSelectedActiveTime}
                    toggleSlideUpPanel={() => {
                        let selectedActiveTime = MyPlanConstants.selectedActiveTimes(this.state.prepareSelectedActiveTime).selectedTime;
                        // send api if selected active time is different from reducer
                        if(recoveryObj.minutes_duration !== selectedActiveTime) {
                            // trigger calculating
                            this.setState(
                                { isPrepCalculating: true, },
                                () => {
                                    // send api
                                    this.props.patchActiveTime(selectedActiveTime)
                                        .then(response => {
                                            this.setState({ isPrepCalculating: false, });
                                            this.props.clearCompletedExercises();
                                            this.props.clearCompletedFSExercises();
                                        })
                                        .catch(() => {
                                            this.setState({ isPrepCalculating: false, });
                                            AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                                        });
                                }
                            );
                        }
                        // hide slide up panel
                        this._togglePrepareSlideUpPanel();
                    }}
                />
                <SessionsCompletionModal
                    isModalOpen={this.state.isPrepareSessionsCompletionModalOpen}
                    onClose={this._closePrepareSessionsCompletionModal}
                    sessions={dailyReadiness.sessions && dailyReadiness.sessions.length > 0 ? dailyReadiness.sessions : []}
                />
                <ExerciseCompletionModal
                    completedExercises={completedExercises}
                    exerciseList={exerciseList}
                    isModalOpen={this.state.isPrepareExerciseCompletionModalOpen}
                    onClose={() => this.setState({ isPrepareExerciseCompletionModalOpen: false, })}
                    onComplete={() => {
                        this.setState({ isPrepareExerciseCompletionModalOpen: false, });
                        let { newCompletedExercises, } = PlanLogic.handleCompletedExercises(store.getState().plan.completedExercises);
                        this.props.patchActiveRecovery(newCompletedExercises, 'pre')
                            .then(res => {
                                let newDailyPlanObj = store.getState().plan.dailyPlan[0];
                                this.setState(
                                    {
                                        prepare: Object.assign({}, this.state.prepare, {
                                            finishedRecovery:          true,
                                            isActiveRecoveryCollapsed: true,
                                        }),
                                    },
                                    () => this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(newDailyPlanObj)),
                                )
                            })
                            .catch(() => {
                                AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                            });
                    }}
                    user={user}
                />
                // USE BELOW MAYBE?
                <ExerciseCompletionModal
                    completedExercises={completedExercises}
                    exerciseList={exerciseList}
                    isModalOpen={isPrepareExerciseCompletionModalOpen}
                    onClose={() => this.setState({ isPrepareExerciseCompletionModalOpen: false, })}
                    onComplete={() => {
                        this.setState({ isPrepareExerciseCompletionModalOpen: false, });
                        let { newCompletedExercises, } = PlanLogic.handleCompletedExercises(store.getState().plan.completedExercises);
                        patchActiveRecovery(newCompletedExercises, 'pre')
                            .then(res => {
                                let newDailyPlanObj = store.getState().plan.dailyPlan[0];
                                this.setState(
                                    {
                                        prepare: Object.assign({}, this.state.prepare, { isActiveRecoveryCollapsed: true, }),
                                    },
                                    () => this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(newDailyPlanObj)),
                                )
                            })
                            .catch(() => {
                                AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                            });
                    }}
                    user={user}
                />
            </ScrollView>
        );
    };

    renderRecover = index => {
        let {
            isPageLoading,
            isFSCalculating,
            isPrepCalculating,
            isRecoverCalculating,
            postRecoveryPriority,
            recover,
        } = this.state;
        let { plan, user, } = this.props;
        let completedExercises = store.getState().plan.completedExercises;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let {
            disabled,
            exerciseList,
            isActive,
            isCompleted,
            recoveryObj,
        } = PlanLogic.handleMyPlanRenderRecoverTabLogic(dailyPlanObj, postRecoveryPriority, plan.goals);
        return (
            <ScrollView
                contentContainerStyle={{backgroundColor: AppColors.white,}}
                refreshControl={
                    isFSCalculating || isPrepCalculating || isRecoverCalculating ?
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
                <Spacer size={30} />
                <ListItem
                    disabled={disabled}
                    hideChevron={true}
                    leftIcon={
                        isCompleted ?
                            <View style={[{height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}>
                                <LottieView
                                    autoPlay={true}
                                    loop={false}
                                    source={require('../../../assets/animation/checkmark-circle.json')}
                                />
                            </View>
                            :
                            <TabIcon
                                color={isCompleted ? AppColors.zeplin.yellow : AppColors.black}
                                containerStyle={[{marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}
                                icon={isCompleted ? 'check-circle' : disabled ? 'lock' : 'fiber-manual-record'}
                                size={isCompleted ? AppFonts.scaleFont(24) : 20}
                            />
                    }
                    title={'ACTIVE RECOVERY'}
                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, {color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24),}]}
                />
                {
                    /* eslint-disable indent *
                    disabled && !isRecoverCalculating ?
                        <View>
                            <View style={{flex: 1, flexDirection: 'row',}}>
                                <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                                <View style={{flex: 1, paddingLeft: 20, paddingRight: 15,}}>
                                    <ActiveRecoveryBlocks
                                        after={true}
                                    />
                                </View>
                            </View>
                            <Spacer size={25}/>
                            <View style={[AppStyles.containerCentered, customStyles.alertMessageWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                                <TabIcon
                                    color={AppColors.white}
                                    containerStyle={[customStyles.alertMessageIconWrapper,]}
                                    icon={'alert'}
                                    size={AppFonts.scaleFont(26)}
                                    type={'material-community'}
                                />
                                <View style={[customStyles.alertMessageTextWrapper,]}>
                                    <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(13),}]}>{activeRecoveryDisabledText}</Text>
                                </View>
                            </View>
                        </View>
                    : disabled || isRecoverCalculating ?
                        <View style={{flex: 1, flexDirection: 'row',}}>
                            <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                            <View style={{flex: 1, paddingLeft: 20, paddingRight: 15,}}>
                                <ActiveRecoveryBlocks
                                    after={true}
                                />
                                <Spacer size={12}/>
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.white, borderColor: AppColors.zeplin.yellow, width: '100%',}}
                                    containerViewStyle={{flex: 1, marginLeft: 0, marginRight: 10,}}
                                    loading={isRecoverCalculating}
                                    loadingProps={{color: AppColors.zeplin.yellow,}}
                                    onPress={() => null}
                                    title={'Calculating...'}
                                    titleStyle={{color: AppColors.zeplin.yellow, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                                    type={'outline'}
                                />
                            </View>
                        </View>
                    : isActive ?
                        exerciseList.totalLength === 0 ?
                            <View style={{flex: 1,}}>
                                <Spacer size={10} />
                                <View style={[AppStyles.containerCentered, customStyles.alertMessageWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                                    <TabIcon
                                        color={AppColors.white}
                                        containerStyle={[customStyles.alertMessageIconWrapper, {backgroundColor: AppColors.zeplin.error,}]}
                                        icon={'alert'}
                                        size={AppFonts.scaleFont(26)}
                                        type={'material-community'}
                                    />
                                    <View style={[customStyles.alertMessageTextWrapper,]}>
                                        <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(13),}]}>{highSorenessMessage}</Text>
                                    </View>
                                </View>
                            </View>
                        : recover.isActiveRecoveryCollapsed ?
                            <View style={{flex: 1, flexDirection: 'row',}}>
                                <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                                <View style={{flex: 1, marginBottom: 30, marginLeft: 20, marginRight: 15,}}>
                                    <ActiveRecoveryBlocks
                                        after={true}
                                        goals={plan.goals}
                                        recoveryObj={recoveryObj}
                                        recoveryPriority={postRecoveryPriority}
                                        toggleActiveTimeSlideUpPanel={() => this.setState({ isRecoverPrioritySlideUpPanelOpen: !this.state.isRecoverPrioritySlideUpPanelOpen, })}//this._toggleRecoverSlideUpPanel}
                                        toggleRecoveryGoal={this._toggleRecoveryGoal}
                                    />
                                    <Spacer size={12}/>
                                    <Button
                                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, width: '100%',}}
                                        containerStyle={{flex: 1, marginLeft: 0, marginRight: 10,}}
                                        onPress={() => this.setState({ recover: Object.assign({}, recover, { isActiveRecoveryCollapsed: !recover.isActiveRecoveryCollapsed }) })}
                                        title={completedExercises && completedExercises.length > 0 ? 'Continue' : 'Start'}
                                        titleStyle={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                                    />
                                </View>
                            </View>
                            :
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row',}}>
                                    <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                                    <View style={{flex: 1, paddingLeft: 20, paddingRight: 15}}>
                                        <ActiveRecoveryBlocks
                                            after={true}
                                            goals={plan.goals}
                                            recoveryObj={recoveryObj}
                                            recoveryPriority={postRecoveryPriority}
                                            toggleActiveTimeSlideUpPanel={() => this.setState({ isRecoverPrioritySlideUpPanelOpen: !this.state.isRecoverPrioritySlideUpPanelOpen, })}//this._toggleRecoverSlideUpPanel}
                                            toggleRecoveryGoal={this._toggleRecoveryGoal}
                                        />
                                        <Spacer size={20}/>
                                        <Text
                                            onPress={() => this.setState({ recover: Object.assign({}, recover, { isActiveRecoveryCollapsed: !recover.isActiveRecoveryCollapsed }) }) }
                                            robotoBold
                                            style={[AppStyles.textCenterAligned,
                                                {
                                                    color:              AppColors.zeplin.yellow,
                                                    fontSize:           AppFonts.scaleFont(14),
                                                    marginRight:        10,
                                                    textDecorationLine: 'none',
                                                }
                                            ]}
                                        >
                                            {'Hide Exercises ^'}
                                        </Text>
                                    </View>
                                </View>
                                <ExerciseList
                                    completedExercises={completedExercises}
                                    exerciseList={exerciseList}
                                    handleCompleteExercise={(exerciseId, setNumber) => this._handleCompleteExercise(exerciseId, setNumber, 'post')}
                                    toggleCompletedAMPMRecoveryModal={() => this.setState({ isRecoverExerciseCompletionModalOpen: true, })}
                                    toggleSelectedExercise={this._toggleSelectedExercise}
                                />
                            </View>
                    : isCompleted ?
                        <View style={{flex: 1, flexDirection: 'row',}}>
                            <View style={{borderRightColor: AppColors.white, borderRightWidth: 1,paddingLeft: 22,}} />
                            <View style={{flex: 1, marginBottom: 30, marginLeft: 20, marginRight: 15,}}>
                                <ActiveRecoveryBlocks
                                    after={true}
                                    goals={plan.goals}
                                    recoveryObj={recoveryObj}
                                    recoveryPriority={postRecoveryPriority}
                                    toggleRecoveryGoal={this._toggleRecoveryGoal}
                                />
                            </View>
                        </View>
                    :
                    <View style={{flex: 1, flexDirection: 'row',}}>
                        <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                        <View style={{flex: 1, marginBottom: 30, marginLeft: 20, marginRight: 15,}}>
                            <Text robotoRegular style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(18),}]}>{errorInARAPMessage}</Text>
                        </View>
                    </View>
                }
                <FathomModal
                    isVisible={this.state.isSelectedExerciseModalOpen}
                    style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: AppColors.transparent, margin: 0,}]}
                >
                    <Exercises
                        closeModal={() => this.setState({ isSelectedExerciseModalOpen: false, })}
                        completedExercises={completedExercises}
                        exerciseList={exerciseList}
                        handleCompleteExercise={(exerciseId, setNumber, hasNextExercise) => {
                            this._handleCompleteExercise(exerciseId, setNumber, 'post');
                            if(!hasNextExercise) {
                                this.setState(
                                    { isSelectedExerciseModalOpen: false, },
                                    () => { this.goToPageTimer = _.delay(() => this.setState({ isRecoverExerciseCompletionModalOpen: true, }), 750); }
                                );
                            }
                        }}
                        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                        selectedExercise={this.state.selectedExercise}
                        user={this.props.user}
                    />
                </FathomModal>
                <PrioritySlideUpPanel
                    changeSelectedPriority={selectedIndex => this._changeSelectedActiveTime((selectedIndex + 1), 'postRecoveryPriority')}
                    isRecover={true}
                    isSlideUpPanelOpen={this.state.isRecoverPrioritySlideUpPanelOpen}
                    selectedPriority={this.state.postRecoveryPriority}
                    toggleSlideUpPanel={() => this.setState({ isRecoverPrioritySlideUpPanelOpen: !this.state.isRecoverPrioritySlideUpPanelOpen, })}
                />
                <ActiveTimeSlideUpPanel
                    changeSelectedActiveTime={(selectedIndex) => this._changeSelectedActiveTime(selectedIndex, 'recoverSelectedActiveTime')}
                    isRecover={true}
                    isSlideUpPanelOpen={this.state.isRecoverSlideUpPanelOpen}
                    selectedActiveTime={this.state.recoverSelectedActiveTime}
                    toggleSlideUpPanel={() => {
                        let selectedActiveTime = MyPlanConstants.selectedActiveTimes(this.state.recoverSelectedActiveTime).selectedTime;
                        // send api if selected active time is different from reducer
                        if(recoveryObj.minutes_duration !== selectedActiveTime) {
                            // trigger calculating
                            this.setState(
                                { isRecoverCalculating: true, },
                                () => {
                                    // send api
                                    this.props.patchActiveTime(selectedActiveTime)
                                        .then(response => {
                                            this.setState({ isRecoverCalculating: false, });
                                            this.props.clearCompletedExercises();
                                            this.props.clearCompletedFSExercises();
                                        })
                                        .catch(() => {
                                            this.setState({ isRecoverCalculating: false, });
                                            AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                                        });
                                }
                            );
                        }
                        // hide slide up panel
                        this._toggleRecoverSlideUpPanel();
                    }}
                />
                <ExerciseCompletionModal
                    completedExercises={completedExercises}
                    exerciseList={exerciseList}
                    isModalOpen={this.state.isRecoverExerciseCompletionModalOpen}
                    onClose={() => this.setState({ isRecoverExerciseCompletionModalOpen: false, })}
                    onComplete={() => {
                        this.setState({ isRecoverExerciseCompletionModalOpen: false, });
                        let { newCompletedExercises, } = PlanLogic.handleCompletedExercises(store.getState().plan.completedExercises);
                        this.props.patchActiveRecovery(newCompletedExercises, 'post')
                            .then(() =>
                                this.setState({
                                    recover: Object.assign({}, this.state.recover, {
                                        finished:                  !!completedExercises.length,
                                        isActiveRecoveryCollapsed: true,
                                    })
                                })
                            )
                            .catch(() => {
                                AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                            });
                    }}
                    user={user}
                />
            </ScrollView>
        );
    };

    renderTrain = index => {
        let {
            healthData,
            isFSCalculating,
            isFSExerciseCompletionModalOpen,
            isFunctionalStrengthCollapsed,
            isFunctionalStrengthModalOpen,
            isPostSessionSurveyModalOpen,
            isSelectedExerciseModalOpen,
            isTrainSessionsCompletionModalOpen,
            postSession,
            selectedExercise,
        } = this.state;
        let { plan, user, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let {
            completedFSExercises,
            filteredTrainingSessions,
            fsExerciseList,
            functionalStrength,
            isDailyReadinessSurveyCompleted,
            isFSCompletedValid,
            isFSEligible,
            logActivityButtonBackgroundColor,
            logActivityButtonColor,
            logActivityButtonOutlined,
            logActivityRightIconColor,
            offDaySelected,
        } = PlanLogic.handleMyPlanRenderTrainTabLogic(dailyPlanObj, store.getState().plan);
        return (
            <ScrollView
                contentContainerStyle={{backgroundColor: AppColors.white,}}
                tabLabel={tabs[index]}
            >
                <Spacer size={30} />
                { (dailyPlanObj && !dailyPlanObj.sessions_planned) && filteredTrainingSessions && filteredTrainingSessions.length === 0 ?
                    <View>
                        <ListItem
                            disabled={!isDailyReadinessSurveyCompleted}
                            hideChevron={true}
                            leftIcon={
                                <View style={[{height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}>
                                    <LottieView
                                        autoPlay={true}
                                        loop={false}
                                        source={require('../../../assets/animation/checkmark-circle.json')}
                                    />
                                </View>
                            }
                            title={'OFF DAY'}
                            titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, {color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24),}]}
                        />
                        <View style={{flexDirection: 'row',}}>
                            <View style={{borderRightColor: AppColors.primary.grey.thirtyPercent, borderRightWidth: 1, paddingLeft: 22,}} />{/* standard padding of 10 and 5 for half the default size of icons *}
                            <View style={{flex: 1, margin: 20,}}>
                                <Text robotoRegular style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(16),}]}>{offDayLoggedText}</Text>
                            </View>
                        </View>
                    </View>
                    :
                    null
                }
                { isDailyReadinessSurveyCompleted && (isFSEligible || functionalStrength && Object.keys(functionalStrength) && Object.keys(functionalStrength).length > 0) && !functionalStrength.completed ?
                      <View>
                          <ListItem
                              disabled={false}
                              hideChevron={true}
                              leftIcon={
                                  <TabIcon
                                      color={AppColors.black}
                                      containerStyle={[{marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}
                                      icon={'fiber-manual-record'}
                                      size={20}
                                  />
                              }
                              title={'FUNCTIONAL STRENGTH'}
                              titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, {color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24),}]}
                          />
                        <View style={{flex: 1, flexDirection: 'row',}}>
                              <View style={{borderRightColor: isFunctionalStrengthCollapsed ? AppColors.zeplin.lightGrey : AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                              <View style={{flex: 1, marginBottom: 30, marginLeft: 20, marginRight: 15,}}>
                                  <ActiveRecoveryBlocks
                                      isFunctionalStrength={true}
                                      recoveryObj={isFSCalculating ? false : functionalStrength}
                                  />
                                  <Spacer size={isFunctionalStrengthCollapsed ? 12 : 20}/>
                                  { isFunctionalStrengthCollapsed ?
                                      <Button
                                          buttonStyle={{backgroundColor: isFSCalculating ? AppColors.white : AppColors.zeplin.yellow, borderColor: AppColors.zeplin.yellow, }}
                                          containerStyle={{flex: 1, marginLeft: 0, marginRight: 10,}}
                                          loading={isFSCalculating}
                                          loadingProps={{color: AppColors.zeplin.yellow,}}
                                          onPress={() => isFSCalculating ?
                                              null
                                              : (isFSEligible && functionalStrength && Object.keys(functionalStrength) && Object.keys(functionalStrength).length === 0) ?
                                                  this._toggleFunctionalStrengthModal()
                                                  :
                                                  this.setState({ isFunctionalStrengthCollapsed: false, })
                                          }
                                          title={isFSCalculating ? 'Calculating...' : completedFSExercises && completedFSExercises.length > 0 ? 'Continue' : 'Start'}
                                          titleStyle={{color: isFSCalculating ? AppColors.zeplin.yellow : AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                                          type={'outline'}
                                      />
                                      :
                                      <Text
                                          onPress={() => this.setState({ isFunctionalStrengthCollapsed: true, }) }
                                          robotoBold
                                          style={[AppStyles.textCenterAligned,
                                              {
                                                  color:              AppColors.zeplin.yellow,
                                                  fontSize:           AppFonts.scaleFont(14),
                                                  marginRight:        10,
                                                  textDecorationLine: 'none',
                                              }
                                          ]}
                                      >
                                          {'Hide Exercises ^'}
                                      </Text>
                                  }
                              </View>
                          </View>
                      </View>
                      :
                      null
                }
                { functionalStrength && Object.keys(functionalStrength) && Object.keys(functionalStrength).length > 0 && !functionalStrength.completed && !isFunctionalStrengthCollapsed ?
                    <ExerciseList
                        completedExercises={completedFSExercises}
                        exerciseList={fsExerciseList}
                        handleCompleteExercise={this._handleCompleteFSExercise}
                        isFSCompletedValid={isFSCompletedValid}
                        isFunctionalStrength={true}
                        toggleCompletedAMPMRecoveryModal={() => this.setState({ isFSExerciseCompletionModalOpen: true, })}
                        toggleSelectedExercise={this._toggleSelectedExercise}
                    />
                    :
                    null
                }
                { isFunctionalStrengthCollapsed ?
                    _.map(filteredTrainingSessions, (postPracticeSurvey, i) => {
                        let cleanedPostSessionName = MyPlanConstants.cleanedPostSessionName(postPracticeSurvey).fullName;
                        return(
                            <View key={`postPracticeSurveys${i}`}>
                                <ListItem
                                    disabled={!isDailyReadinessSurveyCompleted}
                                    hideChevron={true}
                                    leftIcon={
                                        <View style={[{height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}>
                                            <LottieView
                                                autoPlay={true}
                                                loop={false}
                                                source={require('../../../assets/animation/checkmark-circle.json')}
                                            />
                                        </View>
                                    }
                                    title={cleanedPostSessionName}
                                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, {color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24),}]}
                                />
                                <DefaultListGap
                                    size={24}
                                />
                            </View>
                        );
                    })
                    :
                    null
                }
                <Spacer size={15} />
                { isFunctionalStrengthCollapsed ?
                    <View>
                        <Button
                            buttonStyle={{backgroundColor: logActivityButtonBackgroundColor, borderColor: isDailyReadinessSurveyCompleted ? logActivityButtonBackgroundColor : AppColors.zeplin.greyText, justifyContent: 'space-between',}}
                            containerStyle={{marginLeft: 22, marginRight: 22,}}
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
                                containerStyle={{marginLeft: 22, marginRight: 22,}}
                                icon={{
                                    color: isDailyReadinessSurveyCompleted ? AppColors.zeplin.yellow : AppColors.zeplin.greyText,
                                    name:  isDailyReadinessSurveyCompleted ? 'add' : 'lock',
                                    size:  isDailyReadinessSurveyCompleted ? AppFonts.scaleFont(30) : 20,
                                }}
                                onPress={() => isDailyReadinessSurveyCompleted ? this.props.noSessions().catch(() => AppUtil.handleAPIErrorAlert(ErrorMessages.noSessions)) : null}
                                title={'Off day'}
                                titleStyle={{color: isDailyReadinessSurveyCompleted ? AppColors.zeplin.yellow : AppColors.zeplin.greyText, flex: 8, fontSize: AppFonts.scaleFont(18), textAlign: 'left',}}
                                type={'outline'}
                            />
                            :
                            null
                        }
                    </View>
                    :
                    null
                }
                <FathomModal
                    isVisible={isPostSessionSurveyModalOpen}
                    style={{margin: 0,}}
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
                        soreBodyParts={this.props.plan.soreBodyParts}
                        typicalSessions={this.props.plan.typicalSessions}
                        user={user}
                    />
                </FathomModal>
                <FathomModal
                    isVisible={isSelectedExerciseModalOpen}
                    style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: AppColors.transparent, margin: 0,}]}
                >
                    <SingleExerciseItem
                        completedExercises={completedFSExercises}
                        exercise={MyPlanConstants.cleanExercise(selectedExercise)}
                        handleCompleteExercise={exerciseId => {
                            this._handleCompleteFSExercise(exerciseId);
                            this.setState({ isSelectedExerciseModalOpen: false, });
                        }}
                        selectedExercise={selectedExercise && selectedExercise.library_id ? selectedExercise.library_id : ''}
                    />
                </FathomModal>
                <SessionsCompletionModal
                    isModalOpen={isTrainSessionsCompletionModalOpen}
                    onClose={this._closeTrainSessionsCompletionModal}
                    sessions={postSession && postSession.sessions && postSession.sessions.length > 0 ? postSession.sessions : []}
                />
                <ExerciseCompletionModal
                    completedExercises={completedFSExercises}
                    exerciseList={fsExerciseList}
                    isFS={true}
                    isModalOpen={isFSExerciseCompletionModalOpen}
                    onClose={() => this.setState({ isFSExerciseCompletionModalOpen: false, })}
                    onComplete={() => {
                        this.setState({ isFSExerciseCompletionModalOpen: false, });
                        this.props.patchFunctionalStrength(completedFSExercises)
                            .then(() => {
                                this.props.clearCompletedFSExercises();
                                this.setState({ isFunctionalStrengthCollapsed: true, });
                            })
                            .catch(() => {
                                AppUtil.handleAPIErrorAlert(ErrorMessages.patchFunctionalStrength);
                            })
                    }}
                    user={user}
                />
                <FathomModal
                    isVisible={isFunctionalStrengthModalOpen}
                    style={{margin: 0,}}
                >
                    <FunctionalStrengthModal
                        functionalStrength={this.state.functionalStrength}
                        handleFormChange={this._handleFSFormChange}
                        handleFormSubmit={this._handleFSFormSubmit}
                        toggleFSModal={this._toggleFunctionalStrengthModal}
                        typicalSessions={this.props.plan.typicalSessions}
                    />
                </FathomModal>
            </ScrollView>
        );
    };
*/
    renderPrepare = index => {
        let {
            dailyReadiness,
            // isFSCalculating,
            // isPageLoading,
            isPrepCalculating,
            // isPrepareExerciseCompletionModalOpen,
            isPrepareSessionsCompletionModalOpen,
            // isRecoverCalculating,
            // prepare,
            // preRecoveryPriority,
        } = this.state;
            // below are still in the works - state
            // isReadinessSurveyModalOpen,
            // isPreparePrioritySlideUpPanelOpen,
            // isPrepareSlideUpPanelOpen,
            // prepareSelectedActiveTime,
            // healthData,
            // isSelectedExerciseModalOpen,
            // selectedExercise,
        let { plan, /*user,*/ } = this.props;
        // let completedExercises = plan.completedExercises;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let isReadinessSurveyCompleted = dailyPlanObj.daily_readiness_survey_completed;
        let isCareAndActivateActive = dailyPlanObj.pre_active_rest && dailyPlanObj.pre_active_rest.active;
        let isHeatActive = dailyPlanObj.heat && dailyPlanObj.heat.length > 0;
        // let {
        //     // disabled,
        //     // exerciseList,
        //     // isActive,
        //     // isCompleted,
        //     isReadinessSurveyCompleted,
        //     // recoveryObj,
        // } = PlanLogic.handleMyPlanRenderPrepareTabLogic(dailyPlanObj, false, plan.goals);
        return (
            <ScrollView
                contentContainerStyle={{backgroundColor: AppColors.white, flexGrow: 1, paddingLeft: AppSizes.padding, paddingRight: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingLrg,}}
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
                                    { isCareAndActivateActive &&
                                        <DefaultListGap
                                            size={AppSizes.paddingLrg}
                                        />
                                    }
                                </View>
                                { isCareAndActivateActive &&
                                    <ActivityTab
                                        backgroundImage={require('../../../assets/images/standard/active_rest.png')}
                                        onPress={() => Actions.exerciseList()}
                                        showBottomGap={isHeatActive}
                                        subtitle={isPrepCalculating ? '' : 'Anytime before training'}
                                        title={'CARE & ACTIVATE'}
                                    />
                                }
                                { isHeatActive && !isPrepCalculating &&
                                    <ActivityTab
                                        backgroundImage={require('../../../assets/images/standard/heat.png')}
                                        onPress={() => console.log('hi from RENDERPREPARE - HEAT')}
                                        showBottomGap={false}
                                        subtitle={'30 minutes before training'}
                                        title={'HEAT'}
                                    />
                                }
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
        let {
            // healthData,
            // isFSCalculating,
            // isFSExerciseCompletionModalOpen,
            // isFunctionalStrengthCollapsed,
            // isFunctionalStrengthModalOpen,
            // isPostSessionSurveyModalOpen,
            // isSelectedExerciseModalOpen,
            isTrainSessionsCompletionModalOpen,
            postSession,
            // selectedExercise,
        } = this.state;
        let { plan, /*user,*/ } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let {
            // completedFSExercises,
            filteredTrainingSessions,
            // fsExerciseList,
            // functionalStrength,
            isDailyReadinessSurveyCompleted,
            // isFSCompletedValid,
            // isFSEligible,
            logActivityButtonBackgroundColor,
            logActivityButtonColor,
            logActivityButtonOutlined,
            // logActivityRightIconColor,
            offDaySelected,
        } = PlanLogic.handleMyPlanRenderTrainTabLogic(dailyPlanObj, store.getState().plan);
        return (
            <ScrollView
                contentContainerStyle={{backgroundColor: AppColors.white, flexGrow: 1, paddingLeft: AppSizes.padding, paddingRight: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingLrg,}}
                tabLabel={tabs[index]}
            >
                { (dailyPlanObj && !dailyPlanObj.sessions_planned) && filteredTrainingSessions && filteredTrainingSessions.length === 0 ?
                    <View>
                        <ListItem
                            disabled={!isDailyReadinessSurveyCompleted}
                            hideChevron={true}
                            leftIcon={
                                <View style={[{height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}>
                                    <LottieView
                                        autoPlay={true}
                                        loop={false}
                                        source={require('../../../assets/animation/checkmark-circle.json')}
                                    />
                                </View>
                            }
                            title={'OFF DAY'}
                            titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, {color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24),}]}
                        />
                        <View style={{flexDirection: 'row',}}>
                            <View style={{borderRightColor: AppColors.primary.grey.thirtyPercent, borderRightWidth: 1, paddingLeft: 22,}} />{/* standard padding of 10 and 5 for half the default size of icons */}
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
                            <ListItem
                                disabled={!isDailyReadinessSurveyCompleted}
                                hideChevron={true}
                                leftIcon={
                                    <View style={[{height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}>
                                        <LottieView
                                            autoPlay={true}
                                            loop={false}
                                            source={require('../../../assets/animation/checkmark-circle.json')}
                                        />
                                    </View>
                                }
                                title={cleanedPostSessionName}
                                titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, {color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24),}]}
                            />
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
                        onPress={() => isDailyReadinessSurveyCompleted ? this.props.noSessions().catch(() => AppUtil.handleAPIErrorAlert(ErrorMessages.noSessions)) : null}
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
        let {
            // isPageLoading,
            // isFSCalculating,
            // isPrepCalculating,
            isRecoverCalculating,
            postRecoveryPriority,
            // recover,
        } = this.state;
        let { plan, /*user,*/ } = this.props;
        // let completedExercises = plan.completedExercises;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        // let isCompleted = false;
        let isCareAndActivateActive = dailyPlanObj.post_active_rest && dailyPlanObj.post_active_rest.active;
        let isIceActive = dailyPlanObj.ice && dailyPlanObj.ice.length > 0;
        // let {
        //     // disabled,
        //     // exerciseList,
        //     // isActive,
        //     isCompleted,
        //     // recoveryObj,
        // } = PlanLogic.handleMyPlanRenderRecoverTabLogic(dailyPlanObj, postRecoveryPriority, plan.goals);
        return (
            <ScrollView
                contentContainerStyle={{backgroundColor: AppColors.white, flexGrow: 1, paddingLeft: AppSizes.padding, paddingRight: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingLrg,}}
                tabLabel={tabs[index]}
            >
                { isCareAndActivateActive &&
                    <ActivityTab
                        backgroundImage={require('../../../assets/images/standard/active_rest.png')}
                        calculating={isRecoverCalculating}
                        onPress={() => console.log('hi from RENDERRECOVER - CARE & ACTIVATE')}
                        showBottomGap={isIceActive}
                        subtitle={isRecoverCalculating ? '' : 'Anytime before training'}
                        title={'CARE & ACTIVATE'}
                    />
                }
                { isIceActive && !isRecoverCalculating &&
                    <ActivityTab
                        backgroundImage={require('../../../assets/images/standard/ice.png')}
                        onPress={() => console.log('hi from RENDERRECOVER - ICE')}
                        showBottomGap={false}
                        subtitle={'After all training complete'}
                        title={'ICE'}
                    />
                }
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
            isReadinessSurveyModalOpen,
            isRecoverCalculating,
            loading,
            postSession,
            showLoadingText,
            trainLoadingScreenText,
        } = this.state;
        let isScrollLocked = (
            isReadinessSurveyModalOpen ||
            isPostSessionSurveyModalOpen ||
            loading ||
            // this.state.isSelectedExerciseModalOpen ||
            this.state.isPrepareSessionsCompletionModalOpen ||
            this.state.isTrainSessionsCompletionModalOpen ||
            isPrepCalculating ||
            isRecoverCalculating
        );
        return(
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
        );
    }
}

/* Export Component ==================================================================== */
export default MyPlan;