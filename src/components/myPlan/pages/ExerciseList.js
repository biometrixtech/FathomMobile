/**
 * Exercise List
 *
    <ExerciseList
        completedExercises={this.state.completedExercises}
        exerciseList={exerciseList}
        handleCompleteExercise={this._handleCompleteExercise}
        isLoading={this.state.loading}
        toggleCompletedAMPMRecoveryModal={this._toggleCompletedAMPMRecoveryModal}
        toggleSelectedExercise={this._toggleSelectedExercise}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Spacer, TabIcon, Text, Tooltip, } from '../../custom';

// Components
import { ExerciseListItem, } from './';

// import third-party libraries
import _ from 'lodash';
import Modal from 'react-native-modalbox';

const tooltipText = 'Don’t have a foam roller? You can use a water bottle or tennis ball instead!';

/* Component ==================================================================== */
const TooltipContent = ({ handleTooltipClose, text, }) => (
    <View style={{padding: AppSizes.paddingSml,}}>
        <Text robotoLight style={{color: AppColors.black, fontSize: AppFonts.scaleFont(18),}}>{text}</Text>
        <Spacer size={20} />
        <View style={{flex: 1, flexDirection: 'row',}}>
            <View style={{flex: 2,}} />
            <View style={{flex: 6,}} />
            <TouchableOpacity
                onPress={handleTooltipClose}
                style={{flex: 2,}}
            >
                <Text
                    robotoMedium
                    style={{
                        color:    AppColors.primary.yellow.hundredPercent,
                        fontSize: AppFonts.scaleFont(15),
                    }}
                >
                    {'GOT IT'}
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

class ExerciseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isToolTipOpen: false,
        };
    }

    render = () => {
        const {
            completedExercises,
            exerciseList,
            handleCompleteExercise,
            isFSCompletedValid,
            isFunctionalStrength,
            isLoading,
            isPrep,
            toggleCompletedAMPMRecoveryModal,
            toggleSelectedExercise,
        } = this.props;
        let { buttonTitle, isButtonDisabled, isButtonOutlined, buttonDisabledStyle, buttonColor, buttonBackgroundColor, } = MyPlanConstants.exerciseListButtonStyles(isPrep, completedExercises, isFSCompletedValid, isFunctionalStrength);
        return(
            <View style={{flex: 1,}}>
                <View>
                    {_.map(exerciseList.cleanedExerciseList, (exerciseIndex, index) =>
                        exerciseIndex.length > 0 ?
                            <View key={index}>
                                { index === 'FOAM ROLL' ?
                                    <View style={{flexDirection: 'row', marginLeft: (AppSizes.paddingMed / 2),}}>
                                        <Tooltip
                                            animated
                                            content={
                                                <TooltipContent
                                                    handleTooltipClose={() => this.setState({ isToolTipOpen: false, },)}
                                                    text={tooltipText}
                                                />
                                            }
                                            isVisible={this.state.isToolTipOpen}
                                            onClose={() => {}}
                                            tooltipStyle={{left: 30, width: (AppSizes.screen.width - 60),}}
                                        >
                                            <View style={{backgroundColor: this.state.isToolTipOpen ? AppColors.white : AppColors.transparent, borderRadius: this.state.isToolTipOpen ? 5 : 0, flexDirection: 'row',}}>
                                                <Text robotoRegular style={[AppStyles.paddingVerticalSml, {fontSize: AppFonts.scaleFont(15), marginLeft: (AppSizes.paddingMed / 2), marginRight: AppSizes.paddingXSml,}]}>{index}</Text>
                                                <TabIcon
                                                    color={AppColors.zeplin.shadow}
                                                    icon={'help'}
                                                    iconStyle={[{marginRight: (AppSizes.paddingMed / 2),}]}
                                                    onPress={() => this.setState({ isToolTipOpen: true, },)}
                                                    reverse={false}
                                                    size={20}
                                                    type={'material'}
                                                />
                                            </View>
                                        </Tooltip>
                                        <View />
                                    </View>
                                    :
                                    <Text robotoRegular style={[AppStyles.paddingVerticalSml, {fontSize: AppFonts.scaleFont(15), marginLeft: AppSizes.paddingMed,}]}>{index}</Text>
                                }
                                {_.map(exerciseIndex, (exercise, i) =>
                                    <ExerciseListItem
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
                    <Button
                        backgroundColor={buttonBackgroundColor}
                        buttonStyle={{borderRadius: 0, marginVertical: AppSizes.paddingSml, paddingVertical: AppSizes.paddingMed}}
                        color={isButtonDisabled ? AppColors.zeplin.greyText : buttonColor}
                        disabledStyle={buttonDisabledStyle}
                        disabled={isButtonDisabled}
                        fontFamily={AppStyles.robotoBold.fontFamily}
                        fontWeight={AppStyles.robotoBold.fontWeight}
                        onPress={toggleCompletedAMPMRecoveryModal}
                        outlined={isButtonOutlined}
                        raised={false}
                        textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                        title={buttonTitle}
                    />
                </View>
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
        )
    }
}

ExerciseList.propTypes = {
    completedExercises:               PropTypes.array.isRequired,
    exerciseList:                     PropTypes.object.isRequired,
    handleCompleteExercise:           PropTypes.func.isRequired,
    isFSCompletedValid:               PropTypes.bool,
    isFunctionalStrength:             PropTypes.bool,
    isLoading:                        PropTypes.bool.isRequired,
    isPrep:                           PropTypes.bool,
    toggleCompletedAMPMRecoveryModal: PropTypes.func.isRequired,
    toggleSelectedExercise:           PropTypes.func.isRequired,
};

ExerciseList.defaultProps = {
    isFSCompletedValid:   false,
    isFunctionalStrength: false,
    isPrep:               false,
};

ExerciseList.componentName = 'ExerciseList';

/* Export Component ================================================================== */
export default ExerciseList;