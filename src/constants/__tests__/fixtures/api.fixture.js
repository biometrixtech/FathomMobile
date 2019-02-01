/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:30:58
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-13 10:09:59
 */

/**
 * API Config
 */

// what {version} are we on?
const metaAPIVersion = '/meta/1_0';
const plansAPIVersion = '/plans/2_2';
const usersAPIVersion = '/users/2_1';

export default {
    APIs: {
        DEV:  'https://apis.dev.fathomai.com',
        TEST: 'https://apis.test.fathomai.com',
        QA:   'https://apis.qa.fathomai.com',
        PROD: 'https://apis.production.fathomai.com'
    },
    // The URL we're connecting to
    // hostname: 'https://apis.production.fathomai.com', // deployment
    // hostname: 'https://apis.qa.fathomai.com', // qa
    hostname: 'https://apis.test.fathomai.com', // test
    // hostname: 'https://apis.dev.fathomai.com', // development

    // Map shortnames to the actual endpoints, so that we can
    // use them like so: AppAPI.ENDPOINT_NAME.METHOD()
    //  NOTE: They should start with a /
    //    eg.
    //    - AppAPI.recipes.get()
    //    - AppAPI.users.post()
    //    - AppAPI.favorites.patch()
    //    - AppAPI.blog.delete()
    endpoints: new Map([
        ['authorize',          `${usersAPIVersion}/user/{userId}/authorize`],
        ['check_account_code', `${usersAPIVersion}/account`], // GET
        ['create_user',        `${usersAPIVersion}/user`],
        ['forgot_password',    `${usersAPIVersion}/user/forgot_password`],
        ['get_user',           `${usersAPIVersion}/user/{userId}`],
        ['join_account',       `${usersAPIVersion}/user/{userId}/join_account`], // POST
        ['login',              `${usersAPIVersion}/user/login`], // If you change the key, update the reference below
        ['logout',             `${usersAPIVersion}/user/{user_id}/logout`], // POST
        ['register_device',    `${usersAPIVersion}/device/{device_uuid}`],
        ['reset_password',     `${usersAPIVersion}/user/reset_password`],
        ['update_user',        `${usersAPIVersion}/user/{userId}`],
        // My Plan specific routes
        ['active_recovery',       `${plansAPIVersion}/active_recovery`], // POST/PATCH
        ['active_time',           `${plansAPIVersion}/active_recovery/active_time`], // PATCH
        ['app_logs',              `${plansAPIVersion}/misc/app_logs`], // POST
        ['clear_user_data',       `${plansAPIVersion}/misc/clear_user_data`], // POST
        ['coach_dashboard',       `${plansAPIVersion}/coach/{user_id}/dashboard`], // GET
        ['functional_strength',   `${plansAPIVersion}/functional_strength`], // POST/PATCH
        ['get_my_plan',           `${plansAPIVersion}/daily_plan`], // POST
        ['get_sore_body_parts',   `${plansAPIVersion}/daily_readiness/previous`], // POST
        ['health_data',           `${plansAPIVersion}/health_data`], // POST
        ['no_sessions',           `${plansAPIVersion}/session/no_sessions`], // POST
        ['post_readiness_survey', `${plansAPIVersion}/daily_readiness`], // POST
        ['post_sensor_data',      `${plansAPIVersion}/session/sensor_data`], // POST
        ['post_session_survey',   `${plansAPIVersion}/session`], // POST
        ['survey',                `${plansAPIVersion}/athlete/{userId}/survey`], // POST
        ['typical_sessions',      `${plansAPIVersion}/session/typical`], // POST
        // other routes
        ['maintenance_status', `${metaAPIVersion}/maintenance`], // GET
    ]),

    // Which 'endpoint' key deals with our tokens?
    tokenKey: 'login',

    STATS_APIs: {
        DEV:  'https://apis.dev.fathomai.com/statsapi/MQ',
        QA:   'https://apis.qa.fathomai.com/statsapi/MQ',
        PROD: 'https://apis.production.fathomai.com/statsapi/MQ',
    },

    statsHostname: 'https://apis.production.fathomai.com/statsapi/MQ',

    statsEndpoints: new Map([
        ['team_movement_quality',                   '/Team'],
        ['athlete_movement_quality',                '/Athlete'],
        ['training_group_movement_quality',         '/TrainingGroup'],
        ['athlete_summaries',                       '/AthleteSummaries'],
        ['team_two_minute_movement_quality',        '/TeamTwoMin'],
        ['athlete_two_minute_movement_quality',     'AthleteTwoMin'],
        ['athlete_grf_program_composition',         '/AthleteGRFProgComp'],
        ['team_grf_program_composition',            '/TeamGRFProgComp'],
        ['training_group_grf_program_compensation', '/TrainingGroupGRFProgComp'],
        ['athlete_summaries_tg',                    '/TGAthleteSummaries'],
        ['team_movement_quality_summary',           '/TeamMQSummary'],
        ['team_movement_quality_details',           '/TeamMQDetail']
    ]),

    PREPROCESSING_APIs: {
        DEV:  'https://apis.dev.fathomai.com/preprocessing',
        QA:   'https://apis.qa.fathomai.com/preprocessing',
        PROD: 'https://apis.production.fathomai.com/preprocessing',
    },

    preprocessingHostname: 'https://apis.production.fathomai.com/preprocessing',

    preprocessingEndpoints: new Map([
        ['status', '/status'] // body: { start_date: '<start of week>', end_date: '<end of week>' }
    ]),

    HARDWARE_APIs: {
        DEV:  'https://apis.dev.fathomai.com/hardware',
        QA:   'https://apis.qa.fathomai.com/hardware',
        PROD: 'https://apis.production.fathomai.com/hardware',
    },

    hardwareHostname: 'https://apis.production.fathomai.com/hardware',

    hardwareEndpoints: new Map([
        ['accessory', '/accessory/{wifiMacAddress}'], // GET: settings key, PATCH: owner-uuid with body: { owner_id: '<uuid>' }
    ]),
};
