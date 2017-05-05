Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _FontAwesome = require('react-native-vector-icons/FontAwesome');

var _FontAwesome2 = babelHelpers.interopRequireDefault(_FontAwesome);

var _Text = require('../text/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var _fonts = require('../config/fonts');

var _fonts2 = babelHelpers.interopRequireDefault(_fonts);

var styles = void 0;

var log = function log() {
  console.log('please attach method to this component');
};

var colors = (_colors = {
  facebook: '#3b5998',
  twitter: '#00aced'
}, babelHelpers.defineProperty(_colors, 'google-plus-official', '#dd4b39'), babelHelpers.defineProperty(_colors, 'pinterest', '#cb2027'), babelHelpers.defineProperty(_colors, 'linkedin', '#007bb6'), babelHelpers.defineProperty(_colors, 'youtube', '#bb0000'), babelHelpers.defineProperty(_colors, 'vimeo', '#aad450'), babelHelpers.defineProperty(_colors, 'tumblr', '#32506d'), babelHelpers.defineProperty(_colors, 'instagram', '#517fa4'), babelHelpers.defineProperty(_colors, 'quora', '#a82400'), babelHelpers.defineProperty(_colors, 'foursquare', '#0072b1'), babelHelpers.defineProperty(_colors, 'wordpress', '#21759b'), babelHelpers.defineProperty(_colors, 'stumbleupon', '#EB4823'), babelHelpers.defineProperty(_colors, 'github', '#000000'), babelHelpers.defineProperty(_colors, 'github-alt', '#000000'), babelHelpers.defineProperty(_colors, 'twitch', '#6441A5'), babelHelpers.defineProperty(_colors, 'medium', '#02b875'), babelHelpers.defineProperty(_colors, 'soundcloud', '#f50'), babelHelpers.defineProperty(_colors, 'gitlab', '#e14329'), babelHelpers.defineProperty(_colors, 'angellist', '#1c4082'), babelHelpers.defineProperty(_colors, 'codepen', '#000000'), _colors);

var SocialIcon = function SocialIcon(_ref) {
  var component = _ref.component,
      type = _ref.type,
      button = _ref.button,
      disabled = _ref.disabled,
      loading = _ref.loading,
      activityIndicatorStyle = _ref.activityIndicatorStyle,
      small = _ref.small,
      onPress = _ref.onPress,
      iconStyle = _ref.iconStyle,
      style = _ref.style,
      iconColor = _ref.iconColor,
      title = _ref.title,
      raised = _ref.raised,
      light = _ref.light,
      fontFamily = _ref.fontFamily,
      fontStyle = _ref.fontStyle,
      iconSize = _ref.iconSize,
      onLongPress = _ref.onLongPress,
      fontWeight = _ref.fontWeight;

  var Component = onPress || onLongPress ? component || _reactNative.TouchableHighlight : _reactNative.View;
  var loadingElement = void 0;
  if (loading) {
    loadingElement = _react2.default.createElement(_reactNative.ActivityIndicator, {
      animating: true,
      style: [styles.activityIndicatorStyle, activityIndicatorStyle],
      color: iconColor || "white",
      size: small && "small" || "large"
    });
  }
  return _react2.default.createElement(
    Component,
    {
      underlayColor: light ? 'white' : colors[type],
      onLongPress: !disabled && (onLongPress || log),
      onPress: (!disabled || log) && (onPress || log),
      disabled: disabled || false,
      style: [raised && styles.raised, styles.container, button && styles.button, !button && raised && styles.icon, !button && !light && !raised && {
        width: iconSize * 2 + 4,
        height: iconSize * 2 + 4,
        borderRadius: iconSize * 2
      }, { backgroundColor: colors[type] }, light && { backgroundColor: 'white' }, style && style] },
    _react2.default.createElement(
      _reactNative.View,
      { style: styles.wrapper },
      _react2.default.createElement(_FontAwesome2.default, {
        style: [iconStyle && iconStyle],
        color: light ? colors[type] : iconColor,
        name: type,
        size: iconSize }),
      button && title && _react2.default.createElement(
        _Text2.default,
        {
          style: [styles.title, light && { color: colors[type] }, fontFamily && { fontFamily: fontFamily }, fontWeight && { fontWeight: fontWeight }, fontStyle && fontStyle] },
        title
      ),
      loading && loadingElement
    )
  );
};

SocialIcon.propTypes = {
  component: _react.PropTypes.element,
  type: _react.PropTypes.string,
  button: _react.PropTypes.bool,
  onPress: _react.PropTypes.func,
  onLongPress: _react.PropTypes.func,
  iconStyle: _react.PropTypes.any,
  style: _react.PropTypes.any,
  iconColor: _react.PropTypes.string,
  title: _react.PropTypes.string,
  raised: _react.PropTypes.bool,
  disabled: _react.PropTypes.bool,
  loading: _react.PropTypes.bool,
  activityIndicatorStyle: _react.PropTypes.any,
  small: _react.PropTypes.string,
  iconSize: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number])
};

SocialIcon.defaultProps = {
  raised: true,
  iconColor: 'white',
  iconSize: 24,
  button: false
};

styles = _reactNative.StyleSheet.create({
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
    android: {
      fontFamily: _fonts2.default.android.black
    }
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