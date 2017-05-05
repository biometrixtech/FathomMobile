
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _AnimatedCircle = require('../animated/AnimatedCircle');

var _AnimatedCircle2 = babelHelpers.interopRequireDefault(_AnimatedCircle);

var Surface = _reactNative.ART.Surface;

var RippleLoader = function (_Component) {
    babelHelpers.inherits(RippleLoader, _Component);

    function RippleLoader(props) {
        babelHelpers.classCallCheck(this, RippleLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (RippleLoader.__proto__ || Object.getPrototypeOf(RippleLoader)).call(this, props));

        _this.state = {
            scales: [new _reactNative.Animated.Value(0.1), new _reactNative.Animated.Value(0.1)],
            opacities: [new _reactNative.Animated.Value(1), new _reactNative.Animated.Value(1)]
        };
        _this.timers = [];
        _this._animation = _this._animation.bind(_this);
        return _this;
    }

    babelHelpers.createClass(RippleLoader, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                color = _props.color,
                size = _props.size,
                strokeWidth = _props.strokeWidth;

            return _react2.default.createElement(
                Surface,
                { width: size + strokeWidth, height: size + strokeWidth },
                this.state.scales.map(function (item, i) {
                    return _react2.default.createElement(_AnimatedCircle2.default, {
                        key: i,
                        radius: size,
                        stroke: color,
                        strokeWidth: strokeWidth,
                        scale: _this2.state.scales[i],
                        opacity: _this2.state.opacities[i],
                        x: (size + strokeWidth) / 2,
                        y: (size + strokeWidth) / 2 });
                })
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this3 = this;

            this.state.scales.forEach(function (item, i) {
                var id = setTimeout(function () {
                    _this3._animation(i);
                }, i * 1200);
                _this3.timers.push(id);
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
            var _this4 = this;

            _reactNative.Animated.parallel([_reactNative.Animated.timing(this.state.scales[i], { toValue: 1, duration: 1600 }), _reactNative.Animated.timing(this.state.opacities[i], { toValue: 0, duration: 1600, delay: 800 })]).start(function () {
                if (!_this4.unmounted) {
                    _this4.state.scales[i].setValue(0.1);
                    _this4.state.opacities[i].setValue(1);
                    _this4._animation(i);
                }
            });
        }
    }]);
    return RippleLoader;
}(_react.Component);

RippleLoader.propTypes = {
    color: _react.PropTypes.string,
    size: _react.PropTypes.number,
    strokeWidth: _react.PropTypes.number
};
RippleLoader.defaultProps = {
    color: '#1e90ff',
    size: 40,
    strokeWidth: 3
};
exports.default = RippleLoader;