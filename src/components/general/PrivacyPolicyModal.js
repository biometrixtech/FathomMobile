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

// Consts and Libs
import { AppColors, AppSizes, AppStyles, } from '../../constants';

// Components
import { FathomModal, Text, WebViewPage, } from '../custom';

/* Component ==================================================================== */
const PrivacyPolicyModal = ({
    handleModalToggle,
    isPrivacyPolicyOpen,
}) => (
    <FathomModal
        backdropColor={AppColors.white}
        backdropOpacity={1}
        isVisible={isPrivacyPolicyOpen}
        style={{margin: 0,}}
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
    </FathomModal>
)

PrivacyPolicyModal.propTypes = {
    handleModalToggle:   PropTypes.func.isRequired,
    isPrivacyPolicyOpen: PropTypes.bool.isRequired,
};

PrivacyPolicyModal.defaultProps = {};

PrivacyPolicyModal.componentName = 'PrivacyPolicyModal';

/* Export Component ==================================================================== */
export default PrivacyPolicyModal;
