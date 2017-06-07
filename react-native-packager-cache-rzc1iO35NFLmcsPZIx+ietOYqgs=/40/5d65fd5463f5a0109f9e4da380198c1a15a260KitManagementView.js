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
            if (data.name && data.name.indexOf('fathom') > -1 && _this.state.devicesFound.every(function (device) {
                return device.id !== data.id;
            })) {
                console.log('Got new ble data', data);
                _this.state.devicesFound.push(data);
                return _this.setState({ ble: data, devicesFound: _this.state.devicesFound });
            }
            return null;
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

        _this.connect = function (data) {
            console.log(data);
            return _reactNativeBleManager2.default.connect(data.id).then(function () {
                data.connected = true;
                return data;
            }).then(function () {
                return _reactNativeBleManager2.default.isPeripheralConnected(data.id, []);
            }).then(function (isConnected) {
                console.log('Is peripheral ' + data.name + ' connected: ' + isConnected);
                data.connected = isConnected;
                return data;
            }).then(function (peripheral) {
                return _reactNativeBleManager2.default.retrieveServices(peripheral.id);
            }).then(function (peripheralData) {
                return console.log('Retrieved peripheral services', peripheralData);
            }).then(function () {
                return _reactNativeBleManager2.default.read(data.id, '1800', '2a00');
            }).then(function (readData) {
                return console.log('Data read: ' + readData);
            }).catch(function (err) {
                console.log(err);
                return err;
            });
        };

        _this.render = function () {
            return _react2.default.createElement(
                _reactNativeSwiper2.default,
                { ref: 'swiper', scrollEnabled: false, loop: false, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 147
                    }
                },
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [_theme.AppStyles.containerCentered, { flex: 1 }], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 148
                        }
                    },
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 149
                        }
                    }),
                    _react2.default.createElement(
                        _reactNative.View,
                        { style: { flex: 1 }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 150
                            }
                        },
                        _react2.default.createElement(
                            _ui.FormLabel,
                            { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000' }], __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 151
                                }
                            },
                            accessoryDiscoverabilityInstruction
                        ),
                        _react2.default.createElement(_ui.Spacer, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 154
                            }
                        }),
                        _react2.default.createElement(_ui.Button, { title: 'Next', onPress: function onPress() {
                                _this.refs.swiper.scrollBy(1);_reactNativeBleManager2.default.checkState();
                            }, raised: true, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 155
                            }
                        })
                    ),
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 157
                        }
                    })
                ),
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [_theme.AppStyles.containerCentered, { flex: 1 }], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 159
                        }
                    },
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 160
                        }
                    }),
                    _react2.default.createElement(
                        _reactNative.View,
                        { style: { flex: 1 }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 161
                            }
                        },
                        _react2.default.createElement(
                            _ui.FormLabel,
                            { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000' }], __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 162
                                }
                            },
                            'Step 2: Turn on bluetooth'
                        ),
                        _react2.default.createElement(_reactNativeElements.Icon, { name: 'bluetooth', containerStyle: { alignSelf: 'center' }, size: 30, color: _theme.AppColors.brand.primary, reverse: true, onPress: function onPress() {
                                return _this.turnOnBluetooth();
                            }, raised: true, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 163
                            }
                        })
                    ),
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 165
                        }
                    })
                ),
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [_theme.AppStyles.containerCentered, { flex: 1 }], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 167
                        }
                    },
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 177
                        }
                    }),
                    _react2.default.createElement(
                        _reactNative.View,
                        { style: { flex: 1, alignItems: 'center' }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 178
                            }
                        },
                        _react2.default.createElement(
                            _ui.FormLabel,
                            { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000' }], __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 179
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
                                lineNumber: 180
                            }
                        }),
                        _react2.default.createElement(_ui.Spacer, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 187
                            }
                        }),
                        _react2.default.createElement(_reactNativeModalDropdown2.default, { options: _this.state.devicesFound.map(function (device) {
                                return device.name;
                            }), onSelect: function onSelect(idx) {
                                return _this.connect(_this.state.devicesFound[idx]);
                            }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 188
                            }
                        }),
                        _react2.default.createElement(_ui.Spacer, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 189
                            }
                        }),
                        _react2.default.createElement(
                            _ui.Text,
                            { labelStyle: [_theme.AppStyles.h5, { color: _theme.AppColors.primary }], onPress: function onPress() {
                                    _this.setState({ isCollapsed: !_this.state.isCollapsed });
                                }, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 190
                                }
                            },
                            'Can\'t find your device?'
                        ),
                        _react2.default.createElement(_ui.Spacer, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 191
                            }
                        }),
                        _react2.default.createElement(
                            _reactNativeCollapsible2.default,
                            { collapsed: _this.state.isCollapsed, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 192
                                }
                            },
                            _react2.default.createElement(
                                _ui.FormLabel,
                                { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000' }], __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 193
                                    }
                                },
                                accessoryDiscoverabilityInstruction + '. Then rescan.'
                            )
                        )
                    ),
                    _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 198
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