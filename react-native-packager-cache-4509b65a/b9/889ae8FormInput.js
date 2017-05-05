Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var styles = {};

var FormInput = function (_Component) {
  babelHelpers.inherits(FormInput, _Component);

  function FormInput() {
    babelHelpers.classCallCheck(this, FormInput);
    return babelHelpers.possibleConstructorReturn(this, (FormInput.__proto__ || Object.getPrototypeOf(FormInput)).apply(this, arguments));
  }

  babelHelpers.createClass(FormInput, [{
    key: 'focus',
    value: function focus() {
      var ref = this.props.textInputRef;
      this.refs[ref].focus();
    }
  }, {
    key: 'blur',
    value: function blur() {
      var ref = this.props.textInputRef;
      this.refs[ref].blur();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          containerStyle = _props.containerStyle,
          inputStyle = _props.inputStyle,
          value = _props.value,
          autoCapitalize = _props.autoCapitalize,
          autoCorrect = _props.autoCorrect,
          autoFocus = _props.autoFocus,
          blurOnSubmit = _props.blurOnSubmit,
          defaultValue = _props.defaultValue,
          editable = _props.editable,
          keyboardType = _props.keyboardType,
          maxLength = _props.maxLength,
          multiline = _props.multiline,
          onBlur = _props.onBlur,
          onChange = _props.onChange,
          onChangeText = _props.onChangeText,
          onContentSizeChange = _props.onContentSizeChange,
          onEndEditing = _props.onEndEditing,
          onFocus = _props.onFocus,
          onLayout = _props.onLayout,
          onSelectionChange = _props.onSelectionChange,
          onSubmitEditing = _props.onSubmitEditing,
          placeholder = _props.placeholder,
          placeholderTextColor = _props.placeholderTextColor,
          returnKeyType = _props.returnKeyType,
          secureTextEntry = _props.secureTextEntry,
          selectTextOnFocus = _props.selectTextOnFocus,
          selectionColor = _props.selectionColor,
          inlineImageLeft = _props.inlineImageLeft,
          inlineImagePadding = _props.inlineImagePadding,
          numberOfLines = _props.numberOfLines,
          returnKeyLabel = _props.returnKeyLabel,
          underlineColorAndroid = _props.underlineColorAndroid,
          clearButtonMode = _props.clearButtonMode,
          clearTextOnFocus = _props.clearTextOnFocus,
          dataDetectorTypes = _props.dataDetectorTypes,
          enablesReturnKeyAutomatically = _props.enablesReturnKeyAutomatically,
          keyboardAppearance = _props.keyboardAppearance,
          onKeyPress = _props.onKeyPress,
          selectionState = _props.selectionState,
          textInputRef = _props.textInputRef,
          containerRef = _props.containerRef;

      return _react2.default.createElement(
        _reactNative.View,
        { ref: containerRef, style: [styles.container, containerStyle && containerStyle] },
        _react2.default.createElement(_reactNative.TextInput, {
          ref: textInputRef,
          autoCapitalize: autoCapitalize,
          autoCorrect: autoCorrect,
          autoFocus: autoFocus,
          blurOnSubmit: blurOnSubmit,
          defaultValue: defaultValue,
          keyboardType: keyboardType,
          maxLength: maxLength,
          multiline: multiline,
          onBlur: onBlur,
          onChange: onChange,
          onChangeText: onChangeText,
          onContentSizeChange: onContentSizeChange,
          onEndEditing: onEndEditing,
          onFocus: onFocus,
          onLayout: onLayout,
          onSelectionChange: onSelectionChange,
          onSubmitEditing: onSubmitEditing,
          placeholder: placeholder,
          placeholderTextColor: placeholderTextColor,
          returnKeyType: returnKeyType,
          secureTextEntry: secureTextEntry,
          selectTextOnFocus: selectTextOnFocus,
          inlineImageLeft: inlineImageLeft,
          inlineImagePadding: inlineImagePadding,
          numberOfLines: numberOfLines,
          returnKeyLabel: returnKeyLabel,
          underlineColorAndroid: underlineColorAndroid,
          clearButtonMode: clearButtonMode,
          clearTextOnFocus: clearTextOnFocus,
          dataDetectorTypes: dataDetectorTypes,
          enablesReturnKeyAutomatically: enablesReturnKeyAutomatically,
          keyboardAppearance: keyboardAppearance,
          onKeyPress: onKeyPress,
          selectionState: selectionState,
          editable: editable,
          selectionColor: selectionColor || _colors2.default.grey3,
          value: value,
          style: [styles.input, inputStyle && inputStyle] })
      );
    }
  }]);
  return FormInput;
}(_react.Component);

styles = _reactNative.StyleSheet.create({
  container: babelHelpers.extends({
    marginLeft: 15,
    marginRight: 15
  }, _reactNative.Platform.select({
    ios: {
      borderBottomColor: _colors2.default.grey4,
      borderBottomWidth: 1,
      marginLeft: 20,
      marginRight: 20
    }
  })),
  input: {
    height: 36,
    color: _colors2.default.grey3,
    fontSize: (0, _normalizeText2.default)(14)
  }
});

exports.default = FormInput;