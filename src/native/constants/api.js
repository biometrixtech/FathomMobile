/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:30:58 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 10:17:17
 */

/**
 * API Config
 */

export default {
    APIs: {
        DEV:  'https://rails-api-v2.biometrixtech.com',
        QA:   'http://api.qa.fathomai.com',
        PROD: 'https://rails-api.fathomai.com'
    },
    // The URL we're connecting to
    hostname: 'https://rails-api.fathomai.com', // deployment
    // hostname: 'https://rails-api-v2.biometrixtech.com', // testing

    // Map shortnames to the actual endpoints, so that we can
    // use them like so: AppAPI.ENDPOINT_NAME.METHOD()
    //  NOTE: They should start with a /
    //    eg.
    //    - AppAPI.recipes.get()
    //    - AppAPI.users.post()
    //    - AppAPI.favorites.patch()
    //    - AppAPI.blog.delete()
    endpoints: new Map([
        ['login',           '/v1/sign_in'], // If you change the key, update the reference below
        ['forgot_password', '/v1/user/forgot_password'],
        ['user',            '/v1/user'],
        ['teams',           '/v1/user/teams'],
        ['training_groups', '/v1/training_groups'],
        ['remove_user',     '/v1/training_groups/{trainingGroupId}/remove_user'],
        ['accessories',     '/v1/accessories'],
        ['start_session',   '/v1/accessories/{accessoryId}/start_session_event'],
        ['stop_session',    '/v1/accessories/{accessoryId}/stop_session_event'],
        ['training_events', '/v1/training_events']
    ]),

    // Which 'endpoint' key deals with our tokens?
    tokenKey: 'login',

    STATS_APIs: {
        DEV:  'https://statsapi.dev.fathomai.com/v1/MQ',
        QA:   'https://statsapi.qa.fathomai.com/v1/MQ',
        PROD: 'https://statsapi.production.fathomai.com/v1/MQ'
    },

    statsHostname: 'https://statsapi.production.fathomai.com/v1/MQ',

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
        DEV:  'https://preprocessing.dev.fathomai.com/v1',
        QA:   'https://preprocessing.qa.fathomai.com/v1',
        PROD: 'https://preprocessing.production.fathomai.com/v1',
    },

    preprocessingHostname: 'https://preprocessing.production.fathomai.com/v1',

    preprocessingEndpoints: new Map([
        ['status', '/status'] // body: { start_date: '<start of week>', end_date: '<end of week>' }
    ]),

    HARDWARE_APIs: {
        DEV:  'https://hardware.dev.fathomai.com/v1',
        QA:   'https://hardware.qa.fathomai.com/v1',
        PROD: 'https://hardware.production.fathomai.com/v1',
    },

    hardwareHostname: 'https://hardware.production.fathomai.com/v1',

    hardwareEndpoints: new Map([
        ['accessory', '/accessory/{wifiMacAddress}'], // GET: settings key, PATCH: owner-uuid with body: { owner_id: '<uuid>' }
    ]),
};
