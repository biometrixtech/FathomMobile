/**
 * Prepare
 *
    <Prepare

    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, RefreshControl, ScrollView, StyleSheet, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LottieView from 'lottie-react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, MyPlan as MyPlanConstants, } from '../../../constants';
import { AppUtil, PlanLogic, } from '../../../lib';
import { store } from '../../../store';
import { FathomModal, ListItem, Spacer, TabIcon, Text, } from '../../custom';
import {
    ActiveRecoveryBlocks,
    ActiveTimeSlideUpPanel,
    DefaultListGap,
    Exercises,
    ExerciseCompletionModal,
    PrioritySlideUpPanel,
    ReadinessSurvey,
    SessionsCompletionModal,
} from '../pages';

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
    alertMessageWrapper: {
        alignSelf:    'center',
        flex:         1,
        marginRight:  9,
        paddingLeft:  37,
        paddingRight: 10,
    },
    alertMessageIconWrapper: {
        alignSelf:            'stretch',
        backgroundColor:      AppColors.zeplin.yellow,
        borderTopLeftRadius:  5,
        borderTopRightRadius: 5,
        paddingVertical:      AppSizes.paddingSml,
    },
    alertMessageTextWrapper: {
        backgroundColor:         AppColors.primary.grey.twentyPercent,
        borderBottomLeftRadius:  5,
        borderBottomRightRadius: 5,
        flex:                    1,
        padding:                 AppSizes.padding,
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { height: 3, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  4,
    },
});

/* Component ==================================================================== */
const Prepare = ({
    completedExercises,
    dailyReadiness,
    disabled,
    errorInARAPMessage,
    exerciseList,
    healthData,
    highSorenessMessage,
    index,
    isActive,
    isCompleted,
    isFSCalculating,
    isPageLoading,
    isPrepCalculating,
    isPrepareExerciseCompletionModalOpen,
    isPreparePrioritySlideUpPanelOpen,
    isPrepareSessionsCompletionModalOpen,
    isPrepareSlideUpPanelOpen,
    isReadinessSurveyCompleted,
    isReadinessSurveyModalOpen,
    isRecoverCalculating,
    isSelectedExerciseModalOpen,
    plan,
    preRecoveryPriority,
    prepare,
    prepareSelectedActiveTime,
    recoveryObj,
    tabs,
    selectedExercise,
    user,

    _changeSelectedActiveTime,
    _closePrepareSessionsCompletionModal,
    _goToScrollviewPage,
    _handleAreaOfSorenessClick,
    _handleCompleteExercise,
    _handleDailyReadinessFormChange,
    _handleExerciseListRefresh,
    _handleHealthDataFormChange,
    _handleReadinessSurveySubmit,
    _handleUpdateFirstTimeExperience,
    _handleUpdateUserHealthKitFlag,
    _togglePrepareSlideUpPanel,
    _toggleRecoveryGoal,
    _toggleSelectedExercise,
    clearCompletedExercises,
    clearCompletedFSExercises,
    patchActiveRecovery,
    patchActiveTime,

    toggleActiveRecoveryCollapsed,
    toggleSlideUpPanel,
}) => (
    <ScrollView
        contentContainerStyle={{backgroundColor: AppColors.white,}}
        refreshControl={
            isFSCalculating || isPrepCalculating || isRecoverCalculating ?
                null
                :
                <RefreshControl
                    colors={[AppColors.zeplin.yellow]}
                    onRefresh={() => _handleExerciseListRefresh(false)}
                    refreshing={isPageLoading}
                    title={'Loading...'}
                    titleColor={AppColors.zeplin.yellow}
                    tintColor={AppColors.zeplin.yellow}
                />
        }
        tabLabel={tabs[index]}
    >
        <Spacer size={30} />
        { isReadinessSurveyCompleted ?
            <View>
                <ListItem
                    disabled={false}
                    hideChevron={true}
                    leftIcon={
                        <View style={[{height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}>
                            <LottieView
                                autoPlay={true}
                                loop={false}
                                source={require('../../../../assets/animation/checkmark-circle.json')}
                            />
                        </View>
                    }
                    title={'READINESS SURVEY'}
                    titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, {color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24),}]}
                />
                <DefaultListGap
                    size={24}
                />
            </View>
            :
            null
        }
        <ListItem
            disabled={disabled}
            hideChevron={true}
            leftIcon={
                isCompleted ?
                    <View style={[{height: AppStyles.h3.lineHeight, marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}>
                        <LottieView
                            autoPlay={true}
                            loop={false}
                            source={require('../../../../assets/animation/checkmark-circle.json')}
                        />
                    </View>
                    :
                    <TabIcon
                        color={isCompleted ? AppColors.zeplin.yellow : AppColors.black}
                        containerStyle={[{marginBottom: AppStyles.h3.marginBottom, width: AppFonts.scaleFont(24),}]}
                        icon={isCompleted ? 'check-circle' : disabled ? 'lock' : 'fiber-manual-record'}
                        size={isCompleted ? AppFonts.scaleFont(24) : AppFonts.scaleFont(20)}
                    />
            }
            title={'MOBILIZE'}
            titleStyle={[AppStyles.h3, AppStyles.oswaldMedium, {color: AppColors.activeTabText, fontSize: AppFonts.scaleFont(24),}]}
        />
        {
            /* eslint-disable indent */
            disabled && !isPrepCalculating ?
                <View style={{flex: 1, flexDirection: 'row',}}>
                    <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                    <View style={{flex: 1, paddingLeft: 20, paddingRight: 15 }}>
                        <ActiveRecoveryBlocks />
                    </View>
                </View>
            : disabled || isPrepCalculating ?
                <View style={{flex: 1, flexDirection: 'row',}}>
                    <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                    <View style={{flex: 1, paddingLeft: 20, paddingRight: 15,}}>
                        <ActiveRecoveryBlocks />
                        <Spacer size={12}/>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.white, borderColor: AppColors.zeplin.yellow, width: '100%',}}
                            containerStyle={{flex: 1, marginLeft: 0, marginRight: 10,}}
                            loading={isPrepCalculating}
                            loadingProps={{color: AppColors.zeplin.yellow,}}
                            onPress={() => null}
                            title={'Calculating...'}
                            titleStyle={{color: AppColors.zeplin.yellow, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                            type={'outline'}
                        />
                    </View>
                </View>
            : isActive ?
                exerciseList.unFilteredExerciseArray.length === 0 ?
                    <View style={{flex: 1,}}>
                        <Spacer size={10} />
                        <View style={[AppStyles.containerCentered, customStyles.alertMessageWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                            <TabIcon
                                color={AppColors.white}
                                containerStyle={[customStyles.alertMessageIconWrapper, {backgroundColor: AppColors.zeplin.error,}]}
                                icon={'alert'}
                                size={AppFonts.scaleFont(26)}
                                type={'material-community'}
                            />
                            <View style={[customStyles.alertMessageTextWrapper,]}>
                                <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(13),}]}>{highSorenessMessage}</Text>
                            </View>
                        </View>
                    </View>
                : prepare.isActiveRecoveryCollapsed ?
                    <View style={{flex: 1, flexDirection: 'row',}}>
                        <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                        <View style={{flex: 1, paddingLeft: 20, paddingRight: 15,}}>
                            <ActiveRecoveryBlocks
                                goals={plan.goals}
                                recoveryObj={recoveryObj}
                                recoveryPriority={preRecoveryPriority}
                                toggleActiveTimeSlideUpPanel={toggleSlideUpPanel}//_togglePrepareSlideUpPanel}
                                toggleRecoveryGoal={_toggleRecoveryGoal}
                            />
                            <Spacer size={12}/>
                            <Button
                                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, width: '100%',}}
                                containerStyle={{flex: 1, marginLeft: 0, marginRight: 10,}}
                                onPress={toggleActiveRecoveryCollapsed}
                                title={completedExercises && completedExercises.length > 0 ? 'Continue' : 'Start'}
                                titleStyle={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                            />
                        </View>
                    </View>
                    :
                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row',}}>
                            <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                            <View style={{flex: 1, paddingLeft: 20, paddingRight: 15,}}>
                                <ActiveRecoveryBlocks
                                    goals={plan.goals}
                                    recoveryObj={recoveryObj}
                                    recoveryPriority={preRecoveryPriority}
                                    toggleActiveTimeSlideUpPanel={toggleSlideUpPanel}//_togglePrepareSlideUpPanel}
                                    toggleRecoveryGoal={_toggleRecoveryGoal}
                                />
                                <Spacer size={20}/>
                                <Text
                                    onPress={toggleActiveRecoveryCollapsed}
                                    robotoBold
                                    style={[AppStyles.textCenterAligned,
                                        {
                                            color:              AppColors.zeplin.yellow,
                                            fontSize:           AppFonts.scaleFont(14),
                                            marginRight:        10,
                                            textDecorationLine: 'none',
                                        }
                                    ]}
                                >
                                    {'Hide Exercises ^'}
                                </Text>
                            </View>
                        </View>
                        <ExerciseList
                            completedExercises={completedExercises}
                            exerciseList={exerciseList}
                            handleCompleteExercise={(exerciseId, setNumber) => _handleCompleteExercise(exerciseId, setNumber, 'pre')}
                            isPrep={true}
                            toggleCompletedAMPMRecoveryModal={() => this.setState({ isPrepareExerciseCompletionModalOpen: true, })}
                            toggleSelectedExercise={_toggleSelectedExercise}
                        />
                    </View>
            : isCompleted ?
                <View style={{flex: 1, flexDirection: 'row',}}>
                    <View style={{borderRightColor: AppColors.white, borderRightWidth: 1,paddingLeft: 22,}} />
                    <View style={{flex: 1, paddingLeft: 30, paddingRight: 15,}}>
                        <ActiveRecoveryBlocks
                            goals={plan.goals}
                            recoveryObj={recoveryObj}
                            recoveryPriority={preRecoveryPriority}
                            toggleRecoveryGoal={_toggleRecoveryGoal}
                        />
                    </View>
                </View>
            :
            <View style={{flex: 1, flexDirection: 'row',}}>
                <View style={{borderRightColor: AppColors.white, borderRightWidth: 1, paddingLeft: 22,}} />
                <View style={{flex: 1, marginBottom: 30, marginLeft: 20, marginRight: 15,}}>
                    <Text robotoRegular style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(18),}]}>{errorInARAPMessage}</Text>
                </View>
            </View>
        }
        <FathomModal
            isVisible={isReadinessSurveyModalOpen}
            style={{margin: 0,}}
        >
            <ReadinessSurvey
                dailyReadiness={dailyReadiness}
                handleAreaOfSorenessClick={_handleAreaOfSorenessClick}
                handleFormChange={_handleDailyReadinessFormChange}
                handleFormSubmit={_handleReadinessSurveySubmit}
                handleHealthDataFormChange={_handleHealthDataFormChange}
                handleUpdateFirstTimeExperience={_handleUpdateFirstTimeExperience}
                handleUpdateUserHealthKitFlag={_handleUpdateUserHealthKitFlag}
                healthKitWorkouts={healthData.workouts && healthData.workouts.length > 0 ? healthData.workouts : null}
                soreBodyParts={plan.soreBodyParts}
                typicalSessions={plan.typicalSessions}
                user={user}
            />
        </FathomModal>
        <FathomModal
            isVisible={isSelectedExerciseModalOpen}
            style={[AppStyles.containerCentered, AppStyles.modalShadowEffect, {backgroundColor: AppColors.transparent, margin: 0,}]}
        >
            <Exercises
                closeModal={() => this.setState({ isSelectedExerciseModalOpen: false, })}
                completedExercises={completedExercises}
                exerciseList={exerciseList}
                handleCompleteExercise={(exerciseId, setNumber, hasNextExercise, isUnChecked) => {
                    _handleCompleteExercise(exerciseId, setNumber, 'pre');
                    if(!hasNextExercise && isUnChecked) {
                        this.setState(
                            { isSelectedExerciseModalOpen: false, },
                            () => { this.goToPageTimer = _.delay(() => this.setState({ isPrepareExerciseCompletionModalOpen: true, }), 750); }
                        );
                    }
                }}
                handleUpdateFirstTimeExperience={_handleUpdateFirstTimeExperience}
                selectedExercise={selectedExercise}
                user={user}
            />
        </FathomModal>
        <PrioritySlideUpPanel
            changeSelectedPriority={selectedIndex => _changeSelectedActiveTime((selectedIndex + 1), 'preRecoveryPriority')}
            isSlideUpPanelOpen={isPreparePrioritySlideUpPanelOpen}
            selectedPriority={preRecoveryPriority}
            toggleSlideUpPanel={toggleSlideUpPanel}
        />
        <ActiveTimeSlideUpPanel
            changeSelectedActiveTime={(selectedIndex) => _changeSelectedActiveTime(selectedIndex, 'prepareSelectedActiveTime')}
            isSlideUpPanelOpen={isPrepareSlideUpPanelOpen}
            selectedActiveTime={prepareSelectedActiveTime}
            toggleSlideUpPanel={() => {
                let selectedActiveTime = MyPlanConstants.selectedActiveTimes(prepareSelectedActiveTime).selectedTime;
                // send api if selected active time is different from reducer
                if(recoveryObj.minutes_duration !== selectedActiveTime) {
                    // trigger calculating
                    this.setState(
                        { isPrepCalculating: true, },
                        () => {
                            // send api
                            patchActiveTime(selectedActiveTime)
                                .then(response => {
                                    this.setState({ isPrepCalculating: false, });
                                    clearCompletedExercises();
                                    clearCompletedFSExercises();
                                })
                                .catch(() => {
                                    this.setState({ isPrepCalculating: false, });
                                    AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                                });
                        }
                    );
                }
                // hide slide up panel
                _togglePrepareSlideUpPanel();
            }}
        />
        <SessionsCompletionModal
            isModalOpen={isPrepareSessionsCompletionModalOpen}
            onClose={_closePrepareSessionsCompletionModal}
            sessions={dailyReadiness.sessions && dailyReadiness.sessions.length > 0 ? dailyReadiness.sessions : []}
        />
        <ExerciseCompletionModal
            completedExercises={completedExercises}
            exerciseList={exerciseList}
            isModalOpen={isPrepareExerciseCompletionModalOpen}
            onClose={() => this.setState({ isPrepareExerciseCompletionModalOpen: false, })}
            onComplete={() => {
                this.setState({ isPrepareExerciseCompletionModalOpen: false, });
                let { newCompletedExercises, } = PlanLogic.handleCompletedExercises(store.getState().plan.completedExercises);
                patchActiveRecovery(newCompletedExercises, 'pre')
                    .then(res => {
                        let newDailyPlanObj = store.getState().plan.dailyPlan[0];
                        this.setState(
                            {
                                prepare: Object.assign({}, prepare, {
                                    finishedRecovery:          true,
                                    isActiveRecoveryCollapsed: true,
                                }),
                            },
                            () => _goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(newDailyPlanObj)),
                        )
                    })
                    .catch(() => {
                        AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                    });
            }}
            user={user}
        />
    </ScrollView>
);

Prepare.propTypes = {
    completedExercises:                   PropTypes.array.isRequired,
    dailyReadiness:                       PropTypes.object.isRequired,
    disabled:                             PropTypes.bool.isRequired,
    errorInARAPMessage:                   PropTypes.string.isRequired,
    exerciseList:                         PropTypes.object.isRequired,
    healthData:                           PropTypes.object.isRequired,
    highSorenessMessage:                  PropTypes.string.isRequired,
    index:                                PropTypes.number.isRequired,
    isActive:                             PropTypes.bool.isRequired,
    isCompleted:                          PropTypes.bool.isRequired,
    isFSCalculating:                      PropTypes.bool.isRequired,
    isPageLoading:                        PropTypes.bool.isRequired,
    isPrepCalculating:                    PropTypes.bool.isRequired,
    isPrepareExerciseCompletionModalOpen: PropTypes.bool.isRequired,
    isPrepareSessionsCompletionModalOpen: PropTypes.bool.isRequired,
    isPrepareSlideUpPanelOpen:            PropTypes.bool.isRequired,
    isPreparePrioritySlideUpPanelOpen:    PropTypes.bool.isRequired,
    isReadinessSurveyCompleted:           PropTypes.bool.isRequired,
    isReadinessSurveyModalOpen:           PropTypes.bool.isRequired,
    isRecoverCalculating:                 PropTypes.bool.isRequired,
    isSelectedExerciseModalOpen:          PropTypes.bool.isRequired,
    plan:                                 PropTypes.object.isRequired,
    preRecoveryPriority:                  PropTypes.number.isRequired,
    prepare:                              PropTypes.object.isRequired,
    prepareSelectedActiveTime:            PropTypes.number.isRequired,
    recoveryObj:                          PropTypes.object.isRequired,
    selectedExercise:                     PropTypes.object.isRequired,
    tabs:                                 PropTypes.array.isRequired,
    user:                                 PropTypes.object.isRequired,

    _changeSelectedActiveTime: PropTypes.func.isRequired,
    _closePrepareSessionsCompletionModal: PropTypes.func.isRequired,
    _goToScrollviewPage: PropTypes.func.isRequired,
    _handleAreaOfSorenessClick: PropTypes.func.isRequired,
    _handleCompleteExercise: PropTypes.func.isRequired,
    _handleDailyReadinessFormChange: PropTypes.func.isRequired,
    _handleExerciseListRefresh: PropTypes.func.isRequired,
    _handleHealthDataFormChange: PropTypes.func.isRequired,
    _handleReadinessSurveySubmit: PropTypes.func.isRequired,
    _handleUpdateFirstTimeExperience: PropTypes.func.isRequired,
    _handleUpdateUserHealthKitFlag: PropTypes.func.isRequired,
    _togglePrepareSlideUpPanel: PropTypes.func.isRequired,
    _toggleRecoveryGoal: PropTypes.func.isRequired,
    _toggleSelectedExercise: PropTypes.func.isRequired,
    clearCompletedExercises: PropTypes.func.isRequired,
    clearCompletedFSExercises: PropTypes.func.isRequired,
    patchActiveRecovery: PropTypes.func.isRequired,
    patchActiveTime: PropTypes.func.isRequired,

    toggleSlideUpPanel: PropTypes.func.isRequired,
};

Prepare.defaultProps = {};

Prepare.componentName = 'Prepare';

/* Export Component ================================================================== */
export default Prepare;

/*
return (
    <Prepare
        completedExercises={completedExercises}
        dailyReadiness={dailyReadiness}
        disabled={disabled}
        errorInARAPMessage={errorInARAPMessage}
        exerciseList={exerciseList}
        healthData={healthData}
        highSorenessMessage={highSorenessMessage}
        index={index}
        isActive={isActive}
        isCompleted={isCompleted}
        isFSCalculating={isFSCalculating}
        isPageLoading={isPageLoading}
        isPrepCalculating={isPrepCalculating}
        isPrepareExerciseCompletionModalOpen={isPrepareExerciseCompletionModalOpen}
        isPreparePrioritySlideUpPanelOpen={isPreparePrioritySlideUpPanelOpen}
        isPrepareSessionsCompletionModalOpen={isPrepareSessionsCompletionModalOpen}
        isPrepareSlideUpPanelOpen={isPrepareSlideUpPanelOpen}
        isReadinessSurveyCompleted={isReadinessSurveyCompleted}
        isReadinessSurveyModalOpen={isReadinessSurveyModalOpen}
        isRecoverCalculating={isRecoverCalculating}
        isSelectedExerciseModalOpen={isSelectedExerciseModalOpen}
        plan={plan}
        preRecoveryPriority={preRecoveryPriority}
        prepare={prepare}
        prepareSelectedActiveTime={prepareSelectedActiveTime}
        recoveryObj={recoveryObj}
        selectedExercise={selectedExercise}
        tabs={tabs}
        user={user}

        _changeSelectedActiveTime={this._changeSelectedActiveTime}
        _closePrepareSessionsCompletionModal={this._closePrepareSessionsCompletionModal}
        _goToScrollviewPage={this._goToScrollviewPage}
        _handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
        _handleCompleteExercise={this._handleCompleteExercise}
        _handleDailyReadinessFormChange={this._handleDailyReadinessFormChange}
        _handleExerciseListRefresh={this._handleExerciseListRefresh}
        _handleHealthDataFormChange={this._handleHealthDataFormChange}
        _handleReadinessSurveySubmit={this._handleReadinessSurveySubmit}
        _handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
        _handleUpdateUserHealthKitFlag={this._handleUpdateUserHealthKitFlag}
        _togglePrepareSlideUpPanel={this._togglePrepareSlideUpPanel}
        _toggleRecoveryGoal={this._toggleRecoveryGoal}
        _toggleSelectedExercise={this._toggleSelectedExercise}
        clearCompletedExercises={this.props.clearCompletedExercises}
        clearCompletedFSExercises={this.props.clearCompletedFSExercises}
        patchActiveRecovery={this.props.patchActiveRecovery}
        patchActiveTime={this.props.patchActiveTime}

        toggleActiveRecoveryCollapsed={() => this.setState({ prepare: Object.assign({}, prepare, { isActiveRecoveryCollapsed: !prepare.isActiveRecoveryCollapsed, })})}
        toggleSlideUpPanel={() => this.setState({ isPreparePrioritySlideUpPanelOpen: !isPreparePrioritySlideUpPanelOpen, })}

        toggleCompletedAMPMRecoveryModal={() => this.setState({ isPrepareExerciseCompletionModalOpen: true, })}
        closeModal={() => this.setState({ isSelectedExerciseModalOpen: false, })}
        handleCompleteExercise={(exerciseId, setNumber, hasNextExercise, isUnChecked) => {
            this._handleCompleteExercise(exerciseId, setNumber, 'pre');
            if(!hasNextExercise && isUnChecked) {
                this.setState(
                    { isSelectedExerciseModalOpen: false, },
                    () => { this.goToPageTimer = _.delay(() => this.setState({ isPrepareExerciseCompletionModalOpen: true, }), 750); }
                );
            }
        }}
        toggleSlideUpPanel={() => {
            let selectedActiveTime = MyPlanConstants.selectedActiveTimes(prepareSelectedActiveTime).selectedTime;
            // send api if selected active time is different from reducer
            if(recoveryObj.minutes_duration !== selectedActiveTime) {
                // trigger calculating
                this.setState(
                    { isPrepCalculating: true, },
                    () => {
                        // send api
                        this.patchActiveTime(selectedActiveTime)
                            .then(response => {
                                this.setState({ isPrepCalculating: false, });
                                this.clearCompletedExercises();
                                this.clearCompletedFSExercises();
                            })
                            .catch(() => {
                                this.setState({ isPrepCalculating: false, });
                                AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                            });
                    }
                );
            }
            // hide slide up panel
            this._togglePrepareSlideUpPanel();
        }}
        onClose={() => this.setState({ isPrepareExerciseCompletionModalOpen: false, })}
        onComplete={() => {
            this.setState({ isPrepareExerciseCompletionModalOpen: false, });
            let { newCompletedExercises, } = PlanLogic.handleCompletedExercises(store.getState().plan.completedExercises);
            this.patchActiveRecovery(newCompletedExercises, 'pre')
                .then(res => {
                    let newDailyPlanObj = store.getState().plan.dailyPlan[0];
                    this.setState(
                        {
                            prepare: Object.assign({}, prepare, {
                                finishedRecovery:          true,
                                isActiveRecoveryCollapsed: true,
                            }),
                        },
                        () => this._goToScrollviewPage(MyPlanConstants.scrollableTabViewPage(newDailyPlanObj)),
                    )
                })
                .catch(() => {
                    AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery);
                });
        }}

    />
)
*/