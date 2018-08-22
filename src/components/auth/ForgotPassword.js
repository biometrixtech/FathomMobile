/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:33:09 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:23:02
 */

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
import { AppAPI } from '../../lib';
import { AppColors, AppFonts, AppSizes, AppStyles } from '../../constants';
import _ from 'lodash';
// Components
import { Alerts, Card, Text, Button } from '../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        // width: AppSizes.screen.width,
    },
    headerWrapper: {
        alignItems:    'center',
        flexDirection: 'row',
    },
    iconContainer: {
        backgroundColor: AppColors.transparent,
        height:          AppFonts.scaleFont(18),
        marginLeft:      0,
    },
    iconStyle: {
        fontSize: 20,
    },
    title: {
        ...AppStyles.oswaldBold,
        fontSize: AppFonts.scaleFont(18),
    },
    wrapper: {
        paddingHorizontal: 10,
        paddingVertical:   10,
    },
});
let inputStyle = _.cloneDeep(FormValidation.form.Form.stylesheet);
inputStyle.textbox.error.borderColor = AppColors.secondary.red.fiftyPercent;
inputStyle.textbox.error.borderLeftWidth = 0;
inputStyle.textbox.error.borderRightWidth = 0;
inputStyle.textbox.error.borderTopWidth = 0;
inputStyle.textbox.error.color = AppColors.secondary.red.fiftyPercent;
inputStyle.textbox.error.textAlign = 'center';
inputStyle.textbox.error.fontFamily = AppStyles.robotoBold.fontFamily;
inputStyle.textbox.error.fontWeight = AppStyles.robotoBold.fontWeight;
inputStyle.textbox.error.fontSize = AppFonts.scaleFont(15);
inputStyle.textbox.normal.borderColor = AppColors.primary.grey.fiftyPercent;
inputStyle.textbox.normal.borderLeftWidth = 0;
inputStyle.textbox.normal.borderRightWidth = 0;
inputStyle.textbox.normal.borderTopWidth = 0;
inputStyle.textbox.normal.color = AppColors.primary.yellow.hundredPercent;
inputStyle.textbox.normal.textAlign = 'center';
inputStyle.textbox.normal.fontFamily = AppStyles.robotoBold.fontFamily;
inputStyle.textbox.normal.fontWeight = AppStyles.robotoBold.fontWeight;
inputStyle.textbox.normal.fontSize = AppFonts.scaleFont(15);
inputStyle.textboxView.error.color = AppColors.white;
inputStyle.textboxView.normal.color = AppColors.white;
inputStyle.errorBlock.color = AppColors.secondary.red.fiftyPercent;
inputStyle.errorBlock.textAlign = 'center';

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
                        blurOnSubmit:         false,
                        clearButtonMode: 'while-editing',
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
            {/*<View style={[styles.wrapper]}>*/}
                
            {/*<View
                automaticallyAdjustContentInsets={false}
                ref={a => { this.scrollView = a; }}
                style={[AppStyles.container]}
                contentContainerStyle={[AppStyles.container, { alignItems: 'center' }]}
            >*/}
                {/*<Card>*/}
                    <Alerts
                        status={this.state.resultMsg.status}
                        success={this.state.resultMsg.success}
                        error={this.state.resultMsg.error}
                    />
                   <Text robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.black}]}>
                        {'Reset Your Password'}
                    </Text>
                    <View style={[AppStyles.containerCentered]}>
                        <View style={{width: AppSizes.screen.widthFourFifths}}>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml]}>
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
                        </View>
                    </View>


                   
                {/*</Card>*/}

            {/*</View>*/}
            </View>
            <TouchableOpacity onPress={this.forgotPassword} style={[AppStyles.nextButtonWrapper, {margin: 10}]}>
                    <Text robotoBold style={[AppStyles.nextButtonText, { fontSize: AppFonts.scaleFont(16) }]}>Reset</Text>
                </TouchableOpacity>
                        {/*<Button
                            backgroundColor={AppColors.primary.yellow.hundredPercent}
                            
                            buttonStyle={{borderRadius: 0}}
                            color={AppColors.white}
                            fontFamily={AppStyles.robotoBold.fontFamily}
                            fontWeight={AppStyles.robotoBold.fontWeight}
                            rounded={false}
                            outlined={false}
                            raised={false}
                            textStyle={{ fontSize: AppFonts.scaleFont(16) }}
                            title={'Reset'}
                            
                        />*/}
            
        </View>
        );
    }
}

/* Export Component ==================================================================== */
export default ForgotPassword;
