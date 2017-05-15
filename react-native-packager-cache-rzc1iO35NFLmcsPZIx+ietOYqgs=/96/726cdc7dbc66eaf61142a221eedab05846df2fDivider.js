Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/divider/Divider.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var styles = {};

var Divider = function Divider(_ref) {
  var style = _ref.style;
  return _react2.default.createElement(_reactNative.View, { style: [styles.container, style && style], __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    }
  });
};

Divider.propTypes = {
  style: _reactNative.View.propTypes.style
};

styles = _reactNative.StyleSheet.create({
  container: {
    height: 1,
    backgroundColor: _colors2.default.grey5
  }
});

exports.default = Divider;