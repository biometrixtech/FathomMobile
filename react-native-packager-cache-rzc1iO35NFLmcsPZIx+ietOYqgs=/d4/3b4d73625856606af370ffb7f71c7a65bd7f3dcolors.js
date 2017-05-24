Object.defineProperty(exports, "__esModule", {
    value: true
});


var app = {
    background: '#FFFFFF',
    cardBackground: '#FFFFFF',
    listItemBackground: '#FFFFFF',
    transparent: 'rgba(0,0,0,0)',
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    lightGrey: '#E0E0E0'
};

var brand = {
    brand: {
        primary: '#177896',
        secondary: '#888888',
        red: '#8E223A'
    }
};

var text = {
    textPrimary: '#222222',
    textSecondary: '#777777',
    headingPrimary: brand.brand.primary,
    headingSecondary: brand.brand.primary
};

var borders = {
    border: '#D0D1D5'
};

var tabbar = {
    tabbar: {
        background: '#ffffff',
        iconDefault: '#BABDC2',
        iconSelected: brand.brand.primary
    }
};

exports.default = babelHelpers.extends({}, app, brand, text, borders, tabbar);