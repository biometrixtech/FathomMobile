Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _badge = require('../badge/badge');

var _badge2 = babelHelpers.interopRequireDefault(_badge);

var _Icon = require('../icons/Icon');

var _Icon2 = babelHelpers.interopRequireDefault(_Icon);

var _Text = require('../text/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var _fonts = require('../config/fonts');

var _fonts2 = babelHelpers.interopRequireDefault(_fonts);

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var styles = void 0;

var ListItem = function ListItem(_ref) {
  var onPress = _ref.onPress,
      title = _ref.title,
      leftIcon = _ref.leftIcon,
      rightIcon = _ref.rightIcon,
      avatar = _ref.avatar,
      avatarStyle = _ref.avatarStyle,
      underlayColor = _ref.underlayColor,
      subtitle = _ref.subtitle,
      subtitleStyle = _ref.subtitleStyle,
      containerStyle = _ref.containerStyle,
      wrapperStyle = _ref.wrapperStyle,
      titleStyle = _ref.titleStyle,
      titleContainerStyle = _ref.titleContainerStyle,
      hideChevron = _ref.hideChevron,
      chevronColor = _ref.chevronColor,
      roundAvatar = _ref.roundAvatar,
      component = _ref.component,
      fontFamily = _ref.fontFamily,
      rightTitle = _ref.rightTitle,
      rightTitleContainerStyle = _ref.rightTitleContainerStyle,
      rightTitleStyle = _ref.rightTitleStyle,
      subtitleContainerStyle = _ref.subtitleContainerStyle,
      badge = _ref.badge,
      badgeContainerStyle = _ref.badgeContainerStyle,
      badgeTextStyle = _ref.badgeTextStyle,
      label = _ref.label,
      onLongPress = _ref.onLongPress;

  var Component = onPress || onLongPress ? _reactNative.TouchableHighlight : _reactNative.View;
  if (component) {
    Component = component;
  }
  if (typeof avatar === 'string') {
    avatar = { uri: avatar };
  }
  return _react2.default.createElement(
    Component,
    {
      onLongPress: onLongPress,
      onPress: onPress,
      underlayColor: underlayColor,
      style: [styles.container, containerStyle && containerStyle] },
    _react2.default.createElement(
      _reactNative.View,
      { style: [styles.wrapper, wrapperStyle && wrapperStyle] },
      leftIcon && leftIcon.name && _react2.default.createElement(_Icon2.default, {
        type: leftIcon.type,
        iconStyle: [styles.icon, leftIcon.style && leftIcon.style],
        name: leftIcon.name,
        color: leftIcon.color || _colors2.default.grey4,
        size: leftIcon.size || 24
      }),
      avatar && _react2.default.createElement(_reactNative.Image, {
        style: [styles.avatar, roundAvatar && { borderRadius: 17 }, avatarStyle && avatarStyle],
        source: avatar
      }),
      _react2.default.createElement(
        _reactNative.View,
        { style: styles.titleSubtitleContainer },
        _react2.default.createElement(
          _reactNative.View,
          { style: titleContainerStyle },
          title && typeof title === 'string' ? _react2.default.createElement(
            _Text2.default,
            {
              style: [styles.title, !leftIcon && { marginLeft: 10 }, titleStyle && titleStyle, fontFamily && { fontFamily: fontFamily }] },
            title
          ) : _react2.default.createElement(
            _reactNative.View,
            null,
            title
          )
        ),
        _react2.default.createElement(
          _reactNative.View,
          { style: subtitleContainerStyle },
          subtitle && typeof subtitle === 'string' ? _react2.default.createElement(
            _Text2.default,
            {
              style: [styles.subtitle, !leftIcon && { marginLeft: 10 }, subtitleStyle && subtitleStyle, fontFamily && { fontFamily: fontFamily }] },
            subtitle
          ) : _react2.default.createElement(
            _reactNative.View,
            null,
            subtitle
          )
        )
      ),
      rightTitle && rightTitle !== '' && _react2.default.createElement(
        _reactNative.View,
        { style: [styles.rightTitleContainer, rightTitleContainerStyle] },
        _react2.default.createElement(
          _Text2.default,
          { style: [styles.rightTitleStyle, rightTitleStyle] },
          rightTitle
        )
      ),
      !hideChevron && _react2.default.createElement(
        _reactNative.View,
        { style: styles.chevronContainer },
        _react2.default.createElement(_Icon2.default, {
          type: rightIcon.type,
          iconStyle: [styles.chevron, rightIcon.style],
          size: 28,
          name: rightIcon.name || 'chevron-right',
          color: rightIcon.color || chevronColor
        })
      ),
      badge && !rightTitle && _react2.default.createElement(_badge2.default, {
        badge: badge
      }),
      label && label
    )
  );
};

ListItem.defaultProps = {
  underlayColor: 'white',
  chevronColor: _colors2.default.grey4,
  rightIcon: { name: 'chevron-right' },
  hideChevron: false,
  roundAvatar: false
};

ListItem.propTypes = {
  title: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]),
  avatar: _react.PropTypes.any,
  icon: _react.PropTypes.any,
  onPress: _react.PropTypes.func,
  rightIcon: _react.PropTypes.object,
  underlayColor: _react.PropTypes.string,
  subtitle: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]),
  subtitleStyle: _react.PropTypes.any,
  containerStyle: _react.PropTypes.any,
  wrapperStyle: _react.PropTypes.any,
  titleStyle: _react.PropTypes.any,
  titleContainerStyle: _react.PropTypes.any,
  hideChevron: _react.PropTypes.bool,
  chevronColor: _react.PropTypes.string,
  roundAvatar: _react.PropTypes.bool,
  badge: _react.PropTypes.any
};

styles = _reactNative.StyleSheet.create({
  avatar: {
    width: 34,
    height: 34
  },
  container: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    borderBottomColor: '#ededed',
    borderBottomWidth: 1,
    backgroundColor: 'transparent'
  },
  wrapper: {
    flexDirection: 'row',
    marginLeft: 10
  },
  icon: {
    marginRight: 8
  },
  title: {
    fontSize: (0, _normalizeText2.default)(14),
    color: _colors2.default.grey1
  },
  subtitle: babelHelpers.extends({
    color: _colors2.default.grey3,
    fontSize: (0, _normalizeText2.default)(12),
    marginTop: 1
  }, _reactNative.Platform.select({
    ios: {
      fontWeight: '600'
    },
    android: {
      fontFamily: _fonts2.default.android.bold
    }
  })),
  titleSubtitleContainer: {
    justifyContent: 'center',
    flex: 1
  },
  chevronContainer: {
    flex: 0.15,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  rightTitleContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  rightTitleStyle: {
    marginRight: 5,
    color: _colors2.default.grey4
  },
  chevron: {}
});

exports.default = ListItem;