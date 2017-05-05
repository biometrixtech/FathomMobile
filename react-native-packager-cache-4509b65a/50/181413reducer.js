Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = routerReducer;

var _reactNativeRouterFlux = require('react-native-router-flux');

var initialState = {
    scene: {}
};

function routerReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
        case _reactNativeRouterFlux.ActionConst.FOCUS:
            return babelHelpers.extends({}, state, {
                scene: action.scene
            });

        default:
            return state;
    }
}