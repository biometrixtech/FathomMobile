/*
 * @Author: Vir Desai 
 * @Date: 2018-03-22 23:11:22 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-22 23:14:39
 */

/**
 * Support View
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

// Components
import { Placeholder } from '@general/';


/* Component ==================================================================== */
class Support extends Component {
    static propTypes = {}

    static defaultProps = {}

    constructor(props) {
        super(props);

        this.state = {};
    }

    render = () => <Placeholder />
}

/* Export Component ==================================================================== */
export default Support;
