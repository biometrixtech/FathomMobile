/**
 * App Theme - Sizes
 */
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenHeight = width < height ? height : width;
const screenWidth = width < height ? width : height;

export default {
    // Window Dimensions
    screen: {
        height: screenHeight,
        width:  screenWidth,

        heightTwoThirds:     screenHeight * 0.666,
        heightThreeQuarters: screenHeight * 0.75,
        heightHalf:          screenHeight * 0.5,
        heightTenth:         screenHeight * 0.1,

        widthHalf:          screenWidth * 0.5,
        widthThird:         screenWidth * 0.333,
        widthTwoThirds:     screenWidth * 0.666,
        widthQuarter:       screenWidth * 0.25,
        widthThreeQuarters: screenWidth * 0.75,
        widthEightTenths:   screenWidth * 0.8,
    },
    navbarHeight:    (Platform.OS === 'ios') ? 64 : 54,
    statusBarHeight: (Platform.OS === 'ios') ? 16 : 0,
    tabbarHeight:    51,

    padding:    20,
    paddingSml: 10,

    borderRadius: 5,
};
