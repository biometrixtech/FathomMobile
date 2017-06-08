Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactNative = require('react-native');

var _jwtDecode = require('jwt-decode');

var _jwtDecode2 = babelHelpers.interopRequireDefault(_jwtDecode);

var _api = require('@lib/api');

var _api2 = babelHelpers.interopRequireDefault(_api);

var _constants = require('@constants/');

var JWT = function JWT() {
    var _this = this;

    babelHelpers.classCallCheck(this, JWT);
    this.apiCredentials = {};

    this.getToken = function (credentials) {
        return new Promise(function _callee2(resolve, reject) {
            var apiToken;
            return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!_this.getStoredToken) {
                                _context2.next = 6;
                                break;
                            }

                            _context2.next = 3;
                            return regeneratorRuntime.awrap(_this.getStoredToken());

                        case 3:
                            _context2.t0 = _context2.sent;
                            _context2.next = 7;
                            break;

                        case 6:
                            _context2.t0 = false;

                        case 7:
                            apiToken = _context2.t0;

                            if (!apiToken) {
                                _context2.next = 10;
                                break;
                            }

                            return _context2.abrupt('return', resolve(apiToken));

                        case 10:
                            if (!(credentials && typeof credentials === 'object' && credentials.email && credentials.password)) {
                                _context2.next = 17;
                                break;
                            }

                            _this.apiCredentials.email = credentials.email;
                            _this.apiCredentials.password = credentials.password;

                            _context2.next = 15;
                            return regeneratorRuntime.awrap(_reactNative.AsyncStorage.setItem('api/credentials', JSON.stringify(_this.apiCredentials)));

                        case 15:
                            _context2.next = 19;
                            break;

                        case 17:
                            _context2.next = 19;
                            return regeneratorRuntime.awrap(_this.getStoredCredentials());

                        case 19:
                            if (!(!_this.apiCredentials || !_this.apiCredentials.email || !_this.apiCredentials.password)) {
                                _context2.next = 21;
                                break;
                            }

                            return _context2.abrupt('return', reject({
                                data: { status: 403 },
                                message: 'Credentials missing (JWT.getToken).'
                            }));

                        case 21:
                            return _context2.abrupt('return', _api2.default[_constants.APIConfig.tokenKey].post(null, {
                                email: _this.apiCredentials.email,
                                password: _this.apiCredentials.password
                            }).then(function _callee(res) {
                                var tokenIsNowValid;
                                return regeneratorRuntime.async(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                if (res.jwt) {
                                                    _context.next = 2;
                                                    break;
                                                }

                                                return _context.abrupt('return', reject(res));

                                            case 2:
                                                if (!_this.tokenIsValid) {
                                                    _context.next = 8;
                                                    break;
                                                }

                                                _context.next = 5;
                                                return regeneratorRuntime.awrap(_this.tokenIsValid(res.jwt));

                                            case 5:
                                                _context.t0 = _context.sent;
                                                _context.next = 9;
                                                break;

                                            case 8:
                                                _context.t0 = null;

                                            case 9:
                                                tokenIsNowValid = _context.t0;

                                                if (tokenIsNowValid) {
                                                    _context.next = 12;
                                                    break;
                                                }

                                                return _context.abrupt('return', reject(res));

                                            case 12:
                                                if (!_this.storeToken) {
                                                    _context.next = 15;
                                                    break;
                                                }

                                                _context.next = 15;
                                                return regeneratorRuntime.awrap(_this.storeToken(res.jwt));

                                            case 15:
                                                return _context.abrupt('return', resolve(res.jwt));

                                            case 16:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, null, _this);
                            }).catch(function (err) {
                                return reject(err);
                            }));

                        case 22:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, null, _this);
        });
    };

    this.getStoredToken = function _callee3() {
        var validToken;
        return regeneratorRuntime.async(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (_this.apiToken) {
                            _context3.next = 4;
                            break;
                        }

                        _context3.next = 3;
                        return regeneratorRuntime.awrap(_reactNative.AsyncStorage.getItem('api/token'));

                    case 3:
                        _this.apiToken = _context3.sent;

                    case 4:
                        if (!_this.apiToken) {
                            _context3.next = 10;
                            break;
                        }

                        _context3.next = 7;
                        return regeneratorRuntime.awrap(_this.tokenIsValid(_this.apiToken));

                    case 7:
                        _context3.t0 = _context3.sent;
                        _context3.next = 11;
                        break;

                    case 10:
                        _context3.t0 = false;

                    case 11:
                        validToken = _context3.t0;

                        if (_this.apiToken && !validToken) {
                            _this.apiToken = null;
                        }

                        return _context3.abrupt('return', _this.apiToken);

                    case 14:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, null, _this);
    };

    this.getStoredCredentials = function _callee4() {
        var storedCredsStr, storedCreds;
        return regeneratorRuntime.async(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        storedCredsStr = '';

                        if (_this.apiCredentials) {
                            _context4.next = 5;
                            break;
                        }

                        _context4.next = 4;
                        return regeneratorRuntime.awrap(_reactNative.AsyncStorage.getItem('api/credentials'));

                    case 4:
                        storedCredsStr = _context4.sent;

                    case 5:
                        storedCreds = storedCredsStr ? JSON.parse(storedCredsStr) : false;


                        if (storedCreds && typeof storedCreds === 'object' && storedCreds.email && storedCreds.password) {
                            _this.apiCredentials = storedCreds;
                        }

                        return _context4.abrupt('return', _this.apiCredentials);

                    case 8:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, null, _this);
    };

    this.storeToken = function _callee5(token) {
        return regeneratorRuntime.async(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return regeneratorRuntime.awrap(_reactNative.AsyncStorage.setItem('api/token', token));

                    case 2:
                        _this.apiToken = token;

                    case 3:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, null, _this);
    };

    this.deleteToken = function _callee6() {
        return regeneratorRuntime.async(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return regeneratorRuntime.awrap(_reactNative.AsyncStorage.removeItem('api/token'));

                    case 2:
                        _context6.next = 4;
                        return regeneratorRuntime.awrap(_reactNative.AsyncStorage.removeItem('api/credentials'));

                    case 4:
                        _this.apiToken = '';

                    case 5:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, null, _this);
    };

    this.tokenIsValid = function (token) {
        var userId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var decodedToken = void 0;
        try {
            decodedToken = (0, _jwtDecode2.default)(token);
        } catch (e) {
            return false;
        }

        if (_this.apiCredentials.email !== decodedToken.email) {
            return false;
        }

        if (userId && decodedToken.user_id !== userId) {
            return false;
        }

        return true;
    };
};

JWT.apiToken = '';
exports.default = JWT;