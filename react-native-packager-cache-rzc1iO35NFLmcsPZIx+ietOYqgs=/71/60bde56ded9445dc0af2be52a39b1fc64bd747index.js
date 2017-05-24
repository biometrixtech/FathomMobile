Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-svg-image/index.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var SVGImage = function (_PureComponent) {
  babelHelpers.inherits(SVGImage, _PureComponent);

  function SVGImage() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, SVGImage);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = SVGImage.__proto__ || Object.getPrototypeOf(SVGImage)).call.apply(_ref, [this].concat(args))), _this), _this.renderLoader = function () {
      return _react2.default.createElement(
        _reactNative.View,
        { style: [_this.props.style, { flex: 1, alignItems: 'center', justifyContent: 'center' }], __source: {
            fileName: _jsxFileName,
            lineNumber: 22
          }
        },
        _react2.default.createElement(_reactNative.ActivityIndicator, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 23
          }
        })
      );
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(SVGImage, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          showWebviewLoader = _props.showWebviewLoader,
          uri = _props.source.uri,
          height = _props.height,
          props = babelHelpers.objectWithoutProperties(_props, ['showWebviewLoader', 'source', 'height']);


      var html = '\n      <!DOCTYPE html>\n\n      <html>\n        <head>\n          <style type="text/css">\n            img {\n                max-width: 100%;\n                max-height: 100%;\n                margin: 0 auto;\n            }\n          </style>\n        </head>\n        <body>\n          <img src="' + uri + '" height="' + height + '" align="middle" />\n        </body>\n      </html>\n    ';

      return _react2.default.createElement(_reactNative.WebView, babelHelpers.extends({
        source: { html: html },
        startInLoadingState: showWebviewLoader,
        renderLoading: showWebviewLoader ? this.renderLoader : null
      }, props, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 49
        }
      }));
    }
  }]);
  return SVGImage;
}(_react.PureComponent);

SVGImage.propTypes = {
  style: _react.PropTypes.any,
  source: _react.PropTypes.shape({
    uri: _react.PropTypes.string
  }).isRequired,
  showWebviewLoader: _react.PropTypes.bool,
  height: _react.PropTypes.number
};
SVGImage.defaultProps = {
  style: {},
  source: { uri: '' },
  showWebviewLoader: _reactNative.Platform.OS === 'android',
  height: null
};
exports.default = SVGImage;