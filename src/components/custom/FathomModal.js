/**
 * Modal
 *
     <Modal />
 *
 */
import React, { Component, } from 'react';
import { StyleSheet, } from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import Modal from 'react-native-modal';

// Consts and Libs
import { AppColors, AppSizes, } from '../../constants';

/* Component ==================================================================== */
class FathomSlider extends Component {
    static propTypes = {}

    static defaultProps = {};

    modalProps = () => {
        let props = {
            backdropColor:   AppColors.zeplin.darkNavy,
            backdropOpacity: 0.8,
            deviceHeight:    AppSizes.screen.height,
            deviceWidth:     AppSizes.screen.width,
            style:           {margin: 0,},
            ...this.props,
        };
        if(this.props.style) {
            props.style = [{margin: 0,}, StyleSheet.flatten(this.props.style)];
        }
        return props;
    }

    render = () => <Modal {...this.modalProps()} />;
}

/* Export Component ==================================================================== */
export default FathomSlider;
