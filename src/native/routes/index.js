/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:21:35 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:21:35 
 */

import React from 'react';
import { Image, View, Platform } from 'react-native';
import { Scene, Tabs, Stack, ActionConst, Router } from 'react-native-router-flux';
import { Text } from '../components/custom/';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppColors, AppStyles } from '../theme';

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
    <Router>
        <Stack hideNavBar key='root'>
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
            <Scene key='tabbar' hideNavBar>
                <Tabs
                    type={ActionConst.RESET}
                    {...DefaultProps.tabProps}
                    {...DefaultProps.navbarProps}
                    cardStyle={{ backgroundColor: AppColors.white }}
                    showLabel={Platform.OS === 'ios'}
                >
                    <Scene
                        key='connections'
                        title='Connections'
                        type={ActionConst.RESET}
                        tabBarLabel='Connections'
                        component={ConnectionsContainer}
                        Layout={ConnectionsComponent}
                        icon={() => Platform.OS === 'ios' ? <Icon name='share-variant' {...DefaultProps.icons} />
                            :<View style={[AppStyles.containerCentered]}><Icon name='share-variant' {...DefaultProps.icons} /><Text style={[AppStyles.subtext]}>Connections</Text></View>}
                    />
                    <Scene
                        key='dashboard'
                        title='Dashboard'
                        type={ActionConst.RESET}
                        tabBarLabel='Dashboard'
                        component={DashboardContainer}
                        Layout={DashboardComponent}
                        icon={() => Platform.OS === 'ios' ? <Icon name='chart-bar' {...DefaultProps.icons} />
                            : <View style={[AppStyles.containerCentered]}><Icon name='chart-bar' {...DefaultProps.icons} /><Text style={[AppStyles.subtext]}>Dashboard</Text></View>}
                    />
                    <Scene
                        initial
                        key='report'
                        type={ActionConst.RESET}
                        icon={() => (
                            <View style={{
                                width:        Platform.OS === 'ios' ? 50 : 48,
                                height:       Platform.OS === 'ios' ? 50 : 48,
                                borderRadius: Platform.OS === 'ios' ? 25 : 24,
                                overflow:     'hidden',
                                borderWidth:  1,
                                borderColor:  AppColors.primary.grey.hundredPercent
                            }}>
                                <Image source={require('../../assets/images/icon.png')}
                                    style={{
                                        height: Platform.OS === 'ios' ? 50 : 48,
                                        width:  Platform.OS === 'ios' ? 50 : 48,
                                    }}
                                    resizeMode='contain'
                                />
                                <View style={{
                                    position:     'absolute',
                                    top:          -1,
                                    bottom:       -1,
                                    right:        -1,
                                    left:         -1,
                                    borderRadius: Platform.OS === 'ios' ? 25 : 24,
                                }} />
                            </View>
                        )}
                        title='Training Report'
                        tabBarLabel=' '
                        component={ReportContainer}
                        Layout={ReportComponent}
                    />
                    <Scene
                        key='support'
                        title='Support'
                        type={ActionConst.RESET}
                        tabBarLabel='Support'
                        component={SupportContainer}
                        Layout={SupportComponent}
                        icon={() => Platform.OS === 'ios' ? <Icon name='help-circle' {...DefaultProps.icons} />
                            : <View style={[AppStyles.containerCentered]}><Icon name='help-circle' {...DefaultProps.icons} /><Text style={[AppStyles.subtext]}>Support</Text></View>}
                    />
                    <Stack>
                        <Scene
                            key='settings'
                            title='Settings'
                            type={ActionConst.RESET}
                            tabBarLabel='Settings'
                            component={SettingsContainer}
                            Layout={SettingsComponent}
                            icon={() => Platform.OS === 'ios' ? <Icon name='settings' {...DefaultProps.icons} />
                                : <View style={[AppStyles.containerCentered]}><Icon name='settings' {...DefaultProps.icons} /><Text style={[AppStyles.subtext]}>Settings</Text></View>}
                        />
                        <Scene
                            key='kitManagement'
                            title='Kit Management'
                            hideTabBar
                            back
                            type={ActionConst.PUSH_OR_POP}
                            renderRightButton={<View />}
                            component={KitManagementContainer}
                            Layout={KitManagementComponent}
                            {...DefaultProps.navbarProps}
                        />
                        <Scene
                            key='bluetoothConnect'
                            title='Bluetooth Connect'
                            hideTabBar
                            back
                            type={ActionConst.PUSH_OR_POP}
                            renderRightButton={<View />}
                            component={BluetoothConnectContainer}
                            Layout={BluetoothConnectComponent}
                            {...DefaultProps.navbarProps}
                        />
                        <Scene
                            key='kitOwner'
                            title='Kit Owner'
                            hideTabBar
                            back
                            type={ActionConst.PUSH_OR_POP}
                            renderRightButton={<View />}
                            component={KitOwnerContainer}
                            Layout={KitOwnerComponent}
                            {...DefaultProps.navbarProps}
                        />
                        <Scene
                            key='kitAssign'
                            title='Kit Assign'
                            hideTabBar
                            back
                            type={ActionConst.PUSH_OR_POP}
                            renderRightButton={<View />}
                            component={KitAssignContainer}
                            Layout={KitAssignComponent}
                            {...DefaultProps.navbarProps}
                        />
                    </Stack>
                </Tabs>
            </Scene>
        </Stack>
    </Router>
);

export default Index;
