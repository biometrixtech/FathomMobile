/**
 * SingleExerciseItem
 *
    <SingleExerciseItem
        completedExercises={completedExercises}
        exercise={MyPlanConstants.cleanExercise(this.state.selectedExercise)}
        handleCompleteExercise={this._handleCompleteExercise}
        selectedExercise={this.state.selectedExercise.library_id}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Platform, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import Video from 'react-native-video';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Checkbox, Spacer, TabIcon, Text, } from '../../custom';
import { Error, } from '../../general';

/* Component ==================================================================== */
class SingleExerciseItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDescriptionExpanded: false,
            modalStyle:            {},
        };
    }

    _toggleDescription = () => {
        this.setState({ isDescriptionExpanded: !this.state.isDescriptionExpanded, });
    }

    _resizeModal = ev => {
        this.setState({ modalStyle: {height: ev.nativeEvent.layout.height,} });
    }

    render = () => {
        const { completedExercises, exercise, handleCompleteExercise, selectedExercise, } = this.props;
        const { isDescriptionExpanded, modalStyle, } = this.state;
        return(
            <View style={[modalStyle, {backgroundColor: AppColors.white, borderRadius: 4,}]}>
                <View onLayout={ev => this._resizeModal(ev)}>
                    <Spacer size={5} />
                    { exercise.videoUrl.length > 0 ?
                        <Video
                            paused={false}
                            repeat={true}
                            resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                            source={{uri: exercise.videoUrl}}
                            style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: (AppSizes.screen.width * 0.9), width: (AppSizes.screen.width * 0.9),}]}
                        />
                        :
                        <Error type={'Video coming soon...'} />
                    }
                    <View style={{paddingHorizontal: AppSizes.paddingMed, width: AppSizes.screen.width * 0.9,}}>
                        <Spacer size={10} />
                        <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(28),}]}>
                            {exercise.displayName}
                        </Text>
                        <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(14),}]}>
                            {exercise.longDosage.toUpperCase()}
                        </Text>
                        <Spacer size={10} />
                        <TouchableOpacity
                            onPress={() => this._toggleDescription()}
                        >
                            <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(15), textDecorationLine: 'underline',}]}>
                                {'see description ^'}
                            </Text>
                        </TouchableOpacity>
                        <Spacer size={10} />
                        { isDescriptionExpanded ?
                            <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}]}>
                                {exercise.description}
                            </Text>
                            :
                            null
                        }
                        <Spacer size={20} />
                        <TabIcon
                            containerStyle={[{alignSelf: 'center'}]}
                            icon={completedExercises.includes(exercise.library_id) ? 'ios-checkbox' : 'ios-checkbox-outline'}
                            iconStyle={[{color: completedExercises.includes(exercise.library_id) ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight,}]}
                            onPress={() => handleCompleteExercise(selectedExercise)}
                            reverse={false}
                            size={50}
                            type={'ionicon'}
                        />
                        <Spacer size={20} />
                    </View>
                </View>
            </View>
        )
    }
}

SingleExerciseItem.propTypes = {
    completedExercises:     PropTypes.array.isRequired,
    exercise:               PropTypes.object.isRequired,
    handleCompleteExercise: PropTypes.func.isRequired,
    selectedExercise:       PropTypes.string.isRequired,
};

SingleExerciseItem.defaultProps = {};

SingleExerciseItem.componentName = 'SingleExerciseItem';

/* Export Component ================================================================== */
export default SingleExerciseItem;