
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

var DotsLoader = function (_Component) {
    babelHelpers.inherits(DotsLoader, _Component);

    function DotsLoader(props) {
        babelHelpers.classCallCheck(this, DotsLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (DotsLoader.__proto__ || Object.getPrototypeOf(DotsLoader)).call(this, props));

        _this.state = {
            scales: [new _reactNative.Animated.Value(0), new _reactNative.Animated.Value(0), new _reactNative.Animated.Value(0)]
        };
        _this._animation = _this._animation.bind(_this);
        return _this;
    }

    babelHelpers.createClass(DotsLoader, [{
        key: '_renderCircle',
        value: function _renderCircle(i) {
            var _props = this.props,
                color = _props.color,
                size = _props.size,
                betweenSpace = _props.betweenSpace;

            return _react2.default.createElement(_AnimatedCircle2.default, { radius: size, fill: color, x: size / 2 + i * (size + betweenSpace), y: size / 2,
                scale: this.state.scales[i] });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                size = _props2.size,
                betweenSpace = _props2.betweenSpace;

            return _react2.default.createElement(
                Surface,
                { width: size * 3 + betweenSpace * 2, height: size },
                this._renderCircle(0),
                this._renderCircle(1),
                this._renderCircle(2)
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

            function seq(self, i) {
                return _reactNative.Animated.sequence([_reactNative.Animated.timing(self.state.scales[i], { toValue: 1, duration: 300, delay: (i + 1) * 200 }), _reactNative.Animated.timing(self.state.scales[i], { toValue: 0, duration: 300, delay: 50 })]);
            }

            _reactNative.Animated.parallel([seq(this, 0), seq(this, 1), seq(this, 2)]).start(function () {
                if (!_this2.unmounted) _this2._animation();
            });
        }
    }]);
    return DotsLoader;
}(_react.Component);

DotsLoader.propTypes = {
    color: _react.PropTypes.string,
    size: _react.PropTypes.number,
    betweenSpace: _react.PropTypes.number
};
DotsLoader.defaultProps = {
    color: '#1e90ff',
    size: 10,
    betweenSpace: 5
};
exports.default = DotsLoader;