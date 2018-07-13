/**
 * MyPlan Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// import third-party libraries
import _ from 'lodash';
import Modal from 'react-native-modalbox';
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';

// Consts, Libs, and Utils
import { AppColors, AppStyles, AppSizes, MyPlan as MyPlanConstants } from '../../constants';

// Components
import { CalendarStrip, Card, Text, } from '../custom/';
import { ReadinessSurvey } from './pages';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.primary.white.hundredPercent,
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
        return (
            <View style={[styles.background]}>
                <Text>{'MY PLAN'}</Text>
                <CalendarStrip
                    onDateSelected={this._onDateSelected}
                />
                <ScrollView>
                    <Card>
                        <Text>{'STRENGTH & CONDITIONING'}</Text>
                        <Text>{'Stretch and Mobilize'}</Text>
                    </Card>
                    <Card>
                        <Text>{'PRACTICE'}</Text>
                        <Text>{'Soccer Practice'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                </ScrollView>
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
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default MyPlan;