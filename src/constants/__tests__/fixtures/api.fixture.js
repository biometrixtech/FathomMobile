/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:30:58
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-13 10:09:59
 */

/**
 * API Config
 */

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
        ['create_user',     '/users/1_0/user'],
        ['update_user',     '/users/1_0/user/{userId}'],
        ['get_user',        '/users/1_0/user/{userId}'],
        ['authorize',       '/users/1_0/user/{userId}/authorize'],
        ['forgot_password', '/plans/1_0/misc/forgot_password'],
        ['reset_password',  '/plans/1_0/misc/confirm_forgot_password'],
        ['login',           '/users/1_0/user/sign_in'], // If you change the key, update the reference below
        ['register_device', '/users/1_0/device/{device_uuid}'],
        // My Plan specific routes
        ['get_my_plan',           '/plans/1_0/daily_plan'], // POST
        ['get_sore_body_parts',   '/plans/1_0/daily_readiness/previous'], // POST
        ['post_readiness_survey', '/plans/1_0/daily_readiness'], // POST
        ['post_session_survey',   '/plans/1_0/session'], // POST
        ['active_recovery',       '/plans/1_0/active_recovery'], // PATCH
        ['clear_user_data',       '/plans/1_0/misc/clear_user_data'], // POST
        ['post_sensor_data',      '/plans/1_0/session/sensor_data'], // POST
        ['typical_sessions',      '/plans/1_0/session/typical'], // POST
        ['no_sessions',           '/plans/1_0/session/no_sessions'], // POST
        ['functional_strength',   '/plans/1_0/functional_strength'], // PATCH
        // sensor specific routes
        ['sensor_mobile_pair', '/users/1_0/user/{userId}/sensor_mobile_pair'], // CRUD
        // other routes
        ['maintenance_status', '/meta/1_0/maintenance'], // GET
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
