/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:17:54
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-09 00:58:36
 */

/* global jest fetch */

jest.mock('react-native-fabric', () => {
    return {
        Answers: {
            logContentView: () => {},
            logCustom:      () => {},
        },
        Crashlytics: {
            crash: () => {},
        },
    }
});

jest.mock('NativeModules', () => {
    return {
        BleManager: jest.fn(),
    };
});

jest.mock('redux-persist/lib/storage', () => {
    return {
        storage: jest.fn(),
    };
});

jest.mock('PushNotificationIOS', () => ({
    addEventListener:   jest.fn(),
    requestPermissions: jest.fn(),
}));

jest.mock('Linking', () =>{
    return {
        addEventListener:    jest.fn(),
        canOpenURL:          jest.fn(),
        getInitialURL:       jest.fn(),
        openURL:             jest.fn(),
        removeEventListener: jest.fn(),
    };
});

// jest.mock('react-native-fabric', () => {
//     return {
//         Crashlytics: {
//             crash: () => {},
//         },
//         Answers: {
//             logCustom:      () => {},
//             logContentView: () => {},
//         }
//     }
// });

// jest.mock('WebView', () => 'WebView');
// jest.mock('DatePickerIOS', () => 'DatePickerIOS');
// jest.mock('react-native-scrollable-tab-view', () => 'RNScrollableTabView');

// Mocking the global.fetch included in React Native
global.fetch = jest.fn();

// Helper to mock a success response (only once)
// fetch.mockResponseSuccess = (body) => {
//     fetch.mockImplementationOnce(
//         () => Promise.resolve({ json: () => Promise.resolve(JSON.parse(body)) }),
//     );
// };

// Helper to mock a failure response (only once)
// fetch.mockResponseFailure = (error) => {
//     fetch.mockImplementationOnce(
//         () => Promise.reject(error),
//     );
// };
