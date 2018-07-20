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
import { View } from 'react-native';

// Consts and Libs
import { AppStyles, UserAccount as UserAccountConstants } from '@constants';
import { RadioButton } from '@custom';

/* Component ==================================================================== */
const UserWorkoutQuestion = ({ componentStep, currentStep, handleFormChange, user }) => (
    <View style={[AppStyles.paddingHorizontalSml, [componentStep === currentStep ? {} : {display: 'none'}] ]}>
        <RadioButton
            label={'Do you workout outside of practice?'}
            onChange={(option) => handleFormChange('workout_outside_practice', option)}
            options={UserAccountConstants.workoutOutsidePracticeOptions}
            value={user.workout_outside_practice}
        />
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
