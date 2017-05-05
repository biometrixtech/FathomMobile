Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Bar = require('../shape/Bar');

var _Bar2 = babelHelpers.interopRequireDefault(_Bar);

var _reactNative = require('react-native');

exports.default = AnimatedBar = _reactNative.Animated.createAnimatedComponent(_Bar2.default);