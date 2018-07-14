/**
 * ReadinessSurvey
 *
    <Exercises
        recoveryObj={recoveryObj}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants } from '../../../constants';
import { Text } from '../../custom';

// Components
import { ExerciseItem } from './';

// import third-party libraries
import _ from 'lodash';

/* Component ==================================================================== */
const Exercises = ({
    recoveryObj
}) => {
    let exerciseList = MyPlanConstants.cleanExerciseList(recoveryObj);
    return(
        <View style={{flex: 1}}>
            <ScrollView>
                {_.map(exerciseList, (exercise, i) =>
                    <ExerciseItem
                        exercise={exercise}
                        isLastItem={i + 1 === exerciseList.length}
                        key={exercise.library_id}
                    />
                )}
                <TouchableOpacity
                    disabled={true}
                    onPress={() => console.log('TAKE ME TO MESSAGE MODAL')}
                    style={[AppStyles.nextButtonWrapper, {backgroundColor: AppColors.primary.grey.hundredPercent}]}
                >
                    <Text style={[AppStyles.nextButtonText]}>{'complete the exercises to log'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
};

Exercises.propTypes = {
    recoveryObj: PropTypes.object.isRequired,
};
Exercises.defaultProps = {};
Exercises.componentName = 'Exercises';

/* Export Component ================================================================== */
export default Exercises;