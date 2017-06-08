Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.login = login;
exports.logout = logout;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.forgotPassword = forgotPassword;
exports.signUp = signUp;
exports.getTrainingGroups = getTrainingGroups;
exports.removeTrainingGroup = removeTrainingGroup;
exports.removeRegimen = removeRegimen;
exports.addTG = addTG;
exports.editTG = editTG;
exports.removeTG = removeTG;
exports.addR = addR;
exports.editR = editR;
exports.removeR = removeR;
exports.addA = addA;
exports.removeA = removeA;

var _jwtDecode = require('jwt-decode');

var _jwtDecode2 = babelHelpers.interopRequireDefault(_jwtDecode);

var _api = require('@lib/api');

var _api2 = babelHelpers.interopRequireDefault(_api);

var Actions = require('../actionTypes');

function login(credentials, freshLogin) {
    var _this = this;

    return function (dispatch) {
        return new Promise(function _callee(resolve, reject) {
            var userCreds;
            return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            userCreds = credentials || null;

                            if (!(freshLogin && _api2.default.deleteToken)) {
                                _context.next = 4;
                                break;
                            }

                            _context.next = 4;
                            return regeneratorRuntime.awrap(_api2.default.deleteToken());

                        case 4:
                            if (_api2.default.getToken) {
                                _context.next = 6;
                                break;
                            }

                            return _context.abrupt('return', resolve());

                        case 6:
                            return _context.abrupt('return', _api2.default.getToken(userCreds).then(function (token) {
                                var decodedToken = '';

                                try {
                                    decodedToken = (0, _jwtDecode2.default)(token);
                                } catch (err) {
                                    return reject('Token decode failed.');
                                }

                                if (!decodedToken || !decodedToken.role || !decodedToken.user_id) {
                                    return reject('Token decode failed.');
                                }

                                return _api2.default.user.get().then(function (userData) {
                                    dispatch({
                                        type: Actions.USER_REPLACE,
                                        data: userData
                                    });

                                    return resolve(userData);
                                }).catch(function (err) {
                                    return reject(err);
                                });
                            }).catch(function (err) {
                                return reject(err);
                            }));

                        case 7:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, null, _this);
        });
    };
}

function logout() {
    return function (dispatch) {
        return _api2.default.deleteToken().then(function () {
            dispatch({
                type: Actions.USER_REPLACE,
                data: {}
            });
        });
    };
}

function getUser() {
    return function (dispatch) {
        return _api2.default.user.get().then(function (userData) {
            dispatch({
                type: Actions.USER_REPLACE,
                data: userData
            });

            return userData;
        });
    };
}

function updateUser(payload) {
    return function (dispatch) {
        return _api2.default.user.patch(payload).then(function (userData) {
            dispatch({
                type: Actions.USER_REPLACE,
                data: userData
            });

            return userData;
        });
    };
}

function forgotPassword(email) {
    return function (dispatch) {
        return _api2.default.forgotPassword.post(email).then(function (result) {
            dispatch({
                type: Actions.FORGOT_PASSWORD_SUCCESS,
                data: result
            });
            return result;
        }).catch(function (err) {
            dispatch({
                type: Actions.FORGOT_PASSWORD_FAILED
            });
            return err;
        });
    };
}

function signUp(credentials) {
    return function (dispatch) {
        return _api2.default.user.post(credentials).then(function (result) {
            dispatch({
                type: Actions.SIGN_UP_SUCCESS,
                data: result
            });
            return result;
        }).catch(function (err) {
            dispatch({
                type: Actions.SIGN_UP_FAILED
            });
            return err;
        });
    };
}

function getTrainingGroups() {
    return function (dispatch) {
        return _api2.default.training_group.get().then(function (trainingGroups) {
            dispatch({
                type: Actions.GET_TRAINING_GROUPS,
                data: trainingGroups
            });
            return trainingGroups;
        });
    };
}

function removeTrainingGroup() {
    return function (dispatch) {
        return _api2.default.training_group.patch().then(function (trainingGroups) {
            dispatch({
                type: Actions.UPDATE_TRAINING_GROUPS,
                data: trainingGroups
            });
        });
    };
}

function removeRegimen() {
    return function (dispatch) {
        return _api2.default.regimen.patch().then(function (regimens) {
            dispatch({
                type: Actions.UPDATE_REGIMEN,
                data: regimens
            });
        });
    };
}

function addTG(data) {
    return function (dispatch) {
        return dispatch({
            type: Actions.ADD_TG,
            data: data
        });
    };
}

function editTG(data) {
    return function (dispatch) {
        return dispatch({
            type: Actions.EDIT_TG,
            data: data
        });
    };
}

function removeTG(id) {
    return function (dispatch) {
        return dispatch({
            type: Actions.REMOVE_TG,
            data: id
        });
    };
}

function addR(data) {
    return function (dispatch) {
        return dispatch({
            type: Actions.ADD_R,
            data: data
        });
    };
}

function editR(data) {
    return function (dispatch) {
        return dispatch({
            type: Actions.EDIT_R,
            data: data
        });
    };
}

function removeR(id) {
    return function (dispatch) {
        return dispatch({
            type: Actions.REMOVE_R,
            data: id
        });
    };
}

function addA(data) {
    return function (dispatch) {
        return dispatch({
            type: Actions.ADD_A,
            data: data
        });
    };
}

function removeA(data) {
    return function (dispatch) {
        return dispatch({
            type: Actions.REMOVE_A,
            data: data
        });
    };
}