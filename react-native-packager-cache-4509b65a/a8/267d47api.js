Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactNativeDeviceInfo = require('react-native-device-info');

var _reactNativeDeviceInfo2 = babelHelpers.interopRequireDefault(_reactNativeDeviceInfo);

var _api = require('@lib/api.jwt');

var _api2 = babelHelpers.interopRequireDefault(_api);

var _constants = require('@constants/');

var _util = require('@lib/util');

var _util2 = babelHelpers.interopRequireDefault(_util);

var Token = new _api2.default();

var HOSTNAME = _constants.APIConfig.hostname;
var ENDPOINTS = _constants.APIConfig.endpoints;

var USER_AGENT = void 0;
try {
    USER_AGENT = _constants.AppConfig.appName + ' ' + _reactNativeDeviceInfo2.default.getVersion() + '; ' + _reactNativeDeviceInfo2.default.getSystemName() + ' ' + (_reactNativeDeviceInfo2.default.getSystemVersion() + '; ' + _reactNativeDeviceInfo2.default.getBrand() + ' ' + _reactNativeDeviceInfo2.default.getDeviceId());
} catch (e) {
    USER_AGENT = '' + _constants.AppConfig.appName;
}

var DEBUG_MODE = _constants.AppConfig.DEV;

var requestCounter = 0;

function debug(str, title) {
    if (DEBUG_MODE && (title || str)) {
        if (title) {
            console.log('=== DEBUG: ' + title + ' ===========================');
        }
        if (str) {
            console.log(str);
            console.log('%c ...', 'color: #CCC');
        }
    }
}

function handleError(err) {
    var error = '';
    if (typeof err === 'string') {
        error = err;
    } else if (err && err.message) {
        error = err.message;
    }

    if (!error) {
        error = _constants.ErrorMessages.default;
    }
    return error;
}

function serialize(obj, prefix) {
    var str = [];

    Object.keys(obj).forEach(function (p) {
        var k = prefix ? prefix + '[' + p + ']' : p;
        var v = obj[p];

        str.push(v !== null && typeof v === 'object' ? serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });

    return str.join('&');
}

function fetcher(method, inputEndpoint, inputParams, body) {
    var _this = this;

    var endpoint = inputEndpoint;
    var params = inputParams;

    return new Promise(function _callee2(resolve, reject) {
        var requestNum, timeoutAfter, apiTimedOut, req, apiToken, urlParams, thisUrl;
        return regeneratorRuntime.async(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        requestCounter += 1;
                        requestNum = requestCounter;
                        timeoutAfter = 25;
                        apiTimedOut = setTimeout(function () {
                            return reject(_constants.ErrorMessages.timeout);
                        }, timeoutAfter * 1000);

                        if (!(!method || !endpoint)) {
                            _context2.next = 6;
                            break;
                        }

                        return _context2.abrupt('return', reject('Missing params (AppAPI.fetcher).'));

                    case 6:
                        req = {
                            method: method.toUpperCase(),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'User-Agent': USER_AGENT
                            }
                        };

                        if (!(Token.getStoredToken && endpoint !== _constants.APIConfig.endpoints.get(_constants.APIConfig.tokenKey))) {
                            _context2.next = 12;
                            break;
                        }

                        _context2.next = 10;
                        return regeneratorRuntime.awrap(Token.getStoredToken());

                    case 10:
                        apiToken = _context2.sent;

                        if (apiToken) {
                            req.headers.jwt = apiToken;
                        }

                    case 12:
                        urlParams = '';

                        if (params) {
                            if (typeof params === 'object') {
                                Object.keys(params).forEach(function (param) {
                                    if (endpoint.includes('{' + param + '}')) {
                                        endpoint = endpoint.split('{' + param + '}').join(params[param]);
                                        delete params[param];
                                    }
                                });

                                if (params.id) {
                                    if (typeof params.id === 'string' || typeof params.id === 'number') {
                                        urlParams = '/' + params.id;
                                        delete params.id;
                                    }
                                }

                                urlParams = '?' + serialize(params);
                            } else if (typeof params === 'string' || typeof params === 'number') {
                                urlParams = '/' + params;
                            } else {
                                debug('You provided params, but it wasn\'t an object!', HOSTNAME + endpoint + urlParams);
                            }
                        }

                        if (body) req.body = JSON.stringify(body);

                        thisUrl = '' + HOSTNAME + endpoint + urlParams;


                        debug('', 'API Request #' + requestNum + ' to ' + thisUrl);

                        return _context2.abrupt('return', fetch(thisUrl, req).then(function _callee(rawRes) {
                            var jsonRes, err;
                            return regeneratorRuntime.async(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            clearTimeout(apiTimedOut);

                                            jsonRes = {};

                                            console.log(rawRes);

                                            _context.prev = 3;
                                            _context.next = 6;
                                            return regeneratorRuntime.awrap(rawRes.json());

                                        case 6:
                                            jsonRes = _context.sent;
                                            _context.next = 13;
                                            break;

                                        case 9:
                                            _context.prev = 9;
                                            _context.t0 = _context['catch'](3);
                                            err = { message: _constants.ErrorMessages.invalidJson };
                                            throw err;

                                        case 13:
                                            if (!(rawRes && rawRes.status === 200)) {
                                                _context.next = 15;
                                                break;
                                            }

                                            return _context.abrupt('return', jsonRes);

                                        case 15:
                                            throw jsonRes;

                                        case 16:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, null, _this, [[3, 9]]);
                        }).then(function (res) {
                            debug(res, 'API Response #' + requestNum + ' from ' + thisUrl);
                            return resolve(res);
                        }).catch(function (err) {
                            clearTimeout(apiTimedOut);

                            var apiCredentials = Token.getStoredCredentials ? Token.getStoredCredentials() : {};

                            if (!_util2.default.objIsEmpty(apiCredentials) && err && err.data && err.data.status.toString().charAt(0) === 4 && err.code !== 'jwt_auth_failed' && Token.getToken) {
                                return Token.getToken().then(function () {
                                    fetcher(method, endpoint, params, body);
                                }).catch(function (error) {
                                    return reject(error);
                                });
                            }

                            debug(err, thisUrl);
                            return reject(err);
                        }));

                    case 18:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, null, _this);
    });
}

var AppAPI = {
    handleError: handleError,
    getToken: Token.getToken,
    deleteToken: Token.deleteToken
};

ENDPOINTS.forEach(function (endpoint, key) {
    AppAPI[key] = {
        get: function get(params, payload) {
            return fetcher('GET', endpoint, params, payload);
        },
        post: function post(params, payload) {
            return fetcher('POST', endpoint, params, payload);
        },
        patch: function patch(params, payload) {
            return fetcher('PATCH', endpoint, params, payload);
        },
        put: function put(params, payload) {
            return fetcher('PUT', endpoint, params, payload);
        },
        delete: function _delete(params, payload) {
            return fetcher('DELETE', endpoint, params, payload);
        }
    };
});

exports.default = AppAPI;