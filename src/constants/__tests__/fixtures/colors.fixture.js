/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:20:06 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-12 19:01:34
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
    border: brand.primary.grey.hundredPercent,
};

const tabbar = {
    tabbar: {
        background:   app.white,
        iconDefault:  '#BABDC2',
        iconSelected: brand.secondary.blue.hundredPercent,
    },
};

export default {
    ...app,
    ...borders,
    ...brand,
    ...sliders,
    ...tabbar,
};
