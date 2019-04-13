/**
 * Modal
 *
     <Modal />
 *
 */
import React, { Component, } from 'react';
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
        const props = {
            backdropColor:   AppColors.zeplin.darkNavy,
            backdropOpacity: 0.8,
            deviceHeight:    AppSizes.screen.height,
            deviceWidth:     AppSizes.screen.width,
            ...this.props,
        };
        return props;
    }

    render = () => <Modal {...this.modalProps()} />;
}

/* Export Component ==================================================================== */
export default FathomSlider;
