/**
 * Web View
 *
 * <WebView url={"http://google.com"} />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { InteractionManager, StyleSheet, } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, } from '../../constants';

// Components
import { Error, Loading, } from './';

// import third-party libraries
import { WebView, } from 'react-native-webview';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.background,
    },
});

/* Component ==================================================================== */
class AppWebView extends Component {
    static componentName = 'AppWebView';

    static propTypes = {
        url:                     PropTypes.string.isRequired,
        onNavigationStateChange: PropTypes.func,
    }

    static defaultProps = {
        onNavigationStateChange: null,
    }

    constructor(props) {
        super(props);

        this.state = {
            loading:    true,
            webViewURL: props.url || null,
        };
    }

    componentDidMount = () => {
        // Wait until interaction has finished before loading the webview in
        InteractionManager.runAfterInteractions(() => {
            this.setState({ loading: false });
        });
    }

    /**
      * Each time page loads, update the URL
      */
    onNavigationStateChange = (navState) => {
        this.state.webViewURL = navState.url;
        if (this.props.onNavigationStateChange) {
            this.props.onNavigationStateChange(navState.url);
        }
    }

    render = () => {
        const { loading, webViewURL, } = this.state;

        if (loading) { return (<Loading />); }
        if (!webViewURL) { return (<Error type={'URL not defined.'} />); }

        return (
            <WebView
                automaticallyAdjustContentInsets={false}
                cacheEnabled={false}
                cacheMode={'LOAD_NO_CACHE'}
                onNavigationStateChange={this.onNavigationStateChange}
                originWhitelist={['*']}
                scalesPageToFit={true}
                source={{ uri: webViewURL, }}
                startInLoadingState={true}
                style={[AppStyles.container, styles.container,]}
            />
        );
    }
}

/* Export Component ==================================================================== */
export default AppWebView;
