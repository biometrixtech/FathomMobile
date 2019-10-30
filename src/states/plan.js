// import required files
import { PlanLogic, } from '../lib';

/**
 * Default MyPlan State
 */
const defaultPlanState = {
    activityIdLoading:  null,
    apiIndex:           null,
    appState:           'active',
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
    expandNotifications: false,
    healthData:          {
        ignoredWorkouts: [],
        sleep:           [],
        workouts:        [],
    },
    isCoachModalOpen:                     false,
    isContactUsOpen:                      false,
    isPageCalculating:                    false,
    isPageLoading:                        false,
    isPostSessionSurveyModalOpen:         false,
    isPrepareSessionsCompletionModalOpen: false,
    isReadinessSurveyModalOpen:           false,
    isReturnSensorsModalOpen:             false,
    isStartSensorSessionModalOpen:        false,
    isTrainSessionsCompletionModalOpen:   false,
    loading:                              false,
    page0:                                {},
    page1:                                {},
    page2:                                {},
    postSession:                          {
        description:      '',
        sessions:         [PlanLogic.returnEmptySession()],
        sessions_planned: null,
        soreness:         [],
    },
    prepare:         {},
    recover:         {},
    sensorSession:   null,
    showLoadingText: false,
    train:           {
        postPracticeSurveys: [],
    },
    trainLoadingScreenText: 'Searching for workouts...',
};

/* Export ==================================================================== */
export default defaultPlanState;