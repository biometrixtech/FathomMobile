/**
 * MyPlan View
 */
import React, { Component } from 'react';
import {
    ActivityIndicator,
    Alert,
    AppState,
    BackHandler,
    Easing,
    Image,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import { GoogleAnalyticsTracker, } from 'react-native-google-analytics-bridge';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modalbox';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppSizes, AppStyles, AppFonts, ErrorMessages, MyPlan as MyPlanConstants, } from '../../constants/';
import { AppUtil, PlanLogic, } from '../../lib';
import { store } from '../../store';

// Components
import { Alerts, Button, ListItem, Spacer, TabIcon, Text } from '../custom/';
import {
    ActiveRecoveryBlocks,
    ActiveTimeSlideUpPanel,
    DefaultListGap,
    ExerciseCompletionModal,
    ExerciseList,
    Exercises,
    PostSessionSurvey,
    ReadinessSurvey,
    RenderMyPlanTab,
    SessionsCompletionModal,
    SingleExerciseItem,
} from './pages';

// Tabs titles
const tabs = ['PREPARE', 'TRAIN', 'RECOVER'];

// text constants
const activeRecoveryDisabledText = 'Log a new activity on the Train Screen to receive an Active Recovery!';
const errorInARAPMessage = '\nPlease Swipe Down to Refresh!';
const highSorenessMessage = 'Based on your reported discomfort we recommend you rest & utilize self-care techniques like heat, ice, or massage to help reduce swelling, ease pain, & speed up healing.\n\nIf you have pain or swelling that gets worse or doesn\'t go away, please seek appropriate medical attention.';
const lowSorenessPostMessage = 'Looks like you\'re all clear! Active Recovery is low-impact for now, so log another activity or we\'ll check in tomorrow to assess your ideal Recovery Plan!';
const lowSorenessPreMessage = 'Looks like you\'re all clear for practice! Mobilize is low-impact this morning so complete your usual warm-up and we’ll pick-up with post practice recovery!';
const offDayLoggedText = 'Make the most of your training by resting well today: hydrate, eat well and sleep early.';

// setup GA Tracker
const GATracker = new GoogleAnalyticsTracker('UA-127040201-1');

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
    alertMessageWrapper: {
        alignSelf:    'center',
        flex:         1,
        marginRight:  9,
        paddingLeft:  37,
        paddingRight: 15,
    },
    alertMessageIconWrapper: {
        alignSelf:            'stretch',
        backgroundColor:      AppColors.primary.yellow.hundredPercent,
        borderTopLeftRadius:  5,
        borderTopRightRadius: 5,
        paddingVertical:      AppSizes.paddingSml,
    },
    alertMessageTextWrapper: {
        backgroundColor:         AppColors.primary.grey.twentyPercent,
        borderBottomLeftRadius:  5,
        borderBottomRightRadius: 5,
        flex:                    1,
        padding:                 AppSizes.padding,
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { height: 3, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  4,
    },
});

/* Component ==================================================================== */
class MyPlan extends Component {
    static componentName = 'MyPlanView';

    static propTypes = {
        ble:                           PropTypes.object.isRequired,
        clearCompletedExercises:       PropTypes.func.isRequired,
        clearCompletedFSExercises:     PropTypes.func.isRequired,
        clearHealthKitWorkouts:        PropTypes.func.isRequired,
        getSoreBodyParts:              PropTypes.func.isRequired,
        healthData:                    PropTypes.object.isRequired,
        lastOpened:                    PropTypes.object.isRequired,
        markStartedFunctionalStrength: PropTypes.func.isRequired,
        markStartedRecovery:           PropTypes.func.isRequired,
        network:                       PropTypes.object.isRequired,
        noSessions:                    PropTypes.func.isRequired,
        notification:                  PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string,
        ]),
        patchActiveRecovery:     PropTypes.func.isRequired,
        patchActiveTime:         PropTypes.func.isRequired,
        patchFunctionalStrength: PropTypes.func.isRequired,
        plan:                    PropTypes.object.isRequired,
        postReadinessSurvey:     PropTypes.func.isRequired,
        postSessionSurvey:       PropTypes.func.isRequired,
        setAppLogs:              PropTypes.func.isRequired,
        setCompletedExercises:   PropTypes.func.isRequired,
        setCompletedFSExercises: PropTypes.func.isRequired,
        updateUser:              PropTypes.func.isRequired,
        user:                    PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            currentTabLocation: 0,
            dailyReadiness:     {
                current_position:          null,
                current_sport_name:        null,
                readiness:                 null,
                sessions:                  [],
                sessions_planned:          null,
                sleep_quality:             null,
                soreness:                  [],
                wants_functional_strength: null,
                // won't be submitted, help with UI
                already_trained_number:    null,
            },
            healthData:                           props.healthData,
            isCompletedAMPMRecoveryModalOpen:     true,
            isFunctionalStrengthCollapsed:        true,
            isFSExerciseCompletionModalOpen:      false,
            isPageLoading:                        false,
            isPostSessionSurveyModalOpen:         false,
            isPrepCalculating:                    false,
            isPrepareExerciseCompletionModalOpen: false,
            isPrepareSessionsCompletionModalOpen: false,
            isPrepareSlideUpPanelOpen:            false,
            isReadinessSurveyModalOpen:           false,
            isRecoverCalculating:                 false,
            isRecoverExerciseCompletionModalOpen: false,
            isRecoverSlideUpPanelOpen:            false,
            isSelectedExerciseModalOpen:          false,
            isTrainSessionsCompletionModalOpen:   false,
            page0:                                {},
            page1:                                {},
            page2:                                {},
            postSession:                          {
                RPE:                            null,
                description:                    '',
                duration:                       0,
                event_date:                     null,
                session_type:                   null,
                sessions:                       [],
                soreness:                       [],
                sport_name:                     null, // this exists for session_type = 0,2,3,6
                strength_and_conditioning_type: null, // this only exists for session_type=1
            },
            prepare: {
                finishedRecovery:           props.plan && props.plan.dailyPlan[0] && props.plan.dailyPlan[0].pre_recovery_completed ? true : false,
                isActiveRecoveryCollapsed:  true,
                isReadinessSurveyCollapsed: false,
                isReadinessSurveyCompleted: false,
            },
            prepareSelectedActiveTime: 2,
            recover:                   {
                finished:                  false,
                isActiveRecoveryCollapsed: true,
            },
            recoverSelectedActiveTime: 2,
            selectedExercise:          {},
            train:                     {
                completedPostPracticeSurvey: false,
                postPracticeSurveys:         [],
            },
            loading: false,
        };
        this._postSessionSurveyModalRef = {};
        this._readinessSurveyModalRef = {};
        this._singleExerciseItemRef = {};
        this.renderTab = this.renderTab.bind(this);
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        // we've already fetched MyPlan, make necessary state updates
        let planObj = this.props.plan.dailyPlan[0] || {};
        if(planObj.daily_readiness_survey_completed) {
            let postPracticeSurveys = planObj.training_sessions.map(session => session.post_session_survey
                ? {
                    isPostPracticeSurveyCollapsed: true,
                    isPostPracticeSurveyCompleted: true,
                } : {
                    isPostPracticeSurveyCollapsed: false,
                    isPostPracticeSurveyCompleted: false,
                }
            );
            _.delay(() => {
                this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(planObj));
            }, 500);
            this.setState({
                prepare: Object.assign({}, this.state.prepare, {
                    finishedRecovery:           planObj.pre_recovery_completed || this.state.prepare.finishedRecovery,
                    isActiveRecoveryCollapsed:  planObj.pre_recovery_completed || this.state.prepare.isActiveRecoveryCollapsed,
                    isReadinessSurveyCollapsed: true,
                }),
                recover: Object.assign({}, this.state.recover, {
                    isActiveRecoveryCollapsed: planObj.post_recovery && !planObj.pre_recovery ? false : true,
                }),
                train: Object.assign({}, this.state.train, {
                    completedPostPracticeSurvey: postPracticeSurveys[0] ? postPracticeSurveys[0].isPostPracticeSurveyCompleted : {},
                    postPracticeSurveys
                }),
            });
        } else {
            let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
            newDailyReadiness.soreness = PlanLogic.handleNewSoreBodyPartLogic(this.props.plan.soreBodyParts);
            this.setState({
                dailyReadiness:             newDailyReadiness,
                isReadinessSurveyModalOpen: true,
                prepare:                    Object.assign({}, this.state.prepare, {
                    isActiveRecoveryCollapsed:  true,
                    isReadinessSurveyCollapsed: false,
                }),
            });
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
                            isActiveRecoveryCollapsed: response.daily_plans[0].post_recovery && !response.daily_plans[0].pre_recovery ? false : true,
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
                            newDailyReadiness.soreness = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts);
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

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

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

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.notification && nextProps.notification !== this.props.notification) {
            this._handlePushNotification(nextProps);
        }
        const areObjectsDifferent = _.isEqual(nextProps.plan, this.props.plan);
        if(
            !areObjectsDifferent &&
            this.props.plan.dailyPlan[0] &&
            nextProps.plan.dailyPlan[0] &&
            nextProps.plan.dailyPlan[0].landing_screen !== this.props.plan.dailyPlan[0].landing_screen &&
            (
                nextProps.plan.dailyPlan[0].post_recovery_completed ||
                nextProps.plan.dailyPlan[0].pre_recovery_completed
            )
        ) {
            this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(nextProps.plan.dailyPlan[0]));
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
        // if we have workouts, handle RS or PSS
        if(!_.isEqual(prevProps.healthData, this.props.healthData) && this.props.healthData.workouts.length > 0) {
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
    }

    _handleAppStateChange = (nextAppState) => {
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

    _handleDailyReadinessFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate) => {
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, this.state.dailyReadiness, isClearCandidate);
        this.setState({
            dailyReadiness: newFormFields
        });
    }

    _handlePostSessionFormChange = (name, value, isPain = false, bodyPart, side, isClearCandidate) => {
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, this.state.postSession, isClearCandidate);
        this.setState({
            postSession: newFormFields
        });
    }

    _handleHealthDataFormChange = (index, name, value, callback) => {
        let newHealthData = _.cloneDeep(this.state.healthData.workouts);
        let newFormFields = _.update(newHealthData[index], name, () => value);
        if(name === 'deleted' && value === true) {
            newFormFields = _.update(newHealthData[index], 'post_session_survey.RPE', () => null);
        }
        newHealthData[index] = newFormFields;
        this.setState({
            healthData: {
                ignoredWorkouts: this.state.healthData.ignoredWorkouts,
                sleep:           this.state.healthData.sleep,
                workouts:        newHealthData,
            },
        }, () => {
            if(callback) { callback(); }
        });
    }

    _handleReadinessSurveySubmit = () => {
        // TODO: MOVE TO LOGIC FILE AND UNIT TEST BELOW
        let newPrepareObject = Object.assign({}, this.state.prepare, {
            isReadinessSurveyCompleted: true,
        });
        let newDailyReadiness = {
            date_time:                 `${moment().toISOString(true).split('.')[0]}Z`,
            user_id:                   this.props.user.id,
            soreness:                  _.filter(this.state.dailyReadiness.soreness, u => u.severity && u.severity > 0 && !u.isClearCandidate),
            clear_candidates:          _.filter(this.state.dailyReadiness.soreness, {isClearCandidate: true}),
            sleep_quality:             this.state.dailyReadiness.sleep_quality,
            readiness:                 this.state.dailyReadiness.readiness,
            wants_functional_strength: this.state.dailyReadiness.wants_functional_strength,
            sessions_planned:          this.state.dailyReadiness.sessions_planned,
        };
        if(this.state.dailyReadiness.current_sport_name === 0 || this.state.dailyReadiness.current_sport_name > 0) {
            newDailyReadiness.current_sport_name = this.state.dailyReadiness.current_sport_name;
        }
        if(this.state.dailyReadiness.current_position === 0 || this.state.dailyReadiness.current_position > 0) {
            newDailyReadiness.current_position = this.state.dailyReadiness.current_position;
        }
        let healthDataWorkouts = this.state.healthData.workouts ? this.state.healthData.workouts : [];
        let healthDataIgnoredWorkouts = this.state.healthData.ignoredWorkouts ? this.state.healthData.ignoredWorkouts : [];
        let dailyReadinessSessions = this.state.dailyReadiness.sessions ? this.state.dailyReadiness.sessions : [];
        newDailyReadiness.sessions = _.concat(healthDataWorkouts, dailyReadinessSessions, healthDataIgnoredWorkouts);
        newDailyReadiness.sleep_data = this.state.healthData.sleep;
        if(this.state.healthData.workouts.length > 0) {
            newDailyReadiness.health_sync_date = `${moment().toISOString(true).split('.')[0]}Z`;
        }
        _.delay(() => {
            let filteredHealthDataWorkouts = _.filter(healthDataWorkouts, o => !o.deleted);
            let filteredDailyReadinessSessions = _.filter(dailyReadinessSessions, o => !o.deleted);
            let nonDeletedSessions = _.concat(filteredHealthDataWorkouts, filteredDailyReadinessSessions);
            this.setState(
                {
                    dailyReadiness: {
                        readiness:        0,
                        sessions:         nonDeletedSessions,
                        sessions_planned: newDailyReadiness.sessions_planned,
                        sleep_quality:    0,
                        soreness:         [],
                    },
                    healthData:                           [],
                    isPrepCalculating:                    this.state.dailyReadiness.sessions_planned ? true : false,
                    isPrepareSessionsCompletionModalOpen: nonDeletedSessions.length !== 0,
                    isReadinessSurveyModalOpen:           false,
                    isRecoverCalculating:                 this.state.dailyReadiness.sessions_planned ? false : true,
                    prepare:                              newPrepareObject,
                },
                () => { if(!newDailyReadiness.sessions_planned && newDailyReadiness.sessions.length === 0) { this._goToScrollviewPage(2); } },
            );
        }, 500);
        this.props.postReadinessSurvey(newDailyReadiness)
            .then(response => {
                this.props.clearHealthKitWorkouts();
                this.props.clearCompletedExercises();
                this.props.clearCompletedFSExercises();
            })
            .catch(error => {
                console.log('error',error);
                AppUtil.handleAPIErrorAlert(ErrorMessages.postReadinessSurvey);
            });
    }

    _handlePostSessionSurveySubmit = areAllDeleted => {
        // TODO: MOVE TO LOGIC FILE AND UNIT TEST BELOW
        /*
         * update for the componentWillReceiveProps call will only
         * result in a tabPage auto change if a postPracticeSurvey
         * has not already been completed
         */
        let postSession = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
            user_id:    this.props.user.id,
            sessions:   [],
        };
        if(this.state.healthData.workouts && this.state.healthData.workouts.length > 0) {
            postSession.health_sync_date = `${moment().toISOString(true).split('.')[0]}Z`;
            let healthDataWorkouts = this.state.healthData.workouts ? this.state.healthData.workouts : [];
            let healthDataIgnoredWorkouts = this.state.healthData.ignoredWorkouts ? this.state.healthData.ignoredWorkouts : [];
            postSession.sessions = _.concat(healthDataIgnoredWorkouts, healthDataWorkouts);
            let lastNonDeletedIndex = _.findLastIndex(postSession.sessions, ['deleted', false]);
            if(postSession.sessions[lastNonDeletedIndex]) {
                postSession.sessions[lastNonDeletedIndex].post_session_survey = {
                    clear_candidates: _.filter(this.state.postSession.soreness, {isClearCandidate: true}),
                    event_date:       `${moment().toISOString(true).split('.')[0]}Z`,
                    RPE:              postSession.sessions[lastNonDeletedIndex].post_session_survey.RPE,
                    soreness:         _.filter(this.state.postSession.soreness, u => u.severity && u.severity > 0 && !u.isClearCandidate),
                };
            }
        } else {
            let newSession = {
                event_date:          this.state.postSession.event_date,
                session_type:        6,
                sport_name:          this.state.postSession.sport_name,
                duration:            this.state.postSession.duration,
                description:         '',
                calories:            null,
                distance:            null,
                end_date:            null,
                source:              0,
                deleted:             false,
                hr_data:             [],
                post_session_survey: {
                    clear_candidates: _.filter(this.state.postSession.soreness, {isClearCandidate: true}),
                    event_date:       `${moment().toISOString(true).split('.')[0]}Z`,
                    RPE:              this.state.postSession.RPE,
                    soreness:         _.filter(this.state.postSession.soreness, u => u.severity && u.severity > 0 && !u.isClearCandidate),
                },
            };
            postSession.sessions.push(newSession);
        }
        let clonedPostPracticeSurveys = _.cloneDeep(this.state.train.postPracticeSurveys);
        let newSurvey = {};
        newSurvey.isPostPracticeSurveyCollapsed = true;
        newSurvey.isPostPracticeSurveyCompleted = true;
        clonedPostPracticeSurveys.push(newSurvey);
        let newTrainObject = Object.assign({}, this.state.train, {
            completedPostPracticeSurvey: true,
            postPracticeSurveys:         clonedPostPracticeSurveys,
        });
        let postPracticeSurveysLastIndex = _.findLastIndex(newTrainObject.postPracticeSurveys);
        newTrainObject.postPracticeSurveys[postPracticeSurveysLastIndex].isPostPracticeSurveyCompleted = true;
        newTrainObject.postPracticeSurveys[postPracticeSurveysLastIndex].isPostPracticeSurveyCollapsed = true;
        _.delay(() => {
            this.setState(
                {
                    healthData:                         [],
                    train:                              newTrainObject,
                    isPostSessionSurveyModalOpen:       false,
                    isRecoverCalculating:               !areAllDeleted,
                    isTrainSessionsCompletionModalOpen: !areAllDeleted,
                    postSession:                        {
                        RPE:                            null,
                        description:                    '',
                        duration:                       0,
                        event_date:                     null,
                        session_type:                   null,
                        sessions:                       _.filter(postSession.sessions, o => !o.deleted && !o.ignored),
                        soreness:                       [],
                        sport_name:                     null,
                        strength_and_conditioning_type: null,
                    },
                },
            );
        }, 500);
        this.props.postSessionSurvey(postSession)
            .then(response => {
                this.props.clearHealthKitWorkouts();
                if(!areAllDeleted) {
                    this.props.clearCompletedExercises();
                }
                if(areAllDeleted) {
                    let landingScreen = this.props.plan.dailyPlan[0] && this.props.plan.dailyPlan[0].landing_screen ?
                        this.props.plan.dailyPlan[0].landing_screen
                        :
                        0;
                    this._goToScrollviewPage(landingScreen);
                }
            })
            .catch(error => {
                console.log('error',error);
                AppUtil.handleAPIErrorAlert(ErrorMessages.postSessionSurvey);
            });
    }

    _handleAreaOfSorenessClick = (areaClicked, isDailyReadiness, isAllGood) => {
        let stateObject = isDailyReadiness ? this.state.dailyReadiness : this.state.postSession;
        let newSorenessFields = PlanLogic.handleAreaOfSorenessClick(stateObject, areaClicked, isAllGood, this.props.plan.soreBodyParts);
        let newFormFields = _.update( stateObject, 'soreness', () => newSorenessFields);
        if (isDailyReadiness) {
            this.setState({
                dailyReadiness: newFormFields,
            });
        } else {
            this.setState({
                postSession: newFormFields,
            });
        }
    }

    _handleUpdateFirstTimeExperience = (value, callback) => {
        // setup variables
        let newUserPayloadObj = {};
        newUserPayloadObj.first_time_experience = [value];
        let newUserObj = _.cloneDeep(this.props.user);
        newUserObj.first_time_experience.push(value);
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

    _toggleCompletedAMPMRecoveryModal = () => {
        this.props.clearCompletedExercises();
        this.setState({
            isCompletedAMPMRecoveryModalOpen: !this.state.isCompletedAMPMRecoveryModalOpen
        });
    }

    _togglePostSessionSurveyModal = () => {
        this.setState({ loading: true, });
        if (!this.state.isPostSessionSurveyModalOpen) {
            this.props.getSoreBodyParts()
                .then(soreBodyParts => {
                    let newDailyReadiness = _.cloneDeep(this.state.postSession);
                    newDailyReadiness.soreness = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts);
                    this.setState({
                        isPostSessionSurveyModalOpen: true,
                        loading:                      false,
                        postSession:                  newDailyReadiness,
                    });
                })
                .catch(err => {
                    // if there was an error, maybe the survey wasn't created for yesterday so have them do it as a blank
                    let newDailyReadiness = _.cloneDeep(this.state.postSession);
                    newDailyReadiness.soreness = [];
                    this.setState({
                        isPostSessionSurveyModalOpen: true,
                        loading:                      false,
                        postSession:                  newDailyReadiness,
                    });
                    AppUtil.handleAPIErrorAlert(ErrorMessages.getSoreBodyParts);
                });
        } else {
            let newPostSession = _.cloneDeep(this.state.postSession);
            newPostSession.description = '';
            newPostSession.duration = 0;
            newPostSession.event_date = null;
            newPostSession.session_type = null;
            newPostSession.sport_name = null;
            newPostSession.strength_and_conditioning_type = null;
            newPostSession.RPE = null;
            this.props.clearCompletedExercises();
            _.delay(() => {
                this.setState(
                    {
                        isPostSessionSurveyModalOpen: false,
                        loading:                      false,
                        postSession:                  newPostSession,
                    },
                );
            }, 500);
        }
    }

    _handleExerciseListRefresh = (shouldClearCompletedExercises, isFromPushNotification) => {
        let userId = this.props.user.id;
        this.setState({ isPageLoading: isFromPushNotification ? false : true, });
        this.props.getMyPlan(userId, moment().format('YYYY-MM-DD'))
            .then(response => {
                const dailyPlanObj = response.daily_plans && response.daily_plans[0] ? response.daily_plans[0] : false;
                let prepExerciseList = dailyPlanObj.pre_recovery.display_exercises ? MyPlanConstants.cleanExerciseList(dailyPlanObj.pre_recovery) : {};
                let recoverExerciseList = dailyPlanObj.post_recovery.display_exercises ? MyPlanConstants.cleanExerciseList(dailyPlanObj.post_recovery) : {};
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
                _.delay(() => {
                    this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(dailyPlanObj));
                }, 500);
                if(shouldClearCompletedExercises) {
                    this.props.clearCompletedExercises();
                }
                let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
                this.setState({
                    dailyReadiness:       newDailyReadiness,
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
            this.props.markStartedRecovery(this.props.user.id, recovery_type, newMyPlan);
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
        if(newCompletedExercises.length === 1 && !startDate) {
            let newMyPlan =  _.cloneDeep(this.props.plan.dailyPlan);
            newMyPlan[0].functional_strength_session.start_date = true;
            this.props.markStartedFunctionalStrength(this.props.user.id, newMyPlan);
        }
        // continue by updating reducer and state
        this.props.setCompletedFSExercises(newCompletedExercises);
    }

    _toggleSelectedExercise = (exerciseObj, isModalOpen) => {
        this.setState({
            isSelectedExerciseModalOpen: isModalOpen,
            selectedExercise:            exerciseObj ? exerciseObj : {},
        });
    }

    _togglePrepareSlideUpPanel = () => {
        this.setState({
            isPrepareSlideUpPanelOpen: !this.state.isPrepareSlideUpPanelOpen,
        });
    }

    _toggleRecoverSlideUpPanel = () => {
        this.setState({
            isRecoverSlideUpPanelOpen: !this.state.isRecoverSlideUpPanelOpen,
        });
    }

    _changeSelectedActiveTime = (selectedIndex, prepareOrRecover) => {
        this.setState({
            [prepareOrRecover]: selectedIndex,
        });
    }

    _closePrepareSessionsCompletionModal = () => {
        const { dailyReadiness, } = this.state;
        _.delay(() => {
            if(!dailyReadiness.sessions_planned && dailyReadiness.sessions.length > 0) {
                this.setState(
                    {
                        dailyReadiness: {
                            readiness:        0,
                            sessions:         [],
                            sessions_planned: false,
                            sleep_quality:    0,
                            soreness:         [],
                        },
                        isPrepareSessionsCompletionModalOpen: false,
                    },
                    () => this._goToScrollviewPage(2)
                );
            } else if(dailyReadiness.sessions_planned && dailyReadiness.sessions.length > 0) {
                this.setState({
                    dailyReadiness: {
                        readiness:        0,
                        sessions:         [],
                        sessions_planned: false,
                        sleep_quality:    0,
                        soreness:         [],
                    },
                    isPrepareSessionsCompletionModalOpen: false,
                });
            }
        }, 500);
    }

    _closeTrainSessionsCompletionModal = () => {
        this.setState(
            {
                isTrainSessionsCompletionModalOpen: false,
                postSession:                        {
                    RPE:                            null,
                    description:                    '',
                    duration:                       0,
                    event_date:                     null,
                    session_type:                   null,
                    soreness:                       [],
                    sport_name:                     null,
                    strength_and_conditioning_type: null,
                },
            },
            () => _.delay(() => { this._goToScrollviewPage(2) }, 500)
        );
    }

    renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle) {
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

    renderPrepare = index => {
        let { dailyReadiness, isPageLoading, isPrepCalculating, prepare, } = this.state;
        let completedExercises = store.getState().plan.completedExercises;
        let { plan, user, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        // assuming AM/PM is switching to something for prepared vs recover
        let recoveryObj = dailyPlanObj && dailyPlanObj.pre_recovery ? dailyPlanObj.pre_recovery : false;
        let exerciseList = recoveryObj.display_exercises ? MyPlanConstants.cleanExerciseList(recoveryObj) : {};
        let disabled = recoveryObj && !recoveryObj.display_exercises && !recoveryObj.completed ? true : false;
        let isActive = recoveryObj && recoveryObj.display_exercises && !recoveryObj.completed ? true : false;
        let isCompleted = recoveryObj && !recoveryObj.display_exercises && recoveryObj.completed  ? true : false;
        let isReadinessSurveyCompleted = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ? true : false;
        return (
            <ScrollView
                contentContainerStyle={{ backgroundColor: AppColors.white, }}
                refreshControl={
                    <RefreshControl
                        colors={[AppColors.primary.yellow.hundredPercent]}
                        onRefresh={() => this._handleExerciseListRefresh(false)}
                        refreshing={isPageLoading}
                        title={'Loading...'}
                        titleColor={AppColors.primary.yellow.hundredPercent}
                        tintColor={AppColors.primary.yellow.hundredPercent}
                    />
                }
                tabLabel={tabs[index]}
            >
                <Spacer size={30} />
                { isReadinessSurveyCompleted ?
                    <View>
                        <ListItem
                            containerStyle={{ borderBottomWidth: 0 }}
                            disabled={false}
                            hideChevron={true}
                            leftIcon={
                                <View style={[{ height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, width: AppFonts.scaleFont(24), }]}>
                                    <LottieView
                                        autoPlay={true}
                                        loop={false}
                                        source={require('../../../assets/animation/checkmark-circle.json')}
                                    />
                                </View>
                            }
                            title={'READINESS SURVEY'}
                            titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                        />
                        <DefaultListGap
                            size={24}
                        />
                    </View>
                    :
                    null
                }
                <ListItem
                    containerStyle={{ borderBottomWidth: 0 }}
                    disabled={disabled}
                    hideChevron={true}
                    leftIcon={
                        isCompleted ?
                            <View style={[{ height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, width: AppFonts.scaleFont(24), }]}>
                                <LottieView
                                    autoPlay={true}
                                    loop={false}
                                    source={require('../../../assets/animation/checkmark-circle.json')}
                                />
                            </View>
                            :
                            <TabIcon
                                color={isCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.black}
                                containerStyle={[{ width: AppFonts.scaleFont(24), height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, }]}
                                icon={isCompleted ? 'check-circle' : disabled ? 'lock' : 'fiber-manual-record'}
                                size={isCompleted ? AppFonts.scaleFont(24) : AppFonts.scaleFont(20)}
                            />
                    }
                    title={'MOBILIZE'}
                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                />
                {
                    /* eslint-disable indent */
                    disabled && !isPrepCalculating ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                                <ActiveRecoveryBlocks />
                            </View>
                        </View>
                    : disabled || isPrepCalculating ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                                <ActiveRecoveryBlocks
                                    isCalculating={isPrepCalculating}
                                />
                                <Spacer size={12}/>
                                <Button
                                    backgroundColor={AppColors.white}
                                    buttonStyle={{width: '100%',}}
                                    containerViewStyle={{flex: 1, marginLeft: 0, marginRight: 10}}
                                    color={AppColors.zeplin.yellow}
                                    fontFamily={AppStyles.robotoBold.fontFamily}
                                    fontWeight={AppStyles.robotoBold.fontWeight}
                                    loading={isPrepCalculating}
                                    loadingRight={true}
                                    outlined
                                    onPress={() => null}
                                    textStyle={{ flex: 8, fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                                    title={'Calculating...'}
                                />
                            </View>
                        </View>
                    : isActive ?
                        exerciseList.totalLength === 0 ?
                            <View style={{ flex: 1, }}>
                                <Spacer size={10} />
                                <View style={[AppStyles.containerCentered, customStyles.alertMessageWrapper, customStyles.shadowEffect,]}>
                                    <TabIcon
                                        color={AppColors.white}
                                        containerStyle={[customStyles.alertMessageIconWrapper, recoveryObj.impact_score < 1.5 ? {backgroundColor: AppColors.zeplin.tealGreen,} : {backgroundColor: AppColors.zeplin.error,}]}
                                        icon={recoveryObj.impact_score < 1.5 ? 'check-circle' : 'alert'}
                                        size={AppFonts.scaleFont(26)}
                                        type={'material-community'}
                                    />
                                    <View style={[customStyles.alertMessageTextWrapper,]}>
                                        <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(13),}]}>{recoveryObj.impact_score < 1.5 ? lowSorenessPreMessage : highSorenessMessage}</Text>
                                    </View>
                                </View>
                            </View>
                        : prepare.isActiveRecoveryCollapsed ?
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                                <View style={{ flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                                    <ActiveRecoveryBlocks
                                        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                                        isSessionsModalOpen={this.state.isPrepareSessionsCompletionModalOpen}
                                        recoveryObj={recoveryObj}
                                        toggleActiveTimeSlideUpPanel={this._togglePrepareSlideUpPanel}
                                        user={user}
                                    />
                                    <Spacer size={12}/>
                                    <Button
                                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                                        buttonStyle={{width: '100%',}}
                                        containerViewStyle={{flex: 1, marginLeft: 0, marginRight: 10}}
                                        color={AppColors.white}
                                        fontFamily={AppStyles.robotoBold.fontFamily}
                                        fontWeight={AppStyles.robotoBold.fontWeight}
                                        leftIcon={{
                                            color: AppColors.primary.yellow.hundredPercent,
                                            name:  'chevron-right',
                                            size:  AppFonts.scaleFont(24),
                                            style: {flex: 1,},
                                        }}
                                        outlined
                                        onPress={() => this.setState({ prepare: Object.assign({}, prepare, { isActiveRecoveryCollapsed: !prepare.isActiveRecoveryCollapsed })}) }
                                        rightIcon={{
                                            color: AppColors.white,
                                            name:  'chevron-right',
                                            size:  AppFonts.scaleFont(24),
                                            style: {flex: 1,},
                                        }}
                                        textStyle={{ flex: 8, fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                                        title={completedExercises.length > 0 ? 'Continue' : 'Start'}
                                    />
                                </View>
                            </View>
                            :
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row',}}>
                                    <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                                    <View style={{flex: 1, paddingLeft: 20, paddingRight: 15}}>
                                        <ActiveRecoveryBlocks
                                            handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                                            isSessionsModalOpen={this.state.isPrepareSessionsCompletionModalOpen}
                                            recoveryObj={recoveryObj}
                                            toggleActiveTimeSlideUpPanel={this._togglePrepareSlideUpPanel}
                                            user={user}
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
                                    isLoading={this.state.loading}
                                    isPrep={true}
                                    toggleCompletedAMPMRecoveryModal={() => this.setState({ isPrepareExerciseCompletionModalOpen: true, })}
                                    toggleSelectedExercise={this._toggleSelectedExercise}
                                />
                            </View>
                    : isCompleted ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{flex: 1, paddingLeft: 30, paddingRight: 15}}>
                                <ActiveRecoveryBlocks
                                    recoveryObj={recoveryObj}
                                />
                            </View>
                        </View>
                    :
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                        <View style={{ flex: 1, marginLeft: 20, marginRight: 15, marginBottom: 30 }}>
                            <Text robotoRegular style={[AppStyles.textCenterAligned, { fontSize: AppFonts.scaleFont(18), }]}>{errorInARAPMessage}</Text>
                        </View>
                    </View>
                }
                { this.state.isReadinessSurveyModalOpen ?
                    <Modal
                        backdropColor={AppColors.zeplin.darkNavy}
                        backdropOpacity={0.8}
                        backdropPressToClose={false}
                        coverScreen={true}
                        isOpen={this.state.isReadinessSurveyModalOpen}
                        keyboardTopOffset={0}
                        ref={ref => {this._readinessSurveyModalRef = ref;}}
                        swipeToClose={false}
                        useNativeDriver={false}
                    >
                        <ReadinessSurvey
                            dailyReadiness={this.state.dailyReadiness}
                            handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                            handleFormChange={this._handleDailyReadinessFormChange}
                            handleFormSubmit={this._handleReadinessSurveySubmit}
                            handleHealthDataFormChange={this._handleHealthDataFormChange}
                            handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                            handleUpdateUserHealthKitFlag={this._handleUpdateUserHealthKitFlag}
                            healthKitWorkouts={this.state.healthData.workouts.length > 0 ? this.state.healthData.workouts : null}
                            soreBodyParts={this.props.plan.soreBodyParts}
                            typicalSessions={this.props.plan.typicalSessions}
                            user={this.props.user}
                        />
                        { this.state.loading ?
                            <ActivityIndicator
                                color={AppColors.primary.yellow.hundredPercent}
                                size={'large'}
                                style={[AppStyles.activityIndicator]}
                            /> : null
                        }
                    </Modal>
                    :
                    null
                }
                {
                    this.state.isSelectedExerciseModalOpen
                        ?
                        <Modal
                            backdropColor={AppColors.zeplin.darkBlue}
                            backdropOpacity={0.9}
                            backdropPressToClose={false}
                            coverScreen={true}
                            isOpen={this.state.isSelectedExerciseModalOpen}
                            keyboardTopOffset={0}
                            onClosed={() => this._toggleSelectedExercise(false, false)}
                            position={'center'}
                            ref={ref => {this._singleExerciseItemRef = ref;}}
                            style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: AppColors.transparent,}]}
                            swipeToClose={false}
                            useNativeDriver={false}
                        >
                            { this.state.selectedExercise.library_id ?
                                <Exercises
                                    closeModal={() => this._singleExerciseItemRef.close()}
                                    completedExercises={completedExercises}
                                    exerciseList={exerciseList}
                                    handleCompleteExercise={(exerciseId, setNumber, hasNextExercise, isUnChecked) => {
                                        this._handleCompleteExercise(exerciseId, setNumber, 'pre');
                                        if(!hasNextExercise && isUnChecked) {
                                            this._singleExerciseItemRef.close();
                                            _.delay(() => {
                                                this.setState({ isPrepareExerciseCompletionModalOpen: true, });
                                            }, 750);
                                        }
                                    }}
                                    handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                                    selectedExercise={this.state.selectedExercise}
                                    user={this.props.user}

                                    updateSelectedExercise={selectedExercise => this.setState({selectedExercise,})}
                                />
                                :
                                null
                            }
                        </Modal>
                        :
                        null
                }
                { this.state.loading ?
                    <ActivityIndicator
                        color={AppColors.primary.yellow.hundredPercent}
                        size={'large'}
                        style={[AppStyles.activityIndicator]}
                    /> : null
                }
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
                                    this.props.patchActiveTime(user.id, selectedActiveTime)
                                        .then(response => {
                                            this.props.clearCompletedExercises();
                                            this.props.clearCompletedFSExercises();
                                        })
                                        .catch(() => {
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
                    sessions={dailyReadiness.sessions}
                />
                <ExerciseCompletionModal
                    completedExercises={completedExercises}
                    exerciseList={exerciseList}
                    isModalOpen={this.state.isPrepareExerciseCompletionModalOpen}
                    onClose={() => this.setState({ isPrepareExerciseCompletionModalOpen: false, })}
                    onComplete={() => {
                        this.setState({ isPrepareExerciseCompletionModalOpen: false, loading: true, });
                        let newCompletedExercises = _.cloneDeep(store.getState().plan.completedExercises);
                        newCompletedExercises = _.map(newCompletedExercises, exId => {
                            let newExerciseId = _.cloneDeep(exId);
                            newExerciseId = newExerciseId.substring(0, newExerciseId.indexOf('-'));
                            return newExerciseId;
                        });
                        newCompletedExercises = _.uniq(newCompletedExercises);
                        this.props.patchActiveRecovery(this.props.user.id, newCompletedExercises, 'pre')
                            .then(res => {
                                let newDailyPlanObj = store.getState().plan.dailyPlan[0];
                                this.setState(
                                    {
                                        loading: false,
                                        prepare: Object.assign({}, this.state.prepare, {
                                            finishedRecovery:          true,
                                            isActiveRecoveryCollapsed: true,
                                        }),
                                    },
                                    () => this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(newDailyPlanObj)),
                                )
                            })
                            .catch(() => {
                                this.setState({ loading: false });
                                AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                            });
                    }}
                    user={user}
                />
            </ScrollView>
        );
    };

    renderRecover = (index) => {
        let { isPageLoading, isRecoverCalculating, recover, } = this.state;
        let completedExercises = store.getState().plan.completedExercises;
        let { plan, user, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let recoveryObj = dailyPlanObj && dailyPlanObj.post_recovery ? dailyPlanObj.post_recovery : false;
        let exerciseList = recoveryObj.display_exercises ? MyPlanConstants.cleanExerciseList(recoveryObj) : {};
        let disabled = recoveryObj && !recoveryObj.display_exercises && !recoveryObj.completed ? true : false;
        let isActive = recoveryObj && recoveryObj.display_exercises && !recoveryObj.completed ? true : false;
        let isCompleted = recoveryObj && !recoveryObj.display_exercises && recoveryObj.completed ? true : false;
        return (
            <ScrollView
                contentContainerStyle={{ backgroundColor: AppColors.white, }}
                refreshControl={
                    <RefreshControl
                        colors={[AppColors.primary.yellow.hundredPercent]}
                        onRefresh={() => this._handleExerciseListRefresh(false)}
                        refreshing={isPageLoading}
                        title={'Loading...'}
                        titleColor={AppColors.primary.yellow.hundredPercent}
                        tintColor={AppColors.primary.yellow.hundredPercent}
                    />
                }
                tabLabel={tabs[index]}
            >
                <Spacer size={30} />
                <ListItem
                    containerStyle={{ borderBottomWidth: 0 }}
                    disabled={disabled}
                    hideChevron={true}
                    leftIcon={
                        isCompleted ?
                            <View style={[{ height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, width: AppFonts.scaleFont(24), }]}>
                                <LottieView
                                    autoPlay={true}
                                    loop={false}
                                    source={require('../../../assets/animation/checkmark-circle.json')}
                                />
                            </View>
                            :
                            <TabIcon
                                color={isCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.black}
                                containerStyle={[{ width: AppFonts.scaleFont(24), height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, }]}
                                icon={isCompleted ? 'check-circle' : disabled ? 'lock' : 'fiber-manual-record'}
                                size={isCompleted ? AppFonts.scaleFont(24) : 20}
                            />
                    }
                    title={'ACTIVE RECOVERY'}
                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                />
                {
                    /* eslint-disable indent */
                    disabled && !isRecoverCalculating ?
                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                                <View style={{ flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                                    <ActiveRecoveryBlocks
                                        after={true}
                                    />
                                </View>
                            </View>
                            <Spacer size={25}/>
                            <View style={[AppStyles.containerCentered, customStyles.alertMessageWrapper, customStyles.shadowEffect,]}>
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
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                                <ActiveRecoveryBlocks
                                    after={true}
                                    isCalculating={isRecoverCalculating}
                                />
                                <Spacer size={12}/>
                                <Button
                                    backgroundColor={AppColors.white}
                                    buttonStyle={{width: '100%',}}
                                    containerViewStyle={{flex: 1, marginLeft: 0, marginRight: 10}}
                                    color={AppColors.zeplin.yellow}
                                    fontFamily={AppStyles.robotoBold.fontFamily}
                                    fontWeight={AppStyles.robotoBold.fontWeight}
                                    loading={isRecoverCalculating}
                                    loadingRight={true}
                                    outlined
                                    onPress={() => null}
                                    textStyle={{ flex: 8, fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                                    title={'Calculating...'}
                                />
                            </View>
                        </View>
                    : isActive ?
                        exerciseList.totalLength === 0 ?
                            <View style={{ flex: 1, }}>
                                <Spacer size={10} />
                                <View style={[AppStyles.containerCentered, customStyles.alertMessageWrapper, customStyles.shadowEffect,]}>
                                    <TabIcon
                                        color={AppColors.white}
                                        containerStyle={[customStyles.alertMessageIconWrapper, recoveryObj.impact_score < 1.5 ? {backgroundColor: AppColors.zeplin.tealGreen,} : {backgroundColor: AppColors.zeplin.error,}]}
                                        icon={recoveryObj.impact_score < 1.5 ? 'check-circle' : 'alert'}
                                        size={AppFonts.scaleFont(26)}
                                        type={'material-community'}
                                    />
                                    <View style={[customStyles.alertMessageTextWrapper,]}>
                                        <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(13),}]}>{recoveryObj.impact_score < 1.5 ? lowSorenessPostMessage : highSorenessMessage}</Text>
                                    </View>
                                </View>
                            </View>
                        : recover.isActiveRecoveryCollapsed ?
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                                <View style={{ flex: 1, marginLeft: 20, marginRight: 15, marginBottom: 30 }}>
                                    <ActiveRecoveryBlocks
                                        after={true}
                                        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                                        recoveryObj={recoveryObj}
                                        toggleActiveTimeSlideUpPanel={this._toggleRecoverSlideUpPanel}
                                        user={user}
                                    />
                                    <Spacer size={12}/>
                                    <Button
                                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                                        color={AppColors.white}
                                        containerViewStyle={{flex: 1, marginLeft: 0, marginRight: 10}}
                                        fontFamily={AppStyles.robotoBold.fontFamily}
                                        fontWeight={AppStyles.robotoBold.fontWeight}
                                        leftIcon={{
                                            color: AppColors.primary.yellow.hundredPercent,
                                            name:  'chevron-right',
                                            size:  AppFonts.scaleFont(24),
                                            style: {flex: 1,},
                                        }}
                                        outlined
                                        onPress={() => this.setState({ recover: Object.assign({}, recover, { isActiveRecoveryCollapsed: !recover.isActiveRecoveryCollapsed }) })}
                                        rightIcon={{
                                            color: AppColors.white,
                                            name:  'chevron-right',
                                            size:  AppFonts.scaleFont(24),
                                            style: {flex: 1,},
                                        }}
                                        textStyle={{ flex: 8, fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                                        title={completedExercises.length > 0 ? 'Continue' : 'Start'}
                                    />
                                </View>
                            </View>
                            :
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row',}}>
                                    <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                                    <View style={{flex: 1, paddingLeft: 20, paddingRight: 15}}>
                                        <ActiveRecoveryBlocks
                                            after={true}
                                            handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                                            recoveryObj={recoveryObj}
                                            toggleActiveTimeSlideUpPanel={this._toggleRecoverSlideUpPanel}
                                            user={user}
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
                                    isLoading={this.state.loading}
                                    toggleCompletedAMPMRecoveryModal={() => this.setState({ isRecoverExerciseCompletionModalOpen: true, })}
                                    toggleSelectedExercise={this._toggleSelectedExercise}
                                />
                            </View>
                    : isCompleted ?
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{ flex: 1, marginLeft: 20, marginRight: 15, marginBottom: 30 }}>
                                <ActiveRecoveryBlocks
                                    after={true}
                                    recoveryObj={recoveryObj}
                                />
                            </View>
                        </View>
                    :
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                        <View style={{ flex: 1, marginLeft: 20, marginRight: 15, marginBottom: 30 }}>
                            <Text robotoRegular style={[AppStyles.textCenterAligned, { fontSize: AppFonts.scaleFont(18), }]}>{errorInARAPMessage}</Text>
                        </View>
                    </View>
                }
                {
                    this.state.isSelectedExerciseModalOpen
                        ?
                        <Modal
                            backdropColor={AppColors.zeplin.darkBlue}
                            backdropOpacity={0.9}
                            backdropPressToClose={false}
                            coverScreen={true}
                            isOpen={this.state.isSelectedExerciseModalOpen}
                            keyboardTopOffset={0}
                            onClosed={() => this._toggleSelectedExercise(false, false)}
                            position={'center'}
                            ref={ref => {this._singleExerciseItemRef = ref;}}
                            style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: AppColors.transparent,}]}
                            swipeToClose={false}
                            useNativeDriver={false}
                        >
                            { this.state.selectedExercise.library_id ?
                                <Exercises
                                    closeModal={() => this._singleExerciseItemRef.close()}
                                    completedExercises={completedExercises}
                                    exerciseList={exerciseList}
                                    handleCompleteExercise={(exerciseId, setNumber, hasNextExercise) => {
                                        this._handleCompleteExercise(exerciseId, setNumber, 'post');
                                        if(!hasNextExercise) {
                                            this._singleExerciseItemRef.close();
                                            _.delay(() => {
                                                this.setState({ isRecoverExerciseCompletionModalOpen: true, });
                                            }, 750);
                                        }
                                    }}
                                    handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                                    selectedExercise={this.state.selectedExercise}
                                    user={this.props.user}
                                />
                                :
                                null
                            }
                        </Modal>
                        :
                        null
                }
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
                                    this.props.patchActiveTime(user.id, selectedActiveTime)
                                        .then(response => {
                                            this.props.clearCompletedExercises();
                                            this.props.clearCompletedFSExercises();
                                        })
                                        .catch(() => {
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
                        this.setState({ isRecoverExerciseCompletionModalOpen: false, loading: true, });
                        let newCompletedExercises = _.cloneDeep(store.getState().plan.completedExercises);
                        newCompletedExercises = _.map(newCompletedExercises, exId => {
                            let newExerciseId = _.cloneDeep(exId);
                            newExerciseId = newExerciseId.substring(0, newExerciseId.indexOf('-'));
                            return newExerciseId;
                        });
                        newCompletedExercises = _.uniq(newCompletedExercises);
                        this.props.patchActiveRecovery(this.props.user.id, newCompletedExercises, 'post')
                            .then(() =>
                                this.setState({
                                    loading: false,
                                    recover: Object.assign({}, this.state.recover, {
                                        finished:                  !!completedExercises.length,
                                        isActiveRecoveryCollapsed: true,
                                    })
                                })
                            )
                            .catch(() => {
                                this.setState({ loading: false });
                                AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                            });
                    }}
                    user={user}
                />
            </ScrollView>
        );
    };

    renderTrain = (index) => {
        let { plan, user, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let isDailyReadinessSurveyCompleted = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ? true : false;
        let trainingSessions = dailyPlanObj ? dailyPlanObj.training_sessions : [];
        let functionalStrengthArray = [];
        let functionalStrength = dailyPlanObj && dailyPlanObj.functional_strength_eligible && dailyPlanObj.functional_strength_session ? dailyPlanObj.functional_strength_session : {};
        if(functionalStrength.completed && functionalStrength.event_date) {
            let newFunctionalStrength = _.cloneDeep(functionalStrength);
            newFunctionalStrength.isFunctionalStrength = true;
            functionalStrengthArray.push(newFunctionalStrength);
        }
        trainingSessions = trainingSessions.concat(functionalStrengthArray);
        trainingSessions = _.orderBy(trainingSessions, o => moment(o.event_date), ['asc']);
        let filteredTrainingSessions = trainingSessions.length > 0 ?
            _.filter(trainingSessions, o => !o.deleted && !o.ignored && (o.sport_name !== null || o.strength_and_conditioning_type !== null))
            :
            [];
        let completedFSExercises = store.getState().plan.completedFSExercises;
        let fsExerciseList = functionalStrength ? MyPlanConstants.cleanFSExerciseList(functionalStrength) : {};
        let offDaySelected = dailyPlanObj && !dailyPlanObj.sessions_planned || filteredTrainingSessions.length > 0;
        let logActivityButtonOutlined = (isDailyReadinessSurveyCompleted && functionalStrength && Object.keys(functionalStrength).length > 0 && !functionalStrength.completed) || (!isDailyReadinessSurveyCompleted) ? true : false;
        let logActivityButtonBackgroundColor = offDaySelected && functionalStrength.completed ?
            AppColors.primary.yellow.hundredPercent
            : logActivityButtonOutlined ?
                AppColors.white
                :
                AppColors.primary.yellow.hundredPercent;
        let logActivityButtonColor = offDaySelected && functionalStrength.completed ?
            AppColors.white
            : logActivityButtonOutlined && !isDailyReadinessSurveyCompleted ?
                AppColors.zeplin.greyText
                : logActivityButtonOutlined && isDailyReadinessSurveyCompleted ?
                    AppColors.primary.yellow.hundredPercent
                    :
                    AppColors.white;
        let isFSCompletedValid = functionalStrength && Object.keys(functionalStrength).length > 0 && completedFSExercises ? MyPlanConstants.isFSCompletedValid(functionalStrength, completedFSExercises) : false;
        let logActivityRightIconColor = isDailyReadinessSurveyCompleted ?
                completedFSExercises.length > 0 ?
                    AppColors.primary.yellow.hundredPercent
                    :
                    AppColors.white
            :
            AppColors.zeplin.greyText;
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: AppColors.white, }} tabLabel={tabs[index]}>
                <Spacer size={30} />
                { (dailyPlanObj && !dailyPlanObj.sessions_planned) && filteredTrainingSessions.length === 0 ?
                    <View>
                        <ListItem
                            containerStyle={{ borderBottomWidth: 0 }}
                            disabled={!isDailyReadinessSurveyCompleted}
                            hideChevron={true}
                            leftIcon={
                                <View style={[{ height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, width: AppFonts.scaleFont(24), }]}>
                                    <LottieView
                                        autoPlay={true}
                                        loop={false}
                                        source={require('../../../assets/animation/checkmark-circle.json')}
                                    />
                                </View>
                            }
                            title={'OFF DAY'}
                            titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                        />
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.primary.grey.thirtyPercent }}/>{/* standard padding of 10 and 5 for half the default size of icons */}
                            <View style={{ flex: 1, margin: 20, }}>
                                <Text robotoRegular style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(16),}]}>{offDayLoggedText}</Text>
                            </View>
                        </View>
                    </View>
                    :
                    null
                }
                { isDailyReadinessSurveyCompleted && functionalStrength && Object.keys(functionalStrength).length > 0 && !functionalStrength.completed ?
                      <View>
                          <ListItem
                              containerStyle={{ borderBottomWidth: 0 }}
                              disabled={false}
                              hideChevron={true}
                              leftIcon={
                                  <TabIcon
                                      color={AppColors.black}
                                      containerStyle={[{ width: AppFonts.scaleFont(24), height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, }]}
                                      icon={'fiber-manual-record'}
                                      size={20}
                                  />
                              }
                              title={'FUNCTIONAL STRENGTH'}
                              titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                          />
                          <View style={{ flex: 1, flexDirection: 'row', }}>
                              <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: this.state.isFunctionalStrengthCollapsed ? AppColors.zeplin.lightGrey : AppColors.white, }}/>
                              <View style={{ flex: 1, marginLeft: 20, marginRight: 15, marginBottom: 30 }}>
                                  <ActiveRecoveryBlocks
                                      isFunctionalStrength={true}
                                      recoveryObj={functionalStrength}
                                  />
                                  <Spacer size={this.state.isFunctionalStrengthCollapsed ? 12 : 20}/>
                                  { this.state.isFunctionalStrengthCollapsed ?
                                      <Button
                                          backgroundColor={AppColors.primary.yellow.hundredPercent}
                                          color={AppColors.white}
                                          containerViewStyle={{flex: 1, marginLeft: 0, marginRight: 10}}
                                          fontFamily={AppStyles.robotoBold.fontFamily}
                                          fontWeight={AppStyles.robotoBold.fontWeight}
                                          leftIcon={{
                                              color: AppColors.primary.yellow.hundredPercent,
                                              name:  'chevron-right',
                                              size:  AppFonts.scaleFont(24),
                                              style: {flex: 1,},
                                          }}
                                          outlined
                                          onPress={() => this.setState({ isFunctionalStrengthCollapsed: false, })}
                                          rightIcon={{
                                              color: AppColors.white,
                                              name:  'chevron-right',
                                              size:  AppFonts.scaleFont(24),
                                              style: {flex: 1,},
                                          }}
                                          textStyle={{ flex: 8, fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                                          title={completedFSExercises.length > 0 ? 'Continue' : 'Start'}
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
                { functionalStrength && Object.keys(functionalStrength).length > 0 && !functionalStrength.completed && !this.state.isFunctionalStrengthCollapsed ?
                    <ExerciseList
                        completedExercises={completedFSExercises}
                        exerciseList={fsExerciseList}
                        handleCompleteExercise={this._handleCompleteFSExercise}
                        isFSCompletedValid={isFSCompletedValid}
                        isFunctionalStrength={true}
                        isLoading={this.state.loading}
                        toggleCompletedAMPMRecoveryModal={() => this.setState({ isFSExerciseCompletionModalOpen: true, })}
                        toggleSelectedExercise={this._toggleSelectedExercise}
                    />
                    :
                    null
                }
                { this.state.isFunctionalStrengthCollapsed ?
                    _.map(filteredTrainingSessions, (postPracticeSurvey, i) => {
                        let cleanedPostSessionName = MyPlanConstants.cleanedPostSessionName(postPracticeSurvey).fullName;
                        return(
                            <View key={`postPracticeSurveys${i}`}>
                                <ListItem
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    disabled={!isDailyReadinessSurveyCompleted}
                                    hideChevron={true}
                                    leftIcon={
                                        <View style={[{ height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, width: AppFonts.scaleFont(24), }]}>
                                            <LottieView
                                                autoPlay={true}
                                                loop={false}
                                                source={require('../../../assets/animation/checkmark-circle.json')}
                                            />
                                        </View>
                                    }
                                    title={cleanedPostSessionName}
                                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
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
                { this.state.isFunctionalStrengthCollapsed ?
                    <View>
                        <Button
                            backgroundColor={logActivityButtonBackgroundColor}
                            buttonStyle={{justifyContent: 'space-between',}}
                            color={logActivityButtonColor}
                            containerViewStyle={{marginLeft: 22, marginRight: 22,}}
                            fontFamily={AppStyles.robotoBold.fontFamily}
                            fontWeight={AppStyles.robotoBold.fontWeight}
                            leftIcon={{
                                color: logActivityButtonColor,
                                name:  isDailyReadinessSurveyCompleted ? 'add' : 'lock',
                                size:  isDailyReadinessSurveyCompleted ? AppFonts.scaleFont(30) : 20,
                            }}
                            onPress={() => isDailyReadinessSurveyCompleted ? this._togglePostSessionSurveyModal() : null}
                            outlined={logActivityButtonOutlined}
                            raised={false}
                            rightIcon={{
                                color: logActivityRightIconColor,
                                name:  'chevron-right',
                                size:  AppFonts.scaleFont(30),
                            }}
                            textStyle={{ flex: 1, fontSize: AppFonts.scaleFont(18), }}
                            title={'Log completed activity'}
                        />
                        <Spacer size={10} />
                        { !offDaySelected ?
                            <Button
                                backgroundColor={AppColors.white}
                                buttonStyle={{justifyContent: 'space-between',}}
                                color={isDailyReadinessSurveyCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.greyText}
                                containerViewStyle={{marginLeft: 22, marginRight: 22,}}
                                fontFamily={AppStyles.robotoBold.fontFamily}
                                fontWeight={AppStyles.robotoBold.fontWeight}
                                leftIcon={{
                                    color: isDailyReadinessSurveyCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.greyText,
                                    name:  isDailyReadinessSurveyCompleted ? 'add' : 'lock',
                                    size:  isDailyReadinessSurveyCompleted ? AppFonts.scaleFont(30) : 20,
                                }}
                                onPress={() => isDailyReadinessSurveyCompleted ? this.props.noSessions(this.props.user.id).catch(() => AppUtil.handleAPIErrorAlert(ErrorMessages.noSessions)) : null}
                                outlined
                                raised={false}
                                rightIcon={{
                                    color: isDailyReadinessSurveyCompleted ? AppColors.white : AppColors.zeplin.greyText,
                                    name:  'chevron-right',
                                    size:  AppFonts.scaleFont(30),
                                }}
                                textStyle={{ flex: 1, fontSize: AppFonts.scaleFont(18), }}
                                title={'Off day'}
                            />
                            :
                            null
                        }
                    </View>
                    :
                    null
                }
                { this.state.isPostSessionSurveyModalOpen ?
                    <Modal
                        backdropColor={AppColors.zeplin.darkNavy}
                        backdropOpacity={0.8}
                        backdropPressToClose={false}
                        coverScreen={true}
                        isOpen={this.state.isPostSessionSurveyModalOpen}
                        keyboardTopOffset={0}
                        ref={ref => {this._postSessionSurveyModalRef = ref;}}
                        swipeToClose={false}
                        useNativeDriver={false}
                    >
                        <PostSessionSurvey
                            handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                            handleFormChange={this._handlePostSessionFormChange}
                            handleFormSubmit={areAllDeleted => this._handlePostSessionSurveySubmit(areAllDeleted)}
                            handleHealthDataFormChange={this._handleHealthDataFormChange}
                            handleTogglePostSessionSurvey={this._togglePostSessionSurveyModal}
                            handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                            healthKitWorkouts={this.state.healthData.workouts && this.state.healthData.workouts.length > 0 ? this.state.healthData.workouts : null}
                            postSession={this.state.postSession}
                            soreBodyParts={this.props.plan.soreBodyParts}
                            typicalSessions={this.props.plan.typicalSessions}
                            user={user}
                        />
                        { this.state.loading ?
                            <ActivityIndicator
                                color={AppColors.primary.yellow.hundredPercent}
                                size={'large'}
                                style={[AppStyles.activityIndicator]}
                            /> : null
                        }
                    </Modal>
                    :
                    null
                }
                { this.state.loading ?
                    <ActivityIndicator
                        color={AppColors.primary.yellow.hundredPercent}
                        size={'large'}
                        style={[AppStyles.activityIndicator]}
                    /> : null
                }
                {
                    this.state.isSelectedExerciseModalOpen
                        ?
                        <Modal
                            backdropColor={AppColors.zeplin.darkNavy}
                            backdropOpacity={0.8}
                            backdropPressToClose={true}
                            coverScreen={true}
                            isOpen={this.state.isSelectedExerciseModalOpen}
                            keyboardTopOffset={0}
                            onClosed={() => this._toggleSelectedExercise(false, false)}
                            position={'center'}
                            ref={ref => {this._singleExerciseItemRef = ref;}}
                            style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: 'rgba(0,0,0,0)',}]}
                            swipeToClose={true}
                            useNativeDriver={false}
                        >
                            { this.state.selectedExercise.library_id ?
                                <SingleExerciseItem
                                    completedExercises={completedFSExercises}
                                    exercise={MyPlanConstants.cleanExercise(this.state.selectedExercise)}
                                    handleCompleteExercise={exerciseId => {
                                        this._handleCompleteFSExercise(exerciseId);
                                        this._singleExerciseItemRef.close();
                                    }}
                                    selectedExercise={this.state.selectedExercise.library_id}
                                />
                                :
                                null
                            }
                        </Modal>
                        :
                        null
                }
                <SessionsCompletionModal
                    isModalOpen={this.state.isTrainSessionsCompletionModalOpen}
                    onClose={this._closeTrainSessionsCompletionModal}
                    sessions={this.state.postSession.sessions && this.state.postSession.sessions.length > 0 ? this.state.postSession.sessions : []}
                />
                <ExerciseCompletionModal
                    completedExercises={completedFSExercises}
                    exerciseList={fsExerciseList}
                    isFS={true}
                    isModalOpen={this.state.isFSExerciseCompletionModalOpen}
                    onClose={() => this.setState({ isFSExerciseCompletionModalOpen: false, })}
                    onComplete={() => {
                        this.setState({ isFSExerciseCompletionModalOpen: false, loading: true, });
                        this.props.patchFunctionalStrength(this.props.user.id, completedFSExercises)
                            .then(() => {
                                this.props.clearCompletedFSExercises();
                                this.setState({
                                    isFunctionalStrengthCollapsed: true,
                                    loading:                       false,
                                });
                            })
                            .catch(() => {
                                this.setState({ loading: false, });
                                AppUtil.handleAPIErrorAlert(ErrorMessages.patchFunctionalStrength);
                            })
                    }}
                    user={user}
                />
            </ScrollView>
        );
    };

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
            !this.state.loading &&
            pageIndex
        ) {
            setTimeout(() => {
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

    render = () => {
        // making sure we can only drag horizontally if our modals are closed and nothing is loading
        let isScrollLocked = !this.state.isReadinessSurveyModalOpen && !this.state.isPostSessionSurveyModalOpen && !this.state.loading ? false : true;
        return (
            <ScrollableTabView
                locked={isScrollLocked}
                onChangeTab={tabLocation => this._onChangeTab(tabLocation)}
                ref={tabView => { this.tabView = tabView; }}
                renderTabBar={() => <ScrollableTabBar locked renderTab={this.renderTab} style={{backgroundColor: AppColors.white, borderBottomWidth: 0,}} />}
                style={{backgroundColor: AppColors.white}}
                tabBarActiveTextColor={AppColors.secondary.blue.hundredPercent}
                tabBarInactiveTextColor={AppColors.primary.grey.hundredPercent}
                tabBarUnderlineStyle={{ height: 0 }}
            >
                {this.renderPrepare(0)}
                {this.renderTrain(1)}
                {this.renderRecover(2)}
            </ScrollableTabView>
        );
    }
}

/* Export Component ==================================================================== */
export default MyPlan;