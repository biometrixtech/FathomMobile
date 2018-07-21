/**
 * MyPlan Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modalbox';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';

// Consts, Libs, and Utils
import { Actions, AppColors, AppStyles, AppSizes, MyPlan as MyPlanConstants } from '../../constants';

// Components
import { Button, TabIcon, Text, } from '../custom';
import { Exercises, PostSessionSurvey, ReadinessSurvey } from './pages';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.white,
        flex:            1,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
});

/* Component ==================================================================== */
class MyPlan extends Component {
    static componentName = 'MyPlan';

    static propTypes = {
        getMyPlan:           PropTypes.func.isRequired,
        getSoreBodyParts:    PropTypes.func.isRequired,
        notification:        PropTypes.bool.isRequired,
        plan:                PropTypes.object.isRequired,
        postReadinessSurvey: PropTypes.func.isRequired,
        postSessionSurvey:   PropTypes.func.isRequired,
        user:                PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);

        this.state = {
            dailyReadiness: {
                readiness:     0,
                sleep_quality: 0,
                soreness:      [],
            },
            isCompletedAMPMRecoveryModalOpen: false,
            isExerciseListRefreshing:         false,
            isReadinessSurveyModalOpen:       false,
            isPostSessionSurveyModalOpen:     false,
            postSession:                      {
                RPE:      0,
                soreness: []
            },
        };
    }

    componentDidMount = () => {
        let userId = this.props.user.id;
        // this.props.getMyPlan('morning_practice_2', moment('2018-07-11', 'YYYY-MM-DD').format('YYYY-MM-DD'))
        this.props.getMyPlan(userId, moment().format('YYYY-MM-DD'))
            .then(response => {
                // console.log('response', response);
                if(response.daily_plans[0].daily_readiness_survey_completed) {
                    // -- AM/PM Survey
                    this.setState({
                        isReadinessSurveyModalOpen: false,
                    });
                    SplashScreen.hide();
                } else {
                    this.props.getSoreBodyParts()
                        .then(soreBodyParts => {
                            // console.log('soreBodyParts',soreBodyParts);
                            let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
                            newDailyReadiness.soreness = _.cloneDeep(soreBodyParts.body_parts);
                            this.setState({
                                isPostSessionSurveyModalOpen: false,
                                isReadinessSurveyModalOpen:   true,
                                dailyReadiness:               newDailyReadiness,
                            });
                            SplashScreen.hide();
                        })
                        .catch(err => {
                            // if there was an error, maybe the survey wasn't created for yesterday so have them do it as a blank
                            let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
                            newDailyReadiness.soreness = [];
                            this.setState({
                                isPostSessionSurveyModalOpen: false,
                                isReadinessSurveyModalOpen:   true,
                                dailyReadiness:               newDailyReadiness,
                            });
                            SplashScreen.hide();
                        });
                }
            })
            .catch(error => {
                SplashScreen.hide();
                // console.log('error',error);
            });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.notification !== this.props.notification) {
            this._handleExerciseListRefresh(true);
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
                this.setState({
                    isReadinessSurveyModalOpen: false,
                });
            })
            .catch(error => {
                console.log('error',error);
            });
    }

    _handlePostSessionSurveySubmit = () => {
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
        this.props.postSessionSurvey(postSession)
            .then(response => {
                this.setState({
                    isPostSessionSurveyModalOpen: false,
                });
            })
            .catch(error => {
                console.log('error',error);
            });
    }

    _handleAreaOfSorenessClick = (areaClicked, isDailyReadiness) => {
        let stateObject = isDailyReadiness ? this.state.dailyReadiness : this.state.postSession;
        let newSorenessFields = _.cloneDeep(stateObject.soreness);
        if(_.findIndex(stateObject.soreness, o => o.body_part === areaClicked.index) > -1) {
            // body part already exists
            newSorenessFields = newSorenessFields.filter(o => o.body_part !== areaClicked.index);
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
            isCompletedAMPMRecoveryModalOpen: !this.state.isCompletedAMPMRecoveryModalOpen
        });
    }

    _togglePostSessionSurvey = () => {
        this.setState({
            isPostSessionSurveyModalOpen: !this.state.isPostSessionSurveyModalOpen
        });
    }

    _togglePostSessionSurveyModal = () => {
        if(!this.state.isPostSessionSurveyModalOpen) {
            this.props.getSoreBodyParts()
                .then(soreBodyParts => {
                    // console.log('soreBodyParts',soreBodyParts);
                    let newDailyReadiness = _.cloneDeep(this.state.postSession);
                    newDailyReadiness.soreness = _.cloneDeep(soreBodyParts.body_parts);
                    this.setState({
                        isPostSessionSurveyModalOpen: true,
                        postSession:                  newDailyReadiness,
                    });
                })
                .catch(err => {
                    // if there was an error, maybe the survey wasn't created for yesterday so have them do it as a blank
                    let newDailyReadiness = _.cloneDeep(this.state.postSession);
                    newDailyReadiness.soreness = [];
                    this.setState({
                        isPostSessionSurveyModalOpen: true,
                        postSession:                  newDailyReadiness,
                    });
                });
        } else {
            this.setState({
                isPostSessionSurveyModalOpen: false
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
                // console.log('response', response);
                this.setState({
                    isExerciseListRefreshing: false
                });
            })
            .catch(error => {
                // console.log('error',error);
                this.setState({
                    isExerciseListRefreshing: false
                });
            });
    }

    render = () => {
        let hourOfDay = moment().get('hour');
        let isDailyReadinessSurveyCompleted = this.props.plan.dailyPlan[0] && this.props.plan.dailyPlan[0].daily_readiness_survey_completed ? true : false;
        let dailyPlanObj = this.props.plan ? this.props.plan.dailyPlan[0] : false;
        let recoveryObj = isDailyReadinessSurveyCompleted && dailyPlanObj && dailyPlanObj.recovery_pm && hourOfDay >= 12 ?
            dailyPlanObj.recovery_pm
            : isDailyReadinessSurveyCompleted && dailyPlanObj && dailyPlanObj.recovery_am && hourOfDay < 12 ?
                dailyPlanObj.recovery_am
                :
                false;
        let timeOfDay = (hourOfDay >= 12 ? 'P' : 'A') + 'M';
        let partOfDay = hourOfDay >= 12 ? 'AFTERNOON' : 'MORNING';
        let completedAMPMRecoverMessage = hourOfDay >= 12 ?
            'Log a training session to update your next Recovery, else we\'ll see you tomorrow. Rest well!'
            :
            'Comeback this afternoon or log a training session to update your PM Recovery.';
        let loadingText = dailyPlanObj && dailyPlanObj.daily_readiness_survey_completed ?
            'Creating/updating your plan...'
            :
            'Loading...';
        return (
            <View style={[styles.background]}>
                <LinearGradient
                    colors={[AppColors.gradient.blue.gradientStart, AppColors.gradient.blue.gradientEnd]}
                    style={[AppStyles.containerCentered, AppStyles.paddingVertical, AppStyles.paddingHorizontal]}
                >
                    <Image
                        source={require('../../../assets/images/standard/coach-avatar.png')}
                        style={{resizeMode: 'contain', width: 40, height: 40}}
                    />
                    { !isDailyReadinessSurveyCompleted ?
                        <Text style={[AppStyles.h1, AppStyles.paddingVerticalXLrg, AppStyles.paddingHorizontalLrg, AppStyles.textCenterAligned, {color: AppColors.white}]}>{`GOOD ${partOfDay}, ${this.props.user.personal_data.first_name.toUpperCase()}!`}</Text>
                        :
                        <View>
                            <Text style={[AppStyles.paddingVerticalSml, AppStyles.textCenterAligned, AppStyles.h1, {color: AppColors.white}]}>{timeOfDay} {'RECOVERY'}</Text>
                            <Text style={[AppStyles.paddingVerticalSml, AppStyles.textCenterAligned, {color: AppColors.white}]}>{'Check the box to indicate completed exercises.'}</Text>
                            <Text style={[AppStyles.paddingVerticalSml, AppStyles.textCenterAligned, {color: AppColors.white}]}>{'Or click the plus sign below to log a practice & update your recovery!'}</Text>
                            <TabIcon
                                containerStyle={[{alignSelf: 'flex-end'}]}
                                icon={'plus-circle-outline'}
                                iconStyle={[{color: AppColors.white}]}
                                onPress={this._togglePostSessionSurveyModal}
                                reverse={false}
                                size={30}
                                type={'material-community'}
                            />
                        </View>
                    }
                </LinearGradient>
                { !recoveryObj ?
                    <View style={{flex: 1}}>
                        <ScrollView
                            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
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
                        >
                            <ActivityIndicator
                                color={AppColors.primary.yellow.hundredPercent}
                                size={'large'}
                            />
                            <Text style={[AppStyles.h1, AppStyles.paddingVertical, AppStyles.textCenterAligned]}>{loadingText}</Text>
                        </ScrollView>
                    </View>
                    :
                    <Exercises
                        handleExerciseListRefresh={this._handleExerciseListRefresh}
                        isExerciseListRefreshing={this.state.isExerciseListRefreshing}
                        recoveryObj={recoveryObj}
                        toggleCompletedAMPMRecoveryModal={this._toggleCompletedAMPMRecoveryModal}
                    />
                }
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
                </Modal>
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
                </Modal>
                <Modal
                    backdropPressToClose={false}
                    coverScreen={true}
                    isOpen={this.state.isCompletedAMPMRecoveryModalOpen}
                    swipeToClose={false}
                >
                    <LinearGradient
                        colors={[AppColors.gradient.blue.gradientStart, AppColors.gradient.blue.gradientEnd]}
                        style={[AppStyles.containerCentered, AppStyles.paddingVertical, AppStyles.paddingHorizontal, {flex: 1}]}
                    >
                        <Text style={[AppStyles. paddingVertical, AppStyles.h1, AppStyles.textCenterAligned, {color: AppColors.white, fontWeight: 'bold'}]}>{`You've completed your ${timeOfDay} Recovery!`}</Text>
                        <Text style={[AppStyles. paddingVertical, AppStyles.h3, AppStyles.textCenterAligned, {color: AppColors.white}]}>{completedAMPMRecoverMessage}</Text>
                        <Button
                            backgroundColor={AppColors.primary.yellow.hundredPercent}
                            buttonStyle={[AppStyles.paddingVertical, AppStyles.paddingHorizontal]}
                            containerViewStyle={{marginVertical: AppSizes.paddingMed}}
                            onPress={this._togglePostSessionSurveyModal}
                            textColor={AppColors.white}
                            title={'Log a session to customize recovery'}
                        />
                        <Button
                            backgroundColor={AppColors.white}
                            buttonStyle={[AppStyles.paddingVertical, AppStyles.paddingHorizontal]}
                            containerViewStyle={{marginVertical: AppSizes.paddingMed}}
                            onPress={this._toggleCompletedAMPMRecoveryModal}
                            textColor={AppColors.primary.yellow.hundredPercent}
                            title={`Do ${timeOfDay} Recovery again`}
                        />
                    </LinearGradient>
                </Modal>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default MyPlan;