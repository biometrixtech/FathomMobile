/**
 * Global App Config
 */
/* global __DEV__ */
import { AppColors, AppStyles, AppSizes } from '@theme/';
import {ActionConst, Actions} from 'react-native-router-flux';

export default {
    // App Details
    appName: 'Fathom',

    // Build Configuration - eg. Debug or Release?
    DEV: __DEV__,

    // Google Analytics - uses a 'dev' account while we're testing
    gaTrackingId: (__DEV__) ? 'UA-84284256-2' : 'UA-84284256-1',

    // Navbar Props
    navbarProps: {
        hideNavBar:                   false,
        titleStyle:                   AppStyles.navbarTitle,
        navigationBarStyle:           AppStyles.navbar,
        leftButtonIconStyle:          AppStyles.navbarButton,
        rightButtonIconStyle:         AppStyles.navbarButton,
        onBack:                       () => Actions.pop({ type: ActionConst.REFRESH }),
        navigationBarTitleImage:      require('@images/fathom_colored.png'),
        navigationBarTitleImageStyle: AppStyles.navbarImageTitle,
        sceneStyle:                   {
            backgroundColor: AppColors.background,
            paddingTop:      AppSizes.navbarHeight,
        },
    },
};
