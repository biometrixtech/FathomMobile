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
        active_recovery:                  null,
        cold_water_immersion:             null,
        cool_down:                        null,
        cross_training_sessions:          [],
        daily_readiness_survey_completed: false,
        date:                             moment().format('YYYY-MM-DD'),
        day_of_week:                      0,
        heat:                             [],
        ice:                              [],
        landing_screen:                   0,
        last_sensor_sync:                 null,
        last_updated:                     moment().format('YYYY-MM-DD'),
        nav_bar_indicator:                null,
        post_active_rest:                 recoveryObj,
        post_active_rest_completed:       false,
        pre_active_rest:                  recoveryObj,
        pre_active_rest_completed:        false,
        sessions_planned:                 true,
        train_later:                      true,
        training_sessions:                [],
        warm_up:                          null,
    }],
    goals:           [],
    healthData:      { ignoredWorkouts: [], sleep: [], workouts: [], },
    lastOpened:      { date: '', userId: '' },
    postSession:     {},
    soreBodyParts:   {},
    typicalSessions: [],
};