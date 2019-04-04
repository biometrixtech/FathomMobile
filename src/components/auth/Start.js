/**
 * Start Screen
 *  - Get Started -> onboarding steps
 *  - Already a memeber? -> login
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, ImageBackground, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';

// Consts and Libs
import { AppAPI, AppUtil, } from '../../lib/';
import { Actions as DispatchActions, AppColors, AppSizes, AppStyles, AppFonts, ErrorMessages, } from '../../constants';
import { Alerts, Button, Spacer, Text, } from '../custom';
import { store } from '../../store';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    linearGradientStyle: {
        alignItems:        'center',
        alignSelf:         'stretch',
        flex:              1,
        justifyContent:    'center',
        overflow:          'visible',
        paddingHorizontal: 50,
        paddingVertical:   50,
    },
});

/* Component ==================================================================== */
class Start extends Component {
    static componentName = 'Start';

    static propTypes = {
        authorizeUser:        PropTypes.func.isRequired,
        device:               PropTypes.object,
        email:                PropTypes.string,
        environment:          PropTypes.string,
        expires:              PropTypes.string,
        finalizeLogin:        PropTypes.func.isRequired,
        getMyPlan:            PropTypes.func.isRequired,
        getUser:              PropTypes.func.isRequired,
        jwt:                  PropTypes.string,
        lastOpened:           PropTypes.object.isRequired,
        network:              PropTypes.object.isRequired,
        onFormSubmit:         PropTypes.func,
        password:             PropTypes.string,
        registerDevice:       PropTypes.func.isRequired,
        scheduledMaintenance: PropTypes.object,
        sessionToken:         PropTypes.string,
        setAppLogs:           PropTypes.func.isRequired,
        user:                 PropTypes.object.isRequired,
    }

    static defaultProps = {
        email:                null,
        environment:          'PROD',
        expires:              null,
        jwt:                  null,
        onFormSubmit:         null,
        password:             null,
        scheduledMaintenance: null,
        sessionToken:         null,
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoggingIn:  false,
            splashScreen: true,
        };
    }

    componentWillMount = () => {
        if (Platform.OS === 'ios') {
            SplashScreen.hide();
        }
    }

    componentDidMount = () => {
        this.setState(
            { isLoggingIn: true, },
            () => {
                _.delay(() => {
                    if(
                        this.props.email !== null &&
                        this.props.password !== null &&
                        this.props.user.id &&
                        this.props.jwt &&
                        this.props.sessionToken &&
                        this.props.expires
                    ) {
                        this.login();
                    } else {
                        // clear user reducer
                        store.dispatch({
                            type: DispatchActions.LOGOUT
                        })
                        // hide splash screen
                        this.hideSplash();
                        // check if we have a maintenance window to alert the user on
                        if(!this.props.scheduledMaintenance.addressed) {
                            let apiMaintenanceWindow = { end_date: this.props.scheduledMaintenance.end_date, start_date: this.props.scheduledMaintenance.start_date };
                            let parseMaintenanceWindow = ErrorMessages.getScheduledMaintenanceMessage(apiMaintenanceWindow);
                            AppUtil.handleScheduledMaintenanceAlert(parseMaintenanceWindow.displayAlert, parseMaintenanceWindow.header, parseMaintenanceWindow.message);
                        }
                    }
                }, 250);
            },
        );
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
    }

    hideSplash = callback => {
        this.setState({ isLoggingIn: false, splashScreen: false, });
        SplashScreen.hide();
        if(callback) {
            callback();
        }
    }

    _routeToLogin = () => {
        Actions.login();
    }

    _routeToAccountType = () => {
        Actions.accountType();
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
          *       - successful - go to onboarding or MyPlan
          *       - unsuccessful - go to login
          */
        let authorization = {
            jwt:           this.props.jwt,
            expires:       this.props.expires,
            session_token: this.props.sessionToken,
        };
        let userObj = _.cloneDeep(this.props.user);
        return this.props.authorizeUser(authorization, userObj, credentials)
            .then(authorizationResponse => {
                if(authorizationResponse && authorizationResponse.authorization) {
                    authorization.expires = authorizationResponse.authorization.expires;
                    authorization.jwt = authorizationResponse.authorization.jwt;
                }
                return this.props.getUser(userObj.id);
            })
            .then(response => {
                userObj = response.user;
                if(this.props.certificate && this.props.certificate.id && this.props.device && this.props.device.id) {
                    return true;
                }
                return this.props.registerDevice(this.props.certificate, this.props.device, userObj);
            })
            .then(() => {
                let clearMyPlan = (
                    this.props.lastOpened.userId !== userObj.id ||
                    moment(this.props.lastOpened.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
                ) ?
                    true
                    :
                    false;
                return this.props.getMyPlan(userObj.id, moment().format('YYYY-MM-DD'), false, clearMyPlan)
                    .then(response => {
                        if(!response.daily_plans[0].daily_readiness_survey_completed) {
                            this.props.setAppLogs();
                        }
                        return response;
                    })
                    .then(response => {
                        if(userObj.health_enabled) {
                            return AppUtil.getAppleHealthKitDataPrevious(userObj.id, userObj.health_sync_date, userObj.historic_health_sync_date)
                                .then(() => AppUtil.getAppleHealthKitData(userObj.id, userObj.health_sync_date, userObj.historic_health_sync_date));
                        }
                        return response;
                    })
                    .catch(error => {
                        AppUtil.handleAPIErrorAlert(error);
                        this.hideSplash();
                    });
            })
            .then(() => this.props.finalizeLogin(userObj, credentials, authorization))
            .then(() =>
                _.delay(() => {
                    this.hideSplash(() => AppUtil.routeOnLogin(userObj));
                }, 500)
            )
            .catch(err => {
                this.hideSplash();
                const error = AppAPI.handleError(err);
                console.log('err',error);
                // this._routeToLogin();
                AppUtil.handleAPIErrorAlert(error);
            });
    }

    render = () => {
        let { isLoggingIn, splashScreen, } = this.state;
        return splashScreen && isLoggingIn ?
            <View style={{flex: 1,}}>
                <ImageBackground
                    source={require('../../../assets/images/standard/background.png')}
                    style={[AppStyles.containerCentered, {height: AppSizes.screen.height, width: AppSizes.screen.width,}]}
                >
                    <LinearGradient
                        colors={['rgba(51, 64, 85, 0.89)', 'rgba(11, 26, 52, 0.97)', 'black']}
                        style={[styles.linearGradientStyle]}
                    >
                        <Image
                            resizeMode={'contain'}
                            source={require('../../../assets/images/standard/stacked_icon.png')}
                            style={{ height: 100, width: 100, }}
                        />
                        <Spacer size={80} />
                        <ActivityIndicator
                            color={AppColors.zeplin.yellow}
                            size={'large'}
                        />
                        <Spacer size={30} />
                        <Text oswaldMedium style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(22),}}>{'WARMING UP...'}</Text>
                    </LinearGradient>
                </ImageBackground>
            </View>
            :
            <View style={{flex: 1,}}>
                <ImageBackground
                    source={require('../../../assets/images/standard/start.png')}
                    style={[AppStyles.containerCentered, {flex: 1, flexDirection: 'column', width: AppSizes.screen.width,}]}
                >
                    <View style={{alignItems: 'center', flex: 7, justifyContent: 'center',}}>
                        <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(38),}}>{'JOIN FATHOM'}</Text>
                        <Spacer size={this.state.displayMessage ? 20 : 15} />
                        <View style={{width: AppSizes.screen.widthThreeQuarters,}}>
                            <Alerts
                                error={this.state.displayMessage ? this.state.networkMessage: ''}
                            />
                        </View>
                        <Spacer size={this.state.displayMessage ? 0 : 15} />
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingMed,}}
                            disabled={this.state.displayMessage}
                            onPress={() => this._routeToAccountType()}
                            title={'Create Account'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(16),}}
                        />
                    </View>
                    <View style={{flex: 3,}}>
                        <LinearGradient
                            colors={['rgba(8, 24, 50, 0.0)', 'rgb(15, 19, 32)']}
                            start={{x: 0.0, y: 0.0}}
                            end={{x: 0.0, y: 0.99}}
                            style={[styles.linearGradientStyle, {flex: 1,}]}
                        >
                            <TouchableOpacity
                                onPress={this.state.displayMessage ? null : () => this._routeToLogin()}
                                style={[AppStyles.containerCentered, {backgroundColor: AppColors.transparent, flex: 1, width: AppSizes.screen.width,}]}
                            >
                                <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(24), paddingBottom: AppSizes.paddingSml,}}>{'ALREADY A MEMBER?'}</Text>
                                <Text robotoRegular style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(18),}}>{'Let\'s login now.'}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </ImageBackground>
            </View>
    }
}

/* Export Component ==================================================================== */
export default Start;