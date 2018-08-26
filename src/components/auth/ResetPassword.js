/**
 * Reset Password Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Keyboard, View, StyleSheet, TouchableOpacity
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppAPI, AppUtil } from '../../lib';
import { onboardingUtils } from '../../constants/utils';
import { AppColors, AppFonts, AppSizes, AppStyles } from '../../constants';
import _ from 'lodash';
// Components
import { Alerts, Text, ProgressBar } from '../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    headerWrapper: {
        alignItems:    'center',
        flexDirection: 'row',
    },
    wrapper: {
        paddingHorizontal: 10,
        paddingVertical:   10,
    },
});

let inputStyle = AppUtil.formatInputStyle(FormValidation.form.Form.stylesheet);

/* Component ==================================================================== */
class ResetPassword extends Component {
    static componentName = 'ResetPassword';

    static propTypes = {
        onFormSubmit:     PropTypes.func.isRequired,
        email:            PropTypes.string,
        newPassword:      PropTypes.string,
        confirmPassword:  PropTypes.string,
        verificationCode: PropTypes.string,
    }

    static defaultProps = {
        email:            null,
        newPassword:      null,
        confirmPassword:  null,
        verificationCode: null,
    
    }

    constructor(props) {
        super(props);

        // Email Validation
        const validEmail = FormValidation.refinement(
            FormValidation.String, (email) => {
                return onboardingUtils.isEmailValid(email);
            },
        );

        // Password Validation
        const validPassword = FormValidation.refinement(
            FormValidation.String, (newPassword) => {
                return onboardingUtils.isPasswordlValid(newPassword);
            },
        );

        // Passwords Match
        const passwordsMatch = FormValidation.refinement(
            FormValidation.String, (newPassword, confirmPassword) => {
                if(newPassword === confirmPassword)
                {
                    return true;
                }
                return false;
            },
        );
        
        // Six-digit Code Validation
        const validCode = FormValidation.refinement(
            FormValidation.String, (verificationCode) => {
                const regularExpression = /\d{6}/;

                return regularExpression.test(verificationCode);
            },
        );

        this.state = {
            resultMsg: {
                status:  '',
                success: '',
                error:   '',
            },
            form_fields: FormValidation.struct({
                Email:            validEmail,
                VerificationCode: validCode,
                NewPassword:      validPassword,
                ConfirmPassword:  passwordsMatch,
            }),
            empty_form_values: {
                Email:            '',
                VerificationCode: '',
                NewPassword:      '',
                ConfirmPassword:  '',
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
                        onSubmitEditing:      () => this._focusNextField('VerificationCode'),
                        placeholder:          'email',
                        placeholderTextColor: AppColors.primary.yellow.hundredPercent,
                        returnKeyType:        'next',
                        stylesheet:           inputStyle, 
                        value:                this.props.email   
                    },
                    VerificationCode: {
                        autoCapitalize:       'none',
                        blurOnSubmit:         false,
                        clearButtonMode:      'while-editing',
                        error:                'Please enter a valid verification code',
                        keyboardType:         'default',
                        label:                ' ',
                        onSubmitEditing:      () => this._focusNextField('NewPassword'),
                        placeholder:          'verification code',
                        placeholderTextColor: AppColors.primary.yellow.hundredPercent,
                        returnKeyType:        'next',
                        stylesheet:           inputStyle,    
                    },
                    NewPassword: {
                        autoCapitalize:       'none',
                        blurOnSubmit:         false,
                        clearButtonMode:      'while-editing',
                        error:                onboardingUtils.getPasswordRules(),
                        keyboardType:         'default',
                        label:                ' ',
                        onSubmitEditing:      () => this._focusNextField('ConfirmPassword'),
                        placeholder:          'new password',
                        placeholderTextColor: AppColors.primary.yellow.hundredPercent,
                        returnKeyType:        'next',
                        secureTextEntry:      true,
                        stylesheet:           inputStyle,    
                    },
                    ConfirmPassword: {
                        autoCapitalize:       'none',
                        blurOnSubmit:         true,
                        clearButtonMode:      'while-editing',
                        error:                'Passwords entered do not match.',
                        keyboardType:         'default',
                        label:                ' ',
                        placeholder:          'confirm password',
                        placeholderTextColor: AppColors.primary.yellow.hundredPercent,
                        returnKeyType:        'done',
                        secureTextEntry:      true,
                        stylesheet:           inputStyle,    
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
    }

    /**
      * Reset Password
      */
    resetPassword = () => {
        // Get values
        const userData = this.form.getValue();

        // close keyboard
        Keyboard.dismiss();

        // Form is valid
        if (userData) {
            this.setState({ form_values: userData }, () => {
                this.setState({ resultMsg: { status: 'One moment...' } });

                // Scroll to top, to show message
                if (this.scrollView) {
                    this.scrollView.scrollTo({ y: 0 });
                }

                this.props.onFormSubmit({
                    email:            userData.Email,
                    verificationCode: userData.VerificationCode,
                    newPassword:      userData.NewPassword,
                    confirmPassword:  userData.ConfirmPassword,
                }).then(() => {
                    this.setState({
                        resultMsg: { success: 'Password reset was successful!' },
                    }, () => {
                        setTimeout(() => {
                            Actions.root({ type: 'reset' });
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
            <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: AppColors.white}}>
                <View >
                    <ProgressBar
                        currentStep={1}
                        totalSteps={2}
                    />
                    <Alerts
                        status={this.state.resultMsg.status}
                        success={this.state.resultMsg.success}
                        error={this.state.resultMsg.error}
                    />
                    <Text robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.black, fontSize: AppFonts.scaleFont(20)}]}>
                        {'Set Your Password'}
                    </Text>

                    <View style={[AppStyles.containerCentered]}>
                        <View style={{width: AppSizes.screen.widthFourFifths}}>
                            <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, { fontSize: AppFonts.scaleFont(15) }]}>
                                {'You should receive a verification code by email.  Please retrieve that code and enter your new password.'}
                            </Text>
                        </View>
                    </View>
                    <View style={[AppStyles.containerCentered]}>
                        <View style={{width: AppSizes.screen.widthTwoThirds}}>
                        
                            <Form
                                ref={(b) => { this.form = b; }}
                                type={this.state.form_fields}
                                value={this.state.form_values}
                                options={this.state.options}
                                
                            />
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={this.resetPassword} style={[AppStyles.nextButtonWrapper, {margin: 0}]}>
                    <Text robotoBold style={[AppStyles.nextButtonText, { fontSize: AppFonts.scaleFont(16) }]}>Confirm</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _focusNextField = (id) => {
        this.form.refs.input.refs[id].refs.input.focus();
    }
}

/* Export Component ==================================================================== */
export default ResetPassword;
