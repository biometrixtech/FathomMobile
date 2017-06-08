Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/pricing/PricingCard.js';

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

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

var PricingCard = function PricingCard(props) {
  var containerStyle = props.containerStyle,
      wrapperStyle = props.wrapperStyle,
      title = props.title,
      price = props.price,
      info = props.info,
      button = props.button,
      color = props.color,
      titleFont = props.titleFont,
      pricingFont = props.pricingFont,
      infoFont = props.infoFont,
      buttonFont = props.buttonFont,
      onButtonPress = props.onButtonPress,
      attributes = babelHelpers.objectWithoutProperties(props, ['containerStyle', 'wrapperStyle', 'title', 'price', 'info', 'button', 'color', 'titleFont', 'pricingFont', 'infoFont', 'buttonFont', 'onButtonPress']);

  return _react2.default.createElement(
    _reactNative.View,
    babelHelpers.extends({
      style: [styles.container, containerStyle && containerStyle]
    }, attributes, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 27
      }
    }),
    _react2.default.createElement(
      _reactNative.View,
      { style: [styles.wrapper, wrapperStyle && wrapperStyle], __source: {
          fileName: _jsxFileName,
          lineNumber: 31
        }
      },
      _react2.default.createElement(
        _Text2.default,
        {
          style: [styles.pricingTitle, { color: color }, titleFont && { fontFamily: titleFont }],
          __source: {
            fileName: _jsxFileName,
            lineNumber: 32
          }
        },
        title
      ),
      _react2.default.createElement(
        _Text2.default,
        {
          style: [styles.pricingPrice, pricingFont && { fontFamily: pricingFont }],
          __source: {
            fileName: _jsxFileName,
            lineNumber: 41
          }
        },
        price
      ),
      info.map(function (item, i) {
        return _react2.default.createElement(
          _Text2.default,
          {
            key: i,
            style: [styles.pricingInfo, infoFont && { fontFamily: infoFont }],
            __source: {
              fileName: _jsxFileName,
              lineNumber: 51
            }
          },
          item
        );
      }),
      _react2.default.createElement(_Button2.default, {
        icon: { name: button.icon },
        buttonStyle: [styles.button, button.buttonStyle, { backgroundColor: color }],
        fontFamily: buttonFont && buttonFont,
        title: button.title,
        onPress: onButtonPress,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 59
        }
      })
    )
  );
};

PricingCard.propTypes = {
  containerStyle: _reactNative.View.propTypes.style,
  wrapperStyle: _reactNative.View.propTypes.style,
  title: _propTypes2.default.string,
  price: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  info: _propTypes2.default.array,
  button: _propTypes2.default.object,
  color: _propTypes2.default.string,
  onButtonPress: _propTypes2.default.any,
  titleFont: _propTypes2.default.string,
  pricingFont: _propTypes2.default.string,
  infoFont: _propTypes2.default.string,
  buttonFont: _propTypes2.default.string
};

PricingCard.defaultProps = {
  color: _colors2.default.primary
};

var styles = _reactNative.StyleSheet.create({
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
    android: babelHelpers.extends({}, _fonts2.default.android.black)
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
    android: babelHelpers.extends({}, _fonts2.default.android.bold)
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
    android: babelHelpers.extends({}, _fonts2.default.android.bold)
  })),
  button: {
    marginTop: 15,
    marginBottom: 10
  }
});

exports.default = PricingCard;