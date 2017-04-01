/**
 * User Reducer
 */

// Set initial state
const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
    case 'USER_REPLACE':
        delete action.data.created_at;
        return {
            ...state,
            user: action.data,
        };
    case 'SIGN_UP_SUCCESS':
        return {
            ...state,
        };
    case 'FORGOT_PASSWORD_SUCCESS':
        return {
            ...state,
        };

    default:
        return state;
    }
}
