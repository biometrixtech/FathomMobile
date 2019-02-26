/**
 * Exercise List
 *
    <ExerciseList
        completedExercises={this.state.completedExercises}
        exerciseList={exerciseList}
        handleCompleteExercise={this._handleCompleteExercise}
        isLoading={this.state.loading}
        toggleCompletedAMPMRecoveryModal={this._toggleCompletedAMPMRecoveryModal}
        toggleSelectedExercise={this._toggleSelectedExercise}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Spacer, Text, } from '../../custom';

// Components
import { ExerciseListItem, } from './';

// import third-party libraries
import _ from 'lodash';
import Modal from 'react-native-modalbox';

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
            isLoading,
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
                        backgroundColor={buttonBackgroundColor}
                        buttonStyle={{borderRadius: 0, marginVertical: AppSizes.paddingSml, paddingVertical: AppSizes.paddingMed}}
                        color={isButtonDisabled ? AppColors.zeplin.greyText : buttonColor}
                        disabledStyle={buttonDisabledStyle}
                        disabled={isButtonDisabled}
                        fontFamily={AppStyles.robotoBold.fontFamily}
                        fontWeight={AppStyles.robotoBold.fontWeight}
                        onPress={toggleCompletedAMPMRecoveryModal}
                        outlined={isButtonOutlined}
                        raised={false}
                        textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                        title={buttonTitle}
                    />
                </View>
                <Modal
                    backdrop={false}
                    backdropColor={'transparent'}
                    backdropPressToClose={false}
                    coverScreen={true}
                    isOpen={isLoading}
                    style={{backgroundColor: AppColors.transparent,}}
                    swipeToClose={false}
                >
                    <ActivityIndicator
                        color={AppColors.primary.yellow.hundredPercent}
                        size={'large'}
                        style={[AppStyles.activityIndicator]}
                    />
                </Modal>
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
    isLoading:                        PropTypes.bool.isRequired,
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