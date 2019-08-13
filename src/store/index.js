/*
 * @Author: Vir Desai
 * @Date: 2018-04-30 13:20:48
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:09:28
 */

/* global window __DEV__ */
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { createLogger } from 'redux-logger';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import reducers from '../reducers';

let store;
// Redux Persist config
const config = {
    key:       'root',
    timeout:   0, // the code base checks for falsy, so 0 disables
    storage,
    whitelist: ['init', 'user', 'plan'],
};

const reducer = persistCombineReducers(config, reducers);

let middleware = [thunk]; // Allows action creators to return functions (not just plain objects)

if (__DEV__) {
    // Dev-only middleware
    middleware = [
        ...middleware,
        createLogger(), // Logs state changes to the dev console
    ];
} else {
    console.log = () => {};
}

const configureStore = () => {
    const configuredStore = createStore(
        reducer,
        compose(
            applyMiddleware(...middleware),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        ),
    );

    const persistor = persistStore(
        configuredStore,
        null,
        () => { configuredStore.getState(); },
    );

    store = configuredStore;
    return { persistor, store: configuredStore };
};

export {
    configureStore,
    store,
};
