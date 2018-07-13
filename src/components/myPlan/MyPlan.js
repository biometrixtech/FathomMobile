/**
 * MyPlan Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modalbox';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';

// Consts, Libs, and Utils
import { AppColors, AppStyles, AppSizes, MyPlan as MyPlanConstants } from '../../constants';

// Components
import { CalendarStrip, Card, TabIcon, Text, } from '../custom/';
import { ExerciseItem, ReadinessSurvey } from './pages';

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
        myPlan:              PropTypes.object.isRequired,
        postReadinessSurvey: PropTypes.func.isRequired,
        soreBodyParts:       PropTypes.object.isRequired,
        user:                PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);

        this.state = {
            dailyReadiness: {
                soreness:      [],
                sleep_quality: 0,
                readiness:     0,
            },
            isReadinessSurveyModalOpen: false,
            // datesWhitelist: [
            //     {
            //         end:   moment().add(3, 'days'),  // total 4 days enabled
            //         start: moment(),
            //     }
            // ]
        };
    }

    componentDidMount = () => {
        let userId = this.props.user.id;
        this.props.getMyPlan(userId, moment().format('YYYY-MM-DD'))
            .then(response => {
                // console.log('response', response);
                if(response.daily_plans[0].daily_readiness_survey_completed) {
                    // -- AM/PM Survey
                    SplashScreen.hide();
                } else {
                    this.props.getSoreBodyParts()
                        .then(soreBodyParts => {
                            // console.log('soreBodyParts',soreBodyParts);
                            this.setState({
                                isReadinessSurveyModalOpen:  true,
                                ['dailyReadiness.soreness']: soreBodyParts.body_parts,
                            });
                            SplashScreen.hide();
                        })
                        .catch(err => {
                            // if there was an error, maybe the survey wasn't created for yesterday so have them do it as a blank
                            this.setState({
                                isReadinessSurveyModalOpen:  true,
                                ['dailyReadiness.soreness']: [],
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

    _handleReadinessSurveySubmit = () => {
        let newDailyReadiness = _.cloneDeep(this.state.dailyReadiness);
        newDailyReadiness.user_id = this.props.user.id;
        newDailyReadiness.date_time = moment().toISOString().split('.')[0] + 'Z';
        newDailyReadiness.sleep_quality = newDailyReadiness.sleep_quality + 1;
        newDailyReadiness.readiness = newDailyReadiness.readiness + 1;
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

    _onDateSelected = (date) => {
        const selectedDate = moment(date);
        console.log(`${selectedDate.calendar()} selected`);
    }

    _handleAreaOfSorenessClick = areaClicked => {
        let newSorenessFields = _.cloneDeep(this.state.dailyReadiness.soreness);
        if(_.findIndex(this.state.dailyReadiness.soreness, (o) => o.body_part === areaClicked.index) > -1) {
            // body part already exists
            newSorenessFields = _.filter(newSorenessFields, (o) => o.body_part !== areaClicked.index);
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
        let newFormFields = _.update( this.state.dailyReadiness, 'soreness', () => newSorenessFields);
        this.setState({
            dailyReadiness: newFormFields
        });
    }

    render = () => {
        let hourOfDay = moment().get('hour');
        let dailyPlanObj = this.props.myPlan ? this.props.myPlan.dailyPlan[0] : false;
        let recoveryObj = dailyPlanObj && hourOfDay >= 12 ?
            dailyPlanObj.recovery_pm
            : dailyPlanObj && hourOfDay < 12 ?
                dailyPlanObj.recovery_am
                :
                {};
        let timeOfDay = (hourOfDay > 12 ? 'P' : 'A') + 'M';
        return (
            <View style={[styles.background]}>
                <LinearGradient
                    colors={['#05425e', '#0f6187']}
                    style={[AppStyles.containerCentered, AppStyles.paddingVertical, AppStyles.paddingHorizontal]}
                >
                    <Image
                        source={require('../../constants/assets/images/coach-avatar.png')}
                        style={{resizeMode: 'contain', width: 40, height: 40}}
                    />
                    <Text style={[AppStyles.paddingVerticalSml, AppStyles.textCenterAligned, AppStyles.h1, {color: AppColors.white}]}>{timeOfDay} {'RECOVERY'}</Text>
                    <Text style={[AppStyles.paddingVerticalSml, AppStyles.textCenterAligned, {color: AppColors.white}]}>{'Check the box to indicate completed exercises.'}</Text>
                    <Text style={[AppStyles.paddingVerticalSml, AppStyles.textCenterAligned, {color: AppColors.white}]}>{'Or click the plus sign below to log a practice & update your recovery!'}</Text>
                    <TabIcon
                        containerStyle={[{alignSelf: 'flex-end'}]}
                        icon={'plus-circle-outline'}
                        iconStyle={[{color: AppColors.white}]}
                        onPress={() => console.log('TAKE ME TO POST SESSION SURVEY')}
                        reverse={false}
                        size={30}
                        type={'material-community'}
                    />
                </LinearGradient>
                { !recoveryObj ?
                    <View style={[AppStyles.containerCentered, {flex: 1}]}>
                        <ActivityIndicator
                            color={AppColors.primary.yellow.hundredPercent}
                            size={'large'}
                        />
                    </View>
                    :
                    <View style={{flex: 1}}>
                        <ScrollView>
                            {_.map(recoveryObj.exercises, exercise =>
                                <ExerciseItem
                                    exercise={exercise}
                                    key={exercise.library_id}
                                />
                            )}
                            <TouchableOpacity
                                disabled={true}
                                onPress={() => console.log('TAKE ME TO MESSAGE MODAL')}
                                style={[AppStyles.nextButtonWrapper, {backgroundColor: AppColors.primary.grey.hundredPercent}]}
                            >
                                <Text style={[AppStyles.nextButtonText]}>{'complete the exercises to log'}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
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
                        soreBodyParts={this.props.soreBodyParts || {}}
                        soreBodyPartsState={this.state.dailyReadiness.soreness}
                        user={this.props.user}
                    />
                </Modal>
                {/*<Text>{'MY PLAN'}</Text>
                <CalendarStrip
                    onDateSelected={this._onDateSelected}
                />
                <ScrollView>
                    <Card>
                        <Text>{'STRENGTH & CONDITIONING'}</Text>
                        <Text>{'Stretch and Mobilize'}</Text>
                    </Card>
                </ScrollView>*/}
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default MyPlan;