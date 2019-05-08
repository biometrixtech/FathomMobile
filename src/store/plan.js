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
    activeRestGoals:            [],
    coachesDashboardData:       [],
    completedCoolDownExercises: [],
    completedExercises:         [],
    completedFSExercises:       [],
    coolDownGoals:              [],
    dailyPlan:                  [{
        cold_water_immersion:             null,
        completed_cold_water_immersion:   [],
        completed_cool_down:              [],
        completed_heat:                   [],
        completed_ice:                    [],
        completed_post_active_rest:       [],
        completed_pre_active_rest:        [],
        completed_warm_up:                [],
        cool_down:                        [],
        cross_training_sessions:          [],
        daily_readiness_survey_completed: false,
        date:                             moment().format('YYYY-MM-DD'),
        day_of_week:                      0,
        heat:                             null,
        ice:                              null,
        landing_screen:                   0,
        last_sensor_sync:                 null,
        last_updated:                     moment().format('YYYY-MM-DD'),
        nav_bar_indicator:                null,
        post_active_rest:                 [],
        post_active_rest_completed:       false,
        pre_active_rest:                  [],
        pre_active_rest_completed:        false,
        sessions_planned:                 true,
        train_later:                      true,
        training_sessions:                [],
        warm_up:                          [],
    }],
    healthData:      { ignoredWorkouts: [], sleep: [], workouts: [], },
    lastOpened:      { date: '', userId: '' },
    postSession:     {},
    soreBodyParts:   {},
    typicalSessions: [],
    warmUpGoals:     [],
};