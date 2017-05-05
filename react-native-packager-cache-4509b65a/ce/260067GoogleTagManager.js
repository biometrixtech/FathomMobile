Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GoogleTagManager = undefined;

var _NativeBridges = require('./NativeBridges');

var GoogleTagManager = exports.GoogleTagManager = function () {
  function GoogleTagManager() {
    babelHelpers.classCallCheck(this, GoogleTagManager);
  }

  babelHelpers.createClass(GoogleTagManager, null, [{
    key: 'openContainerWithId',
    value: function openContainerWithId(containerId) {
      return _NativeBridges.GoogleTagManagerBridge.openContainerWithId(containerId);
    }
  }, {
    key: 'boolForKey',
    value: function boolForKey(key) {
      return _NativeBridges.GoogleTagManagerBridge.booleanForKey(key);
    }
  }, {
    key: 'stringForKey',
    value: function stringForKey(key) {
      return _NativeBridges.GoogleTagManagerBridge.stringForKey(key);
    }
  }, {
    key: 'doubleForKey',
    value: function doubleForKey(key) {
      return _NativeBridges.GoogleTagManagerBridge.doubleForKey(key);
    }
  }, {
    key: 'pushDataLayerEvent',
    value: function pushDataLayerEvent() {
      var dictionary = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return _NativeBridges.GoogleTagManagerBridge.pushDataLayerEvent(dictionary);
    }
  }]);
  return GoogleTagManager;
}();