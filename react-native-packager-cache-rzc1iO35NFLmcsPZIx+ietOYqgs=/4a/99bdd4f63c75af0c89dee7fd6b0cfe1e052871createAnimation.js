Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAnimation;

var _flattenStyle = require('./flattenStyle');

var _flattenStyle2 = babelHelpers.interopRequireDefault(_flattenStyle);

function compareNumbers(a, b) {
  return a - b;
}

function notNull(value) {
  return value !== null;
}

function parsePosition(value) {
  if (value === 'from') {
    return 0;
  } else if (value === 'to') {
    return 1;
  }
  var parsed = parseFloat(value, 10);
  if (isNaN(parsed) || parsed < 0 || parsed > 1) {
    return null;
  }
  return parsed;
}

var cache = {};

function createAnimation(definition) {
  var cacheKey = JSON.stringify(definition);
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  var positions = Object.keys(definition).map(parsePosition).filter(notNull);
  positions.sort(compareNumbers);

  if (positions.length < 2) {
    throw new Error('Animation definitions must have at least two values.');
  }

  var compiled = {};
  if (definition.easing) {
    compiled.easing = definition.easing;
  }
  if (definition.style) {
    compiled.style = definition.style;
  }

  var _loop = function _loop(i) {
    var position = positions[i];
    var keyframe = definition[position];
    if (!keyframe) {
      if (position === 0) {
        keyframe = definition.from;
      } else if (position === 1) {
        keyframe = definition.to;
      }
    }
    if (!keyframe) {
      throw new Error('Missing animation keyframe, this should not happen');
    }

    keyframe = (0, _flattenStyle2.default)(keyframe);
    Object.keys(keyframe).forEach(function (key) {
      if (!(key in compiled)) {
        compiled[key] = {
          inputRange: [],
          outputRange: []
        };
      }
      compiled[key].inputRange.push(position);
      compiled[key].outputRange.push(keyframe[key]);
    });
  };

  for (var i = 0; i < positions.length; i += 1) {
    _loop(i);
  }

  cache[cacheKey] = compiled;

  return compiled;
}