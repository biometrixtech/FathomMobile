/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:29:10 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-23 16:50:55
 */

/**
 * Text Input
 *
     <FormLabel></FormLabel>
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLabel } from 'react-native-elements';

// Consts and Libs
import { AppFonts } from '../../theme/';
import { AppColors } from '../../../constants/';

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
                color:      AppColors.primary.grey.hundredPercent,
                fontFamily: AppFonts.base.family,
                fontWeight: AppFonts.h0.fontWeight
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
