Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var Spacer = function Spacer(_ref) {
  var size = _ref.size;
  return _react2.default.createElement(_reactNative.View, {
    style: {
      left: 0,
      right: 0,
      height: 1,
      marginTop: size - 1
    }
  });
};

Spacer.propTypes = { size: _react.PropTypes.number };
Spacer.defaultProps = { size: 10 };
Spacer.componentName = 'Spacer';

exports.default = Spacer;