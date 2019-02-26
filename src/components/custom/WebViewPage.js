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
import { View, } from 'react-native';

// import third-party libraries
import { WebView, } from 'react-native-webview';

// import consts
import { AppColors, AppSizes, } from '../../constants';

/* Component ==================================================================== */
const WebViewPage = ({
    allowsInlineMediaPlayback,
    backgroundColor,
    height,
    scrollEnabled,
    source,
    width,
}) => (
    <View
        style={{
            flex:    1,
            height:  height ? height : AppSizes.screen.height * 0.75,
            opacity: 0.5,
            width:   width ? width : AppSizes.screen.width,
        }}
    >
        <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
        <WebView
            allowsInlineMediaPlayback={allowsInlineMediaPlayback}
            originWhitelist={['*']}
            scrollEnabled={scrollEnabled}
            source={{uri: source}}
            startInLoadingState={true}
            style={{flex: 1,}}
        />
    </View>
);

WebViewPage.propTypes = {
    allowsInlineMediaPlayback: PropTypes.bool,
    backgroundColor:           PropTypes.string,
    height:                    PropTypes.number,
    scrollEnabled:             PropTypes.bool,
    source:                    PropTypes.string.isRequired,
    width:                     PropTypes.number,
};

WebViewPage.defaultProps = {
    allowsInlineMediaPlayback: false,
    backgroundColor:           null,
    height:                    null,
    scrollEnabled:             true,
    width:                     null,
};

/* Export Component ==================================================================== */
export default WebViewPage;
