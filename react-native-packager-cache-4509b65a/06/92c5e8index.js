Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNativeRouterFlux = require('react-native-router-flux');

var _constants = require('@constants/');

var _DrawerContainer = require('@containers/ui/DrawerContainer');

var _DrawerContainer2 = babelHelpers.interopRequireDefault(_DrawerContainer);

var _LaunchContainer = require('@containers/Launch/LaunchContainer');

var _LaunchContainer2 = babelHelpers.interopRequireDefault(_LaunchContainer);

var _managerNavigation = require('./managerNavigation');

var _managerNavigation2 = babelHelpers.interopRequireDefault(_managerNavigation);

var _adminNavigation = require('./adminNavigation');

var _adminNavigation2 = babelHelpers.interopRequireDefault(_adminNavigation);

var _athleteNavigation = require('./athleteNavigation');

var _athleteNavigation2 = babelHelpers.interopRequireDefault(_athleteNavigation);

var _biometrixAdminNavigation = require('./biometrixAdminNavigation');

var _biometrixAdminNavigation2 = babelHelpers.interopRequireDefault(_biometrixAdminNavigation);

var _researcherNavigation = require('./researcherNavigation');

var _researcherNavigation2 = babelHelpers.interopRequireDefault(_researcherNavigation);

var _auth = require('./auth');

var _auth2 = babelHelpers.interopRequireDefault(_auth);

exports.default = _reactNativeRouterFlux.Actions.create(_react2.default.createElement(
  _reactNativeRouterFlux.Scene,
  babelHelpers.extends({ key: 'root' }, _constants.AppConfig.navbarProps),
  _react2.default.createElement(_reactNativeRouterFlux.Scene, {
    hideNavBar: true,
    key: 'splash',
    component: _LaunchContainer2.default,
    analyticsDesc: 'AppLaunch: Launching App'
  }),
  _auth2.default,
  _react2.default.createElement(
    _reactNativeRouterFlux.Scene,
    babelHelpers.extends({ key: 'adminApp' }, _constants.AppConfig.navbarProps, { title: _constants.AppConfig.appName, hideNavBar: false, type: _reactNativeRouterFlux.ActionConst.RESET }),
    _react2.default.createElement(
      _reactNativeRouterFlux.Scene,
      { key: 'adminHome', component: _DrawerContainer2.default, initial: 'adminTeamManagement' },
      _adminNavigation2.default
    )
  ),
  _react2.default.createElement(
    _reactNativeRouterFlux.Scene,
    babelHelpers.extends({ key: 'athleteApp' }, _constants.AppConfig.navbarProps, { title: _constants.AppConfig.appName, hideNavBar: false, type: _reactNativeRouterFlux.ActionConst.RESET }),
    _react2.default.createElement(
      _reactNativeRouterFlux.Scene,
      { key: 'athleteHome', component: _DrawerContainer2.default, initial: 'athleteAthleteManagement' },
      _athleteNavigation2.default
    )
  ),
  _react2.default.createElement(
    _reactNativeRouterFlux.Scene,
    babelHelpers.extends({ key: 'biometrixApp' }, _constants.AppConfig.navbarProps, { title: _constants.AppConfig.appName, hideNavBar: false, type: _reactNativeRouterFlux.ActionConst.RESET }),
    _react2.default.createElement(
      _reactNativeRouterFlux.Scene,
      { key: 'biometrixHome', component: _DrawerContainer2.default, initial: 'managerTeamManagement' },
      _biometrixAdminNavigation2.default
    )
  ),
  _react2.default.createElement(
    _reactNativeRouterFlux.Scene,
    babelHelpers.extends({ key: 'managerApp' }, _constants.AppConfig.navbarProps, { title: _constants.AppConfig.appName, hideNavBar: false, type: _reactNativeRouterFlux.ActionConst.RESET }),
    _react2.default.createElement(
      _reactNativeRouterFlux.Scene,
      { key: 'managerHome', component: _DrawerContainer2.default, initial: 'managerTeamManagement' },
      _managerNavigation2.default
    )
  ),
  _react2.default.createElement(
    _reactNativeRouterFlux.Scene,
    babelHelpers.extends({ key: 'researcherApp' }, _constants.AppConfig.navbarProps, { title: _constants.AppConfig.appName, hideNavBar: false, type: _reactNativeRouterFlux.ActionConst.RESET }),
    _react2.default.createElement(
      _reactNativeRouterFlux.Scene,
      { key: 'researcherHome', component: _DrawerContainer2.default, initial: 'researcherSubjectManagement' },
      _researcherNavigation2.default
    )
  )
));