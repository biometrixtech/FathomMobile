Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/buttons/Button.js';

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

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

var log = function log() {
  console.log('please attach method to this component');
};

var Button = function Button(props) {
  var disabled = props.disabled,
      loading = props.loading,
      loadingRight = props.loadingRight,
      activityIndicatorStyle = props.activityIndicatorStyle,
      buttonStyle = props.buttonStyle,
      borderRadius = props.borderRadius,
      title = props.title,
      onPress = props.onPress,
      icon = props.icon,
      iconComponent = props.iconComponent,
      secondary = props.secondary,
      secondary2 = props.secondary2,
      secondary3 = props.secondary3,
      primary1 = props.primary1,
      primary2 = props.primary2,
      backgroundColor = props.backgroundColor,
      color = props.color,
      fontSize = props.fontSize,
      underlayColor = props.underlayColor,
      raised = props.raised,
      textStyle = props.textStyle,
      large = props.large,
      iconRight = props.iconRight,
      fontWeight = props.fontWeight,
      disabledStyle = props.disabledStyle,
      fontFamily = props.fontFamily,
      containerViewStyle = props.containerViewStyle,
      attributes = babelHelpers.objectWithoutProperties(props, ['disabled', 'loading', 'loadingRight', 'activityIndicatorStyle', 'buttonStyle', 'borderRadius', 'title', 'onPress', 'icon', 'iconComponent', 'secondary', 'secondary2', 'secondary3', 'primary1', 'primary2', 'backgroundColor', 'color', 'fontSize', 'underlayColor', 'raised', 'textStyle', 'large', 'iconRight', 'fontWeight', 'disabledStyle', 'fontFamily', 'containerViewStyle']);
  var Component = props.Component;


  var iconElement = void 0;
  if (icon) {
    var Icon = void 0;
    if (iconComponent) {
      Icon = iconComponent;
    } else if (!icon.type) {
      Icon = _MaterialIcons2.default;
    } else {
      Icon = (0, _getIconType2.default)(icon.type);
    }
    iconElement = _react2.default.createElement(Icon, babelHelpers.extends({}, icon, {
      color: icon.color || 'white',
      size: icon.size || (large ? 26 : 18),
      style: [iconRight ? styles.iconRight : styles.icon, icon.style && icon.style],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 66
      }
    }));
  }
  var loadingElement = void 0;
  if (loading) {
    loadingElement = _react2.default.createElement(_reactNative.ActivityIndicator, {
      animating: true,
      style: [styles.activityIndicatorStyle, activityIndicatorStyle],
      color: color || 'white',
      size: large && 'large' || 'small',
      __source: {
        fileName: _jsxFileName,
        lineNumber: 80
      }
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

  if (_reactNative.Platform.OS === 'android' && borderRadius && !attributes.background) {
    attributes.background = _reactNative.TouchableNativeFeedback.Ripple('ThemeAttrAndroid', true);
  }

  return _react2.default.createElement(
    _reactNative.View,
    {
      style: [styles.container, raised && styles.raised, containerViewStyle],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 106
      }
    },
    _react2.default.createElement(
      Component,
      babelHelpers.extends({
        underlayColor: underlayColor || 'transparent',
        onPress: onPress || log,
        disabled: disabled || false
      }, attributes, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 109
        }
      }),
      _react2.default.createElement(
        _reactNative.View,
        {
          style: [styles.button, secondary && { backgroundColor: _colors2.default.secondary }, secondary2 && { backgroundColor: _colors2.default.secondary2 }, secondary3 && { backgroundColor: _colors2.default.secondary3 }, primary1 && { backgroundColor: _colors2.default.primary1 }, primary2 && { backgroundColor: _colors2.default.primary2 }, backgroundColor && { backgroundColor: backgroundColor }, borderRadius && { borderRadius: borderRadius }, !large && styles.small, buttonStyle && buttonStyle, disabled && { backgroundColor: _colors2.default.disabled }, disabled && disabledStyle && disabledStyle],
          __source: {
            fileName: _jsxFileName,
            lineNumber: 115
          }
        },
        icon && !iconRight && iconElement,
        loading && !loadingRight && loadingElement,
        _react2.default.createElement(
          _Text2.default,
          {
            style: [styles.text, color && { color: color }, !large && styles.smallFont, fontSize && { fontSize: fontSize }, textStyle && textStyle, fontWeight && { fontWeight: fontWeight }, fontFamily && { fontFamily: fontFamily }],
            __source: {
              fileName: _jsxFileName,
              lineNumber: 133
            }
          },
          title
        ),
        loading && loadingRight && loadingElement,
        icon && iconRight && iconElement
      )
    )
  );
};

Button.propTypes = {
  buttonStyle: _reactNative.View.propTypes.style,
  title: _propTypes2.default.string,
  onPress: _propTypes2.default.any,
  icon: _propTypes2.default.object,
  iconComponent: _propTypes2.default.any,
  secondary: _propTypes2.default.bool,
  secondary2: _propTypes2.default.bool,
  secondary3: _propTypes2.default.bool,
  primary1: _propTypes2.default.bool,
  primary2: _propTypes2.default.bool,
  backgroundColor: _propTypes2.default.string,
  color: _propTypes2.default.string,
  fontSize: _propTypes2.default.any,
  underlayColor: _propTypes2.default.string,
  raised: _propTypes2.default.bool,
  textStyle: _reactNative.Text.propTypes.style,
  disabled: _propTypes2.default.bool,
  loading: _propTypes2.default.bool,
  activityIndicatorStyle: _reactNative.View.propTypes.style,
  loadingRight: _propTypes2.default.bool,
  Component: _propTypes2.default.any,
  borderRadius: _propTypes2.default.number,
  large: _propTypes2.default.bool,
  iconRight: _propTypes2.default.bool,
  fontWeight: _propTypes2.default.string,
  disabledStyle: _reactNative.View.propTypes.style,
  fontFamily: _propTypes2.default.string
};

var styles = _reactNative.StyleSheet.create({
  container: {
    marginLeft: 15,
    marginRight: 15
  },
  button: {
    padding: 19,
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