/**
 * Privacy Policy Modal
 *
    <ContactUsModal
        handleModalToggle={this._togglePrivacyPolicyWebView}
        isPrivacyPolicyOpen={this.state.isPrivacyPolicyOpen}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, } from '../../constants';

// Components
import { FathomModal, Text, WebViewPage, } from '../custom';

/* Component ==================================================================== */
const ContactUsModal = ({
    handleModalToggle,
    isPrivacyPolicyOpen,
}) => (
    <FathomModal
        backdropColor={AppColors.white}
        backdropOpacity={1}
        isVisible={isPrivacyPolicyOpen}
    >
        <WebViewPage
            source={'https://www.fathomai.com/contact/'}
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

ContactUsModal.propTypes = {
    handleModalToggle:   PropTypes.func.isRequired,
    isPrivacyPolicyOpen: PropTypes.bool.isRequired,
};

ContactUsModal.defaultProps = {};

ContactUsModal.componentName = 'ContactUsModal';

/* Export Component ==================================================================== */
export default ContactUsModal;