/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:23:33 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-11 23:58:51
 */

/**
 * App Navigation
 */
import React from 'react';
import { Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '../constants/';

// Components
import Drawer from '../containers/ui/DrawerContainer';

// Scenes
import AppNavigation from './appNavigation';
import AuthScenes from './auth';

/* Routes ==================================================================== */
const scenes = (
    <Scene key={'root'} {...AppConfig.navbarProps}>
        {/* Auth */}
        {AuthScenes}

        <Scene key={'app'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}>
            {/* Drawer Side Menu */}
            <Scene key={'sideMenu'} component={Drawer}>
                {AppNavigation}
            </Scene>
        </Scene>
    </Scene>
);

export default scenes;
