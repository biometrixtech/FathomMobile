/**
 * WebView
 *
    <WebView
        source={'https://www.fathomai.com/'}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, WebView } from 'react-native';

import { AppColors, AppSizes } from '@constants';

/* Component ==================================================================== */
const WebViewPage = ({ source, style }) => (
    <View
        style={{
            backgroundColor: AppColors.black,
            flex:            1,
            height:          AppSizes.screen.height * 0.75,
            opacity:         0.5,
            width:           AppSizes.screen.width,
        }}
    >
        <WebView
            source={{uri: source}}
        />
    </View>
);

WebViewPage.propTypes = {
    source: PropTypes.string.isRequired,
};
WebViewPage.defaultProps = {};

/* Export Component ==================================================================== */
export default WebViewPage;
