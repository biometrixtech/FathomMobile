Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRedux = require('react-redux');

var _actions = require('@redux/user/actions');

var UserActions = babelHelpers.interopRequireWildcard(_actions);

var _AthletesView = require('./AthletesView');

var _AthletesView2 = babelHelpers.interopRequireDefault(_AthletesView);

var mapStateToProps = function mapStateToProps(state) {
    return {
        regimens: state.user.regimens,
        trainingGroups: state.user.trainingGroups
    };
};

var mapDispatchToProps = {
    addAthlete: UserActions.addA,
    removeAthlete: UserActions.removeA
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_AthletesView2.default);