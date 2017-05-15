
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/loader/PulseLoader.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _AnimatedCircle = require('../animated/AnimatedCircle');

var _AnimatedCircle2 = babelHelpers.interopRequireDefault(_AnimatedCircle);

var Surface = _reactNative.ART.Surface;

var PulseLoader = function (_Component) {
    babelHelpers.inherits(PulseLoader, _Component);

    function PulseLoader(props) {
        babelHelpers.classCallCheck(this, PulseLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (PulseLoader.__proto__ || Object.getPrototypeOf(PulseLoader)).call(this, props));

        _this.state = {
            effect: new _reactNative.Animated.ValueXY({ x: 0, y: 1 })
        };
        _this._animation = _this._animation.bind(_this);
        return _this;
    }

    babelHelpers.createClass(PulseLoader, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                color = _props.color,
                size = _props.size;

            return _react2.default.createElement(
                Surface,
                { width: size, height: size, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 36
                    }
                },
                _react2.default.createElement(_AnimatedCircle2.default, { radius: size, fill: color, scale: this.state.effect.x, opacity: this.state.effect.y, x: size / 2, y: size / 2, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 37
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

            _reactNative.Animated.parallel([_reactNative.Animated.timing(this.state.effect.x, { toValue: 1, duration: this.props.frequency }), _reactNative.Animated.timing(this.state.effect.y, { toValue: 0.05, duration: this.props.frequency })]).start(function () {
                if (!_this2.unmounted) {
                    _this2.state.effect.setValue({ x: 0, y: 1 });
                    _this2._animation();
                }
            });
        }
    }]);
    return PulseLoader;
}(_react.Component);

PulseLoader.propTypes = {
    color: _react.PropTypes.string,
    size: _react.PropTypes.number,
    frequency: _react.PropTypes.number
};
PulseLoader.defaultProps = {
    color: '#1e90ff',
    size: 30,
    frequency: 1000
};
exports.default = PulseLoader;