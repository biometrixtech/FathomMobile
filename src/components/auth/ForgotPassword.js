/**
 * Forgot Password Screen
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
import { Alerts, FormInput, ProgressBar, Spacer, Text } from '../custom';

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
        const credentials = this.inputs.email.value;
        
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
                    email: credentials.Email,
                }).then(() => {
                    this.setState({
                        resultMsg: { success: 'A verification code has been sent to your email.' },
                    }, () => {
                        setTimeout(() => {
                            this._routeToResetPassword();
                        }, 1000);
                    });
                }).catch((err) => {
                    const error = AppAPI.handleError(err);

                    if(error.includes('UserNotFoundException')) {
                        this.setState({ resultMsg: {error: 'The email address you provided was not found.'} });    
                    }
                    else if(error.includes('LimitExceededException')) {
                        this.setState({ resultMsg: {error: 'Reset limit exceeded.  Please try again after some time.'} });    
                    }
                    else{
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
        if (errorsArray.length === 0)
        {
            this.forgotPassword();
        }
        else
        {
            let newErrorFields = _.update( this.state.resultMsg, 'error', () => errorsArray);
            this.setState({ resultMsg: newErrorFields });
        }
    }

    _routeToResetPassword = (email) => {
        
        Actions.resetPassword();
    }


    render = () => {
        console.log(this.state)
        return (
            <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: AppColors.white}}>
                <View >
                    <ProgressBar
                        currentStep={1}
                        totalSteps={3}
                    />
                    <Alerts
                        status={this.state.resultMsg.status}
                        success={this.state.resultMsg.success}
                        error={this.state.resultMsg.error}
                    />
                    <Text robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.black, fontSize: AppFonts.scaleFont(20)}]}>
                        {'Reset Your Password'}
                    </Text>

                    <View style={[AppStyles.containerCentered]}>
                        <View style={{width: AppSizes.screen.widthFourFifths}}>
                            <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, { fontSize: AppFonts.scaleFont(15) }]}>
                                {'Enter your email to receive a verification code to reset your password.'}
                            </Text>
                        </View>
                    </View>
                    <View style={[AppStyles.containerCentered]}>
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={ true }
                            clearButtonMode = 'while-editing'
                            inputStyle = {[{textAlign: 'center', width: AppSizes.screen.widthThreeQuarters,}]}
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
                        <Spacer size={10} />
                        {<TouchableOpacity onPress={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? null : this._routeToResetPassword}>
                            <View>
                                <Text 
                                    p
                                    robotoRegular 
                                    onPress={this._routeToResetPassword}
                                    style={[AppStyles.textCenterAligned, {color: AppColors.primary.grey.fiftyPercent, textDecorationLine: 'none',}]}>{'or enter your verification code'}
                                </Text>
                            </View>
                        </TouchableOpacity>}
                    </View>
                </View>
                <TouchableOpacity onPress={() => this._handleFormSubmit()} style={[AppStyles.nextButtonWrapper, {margin: 0}]}>
                    <Text robotoBold style={[AppStyles.nextButtonText, { fontSize: AppFonts.scaleFont(16) }]}>Reset</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default ForgotPassword;
