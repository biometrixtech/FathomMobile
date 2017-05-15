

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-modal-dropdown/components/ModalDropdown.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var TOUCHABLE_ELEMENTS = ['TouchableHighlight', 'TouchableOpacity', 'TouchableWithoutFeedback', 'TouchableWithNativeFeedback'];

var ModalDropdown = function (_Component) {
  babelHelpers.inherits(ModalDropdown, _Component);

  function ModalDropdown(props) {
    babelHelpers.classCallCheck(this, ModalDropdown);

    var _this = babelHelpers.possibleConstructorReturn(this, (ModalDropdown.__proto__ || Object.getPrototypeOf(ModalDropdown)).call(this, props));

    _this._button = null;
    _this._buttonFrame = null;
    _this._nextValue = null;
    _this._nextIndex = null;

    _this.state = {
      disabled: props.disabled,
      accessible: props.accessible !== false,
      loading: props.options == null,
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex
    };
    return _this;
  }

  babelHelpers.createClass(ModalDropdown, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var buttonText = this._nextValue == null ? this.state.buttonText : this._nextValue.toString();
      var selectedIndex = this._nextIndex == null ? this.state.selectedIndex : this._nextIndex;
      if (selectedIndex < 0) {
        selectedIndex = nextProps.defaultIndex;
        if (selectedIndex < 0) {
          buttonText = nextProps.defaultValue;
        }
      }
      this._nextValue = null;
      this._nextIndex = null;

      this.setState({
        disabled: nextProps.disabled,
        loading: nextProps.options == null,
        buttonText: buttonText,
        selectedIndex: selectedIndex
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactNative.View,
        babelHelpers.extends({}, this.props, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 102
          }
        }),
        this._renderButton(),
        this._renderModal()
      );
    }
  }, {
    key: '_updatePosition',
    value: function _updatePosition(callback) {
      var _this2 = this;

      if (this._button && this._button.measure) {
        this._button.measure(function (fx, fy, width, height, px, py) {
          _this2._buttonFrame = { x: px, y: py, w: width, h: height };
          callback && callback();
        });
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var _this3 = this;

      this._updatePosition(function () {
        _this3.setState({
          showDropdown: true
        });
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.setState({
        showDropdown: false
      });
    }
  }, {
    key: 'select',
    value: function select(idx) {
      var value = this.props.defaultValue;
      if (idx == null || this.props.options == null || idx >= this.props.options.length) {
        idx = this.props.defaultIndex;
      }

      if (idx >= 0) {
        value = this.props.options[idx].toString();
      }

      this._nextValue = value;
      this._nextIndex = idx;

      this.setState({
        buttonText: value,
        selectedIndex: idx
      });
    }
  }, {
    key: '_renderButton',
    value: function _renderButton() {
      var _this4 = this;

      return _react2.default.createElement(
        _reactNative.TouchableOpacity,
        { ref: function ref(button) {
            return _this4._button = button;
          },
          disabled: this.props.disabled,
          accessible: this.props.accessible,
          onPress: this._onButtonPress.bind(this), __source: {
            fileName: _jsxFileName,
            lineNumber: 153
          }
        },
        this.props.children || _react2.default.createElement(
          _reactNative.View,
          { style: styles.button, __source: {
              fileName: _jsxFileName,
              lineNumber: 160
            }
          },
          _react2.default.createElement(
            _reactNative.Text,
            { style: [styles.buttonText, this.props.textStyle],
              numberOfLines: 1, __source: {
                fileName: _jsxFileName,
                lineNumber: 161
              }
            },
            this.state.buttonText
          )
        )
      );
    }
  }, {
    key: '_onButtonPress',
    value: function _onButtonPress() {
      if (!this.props.onDropdownWillShow || this.props.onDropdownWillShow() !== false) {
        this.show();
      }
    }
  }, {
    key: '_renderModal',
    value: function _renderModal() {
      if (this.state.showDropdown && this._buttonFrame) {
        var frameStyle = this._calcPosition();
        var animationType = this.props.animated ? 'fade' : 'none';
        return _react2.default.createElement(
          _reactNative.Modal,
          { animationType: animationType,
            transparent: true,
            onRequestClose: this._onRequestClose.bind(this),
            supportedOrientations: ['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right'], __source: {
              fileName: _jsxFileName,
              lineNumber: 184
            }
          },
          _react2.default.createElement(
            _reactNative.TouchableWithoutFeedback,
            { accessible: this.props.accessible,
              onPress: this._onModalPress.bind(this), __source: {
                fileName: _jsxFileName,
                lineNumber: 188
              }
            },
            _react2.default.createElement(
              _reactNative.View,
              { style: styles.modal, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 190
                }
              },
              _react2.default.createElement(
                _reactNative.View,
                { style: [styles.dropdown, this.props.dropdownStyle, frameStyle], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 191
                  }
                },
                this.state.loading ? this._renderLoading() : this._renderDropdown()
              )
            )
          )
        );
      }
    }
  }, {
    key: '_calcPosition',
    value: function _calcPosition() {
      var dimensions = _reactNative.Dimensions.get('window');
      var windowWidth = dimensions.width;
      var windowHeight = dimensions.height;

      var dropdownHeight = this.props.dropdownStyle && _reactNative.StyleSheet.flatten(this.props.dropdownStyle).height || _reactNative.StyleSheet.flatten(styles.dropdown).height;

      var bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
      var rightSpace = windowWidth - this._buttonFrame.x;
      var showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
      var showInLeft = rightSpace >= this._buttonFrame.x;

      var style = {
        height: dropdownHeight,
        top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight)
      };

      if (showInLeft) {
        style.left = this._buttonFrame.x;
      } else {
        var dropdownWidth = this.props.dropdownStyle && _reactNative.StyleSheet.flatten(this.props.dropdownStyle).width || this.props.style && _reactNative.StyleSheet.flatten(this.props.style).width || -1;
        if (dropdownWidth !== -1) {
          style.width = dropdownWidth;
        }
        style.right = rightSpace - this._buttonFrame.w;
      }

      if (this.props.adjustFrame) {
        style = this.props.adjustFrame(style) || style;
      }

      return style;
    }
  }, {
    key: '_onRequestClose',
    value: function _onRequestClose() {
      if (!this.props.onDropdownWillHide || this.props.onDropdownWillHide() !== false) {
        this.hide();
      }
    }
  }, {
    key: '_onModalPress',
    value: function _onModalPress() {
      if (!this.props.onDropdownWillHide || this.props.onDropdownWillHide() !== false) {
        this.hide();
      }
    }
  }, {
    key: '_renderLoading',
    value: function _renderLoading() {
      return _react2.default.createElement(_reactNative.ActivityIndicator, { size: 'small', __source: {
          fileName: _jsxFileName,
          lineNumber: 253
        }
      });
    }
  }, {
    key: '_renderDropdown',
    value: function _renderDropdown() {
      return _react2.default.createElement(_reactNative.ListView, { style: styles.list,
        dataSource: this._dataSource,
        renderRow: this._renderRow.bind(this),
        renderSeparator: this.props.renderSeparator || this._renderSeparator.bind(this),
        automaticallyAdjustContentInsets: false,
        showsVerticalScrollIndicator: this.props.showsVerticalScrollIndicator,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 259
        }
      });
    }
  }, {
    key: '_renderRow',
    value: function _renderRow(rowData, sectionID, rowID, highlightRow) {
      var _this5 = this;

      var key = 'row_' + rowID;
      var highlighted = rowID == this.state.selectedIndex;
      var row = !this.props.renderRow ? _react2.default.createElement(
        _reactNative.Text,
        { style: [styles.rowText, highlighted && styles.highlightedRowText], __source: {
            fileName: _jsxFileName,
            lineNumber: 280
          }
        },
        rowData
      ) : this.props.renderRow(rowData, rowID, highlighted);
      var preservedProps = {
        key: key,
        accessible: this.props.accessible,
        onPress: function onPress() {
          return _this5._onRowPress(rowData, sectionID, rowID, highlightRow);
        }
      };
      if (TOUCHABLE_ELEMENTS.find(function (name) {
        return name == row.type.displayName;
      })) {
        var props = babelHelpers.extends({}, row.props);
        props.key = preservedProps.key;
        props.onPress = preservedProps.onPress;
        switch (row.type.displayName) {
          case 'TouchableHighlight':
            {
              return _react2.default.createElement(
                _reactNative.TouchableHighlight,
                babelHelpers.extends({}, props, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 297
                  }
                }),
                row.props.children
              );
            }
            break;
          case 'TouchableOpacity':
            {
              return _react2.default.createElement(
                _reactNative.TouchableOpacity,
                babelHelpers.extends({}, props, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 306
                  }
                }),
                row.props.children
              );
            }
            break;
          case 'TouchableWithoutFeedback':
            {
              return _react2.default.createElement(
                _reactNative.TouchableWithoutFeedback,
                babelHelpers.extends({}, props, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 315
                  }
                }),
                row.props.children
              );
            }
            break;
          case 'TouchableWithNativeFeedback':
            {
              return _react2.default.createElement(
                _reactNative.TouchableWithNativeFeedback,
                babelHelpers.extends({}, props, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 324
                  }
                }),
                row.props.children
              );
            }
            break;
          default:
            break;
        }
      }
      return _react2.default.createElement(
        _reactNative.TouchableHighlight,
        babelHelpers.extends({}, preservedProps, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 335
          }
        }),
        row
      );
    }
  }, {
    key: '_onRowPress',
    value: function _onRowPress(rowData, sectionID, rowID, highlightRow) {
      if (!this.props.onSelect || this.props.onSelect(rowID, rowData) !== false) {
        highlightRow(sectionID, rowID);
        this._nextValue = rowData;
        this._nextIndex = rowID;
        this.setState({
          buttonText: rowData.toString(),
          selectedIndex: rowID
        });
      }
      if (!this.props.onDropdownWillHide || this.props.onDropdownWillHide() !== false) {
        this.setState({
          showDropdown: false
        });
      }
    }
  }, {
    key: '_renderSeparator',
    value: function _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
      var key = 'spr_' + rowID;
      return _react2.default.createElement(_reactNative.View, { style: styles.separator,
        key: key,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 362
        }
      });
    }
  }, {
    key: '_dataSource',
    get: function get() {
      var ds = new _reactNative.ListView.DataSource({
        rowHasChanged: function rowHasChanged(r1, r2) {
          return r1 !== r2;
        }
      });
      return ds.cloneWithRows(this.props.options);
    }
  }]);
  return ModalDropdown;
}(_react.Component);

ModalDropdown.propTypes = {
  disabled: _react.PropTypes.bool,
  defaultIndex: _react.PropTypes.number,
  defaultValue: _react.PropTypes.string,
  options: _react.PropTypes.array,

  accessible: _react.PropTypes.bool,
  animated: _react.PropTypes.bool,
  showsVerticalScrollIndicator: _react.PropTypes.bool,

  style: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object, _react.PropTypes.array]),
  textStyle: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object, _react.PropTypes.array]),
  dropdownStyle: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object, _react.PropTypes.array]),

  adjustFrame: _react.PropTypes.func,
  renderRow: _react.PropTypes.func,
  renderSeparator: _react.PropTypes.func,

  onDropdownWillShow: _react.PropTypes.func,
  onDropdownWillHide: _react.PropTypes.func,
  onSelect: _react.PropTypes.func
};
ModalDropdown.defaultProps = {
  disabled: false,
  defaultIndex: -1,
  defaultValue: 'Please select...',
  options: null,
  animated: true,
  showsVerticalScrollIndicator: true
};
exports.default = ModalDropdown;


var styles = _reactNative.StyleSheet.create({
  button: {
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 12
  },
  modal: {
    flexGrow: 1
  },
  dropdown: {
    position: 'absolute',
    height: (33 + _reactNative.StyleSheet.hairlineWidth) * 5,
    borderWidth: _reactNative.StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
    borderRadius: 2,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  loading: {
    alignSelf: 'center'
  },
  list: {},
  rowText: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    fontSize: 11,
    color: 'gray',
    backgroundColor: 'white',
    textAlignVertical: 'center'
  },
  highlightedRowText: {
    color: 'black'
  },
  separator: {
    height: _reactNative.StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray'
  }
});