Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    hostname: 'http://ec2-54-148-213-40.us-west-2.compute.amazonaws.com',
    endpoints: new Map([['login', '/v1/sign_in'], ['forgot_password', '/v1/user/forgot_password'], ['user', '/v1/user'], ['team', '/v1/user/teams'], ['training_group', '/v1/training_groups'], ['accessories', '/v1/accessories'], ['training_events', '/v1/training_events']]),

    tokenKey: 'login'
};