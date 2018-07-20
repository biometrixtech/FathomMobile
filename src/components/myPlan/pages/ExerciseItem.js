/**
 * ExerciseItem
 *
    <ExerciseItem
        completedExercises={completedExercises}
        exercise={exercise}
        handleCompleteExercise={handleCompleteExercise}
        isLastItem={i + 1 === exerciseList.length}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles } from '@constants';
import { Checkbox, Text } from '@custom';

/* Component ==================================================================== */
const ExerciseItem = ({
    completedExercises,
    exercise,
    handleCompleteExercise,
    isLastItem,
}) => (
    <View style={[AppStyles.paddingVerticalSml]}>
        <View style={[AppStyles.paddingVerticalSml, {flex: 1, flexDirection: 'row', justifyContent: 'space-between',}]}>
            <View style={{justifyContent: 'center', flex: 0.1,}}>
                <Checkbox
                    checked={completedExercises.includes(exercise.library_id)}
                    checkedColor={AppColors.primary.yellow.hundredPercent}
                    checkedIcon={'check-square'}
                    containerStyle={{backgroundColor: AppColors.white, borderWidth: 0, margin: 0, padding: 0, width: 30, }}
                    onPress={() => handleCompleteExercise(exercise.library_id)}
                    size={26}
                />
            </View>
            <View style={{justifyContent: 'center', flex: 0.7,}}>
                <Text style={{color: completedExercises.includes(exercise.library_id) ? AppColors.primary.yellow.hundredPercent : AppColors.black, flexWrap: 'wrap', fontWeight: 'bold',}}>
                    {`${exercise.name.toUpperCase()}`}
                </Text>
            </View>
            <View style={{justifyContent: 'center', flex: 0.2, paddingRight: 10,}}>
                <Text style={[AppStyles.textRightAligned, {color: completedExercises.includes(exercise.library_id) ? AppColors.primary.yellow.hundredPercent : AppColors.secondary.blue.hundredPercent, fontWeight: 'bold'}]}>
                    {`${exercise.sets_assigned}x ${exercise.reps_assigned}${exercise.unit_of_measure === 'seconds' ? 's' : ''}`}
                </Text>
            </View>
        </View>
        <View style={[isLastItem ? {} : {borderLeftWidth: 1, borderLeftColor: AppColors.primary.grey.thirtyPercent}, {marginLeft: 20}]}>
            <Text style={[AppStyles.paddingVerticalMed, AppStyles.paddingHorizontal, {color: AppColors.primary.grey.thirtyPercent}]}>{''}</Text>
        </View>
    </View>
);

ExerciseItem.propTypes = {
    completedExercises:     PropTypes.array.isRequired,
    exercise:               PropTypes.object.isRequired,
    handleCompleteExercise: PropTypes.func.isRequired,
    isLastItem:             PropTypes.bool.isRequired,
};
ExerciseItem.defaultProps = {};
ExerciseItem.componentName = 'ExerciseItem';

/* Export Component ================================================================== */
export default ExerciseItem;