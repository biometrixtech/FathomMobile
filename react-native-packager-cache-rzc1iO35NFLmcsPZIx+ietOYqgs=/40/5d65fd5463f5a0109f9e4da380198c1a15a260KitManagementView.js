Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/containers/kit/KitManagementView.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeElements = require('react-native-elements');

var _reactNativeBleManager = require('react-native-ble-manager');

var _reactNativeBleManager2 = babelHelpers.interopRequireDefault(_reactNativeBleManager);

var _reactNativeSwiper = require('react-native-swiper');

var _reactNativeSwiper2 = babelHelpers.interopRequireDefault(_reactNativeSwiper);

var _reactNativeModalDropdown = require('react-native-modal-dropdown');

var _reactNativeModalDropdown2 = babelHelpers.interopRequireDefault(_reactNativeModalDropdown);

var _reactNativeCollapsible = require('react-native-collapsible');

var _reactNativeCollapsible2 = babelHelpers.interopRequireDefault(_reactNativeCollapsible);

var _theme = require('@theme/');

var _ui = require('@ui/');

var accessoryDiscoverabilityInstruction = 'hold the ___ and ___ buttons simultaneously until the kit lights flash red and blue';

var KitManagementView = function (_Component) {
    babelHelpers.inherits(KitManagementView, _Component);

    function KitManagementView(props) {
        babelHelpers.classCallCheck(this, KitManagementView);

        var _this = babelHelpers.possibleConstructorReturn(this, (KitManagementView.__proto__ || Object.getPrototypeOf(KitManagementView)).call(this, props));

        _this.componentDidMount = function () {
            _reactNativeBleManager2.default.checkState();
            _this.handleDiscoverPeripheral = _this.handleDiscoverPeripheral.bind(_this);
            _this.handleBleStateChange = _this.handleBleStateChange.bind(_this);

            _reactNative.NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', _this.handleDiscoverPeripheral);
            _reactNative.NativeAppEventEmitter.addListener('BleManagerDidUpdateState', _this.handleBleStateChange);
            _reactNative.NativeAppEventEmitter.addListener('BleManagerStopScan', function () {
                _this.setState({ scanning: false, resultMsg: { success: 'Finished scanning' } });
            });
        };

        _this.turnOnBluetooth = function () {
            _reactNativeBleManager2.default.start({ showAlert: true });

            if (_reactNative.Platform.OS === 'android' && _reactNative.Platform.Version >= 23) {
                _reactNative.PermissionsAndroid.check(_reactNative.PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then(function (result) {
                    if (!result) {
                        return _reactNative.PermissionsAndroid.request(_reactNative.PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then(function (res) {
                            if (res === 'denied') {
                                return _this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
                            }
                            return null;
                        });
                    }
                    return _reactNativeBleManager2.default.enableBluetooth().catch(function (error) {
                        return _this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
                    });
                });
            }
        };

        _this.handleScan = function () {
            return _reactNativeBleManager2.default.scan([], 30, false).then(function () {
                _this.refs.swiper.scrollBy(1);_this.setState({ scanning: true, resultMsg: { status: 'Scanning..' }, devicesFound: [] });
            }).catch(function (err) {
                return console.log(err);
            });
        };

        _this.toggleScanning = function (bool) {
            if (bool) {
                _this.setState({ scanning: true });
                return _this.handleScan();
            }
            _this.setState({ scanning: false, ble: null });
            return _reactNativeBleManager2.default.stopScan().then(function (res) {
                return _reactNativeBleManager2.default.checkState();
            });
        };

        _this.handleDiscoverPeripheral = function (data) {
            console.log('Got ble data', data);
            _this.state.devicesFound.push(data);
            return _this.setState({ ble: data, devicesFound: _this.state.devicesFound });
        };

        _this.handleBleStateChange = function (data) {
            if (data.state === 'off') {
                if (_this.refs.swiper.state.index > 1) {
                    _this.refs.swiper.scrollBy(-_this.refs.swiper.state.index + 1);
                }
                return _this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
            }
            if (_this.refs.swiper.state.index === 1) {
                _this.turnOnBluetooth();
                _this.refs.swiper.scrollBy(1);
            }
            return _this.setState({ resultMsg: { error: null } });
        };

        _this.render = function () {
            return _react2.default.createElement(
                _reactNativeSwiper2.default,
                { ref: 'swiper', scrollEnabled: false, loop: false, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 121
                    }
                },
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [_theme.AppStyles.containerCentered, { flex: 1 }], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 122
                        }
                    },
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 123
                        }
                    }),
                    _react2.default.createElement(
                        _reactNative.View,
                        { style: { flex: 1 }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 124
                            }
                        },
                        _react2.default.createElement(
                            _ui.FormLabel,
                            { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000' }], __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 125
                                }
                            },
                            accessoryDiscoverabilityInstruction
                        ),
                        _react2.default.createElement(_ui.Spacer, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 128
                            }
                        }),
                        _react2.default.createElement(_ui.Button, { title: 'Next', onPress: function onPress() {
                                _this.refs.swiper.scrollBy(1);_reactNativeBleManager2.default.checkState();
                            }, raised: true, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 129
                            }
                        })
                    ),
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 131
                        }
                    })
                ),
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [_theme.AppStyles.containerCentered, { flex: 1 }], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 133
                        }
                    },
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 134
                        }
                    }),
                    _react2.default.createElement(
                        _reactNative.View,
                        { style: { flex: 1 }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 135
                            }
                        },
                        _react2.default.createElement(
                            _ui.FormLabel,
                            { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000' }], __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 136
                                }
                            },
                            'Step 2: Turn on bluetooth'
                        ),
                        _react2.default.createElement(_reactNativeElements.Icon, { name: 'bluetooth', containerStyle: { alignSelf: 'center' }, size: 30, color: _theme.AppColors.brand.primary, reverse: true, onPress: function onPress() {
                                return _this.turnOnBluetooth();
                            }, raised: true, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 137
                            }
                        })
                    ),
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 139
                        }
                    })
                ),
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [_theme.AppStyles.containerCentered, { flex: 1 }], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 141
                        }
                    },
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 151
                        }
                    }),
                    _react2.default.createElement(
                        _reactNative.View,
                        { style: { flex: 1, alignItems: 'center' }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 152
                            }
                        },
                        _react2.default.createElement(
                            _ui.FormLabel,
                            { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000' }], __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 153
                                }
                            },
                            'Step 3: Scan for accessories'
                        ),
                        _react2.default.createElement(_ui.Button, {
                            title: _this.state.scanning ? 'Stop Scan' : 'Start Scan',
                            icon: { name: '' + (_this.state.scanning ? 'stop' : 'play-arrow') },
                            buttonStyle: { backgroundColor: '' + (_this.state.scanning ? _theme.AppColors.red : _theme.AppColors.brand.primary) },
                            onPress: function onPress() {
                                return _this.toggleScanning(!_this.state.scanning);
                            },
                            raised: true,
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 154
                            }
                        }),
                        _react2.default.createElement(_ui.Spacer, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 161
                            }
                        }),
                        _react2.default.createElement(_reactNativeModalDropdown2.default, { options: _this.state.devicesFound.map(function (device) {
                                return device.id;
                            }), __source: {
                                fileName: _jsxFileName,
                                lineNumber: 162
                            }
                        }),
                        _react2.default.createElement(_ui.Spacer, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 163
                            }
                        }),
                        _react2.default.createElement(
                            _ui.Text,
                            { labelStyle: [_theme.AppStyles.h5, { color: _theme.AppColors.primary }], onPress: function onPress() {
                                    _this.setState({ isCollapsed: !_this.state.isCollapsed });
                                }, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 164
                                }
                            },
                            'Can\'t find your device?'
                        ),
                        _react2.default.createElement(_ui.Spacer, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 165
                            }
                        }),
                        _react2.default.createElement(
                            _reactNativeCollapsible2.default,
                            { collapsed: _this.state.isCollapsed, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 166
                                }
                            },
                            _react2.default.createElement(
                                _ui.FormLabel,
                                { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000' }], __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 167
                                    }
                                },
                                accessoryDiscoverabilityInstruction + '. Then rescan.'
                            )
                        )
                    ),
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 172
                        }
                    })
                )
            );
        };

        _this.state = {
            ble: null,
            scanning: false,
            index: 0,
            devicesFound: [],
            isCollapsed: true,
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