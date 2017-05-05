Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var styles = {};

var Badge = function Badge(_ref) {
  var badge = _ref.badge;

  if (badge.element) return badge.element;
  return _react2.default.createElement(
    _reactNative.View,
    { style: [styles.badge, badge.badgeContainerStyle] },
    _react2.default.createElement(
      _reactNative.Text,
      { style: [styles.text, badge.badgeTextStyle] },
      badge.value
    )
  );
};

styles = _reactNative.StyleSheet.create({
  badge: {
    top: 2,
    padding: 12,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: '#444',
    borderRadius: 20,
    position: 'absolute',
    right: 30
  },
  text: {
    fontSize: 14,
    color: 'white'
  }
});

exports.default = Badge;