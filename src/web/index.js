/*
 * @Author: Vir Desai 
 * @Date: 2018-04-26 02:31:43 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-30 18:40:54
*/

/* global document */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, browserHistory } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';

import { configureStore } from '../store/index';
import Routes from './routes';

// Components
import Loading from './components/Loading';

// Load css
require('./styles/style.scss');

const { persistor, store } = configureStore();
// persistor.purge(); // Debug to clear persist

const rootElement = document.getElementById('root');

const Root = () => (
    <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
            <Router history={browserHistory}>
                <Routes />
            </Router>
        </PersistGate>
    </Provider>
);

render(<Root />, rootElement);
