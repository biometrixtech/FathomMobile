
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

var RotationHoleLoader = function (_Component) {
    babelHelpers.inherits(RotationHoleLoader, _Component);

    function RotationHoleLoader(props) {
        babelHelpers.classCallCheck(this, RotationHoleLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (RotationHoleLoader.__proto__ || Object.getPrototypeOf(RotationHoleLoader)).call(this, props));

        _this.state = {
            degree: new _reactNative.Animated.Value(0)
        };
        _this._animation = _this._animation.bind(_this);
        return _this;
    }

    babelHelpers.createClass(RotationHoleLoader, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                size = _props.size,
                color = _props.color,
                strokeWith = _props.strokeWith;

            var degree = this.state.degree.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg']
            });
            return _react2.default.createElement(
                _reactNative.Animated.View,
                { style: { transform: [{ rotate: degree }], backgroundColor: 'rgba(0,0,0,0)' } },
                _react2.default.createElement(
                    Surface,
                    { width: size + strokeWith * 2, height: size + strokeWith * 2 },
                    _react2.default.createElement(
                        Group,
                        null,
                        _react2.default.createElement(_AnimatedCircle2.default, { stroke: color, opacity: 0.3, strokeWidth: strokeWith, radius: size, x: size / 2 + strokeWith, y: size / 2 + strokeWith }),
                        _react2.default.createElement(_AnimatedCircle2.default, { fill: color, radius: strokeWith, x: size / 2 + strokeWith, y: strokeWith })
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
    return RotationHoleLoader;
}(_react.Component);

RotationHoleLoader.propTypes = {
    size: _react.PropTypes.number,
    color: _react.PropTypes.string,
    strokeWith: _react.PropTypes.number,
    rotationSpeed: _react.PropTypes.number
};
RotationHoleLoader.defaultProps = {
    size: 40,
    color: '#1e90ff',
    rotationSpeed: 800,
    strokeWith: 8
};
exports.default = RotationHoleLoader;