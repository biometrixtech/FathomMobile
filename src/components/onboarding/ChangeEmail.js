/**
 * Change Email Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, StyleSheet, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppStyles, AppSizes, } from '../../constants';

// Components
import { Alerts, Button, FormInput, Spacer, Text, } from '../custom/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        alignItems:      'center',
        backgroundColor: AppColors.white,
        flex:            1,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
});

/* Component ==================================================================== */
class ChangeEmail extends Component {
    static componentName = 'ChangeEmail';

    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            resultMsg: {
                error: '',
            },
            form_values: {
                current_email: '',
                new_email:     '',
            },
            isFormSuccessful: false,
        };
        this.inputs = {};
        this.focusNextField = this.focusNextField.bind(this);
    }

    focusNextField(id) {
        this.inputs[id].focus();
    }

    _handleFormChange = (name, value) => {
        let newFormFields = _.update( this.state.form_values, name, () => value);
        this.setState({
            ['form_values']: newFormFields,
        });
    }

    _handleFormSubmit = () => {
        // close keyboard
        Keyboard.dismiss();
        // TODO: VERIFY FORM THEN SUBMIT
        console.log(this.state.form_values);
        this.setState({ isFormSuccessful: true, });
    }

    render = () => {
        if(!this.state.isFormSuccessful) {
            return(
                <View style={[styles.background,]}>
                    <View style={{backgroundColor: AppColors.zeplin.shadow, height: 2, width: AppSizes.screen.width,}} />
                    <View style={{flex: 9,}}>
                        <Spacer size={25} />
                        <Text
                            robotoBold
                            style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(20),}]}
                        >
                            {'Set New Email'}
                        </Text>
                        { this.state.resultMsg.error.length > 0 ?
                            <Spacer size={10} />
                            :
                            null
                        }
                        <Alerts
                            error={this.state.resultMsg.error}
                        />
                        <Spacer size={25} />
                        <Text
                            robotoRegular
                            style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}]}
                        >
                            {'Your email will be used for login and account management.'}
                        </Text>
                        <Spacer size={25} />
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={true}
                            clearButtonMode={'while-editing'}
                            inputStyle={[{textAlign: 'center', width: AppSizes.screen.widthThreeQuarters,}]}
                            keyboardType={'email-address'}
                            onChangeText={(text) => this._handleFormChange('current_email', text)}
                            onSubmitEditing={() => this.focusNextField('new_email')}
                            placeholder={'current email'}
                            placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                            returnKeyType={'next'}
                            textInputRef={input => {this.inputs.current_email = input;}}
                            value={this.state.form_values.email}
                        />
                        <Spacer size={25} />
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={true}
                            clearButtonMode={'while-editing'}
                            inputStyle={[{textAlign: 'center', width: AppSizes.screen.widthThreeQuarters,}]}
                            keyboardType={'email-address'}
                            onChangeText={(text) => this._handleFormChange('new_email', text)}
                            onSubmitEditing={() => this._handleFormSubmit()}
                            placeholder={'new email'}
                            placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                            returnKeyType={'done'}
                            textInputRef={input => {this.inputs.new_email = input;}}
                            value={this.state.form_values.email}
                        />
                    </View>
                    <View style={{flex: 1,}}>
                        <Button
                            backgroundColor={AppColors.primary.yellow.hundredPercent}
                            buttonStyle={{borderRadius: 0, height: '100%', width: AppSizes.screen.width}}
                            color={AppColors.white}
                            fontFamily={AppStyles.robotoBold.fontFamily}
                            fontWeight={AppStyles.robotoBold.fontWeight}
                            onPress={() => this._handleFormSubmit()}
                            raised={false}
                            textStyle={{ fontSize: AppFonts.scaleFont(16), }}
                            title={'Confirm & Send Verification'}
                        />
                    </View>
                </View>
            )
        }
        return(
            <View style={[styles.background,]}>
                <View style={{backgroundColor: AppColors.zeplin.shadow, height: 2, width: AppSizes.screen.width,}} />
                <View style={{width: AppSizes.screen.widthTwoThirds,}}>
                    <Spacer size={25} />
                    <Text
                        robotoBold
                        style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(20),}]}
                    >
                        {'Confirmation Email has been sent to email@email.com'}
                    </Text>
                    <Spacer size={25} />
                    <Text
                        robotoRegular
                        style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}]}
                    >
                        {'Check you inbox and spam folders for an email from Fathom. This may take a few minutes.'}
                    </Text>
                </View>
            </View>
        )
    }
}

/* Export Component ==================================================================== */
export default ChangeEmail;
