Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _MaterialIcons = require('react-native-vector-icons/MaterialIcons');

var _MaterialIcons2 = babelHelpers.interopRequireDefault(_MaterialIcons);

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var _normalizeText = require('../helpers/normalizeText');

var _normalizeText2 = babelHelpers.interopRequireDefault(_normalizeText);

var Search = function (_Component) {
  babelHelpers.inherits(Search, _Component);

  function Search() {
    babelHelpers.classCallCheck(this, Search);
    return babelHelpers.possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).apply(this, arguments));
  }

  babelHelpers.createClass(Search, [{
    key: 'focus',
    value: function focus() {
      var ref = this.props.textInputRef;
      this.refs[ref].focus();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          containerStyle = _props.containerStyle,
          inputStyle = _props.inputStyle,
          icon = _props.icon,
          noIcon = _props.noIcon,
          lightTheme = _props.lightTheme,
          round = _props.round,
          showLoadingIcon = _props.showLoadingIcon,
          loadingIcon = _props.loadingIcon,
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
          clearButtonMode = _props.clearButtonMode,
          clearTextOnFocus = _props.clearTextOnFocus,
          dataDetectorTypes = _props.dataDetectorTypes,
          enablesReturnKeyAutomatically = _props.enablesReturnKeyAutomatically,
          keyboardAppearance = _props.keyboardAppearance,
          onKeyPress = _props.onKeyPress,
          selectionState = _props.selectionState,
          isFocused = _props.isFocused,
          clear = _props.clear,
          textInputRef = _props.textInputRef,
          containerRef = _props.containerRef,
          underlineColorAndroid = _props.underlineColorAndroid;

      return _react2.default.createElement(
        _reactNative.View,
        {
          ref: containerRef,
          style: [styles.container, lightTheme && styles.containerLight, containerStyle && containerStyle] },
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
          clearButtonMode: clearButtonMode,
          clearTextOnFocus: clearTextOnFocus,
          dataDetectorTypes: dataDetectorTypes,
          enablesReturnKeyAutomatically: enablesReturnKeyAutomatically,
          keyboardAppearance: keyboardAppearance,
          onKeyPress: onKeyPress,
          selectionState: selectionState,
          editable: editable,
          isFocused: isFocused,
          clear: clear,
          selectionColor: selectionColor || _colors2.default.grey3,
          value: value,
          underlineColorAndroid: underlineColorAndroid ? underlineColorAndroid : 'transparent',
          style: [styles.input, lightTheme && styles.inputLight, noIcon && { paddingLeft: 9 }, round && { borderRadius: _reactNative.Platform.OS === 'ios' ? 15 : 20 }, inputStyle && inputStyle] }),
        !noIcon && _react2.default.createElement(_MaterialIcons2.default, {
          size: 16,
          style: [styles.icon, icon.style && icon.style],
          name: icon.name || 'search',
          color: icon.color || _colors2.default.grey3
        }),
        showLoadingIcon && _react2.default.createElement(_reactNative.ActivityIndicator, {
          style: [styles.loadingIcon, loadingIcon.style && loadingIcon.style],
          color: icon.color || _colors2.default.grey3
        })
      );
    }
  }]);
  return Search;
}(_react.Component);

Search.propTypes = {
  icon: _react.PropTypes.object,
  noIcon: _react.PropTypes.bool,
  lightTheme: _react.PropTypes.bool,
  containerStyle: _react.PropTypes.any,
  inputStyle: _react.PropTypes.any,
  round: _react.PropTypes.bool,
  showLoadingIcon: _react.PropTypes.bool,
  loadingIcon: _react.PropTypes.object
};

Search.defaultProps = {
  placeholderTextColor: _colors2.default.grey3,
  lightTheme: false,
  noIcon: false,
  round: false,
  icon: {},
  showLoadingIcon: false,
  loadingIcon: {}
};

var styles = _reactNative.StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderTopColor: '#000',
    backgroundColor: _colors2.default.grey0
  },
  containerLight: {
    backgroundColor: _colors2.default.grey5,
    borderTopColor: '#e1e1e1',
    borderBottomColor: '#e1e1e1'
  },
  icon: babelHelpers.extends({
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 16,
    top: 15.5
  }, _reactNative.Platform.select({
    android: {
      top: 20
    }
  })),
  loadingIcon: babelHelpers.extends({
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 16,
    top: 13
  }, _reactNative.Platform.select({
    android: {
      top: 17
    }
  })),
  input: babelHelpers.extends({
    paddingLeft: 26,
    paddingRight: 19,
    margin: 8,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: _colors2.default.searchBg,
    fontSize: (0, _normalizeText2.default)(14),
    color: _colors2.default.grey3,
    height: 40
  }, _reactNative.Platform.select({
    ios: {
      height: 30
    },
    android: {
      borderWidth: 0
    }
  })),
  inputLight: {
    backgroundColor: _colors2.default.grey4
  }
});

exports.default = Search;