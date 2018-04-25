import React from 'react';
import { Image, View } from 'react-native';
import { Scene, Tabs, Stack } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppColors } from '../theme';

import DefaultProps from '../constants/navigation';


import LoginContainer from '../../containers/auth/Login';
import LoginComponent from '../components/auth/Login';

import SignUpContainer from '../../containers/auth/SignUp';
import SignUpComponent from '../components/auth/SignUp';

import ForgotPasswordContainer from '../../containers/auth/ForgotPassword';
import ForgotPasswordComponent from '../components/auth/ForgotPassword';


import ConnectionsContainer from '../../containers/connections/Connections';
import ConnectionsComponent from '../components/connections/Connections';


import DashboardContainer from '../../containers/dashboard/Dashboard';
import DashboardComponent from '../components/dashboard/Dashboard';


import ReportContainer from '../../containers/report/Report';
import ReportComponent from '../components/report/Report';


import SupportContainer from '../../containers/support/Support';
import SupportComponent from '../components/support/Support';


import SettingsContainer from '../../containers/settings/Settings';
import SettingsComponent from '../components/settings/Settings';

import KitManagementContainer from '../../containers/kit/KitManagement';
import KitManagementComponent from '../components/kit/KitManagement';

import KitOwnerContainer from '../../containers/kit/KitOwner';
import KitOwnerComponent from '../components/kit/KitOwner';

import KitAssignContainer from '../../containers/kit/KitAssign';
import KitAssignComponent from '../components/kit/KitAssign';

import BluetoothConnectContainer from '../../containers/kit/BluetoothConnect';
import BluetoothConnectComponent from '../components/kit/BluetoothConnect';

const Index = (
    <Stack>
        <Stack hideNavBar key='authorize'>
            <Scene
                key='login'
                hideNavBar
                component={LoginContainer}
                Layout={LoginComponent}
            />
            <Scene
                key='signUp'
                hideNavBar
                component={SignUpContainer}
                Layout={SignUpComponent}
            />
            <Scene
                key='forgotPassword'
                hideNavBar
                component={ForgotPasswordContainer}
                Layout={ForgotPasswordComponent}
            />
        </Stack>
        <Scene key='tabbar' hideNavBar>
            <Tabs
                type='replace'
                {...DefaultProps.tabProps}
                {...DefaultProps.navbarProps}
                cardStyle={{ backgroundColor: AppColors.white }}
            >
                <Scene
                    key='connections'
                    type='replace'
                    icon={() => <Icon name='share-variant' {...DefaultProps.icons} />}
                >
                    <Scene
                        key='connections'
                        title='Connections'
                        initial
                        tabBarLabel='Connections'
                        component={ConnectionsContainer}
                        Layout={ConnectionsComponent}
                    />
                </Scene>
                <Scene
                    key='dashboard'
                    type='replace'
                    icon={() => <Icon name='chart-bar' {...DefaultProps.icons} />}
                >
                    <Scene
                        key='dashboard'
                        title='Dashboard'
                        initial
                        tabBarLabel='Dashboard'
                        component={DashboardContainer}
                        Layout={DashboardComponent}
                    />
                </Scene>
                <Scene
                    initial
                    key='report'
                    type='replace'
                    icon={() => (
                        <View style={{
                            width:        50,
                            height:       50,
                            borderRadius: 25,
                            overflow:     'hidden',
                            borderWidth:  1,
                            borderColor:  AppColors.primary.grey.hundredPercent
                        }}>
                            <Image source={require('../../assets/images/icon.png')}
                                style={{
                                    height: 50,
                                    width:  50,
                                }}
                                resizeMode='contain'
                            />
                            <View style={{
                                position:     'absolute',
                                top:          -1,
                                bottom:       -1,
                                right:        -1,
                                left:         -1,
                                borderRadius: 25,
                            }} />
                        </View>
                    )}
                >
                    <Scene
                        key='report'
                        title='Training Report'
                        initial
                        tabBarLabel=' '
                        component={ReportContainer}
                        Layout={ReportComponent}
                    />
                </Scene>
                <Scene
                    key='support'
                    type='replace'
                    icon={() => <Icon name='help-circle' {...DefaultProps.icons} />}
                >
                    <Scene
                        key='support'
                        title='Support'
                        initial
                        tabBarLabel='Support'
                        component={SupportContainer}
                        Layout={SupportComponent}
                    />
                </Scene>
                <Scene
                    key='settings'
                    type='replace'
                    icon={() => <Icon name='settings' {...DefaultProps.icons} />}
                >
                    <Scene
                        key='settings'
                        title='Settings'
                        initial
                        tabBarLabel='Settings'
                        component={SettingsContainer}
                        Layout={SettingsComponent}
                    />
                    <Scene
                        key='kitManagement'
                        title='Kit Management'
                        hideTabBar
                        back
                        renderRightButton={<View />}
                        component={KitManagementContainer}
                        Layout={KitManagementComponent}
                    />
                    <Scene
                        key='bluetoothConnect'
                        title='Bluetooth Connect'
                        hideTabBar
                        back
                        renderRightButton={<View />}
                        component={BluetoothConnectContainer}
                        Layout={BluetoothConnectComponent}
                    />
                    <Scene
                        key='kitOwner'
                        title='Kit Owner'
                        hideTabBar
                        back
                        renderRightButton={<View />}
                        component={KitOwnerContainer}
                        Layout={KitOwnerComponent}
                    />
                    <Scene
                        key='kitAssign'
                        title='Kit Assign'
                        hideTabBar
                        back
                        renderRightButton={<View />}
                        component={KitAssignContainer}
                        Layout={KitAssignComponent}
                    />
                </Scene>
            </Tabs>
        </Scene>
    </Stack>
);

export default Index;
