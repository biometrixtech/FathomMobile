/**
 * Start Screen
 *  - Get Started -> onboarding steps
 *  - Already a memeber? -> login
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BackHandler, ImageBackground, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';

// Consts and Libs
import { AppAPI } from '../../lib/';
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';

// Components
import { Button, Spacer, Text } from '../custom/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({

});

/* Component ==================================================================== */
class Start extends Component {
    static componentName = 'Start';

    static propTypes = {
        authorizeUser:  PropTypes.func.isRequired,
        email:          PropTypes.string,
        environment:    PropTypes.string,
        finalizeLogin:  PropTypes.func.isRequired,
        onFormSubmit:   PropTypes.func,
        password:       PropTypes.string,
        registerDevice: PropTypes.func.isRequired,
        user:           PropTypes.object.isRequired,
    }

    static defaultProps = {
        email:       null,
        environment: 'PROD',
        password:    null,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        setTimeout(() => {
            if (this.props.email !== null && this.props.password !== null) {
                Promise.resolve(this.login());
            } else {
                SplashScreen.hide();
            }
        }, 10);
    }

    _routeToLogin = () => {
        Actions.login();
    }

    _routeToOnboarding = () => {
        Actions.onboarding();
    }

    _routeToMyPlan = () => {
        Actions.myPlan();
    }

    _routeToHome = () => {
        Actions.home();
    }

    login = () => {
        let credentials = {
            Email:    this.props.email,
            Password: this.props.password,
        };

        /**
          * - if jwt valid
          *   - getUserSensorData(user.id)
          *     - registerDevice (user, userCreds, token, resolve, reject)
          *       - finalizeLogin (user, userCreds, token, resolve, reject)
          * - else if jwt not valid
          *   - authorizeUser (authorization, user, userCreds, resolve, reject)
          *     - getUserSensorData(user.id)
          *       - registerDevice (user, userCreds, token, resolve, reject)
          *         - finalizeLogin (user, userCreds, token, resolve, reject)
          */
        return this.props.onFormSubmit({
            email:    credentials.Email,
            password: credentials.Password,
        }, false).then(response => {
            let { authorization, user } = response;
            return (
                authorization && authorization.expires && moment(authorization.expires) > moment.utc()
                    ? Promise.resolve(response)
                    : authorization && authorization.session_token
                        ? this.props.authorizeUser(authorization, user, credentials)
                        : Promise.reject('Unexpected response authorization')
            );
        })
            .then(response => {
                this.props.getUserSensorData(response.user.id);
                return Promise.resolve(response);
            })
            .then(response => {
                let { authorization, user } = response;
                return this.props.registerDevice(this.props.certificate, this.props.device, user)
                    .then(() => this.props.finalizeLogin(user, credentials, authorization.jwt));
            })
            .then(() => this.setState({
                resultMsg: { success: 'Success, now loading your data!' },
            }, (response) => {
                // if(this.props.user.onboarding_status && this.props.user.onboarding_status.includes('account_setup')) {
                    this._routeToHome();
                // } else {
                //     this._routeToOnboarding();
                // }
                SplashScreen.hide();
            })).catch((err) => {
                SplashScreen.hide();
                const error = AppAPI.handleError(err);
                console.log('err',error);
            });
    }

    render = () => {
        return (
            <View>
                <ImageBackground
                    source={require('../../../assets/images/standard/start.png')}
                    style={[AppStyles.containerCentered, {height: AppSizes.screen.heightTwoThirds, width: AppSizes.screen.width,}]}
                >
                    <Text h1 style={[AppStyles.paddingVertical, {color: AppColors.white,}]}>{'JOIN FATHOM'}</Text>
                    <Text p style={[AppStyles.paddingBottom, {color: AppColors.white,}]}>{'Create your account'}</Text>
                    <Button
                        backgroundColor={AppColors.white}
                        buttonStyle={[AppStyles.paddingVerticalMed, AppStyles.paddingHorizontalLrg]}
                        onPress={this._routeToOnboarding}
                        textColor={AppColors.primary.yellow.hundredPercent}
                        title={'Create Account'}
                    />
                </ImageBackground>
                <TouchableOpacity
                    onPress={this._routeToLogin}
                    style={[AppStyles.containerCentered, {height: AppSizes.screen.heightOneThird, width: AppSizes.screen.width,}]}
                >
                    <Text h2 style={[AppStyles.paddingBottom, {color: AppColors.black,}]}>{'ALREADY A MEMEBER?'}</Text>
                    <Text p style={{color: AppColors.primary.yellow.hundredPercent,}}>{'Let\'s login now.'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Start;