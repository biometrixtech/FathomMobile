/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:20:31 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:20:31 
 */

/**
 * Combine All Reducers
 */

import { combineReducers } from 'redux';

// Our custom reducers
// We need to import each one here and add them to the combiner at the bottom
import bluetooth from '@redux/bluetooth/reducer';
import router from '@redux/router/reducer';
import sideMenu from '@redux/sidemenu/reducer';
import user from '@redux/user/reducer';

// Combine all
const appReducer = combineReducers({
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
