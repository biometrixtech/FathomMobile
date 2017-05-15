
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/loader/EatBeanLoader.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _AnimatedCircle = require('../animated/AnimatedCircle');

var _AnimatedCircle2 = babelHelpers.interopRequireDefault(_AnimatedCircle);

var Surface = _reactNative.ART.Surface,
    Shape = _reactNative.ART.Shape,
    Path = _reactNative.ART.Path;

var EatBeanLoader = function (_Component) {
    babelHelpers.inherits(EatBeanLoader, _Component);

    function EatBeanLoader(props) {
        babelHelpers.classCallCheck(this, EatBeanLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (EatBeanLoader.__proto__ || Object.getPrototypeOf(EatBeanLoader)).call(this, props));

        _this.state = {
            dotsY: [new _reactNative.Animated.Value(_this.props.size * 2.2), new _reactNative.Animated.Value(_this.props.size * 2.2), new _reactNative.Animated.Value(_this.props.size * 2.2), new _reactNative.Animated.Value(_this.props.size * 2.2)]
        };
        _this._animation = _this._animation.bind(_this);
        _this.timers = [];
        return _this;
    }

    babelHelpers.createClass(EatBeanLoader, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                size = _props.size,
                color = _props.color;


            var sinValue = Math.sqrt(2) / 2;
            var x = Math.floor(size / 2 * sinValue) + size / 2;
            var startY = Math.floor(size / 2 * sinValue) + size / 2;
            var endY = size / 2 - Math.floor(size / 2 * sinValue);
            var d = 'M' + x + ' ' + startY + ' A ' + size / 2 + ' ' + size / 2 + ', 0, 1, 1, ' + x + ' ' + endY + ' L ' + size / 2 + ' ' + size / 2 + ' Z';
            return _react2.default.createElement(
                Surface,
                { width: size * 2, height: size, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 45
                    }
                },
                _react2.default.createElement(Shape, { d: d, fill: color, x: size / 5, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 46
                    }
                }),
                this.state.dotsY.map(function (item, i) {
                    return _react2.default.createElement(_AnimatedCircle2.default, { key: i, radius: size / 5, fill: color, x: item, y: size / 2, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 48
                        }
                    });
                })
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.state.dotsY.forEach(function (item, i) {
                var id = setTimeout(function () {
                    _this2._animation(i);
                }, i * 300);
                _this2.timers.push(id);
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.unmounted = true;
            this.timers.forEach(function (id) {
                clearTimeout(id);
            });
        }
    }, {
        key: '_animation',
        value: function _animation(i) {
            var _this3 = this;

            _reactNative.Animated.timing(this.state.dotsY[i], { toValue: this.props.size / 2, duration: 1200 }).start(function () {
                if (!_this3.unmounted) {
                    _this3.state.dotsY[i].setValue(_this3.props.size * 2.2);
                    _this3._animation(i);
                }
            });
        }
    }]);
    return EatBeanLoader;
}(_react.Component);

EatBeanLoader.propTypes = {
    size: _react.PropTypes.number,
    color: _react.PropTypes.string
};
EatBeanLoader.defaultProps = {
    size: 30,
    color: '#1e90ff'
};
exports.default = EatBeanLoader;