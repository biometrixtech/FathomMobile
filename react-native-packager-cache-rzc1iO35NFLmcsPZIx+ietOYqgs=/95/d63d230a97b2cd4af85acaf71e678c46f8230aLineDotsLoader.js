
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/loader/LineDotsLoader.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _AnimatedCircle = require('../animated/AnimatedCircle');

var _AnimatedCircle2 = babelHelpers.interopRequireDefault(_AnimatedCircle);

var Surface = _reactNative.ART.Surface;

var LineDotsLoader = function (_Component) {
    babelHelpers.inherits(LineDotsLoader, _Component);

    function LineDotsLoader(props) {
        babelHelpers.classCallCheck(this, LineDotsLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (LineDotsLoader.__proto__ || Object.getPrototypeOf(LineDotsLoader)).call(this, props));

        _this.screenWidth = _reactNative.Dimensions.get('window').width;
        var _this$props = _this.props,
            size = _this$props.size,
            dotsNumber = _this$props.dotsNumber,
            betweenSpace = _this$props.betweenSpace;

        var midX = _this.screenWidth / 2 + (size * dotsNumber + betweenSpace * (dotsNumber - 1)) / 2 - size / 2;
        var circlesX = [];
        _this.beginX = [];
        _this.centerX = [];
        _this.destX = [];
        for (var i = 0; i < dotsNumber; i++) {
            var beginX = -size / 2 - (size + betweenSpace) * i;
            circlesX.push(new _reactNative.Animated.Value(beginX));
            _this.beginX.push(beginX);
            _this.centerX.push(midX - i * (size + betweenSpace));
            _this.destX.push(_this.screenWidth + size / 2 + i * (size + betweenSpace));
        }

        _this.state = {
            x: circlesX
        };

        _this._animation = _this._animation.bind(_this);
        return _this;
    }

    babelHelpers.createClass(LineDotsLoader, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                color = _props.color,
                size = _props.size;

            return _react2.default.createElement(
                Surface,
                { width: this.screenWidth, height: size, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 53
                    }
                },
                this.state.x.map(function (item, i) {
                    return _react2.default.createElement(_AnimatedCircle2.default, { key: i, radius: size, fill: color, x: item, y: size / 2, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 55
                        }
                    });
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

            this.state.x.forEach(function (item, i) {
                _reactNative.Animated.sequence([_reactNative.Animated.timing(_this2.state.x[i], { toValue: _this2.centerX[i], duration: 600, delay: i * 50 }), _reactNative.Animated.timing(_this2.state.x[i], { toValue: _this2.centerX[i], duration: 600, delay: 300 }), _reactNative.Animated.timing(_this2.state.x[i], { toValue: _this2.destX[i], duration: 600, delay: i * 50 })]).start(function () {
                    if (i === _this2.props.dotsNumber - 1) {
                        for (var index in _this2.state.x) {
                            _this2.state.x[index].setValue(_this2.beginX[index]);
                        }
                        if (!_this2.unmounted) _this2._animation();
                    }
                });
            });
        }
    }]);
    return LineDotsLoader;
}(_react.Component);

LineDotsLoader.propTypes = {
    color: _react.PropTypes.string,
    size: _react.PropTypes.number,
    dotsNumber: _react.PropTypes.number,
    betweenSpace: _react.PropTypes.number
};
LineDotsLoader.defaultProps = {
    color: '#1e90ff',
    size: 10,
    dotsNumber: 5,
    betweenSpace: 5
};
exports.default = LineDotsLoader;