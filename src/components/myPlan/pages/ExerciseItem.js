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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppStyles, MyPlan } from '../../../constants';
import { Checkbox, TabIcon, Text } from '../../custom';

/* Component ==================================================================== */
class ExerciseItem extends Component {
    constructor(props) {
        super(props);
        let cleanedExercise = MyPlan.cleanExercise(this.props.exercise);
        this.state = {
            displayName:    cleanedExercise.displayName,
            dosage:         cleanedExercise.dosage,
            imageThumbnail: {uri: cleanedExercise.thumbnailUrl},
        };
    }

    render = () => {
        const { completedExercises, exercise, handleCompleteExercise, isLastItem, toggleSelectedExercise, } = this.props;
        return(
            <View style={[{borderTopWidth: 1, borderTopColor: AppColors.zeplin.lightGrey, marginHorizontal: 10}]}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                    <View style={[AppStyles.paddingVerticalXSml, {flex: 1, justifyContent: 'center',}]}>
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
                        style={[AppStyles.paddingHorizontalMed, {flex: 2, justifyContent: 'center',}]}
                    >
                        <Image
                            onError={(e) => this.setState({ imageThumbnail: require('../../../../assets/images/standard/icon.png'), }) }
                            resizeMode={'contain'}
                            source={this.state.imageThumbnail}
                            style={{height: 75, width: 75,}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => toggleSelectedExercise(exercise, true)}
                        style={[AppStyles.paddingVerticalXSml, {flex: 6, justifyContent: 'center',}]}
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
                            {this.state.displayName}
                        </Text>
                        <Text
                            p
                            robotoBold
                            style={{
                                color:    completedExercises.includes(exercise.library_id) ? AppColors.primary.yellow.hundredPercent : AppColors.secondary.blue.hundredPercent,
                                fontSize: AppFonts.scaleFont(15),
                            }}
                        >
                            {this.state.dosage}
                        </Text>
                    </TouchableOpacity>
                    <TabIcon
                        color={completedExercises.includes(exercise.library_id) ? AppColors.primary.yellow.hundredPercent : AppColors.black}
                        containerStyle={[{flex: 1, justifyContent: 'center',}]}
                        icon={'arrow-right'}
                        onPress={() => toggleSelectedExercise(exercise, true)}
                        size={18}
                        type={'simple-line-icon'}
                    />
                </View>
            </View>
        )
    }
}

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