/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:35:08 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-08 14:39:41
 */

/**
 * Launch Screen
 *  - Shows a nice loading screen whilst:
 *  - Checking if user is logged in, and redirects from there
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StatusBar,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    launchImage: {
        width:  AppSizes.screen.width,
        height: AppSizes.screen.height,
    },
});

/* Component ==================================================================== */
class AppLaunch extends Component {
    static componentName = 'AppLaunch';

    static propTypes = {
        login: PropTypes.func.isRequired,
    }

    componentDidMount = () => {
        // Show status bar on app launch
        StatusBar.setHidden(false, true);

        // Try to login based on existing token
        return this.props.login()
        // Logged in, show index screen
            .then(() => Actions.app({ type: 'reset' }))
        // Not Logged in, show Login screen
            .catch(() => Actions.login({ type: 'reset' }));
    }

    render = () => (
        <View style={[AppStyles.container]}>
            <Image
                source={require('@images/fathom_colored.png')}
                style={[styles.launchImage, AppStyles.containerCentered]}
                resizeMode={'contain'}
            />
            <ActivityIndicator
                style={[AppStyles.ActivityIndicator]}
                size={'large'}
                color={'#C1C5C8'}
            />
        </View>
    );
}

/* Export Component ==================================================================== */
export default AppLaunch;
