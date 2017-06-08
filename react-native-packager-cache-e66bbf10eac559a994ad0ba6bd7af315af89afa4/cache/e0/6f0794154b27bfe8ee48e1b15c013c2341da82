Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRedux = require('react-redux');

var _actions = require('@redux/user/actions');

var UserActions = babelHelpers.interopRequireWildcard(_actions);

var _MenuView = require('./MenuView');

var _MenuView2 = babelHelpers.interopRequireDefault(_MenuView);

var mapStateToProps = function mapStateToProps(state) {
    return {
        user: state.user
    };
};

var mapDispatchToProps = {
    logout: UserActions.logout
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_MenuView2.default);