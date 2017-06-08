Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/containers/ui/Menu/MenuView.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeRouterFlux = require('react-native-router-flux');

var _theme = require('@theme/');

var _ui = require('@ui/');

var roles = {
    admin: 'admin',
    athlete: 'athlete',
    biometrixAdmin: 'biometrix_admin',
    manager: 'manager',
    researcher: 'researcher'
};

var MENU_BG_COLOR = '#2E3234';

var styles = _reactNative.StyleSheet.create({
    backgroundFill: {
        backgroundColor: _theme.AppColors.brand.primary,
        height: _theme.AppSizes.screen.height,
        width: _theme.AppSizes.screen.width,
        position: 'absolute',
        top: 0,
        left: 0
    },
    container: {
        position: 'relative',
        flex: 1
    },
    menuContainer: {
        flex: 3,
        left: 0,
        right: 0,
        backgroundColor: _theme.AppColors.brand.primary
    },
    imageContainer: {
        flex: 1,
        margin: 20
    },

    menu: {
        flex: 3,
        left: 0,
        right: 0,
        backgroundColor: _theme.AppColors.brand.primary,
        padding: _theme.AppSizes.padding,
        paddingTop: _theme.AppSizes.statusBarHeight
    },
    menuItem: {
        paddingBottom: 10
    },
    menuItem_text: {
        fontSize: 18,
        lineHeight: parseInt(18 + 18 * 0.5, 10),
        fontWeight: 'normal',
        marginTop: 10,
        color: '#EEEFF0'
    },

    menuBottom: {
        flex: 1,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
        paddingBottom: 10
    },
    menuBottom_text: {
        color: '#EEEFF0'
    }
});

var Menu = function (_Component) {
    babelHelpers.inherits(Menu, _Component);

    function Menu(props) {
        babelHelpers.classCallCheck(this, Menu);

        var _this = babelHelpers.possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

        _initialiseProps.call(_this);

        var title = '';
        var action = void 0;

        switch (_this.props.user.user.role) {
            case roles.admin:
                title = 'Team Management';
                action = _reactNativeRouterFlux.Actions.adminTeamManagement;
                break;
            case roles.athlete:
                title = 'Athlete Management';
                action = _reactNativeRouterFlux.Actions.athleteAthleteManagement;
                break;
            case roles.biometrixAdmin:
                title = 'Team Management';
                action = _reactNativeRouterFlux.Actions.managerTeamManagement;
                break;
            case roles.manager:
                title = 'Team Management';
                action = _reactNativeRouterFlux.Actions.managerTeamManagement;
                break;
            case roles.researcher:
                title = 'Subject Management';
                action = _reactNativeRouterFlux.Actions.researcherSubjectManagement;
                break;
            default:
                break;
        }

        _this.state = {
            menu: [{
                title: title,
                onPress: function onPress() {
                    _this.props.closeSideMenu();action();
                }
            }, {
                title: 'Kit Management',
                onPress: function onPress() {
                    _this.props.closeSideMenu();_reactNativeRouterFlux.Actions.kitManagement();
                }
            }, {
                title: 'Settings',
                onPress: function onPress() {
                    _this.props.closeSideMenu();_reactNativeRouterFlux.Actions.settings();
                }
            }]
        };
        return _this;
    }

    return Menu;
}(_react.Component);

Menu.propTypes = {
    logout: _react.PropTypes.func.isRequired,
    closeSideMenu: _react.PropTypes.func.isRequired,
    user: _react.PropTypes.shape({
        user: _react.PropTypes.shape({
            role: _react.PropTypes.string,
            first_name: _react.PropTypes.string,
            last_name: _react.PropTypes.string,
            avatar_url: _react.PropTypes.string
        })
    })
};
Menu.defaultProps = {
    user: null
};

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.logout = function () {
        if (_this2.props.logout) {
            _this2.props.logout().then(function () {
                _this2.props.closeSideMenu();
                _reactNativeRouterFlux.Actions.login();
            }).catch(function (err) {
                _reactNative.Alert.alert('Uh oh!', 'Something went wrong, please try again.');
            });
        }
    };

    this.render = function () {
        var menu = _this2.state.menu;

        var menuItems = [];
        menu.map(function (item) {
            var title = item.title,
                onPress = item.onPress;


            return menuItems.push(_react2.default.createElement(
                _reactNative.TouchableOpacity,
                {
                    key: 'menu-item-' + title,
                    onPress: onPress,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 180
                    }
                },
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [styles.menuItem], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 184
                        }
                    },
                    _react2.default.createElement(
                        _ui.Text,
                        { style: [styles.menuItem_text], __source: {
                                fileName: _jsxFileName,
                                lineNumber: 185
                            }
                        },
                        title
                    )
                )
            ));
        });

        return _react2.default.createElement(
            _reactNative.View,
            { style: [styles.container], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 195
                }
            },
            _react2.default.createElement(_reactNative.View, { style: [styles.backgroundFill], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 196
                }
            }),
            _react2.default.createElement(_reactNative.Image, { resizeMode: _reactNative.Image.resizeMode.contain, style: [styles.imageContainer], source: { uri: _this2.props.user.user.avatar_url }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 198
                }
            }),
            _react2.default.createElement(_ui.Spacer, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 200
                }
            }),
            _react2.default.createElement(
                _ui.Text,
                {
                    style: [styles.menuBottom_text, _theme.AppStyles.textCenterAligned],
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 202
                    }
                },
                _this2.props.user.user.first_name && _this2.props.user.user.last_name ? _this2.props.user.user.first_name + ' ' + _this2.props.user.user.last_name : _this2.props.user.user.role
            ),
            _react2.default.createElement(_ui.Spacer, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 211
                }
            }),
            _react2.default.createElement(
                _reactNative.View,
                { style: [styles.menuContainer], __source: {
                        fileName: _jsxFileName,
                        lineNumber: 213
                    }
                },
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [styles.menu], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 214
                        }
                    },
                    menuItems
                ),
                _react2.default.createElement(
                    _reactNative.View,
                    { style: [styles.menuBottom], __source: {
                            fileName: _jsxFileName,
                            lineNumber: 216
                        }
                    },
                    _react2.default.createElement(
                        _reactNative.View,
                        { style: [_theme.AppStyles.paddingHorizontal, _theme.AppStyles.paddingVerticalSml], __source: {
                                fileName: _jsxFileName,
                                lineNumber: 217
                            }
                        },
                        _react2.default.createElement(_ui.Button, {
                            backgroundColor: MENU_BG_COLOR,
                            title: 'Log Out',
                            onPress: _this2.logout,
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 218
                            }
                        })
                    )
                )
            )
        );
    };
};

exports.default = Menu;