/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:32:47
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:23:22
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
    View,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import Egg from 'react-native-egg';
import FormValidation from 'tcomb-form-native';
import Modal from 'react-native-modalbox';
import SplashScreen from 'react-native-splash-screen';

// Consts and Libs
import { AppAPI } from '../../lib';
import { APIConfig, AppColors, AppStyles, AppSizes } from '../../constants';

// Components
import { Spacer, Button, Card, Alerts, Text, ListItem } from '../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.secondary.blue.hundredPercent,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
    logo: {
        width:      AppSizes.screen.width * 0.85,
        resizeMode: 'contain',
    },
    whiteText: {
        color: '#FFFFFF',
    },
    mainLogo: {
        width:  AppSizes.screen.widthHalf,
        height: AppSizes.screen.heightTenth
    }
});

const Wrapper = props => Platform.OS === 'ios' ?
    (
        <KeyboardAvoidingView behavior={'padding'} style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            {props.children}
        </KeyboardAvoidingView>
    ) :
    (
        <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            {props.children}
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
                if (email.length < 2) { return false; }
                return true;
                // const regularExpression = /^.+@.+\..+$/i;

                // return regularExpression.test(email);
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
            modalStyle: {},
            resultMsg:  {
                status:  '',
                success: '',
                error:   '',
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
                        error:           'Your email must be 2 characters or more',
                        clearButtonMode: 'while-editing',
                        keyboardType:    'email-address',
                        autoCapitalize:  'none',
                    },
                    Password: {
                        error:           'Your password must be 2 characters or more',
                        clearButtonMode: 'while-editing',
                        secureTextEntry: true,
                        password:        true,
                    },
                },
            },
        };
    }

    componentDidMount = () => {
        setTimeout(() => {
            if (this.props.email !== null && this.props.password !== null) {
                this.setState({
                    form_values: {
                        Email:    this.props.email,
                        Password: this.props.password,
                    },
                });
                Promise.resolve(this.login())
                    .then(() => SplashScreen.hide())
                    .catch(() => SplashScreen.hide());
            } else {
                SplashScreen.hide();
            }
        }, 10);
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

        // Form is valid
        if (credentials) {
            this.setState({ form_values: credentials }, () => {
                this.setState({ resultMsg: { status: 'One moment...' } });

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
                    console.log('response #1', response);
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
                        console.log('response #2', response);
                        let { authorization, user } = response;
                        return this.props.registerDevice(this.props.certificate, this.props.device, user)
                            .then(() => this.props.finalizeLogin(user, credentials, authorization.jwt));
                    })
                    .then(() => this.setState({
                        resultMsg: { success: 'Success, now loading your data!' },
                    }, () => {
                        Actions.myPlan();
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
                <Egg
                    setps={'TTT'}
                    onCatch={() => this.setState({ isModalVisible: true })}
                >
                    <Image source={require('../../../assets/images/standard/fathom-white.png')} resizeMode={'contain'} style={styles.mainLogo} />
                </Egg>

                <Card dividerStyle={{ height: 0, width: 0 }} titleStyle={{ marginBottom: 0 }}>
                    <Alerts
                        status={this.state.resultMsg.status}
                        success={this.state.resultMsg.success}
                        error={this.state.resultMsg.error}
                    />

                    <Form
                        ref={(b) => { this.form = b; }}
                        type={this.state.form_fields}
                        value={this.state.form_values}
                        options={this.state.options}
                    />

                    <Button
                        disabled={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? true : false}
                        title={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? 'Logging in...' : 'Login'}
                        onPress={this.login}
                    />

                    <Spacer size={10} />

                    {/*<TouchableOpacity onPress={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? null : Actions.forgotPassword}>
                        <View>
                            <Text p style={[AppStyles.textCenterAligned, AppStyles.link]}>Forgot Password</Text>
                        </View>
                    </TouchableOpacity>*/}

                </Card>
                <Modal
                    position={'center'}
                    style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                    isOpen={this.state.isModalVisible}
                    backButtonClose
                    swipeToClose={false}
                    coverScreen
                    onClosed={() => this.setState({ isModalVisible: false })}
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
                                title={'Cancel'}
                                backgroundColor={AppColors.primary.grey.fiftyPercent}
                                onPress={() => this.setState({ isModalVisible: false })}
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
