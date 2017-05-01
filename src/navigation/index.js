/**
 * App Navigation
 */
import React from 'react';
import { Actions, Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';

// Components
import Drawer from '@containers/ui/DrawerContainer';

// Scenes
import AppLaunch from '@containers/Launch/LaunchContainer';
import ManagerNavigation from './managerNavigation';
import AdminNavigation from './adminNavigation';
import AthleteNavigation from './athleteNavigation';
import BiometrixNavigation from './biometrixAdminNavigation';
import ResearcherNavigation from './researcherNavigation';
import AuthScenes from './auth';

/* Routes ==================================================================== */
export default Actions.create(
  <Scene key={'root'} {...AppConfig.navbarProps}>
    <Scene
      hideNavBar
      key={'splash'}
      component={AppLaunch}
      analyticsDesc={'AppLaunch: Launching App'}
    />

    {/* Auth */}
    {AuthScenes}

    {/* Main Admin App */}
    <Scene key={'adminApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}>
      {/* Drawer Side Menu */}
      <Scene key={'adminHome'} component={Drawer} initial={'adminTeamManagement'}>
        {/* Radial Menus */}
        {AdminNavigation}
      </Scene>
      {/* </Scene>*/}
    </Scene>

    {/* Main Athlete App */}
    <Scene key={'athleteApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}>
      {/* Drawer Side Menu */}
      <Scene key={'athleteHome'} component={Drawer} initial={'athleteAthleteManagement'}>
        {/* Radial Menus */}
        {AthleteNavigation}
      </Scene>
      {/* </Scene>*/}
    </Scene>

    {/* Main BiometrixAdmin App */}
    <Scene key={'biometrixApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}>
      {/* Drawer Side Menu */}
      <Scene key={'biometrixHome'} component={Drawer} initial={'managerTeamManagement'}>
        {/* Radial Menus */}
        {BiometrixNavigation}
      </Scene>
      {/* </Scene>*/}
    </Scene>

    {/* Main Manager App */}
    <Scene key={'managerApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}>
      {/* Drawer Side Menu */}
      <Scene key={'managerHome'} component={Drawer} initial={'managerTeamManagement'}>
        {/* Radial Menus */}
        {ManagerNavigation}
      </Scene>
      {/* </Scene>*/}
    </Scene>

    {/* Main Researcher App */}
    <Scene key={'researcherApp'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}>
      {/* Drawer Side Menu */}
      <Scene key={'researcherHome'} component={Drawer} initial={'researcherAthleteManagement'}>
        {/* Radial Menus */}
        {ResearcherNavigation}
      </Scene>
      {/* </Scene>*/}
    </Scene>

  </Scene>,
);
