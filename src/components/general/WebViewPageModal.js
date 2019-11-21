/**
 * Privacy Policy Modal
 *
    <WebViewPageModal
        handleModalToggle={this._togglePrivacyPolicyWebView}
        isModalOpen={this.state.isModalOpen}
        webViewPageSource={'https://www.fathomai.com/privacy/'}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, StyleSheet, TouchableHighlight, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, } from '../../constants';

// Components
import { FathomModal, Text, } from '../custom';

// import third-party libraries
import { WebView, } from 'react-native-webview';

/* Component ==================================================================== */
const WebViewPageModal = ({
    handleModalToggle,
    isModalOpen,
    webViewPageSource,
}) => (
    <FathomModal
        backdropColor={AppColors.white}
        backdropOpacity={1}
        isVisible={isModalOpen}
    >
        <View style={{backdropOpacity: AppColors.white, flex: 1, paddingTop: AppSizes.statusBarHeight,}}>
            <WebView
                automaticallyAdjustContentInsets={false}
                cacheEnabled={false}
                cacheMode={'LOAD_NO_CACHE'}
                originWhitelist={['*']}
                source={{ uri: webViewPageSource, }}
                startInLoadingState={true}
                style={{flex: 1,}}
            />
            <TouchableHighlight
                onPress={() => handleModalToggle()}
                style={[AppStyles.nextButtonWrapper]}
                underlayColor={AppColors.transparent}
            >
                <Text style={[AppStyles.nextButtonText]}>{'DONE'}</Text>
            </TouchableHighlight>
        </View>
    </FathomModal>
)

WebViewPageModal.propTypes = {
    handleModalToggle: PropTypes.func.isRequired,
    isModalOpen:       PropTypes.bool.isRequired,
    webViewPageSource: PropTypes.string.isRequired,
};

WebViewPageModal.defaultProps = {};

WebViewPageModal.componentName = 'WebViewPageModal';

/* Export Component ==================================================================== */
export default WebViewPageModal;
