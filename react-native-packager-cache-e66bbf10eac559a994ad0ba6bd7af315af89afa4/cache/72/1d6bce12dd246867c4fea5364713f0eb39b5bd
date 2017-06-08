Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/buttons/ButtonGroup.js';

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

var ButtonGroup = function ButtonGroup(props) {
  var component = props.component,
      buttons = props.buttons,
      onPress = props.onPress,
      selectedIndex = props.selectedIndex,
      containerStyle = props.containerStyle,
      innerBorderStyle = props.innerBorderStyle,
      lastBorderStyle = props.lastBorderStyle,
      buttonStyle = props.buttonStyle,
      textStyle = props.textStyle,
      selectedTextStyle = props.selectedTextStyle,
      selectedBackgroundColor = props.selectedBackgroundColor,
      underlayColor = props.underlayColor,
      activeOpacity = props.activeOpacity,
      onHideUnderlay = props.onHideUnderlay,
      onShowUnderlay = props.onShowUnderlay,
      setOpacityTo = props.setOpacityTo,
      containerBorderRadius = props.containerBorderRadius,
      attributes = babelHelpers.objectWithoutProperties(props, ['component', 'buttons', 'onPress', 'selectedIndex', 'containerStyle', 'innerBorderStyle', 'lastBorderStyle', 'buttonStyle', 'textStyle', 'selectedTextStyle', 'selectedBackgroundColor', 'underlayColor', 'activeOpacity', 'onHideUnderlay', 'onShowUnderlay', 'setOpacityTo', 'containerBorderRadius']);


  var Component = component || _reactNative.TouchableHighlight;
  return _react2.default.createElement(
    _reactNative.View,
    babelHelpers.extends({
      style: [styles.container, containerStyle && containerStyle]
    }, attributes, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 38
      }
    }),
    buttons.map(function (button, i) {
      return _react2.default.createElement(
        Component,
        {
          activeOpacity: activeOpacity,
          setOpacityTo: setOpacityTo,
          onHideUnderlay: onHideUnderlay,
          onShowUnderlay: onShowUnderlay,
          underlayColor: underlayColor || '#ffffff',
          onPress: onPress ? function () {
            return onPress(i);
          } : function () {},
          key: i,
          style: [styles.button, i < buttons.length - 1 && {
            borderRightWidth: innerBorderStyle && innerBorderStyle.width || 1,
            borderRightColor: innerBorderStyle && innerBorderStyle.color || _colors2.default.grey4
          }, i === buttons.length - 1 && babelHelpers.extends({}, lastBorderStyle, {
            borderTopRightRadius: containerBorderRadius || 0,
            borderBottomRightRadius: containerBorderRadius || 0
          }), i === 0 && {
            borderTopLeftRadius: containerBorderRadius || 0,
            borderBottomLeftRadius: containerBorderRadius || 0
          }, selectedIndex === i && {
            backgroundColor: selectedBackgroundColor || 'white'
          }],
          __source: {
            fileName: _jsxFileName,
            lineNumber: 44
          }
        },
        _react2.default.createElement(
          _reactNative.View,
          { style: [styles.textContainer, buttonStyle && buttonStyle], __source: {
              fileName: _jsxFileName,
              lineNumber: 76
            }
          },
          button.element ? _react2.default.createElement(button.element, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 78
            }
          }) : _react2.default.createElement(
            _Text2.default,
            {
              style: [styles.buttonText, textStyle && textStyle, selectedIndex === i && { color: _colors2.default.grey1 }, selectedIndex === i && selectedTextStyle],
              __source: {
                fileName: _jsxFileName,
                lineNumber: 79
              }
            },
            button
          )
        )
      );
    })
  );
};

var styles = _reactNative.StyleSheet.create({
  button: {
    flex: 1
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    borderColor: '#e3e3e3',
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    height: 40
  },
  buttonText: babelHelpers.extends({
    fontSize: (0, _normalizeText2.default)(13),
    color: _colors2.default.grey2
  }, _reactNative.Platform.select({
    ios: {
      fontWeight: '500'
    }
  }))
});

ButtonGroup.propTypes = {
  button: _propTypes2.default.object,
  component: _propTypes2.default.any,
  onPress: _propTypes2.default.func,
  buttons: _propTypes2.default.array,
  containerStyle: _reactNative.View.propTypes.style,
  textStyle: _reactNative.Text.propTypes.style,
  selectedTextStyle: _reactNative.Text.propTypes.style,
  underlayColor: _propTypes2.default.string,
  selectedIndex: _propTypes2.default.number,
  activeOpacity: _propTypes2.default.number,
  onHideUnderlay: _propTypes2.default.func,
  onShowUnderlay: _propTypes2.default.func,
  setOpacityTo: _propTypes2.default.any,
  innerBorderStyle: _propTypes2.default.shape({
    color: _propTypes2.default.string,
    width: _propTypes2.default.number
  }),
  lastBorderStyle: _propTypes2.default.oneOfType([_reactNative.View.propTypes.style, _reactNative.Text.propTypes.style]),
  buttonStyle: _reactNative.View.propTypes.style,
  selectedBackgroundColor: _propTypes2.default.string,
  containerBorderRadius: _propTypes2.default.number
};

exports.default = ButtonGroup;