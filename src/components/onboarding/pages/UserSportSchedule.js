/**
 * UserSportSchedule
 *
    <UserSportSchedule
        componentStep={3}
        currentStep={step}
        handleFormChange={this._handleUserFormChange}
        user={form_fields.user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppStyles, UserAccount as UserAccountConstants } from '../../../constants';
import { Button, Text, Spacer } from '../../custom';

// import third-party libraries
import _ from 'lodash';
import { ButtonGroup } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    pickerSelect: {
        // border: 'none',
    },
    selectedText: {
        color:               AppColors.secondary.blue.eightyPercent,
        fontWeight:          'bold',
        textDecorationColor: AppColors.secondary.blue.eightyPercent,
        textDecorationLine:  'underline',
        textDecorationStyle: 'dashed',
    },
    unselectedText: {
        color:      AppColors.primary.grey.fiftyPercent,
        fontWeight: 'bold',
    },
    wrapper: {
        paddingTop:   10,
        paddingRight: 10,
    },
});

/* Component ==================================================================== */
class UserSportSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSportIndex: 0,
            sports:           [],
        };
    }

    componentWillMount = () => {
        this.setState({
            sports: this.props.user.training_schedule.sports.map(() => ({
                activeButtonGroupIndex:     0,
                competitionSkipped:         false,
                practiceSkipped:            false,
                selectedCompetitionIndexes: [],
                selectedPracticeIndexes:    [],
            }) )
        });
    };

    _updateSportSchedulePractice = (sportIndex, practiceIndex) => {
        const { handleFormChange, user } = this.props;
        const { sports } = this.state;
        // upate our state - for button styling
        let newSportsArray = _.cloneDeep(sports);
        if (newSportsArray[sportIndex].selectedPracticeIndexes && newSportsArray[sportIndex].selectedPracticeIndexes.indexOf(practiceIndex) > -1) {
            newSportsArray[sportIndex].selectedPracticeIndexes.splice(newSportsArray[sportIndex].selectedPracticeIndexes.indexOf(practiceIndex), 1);
        } else {
            if (!newSportsArray[sportIndex].selectedPracticeIndexes) {
                newSportsArray[sportIndex].selectedPracticeIndexes = [];
            }
            newSportsArray[sportIndex].selectedPracticeIndexes.push(practiceIndex);
        }
        this.setState({ sports: newSportsArray });
        // dynamically update our training_schedule object for the user
        let newUserTrainingSchedule = _.cloneDeep(user.training_schedule);
        newUserTrainingSchedule.sports[sportIndex].practice.days_of_week = UserAccountConstants.possibleShorthandDaysOfWeek.filter((value, index) => newSportsArray[sportIndex].selectedPracticeIndexes.includes(index)).join(', ');
        handleFormChange('training_schedule', newUserTrainingSchedule);
    };

    _updateSportScheduleCompetition = (sportIndex, competitionIndex) => {
        const { handleFormChange, user } = this.props;
        const { sports } = this.state;
        // upate our state - for button styling
        let newSportsArray = _.cloneDeep(sports);
        if (newSportsArray[sportIndex].selectedCompetitionIndexes && newSportsArray[sportIndex].selectedCompetitionIndexes.indexOf(competitionIndex) > -1) {
            newSportsArray[sportIndex].selectedCompetitionIndexes.splice(newSportsArray[sportIndex].selectedCompetitionIndexes.indexOf(competitionIndex), 1);
        } else {
            if (!newSportsArray[sportIndex].selectedCompetitionIndexes) {
                newSportsArray[sportIndex].selectedCompetitionIndexes = [];
            }
            newSportsArray[sportIndex].selectedCompetitionIndexes.push(competitionIndex);
        }
        if (!newSportsArray[sportIndex].selectedCompetitionIndexes.length && !newSportsArray[sportIndex].selectedPracticeIndexes.length) {
            newSportsArray[sportIndex].activeButtonGroupIndex = 0;
        }
        this.setState({ sports: newSportsArray });
        // dynamically update our training_schedule object for the user
        let newUserTrainingSchedule = _.cloneDeep(user.training_schedule);
        newUserTrainingSchedule.sports[sportIndex].competition.days_of_week = UserAccountConstants.possibleShorthandDaysOfWeek.filter((value, index) => newSportsArray[sportIndex].selectedCompetitionIndexes.includes(index)).join(', ');
        handleFormChange('training_schedule', newUserTrainingSchedule);
    };

    _handlePracticeTimeChange = (sportIndex, value) => {
        const { handleFormChange, user } = this.props;
        let newUserTrainingSchedule = _.cloneDeep(user.training_schedule);
        newUserTrainingSchedule.sports[sportIndex].practice.duration = value;
        handleFormChange('training_schedule', newUserTrainingSchedule);
    };

    _switchButtonGroupIndex = (newIndex) => {
        let { activeSportIndex, sports } = this.state;
        let newSports = _.cloneDeep(sports);
        newSports[activeSportIndex].activeButtonGroupIndex = newIndex; 
        this.setState({ sports: newSports });
    };

    _handleButtonPress = (buttonGroupIndex, stateSports, sportIndex) => {
        let { handleFormChange, user } = this.props;
        let propSports = user.training_schedule.sports;
        if (buttonGroupIndex === 0) {
            if (!propSports[sportIndex].practice.days_of_week.length) { // skipping practice
                let newStateSportsArray = _.cloneDeep(stateSports);
                newStateSportsArray[sportIndex].practiceSkipped = true;
                
                let newPropSports = _.cloneDeep(propSports);
                newPropSports[sportIndex].practice.skipped = true;
                
                return Promise.resolve(this.setState({ sports: newStateSportsArray }))
                    .then(() => Promise.resolve(this._switchButtonGroupIndex(2)))
                    .then(() => handleFormChange('training_schedule.sports', newPropSports));
            }
            return this._switchButtonGroupIndex(1);
        } else if (buttonGroupIndex === 1) { // duration set
            return this._switchButtonGroupIndex(2);
        } else if (buttonGroupIndex === 2) {
            if (!propSports[sportIndex].competition.days_of_week.length) { // skipping competition
                let newSportsArray = _.cloneDeep(stateSports);
                newSportsArray[sportIndex].competitionSkipped = true;

                let newPropSports = _.cloneDeep(propSports);
                newPropSports[sportIndex].competition.skipped = true;

                return Promise.resolve(this.setState({ sports: newSportsArray }))
                    .then(() => Promise.resolve(stateSports.length > sportIndex + 1 ? this.setState({ activeSportIndex: sportIndex +1 }) : null))
                    .then(() => handleFormChange('training_schedule.sports', newPropSports));
            }
            if (stateSports.length > sportIndex + 1) {
                return this.setState({ activeSportIndex: sportIndex +1 });
            }
        }
        return null;
    };

    render = () => {
        const {
            componentStep,
            currentStep,
            user,
        } = this.props;
        const {
            activeSportIndex,
            sports,
        } = this.state;
        let complete = user.training_schedule.sports.every(sport => (sport.competition.skipped || sport.competition.days_of_week.length)
            && (sport.practice.skipped || (sport.practice.days_of_week.length && sport.practice.duration)));
        return (
            <View style={[styles.wrapper, [componentStep === currentStep ? {flex: 1} : {display: 'none'}] ]}>
                { user.training_schedule.sports.map((sport, i) =>
                    activeSportIndex === i ? <View style={{ flex: 1, justifyContent: 'space-between' }}key={`0+${i}`}>
                        <View style={{ paddingLeft: 10 }}>
                            <Text style={{textAlign: 'center'}}>
                                <Text h1 style={{color: AppColors.black}}>{`This week I ${sports[i].practiceSkipped ? 'play' : 'have'} `}</Text>
                                <Text h1 style={[styles.selectedText]}>{_.capitalize(sport.sport)}</Text>
                                <Text h1 style={{color: AppColors.black}}>{` ${sports[i].practiceSkipped ? 'Games' : 'practice'} on `}</Text>
                                { sports[i].practiceSkipped ? null : sport.practice.days_of_week.length ?
                                    <Text
                                        h1
                                        style={[styles.selectedText]}
                                        onPress={() => this._switchButtonGroupIndex(0)}
                                    >
                                        {sport.practice.days_of_week}
                                    </Text>
                                    :
                                    <Text
                                        h1
                                        style={[styles.unselectedText]}
                                        onPress={() => this._switchButtonGroupIndex(0)}
                                    >
                                        {'day(s)'}
                                    </Text>
                                }
                                { sports[i].practiceSkipped ? null : <Text h1 style={{color: AppColors.black}}>{' for '}</Text> }
                                { sports[i].practiceSkipped ? null : sport.practice.duration ?
                                    <Text
                                        h1
                                        style={[styles.selectedText]}
                                        onPress={() => this._switchButtonGroupIndex(1)}
                                    >
                                        {UserAccountConstants.getMinutesToTimeFormat(sport.practice.duration)}
                                    </Text>
                                    :
                                    <Text
                                        h1
                                        style={[styles.unselectedText]}
                                        onPress={() => sport.practice.days_of_week.length ? this._switchButtonGroupIndex(1) : null}
                                    >
                                        {'select duration'}
                                    </Text>
                                }
                                { !sports[i].practiceSkipped ?
                                    <Text h1 style={{color: AppColors.black}}>{` and play ${_.capitalize(sport.sport)} Games on `}</Text>
                                    :
                                    null
                                }
                                { sport.competition.days_of_week.length ?
                                    <Text
                                        h1
                                        onPress={() => this._switchButtonGroupIndex(2)}
                                        style={[styles.selectedText]}
                                    >
                                        {sport.competition.days_of_week}
                                    </Text>
                                    :
                                    <Text
                                        h1
                                        onPress={() => sports[i].practiceSkipped || sports[i].selectedPracticeIndexes.length && sport.practice.duration ? this._switchButtonGroupIndex(2) : null}
                                        style={[styles.unselectedText]}
                                    >
                                        {'day(s)'}
                                    </Text>
                                }
                            </Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end'}}>
                            <View style={{ paddingLeft: 10 }}>
                                {/* Buttons for practice days */}
                                { sports[i].activeButtonGroupIndex === 0 ?
                                    _.chunk(UserAccountConstants.possibleDaysOfWeek, 3 /* num of columns */).map((daysOfWeekChunk, chunkIndex) => (
                                        <View key={`1+${chunkIndex}`} style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                            { daysOfWeekChunk.map((dayOfWeek, dayOfWeekIndex) => (
                                                <Button
                                                    backgroundColor={sports[i].selectedPracticeIndexes.includes(((chunkIndex % 3) * 3) + dayOfWeekIndex) ? null : `${AppColors.primary.grey.eightyPercent}80`} // 80 is hex for 50% opacity
                                                    borderRadius={0}
                                                    key={`2+${dayOfWeekIndex}`}
                                                    onPress={() => this._updateSportSchedulePractice(i, ((chunkIndex % 3) * 3) + dayOfWeekIndex)}
                                                    raised={false}
                                                    title={dayOfWeek}
                                                />
                                            ))}
                                        </View>
                                    ))
                                    :
                                    null
                                }
                                {/* Buttons for practice duration */}
                                { sports[i].activeButtonGroupIndex === 1 ?
                                    _.chunk(UserAccountConstants.practiceTimes.map(practiceTime => practiceTime.label), 4 /* num of columns */).map((practiceTimeChunk, chunkIndex) => (
                                        <View key={`3+${chunkIndex}`} style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                            { practiceTimeChunk.map((practiceTime, practiceTimeIndex) => (
                                                <Button
                                                    backgroundColor={practiceTime === UserAccountConstants.getMinutesToTimeFormat(sport.practice.duration) ? null : `${AppColors.primary.grey.eightyPercent}80`} // 80 is hex for 50% opacity
                                                    borderRadius={0}
                                                    buttonStyle={{ paddingLeft: 15, paddingRight: 15 }}
                                                    key={`4+${practiceTimeIndex}`}
                                                    onPress={() => this._handlePracticeTimeChange(i, UserAccountConstants.practiceTimes[((chunkIndex % 4) * 4) + practiceTimeIndex].value)}
                                                    raised={false}
                                                    title={practiceTime}
                                                />
                                            ))}
                                        </View>
                                    ))
                                    :
                                    null
                                }
                                {/* Buttons for game days */}
                                { sports[i].activeButtonGroupIndex === 2 ?
                                    _.chunk(UserAccountConstants.possibleDaysOfWeek, 3 /* num of columns */).map((daysOfWeekChunk, chunkIndex) => (
                                        <View key={`5+${chunkIndex}`} style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                            { daysOfWeekChunk.map((dayOfWeek, dayOfWeekIndex) => (
                                                <Button
                                                    backgroundColor={sports[i].selectedCompetitionIndexes.includes(((chunkIndex % 3) * 3) + dayOfWeekIndex) ? null : `${AppColors.primary.grey.eightyPercent}80`} // 80 is hex for 50% opacity
                                                    borderRadius={0}
                                                    key={`6+${dayOfWeekIndex}`}
                                                    onPress={() => this._updateSportScheduleCompetition(i, ((chunkIndex % 3) * 3) + dayOfWeekIndex)}
                                                    raised={false}
                                                    title={dayOfWeek}
                                                />
                                            ))}
                                        </View>
                                    ))
                                    :
                                    null
                                }
                            </View>
                            <Spacer size={20}/>
                            <View>
                                {
                                    complete ? null :sports[i].activeButtonGroupIndex !== 1 ||
                                    (sports[i].activeButtonGroupIndex === 1 && sport.practice.duration) ?
                                        <TouchableOpacity onPress={() => this._handleButtonPress(sports[i].activeButtonGroupIndex, sports, i)} style={[AppStyles.nextButtonWrapper]}>
                                            <Text style={[AppStyles.nextButtonText]}>
                                                {
                                                    sports[i].activeButtonGroupIndex === 0 && !sport.practice.days_of_week.length ?
                                                        `I don't have ${sport.sport} practice`
                                                        :
                                                        sports[i].activeButtonGroupIndex === 1 ?
                                                            'Next Step'
                                                            :
                                                            sports[i].activeButtonGroupIndex === 2 && !sport.competition.days_of_week.length ?
                                                                'I don\'t have a game this week'
                                                                :
                                                                'Next Step'
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                        :
                                        <Spacer size={50}/>
                                }
                            </View>
                        </View>
                    </View> : null
                )}
            </View>
        );
    }
}

UserSportSchedule.propTypes = {
    componentStep:    PropTypes.number.isRequired,
    currentStep:      PropTypes.number.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    user:             PropTypes.object.isRequired,
};
UserSportSchedule.defaultProps = {};
UserSportSchedule.componentName = 'UserSportSchedule';

/* Export Component ==================================================================== */
export default UserSportSchedule;
