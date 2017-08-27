/**
 * Login Screen
 *  - Entry screen for all authentication
 *  - User can tap to login, forget password, or signUp...
 */
import React, { Component, PropTypes } from 'react';
import {
    View,
    KeyboardAvoidingView,
    AsyncStorage,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppSizes, AppColors } from '@theme/';

// Components
import { Spacer, Button, Card, Alerts, Text } from '@ui/';

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
        backgroundColor: AppColors.brand.primary,
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

/* Component ==================================================================== */
class Login extends Component {
    static componentName = 'Login';

    static propTypes = {
        login: PropTypes.func.isRequired,
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
            resultMsg: {
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

    componentDidMount = async () => {
        // Get user data from AsyncStorage to populate fields
        const values = await AsyncStorage.getItem('api/credentials');
        const jsonValues = JSON.parse(values);

        if (values !== null) {
            this.setState({
                form_values: {
                    Email:    jsonValues.email,
                    Password: jsonValues.password,
                },
            });
            this.login();
        }
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

                // Scroll to top, to show message
                if (this.scrollView) {
                    this.scrollView.scrollTo({ y: 0 });
                }

                return this.props.login({
                    email:    credentials.Email,
                    password: credentials.Password,
                }, true).then((userData) => {
                    return this.setState({
                        resultMsg: { success: 'Success, now loading your data!' },
                    }, () => {
                        Actions.app({ type: 'reset' });
                        // switch (userData.role) {
                        // case roles.admin:
                        //     Actions.adminApp({ type: 'reset' });
                        //     break;
                        // case roles.athlete:
                        //     Actions.athleteApp({ type: 'reset' });
                        //     break;
                        // case roles.biometrixAdmin:
                        //     Actions.biometrixApp({ type: 'reset' }); // eventually changed to biometrixAdminApp?
                        //     break;
                        // case roles.manager:
                        //     Actions.managerApp({ type: 'reset' });
                        //     break;
                        // case roles.researcher:
                        //     Actions.researcherApp({ type: 'reset' });
                        //     break;
                        // default:
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
            <KeyboardAvoidingView
                behavior={'padding'}
                style={[AppStyles.containerCentered, AppStyles.container, styles.background]}
            >

                <Image source={require('@images/fathom_white.png')} resizeMode={'contain'} style={styles.mainLogo} />

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
            </KeyboardAvoidingView>
        );
    }
}

/* Export Component ==================================================================== */
export default Login;
