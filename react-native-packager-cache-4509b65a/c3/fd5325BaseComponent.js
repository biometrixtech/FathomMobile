'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var BaseComponent = function (_React$Component) {
    babelHelpers.inherits(BaseComponent, _React$Component);

    function BaseComponent() {
        babelHelpers.classCallCheck(this, BaseComponent);
        return babelHelpers.possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).apply(this, arguments));
    }

    babelHelpers.createClass(BaseComponent, [{
        key: '_bind',
        value: function _bind() {
            var _this2 = this;

            for (var _len = arguments.length, methods = Array(_len), _key = 0; _key < _len; _key++) {
                methods[_key] = arguments[_key];
            }

            methods.forEach(function (method) {
                return _this2[method] = _this2[method].bind(_this2);
            });
        }
    }]);
    return BaseComponent;
}(_react2.default.Component);

exports.default = BaseComponent;