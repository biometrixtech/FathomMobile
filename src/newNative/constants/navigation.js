/*
 * @Author: Vir Desai 
 * @Date: 2018-04-24 01:04:37 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-25 14:56:00
 */

import React from 'react';
import { View, Platform } from 'react-native';
import { AppStyles, AppColors } from '../theme/';
import { ActionConst, Actions } from 'react-native-router-flux';

export default {

    // Navbar Props
    navbarProps: {
        hideNavBar:          false,
        titleStyle:          AppStyles.navbarTitle,
        navigationBarStyle:  AppStyles.navbar,
        backTitle:           null,
        backButtonTintColor: AppColors.white,
        onBack:              () => Actions.pop({ type: ActionConst.REFRESH }),
    },

    tabProps: {
        tabBarPosition:          'bottom',
        swipeEnabled:            false,
        activeBackgroundColor:   AppColors.primary.grey.fiftyPercent,
        inactiveBackgroundColor: AppColors.primary.grey.thirtyPercent,
        activeTintColor:         AppColors.primary.grey.hundredPercent,
        inactiveTintColor:       AppColors.primary.grey.hundredPercent,
        tabBarStyle:             {
            backgroundColor: AppColors.secondary.blue.thirtyPercent,
        },
        tabStyle: {
            paddingTop: Platform.OS === 'ios' ? 10 : 0,
        },
    },

    icons: {
        size:  30,
        style: {
            width:       Platform.OS === 'ios' ? 50 : null,
            height:      Platform.OS === 'ios' ? 50 : null,
            paddingLeft: Platform.OS === 'ios' ? 10 : null,
            paddingTop:  Platform.OS === 'ios' ? 5 : null,
        }
    },
};
