/**
 * UserWorkoutQuestion
 *
   <UserWorkoutQuestion
       componentStep={4}
       currentStep={step}
       handleFormChange={this._handleUserFormChange}
       user={form_fields.user}
   />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

// Consts and Libs
import { AppColors,AppStyles, UserAccount as UserAccountConstants } from '../../../constants';
import { RadioButton, Text } from '../../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    wrapper: {
        paddingLeft:  20,
        paddingRight: 20,
    }
});

/* Component ==================================================================== */
const UserWorkoutQuestion = ({ componentStep, currentStep, handleFormChange, user }) => (
    <View style={[AppStyles.paddingHorizontalSml, styles.wrapper, [componentStep === currentStep ? {flex: 1} : {display: 'none'}] ]}>
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Text h1 style={{color: AppColors.black, textAlign: 'center'}}>{'Do you workout'}</Text>
            <Text h1 style={{color: AppColors.black, textAlign: 'center'}}>{'outside of'}</Text>
            <Text h1 style={{color: AppColors.black, textAlign: 'center'}}>{'practice?'}</Text>
            <RadioButton
                color={`${AppColors.primary.grey.eightyPercent}80`}
                label={''}
                onChange={(option) => handleFormChange('workout_outside_practice', option)}
                options={UserAccountConstants.workoutOutsidePracticeOptions}
                style={{justifyContent: 'space-evenly'}}
                value={user.workout_outside_practice}
            />
        </View>
    </View>
);

UserWorkoutQuestion.propTypes = {
    componentStep:    PropTypes.number.isRequired,
    currentStep:      PropTypes.number.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    user:             PropTypes.object.isRequired,
};
UserWorkoutQuestion.defaultProps = {};
UserWorkoutQuestion.componentName = 'UserWorkoutQuestion';

/* Export Component ==================================================================== */
export default UserWorkoutQuestion;
