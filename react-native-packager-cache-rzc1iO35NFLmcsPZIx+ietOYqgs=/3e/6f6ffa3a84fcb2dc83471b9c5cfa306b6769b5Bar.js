
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/shape/Bar.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var Shape = _reactNative.ART.Shape,
    Path = _reactNative.ART.Path;

var Bar = function (_Component) {
    babelHelpers.inherits(Bar, _Component);

    function Bar() {
        babelHelpers.classCallCheck(this, Bar);
        return babelHelpers.possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).apply(this, arguments));
    }

    babelHelpers.createClass(Bar, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                width = _props.width,
                height = _props.height;


            var path = Path().moveTo(width, height / 2).lineTo(0, height / 2).lineTo(0, -height / 2).lineTo(width, -height / 2).close();

            return _react2.default.createElement(Shape, babelHelpers.extends({}, this.props, { d: path, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 27
                }
            }));
        }
    }]);
    return Bar;
}(_react.Component);

Bar.propTypes = {
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired
};
exports.default = Bar;