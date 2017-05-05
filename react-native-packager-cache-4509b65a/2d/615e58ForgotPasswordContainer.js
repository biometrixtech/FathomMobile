Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRedux = require('react-redux');

var _actions = require('@redux/user/actions');

var UserActions = babelHelpers.interopRequireWildcard(_actions);

var _ForgotPasswordView = require('./ForgotPasswordView');

var _ForgotPasswordView2 = babelHelpers.interopRequireDefault(_ForgotPasswordView);

var mapStateToProps = function mapStateToProps(state) {
    return {
        user: state.user
    };
};

var mapDispatchToProps = {
    forgotPassword: UserActions.forgotPassword
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_ForgotPasswordView2.default);