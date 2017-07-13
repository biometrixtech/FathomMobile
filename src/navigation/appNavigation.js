/**
 * App Navigation Scenes
 */
import React from 'react';
import { Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';

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
    <Scene key={'navigation'} >
        <Scene
            {...navbarPropsTabs}
            key={'navroot'}>
            <Scene
                {...navbarPropsTabs}
                key={'teamCaptureSession'}
                clone
                initial={true}
                type={ActionConst.REPLACE}
                component={TeamCaptureSessionView}
                analyticsDesc={'TeamCaptureSessiontView: Team Capture Session'}
            />
            <Scene
                {...navbarPropsTabs}
                key={'groupCaptureSession'}
                clone
                type={ActionConst.PUSH}
                component={GroupCaptureSessionView}
                analyticsDesc={'GroupCaptureSessiontView: Group Capture Session'}
            />
            <Scene
                {...navbarPropsTabs}
                key={'kitManagement'}
                clone
                type={ActionConst.REPLACE}
                component={KitManagementView}
                analyticsDesc={'KitManagementView: Kit Management'}
            />
            <Scene
                {...navbarPropsTabs}
                key={'bluetoothConnect'}
                clone
                type={ActionConst.PUSH}
                component={BluetoothConnectView}
                analyticsDesc={'BluetoothConnectView: Kit Management Bluetooth Connect'}
            />
            <Scene
                {...navbarPropsTabs}
                key={'kitOwner'}
                clone
                type={ActionConst.PUSH}
                component={KitOwnerView}
                analyticsDesc={'OwnerView: Kit Owner View'}
            />
            <Scene
                {...navbarPropsTabs}
                key={'kitAssign'}
                clone
                type={ActionConst.PUSH}
                component={KitAssignView}
                analyticsDesc={'KitAssignView: Kit Assign View'}
            />
        </Scene>
    </Scene>
);

export default scenes;
