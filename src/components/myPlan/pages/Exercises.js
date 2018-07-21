/**
 * ReadinessSurvey
 *
    <Exercises
        handleExerciseListRefresh={this._handleExerciseListRefresh}
        isExerciseListRefreshing={this.state.isExerciseListRefreshing}
        recoveryObj={recoveryObj}
        toggleCompletedAMPMRecoveryModal={this._toggleCompletedAMPMRecoveryModal}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants } from '../../../constants';
import { Text } from '../../custom';

// Components
import { ExerciseItem } from './';

// import third-party libraries
import _ from 'lodash';

/* Component ==================================================================== */
const Exercises = ({
    handleExerciseListRefresh,
    isExerciseListRefreshing,
    recoveryObj,
    toggleCompletedAMPMRecoveryModal,
}) => {
    let exerciseList = MyPlanConstants.cleanExerciseList(recoveryObj);
    return(
        <View style={{flex: 1}}>
            <ScrollView
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
                                exercise={exercise}
                                isLastItem={i + 1 === exerciseList.length}
                                key={exercise.library_id+i}
                            />
                        )}
                        <View style={[AppStyles.nextButtonWrapper, {backgroundColor: AppColors.primary.grey.hundredPercent}]}>
                            <Text style={[AppStyles.nextButtonText]}>{'complete the exercises to log'}</Text>
                        </View>
                        {/* // TODO: when it comes time to mark exercises as completd, this button should show up if one item is marked as completed
                          <TouchableOpacity
                          onPress={toggleCompletedAMPMRecoveryModal}
                          style={[AppStyles.nextButtonWrapper]}
                          >
                          <Text style={[AppStyles.nextButtonText]}>{'Finish'}</Text>
                          </TouchableOpacity>*/}
                    </View>
                    :
                    <View></View>
                }
            </ScrollView>
        </View>
    )
};

Exercises.propTypes = {
    handleExerciseListRefresh:        PropTypes.func.isRequired,
    isExerciseListRefreshing:         PropTypes.bool.isRequired,
    recoveryObj:                      PropTypes.object.isRequired,
    toggleCompletedAMPMRecoveryModal: PropTypes.func.isRequired,
};
Exercises.defaultProps = {};
Exercises.componentName = 'Exercises';

/* Export Component ================================================================== */
export default Exercises;