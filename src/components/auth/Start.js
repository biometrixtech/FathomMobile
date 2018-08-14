/**
 * Start Screen
 *  - Get Started -> onboarding steps
 *  - Already a memeber? -> login
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, ImageBackground, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';

// Consts and Libs
import { AppAPI } from '../../lib/';
import { AppColors, AppSizes, AppStyles, AppFonts, } from '../../constants';

// Components
import { Button, Text } from '../custom';

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
        expires:        PropTypes.string,
        finalizeLogin:  PropTypes.func.isRequired,
        getUser:        PropTypes.func.isRequired,
        jwt:            PropTypes.string,
        onFormSubmit:   PropTypes.func,
        password:       PropTypes.string,
        registerDevice: PropTypes.func.isRequired,
        sessionToken:   PropTypes.string,
        user:           PropTypes.object.isRequired,
    }

    static defaultProps = {
        email:        null,
        environment:  'PROD',
        expires:      null,
        jwt:          null,
        onFormSubmit: null,
        password:     null,
        sessionToken: null,
    }

    constructor(props) {
        super(props);

        this.state = {
            splashScreen: true,
        };
    }

    componentWillMount = () => {
        if (Platform.OS === 'ios') {
            SplashScreen.hide();
        }
    }

    componentDidMount = () => {
        setTimeout(() => {
            if(
                this.props.email !== null &&
                this.props.password !== null &&
                this.props.user.id &&
                this.props.jwt &&
                this.props.sessionToken &&
                this.props.expires
            ) {
                Promise.resolve(this.login());
            } else {
                this.hideSplash();
            }
        }, 10);
    }

    hideSplash = () => {
        this.setState({ splashScreen: false });
        SplashScreen.hide();
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
          * NOTE: we only come here if the user email, password, id, and jwt token exists
          * - authorizeUser
          *   - registerDevice
          *     - finalizeLogin
          *       - successful - go to onboarding or home
          *       - unsuccessful - go to login
          */
        let authorization = {
            jwt:           this.props.jwt,
            expires:       this.props.expires,
            session_token: this.props.sessionToken,
        };
        // return this.props.getUser(this.props.user.id)
        //     .then(res => this.props.authorizeUser(authorization, res.user, credentials))
        return this.props.authorizeUser(authorization, this.props.user, credentials)
            .then(response => {
                if(response) {
                    authorization.expires = response.authorization.expires;
                    authorization.jwt = response.authorization.jwt;
                }
                return this.props.getUserSensorData(this.props.user.id)
                    .then(res => Promise.resolve())
                    .catch(err => Promise.reject(err));
            })
            .then(() => this.props.registerDevice(this.props.certificate, this.props.device, this.props.user))
            .then(() => {
                return this.props.finalizeLogin(this.props.user, credentials, authorization)
            })
            .then(() => this.setState({
                resultMsg: { success: 'Success, now loading your data!' },
            }, (response) => {
                if(this.props.user.onboarding_status && this.props.user.onboarding_status.includes('account_setup')) {
                    this._routeToHome();
                } else {
                    this._routeToOnboarding();
                }
                this.hideSplash();
            })).catch((err) => {
                this.hideSplash();
                const error = AppAPI.handleError(err);
                console.log('err',error);
                this._routeToLogin();
            });
    }

    render = () => {
        let { splashScreen } = this.state;
        return Platform.OS === 'ios' && splashScreen
            ?
            <View>
                <ImageBackground
                    source={require('../../../assets/images/standard/background.png')}
                    style={[AppStyles.containerCentered, { height: AppSizes.screen.height, width: AppSizes.screen.width }]}
                >
                    <Image
                        resizeMode={'contain'}
                        source={require('../../../assets/images/standard/stacked_icon.png')}
                        style={{ paddingBottom: 40, height: 100, width: 100 }}
                    />
                    <View style={{ paddingTop: 40 }}>
                        <ActivityIndicator
                            color={AppColors.primary.yellow.hundredPercent}
                            size={'large'}
                        />
                    </View>
                </ImageBackground>
            </View>
            :
            <View>
                <ImageBackground
                    source={require('../../../assets/images/standard/start.png')}
                    style={[AppStyles.containerCentered, {height: AppSizes.screen.heightTwoThirds, width: AppSizes.screen.width,}]}
                >
                    <Text h1 oswaldMedium style={[AppStyles.paddingVertical, {color: AppColors.white, fontSize: AppFonts.scaleFont(38)}]}>{'JOIN FATHOM'}</Text>
                    <Button
                        backgroundColor={AppColors.white}
                        buttonStyle={[AppStyles.paddingVerticalMed, AppStyles.paddingHorizontalLrg]}
                        fontFamily={AppStyles.robotoBold.fontFamily}
                        fontWeight={AppStyles.robotoBold.fontWeight}
                        onPress={this._routeToOnboarding}
                        textColor={AppColors.primary.yellow.hundredPercent}
                        textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                        title={'Create Account'}
                    />
                </ImageBackground>
                <TouchableOpacity
                    onPress={this._routeToLogin}
                    style={[AppStyles.containerCentered, {backgroundColor: AppColors.primary.grey.twentyPercent, height: AppSizes.screen.heightOneThird, width: AppSizes.screen.width,}]}
                >
                    <Text h5 oswaldMedium style={[AppStyles.paddingBottom, {color: AppColors.black, fontSize: AppFonts.scaleFont(24)}]}>{'ALREADY A MEMBER?'}</Text>
                    <Text p robotoRegular style={{color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(18)}}>{'Let\'s login now.'}</Text>
                </TouchableOpacity>
            </View>
    }
}

/* Export Component ==================================================================== */
export default Start;