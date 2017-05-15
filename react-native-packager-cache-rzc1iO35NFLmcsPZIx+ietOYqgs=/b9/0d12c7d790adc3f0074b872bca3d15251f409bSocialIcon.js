Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors,
    _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/social/SocialIcon.js';

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _FontAwesome = require('react-native-vector-icons/FontAwesome');

var _FontAwesome2 = babelHelpers.interopRequireDefault(_FontAwesome);

var _Text = require('../text/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var _fonts = require('../config/fonts');

var _fonts2 = babelHelpers.interopRequireDefault(_fonts);

var log = function log() {
  console.log('please attach method to this component');
};

var colors = (_colors = {
  facebook: '#3b5998',
  twitter: '#00aced'
}, babelHelpers.defineProperty(_colors, 'google-plus-official', '#dd4b39'), babelHelpers.defineProperty(_colors, 'pinterest', '#cb2027'), babelHelpers.defineProperty(_colors, 'linkedin', '#007bb6'), babelHelpers.defineProperty(_colors, 'youtube', '#bb0000'), babelHelpers.defineProperty(_colors, 'vimeo', '#aad450'), babelHelpers.defineProperty(_colors, 'tumblr', '#32506d'), babelHelpers.defineProperty(_colors, 'instagram', '#517fa4'), babelHelpers.defineProperty(_colors, 'quora', '#a82400'), babelHelpers.defineProperty(_colors, 'foursquare', '#0072b1'), babelHelpers.defineProperty(_colors, 'wordpress', '#21759b'), babelHelpers.defineProperty(_colors, 'stumbleupon', '#EB4823'), babelHelpers.defineProperty(_colors, 'github', '#000000'), babelHelpers.defineProperty(_colors, 'github-alt', '#000000'), babelHelpers.defineProperty(_colors, 'twitch', '#6441A5'), babelHelpers.defineProperty(_colors, 'medium', '#02b875'), babelHelpers.defineProperty(_colors, 'soundcloud', '#f50'), babelHelpers.defineProperty(_colors, 'gitlab', '#e14329'), babelHelpers.defineProperty(_colors, 'angellist', '#1c4082'), babelHelpers.defineProperty(_colors, 'codepen', '#000000'), _colors);

var SocialIcon = function SocialIcon(props) {
  var component = props.component,
      type = props.type,
      button = props.button,
      disabled = props.disabled,
      loading = props.loading,
      activityIndicatorStyle = props.activityIndicatorStyle,
      small = props.small,
      onPress = props.onPress,
      iconStyle = props.iconStyle,
      style = props.style,
      iconColor = props.iconColor,
      title = props.title,
      raised = props.raised,
      light = props.light,
      fontFamily = props.fontFamily,
      fontStyle = props.fontStyle,
      iconSize = props.iconSize,
      onLongPress = props.onLongPress,
      fontWeight = props.fontWeight,
      attributes = babelHelpers.objectWithoutProperties(props, ['component', 'type', 'button', 'disabled', 'loading', 'activityIndicatorStyle', 'small', 'onPress', 'iconStyle', 'style', 'iconColor', 'title', 'raised', 'light', 'fontFamily', 'fontStyle', 'iconSize', 'onLongPress', 'fontWeight']);


  var Component = onPress || onLongPress ? component || _reactNative.TouchableHighlight : _reactNative.View;
  var loadingElement = void 0;
  if (loading) {
    loadingElement = _react2.default.createElement(_reactNative.ActivityIndicator, {
      animating: true,
      style: [styles.activityIndicatorStyle, activityIndicatorStyle],
      color: iconColor || 'white',
      size: small && 'small' || 'large',
      __source: {
        fileName: _jsxFileName,
        lineNumber: 72
      }
    });
  }
  return _react2.default.createElement(
    Component,
    babelHelpers.extends({
      underlayColor: light ? 'white' : colors[type],
      onLongPress: !disabled && (onLongPress || log),
      onPress: (!disabled || log) && (onPress || log),
      disabled: disabled || false,
      style: [raised && styles.raised, styles.container, button && styles.button, !button && raised && styles.icon, !button && !light && !raised && {
        width: iconSize * 2 + 4,
        height: iconSize * 2 + 4,
        borderRadius: iconSize * 2
      }, { backgroundColor: colors[type] }, light && { backgroundColor: 'white' }, style && style]
    }, attributes, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 81
      }
    }),
    _react2.default.createElement(
      _reactNative.View,
      { style: styles.wrapper, __source: {
          fileName: _jsxFileName,
          lineNumber: 104
        }
      },
      _react2.default.createElement(_FontAwesome2.default, {
        style: [iconStyle && iconStyle],
        color: light ? colors[type] : iconColor,
        name: type,
        size: iconSize,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 105
        }
      }),
      button && title && _react2.default.createElement(
        _Text2.default,
        {
          style: [styles.title, light && { color: colors[type] }, fontFamily && { fontFamily: fontFamily }, fontWeight && { fontWeight: fontWeight }, fontStyle && fontStyle],
          __source: {
            fileName: _jsxFileName,
            lineNumber: 113
          }
        },
        title
      ),
      loading && loadingElement
    )
  );
};

SocialIcon.propTypes = {
  component: _propTypes2.default.element,
  type: _propTypes2.default.string,
  button: _propTypes2.default.bool,
  onPress: _propTypes2.default.func,
  onLongPress: _propTypes2.default.func,
  iconStyle: _reactNative.View.propTypes.style,
  style: _reactNative.View.propTypes.style,
  iconColor: _propTypes2.default.string,
  title: _propTypes2.default.string,
  raised: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool,
  loading: _propTypes2.default.bool,
  activityIndicatorStyle: _reactNative.View.propTypes.style,
  small: _propTypes2.default.string,
  iconSize: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  light: _propTypes2.default.bool,
  fontWeight: _propTypes2.default.string,
  fontStyle: _reactNative.View.propTypes.style,
  fontFamily: _propTypes2.default.string
};

SocialIcon.defaultProps = {
  raised: true,
  iconColor: 'white',
  iconSize: 24,
  button: false
};

var styles = _reactNative.StyleSheet.create({
  container: {
    margin: 7,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    paddingTop: 14,
    paddingBottom: 14
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
  })),
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: babelHelpers.extends({
    color: 'white',
    marginLeft: 15
  }, _reactNative.Platform.select({
    ios: {
      fontWeight: 'bold'
    },
    android: babelHelpers.extends({}, _fonts2.default.android.black)
  })),
  icon: {
    height: 52,
    width: 52
  },
  activityIndicatorStyle: {
    marginHorizontal: 10,
    height: 0
  }
});

exports.default = SocialIcon;