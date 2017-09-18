/**
 * Login Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    ScrollView,
    AsyncStorage,
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles } from '@theme/';

// Components
import { Alerts, Card, Text, Button } from '@ui/';

/* Component ==================================================================== */
class ForgotPassword extends Component {
    static componentName = 'ForgotPassword';

    static propTypes = {
        forgotPassword: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        // Email Validation
        const validEmail = FormValidation.refinement(
            FormValidation.String, (email) => {
                const regularExpression = /^.+@.+\..+$/i;

                return regularExpression.test(email);
            },
        );

        this.state = {
            resultMsg: {
                status:  '',
                success: '',
                error:   '',
            },
            form_fields: FormValidation.struct({
                Email: validEmail,
            }),
            empty_form_values: {
                Email: '',
            },
            form_values: {},
            options:     {
                fields: {
                    Email: {
                        error:           'Please enter a valid email',
                        autoCapitalize:  'none',
                        clearButtonMode: 'while-editing',
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
                    Email: jsonValues.email,
                },
            });
        }
    }

    /**
      * Forgot Password
      */
    forgotPassword = () => {
        // Get email
        const credentials = this.form.getValue();

        // Form is valid
        if (credentials) {
            this.setState({ form_values: credentials }, () => {
                this.setState({ resultMsg: { status: 'One moment...' } });

                // Scroll to top, to show message
                if (this.scrollView) {
                    this.scrollView.scrollTo({ y: 0 });
                }

                this.props.forgotPassword({
                    email: credentials.Email,
                }).then(() => {
                    this.setState({
                        resultMsg: { success: 'Awesome, recovery instructions have been sent to your email!' },
                    }, () => {
                        setTimeout(() => {
                            Actions.app({ type: 'reset' });
                        }, 1000);
                    });
                }).catch((err) => {
                    const error = AppAPI.handleError(err);
                    this.setState({ resultMsg: { error } });
                });
            });
        }
    }

    /* eslint-disable max-len */
    render = () => {
        const Form = FormValidation.form.Form;

        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                ref={(a) => { this.scrollView = a; }}
                style={[AppStyles.container]}
                contentContainerStyle={[AppStyles.container, { alignItems: 'center' }]}
            >
                <Card>
                    <Alerts
                        status={this.state.resultMsg.status}
                        success={this.state.resultMsg.success}
                        error={this.state.resultMsg.error}
                    />

                    <Text p style={[AppStyles.textCenterAligned]}>
                        Enter your email address and we will send you an email with a link to reset your password.
                    </Text>

                    <Form
                        ref={(b) => { this.form = b; }}
                        type={this.state.form_fields}
                        value={this.state.form_values}
                        options={this.state.options}
                    />

                    <Button
                        title={'Submit'}
                        onPress={this.forgotPassword}
                    />

                </Card>
            </ScrollView>
        );
    }
}

/* Export Component ==================================================================== */
export default ForgotPassword;
