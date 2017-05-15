Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/containers/auth/LoginView.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _tcombFormNative = require('tcomb-form-native');

var _tcombFormNative2 = babelHelpers.interopRequireDefault(_tcombFormNative);

var _reactNativeRouterFlux = require('react-native-router-flux');

var _reactNativeAnimatable = require('react-native-animatable');

var Animatable = babelHelpers.interopRequireWildcard(_reactNativeAnimatable);

var _api = require('@lib/api');

var _api2 = babelHelpers.interopRequireDefault(_api);

var _theme = require('@theme/');

var _ui = require('@ui/');

var roles = {
    admin: 'admin',
    athlete: 'athlete',
    biometrixAdmin: 'biometrix_admin',
    manager: 'manager',
    researcher: 'researcher'
};

var styles = _reactNative.StyleSheet.create({
    background: {
        backgroundColor: _theme.AppColors.brand.primary,
        height: _theme.AppSizes.screen.height,
        width: _theme.AppSizes.screen.width
    },
    logo: {
        width: _theme.AppSizes.screen.width * 0.85,
        resizeMode: 'contain'
    },
    whiteText: {
        color: '#FFFFFF'
    }
});

var Login = function (_Component) {
    babelHelpers.inherits(Login, _Component);

    function Login(props) {
        var _this2 = this;

        babelHelpers.classCallCheck(this, Login);

        var _this = babelHelpers.possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));

        _this.componentDidMount = function _callee() {
            var values, jsonValues;
            return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return regeneratorRuntime.awrap(_reactNative.AsyncStorage.getItem('api/credentials'));

                        case 2:
                            values = _context.sent;
                            jsonValues = JSON.parse(values);


                            if (values !== null) {
                                _this.setState({
                                    form_values: {
                                        Email: jsonValues.email,
                                        Password: jsonValues.password
                                    }
                                });
                                _this.login();
                            }

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, null, _this2);
        };

        _this.login = function () {
            var credentials = _this.form.getValue();

            if (credentials) {
                _this.setState({ form_values: credentials }, function () {
                    _this.setState({ resultMsg: { status: 'One moment...' } });

                    if (_this.scrollView) {
                        _this.scrollView.scrollTo({ y: 0 });
                    }

                    _this.props.login({
                        email: credentials.Email,
                        password: credentials.Password
                    }, true).then(function (userData) {
                        _this.setState({
                            resultMsg: { success: 'Success, now loading your data!' }
                        }, function () {
                            switch (userData.role) {
                                case roles.admin:
                                    _reactNativeRouterFlux.Actions.adminApp({ type: 'reset' });
                                    break;
                                case roles.athlete:
                                    _reactNativeRouterFlux.Actions.athleteApp({ type: 'reset' });
                                    break;
                                case roles.biometrixAdmin:
                                    _reactNativeRouterFlux.Actions.biometrixApp({ type: 'reset' });
                                    break;
                                case roles.manager:
                                    _reactNativeRouterFlux.Actions.managerApp({ type: 'reset' });
                                    break;
                                case roles.researcher:
                                    _reactNativeRouterFlux.Actions.researcherApp({ type: 'reset' });
                                    break;
                                default:
                                    break;
                            }
                        });
                    }).catch(function (err) {
                        var error = _api2.default.handleError(err);
                        _this.setState({ resultMsg: { error: error } });
                    });
                });
            }
        };

        _this.render = function () {
            var Form = _tcombFormNative2.default.form.Form;

            return _react2.default.createElement(
                _reactNative.View,
                {
                    style: [_theme.AppStyles.containerCentered, _theme.AppStyles.container, styles.background],
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 189
                    }
                },
                _react2.default.createElement(
                    Animatable.Text,
                    { animation: 'zoomIn', easing: 'ease-out', iterationCount: 'infinite', direction: 'alternate', style: [_theme.AppStyles.h0, styles.whiteText], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 193
                        }
                    },
                    'Fathom'
                ),
                _react2.default.createElement(_ui.Spacer, { size: 10, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 195
                    }
                }),
                _react2.default.createElement(
                    _ui.Card,
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 197
                        }
                    },
                    _react2.default.createElement(_ui.Alerts, {
                        status: _this.state.resultMsg.status,
                        success: _this.state.resultMsg.success,
                        error: _this.state.resultMsg.error,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 198
                        }
                    }),
                    _react2.default.createElement(Form, {
                        ref: function ref(b) {
                            _this.form = b;
                        },
                        type: _this.state.form_fields,
                        value: _this.state.form_values,
                        options: _this.state.options,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 204
                        }
                    }),
                    _react2.default.createElement(_ui.Button, {
                        title: 'Login',
                        onPress: _this.login,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 211
                        }
                    }),
                    _react2.default.createElement(_ui.Spacer, { size: 10, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 216
                        }
                    }),
                    _react2.default.createElement(
                        _reactNative.TouchableOpacity,
                        { onPress: _reactNativeRouterFlux.Actions.passwordReset, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 218
                            }
                        },
                        _react2.default.createElement(
                            _ui.Text,
                            { p: true, style: [_theme.AppStyles.textCenterAligned, _theme.AppStyles.link], __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 219
                                }
                            },
                            'Forgot Password'
                        )
                    ),
                    _react2.default.createElement(_ui.Spacer, { size: 10, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 224
                        }
                    }),
                    _react2.default.createElement(
                        _ui.Text,
                        { p: true, style: [_theme.AppStyles.textCenterAligned], __source: {
                                fileName: _jsxFileName,
                                lineNumber: 226
                            }
                        },
                        '- or -'
                    ),
                    _react2.default.createElement(_ui.Button, {
                        title: 'Sign Up',
                        onPress: _reactNativeRouterFlux.Actions.signUp,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 230
                        }
                    })
                )
            );
        };

        var validEmail = _tcombFormNative2.default.refinement(_tcombFormNative2.default.String, function (email) {
            var regularExpression = /^.+@.+\..+$/i;

            return regularExpression.test(email);
        });

        var validPassword = _tcombFormNative2.default.refinement(_tcombFormNative2.default.String, function (password) {
            if (password.length < 8) {
                return false;
            }
            return true;
        });

        _this.state = {
            resultMsg: {
                status: '',
                success: '',
                error: ''
            },
            form_fields: _tcombFormNative2.default.struct({
                Email: validEmail,
                Password: validPassword
            }),
            empty_form_values: {
                Email: '',
                Password: ''
            },
            form_values: {},
            options: {
                fields: {
                    Email: {
                        error: 'Please enter a valid email',
                        autoCapitalize: 'none',
                        clearButtonMode: 'while-editing',
                        keyboardType: 'email-address'
                    },
                    Password: {
                        error: 'Your password must be 8 characters or more',
                        clearButtonMode: 'while-editing',
                        secureTextEntry: true,
                        password: true
                    }
                }
            }
        };
        return _this;
    }

    return Login;
}(_react.Component);

Login.componentName = 'Login';
Login.propTypes = {
    login: _react.PropTypes.func.isRequired
};
exports.default = Login;