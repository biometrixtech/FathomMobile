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
    darkNavy:      '#0F1320',
    error:         '#EA6F4A',
    errorLight:    '#EE8B6E',
    navy:          '#081832',
    purpleLight:   '#CBB9D8',
    slate:         '#757D8A',
    slateLight:    '#ADB1B7',
    slateXLight:   '#E2E4E6',
    splash:        '#40A8B4',
    splashDark:    '#288994',
    splashLight:   '#70BEC7',
    splashXLight:  '#B7DEE3',
    splashXXLight: '#E9F5F6',
    success:       '#4EC1A6',
    successLight:  '#71CDB7',
    superLight:    '#F5F5F5',
    warning:       '#EDA14A',
    warningLight:  '#F1B877',
    yellow:        '#EBBA2D',
    yellowLight:   '#EEC756',
}

const bodyOverlay = {
    painMild:       '#F6C5B6',
    painMod:        '#F2A892',
    painSevere:     zeplin.errorLight,
    sorenessMild:   '#F8DBBA',
    sorenessMod:    '#F4CA99',
    sorenessSevere: zeplin.warningLight,
}

const alerts = {
    errorBackground:   zeplin.error,
    statusBackground:  zeplin.splash,
    successBackground: zeplin.success,
}

const sensor = {
    charging:               zeplin.yellow,
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
    bodyOverlay,
    sensor,
    zeplin,
};
