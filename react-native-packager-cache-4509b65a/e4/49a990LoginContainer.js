Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRedux = require('react-redux');

var _actions = require('@redux/user/actions');

var UserActions = babelHelpers.interopRequireWildcard(_actions);

var _LoginView = require('./LoginView');

var _LoginView2 = babelHelpers.interopRequireDefault(_LoginView);

var mapStateToProps = function mapStateToProps(state) {
    return {
        user: state.user
    };
};

var mapDispatchToProps = {
    login: UserActions.login
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_LoginView2.default);