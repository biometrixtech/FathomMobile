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
import { StyleSheet, View } from 'react-native';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppStyles, UserAccount as UserAccountConstants } from '../../../constants';
import { onboardingUtils } from '../../../constants/utils';
import { Text, FormLabel } from '../../custom';

// import third-party libraries
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
        paddingBottom: 20,
        paddingTop:    10,
        paddingRight:  10,
        paddingLeft:   10,
    },
});

/* Component ==================================================================== */
class UserSportSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCompetitionIndexes: {},
            selectedPracticeIndexes:    {},
        };
    }

    _updateSportSchedulePractice = (sport, index) => {
        const { handleFormChange, user } = this.props;
        const { selectedPracticeIndexes } = this.state;
        // upate our state - for button styling
        let newIndexesArray = selectedPracticeIndexes[sport];
        if(newIndexesArray && newIndexesArray.indexOf(index) > -1) {
            newIndexesArray.splice(newIndexesArray.indexOf(index), 1)
        } else {
            if(!newIndexesArray) {newIndexesArray = []}
            newIndexesArray.push(index);
        }
        this.setState({ selectedPracticeIndexes: { [sport]: newIndexesArray } });
        // dynamically update our training_schedule object for the user
        let newUserTrainingSchedule = user.training_schedule;
        newUserTrainingSchedule[sport].practice.days_of_week = newIndexesArray.map(value => UserAccountConstants.possibleShorthandDaysOfWeek[value]).join(',');
        handleFormChange('training_schedule', newUserTrainingSchedule);
    };

    _updateSportScheduleCompetition = (sport, index) => {
        const { handleFormChange, user } = this.props;
        const { selectedCompetitionIndexes } = this.state;
        // upate our state - for button styling
        let newIndexesArray = selectedCompetitionIndexes[sport];
        if(newIndexesArray && newIndexesArray.indexOf(index) > -1) {
            newIndexesArray.splice(newIndexesArray.indexOf(index), 1)
        } else {
            if(!newIndexesArray) {newIndexesArray = []}
            newIndexesArray.push(index);
        }
        this.setState({ selectedCompetitionIndexes: { [sport]: newIndexesArray } });
        // dynamically update our training_schedule object for the user
        let newUserTrainingSchedule = user.training_schedule;
        newUserTrainingSchedule[sport].competition.days_of_week = newIndexesArray.map(value => UserAccountConstants.possibleShorthandDaysOfWeek[value]).join(',');
        handleFormChange('training_schedule', newUserTrainingSchedule);
    };

    _handlePracticeTimeChange = (sport, value) => {
        const { handleFormChange, user } = this.props;
        let newUserTrainingSchedule = user.training_schedule;
        newUserTrainingSchedule[sport].practice.duration_minutes = value;
        handleFormChange('training_schedule', newUserTrainingSchedule);
    };

    render = () => {
        const {
            componentStep,
            currentStep,
            user,
        } = this.props;
        const { selectedCompetitionIndexes, selectedPracticeIndexes } = this.state;
        return (
            <View style={[styles.wrapper, [componentStep === currentStep ? {} : {display: 'none'}] ]}>
                { Object.keys(user.training_schedule).map((sport, i) =>
                    <View key={i} style={{paddingBottom: 20,}}>
                        <Text style={[AppFonts.h1, {textAlign: 'center'}]}>
                            <Text style={{color: AppColors.black, fontWeight: 'bold'}}>{'This week I have '}</Text>
                            <Text style={[styles.selectedText]}>{onboardingUtils.capitalizeFirstLetter(sport)}</Text>
                            <Text style={{color: AppColors.black, fontWeight: 'bold'}}>{' practice on '}</Text>
                            { user.training_schedule[sport].practice.days_of_week.length > 0 ?
                                <Text style={[styles.selectedText]}>{user.training_schedule[sport].practice.days_of_week}</Text>
                                :
                                <Text style={[styles.unselectedText]}>{'day(s)'}</Text>
                            }
                            <Text style={{color: AppColors.black, fontWeight: 'bold'}}>{' for '}</Text>
                        </Text>
                        <RNPickerSelect
                            hideIcon={true}
                            items={UserAccountConstants.competitionTimes}
                            onValueChange={(value) => this._handlePracticeTimeChange(sport, value)}
                            placeholder={{
                                label: 'minutes',
                                value: null,
                            }}
                            style={{inputIOS: [styles.pickerSelect], inputAndroid: [styles.pickerSelect]}}
                            value={user.training_schedule[sport].competition.duration_minutes}
                        />
                        <Text style={[AppFonts.h1, {textAlign: 'center'}]}>
                            <Text style={{color: AppColors.black, fontWeight: 'bold'}}>{' and compete on '}</Text>
                            { user.training_schedule[sport].competition.days_of_week.length > 0 ?
                                <Text style={[styles.selectedText]}>{user.training_schedule[sport].competition.days_of_week}</Text>
                                :
                                <Text style={[styles.unselectedText]}>{'day(s)'}</Text>
                            }
                        </Text>
                        <FormLabel>Practice</FormLabel>
                        <ButtonGroup
                            buttons={UserAccountConstants.possibleDaysOfWeek}
                            onPress={(index) => this._updateSportSchedulePractice(sport, index)}
                            selectedIndexes={selectedPracticeIndexes[sport] ? selectedPracticeIndexes[sport] : []}
                        />
                        <FormLabel>Competition</FormLabel>
                        <ButtonGroup
                            buttons={UserAccountConstants.possibleDaysOfWeek}
                            onPress={(index) => this._updateSportScheduleCompetition(sport, index)}
                            selectedIndexes={selectedCompetitionIndexes[sport] ? selectedCompetitionIndexes[sport] : []}
                        />
                    </View>
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
