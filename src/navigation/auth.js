/**
 * Auth Scenes
 */
import React from 'react';
import { Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';

// Scenes
import Login from '@containers/auth/LoginContainer';
import AuthForgotPassword from '@containers/auth/ForgotPassword/ForgotPasswordContainer';
import AuthSignUp from '@containers/auth/SignUp/SignUpContainer';

/* Routes ==================================================================== */
const scenes = (
  <Scene key={'login'} type={ActionConst.RESET}>
    <Scene
      hideNavBar
      key={'authLanding'}
      component={Login}
      type={ActionConst.RESET}
    />
    <Scene
      {...AppConfig.navbarProps}
      key={'signUp'}
      title={'Sign Up'}
      clone
      component={AuthSignUp}
    />
    <Scene
      {...AppConfig.navbarProps}
      key={'passwordReset'}
      title={'Password Reset'}
      clone
      component={AuthForgotPassword}
    />
  </Scene>
);

export default scenes;
