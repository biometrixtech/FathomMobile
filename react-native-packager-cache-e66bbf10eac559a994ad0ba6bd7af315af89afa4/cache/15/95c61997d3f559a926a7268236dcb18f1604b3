Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/grid/Grid.js';

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _Row = require('./Row');

var _Row2 = babelHelpers.interopRequireDefault(_Row);

var Grid = function (_Component) {
  babelHelpers.inherits(Grid, _Component);

  function Grid() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, Grid);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = Grid.__proto__ || Object.getPrototypeOf(Grid)).call.apply(_ref, [this].concat(args))), _this), _this.styles = _reactNative.StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: _this.isRow() ? 'column' : 'row'
      }
    }), _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(Grid, [{
    key: 'isRow',
    value: function isRow() {
      var isRow = false;
      _react2.default.Children.forEach(this.props.children, function (child) {
        if (child && child.type === _Row2.default) {
          isRow = true;
        }
      });

      return isRow;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          onPress = _props.onPress,
          activeOpacity = _props.activeOpacity,
          containerStyle = _props.containerStyle;


      if (onPress) {
        return _react2.default.createElement(
          _reactNative.TouchableOpacity,
          { activeOpacity: activeOpacity, onPress: onPress, __source: {
              fileName: _jsxFileName,
              lineNumber: 30
            }
          },
          _react2.default.createElement(
            _reactNative.View,
            babelHelpers.extends({
              style: [this.styles.container, containerStyle && containerStyle]
            }, this.props, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 31
              }
            }),
            this.props.children
          )
        );
      }

      return _react2.default.createElement(
        _reactNative.View,
        babelHelpers.extends({
          style: [this.styles.container, containerStyle && containerStyle]
        }, this.props, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 42
          }
        }),
        this.props.children
      );
    }
  }]);
  return Grid;
}(_react.Component);

Grid.propTypes = {
  containerStyle: _propTypes2.default.any,
  onPress: _propTypes2.default.func,
  activeOpacity: _propTypes2.default.number,
  children: _propTypes2.default.any
};

Grid.defaultProps = {
  activeOpacity: 1
};

exports.default = Grid;