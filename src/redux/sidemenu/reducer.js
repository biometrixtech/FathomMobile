/**
 * Sidemenu Reducer
 */

const Actions = require('../actionTypes');

// Set initial state
export const initialState = {
    isOpen:          false,
    disableGestures: false,
};

export default function sideMenuReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.SIDEMENU_TOGGLE:
        return {
            ...state,
            isOpen: !state.isOpen,
        };
    case Actions.SIDEMENU_OPEN:
        return {
            ...state,
            isOpen: true,
        };
    case Actions.SIDEMENU_CLOSE:
        return {
            ...state,
            isOpen: false,
        };
    default:
        return state;
    }
}
