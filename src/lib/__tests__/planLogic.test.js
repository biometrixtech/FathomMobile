/* global it expect jest */
import 'react-native';

import { PlanLogic, } from '../';

const helperFunctions = {

    getPushNotificationHelperProps: (notificationString, preRecoveryCompleted, postRecoveryCompleted, isReadinessSurveyCompleted) => {
        let pushNotificationHelperProps = {};
        pushNotificationHelperProps.notification = notificationString;
        pushNotificationHelperProps.plan = {};
        pushNotificationHelperProps.plan.dailyPlan = [];
        pushNotificationHelperProps.plan.dailyPlan[0] = {};
        pushNotificationHelperProps.plan.dailyPlan[0].pre_recovery_completed = preRecoveryCompleted;
        pushNotificationHelperProps.plan.dailyPlan[0].post_recovery = {};
        pushNotificationHelperProps.plan.dailyPlan[0].post_recovery.completed = postRecoveryCompleted;
        pushNotificationHelperProps.plan.dailyPlan[0].daily_readiness_survey_completed = isReadinessSurveyCompleted;
        return pushNotificationHelperProps;
    },

    getPushNotificationHelperState: (notificationString, helperProps) => {
        let pushNotificationHelperState = {};
        pushNotificationHelperState.prepare = {
            finishedRecovery:           helperProps.plan && helperProps.plan.dailyPlan[0] && helperProps.plan.dailyPlan[0].pre_recovery_completed ? true : false,
            isActiveRecoveryCollapsed:  true,
            isReadinessSurveyCollapsed: true,
            isReadinessSurveyCompleted: false,
        };
        pushNotificationHelperState.recover = {
            finished:                  false,
            isActiveRecoveryCollapsed: true,
        };
        return pushNotificationHelperState;
    },

    getPushNotificationAPExpectedResult: () => {
        let expectedResult = {
            newStateFields: {
                finishedRecovery:           false,
                isActiveRecoveryCollapsed:  false,
                isReadinessSurveyCollapsed: true,
                isReadinessSurveyCompleted: false
            },
            page:                       0,
            stateName:                  'prepare',
            updateExerciseList:         false,
            updatePushNotificationFlag: true
        };
        return expectedResult;
    },

    getPushNotificationARExpectedResult: () => {
        let expectedResult = {
            newStateFields:             { finished: false, isActiveRecoveryCollapsed: false },
            page:                       2,
            stateName:                  'recover',
            updateExerciseList:         false,
            updatePushNotificationFlag: true
        };
        return expectedResult;
    },

    getPushNotificationReadinessExpectedResult: () => {
        let expectedResult = {
            newStateFields:             true,
            page:                       0,
            stateName:                  'isReadinessSurveyModalOpen',
            updateExerciseList:         false,
            updatePushNotificationFlag: true
        };
        return expectedResult;
    },

    getPushNotificationPlanExpectedResult: () => {
        let expectedResult = {
            newStateFields:             '',
            page:                       null,
            stateName:                  '',
            updateExerciseList:         true,
            updatePushNotificationFlag: true
        };
        return expectedResult;
    },

    getPushNotificationIgnoreExpectedResult: () => {
        let expectedResult = {
            newStateFields:             '',
            page:                       0,
            stateName:                  '',
            updateExerciseList:         false,
            updatePushNotificationFlag: false
        };
        return expectedResult;
    },

    getDailyReadinessDefaultState: () => {
        let dailyReadinessDefaultState = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 0,
            sleep_quality:             0,
            soreness:                  [],
            wants_functional_strength: null,
        };
        return dailyReadinessDefaultState;
    },

    getPostSessionDefaultState: () => {
        let postSessionState = {
            RPE:                            0,
            description:                    '',
            duration:                       0,
            event_date:                     null,
            session_type:                   null,
            soreness:                       [],
            sport_name:                     null, // this exists for session_type = 0,2,3,6
            strength_and_conditioning_type: null, // this only exists for session_type=1
        };
        return postSessionState;
    },

    getDailyReadinessReadinessInputExpectedResult: key => {
        let expectedResult = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 (key * 2),
            sleep_quality:             0,
            soreness:                  [],
            wants_functional_strength: null,
        };
        return expectedResult;
    },

    getDailyReadinessSleepQualityInputExpectedResult: key => {
        let expectedResult = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 0,
            sleep_quality:             (key * 2),
            soreness:                  [],
            wants_functional_strength: null,
        };
        return expectedResult;
    },

    getDailyReadinessFSInputExpectedResult: wantsFS => {
        let expectedResult = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 0,
            sleep_quality:             0,
            soreness:                  [],
            wants_functional_strength: wantsFS,
        };
        return expectedResult;
    },

};

it('Daily Readiness Form Change - Readiness Input', () => {
    let key = 3;
    let expectedResult = helperFunctions.getDailyReadinessReadinessInputExpectedResult(key);
    let value = (key * 2);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessFormChange('readiness', value, false, false, false, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Sleep Quality Input', () => {
    let key = 3;
    let expectedResult = helperFunctions.getDailyReadinessSleepQualityInputExpectedResult(key);
    let value = (key * 2);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessFormChange('sleep_quality', value, false, false, false, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Wants FS Input - T', () => {
    let value = true;
    let expectedResult = helperFunctions.getDailyReadinessFSInputExpectedResult(value);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessFormChange('wants_functional_strength', value, false, false, false, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Wants FS Input - F', () => {
    let value = false;
    let expectedResult = helperFunctions.getDailyReadinessFSInputExpectedResult(value);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessFormChange('wants_functional_strength', value, false, false, false, dailyReadinessDefaultState)).toEqual(expectedResult);
});

// TODO: dailyReadiness- soreness
// TODO: dailyReadiness- current_position
// TODO: dailyReadiness- current_sport_name

// TODO: postSession- RPE
// TODO: postSession- description
// TODO: postSession- duration
// TODO: postSession- event_date
// TODO: postSession- session_type
// TODO: postSession- soreness
// TODO: postSession- sport_name
// TODO: postSession- strength_and_conditioning_type

it('Active Prep Push Notification Result - FFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', false, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationAPExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - FFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', false, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationAPExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - FTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', false, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationAPExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - FTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', false, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationAPExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - TFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', true, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - TTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', true, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - TFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', true, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - TTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', true, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - FFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', false, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationARExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - FFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', false, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationARExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - FTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', false, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - FTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', false, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - TFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', true, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationARExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - TTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', true, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - TFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', true, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationARExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - TTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', true, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - FFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', false, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationReadinessExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - FFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', false, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - FTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', false, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - FTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', false, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationReadinessExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - TFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', true, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationReadinessExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - TTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', true, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationReadinessExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - TFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', true, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - TTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', true, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - FFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', false, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - FFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', false, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - FTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', false, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - FTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', false, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - TFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', true, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - TTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', true, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - TFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', true, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - TTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', true, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - FFF', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', false, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - FFT', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', false, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - FTT', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', false, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - FTF', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', false, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - TFF', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', true, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - TTF', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', true, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - TFT', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', true, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - TTT', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', true, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});
