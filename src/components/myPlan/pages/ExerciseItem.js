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
import { TabIcon, Text } from '../../custom';

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
                    <TouchableOpacity
                        onPress={() => handleCompleteExercise(exercise.library_id)}
                        style={[AppStyles.paddingVerticalXSml, {flex: 1, justifyContent: 'center',}]}
                    >
                        <TabIcon
                            containerStyle={[{alignSelf: 'center'}]}
                            icon={completedExercises.includes(exercise.library_id) ? 'ios-checkbox' : 'ios-checkbox-outline'}
                            iconStyle={[{color: completedExercises.includes(exercise.library_id) ? AppColors.zeplin.yellow : AppColors.zeplin.light,}]}
                            onPress={() => handleCompleteExercise(exercise.library_id)}
                            reverse={false}
                            size={30}
                            type={'ionicon'}
                        />
                    </TouchableOpacity>
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
                            oswaldMedium
                            style={{
                                color:    completedExercises.includes(exercise.library_id) ? AppColors.zeplin.yellow : AppColors.black,
                                flexWrap: 'wrap',
                                fontSize: AppFonts.scaleFont(16),
                            }}
                        >
                            {this.state.displayName}
                        </Text>
                        <Text
                            robotoMedium
                            style={{
                                color:    completedExercises.includes(exercise.library_id) ? AppColors.zeplin.yellow : AppColors.zeplin.blueGrey,
                                fontSize: AppFonts.scaleFont(15),
                            }}
                        >
                            {this.state.dosage}
                        </Text>
                    </TouchableOpacity>
                    <TabIcon
                        color={completedExercises.includes(exercise.library_id) ? AppColors.zeplin.yellow : AppColors.black}
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