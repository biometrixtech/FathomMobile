// import third-party libraries
import moment from 'moment';

// import required files
import { PlanLogic, } from '../lib';

/**
 * Default MyPlan State
 */
const defaultPlanState = {
    currentTabLocation: 0,
    dailyReadiness:     {
        current_position:          null,
        current_sport_name:        null,
        readiness:                 null,
        sessions:                  [PlanLogic.returnEmptySession()],
        sessions_planned:          null,
        sleep_quality:             null,
        soreness:                  [],
        wants_functional_strength: null,
        // won't be submitted, help with UI
        already_trained_number:    null,
    },
    functionalStrength: {
        current_position:   null,
        current_sport_name: null,
        event_date:         `${moment().toISOString(true).split('.')[0]}Z`,
    },
    healthData:                           {},
    isCompletedAMPMRecoveryModalOpen:     true,
    isFunctionalStrengthCollapsed:        true,
    isFunctionalStrengthModalOpen:        false,
    isFSCalculating:                      false,
    isFSExerciseCompletionModalOpen:      false,
    isPageLoading:                        false,
    isPostSessionSurveyModalOpen:         false,
    isPrepCalculating:                    false,
    isPrepareExerciseCompletionModalOpen: false,
    isPrepareSessionsCompletionModalOpen: false,
    isPrepareSlideUpPanelOpen:            false,
    isReadinessSurveyModalOpen:           false,
    isRecoverCalculating:                 false,
    isRecoverExerciseCompletionModalOpen: false,
    isRecoverSlideUpPanelOpen:            false,
    isSelectedExerciseModalOpen:          false,
    isTrainSessionsCompletionModalOpen:   false,
    page0:                                {},
    page1:                                {},
    page2:                                {},
    postSession:                          {
        description: '',
        sessions:    [PlanLogic.returnEmptySession()],
        soreness:    [],
    },
    prepare: {
        finishedRecovery:           false,
        isActiveRecoveryCollapsed:  true,
        isReadinessSurveyCollapsed: false,
        isReadinessSurveyCompleted: false,
    },
    prepareSelectedActiveTime: 2,
    recover:                   {
        finished:                  false,
        isActiveRecoveryCollapsed: true,
    },
    recoverSelectedActiveTime: 2,
    selectedExercise:          {},
    showLoadingText:           false,
    timer:                     null,
    train:                     {
        completedPostPracticeSurvey: false,
        postPracticeSurveys:         [],
    },
    trainLoadingScreenText: 'LOADING WORKOUTS...',
    loading:                false,
};

/* Export ==================================================================== */
export default defaultPlanState;