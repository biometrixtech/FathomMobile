

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReactNativeAttributePayload = require('ReactNativeAttributePayload');
var TextInputState = require('TextInputState');
var UIManager = require('UIManager');

var _require = require('NativeMethodsMixinUtils'),
    mountSafeCallback = _require.mountSafeCallback,
    warnForStyleProps = _require.warnForStyleProps;

var ReactNativeFiberHostComponent = function () {
  function ReactNativeFiberHostComponent(tag, viewConfig) {
    _classCallCheck(this, ReactNativeFiberHostComponent);

    this._nativeTag = tag;
    this._children = [];
    this.viewConfig = viewConfig;
  }

  _createClass(ReactNativeFiberHostComponent, [{
    key: 'blur',
    value: function blur() {
      TextInputState.blurTextInput(this._nativeTag);
    }
  }, {
    key: 'focus',
    value: function focus() {
      TextInputState.focusTextInput(this._nativeTag);
    }
  }, {
    key: 'measure',
    value: function measure(callback) {
      UIManager.measure(this._nativeTag, mountSafeCallback(this, callback));
    }
  }, {
    key: 'measureInWindow',
    value: function measureInWindow(callback) {
      UIManager.measureInWindow(this._nativeTag, mountSafeCallback(this, callback));
    }
  }, {
    key: 'measureLayout',
    value: function measureLayout(relativeToNativeNode, onSuccess, onFail) {
      UIManager.measureLayout(this._nativeTag, relativeToNativeNode, mountSafeCallback(this, onFail), mountSafeCallback(this, onSuccess));
    }
  }, {
    key: 'setNativeProps',
    value: function setNativeProps(nativeProps) {
      if (__DEV__) {
        warnForStyleProps(nativeProps, this.viewConfig.validAttributes);
      }

      var updatePayload = ReactNativeAttributePayload.create(nativeProps, this.viewConfig.validAttributes);

      UIManager.updateView(this._nativeTag, this.viewConfig.uiViewClassName, updatePayload);
    }
  }]);

  return ReactNativeFiberHostComponent;
}();

module.exports = ReactNativeFiberHostComponent;