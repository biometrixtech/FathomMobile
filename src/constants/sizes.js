/**
 * App Theme - Sizes
 */
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenHeight = width < height ? height : width;
const screenWidth = width < height ? width : height;
const isIphoneX = (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height > 800 || width > 800)
);

export default {
    // Window Dimensions
    screen: {
        height:       screenHeight,
        usableHeight: screenHeight - 64/(Platform.OS === 'ios' ? 1.8 : 1) - (Platform.OS === 'ios' ? 16 : 0), // screen height under navbar and statusbar
        width:        screenWidth,

        progressBarHeight: 5,

        heightOneThird:      screenHeight * 0.333,
        heightTwoThirds:     screenHeight * 0.666,
        heightTwoFifths:     screenHeight * 0.40,
        heightThreeQuarters: screenHeight * 0.75,
        heightHalf:          screenHeight * 0.5,
        heightQuarter:       screenHeight * 0.25,
        heightFifth:         screenHeight * 0.2,
        heightTenth:         screenHeight * 0.1,

        widthHalf:          screenWidth * 0.5,
        widthThird:         screenWidth * 0.333,
        widthTwoThirds:     screenWidth * 0.666,
        widthFifth:         screenWidth * 0.2,
        widthQuarter:       screenWidth * 0.25,
        widthThreeQuarters: screenWidth * 0.75,
        widthFourFifths:    screenWidth * 0.8,
    },
    navbarHeight:    Platform.OS === 'ios' ? 64 : 54, // header with title and nav bar buttons
    statusBarHeight: isIphoneX ? 44 : Platform.OS === 'ios' ? 20 : 0,  // time and icon indicators
    tabbarHeight:    51,

    iphoneXBottomBarPadding: isIphoneX ? 30 : Platform.OS === 'ios' ? 20 : 0,
    isIphoneX,

    progressPillsHeight: screenHeight * 0.08,

    backNextButtonsHeight: 55,

    padding:     20,
    paddingLrg:  30,
    paddingXLrg: 50,
    paddingSml:  10,
    paddingXSml: 5,
    paddingMed:  15,
    tickSize:    5,

    borderRadius: 5,
};
