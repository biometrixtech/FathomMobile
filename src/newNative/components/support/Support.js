/*
 * @Author: Vir Desai 
 * @Date: 2018-03-22 23:11:22 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-25 01:27:36
 */

/**
 * Support View
 */
import React, { Component } from 'react';
import { Platform, BackHandler } from 'react-native';

// Components
import { Placeholder } from '../general/';


/* Component ==================================================================== */
class Support extends Component {
    static propTypes = {}

    static defaultProps = {}

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

    render = () => <Placeholder />
}

/* Export Component ==================================================================== */
export default Support;
