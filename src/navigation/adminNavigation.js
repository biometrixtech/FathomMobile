/**
 * Manager Navigation Scenes
 */
import React from 'react';
import { Scene, ActionConst, Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { Icon } from 'react-native-elements';

// Scenes
import TeamManagementView from '@containers/management/TeamManagementContainer';
import KitManagementView from '@containers/kit/KitManagementContainer';
import AthletesView from '@containers/management/athletes/AthletesContainer';
import DataView from '@containers/management/data/DataContainer';
import GroupsView from '@containers/management/groups/GroupsContainer';
import RegimensView from '@containers/management/regimens/RegimensContainer';

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
      key={'managerTeamManagement'}
      title={'Team Management'}
      clone
      type={ActionConst.REPLACE}
      component={TeamManagementView}
      analyticsDesc={'ManagerTeamManagementView: Manager Team Management'}
    />
    <Scene
      {...navbarPropsTabs}
      key={'managerAthletes'}
      title={'Athletes'}
      clone
      component={AthletesView}
      analyticsDesc={'ManagerAthletesView: Manager Athletes'}
    />
    <Scene
      {...groupView}
      key={'managerGroups'}
      title={'Groups'}
      clone
      component={GroupsView}
      analyticsDesc={'ManagerGroupsView: Manager Groups'}
    />
    <Scene
      {...regimenView}
      key={'managerRegimens'}
      title={'Regimens'}
      clone
      component={RegimensView}
      analyticsDesc={'ManagerRegimensView: Manager Regimens'}
    />
    <Scene
      {...regimenView}
      key={'managerData'}
      title={'Data'}
      clone
      component={DataView}
      analyticsDesc={'ManagerDataView: Manager Data'}
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
