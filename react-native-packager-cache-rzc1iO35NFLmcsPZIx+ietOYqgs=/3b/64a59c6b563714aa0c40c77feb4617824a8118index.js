Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/navigation/index.js';

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
  babelHelpers.extends({ key: 'root' }, _constants.AppConfig.navbarProps, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    }
  }),
  _react2.default.createElement(_reactNativeRouterFlux.Scene, {
    hideNavBar: true,
    key: 'splash',
    component: _LaunchContainer2.default,
    analyticsDesc: 'AppLaunch: Launching App',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    }
  }),
  _auth2.default,
  _react2.default.createElement(
    _reactNativeRouterFlux.Scene,
    babelHelpers.extends({ key: 'adminApp' }, _constants.AppConfig.navbarProps, { title: _constants.AppConfig.appName, hideNavBar: false, type: _reactNativeRouterFlux.ActionConst.RESET, __source: {
        fileName: _jsxFileName,
        lineNumber: 36
      }
    }),
    _react2.default.createElement(
      _reactNativeRouterFlux.Scene,
      { key: 'adminHome', component: _DrawerContainer2.default, initial: 'adminTeamManagement', __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        }
      },
      _adminNavigation2.default
    )
  ),
  _react2.default.createElement(
    _reactNativeRouterFlux.Scene,
    babelHelpers.extends({ key: 'athleteApp' }, _constants.AppConfig.navbarProps, { title: _constants.AppConfig.appName, hideNavBar: false, type: _reactNativeRouterFlux.ActionConst.RESET, __source: {
        fileName: _jsxFileName,
        lineNumber: 46
      }
    }),
    _react2.default.createElement(
      _reactNativeRouterFlux.Scene,
      { key: 'athleteHome', component: _DrawerContainer2.default, initial: 'athleteAthleteManagement', __source: {
          fileName: _jsxFileName,
          lineNumber: 48
        }
      },
      _athleteNavigation2.default
    )
  ),
  _react2.default.createElement(
    _reactNativeRouterFlux.Scene,
    babelHelpers.extends({ key: 'biometrixApp' }, _constants.AppConfig.navbarProps, { title: _constants.AppConfig.appName, hideNavBar: false, type: _reactNativeRouterFlux.ActionConst.RESET, __source: {
        fileName: _jsxFileName,
        lineNumber: 56
      }
    }),
    _react2.default.createElement(
      _reactNativeRouterFlux.Scene,
      { key: 'biometrixHome', component: _DrawerContainer2.default, initial: 'managerTeamManagement', __source: {
          fileName: _jsxFileName,
          lineNumber: 58
        }
      },
      _biometrixAdminNavigation2.default
    )
  ),
  _react2.default.createElement(
    _reactNativeRouterFlux.Scene,
    babelHelpers.extends({ key: 'managerApp' }, _constants.AppConfig.navbarProps, { title: _constants.AppConfig.appName, hideNavBar: false, type: _reactNativeRouterFlux.ActionConst.RESET, __source: {
        fileName: _jsxFileName,
        lineNumber: 66
      }
    }),
    _react2.default.createElement(
      _reactNativeRouterFlux.Scene,
      { key: 'managerHome', component: _DrawerContainer2.default, initial: 'managerTeamManagement', __source: {
          fileName: _jsxFileName,
          lineNumber: 68
        }
      },
      _managerNavigation2.default
    )
  ),
  _react2.default.createElement(
    _reactNativeRouterFlux.Scene,
    babelHelpers.extends({ key: 'researcherApp' }, _constants.AppConfig.navbarProps, { title: _constants.AppConfig.appName, hideNavBar: false, type: _reactNativeRouterFlux.ActionConst.RESET, __source: {
        fileName: _jsxFileName,
        lineNumber: 76
      }
    }),
    _react2.default.createElement(
      _reactNativeRouterFlux.Scene,
      { key: 'researcherHome', component: _DrawerContainer2.default, initial: 'researcherSubjectManagement', __source: {
          fileName: _jsxFileName,
          lineNumber: 78
        }
      },
      _researcherNavigation2.default
    )
  )
));