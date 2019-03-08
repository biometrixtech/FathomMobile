module.exports = {
    bail:              true,
    collectCoverage:   false,
    coverageDirectory: '__coverage__',
    preset:            'react-native',
    setupFiles:        [
        '<rootDir>/jest.setup.js'
    ],
    testRegex:               '/__sysTests__/*.*test.js$',
    transformIgnorePatterns: [
        'node_modules/(?!react-native|tcomb-form-native|apsl-react-native-button|react-clone-referenced-element|react-navigation|redux-persist|react-native-vector-icons|rn-apple-healthkit)'
    ],
    verbose: true,
};