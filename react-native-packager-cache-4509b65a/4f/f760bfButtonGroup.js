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

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var styles = {};

var ButtonGroup = function ButtonGroup(_ref) {
  var component = _ref.component,
      _onPress = _ref.onPress,
      buttons = _ref.buttons,
      containerStyle = _ref.containerStyle,
      selectedBackgroundColor = _ref.selectedBackgroundColor,
      textStyle = _ref.textStyle,
      selectedTextStyle = _ref.selectedTextStyle,
      underlayColor = _ref.underlayColor,
      selectedIndex = _ref.selectedIndex,
      activeOpacity = _ref.activeOpacity,
      onHideUnderlay = _ref.onHideUnderlay,
      onShowUnderlay = _ref.onShowUnderlay,
      setOpacityTo = _ref.setOpacityTo,
      borderStyle = _ref.borderStyle;

  var Component = component || _reactNative.TouchableHighlight;
  return _react2.default.createElement(
    _reactNative.View,
    { style: [styles.container, containerStyle && containerStyle] },
    buttons.map(function (button, i) {
      return _react2.default.createElement(
        Component,
        {
          activeOpacity: activeOpacity,
          onHideUnderlay: onHideUnderlay,
          onShowUnderlay: onShowUnderlay,
          underlayColor: underlayColor || '#ffffff',
          onPress: function onPress() {
            return _onPress(i);
          },
          setOpacityTo: setOpacityTo,
          key: i,
          style: [styles.button, i < buttons.length - 1 && styles.borderRight, i < buttons.length - 1 && borderStyle, selectedIndex === i && { backgroundColor: selectedBackgroundColor || 'white' }] },
        _react2.default.createElement(
          _reactNative.View,
          { style: { flex: 1 } },
          button.element ? _react2.default.createElement(button.element, null) : _react2.default.createElement(
            _Text2.default,
            {
              style: [styles.buttonText, textStyle && textStyle, selectedIndex === i && { color: _colors2.default.grey1 }, selectedIndex === i && selectedTextStyle] },
            button
          )
        )
      );
    })
  );
};

styles = _reactNative.StyleSheet.create({
  button: {
    flex: 1
  },
  borderRight: {
    borderRightColor: _colors2.default.grey4,
    borderRightWidth: 1
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
    backgroundColor: '#f5f5f5'
  },
  buttonText: babelHelpers.extends({
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center',
    fontSize: (0, _normalizeText2.default)(13),
    color: _colors2.default.grey2
  }, _reactNative.Platform.select({
    ios: {
      fontWeight: '500'
    }
  }))
});

ButtonGroup.propTypes = {
  button: _react.PropTypes.object
};

exports.default = ButtonGroup;