Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeElements = require('react-native-elements');

var NavbarMenuButton = function NavbarMenuButton(_ref) {
  var toggleSideMenu = _ref.toggleSideMenu;
  return _react2.default.createElement(
    _reactNative.TouchableOpacity,
    {
      onPress: toggleSideMenu,
      activeOpacity: 0.7,
      style: { top: 2 },
      hitSlop: { top: 7, right: 7, bottom: 7, left: 7 }
    },
    _react2.default.createElement(_reactNativeElements.Icon, { name: 'menu', size: 32, color: '#FFF' })
  );
};

NavbarMenuButton.propTypes = {
  toggleSideMenu: _react.PropTypes.func.isRequired
};

exports.default = NavbarMenuButton;