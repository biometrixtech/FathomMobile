/**
 * API Config
 */

export default {
    // The URL we're connecting to
    // hostname: 'https://rails-api.fathomai.com', // deployment
    hostname: 'http://ec2-54-148-213-40.us-west-2.compute.amazonaws.com', // testing

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
        ['training_events', '/v1/training_events']
    ]),

    // Which 'endpoint' key deals with our tokens?
    tokenKey: 'login',
};
