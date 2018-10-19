/* global it expect jest */
import 'react-native';

import { PlanLogic, } from '../';

const helperFunctions = {

    getPushNotificationHelperProps: (notificationString) => {
        let pushNotificationHelperProps = {};
        pushNotificationHelperProps.notification = notificationString;
        pushNotificationHelperProps.plan = {};
        pushNotificationHelperProps.plan.dailyPlan = [];
        pushNotificationHelperProps.plan.dailyPlan[0] = {};
        pushNotificationHelperProps.plan.dailyPlan[0].pre_recovery_completed = false;
        pushNotificationHelperProps.plan.dailyPlan[0].post_recovery = {};
        pushNotificationHelperProps.plan.dailyPlan[0].post_recovery.completed = false;
        pushNotificationHelperProps.plan.dailyPlan[0].daily_readiness_survey_completed = false;
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
            page:                       0,
            stateName:                  '',
            updateExerciseList:         true,
            updatePushNotificationFlag: true
        };
        return expectedResult;
    },

    getPushNotificationExtraExpectedResult: () => {
        let expectedResult = {
            newStateFields:             '',
            page:                       0,
            stateName:                  '',
            updateExerciseList:         true,
            updatePushNotificationFlag: true
        };
        return expectedResult;
    },

};

it('handlePushNotification', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP');
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationAPExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('handlePushNotification', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY');
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationARExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('handlePushNotification', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS');
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationReadinessExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('handlePushNotification', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN');
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('handlePushNotification', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK');
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationExtraExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});
