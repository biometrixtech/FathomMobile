
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _AnimatedBar = require('../animated/AnimatedBar');

var _AnimatedBar2 = babelHelpers.interopRequireDefault(_AnimatedBar);

var Surface = _reactNative.ART.Surface;

var LinesLoader = function (_Component) {
    babelHelpers.inherits(LinesLoader, _Component);

    function LinesLoader(props) {
        babelHelpers.classCallCheck(this, LinesLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (LinesLoader.__proto__ || Object.getPrototypeOf(LinesLoader)).call(this, props));

        var heights = [];
        for (var i = 0; i < _this.props.barNumber; i++) {
            heights.push(new _reactNative.Animated.Value(_this.props.barHeight / 3));
        }

        _this.state = {
            heights: heights
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
                { width: barWidth * barNumber + betweenSpace * (barNumber - 1), height: barHeight },
                this.state.heights.map(function (item, i) {
                    return _react2.default.createElement(_AnimatedBar2.default, { key: i, fill: color, width: barWidth, height: _this2.state.heights[i],
                        x: i * (betweenSpace + barWidth), y: barHeight / 2 });
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
            var _this3 = this;

            function seq(self, i) {
                return _reactNative.Animated.sequence([_reactNative.Animated.timing(self.state.heights[i], { toValue: self.props.barHeight, duration: 400, delay: i * 200 }), _reactNative.Animated.timing(self.state.heights[i], { toValue: self.props.barHeight / 3, duration: 400 })]);
            }
            var anim = [];
            for (var i = 0; i < this.props.barNumber; i++) {
                anim.push(seq(this, i));
            }_reactNative.Animated.parallel(anim).start(function () {
                if (!_this3.unmounted) {
                    _this3._animation();
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
    betweenSpace: _react.PropTypes.number,
    barNumber: _react.PropTypes.number
};
LinesLoader.defaultProps = {
    color: '#1e90ff',
    betweenSpace: 2,
    barNumber: 5,
    barWidth: 5,
    barHeight: 40
};
exports.default = LinesLoader;