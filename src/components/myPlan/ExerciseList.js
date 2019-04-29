/**
 * Exercise List
 *
    <ExerciseList
        clearCompletedExercises={clearCompletedExercises}
        markStartedRecovery={markStartedRecovery}
        plan={plan}
        setCompletedExercises={setCompletedExercises}
        toggleRecoveryGoal={toggleRecoveryGoal}
        updateUser={updateUser}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, Platform, ScrollView, StyleSheet, View, } from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { Button, FathomModal, MultiSwitch, Spacer, TabIcon, Text, } from '../custom';
import { PlanLogic, } from '../../lib';
import { store, } from '../../store';

// Components
import { ExerciseListItem, Exercises, GoalPill, } from './pages';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

/* Component ==================================================================== */
class ExerciseList extends Component {
    constructor(props) {
        super(props);
        let dailyPlanObj = props.plan ? props.plan.dailyPlan[0] : false;
        let recoveryObj = dailyPlanObj.pre_active_rest && dailyPlanObj.pre_active_rest.active ?
            dailyPlanObj.pre_active_rest
            :
            dailyPlanObj.post_active_rest;
        let priorityIndex = recoveryObj.default_plan === 'Efficient' ?
            0
            : recoveryObj.default_plan === 'Complete' ?
                1
                : recoveryObj.default_plan === 'Comprehensive' ?
                    2
                    :
                    1;
        this.state = {
            isSelectedExerciseModalOpen: false,
            priority:                    priorityIndex,
            selectedExercise:            {},
        };
        this._scrollViewRef = {};
        this._exerciseListRef = {};
    }

    _toggleSelectedExercise = (exerciseObj, isModalOpen) => {
        this.setState({
            isSelectedExerciseModalOpen: isModalOpen,
            selectedExercise:            exerciseObj ? exerciseObj : {},
        });
    }

    _handleCompleteExercise = (exerciseId, setNumber, recovery_type) => {
        const { markStartedRecovery, plan, setCompletedExercises, } = this.props;
        let newExerciseId = setNumber ? `${exerciseId}-${setNumber}` : exerciseId;
        // add or remove exercise
        let newCompletedExercises = _.cloneDeep(store.getState().plan.completedExercises);
        if(newCompletedExercises && newCompletedExercises.indexOf(newExerciseId) > -1) {
            newCompletedExercises.splice(newCompletedExercises.indexOf(newExerciseId), 1)
        } else {
            newCompletedExercises.push(newExerciseId);
        }
        // Mark Recovery as started, if logic passes
        let clonedPlan = _.cloneDeep(plan);
        let startDate = recovery_type === 'pre' ?
            clonedPlan.dailyPlan[0].pre_active_rest.start_date
            : recovery_type === 'post' ?
                clonedPlan.dailyPlan[0].post_active_rest.start_date
                :
                true;
        if(newCompletedExercises.length === 1 && !startDate) {
            let newMyPlan =  _.cloneDeep(plan.dailyPlan);
            if(recovery_type === 'pre') {
                newMyPlan[0].pre_active_rest.start_date = true;
            } else if(recovery_type === 'post') {
                newMyPlan[0].post_recovery.start_date = true;
            }
            markStartedRecovery(recovery_type, newMyPlan);
        }
        // continue by updating reducer and state
        setCompletedExercises(newCompletedExercises);
    }

    _toggleCompletedAMPMRecoveryModal = () => {
        this.props.clearCompletedExercises();
        // TODO: FIX MEEE
        this.setState({ isCompletedAMPMRecoveryModalOpen: !this.state.isCompletedAMPMRecoveryModalOpen, });
    }

    _scrollToExerciseList = () => {
        this._scrollViewRef.scrollTo({
            x:        this._exerciseListRef.x,
            y:        this._exerciseListRef.y,
            animated: true,
        });
    }

    _toggleRecoveryGoal = selectedIndex => {
        const { plan, toggleRecoveryGoal, } = this.props;
        let newGoals = _.cloneDeep(plan.goals);
        newGoals = _.update(newGoals, `[${selectedIndex}].isSelected`, () => !plan.goals[selectedIndex].isSelected);
        toggleRecoveryGoal(newGoals);
    }

    _handleUpdateFirstTimeExperience = (value, callback) => {
        // setup variables
        let newUserPayloadObj = {};
        newUserPayloadObj.first_time_experience = [value];
        let newUserObj = _.cloneDeep(this.props.user);
        newUserObj.first_time_experience.push(value);
        // update reducer as API might take too long to return a value
        store.dispatch({
            type: DispatchActions.USER_REPLACE,
            data: newUserObj
        });
        // update user object
        this.props.updateUser(newUserPayloadObj, this.props.user.id)
            .then(res => {
                if(callback) {
                    callback();
                }
            });
    }

    render = () => {
        const { isSelectedExerciseModalOpen, priority, selectedExercise, } = this.state;
        let { plan, user, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let completedExercises = plan.completedExercises;
        let isPrepareActive = dailyPlanObj.pre_active_rest && dailyPlanObj.pre_active_rest.active;
        let recoveryObj = isPrepareActive ? dailyPlanObj.pre_active_rest : dailyPlanObj.post_active_rest;
        let buttons = [
            `${(_.round(MyPlanConstants.cleanExerciseList(recoveryObj, 0, plan.goals, isPrepareActive).totalSeconds / 60))} minutes`,
            `${(_.round(MyPlanConstants.cleanExerciseList(recoveryObj, 1, plan.goals, isPrepareActive).totalSeconds / 60))} minutes`,
            `${(_.round(MyPlanConstants.cleanExerciseList(recoveryObj, 2, plan.goals, isPrepareActive).totalSeconds / 60))} minutes`
        ];
        let exerciseList = MyPlanConstants.cleanExerciseList(recoveryObj, priority, plan.goals, isPrepareActive);
        let firstExerciseFound = false;
        _.forEach(exerciseList.cleanedExerciseList, (exerciseIndex, index) => {
            if(exerciseIndex && exerciseIndex.length > 0 & !firstExerciseFound) {
                firstExerciseFound = exerciseIndex[0];
                return exerciseIndex;
            }
            return false;
        });
        let { buttonTitle, isButtonDisabled, buttonDisabledStyle, buttonBackgroundColor, } = MyPlanConstants.exerciseListButtonStyles(isPrepareActive, completedExercises);
        return (
            <View style={{flex: 1,}}>
                <View style={{height: AppSizes.statusBarHeight,}} />
                <ScrollView
                    nestedScrollEnabled={true}
                    ref={ref => {this._scrollViewRef = ref;}}
                    style={{backgroundColor: AppColors.white, flex: 1,}}
                >
                    <View style={{height: AppSizes.screen.heightThreeQuarters,}}>
                        <ImageBackground
                            source={require('../../../assets/images/standard/active_rest.png')}
                            style={{height: (AppSizes.screen.heightThreeQuarters - AppSizes.paddingXLrg),}}
                        >
                            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                                <TabIcon
                                    color={AppColors.white}
                                    containerStyle={[{position: 'absolute', top: AppSizes.padding, left: AppSizes.padding,}]}
                                    icon={'chevron-left'}
                                    onPress={() => Actions.pop()}
                                    size={AppFonts.scaleFont(30)}
                                    type={'material-community'}
                                />
                                <Text oswaldRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35),}}>{'CARE & ACTIVATE'}</Text>
                                <Text robotoRegular style={{color: AppColors.zeplin.superLight, fontSize: AppFonts.scaleFont(12), marginBottom: AppSizes.paddingLrg,}}>{`Anytime ${isPrepareActive ? 'before' : 'after'} training`}</Text>
                                {_.map(plan.goals, (goal, key) =>
                                    <GoalPill
                                        isSelected={goal.isSelected}
                                        key={key}
                                        onPress={() => this._toggleRecoveryGoal(key)}
                                        text={goal.text}
                                    />
                                )}
                                <Spacer size={AppSizes.padding} />
                                <MultiSwitch
                                    buttons={buttons}
                                    onStatusChanged={selectedIndex => this.setState({ priority: selectedIndex, })}
                                    selectedIndex={priority}
                                />
                                <View style={{flexDirection: 'row', marginBottom: AppSizes.paddingMed, marginTop: AppSizes.paddingXSml, width: AppSizes.screen.width,}}>
                                    <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(9), textAlign: 'center', width: AppSizes.screen.widthThird,}}>{recoveryObj.default_plan === 'Efficient' ? 'Recommended' : ''}</Text>
                                    <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(9), textAlign: 'center', width: AppSizes.screen.widthThird,}}>{recoveryObj.default_plan === 'Complete' ? 'Recommended' : ''}</Text>
                                    <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(9), textAlign: 'center', width: AppSizes.screen.widthThird,}}>{recoveryObj.default_plan === 'Comprehensive' ? 'Recommended' : ''}</Text>
                                </View>
                                {exerciseList.equipmentRequired && exerciseList.equipmentRequired.length > 0 &&
                                    <View>
                                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{'Equipment:'}</Text>
                                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{exerciseList.totalLength > 0 ? exerciseList.equipmentRequired.join(', ') : 'None'}</Text>
                                    </View>
                                }
                            </View>
                        </ImageBackground>
                        <Button
                            buttonStyle={StyleSheet.flatten([Platform.OS === 'ios' ? AppStyles.scaleButtonShadowEffect : {elevation: 2,}, {backgroundColor: AppColors.zeplin.yellow, borderRadius: (AppSizes.paddingXLrg), height: (AppSizes.paddingXLrg * 2), position: 'relative', top: -AppSizes.paddingXLrg, width: (AppSizes.paddingXLrg * 2),}])}
                            containerStyle={{alignItems: 'center', height: AppSizes.paddingXLrg, overflow: 'visible',}}
                            disabled={!firstExerciseFound}
                            onPress={() => this._toggleSelectedExercise(firstExerciseFound, !this.state.isSelectedExerciseModalOpen)}
                            title={'Start'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(22),}}
                        />
                    </View>
                    <View onLayout={event => {this._exerciseListRef = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y,};}}>
                        <Text onPress={() => this._scrollToExerciseList()} robotoRegular style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(12), paddingVertical: AppSizes.paddingSml, textAlign: 'center', textDecorationLine: 'none',}}>{'Preview'}</Text>
                        {_.map(exerciseList.cleanedExerciseList, (exerciseIndex, index) =>
                            exerciseIndex && exerciseIndex.length > 0 ?
                                <View key={index}>
                                    <Text robotoRegular style={[AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(15), marginLeft: AppSizes.paddingMed,}]}>{index}</Text>
                                    {_.map(exerciseIndex, (exercise, i) =>
                                        <ExerciseListItem
                                            completedExercises={completedExercises}
                                            exercise={exercise}
                                            goals={plan.goals}
                                            handleCompleteExercise={this._handleCompleteExercise}
                                            isLastItem={i + 1 === exerciseList.totalLength}
                                            key={exercise.library_id+i}
                                            priority={priority}
                                            toggleSelectedExercise={this._toggleSelectedExercise}
                                        />
                                    )}
                                </View>
                                :
                                null
                        )}
                        { exerciseList.totalLength > 0 ?
                            <Button
                                buttonStyle={{backgroundColor: buttonBackgroundColor, borderRadius: 0, marginTop: AppSizes.paddingSml, paddingVertical: AppSizes.paddingMed,}}
                                disabledStyle={buttonDisabledStyle}
                                disabledTitleStyle={{color: AppColors.white,}}
                                disabled={isButtonDisabled}
                                onPress={this._toggleCompletedAMPMRecoveryModal}
                                title={buttonTitle}
                                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(16),}}
                            />
                            :
                            null
                        }
                    </View>
                </ScrollView>
                <FathomModal
                    isVisible={isSelectedExerciseModalOpen}
                    style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: AppColors.transparent, margin: 0,}]}
                >
                    <Exercises
                        closeModal={() => this.setState({ isSelectedExerciseModalOpen: false, })}
                        completedExercises={completedExercises}
                        exerciseList={exerciseList}
                        handleCompleteExercise={(exerciseId, setNumber, hasNextExercise) => {
                            this._handleCompleteExercise(exerciseId, setNumber, isPrepareActive ? 'pre' : 'post');
                            if(!hasNextExercise) {
                                this.setState(
                                    { isSelectedExerciseModalOpen: false, },
                                    // () => { this.goToPageTimer = _.delay(() => this.setState({ isRecoverExerciseCompletionModalOpen: true, }), 750); }
                                );
                            }
                        }}
                        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                        selectedExercise={selectedExercise}
                        user={user}
                    />
                </FathomModal>
            </View>
        );
    }
}

ExerciseList.propTypes = {
    clearCompletedExercises: PropTypes.func.isRequired,
    markStartedRecovery:     PropTypes.func.isRequired,
    plan:                    PropTypes.object.isRequired,
    setCompletedExercises:   PropTypes.func.isRequired,
    updateUser:              PropTypes.func.isRequired,
    user:                    PropTypes.object.isRequired,
};

ExerciseList.defaultProps = {};

ExerciseList.componentName = 'ExerciseList';

/* Export Component ================================================================== */
export default ExerciseList;