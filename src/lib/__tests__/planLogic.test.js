/* global it expect jest */
import 'react-native';

import { PlanLogic, } from '../';

it('handlePushNotification', () => {
    let props = {};
    props.notification = ''; // ['COMPLETE_ACTIVE_PREP', 'COMPLETE_ACTIVE_RECOVERY', 'COMPLETE_DAILY_READINESS', 'VIEW_PLAN',]
    props.plan = {};
    props.plan.dailyPlan = [];
    props.plan.dailyPlan[0] = {};
    props.plan.dailyPlan[0].pre_recovery_completed = false;
    props.plan.dailyPlan[0].post_recovery = {};
    props.plan.dailyPlan[0].post_recovery.completed = false;
    props.plan.dailyPlan[0].daily_readiness_survey_completed = false;

    let state = {};
    state.prepare = {
        finishedRecovery:           props.plan && props.plan.dailyPlan[0] && props.plan.dailyPlan[0].pre_recovery_completed ? true : false,
        isActiveRecoveryCollapsed:  true,
        isReadinessSurveyCollapsed: true,
        isReadinessSurveyCompleted: false,
    };
    state.recover = {
        finished:                  false,
        isActiveRecoveryCollapsed: true,
    };

    expect(PlanLogic.handlePushNotification(props, state))
        .toEqual(false);
});