/**
 * Manager Navigation Scenes
 */
import React from 'react';
import { Scene, ActionConst, Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { Icon } from 'react-native-elements';

// Scenes
import TeamCaptureSessionView from '@containers/capture/team/TeamCaptureSessionContainer';
import GroupCaptureSessionView from '@containers/capture/group/GroupCaptureSessionContainer';
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
            key={'biometrixAdminCaptureSession'}>
            <Scene
                {...navbarPropsTabs}
                key={'biometrixAdminTeamCaptureSession'}
                clone
                initial={true}
                type={ActionConst.REPLACE}
                component={TeamCaptureSessionView}
                analyticsDesc={'BiometrixAdminTeamCaptureSessiontView: Biometrix Admin Team Capture Session'}
            />
            <Scene
                {...navbarPropsTabs}
                key={'biometrixAdminGroupCaptureSession'}
                clone
                type={ActionConst.REPLACE}
                component={GroupCaptureSessionView}
                analyticsDesc={'BiometrixAdminGroupCaptureSessiontView: Biometrix Admin Group Capture Session'}
            />
        </Scene>
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
