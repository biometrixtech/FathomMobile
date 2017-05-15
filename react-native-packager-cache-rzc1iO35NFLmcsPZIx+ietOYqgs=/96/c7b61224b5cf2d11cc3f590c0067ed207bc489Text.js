Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/text/Text.js';

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _fonts = require('../config/fonts');

var _fonts2 = babelHelpers.interopRequireDefault(_fonts);

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var styles = _reactNative.StyleSheet.create({
  text: babelHelpers.extends({}, _reactNative.Platform.select({
    android: babelHelpers.extends({}, _fonts2.default.android.regular)
  })),
  bold: babelHelpers.extends({}, _reactNative.Platform.select({
    android: babelHelpers.extends({}, _fonts2.default.android.bold)
  }))
});

var TextElement = function TextElement(props) {
  var style = props.style,
      children = props.children,
      h1 = props.h1,
      h2 = props.h2,
      h3 = props.h3,
      h4 = props.h4,
      fontFamily = props.fontFamily,
      rest = babelHelpers.objectWithoutProperties(props, ['style', 'children', 'h1', 'h2', 'h3', 'h4', 'fontFamily']);


  return _react2.default.createElement(
    _reactNative.Text,
    babelHelpers.extends({
      style: [styles.text, h1 && { fontSize: (0, _normalizeText2.default)(40) }, h2 && { fontSize: (0, _normalizeText2.default)(34) }, h3 && { fontSize: (0, _normalizeText2.default)(28) }, h4 && { fontSize: (0, _normalizeText2.default)(22) }, h1 && styles.bold, h2 && styles.bold, h3 && styles.bold, h4 && styles.bold, fontFamily && { fontFamily: fontFamily }, style && style]
    }, rest, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28
      }
    }),
    children
  );
};

TextElement.propTypes = {
  style: _propTypes2.default.any,
  h1: _propTypes2.default.bool,
  h2: _propTypes2.default.bool,
  h3: _propTypes2.default.bool,
  h4: _propTypes2.default.bool,
  fontFamily: _propTypes2.default.string,
  children: _propTypes2.default.any
};

exports.default = TextElement;