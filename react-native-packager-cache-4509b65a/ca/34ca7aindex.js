'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
                { key: section.key, style: [_style2.default.sectionStyle, this.props.sectionStyle] },
                _react2.default.createElement(
                    _reactNative.Text,
                    { style: [_style2.default.sectionTextStyle, this.props.sectionTextStyle] },
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
                    } },
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [_style2.default.optionStyle, this.props.optionStyle] },
                    _react2.default.createElement(
                        _reactNative.Text,
                        { style: [_style2.default.optionTextStyle, this.props.optionTextStyle] },
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
                { style: [_style2.default.overlayStyle, this.props.overlayStyle], key: 'modalPicker' + componentIndex++ },
                _react2.default.createElement(
                    _reactNative.View,
                    { style: _style2.default.optionContainer },
                    _react2.default.createElement(
                        _reactNative.ScrollView,
                        { keyboardShouldPersistTaps: true },
                        _react2.default.createElement(
                            _reactNative.View,
                            { style: { paddingHorizontal: 10 } },
                            options
                        )
                    )
                ),
                _react2.default.createElement(
                    _reactNative.View,
                    { style: _style2.default.cancelContainer },
                    _react2.default.createElement(
                        _reactNative.TouchableOpacity,
                        { onPress: this.close },
                        _react2.default.createElement(
                            _reactNative.View,
                            { style: [_style2.default.cancelStyle, this.props.cancelStyle] },
                            _react2.default.createElement(
                                _reactNative.Text,
                                { style: [_style2.default.cancelTextStyle, this.props.cancelTextStyle] },
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
                { style: [_style2.default.selectStyle, this.props.selectStyle] },
                _react2.default.createElement(
                    _reactNative.Text,
                    { style: [_style2.default.selectTextStyle, this.props.selectTextStyle] },
                    this.state.selected
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {

            var dp = _react2.default.createElement(
                _reactNative.Modal,
                { transparent: true, ref: 'modal', visible: this.state.modalVisible, onRequestClose: this.close, animationType: this.state.animationType },
                this.renderOptionList()
            );

            return _react2.default.createElement(
                _reactNative.View,
                { style: this.props.style },
                dp,
                _react2.default.createElement(
                    _reactNative.TouchableOpacity,
                    { onPress: this.open },
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