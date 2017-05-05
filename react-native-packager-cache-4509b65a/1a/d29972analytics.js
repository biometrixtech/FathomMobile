Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactNativeGoogleAnalyticsBridge = require('react-native-google-analytics-bridge');

var _constants = require('@constants/');

var GoogleAnalytics = new _reactNativeGoogleAnalyticsBridge.GoogleAnalyticsTracker(_constants.AppConfig.gaTrackingId);

var track = function track(store) {
    return function (next) {
        return function (action) {
            switch (action.type) {
                case 'REACT_NATIVE_ROUTER_FLUX_FOCUS':
                    if (action && action.scene && action.scene.analyticsDesc) {
                        try {
                            var screenName = action.scene.title ? action.scene.analyticsDesc + ' - ' + action.scene.title : action.scene.analyticsDesc;

                            GoogleAnalytics.trackScreenView(screenName);
                        } catch (err) {
                            console.log(store);
                            console.log(err);
                        }
                    }
                    break;

                default:
            }
            return next(action);
        };
    };
};

exports.default = track;