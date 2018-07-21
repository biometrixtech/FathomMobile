/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:29:24 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:25:29
 */

/**
 * List
 *
     <List><ListView /></List>
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'react-native-elements';

// Consts and Libs
import { AppColors } from '../../constants';

/* Component ==================================================================== */
class CustomList extends Component {
    static propTypes = {
        containerStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
    }

    static defaultProps = {
        containerStyle: [],
    }

    listProps = () => {
        // Defaults
        const props = {
            ...this.props,
            containerStyle: [{
                margin:            0,
                backgroundColor:   AppColors.white,
                borderTopColor:    AppColors.border,
                borderBottomWidth: 0,
            }],
        };

        if (this.props.containerStyle) {
            props.containerStyle.push(this.props.containerStyle);
        }

        return props;
    }

    render = () => <List {...this.listProps()} />;
}

/* Export Component ==================================================================== */
export default CustomList;
