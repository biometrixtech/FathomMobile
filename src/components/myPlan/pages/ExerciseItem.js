/**
 * ExerciseItem
 *
    <ExerciseItem
        exercise={exercise}
        isLastItem={i + 1 === exerciseList.length}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles } from '../../../constants';
import { Checkbox, Text } from '../../custom';

/* Component ==================================================================== */
const ExerciseItem = ({
    exercise,
    isLastItem,
}) => (
    <View style={[AppStyles.paddingVerticalSml]}>
        <View style={[AppStyles.paddingVerticalSml, {flexDirection: 'row', justifyContent: 'space-between',}]}>
            <View style={[{alignItems: 'center', alignSelf: 'flex-start', flex: 85, flexDirection: 'row',}]}>
                <Checkbox
                    checked={false}
                    containerStyle={{borderWidth: 0, margin: 0, padding: 0, width: 20, }}
                    onPress={() => console.log('MARK ME AS COMPLETED PLEASE')}
                    size={24}
                />
                <Text style={{color: AppColors.black, flexWrap: 'wrap', fontWeight: 'bold',}}>
                    {`${exercise.name.toUpperCase()}`}
                </Text>
            </View>
            <View style={{alignItems: 'center', alignSelf: 'flex-end', flex: 15, height: '100%', paddingRight: 10,}}>
                <Text style={{color: AppColors.secondary.blue.hundredPercent, fontWeight: 'bold'}}>
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
    exercise:   PropTypes.object.isRequired,
    isLastItem: PropTypes.bool.isRequired,
};
ExerciseItem.defaultProps = {};
ExerciseItem.componentName = 'ExerciseItem';

/* Export Component ================================================================== */
export default ExerciseItem;