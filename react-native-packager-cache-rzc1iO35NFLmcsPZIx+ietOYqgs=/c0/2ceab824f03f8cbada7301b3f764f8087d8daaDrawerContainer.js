Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/containers/ui/DrawerContainer.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactRedux = require('react-redux');

var _reactNativeSideMenu = require('react-native-side-menu');

var _reactNativeSideMenu2 = babelHelpers.interopRequireDefault(_reactNativeSideMenu);

var _reactNativeRouterFlux = require('react-native-router-flux');

var _theme = require('@theme/');

var _MenuContainer = require('@containers/ui/Menu/MenuContainer');

var _MenuContainer2 = babelHelpers.interopRequireDefault(_MenuContainer);

var _reactNativeElements = require('react-native-elements');

var _actions = require('@redux/sidemenu/actions');

var SideMenuActions = babelHelpers.interopRequireWildcard(_actions);

var mapStateToProps = function mapStateToProps(state) {
    return {
        sideMenuIsOpen: state.sideMenu.isOpen
    };
};

var mapDispatchToProps = {
    toggleSideMenu: SideMenuActions.toggle,
    closeSideMenu: SideMenuActions.close
};

var Drawer = function (_Component) {
    babelHelpers.inherits(Drawer, _Component);

    function Drawer() {
        var _ref;

        var _temp, _this, _ret;

        babelHelpers.classCallCheck(this, Drawer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = Drawer.__proto__ || Object.getPrototypeOf(Drawer)).call.apply(_ref, [this].concat(args))), _this), _this.onSideMenuChange = function (isOpen) {
            if (isOpen !== _this.props.sideMenuIsOpen) {
                _this.props.toggleSideMenu();
            }
        }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
    }

    babelHelpers.createClass(Drawer, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var state = this.props.navigationState;
            var children = state.children;

            return _react2.default.createElement(
                _reactNativeSideMenu2.default,
                {
                    ref: function ref(a) {
                        _this2.rootSidebarMenu = a;
                    },
                    openMenuOffset: _theme.AppSizes.screen.width * 0.75,
                    menu: _react2.default.createElement(_MenuContainer2.default, {
                        closeSideMenu: this.props.closeSideMenu,
                        ref: function ref(b) {
                            _this2.rootSidebarMenuMenu = b;
                        },
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 70
                        }
                    }),
                    isOpen: this.props.sideMenuIsOpen,
                    onChange: this.onSideMenuChange,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 66
                    }
                },
                _react2.default.createElement(
                    _reactNative.View,
                    { style: { backgroundColor: '#000', flex: 1 }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 78
                        }
                    },
                    _react2.default.createElement(_reactNativeRouterFlux.DefaultRenderer, { navigationState: children[0], onNavigate: this.props.onNavigate, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 79
                        }
                    })
                )
            );
        }
    }]);
    return Drawer;
}(_react.Component);

Drawer.componentName = 'Drawer';
Drawer.propTypes = {
    navigationState: _react.PropTypes.shape({}),
    onNavigate: _react.PropTypes.func,
    sideMenuIsOpen: _react.PropTypes.bool,
    closeSideMenu: _react.PropTypes.func.isRequired,
    toggleSideMenu: _react.PropTypes.func.isRequired
};
Drawer.defaultProps = {
    navigationState: null,
    onNavigate: null,
    sideMenuIsOpen: null
};
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Drawer);