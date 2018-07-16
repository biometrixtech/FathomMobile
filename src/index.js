/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:21:21 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:49:00
 */

import React, { Component } from 'react';
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

class Root extends Component {
    static propTypes = {
        store:     PropTypes.shape({}).isRequired,
        persistor: PropTypes.shape({}).isRequired,
    }

    constructor(props) {
        super(props);
    }

    render = () => (
        <Provider store={this.props.store}>
            <PersistGate
                loading={null}
                persistor={this.props.persistor}
            >
                <Router>
                    <Stack key={'root'}>
                        {Routes}
                    </Stack>
                </Router>
            </PersistGate>
        </Provider>
    );
}

export default Root;
