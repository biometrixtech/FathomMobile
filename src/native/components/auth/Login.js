/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:32:47 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-05-05 21:43:56
 */

/**
 * Login Screen
 *  - Entry screen for all authentication
 *  - User can tap to login, forget password, or signUp...
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import Egg from 'react-native-egg';

// Consts and Libs
import { AppAPI } from '../../../lib/index';
import { AppStyles, AppSizes } from '../../theme/';
import { APIConfig, AppColors } from '../../../constants';

// Components
import { Spacer, Button, Card, Alerts, Text, ListItem } from '../custom/';

/* Biometrix Roles =========================================================== */
const roles = {
    admin:          'admin',
    athlete:        'athlete',
    biometrixAdmin: 'biometrix_admin',
    manager:        'manager',
    researcher:     'researcher',
};

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
        onFormSubmit:   PropTypes.func,
        setEnvironment: PropTypes.func,
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
                this.login();
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

                return this.props.onFormSubmit({
                    email:    credentials.Email,
                    password: credentials.Password,
                }, false).then((userData) => {
                    return this.setState({
                        resultMsg: { success: 'Success, now loading your data!' },
                    }, () => {
                        Actions.tabbar();
                        // switch (userData.role) {
                        // case roles.athlete:
                        //     Actions.athleteApp({ type: 'reset'});
                        //     break;
                        // case roles.admin:
                        // case roles.biometrixAdmin:
                        // case roles.manager:
                        // case roles.researcher:
                        // default:
                        //     Actions.app({ type: 'reset' });
                        //     break;
                        // }
                    });
                }).catch((err) => {
                    console.log(err);
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
                    <Image source={require('../../../assets/images/fathom-white.png')} resizeMode={'contain'} style={styles.mainLogo} />
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
                        title={'Login'}
                        onPress={this.login}
                    />

                    <Spacer size={10} />

                    <TouchableOpacity onPress={Actions.passwordReset}>
                        <View>
                            <Text p style={[AppStyles.textCenterAligned, AppStyles.link]}>
                            Forgot Password
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/*<Spacer size={10} />
                <Text p style={[AppStyles.textCenterAligned]}>
                    - or -
                </Text>
                <Button
                    title={'Sign Up'}
                    onPress={Actions.signUp}
                />*/}
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
                                            key={key}
                                            title={`${key}: ${value}`}
                                            hideChevron
                                            containerStyle={{ backgroundColor: key === this.props.environment ? AppColors.primary.grey.fiftyPercent : AppColors.white }}
                                            onPress={() => { this.setState({ isModalVisible: false }); return this.props.setEnvironment(key);  }}
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
