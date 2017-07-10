/**
 * Combine All Reducers
 */

import { combineReducers } from 'redux';

// Our custom reducers
// We need to import each one here and add them to the combiner at the bottom
import accessory from '@redux/accessory/reducer';
import bluetooth from '@redux/bluetooth/reducer';
import router from '@redux/router/reducer';
import sideMenu from '@redux/sidemenu/reducer';
import user from '@redux/user/reducer';

// Combine all
const appReducer = combineReducers({
    accessory,
    bluetooth,
    router,
    sideMenu,
    user,
});

// Setup root reducer
const rootReducer = (state, action) => {
    const newState = (action.type === 'RESET') ? null : state;
    return appReducer(newState, action);
};

export default rootReducer;
