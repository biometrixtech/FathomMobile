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
import FormValidation from 'tcomb-form-native';
import Modal from 'react-native-modalbox';

// Consts and Libs
import { AppAPI } from '../../lib';
import { AppColors, APIConfig, AppFonts, AppSizes, AppStyles } from '../../constants';
import { onboardingUtils } from '../../constants/utils';

// Components
import { Alerts, Button, Card, ListItem, Spacer, Text } from '../custom';

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
let inputStyle = _.cloneDeep(FormValidation.form.Form.stylesheet);
inputStyle.textbox.error.borderColor = AppColors.secondary.red.fiftyPercent;
inputStyle.textbox.error.borderLeftWidth = 0;
inputStyle.textbox.error.borderRightWidth = 0;
inputStyle.textbox.error.borderTopWidth = 0;
inputStyle.textbox.error.color = AppColors.secondary.red.fiftyPercent;
inputStyle.textbox.error.textAlign = 'center';
inputStyle.textbox.error.fontFamily = AppStyles.robotoBold.fontFamily;
inputStyle.textbox.error.fontWeight = AppStyles.robotoBold.fontWeight;
inputStyle.textbox.error.fontSize = AppFonts.scaleFont(15);
inputStyle.textbox.normal.borderColor = AppColors.white;
inputStyle.textbox.normal.borderLeftWidth = 0;
inputStyle.textbox.normal.borderRightWidth = 0;
inputStyle.textbox.normal.borderTopWidth = 0;
inputStyle.textbox.normal.color = AppColors.primary.yellow.hundredPercent;
inputStyle.textbox.normal.textAlign = 'center';
inputStyle.textbox.normal.fontFamily = AppStyles.robotoBold.fontFamily;
inputStyle.textbox.normal.fontWeight = AppStyles.robotoBold.fontWeight;
inputStyle.textbox.normal.fontSize = AppFonts.scaleFont(15);
inputStyle.textboxView.error.color = AppColors.white;
inputStyle.textboxView.normal.color = AppColors.white;
inputStyle.errorBlock.color = AppColors.secondary.red.fiftyPercent;
inputStyle.errorBlock.textAlign = 'center';

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

        // Email Validation
        const validEmail = FormValidation.refinement(
            FormValidation.String, (email) => {
                if(!onboardingUtils.isEmailValid(email)) { return false; }
                return true;
            },
        );

        // Password Validation - Must be 6 chars long
        const validPassword = FormValidation.refinement(
            FormValidation.String, (password) => {
                if (password.length < 2) { return false; }
                return true;
            },
        );

        this.state = {
            isModalVisible: false,
            modalStyle:     {},
            resultMsg:      {
                error:   '',
                status:  '',
                success: '',
            },
            form_fields: FormValidation.struct({
                Email:    validEmail,
                Password: validPassword,
            }),
            empty_form_values: {
                Email:    '',
                Password: '',
            },
            form_values: {},
            options:     {
                fields: {
                    Email: {
                        autoCapitalize:       'none',
                        blurOnSubmit:         false,
                        clearButtonMode:      'while-editing',
                        error:                'Your email must be a valid email format',
                        keyboardType:         'email-address',
                        label:                ' ',
                        placeholder:          'e-mail address',
                        placeholderTextColor: AppColors.primary.yellow.hundredPercent,
                        onSubmitEditing:      () => this._focusNextField('Password'),
                        returnKeyType:        'next',
                        stylesheet:           inputStyle,
                    },
                    Password: {
                        blurOnSubmit:         true,
                        clearButtonMode:      'while-editing',
                        error:                'Your password must be 8-16 characters, include an uppercase letter, a lowercase letter, and a number',
                        label:                ' ',
                        password:             true,
                        placeholder:          'password',
                        placeholderTextColor: AppColors.primary.yellow.hundredPercent,
                        onSubmitEditing:      this.login,
                        returnKeyType:        'done',
                        secureTextEntry:      true,
                        stylesheet:           inputStyle,
                    },
                },
            },
        };
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
    }


    _focusNextField = (id) => {
        this.form.refs.input.refs[id].refs.input.focus();
    }

    resizeModal = (ev) => {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    /**
      * Login
      */
    login = () => {
        // Get new credentials and update
        const credentials = this.form.getValue();

        // close keyboard
        Keyboard.dismiss();

        // Form is valid
        if (credentials) {
            this.setState({ form_values: credentials }, () => {
                this.setState({ resultMsg: { status: 'One moment...' } });

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
                        return this.props.getUserSensorData(response.user.id)
                            .then(res => Promise.resolve(response))
                            .catch(err => Promise.reject(err));
                    })
                    .then(response => {
                        let { authorization, user } = response;
                        return this.props.registerDevice(this.props.certificate, this.props.device, user)
                            .then(() => this.props.finalizeLogin(user, credentials, authorization.jwt));
                    })
                    .then(() => this.setState({
                        resultMsg: { success: 'Success, now loading your data!' },
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
        const Form = FormValidation.form.Form;

        return (
            <Wrapper>

                <View>
                    <Egg
                        onCatch={() => this.setState({ isModalVisible: true })}
                        setps={'TTT'}
                    >
                        <Image
                            resizeMode={'contain'}
                            source={require('../../../assets/images/standard/fathom_logo_color_stacked.png')}
                            style={styles.mainLogo}
                        />
                    </Egg>
                </View>

                <View style={{width: AppSizes.screen.widthTwoThirds,}}>
                    <Alerts
                        error={this.state.resultMsg.error}
                        status={this.state.resultMsg.status}
                        success={this.state.resultMsg.success}
                    />
                    <Form
                        options={this.state.options}
                        ref={b => { this.form = b; }}
                        type={this.state.form_fields}
                        value={this.state.form_values}
                    />
                    <Spacer size={10} />
                    <Button
                        backgroundColor={AppColors.white}
                        buttonStyle={[AppStyles.paddingVerticalMed, AppStyles.paddingHorizontalXLrg,]}
                        disabled={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? true : false}
                        fontFamily={AppStyles.robotoBold.fontFamily}
                        fontWeight={AppStyles.robotoBold.fontWeight}
                        onPress={this.login}
                        textColor={AppColors.primary.yellow.hundredPercent}
                        textStyle={{ fontSize: AppFonts.scaleFont(16)}}
                        title={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? 'Logging in...' : 'Login'}
                    />
                    <Spacer size={10} />
                    {/*<TouchableOpacity onPress={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? null : Actions.forgotPassword}>
                        <View>
                            <Text p style={[AppStyles.textCenterAligned, {color: AppColors.white, textDecorationLine: 'none',}]}>{'forgot password'}</Text>
                        </View>
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