
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

var ColorDotsLoader = function (_Component) {
    babelHelpers.inherits(ColorDotsLoader, _Component);

    function ColorDotsLoader(props) {
        babelHelpers.classCallCheck(this, ColorDotsLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (ColorDotsLoader.__proto__ || Object.getPrototypeOf(ColorDotsLoader)).call(this, props));

        var red = _this.props.color1;
        var yellow = _this.props.color2;
        var green = _this.props.color3;
        _this.state = {
            colors: [red, red, red],
            color: yellow,
            x: new _reactNative.Animated.Value(-_this.props.size / 2)
        };
        _this.patterns = [[yellow, red, red], [yellow, yellow, red], [yellow, yellow, yellow], [green, yellow, yellow], [green, green, yellow], [green, green, green], [red, green, green], [red, red, green], [red, red, red]];
        _this._animation = _this._animation.bind(_this);
        _this.timers = [];
        return _this;
    }

    babelHelpers.createClass(ColorDotsLoader, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                size = _props.size,
                betweenSpace = _props.betweenSpace;

            return _react2.default.createElement(
                Surface,
                { width: size * 3 + betweenSpace * 2, height: size },
                _react2.default.createElement(
                    Group,
                    null,
                    this.state.colors.map(function (item, i) {
                        return _react2.default.createElement(_AnimatedCircle2.default, { key: i, fill: item, radius: size, x: size / 2 + i * (size + betweenSpace),
                            y: size / 2 });
                    }),
                    _react2.default.createElement(_AnimatedCircle2.default, { fill: this.state.color, radius: size, x: this.state.x, y: size / 2 })
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
            this.timers.forEach(function (id) {
                clearTimeout(id);
            });
        }
    }, {
        key: '_animation',
        value: function _animation() {
            var _this2 = this;

            var _props2 = this.props,
                size = _props2.size,
                betweenSpace = _props2.betweenSpace,
                color1 = _props2.color1,
                color2 = _props2.color2,
                color3 = _props2.color3;

            var id1 = setTimeout(function () {
                _this2.setState({ color: color3 });
            }, 600);
            var id2 = setTimeout(function () {
                _this2.setState({ color: color1 });
            }, 1200);
            this.timers.push(id1);
            this.timers.push(id2);
            this.patterns.forEach(function (item, i) {
                var id = setTimeout(function () {
                    _this2.setState({ colors: _this2.patterns[i] });
                }, i * 200 + 100);
                _this2.timers.push(id);
            });

            _reactNative.Animated.sequence([_reactNative.Animated.timing(this.state.x, {
                toValue: size * 3 + betweenSpace * 2 + size / 2,
                duration: 600,
                easing: _reactNative.Easing.linear }), _reactNative.Animated.timing(this.state.x, {
                toValue: -size / 2,
                duration: 0 }), _reactNative.Animated.timing(this.state.x, {
                toValue: size * 3 + betweenSpace * 2 + size / 2,
                duration: 600,
                easing: _reactNative.Easing.linear }), _reactNative.Animated.timing(this.state.x, {
                toValue: -size / 2,
                duration: 0 }), _reactNative.Animated.timing(this.state.x, {
                toValue: size * 3 + betweenSpace * 2 + size / 2,
                duration: 600,
                easing: _reactNative.Easing.linear })]).start(function () {
                if (!_this2.unmounted) {
                    _this2.state.x.setValue(-size / 2);
                    _this2.setState({ color: color2 });
                    _this2._animation();
                }
            });
        }
    }]);
    return ColorDotsLoader;
}(_react.Component);

ColorDotsLoader.propTypes = {
    size: _react.PropTypes.number,
    betweenSpace: _react.PropTypes.number,
    color1: _react.PropTypes.string,
    color2: _react.PropTypes.string,
    color3: _react.PropTypes.string
};
ColorDotsLoader.defaultProps = {
    size: 15,
    betweenSpace: 7,
    color1: '#ff4500',
    color2: '#ffd700',
    color3: '#9acd32'
};
exports.default = ColorDotsLoader;