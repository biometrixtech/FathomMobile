
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/loader/CirclesRotationScaleLoader.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _AnimatedCircle = require('../animated/AnimatedCircle');

var _AnimatedCircle2 = babelHelpers.interopRequireDefault(_AnimatedCircle);

var Surface = _reactNative.ART.Surface,
    Group = _reactNative.ART.Group;

var RotationCircleLoader = function (_Component) {
    babelHelpers.inherits(RotationCircleLoader, _Component);

    function RotationCircleLoader(props) {
        babelHelpers.classCallCheck(this, RotationCircleLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (RotationCircleLoader.__proto__ || Object.getPrototypeOf(RotationCircleLoader)).call(this, props));

        _this.state = {
            degree: new _reactNative.Animated.Value(0),
            scales: [new _reactNative.Animated.Value(0), new _reactNative.Animated.Value(0)]
        };
        _this._animation = _this._animation.bind(_this);
        _this.timers = [];
        return _this;
    }

    babelHelpers.createClass(RotationCircleLoader, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                size = _props.size,
                color = _props.color;

            var degree = this.state.degree.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg']
            });
            return _react2.default.createElement(
                _reactNative.Animated.View,
                { style: { transform: [{ rotate: degree }], backgroundColor: 'rgba(0,0,0,0)' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 39
                    }
                },
                _react2.default.createElement(
                    Surface,
                    { width: size, height: size, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 40
                        }
                    },
                    _react2.default.createElement(
                        Group,
                        {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 41
                            }
                        },
                        _react2.default.createElement(_AnimatedCircle2.default, { fill: color, radius: size / 2, x: size / 2, y: size / 4,
                            scale: this.state.scales[0], __source: {
                                fileName: _jsxFileName,
                                lineNumber: 42
                            }
                        }),
                        _react2.default.createElement(_AnimatedCircle2.default, { fill: color, radius: size / 2, x: size / 2, y: size / 4 * 3,
                            scale: this.state.scales[1], __source: {
                                fileName: _jsxFileName,
                                lineNumber: 44
                            }
                        })
                    )
                )
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this._animation();
            this.state.scales.forEach(function (item, i) {
                var id = setTimeout(function () {
                    _this2._animationCircles(i);
                }, i * 500);
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
        value: function _animation() {
            var _this3 = this;

            _reactNative.Animated.sequence([_reactNative.Animated.timing(this.state.degree, {
                toValue: 360,
                duration: 2000,
                easing: _reactNative.Easing.linear
            })]).start(function () {
                if (!_this3.unmounted) {
                    _this3.state.degree.setValue(0);
                    _this3._animation();
                }
            });
        }
    }, {
        key: '_animationCircles',
        value: function _animationCircles(i) {
            var _this4 = this;

            _reactNative.Animated.sequence([_reactNative.Animated.timing(this.state.scales[i], { toValue: 1, duration: 1000 }), _reactNative.Animated.timing(this.state.scales[i], { toValue: 0.05, duration: 1000 })]).start(function () {
                if (!_this4.unmounted) {
                    _this4._animationCircles(i);
                }
            });
        }
    }]);
    return RotationCircleLoader;
}(_react.Component);

RotationCircleLoader.propTypes = {
    size: _react.PropTypes.number,
    color: _react.PropTypes.string
};
RotationCircleLoader.defaultProps = {
    size: 50,
    color: '#1e90ff'
};
exports.default = RotationCircleLoader;