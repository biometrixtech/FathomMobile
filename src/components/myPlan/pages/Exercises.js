/**
 * ReadinessSurvey
 *
    <Exercises
        completedExercises={this.state.completedExercises}
        exerciseList={exerciseList}
        handleCompleteExercise={this._handleCompleteExercise}
        handleExerciseListRefresh={this._handleExerciseListRefresh}
        isExerciseListRefreshing={this.state.isExerciseListRefreshing}
        toggleCompletedAMPMRecoveryModal={this._toggleCompletedAMPMRecoveryModal}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, } from '@constants';
import { Text } from '@custom';

// Components
import { ExerciseItem } from './';

// import third-party libraries
import _ from 'lodash';

/* Component ==================================================================== */
const Exercises = ({
    completedExercises,
    exerciseList,
    handleCompleteExercise,
    handleExerciseListRefresh,
    isExerciseListRefreshing,
    toggleCompletedAMPMRecoveryModal,
}) => (
    <View style={{flex: 1}}>
        <ScrollView
            contentContainerStyle={exerciseList.length > 0 ? {flexGrow: 1, justifyContent: 'center'} : {}}
            refreshControl={
                <RefreshControl
                    colors={[AppColors.primary.yellow.hundredPercent]}
                    onRefresh={handleExerciseListRefresh}
                    refreshing={isExerciseListRefreshing}
                    title={'Loading...'}
                    titleColor={AppColors.primary.yellow.hundredPercent}
                    tintColor={AppColors.primary.yellow.hundredPercent}
                />
            }
        >
            { exerciseList.length > 0 ?
                <View>
                    {_.map(exerciseList, (exercise, i) =>
                        <ExerciseItem
                            completedExercises={completedExercises}
                            exercise={exercise}
                            handleCompleteExercise={handleCompleteExercise}
                            isLastItem={i + 1 === exerciseList.length}
                            key={exercise.library_id+i}
                        />
                    )}
                    { completedExercises.length > 0 ?
                        <TouchableOpacity
                            onPress={toggleCompletedAMPMRecoveryModal}
                            style={[AppStyles.nextButtonWrapper]}
                        >
                            <Text style={[AppStyles.nextButtonText]}>{'Finish'}</Text>
                        </TouchableOpacity>
                        :
                        <View style={[AppStyles.nextButtonWrapper, {backgroundColor: AppColors.primary.grey.hundredPercent}]}>
                            <Text style={[AppStyles.nextButtonText]}>{'complete the exercises to log'}</Text>
                        </View>
                    }
                </View>
                :
                <View style={[AppStyles.paddingHorizontal]}>
                    <Text style={[AppStyles.textCenterAligned, AppStyles.h3]}>{'Based on the discomfort reporting we recommend you rest and utilize available self-care techniques to help reduce swelling, ease pain, and speed up healing. If you have pain or swelling that gets worse or doesn’t go away, please seek appropriate medical attention.'}</Text>
                </View>
            }
        </ScrollView>
    </View>
);

Exercises.propTypes = {
    completedExercises:               PropTypes.array.isRequired,
    exerciseList:                     PropTypes.array.isRequired,
    handleCompleteExercise:           PropTypes.func.isRequired,
    handleExerciseListRefresh:        PropTypes.func.isRequired,
    isExerciseListRefreshing:         PropTypes.bool.isRequired,
    toggleCompletedAMPMRecoveryModal: PropTypes.func.isRequired,
};
Exercises.defaultProps = {};
Exercises.componentName = 'Exercises';

/* Export Component ================================================================== */
export default Exercises;