/**
 * Reset Password Screen
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, View, findNodeHandle, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppAPI, AppUtil, } from '../../lib';
import { onboardingUtils, } from '../../constants/utils';

// Components
import { Alerts, Button, FormInput, ProgressBar, Spacer, Text, } from '../custom';

/* Component ==================================================================== */
class ResetPassword extends Component {
    static componentName = 'ResetPassword';

    static propTypes = {
        certificate:      PropTypes.object,
        confirmPassword:  PropTypes.string,
        device:           PropTypes.object,
        email:            PropTypes.string,
        finalizeLogin:    PropTypes.func.isRequired,
        getMyPlan:        PropTypes.func.isRequired,
        getSensorFiles:   PropTypes.func.isRequired,
        lastOpened:       PropTypes.object.isRequired,
        newPassword:      PropTypes.string,
        onFormSubmit:     PropTypes.func.isRequired,
        onSubmitSuccess:  PropTypes.func.isRequired,
        registerDevice:   PropTypes.func.isRequired,
        setAppLogs:       PropTypes.func.isRequired,
        setEnvironment:   PropTypes.func.isRequired,
        verificationCode: PropTypes.string,
    }

    static defaultProps = {
        certificate:      null,
        confirmPassword:  null,
        device:           null,
        email:            null,
        newPassword:      null,
        verificationCode: null,
    }

    constructor(props) {
        super(props);
        this._focusNextField = this._focusNextField.bind(this);
        this.inputs = {};
        this._scrollWrapper = {};
        this.state = {
            isSubmitting: false,
            resultMsg:    {
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
                    this.setState({ isSubmitting: false, });
                    const error = AppAPI.handleError(err);
                    if(error.includes('ExpiredCodeException')) {
                        this.setState({ resultMsg: {error: 'The PIN you are using has expired.  Please request a new PIN.'} });
                    } else if(error.includes('CodeMismatchException')) {
                        this.setState({ resultMsg: {error: 'Invalid 6-digit PIN provided, please try again.'} });
                    } else {
                        this.setState({ resultMsg: { error } });
                    }
                });
            });
        }
    }

    _loginUser = (userData) => {
        this.props.onSubmitSuccess({
            email:    userData.Email,
            password: userData.NewPassword,
        }, false)
            .then(response => {
                let { authorization, user } = response;
                return this.props.registerDevice(this.props.certificate, this.props.device, user)
                    .then(() => {
                        let clearMyPlan = (
                            this.props.lastOpened && this.props.lastOpened.userId && this.props.lastOpened.date &&
                            user && user.id &&
                            (
                                this.props.lastOpened.userId !== user.id ||
                                moment(this.props.lastOpened.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
                            )
                        ) ?
                            true
                            :
                            false;
                        return this.props.getMyPlan(user.id, moment().format('YYYY-MM-DD'), false, clearMyPlan)
                            .then(res => {
                                if(!res.daily_plans[0].daily_readiness_survey_completed) {
                                    this.props.setAppLogs(user.id);
                                }
                                return res;
                            })
                            .then(res => {
                                if(user.health_enabled) {
                                    return AppUtil.getAppleHealthKitDataPrevious(user, user.health_sync_date, user.historic_health_sync_date)
                                        .then(() => AppUtil.getAppleHealthKitData(user, user.health_sync_date, user.historic_health_sync_date));
                                }
                                return res;
                            })
                            .catch(error => {
                                const err = AppAPI.handleError(error);
                                return this.setState({ resultMsg: { err } });
                            });
                    })
                    .then(() => this.props.finalizeLogin(user, userData, authorization))
                    .then(() => user && user.sensor_data && user.sensor_data.mobile_udid && user.sensor_data.sensor_pid ? this.props.getSensorFiles(user) : user);
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

    _isValidCode = (verificationCode) => {
        let errorsArray = [];
        const regularExpression = /\d{6}/;
        let isValid = false;
        if (regularExpression.test(verificationCode)) {
            isValid = true;
        } else {
            errorsArray.push('Please enter a valid PIN')
        }
        return {
            errorsArray,
            isValid
        };
    }

    _passwordsMatch = (newPassword, confirmPassword) => {
        let errorsArray = [];
        let isValid = false;
        if(newPassword === confirmPassword) {
            isValid = true;
        } else if(newPassword.length === 0 && confirmPassword.length === 0) {
            isValid = true;
        } else {
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
        this.setState(
            { isSubmitting: true, },
            () => {
                // validation
                let errorsArray = this._validateForm();
                if (errorsArray.length === 0) {
                    this.resetPassword();
                } else {
                    let newErrorFields = _.update( this.state.resultMsg, 'error', () => errorsArray);
                    this.setState({ isSubmitting: false, resultMsg: newErrorFields });
                }
            }
        );
    }

    _scrollToInput = reactNode => {
        this._scrollWrapper.props.scrollToFocusedInput(reactNode, (75 + AppSizes.paddingLrg));
    }

    render = () => {
        /*eslint no-return-assign: 0*/
        return (
            <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1,}} innerRef={ref => {this._scrollWrapper = ref;}}>
                <View style={{backgroundColor: AppColors.white, flex: 1, justifyContent: 'space-between',}}>
                    <View>
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
                        <Text robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(20),}]}>
                            {'Set New Password'}
                        </Text>
                        <Spacer size={20} />
                        <View style={[AppStyles.containerCentered,]}>
                            <View style={{width: AppSizes.screen.widthFourFifths}}>
                                <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(15),}]}>
                                    {'You should receive a 6-digit PIN by email. Please retrieve that PIN and enter your new password.'}
                                </Text>
                            </View>
                        </View>
                        <Spacer size={20} />
                        <View style={[AppStyles.containerCentered,]}>
                            <FormInput
                                autoCapitalize={'none'}
                                blurOnSubmit={ false }
                                clearButtonMode={'while-editing'}
                                containerStyle={{width: AppSizes.screen.widthTwoThirds,}}
                                inputRef={ref => this.inputs.email = ref}
                                inputStyle={[{color: AppColors.zeplin.yellow, textAlign: 'center', paddingTop: 25,}]}
                                keyboardType={'email-address'}
                                onChangeText={text => this._handleFormChange('Email', text)}
                                onFocus={event => this._scrollToInput(findNodeHandle(event.target))}
                                onSubmitEditing={() => this._focusNextField('verification_code')}
                                placeholder={'email'}
                                placeholderTextColor={AppColors.zeplin.yellow}
                                returnKeyType={'next'}
                                value={this.state.form_values.Email}
                            />
                            <FormInput
                                autoCapitalize={'none'}
                                blurOnSubmit={ false }
                                clearButtonMode={'while-editing'}
                                containerStyle={{width: AppSizes.screen.widthTwoThirds,}}
                                inputRef={ref => this.inputs.verification_code = ref}
                                inputStyle={[{color: AppColors.zeplin.yellow, textAlign: 'center', paddingTop: 25,}]}
                                keyboardType={'default'}
                                onChangeText={text => this._handleFormChange('VerificationCode', text)}
                                onFocus={event => this._scrollToInput(findNodeHandle(event.target))}
                                onSubmitEditing={() => this._focusNextField('new_password')}
                                placeholder={'6-digit PIN'}
                                placeholderTextColor={AppColors.zeplin.yellow}
                                returnKeyType={'next'}
                                value={this.state.form_values.VerificationCode}
                            />
                            <FormInput
                                autoCapitalize={'none'}
                                blurOnSubmit={ false }
                                clearButtonMode={'while-editing'}
                                containerStyle={{width: AppSizes.screen.widthTwoThirds,}}
                                inputRef={ref => this.inputs.new_password = ref}
                                inputStyle={[{color: AppColors.zeplin.yellow, textAlign: 'center', paddingTop: 25,}]}
                                keyboardType={'default'}
                                onChangeText={text => this._handleFormChange('NewPassword', text)}
                                onFocus={event => this._scrollToInput(findNodeHandle(event.target))}
                                onSubmitEditing={() => this._focusNextField('confirm_password')}
                                placeholder={'new password'}
                                placeholderTextColor={AppColors.zeplin.yellow}
                                returnKeyType={'next'}
                                secureTextEntry={true}
                                value={this.state.form_values.NewPassword}
                            />
                            <FormInput
                                autoCapitalize={'none'}
                                blurOnSubmit={ true }
                                clearButtonMode={'while-editing'}
                                containerStyle={{width: AppSizes.screen.widthTwoThirds,}}
                                inputRef={ref => this.inputs.confirm_password = ref}
                                inputStyle={[{color: AppColors.zeplin.yellow, textAlign: 'center', paddingTop: 25,}]}
                                keyboardType={'default'}
                                onChangeText={text => this._handleFormChange('ConfirmPassword', text)}
                                onFocus={event => this._scrollToInput(findNodeHandle(event.target))}
                                placeholder={'confirm new password'}
                                placeholderTextColor={AppColors.zeplin.yellow}
                                returnKeyType={'done'}
                                secureTextEntry={true}
                                value={this.state.form_values.ConfirmPassword}
                            />
                        </View>
                    </View>
                    <Button
                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingVertical: 20,}}
                        disabled={this.state.isSubmitting}
                        onPress={() => this._handleFormSubmit()}
                        title={'Confirm'}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(16),}}
                    />
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

/* Export Component ==================================================================== */
export default ResetPassword;
