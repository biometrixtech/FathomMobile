/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:20:06
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-30 04:09:53
 */

/**
 * App Theme - Colors
 */

const app = {
    transparent: 'rgba(0,0,0,0)',
    white:       '#FFFFFF',
    black:       '#000000',
    red:         '#FF0000',
    green:       '#00FF00',
    blue:        '#0000FF',
};

const brand = {
    primary: {
        // Smokey Grey
        grey: {
            hundredPercent: '#505050',
            fiftyPercent:   '#757575',
            thirtyPercent:  '#D5D5D5',
            twentyPercent:  '#F5F5F5',
        },
        // Medal Gold
        yellow: {
            hundredPercent: '#EBBA2D',
            seventyPercent: '#FFED60',
            fiftyPercent:   '#FFFFAC',
        },
        // Finish Line White
        white: {
            hundredPercent: '#F7F7F7',
        }
    },
    secondary: {
        // Blood Sweet & Tears
        red: {
            hundredPercent: '#972C2F',
            eightyPercent:  '#A44648',
            seventyPercent: '#B66B6D',
            fiftyPercent:   '#CB9597',
        },
        // Imagine Blue
        light_blue: {
            hundredPercent: '#E6F5F7',
            seventyPercent: '#EDF8F9',
            fiftyPercent:   '#F3FAFB',
        },
        // Fathom Blue
        blue: {
            hundredPercent: '#0B587C',
            eightyPercent:  '#17678B',
            seventyPercent: '#548AA3',
            fiftyPercent:   '#85ACBE',
            thirtyPercent:  '#B6CDD8',
        },
    },
    gradient: {
        blue: {
            gradientStart: '#05425e',
            gradientEnd:   '#0f6187',
        },
        light_blue: {
            gradientStart: '#97b3c0',
            gradientEnd:   '#FFFFFF',
        }
    }
};

const sliders = {
    slider: [
        brand.primary.yellow.hundredPercent, // 0
        brand.secondary.blue.fiftyPercent, // 1
        brand.secondary.blue.seventyPercent, // 2
        brand.secondary.blue.eightyPercent, // 3
        brand.secondary.red.seventyPercent, // 4
        brand.secondary.red.eightyPercent, // 5
    ]
}

const borders = {
    border: '#E3E3E3',
};

const tabbar = {
    activeTabText:   '#2B2B2B',
    inactiveTabText: '#2B2B2B4D', // 30% opacity
    tabbar:          {
        background:   app.white,
        iconDefault:  '#BABDC2',
        iconSelected: brand.secondary.blue.hundredPercent,
    },
};

const zeplin = {
    blueBackground: '#183C4D', // 24, 60, 77
    darkBlue:       '#081832', // 8, 24, 50
    darkGrey:       '#2B2B2B', // 43, 43, 43
    darkGreyText:   '#868686', // 134, 134, 134
    error:          '#C8432A', // 200, 67, 42
    green:          '#0B7B88',
    greyText:       '#B2B2B2', // 178, 178, 178
    iconCircle:     '#AFAFAF',
    lightGrey:      '#D5D5D5', // 213, 213, 213
    mediumGrey:     '#707070', // 112, 112, 112
    navyBlue:       '#0E0822', // 14, 8, 34
    shadow:         '#e4e4e4',
    scaleButton:    '#E2E2E2',
    success:        '#5EB123',
    warning:        '#EBBA2D',
}

const alerts = {
    errorBackground:   '#972C2F',
    statusBackground:  '#1E6789',
    successBackground: '#59DC9A',
}

const sensor = {
    charging:               brand.primary.yellow.hundredPercent,
    chargingBackground:     '#1E6789',
    good:                   '#2E7D32',
    notConnected:           '#BABABA',
    notConnectedBackground: '#081831',
    unabled:                '#0277BD',
    wrongKit:               '#972C2F',
}

export default {
    ...app,
    ...borders,
    ...brand,
    ...sliders,
    ...tabbar,
    alerts,
    sensor,
    zeplin,
};
