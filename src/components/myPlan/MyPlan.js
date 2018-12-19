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
import { Exercises, PostSessionSurvey, ReadinessSurvey, SingleExerciseItem } from './pages';

// Tabs titles
const tabs = ['PREPARE', 'TRAIN', 'RECOVER'];

// text constants
const activeRecoveryDisabledText = 'Log an activity on the Train screen to receive an Active Recovery!';
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
    recoverBlocksDisabledWrapper: {
        backgroundColor: AppColors.white,
        borderColor:     AppColors.zeplin.lightGrey,
        borderRadius:    5,
        borderWidth:     1,
        flex:            1,
        marginRight:     9,
        paddingBottom:   10,
        paddingLeft:     10,
        paddingTop:      7,
    },
    recoverBlocksActiveWrapper: {
        backgroundColor: AppColors.zeplin.superLight,
        borderColor:     AppColors.zeplin.superLight,
        borderRadius:    5,
        borderWidth:     1,
        flex:            1,
        marginRight:     9,
        paddingBottom:   10,
        paddingLeft:     10,
        paddingTop:      7,
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 3 },
        shadowRadius:  4,
        shadowOpacity: 1,
    },
});

/* Component ==================================================================== */
class MyPlan extends Component {
    static componentName = 'MyPlanView';

    static propTypes = {
        ble:                           PropTypes.object.isRequired,
        clearCompletedExercises:       PropTypes.func.isRequired,
        clearCompletedFSExercises:     PropTypes.func.isRequired,
        getSoreBodyParts:              PropTypes.func.isRequired,
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
        patchFunctionalStrength: PropTypes.func.isRequired,
        plan:                    PropTypes.object.isRequired,
        postReadinessSurvey:     PropTypes.func.isRequired,
        postSessionSurvey:       PropTypes.func.isRequired,
        preReadiness:            PropTypes.func.isRequired,
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
                readiness:                 0,
                sessions:                  [],
                sessions_planned:          null,
                sleep_quality:             0,
                soreness:                  [],
                wants_functional_strength: null,
                // won't be submitted, help with UI
                already_trained_number:    null,
            },
            isCompletedAMPMRecoveryModalOpen: true,
            isFunctionalStrengthCollapsed:    true,
            isPageLoading:                    false,
            isPostSessionSurveyModalOpen:     false,
            isPrepCalculating:                false,
            isReadinessSurveyModalOpen:       false,
            isRecoverCalculating:             false,
            isSelectedExerciseModalOpen:      false,
            page0:                            {},
            page1:                            {},
            page2:                            {},
            postSession:                      {
                RPE:                            null,
                description:                    '',
                duration:                       0,
                event_date:                     null,
                session_type:                   null,
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
            recover: {
                finished:                  false,
                isActiveRecoveryCollapsed: true,
            },
            selectedExercise: {},
            train:            {
                completedPostPracticeSurvey: false,
                postPracticeSurveys:         [],
            },
            loading: false,
        };
        this._postSessionSurveyModalRef = {};
        this._singleExerciseItemRef = {};
        this.renderTab = this.renderTab.bind(this);
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        this._handleEnteringApp(true);
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
                            newDailyReadiness.soreness = _.cloneDeep(soreBodyParts.body_parts);
                            this.setState({ dailyReadiness: newDailyReadiness });
                            this._toggleReadinessSurvey();
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
        } else if(nextAppState === 'active' && !this.props.lastOpened.date || clearMyPlan) {
            if(this.tabView) {
                this.tabView.goToPage(0);
            }
            this._handleEnteringApp(false);
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

    _handleDailyReadinessFormChange = (name, value, isPain = false, bodyPart, side) => {
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, this.state.dailyReadiness);
        this.setState({
            dailyReadiness: newFormFields
        });
    }

    _handlePostSessionFormChange = (name, value, isPain = false, bodyPart, side) => {
        const newFormFields = PlanLogic.handleDailyReadinessAndPostSessionFormChange(name, value, isPain, bodyPart, side, this.state.postSession);
        this.setState({
            postSession: newFormFields
        });
    }

    _handleReadinessSurveySubmit = () => {
        let newDailyReadiness = {};
        newDailyReadiness.user_id = this.props.user.id;
        newDailyReadiness.date_time = `${moment().toISOString(true).split('.')[0]}Z`;
        newDailyReadiness.sleep_quality = this.state.dailyReadiness.sleep_quality;
        newDailyReadiness.readiness = this.state.dailyReadiness.readiness;
        newDailyReadiness.soreness = this.state.dailyReadiness.soreness.filter(u => u.severity && u.severity > 0);
        newDailyReadiness.wants_functional_strength = this.state.dailyReadiness.wants_functional_strength;
        newDailyReadiness.sessions = this.state.dailyReadiness.sessions;
        newDailyReadiness.sessions_planned = this.state.dailyReadiness.sessions_planned;
        if(this.state.dailyReadiness.current_sport_name === 0 || this.state.dailyReadiness.current_sport_name > 0) {
            newDailyReadiness.current_sport_name = this.state.dailyReadiness.current_sport_name;
        }
        if(this.state.dailyReadiness.current_position === 0 || this.state.dailyReadiness.current_position > 0) {
            newDailyReadiness.current_position = this.state.dailyReadiness.current_position;
        }
        let newPrepareObject = Object.assign({}, this.state.prepare, {
            isReadinessSurveyCompleted: true,
        });
        this.setState(
            {
                dailyReadiness: {
                    readiness:     0,
                    sleep_quality: 0,
                    soreness:      [],
                },
                isPrepCalculating:          this.state.dailyReadiness.sessions_planned ? true : false,
                isReadinessSurveyModalOpen: false,
                isRecoverCalculating:       this.state.dailyReadiness.sessions_planned ? false : true,
                prepare:                    newPrepareObject,
            },
            () => { if(!newDailyReadiness.sessions_planned) { this._goToScrollviewPage(2); } },
        );
        this.props.postReadinessSurvey(newDailyReadiness)
            .then(response => {
                this.props.clearCompletedExercises();
                this.props.clearCompletedFSExercises();
            })
            .catch(error => {
                console.log('error',error);
                AppUtil.handleAPIErrorAlert(ErrorMessages.postReadinessSurvey);
            });
    }

    _handlePostSessionSurveySubmit = () => {
        /*
         * update for the componentWillReceiveProps call will only
         * result in a tabPage auto change if a postPracticeSurvey
         * has not already been completed
         */
        let newPostSessionSurvey = {};
        newPostSessionSurvey.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
        newPostSessionSurvey.RPE = this.state.postSession.RPE;
        newPostSessionSurvey.soreness = this.state.postSession.soreness.filter(u => u.severity && u.severity > 0);
        let postSession = {
            event_date:          this.state.postSession.event_date,
            session_type:        this.state.postSession.session_type,
            duration:            this.state.postSession.duration,
            description:         this.state.postSession.description,
            post_session_survey: newPostSessionSurvey,
            user_id:             this.props.user.id,
        };
        if(this.state.postSession.session_type === 0 || this.state.postSession.session_type === 2 || this.state.postSession.session_type === 3 || this.state.postSession.session_type === 6) {
            postSession.sport_name = this.state.postSession.sport_name;
        } else if(this.state.postSession.session_type === 1) {
            postSession.strength_and_conditioning_type = this.state.postSession.strength_and_conditioning_type;
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
        this.setState(
            {
                train:                        newTrainObject,
                isPostSessionSurveyModalOpen: false,
                isRecoverCalculating:         true,
                postSession:                  {
                    description:                    '',
                    duration:                       0,
                    event_date:                     null,
                    session_type:                   null,
                    sport_name:                     null,
                    strength_and_conditioning_type: null,
                    RPE:                            null,
                    soreness:                       [],
                },
            },
            () => this._goToScrollviewPage(2),
        );
        this.props.postSessionSurvey(postSession)
            .then(response => {
                this.props.clearCompletedExercises();
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

    _handleUpdateFirstTimeExperience = (value) => {
        // setup variables
        let newUserPayloadObj = {};
        newUserPayloadObj.first_time_experience = [value];
        let newUserObj = _.cloneDeep(this.props.user);
        newUserObj.first_time_experience = [value];
        // update reducer as API might take too long to return a value
        store.dispatch({
            type: DispatchActions.USER_REPLACE,
            data: newUserObj
        });
        // update user object
        this.props.updateUser(newUserPayloadObj, this.props.user.id);
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
            this.props.preReadiness(this.props.user.id)
                .then(() => this.props.getSoreBodyParts())
                .then(soreBodyParts => {
                    let newDailyReadiness = _.cloneDeep(this.state.postSession);
                    newDailyReadiness.soreness = _.cloneDeep(soreBodyParts.body_parts);
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
                    AppUtil.handleAPIErrorAlert(ErrorMessages.preReadiness);
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
            this._postSessionSurveyModalRef.close();
            _.delay(() => {
                this.setState({
                    isPostSessionSurveyModalOpen: false,
                    loading:                      false,
                    postSession:                  newPostSession,
                });
            }, 500);
        }
    }

    _toggleReadinessSurvey = () => {
        this.setState({ isPageLoading: true, });
        this.props.setAppLogs();
        this.props.preReadiness(this.props.user.id)
            .then(() => this.setState({ isReadinessSurveyModalOpen: true, isPageLoading: false, }))
            .catch(() => {
                this.setState({ isPageLoading: false, });
                AppUtil.handleAPIErrorAlert(ErrorMessages.preReadiness);
            });
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
                this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(dailyPlanObj));
                if(shouldClearCompletedExercises) {
                    this.props.clearCompletedExercises();
                }
                this.setState({
                    isPageLoading:        false,
                    isPrepCalculating:    false,
                    isRecoverCalculating: false,
                    prepare:              newPrepare,
                    recover:              newRecover,
                    train:                newTrain,
                });
                // pull areas of soreness
                this.props.getSoreBodyParts()
                    .then(soreBodyParts => {
                        let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
                        newDailyReadiness.soreness = _.cloneDeep(soreBodyParts.body_parts);
                        this.setState({ dailyReadiness: newDailyReadiness });
                    })
                    .catch(err => {
                        // if there was an error, maybe the survey wasn't created for yesterday so have them do it as a blank
                        let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
                        newDailyReadiness.soreness = [];
                        this.setState({ dailyReadiness: newDailyReadiness });
                        AppUtil.handleAPIErrorAlert(ErrorMessages.getSoreBodyParts);
                    });
            })
            .catch(error => {
                this.setState({ isPageLoading: false, });
            });
    }

    _handleCompleteExercise = (exerciseId, recovery_type) => {
        // add or remove exercise
        let newCompletedExercises = _.cloneDeep(store.getState().plan.completedExercises);
        if(newCompletedExercises && newCompletedExercises.indexOf(exerciseId) > -1) {
            newCompletedExercises.splice(newCompletedExercises.indexOf(exerciseId), 1)
        } else {
            newCompletedExercises.push(exerciseId);
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

    _handleCompleteFSExercise = (exerciseId) => {
        // add or remove exercise
        let newCompletedExercises = _.cloneDeep(store.getState().plan.completedFSExercises);
        if(newCompletedExercises && newCompletedExercises.indexOf(exerciseId) > -1) {
            newCompletedExercises.splice(newCompletedExercises.indexOf(exerciseId), 1)
        } else {
            newCompletedExercises.push(exerciseId);
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

    _handleFunctionalStrengthFormSubmit = () => {
        let functionalStrength = this.props.plan.dailyPlan[0].functional_strength_session;
        let completedFSExercises = store.getState().plan.completedFSExercises;
        let isFSCompletedValid = MyPlanConstants.isFSCompletedValid(functionalStrength, completedFSExercises);
        if(isFSCompletedValid) {
            this.setState({ loading: true });
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
        } else {
            Alert.alert(
                'Are You Done?',
                'Please complete all exercises in Warm-up, Dynamic Movements and Stability to finish Functional Strength.',
                [
                    {
                        text: 'Finish Now',
                    },
                    {
                        text:    'Finish Later',
                        onPress: () => this.setState({ isFunctionalStrengthCollapsed: true, }),
                    },
                ],
                { cancelable: true }
            );
        }
    }

    _toggleSelectedExercise = (exerciseObj, isModalOpen) => {
        this.setState({
            isSelectedExerciseModalOpen: isModalOpen,
            selectedExercise:            exerciseObj ? exerciseObj : {},
        });
    }

    renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle) {
        let dailyPlanObj = this.props.plan ? this.props.plan.dailyPlan[0] : false;
        isTabActive = isTabActive;
        const textStyle = AppStyles.tabHeaders;
        const fontSize = isTabActive ? AppFonts.scaleFont(20) : AppFonts.scaleFont(16);
        let { page0, page1, page2 } = this.state;
        let flag = dailyPlanObj && page === dailyPlanObj.nav_bar_indicator ? true : false;
        let currentPage = this.tabView ? this.tabView.state.currentPage : 0;
        let page0Width = currentPage === 0 ? AppSizes.screen.widthThreeQuarters : currentPage === 1 ? AppSizes.screen.widthQuarter : 0;
        let page1Width = currentPage === 0 || currentPage === 2 ? AppSizes.screen.widthQuarter : AppSizes.screen.widthHalf;
        let page2Width = currentPage === 2 ? AppSizes.screen.widthThreeQuarters : currentPage === 1 ? AppSizes.screen.widthQuarter : 0;
        let page0ExtraStyles = currentPage === 0 ? {paddingLeft: AppSizes.screen.widthQuarter} : {};
        let page1ExtraStyles = {};
        let page2ExtraStyles = currentPage === 2 ? {paddingRight: AppSizes.screen.widthQuarter} : {};
        let page0Styles = [AppStyles.leftTabBar, page0ExtraStyles, {width: page0Width,}];
        let page1Styles = [AppStyles.centerTabBar, page1ExtraStyles, {width: page1Width,}];
        let page2Styles = [AppStyles.rightTabBar, page2ExtraStyles, {width: page2Width,}];
        let textBorderWidth = 4;
        let iconSize = 10;
        let iconLeftPadding = 2;
        let iconBottomPadding = textBorderWidth;
        let extraIconContainerStyle = isTabActive ?
            {
                marginBottom: iconBottomPadding,
            }
            :
            {};
        // making sure we can only drag horizontally if our modals are closed and nothing is loading
        let isScrollLocked = !this.state.isReadinessSurveyModalOpen && !this.state.isPostSessionSurveyModalOpen && !this.state.loading ? false : true;
        return <TouchableWithoutFeedback
            key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => isScrollLocked ? null : onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View style={[page === 0 ? page0Styles : page === 1 ? page1Styles : page2Styles]}>
                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                    <View>
                        <Text
                            oswaldMedium
                            onLayout={event =>
                                this.setState({
                                    page0: page === 0 ? event.nativeEvent.layout : page0,
                                    page1: page === 1 ? event.nativeEvent.layout : page1,
                                    page2: page === 2 ? event.nativeEvent.layout : page2,
                                })
                            }
                            style={[
                                textStyle,
                                {
                                    color: isTabActive ? AppColors.zeplin.darkNavy : AppColors.zeplin.lightSlate,
                                    fontSize,
                                }
                            ]}
                        >
                            {name}
                        </Text>
                    </View>
                    {
                        flag ?
                            <TabIcon
                                containerStyle={[AppStyles.indicatorContainerStyles, extraIconContainerStyle, {paddingLeft: iconLeftPadding,}]}
                                size={iconSize}
                                selected
                                color={AppColors.primary.yellow.hundredPercent}
                                icon={'fiber-manual-record'}
                            />
                            :
                            null
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>;
    }

    renderDefaultListGap = (size = 10) => {
        return(
            <View style={{ flexDirection: 'row' }}>
                <View style={{ borderRightWidth: 1, borderRightColor: AppColors.primary.grey.thirtyPercent, marginLeft: 10, width: AppFonts.scaleFont(24) / 2}} />
                <Spacer size={size}/>
            </View>
        )
    }

    renderActiveRecoveryBlocks = (recoveryObj, after, isCalculating) => {
        let isDisabled = !recoveryObj && !recoveryObj.minutes_duration && !recoveryObj.impact_score;
        return(
            <View style={{ flexDirection: 'row', }}>
                <View style={isDisabled ? [customStyles.recoverBlocksDisabledWrapper] : [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                    <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), paddingBottom: 5,}}>{'WHEN'}</Text>
                    <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>{`ANYTIME\n${after ? 'AFTER' : 'BEFORE'}\nTRAINING`}</Text>
                </View>
                <View style={isDisabled ? [customStyles.recoverBlocksDisabledWrapper] : [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                    <Text oswaldMedium style={{ color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, paddingBottom: 5, fontSize: AppFonts.scaleFont(14),}}>{'ACTIVE TIME'}</Text>
                    <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                        <View style={{backgroundColor: isDisabled ? AppColors.zeplin.light : AppColors.transparent, borderRadius: 3,}}>
                            <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(28),}}>
                                {isDisabled ? '00' : `${recoveryObj && recoveryObj.minutes_duration ? parseFloat(recoveryObj.minutes_duration).toFixed(1) : '0'}`}
                            </Text>
                        </View>
                        <View style={{alignItems: 'flex-start', flex: 1, paddingBottom: isDisabled ? 0 : AppSizes.paddingXSml, paddingLeft: AppSizes.paddingSml,}}>
                            <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(12),}}>{'MINS'}</Text>
                        </View>
                    </View>
                </View>
                <View style={isDisabled ? [customStyles.recoverBlocksDisabledWrapper, {marginRight: 10,}] : [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, {marginRight: 10,}, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                    <Text oswaldMedium style={{ color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, paddingBottom: 5, fontSize: AppFonts.scaleFont(14),}}>{'IMPACT SCORE'}</Text>
                    <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                        <View style={{backgroundColor: isDisabled ? AppColors.zeplin.light : AppColors.transparent, borderRadius: 3,}}>
                            <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(28),}}>
                                {isDisabled ? '00' : `${recoveryObj && recoveryObj.impact_score ? parseFloat(recoveryObj.impact_score).toFixed(1) : '0'}`}
                            </Text>
                        </View>
                        <View style={{alignItems: 'flex-start', flex: 1, paddingBottom: isDisabled ? 0 : AppSizes.paddingXSml, paddingLeft: AppSizes.paddingSml,}}>
                            <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(12),}}>{'/ 5'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderPrepare = (index) => {
        let { isPageLoading, isPrepCalculating, prepare, } = this.state;
        let completedExercises = store.getState().plan.completedExercises;
        let { plan, } = this.props;
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
                                <TabIcon
                                    containerStyle={[{ width: AppFonts.scaleFont(24), height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, }]}
                                    size={AppFonts.scaleFont(24)}
                                    color={AppColors.zeplin.yellow}
                                    icon={'check-circle'}
                                />
                            }
                            title={'READINESS SURVEY'}
                            titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                        />
                        {this.renderDefaultListGap(24)}
                    </View>
                    :
                    null
                }
                <ListItem
                    containerStyle={{ borderBottomWidth: 0 }}
                    disabled={disabled}
                    hideChevron={true}
                    leftIcon={
                        <TabIcon
                            containerStyle={[{ width: AppFonts.scaleFont(24), height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, }]}
                            size={isCompleted ? AppFonts.scaleFont(24) : 20}
                            color={isCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.black}
                            icon={isCompleted ? 'check-circle' : disabled ? 'lock' : 'fiber-manual-record'}
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
                                {this.renderActiveRecoveryBlocks(false)}
                            </View>
                        </View>
                    : disabled && isPrepCalculating ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                                {this.renderActiveRecoveryBlocks(false, false, isPrepCalculating)}
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
                                    {this.renderActiveRecoveryBlocks(recoveryObj)}
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
                                        {this.renderActiveRecoveryBlocks(recoveryObj)}
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
                                <Exercises
                                    completedExercises={completedExercises}
                                    exerciseList={exerciseList}
                                    handleCompleteExercise={exerciseId => this._handleCompleteExercise(exerciseId, 'pre')}
                                    isLoading={this.state.loading}
                                    isPrep={true}
                                    toggleCompletedAMPMRecoveryModal={() => {
                                        this.setState({ loading: true });
                                        this.props.patchActiveRecovery(this.props.user.id, store.getState().plan.completedExercises, 'pre')
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
                                    toggleSelectedExercise={this._toggleSelectedExercise}
                                />
                            </View>
                    : isCompleted ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{flex: 1, paddingLeft: 30, paddingRight: 15}}>
                                {this.renderActiveRecoveryBlocks(recoveryObj)}
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
                    this.state.isReadinessSurveyModalOpen
                        ?
                        <Modal
                            backdropColor={AppColors.zeplin.darkNavy}
                            backdropOpacity={0.8}
                            backdropPressToClose={false}
                            coverScreen={true}
                            isOpen={this.state.isReadinessSurveyModalOpen}
                            swipeToClose={false}
                        >
                            <ReadinessSurvey
                                dailyReadiness={this.state.dailyReadiness}
                                handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                                handleFormChange={this._handleDailyReadinessFormChange}
                                handleFormSubmit={this._handleReadinessSurveySubmit}
                                handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
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
                            backdropColor={AppColors.zeplin.darkNavy}
                            backdropOpacity={0.8}
                            backdropPressToClose={true}
                            coverScreen={true}
                            isOpen={this.state.isSelectedExerciseModalOpen}
                            onClosed={() => this._toggleSelectedExercise(false, false)}
                            position={'center'}
                            ref={ref => {this._singleExerciseItemRef = ref;}}
                            style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: 'rgba(0,0,0,0)',}]}
                            swipeToClose={true}
                        >
                            { this.state.selectedExercise.library_id ?
                                <SingleExerciseItem
                                    completedExercises={completedExercises}
                                    exercise={MyPlanConstants.cleanExercise(this.state.selectedExercise)}
                                    handleCompleteExercise={exerciseId => {
                                        this._handleCompleteExercise(exerciseId, 'pre');
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
                { this.state.loading ?
                    <ActivityIndicator
                        color={AppColors.primary.yellow.hundredPercent}
                        size={'large'}
                        style={[AppStyles.activityIndicator]}
                    /> : null
                }
            </ScrollView>
        );
    };

    renderRecover = (index) => {
        let { isPageLoading, isRecoverCalculating, recover, } = this.state;
        let completedExercises = store.getState().plan.completedExercises;
        let { plan, } = this.props;
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
                        <TabIcon
                            containerStyle={[{ width: AppFonts.scaleFont(24), height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, }]}
                            size={isCompleted ? AppFonts.scaleFont(24) : 20}
                            color={isCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.black}
                            icon={isCompleted ? 'check-circle' : disabled ? 'lock' : 'fiber-manual-record'}
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
                                    {this.renderActiveRecoveryBlocks(false, true)}
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
                                {this.renderActiveRecoveryBlocks(false, true, isRecoverCalculating)}
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
                                    {this.renderActiveRecoveryBlocks(recoveryObj, true)}
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
                                        {this.renderActiveRecoveryBlocks(recoveryObj, true)}
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
                                <Exercises
                                    completedExercises={completedExercises}
                                    exerciseList={exerciseList}
                                    handleCompleteExercise={exerciseId => this._handleCompleteExercise(exerciseId, 'post')}
                                    isLoading={this.state.loading}
                                    toggleCompletedAMPMRecoveryModal={() => {
                                        this.setState({ loading: true });
                                        this.props.patchActiveRecovery(this.props.user.id, store.getState().plan.completedExercises, 'post')
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
                                    toggleSelectedExercise={this._toggleSelectedExercise}
                                />
                            </View>
                    : isCompleted ?
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{ flex: 1, marginLeft: 20, marginRight: 15, marginBottom: 30 }}>
                                {this.renderActiveRecoveryBlocks(recoveryObj, true)}
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
                            backdropColor={AppColors.zeplin.darkNavy}
                            backdropOpacity={0.8}
                            backdropPressToClose={true}
                            coverScreen={true}
                            isOpen={this.state.isSelectedExerciseModalOpen}
                            onClosed={() => this._toggleSelectedExercise(false, false)}
                            position={'center'}
                            ref={ref => {this._singleExerciseItemRef = ref;}}
                            style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: 'rgba(0,0,0,0)',}]}
                            swipeToClose={true}
                        >
                            { this.state.selectedExercise.library_id ?
                                <SingleExerciseItem
                                    completedExercises={completedExercises}
                                    exercise={MyPlanConstants.cleanExercise(this.state.selectedExercise)}
                                    handleCompleteExercise={exerciseId => {
                                        this._handleCompleteExercise(exerciseId, 'post');
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
            _.filter(trainingSessions, o => o.sport_name !== null || o.strength_and_conditioning_type !== null)
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
                                <TabIcon
                                    containerStyle={[{ width: AppFonts.scaleFont(24), height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, }]}
                                    size={AppFonts.scaleFont(24)}
                                    color={AppColors.primary.yellow.hundredPercent}
                                    icon={'check-circle'}
                                />
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
                                      containerStyle={[{ width: AppFonts.scaleFont(24), height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, }]}
                                      size={20}
                                      color={AppColors.black}
                                      icon={'fiber-manual-record'}
                                  />
                              }
                              title={'FUNCTIONAL STRENGTH'}
                              titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                          />
                          <View style={{ flex: 1, flexDirection: 'row', }}>
                              <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: this.state.isFunctionalStrengthCollapsed ? AppColors.zeplin.lightGrey : AppColors.white, }}/>
                              <View style={{ flex: 1, marginLeft: 20, marginRight: 15, marginBottom: 30 }}>
                                  <View style={{ flexDirection: 'row' }}>
                                      <View style={{ flex: 1, marginRight: 9, paddingTop: 7, paddingLeft: 13, paddingBottom: 10, backgroundColor: AppColors.white, borderColor: AppColors.zeplin.lightGrey, borderWidth: 1, borderRadius: 5 }}>
                                          <Text h7 oswaldMedium style={{ color: AppColors.zeplin.lightGrey, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'WHEN'}</Text>
                                          <Text oswaldMedium style={{ color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(20) }}>{'ANYTIME DURING THE DAY'}</Text>
                                      </View>
                                      <View style={{ flex: 1, marginRight: 10, paddingTop: 7, paddingLeft: 13, paddingBottom: 10, backgroundColor: AppColors.white, borderColor: AppColors.zeplin.lightGrey, borderWidth: 1, borderRadius: 5 }}>
                                          <Text h7 oswaldMedium style={{ color: AppColors.zeplin.lightGrey, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'ACTIVE TIME'}</Text>
                                          <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, }}>
                                              <Text h1 oswaldMedium style={{ color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32) }}>{`${parseFloat(functionalStrength.minutes_duration).toFixed(1)}`}</Text>
                                              <View style={{alignItems: 'flex-end', flex: 1, height: AppStyles.h1.lineHeight, }}>
                                                  <Text h7 oswaldMedium style={{ color: AppColors.zeplin.greyText, fontSize: AppFonts.scaleFont(12), position: 'absolute', bottom: 8, left: 2, }}>{'MINS'}</Text>
                                              </View>
                                          </View>
                                      </View>
                                  </View>
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
                    <Exercises
                        completedExercises={completedFSExercises}
                        exerciseList={fsExerciseList}
                        handleCompleteExercise={this._handleCompleteFSExercise}
                        isFSCompletedValid={isFSCompletedValid}
                        isFunctionalStrength={true}
                        isLoading={this.state.loading}
                        toggleCompletedAMPMRecoveryModal={() => this._handleFunctionalStrengthFormSubmit()}
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
                                        <TabIcon
                                            containerStyle={[{ width: AppFonts.scaleFont(24), height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, }]}
                                            size={AppFonts.scaleFont(24)}
                                            color={AppColors.primary.yellow.hundredPercent}
                                            icon={'check-circle'}
                                        />
                                    }
                                    title={cleanedPostSessionName}
                                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                                />
                                { this.renderDefaultListGap(24) }
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
                            fontFamily={AppStyles.oswaldMedium.fontFamily}
                            fontWeight={AppStyles.oswaldMedium.fontWeight}
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
                            title={'LOG COMPLETED ACTIVITY'}
                        />
                        <Spacer size={10} />
                        { !offDaySelected ?
                            <Button
                                backgroundColor={AppColors.white}
                                buttonStyle={{justifyContent: 'space-between',}}
                                color={isDailyReadinessSurveyCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.greyText}
                                containerViewStyle={{marginLeft: 22, marginRight: 22,}}
                                fontFamily={AppStyles.oswaldMedium.fontFamily}
                                fontWeight={AppStyles.oswaldMedium.fontWeight}
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
                                title={'OFF DAY'}
                            />
                            :
                            null
                        }
                    </View>
                    :
                    null
                }
                {
                    this.state.isPostSessionSurveyModalOpen
                        ?
                        <Modal
                            backdropColor={AppColors.zeplin.darkNavy}
                            backdropOpacity={0.8}
                            backdropPressToClose={false}
                            coverScreen={true}
                            isOpen={this.state.isPostSessionSurveyModalOpen}
                            ref={ref => {this._postSessionSurveyModalRef = ref;}}
                            swipeToClose={false}
                        >
                            <PostSessionSurvey
                                handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                                handleFormChange={this._handlePostSessionFormChange}
                                handleFormSubmit={this._handlePostSessionSurveySubmit}
                                handleTogglePostSessionSurvey={this._togglePostSessionSurveyModal}
                                handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
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
                            onClosed={() => this._toggleSelectedExercise(false, false)}
                            position={'center'}
                            ref={ref => {this._singleExerciseItemRef = ref;}}
                            style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: 'rgba(0,0,0,0)',}]}
                            swipeToClose={true}
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
                renderTabBar={() => <ScrollableTabBar locked renderTab={this.renderTab} style={{backgroundColor: AppColors.primary.grey.twentyPercent, borderBottomWidth: 0,}} />}
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