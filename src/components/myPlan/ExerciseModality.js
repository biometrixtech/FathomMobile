/**
 * Exercise Modality
 *
    <ExerciseModality
        index={index}
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
import { ImageBackground, Platform, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, MyPlan as MyPlanConstants, } from '../../constants';
import { Button, FathomModal, MultiSwitch, ParsedText, Spacer, TabIcon, Text, } from '../custom';
import { AppUtil, PlanLogic, } from '../../lib';
import { store, } from '../../store';

// Components
import { ExerciseCompletionModal, ExerciseListItem, Exercises, GoalPill, } from './pages';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';

/* Component ==================================================================== */
class ExerciseModality extends Component {
    constructor(props) {
        super(props);
        const dailyPlanObj = props.plan ? props.plan.dailyPlan[0] : false;
        const recoveryObj = _.find(dailyPlanObj.modalities, ['id', props.index]);
        const priorityIndex = recoveryObj.default_plan || 0;
        this.state = {
            isExerciseCompletionModalOpen: false,
            isSelectedExerciseModalOpen:   false,
            isSubmitting:                  false,
            priority:                      priorityIndex === 'Efficient' ? 0 : priorityIndex === 'Complete' ? 1 : 2,
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

    _handleCompleteExercise = (exerciseId, setNumber, recoveryObjId) => {
        const { markStartedRecovery, plan, setCompletedExercises, user, } = this.props;
        let newExerciseId = setNumber ? `${exerciseId}-${setNumber}` : exerciseId;
        let clonedPlan = _.cloneDeep(plan);
        // add or remove exercise
        let reducerCompletedExercises = store.getState().plan.completedExercises;
        let newCompletedExercises = _.cloneDeep(reducerCompletedExercises);
        if(newCompletedExercises[recoveryObjId] && newCompletedExercises[recoveryObjId].indexOf(newExerciseId) > -1) {
            newCompletedExercises[recoveryObjId].splice(newCompletedExercises[recoveryObjId].indexOf(newExerciseId), 1);
        } else if(newCompletedExercises[recoveryObjId]) {
            newCompletedExercises[recoveryObjId].push(newExerciseId);
        } else {
            newCompletedExercises[recoveryObjId] = [newExerciseId];
        }
        // Mark Recovery as started, if logic passes
        let recoveryObj = _.find(clonedPlan.dailyPlan[0].modalities, ['id', recoveryObjId]);
        let startDate = recoveryObj.start_date_time;
        if(newCompletedExercises.length === 1 && !startDate) {
            markStartedRecovery(recoveryObj.type, user.id);
        }
        // continue by updating reducer and state
        setCompletedExercises(newCompletedExercises);
    }

    _handleSubmit = (index, recoveryObj) => {
        let { patchActiveRecovery, user, } = this.props;
        this.setState(
            { isExerciseCompletionModalOpen: false, isSubmitting: true, },
            () => {
                let reducerCompletedExercises = store.getState().plan.completedExercises[recoveryObj.id];
                let { newCompletedExercises, } = PlanLogic.handleCompletedExercises(reducerCompletedExercises);
                patchActiveRecovery(newCompletedExercises, recoveryObj.type, user.id)
                    .then(res => Actions.pop())
                    .catch(() => this.setState({isSubmitting: false,}, () => AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery)));
            }
        );
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

    _scrollToExerciseList = () => {
        this._scrollViewRef.scrollTo({
            x:        this._exerciseListRef.x,
            y:        this._exerciseListRef.y,
            animated: true,
        });
    }

    _toggleGoal = selectedIndex => {
        const { index, plan, toggleActiveRestGoal, } = this.props;
        let newGoals = _.cloneDeep(plan.activeRestGoals);
        let selectedGoal = _.find(newGoals, (g, key) => key === index);
        newGoals[index] = _.update(selectedGoal, `[${selectedIndex}].isSelected`, () => !plan.activeRestGoals[index][selectedIndex].isSelected);
        toggleActiveRestGoal(newGoals);
    }

    _toggleSelectedExercise = (exerciseObj, isModalOpen, recoveryObjId) => {
        let newExerciseObj = _.cloneDeep(exerciseObj);
        if(recoveryObjId) {
            newExerciseObj.parentId = recoveryObjId;
        }
        this.setState(
            {
                isSelectedExerciseModalOpen: isModalOpen,
                selectedExercise:            newExerciseObj,
            },
            () => this.state.isSelectedExerciseModalOpen ?
                Actions.refresh({ panHandlers: null, })
                :
                {}
        );
    }

    render = () => {
        const {
            isExerciseCompletionModalOpen,
            isSelectedExerciseModalOpen,
            isSubmitting,
            priority,
            selectedExercise,
        } = this.state;
        let {
            index,
            modality,
            plan,
            user,
        } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        const {
            buttons,
            exerciseList,
            firstExerciseFound,
            goals,
            goalsHeader,
            imageId,
            imageSource,
            pageSubtitle,
            pageTitle,
            priorityText,
            recoveryObj,
            recoveryType,
            textId,
        } = PlanLogic.handleExerciseModalityRenderLogic(dailyPlanObj, plan, priority, modality, index);
        let completedExercises = plan.completedExercises[recoveryObj.id];
        let {
            buttonBackgroundColor,
            buttonDisabledStyle,
            buttonTitle,
            isButtonDisabled,
        } = MyPlanConstants.exerciseListButtonStyles(completedExercises, recoveryObj);
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1,}}>
                <View style={{flex: 1,}}>
                    <ScrollView
                        bounces={false}
                        nestedScrollEnabled={true}
                        ref={ref => {this._scrollViewRef = ref;}}
                        style={{backgroundColor: AppColors.white, flex: 1,}}
                    >
                        <View>
                            <ImageBackground
                                source={imageSource}
                                style={{flex: 1, width: AppSizes.screen.width,}}
                            >
                                <LinearGradient
                                    colors={['rgba(112, 190, 199, 0.8)', 'rgba(112, 190, 199, 0.8)']}
                                    end={{x: 1, y: 0}}
                                    start={{x: 0, y: 0}}
                                    style={[{alignItems: 'center', flex: 1, justifyContent: 'center', paddingBottom: (AppSizes.paddingXLrg + AppSizes.paddingLrg), paddingTop: (AppSizes.statusBarHeight + AppSizes.paddingXLrg),}]}
                                >
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => Actions.pop()}
                                        style={{position: 'absolute', top: 0, left: 0, marginTop: AppSizes.statusBarHeight, padding: AppSizes.padding,}}
                                    >
                                        <TabIcon
                                            color={AppColors.white}
                                            icon={'chevron-left'}
                                            onPress={() => Actions.pop()}
                                            size={AppFonts.scaleFont(40)}
                                            type={'material-community'}
                                        />
                                    </TouchableOpacity>
                                    <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), paddingTop: AppSizes.paddingSml,}}>
                                        {pageTitle}
                                    </Text>
                                    <Text robotoRegular style={{color: AppColors.zeplin.superLight, fontSize: AppFonts.scaleFont(13), marginBottom: AppSizes.paddingLrg,}}>{pageSubtitle}</Text>
                                    <MultiSwitch
                                        buttons={buttons}
                                        isDisabled={!firstExerciseFound}
                                        onStatusChanged={selectedIndex => isSubmitting ? null : this.setState({ priority: selectedIndex, })}
                                        selectedIndex={priority}
                                    />
                                    <View style={{flexDirection: 'row', marginBottom: AppSizes.paddingMed, marginHorizontal: AppSizes.paddingLrg, marginTop: AppSizes.paddingXSml, width: (AppSizes.screen.width - AppSizes.paddingLrg),}}>
                                        <Text robotoRegular style={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>{recoveryObj.default_plan === 'Efficient' ? 'Recommended' : ''}</Text>
                                        <Text robotoRegular style={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>{recoveryObj.default_plan === 'Complete' ? 'Recommended' : ''}</Text>
                                        <Text robotoRegular style={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>{recoveryObj.default_plan === 'Comprehensive' ? 'Recommended' : ''}</Text>
                                    </View>
                                    <ParsedText
                                        parse={[{pattern: new RegExp(priorityText, 'i'), style: {textDecorationLine: 'underline',},}]}
                                        style={[AppStyles.robotoBold, {color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}]}
                                    >
                                        {goalsHeader}
                                    </ParsedText>
                                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',}}>
                                        {_.map(goals, (goal, key) =>
                                            <GoalPill
                                                extraStyles={{marginTop: AppSizes.paddingSml, marginHorizontal: AppSizes.paddingXSml,}}
                                                goal={goal}
                                                key={key}
                                                onPress={() => isSubmitting ? null : this._toggleGoal(key)}
                                            />
                                        )}
                                    </View>
                                    { (exerciseList.equipmentRequired && exerciseList.equipmentRequired.length > 0) &&
                                        <View style={{marginTop: AppSizes.paddingLrg, paddingHorizontal: AppSizes.paddingMed,}}>
                                            <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{'You\'ll need:'}</Text>
                                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{exerciseList.totalLength > 0 ? exerciseList.equipmentRequired.join(', ') : 'None'}</Text>
                                        </View>
                                    }
                                </LinearGradient>
                            </ImageBackground>
                            <Button
                                buttonStyle={StyleSheet.flatten([Platform.OS === 'ios' ? AppStyles.scaleButtonShadowEffect : {elevation: 2,}, {backgroundColor: AppColors.zeplin.yellow, borderRadius: (AppSizes.paddingXLrg), height: (AppSizes.paddingXLrg * 2), position: 'relative', top: -AppSizes.paddingXLrg, width: (AppSizes.paddingXLrg * 2),}])}
                                containerStyle={{alignItems: 'center', height: AppSizes.paddingXLrg, overflow: 'visible',}}
                                disabled={!firstExerciseFound || isSubmitting}
                                disabledStyle={{backgroundColor: AppColors.zeplin.slateLight,}}
                                disabledTitleStyle={{color: AppColors.white,}}
                                onPress={() => this._toggleSelectedExercise(firstExerciseFound, !isSelectedExerciseModalOpen, recoveryObj.id)}
                                title={'Start'}
                                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(22),}}
                            />
                        </View>
                        <View onLayout={event => {this._exerciseListRef = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y,};}}>
                            { exerciseList.totalLength > 0 &&
                                <Text onPress={() => this._scrollToExerciseList()} robotoRegular style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(12), paddingVertical: AppSizes.paddingSml, textAlign: 'center', textDecorationLine: 'none',}}>{'Preview'}</Text>
                            }
                            {_.map(exerciseList.cleanedExerciseList, (exerciseIndex, key) =>
                                exerciseIndex && exerciseIndex.length > 0 ?
                                    <View key={key}>
                                        <Text robotoRegular style={[AppStyles.paddingVerticalSml, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginLeft: AppSizes.paddingMed,}]}>{key}</Text>
                                        {_.map(exerciseIndex, (exercise, i) =>
                                            <ExerciseListItem
                                                completedExercises={completedExercises ? completedExercises : []}
                                                exercise={exercise}
                                                goals={goals}
                                                handleCompleteExercise={isSubmitting ? () => null : (exerciseId, setNumber) => this._handleCompleteExercise(exerciseId, setNumber, recoveryObj.id)}
                                                isLastItem={i + 1 === exerciseList.totalLength}
                                                key={exercise.library_id+i}
                                                priority={priority === 'Efficient' ? 0 : priority === 'Complete' ? 1 : 2}
                                                toggleSelectedExercise={isSubmitting ? () => null : (selectedExerciseObj, isModalOpen) => this._toggleSelectedExercise(selectedExerciseObj, isModalOpen, recoveryObj.id)}
                                            />
                                        )}
                                    </View>
                                    :
                                    null
                            )}
                            { exerciseList.totalLength > 0 ?
                                <Button
                                    buttonStyle={StyleSheet.flatten([AppStyles.buttonVerticalPadding, {backgroundColor: buttonBackgroundColor, borderRadius: 0,}])}
                                    disabled={isButtonDisabled || isSubmitting}
                                    disabledStyle={buttonDisabledStyle}
                                    disabledTitleStyle={{color: AppColors.white,}}
                                    loading={isSubmitting}
                                    onPress={() => this._handleSubmit(index, recoveryObj)}
                                    title={buttonTitle}
                                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(16),}}
                                />
                                :
                                <View style={{backgroundColorflex: 1, paddingHorizontal: AppSizes.paddingXLrg, paddingVertical: AppSizes.padding,}}>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>
                                        {'Add at least one goal to receive exercises.'}
                                    </Text>
                                </View>
                            }
                        </View>
                    </ScrollView>
                    <FathomModal
                        isVisible={isSelectedExerciseModalOpen}
                        style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: AppColors.transparent,}]}
                        updateStatusBar={true}
                    >
                        <Exercises
                            closeModal={() => this.setState({ isSelectedExerciseModalOpen: false, }, () => Actions.refresh({ panHandlers: true, }))}
                            completedExercises={completedExercises ? completedExercises : []}
                            exerciseList={exerciseList}
                            handleCompleteExercise={(exerciseId, setNumber, hasNextExercise) => {
                                this._handleCompleteExercise(exerciseId, setNumber, recoveryObj.id);
                                if(!hasNextExercise) {
                                    this.setState(
                                        { isSelectedExerciseModalOpen: false, },
                                        () => this._handleSubmit(index, recoveryObj),
                                    );
                                }
                            }}
                            handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
                            modality={modality}
                            planActiveRestGoals={plan.activeRestGoals}
                            priority={priority === 0 ? 'Efficient' : priority === 1 ? 'Complete' : 'Comprehensive'}
                            selectedExercise={selectedExercise}
                            user={user}
                        />
                    </FathomModal>
                    {/* isExerciseCompletionModalOpen &&
                        <ExerciseCompletionModal
                            completedExercises={completedExercises}
                            exerciseList={exerciseList}
                            isModalOpen={isExerciseCompletionModalOpen}
                            onClose={() => this.setState({ isExerciseCompletionModalOpen: false, })}
                            onComplete={() => {
                                this.setState(
                                    { isExerciseCompletionModalOpen: false, isSubmitting: true, },
                                    () => {
                                        let reducerCompletedExercises = plan.dailyPlan[0].cool_down[index] && plan.dailyPlan[0].cool_down[index].active && modality === 'cool_down' ? store.getState().plan.completedCoolDownExercises : store.getState().plan.completedExercises;
                                        let { newCompletedExercises, } = PlanLogic.handleCompletedExercises(reducerCompletedExercises);
                                        patchActiveRecovery(newCompletedExercises, recoveryType, user.id)
                                            .then(res => Actions.pop())
                                            .catch(() => this.setState({isSubmitting: false,}, () => AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery)));
                                    }
                                );
                            }}
                            user={user}
                        />
                    */}
                </View>
            </View>
        );
    }
}

ExerciseModality.propTypes = {
    index:                         PropTypes.string.isRequired,
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
