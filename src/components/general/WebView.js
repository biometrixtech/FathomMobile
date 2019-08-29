/**
 * Web View
 *
 * <WebView url={"http://google.com"} />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import {
    InteractionManager,
    StyleSheet,
    WebView,
} from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, } from '../../constants';

// Components
import { Error, Loading, } from './';

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
                onNavigationStateChange={this.onNavigationStateChange}
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
