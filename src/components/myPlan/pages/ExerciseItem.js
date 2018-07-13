/**
 * ExerciseItem
 *
    <ExerciseItem
        exercise={exercise}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles } from '../../../constants';
import { Checkbox, Text } from '../../custom';

/* Component ==================================================================== */
const ExerciseItem = ({
    exercise,
}) => (
    <View style={[AppStyles.containerCentered, AppStyles.paddingVertical, AppStyles.paddingHorizontal, AppStyles.row, {justifyContent: 'space-between'}]}>
        <View style={[AppStyles.containerCentered, AppStyles.row, {flexWrap: 'wrap'}]}>
            <Checkbox
                checked={false}
                containerStyle={{backgroundColor: AppColors.white, width: 20, borderWidth: 0, padding: 0, margin: 0}}
                onPress={() => console.log('MARK ME AS COMPLETED PLEASE')}
                size={24}
            />
            <Text style={{color: AppColors.black, fontWeight: 'bold'}}>{`${exercise.name.toUpperCase()}`}</Text>
        </View>
        <Text style={{color: AppColors.secondary.blue.hundredPercent, fontWeight: 'bold'}}>{`${exercise.sets_assigned}x ${exercise.reps_assigned} ${exercise.unit_of_measure === 'seconds' ? 's' : ''}`}</Text>
    </View>
);

ExerciseItem.propTypes = {
    exercise: PropTypes.object.isRequired,
};
ExerciseItem.defaultProps = {};
ExerciseItem.componentName = 'ExerciseItem';

/* Export Component ================================================================== */
export default ExerciseItem;