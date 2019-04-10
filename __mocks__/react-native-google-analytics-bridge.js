/* global jest */
export const GoogleAnalyticsTracker = jest.fn().mockImplementation(() => {
    return {
        setAppVersion:   jest.fn(),
        setUser:         jest.fn(),
        trackScreenView: jest.fn(),
        trackEvent:      jest.fn(),
    };
});