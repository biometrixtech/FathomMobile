/*
 * @Author: Vir Desai
 * @Date: 2018-04-30 13:21:35
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-30 20:42:35
 */

import React from 'react';
import { Image } from 'react-native';

// import third-party libraries
import { Actions, Router, Scene, Stack } from 'react-native-router-flux';

// Consts, Libs, and Utils
import { AppColors, AppStyles, } from '../constants';
import { TabIcon, } from '../components/custom';

// import components
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

import MyPlanContainer from '../containers/myPlan/MyPlan';
import MyPlanComponent from '../components/myPlan/MyPlan';

import OnboardingContainer from '../containers/onboarding/Onboarding';
import OnboardingComponent from '../components/onboarding/Onboarding';

import HomeContainer from '../containers/home/Home';
import HomeComponent from '../components/home/Home';

const Index = (
    <Router hideNavBar={true}>
        <Stack hideNavBar={true} key={'root'} titleStyle={{ alignSelf: 'center' }}>
            <Scene
                Layout={StartComponent}
                component={StartContainer}
                hideNavBar={true}
                initial={true}
                key={'start'}
                panHandlers={null}
            />
            <Scene
                Layout={OnboardingComponent}
                component={OnboardingContainer}
                hideNavBar={false}
                key={'onboarding'}
                panHandlers={null}
                renderLeftButton={null}
                title={'GET STARTED'}
                titleStyle={{flex: 1, textAlign: 'center',}}
            />
            <Scene
                Layout={LoginComponent}
                component={LoginContainer}
                hideNavBar={true}
                key={'login'}
                panHandlers={null}
            />
            {/*<Scene
                Layout={SignUpComponent}
                component={SignUpContainer}
                hideNavBar={true}
                key={'signUp'}
                panHandlers={null}
            />
            <Scene
                Layout={ForgotPasswordComponent}
                component={ForgotPasswordContainer}
                hideNavBar={true}
                key={'forgotPassword'}
                panHandlers={null}
            />*/}
            <Scene
                Layout={HomeComponent}
                component={HomeContainer}
                hideNavBar={false}
                key={'home'}
                leftButtonStyle={[AppStyles.navbarImageTitle]}
                navigationBarStyle={{backgroundColor: AppColors.white, borderBottomWidth: 0, elevation: 0}}
                navigationBarTitleImage={require('../../assets/images/standard/fathom-gold-and-grey.png')}
                navigationBarTitleImageStyle={[AppStyles.navbarImageTitle]}
                onLeft={() => Actions.settings()}
                onRight={() => null}
                panHandlers={null}
                renderLeftButton={
                    <TabIcon
                        containerStyle={[AppStyles.paddingLeftSml]}
                        icon={'settings'}
                        iconStyle={[{color: AppColors.black}]}
                        onPress={() => Actions.settings()}
                        reverse={false}
                        size={26}
                        type={'material-community'}
                    />
                }
                rightTitle={' '}
                type={'replace'}
            />
            <Scene
                Layout={MyPlanComponent}
                component={MyPlanContainer}
                hideNavBar={true}
                key={'myPlan'}
                panHandlers={null}
            />
            <Scene
                Layout={SettingsComponent}
                component={SettingsContainer}
                hideNavBar={false}
                navigationBarStyle={{borderBottomColor: AppColors.border, borderBottomWidth: 2, elevation: 0}}
                onLeft={() => Actions.home()}
                onRight={() => null}
                key={'settings'}
                panHandlers={null}
                rightTitle={' '}
                title={'SETTINGS'}
                titleStyle={{flex: 1, textAlign: 'center',}}
            />
            <Scene
                Layout={BluetoothConnectComponent}
                component={BluetoothConnectContainer}
                hideNavBar={true}
                key={'bluetoothConnect'}
                panHandlers={null}
                // title={'Bluetooth Connect'}
                // {...DefaultProps.navbarProps}
            />
            {/*<Stack>
                <Scene
                    Layout={KitManagementComponent}
                    component={KitManagementContainer}
                    hideNavBar={true}
                    key={'kitManagement'}
                    panHandlers={null}
                    // title={'Kit Management'}
                    // {...DefaultProps.navbarProps}
                />
                <Scene
                    key={'kitOwner'}
                    title={'Kit Owner'}
                    component={KitOwnerContainer}
                    Layout={KitOwnerComponent}
                    // {...DefaultProps.navbarProps}
                    panHandlers={null}
                />
                <Scene
                    key={'kitAssign'}
                    title={'Kit Assign'}
                    component={KitAssignContainer}
                    Layout={KitAssignComponent}
                    // {...DefaultProps.navbarProps}
                    panHandlers={null}
                />
            </Stack>*/}
        </Stack>
    </Router>
);

export default Index;
