Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRedux = require('react-redux');

var _actions = require('@redux/user/actions');

var UserActions = babelHelpers.interopRequireWildcard(_actions);

var _GroupsView = require('./GroupsView');

var _GroupsView2 = babelHelpers.interopRequireDefault(_GroupsView);

var mapStateToProps = function mapStateToProps(state) {
    return {
        trainingGroups: state.user.trainingGroups
    };
};

var mapDispatchToProps = {
    addGroup: UserActions.addTG,
    editGroup: UserActions.editTG,
    removeGroup: UserActions.removeTG
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_GroupsView2.default);