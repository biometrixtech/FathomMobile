Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var _fonts = require('../config/fonts');

var _fonts2 = babelHelpers.interopRequireDefault(_fonts);

var _Text = require('../text/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var styles = {};

var FormValidationMessage = function FormValidationMessage(_ref) {
  var containerStyle = _ref.containerStyle,
      labelStyle = _ref.labelStyle,
      children = _ref.children,
      fontFamily = _ref.fontFamily;
  return _react2.default.createElement(
    _reactNative.View,
    { style: [styles.container, containerStyle && containerStyle] },
    _react2.default.createElement(
      _Text2.default,
      { style: [styles.label, labelStyle && labelStyle, fontFamily && { fontFamily: fontFamily }] },
      children
    )
  );
};

styles = _reactNative.StyleSheet.create({
  container: {},
  label: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 1,
    color: _colors2.default.error,
    fontSize: (0, _normalizeText2.default)(12)
  }
});

exports.default = FormValidationMessage;