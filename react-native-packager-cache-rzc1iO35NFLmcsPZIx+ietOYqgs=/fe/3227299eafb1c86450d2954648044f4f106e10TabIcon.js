Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/components/ui/TabIcon.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNativeElements = require('react-native-elements');

var _theme = require('@theme/');

var TabIcon = function TabIcon(_ref) {
  var icon = _ref.icon,
      selected = _ref.selected;
  return _react2.default.createElement(_reactNativeElements.Icon, {
    name: icon,
    size: 26,
    color: selected ? _theme.AppColors.tabbar.iconSelected : _theme.AppColors.tabbar.iconDefault,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    }
  });
};

TabIcon.propTypes = { icon: _react.PropTypes.string.isRequired, selected: _react.PropTypes.bool };
TabIcon.defaultProps = { icon: 'search', selected: false };

exports.default = TabIcon;