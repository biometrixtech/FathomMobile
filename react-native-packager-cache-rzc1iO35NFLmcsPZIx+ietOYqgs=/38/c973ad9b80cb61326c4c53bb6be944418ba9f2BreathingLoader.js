
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/loader/BreathingLoader.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _AnimatedCircle = require('../animated/AnimatedCircle');

var _AnimatedCircle2 = babelHelpers.interopRequireDefault(_AnimatedCircle);

var Surface = _reactNative.ART.Surface;

var BreathingLoader = function (_Component) {
    babelHelpers.inherits(BreathingLoader, _Component);

    function BreathingLoader(props) {
        babelHelpers.classCallCheck(this, BreathingLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (BreathingLoader.__proto__ || Object.getPrototypeOf(BreathingLoader)).call(this, props));

        _this.state = {
            scale: new _reactNative.Animated.Value(0.1)
        };
        _this._animation = _this._animation.bind(_this);
        return _this;
    }

    babelHelpers.createClass(BreathingLoader, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                color = _props.color,
                size = _props.size,
                strokeWidth = _props.strokeWidth;

            return _react2.default.createElement(
                Surface,
                { width: size + strokeWidth, height: size + strokeWidth, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 38
                    }
                },
                _react2.default.createElement(_AnimatedCircle2.default, { radius: size, stroke: color, strokeWidth: strokeWidth, scale: this.state.scale,
                    x: (size + strokeWidth) / 2, y: (size + strokeWidth) / 2, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 39
                    }
                })
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

            _reactNative.Animated.sequence([_reactNative.Animated.timing(this.state.scale, { toValue: 1, duration: this.props.frequency }), _reactNative.Animated.timing(this.state.scale, { toValue: 0.1, duration: this.props.frequency })]).start(function () {
                if (!_this2.unmounted) _this2._animation();
            });
        }
    }]);
    return BreathingLoader;
}(_react.Component);

BreathingLoader.propTypes = {
    color: _react.PropTypes.string,
    size: _react.PropTypes.number,
    strokeWidth: _react.PropTypes.number,
    frequency: _react.PropTypes.number
};
BreathingLoader.defaultProps = {
    color: '#1e90ff',
    size: 30,
    strokeWidth: 3,
    frequency: 800
};
exports.default = BreathingLoader;