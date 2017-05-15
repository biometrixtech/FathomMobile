
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/loader/MusicLoader.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _Bar = require('../shape/Bar2');

var _Bar2 = babelHelpers.interopRequireDefault(_Bar);

var AnimatedBar = _reactNative.Animated.createAnimatedComponent(_Bar2.default);
var Surface = _reactNative.ART.Surface;

var LinesLoader = function (_Component) {
    babelHelpers.inherits(LinesLoader, _Component);

    function LinesLoader(props) {
        babelHelpers.classCallCheck(this, LinesLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (LinesLoader.__proto__ || Object.getPrototypeOf(LinesLoader)).call(this, props));

        _this.fixedMaxValue = [_this.props.barHeight * 0.8, _this.props.barHeight * 0.4, _this.props.barHeight, _this.props.barHeight * 0.2];
        _this.fixedMinValue = [_this.props.barHeight * 0.3, _this.props.barHeight, _this.props.barHeight * 0.5, _this.props.barHeight * 0.8];

        _this.state = {
            heights: [new _reactNative.Animated.Value(_this.fixedMinValue[0]), new _reactNative.Animated.Value(_this.fixedMinValue[1]), new _reactNative.Animated.Value(_this.fixedMinValue[2]), new _reactNative.Animated.Value(_this.fixedMinValue[3])]
        };
        _this._animation = _this._animation.bind(_this);
        return _this;
    }

    babelHelpers.createClass(LinesLoader, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                color = _props.color,
                betweenSpace = _props.betweenSpace,
                barWidth = _props.barWidth,
                barHeight = _props.barHeight,
                barNumber = _props.barNumber;

            return _react2.default.createElement(
                Surface,
                { width: barWidth * 4 + betweenSpace * 3, height: barHeight, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 57
                    }
                },
                this.state.heights.map(function (item, i) {
                    return _react2.default.createElement(AnimatedBar, { key: i, fill: color, width: barWidth, height: _this2.state.heights[i],
                        x: i * (betweenSpace + barWidth), y: barHeight, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 59
                        }
                    });
                })
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this3 = this;

            this.state.heights.forEach(function (item, i) {
                _this3._animation(i);
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.unmounted = true;
        }
    }, {
        key: '_animation',
        value: function _animation(i) {
            var _this4 = this;

            _reactNative.Animated.sequence([_reactNative.Animated.timing(this.state.heights[i], { toValue: this.fixedMaxValue[i], duration: 500 }), _reactNative.Animated.timing(this.state.heights[i], { toValue: this.fixedMinValue[i], duration: 500 })]).start(function () {
                if (!_this4.unmounted) {
                    _this4._animation(i);
                }
            });
        }
    }]);
    return LinesLoader;
}(_react.Component);

LinesLoader.propTypes = {
    color: _react.PropTypes.string,
    barWidth: _react.PropTypes.number,
    barHeight: _react.PropTypes.number,
    betweenSpace: _react.PropTypes.number
};
LinesLoader.defaultProps = {
    color: '#1e90ff',
    betweenSpace: 5,
    barWidth: 3,
    barHeight: 30
};
exports.default = LinesLoader;