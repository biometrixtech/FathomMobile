/**
 * App Theme - Colors
 */

const app = {
    background:         '#888888',
    cardBackground:     '#FFFFFF',
    listItemBackground: '#FFFFFF',
    transparent:        'rgba(0,0,0,0)',
    red:                '#FF0000',
};

const brand = {
    brand: {
        primary:   '#177896', // Blue: #177896, Red: #8e223a, Old: #0E4EF8
        secondary: '#888888', // Grey: #5a5a5a, Old: #17233D
        red:       '#8E223A',
    },
};

const text = {
    textPrimary:      '#222222',
    textSecondary:    '#777777',
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
