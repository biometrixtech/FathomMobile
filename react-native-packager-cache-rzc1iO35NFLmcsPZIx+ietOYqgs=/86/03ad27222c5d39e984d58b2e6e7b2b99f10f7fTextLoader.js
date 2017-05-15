
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-indicator/lib/loader/TextLoader.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var TextLoader = function (_Component) {
    babelHelpers.inherits(TextLoader, _Component);

    function TextLoader(props) {
        babelHelpers.classCallCheck(this, TextLoader);

        var _this = babelHelpers.possibleConstructorReturn(this, (TextLoader.__proto__ || Object.getPrototypeOf(TextLoader)).call(this, props));

        _this.state = {
            opacities: [0, 0, 0]
        };
        _this._animation = _this._animation.bind(_this);
        _this.patterns = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1]];
        _this.timers = [];
        return _this;
    }

    babelHelpers.createClass(TextLoader, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                text = _props.text,
                textStyle = _props.textStyle;

            return _react2.default.createElement(
                _reactNative.View,
                { style: { flexDirection: 'row' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 32
                    }
                },
                _react2.default.createElement(
                    _reactNative.Text,
                    { style: textStyle, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 33
                        }
                    },
                    text
                ),
                this.state.opacities.map(function (item, i) {
                    return _react2.default.createElement(
                        _reactNative.Text,
                        { key: i, style: [{ opacity: item }, textStyle], __source: {
                                fileName: _jsxFileName,
                                lineNumber: 35
                            }
                        },
                        '.'
                    );
                })
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._animation(1);
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
        value: function _animation(index) {
            var _this2 = this;

            if (!this.unmounted) {
                var id = setTimeout(function () {
                    _this2.setState({ opacities: _this2.patterns[index] });
                    index++;
                    if (index >= _this2.patterns.length) index = 0;
                    _this2._animation(index);
                }, 500);
                this.timers.push(id);
            }
        }
    }]);
    return TextLoader;
}(_react.Component);

TextLoader.propTypes = {
    text: _react.PropTypes.string,
    textStyle: _reactNative.Text.propTypes.style
};
TextLoader.defaultProps = {
    text: 'Loading'
};
exports.default = TextLoader;