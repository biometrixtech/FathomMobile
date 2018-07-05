/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:19:55
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-08 16:01:26
 */

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
    fontSize:   scaleFont(16),
    lineHeight: lineHeight(scaleFont(Platform.OS === 'ios' ? 13 : 14)),
    fontFamily: 'Libre Franklin',
    fontWeight: '400',
};

export default {
    base: { ...base },
    h0:   { ...base, fontSize: base.fontSize * 4,    lineHeight: lineHeight(base.fontSize * 4.25) },
    h1:   { ...base, fontSize: base.fontSize * 1.75, lineHeight: lineHeight(base.fontSize * 2) },
    h2:   { ...base, fontSize: base.fontSize * 1.5,  lineHeight: lineHeight(base.fontSize * 1.75) },
    h3:   { ...base, fontSize: base.fontSize * 1.25, lineHeight: lineHeight(base.fontSize * 1.5) },
    h4:   { ...base, fontSize: base.fontSize * 1.1,  lineHeight: lineHeight(base.fontSize * 1.25) },
    h5:   { ...base },
    h6:   { ...base, fontSize: base.fontSize * 0.8, lineHeight: lineHeight(base.fontSize * 0.8) },
    h7:   { ...base, fontSize: base.fontSize * 0.5, lineHeight: lineHeight(base.fontSize * 0.5) },
    scaleFont,
    lineHeight
};
