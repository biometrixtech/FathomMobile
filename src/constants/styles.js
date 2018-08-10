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
    tabHeaders: {
        ...Fonts.oswaldMedium,
        fontSize:   Fonts.base.size,
        lineHeight: Fonts.lineHeight(20),
        fontStyle:  'normal'
    },
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
        height:       Sizes.navbarHeight/(Platform.OS === 'ios' ? 1.8 : 1.5),
        resizeMode:   'contain',
        flex:         1,
        marginBottom: Platform.OS === 'ios' ? 6 : 0
    },

    // TabBar
    tabbar: {
        height:         Sizes.tabbarHeight,
        width:          Sizes.screen.widthThreeQuarters,
        alignItems:     'flex-end',
        justifyContent: 'center',
    },
    leftTabBar: {
        height:         Sizes.tabbarHeight,
        paddingRight:   Sizes.padding * (Platform.OS === 'ios' ? 3 : 3.2),
        alignItems:     'flex-end',
        justifyContent: 'center',
        // width:          Sizes.screen.widthThreeQuarters,
    },
    centerTabBar: {
        height:         Sizes.tabbarHeight,
        alignItems:     'center',
        justifyContent: 'center',
        paddingLeft:    Sizes.padding * (Platform.OS === 'ios' ? 0.2 : 0.3),
        // width:          Sizes.screen.widthHalf,
    },
    rightTabBar: {
        height:         Sizes.tabbarHeight,
        alignItems:     'flex-start',
        justifyContent: 'center',
        paddingLeft:    Sizes.padding * (Platform.OS === 'ios' ? 3.1 : 3.3),
        // width:          Sizes.screen.widthThreeQuarters,
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
        position:       'absolute',
        left:           0,
        right:          0,
        top:            0,
        bottom:         0,
        alignItems:     'center',
        justifyContent: 'center'
    },
    continueButton: {
        ...Fonts.oswaldBold,
        backgroundColor:    Colors.transparent,
        color:              Colors.primary.yellow.hundredPercent,
        paddingLeft:        20,
        textDecorationLine: 'none',
    },
    nextButtonText: {
        ...Fonts.oswaldBold,
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
    }
};
