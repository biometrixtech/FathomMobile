/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 15:49:27 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-25 01:29:44
 */

/**
 * Connections View
 */
import React, { Component } from 'react';
import { Platform, BackHandler } from 'react-native';

// Components
import { Placeholder } from '../general/';


/* Component ==================================================================== */
class Connections extends Component {
    static propTypes = {
    }

    static defaultProps = {
    }

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => null);
        }
    }

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    render = () => (
        <Placeholder />
    );
}

/* Export Component ==================================================================== */
export default Connections;
