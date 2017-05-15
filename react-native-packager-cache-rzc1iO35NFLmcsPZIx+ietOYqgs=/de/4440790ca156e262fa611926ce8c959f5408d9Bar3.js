
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/shape/Bar3.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var Shape = _reactNative.ART.Shape,
    Path = _reactNative.ART.Path;

var Bar3 = function (_Component) {
    babelHelpers.inherits(Bar3, _Component);

    function Bar3() {
        babelHelpers.classCallCheck(this, Bar3);
        return babelHelpers.possibleConstructorReturn(this, (Bar3.__proto__ || Object.getPrototypeOf(Bar3)).apply(this, arguments));
    }

    babelHelpers.createClass(Bar3, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                width = _props.width,
                height = _props.height;


            var path = Path().moveTo(width / 2, height / 2).lineTo(-width / 2, height / 2).lineTo(-width / 2, -height / 2).lineTo(width / 2, -height / 2).close();

            return _react2.default.createElement(Shape, babelHelpers.extends({}, this.props, { d: path, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 27
                }
            }));
        }
    }]);
    return Bar3;
}(_react.Component);

Bar3.propTypes = {
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired
};
exports.default = Bar3;