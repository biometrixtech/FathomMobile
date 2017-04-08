/**
 * API Config
 */

export default {
    // The URL we're connecting to
    hostname: 'https://rails-api.biometrixtech.com',

    // Map shortnames to the actual endpoints, so that we can
    // use them like so: AppAPI.ENDPOINT_NAME.METHOD()
    //  NOTE: They should start with a /
    //    eg.
    //    - AppAPI.recipes.get()
    //    - AppAPI.users.post()
    //    - AppAPI.favorites.patch()
    //    - AppAPI.blog.delete()
    endpoints: new Map([
      ['login', '/v1/sign_in'], // If you change the key, update the reference below
      ['forgot_password', '/v1/user/forgot_password'],
      ['user', '/v1/user'],
      ['team', '/v1/user/teams'],
    ]),

    // Which 'endpoint' key deals with our tokens?
    tokenKey: 'login',
};
