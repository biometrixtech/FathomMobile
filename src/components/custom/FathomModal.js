/**
 * Modal
 *
    <FathomModal
        isVisible={isReadinessSurveyModalOpen}
    >
        {...}
    </FathomModal>
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Platform, StatusBar, StyleSheet, } from 'react-native';

// import third-party libraries
import Modal from 'react-native-modal';

// Consts and Libs
import { AppColors, AppSizes, } from '../../constants';

/* Component ==================================================================== */
class FathomModal extends Component {
    static propTypes = {
        isVisible:       PropTypes.bool.isRequired,
        updateStatusBar: PropTypes.bool,
    }

    static defaultProps = {
        updateStatusBar: false,
    };

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { isVisible, updateStatusBar, } = this.props;
        if(
            Platform.OS === 'android' &&
            isVisible &&
            updateStatusBar &&
            prevProps.isVisible !== isVisible
        ) {
            StatusBar.setBackgroundColor('rgba(15, 19, 32, 0.8)', true);
            StatusBar.setBarStyle('dark-content', true);
        } else if(
            Platform.OS === 'android' &&
            !isVisible &&
            updateStatusBar &&
            prevProps.isVisible !== isVisible
        ) {
            StatusBar.setBackgroundColor(AppColors.white, true);
            StatusBar.setBarStyle('dark-content', true);
        }
    }

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
export default FathomModal;
