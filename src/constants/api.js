/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:30:58 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-11-03 17:13:28
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
        DEV:  'http://biometrixstatsapi-dev.us-west-2.elasticbeanstalk.com/MQ',
        QA:   'http://biometrixstatsapi-test.us-west-2.elasticbeanstalk.com/MQ',
        PROD: 'http://biometrixstatsapi-dev.us-west-2.elasticbeanstalk.com/MQ'
    },

    statsHostname: 'http://biometrixstatsapi-dev.us-west-2.elasticbeanstalk.com/MQ',

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
    ])
};
