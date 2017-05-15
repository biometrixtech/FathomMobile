
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/loader/NineCubesLoader.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _Bar = require('../shape/Bar3');

var _Bar2 = babelHelpers.interopRequireDefault(_Bar);

var Surface = _reactNative.ART.Surface;

var AnimatedBar = _reactNative.Animated.createAnimatedComponent(_Bar2.default);

var NineCubesLoader = function (_Component) {
    babelHelpers.inherits(NineCubesLoader, _Component);

    function NineCubesLoader(props) {
        babelHelpers.classCallCheck(this, NineCubesLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (NineCubesLoader.__proto__ || Object.getPrototypeOf(NineCubesLoader)).call(this, props));

        _this.state = {
            scales: [new _reactNative.Animated.Value(0), new _reactNative.Animated.Value(0), new _reactNative.Animated.Value(0), new _reactNative.Animated.Value(0), new _reactNative.Animated.Value(0)]
        };
        _this._animation = _this._animation.bind(_this);
        return _this;
    }

    babelHelpers.createClass(NineCubesLoader, [{
        key: '_renderCube',
        value: function _renderCube(i, j, scaleID) {
            var _props = this.props,
                size = _props.size,
                color = _props.color;

            return _react2.default.createElement(AnimatedBar, {
                fill: color,
                width: size,
                height: size,
                x: size / 2 * (i * 2 + 1),
                y: size / 2 * (j * 2 + 1),
                scale: this.state.scales[scaleID],
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 40
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                size = _props2.size,
                color = _props2.color;

            return _react2.default.createElement(
                Surface,
                { width: size * 3, height: size * 3, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 54
                    }
                },
                this._renderCube(0, 0, 2),
                this._renderCube(0, 1, 1),
                this._renderCube(0, 2, 0),
                this._renderCube(1, 0, 3),
                this._renderCube(1, 1, 2),
                this._renderCube(1, 2, 1),
                this._renderCube(2, 0, 4),
                this._renderCube(2, 1, 3),
                this._renderCube(2, 2, 2)
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
                return _reactNative.Animated.sequence([_reactNative.Animated.timing(self.state.scales[i], { toValue: 1, duration: 300, delay: (i + 1) * 100 }), _reactNative.Animated.timing(self.state.scales[i], { toValue: 0, duration: 300, delay: 200 })]);
            }

            _reactNative.Animated.parallel([seq(this, 0), seq(this, 1), seq(this, 2), seq(this, 3), seq(this, 4)]).start(function () {
                if (!_this2.unmounted) _this2._animation();
            });
        }
    }]);
    return NineCubesLoader;
}(_react.Component);

NineCubesLoader.propTypes = {
    size: _react.PropTypes.number,
    color: _react.PropTypes.string
};
NineCubesLoader.defaultProps = {
    size: 20,
    color: '#1e90ff'
};
exports.default = NineCubesLoader;