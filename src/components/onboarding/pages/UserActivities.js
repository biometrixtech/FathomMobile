/**
 * UserActivities
 *
    <UserActivities
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
import { Text, FormLabel } from '../../custom';

// import third-party libraries
import { ButtonGroup } from 'react-native-elements';
import _ from 'lodash';

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
class UserActivities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedActvitiesIndexes:      [],
            selectedDaysIndexes:           [],
            selectedTotalDurationsIndexes: [],
        };
    }

    _updateActivitiesActvities = (index) => {
        const { handleFormChange, user } = this.props;
        const { selectedActvitiesIndexes } = this.state;
        // upate our state - for button styling
        let newIndexesArray = _.cloneDeep(selectedActvitiesIndexes);
        if(newIndexesArray && newIndexesArray.indexOf(index) > -1) {
            newIndexesArray.splice(newIndexesArray.indexOf(index), 1)
        } else {
            newIndexesArray.push(index);
        }
        this.setState({ selectedActvitiesIndexes: newIndexesArray });
        // dynamically update our training_strength_conditioning object for the user
        let newActivitiesActivities = _.cloneDeep(user.training_strength_conditioning);
        newActivitiesActivities.activities = newIndexesArray.map(value => UserAccountConstants.possibleActivities.value[value]).join(',');
        handleFormChange('training_strength_conditioning', newActivitiesActivities);
    };

    _updateActivitiesDays = (index) => {
        const { handleFormChange, user } = this.props;
        const { selectedDaysIndexes } = this.state;
        // upate our state - for button styling
        let newIndexesArray = _.cloneDeep(selectedDaysIndexes);
        if(newIndexesArray && newIndexesArray.indexOf(index) > -1) {
            newIndexesArray.splice(newIndexesArray.indexOf(index), 1)
        } else {
            newIndexesArray.push(index);
        }
        this.setState({ selectedDaysIndexes: newIndexesArray });
        // dynamically update our training_strength_conditioning object for the user
        let newActivitiesDays = _.cloneDeep(user.training_strength_conditioning);
        newActivitiesDays.days = newIndexesArray.map(value => UserAccountConstants.possibleShorthandDaysOfWeek[value]).join(',');
        handleFormChange('training_strength_conditioning', newActivitiesDays);
    };

    _updateActivitiesDurations = (index) => {
        const { handleFormChange, user } = this.props;
        const { selectedTotalDurationsIndexes } = this.state;
        // upate our state - for button styling
        let newIndexesArray = _.cloneDeep(selectedTotalDurationsIndexes);
        if(newIndexesArray && newIndexesArray.indexOf(index) > -1) {
            newIndexesArray.splice(newIndexesArray.indexOf(index), 1)
        } else {
            newIndexesArray.push(index);
        }
        this.setState({ selectedTotalDurationsIndexes: newIndexesArray });
        // dynamically update our training_strength_conditioning object for the user
        let newActivitiesDurations = _.cloneDeep(user.training_strength_conditioning);
        newActivitiesDurations.durations = _.meanBy(newIndexesArray, i => UserAccountConstants.activitiesTimes[i].value);
        newActivitiesDurations.totalDurations = newIndexesArray.map(value => UserAccountConstants.activitiesTimes[value].label).join(',');
        handleFormChange('training_strength_conditioning', newActivitiesDurations);
    };

    render = () => {
        const {
            componentStep,
            currentStep,
            user,
        } = this.props;
        const {
            selectedActvitiesIndexes,
            selectedDaysIndexes,
            selectedTotalDurationsIndexes,
        } = this.state;
        return (
            <View style={[styles.wrapper, [componentStep === currentStep ? {} : {display: 'none'}] ]}>
                <Text style={[AppFonts.h1, {textAlign: 'center'}]}>
                    <Text style={[AppStyles.textBold, {color: AppColors.black}]}>{'I do '}</Text>
                    { user.training_strength_conditioning.activities.length > 0 ?
                        <Text style={[styles.selectedText]}>{selectedActvitiesIndexes.map(value => UserAccountConstants.possibleActivities.label[value]).join(',')}</Text>
                        :
                        <Text style={[styles.unselectedText]}>{'activity'}</Text>
                    }
                    <Text style={[AppStyles.textBold, {color: AppColors.black}]}>{' on '}</Text>
                    { user.training_strength_conditioning.days.length > 0 ?
                        <Text style={[styles.selectedText]}>{user.training_strength_conditioning.days}</Text>
                        :
                        <Text style={[styles.unselectedText]}>{'day(s)'}</Text>
                    }
                    <Text style={[AppStyles.textBold, {color: AppColors.black}]}>{' for '}</Text>
                    { user.training_strength_conditioning.totalDurations.length > 0 ?
                        <Text style={[styles.selectedText]}>{user.training_strength_conditioning.totalDurations}</Text>
                        :
                        <Text style={[styles.unselectedText]}>{'minutes'}</Text>
                    }
                </Text>
                <ButtonGroup
                    buttons={UserAccountConstants.possibleActivities.label}
                    onPress={(index) => this._updateActivitiesActvities(index)}
                    selectedIndexes={selectedActvitiesIndexes}
                />
                <ButtonGroup
                    buttons={UserAccountConstants.possibleDaysOfWeek}
                    onPress={(index) => this._updateActivitiesDays(index)}
                    selectedIndexes={selectedDaysIndexes}
                />
                <ButtonGroup
                    buttons={UserAccountConstants.activitiesTimes.map(time => time.label)}
                    onPress={(index) => this._updateActivitiesDurations(index)}
                    selectedIndexes={selectedTotalDurationsIndexes}
                />
            </View>
        );
    }
}

UserActivities.propTypes = {
    componentStep:    PropTypes.number.isRequired,
    currentStep:      PropTypes.number.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    user:             PropTypes.object.isRequired,
};
UserActivities.defaultProps = {};
UserActivities.componentName = 'UserActivities';

/* Export Component ==================================================================== */
export default UserActivities;
