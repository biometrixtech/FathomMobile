/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:31:10 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-21 15:40:24
 */

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
    gaTrackingId: (__DEV__) ? 'UA-102568973-1' : 'UA-102561813-1',

    // Navbar Props
    navbarProps: {
        hideNavBar:                   false,
        titleStyle:                   AppStyles.navbarTitle,
        navigationBarStyle:           AppStyles.navbar,
        leftButtonIconStyle:          AppStyles.navbarButton,
        rightButtonIconStyle:         AppStyles.navbarButton,
        onBack:                       () => Actions.pop({ type: ActionConst.REFRESH }),
        navigationBarTitleImage:      require('@images/fathom_gold_and_grey.png'),
        navigationBarTitleImageStyle: AppStyles.navbarImageTitle,
        sceneStyle:                   {
            backgroundColor: AppColors.white,
            paddingTop:      AppSizes.navbarHeight,
        },
    },
};
