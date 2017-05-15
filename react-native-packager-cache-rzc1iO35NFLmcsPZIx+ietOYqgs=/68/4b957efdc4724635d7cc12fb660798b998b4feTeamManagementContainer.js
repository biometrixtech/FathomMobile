Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRedux = require('react-redux');

var _actions = require('@redux/user/actions');

var UserActions = babelHelpers.interopRequireWildcard(_actions);

var _TeamManagementView = require('./TeamManagementView');

var _TeamManagementView2 = babelHelpers.interopRequireDefault(_TeamManagementView);

var mapStateToProps = function mapStateToProps(state) {
    return {
        regimens: state.user.regimens,
        trainingGroups: state.user.trainingGroups
    };
};

var mapDispatchToProps = {
    addGroup: UserActions.addTG,
    editGroup: UserActions.editTG,
    removeGroup: UserActions.removeTG,
    addRegimen: UserActions.addR,
    editRegimen: UserActions.editR,
    removeRegimen: UserActions.removeR,
    addAthlete: UserActions.addA,
    editAthlete: UserActions.editR,
    removeAthlete: UserActions.removeA
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_TeamManagementView2.default);