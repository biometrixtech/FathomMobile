Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _actions = require('@redux/user/actions');

var UserActions = babelHelpers.interopRequireWildcard(_actions);

var _LaunchView = require('./LaunchView');

var _LaunchView2 = babelHelpers.interopRequireDefault(_LaunchView);

var mapStateToProps = function mapStateToProps() {
  return {};
};

var mapDispatchToProps = {
  login: UserActions.login
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_LaunchView2.default);