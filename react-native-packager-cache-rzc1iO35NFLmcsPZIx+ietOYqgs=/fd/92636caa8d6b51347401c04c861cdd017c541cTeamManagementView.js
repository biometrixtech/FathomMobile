Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/containers/management/TeamManagementView.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeElements = require('react-native-elements');

var _reactNativeRadialMenu = require('react-native-radial-menu');

var _reactNativeRadialMenu2 = babelHelpers.interopRequireDefault(_reactNativeRadialMenu);

var _reactNativeRouterFlux = require('react-native-router-flux');

var _theme = require('@theme/');

var TeamManagementView = function (_Component) {
  babelHelpers.inherits(TeamManagementView, _Component);

  function TeamManagementView() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, TeamManagementView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = TeamManagementView.__proto__ || Object.getPrototypeOf(TeamManagementView)).call.apply(_ref, [this].concat(args))), _this), _this.render = function () {
      return _react2.default.createElement(
        _reactNative.View,
        { style: [_theme.AppStyles.container, _theme.AppStyles.containerCentered], __source: {
            fileName: _jsxFileName,
            lineNumber: 42
          }
        },
        _react2.default.createElement(
          _reactNativeRadialMenu2.default,
          { menuRadius: _theme.AppStyles.windowSize.width / 3, style: [_theme.AppStyles.radialMenu], onOpen: function onOpen() {}, onClose: function onClose() {}, __source: {
              fileName: _jsxFileName,
              lineNumber: 43
            }
          },
          _react2.default.createElement(_reactNativeElements.Icon, { raised: true, type: 'ionicon', name: 'ios-people', color: _theme.AppColors.brand.primary, reverse: true, size: 41, __source: {
              fileName: _jsxFileName,
              lineNumber: 44
            }
          }),
          _react2.default.createElement(_reactNativeElements.Icon, { raised: true, type: 'material-community', name: 'account-multiple-plus', color: _theme.AppColors.brand.primary, containerStyle: { backgroundColor: _theme.AppColors.lightGrey }, onSelect: _reactNativeRouterFlux.Actions.managerGroups, size: 40, __source: {
              fileName: _jsxFileName,
              lineNumber: 45
            }
          }),
          _react2.default.createElement(_reactNativeElements.Icon, { raised: true, type: 'octicon', name: 'graph', color: _theme.AppColors.brand.primary, containerStyle: { backgroundColor: _theme.AppColors.lightGrey }, onSelect: _reactNativeRouterFlux.Actions.managerData, size: 40, __source: {
              fileName: _jsxFileName,
              lineNumber: 46
            }
          }),
          _react2.default.createElement(_reactNativeElements.Icon, { raised: true, type: 'material-community', name: 'view-list', color: _theme.AppColors.brand.primary, containerStyle: { backgroundColor: _theme.AppColors.lightGrey }, onSelect: _reactNativeRouterFlux.Actions.managerAthletes, size: 40, __source: {
              fileName: _jsxFileName,
              lineNumber: 47
            }
          }),
          _react2.default.createElement(_reactNativeElements.Icon, { raised: true, type: 'material-community', name: 'dumbbell', color: _theme.AppColors.brand.primary, containerStyle: { backgroundColor: _theme.AppColors.lightGrey }, onSelect: _reactNativeRouterFlux.Actions.managerRegimens, size: 40, __source: {
              fileName: _jsxFileName,
              lineNumber: 48
            }
          })
        )
      );
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  return TeamManagementView;
}(_react.Component);

TeamManagementView.componentName = 'ManagerTeamManagementView';
TeamManagementView.propTypes = {
  regimens: _react.PropTypes.array,
  trainingGroups: _react.PropTypes.array,
  addGroup: _react.PropTypes.func.isRequired,
  editGroup: _react.PropTypes.func.isRequired,
  removeGroup: _react.PropTypes.func.isRequired,
  addRegimen: _react.PropTypes.func.isRequired,
  editRegimen: _react.PropTypes.func.isRequired,
  removeRegimen: _react.PropTypes.func.isRequired,
  addAthlete: _react.PropTypes.func.isRequired,
  editAthlete: _react.PropTypes.func.isRequired,
  removeAthlete: _react.PropTypes.func.isRequired
};
TeamManagementView.defaultProps = {
  regimens: [],
  trainingGroups: []
};
exports.default = TeamManagementView;