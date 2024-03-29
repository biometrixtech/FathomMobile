/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:29:29
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:25:36
 */

/**
 * List Items
 *
     <ListItem title={'Hello World'} />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'react-native-elements';

// Consts and Libs
import { AppColors, AppStyles } from '../../constants';

/* Component ==================================================================== */
class CustomListItem extends Component {
    static propTypes = {
        chevronColor:   PropTypes.string,
        containerStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
        titleStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
        subtitleStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
    }

    static defaultProps = {
        chevronColor:   AppColors.secondary.blue.hundredPercent,
        containerStyle: [],
        titleStyle:     [],
        subtitleStyle:  [],
    }

    listItemProps = () => {
        // Defaults
        const props = {
            title:          'Coming Soon...',
            chevronColor:   this.props.chevronColor,
            underlayColor:  AppColors.border,
            ...this.props,
            containerStyle: [{
                backgroundColor:   AppColors.white,
                borderTopColor:    AppColors.border,
                borderBottomColor: AppColors.border,
            }],
            titleStyle:    [AppStyles.baseText],
            subtitleStyle: [AppStyles.subtext],
        };

        if (this.props.containerStyle) {
            props.containerStyle.push(this.props.containerStyle);
        }

        if (this.props.titleStyle) {
            props.titleStyle.push(this.props.titleStyle);
        }

        if (this.props.subtitleStyle) {
            props.subtitleStyle.push(this.props.subtitleStyle);
        }

        props.titleProps = { allowFontScaling: false, };

        if(this.props.titleProps) {
            props.titleProps = this.props.titleProps;
        }

        return props;
    }

    render = () => <ListItem {...this.listItemProps()} />;
}

/* Export Component ==================================================================== */
export default CustomListItem;
