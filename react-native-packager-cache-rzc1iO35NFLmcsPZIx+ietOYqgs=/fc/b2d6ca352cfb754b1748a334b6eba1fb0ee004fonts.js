Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactNative = require('react-native');

function lineHeight(fontSize) {
    var multiplier = fontSize > 20 ? 0.1 : 0.33;
    return parseInt(fontSize + fontSize * multiplier, 10);
}

var base = babelHelpers.extends({
    size: 16,
    lineHeight: lineHeight(14)
}, _reactNative.Platform.select({
    ios: {
        family: 'HelveticaNeue'
    },
    android: {
        family: 'Roboto'
    }
}));

exports.default = {
    base: babelHelpers.extends({}, base),
    h0: babelHelpers.extends({}, base, { size: base.size * 2.5, lineHeight: lineHeight(base.size * 2) }),
    h1: babelHelpers.extends({}, base, { size: base.size * 1.75, lineHeight: lineHeight(base.size * 2) }),
    h2: babelHelpers.extends({}, base, { size: base.size * 1.5, lineHeight: lineHeight(base.size * 1.75) }),
    h3: babelHelpers.extends({}, base, { size: base.size * 1.25, lineHeight: lineHeight(base.size * 1.5) }),
    h4: babelHelpers.extends({}, base, { size: base.size * 1.1, lineHeight: lineHeight(base.size * 1.25) }),
    h5: babelHelpers.extends({}, base)
};