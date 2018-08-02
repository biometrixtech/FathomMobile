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
        toggleSelectedExercise={this._toggleSelectedExercise}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, } from '../../../constants';
import { Text } from '../../custom';

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
    toggleSelectedExercise,
}) => (
    <View style={{flex: 1}}>
        <ScrollView
            contentContainerStyle={exerciseList.totalLength > 0 ? {} : {flexGrow: 1, justifyContent: 'center'}}
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
            { exerciseList.totalLength > 0 ?
                <View>
                    {_.map(exerciseList.cleanedExerciseList, (exerciseIndex, index) =>
                        exerciseIndex[0].length > 0 ?
                            <View key={index}>
                                <Text style={[AppStyles.paddingVerticalSml, {marginLeft: 14}]}>{index}</Text>
                                <View style={{borderLeftWidth: 1, borderLeftColor: AppColors.primary.grey.thirtyPercent, marginLeft: 14, height: 10}} />
                                {_.map(exerciseIndex[0], (exercise, i) =>
                                    <ExerciseItem
                                        completedExercises={completedExercises}
                                        exercise={exercise}
                                        handleCompleteExercise={handleCompleteExercise}
                                        isLastItem={i + 1 === exerciseList.totalLength}
                                        key={exercise.library_id+i}
                                        toggleSelectedExercise={toggleSelectedExercise}
                                    />
                                )}
                            </View>
                            :
                            null
                    )}
                    { completedExercises.length > 0 ?
                        <TouchableOpacity
                            onPress={toggleCompletedAMPMRecoveryModal}
                            style={[AppStyles.nextButtonWrapper]}
                        >
                            <Text style={[AppStyles.nextButtonText]}>{'Recovery Complete'}</Text>
                        </TouchableOpacity>
                        :
                        <View style={[AppStyles.nextButtonWrapper, {backgroundColor: AppColors.primary.grey.fiftyPercent}]}>
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
    exerciseList:                     PropTypes.object.isRequired,
    handleCompleteExercise:           PropTypes.func.isRequired,
    handleExerciseListRefresh:        PropTypes.func.isRequired,
    isExerciseListRefreshing:         PropTypes.bool.isRequired,
    toggleCompletedAMPMRecoveryModal: PropTypes.func.isRequired,
    toggleSelectedExercise:           PropTypes.func.isRequired,
};
Exercises.defaultProps = {};
Exercises.componentName = 'Exercises';

/* Export Component ================================================================== */
export default Exercises;