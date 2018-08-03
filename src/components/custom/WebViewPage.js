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

import { AppColors, AppSizes } from '../../constants';

/* Component ==================================================================== */
const WebViewPage = ({ backgroundColor, height, scrollEnabled, source, width, }) => (
    <View
        style={{
            backgroundColor: backgroundColor ? backgroundColor : AppColors.black,
            flex:            1,
            height:          height ? height : AppSizes.screen.height * 0.75,
            opacity:         0.5,
            width:           width ? width : AppSizes.screen.width,
        }}
    >
        <WebView
            scrollEnabled={scrollEnabled}
            source={{uri: source}}
            style={{flex: 1}}
        />
    </View>
);

WebViewPage.propTypes = {
    backgroundColor: PropTypes.string,
    height:          PropTypes.number,
    scrollEnabled:   PropTypes.bool,
    source:          PropTypes.string.isRequired,
    width:           PropTypes.number,
};
WebViewPage.defaultProps = {
    backgroundColor: null,
    height:          null,
    scrollEnabled:   true,
    width:           null,
};

/* Export Component ==================================================================== */
export default WebViewPage;
