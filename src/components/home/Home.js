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
import { ActivityIndicator, BackHandler, Platform, RefreshControl, ScrollView, TouchableWithoutFeedback, View } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import PropTypes from 'prop-types';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modalbox';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, MyPlan as MyPlanConstants, AppFonts } from '../../constants/';

// Components
import { Button, ListItem, Spacer, TabIcon, Text } from '../custom/';
import { Exercises, PostSessionSurvey, ReadinessSurvey, SingleExerciseItem } from '../myPlan/pages';

// Tabs titles
const tabs = ['PREPARE', 'TRAIN', 'RECOVER'];
const recoveryMessage = 'Great work! Keep taking care of your body. Target 2-4 Active Recovery sessions after each hard training session.';

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
        appLoaded:           PropTypes.func.isRequired,
        getSoreBodyParts:    PropTypes.func.isRequired,
        lastOpened:          PropTypes.string,
        notification:        PropTypes.bool.isRequired,
        patchActiveRecovery: PropTypes.func.isRequired,
        plan:                PropTypes.object.isRequired,
        postReadinessSurvey: PropTypes.func.isRequired,
        postSessionSurvey:   PropTypes.func.isRequired,
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
                RPE:      0,
                soreness: []
            },
            prepare: {
                finishedRecovery:           props.plan && props.plan.dailyPlan[0] && props.plan.dailyPlan[0].pre_recovery_completed ? true : false,
                flag:                       (new Date()).toLocaleDateString() !== props.lastOpened,
                isActiveRecoveryCollapsed:  true,
                isReadinessSurveyCollapsed: true,
                isReadinessSurveyCompleted: false,
            },
            recover: {
                finished:                  false,
                flag:                      false,
                isActiveRecoveryCollapsed: true,
            },
            selectedExercise: {},
            train:            {
                completedPostPracticeSurvey: false,
                flag:                        false,
                postPracticeSurveys:         [
                    {
                        isPostPracticeSurveyCollapsed: false,
                        isPostPracticeSurveyCompleted: false,
                    }
                ],
            },
            update: false,
        };
        this.renderTab = this.renderTab.bind(this);
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        // when we arrive, load MyPlan
        let userId = this.props.user.id;
        this.props.appLoaded()
            .then(() => this.props.getMyPlan(userId, moment().format('YYYY-MM-DD')))
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
                    postPracticeSurveys.push({isPostPracticeSurveyCollapsed: false, isPostPracticeSurveyCompleted: false,})
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.notification && nextProps.notification !== this.props.notification) {
            this._handleExerciseListRefresh(true);
        }
        const areObjectsDifferent = _.isEqual(nextProps.plan.dailyPlan, this.props.plan.dailyPlan);
        if(
            !areObjectsDifferent &&
            this.props.plan.dailyPlan[0] &&
            nextProps.plan.dailyPlan[0].landing_screen !== this.props.plan.dailyPlan[0].landing_screen &&
            (
                this.state.update ||
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
            this.setState({
                update: false,
            })
        }
    }

    _handleDailyReadinessFormChange = (name, value, bodyPart, side) => {
        let newFormFields;
        if(name === 'soreness' && bodyPart) {
            let newSorenessFields = _.cloneDeep(this.state.dailyReadiness.soreness);
            if(_.findIndex(this.state.dailyReadiness.soreness, (o) => o.body_part === bodyPart && o.side === side) > -1) {
                // body part already exists
                let sorenessIndex = [_.findIndex(this.state.dailyReadiness.soreness, (o) => o.body_part === bodyPart && o.side === side)];
                newSorenessFields[sorenessIndex].severity = value;
            } else {
                // doesn't exist, create new object
                let newSorenessPart = {};
                newSorenessPart.body_part = bodyPart;
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

    _handlePostSessionFormChange = (name, value, bodyPart, side) => {
        let newFormFields;
        if(name === 'soreness' && bodyPart) {
            let newSorenessFields = _.cloneDeep(this.state.postSession.soreness);
            if(_.findIndex(this.state.postSession.soreness, (o) => o.body_part === bodyPart && o.side === side) > -1) {
                // body part already exists
                let sorenessIndex = [_.findIndex(this.state.postSession.soreness, (o) => o.body_part === bodyPart && o.side === side)];
                newSorenessFields[sorenessIndex].severity = value;
            } else {
                // doesn't exist, create new object
                let newSorenessPart = {};
                newSorenessPart.body_part = bodyPart;
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
        newDailyReadiness.sleep_quality = newDailyReadiness.sleep_quality + 1;
        newDailyReadiness.readiness = newDailyReadiness.readiness + 1;
        newDailyReadiness.soreness.map(bodyPart => {
            newDailyReadiness.soreness = newDailyReadiness.soreness.filter(u => { return !!u.severity && u.severity > 0; });
        });
        this.props.postReadinessSurvey(newDailyReadiness)
            .then(response => {
                let newPrepareObject = Object.assign({}, this.state.prepare, {
                    isReadinessSurveyCompleted: true,
                });
                this.setState({
                    completedExercises:         [],
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
        this.setState({ loading: true, update: !this.state.train.completedPostPracticeSurvey, });
        let newPostSessionSurvey = _.cloneDeep(this.state.postSession);
        newPostSessionSurvey.RPE = newPostSessionSurvey.RPE + 1;
        newPostSessionSurvey.soreness.map(bodyPart => {
            newPostSessionSurvey.soreness = _.filter(newPostSessionSurvey.soreness, u => { return !!u.severity && u.severity > 0; });
        });
        let session_type = _.find(MyPlanConstants.sessionTypes, (sessionType, index) => this.props.plan.dailyPlan[0][index] && this.props.plan.dailyPlan[0][index].length);
        let postSession = {
            event_date:   `${moment().toISOString(true).split('.')[0]}Z`,
            session_id:   session_type ? this.props.plan.dailyPlan[0][session_type].session_id : '',
            session_type: session_type ? MyPlanConstants.sessionTypes[session_type] : 0,
            survey:       newPostSessionSurvey,
            user_id:      this.props.user.id,
        };
        let clonedPostPracticeSurveys = _.cloneDeep(this.state.train.postPracticeSurveys);
        let newSurvey = {};
        newSurvey.isPostPracticeSurveyCollapsed = false;
        newSurvey.isPostPracticeSurveyCompleted = false;
        clonedPostPracticeSurveys.push(newSurvey);
        this.props.postSessionSurvey(postSession)
            .then(response => {
                let newTrainObject = Object.assign({}, this.state.train, {
                    completedPostPracticeSurvey: true,
                    postPracticeSurveys:         clonedPostPracticeSurveys,
                });
                let postPracticeSurveysLastIndex = _.findLastIndex(newTrainObject.postPracticeSurveys);
                newTrainObject.postPracticeSurveys[postPracticeSurveysLastIndex - 1].isPostPracticeSurveyCompleted = true;
                newTrainObject.postPracticeSurveys[postPracticeSurveysLastIndex - 1].isPostPracticeSurveyCollapsed = true;
                this.setState({
                    completedExercises:           [],
                    train:                        newTrainObject,
                    isPostSessionSurveyModalOpen: false,
                    loading:                      false,
                    postSession:                  {
                        RPE:      0,
                        soreness: []
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

    _handleAreaOfSorenessClick = (areaClicked, isDailyReadiness) => {
        let stateObject = isDailyReadiness ? this.state.dailyReadiness : this.state.postSession;
        let newSorenessFields = _.cloneDeep(stateObject.soreness);
        if(_.findIndex(stateObject.soreness, o => o.body_part === areaClicked.index) > -1) {
            // body part already exists
            if(areaClicked.bilateral) {
                // add other side
                let currentSelectedSide = _.filter(newSorenessFields, o => o.body_part === areaClicked.index);
                if(currentSelectedSide.length === 1) {
                    currentSelectedSide = currentSelectedSide[0].side;
                    let newMissingSideSorenessPart = {};
                    newMissingSideSorenessPart.body_part = areaClicked.index;
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
                newLeftSorenessPart.severity = 0;
                newLeftSorenessPart.side = 1;
                newSorenessFields.push(newLeftSorenessPart);
                let newRightSorenessPart = {};
                newRightSorenessPart.body_part = areaClicked.index;
                newRightSorenessPart.severity = 0;
                newRightSorenessPart.side = 2;
                newSorenessFields.push(newRightSorenessPart);
            } else {
                let newSorenessPart = {};
                newSorenessPart.body_part = areaClicked.index;
                newSorenessPart.severity = 0;
                newSorenessPart.side = 0;
                newSorenessFields.push(newSorenessPart);
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
        this.setState({
            completedExercises:           [],
            isPostSessionSurveyModalOpen: !this.state.isPostSessionSurveyModalOpen
        });
    }

    _togglePostSessionSurveyModal = () => {
        this.setState({ loading: true });
        if (!this.state.isPostSessionSurveyModalOpen) {
            this.props.getSoreBodyParts()
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
                this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(dailyPlanObj));
                this.setState({
                    completedExercises:       [],
                    isExerciseListRefreshing: false,
                    prepare:                  newPrepare,
                    recover:                  newRecover,
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

    isPrepareFlaged = (dailyPlanObj, isDailyReadinessSurveyCompleted, recoveryObj) => {
        if (isDailyReadinessSurveyCompleted && recoveryObj && !this.state.prepare.finishedRecovery) {
            return true;
        }
        return this.state.prepare.flag;
    }

    isTrainFlaged = (dailyPlanObj, isDailyReadinessSurveyCompleted, recoveryObj) => {
        if (isDailyReadinessSurveyCompleted) {
            if (!recoveryObj || this.state.prepare.finishedRecovery) {
                return true
            }
        }
        return this.state.train.flag;
    }

    isRecoverFlaged = (dailyPlanObj, isDailyReadinessSurveyCompleted, prepareRecoveryObj, recoverRecoveryObj) => {
        if (this.state.train.completedPostPracticeSurvey && this.state.train.postPracticeSurveys.length === 1 && recoverRecoveryObj) {
            return true;
        }
        if (isDailyReadinessSurveyCompleted && this.state.train.completedPostPracticeSurvey && prepareRecoveryObj && recoverRecoveryObj) {
            return true;
        }
        return this.state.recover.flag;
    }

    renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle) {
        let dailyPlanObj = this.props.plan ? this.props.plan.dailyPlan[0] : false;
        isTabActive = isTabActive;
        const textStyle = AppStyles.tabHeaders;
        const fontSize = isTabActive ? AppFonts.scaleFont(20) : AppFonts.scaleFont(16);
        let { page0, page1, page2 } = this.state;
        let yPosition = page === 0 ? page0.y : page === 1 ? page1.y : page2.y;
        let xPosition = page === 0 ? page0.x + page0.width : page === 1 ? page1.x + page1.width : page2.x + page2.width;

        let flag = dailyPlanObj && page === dailyPlanObj.nav_bar_indicator ? true : false;

        let currentPage = this.tabView ? this.tabView.state.currentPage : 0;
        let page0Width = AppSizes.screen.widthThreeQuarters;
        let page1Width = currentPage === 0 || currentPage === 2 ? AppSizes.screen.widthQuarter : AppSizes.screen.widthHalf;
        let page2Width = AppSizes.screen.widthThreeQuarters;
        let page0Styles = [AppStyles.leftTabBar, {width: page0Width}];
        let page1Styles = [AppStyles.centerTabBar, {width: page1Width}];
        let page2Styles = [AppStyles.rightTabBar, {width: page2Width}];

        return <TouchableWithoutFeedback
            key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View>
                <View style={[page === 0 ? page0Styles : page === 1 ? page1Styles : page2Styles]}>
                    <Text
                        onLayout={event =>
                            this.setState({
                                page0: page === 0 ? event.nativeEvent.layout : page0,
                                page1: page === 1 ? event.nativeEvent.layout : page1,
                                page2: page === 2 ? event.nativeEvent.layout : page2,
                            })
                        }
                        style={[textStyle, {color: isTabActive ? AppColors.activeTabText : AppColors.inactiveTabText, fontSize }]}
                    >
                        {name}
                    </Text>
                    {
                        flag
                            ?
                            <TabIcon
                                containerStyle={[{ position: 'absolute', top: yPosition, left: xPosition }]}
                                size={10}
                                selected
                                color={AppColors.primary.yellow.hundredPercent}
                                icon={'fiber-manual-record'}
                            />
                            :
                            null
                    }
                </View>
                {
                    isTabActive ? <View style={{ backgroundColor: AppColors.primary.yellow.hundredPercent, width: AppSizes.screen.widthQuarter, height: 4, bottom: 0, left: AppSizes.screen.width * (page === 0 ? 0.375 : page === 1 ? 0.1275 : 0.1275), position: 'absolute' }} /> : null
                }
            </View>
        </TouchableWithoutFeedback>;
    }

    renderDefaultListGap = (size = 10) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ paddingLeft: 18, borderRightWidth: 1, borderRightColor: AppColors.primary.grey.thirtyPercent }}/>{/* standard padding of 10 and 5 for half the default size of icons */}
                <Spacer size={size}/>
            </View>
        );
    }

    renderActiveRecoveryBlocks = (recoveryObj, whenStyles, styles, after) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginRight: 5, padding: 8, backgroundColor: whenStyles. activeRecoveryWhenBackgroundColor, borderColor: whenStyles. activeRecoveryWhenBorderColor, borderWidth: 1, borderRadius: 5 }}>
                    <Text h7 oswaldMedium style={{ color: whenStyles. activeRecoveryWhenHeaderColor, fontSize: AppFonts.scaleFont(12), paddingBottom: 5 }}>{'WHEN'}</Text>
                    <Text h6 oswaldMedium style={{ color: whenStyles. activeRecoveryWhenDescriptionColor, fontSize: AppFonts.scaleFont(14) }}>{'ANYTIME'}</Text>
                    <Text h6 oswaldMedium style={{ color: whenStyles. activeRecoveryWhenDescriptionColor, fontSize: AppFonts.scaleFont(14) }}>{after ? 'AFTER' : 'BEFORE'}</Text>
                    <Text h6 oswaldMedium style={{ color: whenStyles. activeRecoveryWhenDescriptionColor, fontSize: AppFonts.scaleFont(14) }}>{'TRAINING'}</Text>
                </View>
                <View style={{ flex: 1, marginRight: 5, padding: 8, backgroundColor: styles.activeRecoveryActiveTimeBackgroundColor, borderColor: styles.activeRecoveryActiveTimeBorderColor, borderWidth: 1, borderRadius: 5 }}>
                    <Text h7 oswaldMedium style={{ color: styles.activeRecoveryActiveTimeHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'ACTIVE TIME'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', }}>
                        <Text h1 oswaldMedium style={{ color: styles.activeRecoveryActiveTimeDescriptionColor, fontSize: AppFonts.scaleFont(28) }}>{`${recoveryObj && recoveryObj.minutes_duration ? parseFloat(recoveryObj.minutes_duration).toFixed(1) : '#'} `}</Text>
                        <Text h7 oswaldMedium style={{ color: styles.activeRecoveryActiveTimeSubtextColor, lineHeight: AppStyles.h1.lineHeight - 3*AppStyles.h1.marginBottom, fontSize: AppFonts.scaleFont(12) }}>{'MIN'}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, marginRight: 10, padding: 8, backgroundColor: styles.activeRecoveryBackgroundColor, borderColor: styles.activeRecoveryBorderColor, borderWidth: 1, borderRadius: 5 }}>
                    <Text h7 oswaldMedium style={{ color: styles.activeRecoveryHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'IMPACT SCORE'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', }}>
                        <Text h1 oswaldMedium style={{ color: styles.activeRecoveryDescriptionColor, fontSize: AppFonts.scaleFont(28) }}>{`${recoveryObj && recoveryObj.impact_score ? parseFloat(recoveryObj.impact_score).toFixed(1) : '#'} `}</Text>
                        <Text h7 oswaldMedium style={{ color: styles.subtextColor, lineHeight: AppStyles.h1.lineHeight - 3*AppStyles.h1.marginBottom, fontSize: AppFonts.scaleFont(12) }}>{'/5'}</Text>
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
        let recoveryObj = isDailyReadinessSurveyCompleted && dailyPlanObj && dailyPlanObj.pre_recovery ? dailyPlanObj.pre_recovery : false;
        let loadingText = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ?
            'Creating/updating your plan...'
            :
            'Loading...';
        let exerciseList = recoveryObj.display_exercises ? MyPlanConstants.cleanExerciseList(recoveryObj) : {};

        let isPreRecoveryCompleted = dailyPlanObj && dailyPlanObj.pre_recovery_completed ? true : false;
        let disabled = dailyPlanObj && dailyPlanObj.pre_recovery ?
            isPreRecoveryCompleted || (!isDailyReadinessSurveyCompleted || (prepare.isActiveRecoveryCollapsed === true && prepare.finishedRecovery)) || dailyPlanObj.pre_recovery_completed
            :
            true;

        let readinessSurveyBackgroundColor = isDailyReadinessSurveyCompleted ? disabledBackgroundColor : enabledBackgroundColor;
        let readinessSurveyDescriptionColor = isDailyReadinessSurveyCompleted ? disabledDescriptionColor : enabledDescriptionColor;
        let readinessSurveyHeaderColor = isDailyReadinessSurveyCompleted ? disabledHeaderColor : enabledHeaderColor;
        let readinessSurveyBorderColor = isDailyReadinessSurveyCompleted ? disabledBorderColor : enabledBorderColor;
        let activeRecoveryBackgroundColor = disabled && !recoveryObj ? disabledBackgroundColor : disabled && recoveryObj && !recoveryObj.display_exercises ? enabledBackgroundColor : !disabled && recoveryObj && recoveryObj.display_exercises ? enabledBackgroundColor : disabledBackgroundColor;
        let activeRecoveryDescriptionColor = disabled && !recoveryObj ? disabledDescriptionColor : disabled && recoveryObj && !recoveryObj.display_exercises ? enabledDescriptionColor : !disabled && recoveryObj && recoveryObj.display_exercises ? enabledDescriptionColor : disabledDescriptionColor;
        let activeRecoveryHeaderColor = disabled && !recoveryObj ? disabledHeaderColor : disabled && recoveryObj && !recoveryObj.display_exercises ? enabledHeaderColor : !disabled && recoveryObj && recoveryObj.display_exercises ? enabledHeaderColor : disabledHeaderColor;
        let activeRecoveryBorderColor = disabled && !recoveryObj ? disabledBorderColor : disabled && recoveryObj && !recoveryObj.display_exercises ? enabledBorderColor : !disabled && recoveryObj && recoveryObj.display_exercises ? enabledBorderColor : disabledBorderColor;
        let activeRecoveryActiveTimeBackgroundColor = disabled && !recoveryObj ? AppColors.white : disabled && recoveryObj && !recoveryObj.display_exercises ? AppColors.white : !disabled && recoveryObj && recoveryObj.display_exercises ? activeRecoveryBackgroundColor : AppColors.white;
        let activeRecoveryActiveTimeDescriptionColor = disabled && !recoveryObj ? AppColors.zeplin.darkBlue : disabled && recoveryObj && !recoveryObj.display_exercises ? AppColors.zeplin.darkBlue : !disabled && recoveryObj && recoveryObj.display_exercises ? activeRecoveryDescriptionColor : AppColors.zeplin.darkBlue;
        let activeRecoveryActiveTimeHeaderColor = disabled && !recoveryObj ? AppColors.zeplin.lightGrey : disabled && recoveryObj && !recoveryObj.display_exercises ? AppColors.zeplin.lightGrey : !disabled && recoveryObj && recoveryObj.display_exercises ? activeRecoveryHeaderColor : AppColors.zeplin.lightGrey;
        let activeRecoveryActiveTimeBorderColor = disabled && !recoveryObj ? AppColors.zeplin.lightGrey : disabled && recoveryObj && !recoveryObj.display_exercises ? AppColors.zeplin.lightGrey : !disabled && recoveryObj && recoveryObj.display_exercises ? activeRecoveryBorderColor : AppColors.zeplin.lightGrey;
        let activeRecoveryActiveTimeSubtextColor = disabled && !recoveryObj ? AppColors.zeplin.darkBlue : disabled && recoveryObj && !recoveryObj.display_exercises ? AppColors.zeplin.darkBlue : !disabled && recoveryObj && recoveryObj.display_exercises ? subtextColor : AppColors.zeplin.darkBlue;
        let activeRecoveryWhenBackgroundColor = disabled && !recoveryObj ? whenDisabledBackgroundColor : disabled && recoveryObj && !recoveryObj.display_exercises ? whenEnabledBackgroundColor : !disabled && recoveryObj && recoveryObj.display_exercises ? whenEnabledBackgroundColor : whenDisabledBackgroundColor;
        let activeRecoveryWhenDescriptionColor = disabled && !recoveryObj ? whenDisabledDescriptionColor : disabled && recoveryObj && !recoveryObj.display_exercises ? whenEnabledDescriptionColor : !disabled && recoveryObj && recoveryObj.display_exercises ? whenEnabledDescriptionColor : whenDisabledDescriptionColor;
        let activeRecoveryWhenHeaderColor = disabled && !recoveryObj ? whenDisabledHeaderColor : disabled && recoveryObj && !recoveryObj.display_exercises ? whenEnabledHeaderColor : !disabled && recoveryObj && recoveryObj.display_exercises ? whenEnabledHeaderColor : whenDisabledHeaderColor;
        let activeRecoveryWhenBorderColor = disabled && !recoveryObj ? whenDisabledBorderColor : disabled && recoveryObj && !recoveryObj.display_exercises ? whenEnabledBorderColor : !disabled && recoveryObj && recoveryObj.display_exercises ? whenEnabledBorderColor : whenDisabledBorderColor;

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
                <Spacer />
                <ListItem
                    containerStyle={{ borderBottomWidth: 0 }}
                    hideChevron={true}
                    leftIcon={{ name: isDailyReadinessSurveyCompleted ? 'check-circle' : 'fiber-manual-record', size: 20, color: isDailyReadinessSurveyCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.black }}
                    title={'READINESS SURVEY'}
                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                />
                {
                    prepare.isReadinessSurveyCollapsed || isDailyReadinessSurveyCompleted
                        ?
                        null
                        :
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ paddingLeft: 15, borderRightWidth: 1, borderRightColor: AppColors.primary.grey.thirtyPercent }}/>{/* standard padding of 10 and 5 for half the default size of icons */}
                            <View style={{ flex: 1, paddingLeft: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, marginRight: 5, padding: 8, backgroundColor: whenEnabledBackgroundColor, borderColor: whenEnabledBorderColor, borderWidth: 1, borderRadius: 5 }}>
                                        <Text h7 oswaldMedium style={{ color: whenEnabledHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'WHEN'}</Text>
                                        <Text oswaldMedium style={{ color: whenEnabledDescriptionColor, fontSize: AppFonts.scaleFont(20) }}>{'EARLY IN'}</Text>
                                        <Text oswaldMedium style={{ color: whenEnabledDescriptionColor, fontSize: AppFonts.scaleFont(20) }}>{'THE DAY'}</Text>
                                    </View>
                                    <View style={{ flex: 1, marginRight: 10, padding: 8, backgroundColor: readinessSurveyBackgroundColor, borderColor: readinessSurveyBorderColor, borderWidth: 1, borderRadius: 5 }}>
                                        <Text h7 oswaldMedium style={{ color: readinessSurveyHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'WHY'}</Text>
                                        <Text oswaldMedium style={{ color: readinessSurveyDescriptionColor, fontSize: AppFonts.scaleFont(20) }}>{'PERSONALIZE'}</Text>
                                        <Text oswaldMedium style={{ color: readinessSurveyDescriptionColor, fontSize: AppFonts.scaleFont(20) }}>{'YOUR PLAN'}</Text>
                                    </View>
                                </View>
                                <Spacer size={60}/>
                                <Button
                                    backgroundColor={AppColors.primary.yellow.hundredPercent}
                                    color={AppColors.white}
                                    containerViewStyle={{ position: 'absolute', left: 10, bottom: 0, right: 25 }}
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
                { prepare.isReadinessSurveyCollapsed || isDailyReadinessSurveyCompleted ? this.renderDefaultListGap() : null }
                <ListItem
                    containerStyle={{ borderBottomWidth: 0 }}
                    disabled={disabled}
                    hideChevron={true}
                    leftIcon={{ name: (prepare.isActiveRecoveryCollapsed && prepare.finishedRecovery) || (dailyPlanObj && dailyPlanObj.pre_recovery_completed) ? 'check-circle' : disabled ? 'lock' : 'fiber-manual-record', size: 20, color: (prepare.isActiveRecoveryCollapsed && prepare.finishedRecovery) || (dailyPlanObj && dailyPlanObj.pre_recovery_completed) ? AppColors.primary.yellow.hundredPercent : AppColors.black }}
                    // onPress={() => !isDailyReadinessSurveyCompleted ? null : this.setState({ prepare: Object.assign({}, prepare, { isActiveRecoveryCollapsed: !prepare.isActiveRecoveryCollapsed }) }) }
                    title={'ACTIVE RECOVERY'}
                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                />
                {
                    prepare.isActiveRecoveryCollapsed
                        ?
                        prepare.finishedRecovery || (dailyPlanObj && dailyPlanObj.pre_recovery_completed)
                            ?
                            <View style={{flex: 1, paddingLeft: 15,}}>
                                {
                                    this.renderActiveRecoveryBlocks(
                                        recoveryObj,
                                        {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                        {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor}
                                    )
                                }
                            </View>
                            :
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ paddingLeft: 15 }}/>{/*, borderRightWidth: 1, borderRightColor: AppColors.primary.grey.thirtyPercent standard padding of 10 and 5 for half the default size of icons */}
                                <View style={{ flex: 1 }}>
                                    {
                                        recoveryObj
                                            ?
                                            <View>
                                                {
                                                    this.renderActiveRecoveryBlocks(
                                                        recoveryObj,
                                                        {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                                        {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor}
                                                    )
                                                }
                                                <Spacer size={60}/>
                                                <Button
                                                    backgroundColor={AppColors.primary.yellow.hundredPercent}
                                                    color={AppColors.white}
                                                    containerViewStyle={{ position: 'absolute', left: 10, bottom: 0, right: 25 }}
                                                    fontFamily={AppStyles.robotoBold.fontFamily}
                                                    fontWeight={AppStyles.robotoBold.fontWeight}
                                                    outlined
                                                    onPress={() => this.setState({ prepare: Object.assign({}, prepare, { isActiveRecoveryCollapsed: !prepare.isActiveRecoveryCollapsed })}) }
                                                    textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                                                    title={'Start'}
                                                />
                                            </View>
                                            :
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1, marginRight: 5, padding: 8, backgroundColor: activeRecoveryWhenBackgroundColor, borderColor: activeRecoveryWhenBorderColor, borderWidth: 1, borderRadius: 5 }}>
                                                    <Text h7 oswaldMedium style={{ color: activeRecoveryWhenHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'WHEN'}</Text>
                                                    <Text oswaldMedium style={{ color: activeRecoveryWhenDescriptionColor, fontSize: AppFonts.scaleFont(18) }}>{'ANYTIME BEFORE TRAINING'}</Text>
                                                </View>
                                                <View style={{ flex: 1, marginRight: 10, padding: 8, backgroundColor: activeRecoveryBackgroundColor, borderColor: activeRecoveryBorderColor, borderWidth: 1, borderRadius: 5 }}>
                                                    <Text h7 oswaldMedium style={{ color: activeRecoveryHeaderColor, fontWeight: 'bold', paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'TYP. ACTIVE TIME'}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                                        <Text h1 oswaldMedium style={{ color: activeRecoveryDescriptionColor, fontSize: AppFonts.scaleFont(28) }}>{'5-15 '}</Text>
                                                        <Text h7 oswaldMedium style={{ color: activeRecoveryDescriptionColor, lineHeight: AppStyles.h1.lineHeight - 3*AppStyles.h1.marginBottom, fontSize: AppFonts.scaleFont(12) }}>{'MIN'}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                    }
                                </View>
                            </View>
                        :
                        <View style={{ flex: 1 }}>
                            { disabled
                                ?
                                null
                                :
                                !recoveryObj ?
                                    <View style={{flex: 1}}>
                                        <ActivityIndicator
                                            color={AppColors.primary.yellow.hundredPercent}
                                            size={'large'}
                                        />
                                        <Text oswaldRegular style={[AppStyles.h1, AppStyles.paddingVertical, AppStyles.textCenterAligned]}>{loadingText}</Text>
                                    </View>
                                    :
                                    <View style={{flex: 1}}>
                                        <View style={{paddingLeft: 15}}>
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
                                                p
                                                robotoBold
                                                style={[AppStyles.textCenterAligned, {color: AppColors.secondary.blue.eightyPercent, textDecorationLine: 'none', fontSize: AppFonts.scaleFont(12) }]}
                                            >
                                                {'Hide Exercises ^'}
                                            </Text>
                                        </View>
                                        <Exercises
                                            completedExercises={completedExercises}
                                            exerciseList={exerciseList}
                                            handleCompleteExercise={this._handleCompleteExercise}
                                            handleExerciseListRefresh={this._handleExerciseListRefresh}
                                            isExerciseListRefreshing={this.state.isExerciseListRefreshing}
                                            toggleCompletedAMPMRecoveryModal={() =>
                                                this.props.patchActiveRecovery(this.props.user.id, 'pre').then(() =>
                                                    this.setState({
                                                        completedExercises: [],
                                                        prepare:            Object.assign({}, this.state.prepare, {
                                                            finishedRecovery:          true,
                                                            isActiveRecoveryCollapsed: true,
                                                        }),
                                                        update: true,
                                                    })
                                                )
                                            }
                                            toggleSelectedExercise={this._toggleSelectedExercise}
                                        />
                                    </View>
                            }
                            { this.state.loading ?
                                <ActivityIndicator
                                    color={AppColors.primary.yellow.hundredPercent}
                                    size={'large'}
                                    style={[AppStyles.activityIndicator]}
                                /> : null
                            }
                        </View>
                }
                {
                    prepare.isActiveRecoveryCollapsed && completedExercises.length
                        ?
                        <Button
                            backgroundColor={AppColors.primary.yellow.hundredPercent}
                            color={AppColors.white}
                            containerViewStyle={[AppStyles.nextButtonWrapper, { width: AppSizes.screen.width - 60, position: 'absolute', bottom: 15, left: 15, right: 15 }]}
                            fontFamily={AppStyles.robotoBold.fontFamily}
                            fontWeight={AppStyles.robotoBold.fontWeight}
                            onPress={() => this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(false, false, index+1))}
                            raised={false}
                            textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                            title={'Go to Train'}
                        />
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
        let isDailyReadinessSurveyCompleted = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ? true : false;
        let recoveryObj = isDailyReadinessSurveyCompleted && dailyPlanObj && dailyPlanObj.post_recovery ? dailyPlanObj.post_recovery : false;
        let loadingText = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ?
            'Creating/updating your plan...'
            :
            'Loading...';
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
                <ListItem
                    containerStyle={{ borderBottomWidth: 0 }}
                    disabled={disabled}
                    hideChevron={true}
                    leftIcon={{ name: isCompleted ? 'check-circle' : disabled ? 'lock' : 'fiber-manual-record', size: 20, color: isCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.black }}
                    title={'ACTIVE RECOVERY'}
                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                />
                {
                    recover.finished || isCompleted
                        ?
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            {
                                this.renderActiveRecoveryBlocks(
                                    recoveryObj,
                                    {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                    {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor},
                                    true
                                )
                            }
                        </View>
                        :
                        disabled
                            ?
                            <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                <View style={{ flex: 1, marginRight: 5, padding: 8, backgroundColor: activeRecoveryWhenBackgroundColor, borderColor: activeRecoveryWhenBorderColor, borderWidth: 1, borderRadius: 5 }}>
                                    <Text h7 oswaldMedium style={{ color: activeRecoveryWhenHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'WHEN'}</Text>
                                    <Text h6 oswaldMedium style={{ color: activeRecoveryWhenDescriptionColor, fontSize: AppFonts.scaleFont(18) }}>{'ANYTIME AFTER '}</Text>
                                    <Text h6 oswaldMedium style={{ color: activeRecoveryWhenDescriptionColor, fontSize: AppFonts.scaleFont(18) }}>{'TRAINING'}</Text>
                                </View>
                                <View style={{ flex: 1, marginRight: 10, padding: 8, backgroundColor: activeRecoveryActiveTimeBackgroundColor, borderColor: activeRecoveryActiveTimeBorderColor, borderWidth: 1, borderRadius: 5 }}>
                                    <Text h7 oswaldMedium style={{ color: activeRecoveryActiveTimeHeaderColor, paddingBottom: 5, fontSize: AppFonts.scaleFont(12) }}>{'TYP. ACTIVE TIME'}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                        <Text h1 oswaldMedium style={{ color: activeRecoveryActiveTimeDescriptionColor, fontSize: AppFonts.scaleFont(28) }}>{'5-15 '}</Text>
                                        <Text h7 oswaldMedium style={{ color: activeRecoveryActiveTimeDescriptionColor, lineHeight: AppStyles.h1.lineHeight - 3*AppStyles.h1.marginBottom, fontSize: AppFonts.scaleFont(12) }}>{'MIN'}</Text>
                                    </View>
                                </View>
                            </View>
                            : recover.isActiveRecoveryCollapsed ?
                                <View>
                                    <View style={{ flex: 1, paddingLeft: 10 }}>
                                        {
                                            this.renderActiveRecoveryBlocks(
                                                recoveryObj,
                                                {activeRecoveryWhenBackgroundColor, activeRecoveryWhenBorderColor, activeRecoveryWhenHeaderColor, activeRecoveryWhenDescriptionColor},
                                                {activeRecoveryActiveTimeBackgroundColor, activeRecoveryActiveTimeBorderColor, activeRecoveryActiveTimeHeaderColor, activeRecoveryActiveTimeDescriptionColor, activeRecoveryActiveTimeSubtextColor, activeRecoveryBackgroundColor, activeRecoveryBorderColor, activeRecoveryHeaderColor, activeRecoveryDescriptionColor, subtextColor},
                                                true
                                            )
                                        }
                                    </View>
                                    <Spacer size={60}/>
                                    <Button
                                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                                        color={AppColors.white}
                                        containerViewStyle={{ position: 'absolute', left: 10, bottom: 0, right: 25 }}
                                        fontFamily={AppStyles.robotoBold.fontFamily}
                                        fontWeight={AppStyles.robotoBold.fontWeight}
                                        outlined
                                        onPress={() => this.setState({ recover: Object.assign({}, recover, { isActiveRecoveryCollapsed: !recover.isActiveRecoveryCollapsed }) })}
                                        textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                                        title={'Start'}
                                    />
                                </View>
                                :
                                null
                }
                <View style={{ flex: 1 }}>
                    {
                        recover.finished || disabled || recover.isActiveRecoveryCollapsed
                            ?
                            null
                            :
                            !recoveryObj
                                ?
                                <View style={{flex: 1}}>
                                    <ActivityIndicator
                                        color={AppColors.primary.yellow.hundredPercent}
                                        size={'large'}
                                    />
                                    <Text oswaldRegular style={[AppStyles.h1, AppStyles.paddingVertical, AppStyles.textCenterAligned]}>{loadingText}</Text>
                                </View>
                                :
                                <View style={{flex: 1}}>
                                    <View style={{paddingLeft: 15}}>
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
                                            p
                                            robotoBold
                                            style={[AppStyles.textCenterAligned, {color: AppColors.secondary.blue.eightyPercent, textDecorationLine: 'none', fontSize: AppFonts.scaleFont(12) }]}
                                        >
                                            {'Hide Exercises ^'}
                                        </Text>
                                    </View>
                                    <Exercises
                                        completedExercises={completedExercises}
                                        exerciseList={exerciseList}
                                        handleCompleteExercise={this._handleCompleteExercise}
                                        handleExerciseListRefresh={this._handleExerciseListRefresh}
                                        isExerciseListRefreshing={this.state.isExerciseListRefreshing}
                                        toggleCompletedAMPMRecoveryModal={() =>
                                            this.props.patchActiveRecovery(this.props.user.id, 'post').then(() =>
                                                this.setState({
                                                    completedExercises: [],
                                                    recover:            Object.assign({}, this.state.recover, {
                                                        finished:                  !!completedExercises.length,
                                                        isActiveRecoveryCollapsed: true,
                                                    })
                                                })
                                            )
                                        }
                                        toggleSelectedExercise={this._toggleSelectedExercise}
                                    />
                                </View>
                    }
                    {
                        this.state.loading
                            ?
                            <ActivityIndicator
                                color={AppColors.primary.yellow.hundredPercent}
                                size={'large'}
                                style={[AppStyles.activityIndicator]}
                            />
                            :
                            null
                    }
                </View>
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
        let train = this.state.train;
        let { plan } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let isDailyReadinessSurveyCompleted = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ? true : false;
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: AppColors.white }} tabLabel={tabs[index]}>
                <Spacer />
                {
                    train.postPracticeSurveys.map((postPracticeSurvey, i) =>
                        <View key={`postPracticeSurveys${i}`}>
                            <ListItem
                                containerStyle={{ borderBottomWidth: 0 }}
                                disabled={!isDailyReadinessSurveyCompleted}
                                hideChevron={true}
                                leftIcon={{ name: postPracticeSurvey.isPostPracticeSurveyCompleted ? 'check-circle' : isDailyReadinessSurveyCompleted ? 'fiber-manual-record' : 'lock', size: 20, color: postPracticeSurvey.isPostPracticeSurveyCompleted ? AppColors.primary.yellow.hundredPercent : AppColors.black }}
                                // rightIcon={{ name: `expand-${postPracticeSurvey.isPostPracticeSurveyCollapsed ? 'more' : 'less'}`, color: AppColors.black }}
                                // onPress={() => {let newTrainObject = Object.assign({}, train); newTrainObject.postPracticeSurveys[i].isPostPracticeSurveyCollapsed = !postPracticeSurvey.isPostPracticeSurveyCollapsed; this.setState({ train: newTrainObject }); }}
                                title={`TRAINING SESSION #${i+1}`}
                                titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, { color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24) }]}
                            />
                            { postPracticeSurvey.isPostPracticeSurveyCollapsed && train.postPracticeSurveys.length > 1 ? this.renderDefaultListGap() : null }
                            {
                                postPracticeSurvey.isPostPracticeSurveyCollapsed
                                    ?
                                    null
                                    :
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1, paddingLeft: 25 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1, marginRight: 5, padding: 8, backgroundColor: isDailyReadinessSurveyCompleted ? whenEnabledBackgroundColor : whenDisabledBackgroundColor, borderColor: isDailyReadinessSurveyCompleted ? whenEnabledBorderColor : whenDisabledBorderColor, borderWidth: 1, borderRadius: 5 }}>
                                                    <Text h7 style={{ color: isDailyReadinessSurveyCompleted ? whenEnabledHeaderColor : whenDisabledHeaderColor, fontWeight: 'bold', paddingBottom: 5 }}>{'WHEN TO LOG'}</Text>
                                                    <Text h6 style={{ color: isDailyReadinessSurveyCompleted ? whenEnabledDescriptionColor : whenDisabledDescriptionColor, fontWeight: 'bold' }}>{'RIGHT AFTER '}</Text>
                                                    <Text h6 style={{ color: isDailyReadinessSurveyCompleted ? whenEnabledDescriptionColor : whenDisabledDescriptionColor, fontWeight: 'bold' }}>{'TRAINING'}</Text>
                                                </View>
                                                <View style={{ flex: 1, marginRight: 10, padding: 8, backgroundColor: isDailyReadinessSurveyCompleted ? enabledBackgroundColor : disabledBackgroundColor, borderColor: isDailyReadinessSurveyCompleted ? enabledBorderColor : disabledBorderColor, borderWidth: 1, borderRadius: 5 }}>
                                                    <Text h7 style={{ color: isDailyReadinessSurveyCompleted ? enabledHeaderColor : disabledHeaderColor, fontWeight: 'bold', paddingBottom: 5 }}>{'WHY'}</Text>
                                                    <Text h6 style={{ color: isDailyReadinessSurveyCompleted ? enabledDescriptionColor : disabledDescriptionColor, fontWeight: 'bold' }}>{'LOAD & FATIGUE '}</Text>
                                                    <Text h6 style={{ color: isDailyReadinessSurveyCompleted ? enabledDescriptionColor : disabledDescriptionColor, fontWeight: 'bold' }}>{'MONITORING'}</Text>
                                                </View>
                                            </View>
                                            {
                                                postPracticeSurvey.isPostPracticeSurveyCompleted
                                                    ?
                                                    null
                                                    :
                                                    <View>
                                                        {
                                                            !postPracticeSurvey.isPostPracticeSurveyCompleted && isDailyReadinessSurveyCompleted
                                                                ?
                                                                <View>
                                                                    <Spacer size={60} />
                                                                    <Button
                                                                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                                                                        color={AppColors.white}
                                                                        containerViewStyle={{ position: 'absolute', left: 10, bottom: 0, right: 25 }}
                                                                        fontFamily={AppStyles.robotoBold.fontFamily}
                                                                        fontWeight={AppStyles.robotoBold.fontWeight}
                                                                        outlined
                                                                        onPress={this._togglePostSessionSurveyModal}
                                                                        textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                                                                        title={'Rate Your Session'}
                                                                    />
                                                                </View>
                                                                :
                                                                null
                                                        }
                                                    </View>
                                            }
                                        </View>
                                    </View>
                            }
                            { i === train.postPracticeSurveys.length - 1 ? <Spacer size={60}/> : null }
                        </View>
                    )
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
            </ScrollView>
        );
    };

    _goToScrollviewPage = (pageIndex) => {
        if (this.tabView) {
            this.tabView.goToPage(pageIndex);
        }
    }

    render() {
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
            </ScrollableTabView>
        );
    }
}


/* Export Component ==================================================================== */
export default Home;