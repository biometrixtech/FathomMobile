Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var Row = function Row(props) {
  var style = props.style,
      size = props.size,
      onPress = props.onPress,
      activeOpacity = props.activeOpacity;


  var styles = babelHelpers.extends({
    flex: size ? size : style && style.height ? 0 : 1,
    flexDirection: 'row'
  }, style);

  if (onPress) {
    return _react2.default.createElement(
      _reactNative.TouchableOpacity,
      { style: babelHelpers.extends({}, styles), activeOpacity: activeOpacity, onPress: onPress },
      _react2.default.createElement(
        _reactNative.View,
        props,
        props.children
      )
    );
  }

  return _react2.default.createElement(
    _reactNative.View,
    babelHelpers.extends({}, styles, props),
    props.children
  );
};

Row.propTypes = {
  size: _react.PropTypes.number,
  style: _react.PropTypes.object,
  onPress: _react.PropTypes.func,
  activeOpacity: _react.PropTypes.number
};

Row.defaultProps = {
  activeOpacity: 1
};

exports.default = Row;