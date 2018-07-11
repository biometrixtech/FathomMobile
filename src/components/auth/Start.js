/**
 * Start Screen
 *  - Get Started -> onboarding steps
 *  - Already a memeber? -> login
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';

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
        onFormSubmit:   PropTypes.func,
        registerDevice: PropTypes.func.isRequired,
        finalizeLogin:  PropTypes.func.isRequired,
        authorizeUser:  PropTypes.func.isRequired,
        environment:    PropTypes.string,
        email:          PropTypes.string,
        password:       PropTypes.string,
    }

    static defaultProps = {
        environment: 'PROD',
        email:       null,
        password:    null,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.login();
    }

    _routeToLogin = () => {
        Actions.login();
    }

    _routeToOnboarding = () => {
        Actions.onboarding();
    }

    login = () => {
        let credentials = {
            Email:    this.props.email,
            Password: this.props.password,
        };

        /**
          * - if jwt valid
          *   - registerDevice (user, userCreds, token, resolve, reject)
          *     - finalizeLogin (user, userCreds, token, resolve, reject)
          * - else if jwt not valid
          *   - authorizeUser (authorization, user, userCreds, resolve, reject)
          *     - registerDevice (user, userCreds, token, resolve, reject)
          *       - finalizeLogin (user, userCreds, token, resolve, reject)
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
                let { authorization, user } = response;
                return (
                    this.props.certificate && this.props.certificate.id
                        ? Promise.resolve()
                        : this.props.registerDevice()
                )
                    .then(() => this.props.finalizeLogin(user, credentials, authorization.jwt));
            })
            .then(() => {
                Actions.settings();
                SplashScreen.hide();
            })
            .catch((err) => {
                console.log(AppAPI.handleError(err));
                SplashScreen.hide();
            });
    }

    render = () => {
        return (
            <View>
                <ImageBackground
                    source={require('../../constants/assets/images/start.png')}
                    style={[AppStyles.containerCentered, {height: AppSizes.screen.heightTwoThirds, width: AppSizes.screen.width,}]}
                >
                    <Text style={[AppStyles.paddingVertical, {
                        color:      AppColors.white,
                        fontFamily: AppFonts.base.family,
                        fontSize:   AppFonts.h1.size,
                        fontWeight: 'bold',
                        lineHeight: AppFonts.h1.lineHeight,
                    }]}>{'Join Fathom'}</Text>
                    <Text style={[AppStyles.paddingBottom, {
                        color: AppColors.white,
                    }]}>{'Create your account'}</Text>
                    <Button
                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                        large
                        onPress={this._routeToOnboarding}
                        textColor={AppColors.white}
                        title={'Get Started'}
                    />
                </ImageBackground>
                <Spacer size={5} />
                <TouchableOpacity
                    onPress={this._routeToLogin}
                    style={[AppStyles.containerCentered, {height: AppSizes.screen.heightOneThird, width: AppSizes.screen.width,}]}
                >
                    <Text style={[AppStyles.paddingBottom, {
                        color:      AppColors.black,
                        fontFamily: AppFonts.base.family,
                        fontSize:   AppFonts.h1.size,
                        fontWeight: 'bold',
                        lineHeight: AppFonts.h1.lineHeight,
                    }]}>{'Already a memeber?'}</Text>
                    <Text style={{
                        color: AppColors.primary.yellow.hundredPercent,
                    }}>{'Login now.'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Start;
