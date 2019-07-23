/* global jest fetch */

// import required third-party libraries
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// setup consts
const middlewares = [thunk]; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
let mockFn = jest.fn();

// run reducer mock
jest.mock('./src/store', () => {
    let bleStore = {
        accessoryData: { sensor_pid: '', mobile_udid: '', },
        bluetoothOn:   false,
        systemStatus:  0,
    };
    let initStore = { environment: 'TEST', };
    let planStore = { dailyPlan: [], };
    let userStore = { id: '', };
    return {
        store: mockStore({
            ble:  bleStore,
            init: initStore,
            plan: planStore,
            user: userStore,
        }),
    };
});

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

jest.mock('redux-persist/lib/storage', () => {
    return {
        storage: mockFn,
    };
});

jest.mock('react-native-router-flux', () => {
    return {
        Actions: {
            currentParams: {
                onLeft: mockFn,
            },
        },
    };
});

jest.mock('rn-sliding-up-panel', () => 'SlidingUpPanel');

jest.mock('react-native-scrollable-tab-view', () => 'NativeAnimatedHelper');

jest.mock('react-native-device-info', () => 'DeviceInfo');

jest.mock('react-native-sound', () => {
    return {
        IsAndroid:   false,
        MAIN_BUNDLE: '',
        setCategory: mockFn,
    };
});

// run react-native modules libraries mock
jest.mock('NativeModules', () => {
    return {
        BleManager: {
            addListener: mockFn,
            checkState:  mockFn,
        },
        bleManager: {},
    };
});

jest.mock('PushNotificationIOS', () => {
    return {
        addEventListener:   mockFn,
        requestPermissions: mockFn,
    };
});

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

jest.mock('StatusBar', () => {
    return {
        setBarStyle: mockFn,
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
