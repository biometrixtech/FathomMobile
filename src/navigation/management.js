/**
 * Menu Scenes
 */
import React from 'react';
import { Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { AppSizes } from '@theme/';

// Scenes
import TeamManagementView from '@containers/team/TeamManagementView';
import KitManagementView from '@containers/kit/KitManagementView';
import AthletesView from '@containers/team/athletes/AthletesView';

// Components
import { NavbarMenuButton } from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

const navbarPropsTabs = {
    ...AppConfig.navbarProps,
    renderLeftButton: () => <NavbarMenuButton />,
    sceneStyle:       {
        ...AppConfig.navbarProps.sceneStyle,
        paddingBottom: AppSizes.tabbarHeight,
    },
};

/* Routes ==================================================================== */
const scenes = (
  <Scene key={'management'} >
    <Scene
      {...navbarPropsTabs}
      key={'teamManagement'}
      title={'Team Management'}
      clone
      type={ActionConst.REPLACE}
      component={TeamManagementView}
      analyticsDesc={'TeamManagementView: Team Management'}
    />
    <Scene
      {...navbarPropsTabs}
      key={'athletes'}
      title={'Athletes'}
      clone
      component={AthletesView}
      analyticsDesc={'AthletesView: Athletes'}
    />
    <Scene
      {...navbarPropsTabs}
      key={'kitManagement'}
      title={'Kit Management'}
      clone
      type={ActionConst.REPLACE}
      component={KitManagementView}
      analyticsDesc={'KitManagementView: Kit Management'}
    />
  </Scene>
);

export default scenes;
