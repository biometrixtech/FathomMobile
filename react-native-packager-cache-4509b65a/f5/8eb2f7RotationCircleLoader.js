
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
            degree: new _reactNative.Animated.Value(0)
        };
        _this._animation = _this._animation.bind(_this);
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
                { style: { transform: [{ rotate: degree }], backgroundColor: 'rgba(0,0,0,0)' } },
                _react2.default.createElement(
                    Surface,
                    { width: size, height: size },
                    _react2.default.createElement(
                        Group,
                        null,
                        _react2.default.createElement(_AnimatedCircle2.default, { fill: color, radius: size, x: size / 2, y: size / 2 }),
                        _react2.default.createElement(_AnimatedCircle2.default, { fill: '#fff', radius: size / 4, x: size / 2, y: size / 8 })
                    )
                )
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._animation();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.unmounted = true;
        }
    }, {
        key: '_animation',
        value: function _animation() {
            var _this2 = this;

            _reactNative.Animated.sequence([_reactNative.Animated.timing(this.state.degree, { toValue: 360, duration: this.props.rotationSpeed, easing: _reactNative.Easing.linear })]).start(function () {
                if (!_this2.unmounted) {
                    _this2.state.degree.setValue(0);
                    _this2._animation();
                }
            });
        }
    }]);
    return RotationCircleLoader;
}(_react.Component);

RotationCircleLoader.propTypes = {
    size: _react.PropTypes.number,
    color: _react.PropTypes.string,
    rotationSpeed: _react.PropTypes.number
};
RotationCircleLoader.defaultProps = {
    size: 40,
    color: '#1e90ff',
    rotationSpeed: 800
};
exports.default = RotationCircleLoader;