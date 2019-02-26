/**
 * Privacy Policy Modal
 *
    <PrivacyPolicyModal
        handleModalToggle={this._togglePrivacyPolicyWebView}
        isPrivacyPolicyOpen={this.state.isPrivacyPolicyOpen}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, StyleSheet, TouchableHighlight, View, } from 'react-native';

// import third-party libraries
import Modal from 'react-native-modalbox';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, } from '../../constants';

// Components
import { Text, WebViewPage, } from '../custom';

/* Component ==================================================================== */
const PrivacyPolicyModal = ({
    handleModalToggle,
    isPrivacyPolicyOpen,
}) => (
    <Modal
        backdropPressToClose={false}
        coverScreen={true}
        isOpen={isPrivacyPolicyOpen}
        swipeToClose={false}
        useNativeDriver={false}
    >
        <WebViewPage
            source={'https://www.fathomai.com/privacy/'}
        />
        <TouchableHighlight
            onPress={() => handleModalToggle()}
            style={[AppStyles.nextButtonWrapper]}
            underlayColor={AppColors.transparent}
        >
            <Text style={[AppStyles.nextButtonText]}>{'DONE'}</Text>
        </TouchableHighlight>
    </Modal>
)

PrivacyPolicyModal.propTypes = {
    handleModalToggle:   PropTypes.func.isRequired,
    isPrivacyPolicyOpen: PropTypes.bool.isRequired,
};

PrivacyPolicyModal.defaultProps = {};

PrivacyPolicyModal.componentName = 'PrivacyPolicyModal';

/* Export Component ==================================================================== */
export default PrivacyPolicyModal;
