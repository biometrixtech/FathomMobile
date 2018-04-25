/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:23:49 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-11 23:58:32
 */

/**
 * Auth Scenes
 */
import React from 'react';
import { Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '../constants/';

// Scenes
import Login from '../containers/auth/LoginContainer';
import AuthForgotPassword from '../containers/auth/ForgotPassword/ForgotPasswordContainer';
import AuthSignUp from '../containers/auth/SignUp/SignUpContainer';

/* Routes ==================================================================== */
const scenes = (
    <Scene key={'login'} type={ActionConst.RESET}>
        <Scene
            hideNavBar
            key={'authLanding'}
            initial={true}
            component={Login}
            type={ActionConst.RESET}
            analyticsDesc={'LoginView: Login'}
        />
        <Scene
            {...AppConfig.navbarProps}
            key={'signUp'}
            title={'Sign Up'}
            clone
            component={AuthSignUp}
            analyticsDesc={'SignUpView: Sign Up'}
        />
        <Scene
            {...AppConfig.navbarProps}
            key={'passwordReset'}
            title={'Password Reset'}
            clone
            component={AuthForgotPassword}
            analyticsDesc={'ForgotPasswordView: Forgot Password'}
        />
    </Scene>
);

export default scenes;
