Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRedux = require('react-redux');

var _actions = require('@redux/user/actions');

var UserActions = babelHelpers.interopRequireWildcard(_actions);

var _RegimensView = require('./RegimensView');

var _RegimensView2 = babelHelpers.interopRequireDefault(_RegimensView);

var mapStateToProps = function mapStateToProps(state) {
    return {
        regimens: state.user.regimens,
        trainingGroups: state.user.trainingGroups
    };
};

var mapDispatchToProps = {
    addRegimen: UserActions.addR,
    editRegimen: UserActions.editR,
    removeRegimen: UserActions.removeR
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_RegimensView2.default);