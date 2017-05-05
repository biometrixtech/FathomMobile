Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNativeRouterFlux = require('react-native-router-flux');

var _constants = require('@constants/');

var _LoginContainer = require('@containers/auth/LoginContainer');

var _LoginContainer2 = babelHelpers.interopRequireDefault(_LoginContainer);

var _ForgotPasswordContainer = require('@containers/auth/ForgotPassword/ForgotPasswordContainer');

var _ForgotPasswordContainer2 = babelHelpers.interopRequireDefault(_ForgotPasswordContainer);

var _SignUpContainer = require('@containers/auth/SignUp/SignUpContainer');

var _SignUpContainer2 = babelHelpers.interopRequireDefault(_SignUpContainer);

var scenes = _react2.default.createElement(
  _reactNativeRouterFlux.Scene,
  { key: 'login', type: _reactNativeRouterFlux.ActionConst.RESET },
  _react2.default.createElement(_reactNativeRouterFlux.Scene, {
    hideNavBar: true,
    key: 'authLanding',
    component: _LoginContainer2.default,
    type: _reactNativeRouterFlux.ActionConst.RESET,
    analyticsDesc: 'LoginView: Login'
  }),
  _react2.default.createElement(_reactNativeRouterFlux.Scene, babelHelpers.extends({}, _constants.AppConfig.navbarProps, {
    key: 'signUp',
    title: 'Sign Up',
    clone: true,
    component: _SignUpContainer2.default,
    analyticsDesc: 'SignUpView: Sign Up'
  })),
  _react2.default.createElement(_reactNativeRouterFlux.Scene, babelHelpers.extends({}, _constants.AppConfig.navbarProps, {
    key: 'passwordReset',
    title: 'Password Reset',
    clone: true,
    component: _ForgotPasswordContainer2.default,
    analyticsDesc: 'ForgotPasswordView: Forgot Password'
  }))
);

exports.default = scenes;