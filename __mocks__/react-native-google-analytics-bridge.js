/* global jest */
export const GoogleAnalyticsTracker = jest.fn().mockImplementation(() => {
    return {
        setAppName:      jest.fn(),
        setAppVersion:   jest.fn(),
        setUser:         jest.fn(),
        trackEvent:      jest.fn(),
        trackScreenView: jest.fn(),
    };
});