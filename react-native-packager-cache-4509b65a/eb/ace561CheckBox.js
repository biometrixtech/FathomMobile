Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _Text = require('../text/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var _fonts = require('../config/fonts');

var _fonts2 = babelHelpers.interopRequireDefault(_fonts);

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var _FontAwesome = require('react-native-vector-icons/FontAwesome');

var _FontAwesome2 = babelHelpers.interopRequireDefault(_FontAwesome);

var _getIconType = require('../helpers/getIconType');

var _getIconType2 = babelHelpers.interopRequireDefault(_getIconType);

var styles = {};

var CheckBox = function CheckBox(_ref) {
  var component = _ref.component,
      checked = _ref.checked,
      iconRight = _ref.iconRight,
      title = _ref.title,
      center = _ref.center,
      right = _ref.right,
      containerStyle = _ref.containerStyle,
      textStyle = _ref.textStyle,
      onPress = _ref.onPress,
      onLongPress = _ref.onLongPress,
      checkedIcon = _ref.checkedIcon,
      uncheckedIcon = _ref.uncheckedIcon,
      iconType = _ref.iconType,
      checkedColor = _ref.checkedColor,
      uncheckedColor = _ref.uncheckedColor,
      checkedTitle = _ref.checkedTitle,
      fontFamily = _ref.fontFamily;

  var Icon = _FontAwesome2.default;
  if (iconType) {
    Icon = (0, _getIconType2.default)(iconType);
  }
  var Component = component || _reactNative.TouchableOpacity;
  var iconName = uncheckedIcon;
  if (checked) {
    iconName = checkedIcon;
  }
  return _react2.default.createElement(
    Component,
    {
      onLongPress: onLongPress,
      onPress: onPress,
      style: [styles.container, containerStyle && containerStyle] },
    _react2.default.createElement(
      _reactNative.View,
      { style: [styles.wrapper, right && { justifyContent: 'flex-end' }, center && { justifyContent: 'center' }] },
      !iconRight && _react2.default.createElement(Icon, {
        color: checked ? checkedColor : uncheckedColor,
        name: iconName,
        size: 24 }),
      _react2.default.createElement(
        _Text2.default,
        { style: [styles.text, textStyle && textStyle, fontFamily && { fontFamily: fontFamily }] },
        checked ? checkedTitle || title : title
      ),
      iconRight && _react2.default.createElement(Icon, {
        color: checked ? checkedColor : uncheckedColor,
        name: iconName,
        size: 24 })
    )
  );
};

CheckBox.defaultProps = {
  checked: false,
  iconRight: false,
  right: false,
  center: false,
  checkedColor: 'green',
  uncheckedColor: '#bfbfbf',
  checkedIcon: 'check-square-o',
  uncheckedIcon: 'square-o'
};

styles = _reactNative.StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    margin: 5,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fafafa',
    borderColor: '#ededed',
    borderWidth: 1,
    padding: 10,
    borderRadius: 3
  },
  text: babelHelpers.extends({
    marginLeft: 10,
    marginRight: 10,
    color: _colors2.default.grey1
  }, _reactNative.Platform.select({
    ios: {
      fontWeight: 'bold'
    },
    android: {
      fontFamily: _fonts2.default.android.bold
    }
  }))
});

exports.default = CheckBox;