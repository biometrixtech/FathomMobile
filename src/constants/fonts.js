/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:19:55
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-10 00:43:22
 */

/**
 * App Theme - Fonts
 */

import { Dimensions, Platform } from 'react-native';
import _ from 'lodash';
const { width, height } = Dimensions.get('window');
const realWidth = height > width ? width : height;

const fonts = {
    oswald: {
        Bold:       '800',
        ExtraLight: '200',
        Heavy:      '900',
        Light:      '300',
        Medium:     '500',
        Regular:    '400',
        SemiBold:   '600',
        100:        'ExtraLight',
        200:        'ExtraLight',
        300:        'Light',
        400:        'Regular',
        500:        'Medium',
        600:        'SemiBold',
        700:        'Bold',
        800:        'Bold',
        900:        'Heavy',
    },
    roboto: {
        Black:   '900',
        Bold:    '800',
        Light:   '300',
        Medium:  '500',
        Regular: '400',
        Thin:    '100',
        100:     'Thin',
        200:     'Light',
        300:     'Light',
        400:     'Regular',
        500:     'Medium',
        600:     'Medium',
        700:     'Bold',
        800:     'Bold',
        900:     'Black',
    }
};

function scaleFont(fontSize) {
    return Math.round(fontSize * realWidth / 400);
}

function lineHeight(fontSize) {
    const multiplier = (fontSize > 20) ? 0.1 : 0.33;
    return parseInt(fontSize + (fontSize * multiplier), 10);
}

const base = {
    size:       scaleFont(Platform.OS === 'ios' ? 20 : 18),
    lineHeight: lineHeight(scaleFont(Platform.OS === 'ios' ? 18 : 16)),
    fontFamily: 'Oswald',
};

const roboto = {
    size:       scaleFont(Platform.OS === 'ios' ? 20 : 18),
    lineHeight: lineHeight(scaleFont(Platform.OS === 'ios' ? 18 : 16)),
    fontFamily: 'Roboto',
};

function getFontStyle(typeOrWeight = '400', family = 'oswald') {
    let fontType = Object.keys(fonts).some(font => font === family.toLowerCase()) ? fonts[family.toLowerCase()] : fonts.oswald;
    let fontStyle = {
        fontFamily: _.capitalize(family),
    }
    if (!typeOrWeight) {
        return fontStyle;
    } else if (isNaN(typeOrWeight)) {
        if (Platform.OS === 'ios') {
            fontStyle.fontWeight = fontType[_.capitalize(typeOrWeight)];
        } else {
            fontStyle.fontFamily = `${fontStyle.fontFamily}-${_.capitalize(typeOrWeight)}`;
        }
    } else {
        if (Platform.OS === 'ios') {
            fontStyle.fontWeight = typeOrWeight;
        } else {
            fontStyle.fontFamily = `${fontStyle.fontFamily}-${fontType[typeOrWeight]}`;
        }
    }
    return fontStyle;
}

export default {
    base:             { ...base, },
    h0:               { ...base, size: base.size * 4,    lineHeight: lineHeight(base.size * 4.25) },
    h1:               { ...base, size: base.size * 1.75, lineHeight: lineHeight(base.size * 2)    },
    h2:               { ...base, size: base.size * 1.5,  lineHeight: lineHeight(base.size * 1.75) },
    h3:               { ...base, size: base.size * 1.25, lineHeight: lineHeight(base.size * 1.5)  },
    h4:               { ...base, size: base.size * 1.1,  lineHeight: lineHeight(base.size * 1.25) },
    h5:               { ...base },
    h6:               { ...base, size: base.size * 0.8, lineHeight: lineHeight(base.size * 0.8) },
    h7:               { ...base, size: base.size * 0.5, lineHeight: lineHeight(base.size * 0.5) },
    oswaldBold:       { ...getFontStyle('Bold',       'oswald') },
    oswaldExtraLight: { ...getFontStyle('ExtraLight', 'oswald') },
    oswaldHeavy:      { ...getFontStyle('Heavy',      'oswald') },
    oswaldLight:      { ...getFontStyle('Light',      'oswald') },
    oswaldMedium:     { ...getFontStyle('Medium',     'oswald') },
    oswaldRegular:    { ...getFontStyle('Regular',    'oswald') },
    oswaldSemiBold:   { ...getFontStyle('SemiBold',   'oswald') },
    roboto:           { ...roboto },
    robotoH0:         { ...roboto, size: roboto.size * 4,    lineHeight: lineHeight(roboto.size * 4.25) },
    robotoH1:         { ...roboto, size: roboto.size * 1.75, lineHeight: lineHeight(roboto.size * 2)    },
    robotoH2:         { ...roboto, size: roboto.size * 1.5,  lineHeight: lineHeight(roboto.size * 1.75) },
    robotoH3:         { ...roboto, size: roboto.size * 1.25, lineHeight: lineHeight(roboto.size * 1.5)  },
    robotoH4:         { ...roboto, size: roboto.size * 1.1,  lineHeight: lineHeight(roboto.size * 1.25) },
    robotoH5:         { ...roboto },
    robotoH6:         { ...roboto, size: roboto.size * 0.8, lineHeight: lineHeight(roboto.size * 0.8) },
    robotoH7:         { ...roboto, size: roboto.size * 0.5, lineHeight: lineHeight(roboto.size * 0.5) },
    robotoBold:       { ...getFontStyle('Bold',    'roboto') },
    robotoBlack:      { ...getFontStyle('Black',   'roboto') },
    robotoLight:      { ...getFontStyle('Light',   'roboto') },
    robotoMedium:     { ...getFontStyle('Medium',  'roboto') },
    robotoRegular:    { ...getFontStyle('Regular', 'roboto') },
    robotoThin:       { ...getFontStyle('Thin',    'roboto') },
    getFontStyle,
    scaleFont,
    lineHeight
};
