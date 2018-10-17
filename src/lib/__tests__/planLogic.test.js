/* global it expect jest */
import 'react-native';

import { PlanLogic, } from '../';

const helperFunctions = {
    pushNotification: (notificationString) => {
        let helperProps = {};
        helperProps.notification = notificationString;
        helperProps.plan = {};
        helperProps.plan.dailyPlan = [];
        helperProps.plan.dailyPlan[0] = {};
        helperProps.plan.dailyPlan[0].pre_recovery_completed = false;
        helperProps.plan.dailyPlan[0].post_recovery = {};
        helperProps.plan.dailyPlan[0].post_recovery.completed = false;
        helperProps.plan.dailyPlan[0].daily_readiness_survey_completed = false;
        let helperState = {};
        helperState.prepare = {
            finishedRecovery:           helperProps.plan && helperProps.plan.dailyPlan[0] && helperProps.plan.dailyPlan[0].pre_recovery_completed ? true : false,
            isActiveRecoveryCollapsed:  true,
            isReadinessSurveyCollapsed: true,
            isReadinessSurveyCompleted: false,
        };
        helperState.recover = {
            finished:                  false,
            isActiveRecoveryCollapsed: true,
        };
        let expectedResult = {
            newStateFields: notificationString === 'COMPLETE_ACTIVE_PREP' ?
                {
                    finishedRecovery:           false,
                    isActiveRecoveryCollapsed:  false,
                    isReadinessSurveyCollapsed: true,
                    isReadinessSurveyCompleted: false
                }
                : notificationString === 'COMPLETE_ACTIVE_RECOVERY' ?
                    {finished: false, isActiveRecoveryCollapsed: false}
                    : notificationString === 'COMPLETE_DAILY_READINESS' ?
                        true
                        :
                        '',
            page:                       notificationString === 'COMPLETE_ACTIVE_RECOVERY' ? 2 : 0,
            stateName:                  notificationString === 'COMPLETE_ACTIVE_PREP' ? 'prepare' : notificationString === 'COMPLETE_ACTIVE_RECOVERY' ? 'recover' : notificationString === 'COMPLETE_DAILY_READINESS' ? 'isReadinessSurveyModalOpen' : '',
            updateExerciseList:         notificationString === 'VIEW_PLAN' || notificationString === 'FATHOM_BREAK' ? true : false,
            updatePushNotificationFlag: true
        };
        return { expectedResult, helperProps, helperState, };
    },
};

it('handlePushNotification', () => {
    const validNotifs = ['COMPLETE_ACTIVE_PREP', 'COMPLETE_ACTIVE_RECOVERY', 'COMPLETE_DAILY_READINESS', 'VIEW_PLAN', 'FATHOM_BREAK'];
    for (let i = 0; i < validNotifs.length; i+=1) {
        let { expectedResult, helperProps, helperState, } = helperFunctions.pushNotification(validNotifs[i]);
        expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
    }
});