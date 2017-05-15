Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/form/FormValidationMessage.js';

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var _Text = require('../text/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var FormValidationMessage = function FormValidationMessage(props) {
  var containerStyle = props.containerStyle,
      labelStyle = props.labelStyle,
      children = props.children,
      fontFamily = props.fontFamily,
      attributes = babelHelpers.objectWithoutProperties(props, ['containerStyle', 'labelStyle', 'children', 'fontFamily']);

  return _react2.default.createElement(
    _reactNative.View,
    babelHelpers.extends({
      style: [styles.container, containerStyle && containerStyle]
    }, attributes, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17
      }
    }),
    _react2.default.createElement(
      _Text2.default,
      {
        style: [styles.label, labelStyle && labelStyle, fontFamily && { fontFamily: fontFamily }],
        __source: {
          fileName: _jsxFileName,
          lineNumber: 21
        }
      },
      children
    )
  );
};

FormValidationMessage.propTypes = {
  containerStyle: _reactNative.View.propTypes.style,
  labelStyle: _reactNative.Text.propTypes.style,
  children: _propTypes2.default.any,
  fontFamily: _propTypes2.default.string
};

var styles = _reactNative.StyleSheet.create({
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