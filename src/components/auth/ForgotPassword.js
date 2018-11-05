/**
 * Forgot Password Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, View, StyleSheet, TouchableOpacity, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import { Actions, } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppAPI, } from '../../lib';
import { onboardingUtils, } from '../../constants/utils';

// Components
import { Alerts, Button, FormInput, ProgressBar, Spacer, Text, } from '../custom';

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
class ForgotPassword extends Component {
    static componentName = 'ForgotPassword';

    static propTypes = {
        onFormSubmit: PropTypes.func.isRequired,
        email:        PropTypes.string
    }

    static defaultProps = {
        email: null,
    }

    constructor(props) {
        super(props);
        this.inputs = {};

        this.state = {
            resultMsg: {
                status:  '',
                success: '',
                error:   '',
            },
            form_values: {
                email: '',
            },
        };
    }

    componentDidMount = () => {
        if (this.props.email !== null) {
            this.setState({
                form_values: {
                    email: this.props.email,
                },
            });
        }
    }

    /**
      * Forgot Password
      */
    forgotPassword = () => {
        // Get email
        const credentials = this.state.form_values;

        // close keyboard
        Keyboard.dismiss();

        // Form is valid
        if (credentials) {
            this.setState({ form_values: credentials }, () => {
                this.setState({ resultMsg: { status: 'One moment...' } });

                // Scroll to top, to show message
                if (this.scrollView) {
                    this.scrollView.scrollTo({ y: 0 });
                }

                this.props.onFormSubmit({
                    email: credentials.email,
                }).then(() => {
                    this.setState({
                        resultMsg: { success: 'A PIN has been sent to your email.' },
                    }, () => {
                        setTimeout(() => {
                            this._routeToResetPassword('reset-button');
                        }, 1000);
                    });
                }).catch((err) => {
                    const error = AppAPI.handleError(err);

                    if(error.includes('UserNotFoundException')) {
                        this.setState({ resultMsg: {error: 'The email address you provided was not found.'} });
                    } else if(error.includes('LimitExceededException')) {
                        this.setState({ resultMsg: {error: 'Reset limit exceeded.  Please try again after some time.'} });
                    } else if(error.includes('You must specify an endpoint')) {
                        this.setState({ resultMsg: {error: 'Sorry, we are currently unable to process your request. Please try again after some time.'} });
                    } else{
                        this.setState({ resultMsg: { error } });
                    }
                });
            });
        }
    }

    _validateForm = () => {
        const form_fields = this.state;
        let errorsArray = [];
        errorsArray = errorsArray.concat(onboardingUtils.isEmailValid(form_fields.form_values.email).errorsArray);
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
        if (errorsArray.length === 0) {
            this.forgotPassword();
        } else {
            let newErrorFields = _.update( this.state.resultMsg, 'error', () => errorsArray);
            this.setState({ resultMsg: newErrorFields });
        }
    }

    _routeToResetPassword = (from_button) => {
        Actions.resetPassword({ from_button, });
    }

    render = () => {
        return (
            <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: AppColors.white}}>
                <View >
                    <ProgressBar
                        currentStep={1}
                        totalSteps={3}
                    />
                    <Alerts
                        error={this.state.resultMsg.error}
                    />
                    <Spacer size={20} />
                    <Text robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(20),}]}>
                        {'Reset Your Password'}
                    </Text>
                    <Spacer size={20} />
                    <View style={[AppStyles.containerCentered]}>
                        <View style={{width: AppSizes.screen.widthFourFifths}}>
                            <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}]}>
                                {'Enter your email to receive a 6-digit PIN to create a new password.'}
                            </Text>
                        </View>
                    </View>
                    <Spacer size={20} />
                    <View style={[AppStyles.containerCentered]}>
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={ true }
                            clearButtonMode = 'while-editing'
                            inputStyle = {[{color: AppColors.primary.yellow.hundredPercent, textAlign: 'center', width: AppSizes.screen.widthTwoThirds, paddingTop: 25,}]}
                            keyboardType={'email-address'}
                            onChangeText={(text) => this._handleFormChange('email', text)}
                            placeholder={'email'}
                            placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                            returnKeyType={'done'}
                            textInputRef={input => {
                                this.inputs.email = input;
                            }}
                            value={this.state.form_values.email}
                        />
                        <Spacer size={20} />
                        {<TouchableOpacity onPress={() => this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? null : this._routeToResetPassword('link')}>
                            <View>
                                <Text
                                    robotoRegular
                                    style={[AppStyles.textCenterAligned, {color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(15), textDecorationLine: 'none',}]}
                                >
                                    {'or '}
                                    <Text
                                        robotoRegular
                                        style={[AppStyles.textCenterAligned, {color: AppColors.primary.grey.fiftyPercent, fontSize: AppFonts.scaleFont(15), textDecorationLine: 'underline',}]}
                                    >
                                        {'enter your 6-digit PIN'}
                                    </Text>
                                </Text>
                            </View>
                        </TouchableOpacity>}
                    </View>
                </View>
                <Button
                    backgroundColor={AppColors.primary.yellow.hundredPercent}
                    buttonStyle={{borderRadius: 0, paddingVertical: 20,}}
                    containerViewStyle={{marginLeft: 0, width: '100%',}}
                    color={AppColors.white}
                    fontFamily={AppStyles.robotoBold.fontFamily}
                    fontWeight={AppStyles.robotoBold.fontWeight}
                    onPress={() => this._handleFormSubmit()}
                    raised={false}
                    textStyle={{ fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                    title={'Reset'}
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default ForgotPassword;
