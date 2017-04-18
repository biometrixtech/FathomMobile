/**
 * Menu Scenes
 */
import React from 'react';
import { Scene, ActionConst, Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { Icon } from 'react-native-elements';

// Scenes
import TeamManagementView from '@containers/team/TeamManagementContainer';
import KitManagementView from '@containers/kit/KitManagementContainer';
import AthletesView from '@containers/team/athletes/AthletesView';
import DataView from '@containers/team/data/DataView';
import GroupsView from '@containers/team/groups/GroupsView';
import RegimensView from '@containers/team/regimens/RegimensView';

// Components
import { NavbarMenuButton } from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

const navbarPropsTabs = {
    ...AppConfig.navbarProps,
    renderLeftButton: () => <NavbarMenuButton />,
    sceneStyle:       {
        ...AppConfig.navbarProps.sceneStyle,
    },
};

const regimenView = {
    ...AppConfig.navbarProps,
    renderLeftButton:  () => <NavbarMenuButton />,
    renderRightButton: () => <Icon onPress={() => Actions.refresh({ isModalVisible: true })} name="plus" type="material-community" size={34} color="#FFF" underlayColor="transparent" containerStyle={{ marginBottom: 12 }} />,
    sceneStyle:        {
        ...AppConfig.navbarProps.sceneStyle,
    },
};

const groupView = {
    ...AppConfig.navbarProps,
    renderLeftButton:  () => <NavbarMenuButton />,
    renderRightButton: () => <Icon onPress={() => Actions.refresh({ isModalVisible: true })} name="plus" type="material-community" size={34} color="#FFF" underlayColor="transparent" containerStyle={{ marginBottom: 12 }} />,
    sceneStyle:        {
        ...AppConfig.navbarProps.sceneStyle,
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
      {...groupView}
      key={'groups'}
      title={'Groups'}
      clone
      component={GroupsView}
      analyticsDesc={'GroupsView: Groups'}
    />
    <Scene
      {...regimenView}
      key={'regimens'}
      title={'Regimens'}
      clone
      component={RegimensView}
      analyticsDesc={'RegimensView: Regimens'}
    />
    <Scene
      {...regimenView}
      key={'data'}
      title={'Data'}
      clone
      component={DataView}
      analyticsDesc={'DataView: Data'}
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
