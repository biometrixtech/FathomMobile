Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/containers/Launch/LaunchView.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeRouterFlux = require('react-native-router-flux');

var _theme = require('@theme/');

var styles = _reactNative.StyleSheet.create({
  launchImage: {
    width: _theme.AppSizes.screen.width,
    height: _theme.AppSizes.screen.height
  }
});

var AppLaunch = function (_Component) {
  babelHelpers.inherits(AppLaunch, _Component);

  function AppLaunch() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, AppLaunch);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = AppLaunch.__proto__ || Object.getPrototypeOf(AppLaunch)).call.apply(_ref, [this].concat(args))), _this), _this.componentDidMount = function () {
      _reactNative.StatusBar.setHidden(false, true);

      _this.props.login().then(function () {
        return _reactNativeRouterFlux.Actions.app({ type: 'reset' });
      }).catch(function () {
        return _reactNativeRouterFlux.Actions.login({ type: 'reset' });
      });
    }, _this.render = function () {
      return _react2.default.createElement(
        _reactNative.View,
        { style: [_theme.AppStyles.container], __source: {
            fileName: _jsxFileName,
            lineNumber: 48
          }
        },
        _react2.default.createElement(
          _reactNative.Image,
          {
            source: require('../../images/fathom_colored.png'),
            style: [styles.launchImage, _theme.AppStyles.containerCentered],
            resizeMode: 'contain',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 49
            }
          },
          _react2.default.createElement(_reactNative.ActivityIndicator, {
            animating: true,
            size: 'large',
            color: '#C1C5C8',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 54
            }
          })
        )
      );
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  return AppLaunch;
}(_react.Component);

AppLaunch.componentName = 'AppLaunch';
AppLaunch.propTypes = {
  login: _react.PropTypes.func.isRequired
};
exports.default = AppLaunch;