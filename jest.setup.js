/* global jest fetch */

let mockFn = jest.fn();

// run thrid-party libraries mock
jest.mock('react-native-fabric', () => {
    return {
        Answers: {
            logContentView: mockFn,
            logCustom:      mockFn,
        },
        Crashlytics: {
            crash: mockFn,
        },
    }
});

jest.mock('react-native-splash-screen', () => {
    return {
        hide: mockFn,
    }
});

jest.mock('react-native-google-analytics-bridge', () => 'GoogleAnalyticsTracker');

jest.mock('rn-sliding-up-panel', () => 'SlidingUpPanel');

jest.mock('redux-persist/lib/storage', () => {
    return {
        storage: mockFn,
    };
});

// run react-native modules libraries mock
jest.mock('NativeModules', () => {
    return {
        BleManager: mockFn,
    };
});

jest.mock('PushNotificationIOS', () => ({
    addEventListener:   mockFn,
    requestPermissions: mockFn,
}));

jest.mock('Linking', () => {
    return {
        addEventListener:    mockFn,
        canOpenURL:          mockFn,
        getInitialURL:       mockFn,
        openURL:             mockFn,
        removeEventListener: mockFn,
    };
});

jest.mock('Keyboard', () => {
    return {
        addListener: mockFn,
        dismiss:     mockFn,
    };
});

jest.mock('NativeAnimatedHelper');

// Mocking the global.fetch included in React Native
global.fetch = mockFn;

// Helper to mock a success response (only once)
fetch.mockResponseSuccess = body => {
    fetch.mockImplementationOnce(
        () => Promise.resolve({ json: () => Promise.resolve(JSON.parse(body)) }),
    );
};

// Helper to mock a failure response (only once)
fetch.mockResponseFailure = error => {
    fetch.mockImplementationOnce(
        () => Promise.reject(error),
    );
};
