/**
 * Start Screen
 *  - Get Started -> onboarding steps
 *  - Already a memeber? -> login
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, ImageBackground, Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import * as Fabric from 'react-native-fabric';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';

// Consts and Libs
import { AppAPI, AppUtil, } from '../../lib/';
import { Actions as DispatchActions, AppColors, AppSizes, AppStyles, AppFonts, ErrorMessages, } from '../../constants';
import { Button, Spacer, TabIcon, Text, } from '../custom';
import { store, } from '../../store';

// setup consts
const Crashlytics = Fabric.Crashlytics;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    linearGradientStyle: {
        alignSelf: 'stretch',
        flex:      1,
        overflow:  'visible',
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
        getSensorFiles:       PropTypes.func.isRequired,
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
                        if(store) {
                            store.dispatch({
                                type: DispatchActions.LOGOUT
                            });
                        }
                        // hide splash screen
                        this.hideSplash();
                        // check if we have a maintenance window to alert the user on
                        if(this.props.scheduledMaintenance && !this.props.scheduledMaintenance.addressed) {
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
        this.setState(
            { isLoggingIn: false, splashScreen: false, },
            () => {
                SplashScreen.hide();
                if(callback) {
                    callback();
                }
            }
        );
    }

    _routeToLogin = () => {
        AppUtil.pushToScene('login');
    }

    _routeToTuroial = () => {
        AppUtil.pushToScene('tutorial', {step: 'tutorial-tutorial'});
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
        if(!userObj || !userObj.id) {
            return this.hideSplash();
        }
        // return this.props.authorizeUser(authorization, userObj, credentials)
        //     .then(authorizationResponse => {
        //         if(authorizationResponse && authorizationResponse.authorization) {
        //             authorization.expires = authorizationResponse.authorization.expires;
        //             authorization.jwt = authorizationResponse.authorization.jwt;
        //         }
        //         return this.props.getUser(userObj.id);
        //     })
        // TODO: UPDATE ME
        return this.props.getUser(userObj.id)
            .then(response => {
                userObj = response.user;
                if(this.props.certificate && this.props.certificate.id && this.props.device && this.props.device.id) {
                    return true;
                }
                return this.props.registerDevice(this.props.certificate, this.props.device, userObj);
            })
            .then(() => {
                let clearMyPlan = (
                    this.props.lastOpened && this.props.lastOpened.userId && this.props.lastOpened.date &&
                    userObj && userObj.id &&
                    (
                        this.props.lastOpened.userId !== userObj.id ||
                        moment(this.props.lastOpened.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
                    )
                ) ?
                    true
                    :
                    false;
                return this.props.getMyPlan(userObj.id, moment().format('YYYY-MM-DD'), false, clearMyPlan)
                    .then(response => {
                        if(!response.daily_plans[0].daily_readiness_survey_completed) {
                            this.props.setAppLogs(userObj.id);
                        }
                        if(userObj.health_enabled) {
                            return AppUtil.getAppleHealthKitDataPrevious(userObj, userObj.health_sync_date, userObj.historic_health_sync_date)
                                .then(() => AppUtil.getAppleHealthKitData(userObj, userObj.health_sync_date, userObj.historic_health_sync_date));
                        }
                        return response;
                    })
                    .catch(error => {
                        this.setState(
                            { isLoggingIn: false, },
                            () => AppUtil.handleAPIErrorAlert(error),
                        );
                    });
            })
            .then(() => {
                let newAuthorization = {
                    jwt:           this.props.jwt,
                    expires:       this.props.expires,
                    session_token: this.props.sessionToken,
                };
                return this.props.finalizeLogin(userObj, credentials, newAuthorization);
            })
            .then(() => userObj && userObj.sensor_data && userObj.sensor_data.mobile_udid && userObj.sensor_data.sensor_pid ? this.props.getSensorFiles(userObj) : userObj)
            .then(() => _.delay(() => this.hideSplash(() => AppUtil.routeOnLogin(userObj)), 500))
            .catch(err => {
                if(!this.props.user.id) {
                    return this.hideSplash();
                }
                return this.setState(
                    { isLoggingIn: false, },
                    () => {
                        const error = AppAPI.handleError(err);
                        console.log('err',error);
                        if(Platform.OS === 'ios') {
                            Crashlytics.recordError(`ERROR on start: ${error.toString()}`);
                        } else {
                            Crashlytics.logException(`ERROR on start: ${error.toString()}`);
                        }
                    },
                );
            });
    }

    render = () => {
        let { isLoggingIn, splashScreen, } = this.state;
        return splashScreen ?
            <View style={{flex: 1,}}>
                <ImageBackground
                    source={require('../../../assets/images/standard/background.png')}
                    style={[AppStyles.containerCentered, {height: AppSizes.screen.height, width: AppSizes.screen.width,}]}
                >
                    <LinearGradient
                        colors={['rgb(248, 224, 118)', 'rgb(235, 186, 45)']}
                        style={[styles.linearGradientStyle]}
                    >
                        { isLoggingIn ?
                            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/standard/stacked_icon_white.png')}
                                    style={{ height: 100, width: 100, }}
                                />
                                <Spacer size={80} />
                                <ActivityIndicator
                                    color={AppColors.white}
                                    size={'large'}
                                />
                                <Spacer size={30} />
                                <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(22),}}>{'WARMING UP...'}</Text>
                            </View>
                            :
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.setState({ isLoggingIn: true, }, () => this.login())}
                                style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}
                            >
                                <View style={{paddingHorizontal: 50, paddingVertical: AppSizes.padding,}}>
                                    <TabIcon
                                        color={AppColors.white}
                                        containerStyle={[{paddingBottom: AppSizes.paddingMed,}]}
                                        icon={'alert'}
                                        size={40}
                                        type={'material-community'}
                                    />
                                    <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(28), paddingBottom: AppSizes.paddingLrg, textAlign: 'center',}}>{'UH OH!'}</Text>
                                    <Text robotoLight style={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'Tap anywhere to try again.'}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </LinearGradient>
                </ImageBackground>
            </View>
            :
            <View style={{flex: 1,}}>
                <ImageBackground
                    source={require('../../../assets/images/standard/welcome_background.png')}
                    style={[AppStyles.containerCentered, {flex: 1, flexDirection: 'column', paddingVertical: AppSizes.paddingXLrg, width: AppSizes.screen.width,}]}
                >
                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                        <Image
                            resizeMode={'contain'}
                            source={require('../../../assets/images/standard/fathom_logo_yellow_stacked.png')}
                            style={{height: 150, width: 150,}}
                        />
                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(22), marginTop: AppSizes.padding, textAlign: 'center',}}>
                            {'Optimal recovery,\ndesigned for your body.'}
                        </Text>
                    </View>
                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'flex-end',}}>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignItems: 'center', marginTop: AppSizes.paddingLrg, justifyContent: 'center', width: AppSizes.screen.widthTwoThirds,}}
                            onPress={() => this._routeToTuroial()}
                            raised={true}
                            title={'Create account'}
                            titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(20), width: '100%',}}
                        />
                        <Text robotoBold style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(11), fontStyle: 'italic', marginBottom: AppSizes.paddingXSml, marginTop: AppSizes.paddingLrg, textAlign: 'center',}}>{'Already a user?'}</Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.splashLight, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthTwoThirds,}}
                            onPress={() => this._routeToLogin()}
                            raised={true}
                            title={'Login'}
                            titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(20), width: '100%',}}
                        />
                    </View>
                </ImageBackground>
            </View>
    }
}

/* Export Component ==================================================================== */
export default Start;
