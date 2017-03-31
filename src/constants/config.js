/**
 * Global App Config
 */
/* global __DEV__ */
import { AppColors, AppStyles, AppSizes } from '@theme/';

export default {
    // App Details
    appName: 'Fathom',

    // Build Configuration - eg. Debug or Release?
    DEV: __DEV__,

    // Navbar Props
    navbarProps: {
        hideNavBar:           false,
        titleStyle:           AppStyles.navbarTitle,
        navigationBarStyle:   AppStyles.navbar,
        leftButtonIconStyle:  AppStyles.navbarButton,
        rightButtonIconStyle: AppStyles.navbarButton,
        sceneStyle:           {
            backgroundColor: AppColors.background,
            paddingTop:      AppSizes.navbarHeight,
        },
    },
};
