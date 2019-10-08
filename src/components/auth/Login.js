/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:32:47
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-09 21:06:40
 */

/**
 * Login Screen
 *  - Entry screen for all authentication
 *  - User can tap to login, forget password, or signUp...
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
    BackHandler,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// import third-party libraries
import { Actions ,} from 'react-native-router-flux';
import _ from 'lodash';
import Egg from 'react-native-egg';
import PushNotification from 'react-native-push-notification';

// Consts and Libs
import { AppAPI, AppUtil, } from '../../lib';
import { AppColors, APIConfig, AppFonts, AppSizes, AppStyles, ErrorMessages, } from '../../constants';
import { onboardingUtils, } from '../../constants/utils';

// Components
import { Alerts, Button, Card, FathomModal, FormInput, ListItem, Spacer, TabIcon, Text, } from '../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    contentWrapper: {
        alignItems:      'center',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        justifyContent:  'center',
    },
    background: {
        backgroundColor: AppColors.secondary.blue.hundredPercent,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
    imageBackground: {
        height: AppSizes.screen.height,
        width:  AppSizes.screen.width,
    },
    mainLogo: {
        width: AppSizes.screen.widthThird,
    },
});

const Wrapper = props => Platform.OS === 'ios' ?
    (
        <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            <ImageBackground
                source={require('../../../assets/images/standard/start.png')}
                style={[AppStyles.containerCentered, styles.imageBackground,]}
            >
                <View style={[styles.imageBackground, styles.contentWrapper,]}>
                    {props.children}
                </View>
            </ImageBackground>
        </View>
    ) :
    (
        <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            <ImageBackground
                source={require('../../../assets/images/standard/start.png')}
                style={[AppStyles.containerCentered, {height: AppSizes.screen.height, width: AppSizes.screen.width,}]}
            >
                <View style={[styles.imageBackground, styles.contentWrapper,]}>
                    {props.children}
                </View>
            </ImageBackground>
        </View>
    );

/* Component ==================================================================== */
class Login extends Component {
    static componentName = 'Login';

    static propTypes = {
        authorizeUser:  PropTypes.func.isRequired,
        certificate:    PropTypes.object,
        device:         PropTypes.object,
        email:          PropTypes.string,
        environment:    PropTypes.string,
        finalizeLogin:  PropTypes.func.isRequired,
        getMyPlan:      PropTypes.func.isRequired,
        getSensorFiles: PropTypes.func.isRequired,
        lastOpened:     PropTypes.object.isRequired,
        network:        PropTypes.object.isRequired,
        onFormSubmit:   PropTypes.func,
        password:       PropTypes.string,
        registerDevice: PropTypes.func.isRequired,
        setAppLogs:     PropTypes.func.isRequired,
        setEnvironment: PropTypes.func,
        token:          PropTypes.string,
        user:           PropTypes.object.isRequired,
    }

    static defaultProps = {
        certificate:    null,
        device:         null,
        email:          null,
        environment:    'PROD',
        onFormSubmit:   null,
        password:       null,
        setEnvironment: null,
        token:          null,
    }

    constructor(props) {
        super(props);
        this._focusNextField = this._focusNextField.bind(this);
        this.inputs = {};
        this.state = {
            isModalVisible:   false,
            isPasswordSecure: true,
            loading:          false,
            resultMsg:        {
                error:   '',
                status:  '',
                success: '',
            },
            form_values: {
                email:    '',
                password: '',
            },
        };
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
    }

    componentDidMount = () => {
        if(this.props.scheduledMaintenance && !this.props.scheduledMaintenance.addressed) {
            let apiMaintenanceWindow = { end_date: this.props.scheduledMaintenance.end_date, start_date: this.props.scheduledMaintenance.start_date };
            let parseMaintenanceWindow = ErrorMessages.getScheduledMaintenanceMessage(apiMaintenanceWindow);
            AppUtil.handleScheduledMaintenanceAlert(parseMaintenanceWindow.displayAlert, parseMaintenanceWindow.header, parseMaintenanceWindow.message);
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
    }

    _focusNextField = id => {
        this.inputs[id].focus();
    }

    _handleFormChange = (name, value) => {
        let newFormFields = _.update( this.state.form_values, name, () => value);
        this.setState({
            ['form_values']: newFormFields,
        });
    }

    _handleFormSubmit = () => {
        // validation
        let errorsArray = this._validateForm();
        if (errorsArray.length === 0) {
            this.registerPNToken();
        } else {
            let newErrorFields = _.update( this.state.resultMsg, 'error', () => errorsArray);
            this.setState({ loading: false, resultMsg: newErrorFields });
        }
    }

    _routeToForgotPassword = () => {
        AppUtil.pushToScene('forgotPassword');
    }

    _validateForm = () => {
        const form_fields = this.state;
        let errorsArray = [];
        errorsArray = errorsArray.concat(onboardingUtils.isEmailValid(form_fields.form_values.email).errorsArray);
        errorsArray = errorsArray.concat(onboardingUtils.isPasswordValid(form_fields.form_values.password).errorsArray);
        return errorsArray;
    }

    registerPNToken = () => {
        if(Platform.OS === 'ios') {
            return PushNotification
                .requestPermissions()
                .then(grant => this.login())
                .catch(err => this.login());
        }
        PushNotification
            .requestPermissions();
        return _.delay(() => this.login(), 250);
    }

    /**
      * Login
      */
    login = () => {
        // Get new credentials and update
        let credentials = _.cloneDeep(this.state.form_values);
        credentials.email = _.toLower(credentials.email);
        credentials.email = _.trim(credentials.email);
        credentials.password = _.trim(credentials.password);

        // close keyboard
        Keyboard.dismiss();

        // Form is valid
        if (credentials) {
            this.setState({ form_values: credentials }, () => {
                this.setState({ resultMsg: { status: 'ONE MOMENT...' } });

                return this.props.onFormSubmit({
                    email:    credentials.email,
                    password: credentials.password,
                }, false)
                    .then(response => {
                        let { user, } = response;
                        return this.props.registerDevice(this.props.certificate, this.props.device, user)
                            .then(() => {
                                let clearMyPlan = (
                                    this.props.lastOpened && this.props.lastOpened.userId && this.props.lastOpened.date &&
                                    user && user.id &&
                                    (
                                        this.props.lastOpened.userId !== user.id ||
                                        moment(this.props.lastOpened.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
                                    )
                                ) ?
                                    true
                                    :
                                    false;
                                return this.props.getMyPlan(user.id, moment().format('YYYY-MM-DD'), false, clearMyPlan)
                                    .then(res => {
                                        if(!res.daily_plans[0].daily_readiness_survey_completed) {
                                            this.props.setAppLogs(user.id);
                                        }
                                        if(user.health_enabled) {
                                            return AppUtil.getAppleHealthKitDataPrevious(user, user.health_sync_date, user.historic_health_sync_date)
                                                .then(() => AppUtil.getAppleHealthKitData(user, user.health_sync_date, user.historic_health_sync_date));
                                        }
                                        return res;
                                    })
                                    .catch(error => {
                                        const err = AppAPI.handleError(error);
                                        return this.setState({ resultMsg: { err } });
                                    });
                            })
                            .then(() => {
                                let newAuthorization = {
                                    jwt:           this.props.jwt,
                                    expires:       this.props.expires,
                                    session_token: this.props.sessionToken,
                                };
                                return this.props.finalizeLogin(user, credentials, newAuthorization);
                            })
                            .then(() => user && user.sensor_data && user.sensor_data.mobile_udid && user.sensor_data.sensor_pid ? this.props.getSensorFiles(user) : user);
                    })
                    .then(() => this.setState({
                        resultMsg: { success: 'SUCCESS, NOW LOADING YOUR DATA!!' },
                    }, () => {
                        AppUtil.routeOnLogin(this.props.user);
                    })).catch((err) => {
                        const error = AppAPI.handleError(err);
                        return this.setState({ loading: false, resultMsg: { error } });
                    });

            });
        }
    }

    _toggleShowPassword = () => {
        this.setState({ isPasswordSecure: !this.state.isPasswordSecure, });
    }

    render = () => {
        let isLoginBtnDisabled = !onboardingUtils.isEmailValid(this.state.form_values.email).isValid || this.state.form_values.password.length < 8;
        /*eslint no-return-assign: 0*/
        return (
            <Wrapper>

                <ImageBackground
                    source={require('../../../assets/images/standard/welcome_background.png')}
                    style={[AppStyles.containerCentered, {flex: 1, flexDirection: 'column', paddingBottom: AppSizes.paddingXLrg, width: AppSizes.screen.width,}]}
                >

                    <View style={{flexDirection: 'row', height: AppSizes.navbarHeight, justifyContent: 'center', marginTop: AppSizes.statusBarHeight > 0 ? AppSizes.statusBarHeight : AppSizes.padding,}}>
                        <TabIcon
                            color={AppColors.zeplin.slateLight}
                            containerStyle={[{alignItems: 'center', flex: 1, justifyContent: 'center',}]}
                            icon={'chevron-left'}
                            onPress={() => Actions.pop()}
                            size={30}
                        />
                        <View style={{flex: 8, justifyContent: 'center',}}>
                            <Egg
                                onCatch={() => this.setState({ isModalVisible: true, })}
                                setps={'TTTTT'}
                                style={{alignItems: 'center',}}
                            >
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                                    style={{width: AppSizes.screen.widthQuarter,}}
                                />
                            </Egg>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', paddingRight: AppSizes.paddingSml,}} />
                    </View>

                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'space-between', marginTop: AppSizes.padding,}}>
                        <View>
                            <View style={{alignItems: 'center', justifyContent: 'space-between',}}>
                                <Alerts
                                    error={this.state.resultMsg.error}
                                    extraStyles={{width: AppSizes.screen.widthTwoThirds,}}
                                    showEmptyState={true}
                                    success={this.state.resultMsg.success}
                                />
                            </View>
                            <Spacer size={AppSizes.paddingMed} />
                            <FormInput
                                autoCapitalize={'none'}
                                autoCompleteType={'username'}
                                blurOnSubmit={false}
                                clearButtonMode={'never'}
                                containerStyle={{borderBottomColor: AppColors.zeplin.slateLight, borderBottomWidth: 2, width: AppSizes.screen.widthTwoThirds,}}
                                inputRef={ref => this.inputs.email = ref}
                                inputStyle={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(20), paddingVertical: AppSizes.paddingSml,}}
                                keyboardType={'email-address'}
                                onChangeText={(text) => this._handleFormChange('email', text)}
                                onSubmitEditing={() => this._focusNextField('password')}
                                placeholder={'username'}
                                placeholderTextColor={AppColors.zeplin.slateLight}
                                returnKeyType={'next'}
                                textContentType={'username'}
                                value={this.state.form_values.email}
                            />
                            <Spacer size={AppSizes.paddingMed} />
                            <FormInput
                                autoCapitalize={'none'}
                                autoCompleteType={'password'}
                                blurOnSubmit={true}
                                clearButtonMode={'never'}
                                containerStyle={{borderBottomColor: AppColors.zeplin.slateLight, borderBottomWidth: 2, width: AppSizes.screen.widthTwoThirds,}}
                                inputRef={ref => this.inputs.password = ref}
                                inputStyle={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(20), paddingVertical: AppSizes.paddingSml,}}
                                keyboardType={'default'}
                                onChangeText={(text) => this._handleFormChange('password', text)}
                                onSubmitEditing={() => this.state.loading ? null : this.setState({ loading: true, }, () => this._handleFormSubmit())}
                                password={true}
                                placeholder={'password'}
                                placeholderTextColor={AppColors.zeplin.slateLight}
                                returnKeyType={'done'}
                                rightIcon={
                                    <View style={{flexDirection: 'row',}}>
                                        <TabIcon
                                            color={AppColors.zeplin.slateLight}
                                            containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                                            icon={this.state.isPasswordSecure ? 'visibility-off' : 'visibility'}
                                            onPress={() => this._toggleShowPassword()}
                                            size={24}
                                        />
                                    </View>
                                }
                                secureTextEntry={this.state.isPasswordSecure}
                                textContentType={'password'}
                                value={this.state.form_values.password}
                            />
                            <TouchableOpacity
                                onPress={() => this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? null : AppUtil.pushToScene('forgotPassword')}
                                style={{width: AppSizes.screen.widthTwoThirds,}}
                            >
                                <Text
                                    robotoBold
                                    style={{
                                        color:             AppColors.zeplin.slateLight,
                                        fontSize:          AppFonts.scaleFont(11),
                                        fontStyle:         'italic',
                                        marginBottom:      AppSizes.paddingLrg,
                                        marginTop:         AppSizes.paddingSml,
                                        paddingHorizontal: (AppSizes.paddingLrg + AppSizes.paddingSml),
                                    }}
                                >
                                    {'forgot password?'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                            containerStyle={{alignItems: 'center', width: AppSizes.screen.widthTwoThirds,}}
                            disabled={isLoginBtnDisabled}
                            disabledStyle={{backgroundColor: AppColors.zeplin.slateLight,}}
                            disabledTitleStyle={{color: AppColors.white,}}
                            loading={this.state.loading}
                            loadingProps={{color: AppColors.white,}}
                            loadingStyle={{backgroundColor: AppColors.zeplin.yellow, width: '100%',}}
                            onPress={() => this.state.loading ? null : this.setState({ loading: true, }, () => this._handleFormSubmit())}
                            raised={true}
                            title={'Login'}
                            titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(20), width: '100%',}}
                        />
                    </View>
                </ImageBackground>

                <FathomModal
                    isVisible={this.state.isModalVisible}
                    style={[AppStyles.containerCentered, {backgroundColor: AppColors.transparent,}]}
                >
                    <View>
                        <Card title={'Select environment'}>
                            <Spacer size={5} />
                            <View style={{borderWidth: 1, borderColor: AppColors.border,}}>
                                { _.map(APIConfig.APIs, (key, value) => (
                                    <ListItem
                                        bottomDivider={true}
                                        containerStyle={{backgroundColor: value === this.props.environment ? AppColors.primary.grey.fiftyPercent : AppColors.white,}}
                                        key={value}
                                        onPress={() => { this.setState({ isModalVisible: false, }); return this.props.setEnvironment(value); }}
                                        title={`${value}: ${key}`}
                                        titleStyle={{color: value === this.props.environment ? AppColors.white : AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(18),}}
                                        topDivider={true}
                                    />
                                ))}
                            </View>
                            <Spacer />
                            <Button
                                buttonStyle={{backgroundColor: AppColors.primary.grey.fiftyPercent,}}
                                onPress={() => this.setState({ isModalVisible: false, })}
                                title={'Cancel'}
                            />
                        </Card>
                    </View>
                </FathomModal>

            </Wrapper>
        );
    }
}

/* Export Component ==================================================================== */
export default Login;
