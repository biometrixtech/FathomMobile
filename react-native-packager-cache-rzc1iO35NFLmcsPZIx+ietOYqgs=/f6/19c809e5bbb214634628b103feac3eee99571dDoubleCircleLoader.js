
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/loader/DoubleCircleLoader.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _AnimatedCircle = require('../animated/AnimatedCircle');

var _AnimatedCircle2 = babelHelpers.interopRequireDefault(_AnimatedCircle);

var Surface = _reactNative.ART.Surface;

var DoubleCircleLoader = function (_Component) {
    babelHelpers.inherits(DoubleCircleLoader, _Component);

    function DoubleCircleLoader(props) {
        babelHelpers.classCallCheck(this, DoubleCircleLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (DoubleCircleLoader.__proto__ || Object.getPrototypeOf(DoubleCircleLoader)).call(this, props));

        _this.state = {
            scales: [new _reactNative.Animated.Value(0), new _reactNative.Animated.Value(0)]
        };
        _this._animation = _this._animation.bind(_this);
        _this.timers = [];
        return _this;
    }

    babelHelpers.createClass(DoubleCircleLoader, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                color = _props.color,
                size = _props.size;

            return _react2.default.createElement(
                Surface,
                { width: size, height: size, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 34
                    }
                },
                _react2.default.createElement(_AnimatedCircle2.default, { radius: size, fill: color, opacity: 0.5,
                    scale: this.state.scales[0], x: size / 2, y: size / 2, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 35
                    }
                }),
                _react2.default.createElement(_AnimatedCircle2.default, { radius: size, fill: color, opacity: 0.5,
                    scale: this.state.scales[1], x: size / 2, y: size / 2, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 37
                    }
                })
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.state.scales.forEach(function (item, i) {
                var id = setTimeout(function () {
                    _this2._animation(i);
                }, i * 1000);
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

            _reactNative.Animated.sequence([_reactNative.Animated.timing(this.state.scales[i], { toValue: 1, duration: 1000 }), _reactNative.Animated.timing(this.state.scales[i], { toValue: 0, duration: 1000 })]).start(function () {
                if (!_this3.unmounted) _this3._animation(i);
            });
        }
    }]);
    return DoubleCircleLoader;
}(_react.Component);

DoubleCircleLoader.propTypes = {
    color: _react.PropTypes.string,
    size: _react.PropTypes.number
};
DoubleCircleLoader.defaultProps = {
    color: '#1e90ff',
    size: 30
};
exports.default = DoubleCircleLoader;