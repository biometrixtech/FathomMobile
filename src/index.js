/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:18:24 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-13 18:42:09
 */

 /**
 * Index - this is where everything starts - but offloads to app.js
 */
/* global __DEV__ */
import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { Router } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles } from '@theme/';
import AppRoutes from '@navigation/';
import { Analytics } from '@lib/';

// All redux reducers (rolled into one mega-reducer)
import rootReducer from '@redux/index';

// Connect RNRF with Redux
const RouterWithRedux = connect()(Router);

// Load middleware
let middleware = [
    Analytics,
    thunk, // Allows action creators to return functions (not just plain objects)
];

if (__DEV__) {
    // Dev-only middleware
    middleware = [
        ...middleware,
        createLogger(), // Logs state changes to the dev console
    ];
} else {
    console.log = () => {};
}

// Init redux store (using the given reducer & middleware)
const store = compose(
    applyMiddleware(...middleware),
)(createStore)(rootReducer);

/* Component ==================================================================== */
// Wrap App in Redux provider (makes Redux available to all sub-components)
export default function AppContainer() {
    return (
        <Provider store={store}>
            <RouterWithRedux style={AppStyles.appContainer}>
                {AppRoutes}
            </RouterWithRedux>
        </Provider>
    );
}
