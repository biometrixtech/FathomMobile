
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

var CirclesLoader = function (_Component) {
    babelHelpers.inherits(CirclesLoader, _Component);

    function CirclesLoader(props) {
        babelHelpers.classCallCheck(this, CirclesLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (CirclesLoader.__proto__ || Object.getPrototypeOf(CirclesLoader)).call(this, props));

        _this.state = {
            opacities: [new _reactNative.Animated.Value(1), new _reactNative.Animated.Value(1), new _reactNative.Animated.Value(1), new _reactNative.Animated.Value(1), new _reactNative.Animated.Value(1), new _reactNative.Animated.Value(1), new _reactNative.Animated.Value(1), new _reactNative.Animated.Value(1)]
        };
        _this.eachDegree = 360 / _this.state.opacities.length;
        _this.timers = [];
        _this._animation = _this._animation.bind(_this);
        return _this;
    }

    babelHelpers.createClass(CirclesLoader, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                size = _props.size,
                dotRadius = _props.dotRadius,
                color = _props.color;

            return _react2.default.createElement(
                Surface,
                { width: size + dotRadius, height: size + dotRadius },
                this.state.opacities.map(function (item, i) {
                    var radian = i * _this2.eachDegree * Math.PI / 180;
                    var x = Math.round(size / 2 * Math.cos(radian)) + size / 2 + dotRadius / 2;
                    var y = Math.round(size / 2 * Math.sin(radian)) + size / 2 + dotRadius / 2;
                    return _react2.default.createElement(_AnimatedCircle2.default, { key: i, radius: dotRadius, fill: color, x: x, y: y,
                        opacity: _this2.state.opacities[i] });
                })
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this3 = this;

            this.state.opacities.forEach(function (item, i) {
                var id = setTimeout(function () {
                    _this3._animation(i);
                }, i * 150);
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

            _reactNative.Animated.sequence([_reactNative.Animated.timing(this.state.opacities[i], { toValue: 0.1, duration: 600 }), _reactNative.Animated.timing(this.state.opacities[i], { toValue: 1, duration: 600 })]).start(function () {
                if (!_this4.unmounted) _this4._animation(i);
            });
        }
    }]);
    return CirclesLoader;
}(_react.Component);

CirclesLoader.propTypes = {
    color: _react.PropTypes.string,
    dotRadius: _react.PropTypes.number,
    size: _react.PropTypes.number
};
CirclesLoader.defaultProps = {
    color: '#1e90ff',
    dotRadius: 8,
    size: 40
};
exports.default = CirclesLoader;