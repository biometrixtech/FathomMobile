Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _getIconType = require('../helpers/getIconType');

var _getIconType2 = babelHelpers.interopRequireDefault(_getIconType);

var styles = {};

var Icon = function Icon(_ref) {
  var type = _ref.type,
      name = _ref.name,
      size = _ref.size,
      color = _ref.color,
      iconStyle = _ref.iconStyle,
      component = _ref.component,
      onPress = _ref.onPress,
      underlayColor = _ref.underlayColor,
      reverse = _ref.reverse,
      raised = _ref.raised,
      onLongPress = _ref.onLongPress,
      containerStyle = _ref.containerStyle,
      reverseColor = _ref.reverseColor;

  var Component = _reactNative.View;
  if (onPress) {
    Component = _reactNative.TouchableHighlight;
  }
  if (component) {
    Component = component;
  }
  var Icon = void 0;
  if (!type) {
    Icon = (0, _getIconType2.default)('material');
  } else {
    Icon = (0, _getIconType2.default)(type);
  }
  return _react2.default.createElement(
    Component,
    {
      underlayColor: reverse ? color : underlayColor || color,
      style: [(reverse || raised) && styles.button, (reverse || raised) && {
        borderRadius: size + 4,
        height: size * 2 + 4,
        width: size * 2 + 4
      }, raised && styles.raised, {
        backgroundColor: reverse ? color : raised ? 'white' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center' }, containerStyle && containerStyle],
      onLongPress: onLongPress,
      onPress: onPress },
    _react2.default.createElement(Icon, {
      style: [{ backgroundColor: 'transparent' }, iconStyle && iconStyle],
      size: size,
      name: name,
      color: reverse ? reverseColor : color })
  );
};

Icon.propTypes = {
  type: _react.PropTypes.string,
  name: _react.PropTypes.string,
  size: _react.PropTypes.number,
  color: _react.PropTypes.string,
  component: _react.PropTypes.element,
  underlayColor: _react.PropTypes.string,
  reverse: _react.PropTypes.bool,
  raised: _react.PropTypes.bool,
  containerStyle: _react.PropTypes.any,
  iconStyle: _react.PropTypes.any,
  onPress: _react.PropTypes.func,
  reverseColor: _react.PropTypes.string
};

Icon.defaultProps = {
  underlayColor: 'white',
  reverse: false,
  raised: false,
  size: 24,
  color: 'black',
  reverseColor: 'white'
};

styles = _reactNative.StyleSheet.create({
  button: {
    margin: 7
  },
  raised: babelHelpers.extends({}, _reactNative.Platform.select({
    ios: {
      shadowColor: 'rgba(0,0,0, .4)',
      shadowOffset: { height: 1, width: 1 },
      shadowOpacity: 1,
      shadowRadius: 1
    },
    android: {
      elevation: 2
    }
  }))
});

exports.default = Icon;