Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRedux = require('react-redux');

var _actions = require('@redux/user/actions');

var UserActions = babelHelpers.interopRequireWildcard(_actions);

var _SignUpView = require('./SignUpView');

var _SignUpView2 = babelHelpers.interopRequireDefault(_SignUpView);

var mapStateToProps = function mapStateToProps(state) {
    return {
        user: state.user
    };
};

var mapDispatchToProps = {
    signUp: UserActions.signUp
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_SignUpView2.default);