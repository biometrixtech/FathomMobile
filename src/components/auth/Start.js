/**
 * Start Screen
 *  - Get Started -> onboarding steps
 *  - Already a memeber? -> login
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';

// import third-party libraries
import { Actions } from 'react-native-router-flux';

// Consts and Libs
// Consts and Libs
import { AppAPI } from '../../lib/';
import { AppColors, AppSizes } from '../../constants';

// Components
import { Button, Spacer, Text } from '../custom/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    cardBackground: {
        alignItems:      'center',
        backgroundColor: AppColors.primary.grey.fiftyPercent,
        height:          AppSizes.screen.heightHalf,
        justifyContent:  'center',
        width:           AppSizes.screen.width,
    },
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
                <View style={[styles.cardBackground]}>
                    <Text style={{
                        color:         '#000',
                        fontSize:      30,
                        fontWeight:    'bold',
                        lineHeight:    30,
                        paddingBottom: 10,
                    }}>{'Join the FathomAI Team'}</Text>
                    <Text style={{
                        color:         AppColors.primary.grey.thirtyPercent,
                        paddingBottom: 10,
                    }}>{'Create your account within minutes.'}</Text>
                    <Button
                        backgroundColor={'#fff'}
                        large
                        onPress={this._routeToOnboarding}
                        textColor={'#000'}
                        title={'Get Started'}
                    />
                </View>
                <Spacer size={5} />
                <TouchableOpacity onPress={this._routeToLogin} style={[styles.cardBackground]}>
                    <Text style={{
                        color:         '#000',
                        fontSize:      20,
                        fontWeight:    'bold',
                        lineHeight:    30,
                        paddingBottom: 10,
                    }}>{'Already a memeber?'}</Text>
                    <Text style={{
                        color: AppColors.primary.grey.thirtyPercent,
                    }}>{'Let\'s login now.'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Start;
