/*
 * @Author: Vir Desai
 * @Date: 2018-07-27 21:44:36
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-10 04:33:15
 */

/**
 * Home View
 */
import React, { Component } from 'react';
import {
    ActivityIndicator,
    AppState,
    AsyncStorage, // TODO: REMOVE WHEN SENSOR DATA VALIDATED
    BackHandler,
    Easing,
    Image,
    Platform,
    RefreshControl,
    ScrollView,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

// import third-party libraries
import _ from 'lodash';
import PropTypes from 'prop-types';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modalbox';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppSizes, AppStyles, AppFonts, ErrorMessages, MyPlan as MyPlanConstants, } from '../../constants/';
import { store } from '../../store';
import { AppUtil, } from '../../lib';

// Components
import { Alerts, Button, ListItem, Spacer, TabIcon, Text } from '../custom/';
import { Exercises, PostSessionSurvey, ReadinessSurvey, SingleExerciseItem } from '../myPlan/pages';

// Tabs titles
const tabs = ['PREPARE', 'TRAIN', 'RECOVER', 'SENSOR']; // TODO: REMOVE 'SENSOR' WHEN SENSOR DATA VALIDATED
const highSorenessMessage = 'Based on the discomfort reporting we recommend you rest and utilize available self-care techniques to help reduce swelling, ease pain, and speed up healing.\n\nIf you have pain or swelling that gets worse or doesn’t go away, please seek appropriate medical attention.';
const lowSorenessPreMessage = 'Looks like you\'re all clear for practice! Active recovery is low-impact this morning so let\'s pick up with post practice recovery!';
const lowSorenessPostMessage = 'Looks like you\'re all clear! Active recovery is low-impact for now so let\'s pick up tomorrow or after the next practice you log!';

const whenEnabledBackgroundColor = AppColors.white;
const whenEnabledHeaderColor = AppColors.zeplin.lightGrey;
const whenEnabledBorderColor = AppColors.zeplin.lightGrey;
const whenEnabledDescriptionColor = AppColors.zeplin.darkGrey;
const whenDisabledBackgroundColor = AppColors.white;
const whenDisabledHeaderColor = AppColors.zeplin.greyText;
const whenDisabledBorderColor = AppColors.zeplin.greyText;
const whenDisabledDescriptionColor = AppColors.zeplin.greyText;
const disabledBackgroundColor = AppColors.white;
const disabledHeaderColor = AppColors.zeplin.greyText;
const disabledBorderColor = AppColors.zeplin.greyText;
const disabledDescriptionColor = AppColors.zeplin.greyText;
const enabledBackgroundColor = AppColors.zeplin.darkBlue;
const enabledHeaderColor = AppColors.white;
const enabledBorderColor = AppColors.zeplin.darkBlue;
const enabledDescriptionColor = AppColors.primary.yellow.hundredPercent;
const subtextColor = AppColors.white;

/* Component ==================================================================== */
class Home extends Component {
    static componentName = 'HomeView';

    static propTypes = {
        ble:                 PropTypes.object.isRequired,
        getSoreBodyParts:    PropTypes.func.isRequired,
        noSessions:          PropTypes.func.isRequired,
        notification:        PropTypes.bool.isRequired,
        patchActiveRecovery: PropTypes.func.isRequired,
        plan:                PropTypes.object.isRequired,
        postReadinessSurvey: PropTypes.func.isRequired,
        postSessionSurvey:   PropTypes.func.isRequired,
        typicalSession:      PropTypes.func.isRequired,
        user:                PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            completedExercises: [],
            dailyReadiness:     {
                readiness:     0,
                sleep_quality: 0,
                soreness:      [],
            },
            isCompletedAMPMRecoveryModalOpen: true,
            isExerciseListRefreshing:         false,
            isPostSessionSurveyModalOpen:     false,
            isReadinessSurveyModalOpen:       false,
            isSelectedExerciseModalOpen:      false,
            page0:                            {},
            page1:                            {},
            page2:                            {},
            postSession:                      {
                RPE:                            0,
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
                isReadinessSurveyCollapsed: true,
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
            storedSensorData: [],// TODO: REMOVE WHEN SENSOR DATA VALIDATED
        };
        this.renderTab = this.renderTab.bind(this);
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        // when we arrive, load MyPlan
        let userId = this.props.user.id;
        this.props.getMyPlan(userId, moment().format('YYYY-MM-DD'))
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
                        prepare: Object.assign({}, this.state.prepare, {
                            finishedRecovery:           response.daily_plans[0].pre_recovery_completed || this.state.prepare.finishedRecovery,
                            isActiveRecoveryCollapsed:  response.daily_plans[0].pre_recovery_completed || this.state.prepare.isActiveRecoveryCollapsed,
                            isReadinessSurveyCollapsed: true,
                        }),
                        recover: Object.assign({}, this.state.recover, {
                            isActiveRecoveryCollapsed: response.daily_plans[0].post_recovery && !response.daily_plans[0].pre_recovery ? false : true,
                        }),
                        train: Object.assign({}, this.state.train, {
                            completedPostPracticeSurvey: postPracticeSurveys[0].isPostPracticeSurveyCompleted,
                            postPracticeSurveys
                        }),
                    });
                    SplashScreen.hide();
                } else {
                    this.setState({
                        prepare: Object.assign({}, this.state.prepare, {
                            isActiveRecoveryCollapsed:  true,
                            isReadinessSurveyCollapsed: false,
                        })
                    });
                    this.props.getSoreBodyParts()
                        .then(soreBodyParts => {
                            let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
                            newDailyReadiness.soreness = _.cloneDeep(soreBodyParts.body_parts);
                            this.setState({ dailyReadiness: newDailyReadiness });
                            SplashScreen.hide();
                        })
                        .catch(err => {
                            // if there was an error, maybe the survey wasn't created for yesterday so have them do it as a blank
                            let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
                            newDailyReadiness.soreness = [];
                            this.setState({ dailyReadiness: newDailyReadiness });
                            SplashScreen.hide();
                        });
                }
            })
            .catch(error => {
                SplashScreen.hide();
            });
    }

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    componentDidMount = async () => {
        if(!this.props.scheduledMaintenance.addressed) {
            let apiMaintenanceWindow = { end_date: this.props.scheduledMaintenance.end_date, start_date: this.props.scheduledMaintenance.start_date };
            let parseMaintenanceWindow = ErrorMessages.getScheduledMaintenanceMessage(apiMaintenanceWindow);
            AppUtil.handleScheduledMaintenanceAlert(parseMaintenanceWindow.displayAlert, parseMaintenanceWindow.header, parseMaintenanceWindow.message);
        }
        // TODO: REMOVE WHEN SENSOR DATA VALIDATED
        AppUtil._retrieveAsyncStorageData('practices')
            .then(res => {
                this.setState({ storedSensorData: res ? res : [] });
            });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.notification && nextProps.notification !== this.props.notification) {
            this._handleExerciseListRefresh(true);
        }
        const areObjectsDifferent = _.isEqual(nextProps.plan.dailyPlan, this.props.plan.dailyPlan);
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
            let { recover, train } = this.state;
            let { plan } = this.props;
            let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
            let recoveryObj = dailyPlanObj && dailyPlanObj.post_recovery && !dailyPlanObj.post_recovery.completed ? dailyPlanObj.post_recovery : false;
            let disabled = recoveryObj ?
                train.postPracticeSurveys.some(survey => !survey.isPostPracticeSurveyCompleted) || (recover.isActiveRecoveryCollapsed && recover.finished) || recoveryObj.completed
                :
                true;
            this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(nextProps.plan.dailyPlan[0], disabled));
        }
    }

    _handleDailyReadinessFormChange = (name, value, isPain = false, bodyPart, side) => {
        let newFormFields;
        if(name === 'soreness' && bodyPart) {
            let newSorenessFields = _.cloneDeep(this.state.dailyReadiness.soreness);
            if(_.findIndex(this.state.dailyReadiness.soreness, (o) => o.body_part === bodyPart && o.side === side) > -1) {
                // body part already exists
                let sorenessIndex = [_.findIndex(this.state.dailyReadiness.soreness, (o) => o.body_part === bodyPart && o.side === side)];
                newSorenessFields[sorenessIndex].pain = isPain;
                newSorenessFields[sorenessIndex].severity = value;
            } else {
                // doesn't exist, create new object
                let newSorenessPart = {};
                newSorenessPart.body_part = bodyPart;
                newSorenessPart.pain = isPain;
                newSorenessPart.severity = value;
                newSorenessPart.side = side ? side : 0;
                newSorenessFields.push(newSorenessPart);
            }
            newFormFields = _.update( this.state.dailyReadiness, 'soreness', () => newSorenessFields);
        } else {
            newFormFields = _.update( this.state.dailyReadiness, name, () => value);
        }
        this.setState({
            dailyReadiness: newFormFields
        });
    }

    _handlePostSessionFormChange = (name, value, isPain = false, bodyPart, side) => {
        let newFormFields;
        if(name === 'soreness' && bodyPart) {
            let newSorenessFields = _.cloneDeep(this.state.postSession.soreness);
            if(_.findIndex(this.state.postSession.soreness, (o) => o.body_part === bodyPart && o.side === side) > -1) {
                // body part already exists
                let sorenessIndex = [_.findIndex(this.state.postSession.soreness, (o) => o.body_part === bodyPart && o.side === side)];
                newSorenessFields[sorenessIndex].pain = isPain;
                newSorenessFields[sorenessIndex].severity = value;
            } else {
                // doesn't exist, create new object
                let newSorenessPart = {};
                newSorenessPart.body_part = bodyPart;
                newSorenessPart.pain = isPain;
                newSorenessPart.severity = value;
                newSorenessPart.side = side ? side : 0;
                newSorenessFields.push(newSorenessPart);
            }
            newFormFields = _.update( this.state.postSession, 'soreness', () => newSorenessFields);
        } else {
            newFormFields = _.update( this.state.postSession, name, () => value);
        }
        this.setState({
            postSession: newFormFields
        });
    }

    _handleReadinessSurveySubmit = () => {
        this.setState({ loading: true });
        let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
        newDailyReadiness.user_id = this.props.user.id;
        newDailyReadiness.date_time = `${moment().toISOString(true).split('.')[0]}Z`;
        newDailyReadiness.sleep_quality = newDailyReadiness.sleep_quality;
        newDailyReadiness.readiness = newDailyReadiness.readiness;
        newDailyReadiness.soreness.map(bodyPart => {
            newDailyReadiness.soreness = newDailyReadiness.soreness.filter(u => { return !!u.severity && u.severity > 0; });
        });
        this.props.postReadinessSurvey(newDailyReadiness)
            .then(response => {
                let newPrepareObject = Object.assign({}, this.state.prepare, {
                    isReadinessSurveyCompleted: true,
                });
                this.setState({
                    completedExercises: [],
                    dailyReadiness:     {
                        readiness:     0,
                        sleep_quality: 0,
                        soreness:      [],
                    },
                    isReadinessSurveyModalOpen: false,
                    loading:                    false,
                    prepare:                    newPrepareObject,
                });
            })
            .catch(error => {
                console.log('error',error);
                this.setState({
                    loading: false,
                });
            });
    }

    _handlePostSessionSurveySubmit = () => {
        /*
         * update for the componentWillReceiveProps call will only
         * result in a tabPage auto change if a postPracticeSurvey
         * has not already been completed
         */
        this.setState({ loading: true });
        let newPostSessionSurvey = {};
        newPostSessionSurvey.event_date = `${moment().toISOString(true).split('.')[0]}Z`;
        newPostSessionSurvey.RPE = this.state.postSession.RPE;
        newPostSessionSurvey.soreness = this.state.postSession.soreness;
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
        this.props.postSessionSurvey(postSession)
            .then(response => {
                let newTrainObject = Object.assign({}, this.state.train, {
                    completedPostPracticeSurvey: true,
                    postPracticeSurveys:         clonedPostPracticeSurveys,
                });
                let postPracticeSurveysLastIndex = _.findLastIndex(newTrainObject.postPracticeSurveys);
                newTrainObject.postPracticeSurveys[postPracticeSurveysLastIndex].isPostPracticeSurveyCompleted = true;
                newTrainObject.postPracticeSurveys[postPracticeSurveysLastIndex].isPostPracticeSurveyCollapsed = true;
                this.setState({
                    completedExercises:           [],
                    train:                        newTrainObject,
                    isPostSessionSurveyModalOpen: false,
                    loading:                      false,
                    postSession:                  {
                        description:                    '',
                        duration:                       0,
                        event_date:                     null,
                        session_type:                   null,
                        sport_name:                     null,
                        strength_and_conditioning_type: null,
                        RPE:                            0,
                        soreness:                       [],
                    },
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                });
                console.log('error',error);
            });
    }

    _handleAreaOfSorenessClick = (areaClicked, isDailyReadiness, isAllGood) => {
        let stateObject = isDailyReadiness ? this.state.dailyReadiness : this.state.postSession;
        let newSorenessFields = _.cloneDeep(stateObject.soreness);
        if(!areaClicked && isAllGood) {
            let soreBodyParts = _.intersectionBy(stateObject.soreness, this.props.plan.soreBodyParts.body_parts, 'body_part');
            newSorenessFields = soreBodyParts;
        } else {
            if(_.findIndex(stateObject.soreness, o => o.body_part === areaClicked.index) > -1) {
                // body part already exists
                if(areaClicked.bilateral) {
                    // add other side
                    let currentSelectedSide = _.filter(newSorenessFields, o => o.body_part === areaClicked.index);
                    if(currentSelectedSide.length === 1) {
                        currentSelectedSide = currentSelectedSide[0].side;
                        let newMissingSideSorenessPart = {};
                        newMissingSideSorenessPart.body_part = areaClicked.index;
                        newMissingSideSorenessPart.pain = false;
                        newMissingSideSorenessPart.severity = 0;
                        newMissingSideSorenessPart.side = currentSelectedSide === 1 ? 2 : 1;
                        newSorenessFields.push(newMissingSideSorenessPart);
                    } else {
                        newSorenessFields = _.filter(newSorenessFields, o => o.body_part !== areaClicked.index);
                    }
                } else {
                    newSorenessFields = _.filter(newSorenessFields, o => o.body_part !== areaClicked.index);
                }
            } else {
                // doesn't exist, create new object
                if(areaClicked.bilateral) {
                    let newLeftSorenessPart = {};
                    newLeftSorenessPart.body_part = areaClicked.index;
                    newLeftSorenessPart.pain = false;
                    newLeftSorenessPart.severity = 0;
                    newLeftSorenessPart.side = 1;
                    newSorenessFields.push(newLeftSorenessPart);
                    let newRightSorenessPart = {};
                    newRightSorenessPart.body_part = areaClicked.index;
                    newRightSorenessPart.pain = false;
                    newRightSorenessPart.severity = 0;
                    newRightSorenessPart.side = 2;
                    newSorenessFields.push(newRightSorenessPart);
                } else {
                    let newSorenessPart = {};
                    newSorenessPart.body_part = areaClicked.index;
                    newSorenessPart.pain = false;
                    newSorenessPart.severity = 0;
                    newSorenessPart.side = 0;
                    newSorenessFields.push(newSorenessPart);
                }
            }
        }
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

    _toggleCompletedAMPMRecoveryModal = () => {
        this.setState({
            completedExercises:               [],
            isCompletedAMPMRecoveryModalOpen: !this.state.isCompletedAMPMRecoveryModalOpen
        });
    }

    _togglePostSessionSurvey = () => {
        let newPostSession = _.cloneDeep(this.state.postSession);
        newPostSession.description = '';
        newPostSession.duration = 0;
        newPostSession.event_date = null;
        newPostSession.session_type = null;
        newPostSession.sport_name = null;
        newPostSession.strength_and_conditioning_type = null;
        newPostSession.RPE = 0;
        this.setState({
            completedExercises:           [],
            isPostSessionSurveyModalOpen: !this.state.isPostSessionSurveyModalOpen,
            postSession:                  newPostSession,
        });
    }

    _togglePostSessionSurveyModal = () => {
        this.setState({ loading: true });
        if (!this.state.isPostSessionSurveyModalOpen) {
            this.props.typicalSession(this.props.user.id)
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
                });
        } else {
            this.setState({
                isPostSessionSurveyModalOpen: false,
                loading:                      false,
            });
        }
    }

    _handleExerciseListRefresh = (updateNotificationFlag) => {
        this.setState({
            isExerciseListRefreshing: true
        });
        let userId = this.props.user.id;
        this.props.getMyPlan(userId, moment().format('YYYY-MM-DD'), false, updateNotificationFlag)
            .then(response => {
                const dailyPlanObj = response.daily_plans && response.daily_plans[0] ? response.daily_plans[0] : false;
                let newRecover = _.cloneDeep(this.state.recover);
                newRecover.isActiveRecoveryCollapsed = true;
                newRecover.finished = false;
                let newPrepare = _.cloneDeep(this.state.prepare);
                newPrepare.isActiveRecoveryCollapsed = true;
                newPrepare.isReadinessSurveyCollapsed = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ? true : false;
                newPrepare.isReadinessSurveyCompleted = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ? true : false;
                let newTrain = Object.assign({}, this.state.train, {
                    postPracticeSurveys: dailyPlanObj ? dailyPlanObj.training_sessions : [],
                });
                this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(dailyPlanObj));
                this.setState({
                    completedExercises:       [],
                    isExerciseListRefreshing: false,
                    prepare:                  newPrepare,
                    recover:                  newRecover,
                    train:                    newTrain,
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
                    });
            })
            .catch(error => {
                // console.log('error',error);
                this.setState({
                    isExerciseListRefreshing: false,
                });
            });
    }

    _handleCompleteExercise = (exerciseId) => {
        let newCompletedExercises = _.cloneDeep(this.state.completedExercises);
        if(newCompletedExercises && newCompletedExercises.indexOf(exerciseId) > -1) {
            newCompletedExercises.splice(newCompletedExercises.indexOf(exerciseId), 1)
        } else {
            newCompletedExercises.push(exerciseId);
        }
        this.setState({
            completedExercises:          newCompletedExercises,
            isSelectedExerciseModalOpen: false,
        });
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
        let textWrapperStyle = isTabActive ?
            {
                borderBottomWidth: textBorderWidth,
                borderBottomColor: AppColors.primary.yellow.hundredPercent,
                marginLeft:        iconSize + iconLeftPadding,
                paddingHorizontal: AppSizes.paddingXSml,
                textAlign:         'center',
            }
            :
            {};
        let extraIconContainerStyle = isTabActive ?
            {
                marginBottom: iconBottomPadding,
            }
            :
            {};

        return <TouchableWithoutFeedback
            key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View style={[page === 0 ? page0Styles : page === 1 ? page1Styles : page2Styles]}>
                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                    <View
                        style={[textWrapperStyle,]}
                    >
                        <Text
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
                                    color: isTabActive ? AppColors.activeTabText : AppColors.inactiveTabText,
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

    renderActiveRecoveryBlocks = (recoveryObj, whenStyles, styles, after) => {
        if(!recoveryObj && !recoveryObj.minutes_duration && !recoveryObj.impact_score) {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, marginRight: 9, paddingTop: 7, paddingLeft: 10, paddingBottom: 10, backgroundColor: whenStyles.activeRecoveryWhenBackgroundColor, borderColor: whenStyles.activeRecoveryWhenBorderColor, borderWidth: 1, borderRadius: 5 }}>
                        <Text h7 oswaldMedium style={{ color: whenStyles.activeRecoveryWhenHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'WHEN'}</Text>
                        <Text oswaldMedium style={{ color: whenStyles.activeRecoveryWhenDescriptionColor, fontSize: AppFonts.scaleFont(20) }}>{`ANYTIME\n${after ? 'AFTER' : 'BEFORE'}\nTRAINING`}</Text>
                    </View>
                    <View style={{ flex: 1, marginRight: 10, paddingTop: 7, paddingLeft: 10, paddingBottom: 10, backgroundColor: styles.activeRecoveryBackgroundColor, borderColor: styles.activeRecoveryBorderColor, borderWidth: 1, borderRadius: 5 }}>
                        <Text h7 oswaldMedium style={{ color: styles.activeRecoveryHeaderColor, fontWeight: 'bold', paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'TYP. ACTIVE TIME'}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                            <Text h1 oswaldMedium style={{ color: styles.activeRecoveryDescriptionColor, fontSize: AppFonts.scaleFont(32) }}>{'5-15'}</Text>
                            <View style={{alignItems: 'flex-end', flex: 1, height: AppStyles.h1.lineHeight, }}>
                                <Text h7 oswaldMedium style={{ color: styles.activeRecoveryDescriptionColor, fontSize: AppFonts.scaleFont(12), position: 'absolute', bottom: 8, left: 2, }}>{'MINS'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View style={{ flexDirection: 'row', }}>
                <View style={{ flex: 1, marginRight: 9, paddingTop: 7, paddingLeft: 10, paddingBottom: 10, backgroundColor: whenStyles.activeRecoveryWhenBackgroundColor, borderColor: whenStyles.activeRecoveryWhenBorderColor, borderWidth: 1, borderRadius: 5 }}>
                    <Text h7 oswaldMedium style={{ color: whenStyles.activeRecoveryWhenHeaderColor, fontSize: AppFonts.scaleFont(12), paddingBottom: 5 }}>{'WHEN'}</Text>
                    <Text h6 oswaldMedium style={{ color: whenStyles.activeRecoveryWhenDescriptionColor, fontSize: AppFonts.scaleFont(18) }}>{`ANYTIME\n${after ? 'AFTER' : 'BEFORE'}\nTRAINING`}</Text>
                </View>
                <View style={{ flex: 1, marginRight: 9, paddingTop: 7, paddingLeft: 10, paddingBottom: 10, backgroundColor: styles.activeRecoveryActiveTimeBackgroundColor, borderColor: styles.activeRecoveryActiveTimeBorderColor, borderWidth: 1, borderRadius: 5 }}>
                    <Text h7 oswaldMedium style={{ color: styles.activeRecoveryActiveTimeHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'ACTIVE TIME'}</Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, }}>
                        <Text h1 oswaldMedium style={{ color: styles.activeRecoveryActiveTimeDescriptionColor, fontSize: AppFonts.scaleFont(32) }}>{`${recoveryObj && recoveryObj.minutes_duration ? parseFloat(recoveryObj.minutes_duration).toFixed(1) : '0'}`}</Text>
                        <View style={{alignItems: 'flex-end', flex: 1, height: AppStyles.h1.lineHeight, }}>
                            <Text h7 oswaldMedium style={{ color: styles.activeRecoveryActiveTimeSubtextColor, fontSize: AppFonts.scaleFont(12), position: 'absolute', bottom: 8, left: 2, }}>{'MINS'}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, marginRight: 10, paddingTop: 7, paddingLeft: 10, paddingBottom: 10, backgroundColor: styles.activeRecoveryBackgroundColor, borderColor: styles.activeRecoveryBorderColor, borderWidth: 1, borderRadius: 5 }}>
                    <Text h7 oswaldMedium style={{ color: styles.activeRecoveryHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'IMPACT SCORE'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                        <Text h1 oswaldMedium style={{ color: styles.activeRecoveryDescriptionColor, fontSize: AppFonts.scaleFont(32) }}>{`${recoveryObj && recoveryObj.impact_score ? parseFloat(recoveryObj.impact_score).toFixed(1) : '0'}`}</Text>
                        <View style={{alignItems: 'flex-end', flex: 1, height: AppStyles.h1.lineHeight, }}>
                            <Text h7 oswaldMedium style={{ color: styles.subtextColor, fontSize: AppFonts.scaleFont(12), position: 'absolute', bottom: 8, left: 2, }}>{'/ 5'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderPrepare = (index) => {
        let { completedExercises, prepare } = this.state;
        let { plan } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let isDailyReadinessSurveyCompleted = dailyPlanObj && (dailyPlanObj.daily_readiness_survey_completed || prepare.isReadinessSurveyCompleted) ? true : false;
        // assuming AM/PM is switching to something for prepared vs recover
        let recoveryObj = dailyPlanObj && dailyPlanObj.pre_recovery ? dailyPlanObj.pre_recovery : false;
        let exerciseList = recoveryObj.display_exercises ? MyPlanConstants.cleanExerciseList(recoveryObj) : {};
        let disabled = recoveryObj && !recoveryObj.display_exercises && !recoveryObj.completed ? true : false;
        let isActive = recoveryObj && recoveryObj.display_exercises && !recoveryObj.completed ? true : false;
        let isCompleted = recoveryObj && !recoveryObj.display_exercises && recoveryObj.completed  ? true : false;
        let readinessSurveyBackgroundColor = isDailyReadinessSurveyCompleted ? disabledBackgroundColor : enabledBackgroundColor;
        let readinessSurveyDescriptionColor = isDailyReadinessSurveyCompleted ? disabledDescriptionColor : enabledDescriptionColor;
        let readinessSurveyHeaderColor = isDailyReadinessSurveyCompleted ? disabledHeaderColor : enabledHeaderColor;
        let readinessSurveyBorderColor = isDailyReadinessSurveyCompleted ? disabledBorderColor : enabledBorderColor;
        let activeRecoveryBackgroundColor = disabled ? disabledBackgroundColor : isActive ? enabledBackgroundColor : isCompleted ? enabledBackgroundColor : disabledBackgroundColor;
        let activeRecoveryDescriptionColor = disabled ? disabledDescriptionColor : isActive ? enabledDescriptionColor : isCompleted ? enabledDescriptionColor : disabledDescriptionColor;
        let activeRecoveryHeaderColor = disabled ? disabledHeaderColor : isActive ? enabledHeaderColor : isCompleted ? enabledHeaderColor : disabledHeaderColor;
        let activeRecoveryBorderColor = disabled ? disabledBorderColor : isActive ? enabledBorderColor : isCompleted ? enabledBorderColor : disabledBorderColor;
        let activeRecoveryActiveTimeBackgroundColor = disabled ? disabledBackgroundColor : isActive ? enabledBackgroundColor : isCompleted ? whenEnabledBackgroundColor : disabledBackgroundColor;
        let activeRecoveryActiveTimeDescriptionColor = disabled ? disabledDescriptionColor : isActive ? enabledDescriptionColor : isCompleted ? whenEnabledDescriptionColor : disabledDescriptionColor;
        let activeRecoveryActiveTimeHeaderColor = disabled ? disabledHeaderColor : isActive ? enabledHeaderColor : isCompleted ? whenEnabledHeaderColor : disabledHeaderColor;
        let activeRecoveryActiveTimeBorderColor = disabled ? disabledBorderColor : isActive ? enabledBorderColor : isCompleted ? whenEnabledBorderColor : disabledBorderColor;
        let activeRecoveryActiveTimeSubtextColor = disabled ? disabledDescriptionColor : isActive ? subtextColor : isCompleted ? whenEnabledDescriptionColor : disabledDescriptionColor;
        let activeRecoveryWhenBackgroundColor = disabled ? whenDisabledBackgroundColor : isActive ? whenEnabledBackgroundColor : isCompleted ? whenEnabledBackgroundColor : whenDisabledBackgroundColor;
        let activeRecoveryWhenDescriptionColor = disabled ? whenDisabledDescriptionColor : isActive ? whenEnabledDescriptionColor : isCompleted ? whenEnabledDescriptionColor : whenDisabledDescriptionColor;
        let activeRecoveryWhenHeaderColor = disabled ? whenDisabledHeaderColor : isActive ? whenEnabledHeaderColor : isCompleted ? whenEnabledHeaderColor : whenDisabledHeaderColor;
        let activeRecoveryWhenBorderColor = disabled ? whenDisabledBorderColor : isActive ? whenEnabledBorderColor : isCompleted ? whenEnabledBorderColor : whenDisabledBorderColor;
        return (
            <ScrollView
                contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.white}}
                refreshControl={
                    <RefreshControl
                        colors={[AppColors.primary.yellow.hundredPercent]}
                        onRefresh={this._handleExerciseListRefresh}
                        refreshing={this.state.isExerciseListRefreshing}
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
                    hideChevron={true}
                    leftIcon={
                        <TabIcon
                            containerStyle={[{ width: AppFonts.scaleFont(24), height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, marginRight: 10, }]}
                            size={isDailyReadinessSurveyCompleted ? AppFonts.scaleFont(24) : 20}
                            color={isDailyReadinessSurveyCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.black}
                            icon={isDailyReadinessSurveyCompleted ? 'check-circle' : 'fiber-manual-record'}
                        />
                    }
                    title={'READINESS SURVEY'}
                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                />
                {
                    isDailyReadinessSurveyCompleted ?
                        null
                        :
                        prepare.isReadinessSurveyCollapsed ?
                            null
                            :
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.primary.grey.thirtyPercent }}/>{/* standard padding of 10 and 5 for half the default size of icons */}
                                <View style={{ flex: 1, marginLeft: 20, marginRight: 15, marginBottom: 30 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1, marginRight: 9, paddingTop: 7, paddingLeft: 13, paddingBottom: 10, backgroundColor: whenEnabledBackgroundColor, borderColor: whenEnabledBorderColor, borderWidth: 1, borderRadius: 5 }}>
                                            <Text h7 oswaldMedium style={{ color: whenEnabledHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'WHEN'}</Text>
                                            <Text oswaldMedium style={{ color: whenEnabledDescriptionColor, fontSize: AppFonts.scaleFont(20) }}>{'EARLY IN\nTHE DAY'}</Text>
                                        </View>
                                        <View style={{ flex: 1, marginRight: 10, paddingTop: 7, paddingLeft: 13, paddingBottom: 10, backgroundColor: readinessSurveyBackgroundColor, borderColor: readinessSurveyBorderColor, borderWidth: 1, borderRadius: 5 }}>
                                            <Text h7 oswaldMedium style={{ color: readinessSurveyHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'WHY'}</Text>
                                            <Text oswaldMedium style={{ color: readinessSurveyDescriptionColor, fontSize: AppFonts.scaleFont(20) }}>{'PERSONALIZE\nYOUR PLAN'}</Text>
                                        </View>
                                    </View>
                                    <Spacer size={12}/>
                                    <Button
                                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                                        buttonStyle={{width: '100%',}}
                                        containerViewStyle={{flex: 1, marginLeft: 0, marginRight: 10}}
                                        color={AppColors.white}
                                        fontFamily={AppStyles.robotoBold.fontFamily}
                                        fontWeight={AppStyles.robotoBold.fontWeight}
                                        outlined
                                        onPress={() => this.setState({ isReadinessSurveyModalOpen: true })}
                                        textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                                        title={'Start'}
                                    />
                                </View>
                            </View>
                }
                { prepare.isReadinessSurveyCollapsed || isDailyReadinessSurveyCompleted ? this.renderDefaultListGap(23) : null }
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
                    title={'ACTIVE PREP'}
                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                />
                {
                    /* eslint-disable indent */
                    disabled ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                                {
                                    this.renderActiveRecoveryBlocks(
                                        false,
                                        {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                        {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor}
                                    )
                                }
                            </View>
                        </View>
                    : isActive ?
                        exerciseList.totalLength === 0 ?
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <Spacer size={12}/>
                                <View style={{flex: 1}}>
                                    <View style={[AppStyles.paddingHorizontal, AppStyles.paddingVertical]}>
                                        <Text robotoRegular style={[AppStyles.textCenterAligned, { fontSize: recoveryObj.impact_score < 1.5 ? AppFonts.scaleFont(18) : AppFonts.scaleFont(15) }]}>{recoveryObj.impact_score < 1.5 ? lowSorenessPreMessage : highSorenessMessage}</Text>
                                    </View>
                                </View>
                            </View>
                        : prepare.isActiveRecoveryCollapsed ?
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                                <View style={{ flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                                    {
                                        this.renderActiveRecoveryBlocks(
                                            recoveryObj,
                                            {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                            {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor}
                                        )
                                    }
                                    <Spacer size={12}/>
                                    <Button
                                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                                        buttonStyle={{width: '100%',}}
                                        containerViewStyle={{flex: 1, marginLeft: 0, marginRight: 10}}
                                        color={AppColors.white}
                                        fontFamily={AppStyles.robotoBold.fontFamily}
                                        fontWeight={AppStyles.robotoBold.fontWeight}
                                        outlined
                                        onPress={() => this.setState({ prepare: Object.assign({}, prepare, { isActiveRecoveryCollapsed: !prepare.isActiveRecoveryCollapsed })}) }
                                        textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                                        title={'Start'}
                                    />
                                </View>
                            </View>
                            :
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row',}}>
                                    <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                                    <View style={{flex: 1, paddingLeft: 20, paddingRight: 15}}>
                                        {
                                            this.renderActiveRecoveryBlocks(
                                                recoveryObj,
                                                {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                                {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor}
                                            )
                                        }
                                        <Spacer size={20}/>
                                        <Text
                                            onPress={() => this.setState({ prepare: Object.assign({}, prepare, { isActiveRecoveryCollapsed: !prepare.isActiveRecoveryCollapsed }) }) }
                                            robotoBold
                                            style={[AppStyles.textCenterAligned,
                                                {
                                                    color:              AppColors.secondary.blue.eightyPercent,
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
                                    handleCompleteExercise={this._handleCompleteExercise}
                                    handleExerciseListRefresh={this._handleExerciseListRefresh}
                                    isExerciseListRefreshing={this.state.isExerciseListRefreshing}
                                    isLoading={this.state.loading}
                                    isPrep={true}
                                    toggleCompletedAMPMRecoveryModal={() => {
                                        this.setState({ loading: true });
                                        this.props.patchActiveRecovery(this.props.user.id, 'pre')
                                            .then(() =>
                                                this.setState({
                                                    completedExercises: [],
                                                    loading:            false,
                                                    prepare:            Object.assign({}, this.state.prepare, {
                                                        finishedRecovery:          true,
                                                        isActiveRecoveryCollapsed: true,
                                                    }),
                                                })
                                            )
                                            .catch(() => {
                                                this.setState({ loading: false });
                                            })
                                    }}
                                    toggleSelectedExercise={this._toggleSelectedExercise}
                                />
                            </View>
                    : isCompleted ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{flex: 1, paddingLeft: 30, paddingRight: 15}}>
                                {
                                    this.renderActiveRecoveryBlocks(
                                        recoveryObj,
                                        {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                        {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor}
                                    )
                                }
                            </View>
                        </View>
                    :
                    null
                }
                {
                    this.state.isReadinessSurveyModalOpen
                        ?
                        <Modal
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
                                soreBodyParts={this.props.plan.soreBodyParts}
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
                            backdropOpacity={0.75}
                            backdropPressToClose={true}
                            coverScreen={true}
                            isOpen={this.state.isSelectedExerciseModalOpen}
                            onClosed={() => this._toggleSelectedExercise(false, false)}
                            position={'center'}
                            style={[AppStyles.containerCentered, {
                                borderRadius: 4,
                                height:       AppSizes.screen.heightThreeQuarters,
                                padding:      AppSizes.paddingSml,
                                width:        AppSizes.screen.width * 0.9,
                            }]}
                            swipeToClose={true}
                        >
                            { this.state.selectedExercise.library_id ?
                                <SingleExerciseItem
                                    exercise={MyPlanConstants.cleanExercise(this.state.selectedExercise)}
                                    handleCompleteExercise={this._handleCompleteExercise}
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

    renderRecover = (index) => {
        let { completedExercises, recover } = this.state;
        let { plan } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let recoveryObj = dailyPlanObj && dailyPlanObj.post_recovery ? dailyPlanObj.post_recovery : false;
        let exerciseList = recoveryObj.display_exercises ? MyPlanConstants.cleanExerciseList(recoveryObj) : {};
        let disabled = recoveryObj && !recoveryObj.display_exercises && !recoveryObj.completed ? true : false;
        let isActive = recoveryObj && recoveryObj.display_exercises && !recoveryObj.completed ? true : false;
        let isCompleted = recoveryObj && !recoveryObj.display_exercises && recoveryObj.completed ? true : false;
        let activeRecoveryBackgroundColor = disabled ? disabledBackgroundColor : isActive ? enabledBackgroundColor : isCompleted ? enabledBackgroundColor : disabledBackgroundColor;
        let activeRecoveryDescriptionColor = disabled ? disabledDescriptionColor : isActive ? enabledDescriptionColor : isCompleted ? enabledDescriptionColor : disabledDescriptionColor;
        let activeRecoveryHeaderColor = disabled ? disabledHeaderColor : isActive ? enabledHeaderColor : isCompleted ? enabledHeaderColor : disabledHeaderColor;
        let activeRecoveryBorderColor = disabled ? disabledBorderColor : isActive ? enabledBorderColor : isCompleted ? enabledBorderColor : disabledBorderColor;
        let activeRecoveryActiveTimeBackgroundColor = disabled ? disabledBackgroundColor : isActive ? enabledBackgroundColor : isCompleted ? whenEnabledBackgroundColor : disabledBackgroundColor;
        let activeRecoveryActiveTimeDescriptionColor = disabled ? disabledDescriptionColor : isActive ? enabledDescriptionColor : isCompleted ? whenEnabledDescriptionColor : disabledDescriptionColor;
        let activeRecoveryActiveTimeHeaderColor = disabled ? disabledHeaderColor : isActive ? enabledHeaderColor : isCompleted ? whenEnabledHeaderColor : disabledHeaderColor;
        let activeRecoveryActiveTimeBorderColor = disabled ? disabledBorderColor : isActive ? enabledBorderColor : isCompleted ? whenEnabledBorderColor : disabledBorderColor;
        let activeRecoveryActiveTimeSubtextColor = disabled ? disabledDescriptionColor : isActive ? subtextColor : isCompleted ? whenEnabledDescriptionColor : disabledDescriptionColor;
        let activeRecoveryWhenBackgroundColor = disabled ? whenDisabledBackgroundColor : isActive ? whenEnabledBackgroundColor : isCompleted ? whenEnabledBackgroundColor : whenDisabledBackgroundColor;
        let activeRecoveryWhenDescriptionColor = disabled ? whenDisabledDescriptionColor : isActive ? whenEnabledDescriptionColor : isCompleted ? whenEnabledDescriptionColor : whenDisabledDescriptionColor;
        let activeRecoveryWhenHeaderColor = disabled ? whenDisabledHeaderColor : isActive ? whenEnabledHeaderColor : isCompleted ? whenEnabledHeaderColor : whenDisabledHeaderColor;
        let activeRecoveryWhenBorderColor = disabled ? whenDisabledBorderColor : isActive ? whenEnabledBorderColor : isCompleted ? whenEnabledBorderColor : whenDisabledBorderColor;
        return (
            <ScrollView
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center', backgroundColor: AppColors.white }}
                refreshControl={
                    <RefreshControl
                        colors={[AppColors.primary.yellow.hundredPercent]}
                        onRefresh={this._handleExerciseListRefresh}
                        refreshing={this.state.isExerciseListRefreshing}
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
                    disabled ?
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                                {
                                    this.renderActiveRecoveryBlocks(
                                        false,
                                        {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                        {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor},
                                        true
                                    )
                                }
                            </View>
                        </View>
                    : isActive ?
                        exerciseList.totalLength === 0 ?
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <Spacer size={12}/>
                                <View style={{flex: 1}}>
                                    <View style={[AppStyles.paddingHorizontal, AppStyles.paddingVertical]}>
                                        <Text robotoRegular style={[AppStyles.textCenterAligned, { fontSize: recoveryObj.impact_score < 1.5 ? AppFonts.scaleFont(18) : AppFonts.scaleFont(15) }]}>{recoveryObj.impact_score < 1.5 ? lowSorenessPostMessage : highSorenessMessage}</Text>
                                    </View>
                                </View>
                            </View>
                        : recover.isActiveRecoveryCollapsed ?
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                                <View style={{ flex: 1, marginLeft: 20, marginRight: 15, marginBottom: 30 }}>
                                    {
                                        this.renderActiveRecoveryBlocks(
                                            recoveryObj,
                                            {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                            {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor},
                                            true
                                        )
                                    }
                                    <Spacer size={12}/>
                                    <Button
                                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                                        color={AppColors.white}
                                        containerViewStyle={{flex: 1, marginLeft: 0, marginRight: 10}}
                                        fontFamily={AppStyles.robotoBold.fontFamily}
                                        fontWeight={AppStyles.robotoBold.fontWeight}
                                        outlined
                                        onPress={() => this.setState({ recover: Object.assign({}, recover, { isActiveRecoveryCollapsed: !recover.isActiveRecoveryCollapsed }) })}
                                        textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                                        title={'Start'}
                                    />
                                </View>
                            </View>
                            :
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row',}}>
                                    <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                                    <View style={{flex: 1, paddingLeft: 20, paddingRight: 15}}>
                                        {
                                            this.renderActiveRecoveryBlocks(
                                                recoveryObj,
                                                {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                                {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor},
                                                true
                                            )
                                        }
                                        <Spacer size={20}/>
                                        <Text
                                            onPress={() => this.setState({ recover: Object.assign({}, recover, { isActiveRecoveryCollapsed: !recover.isActiveRecoveryCollapsed }) }) }
                                            robotoBold
                                            style={[AppStyles.textCenterAligned,
                                                {
                                                    color:              AppColors.secondary.blue.eightyPercent,
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
                                    handleCompleteExercise={this._handleCompleteExercise}
                                    handleExerciseListRefresh={this._handleExerciseListRefresh}
                                    isExerciseListRefreshing={this.state.isExerciseListRefreshing}
                                    isLoading={this.state.loading}
                                    toggleCompletedAMPMRecoveryModal={() => {
                                        this.setState({ loading: true });
                                        this.props.patchActiveRecovery(this.props.user.id, 'post')
                                            .then(() =>
                                                this.setState({
                                                    completedExercises: [],
                                                    loading:            false,
                                                    recover:            Object.assign({}, this.state.recover, {
                                                        finished:                  !!completedExercises.length,
                                                        isActiveRecoveryCollapsed: true,
                                                    })
                                                })
                                            )
                                            .catch(() => {
                                                this.setState({ loading: false });
                                            })
                                    }}
                                    toggleSelectedExercise={this._toggleSelectedExercise}
                                />
                            </View>
                    : isCompleted ?
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ paddingLeft: 22, borderRightWidth: 1, borderRightColor: AppColors.white }}/>
                            <View style={{ flex: 1, marginLeft: 20, marginRight: 15, marginBottom: 30 }}>
                                {
                                    this.renderActiveRecoveryBlocks(
                                        recoveryObj,
                                        {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                        {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor},
                                        true
                                    )
                                }
                            </View>
                        </View>
                    :
                    null
                }
                {
                    this.state.isSelectedExerciseModalOpen
                        ?
                        <Modal
                            backdropOpacity={0.75}
                            backdropPressToClose={true}
                            coverScreen={true}
                            isOpen={this.state.isSelectedExerciseModalOpen}
                            onClosed={() => this._toggleSelectedExercise(false, false)}
                            position={'center'}
                            style={[AppStyles.containerCentered, {
                                borderRadius: 4,
                                height:       AppSizes.screen.heightThreeQuarters,
                                padding:      AppSizes.paddingSml,
                                width:        AppSizes.screen.width * 0.9,
                            }]}
                            swipeToClose={true}
                        >
                            { this.state.selectedExercise.library_id ?
                                <SingleExerciseItem
                                    exercise={MyPlanConstants.cleanExercise(this.state.selectedExercise)}
                                    handleCompleteExercise={this._handleCompleteExercise}
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
        let { plan } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let isDailyReadinessSurveyCompleted = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ? true : false;
        let trainingSessions = dailyPlanObj ? _.orderBy(dailyPlanObj.training_sessions, o => moment(o.event_date), ['asc']) : [];
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: AppColors.white }} tabLabel={tabs[index]}>
                <Spacer size={30} />
                { !dailyPlanObj.sessions_planned && trainingSessions.length === 0 ?
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
                                <Text robotoRegular style={{fontSize: AppFonts.scaleFont(16),}}>{'Make the most of your training by resting well today: hydrate, eat well, sleep early, and do your recomended active recovery.'}</Text>
                            </View>
                        </View>
                    </View>
                    :
                    null
                }
                {
                    _.map(trainingSessions, (postPracticeSurvey, i) => {
                        let filteredSessionTypes = _.filter(MyPlanConstants.availableSessionTypes, o => o.index === postPracticeSurvey.session_type);
                        let selectedSessionType = filteredSessionTypes.length === 0 ? 'TRAINING' : filteredSessionTypes[0].label.toUpperCase();
                        let filteredStrengthConditioningTypes = _.filter(MyPlanConstants.strengthConditioningTypes, o => o.index === postPracticeSurvey.strength_and_conditioning_type);
                        let filteredSportTypes = _.filter(MyPlanConstants.teamSports, o => o.index === postPracticeSurvey.sport_name);
                        let selectedSport = filteredSportTypes.length > 0 ? filteredSportTypes[0].label.toUpperCase() : filteredStrengthConditioningTypes.length > 0 ? filteredStrengthConditioningTypes[0].label.toUpperCase() : '';
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
                                    title={`${selectedSport} ${selectedSessionType}`}
                                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                                />
                                { this.renderDefaultListGap(24) }
                            </View>
                        );
                    })
                }
                <Spacer size={15} />
                <Button
                    backgroundColor={isDailyReadinessSurveyCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.white}
                    buttonStyle={{justifyContent: 'space-between',}}
                    color={isDailyReadinessSurveyCompleted ? AppColors.white : AppColors.zeplin.greyText}
                    containerViewStyle={{marginLeft: 22, marginRight: 22,}}
                    fontFamily={AppStyles.oswaldMedium.fontFamily}
                    fontWeight={AppStyles.oswaldMedium.fontWeight}
                    leftIcon={{
                        color: isDailyReadinessSurveyCompleted ? AppColors.white : AppColors.zeplin.greyText,
                        name:  isDailyReadinessSurveyCompleted ? 'add' : 'lock',
                        size:  isDailyReadinessSurveyCompleted ? AppFonts.scaleFont(30) : 20,
                    }}
                    onPress={isDailyReadinessSurveyCompleted ? this._togglePostSessionSurveyModal : null}
                    outlined={isDailyReadinessSurveyCompleted ? false : true}
                    raised={false}
                    rightIcon={{
                        color: isDailyReadinessSurveyCompleted ? AppColors.white : AppColors.zeplin.greyText,
                        name:  'chevron-right',
                        size:  AppFonts.scaleFont(30),
                    }}
                    textStyle={{ flex: 1, fontSize: AppFonts.scaleFont(18), }}
                    title={'ADD SESSION'}
                />
                <Spacer size={10} />
                { dailyPlanObj.sessions_planned && trainingSessions.length === 0 ?
                    <Button
                        backgroundColor={AppColors.white}
                        buttonStyle={{justifyContent: 'space-between',}}
                        color={isDailyReadinessSurveyCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.greyText}
                        containerViewStyle={{marginLeft: 22, marginRight: 22,}}
                        fontFamily={AppStyles.oswaldMedium.fontFamily}
                        fontWeight={AppStyles.oswaldMedium.fontWeight}
                        leftIcon={{
                            color: isDailyReadinessSurveyCompleted ? AppColors.white : AppColors.zeplin.greyText,
                            name:  isDailyReadinessSurveyCompleted ? 'add' : 'lock',
                            size:  isDailyReadinessSurveyCompleted ? AppFonts.scaleFont(30) : 20,
                        }}
                        onPress={() => isDailyReadinessSurveyCompleted ? this.props.noSessions(this.props.user.id) : null}
                        outlined
                        raised={false}
                        rightIcon={{
                            color: isDailyReadinessSurveyCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.greyText,
                            name:  'chevron-right',
                            size:  AppFonts.scaleFont(30),
                        }}
                        textStyle={{ flex: 1, fontSize: AppFonts.scaleFont(18), }}
                        title={'NO SESSIONS TODAY'}
                    />
                    :
                    null
                }
                {
                    this.state.isPostSessionSurveyModalOpen
                        ?
                        <Modal
                            backdropPressToClose={false}
                            coverScreen={true}
                            isOpen={this.state.isPostSessionSurveyModalOpen}
                            swipeToClose={false}
                        >
                            <PostSessionSurvey
                                handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
                                handleFormChange={this._handlePostSessionFormChange}
                                handleFormSubmit={this._handlePostSessionSurveySubmit}
                                handleTogglePostSessionSurvey={this._togglePostSessionSurvey}
                                postSession={this.state.postSession}
                                soreBodyParts={this.props.plan.soreBodyParts}
                                typicalSessions={this.props.plan.typicalSessions}
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
            </ScrollView>
        );
    };

    _goToScrollviewPage = (pageIndex) => {
        if(this.tabView) {
            setTimeout(() => {
                this.tabView.goToPage(pageIndex);
            }, 300);
        }
    }

    // _renderCustomTopBar = () => {
    //     return(
    //         <View>
    //             <ScrollableTabBar
    //                 locked
    //                 renderTab={this.renderTab}
    //                 style={{backgroundColor: AppColors.primary.grey.twentyPercent, borderBottomWidth: 0,}}
    //             />
    //             <Alerts
    //                 extraStyles={{paddingLeft: 20}}
    //                 leftAlignText
    //                 status={this.state.displayMessage ? this.state.networkMessage: 'help'}
    //             />
    //         </View>
    //     )
    // }

    // TODO: REMOVE WHEN SENSOR DATA VALIDATED
    renderSensor = (index) => {
        return(
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: AppColors.white, paddingHorizontal: AppSizes.padding }} tabLabel={tabs[index]}>
                <Spacer size={30} />
                <Text>{'SENSOR PAGE'}</Text>
                { this.state.storedSensorData && this.state.storedSensorData.length > 0 ?
                    _.map(this.state.storedSensorData, (result, i) => {
                        return(
                            <View key={i}>
                                <Text>{`Practice #${i}`}</Text>
                                <Text>{`Start Time: ${moment(result.start_time).utc().format('MMMM Do YYYY, h:mm:ss a')}`}</Text>
                                <Text>{`End Time: ${moment(result.end_time).utc().format('MMMM Do YYYY, h:mm:ss a')}`}</Text>
                                <Text>{`Inactive Accel: ${result.inactive_accel} (m/s^2)`}</Text>
                                <Text>{`Low Accel: ${result.low_accel} (m/s^2)`}</Text>
                                <Text>{`Mod Accel: ${result.mod_accel} (m/s^2)`}</Text>
                                <Text>{`High Accel: ${result.high_accel} (m/s^2)`}</Text>
                                <Text>{`Inactive Duration: ${result.inactive_duration} (seconds)`}</Text>
                                <Text>{`Low Duration: ${result.low_duration} (seconds)`}</Text>
                                <Text>{`Mod Duration: ${result.mod_duration} (seconds)`}</Text>
                                <Text>{`High Duration: ${result.high_duration} (seconds)`}</Text>
                                <Spacer size={10} />
                            </View>
                        )
                    })
                    :
                    <Text>{'NO PRACTICES AVAILABLE'}</Text>
                }
            </ScrollView>
        )
    }

    render() {
        // TODO: REMOVE {this.renderSensor(3)} WHEN SENSOR DATA VALIDATED
        return (
            <ScrollableTabView
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
                {this.renderSensor(3)}
            </ScrollableTabView>
        );
    }
}


/* Export Component ==================================================================== */
export default Home;