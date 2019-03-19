/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:29:10
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-09 19:59:54
 */

/**
 * Form Label
 *
     <FormLabel></FormLabel>
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLabel, } from 'react-native-elements';

/* Component ==================================================================== */
class CustomFormLabel extends Component {
    static propTypes = {
        children:       PropTypes.node,
        containerStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
        labelStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
    }

    static defaultProps = {
        children:       null,
        containerStyle: [],
        labelStyle:     [],
    }

    labelProps = () => {
        // Defaults
        const props = {
            ...this.props,
            containerStyle: [{}],
            labelStyle:     [{}],
        };

        if (this.props.containerStyle) {
            props.containerStyle.push(this.props.containerStyle);
        }

        if (this.props.labelStyle) {
            props.labelStyle.push(this.props.labelStyle);
        }

        return props;
    }

    render = () => <FormLabel {...this.labelProps()}>{this.props.children}</FormLabel>;
}

/* Export Component ==================================================================== */
export default CustomFormLabel;
