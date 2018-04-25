/*
 * @Author: Vir Desai 
 * @Date: 2018-04-24 01:04:37 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 23:38:09
 */

import React from 'react';
import { View } from 'react-native';
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
        tabBarStyle:             {
            backgroundColor: AppColors.secondary.blue.thirtyPercent,
        },
        tabStyle: {
            paddingTop: 10,
        },
    },

    icons: {
        color: AppColors.primary.grey.hundredPercent,
        size:  30,
        style: {
            width:       50,
            height:      50,
            paddingLeft: 10,
            paddingTop:  5,
        }
    },
};
