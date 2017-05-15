Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/list/ListItem.js';

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

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

var ListItem = function ListItem(props) {
  var onPress = props.onPress,
      title = props.title,
      leftIcon = props.leftIcon,
      rightIcon = props.rightIcon,
      leftIconContainerStyle = props.leftIconContainerStyle,
      avatarStyle = props.avatarStyle,
      underlayColor = props.underlayColor,
      subtitle = props.subtitle,
      subtitleStyle = props.subtitleStyle,
      containerStyle = props.containerStyle,
      wrapperStyle = props.wrapperStyle,
      titleStyle = props.titleStyle,
      titleContainerStyle = props.titleContainerStyle,
      hideChevron = props.hideChevron,
      chevronColor = props.chevronColor,
      roundAvatar = props.roundAvatar,
      component = props.component,
      fontFamily = props.fontFamily,
      rightTitle = props.rightTitle,
      rightTitleContainerStyle = props.rightTitleContainerStyle,
      rightTitleStyle = props.rightTitleStyle,
      subtitleContainerStyle = props.subtitleContainerStyle,
      badge = props.badge,
      label = props.label,
      onLongPress = props.onLongPress,
      switchButton = props.switchButton,
      onSwitch = props.onSwitch,
      switchDisabled = props.switchDisabled,
      switchOnTintColor = props.switchOnTintColor,
      switchThumbTintColor = props.switchThumbTintColor,
      switchTintColor = props.switchTintColor,
      switched = props.switched,
      textInput = props.textInput,
      textInputAutoCapitalize = props.textInputAutoCapitalize,
      textInputAutoCorrect = props.textInputAutoCorrect,
      textInputAutoFocus = props.textInputAutoFocus,
      textInputEditable = props.textInputEditable,
      textInputKeyboardType = props.textInputKeyboardType,
      textInputMaxLength = props.textInputMaxLength,
      textInputMultiline = props.textInputMultiline,
      textInputOnChangeText = props.textInputOnChangeText,
      textInputOnFocus = props.textInputOnFocus,
      textInputOnBlur = props.textInputOnBlur,
      textInputSelectTextOnFocus = props.textInputSelectTextOnFocus,
      textInputReturnKeyType = props.textInputReturnKeyType,
      textInputValue = props.textInputValue,
      textInputSecure = props.textInputSecure,
      textInputStyle = props.textInputStyle,
      textInputContainerStyle = props.textInputContainerStyle,
      attributes = babelHelpers.objectWithoutProperties(props, ['onPress', 'title', 'leftIcon', 'rightIcon', 'leftIconContainerStyle', 'avatarStyle', 'underlayColor', 'subtitle', 'subtitleStyle', 'containerStyle', 'wrapperStyle', 'titleStyle', 'titleContainerStyle', 'hideChevron', 'chevronColor', 'roundAvatar', 'component', 'fontFamily', 'rightTitle', 'rightTitleContainerStyle', 'rightTitleStyle', 'subtitleContainerStyle', 'badge', 'label', 'onLongPress', 'switchButton', 'onSwitch', 'switchDisabled', 'switchOnTintColor', 'switchThumbTintColor', 'switchTintColor', 'switched', 'textInput', 'textInputAutoCapitalize', 'textInputAutoCorrect', 'textInputAutoFocus', 'textInputEditable', 'textInputKeyboardType', 'textInputMaxLength', 'textInputMultiline', 'textInputOnChangeText', 'textInputOnFocus', 'textInputOnBlur', 'textInputSelectTextOnFocus', 'textInputReturnKeyType', 'textInputValue', 'textInputSecure', 'textInputStyle', 'textInputContainerStyle']);
  var avatar = props.avatar;


  var Component = onPress || onLongPress ? _reactNative.TouchableHighlight : _reactNative.View;
  if (component) {
    Component = component;
  }
  if (typeof avatar === 'string') {
    avatar = { uri: avatar };
  }
  return _react2.default.createElement(
    Component,
    babelHelpers.extends({
      onLongPress: onLongPress,
      onPress: onPress,
      underlayColor: underlayColor,
      style: [styles.container, containerStyle && containerStyle]
    }, attributes, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 83
      }
    }),
    _react2.default.createElement(
      _reactNative.View,
      { style: [styles.wrapper, wrapperStyle && wrapperStyle], __source: {
          fileName: _jsxFileName,
          lineNumber: 90
        }
      },
      _react2.default.isValidElement(leftIcon) ? leftIcon : leftIcon && leftIcon.name && _react2.default.createElement(
        _reactNative.View,
        {
          style: [styles.iconStyle, leftIconContainerStyle && leftIconContainerStyle],
          __source: {
            fileName: _jsxFileName,
            lineNumber: 95
          }
        },
        _react2.default.createElement(_Icon2.default, {
          type: leftIcon.type,
          iconStyle: [styles.icon, leftIcon.style && leftIcon.style],
          name: leftIcon.name,
          color: leftIcon.color || _colors2.default.grey4,
          size: leftIcon.size || 24,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 101
          }
        })
      ),
      avatar && _react2.default.createElement(_reactNative.Image, {
        style: [styles.avatar, roundAvatar && { borderRadius: 17 }, avatarStyle && avatarStyle],
        source: avatar,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 110
        }
      }),
      _react2.default.createElement(
        _reactNative.View,
        { style: styles.titleSubtitleContainer, __source: {
            fileName: _jsxFileName,
            lineNumber: 118
          }
        },
        _react2.default.createElement(
          _reactNative.View,
          { style: titleContainerStyle, __source: {
              fileName: _jsxFileName,
              lineNumber: 119
            }
          },
          title && (typeof title === 'string' || typeof title === 'number') ? _react2.default.createElement(
            _Text2.default,
            {
              style: [styles.title, !leftIcon && { marginLeft: 10 }, titleStyle && titleStyle, fontFamily && { fontFamily: fontFamily }],
              __source: {
                fileName: _jsxFileName,
                lineNumber: 121
              }
            },
            title
          ) : _react2.default.createElement(
            _reactNative.View,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 131
              }
            },
            title
          )
        ),
        _react2.default.createElement(
          _reactNative.View,
          { style: subtitleContainerStyle, __source: {
              fileName: _jsxFileName,
              lineNumber: 135
            }
          },
          subtitle && (typeof subtitle === 'string' || typeof subtitle === 'number') ? _react2.default.createElement(
            _Text2.default,
            {
              style: [styles.subtitle, !leftIcon && { marginLeft: 10 }, subtitleStyle && subtitleStyle, fontFamily && { fontFamily: fontFamily }],
              __source: {
                fileName: _jsxFileName,
                lineNumber: 138
              }
            },
            subtitle
          ) : _react2.default.createElement(
            _reactNative.View,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 148
              }
            },
            subtitle
          )
        )
      ),
      rightTitle && rightTitle !== '' && !textInput && _react2.default.createElement(
        _reactNative.View,
        { style: [styles.rightTitleContainer, rightTitleContainerStyle], __source: {
            fileName: _jsxFileName,
            lineNumber: 156
          }
        },
        _react2.default.createElement(
          _Text2.default,
          { style: [styles.rightTitleStyle, rightTitleStyle], __source: {
              fileName: _jsxFileName,
              lineNumber: 157
            }
          },
          rightTitle
        )
      ),
      textInput && _react2.default.createElement(
        _reactNative.View,
        { style: [styles.rightTitleContainer, textInputContainerStyle], __source: {
            fileName: _jsxFileName,
            lineNumber: 162
          }
        },
        _react2.default.createElement(_reactNative.TextInput, {
          style: [styles.textInputStyle, textInputStyle],
          defaultValue: rightTitle,
          value: textInputValue,
          autoCapitalize: textInputAutoCapitalize,
          autoCorrect: textInputAutoCorrect,
          autoFocus: textInputAutoFocus,
          editable: textInputEditable,
          keyboardType: textInputKeyboardType,
          maxLength: textInputMaxLength,
          multiline: textInputMultiline,
          onChangeText: textInputOnChangeText,
          onFocus: textInputOnFocus,
          onBlur: textInputOnBlur,
          secureTextEntry: textInputSecure,
          selectTextOnFocus: textInputSelectTextOnFocus,
          returnKeyType: textInputReturnKeyType,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 163
          }
        })
      ),
      !hideChevron && (_react2.default.isValidElement(rightIcon) ? rightIcon : _react2.default.createElement(
        _reactNative.View,
        { style: styles.chevronContainer, __source: {
            fileName: _jsxFileName,
            lineNumber: 185
          }
        },
        _react2.default.createElement(_Icon2.default, {
          type: rightIcon.type,
          iconStyle: rightIcon.style,
          size: 28,
          name: rightIcon.name || 'chevron-right',
          color: rightIcon.color || chevronColor,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 186
          }
        })
      )),
      switchButton && hideChevron && _react2.default.createElement(
        _reactNative.View,
        { style: styles.switchContainer, __source: {
            fileName: _jsxFileName,
            lineNumber: 196
          }
        },
        _react2.default.createElement(_reactNative.Switch, {
          onValueChange: onSwitch,
          disabled: switchDisabled,
          onTintColor: switchOnTintColor,
          thumbTintColor: switchThumbTintColor,
          tintColor: switchTintColor,
          value: switched,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 197
          }
        })
      ),
      badge && !rightTitle && _react2.default.createElement(_badge2.default, babelHelpers.extends({}, badge, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 206
        }
      })),
      label && label
    )
  );
};

ListItem.defaultProps = {
  underlayColor: 'white',
  chevronColor: _colors2.default.grey4,
  rightIcon: { name: 'chevron-right' },
  hideChevron: false,
  roundAvatar: false,
  switchButton: false,
  textInputEditable: true
};

ListItem.propTypes = {
  title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.object]),
  avatar: _propTypes2.default.any,
  icon: _propTypes2.default.any,
  onPress: _propTypes2.default.func,
  rightIcon: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.object]),
  underlayColor: _propTypes2.default.string,
  subtitle: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.object]),
  subtitleStyle: _propTypes2.default.any,
  containerStyle: _propTypes2.default.any,
  wrapperStyle: _propTypes2.default.any,
  titleStyle: _propTypes2.default.any,
  titleContainerStyle: _propTypes2.default.any,
  hideChevron: _propTypes2.default.bool,
  chevronColor: _propTypes2.default.string,
  roundAvatar: _propTypes2.default.bool,
  badge: _propTypes2.default.any,
  switchButton: _propTypes2.default.bool,
  onSwitch: _propTypes2.default.func,
  switchDisabled: _propTypes2.default.bool,
  switchOnTintColor: _propTypes2.default.string,
  switchThumbTintColor: _propTypes2.default.string,
  switchTintColor: _propTypes2.default.string,
  switched: _propTypes2.default.bool,
  textInput: _propTypes2.default.bool,
  textInputAutoCapitalize: _propTypes2.default.bool,
  textInputAutoCorrect: _propTypes2.default.bool,
  textInputAutoFocus: _propTypes2.default.bool,
  textInputEditable: _propTypes2.default.bool,
  textInputKeyboardType: _propTypes2.default.oneOf(['default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search']),
  textInputMaxLength: _propTypes2.default.number,
  textInputMultiline: _propTypes2.default.bool,
  textInputOnChangeText: _propTypes2.default.func,
  textInputOnFocus: _propTypes2.default.func,
  textInputOnBlur: _propTypes2.default.func,
  textInputSelectTextOnFocus: _propTypes2.default.bool,
  textInputReturnKeyType: _propTypes2.default.string,
  textInputValue: _propTypes2.default.string,
  textInputSecure: _propTypes2.default.bool,
  textInputStyle: _propTypes2.default.any,
  textInputContainerStyle: _propTypes2.default.any,
  component: _propTypes2.default.any,
  fontFamily: _propTypes2.default.string,
  rightTitle: _propTypes2.default.string,
  rightTitleContainerStyle: _reactNative.View.propTypes.style,
  rightTitleStyle: _Text2.default.propTypes.style,
  subtitleContainerStyle: _reactNative.View.propTypes.style,
  label: _propTypes2.default.any,
  onLongPress: _propTypes2.default.func,
  leftIcon: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.object]),
  leftIconContainerStyle: _reactNative.View.propTypes.style,
  avatarStyle: _reactNative.View.propTypes.style
};

var styles = _reactNative.StyleSheet.create({
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
  iconStyle: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center'
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
    android: babelHelpers.extends({}, _fonts2.default.android.bold)
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
  switchContainer: {
    flex: 0.15,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 5
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
  textInputStyle: {
    height: 20,
    textAlign: 'right'
  }
});

exports.default = ListItem;