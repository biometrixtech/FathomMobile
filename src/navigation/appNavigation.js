/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:24:01 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-14 13:48:50
 */

/**
 * App Navigation Scenes
 */
import React from 'react';
import { Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';

// Scenes
// import TeamCaptureSessionView from '@containers/capture/team/TeamCaptureSessionContainer';
// import GroupCaptureSessionView from '@containers/capture/group/GroupCaptureSessionContainer';
import KitManagementView from '@containers/kit/KitManagementContainer';
import BluetoothConnectView from '@containers/kit/connect/BluetoothConnectContainer';
import KitOwnerView from '@containers/kit/owner/KitOwnerContainer';
import KitAssignView from '@containers/kit/assign/KitAssignContainer';
import DashboardView from '@containers/dashboard/DashboardContainer';
import ReportView from '@containers/report/ReportContainer';

// Components
import { NavbarMenuButton } from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

const navbarPropsTabs = {
    ...AppConfig.navbarProps,
    renderLeftButton: () => <NavbarMenuButton />,
};

/* Routes ==================================================================== */
const scenes = (
    <Scene key={'navigation'} >
        <Scene
            key={'navroot'}>
            {/* <Scene
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
            /> */}
            <Scene
                {...navbarPropsTabs}
                key={'dashboard'}
                clone
                type={ActionConst.REPLACE}
                component={DashboardView}
                analyticsDesc={'DashboardView: Dashboard'}
            />
            <Scene
                {...navbarPropsTabs}
                key={'report'}
                type={ActionConst.REPLACE}
                component={ReportView}
                analyticsDesc={'ReportView: Training Report'}
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
                type={ActionConst.PUSH_OR_POP}
                component={BluetoothConnectView}
                analyticsDesc={'BluetoothConnectView: Kit Management Bluetooth Connect'}
            />
            <Scene
                {...navbarPropsTabs}
                key={'kitOwner'}
                clone
                type={ActionConst.PUSH_OR_POP}
                component={KitOwnerView}
                analyticsDesc={'OwnerView: Kit Owner View'}
            />
            <Scene
                {...navbarPropsTabs}
                key={'kitAssign'}
                clone
                type={ActionConst.PUSH_OR_POP}
                component={KitAssignView}
                analyticsDesc={'KitAssignView: Kit Assign View'}
            />
        </Scene>
    </Scene>
);

export default scenes;
