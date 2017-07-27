/**
 * App Theme - Fonts
 */

import { Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');
const realWidth = height > width ? width : height;


function scaleFont(fontSize) {
    return Math.round(fontSize * realWidth / 400);
}

function lineHeight(fontSize) {
    const multiplier = (fontSize > 20) ? 0.1 : 0.33;
    return parseInt(fontSize + (fontSize * multiplier), 10);
}

const base = {
    size:       scaleFont(16),
    lineHeight: lineHeight(scaleFont(Platform.OS === 'ios' ? 12 : 14)),
    family:     'Proxima Nova'
    // ...Platform.select({
    //     ios: {
    //         family: 'Proxima Nova',
    //     },
    //     android: {
    //         family: 'Proxima Nova',
    //     },
    // }),
};

export default {
    base: { ...base },
    h0:   { ...base, size: base.size * 2.5, lineHeight: lineHeight(base.size * 2) },
    h1:   { ...base, size: base.size * 1.75, lineHeight: lineHeight(base.size * 2) },
    h2:   { ...base, size: base.size * 1.5, lineHeight: lineHeight(base.size * 1.75) },
    h3:   { ...base, size: base.size * 1.25, lineHeight: lineHeight(base.size * 1.5) },
    h4:   { ...base, size: base.size * 1.1, lineHeight: lineHeight(base.size * 1.25) },
    h5:   { ...base },
    scaleFont,
    lineHeight
};
