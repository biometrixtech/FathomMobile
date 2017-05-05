Object.defineProperty(exports, "__esModule", {
    value: true
});

var _colors = require('./colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var _fonts = require('./fonts');

var _fonts2 = babelHelpers.interopRequireDefault(_fonts);

var _sizes = require('./sizes');

var _sizes2 = babelHelpers.interopRequireDefault(_sizes);

exports.default = {
    appContainer: {
        backgroundColor: _colors2.default.background
    },

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: _colors2.default.background
    },
    containerCentered: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    windowSize: {
        height: _sizes2.default.screen.height,
        width: _sizes2.default.screen.width
    },

    leftAligned: {
        alignItems: 'flex-start'
    },
    rightAligned: {
        alignItems: 'flex-end'
    },

    baseText: {
        fontFamily: _fonts2.default.base.family,
        fontSize: _fonts2.default.base.size,
        lineHeight: _fonts2.default.base.lineHeight,
        color: _colors2.default.textPrimary,
        fontWeight: '500'
    },
    p: {
        fontFamily: _fonts2.default.base.family,
        fontSize: _fonts2.default.base.size,
        lineHeight: _fonts2.default.base.lineHeight,
        color: _colors2.default.textPrimary,
        fontWeight: '500',
        marginBottom: 8
    },
    h0: {
        fontFamily: _fonts2.default.h0.family,
        fontSize: _fonts2.default.h0.size,
        lineHeight: _fonts2.default.h0.lineHeight,
        color: _colors2.default.headingPrimary,
        fontWeight: '800',
        margin: 0,
        marginBottom: 4,
        left: 0,
        right: 0
    },
    h1: {
        fontFamily: _fonts2.default.h1.family,
        fontSize: _fonts2.default.h1.size,
        lineHeight: _fonts2.default.h1.lineHeight,
        color: _colors2.default.headingPrimary,
        fontWeight: '800',
        margin: 0,
        marginBottom: 4,
        left: 0,
        right: 0
    },
    h2: {
        fontFamily: _fonts2.default.h2.family,
        fontSize: _fonts2.default.h2.size,
        lineHeight: _fonts2.default.h2.lineHeight,
        color: _colors2.default.headingPrimary,
        fontWeight: '800',
        margin: 0,
        marginBottom: 4,
        left: 0,
        right: 0
    },
    h3: {
        fontFamily: _fonts2.default.h3.family,
        fontSize: _fonts2.default.h3.size,
        lineHeight: _fonts2.default.h3.lineHeight,
        color: _colors2.default.headingPrimary,
        fontWeight: '500',
        margin: 0,
        marginBottom: 4,
        left: 0,
        right: 0
    },
    h4: {
        fontFamily: _fonts2.default.h4.family,
        fontSize: _fonts2.default.h4.size,
        lineHeight: _fonts2.default.h4.lineHeight,
        color: _colors2.default.headingPrimary,
        fontWeight: '800',
        margin: 0,
        marginBottom: 4,
        left: 0,
        right: 0
    },
    h5: {
        fontFamily: _fonts2.default.h5.family,
        fontSize: _fonts2.default.h5.size,
        lineHeight: _fonts2.default.h5.lineHeight,
        color: _colors2.default.headingPrimary,
        fontWeight: '800',
        margin: 0,
        marginTop: 4,
        marginBottom: 4,
        left: 0,
        right: 0
    },
    strong: {
        fontWeight: '900'
    },
    link: {
        textDecorationLine: 'underline',
        color: _colors2.default.brand.primary
    },
    subtext: {
        fontFamily: _fonts2.default.base.family,
        fontSize: _fonts2.default.base.size * 0.8,
        lineHeight: parseInt(_fonts2.default.base.lineHeight * 0.8, 10),
        color: _colors2.default.textSecondary,
        fontWeight: '500'
    },

    textCenterAligned: {
        textAlign: 'center'
    },
    textRightAligned: {
        textAlign: 'right'
    },

    padding: {
        paddingVertical: _sizes2.default.padding,
        paddingHorizontal: _sizes2.default.padding
    },
    paddingHorizontal: {
        paddingHorizontal: _sizes2.default.padding
    },
    paddingLeft: {
        paddingLeft: _sizes2.default.padding
    },
    paddingRight: {
        paddingRight: _sizes2.default.padding
    },
    paddingVertical: {
        paddingVertical: _sizes2.default.padding
    },
    paddingTop: {
        paddingTop: _sizes2.default.padding
    },
    paddingBottom: {
        paddingBottom: _sizes2.default.padding
    },
    paddingSml: {
        paddingVertical: _sizes2.default.paddingSml,
        paddingHorizontal: _sizes2.default.paddingSml
    },
    paddingHorizontalSml: {
        paddingHorizontal: _sizes2.default.paddingSml
    },
    paddingLeftSml: {
        paddingLeft: _sizes2.default.paddingSml
    },
    paddingRightSml: {
        paddingRight: _sizes2.default.paddingSml
    },
    paddingVerticalSml: {
        paddingVertical: _sizes2.default.paddingSml
    },
    paddingTopSml: {
        paddingTop: _sizes2.default.paddingSml
    },
    paddingBottomSml: {
        paddingBottom: _sizes2.default.paddingSml
    },

    hr: {
        left: 0,
        right: 0,
        borderBottomWidth: 1,
        borderBottomColor: _colors2.default.border,
        height: 1,
        backgroundColor: 'transparent',
        marginTop: _sizes2.default.padding,
        marginBottom: _sizes2.default.padding
    },

    row: {
        left: 0,
        right: 0,
        flexDirection: 'row'
    },
    flex1: {
        flex: 1
    },
    flex2: {
        flex: 2
    },
    flex3: {
        flex: 3
    },
    flex4: {
        flex: 4
    },
    flex5: {
        flex: 5
    },
    flex6: {
        flex: 6
    },

    navbar: {
        backgroundColor: _colors2.default.transparent,
        borderBottomWidth: 0
    },
    navbarTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: _fonts2.default.base.family,
        fontSize: _fonts2.default.base.size + 2
    },
    navbarButton: {
        tintColor: '#FFFFFF'
    },

    tabbar: {
        backgroundColor: _colors2.default.tabbar.background,
        borderTopColor: _colors2.default.border,
        borderTopWidth: 1
    },

    radialMenu: {
        justifyContent: 'center',
        alignItems: 'center',
        height: _sizes2.default.screen.height,
        width: _sizes2.default.screen.width
    },

    deleteButton: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#FF0000'
    },
    editButton: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#00FF00'
    }
};