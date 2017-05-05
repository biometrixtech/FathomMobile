var _reactRedux = require('react-redux');

var _actions = require('@redux/sidemenu/actions');

var SideMenuActions = babelHelpers.interopRequireWildcard(_actions);

var _NavbarMenuButtonView = require('./NavbarMenuButtonView');

var _NavbarMenuButtonView2 = babelHelpers.interopRequireDefault(_NavbarMenuButtonView);

var mapStateToProps = function mapStateToProps() {
  return {};
};

var mapDispatchToProps = {
  toggleSideMenu: SideMenuActions.toggle
};

exports.NavbarMenuButton = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_NavbarMenuButtonView2.default);