Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _fonts = require('../config/fonts');

var _fonts2 = babelHelpers.interopRequireDefault(_fonts);

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var _Text = require('../text/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var _Divider = require('../Divider');

var _Divider2 = babelHelpers.interopRequireDefault(_Divider);

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var styles = {};

var Card = function Card(_ref) {
  var children = _ref.children,
      flexDirection = _ref.flexDirection,
      containerStyle = _ref.containerStyle,
      wrapperStyle = _ref.wrapperStyle,
      title = _ref.title,
      titleStyle = _ref.titleStyle,
      dividerStyle = _ref.dividerStyle,
      image = _ref.image,
      imageStyle = _ref.imageStyle,
      fontFamily = _ref.fontFamily;
  return _react2.default.createElement(
    _reactNative.View,
    { style: [styles.container, image && { padding: 0 }, containerStyle && containerStyle] },
    _react2.default.createElement(
      _reactNative.View,
      { style: [styles.wrapper, wrapperStyle && wrapperStyle, flexDirection && { flexDirection: flexDirection }] },
      title && !image && _react2.default.createElement(
        _reactNative.View,
        null,
        _react2.default.createElement(
          _Text2.default,
          { style: [styles.cardTitle, titleStyle && titleStyle, fontFamily && { fontFamily: fontFamily }] },
          title
        ),
        _react2.default.createElement(_Divider2.default, { style: [styles.divider, dividerStyle && dividerStyle] })
      ),
      image && _react2.default.createElement(
        _reactNative.View,
        { style: { flex: 1 } },
        _react2.default.createElement(_reactNative.Image, {
          resizeMode: 'cover',
          style: [{ flex: 1, width: null, height: 150 }, imageStyle && imageStyle],
          source: image }),
        _react2.default.createElement(
          _reactNative.View,
          {
            style: [{ padding: 10 }, wrapperStyle && wrapperStyle] },
          title && _react2.default.createElement(
            _Text2.default,
            { style: [styles.imageTitle, titleStyle && titleStyle] },
            title
          ),
          children
        )
      ),
      !image && children
    )
  );
};

styles = _reactNative.StyleSheet.create({
  container: babelHelpers.extends({
    backgroundColor: 'white',
    borderColor: _colors2.default.grey5,
    borderWidth: 1,
    padding: 15,
    margin: 15,
    marginBottom: 0
  }, _reactNative.Platform.select({
    ios: {
      shadowColor: 'rgba(0,0,0, .2)',
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 1,
      shadowRadius: 1
    },
    android: {
      elevation: 1
    }
  })),
  imageTitle: babelHelpers.extends({
    fontSize: (0, _normalizeText2.default)(14),
    marginBottom: 8,
    color: _colors2.default.grey1
  }, _reactNative.Platform.select({
    ios: {
      fontWeight: '500'
    },
    android: {
      fontFamily: _fonts2.default.android.black
    }
  })),
  wrapper: {
    backgroundColor: 'transparent'
  },
  divider: {
    marginBottom: 15
  },
  cardTitle: babelHelpers.extends({
    fontSize: (0, _normalizeText2.default)(14)
  }, _reactNative.Platform.select({
    ios: {
      fontWeight: 'bold'
    },
    android: {
      fontFamily: _fonts2.default.android.black
    }
  }), {
    textAlign: 'center',
    marginBottom: 15,
    color: _colors2.default.grey1
  })
});

exports.default = Card;