Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNativeRouterFlux = require('react-native-router-flux');

var _constants = require('@constants/');

var _reactNativeElements = require('react-native-elements');

var _TeamManagementContainer = require('@containers/management/TeamManagementContainer');

var _TeamManagementContainer2 = babelHelpers.interopRequireDefault(_TeamManagementContainer);

var _KitManagementContainer = require('@containers/kit/KitManagementContainer');

var _KitManagementContainer2 = babelHelpers.interopRequireDefault(_KitManagementContainer);

var _AthletesContainer = require('@containers/management/athletes/AthletesContainer');

var _AthletesContainer2 = babelHelpers.interopRequireDefault(_AthletesContainer);

var _DataContainer = require('@containers/management/data/DataContainer');

var _DataContainer2 = babelHelpers.interopRequireDefault(_DataContainer);

var _GroupsContainer = require('@containers/management/groups/GroupsContainer');

var _GroupsContainer2 = babelHelpers.interopRequireDefault(_GroupsContainer);

var _RegimensContainer = require('@containers/management/regimens/RegimensContainer');

var _RegimensContainer2 = babelHelpers.interopRequireDefault(_RegimensContainer);

var _NavbarMenuButtonContainer = require('@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer');

var navbarPropsTabs = babelHelpers.extends({}, _constants.AppConfig.navbarProps, {
  renderLeftButton: function renderLeftButton() {
    return _react2.default.createElement(_NavbarMenuButtonContainer.NavbarMenuButton, null);
  },
  sceneStyle: babelHelpers.extends({}, _constants.AppConfig.navbarProps.sceneStyle)
});

var regimenView = babelHelpers.extends({}, _constants.AppConfig.navbarProps, {
  renderLeftButton: function renderLeftButton() {
    return _react2.default.createElement(_NavbarMenuButtonContainer.NavbarMenuButton, null);
  },
  renderRightButton: function renderRightButton() {
    return _react2.default.createElement(_reactNativeElements.Icon, { onPress: function onPress() {
        return _reactNativeRouterFlux.Actions.refresh({ isModalVisible: true });
      }, name: 'plus', type: 'material-community', size: 34, color: '#FFF', underlayColor: 'transparent', containerStyle: { marginBottom: 12 } });
  },
  sceneStyle: babelHelpers.extends({}, _constants.AppConfig.navbarProps.sceneStyle)
});

var groupView = babelHelpers.extends({}, _constants.AppConfig.navbarProps, {
  renderLeftButton: function renderLeftButton() {
    return _react2.default.createElement(_NavbarMenuButtonContainer.NavbarMenuButton, null);
  },
  renderRightButton: function renderRightButton() {
    return _react2.default.createElement(_reactNativeElements.Icon, { onPress: function onPress() {
        return _reactNativeRouterFlux.Actions.refresh({ isModalVisible: true });
      }, name: 'plus', type: 'material-community', size: 34, color: '#FFF', underlayColor: 'transparent', containerStyle: { marginBottom: 12 } });
  },
  sceneStyle: babelHelpers.extends({}, _constants.AppConfig.navbarProps.sceneStyle)
});

var scenes = _react2.default.createElement(
  _reactNativeRouterFlux.Scene,
  { key: 'management' },
  _react2.default.createElement(_reactNativeRouterFlux.Scene, babelHelpers.extends({}, navbarPropsTabs, {
    key: 'managerTeamManagement',
    title: 'Team Management',
    clone: true,
    type: _reactNativeRouterFlux.ActionConst.REPLACE,
    component: _TeamManagementContainer2.default,
    analyticsDesc: 'ManagerTeamManagementView: Manager Team Management'
  })),
  _react2.default.createElement(_reactNativeRouterFlux.Scene, babelHelpers.extends({}, navbarPropsTabs, {
    key: 'managerAthletes',
    title: 'Athletes',
    clone: true,
    component: _AthletesContainer2.default,
    analyticsDesc: 'ManagerAthletesView: Manager Athletes'
  })),
  _react2.default.createElement(_reactNativeRouterFlux.Scene, babelHelpers.extends({}, groupView, {
    key: 'managerGroups',
    title: 'Groups',
    clone: true,
    component: _GroupsContainer2.default,
    analyticsDesc: 'ManagerGroupsView: Manager Groups'
  })),
  _react2.default.createElement(_reactNativeRouterFlux.Scene, babelHelpers.extends({}, regimenView, {
    key: 'managerRegimens',
    title: 'Regimens',
    clone: true,
    component: _RegimensContainer2.default,
    analyticsDesc: 'ManagerRegimensView: Manager Regimens'
  })),
  _react2.default.createElement(_reactNativeRouterFlux.Scene, babelHelpers.extends({}, regimenView, {
    key: 'managerData',
    title: 'Data',
    clone: true,
    component: _DataContainer2.default,
    analyticsDesc: 'ManagerDataView: Manager Data'
  })),
  _react2.default.createElement(_reactNativeRouterFlux.Scene, babelHelpers.extends({}, navbarPropsTabs, {
    key: 'kitManagement',
    title: 'Kit Management',
    clone: true,
    type: _reactNativeRouterFlux.ActionConst.REPLACE,
    component: _KitManagementContainer2.default,
    analyticsDesc: 'KitManagementView: Kit Management'
  }))
);

exports.default = scenes;