/**
 * API Config
 */

// what {version} are we on?
const hardwareAPIVersion = '/hardware/2_0';
const metaAPIVersion = '/meta/1_0';
const plansAPIVersion = '/plans/4_4';
const preprocessingAPIVersion = '/preprocessing/1_1';
const usersAPIVersion = '/users/2_3';

export default {
    APIs: {
        DEV:  'https://apis.dev.fathomai.com',
        TEST: 'https://apis.test.fathomai.com',
        QA:   'https://apis.qa.fathomai.com',
        PROD: 'https://apis.production.fathomai.com'
    },
    // The URL we're connecting to
    hostname: 'https://apis.production.fathomai.com', // deployment
    // hostname: 'https://apis.qa.fathomai.com', // qa
    // hostname: 'https://apis.test.fathomai.com', // test
    //hostname: 'https://apis.dev.fathomai.com', // development

    // Map shortnames to the actual endpoints, so that we can
    // use them like so: AppAPI.ENDPOINT_NAME.METHOD()
    //  NOTE: They should start with a /
    //    eg.
    //    - AppAPI.recipes.get()
    //    - AppAPI.users.post()
    //    - AppAPI.favorites.patch()
    //    - AppAPI.blog.delete()
    endpoints: new Map([
        // User specific routes
        ['authorize',          `${usersAPIVersion}/user/{userId}/authorize`],
        ['check_account_code', `${usersAPIVersion}/account`], // GET
        ['create_user',        `${usersAPIVersion}/user`],
        ['forgot_password',    `${usersAPIVersion}/user/forgot_password`],
        ['get_user',           `${usersAPIVersion}/user/{userId}`],
        ['join_account',       `${usersAPIVersion}/user/{userId}/join_account`], // POST
        ['login',              `${usersAPIVersion}/user/login`], // If you change the key, update the reference below
        ['logout',             `${usersAPIVersion}/user/{userId}/logout`], // POST
        ['register_device',    `${usersAPIVersion}/device/{device_uuid}`],
        ['reset_password',     `${usersAPIVersion}/user/reset_password`],
        ['update_user',        `${usersAPIVersion}/user/{userId}`],
        // My Plan specific routes
        ['activate_fs',           `${plansAPIVersion}/functional_strength/{userId}/activate`], // POST
        ['active_recovery',       `${plansAPIVersion}/active_recovery/{userId}/exercise_modalities`], // POST/PATCH
        ['active_time',           `${plansAPIVersion}/active_recovery/{userId}/active_time`], // PATCH
        ['app_logs',              `${plansAPIVersion}/misc/{userId}/app_logs`], // POST
        ['biomechanics_detail',   `${plansAPIVersion}/three_sensor/{userId}/biomechanics_detail`], // POST
        ['body_active_recovery',  `${plansAPIVersion}/active_recovery/{userId}/body_part_modalities`], // POST/PATCH
        ['clear_fte_category',    `${plansAPIVersion}/trends/{userId}/first_time_experience/category`], // POST
        ['clear_fte_view',        `${plansAPIVersion}/trends/{userId}/first_time_experience/view`], // POST
        ['clear_plan_alert',      `${plansAPIVersion}/trends/{userId}/plan_alerts/clear`], // POST
        ['clear_user_data',       `${plansAPIVersion}/misc/{userId}/clear_user_data`], // POST
        ['coach_dashboard',       `${plansAPIVersion}/coach/{userId}/dashboard`], // GET
        ['functional_strength',   `${plansAPIVersion}/functional_strength/{userId}`], // POST/PATCH
        ['get_mobilize',          `${plansAPIVersion}/active_recovery/{userId}/get_mobilize`], // POST
        ['get_my_plan',           `${plansAPIVersion}/daily_plan/{userId}`], // POST
        ['get_sore_body_parts',   `${plansAPIVersion}/daily_readiness/{userId}/previous`], // POST
        ['health_data',           `${plansAPIVersion}/health_data/{userId}`], // POST
        ['insights_read',         `${plansAPIVersion}/insights/{userId}/read`], // POST
        ['no_sessions',           `${plansAPIVersion}/session/{userId}/no_sessions`], // POST
        ['patch_sessions',        `${plansAPIVersion}/session/{userId}/{session_id}`], // PATCH
        ['post_readiness_survey', `${plansAPIVersion}/daily_readiness/{userId}`], // POST
        ['post_sensor_data',      `${plansAPIVersion}/session/{userId}/sensor_data`], // POST
        ['post_session_survey',   `${plansAPIVersion}/session/{userId}`], // POST
        ['survey',                `${plansAPIVersion}/athlete/{userId}/survey`], // POST
        // other routes
        ['maintenance_status', `${metaAPIVersion}/maintenance`], // GET
        // systems test routes
        ['copy_test_data', `${plansAPIVersion}/misc/{userId}/copy_test_data`], // POST
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
        TEST: 'https://apis.test.fathomai.com',
        QA:   'https://apis.qa.fathomai.com/preprocessing',
        PROD: 'https://apis.production.fathomai.com/preprocessing',
    },

    // preprocessingHostname: 'https://apis.production.fathomai.com', // deployment
    // preprocessingHostname: 'https://apis.qa.fathomai.com', // qa
    preprocessingHostname: 'https://apis.test.fathomai.com', // test
    // preprocessingHostname: 'https://apis.dev.fathomai.com', // development

    preprocessingEndpoints: new Map([
        ['status', `${preprocessingAPIVersion}/status/sensor`], // POST
    ]),

    HARDWARE_APIs: {
        DEV:  'https://apis.dev.fathomai.com',
        TEST: 'https://apis.test.fathomai.com',
        QA:   'https://apis.qa.fathomai.com',
        PROD: 'https://apis.production.fathomai.com',
    },

    // hardwareHostname: 'https://apis.production.fathomai.com', // deployment
    // hardwareHostname: 'https://apis.qa.fathomai.com', // qa
    hardwareHostname: 'https://apis.test.fathomai.com', // test
    // hardwareHostname: 'https://apis.dev.fathomai.com', // development

    hardwareEndpoints: new Map([
        ['accessory', `${hardwareAPIVersion}/accessory/{wifiMacAddress}`], // PATCH
    ]),
};
