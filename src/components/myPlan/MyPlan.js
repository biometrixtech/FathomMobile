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
import { AppColors, AppStyles, AppSizes, } from '../../constants';

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
        soreBodyParts:       PropTypes.array.isRequired,
        user:                PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);

        this.state = {
            dailyReadiness: {
                // date_time: '2018-07-03 10:42:20.1234',
                // user_id:   '02cb7965-7921-493a-80d4-6b278c928fad',
                soreness: [
                //     {body_part: 8, severity: 2, side: 0-2},
                //     {body_part: 14, severity: 3, side: 0-2},
                ],
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
        let userId = this.props.user.id || '02cb7965-7921-493a-80d4-6b278c928fad';
        this.props.getMyPlan(userId, moment().format('YYYY-MM-DD'))
            .then(response => {
                // console.log('response', response);
                if(response.daily_plans.length > 0) {
                    // -- AM/PM Survey
                    SplashScreen.hide();
                } else {
                    this.props.getSoreBodyParts()
                        .then(soreBodyParts => {
                            console.log('soreBodyParts',soreBodyParts);
                            this.setState({ isReadinessSurveyModalOpen: true });
                            SplashScreen.hide();
                        })
                        .catch(err => {
                            SplashScreen.hide();
                            // console.log('err',err);
                        });
                    // -- postReadinessSurvey.post()
                }
            })
            .catch(error => {
                SplashScreen.hide();
                // console.log('error',error);
            });
    }

    _handleDailyReadinessFormChange = (name, value, bodyPart) => {
        // console.log(this.state.soreBodyParts);
        // console.log(name, value);
        let newFormFields;
        if(name === 'soreness' && bodyPart) {
            let newSorenessFields = _.cloneDeep(this.state.dailyReadiness.soreness);
            if(_.findIndex(this.state.dailyReadiness.soreness, (o) => o.body_part === bodyPart) > -1) {
                // body part already exists
                let sorenessIndex = [_.findIndex(this.state.dailyReadiness.soreness, (o) => o.body_part === bodyPart)];
                newSorenessFields[sorenessIndex].severity = value;
            } else {
                // doesn't exist, create new object
                let newSorenessPart = {};
                newSorenessPart.body_part = bodyPart;
                newSorenessPart.severity = value;
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
        newDailyReadiness.user_id = this.props.user.id || '02cb7965-7921-493a-80d4-6b278c928fad';
        newDailyReadiness.date_time = moment().format();
        console.log('newDailyReadiness',newDailyReadiness);
        /*this.props.postReadinessSurvey(newDailyReadiness)
            .then(response => {
                // console.log('response', response);
            })
            .catch(error => {
                // console.log('error',error);
            });*/
    }

    _onDateSelected = (date) => {
        const selectedDate = moment(date);
        console.log(`${selectedDate.calendar()} selected`);
    }

    _handleAreaOfSorenessClick = (areaClicked, side) => {
        let newSorenessFields = _.cloneDeep(this.state.dailyReadiness.soreness);
        if(_.findIndex(this.state.dailyReadiness.soreness, (o) => o.body_part === areaClicked) > -1) {
            // body part already exists
            newSorenessFields = _.filter(newSorenessFields, (o) => o.body_part !== areaClicked);
        } else {
            // doesn't exist, create new object
            let newSorenessPart = {};
            newSorenessPart.body_part = areaClicked;
            newSorenessPart.side = side;
            newSorenessPart.severity = 0;
            newSorenessFields.push(newSorenessPart);
        }
        let newFormFields = _.update( this.state.dailyReadiness, 'soreness', () => newSorenessFields);
        this.setState({
            dailyReadiness: newFormFields
        });
    }

    render = () => {
        console.log(this.state.dailyReadiness);
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
                        soreBodyParts={this.props.soreBodyParts || []}
                        user={this.props.user || {personal_data: {first_name: 'Gabby'}}} // TODO: this needs to come from the reducer
                    />
                </Modal>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default MyPlan;