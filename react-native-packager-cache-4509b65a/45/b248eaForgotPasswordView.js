Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _tcombFormNative = require('tcomb-form-native');

var _tcombFormNative2 = babelHelpers.interopRequireDefault(_tcombFormNative);

var _reactNativeRouterFlux = require('react-native-router-flux');

var _api = require('@lib/api');

var _api2 = babelHelpers.interopRequireDefault(_api);

var _theme = require('@theme/');

var _ui = require('@ui/');

var ForgotPassword = function (_Component) {
    babelHelpers.inherits(ForgotPassword, _Component);

    function ForgotPassword(props) {
        var _this2 = this;

        babelHelpers.classCallCheck(this, ForgotPassword);

        var _this = babelHelpers.possibleConstructorReturn(this, (ForgotPassword.__proto__ || Object.getPrototypeOf(ForgotPassword)).call(this, props));

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
                                        Email: jsonValues.email
                                    }
                                });
                            }

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, null, _this2);
        };

        _this.forgotPassword = function () {
            var credentials = _this.form.getValue();

            if (credentials) {
                _this.setState({ form_values: credentials }, function () {
                    _this.setState({ resultMsg: { status: 'One moment...' } });

                    if (_this.scrollView) {
                        _this.scrollView.scrollTo({ y: 0 });
                    }

                    _this.props.forgotPassword({
                        email: credentials.Email
                    }).then(function () {
                        _this.setState({
                            resultMsg: { success: 'Awesome, recovery instructions have been sent to your email!' }
                        }, function () {
                            setTimeout(function () {
                                _reactNativeRouterFlux.Actions.app({ type: 'reset' });
                            }, 1000);
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
                _reactNative.ScrollView,
                {
                    automaticallyAdjustContentInsets: false,
                    ref: function ref(a) {
                        _this.scrollView = a;
                    },
                    style: [_theme.AppStyles.container],
                    contentContainerStyle: [_theme.AppStyles.container, { alignItems: 'center' }]
                },
                _react2.default.createElement(
                    _ui.Card,
                    null,
                    _react2.default.createElement(_ui.Alerts, {
                        status: _this.state.resultMsg.status,
                        success: _this.state.resultMsg.success,
                        error: _this.state.resultMsg.error
                    }),
                    _react2.default.createElement(
                        _ui.Text,
                        { p: true, style: [_theme.AppStyles.textCenterAligned] },
                        'Enter your email address and we will send you an email with a link to reset your password.'
                    ),
                    _react2.default.createElement(Form, {
                        ref: function ref(b) {
                            _this.form = b;
                        },
                        type: _this.state.form_fields,
                        value: _this.state.form_values,
                        options: _this.state.options
                    }),
                    _react2.default.createElement(_ui.Button, {
                        title: 'Submit',
                        onPress: _this.forgotPassword
                    })
                )
            );
        };

        var validEmail = _tcombFormNative2.default.refinement(_tcombFormNative2.default.String, function (email) {
            var regularExpression = /^.+@.+\..+$/i;

            return regularExpression.test(email);
        });

        _this.state = {
            resultMsg: {
                status: '',
                success: '',
                error: ''
            },
            form_fields: _tcombFormNative2.default.struct({
                Email: validEmail
            }),
            empty_form_values: {
                Email: ''
            },
            form_values: {},
            options: {
                fields: {
                    Email: {
                        error: 'Please enter a valid email',
                        autoCapitalize: 'none',
                        clearButtonMode: 'while-editing'
                    }
                }
            }
        };
        return _this;
    }

    return ForgotPassword;
}(_react.Component);

ForgotPassword.componentName = 'ForgotPassword';
ForgotPassword.propTypes = {
    forgotPassword: _react.PropTypes.func.isRequired
};
exports.default = ForgotPassword;