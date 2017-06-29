/**
 * Manager Navigation Scenes
 */
import React from 'react';
import { Scene, ActionConst, Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { Icon } from 'react-native-elements';

// Scenes
import CaptureSessionView from '@containers/capture/CaptureSessionContainer';
import KitManagementView from '@containers/kit/KitManagementContainer';

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
  <Scene key={'biometrixAdmin'} >
    <Scene
      {...navbarPropsTabs}
      key={'biometrixAdminCaptureSession'}
      clone
      initial={true}
      type={ActionConst.REPLACE}
      component={CaptureSessionView}
      analyticsDesc={'BiometrixAdminCaptureSessiontView: Biometrix Admin Capture Session'}
    />
    <Scene
      {...navbarPropsTabs}
      key={'kitManagement'}
      clone
      type={ActionConst.REPLACE}
      component={KitManagementView}
      analyticsDesc={'KitManagementView: Kit Management'}
    />
  </Scene>
);

export default scenes;
