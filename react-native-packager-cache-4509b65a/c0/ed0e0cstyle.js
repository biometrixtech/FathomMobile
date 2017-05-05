'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactNative = require('react-native');

var _Dimensions$get = _reactNative.Dimensions.get('window'),
    height = _Dimensions$get.height,
    width = _Dimensions$get.width;

var PADDING = 8;
var BORDER_RADIUS = 5;
var FONT_SIZE = 16;
var HIGHLIGHT_COLOR = 'rgba(0,118,255,0.9)';
var OPTION_CONTAINER_HEIGHT = 400;

exports.default = _reactNative.StyleSheet.create({

    overlayStyle: {
        width: width,
        height: height,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    optionContainer: {
        borderRadius: BORDER_RADIUS,
        width: width * 0.8,
        height: OPTION_CONTAINER_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0.8)',
        left: width * 0.1,
        top: (height - OPTION_CONTAINER_HEIGHT) / 2
    },

    cancelContainer: {
        left: width * 0.1,
        top: (height - OPTION_CONTAINER_HEIGHT) / 2 + 10
    },

    selectStyle: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        borderRadius: BORDER_RADIUS
    },

    selectTextStyle: {
        textAlign: 'center',
        color: '#333',
        fontSize: FONT_SIZE
    },

    cancelStyle: {
        borderRadius: BORDER_RADIUS,
        width: width * 0.8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: PADDING
    },

    cancelTextStyle: {
        textAlign: 'center',
        color: '#333',
        fontSize: FONT_SIZE
    },

    optionStyle: {
        padding: PADDING,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },

    optionTextStyle: {
        textAlign: 'center',
        fontSize: FONT_SIZE,
        color: HIGHLIGHT_COLOR
    },

    sectionStyle: {
        padding: PADDING * 2,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },

    sectionTextStyle: {
        textAlign: 'center',
        fontSize: FONT_SIZE
    }
});