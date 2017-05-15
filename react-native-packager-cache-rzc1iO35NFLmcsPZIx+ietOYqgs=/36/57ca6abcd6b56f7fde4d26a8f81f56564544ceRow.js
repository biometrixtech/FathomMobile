Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/grid/Row.js';

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var Row = function Row(props) {
  var containerStyle = props.containerStyle,
      size = props.size,
      onPress = props.onPress,
      activeOpacity = props.activeOpacity;


  var styles = _reactNative.StyleSheet.create({
    container: {
      flex: size ? size : containerStyle && containerStyle.height ? 0 : 1,
      flexDirection: 'row'
    }
  });

  if (onPress) {
    return _react2.default.createElement(
      _reactNative.TouchableOpacity,
      {
        style: [styles.container, containerStyle && containerStyle],
        activeOpacity: activeOpacity,
        onPress: onPress,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 17
        }
      },
      _react2.default.createElement(
        _reactNative.View,
        babelHelpers.extends({}, props, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 22
          }
        }),
        props.children
      )
    );
  }

  return _react2.default.createElement(
    _reactNative.View,
    babelHelpers.extends({
      style: [styles.container, containerStyle && containerStyle]
    }, props, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 30
      }
    }),
    props.children
  );
};

Row.propTypes = {
  size: _propTypes2.default.number,
  containerStyle: _propTypes2.default.any,
  onPress: _propTypes2.default.func,
  activeOpacity: _propTypes2.default.number,
  children: _propTypes2.default.any
};

Row.defaultProps = {
  activeOpacity: 1
};

exports.default = Row;