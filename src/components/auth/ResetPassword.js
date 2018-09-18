/**
 * Reset Password Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Keyboard, View, StyleSheet, TouchableOpacity
} from 'react-native';

import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppAPI } from '../../lib';
import { onboardingUtils } from '../../constants/utils';
import { AppColors, AppFonts, AppSizes, AppStyles } from '../../constants';
import _ from 'lodash';
// Components
import { Alerts, FormInput, Text, ProgressBar } from '../custom';

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

/* Component ==================================================================== */
class ResetPassword extends Component {
    static componentName = 'ResetPassword';

    static propTypes = {
        authorizeUser:    PropTypes.func.isRequired,
        confirmPassword:  PropTypes.string,
        email:            PropTypes.string,
        finalizeLogin:    PropTypes.func.isRequired,
        newPassword:      PropTypes.string,
        onFormSubmit:     PropTypes.func.isRequired,
        onSubmitSuccess:  PropTypes.func.isRequired,
        registerDevice:   PropTypes.func.isRequired,
        setEnvironment:   PropTypes.func.isRequired,
        verificationCode: PropTypes.string,
    }

    static defaultProps = {
        confirmPassword:  null,
        email:            null,
        newPassword:      null,
        verificationCode: null,
    }

    constructor(props) {
        super(props);
        this._focusNextField = this._focusNextField.bind(this);
        this.inputs = {};
        this.state = {
            resultMsg: {
                error:   '',
                status:  '',
                success: '',
            },
            form_values: {
                ConfirmPassword:  '',
                Email:            '',
                NewPassword:      '',
                VerificationCode: '',
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
        const userData = this.state.form_values;

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
                    email:             userData.Email,
                    confirmation_code: userData.VerificationCode,
                    password:          userData.NewPassword,
                }).then(() => {
                    this.setState({
                        resultMsg: { success: 'Password reset was successful!  Logging you in...' },
                    }, () => {
                        setTimeout(() => {
                            this._loginUser(userData);
                        }, 1000);
                    });
                }).catch((err) => {
                    const error = AppAPI.handleError(err);
                    if(error.includes('ExpiredCodeException')) {
                        this.setState({ resultMsg: {error: 'The verification code you are using has expired.  Please request a new verification code.'} });
                    }
                    else{
                        this.setState({ resultMsg: { error } });
                    }
                });
            });
        }
    }

    render = () => {

        return (
            <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: AppColors.white}}>
                <View >
                    <ProgressBar
                        currentStep={2}
                        totalSteps={3}
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

                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={ false }
                            clearButtonMode = 'while-editing'
                            inputStyle = {[{textAlign: 'center', width: AppSizes.screen.widthThreeQuarters,paddingTop: 25}]}
                            keyboardType={'email-address'}
                            onChangeText={(text) => this._handleFormChange('Email', text)}
                            onSubmitEditing={() => {
                                this._focusNextField('verification_code');
                            }}
                            placeholder={'email'}
                            placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                            returnKeyType={'next'}
                            textInputRef={input => {
                                this.inputs.email = input;
                            }}
                            value={this.state.form_values.Email}
                        />
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={ false }
                            clearButtonMode = 'while-editing'
                            inputStyle = {[{textAlign: 'center', width: AppSizes.screen.widthThreeQuarters,paddingTop: 25}]}
                            keyboardType={'default'}
                            onChangeText={(text) => this._handleFormChange('VerificationCode', text)}
                            onSubmitEditing={() => {
                                this._focusNextField('new_password');
                            }}
                            placeholder={'verification code'}
                            placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                            returnKeyType={'next'}
                            textInputRef={input => {
                                this.inputs.verification_code = input;
                            }}
                            value={this.state.form_values.VerificationCode}
                        />
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={ false }
                            clearButtonMode = 'while-editing'
                            inputStyle = {[{textAlign: 'center', width: AppSizes.screen.widthThreeQuarters,paddingTop: 25}]}
                            keyboardType={'default'}
                            onChangeText={(text) => this._handleFormChange('NewPassword', text)}
                            onSubmitEditing={() => {
                                this._focusNextField('confirm_password');
                            }}
                            placeholder={'new password'}
                            placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                            returnKeyType={'next'}
                            textInputRef={input => {
                                this.inputs.new_password = input;
                            }}
                            value={this.state.form_values.NewPassword}
                        />
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={ true }
                            clearButtonMode = 'while-editing'
                            inputStyle = {[{textAlign: 'center', width: AppSizes.screen.widthThreeQuarters,paddingTop: 25}]}
                            keyboardType={'default'}
                            onChangeText={(text) => this._handleFormChange('ConfirmPassword', text)}
                            placeholder={'confirm password'}
                            placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                            returnKeyType={'done'}
                            textInputRef={input => {
                                this.inputs.confirm_password = input;
                            }}
                            value={this.state.form_values.ConfirmPassword}
                        />

                    </View>
                </View>
                <TouchableOpacity onPress={() => this._handleFormSubmit()} style={[AppStyles.nextButtonWrapper, {margin: 0}]}>
                    <Text robotoBold style={[AppStyles.nextButtonText, { fontSize: AppFonts.scaleFont(16) }]}>Confirm</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _isValidCode = (verificationCode) => {
        let errorsArray = [];
        const regularExpression = /\d{6}/;
        let isValid = false;

        if (regularExpression.test(verificationCode))
        {
            isValid = true;
        }
        else
        {
            errorsArray.push('Please enter a valid verification code')
        }
        return {
            errorsArray,
            isValid
        };
    }

    _passwordsMatch = (newPassword, confirmPassword) => {
        let errorsArray = [];
        let isValid = false;

        if(newPassword === confirmPassword)
        {
            isValid = true;
        }
        else if(newPassword.length === 0 && confirmPassword.length === 0)
        {
            isValid = true;
        }
        else
        {
            errorsArray.push('Passwords entered do not match.');
        }
        return {
            errorsArray,
            isValid
        };
    }

    _focusNextField = (id) => {
        this.inputs[id].focus();
    }

    _validateForm = () => {
        const form_fields = this.state;
        let errorsArray = [];
        errorsArray = errorsArray.concat(onboardingUtils.isEmailValid(form_fields.form_values.Email).errorsArray);
        errorsArray = errorsArray.concat(this._isValidCode(form_fields.form_values.VerificationCode).errorsArray);
        errorsArray = errorsArray.concat(onboardingUtils.isPasswordValid(form_fields.form_values.NewPassword).errorsArray);
        errorsArray = errorsArray.concat(this._passwordsMatch(form_fields.form_values.NewPassword, form_fields.form_values.ConfirmPassword).errorsArray);
        return errorsArray;
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
            this.resetPassword();
        }
        else
        {
            let newErrorFields = _.update( this.state.resultMsg, 'error', () => errorsArray);
            this.setState({ resultMsg: newErrorFields });
        }
    }

    _loginUser(userData){
        console.log(userData);
        this.props.onSubmitSuccess({
            email:    userData.Email,
            password: userData.NewPassword,
        }, false).then(response => {
            let { authorization, user } = response;
            return this.props.authorizeUser(authorization, user, userData)
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
                    .then(() => this.props.finalizeLogin(user, userData, authorization));
            })
            .then(() => this.setState({
                resultMsg: { success: 'Success, now loading your data!' },
            }, () => {
                if(this.props.user.onboarding_status && this.props.user.onboarding_status.includes('account_setup')) {
                    Actions.myPlan();
                } else {
                    Actions.onboarding();
                }
            })).catch((err) => {
                console.log('err',err);
                const error = AppAPI.handleError(err);
                return this.setState({ resultMsg: { error } });
            });
    }
}

/* Export Component ==================================================================== */
export default ResetPassword;
