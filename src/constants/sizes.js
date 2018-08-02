/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:19:46
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-12 19:02:12
 */

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
        widthQuarter:       screenWidth * 0.25,
        widthThreeQuarters: screenWidth * 0.75,
        widthFourFifths:    screenWidth * 0.8,
    },
    navbarHeight:    Platform.OS === 'ios' ? 64 : 54, // header with title and nav bar buttons
    statusBarHeight: Platform.OS === 'ios' ? 16 : 0,  // time and icon indicators
    tabbarHeight:    51,

    padding:     20,
    paddingLrg:  30,
    paddingXLrg: 50,
    paddingSml:  10,
    paddingXSml: 5,
    paddingMed:  15,
    tickSize:    5,

    borderRadius: 5,
};
