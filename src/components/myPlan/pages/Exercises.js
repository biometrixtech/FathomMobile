/**
 * ReadinessSurvey
 *
    <Exercises
        completedExercises={this.state.completedExercises}
        exerciseList={exerciseList}
        handleCompleteExercise={this._handleCompleteExercise}
        handleExerciseListRefresh={this._handleExerciseListRefresh}
        isExerciseListRefreshing={this.state.isExerciseListRefreshing}
        isLoading={this.state.loading}
        toggleCompletedAMPMRecoveryModal={this._toggleCompletedAMPMRecoveryModal}
        toggleSelectedExercise={this._toggleSelectedExercise}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Button, Text, } from '../../custom';

// Components
import { ExerciseItem, } from './';

// import third-party libraries
import _ from 'lodash';
import Modal from 'react-native-modalbox';

/* Component ==================================================================== */
const Exercises = ({
    completedExercises,
    exerciseList,
    handleCompleteExercise,
    handleExerciseListRefresh,
    isExerciseListRefreshing,
    isLoading,
    toggleCompletedAMPMRecoveryModal,
    toggleSelectedExercise,
}) => (
    <View style={{flex: 1}}>
        { exerciseList.totalLength > 0 ?
            <View>
                {_.map(exerciseList.cleanedExerciseList, (exerciseIndex, index) =>
                    exerciseIndex.length > 0 ?
                        <View key={index}>
                            <Text robotoRegular style={[AppStyles.paddingVerticalSml, {marginLeft: 14, fontSize: AppFonts.scaleFont(15)}]}>{index}</Text>
                            {_.map(exerciseIndex, (exercise, i) =>
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
                    <Button
                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                        buttonStyle={{borderRadius: 0, marginVertical: AppSizes.paddingSml, paddingVertical: AppSizes.paddingMed}}
                        color={AppColors.white}
                        fontFamily={AppStyles.robotoBold.fontFamily}
                        fontWeight={AppStyles.robotoBold.fontWeight}
                        onPress={toggleCompletedAMPMRecoveryModal}
                        rounded={false}
                        textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                        title={'Recovery Complete'}
                    />
                    :
                    <Button
                        backgroundColor={AppColors.white}
                        buttonStyle={{borderRadius: 0, marginVertical: AppSizes.paddingSml, paddingVertical: AppSizes.paddingMed}}
                        color={AppColors.primary.yellow.hundredPercent}
                        fontFamily={AppStyles.robotoBold.fontFamily}
                        fontWeight={AppStyles.robotoBold.fontWeight}
                        onPress={() => null}
                        outlined
                        raised={false}
                        textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                        title={'Check Boxes to Complete Recovery'}
                    />
                }
            </View>
            :
            <View style={[AppStyles.paddingHorizontal, AppStyles.paddingVertical]}>
                <Text robotoRegular style={[AppStyles.textCenterAligned, { fontSize: AppFonts.scaleFont(15) }]}>{'Based on the discomfort reporting we recommend you rest and utilize available self-care techniques to help reduce swelling, ease pain, and speed up healing. If you have pain or swelling that gets worse or doesn’t go away, please seek appropriate medical attention.'}</Text>
            </View>
        }
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
);

Exercises.propTypes = {
    completedExercises:               PropTypes.array.isRequired,
    exerciseList:                     PropTypes.object.isRequired,
    handleCompleteExercise:           PropTypes.func.isRequired,
    handleExerciseListRefresh:        PropTypes.func.isRequired,
    isExerciseListRefreshing:         PropTypes.bool.isRequired,
    isLoading:                        PropTypes.bool.isRequired,
    toggleCompletedAMPMRecoveryModal: PropTypes.func.isRequired,
    toggleSelectedExercise:           PropTypes.func.isRequired,
};
Exercises.defaultProps = {};
Exercises.componentName = 'Exercises';

/* Export Component ================================================================== */
export default Exercises;