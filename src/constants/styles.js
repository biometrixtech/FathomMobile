/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:19:33
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-10 03:14:52
 */

/**
 * App Styles
 */
import { Platform } from 'react-native';

import Colors from './colors';
import Fonts from './fonts';
import Sizes from './sizes';

export default {
    appContainer: {
        backgroundColor: Colors.background,
    },

    // Default
    container: {
        flex:            1,
        flexDirection:   'column',
        backgroundColor: Colors.background,
    },
    containerCentered: {
        justifyContent: 'center',
        alignItems:     'center',
    },
    windowSize: {
        height: Sizes.screen.height,
        width:  Sizes.screen.width,
    },

    // Aligning items
    leftAligned: {
        alignItems: 'flex-start',
    },
    rightAligned: {
        alignItems: 'flex-end',
    },

    // Text Styles
    baseText: {
        ...Fonts.oswaldMedium,
        fontSize:   Fonts.base.size,
        lineHeight: Fonts.base.lineHeight,
        color:      Colors.primary.grey.fiftyPercent,
        fontStyle:  'normal'
    },
    p: {
        ...Fonts.oswaldMedium,
        fontSize:     Fonts.base.size,
        lineHeight:   Fonts.base.lineHeight,
        color:        Colors.primary.grey.fiftyPercent,
        fontStyle:    'normal',
        marginBottom: 8,
    },
    h0: {
        ...Fonts.oswaldMedium,
        fontSize:     Fonts.h0.size,
        lineHeight:   Fonts.h0.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontStyle:    'normal',
        margin:       0,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h1: {
        ...Fonts.oswaldBold,
        fontSize:     Fonts.h1.size,
        lineHeight:   Fonts.h1.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontStyle:    'normal',
        margin:       0,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h2: {
        ...Fonts.oswaldBold,
        fontSize:     Fonts.h2.size,
        lineHeight:   Fonts.h2.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontStyle:    'normal',
        margin:       0,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h3: {
        ...Fonts.oswaldMedium,
        fontSize:     Fonts.h3.size,
        lineHeight:   Fonts.h3.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontStyle:    'normal',
        margin:       0,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h4: {
        ...Fonts.oswaldBold,
        fontSize:     Fonts.h4.size,
        lineHeight:   Fonts.h4.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontStyle:    'normal',
        margin:       0,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h5: {
        ...Fonts.oswaldBold,
        fontSize:     Fonts.h5.size,
        lineHeight:   Fonts.h5.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontStyle:    'normal',
        margin:       0,
        marginTop:    4,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h6: {
        ...Fonts.oswaldMedium,
        fontSize:   Fonts.h6.size,
        lineHeight: Fonts.h6.lineHeight,
        color:      Colors.primary.grey.hundredPercent,
        fontStyle:  'normal'
    },
    h7: {
        ...Fonts.oswaldMedium,
        fontSize:   Fonts.h7.size,
        lineHeight: Fonts.h7.lineHeight,
        color:      Colors.primary.grey.hundredPercent,
        fontStyle:  'normal'
    },
    oswaldExtraLight: {
        ...Fonts.oswaldExtraLight,
    },
    oswaldLight: {
        ...Fonts.oswaldLight,
    },
    oswaldRegular: {
        ...Fonts.oswaldRegular,
    },
    oswaldMedium: {
        ...Fonts.oswaldMedium,
    },
    oswaldSemiBold: {
        ...Fonts.oswaldSemiBold,
    },
    oswaldBold: {
        ...Fonts.oswaldBold,
    },
    oswaldHeavy: {
        ...Fonts.oswaldHeavy,
    },
    robotoThin: {
        ...Fonts.robotoThin,
    },
    robotoLight: {
        ...Fonts.robotoLight,
    },
    robotoRegular: {
        ...Fonts.robotoRegular,
    },
    robotoMedium: {
        ...Fonts.robotoMedium,
    },
    robotoBold: {
        ...Fonts.robotoBold,
    },
    robotoBlack: {
        ...Fonts.robotoBlack,
    },
    link: {
        textDecorationLine: 'underline',
        color:              Colors.secondary.blue.hundredPercent,
    },
    subtext: {
        ...Fonts.oswaldRegular,
        fontSize:   Fonts.base.size * 0.7,
        lineHeight: parseInt(Fonts.base.lineHeight * 0.8, 10),
        color:      Colors.primary.grey.hundredPercent,
    },

    // Helper Text Styles
    textCenterAligned: {
        textAlign: 'center',
    },
    textRightAligned: {
        textAlign: 'right',
    },
    textLeftAligned: {
        textAlign: 'left',
    },
    textBold: {
        ...Fonts.oswaldBold,
    },

    // Padding
    padding: {
        paddingVertical:   Sizes.padding,
        paddingHorizontal: Sizes.padding,
    },
    paddingLrg: {
        paddingVertical:   Sizes.paddingLrg,
        paddingHorizontal: Sizes.paddingLrg,
    },
    paddingXLrg: {
        paddingVertical:   Sizes.paddingXLrg,
        paddingHorizontal: Sizes.paddingXLrg,
    },
    paddingMed: {
        paddingVertical:   Sizes.paddingMed,
        paddingHorizontal: Sizes.paddingMed,
    },
    paddingHorizontal: {
        paddingHorizontal: Sizes.padding,
    },
    paddingLeft: {
        paddingLeft: Sizes.padding,
    },
    paddingRight: {
        paddingRight: Sizes.padding,
    },
    paddingVertical: {
        paddingVertical: Sizes.padding,
    },
    paddingTop: {
        paddingTop: Sizes.padding,
    },
    paddingBottom: {
        paddingBottom: Sizes.padding,
    },
    paddingSml: {
        paddingVertical:   Sizes.paddingSml,
        paddingHorizontal: Sizes.paddingSml,
    },
    paddingHorizontalSml: {
        paddingHorizontal: Sizes.paddingSml,
    },
    paddingHorizontalMed: {
        paddingHorizontal: Sizes.paddingMed,
    },
    paddingLeftSml: {
        paddingLeft: Sizes.paddingSml,
    },
    paddingRightSml: {
        paddingRight: Sizes.paddingSml,
    },
    paddingVerticalSml: {
        paddingVertical: Sizes.paddingSml,
    },
    paddingVerticalXSml: {
        paddingVertical: Sizes.paddingXSml,
    },
    paddingVerticalMed: {
        paddingVertical: Sizes.paddingMed,
    },
    paddingTopSml: {
        paddingTop: Sizes.paddingSml,
    },
    paddingTopXLrg: {
        paddingTop: Sizes.paddingXLrg,
    },
    paddingBottomSml: {
        paddingBottom: Sizes.paddingSml,
    },
    paddingVerticalLrg: {
        paddingVertical: Sizes.paddingLrg,
    },
    paddingHorizontalLrg: {
        paddingHorizontal: Sizes.paddingLrg,
    },
    paddingVerticalXLrg: {
        paddingVertical: Sizes.paddingXLrg,
    },
    paddingHorizontalXLrg: {
        paddingHorizontal: Sizes.paddingXLrg,
    },

    // General HTML-like Elements
    hr: {
        left:              0,
        right:             0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        height:            1,
        backgroundColor:   'transparent',
        marginTop:         Sizes.padding,
        marginBottom:      Sizes.padding,
    },

    // Grid/Flexbox
    row: {
        left:          0,
        right:         0,
        flexDirection: 'row',
    },
    flex1: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },
    flex3: {
        flex: 3,
    },
    flex4: {
        flex: 4,
    },
    flex5: {
        flex: 5,
    },
    flex6: {
        flex: 6,
    },
    flex7: {
        flex: 7,
    },

    // Navbar
    navbar: {
        backgroundColor:   Colors.secondary.blue.hundredPercent,
        borderBottomColor: Colors.primary.grey.thirtyPercent,
        borderBottomWidth: 1,
        justifyContent:    'center',
    },
    navbarTitle: {
        ...Fonts.oswaldBold,
        color:     Colors.white,
        fontSize:  Fonts.base.size+5,
        alignSelf: 'center',
    },
    navbarButton: {
        tintColor: Colors.white,
    },
    navbarImageTitle: {
        height:     Sizes.navbarHeight/(Platform.OS === 'ios' ? 1.8 : 1.5),
        resizeMode: 'contain',
        // marginTop:  (Sizes.navbarHeight - (Sizes.navbarHeight/(Platform.OS === 'ios' ? 1.8 : 1.5))) / 2,
    },

    // TabBar
    tabHeaders: {
        ...Fonts.oswaldMedium,
        fontSize:   Fonts.base.size,
        fontStyle:  'normal',
        lineHeight: Fonts.lineHeight(20),
        textAlign:  'center',
    },
    indicatorContainerStyles: {
        height:         Fonts.lineHeight(20),
        justifyContent: 'flex-start',
    },
    leftTabBar: {
        alignItems:     'center',
        height:         Sizes.tabbarHeight,
        justifyContent: 'center',
    },
    centerTabBar: {
        alignItems:     'center',
        height:         Sizes.tabbarHeight,
        justifyContent: 'center',
    },
    rightTabBar: {
        alignItems:     'center',
        height:         Sizes.tabbarHeight,
        justifyContent: 'center',
    },

    // Radial Menu
    radialMenu: {
        justifyContent: 'center',
        alignItems:     'center',
        height:         Sizes.screen.height,
        width:          Sizes.screen.width,
    },

    deleteButton: {
        justifyContent:  'center',
        flex:            1,
        backgroundColor: Colors.secondary.red.hundredPercent,
    },
    editButton: {
        justifyContent:  'center',
        flex:            1,
        backgroundColor: Colors.primary.yellow.hundredPercent,
    },

    // Activity Indicator
    activityIndicator: {
        alignItems:     'center',
        bottom:         0,
        height:         (Sizes.screen.height - (Sizes.navbarHeight + Sizes.statusBarHeight + Sizes.tabbarHeight)),
        justifyContent: 'center',
        left:           0,
        position:       'absolute',
        right:          0,
        top:            0,
    },
    continueButton: {
        ...Fonts.oswaldBold,
        backgroundColor:    Colors.transparent,
        color:              Colors.primary.yellow.hundredPercent,
        paddingLeft:        20,
        textDecorationLine: 'none',
    },
    nextButtonText: {
        ...Fonts.robotoRegular,
        color:         Colors.white,
        fontSize:      Fonts.scaleFont(16),
        paddingBottom: 20,
        paddingTop:    20,
    },
    nextButtonWrapper: {
        alignItems:      'center',
        backgroundColor: Colors.primary.yellow.hundredPercent,
        justifyContent:  'center',
        // width:           Sizes.screen.width,
    },

    // misc survey styles
    sorenessPainValues: {
        alignSelf:      'center',
        borderRadius:   35 / 2,
        height:         35,
        justifyContent: 'center',
        width:          35,
    },
    sorenessPainValuesLrg: {
        alignSelf:      'center',
        borderRadius:   45 / 2,
        height:         45,
        justifyContent: 'center',
        width:          45,
    },
    sorenessPainButtons: {
        alignSelf:      'center',
        borderRadius:   65 / 2,
        height:         65,
        justifyContent: 'center',
        width:          65,
    },
    backNextCircleButtons: {
        alignSelf:      'center',
        borderRadius:   Sizes.backNextButtonsHeight / 2,
        height:         Sizes.backNextButtonsHeight,
        justifyContent: 'center',
        width:          Sizes.backNextButtonsHeight,
    },
    allGoodBtn: {
        alignSelf:      'center',
        borderRadius:   100 / 2,
        borderWidth:    2,
        height:         100,
        justifyContent: 'center',
        width:          100,
    },
    xLrgCircle: {
        alignSelf:      'center',
        borderRadius:   75 / 2,
        height:         75,
        justifyContent: 'center',
        width:          75,
    },
    xxLrgCircle: {
        alignSelf:      'center',
        borderRadius:   100 / 2,
        height:         100,
        justifyContent: 'center',
        width:          100,
    },

    // shadow
    modalShadowEffect: {
        shadowColor:   Colors.zeplin.darkNavy,
        shadowOffset:  { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius:  20,
    },
    scaleButtonShadowEffect: {
        elevation:     2,
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { height: 3, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  6,
    },

    buttonVerticalPadding: {
        paddingBottom: Sizes.isIphoneX ? ((Sizes.iphoneXBottomBarPadding + Sizes.paddingMed) / 2) : Sizes.paddingMed,
        paddingTop:    Sizes.isIphoneX ? ((Sizes.iphoneXBottomBarPadding + Sizes.paddingMed) / 2) : Sizes.paddingMed,
    },

    onboardingInputContainer: {
        backgroundColor:   Colors.zeplin.splashLight,
        borderBottomColor: 'red',
        borderBottomWidth: 0,
        borderRadius:      Sizes.paddingLrg,
        elevation:         2,
        marginBottom:      Sizes.paddingMed,
        marginLeft:        Sizes.padding,
        marginRight:       Sizes.padding,
        shadowColor:       'rgba(0, 0, 0, 0.16)',
        shadowOffset:      { height: 3, width: 0, },
        shadowOpacity:     1,
        shadowRadius:      6,
        width:             (Sizes.screen.widthFourFifths + Sizes.padding),
    },
    onboardingInputStyle: {
        color:           Colors.white,
        fontSize:        Fonts.scaleFont(20),
        paddingVertical: Sizes.paddingMed,
    },
};
