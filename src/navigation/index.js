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
import AppLaunch from '@containers/Launch/LaunchContainer';
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
        <Scene
            hideNavBar
            key={'splash'}
            component={AppLaunch}
            analyticsDesc={'AppLaunch: Launching App'}
        />

        {/* Auth */}
        {AuthScenes}

        <Scene key={'app'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}>
            {/* Drawer Side Menu */}
            <Scene key={'sideMenu'} component={Drawer}>
                {/* Radial Menus */}
                {AppNavigation}
                {/*</Scene>*/}
            </Scene>
        </Scene>

        {/* Main Admin App */}
        {/* <Scene key={'adminApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}> */}
        {/* Drawer Side Menu */}
        {/* <Scene key={'adminHome'} component={Drawer}> */}
        {/* Radial Menus */}
        {/* {AdminNavigation} */}
        {/*</Scene>*/}
        {/* </Scene> */}
        {/* </Scene> */}

        {/* Main Athlete App */}
        {/* <Scene key={'athleteApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}> */}
        {/* Drawer Side Menu */}
        {/* <Scene key={'athleteHome'} component={Drawer}> */}
        {/* Radial Menus */}
        {/* {AthleteNavigation} */}
        {/*</Scene>*/}
        {/* </Scene> */}
        {/* </Scene> */}

        {/* Main BiometrixAdmin App */}
        {/* <Scene key={'biometrixApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}> */}
        {/* Drawer Side Menu */}
        {/* <Scene key={'biometrixHome'} component={Drawer}> */}
        {/* Radial Menus */}
        {/* {BiometrixNavigation} */}
        {/* </Scene> */}
        {/* </Scene>*/}
        {/* </Scene> */}

        {/* Main Manager App */}
        {/* <Scene key={'managerApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}> */}
        {/* Drawer Side Menu */}
        {/* <Scene key={'managerHome'} component={Drawer}> */}
        {/* Radial Menus */}
        {/* {ManagerNavigation} */}
        {/*</Scene>*/}
        {/* </Scene> */}
        {/* </Scene> */}

        {/* Main Researcher App */}
        {/* <Scene key={'researcherApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}> */}
        {/* Drawer Side Menu */}
        {/* <Scene key={'researcherHome'} component={Drawer}> */}
        {/* Radial Menus */}
        {/* {ResearcherNavigation} */}
        {/*</Scene>*/}
        {/* </Scene> */}
        {/* </Scene> */}

    </Scene>
);

export default scenes;
