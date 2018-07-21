/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:32:58 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:41:44
 */

/**
 * SignUp Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ScrollView,
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppAPI } from '../../lib';
import { AppStyles } from '../../constants';

// Components
import { Alerts, Card, Button } from '../custom';

/* Component ==================================================================== */
class SignUp extends Component {
    static componentName = 'SignUp';

    static propTypes = {
        onFormSubmit: PropTypes.func.isRequired,
        email:        PropTypes.string,
        password:     PropTypes.string,
    }

    static defaultProps = {
        email:    null,
        password: null,
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

        // Password Validation - Must be 6 chars long
        const validPassword = FormValidation.refinement(
            FormValidation.String, (password) => {
                if (password.length < 8) { return false; }
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
                        error:           'Please enter a valid email',
                        autoCapitalize:  'none',
                        clearButtonMode: 'while-editing',
                    },
                    Password: {
                        error:           'Your password must be 8 characters or more',
                        clearButtonMode: 'while-editing',
                        secureTextEntry: true,
                    },
                },
            },
        };
    }

    componentDidMount = () => {
        if (this.props.email !== null) {
            this.setState({
                form_values: {
                    Email: this.props.email,
                },
            });
        }
        if (this.props.password !== null) {
            this.setState({
                form_values: {
                    Password: this.props.password,
                }
            })
        }
    }

    /**
      * SignUp
      */
    signUp = () => {
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

                this.props.onFormSubmit({
                    email:    credentials.Email,
                    password: credentials.Password,
                }).then(() => {
                    this.setState({
                        resultMsg: { success: 'Awesome, your new account has been created!' },
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

                    <Form
                        ref={(b) => { this.form = b; }}
                        type={this.state.form_fields}
                        value={this.state.form_values}
                        options={this.state.options}
                    />

                    <Button
                        title={'Sign Up'}
                        onPress={this.signUp}
                    />

                </Card>
            </ScrollView>
        );
    }
}

/* Export Component ==================================================================== */
export default SignUp;
