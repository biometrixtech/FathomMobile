/**
 * ExerciseItem
 *
    <ExerciseItem
        completedExercises={completedExercises}
        exercise={exercise}
        handleCompleteExercise={handleCompleteExercise}
        isLastItem={i + 1 === exerciseList.length}
        toggleSelectedExercise={toggleSelectedExercise}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, MyPlan } from '../../../constants';
import { Checkbox, Text } from '../../custom';

/* Component ==================================================================== */
const ExerciseItem = ({
    completedExercises,
    exercise,
    handleCompleteExercise,
    isLastItem,
    toggleSelectedExercise,
}) => (
    <View style={[AppStyles.paddingTopSml]}>
        <View style={[AppStyles.paddingVerticalSml, {flex: 1, flexDirection: 'row', justifyContent: 'space-between',}]}>
            <View style={{justifyContent: 'center', flex: 1,}}>
                <Checkbox
                    checked={completedExercises.includes(exercise.library_id)}
                    checkedColor={AppColors.primary.yellow.hundredPercent}
                    checkedIcon={'check-square'}
                    containerStyle={{backgroundColor: AppColors.white, borderWidth: 0, margin: 0, padding: 0, width: 30, }}
                    onPress={() => handleCompleteExercise(exercise.library_id)}
                    size={11}
                />
            </View>
            <View style={{justifyContent: 'center', flex: 7,}}>
                <Text
                    onPress={() => toggleSelectedExercise(exercise, true)}
                    style={{
                        color:              completedExercises.includes(exercise.library_id) ? AppColors.primary.yellow.hundredPercent : AppColors.black,
                        flexWrap:           'wrap',
                        fontWeight:         'bold',
                        textDecorationLine: 'none',
                    }}
                >
                    {MyPlan.cleanExercise(exercise).displayName}
                </Text>
            </View>
            <View style={{justifyContent: 'center', flex: 2, paddingRight: 10,}}>
                <Text style={[AppStyles.textRightAligned, {color: completedExercises.includes(exercise.library_id) ? AppColors.primary.yellow.hundredPercent : AppColors.secondary.blue.hundredPercent, fontWeight: 'bold'}]}>
                    {MyPlan.cleanExercise(exercise).dosage}
                </Text>
            </View>
        </View>
        <View style={[isLastItem ? {} : {borderLeftWidth: 1, borderLeftColor: AppColors.primary.grey.thirtyPercent}, {marginLeft: 14}]}>
            <Text style={[AppStyles.paddingVerticalMed, AppStyles.paddingHorizontal, {color: AppColors.primary.grey.thirtyPercent}]}>{''}</Text>
        </View>
    </View>
);

ExerciseItem.propTypes = {
    completedExercises:     PropTypes.array.isRequired,
    exercise:               PropTypes.object.isRequired,
    handleCompleteExercise: PropTypes.func.isRequired,
    isLastItem:             PropTypes.bool.isRequired,
    toggleSelectedExercise: PropTypes.func.isRequired,
};
ExerciseItem.defaultProps = {};
ExerciseItem.componentName = 'ExerciseItem';

/* Export Component ================================================================== */
export default ExerciseItem;