/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:19:33
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-12 19:05:28
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
        fontFamily: Fonts.base.family,
        fontSize:   Fonts.base.size,
        lineHeight: Fonts.base.lineHeight,
        fontWeight: '400',
        fontStyle:  'normal'
    },
    baseText: {
        fontFamily: Fonts.base.family,
        fontSize:   Fonts.base.size,
        lineHeight: Fonts.base.lineHeight,
        color:      Colors.primary.grey.fiftyPercent,
        fontWeight: '400',
        fontStyle:  'normal'
    },
    p: {
        fontFamily:   Fonts.base.family,
        fontSize:     Fonts.base.size,
        lineHeight:   Fonts.base.lineHeight,
        color:        Colors.primary.grey.fiftyPercent,
        fontWeight:   '400',
        fontStyle:    'normal',
        marginBottom: 8,
    },
    h0: {
        fontFamily:   Fonts.h0.family,
        fontSize:     Fonts.h0.size,
        lineHeight:   Fonts.h0.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontWeight:   '400',
        fontStyle:    'normal',
        margin:       0,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h1: {
        fontFamily:   Fonts.h1.family,
        fontSize:     Fonts.h1.size,
        lineHeight:   Fonts.h1.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontWeight:   '800',
        fontStyle:    'normal',
        margin:       0,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h2: {
        fontFamily:   Fonts.h2.family,
        fontSize:     Fonts.h2.size,
        lineHeight:   Fonts.h2.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontWeight:   '800',
        fontStyle:    'normal',
        margin:       0,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h3: {
        fontFamily:   Fonts.h3.family,
        fontSize:     Fonts.h3.size,
        lineHeight:   Fonts.h3.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontWeight:   '400',
        fontStyle:    'normal',
        margin:       0,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h4: {
        fontFamily:   Fonts.h4.family,
        fontSize:     Fonts.h4.size,
        lineHeight:   Fonts.h4.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontWeight:   '800',
        fontStyle:    'normal',
        margin:       0,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h5: {
        fontFamily:   Fonts.h5.family,
        fontSize:     Fonts.h5.size,
        lineHeight:   Fonts.h5.lineHeight,
        color:        Colors.primary.grey.hundredPercent,
        fontWeight:   '800',
        fontStyle:    'normal',
        margin:       0,
        marginTop:    4,
        marginBottom: 4,
        left:         0,
        right:        0,
    },
    h6: {
        fontFamily: Fonts.h6.family,
        fontSize:   Fonts.h6.size,
        lineHeight: Fonts.h6.lineHeight,
        color:      Colors.primary.grey.hundredPercent,
        fontWeight: '400',
        fontStyle:  'normal'
    },
    h7: {
        fontFamily: Fonts.h7.family,
        fontSize:   Fonts.h7.size,
        lineHeight: Fonts.h7.lineHeight,
        color:      Colors.primary.grey.hundredPercent,
        fontWeight: '400',
        fontStyle:  'normal'
    },
    thin: {
        fontWeight: '100',
    },
    ultra_light: {
        fontWeight: '200',
    },
    light: {
        fontWeight: '300',
    },
    regular: {
        fontWeight: '400',
    },
    medium: {
        fontWeight: '500',
    },
    semibold: {
        fontWeight: '600',
    },
    bold: {
        fontWeight: '700',
    },
    heavy: {
        fontWeight: '800',
    },
    strong: {
        fontWeight: '900',
    },
    link: {
        textDecorationLine: 'underline',
        color:              Colors.secondary.blue.hundredPercent,
    },
    subtext: {
        fontFamily: Fonts.base.family,
        fontSize:   Fonts.base.size * 0.7,
        lineHeight: parseInt(Fonts.base.lineHeight * 0.8, 10),
        color:      Colors.primary.grey.hundredPercent,
        fontWeight: '400',
    },

    // Helper Text Styles
    textCenterAligned: {
        textAlign: 'center',
    },
    textRightAligned: {
        textAlign: 'right',
    },
    textBold: {
        fontWeight: 'bold',
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
        color:      Colors.white,
        fontWeight: 'bold',
        fontFamily: Fonts.base.family,
        fontSize:   Fonts.base.size+5,
        alignSelf:  'center',
    },
    navbarButton: {
        tintColor: Colors.white,
    },
    navbarImageTitle: {
        height:      Sizes.navbarHeight/(Platform.OS === 'ios' ? 1.8 : 1.5),
        resizeMode:  'contain',
        bottom:      Platform.OS === 'ios' ? 10 : 6,
        marginRight: 10,
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
        width:          Sizes.screen.widthThreeQuarters,
        alignItems:     'flex-end',
        justifyContent: 'center',
    },
    centerTabBar: {
        height:         Sizes.tabbarHeight,
        width:          Sizes.screen.widthHalf,
        alignItems:     'center',
        justifyContent: 'center',
    },
    rightTabBar: {
        height:         Sizes.tabbarHeight,
        width:          Sizes.screen.widthThreeQuarters,
        alignItems:     'flex-start',
        justifyContent: 'center',
        paddingLeft:    Sizes.padding * 1.75,
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
        backgroundColor:    Colors.transparent,
        color:              Colors.primary.yellow.hundredPercent,
        fontWeight:         'bold',
        paddingLeft:        20,
        textDecorationLine: 'none',
    },
    nextButtonText: {
        color:         Colors.white,
        fontWeight:    'bold',
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
