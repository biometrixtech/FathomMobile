
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/shape/Circle.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var Shape = _reactNative.ART.Shape,
    Path = _reactNative.ART.Path;

var Circle = function (_Component) {
    babelHelpers.inherits(Circle, _Component);

    function Circle() {
        babelHelpers.classCallCheck(this, Circle);
        return babelHelpers.possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).apply(this, arguments));
    }

    babelHelpers.createClass(Circle, [{
        key: 'render',
        value: function render() {
            var radius = this.props.radius;


            var path = Path().moveTo(0, -radius / 2).arc(0, radius, 1).arc(0, -radius, 1).close();

            return _react2.default.createElement(Shape, babelHelpers.extends({}, this.props, { d: path, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 25
                }
            }));
        }
    }]);
    return Circle;
}(_react.Component);

Circle.propTypes = {
    radius: _react.PropTypes.number.isRequired,
    opacity: _react.PropTypes.number
};
exports.default = Circle;