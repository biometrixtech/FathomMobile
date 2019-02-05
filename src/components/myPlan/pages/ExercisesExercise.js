/**
 * Exercises Exercise
 *
    <ExercisesExercise
        completedExercises={completedExercises}
        exercise={exercise}
        exerciseTimer={timers[index] && timers[index].seconds_per_set ? timers[index] : null}
        progressPillsHeight={progressPillsHeight}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { ProgressCircle, Spacer, TabIcon, Text, } from '../../custom';

/* Component ==================================================================== */
const ExercisesExercise = ({
    completedExercises,
    exercise,
    exerciseTimer,
    progressPillsHeight,
}) => {
    let areAllTimersCompleted = completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? true : false
    let displayNameFontSize = (progressPillsHeight === AppSizes.screen.height) ? AppFonts.scaleFont(22) : AppFonts.scaleFont(28);
    let timerWrapperHeight = (AppFonts.scaleFont(56) + (AppSizes.padding * 2));
    return(
        <View style={{paddingHorizontal: AppSizes.paddingMed, width: AppSizes.screen.width * 0.85,}}>
            <Spacer size={10} />
            <View style={{flexDirection: 'row',}}>
                <View style={{flex: 1,}} />
                <View style={{flex: 8,}}>
                    <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkNavy, fontSize: displayNameFontSize,}]}>
                        {exercise.displayName}
                    </Text>
                </View>
                <View style={{flex: 1,}}>
                    <TabIcon
                        color={AppColors.zeplin.lightSlate}
                        icon={'help'}
                        reverse={false}
                        type={'material'}
                    />
                </View>
            </View>
            <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(14),}]}>
                {exercise.longDosage.toUpperCase()}
            </Text>
            <Spacer size={10} />
            <View style={{alignItems: 'center', flexDirection: 'row', height: timerWrapperHeight, justifyContent: exerciseTimer ? 'space-between' : 'center',}}>
                { exerciseTimer ?
                    <View>
                        { areAllTimersCompleted ?
                            <TabIcon
                                color={AppColors.zeplin.lightSlate}
                                containerStyle={[{alignSelf: 'center', margin: AppSizes.padding,}]}
                                icon={'restore'}
                                reverse={false}
                                size={AppFonts.scaleFont(40)}
                                type={'material'}
                            />
                            :
                            <TabIcon
                                color={AppColors.zeplin.lightSlate}
                                containerStyle={[{alignSelf: 'center', margin: AppSizes.padding,}]}
                                icon={'play-arrow'}
                                reverse={false}
                                size={AppFonts.scaleFont(40)}
                                type={'material'}
                            />
                        }
                    </View>
                    :
                    null
                }
                { exerciseTimer ?
                    <View>
                        { areAllTimersCompleted ?
                            <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(56),}}>{'00:00'}</Text>
                            :
                            <ProgressCircle
                                animated={true}
                                borderWidth={0}
                                color={AppColors.zeplin.seaBlue}
                                formatText={'5'}
                                indeterminate={false}
                                progress={0}
                                showsText={true}
                                size={timerWrapperHeight}
                                strokeCap={'round'}
                                textStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(56),}}
                                thickness={5}
                                unfilledColor={AppColors.zeplin.superLight}
                            />
                        }
                    </View>
                    :
                    null
                }
                <View>
                    <TabIcon
                        color={completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? AppColors.zeplin.yellow : AppColors.zeplin.lightSlate}
                        containerStyle={[{alignSelf: 'center', margin: AppSizes.padding,}]}
                        icon={completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? 'ios-checkbox' : 'ios-checkbox-outline'}
                        reverse={false}
                        size={50}
                        type={'ionicon'}
                    />
                </View>
            </View>
            <Spacer size={10} />
        </View>
    )
};

ExercisesExercise.propTypes = {
    completedExercises:  PropTypes.array.isRequired,
    exercise:            PropTypes.object.isRequired,
    exerciseTimer:       PropTypes.object,
    progressPillsHeight: PropTypes.number.isRequired,
};

ExercisesExercise.defaultProps = {
    exerciseTimer: null,
};

ExercisesExercise.componentName = 'ExercisesExercise';

/* Export Component ================================================================== */
export default ExercisesExercise;