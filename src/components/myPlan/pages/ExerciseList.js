/**
 * Exercise List
 *
    <ExerciseList
        completedExercises={this.state.completedExercises}
        exerciseList={exerciseList}
        handleCompleteExercise={this._handleCompleteExercise}
        toggleCompletedAMPMRecoveryModal={this._toggleCompletedAMPMRecoveryModal}
        toggleSelectedExercise={this._toggleSelectedExercise}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Text, } from '../../custom';

// Components
import { ExerciseListItem, } from './';

// import third-party libraries
import _ from 'lodash';

class ExerciseList extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const {
            completedExercises,
            exerciseList,
            handleCompleteExercise,
            isFSCompletedValid,
            isFunctionalStrength,
            isPrep,
            toggleCompletedAMPMRecoveryModal,
            toggleSelectedExercise,
        } = this.props;
        let { buttonTitle, isButtonDisabled, isButtonOutlined, buttonDisabledStyle, buttonColor, buttonBackgroundColor, } = MyPlanConstants.exerciseListButtonStyles(isPrep, completedExercises, isFSCompletedValid, isFunctionalStrength);
        return(
            <View style={{flex: 1,}}>
                <View>
                    {_.map(exerciseList.cleanedExerciseList, (exerciseIndex, index) =>
                        exerciseIndex.length > 0 ?
                            <View key={index}>
                                <Text robotoRegular style={[AppStyles.paddingVerticalSml, {fontSize: AppFonts.scaleFont(15), marginLeft: AppSizes.paddingMed,}]}>{index}</Text>
                                {_.map(exerciseIndex, (exercise, i) =>
                                    <ExerciseListItem
                                        completedExercises={completedExercises}
                                        exercise={exercise}
                                        handleCompleteExercise={handleCompleteExercise}
                                        isFunctionalStrength={isFunctionalStrength}
                                        isLastItem={i + 1 === exerciseList.totalLength}
                                        key={exercise.library_id+i}
                                        toggleSelectedExercise={toggleSelectedExercise}
                                    />
                                )}
                            </View>
                            :
                            null
                    )}
                    <Button
                        buttonStyle={{backgroundColor: buttonBackgroundColor, marginVertical: AppSizes.paddingSml, paddingVertical: AppSizes.paddingMed,}}
                        containerStyle={{marginHorizontal: AppSizes.padding,}}
                        disabledStyle={buttonDisabledStyle}
                        disabled={isButtonDisabled}
                        onPress={toggleCompletedAMPMRecoveryModal}
                        outlined={isButtonOutlined}
                        title={buttonTitle}
                        titleStyle={{color: isButtonDisabled ? AppColors.zeplin.greyText : buttonColor, fontSize: AppFonts.scaleFont(16),}}
                        type={isButtonDisabled ? 'outline' : 'solid'}
                    />
                </View>
            </View>
        )
    }
}

ExerciseList.propTypes = {
    completedExercises:               PropTypes.array.isRequired,
    exerciseList:                     PropTypes.object.isRequired,
    handleCompleteExercise:           PropTypes.func.isRequired,
    isFSCompletedValid:               PropTypes.bool,
    isFunctionalStrength:             PropTypes.bool,
    isPrep:                           PropTypes.bool,
    toggleCompletedAMPMRecoveryModal: PropTypes.func.isRequired,
    toggleSelectedExercise:           PropTypes.func.isRequired,
};

ExerciseList.defaultProps = {
    isFSCompletedValid:   false,
    isFunctionalStrength: false,
    isPrep:               false,
};

ExerciseList.componentName = 'ExerciseList';

/* Export Component ================================================================== */
export default ExerciseList;