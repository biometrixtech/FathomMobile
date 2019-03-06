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
    healthData:                           {},
    isCompletedAMPMRecoveryModalOpen:     true,
    isFunctionalStrengthCollapsed:        true,
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
        RPE:                            null,
        description:                    '',
        duration:                       0,
        event_date:                     null,
        session_type:                   null,
        sessions:                       [],
        soreness:                       [],
        sport_name:                     null, // this exists for session_type = 0,2,3,6
        strength_and_conditioning_type: null, // this only exists for session_type=1
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
    train:                     {
        completedPostPracticeSurvey: false,
        postPracticeSurveys:         [],
    },
    loading: false,
};

/* Export ==================================================================== */
export default defaultPlanState;