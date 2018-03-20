/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:19:33 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-14 19:16:17
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
        color:      Colors.brand.primary,
        fontWeight: '400',
        fontStyle:  'normal'
    },
    p: {
        fontFamily:   Fonts.base.family,
        fontSize:     Fonts.base.size,
        lineHeight:   Fonts.base.lineHeight,
        color:        Colors.brand.primary,
        fontWeight:   '400',
        fontStyle:    'normal',
        marginBottom: 8,
    },
    h0: {
        fontFamily:   Fonts.h0.family,
        fontSize:     Fonts.h0.size,
        lineHeight:   Fonts.h0.lineHeight,
        color:        Colors.brand.primary,
        fontWeight:   '800',
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
        color:        Colors.headingPrimary,
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
        color:        Colors.headingPrimary,
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
        color:        Colors.headingPrimary,
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
        color:        Colors.headingPrimary,
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
        color:        Colors.headingPrimary,
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
        fontWeight: '400',
        fontStyle:  'normal'
    },
    h7: {
        fontFamily: Fonts.h7.family,
        fontSize:   Fonts.h7.size,
        lineHeight: Fonts.h7.lineHeight,
        fontWeight: '400',
        fontStyle:  'normal'
    },
    strong: {
        fontWeight: '900',
    },
    link: {
        textDecorationLine: 'underline',
        color:              Colors.brand.primary,
    },
    subtext: {
        fontFamily: Fonts.base.family,
        fontSize:   Fonts.base.size * 0.8,
        lineHeight: parseInt(Fonts.base.lineHeight * 0.8, 10),
        color:      Colors.brand.primary,
        fontWeight: '400',
    },

    // Helper Text Styles
    textCenterAligned: {
        textAlign: 'center',
    },
    textRightAligned: {
        textAlign: 'right',
    },

    // Give me padding
    padding: {
        paddingVertical:   Sizes.padding,
        paddingHorizontal: Sizes.padding,
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
    paddingLeftSml: {
        paddingLeft: Sizes.paddingSml,
    },
    paddingRightSml: {
        paddingRight: Sizes.paddingSml,
    },
    paddingVerticalSml: {
        paddingVertical: Sizes.paddingSml,
    },
    paddingTopSml: {
        paddingTop: Sizes.paddingSml,
    },
    paddingBottomSml: {
        paddingBottom: Sizes.paddingSml,
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

    // Grid
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
        backgroundColor:   '#FFFFFF',
        borderBottomColor: Colors.shadowColor,
        borderBottomWidth: 1,
    },
    navbarTitle: {
        color:      '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: Fonts.base.family,
        fontSize:   Fonts.base.size+5,
    },
    navbarButton: {
        tintColor: Colors.brand.primary,
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
        paddingLeft:    Sizes.padding,
        paddingRight:   Sizes.padding,
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
        backgroundColor: Colors.brand.red,
    },
    editButton: {
        justifyContent:  'center',
        flex:            1,
        backgroundColor: Colors.brand.yellow,
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
    }
};
