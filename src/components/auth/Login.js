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
import React, { Component } from 'react';
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
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import Egg from 'react-native-egg';
//import FormValidation from 'tcomb-form-native';
import Modal from 'react-native-modalbox';

// Consts and Libs
import { AppAPI, AppUtil, } from '../../lib';
import { Actions as DispatchActions, AppColors, APIConfig, AppFonts, AppSizes, AppStyles, ErrorMessages, } from '../../constants';
import { onboardingUtils } from '../../constants/utils';
import { store } from '../../store';

// Components
import { Alerts, Button, Card, FormInput, ListItem, Spacer, TabIcon, Text } from '../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.secondary.blue.hundredPercent,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
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
                style={[AppStyles.containerCentered, {height: AppSizes.screen.height, width: AppSizes.screen.width,}]}
            >
                {props.children}
            </ImageBackground>
        </KeyboardAvoidingView>
    ) :
    (
        <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            <ImageBackground
                source={require('../../../assets/images/standard/start.png')}
                style={[AppStyles.containerCentered, {height: AppSizes.screen.height, width: AppSizes.screen.width,}]}
            >
                {props.children}
            </ImageBackground>
        </View>
    );


/* Component ==================================================================== */
class Login extends Component {
    static componentName = 'Login';

    static propTypes = {
        authorizeUser:     PropTypes.func.isRequired,
        certificate:       PropTypes.object,
        device:            PropTypes.object,
        email:             PropTypes.string,
        environment:       PropTypes.string,
        finalizeLogin:     PropTypes.func.isRequired,
        getUserSensorData: PropTypes.func.isRequired,
        onFormSubmit:      PropTypes.func,
        password:          PropTypes.string,
        registerDevice:    PropTypes.func.isRequired,
        setEnvironment:    PropTypes.func,
        token:             PropTypes.string,
        user:              PropTypes.object.isRequired,
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
            modalStyle:     {},
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
        if(!this.props.scheduledMaintenance.addressed) {
            let apiMaintenanceWindow = { end_date: this.props.scheduledMaintenance.end_date, start_date: this.props.scheduledMaintenance.start_date };
            let parseMaintenanceWindow = ErrorMessages.getScheduledMaintenanceMessage(apiMaintenanceWindow);
            AppUtil.handleScheduledMaintenanceAlert(parseMaintenanceWindow.displayAlert, parseMaintenanceWindow.header, parseMaintenanceWindow.message);
        }
    }

    _focusNextField = (id) => {
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

    resizeModal = (ev) => {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    /**
      * Login
      */
    login = () => {
        // Get new credentials and update
        const credentials = this.state.form_values;

        // close keyboard
        Keyboard.dismiss();

        // Form is valid
        if (credentials) {
            this.setState({ form_values: credentials }, () => {
                this.setState({ resultMsg: { status: 'ONE MOMENT...' } });

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
                    email:    credentials.email,
                    password: credentials.password,
                }, false).then(response => {
                    let { authorization, user } = response;
                    return this.props.authorizeUser(authorization, user, credentials)
                        .then(res => {
                            let returnObj = {};
                            returnObj.user = user;
                            returnObj.authorization = res.authorization;
                            returnObj.authorization.session_token = authorization.session_token;
                            return Promise.resolve(returnObj);
                        })
                        .catch(err => Promise.reject('Unexpected response authorization'))
                })
                    .then(response => {
                        return this.props.getUserSensorData(response.user.id)
                            .then(res => Promise.resolve(response))
                            .catch(err => Promise.reject(err));
                    })
                    .then(response => {
                        let { authorization, user } = response;
                        return this.props.registerDevice(this.props.certificate, this.props.device, user)
                            .then(() => this.props.finalizeLogin(user, credentials, authorization));
                    })
                    .then(() => this.setState({
                        resultMsg: { success: 'SUCCESS, NOW LOADING YOUR DATA!!' },
                    }, () => {
                        if(this.props.user.onboarding_status && this.props.user.onboarding_status.includes('account_setup')) {
                            Actions.home();
                        } else {
                            Actions.onboarding();
                        }
                    })).catch((err) => {
                        console.log('err',err);
                        const error = AppAPI.handleError(err);
                        return this.setState({ resultMsg: { error } });
                    });
            });
        }
    }

    render = () => {

        return (
            <Wrapper>

                <TabIcon
                    containerStyle={[{position: 'absolute', top: 30, left: 10}]}
                    icon={'arrow-left'}
                    iconStyle={[{color: AppColors.white,}]}
                    onPress={() => Actions.start()}
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

                <View style={[AppStyles.containerCentered]}>
                    <Alerts
                        error={this.state.resultMsg.error}
                        extraStyles={{width: AppSizes.screen.widthTwoThirds,}}
                        status={this.state.resultMsg.status}
                        success={this.state.resultMsg.success}
                    />
                    <FormInput
                        autoCapitalize={'none'}
                        blurOnSubmit={ false }
                        clearButtonMode = 'while-editing'
                        inputStyle = {[{color: AppColors.primary.yellow.hundredPercent, textAlign: 'center', width: AppSizes.screen.widthTwoThirds,}]}
                        keyboardType={'email-address'}
                        onChangeText={(text) => this._handleFormChange('email', text)}
                        onSubmitEditing={() => this._focusNextField('password')}
                        placeholder={'email'}
                        placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                        returnKeyType={'next'}
                        textInputRef={input => {
                            this.inputs.email = input;
                        }}
                        value={this.state.form_values.email}
                    />
                    <FormInput
                        autoCapitalize={'none'}
                        blurOnSubmit={ true }
                        clearButtonMode = 'while-editing'
                        inputStyle = {[{color: AppColors.primary.yellow.hundredPercent, textAlign: 'center', width: AppSizes.screen.widthTwoThirds,paddingTop: 25}]}
                        keyboardType={'default'}
                        onChangeText={(text) => this._handleFormChange('password', text)}
                        onSubmitEditing={() => this._handleFormSubmit()}
                        password={true}
                        placeholder={'password'}
                        placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                        returnKeyType={'done'}
                        secureTextEntry={true}
                        textInputRef={input => {
                            this.inputs.password = input;
                        }}
                        value={this.state.form_values.password}
                    />
                    <Spacer size={50} />
                    <Button
                        backgroundColor={AppColors.white}
                        buttonStyle={[AppStyles.paddingVertical, AppStyles.paddingHorizontal, {justifyContent: 'center', width: '85%',}]}
                        containerViewStyle={{ alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf }}
                        disabled={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? true : false}
                        disabledStyle={{width: '100%'}}
                        fontFamily={AppStyles.robotoBold.fontFamily}
                        fontWeight={AppStyles.robotoBold.fontWeight}
                        onPress={() => this._handleFormSubmit()}
                        textColor={AppColors.primary.yellow.hundredPercent}
                        textStyle={{ fontSize: AppFonts.scaleFont(18), textAlign: 'center', width: '100%', }}
                        title={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? 'Logging in...' : 'Login'}
                    />
                    <Spacer size={12} />
                    {/*<TouchableOpacity onPress={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? null : Actions.forgotPassword}>
                        <Text
                            onPress={this._routeToForgotPassword}
                            robotoRegular
                            style={[AppStyles.textCenterAligned, {color: AppColors.white, textDecorationLine: 'none', fontSize: AppFonts.scaleFont(15),}]}
                        >
                            {'forgot password'}
                        </Text>
                    </TouchableOpacity>*/}
                </View>

                <Modal
                    backButtonClose
                    coverScreen
                    isOpen={this.state.isModalVisible}
                    onClosed={() => this.setState({ isModalVisible: false })}
                    position={'center'}
                    style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                    swipeToClose={false}
                >
                    <View onLayout={(ev) => { this.resizeModal(ev); }}>
                        <Card title={'Select environment'}>
                            <Spacer size={5} />
                            <View style={{ borderWidth: 1, borderColor: AppColors.border }}>
                                {
                                    Object.entries(APIConfig.APIs).map(([key, value]) => (
                                        <ListItem
                                            containerStyle={{ backgroundColor: key === this.props.environment ? AppColors.primary.grey.fiftyPercent : AppColors.white }}
                                            hideChevron
                                            key={key}
                                            onPress={() => { this.setState({ isModalVisible: false }); return this.props.setEnvironment(key);  }}
                                            title={`${key}: ${value}`}
                                            titleStyle={{ color: key === this.props.environment ? AppColors.white : AppColors.primary.grey.fiftyPercent }}
                                        />
                                    ))
                                }
                            </View>
                            <Spacer />
                            <Button
                                backgroundColor={AppColors.primary.grey.fiftyPercent}
                                onPress={() => this.setState({ isModalVisible: false })}
                                title={'Cancel'}
                            />
                        </Card>
                    </View>
                </Modal>

            </Wrapper>
        );
    }
}

/* Export Component ==================================================================== */
export default Login;