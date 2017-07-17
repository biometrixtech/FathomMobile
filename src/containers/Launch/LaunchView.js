/**
 * Launch Screen
 *  - Shows a nice loading screen whilst:
 *  - Checking if user is logged in, and redirects from there
 */
import React, { Component, PropTypes } from 'react';
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
    indicator: {
        position: 'absolute',
        left:     AppSizes.screen.widthHalf,
        top:      AppSizes.screen.heightHalf
    }
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
        this.props.login()
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
                style={[styles.indicator]}
                animating
                size={'large'}
                color={'#C1C5C8'}
            />
        </View>
    );
}

/* Export Component ==================================================================== */
export default AppLaunch;
