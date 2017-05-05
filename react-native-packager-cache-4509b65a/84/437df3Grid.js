Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _Row = require('./Row');

var _Row2 = babelHelpers.interopRequireDefault(_Row);

var Grid = function (_Component) {
  babelHelpers.inherits(Grid, _Component);

  function Grid() {
    babelHelpers.classCallCheck(this, Grid);
    return babelHelpers.possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).apply(this, arguments));
  }

  babelHelpers.createClass(Grid, [{
    key: 'isRow',
    value: function isRow() {
      var isRow = false;
      _react2.default.Children.forEach(this.props.children, function (child) {
        if (child.type === _Row2.default) {
          isRow = true;
        }
      });

      return isRow;
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var style = this.props.style;


      this.styles = babelHelpers.extends({
        flex: 1,
        flexDirection: this.isRow() ? 'column' : 'row'
      }, style);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          onPress = _props.onPress,
          activeOpacity = _props.activeOpacity;


      if (onPress) {
        return _react2.default.createElement(
          _reactNative.TouchableOpacity,
          { style: { flex: 1 }, activeOpacity: activeOpacity, onPress: onPress },
          _react2.default.createElement(
            _reactNative.View,
            babelHelpers.extends({}, this.styles, this.props),
            this.props.children
          )
        );
      }

      return _react2.default.createElement(
        _reactNative.View,
        babelHelpers.extends({}, this.styles, this.props),
        this.props.children
      );
    }
  }]);
  return Grid;
}(_react.Component);

Grid.propTypes = {
  style: _react.PropTypes.object,
  onPress: _react.PropTypes.func,
  activeOpacity: _react.PropTypes.number
};
Grid.defaultProps = {
  activeOpacity: 1
};
exports.default = Grid;