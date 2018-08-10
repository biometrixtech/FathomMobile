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
import { Image, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppStyles, MyPlan } from '../../../constants';
import { Checkbox, TabIcon, Text } from '../../custom';

/* Component ==================================================================== */
const ExerciseItem = ({
    completedExercises,
    exercise,
    handleCompleteExercise,
    isLastItem,
    toggleSelectedExercise,
}) => (
    <View style={[AppStyles.paddingVerticalXSml, {borderTopWidth: 1, borderTopColor: AppColors.zeplin.lightGrey, marginHorizontal: 10}]}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
            <View style={{flex: 1, justifyContent: 'center',}}>
                <Checkbox
                    checked={completedExercises.includes(exercise.library_id)}
                    checkedColor={AppColors.primary.yellow.hundredPercent}
                    checkedIcon={'check-square'}
                    containerStyle={{backgroundColor: AppColors.white, borderWidth: 0, margin: 0, padding: 0, width: 30, }}
                    onPress={() => handleCompleteExercise(exercise.library_id)}
                    size={20}
                />
            </View>
            <TouchableOpacity
                onPress={() => toggleSelectedExercise(exercise, true)}
                style={[AppStyles.paddingHorizontalMed, {flex: 2,}]}
            >
                <Image
                    resizeMode={'contain'}
                    source={{uri: MyPlan.cleanExercise(exercise).thumbnailUrl}}
                    style={{height: 70, width: 70}}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => toggleSelectedExercise(exercise, true)}
                style={{flex: 6, justifyContent: 'center',}}
            >
                <Text
                    p
                    oswaldMedium
                    style={{
                        color:    completedExercises.includes(exercise.library_id) ? AppColors.primary.yellow.hundredPercent : AppColors.black,
                        flexWrap: 'wrap',
                        fontSize: AppFonts.scaleFont(16),
                    }}
                >
                    {MyPlan.cleanExercise(exercise).displayName}
                </Text>
                <Text
                    p
                    robotoBold
                    style={{
                        color:    completedExercises.includes(exercise.library_id) ? AppColors.primary.yellow.hundredPercent : AppColors.secondary.blue.hundredPercent,
                        fontSize: AppFonts.scaleFont(15),
                    }}
                >
                    {MyPlan.cleanExercise(exercise).dosage}
                </Text>
            </TouchableOpacity>
            <TabIcon
                color={completedExercises.includes(exercise.library_id) ? AppColors.primary.yellow.hundredPercent : AppColors.black}
                containerStyle={[{flex: 1, justifyContent: 'center',}]}
                icon={'arrow-right'}
                onPress={() => toggleSelectedExercise(exercise, true)}
                size={24}
                type={'simple-line-icon'}
            />
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