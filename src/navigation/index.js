/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:23:33 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-26 18:15:14
 */

/**
 * App Navigation
 */
import React from 'react';
import { Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';

// Components
import Drawer from '@containers/ui/DrawerContainer';

// Scenes
// import AppLaunch from '@containers/Launch/LaunchContainer';
import AppNavigation from './appNavigation';
// import ManagerNavigation from './managerNavigation';
// import AdminNavigation from './adminNavigation';
// import AthleteNavigation from './athleteNavigation';
// import BiometrixNavigation from './biometrixAdminNavigation';
// import ResearcherNavigation from './researcherNavigation';
import AuthScenes from './auth';

/* Routes ==================================================================== */
const scenes = (
    <Scene key={'root'} {...AppConfig.navbarProps}>
        {/* <Scene
            hideNavBar
            key={'splash'}
            component={AppLaunch}
            analyticsDesc={'AppLaunch: Launching App'}
        /> */}

        {/* Auth */}
        {AuthScenes}

        <Scene key={'app'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}>
            {/* Drawer Side Menu */}
            <Scene key={'sideMenu'} component={Drawer}>
                {AppNavigation}
            </Scene>
        </Scene>

        {/* Main Admin App */}
        {/* <Scene key={'adminApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}> */}
        {/* Drawer Side Menu */}
        {/* <Scene key={'adminHome'} component={Drawer}> */}
        {/* {AdminNavigation} */}
        {/* </Scene> */}
        {/* </Scene> */}

        {/* Athlete App */}
        {/* <Scene key={'athleteApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}> */}
        {/* Drawer Side Menu */}
        {/* <Scene key={'sideMenu'} component={Drawer}> */}
        {/* {AthleteNavigation} */}
        {/* </Scene> */}
        {/* </Scene> */}

        {/* Main BiometrixAdmin App */}
        {/* <Scene key={'biometrixApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}> */}
        {/* Drawer Side Menu */}
        {/* <Scene key={'biometrixHome'} component={Drawer}> */}
        {/* {BiometrixNavigation} */}
        {/* </Scene>*/}
        {/* </Scene> */}

        {/* Main Manager App */}
        {/* <Scene key={'managerApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}> */}
        {/* Drawer Side Menu */}
        {/* <Scene key={'managerHome'} component={Drawer}> */}
        {/* {ManagerNavigation} */}
        {/* </Scene> */}
        {/* </Scene> */}

        {/* Main Researcher App */}
        {/* <Scene key={'researcherApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}> */}
        {/* Drawer Side Menu */}
        {/* <Scene key={'researcherHome'} component={Drawer}> */}
        {/* {ResearcherNavigation} */}
        {/* </Scene> */}
        {/* </Scene> */}

    </Scene>
);

export default scenes;
