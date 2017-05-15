'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-modal-picker/index.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _style = require('./style');

var _style2 = babelHelpers.interopRequireDefault(_style);

var _BaseComponent2 = require('./BaseComponent');

var _BaseComponent3 = babelHelpers.interopRequireDefault(_BaseComponent2);

var componentIndex = 0;

var propTypes = {
    data: _react.PropTypes.array,
    onChange: _react.PropTypes.func,
    initValue: _react.PropTypes.string,
    style: _reactNative.View.propTypes.style,
    selectStyle: _reactNative.View.propTypes.style,
    optionStyle: _reactNative.View.propTypes.style,
    optionTextStyle: _reactNative.Text.propTypes.style,
    sectionStyle: _reactNative.View.propTypes.style,
    sectionTextStyle: _reactNative.Text.propTypes.style,
    cancelStyle: _reactNative.View.propTypes.style,
    cancelTextStyle: _reactNative.Text.propTypes.style,
    overlayStyle: _reactNative.View.propTypes.style,
    cancelText: _react.PropTypes.string
};

var defaultProps = {
    data: [],
    onChange: function onChange() {},
    initValue: 'Select me!',
    style: {},
    selectStyle: {},
    optionStyle: {},
    optionTextStyle: {},
    sectionStyle: {},
    sectionTextStyle: {},
    cancelStyle: {},
    cancelTextStyle: {},
    overlayStyle: {},
    cancelText: 'cancel'
};

var ModalPicker = function (_BaseComponent) {
    babelHelpers.inherits(ModalPicker, _BaseComponent);

    function ModalPicker() {
        babelHelpers.classCallCheck(this, ModalPicker);

        var _this = babelHelpers.possibleConstructorReturn(this, (ModalPicker.__proto__ || Object.getPrototypeOf(ModalPicker)).call(this));

        _this._bind('onChange', 'open', 'close', 'renderChildren');

        _this.state = {
            animationType: 'slide',
            modalVisible: false,
            transparent: false,
            selected: 'please select'
        };
        return _this;
    }

    babelHelpers.createClass(ModalPicker, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setState({ selected: this.props.initValue });
            this.setState({ cancelText: this.props.cancelText });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.initValue != this.props.initValue) {
                this.setState({ selected: nextProps.initValue });
            }
        }
    }, {
        key: 'onChange',
        value: function onChange(item) {
            this.props.onChange(item);
            this.setState({ selected: item.label });
            this.close();
        }
    }, {
        key: 'close',
        value: function close() {
            this.setState({
                modalVisible: false
            });
        }
    }, {
        key: 'open',
        value: function open() {
            this.setState({
                modalVisible: true
            });
        }
    }, {
        key: 'renderSection',
        value: function renderSection(section) {
            return _react2.default.createElement(
                _reactNative.View,
                { key: section.key, style: [_style2.default.sectionStyle, this.props.sectionStyle], __source: {
                        fileName: _jsxFileName,
                        lineNumber: 107
                    }
                },
                _react2.default.createElement(
                    _reactNative.Text,
                    { style: [_style2.default.sectionTextStyle, this.props.sectionTextStyle], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 108
                        }
                    },
                    section.label
                )
            );
        }
    }, {
        key: 'renderOption',
        value: function renderOption(option) {
            var _this2 = this;

            return _react2.default.createElement(
                _reactNative.TouchableOpacity,
                { key: option.key, onPress: function onPress() {
                        return _this2.onChange(option);
                    }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 115
                    }
                },
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [_style2.default.optionStyle, this.props.optionStyle], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 116
                        }
                    },
                    _react2.default.createElement(
                        _reactNative.Text,
                        { style: [_style2.default.optionTextStyle, this.props.optionTextStyle], __source: {
                                fileName: _jsxFileName,
                                lineNumber: 117
                            }
                        },
                        option.label
                    )
                )
            );
        }
    }, {
        key: 'renderOptionList',
        value: function renderOptionList() {
            var _this3 = this;

            var options = this.props.data.map(function (item) {
                if (item.section) {
                    return _this3.renderSection(item);
                } else {
                    return _this3.renderOption(item);
                }
            });

            return _react2.default.createElement(
                _reactNative.View,
                { style: [_style2.default.overlayStyle, this.props.overlayStyle], key: 'modalPicker' + componentIndex++, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 132
                    }
                },
                _react2.default.createElement(
                    _reactNative.View,
                    { style: _style2.default.optionContainer, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 133
                        }
                    },
                    _react2.default.createElement(
                        _reactNative.ScrollView,
                        { keyboardShouldPersistTaps: true, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 134
                            }
                        },
                        _react2.default.createElement(
                            _reactNative.View,
                            { style: { paddingHorizontal: 10 }, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 135
                                }
                            },
                            options
                        )
                    )
                ),
                _react2.default.createElement(
                    _reactNative.View,
                    { style: _style2.default.cancelContainer, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 140
                        }
                    },
                    _react2.default.createElement(
                        _reactNative.TouchableOpacity,
                        { onPress: this.close, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 141
                            }
                        },
                        _react2.default.createElement(
                            _reactNative.View,
                            { style: [_style2.default.cancelStyle, this.props.cancelStyle], __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 142
                                }
                            },
                            _react2.default.createElement(
                                _reactNative.Text,
                                { style: [_style2.default.cancelTextStyle, this.props.cancelTextStyle], __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 143
                                    }
                                },
                                this.props.cancelText
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: 'renderChildren',
        value: function renderChildren() {

            if (this.props.children) {
                return this.props.children;
            }
            return _react2.default.createElement(
                _reactNative.View,
                { style: [_style2.default.selectStyle, this.props.selectStyle], __source: {
                        fileName: _jsxFileName,
                        lineNumber: 157
                    }
                },
                _react2.default.createElement(
                    _reactNative.Text,
                    { style: [_style2.default.selectTextStyle, this.props.selectTextStyle], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 158
                        }
                    },
                    this.state.selected
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {

            var dp = _react2.default.createElement(
                _reactNative.Modal,
                { transparent: true, ref: 'modal', visible: this.state.modalVisible, onRequestClose: this.close, animationType: this.state.animationType, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 166
                    }
                },
                this.renderOptionList()
            );

            return _react2.default.createElement(
                _reactNative.View,
                { style: this.props.style, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 172
                    }
                },
                dp,
                _react2.default.createElement(
                    _reactNative.TouchableOpacity,
                    { onPress: this.open, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 174
                        }
                    },
                    this.renderChildren()
                )
            );
        }
    }]);
    return ModalPicker;
}(_BaseComponent3.default);

exports.default = ModalPicker;


ModalPicker.propTypes = propTypes;
ModalPicker.defaultProps = defaultProps;