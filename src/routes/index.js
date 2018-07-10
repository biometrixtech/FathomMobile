/*
 * @Author: Vir Desai
 * @Date: 2018-04-30 13:21:35
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 11:22:27
 */

import React from 'react';
import { Scene, Stack, Router } from 'react-native-router-flux';

import LoginContainer from '../containers/auth/Login';
import LoginComponent from '../components/auth/Login';

import SignUpContainer from '../containers/auth/SignUp';
import SignUpComponent from '../components/auth/SignUp';

import ForgotPasswordContainer from '../containers/auth/ForgotPassword';
import ForgotPasswordComponent from '../components/auth/ForgotPassword';

import StartContainer from '../containers/auth/Start';
import StartComponent from '../components/auth/Start';

import SettingsContainer from '../containers/settings/Settings';
import SettingsComponent from '../components/settings/Settings';

import KitManagementContainer from '../containers/kit/KitManagement';
import KitManagementComponent from '../components/kit/KitManagement';

import KitOwnerContainer from '../containers/kit/KitOwner';
import KitOwnerComponent from '../components/kit/KitOwner';

import KitAssignContainer from '../containers/kit/KitAssign';
import KitAssignComponent from '../components/kit/KitAssign';

import BluetoothConnectContainer from '../containers/kit/BluetoothConnect';
import BluetoothConnectComponent from '../components/kit/BluetoothConnect';

import OnboardingContainer from '../containers/onboarding/Onboarding';
import OnboardingComponent from '../components/onboarding/Onboarding';

const Index = (
    <Router>
        <Stack hideNavBar>
            <Stack key='root'>
                <Scene
                    Layout={StartComponent}
                    component={StartContainer}
                    // headerTitleStyle={{alignSelf: 'center', textAlign: 'center', flex: 1}}
                    hideNavBar
                    key='start'
                    title='FathomAI'
                />
                <Scene
                    Layout={OnboardingComponent}
                    backTitle=' '
                    component={OnboardingContainer}
                    key='onboarding'
                    title='GET STARTED'
                />
                <Scene
                    Layout={LoginComponent}
                    backTitle=' '
                    component={LoginContainer}
                    key='login'
                    title='Get Started'
                />
                <Scene
                    Layout={SignUpComponent}
                    component={SignUpContainer}
                    hideNavBar
                    key='signUp'
                />
                <Scene
                    Layout={ForgotPasswordComponent}
                    component={ForgotPasswordContainer}
                    hideNavBar
                    key='forgotPassword'
                />
            </Stack>
            <Stack>
                <Scene
                    Layout={SettingsComponent}
                    component={SettingsContainer}
                    hideNavBar
                    key='settings'
                />
                <Scene
                    key='kitManagement'
                    title='Kit Management'
                    component={KitManagementContainer}
                    Layout={KitManagementComponent}
                    // {...DefaultProps.navbarProps}
                />
                <Scene
                    key='bluetoothConnect'
                    title='Bluetooth Connect'
                    component={BluetoothConnectContainer}
                    Layout={BluetoothConnectComponent}
                    // {...DefaultProps.navbarProps}
                />
                <Scene
                    key='kitOwner'
                    title='Kit Owner'
                    component={KitOwnerContainer}
                    Layout={KitOwnerComponent}
                    // {...DefaultProps.navbarProps}
                />
                <Scene
                    key='kitAssign'
                    title='Kit Assign'
                    component={KitAssignContainer}
                    Layout={KitAssignComponent}
                    // {...DefaultProps.navbarProps}
                />
            </Stack>
        </Stack>
    </Router>
);

export default Index;
