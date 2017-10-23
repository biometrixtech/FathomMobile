/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:20:06 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-17 01:39:56
 */

/**
 * App Theme - Colors
 */

const app = {
    background:         '#FFFFFF',
    cardBackground:     '#FFFFFF',
    listItemBackground: '#FFFFFF',
    transparent:        'rgba(0,0,0,0)',
    red:                '#FF0000',
    green:              '#00FF00',
    blue:               '#0000FF',
    lightGrey:          '#E0E0E0',
    shadowColor:        '#C8C8C8'
};

const brand = {
    brand: {
        primary: '#0b587c', // Blue: #177896, Red: #8e223a, Old: #0E4EF8, Blue(Jasmine): #0b587c
        red:     '#972c2f',
        yellow:  '#e0af12',
        blue:    '#0b587c',
        grey:    '#dee1e9',
        light:   '#ebf5f7',
        fogGrey: '#c8c8c8',
        skyGrey: '#f0f0f0'
    },
};

const text = {
    textPrimary:      '#222222',
    textSecondary:    '#777777',
    greyText:         '#8a8a8a',
    headingPrimary:   brand.brand.primary,
    headingSecondary: brand.brand.primary,
};

const borders = {
    border: '#D0D1D5',
};

const tabbar = {
    tabbar: {
        background:   '#ffffff',
        iconDefault:  '#BABDC2',
        iconSelected: brand.brand.primary,
    },
};

export default {
    ...app,
    ...brand,
    ...text,
    ...borders,
    ...tabbar,
};
