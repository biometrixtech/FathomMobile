/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:21:21 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:21:21 
 */

import React from 'react';
// import { StatusBar, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Stack } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/es/integration/react';

import Routes from './routes';

// Hide StatusBar on Android as it overlaps tabs
// if (Platform.OS === 'android') {
//     StatusBar.setHidden(true);
// }

const Root = ({ store, persistor }) => (
    <Provider store={store}>
        <PersistGate
            loading={null}
            persistor={persistor}
        >
            <Router>
                <Stack key={'root'}>
                    {Routes}
                </Stack>
            </Router>
        </PersistGate>
    </Provider>
);

Root.propTypes = {
    store:     PropTypes.shape({}).isRequired,
    persistor: PropTypes.shape({}).isRequired,
};

export default Root;
