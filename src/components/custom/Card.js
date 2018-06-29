/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:28:47 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 16:43:41
 */

/**
 * Cards
 *
     <Card></Card>
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-native-elements';

// Consts and Libs
import { AppColors, AppSizes, AppStyles } from '../../constants/';

/* Component ==================================================================== */
class CustomCard extends Component {
    static propTypes = {
        containerStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
        titleStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
    }

    static defaultProps = {
        containerStyle: [],
        titleStyle:     [],
    }

    cardProps = () => {
        // Defaults
        const props = {
            dividerStyle: [{
                backgroundColor: AppColors.border
            }],
            ...this.props,
            containerStyle: [{
                backgroundColor: AppColors.white,
                borderRadius:    AppSizes.borderRadius,
                borderColor:     AppColors.border,
                width:           AppSizes.screen.width * 0.85,
            }],
            titleStyle: [
                AppStyles.h2,
                { marginBottom: 15 },
            ],
        };

        if (this.props.containerStyle) {
            props.containerStyle.push(this.props.containerStyle);
        }

        if (this.props.titleStyle) {
            props.titleStyle.push(this.props.titleStyle);
        }

        return props;
    }

    render = () => <Card {...this.cardProps()} />
}

/* Export Component ==================================================================== */
export default CustomCard;
