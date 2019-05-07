/**
 * Exercise Modality
 *
    <ExerciseModality
        markStartedRecovery={markStartedRecovery}
        modality={modality}
        patchActiveRecovery={patchActiveRecovery}
        plan={plan}
        setCompletedCoolDownExercises={setCompletedCoolDownExercises}
        setCompletedExercises={setCompletedExercises}
        toggleActiveRestGoal={toggleActiveRestGoal}
        toggleCoolDownGoal={toggleCoolDownGoal}
        toggleWarmUpGoal={toggleWarmUpGoal}
        updateUser={updateUser}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Easing, Platform, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, MyPlan as MyPlanConstants, } from '../../constants';
import { Button, FathomModal, MultiSwitch, Spacer, TabIcon, Text, } from '../custom';
import { AppUtil, PlanLogic, } from '../../lib';
import { store, } from '../../store';

// Components
import { ExerciseCompletionModal, ExerciseListItem, Exercises, GoalPill, } from './pages';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import * as MagicMove from 'react-native-magic-move';
import _ from 'lodash';

/* Component ==================================================================== */
class ExerciseModality extends Component {
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
            isExerciseCompletionModalOpen: false,
            isSelectedExerciseModalOpen:   false,
            priority:                      priorityIndex,
            selectedExercise:              {},
        };
        this._scrollViewRef = {};
        this._exerciseListRef = {};
        this._timer = null;
    }

    componentWillUnmount = () => {
        // clear timers
        clearInterval(this._timer);
    }

    _toggleSelectedExercise = (exerciseObj, isModalOpen) => {
        this.setState({
            isSelectedExerciseModalOpen: isModalOpen,
            selectedExercise:            exerciseObj,
        });
    }

    _handleCompleteExercise = (exerciseId, setNumber) => {
        const { markStartedRecovery, plan, setCompletedCoolDownExercises, setCompletedExercises, } = this.props;
        let newExerciseId = setNumber ? `${exerciseId}-${setNumber}` : exerciseId;
        let clonedPlan = _.cloneDeep(plan);
        let modality = this.props.modality;
        // add or remove exercise
        let reducerCompletedExercises = clonedPlan.dailyPlan[0].cool_down && clonedPlan.dailyPlan[0].cool_down.active && modality === 'coolDown' ? store.getState().plan.completedCoolDownExercises : store.getState().plan.completedExercises;
        let newCompletedExercises = _.cloneDeep(reducerCompletedExercises);
        if(newCompletedExercises && newCompletedExercises.indexOf(newExerciseId) > -1) {
            newCompletedExercises.splice(newCompletedExercises.indexOf(newExerciseId), 1)
        } else {
            newCompletedExercises.push(newExerciseId);
        }
        // Mark Recovery as started, if logic passes
        let recoveryType = clonedPlan.dailyPlan[0].post_active_rest && clonedPlan.dailyPlan[0].post_active_rest.active && modality === 'recover' ?
            'post_active_rest'
            : clonedPlan.dailyPlan[0].warm_up && clonedPlan.dailyPlan[0].warm_up.active && modality === 'warmUp' ?
                'warm_up'
                : clonedPlan.dailyPlan[0].cool_down && clonedPlan.dailyPlan[0].cool_down.active && modality === 'coolDown' ?
                    'cool_down'
                    :
                    'pre_active_rest';
        let startDate = recoveryType === 'pre_active_rest' ?
            clonedPlan.dailyPlan[0].pre_active_rest.start_date_time
            : recoveryType === 'post_active_rest' ?
                clonedPlan.dailyPlan[0].post_active_rest.start_date_time
                : recoveryType === 'warm_up' ?
                    clonedPlan.dailyPlan[0].warm_up.start_date_time
                    : recoveryType === 'cool_down' ?
                        clonedPlan.dailyPlan[0].cool_down.start_date_time
                        :
                        true;
        if(newCompletedExercises.length === 1 && !startDate) {
            let newMyPlan =  _.cloneDeep(plan.dailyPlan);
            if(recoveryType === 'pre_active_rest') {
                newMyPlan[0].pre_active_rest.start_date_time = true;
            } else if(recoveryType === 'post_active_rest') {
                newMyPlan[0].post_active_rest.start_date_time = true;
            } else if(recoveryType === 'warm_up') {
                newMyPlan[0].warm_up.start_date_time = true;
            } else if(recoveryType === 'cool_down') {
                newMyPlan[0].cool_down.start_date_time = true;
            }
            markStartedRecovery(recoveryType, newMyPlan);
        }
        // continue by updating reducer and state
        if(recoveryType === 'cool_down') {
            setCompletedCoolDownExercises(newCompletedExercises)
        } else {
            setCompletedExercises(newCompletedExercises);
        }
    }

    _scrollToExerciseList = () => {
        this._scrollViewRef.scrollTo({
            x:        this._exerciseListRef.x,
            y:        this._exerciseListRef.y,
            animated: true,
        });
    }

    _toggleGoal = selectedIndex => {
        const { modality, plan, toggleCoolDownGoal, toggleActiveRestGoal, toggleWarmUpGoal, } = this.props;
        if(modality === 'coolDown') {
            let newGoals = _.cloneDeep(plan.coolDownGoals);
            newGoals = _.update(newGoals, `[${selectedIndex}].isSelected`, () => !plan.coolDownGoals[selectedIndex].isSelected);
            toggleCoolDownGoal(newGoals);
        } else if(modality === 'warmUp') {
            let newGoals = _.cloneDeep(plan.warmUpGoals);
            newGoals = _.update(newGoals, `[${selectedIndex}].isSelected`, () => !plan.warmUpGoals[selectedIndex].isSelected);
            toggleWarmUpGoal(newGoals);
        } else {
            let newGoals = _.cloneDeep(plan.activeRestGoals);
            newGoals = _.update(newGoals, `[${selectedIndex}].isSelected`, () => !plan.activeRestGoals[selectedIndex].isSelected);
            toggleActiveRestGoal(newGoals);
        }
    }

    _handleUpdateFirstTimeExperience = (value, callback) => {
        let { updateUser, user, } = this.props;
        // setup variables
        let newUserPayloadObj = {};
        newUserPayloadObj.first_time_experience = [value];
        let newUserObj = _.cloneDeep(user);
        newUserObj.first_time_experience.push(value);
        // update reducer as API might take too long to return a value
        store.dispatch({
            type: DispatchActions.USER_REPLACE,
            data: newUserObj
        });
        // update user object
        updateUser(newUserPayloadObj, user.id)
            .then(res => {
                if(callback) {
                    callback();
                }
            });
    }

    render = () => {
        const {
            isExerciseCompletionModalOpen,
            isSelectedExerciseModalOpen,
            priority,
            selectedExercise,
        } = this.state;
        let { patchActiveRecovery, plan, user, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let modality = this.props.modality;
        let completedExercises = dailyPlanObj.cool_down && dailyPlanObj.cool_down.active && modality === 'coolDown' ? plan.completedCoolDownExercises : plan.completedExercises;
        let { buttonTitle, isButtonDisabled, buttonDisabledStyle, buttonBackgroundColor, } = MyPlanConstants.exerciseListButtonStyles(completedExercises);
        const {
            buttons,
            exerciseList,
            firstExerciseFound,
            goals,
            imageId,
            imageSource,
            pageSubtitle,
            pageTitle,
            recoveryObj,
            recoveryType,
            textId,
        } = PlanLogic.handleExerciseModalityRenderLogic(dailyPlanObj, plan, priority, modality);
        return (
            <MagicMove.Scene debug={false} disabled={true} duration={500} id={'myPlanScene'} style={{flex: 1, backgroundColor: AppColors.white,}} useNativeDriver={false}>
                <View style={{flex: 1,}}>
                    <ScrollView
                        bounces={false}
                        nestedScrollEnabled={true}
                        ref={ref => {this._scrollViewRef = ref;}}
                        style={{backgroundColor: AppColors.white, flex: 1,}}
                    >
                        <View style={{height: AppSizes.screen.heightThreeQuarters,}}>
                            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                                <MagicMove.Image
                                    disabled={true}
                                    easing={Easing.in(Easing.cubic)}
                                    id={`${imageId}.image`}
                                    resizeMode={'cover'}
                                    source={imageSource}
                                    style={[{height: (AppSizes.screen.heightThreeQuarters - AppSizes.paddingXLrg),}, StyleSheet.absoluteFill,]}
                                    transition={MagicMove.Transition.morph}
                                    useNativeDriver={false}
                                />
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => Actions.pop()}
                                    style={{position: 'absolute', top: 0, left: 0, padding: AppSizes.padding,}}
                                >
                                    <TabIcon
                                        color={AppColors.white}
                                        icon={'chevron-left'}
                                        onPress={() => Actions.pop()}
                                        size={AppFonts.scaleFont(40)}
                                        type={'material-community'}
                                    />
                                </TouchableOpacity>
                                <MagicMove.Text
                                    disabled={true}
                                    duration={600}
                                    id={`${textId}.title`}
                                    style={[AppStyles.oswaldRegular, {color: AppColors.white, fontSize: AppFonts.scaleFont(35), paddingTop: AppSizes.paddingSml,}]}
                                    transition={MagicMove.Transition.move}
                                    useNativeDriver={false}
                                    zIndex={10}
                                >
                                    {pageTitle}
                                </MagicMove.Text>
                                <Text robotoRegular style={{color: AppColors.zeplin.superLight, fontSize: AppFonts.scaleFont(12), marginBottom: AppSizes.paddingLrg,}}>{pageSubtitle}</Text>
                                {_.map(goals, (goal, key) =>
                                    <GoalPill
                                        isSelected={goal.isSelected}
                                        key={key}
                                        onPress={() => this._toggleGoal(key)}
                                        text={goal.text}
                                    />
                                )}
                                <Spacer size={AppSizes.padding} />
                                <MultiSwitch
                                    buttons={buttons}
                                    onStatusChanged={selectedIndex => this.setState({ priority: selectedIndex, })}
                                    selectedIndex={priority}
                                />
                                <View style={{flexDirection: 'row', marginBottom: AppSizes.paddingMed, marginHorizontal: AppSizes.paddingLrg, marginTop: AppSizes.paddingXSml, width: (AppSizes.screen.width - AppSizes.paddingLrg),}}>
                                    <Text robotoRegular style={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(11), textAlign: 'center',}}>{recoveryObj.default_plan === 'Efficient' ? 'Recommended' : ''}</Text>
                                    <Text robotoRegular style={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(11), textAlign: 'center',}}>{recoveryObj.default_plan === 'Complete' ? 'Recommended' : ''}</Text>
                                    <Text robotoRegular style={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(11), textAlign: 'center',}}>{recoveryObj.default_plan === 'Comprehensive' ? 'Recommended' : ''}</Text>
                                </View>
                                {exerciseList.equipmentRequired && exerciseList.equipmentRequired.length > 0 &&
                                    <View>
                                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{'Equipment:'}</Text>
                                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{exerciseList.totalLength > 0 ? exerciseList.equipmentRequired.join(', ') : 'None'}</Text>
                                    </View>
                                }
                            </View>
                            <Button
                                buttonStyle={StyleSheet.flatten([Platform.OS === 'ios' ? AppStyles.scaleButtonShadowEffect : {elevation: 2,}, {backgroundColor: AppColors.zeplin.yellow, borderRadius: (AppSizes.paddingXLrg), height: (AppSizes.paddingXLrg * 2), position: 'relative', top: -AppSizes.paddingXLrg, width: (AppSizes.paddingXLrg * 2),}])}
                                containerStyle={{alignItems: 'center', height: AppSizes.paddingXLrg, overflow: 'visible',}}
                                disabled={!firstExerciseFound}
                                onPress={() => this._toggleSelectedExercise(firstExerciseFound, !isSelectedExerciseModalOpen)}
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
                                                goals={goals}
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
                                    onPress={() => this.setState({ isExerciseCompletionModalOpen: true, })}
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
                            modality={this.props.modality}
                            handleCompleteExercise={(exerciseId, setNumber, hasNextExercise) => {
                                this._handleCompleteExercise(exerciseId, setNumber);
                                if(!hasNextExercise) {
                                    this.setState(
                                        { isSelectedExerciseModalOpen: false, },
                                        () => { this._timer = _.delay(() => this.setState({ isExerciseCompletionModalOpen: true, }), 750); }
                                    );
                                }
                            }}
                            handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                            planActiveRestGoals={goals}
                            priority={priority}
                            selectedExercise={selectedExercise}
                            user={user}
                        />
                    </FathomModal>
                    <ExerciseCompletionModal
                        completedExercises={completedExercises}
                        exerciseList={exerciseList}
                        isModalOpen={isExerciseCompletionModalOpen}
                        onClose={() => this.setState({ isExerciseCompletionModalOpen: false, })}
                        onComplete={() => {
                            this.setState(
                                { isExerciseCompletionModalOpen: false, },
                                () => {
                                    let reducerCompletedExercises = plan.dailyPlan[0].cool_down && plan.dailyPlan[0].cool_down.active && modality === 'cool_down' ? store.getState().plan.completedCoolDownExercises : store.getState().plan.completedExercises;
                                    let { newCompletedExercises, } = PlanLogic.handleCompletedExercises(reducerCompletedExercises);
                                    patchActiveRecovery(newCompletedExercises, recoveryType)
                                        .then(res => Actions.pop())
                                        .catch(() => AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery));
                                }
                            );
                        }}
                        user={user}
                    />
                </View>
            </MagicMove.Scene>
        );
    }
}

ExerciseModality.propTypes = {
    markStartedRecovery:           PropTypes.func.isRequired,
    modality:                      PropTypes.string.isRequired,
    patchActiveRecovery:           PropTypes.func.isRequired,
    plan:                          PropTypes.object.isRequired,
    setCompletedCoolDownExercises: PropTypes.func.isRequired,
    setCompletedExercises:         PropTypes.func.isRequired,
    toggleActiveRestGoal:          PropTypes.func.isRequired,
    toggleCoolDownGoal:            PropTypes.func.isRequired,
    toggleWarmUpGoal:              PropTypes.func.isRequired,
    updateUser:                    PropTypes.func.isRequired,
    user:                          PropTypes.object.isRequired,
};

ExerciseModality.defaultProps = {};

ExerciseModality.componentName = 'ExerciseModality';

/* Export Component ================================================================== */
export default ExerciseModality;