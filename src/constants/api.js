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
      ['me', '/wp-json/wp/v2/users/me'],
      ['recipes', '/wp-json/wp/v2/recipes'],
      ['meals', '/wp-json/wp/v2/recipe_meal'],
    ]),

    // Which 'endpoint' key deals with our tokens?
    tokenKey: 'login',
};
