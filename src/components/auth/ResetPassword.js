/**
 * Reset Password Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, View, StyleSheet, TouchableOpacity, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppAPI, AppUtil, } from '../../lib';
import { onboardingUtils, } from '../../constants/utils';

// Components
import { Alerts, FormInput, ProgressBar, Spacer, Text, } from '../custom';

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
            let newFormValues = _.update( this.state.form_values, 'Email', () => this.props.email);
            this.setState(
                { form_values: newFormValues, },
                () => {
                    let newSuccessMsg = this.props.email !== null && Actions.currentParams.from_button === 'reset-button' ? 'EMAIL SENT! CHECK YOUR INBOX' : '';
                    let newResultMsgs = _.update( this.state.resultMsg, 'success', () => newSuccessMsg);
                    newResultMsgs = _.update( this.state.resultMsg, 'error', () => '');
                    newResultMsgs = _.update( this.state.resultMsg, 'status', () => '');
                    this.setState({
                        ['resultMsg']: newResultMsgs,
                    });
                }
            );
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
                        this.setState({ resultMsg: {error: 'The pin you are using has expired.  Please request a new pin.'} });
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
                    <Spacer size={20} />
                    <Text robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(20),}]}>
                        {'Set New Password'}
                    </Text>
                    <Spacer size={20} />
                    <View style={[AppStyles.containerCentered]}>
                        <View style={{width: AppSizes.screen.widthFourFifths}}>
                            <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}]}>
                                {'You should receive a 6-digit pin by email. Please retrieve that pin and enter your new password.'}
                            </Text>
                        </View>
                    </View>
                    <Spacer size={20} />
                    <View style={[AppStyles.containerCentered]}>
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={ false }
                            clearButtonMode = 'while-editing'
                            inputStyle = {[{color: AppColors.primary.yellow.hundredPercent, textAlign: 'center', width: AppSizes.screen.widthTwoThirds, paddingTop: 25,}]}
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
                            inputStyle = {[{color: AppColors.primary.yellow.hundredPercent, textAlign: 'center', width: AppSizes.screen.widthTwoThirds, paddingTop: 25,}]}
                            keyboardType={'default'}
                            onChangeText={(text) => this._handleFormChange('VerificationCode', text)}
                            onSubmitEditing={() => {
                                this._focusNextField('new_password');
                            }}
                            placeholder={'6-digit pin'}
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
                            inputStyle = {[{color: AppColors.primary.yellow.hundredPercent, textAlign: 'center', width: AppSizes.screen.widthTwoThirds, paddingTop: 25,}]}
                            keyboardType={'default'}
                            onChangeText={(text) => this._handleFormChange('NewPassword', text)}
                            onSubmitEditing={() => {
                                this._focusNextField('confirm_password');
                            }}
                            placeholder={'new password'}
                            placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                            returnKeyType={'next'}
                            secureTextEntry={true}
                            textInputRef={input => {
                                this.inputs.new_password = input;
                            }}
                            value={this.state.form_values.NewPassword}
                        />
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={ true }
                            clearButtonMode = 'while-editing'
                            inputStyle = {[{color: AppColors.primary.yellow.hundredPercent, textAlign: 'center', width: AppSizes.screen.widthTwoThirds, paddingTop: 25,}]}
                            keyboardType={'default'}
                            onChangeText={(text) => this._handleFormChange('ConfirmPassword', text)}
                            onSubmitEditing={() => this._handleFormSubmit()}
                            placeholder={'confirm new password'}
                            placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                            returnKeyType={'done'}
                            secureTextEntry={true}
                            textInputRef={input => {
                                this.inputs.confirm_password = input;
                            }}
                            value={this.state.form_values.ConfirmPassword}
                        />

                    </View>
                </View>
                <TouchableOpacity onPress={() => this._handleFormSubmit()} style={[AppStyles.nextButtonWrapper, {margin: 0}]}>
                    <Text robotoBold style={[AppStyles.nextButtonText, {fontSize: AppFonts.scaleFont(16),}]}>Confirm</Text>
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
            errorsArray.push('Please enter a valid pin')
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
        // also clear error messages when typing
        let newResultMsgs = _.update( this.state.resultMsg, 'success', () => '');
        newResultMsgs = _.update( this.state.resultMsg, 'error', () => '');
        newResultMsgs = _.update( this.state.resultMsg, 'status', () => '');
        this.setState({
            ['resultMsg']: newResultMsgs,
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

    _loginUser(userData) {
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
                let { authorization, user } = response;
                return this.props.registerDevice(this.props.certificate, this.props.device, user)
                    .then(() => this.props.finalizeLogin(user, userData, authorization));
            })
            .then(res => this.setState({
                resultMsg: { success: 'Success, now loading your data!' },
            }, () => {
                AppUtil.routeOnLogin(res);
            })).catch((err) => {
                console.log('err',err);
                const error = AppAPI.handleError(err);
                return this.setState({ resultMsg: { error } });
            });
    }
}

/* Export Component ==================================================================== */
export default ResetPassword;
