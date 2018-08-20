/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:30:58
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-14 12:50:12
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
        ['create_user',     '/users/1.0.0/user'],
        ['update_user',     '/users/1.0.0/user/{userId}'],
        ['get_user',        '/users/1.0.0/user/{userId}'],
        ['authorize',       '/users/1.0.0/user/{userId}/authorize'],
        ['forgot_password', '/users/1.0.0/user/forgot_password'],
        ['login',           '/users/1.0.0/user/sign_in'], // If you change the key, update the reference below
        ['register_device', '/users/1.0.0/device/{device_uuid}'],
        // My Plan specific routes
        ['get_my_plan',           '/plans/1.0.0/daily_plan'], // POST
        ['get_sore_body_parts',   '/plans/1.0.0/daily_readiness/previous'], // GET
        ['post_readiness_survey', '/plans/1.0.0/daily_readiness'], // POST
        ['post_session_survey',   '/plans/1.0.0/post_session_survey'], // POST
        ['active_recovery',       '/plans/1.0.0/active_recovery'], // PATCH
        ['clear_user_data',       '/plans/1.0.0/misc/clear_user_data'], // POST
        // sensor specific routes
        ['sensor_mobile_pair', '/users/1.0.0/user/{userId}/sensor_mobile_pair'], // CRUD
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
