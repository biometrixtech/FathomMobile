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
        <KeyboardAvoidingView behavior={'padding'} style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            <ImageBackground
                source={require('../../../assets/images/standard/start.png')}
                style={[AppStyles.containerCentered, styles.imageBackground,]}
            >
                <View style={[styles.imageBackground, styles.contentWrapper,]}>
                    {props.children}
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
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
            isModalVisible: false,
            resultMsg:      {
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
        if (errorsArray.length === 0)
        {
            this.login();
        }
        else
        {
            let newErrorFields = _.update( this.state.resultMsg, 'error', () => errorsArray);
            this.setState({ resultMsg: newErrorFields });
        }
    }

    _routeToForgotPassword = () => {
        Actions.forgotPassword();
    }

    _validateForm = () => {
        const form_fields = this.state;
        let errorsArray = [];
        errorsArray = errorsArray.concat(onboardingUtils.isEmailValid(form_fields.form_values.email).errorsArray);
        errorsArray = errorsArray.concat(onboardingUtils.isPasswordValid(form_fields.form_values.password).errorsArray);
        return errorsArray;
    }

    /**
      * Login
      */
    login = () => {
        // Get new credentials and update
        let credentials = _.cloneDeep(this.state.form_values);
        credentials.email = _.toLower(credentials.email);

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
                        let { authorization, user } = response;
                        return this.props.registerDevice(this.props.certificate, this.props.device, user)
                            .then(() => {
                                let clearMyPlan = (
                                    this.props.lastOpened.userId !== user.id ||
                                    moment(this.props.lastOpened.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
                                ) ?
                                    true
                                    :
                                    false;
                                return this.props.getMyPlan(user.id, moment().format('YYYY-MM-DD'), false, clearMyPlan)
                                    .then(res => {
                                        if(!res.daily_plans[0].daily_readiness_survey_completed) {
                                            this.props.setAppLogs();
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
                            .then(() => this.props.finalizeLogin(user, credentials, authorization));
                    })
                    .then(() => this.setState({
                        resultMsg: { success: 'SUCCESS, NOW LOADING YOUR DATA!!' },
                    }, () => {
                        AppUtil.routeOnLogin(this.props.user);
                    })).catch((err) => {
                        console.log('err',err);
                        const error = AppAPI.handleError(err);
                        return this.setState({ resultMsg: { error } });
                    });

            });
        }
    }

    render = () => {
        /*eslint no-return-assign: 0*/
        return (
            <Wrapper>

                <TabIcon
                    containerStyle={[{position: 'absolute', top: (20 + AppSizes.statusBarHeight), left: 10}]}
                    icon={'arrow-left'}
                    iconStyle={[{color: AppColors.white,}]}
                    onPress={() => Actions.pop()}
                    reverse={false}
                    size={26}
                    type={'simple-line-icon'}
                />

                <View>
                    <Egg
                        onCatch={() => this.setState({ isModalVisible: true })}
                        setps={'TTTTT'}
                    >
                        <Image
                            resizeMode={'contain'}
                            source={require('../../../assets/images/standard/fathom_logo_color_stacked.png')}
                            style={styles.mainLogo}
                        />
                    </Egg>
                </View>

                <View style={[AppStyles.containerCentered,]}>
                    <Alerts
                        error={this.state.resultMsg.error}
                        extraStyles={{width: AppSizes.screen.widthTwoThirds,}}
                        success={this.state.resultMsg.success}
                    />
                    <FormInput
                        autoCapitalize={'none'}
                        blurOnSubmit={false}
                        clearButtonMode={'never'}
                        containerStyle={{width: AppSizes.screen.widthTwoThirds,}}
                        inputRef={ref => this.inputs.email = ref}
                        inputStyle={{color: AppColors.zeplin.yellow, textAlign: 'center',}}
                        keyboardType={'email-address'}
                        onChangeText={(text) => this._handleFormChange('email', text)}
                        onSubmitEditing={() => this._focusNextField('password')}
                        placeholder={'email'}
                        placeholderTextColor={AppColors.zeplin.yellow}
                        returnKeyType={'next'}
                        value={this.state.form_values.email}
                    />
                    <FormInput
                        autoCapitalize={'none'}
                        blurOnSubmit={true}
                        clearButtonMode={'never'}
                        containerStyle={{width: AppSizes.screen.widthTwoThirds,}}
                        inputRef={ref => this.inputs.password = ref}
                        inputStyle={{color: AppColors.zeplin.yellow, textAlign: 'center', paddingTop: 25,}}
                        keyboardType={'default'}
                        onChangeText={(text) => this._handleFormChange('password', text)}
                        onSubmitEditing={() => this._handleFormSubmit()}
                        password={true}
                        placeholder={'password'}
                        placeholderTextColor={AppColors.zeplin.yellow}
                        returnKeyType={'done'}
                        secureTextEntry={true}
                        value={this.state.form_values.password}
                    />
                    <Spacer size={50} />
                    <Button
                        buttonStyle={{backgroundColor: AppColors.white, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                        containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                        disabled={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? true : false}
                        disabledStyle={{width: '100%'}}
                        onPress={() => this._handleFormSubmit()}
                        title={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? 'Logging in...' : 'Login'}
                        titleStyle={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                    />
                    <Spacer size={12} />
                    <TouchableOpacity onPress={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? null : Actions.forgotPassword}>
                        <Text
                            onPress={this._routeToForgotPassword}
                            robotoRegular
                            style={[AppStyles.textCenterAligned, {color: AppColors.white, opacity: 0.75, textDecorationLine: 'none', fontSize: AppFonts.scaleFont(15),}]}
                        >
                            {'forgot password'}
                        </Text>
                    </TouchableOpacity>
                </View>

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