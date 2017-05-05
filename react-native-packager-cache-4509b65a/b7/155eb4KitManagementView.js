Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeElements = require('react-native-elements');

var _reactNativeRadialMenu = require('react-native-radial-menu');

var _reactNativeRadialMenu2 = babelHelpers.interopRequireDefault(_reactNativeRadialMenu);

var _reactNativeBleManager = require('react-native-ble-manager');

var _reactNativeBleManager2 = babelHelpers.interopRequireDefault(_reactNativeBleManager);

var _theme = require('@theme/');

var _ui = require('@ui/');

var KitManagementView = function (_Component) {
    babelHelpers.inherits(KitManagementView, _Component);

    function KitManagementView(props) {
        babelHelpers.classCallCheck(this, KitManagementView);

        var _this = babelHelpers.possibleConstructorReturn(this, (KitManagementView.__proto__ || Object.getPrototypeOf(KitManagementView)).call(this, props));

        _this.componentDidMount = function () {
            _reactNativeBleManager2.default.start({ showAlert: true });
            _this.handleDiscoverPeripheral = _this.handleDiscoverPeripheral.bind(_this);
            _this.handleBleStateChange = _this.handleBleStateChange.bind(_this);

            _reactNative.NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', _this.handleDiscoverPeripheral);
            _reactNative.NativeAppEventEmitter.addListener('BleManagerDidUpdateState', _this.handleBleStateChange);

            if (_reactNative.Platform.OS === 'android' && _reactNative.Platform.Version >= 23) {
                _reactNative.PermissionsAndroid.check(_reactNative.PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then(function (result) {
                    if (result) {
                        console.log('Permission is OK');
                    } else {
                        _reactNative.PermissionsAndroid.request(_reactNative.PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then(function (res) {
                            if (res === 'denied') {
                                _this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
                            }
                        });
                    }
                    _reactNativeBleManager2.default.enableBluetooth().catch(function (error) {
                        _this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
                    });
                });
            }
        };

        _this.handleScan = function () {
            _reactNativeBleManager2.default.scan([], 30, true).then(function (results) {
                console.log('Scanning...');
            });
        };

        _this.toggleScanning = function (bool) {
            if (bool) {
                _this.setState({ scanning: true });
                _this.scanning = setInterval(function () {
                    return _this.handleScan();
                }, 3000);
            } else {
                _this.setState({ scanning: false, ble: null });
                clearInterval(_this.scanning);
            }
        };

        _this.handleDiscoverPeripheral = function (data) {
            console.log('Got ble data', data);
            _this.setState({ ble: data });
        };

        _this.handleBleStateChange = function (data) {
            if (data.state === 'off') {
                _this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
            } else {
                _this.setState({ resultMsg: { error: null } });
            }
        };

        _this.render = function () {
            return _react2.default.createElement(
                _reactNative.View,
                { style: [_theme.AppStyles.container] },
                _react2.default.createElement(_ui.Alerts, {
                    status: _this.state.resultMsg.status,
                    success: _this.state.resultMsg.success,
                    error: _this.state.resultMsg.error
                })
            );
        };

        _this.state = {
            ble: null,
            scanning: false,
            resultMsg: {
                status: null,
                success: null,
                error: null
            }
        };
        return _this;
    }

    return KitManagementView;
}(_react.Component);

KitManagementView.componentName = 'KitManagementView';
KitManagementView.propTypes = {
    user: _react.PropTypes.object
};
KitManagementView.defaultProps = {
    user: {}
};
exports.default = KitManagementView;