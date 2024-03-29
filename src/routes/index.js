/*
 * @Author: Vir Desai
 * @Date: 2018-04-30 13:21:35
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-30 20:42:35
 */

import React from 'react';

// import third-party libraries
import { Actions, Router, Scene, Stack, } from 'react-native-router-flux';
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';

// Consts, Libs, and Utils
import { CustomNavBar, CustomTabBar, TabIcon, } from '../components/custom';
import { Actions as DispatchActions, AppColors, } from '../constants';
import { store } from '../store';
import { View, } from 'react-native';

// import components
import LoginContainer from '../containers/auth/Login';
import LoginComponent from '../components/auth/Login';

import ForgotPasswordContainer from '../containers/auth/ForgotPassword';
import ForgotPasswordComponent from '../components/auth/ForgotPassword';

import ResetPasswordContainer from '../containers/auth/ResetPassword';
import ResetPasswordComponent from '../components/auth/ResetPassword';

import StartContainer from '../containers/auth/Start';
import StartComponent from '../components/auth/Start';

import AccountTypeContainer from '../containers/auth/AccountType';
import AccountTypeComponent from '../components/auth/AccountType';

import InviteCodeContainer from '../containers/auth/InviteCode';
import InviteCodeComponent from '../components/auth/InviteCode';

import SettingsContainer from '../containers/settings/Settings';
import SettingsComponent from '../components/settings/Settings';

import BluetoothConnectContainer from '../containers/kit/BluetoothConnect';
import BluetoothConnectComponent from '../components/kit/BluetoothConnect';

import SensorFilesContainer from '../containers/kit/SensorFiles';
import SensorFilesComponent from '../components/kit/SensorFiles';

import SensorFilesPageContainer from '../containers/kit/SensorFilesPage';
import SensorFilesPageComponent from '../components/kit/SensorFilesPage';

import MyPlanContainer from '../containers/myPlan/MyPlan';
import MyPlanComponent from '../components/myPlan/MyPlan';

import ExerciseModalityContainer from '../containers/myPlan/ExerciseModality';
import ExerciseModalityComponent from '../components/myPlan/ExerciseModality';

import BodyModalityContainer from '../containers/myPlan/BodyModality';
import BodyModalityComponent from '../components/myPlan/BodyModality';

import TrendsContainer from '../containers/myPlan/Trends';
import TrendsComponent from '../components/myPlan/Trends';

import TrendChildContainer from '../containers/myPlan/TrendChild';
import TrendChildComponent from '../components/myPlan/TrendChild';

import InsightContainer from '../containers/myPlan/Insight';
import InsightComponent from '../components/myPlan/Insight';

import BiomechanicsContainer from '../containers/myPlan/Biomechanics';
import BiomechanicsComponent from '../components/myPlan/Biomechanics';

import BiomechanicsSummaryContainer from '../containers/myPlan/BiomechanicsSummary';
import BiomechanicsSummaryComponent from '../components/myPlan/BiomechanicsSummary';

import OnboardingContainer from '../containers/onboarding/Onboarding';
import OnboardingComponent from '../components/onboarding/Onboarding';

import AccountDetailsContainer from '../containers/onboarding/AccountDetails';
import AccountDetailsComponent from '../components/onboarding/AccountDetails';

import ResendEmailContainer from '../containers/onboarding/ResendEmail';
import ResendEmailComponent from '../components/onboarding/ResendEmail';

import ChangeEmailContainer from '../containers/onboarding/ChangeEmail';
import ChangeEmailComponent from '../components/onboarding/ChangeEmail';

import TutorialContainer from '../containers/onboarding/Tutorial';
import TutorialComponent from '../components/onboarding/Tutorial';

import CoachesDashboardContainer from '../containers/coachesDashboard/CoachesDashboard';
import CoachesDashboardComponent from '../components/coachesDashboard/CoachesDashboard';

import SurveyContainer from '../containers/onboarding/Survey';
import SurveyComponent from '../components/onboarding/Survey';

const Index = (
    <Router hideNavBar={true}>
        <Stack
            gesturesEnabled={true}
            hideNavBar={true}
            key={'root'}
            titleStyle={{ alignSelf: 'center', }}
            transitionConfig={() => ({ screenInterpolator: StackViewStyleInterpolator.forHorizontal, })}
        >
            <Scene
                Layout={StartComponent}
                component={StartContainer}
                hideNavBar={true}
                initial={true}
                key={'start'}
                panHandlers={null}
            />
            <Scene
                Layout={AccountDetailsComponent}
                component={AccountDetailsContainer}
                hideNavBar={true}
                key={'accountDetails'}
            />
            <Scene
                Layout={ResendEmailComponent}
                component={ResendEmailContainer}
                headerTitleAllowFontScaling={false}
                hideNavBar={false}
                key={'resendEmail'}
                navBar={CustomNavBar}
                onLeft={() => Actions.accountDetails()}
                panHandlers={null}
                renderLeftButton={null}
                title={'EMAIL VERIFICATION'}
            />
            <Scene
                Layout={ChangeEmailComponent}
                component={ChangeEmailContainer}
                headerTitleAllowFontScaling={false}
                hideNavBar={false}
                key={'changeEmail'}
                navBar={CustomNavBar}
                onLeft={() => Actions.accountDetails()}
                panHandlers={null}
                renderLeftButton={null}
                title={'RESET EMAIL'}
            />
            <Scene
                Layout={TutorialComponent}
                component={TutorialContainer}
                hideNavBar={true}
                key={'tutorial'}
            />
            <Scene
                Layout={SurveyComponent}
                component={SurveyContainer}
                hideNavBar={true}
                key={'survey'}
                panHandlers={null}
            />
            <Scene
                Layout={OnboardingComponent}
                component={OnboardingContainer}
                hideNavBar={true}
                key={'onboarding'}
            />
            <Scene
                Layout={LoginComponent}
                component={LoginContainer}
                hideNavBar={true}
                key={'login'}
            />
            <Scene
                Layout={AccountTypeComponent}
                component={AccountTypeContainer}
                hideNavBar={true}
                key={'accountType'}
                panHandlers={null}
            />
            <Scene
                Layout={InviteCodeComponent}
                component={InviteCodeContainer}
                hideNavBar={true}
                key={'inviteCode'}
                panHandlers={null}
            />
            <Scene
                Layout={ForgotPasswordComponent}
                component={ForgotPasswordContainer}
                headerTitleAllowFontScaling={false}
                hideNavBar={false}
                key={'forgotPassword'}
                navBar={CustomNavBar}
                onLeft={() => Actions.pop()}
                title={'FORGOT PASSWORD'}
            />
            <Scene
                Layout={ResetPasswordComponent}
                component={ResetPasswordContainer}
                headerTitleAllowFontScaling={false}
                hideNavBar={false}
                key={'resetPassword'}
                navBar={CustomNavBar}
                onLeft={() => Actions.pop()}
                panHandlers={null}
                title={'FORGOT PASSWORD'}
            />
            <Scene
                drawerLockMode={'locked-closed'}
                gesturesEnabled={false}
                hideNavBar={true}
                key={'main'}
                tabBarComponent={CustomTabBar}
                tabBarPosition={'bottom'}
                tabs={true}
            >
                <Scene
                    Layout={MyPlanComponent}
                    component={MyPlanContainer}
                    hideNavBar={true}
                    key={'myPlan'}
                    panHandlers={null}
                    tabBarLabel={'Plan'}

                    onEnter={() => store.dispatch({
                        type: DispatchActions.UPDATE_CURRENT_TAB,
                        tab:  'myPlan'
                    })}
                    // onExit={() => console.log('myPlan-onExit')}
                />
                <Scene
                    Layout={TrendsComponent}
                    component={TrendsContainer}
                    hideNavBar={true}
                    key={'trends'}
                    tabBarLabel={'Trends'}
                    panHandlers={null}

                    onEnter={() => store.dispatch({
                        type: DispatchActions.UPDATE_CURRENT_TAB,
                        tab:  'trends'
                    })}
                    // onExit={() => console.log('trends-onExit')}
                />
                <Scene
                    Layout={SettingsComponent}
                    component={SettingsContainer}
                    headerTitleAllowFontScaling={false}
                    hideNavBar={true}
                    key={'settings'}
                    panHandlers={null}
                    tabBarLabel={'Settings'}
                    title={'SETTINGS'}

                    onEnter={() => store.dispatch({
                        type: DispatchActions.UPDATE_CURRENT_TAB,
                        tab:  'settings'
                    })}
                    // onExit={() => console.log('settings-onExit')}
                />
            </Scene>
            <Scene
                Layout={TrendChildComponent}
                component={TrendChildContainer}
                hideNavBar={true}
                key={'trendChild'}
            />
            <Scene
                Layout={InsightComponent}
                component={InsightContainer}
                hideNavBar={true}
                key={'insight'}
            />
            <Scene
                Layout={BiomechanicsComponent}
                component={BiomechanicsContainer}
                hideNavBar={true}
                key={'biomechanics'}
            />
            <Scene
                Layout={BiomechanicsSummaryComponent}
                component={BiomechanicsSummaryContainer}
                hideNavBar={true}
                key={'biomechanicsSummary'}
            />
            <Scene
                Layout={ExerciseModalityComponent}
                component={ExerciseModalityContainer}
                hideNavBar={true}
                key={'exerciseModality'}
            />
            <Scene
                Layout={BodyModalityComponent}
                component={BodyModalityContainer}
                hideNavBar={true}
                key={'bodyModality'}
            />
            <Scene
                Layout={CoachesDashboardComponent}
                component={CoachesDashboardContainer}
                hideNavBar={false}
                key={'coachesDashboard'}
                navBar={CustomNavBar}
                onLeft={() => Actions.settings()}
                panHandlers={null}
            />
            <Scene
                Layout={BluetoothConnectComponent}
                component={BluetoothConnectContainer}
                hideNavBar={true}
                key={'bluetoothConnect'}
                panHandlers={null}
            />
            <Scene
                Layout={SensorFilesComponent}
                component={SensorFilesContainer}
                hideNavBar={true}
                key={'sensorFiles'}
            />
            <Scene
                Layout={SensorFilesPageComponent}
                component={SensorFilesPageContainer}
                hideNavBar={true}
                key={'sensorFilesPage'}
            />
        </Stack>
    </Router>
);

export default Index;
