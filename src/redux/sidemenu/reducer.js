/**
 * Sidemenu Reducer
 */

// Set initial state
export const initialState = {
    isOpen:          false,
    disableGestures: false,
};

export default function sideMenuReducer(state = initialState, action) {
    switch (action.type) {
    case 'SIDEMENU_TOGGLE':
        return {
            ...state,
            isOpen: !state.isOpen,
        };
    case 'SIDEMENU_OPEN':
        return {
            ...state,
            isOpen: true,
        };
    case 'SIDEMENU_CLOSE':
        return {
            ...state,
            isOpen: false,
        };
    default:
        return state;
    }
}
