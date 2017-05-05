Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _fonts = require('../config/fonts');

var _fonts2 = babelHelpers.interopRequireDefault(_fonts);

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var styles = {};

var TextElement = function TextElement(_ref) {
  var style = _ref.style,
      children = _ref.children,
      h1 = _ref.h1,
      h2 = _ref.h2,
      h3 = _ref.h3,
      h4 = _ref.h4,
      h5 = _ref.h5,
      h6 = _ref.h6,
      fontFamily = _ref.fontFamily;
  return _react2.default.createElement(
    _reactNative.Text,
    {
      style: [styles.text, h1 && { fontSize: (0, _normalizeText2.default)(40) }, h2 && { fontSize: (0, _normalizeText2.default)(34) }, h3 && { fontSize: (0, _normalizeText2.default)(28) }, h4 && { fontSize: (0, _normalizeText2.default)(22) }, h1 && styles.bold, h2 && styles.bold, h3 && styles.bold, h4 && styles.bold, fontFamily && { fontFamily: fontFamily }, style && style] },
    children
  );
};

styles = _reactNative.StyleSheet.create({
  text: babelHelpers.extends({}, _reactNative.Platform.select({
    ios: {
      fontFamily: _fonts2.default.ios.regular
    },
    android: {
      fontFamily: _fonts2.default.android.regular
    }
  })),
  bold: babelHelpers.extends({}, _reactNative.Platform.select({
    ios: {
      fontFamily: _fonts2.default.ios.bold
    },
    android: {
      fontFamily: _fonts2.default.android.bold
    }
  }))
});

exports.default = TextElement;