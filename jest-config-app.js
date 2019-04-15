module.exports = {
    bail:              true,
    collectCoverage:   false,
    coverageDirectory: '__coverage__',
    preset:            'react-native',
    setupFiles:        [
        '<rootDir>/jest.setup.js',
        '<rootDir>/__mocks__/@react-native-community/async-storage/index.js',
        '<rootDir>/__mocks__/react-native-google-analytics-bridge.js',
        '<rootDir>/__mocks__/react-native-scrollable-tab-view.js'
    ],
    testMatch: [
        '<rootDir>/__appTests__/*.*test.[jt]s?(x)'
    ],
    transformIgnorePatterns: [
        'node_modules/(?!react-native|tcomb-form-native|apsl-react-native-button|react-clone-referenced-element|react-navigation|redux-persist|react-native-vector-icons|rn-apple-healthkit|@react-native-community/async-storage)',
        '/node_modules/@react-native-community/async-storage/(?!(lib))'
    ],
    verbose: false,
};