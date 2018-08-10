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
import { FormLabel } from 'react-native-elements';

// Consts and Libs
import { AppColors, AppFonts } from '../../constants';

/* Component ==================================================================== */
class CustomFormLabel extends Component {
    static propTypes = {
        labelStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
        children: PropTypes.node,
    }

    static defaultProps = {
        containerStyle: [],
        labelStyle:     [],
        children:       null,
    }

    labelProps = () => {
        // Defaults
        const props = {
            ...this.props,
            labelStyle: [{
                ...AppFonts.oswaldMedium,
                color: AppColors.primary.grey.hundredPercent,
            }],
        };

        if (this.props.labelStyle) {
            props.labelStyle.push(this.props.labelStyle);
        }

        return props;
    }

    render = () => <FormLabel {...this.labelProps()}>{this.props.children}</FormLabel>;
}

/* Export Component ==================================================================== */
export default CustomFormLabel;
