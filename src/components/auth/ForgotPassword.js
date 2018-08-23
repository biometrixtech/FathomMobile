/**
 * Forgot Password Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, StyleSheet, TouchableOpacity
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppAPI, AppUtil } from '../../lib';
import { onboardingUtils } from '../../constants/utils';
import { AppColors, AppFonts, AppSizes, AppStyles } from '../../constants';
import _ from 'lodash';
// Components
import { Alerts, ProgressBar, Spacer, Text } from '../custom';

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

        // Email Validation
        const validEmail = FormValidation.refinement(
            FormValidation.String, (email) => {
                return onboardingUtils.isEmailValid(email);
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
                        error:                'Please enter a valid email',
                        autoCapitalize:       'none',
                        blurOnSubmit:         false,
                        clearButtonMode:      'while-editing',
                        error:                'Your email must be a valid email format',
                        keyboardType:         'email-address',
                        label:                ' ',
                        placeholder:          'email',
                        placeholderTextColor: AppColors.primary.yellow.hundredPercent,
                        returnKeyType:        'next',
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

                this.props.onFormSubmit({
                    email: credentials.Email,
                }).then(() => {
                    this.setState({
                        resultMsg: { success: 'Awesome, recovery instructions have been sent to your email!' },
                    }, () => {
                        setTimeout(() => {
                            //Actions.root({ type: 'reset' });
                            this._routeToResetPassword(credentials.email);
                        }, 1000);
                    });
                    //this._routeToResetPassword({emailAddress: credentials.email})
                }).catch((err) => {
                    const error = AppAPI.handleError(err);
                    this.setState({ resultMsg: { error } });
                });
            });
        }
    }

    _routeToResetPassword = (email) => {
        
        Actions.resetPassword({emailAddress: email});
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
                        {'Reset Your Password'}
                    </Text>

                    <View style={[AppStyles.containerCentered]}>
                        <View style={{width: AppSizes.screen.widthFourFifths}}>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, { fontSize: AppFonts.scaleFont(15) }]}>
                            Enter your email to receive instructions on how to reset your password.
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
                        <Spacer size={10} />
                        {<TouchableOpacity onPress={this.state.resultMsg.status && this.state.resultMsg.status.length > 0 ? null : this._routeToResetPassword}>
                            <View>
                                <Text 
                                    p 
                                    onPress={this._routeToResetPassword}
                                    style={[AppStyles.textCenterAligned, {color: AppColors.primary.grey.fiftyPercent, textDecorationLine: 'none',}]}>{'or enter your verification code'}
                                </Text>
                            </View>
                        </TouchableOpacity>}
                        </View>
                    </View>
            </View>
            <TouchableOpacity onPress={this.forgotPassword} style={[AppStyles.nextButtonWrapper, {margin: 0}]}>
                    <Text robotoBold style={[AppStyles.nextButtonText, { fontSize: AppFonts.scaleFont(16) }]}>Reset</Text>
                </TouchableOpacity>
        </View>
        );
    }
}

/* Export Component ==================================================================== */
export default ForgotPassword;
