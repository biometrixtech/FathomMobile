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

var _Button = require('../buttons/Button');

var _Button2 = babelHelpers.interopRequireDefault(_Button);

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var styles = {};

var PricingCard = function PricingCard(_ref) {
  var containerStyle = _ref.containerStyle,
      wrapperStyle = _ref.wrapperStyle,
      title = _ref.title,
      price = _ref.price,
      info = _ref.info,
      button = _ref.button,
      color = _ref.color,
      titleFont = _ref.titleFont,
      pricingFont = _ref.pricingFont,
      infoFont = _ref.infoFont,
      buttonFont = _ref.buttonFont,
      onButtonPress = _ref.onButtonPress;
  return _react2.default.createElement(
    _reactNative.View,
    { style: [styles.container, containerStyle && containerStyle] },
    _react2.default.createElement(
      _reactNative.View,
      { style: [styles.wrapper, wrapperStyle && wrapperStyle] },
      _react2.default.createElement(
        _Text2.default,
        { style: [styles.pricingTitle, { color: color }, titleFont && { fontFamily: titleFont }] },
        title
      ),
      _react2.default.createElement(
        _Text2.default,
        { style: [styles.pricingPrice, pricingFont && { fontFamily: pricingFont }] },
        price
      ),
      info.map(function (item, i) {
        return _react2.default.createElement(
          _Text2.default,
          { key: i, style: [styles.pricingInfo, infoFont && { fontFamily: infoFont }] },
          item
        );
      }),
      _react2.default.createElement(_Button2.default, {
        icon: { name: button.icon },
        buttonStyle: [styles.button, button.buttonStyle, { backgroundColor: color }, buttonFont && { fontFamily: buttonFont }],
        title: button.title,
        onPress: onButtonPress
      })
    )
  );
};

PricingCard.propTypes = {
  containerStyle: _react.PropTypes.any,
  wrapperStyle: _react.PropTypes.any,
  title: _react.PropTypes.string,
  price: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  info: _react.PropTypes.array,
  button: _react.PropTypes.object,
  color: _react.PropTypes.string,
  onButtonPress: _react.PropTypes.any
};

PricingCard.defaultProps = {
  color: _colors2.default.primary
};

styles = _reactNative.StyleSheet.create({
  container: babelHelpers.extends({
    margin: 15,
    marginBottom: 15,
    backgroundColor: 'white',
    borderColor: _colors2.default.grey5,
    borderWidth: 1,
    padding: 15
  }, _reactNative.Platform.select({
    ios: {
      shadowColor: 'rgba(0,0,0, .2)',
      shadowOffset: { height: 1, width: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 0.5
    },
    android: {
      elevation: 1
    }
  })),
  wrapper: {
    backgroundColor: 'transparent'
  },
  pricingTitle: babelHelpers.extends({
    textAlign: 'center',
    color: _colors2.default.primary,
    fontSize: (0, _normalizeText2.default)(30)
  }, _reactNative.Platform.select({
    ios: {
      fontWeight: '800'
    },
    android: {
      fontFamily: _fonts2.default.android.black
    }
  })),
  pricingPrice: babelHelpers.extends({
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontSize: (0, _normalizeText2.default)(40)
  }, _reactNative.Platform.select({
    ios: {
      fontWeight: '700'
    },
    android: {
      fontFamily: _fonts2.default.android.bold
    }
  })),
  pricingInfo: babelHelpers.extends({
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
    color: _colors2.default.grey3
  }, _reactNative.Platform.select({
    ios: {
      fontWeight: '600'
    },
    android: {
      fontFamily: _fonts2.default.android.bold
    }
  })),
  button: {
    marginTop: 15,
    marginBottom: 10
  }
});

exports.default = PricingCard;