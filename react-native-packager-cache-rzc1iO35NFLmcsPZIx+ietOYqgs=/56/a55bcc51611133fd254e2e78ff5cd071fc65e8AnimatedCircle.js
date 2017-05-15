Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Circle = require('../shape/Circle');

var _Circle2 = babelHelpers.interopRequireDefault(_Circle);

var _reactNative = require('react-native');

exports.default = AnimatedCircle = _reactNative.Animated.createAnimatedComponent(_Circle2.default);