
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var Shape = _reactNative.ART.Shape,
    Path = _reactNative.ART.Path;

var Bar2 = function (_Component) {
    babelHelpers.inherits(Bar2, _Component);

    function Bar2() {
        babelHelpers.classCallCheck(this, Bar2);
        return babelHelpers.possibleConstructorReturn(this, (Bar2.__proto__ || Object.getPrototypeOf(Bar2)).apply(this, arguments));
    }

    babelHelpers.createClass(Bar2, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                width = _props.width,
                height = _props.height;


            var path = Path().moveTo(0, 0).lineTo(0, -height).lineTo(width, -height).lineTo(width, 0).close();

            return _react2.default.createElement(Shape, babelHelpers.extends({}, this.props, { d: path }));
        }
    }]);
    return Bar2;
}(_react.Component);

Bar2.propTypes = {
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired
};
exports.default = Bar2;