Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactNative = require('react-native');

var _Dimensions$get = _reactNative.Dimensions.get('window'),
    width = _Dimensions$get.width,
    height = _Dimensions$get.height;

var screenHeight = width < height ? height : width;
var screenWidth = width < height ? width : height;

exports.default = {
    screen: {
        height: screenHeight,
        width: screenWidth,

        heightHalf: screenHeight * 0.5,
        heightTenth: screenHeight * 0.1,

        widthHalf: screenWidth * 0.5,
        widthThird: screenWidth * 0.333,
        widthTwoThirds: screenWidth * 0.666,
        widthQuarter: screenWidth * 0.25,
        widthThreeQuarters: screenWidth * 0.75
    },
    navbarHeight: _reactNative.Platform.OS === 'ios' ? 64 : 54,
    statusBarHeight: _reactNative.Platform.OS === 'ios' ? 16 : 0,
    tabbarHeight: 51,

    padding: 20,
    paddingSml: 10,

    borderRadius: 5
};