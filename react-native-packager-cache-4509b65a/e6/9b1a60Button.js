Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var _Text = require('../text/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var _MaterialIcons = require('react-native-vector-icons/MaterialIcons');

var _MaterialIcons2 = babelHelpers.interopRequireDefault(_MaterialIcons);

var _getIconType = require('../helpers/getIconType');

var _getIconType2 = babelHelpers.interopRequireDefault(_getIconType);

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var styles = {};

var log = function log() {
  console.log('please attach method to this component');
};

var Button = function Button(_ref) {
  var Component = _ref.Component,
      disabled = _ref.disabled,
      loading = _ref.loading,
      loadingRight = _ref.loadingRight,
      activityIndicatorStyle = _ref.activityIndicatorStyle,
      buttonStyle = _ref.buttonStyle,
      borderRadius = _ref.borderRadius,
      title = _ref.title,
      onPress = _ref.onPress,
      delayLongPress = _ref.delayLongPress,
      delayPressIn = _ref.delayPressIn,
      delayPressOut = _ref.delayPressOut,
      onLayout = _ref.onLayout,
      onLongPress = _ref.onLongPress,
      onPressIn = _ref.onPressIn,
      onPressOut = _ref.onPressOut,
      hitSlop = _ref.hitSlop,
      activeOpacity = _ref.activeOpacity,
      onHideUnderlay = _ref.onHideUnderlay,
      onShowUnderlay = _ref.onShowUnderlay,
      background = _ref.background,
      SelectableBackground = _ref.SelectableBackground,
      SelectableBackgroundBorderless = _ref.SelectableBackgroundBorderless,
      Ripple = _ref.Ripple,
      icon = _ref.icon,
      secondary = _ref.secondary,
      secondary2 = _ref.secondary2,
      secondary3 = _ref.secondary3,
      primary1 = _ref.primary1,
      primary2 = _ref.primary2,
      primary3 = _ref.primary3,
      backgroundColor = _ref.backgroundColor,
      color = _ref.color,
      fontSize = _ref.fontSize,
      underlayColor = _ref.underlayColor,
      raised = _ref.raised,
      textStyle = _ref.textStyle,
      large = _ref.large,
      iconRight = _ref.iconRight,
      fontWeight = _ref.fontWeight,
      disabledStyle = _ref.disabledStyle,
      fontFamily = _ref.fontFamily;

  var iconElement = void 0;
  if (icon) {
    var Icon = void 0;
    if (!icon.type) {
      Icon = _MaterialIcons2.default;
    } else {
      Icon = (0, _getIconType2.default)(icon.type);
    }
    iconElement = _react2.default.createElement(Icon, {
      color: icon.color || 'white',
      size: icon.size || (large ? 26 : 18),
      style: [iconRight ? styles.iconRight : styles.icon, icon.style && icon.style],
      name: icon.name });
  }
  var loadingElement = void 0;
  if (loading) {
    loadingElement = _react2.default.createElement(_reactNative.ActivityIndicator, {
      animating: true,
      style: [styles.activityIndicatorStyle, activityIndicatorStyle],
      color: color || "white",
      size: large && "large" || "small"
    });
  }
  if (!Component && _reactNative.Platform.OS === 'ios') {
    Component = _reactNative.TouchableHighlight;
  }
  if (!Component && _reactNative.Platform.OS === 'android') {
    Component = _reactNative.TouchableNativeFeedback;
  }
  if (!Component) {
    Component = _reactNative.TouchableHighlight;
  }
  return _react2.default.createElement(
    Component,
    {
      delayLongPress: delayLongPress,
      delayPressIn: delayPressIn,
      delayPressOut: delayPressOut,
      onLayout: onLayout,
      onLongPress: onLongPress,
      onPressIn: onPressIn,
      onPressOut: onPressOut,
      activeOpacity: activeOpacity,
      onHideUnderlay: onHideUnderlay,
      onShowUnderlay: onShowUnderlay,
      background: background,
      SelectableBackground: SelectableBackground,
      SelectableBackgroundBorderless: SelectableBackgroundBorderless,
      Ripple: Ripple,
      hitSlop: hitSlop,
      underlayColor: underlayColor || 'transparent',
      onPress: onPress || log,
      disabled: disabled || false },
    _react2.default.createElement(
      _reactNative.View,
      {
        style: [styles.button, secondary && { backgroundColor: _colors2.default.secondary }, secondary2 && { backgroundColor: _colors2.default.secondary2 }, secondary3 && { backgroundColor: _colors2.default.secondary3 }, primary1 && { backgroundColor: _colors2.default.primary1 }, primary2 && { backgroundColor: _colors2.default.primary2 }, backgroundColor && { backgroundColor: backgroundColor }, borderRadius && { borderRadius: borderRadius }, raised && styles.raised, !large && styles.small, buttonStyle && buttonStyle, disabled && { backgroundColor: _colors2.default.disabled }, disabled && disabledStyle && disabledStyle]
      },
      icon && !iconRight && iconElement,
      loading && !loadingRight && loadingElement,
      _react2.default.createElement(
        _Text2.default,
        {
          style: [styles.text, color && { color: color }, !large && styles.smallFont, fontSize && { fontSize: fontSize }, textStyle && textStyle, fontWeight && { fontWeight: fontWeight }, fontFamily && { fontFamily: fontFamily }] },
        title
      ),
      loading && loadingRight && loadingElement,
      icon && iconRight && iconElement
    )
  );
};

Button.propTypes = {
  buttonStyle: _react.PropTypes.any,
  title: _react.PropTypes.string,
  onPress: _react.PropTypes.any,
  icon: _react.PropTypes.object,
  secondary: _react.PropTypes.bool,
  secondary2: _react.PropTypes.bool,
  secondary3: _react.PropTypes.bool,
  primary1: _react.PropTypes.bool,
  primary2: _react.PropTypes.bool,
  primary3: _react.PropTypes.bool,
  backgroundColor: _react.PropTypes.string,
  color: _react.PropTypes.string,
  fontSize: _react.PropTypes.any,
  underlayColor: _react.PropTypes.string,
  raised: _react.PropTypes.bool,
  textStyle: _react.PropTypes.any,
  disabled: _react.PropTypes.bool,
  loading: _react.PropTypes.bool,
  activityIndicatorStyle: _react.PropTypes.any,
  loadingRight: _react.PropTypes.bool
};

styles = _reactNative.StyleSheet.create({
  button: {
    padding: 19,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: _colors2.default.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    color: 'white',
    fontSize: (0, _normalizeText2.default)(16)
  },
  icon: {
    marginRight: 10
  },
  iconRight: {
    marginLeft: 10
  },
  small: {
    padding: 12
  },
  smallFont: {
    fontSize: (0, _normalizeText2.default)(14)
  },
  activityIndicatorStyle: {
    marginHorizontal: 10,
    height: 0
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

exports.default = Button;