Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = sideMenuReducer;


var Actions = require('../actionTypes');

var initialState = exports.initialState = {
    isOpen: false,
    disableGestures: false
};

function sideMenuReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
        case Actions.SIDEMENU_TOGGLE:
            return babelHelpers.extends({}, state, {
                isOpen: !state.isOpen
            });
        case Actions.SIDEMENU_OPEN:
            return babelHelpers.extends({}, state, {
                isOpen: true
            });
        case Actions.SIDEMENU_CLOSE:
            return babelHelpers.extends({}, state, {
                isOpen: false
            });
        default:
            return state;
    }
}