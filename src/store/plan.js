/*
 * @Author: Vir Desai
 * @Date: 2018-07-13 02:17:24
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-14 12:52:01
 */

import moment from 'moment';

/**
 * MyPlan Store
 */
export default {
    coachesDashboardData: [],
    completedExercises:   [],
    completedFSExercises: [],
    dailyPlan:            [{
        bump_up_sessions:                       [],
        completed_functional_strength_sessions: 0,
        completed_post_recovery_sessions:       [],
        cross_training_sessions:                [],
        daily_readiness_survey_completed:       false,
        date:                                   moment().format('YYYY-MM-DD'),
        day_of_week:                            2,
        functional_strength_completed:          false,
        functional_strength_eligible:           false,
        functional_strength_session:            null,
        game_sessions:                          [],
        landing_screen:                         0,
        last_sensor_sync:                       null,
        last_updated:                           null,
        nav_bar_indicator:                      0,
        post_recovery:                          {
            activate_exercises:   [],
            activate_iterations:  0,
            completed:            false,
            display_exercises:    false,
            event_date:           null,
            goal_text:            '',
            impact_score:         0,
            inhibit_exercises:    [],
            inhibit_iterations:   0,
            integrate_exercises:  [],
            integrate_iterations: 0,
            lengthen_exercises:   [],
            lengthen_iterations:  0,
            minutes_duration:     0,
            start_date:           null,
            why_text:             '',
        },
        post_recovery_completed: false,
        practice_sessions:       [],
        pre_recovery:            {
            activate_exercises:   [],
            activate_iterations:  0,
            completed:            false,
            display_exercises:    false,
            event_date:           null,
            goal_text:            '',
            impact_score:         0,
            inhibit_exercises:    [],
            inhibit_iterations:   0,
            integrate_exercises:  [],
            integrate_iterations: 0,
            lengthen_exercises:   [],
            lengthen_iterations:  0,
            minutes_duration:     0,
            start_date:           null,
            why_text:             '',
        },
        pre_recovery_completed: false,
        recovery_am:            null,
        recovery_pm:            null,
        sessions_planned:       true,
        training_sessions:      [],
    }],
    lastOpened:      { date: '', userId: '' },
    postSession:     {},
    soreBodyParts:   {},
    typicalSessions: [],
};