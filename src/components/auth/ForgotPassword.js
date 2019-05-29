/**
 * Forgot Password Screen
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

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
const Wrapper = props => Platform.OS === 'ios' ?
    (
        <KeyboardAvoidingView behavior={'padding'} style={{backgroundColor: AppColors.white, flex: 1, justifyContent: 'space-between',}}>
            {props.children}
        </KeyboardAvoidingView>
    ) :
    (
        <View style={{backgroundColor: AppColors.white, flex: 1, justifyContent: 'space-between',}}>
            {props.children}
        </View>
    );

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
            isSubmitting: false,
            resultMsg:    {
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
                    this.setState({ isSubmitting: false, });
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
        this.setState(
            { isSubmitting: true, },
            () => {
                // validation
                let errorsArray = this._validateForm();
                if (errorsArray.length === 0) {
                    this.forgotPassword();
                } else {
                    let newErrorFields = _.update( this.state.resultMsg, 'error', () => errorsArray);
                    this.setState({ isSubmitting: false, resultMsg: newErrorFields });
                }
            }
        );
    }

    _routeToResetPassword = (from_button) => {
        Actions.resetPassword({ from_button, });
    }

    render = () => {
        /*eslint no-return-assign: 0*/
        return (
            <Wrapper>
                <View>
                    <ProgressBar
                        currentStep={1}
                        totalSteps={3}
                    />
                    <Alerts
                        error={this.state.resultMsg.error}
                    />
                    <Spacer size={20} />
                    <Text robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(20),}]}>
                        {'Reset Your Password'}
                    </Text>
                    <Spacer size={20} />
                    <View style={[AppStyles.containerCentered]}>
                        <View style={{width: AppSizes.screen.widthFourFifths,}}>
                            <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(15),}]}>
                                {'Enter your email to receive a 6-digit PIN to create a new password.'}
                            </Text>
                        </View>
                    </View>
                    <Spacer size={20} />
                    <View style={[AppStyles.containerCentered]}>
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={ true }
                            clearButtonMode={'while-editing'}
                            containerStyle={{width: AppSizes.screen.widthTwoThirds,}}
                            inputRef={ref => this.inputs.email = ref}
                            inputStyle={[{color: AppColors.zeplin.yellow, paddingTop: 25, textAlign: 'center',}]}
                            keyboardType={'email-address'}
                            onChangeText={(text) => this._handleFormChange('email', text)}
                            placeholder={'email'}
                            placeholderTextColor={AppColors.zeplin.yellow}
                            returnKeyType={'done'}
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
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: 0, paddingVertical: 20,}}
                    disabled={this.state.isSubmitting}
                    onPress={() => this._handleFormSubmit()}
                    title={'Reset'}
                    titleStyle={{ color: AppColors.white, fontSize: AppFonts.scaleFont(16), }}
                />
            </Wrapper>
        );
    }
}

/* Export Component ==================================================================== */
export default ForgotPassword;
