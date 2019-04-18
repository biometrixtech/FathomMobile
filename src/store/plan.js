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

const recoveryObj = {
    activate_exercises:  [],
    completed:           false,
    display_exercises:   false,
    event_date:          null,
    goal_text:           '',
    impact_score:        0,
    inhibit_exercises:   [],
    integrate_exercises: [],
    lengthen_exercises:  [],
    minutes_duration:    0,
    start_date:          null,
    why_text:            '',
};

export default {
    coachesDashboardData: [],
    completedExercises:   [],
    completedFSExercises: [],
    dailyPlan:            [{
        completed_functional_strength_sessions: 0,
        daily_readiness_survey_completed:       false,
        date:                                   moment().format('YYYY-MM-DD'),
        functional_strength_completed:          false,
        functional_strength_eligible:           false,
        functional_strength_session:            null,
        landing_screen:                         0,
        last_sensor_sync:                       null,
        nav_bar_indicator:                      0,
        post_recovery:                          {
            1: recoveryObj,
            2: recoveryObj,
            3: recoveryObj,
        },
        post_recovery_completed: false,
        pre_recovery:            {
            1: recoveryObj,
            2: recoveryObj,
            3: recoveryObj,
        },
        pre_recovery_completed: false,
        sessions_planned:       true,
        training_sessions:      [],
    }],
    goals: [
        {show: true, text: '0-GOAL', shape: 'square', isSelected: true,},
        {show: true, text: '1-GOAL', shape: 'square', isSelected: true,},
        {show: true, text: '2-GOAL', shape: 'square', isSelected: true,},
    ],
    healthData:      { ignoredWorkouts: [], sleep: [], workouts: [], },
    lastOpened:      { date: '', userId: '' },
    postSession:     {},
    soreBodyParts:   {},
    typicalSessions: [],
};