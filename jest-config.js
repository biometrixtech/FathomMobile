module.exports = {
    bail:              true,
    collectCoverage:   false,
    coverageDirectory: '__coverage__',
    preset:            'react-native',
    setupFiles:        [
        '<rootDir>/jest.setup.js',
        '<rootDir>/__mocks__/@react-native-community/async-storage/index.js',
        '<rootDir>/__mocks__/react-native-scrollable-tab-view.js'
    ],
    testMatch: [
        '**/__tests__/*.*test.[jt]s?(x)',
        './__tests__/*.*test.[jt]s?(x)'
    ],
    transformIgnorePatterns: [
        'node_modules/(?!react-native|tcomb-form-native|apsl-react-native-button|react-clone-referenced-element|react-navigation|redux-persist|react-native-vector-icons|rn-apple-healthkit|@react-native-community/async-storage|@react-native-community/push-notification-ios)',
        '/node_modules/@react-native-community/async-storage/(?!(lib))'
    ],
    verbose: false,
};