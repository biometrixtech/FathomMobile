/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:23:40 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:23:40 
 */

/**
 * Manager Navigation Scenes
 */
import React from 'react';
import { Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { Icon } from 'react-native-elements';

// Scenes
import TeamCaptureSessionView from '@containers/capture/team/TeamCaptureSessionContainer';
import GroupCaptureSessionView from '@containers/capture/group/GroupCaptureSessionContainer';
import KitManagementView from '@containers/kit/KitManagementContainer';
import BluetoothConnectView from '@containers/kit/connect/BluetoothConnectContainer';
import KitOwnerView from '@containers/kit/owner/KitOwnerContainer';
import KitAssignView from '@containers/kit/assign/KitAssignContainer';

// Components
import { NavbarMenuButton } from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

const navbarPropsTabs = {
    ...AppConfig.navbarProps,
    renderLeftButton: () => <NavbarMenuButton />,
    sceneStyle:       {
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
            key={'baKitManagement'}
            clone
            type={ActionConst.REPLACE}
            component={KitManagementView}
            analyticsDesc={'KitManagementView: Kit Management'}
        >
            <Scene
                {...navbarPropsTabs}
                key={'baBluetoothConnect'}
                clone
                type={ActionConst.PUSH}
                component={BluetoothConnectView}
                analyticsDesc={'BluetoothConnectView: Kit Management Bluetooth Connect'}
            />
            <Scene
                {...navbarPropsTabs}
                key={'baKitOwner'}
                clone
                type={ActionConst.PUSH}
                component={KitOwnerView}
                analyticsDesc={'OwnerView: Kit Owner View'}
            >
                <Scene
                    {...navbarPropsTabs}
                    key={'baKitAssign'}
                    clone
                    type={ActionConst.PUSH}
                    component={KitAssignView}
                    analyticsDesc={'KitAssignView: Kit Assign View'}
                />
            </Scene>
        </Scene>
    </Scene>
);

export default scenes;
