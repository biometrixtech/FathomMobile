/**
 * UserAccountInfo
 *
    <UserAccountInfo
        handleClick={this._handleUserFormChange}
        isPasswordSecure={this.state.isPasswordSecure}
        setAccordionSection={this._setAccordionSection}
        toggleShowPassword={this._toggleShowPassword}
        user={form_fields.user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles } from '../../../constants';
import { FormInput, FormLabel, TabIcon, Text } from '../../custom';
import { onboardingUtils } from '../../../constants/utils';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        width: AppSizes.screen.width,
    },
    leftItem: {
        width: '50%',
    },
    rightItem: {
        borderLeftWidth: 1,
        borderLeftColor: AppColors.border,
        width:           '50%',
    },
});

const Wrapper = props => Platform.OS === 'ios' ?
    (
        <KeyboardAvoidingView behavior={'padding'} style={[styles.background]}>
            {props.children}
        </KeyboardAvoidingView>
    ) :
    (
        <View style={[styles.background]}>
            {props.children}
        </View>
    );

/* Component ==================================================================== */
class UserAccountInfo extends Component {
    constructor(props) {
        super(props);
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
    }

    focusNextField(id) {
        this.inputs[id].focus();
    }

    render = () => {
        const {
            handleFormChange,
            isPasswordSecure,
            setAccordionSection,
            toggleShowPassword,
            user,
        } = this.props;
        return(
            <Wrapper>
                <View style={[{borderTopWidth: 1, borderTopColor: AppColors.border, flexDirection: 'row',}]}>
                    <View style={[styles.leftItem]}>
                        <FormLabel labelStyle={{color: AppColors.black}}>{user.personal_data.first_name.length > 0 ? 'First Name' : ' '}</FormLabel>
                        <FormInput
                            blurOnSubmit={ false }
                            containerStyle={{marginLeft: 0, marginRight: 0, paddingLeft: 10}}
                            onChangeText={(text) => handleFormChange('personal_data.first_name', text)}
                            onSubmitEditing={() => {
                                this.focusNextField('last_name');
                            }}
                            placeholder={'First Name'}
                            placeholderTextColor={AppColors.border}
                            returnKeyType={'next'}
                            textInputRef={input => {
                                this.inputs.first_name = input;
                            }}
                            value={user.personal_data.first_name}
                        />
                    </View>
                    <View style={[styles.rightItem]}>
                        <FormLabel labelStyle={{color: AppColors.black}}>{user.personal_data.last_name.length > 0 ? 'Last Name' : ' '}</FormLabel>
                        <FormInput
                            blurOnSubmit={ false }
                            containerStyle={{marginLeft: 0, paddingLeft: 10}}
                            onChangeText={(text) => handleFormChange('personal_data.last_name', text)}
                            onSubmitEditing={() => {
                                this.focusNextField('email');
                            }}
                            placeholder={'Last Name'}
                            placeholderTextColor={AppColors.border}
                            returnKeyType={'next'}
                            textInputRef={input => {
                                this.inputs.last_name = input;
                            }}
                            value={user.personal_data.last_name}
                        />
                    </View>
                </View>
                <FormLabel labelStyle={{color: AppColors.black}}>{user.email.length > 0 ? 'E-mail Address' : ' '}</FormLabel>
                <FormInput
                    autoCapitalize={'none'}
                    blurOnSubmit={ false }
                    containerStyle={{marginLeft: 0, paddingLeft: 10}}
                    onChangeText={(text) => handleFormChange('email', text)}
                    onSubmitEditing={() => {
                        this.focusNextField('phone_number');
                    }}
                    keyboardType={'email-address'}
                    placeholder={'E-mail Address'}
                    placeholderTextColor={AppColors.border}
                    returnKeyType={'next'}
                    textInputRef={input => {
                        this.inputs.email = input;
                    }}
                    value={user.email}
                />
                <FormLabel labelStyle={{color: AppColors.black}}>{user.personal_data.phone_number.length > 0 ? 'Phone Number (optional)' : ' '}</FormLabel>
                <FormInput
                    blurOnSubmit={ false }
                    containerStyle={{marginLeft: 0, paddingLeft: 10}}
                    keyboardType={'numeric'}
                    maxLength={10}
                    onChangeText={(text) => handleFormChange('personal_data.phone_number', text)}
                    onSubmitEditing={() => {
                        this.focusNextField('password');
                    }}
                    placeholder={'Phone Number (optional)'}
                    placeholderTextColor={AppColors.border}
                    returnKeyType={'next'}
                    textInputRef={input => {
                        this.inputs.phone_number = input;
                    }}
                    value={user.personal_data.phone_number}
                />
                <FormLabel labelStyle={{color: AppColors.black}}>{user.password.length > 0 ? 'Password' : ' '}</FormLabel>
                <View>
                    <FormInput
                        blurOnSubmit={ true }
                        containerStyle={{marginLeft: 0, paddingLeft: 10}}
                        onChangeText={(text) => handleFormChange('password', text)}
                        onSubmitEditing={() => {
                            setAccordionSection(0, 1);
                        }}
                        placeholder={'Password'}
                        placeholderTextColor={AppColors.border}
                        returnKeyType={'done'}
                        secureTextEntry={isPasswordSecure}
                        textInputRef={input => {
                            this.inputs.password = input;
                        }}
                        value={user.password}
                    />
                    <TabIcon
                        color={AppColors.border}
                        containerStyle={[{position: 'absolute', top: 15, right: 25, width: '10%'}]}
                        icon={isPasswordSecure ? 'visibility' : 'visibility-off'}
                        onPress={toggleShowPassword}
                        size={24}
                    />
                </View>
                <Text
                    onPress={() => onboardingUtils.isUserAccountInformationValid(user).isValid ? setAccordionSection(0, 1) : null}
                    style={[AppStyles.paddingVertical, AppStyles.continueButton,
                        onboardingUtils.isUserAccountInformationValid(user).isValid ?
                            {}
                            :
                            {color: AppColors.border}
                    ]}
                >{'CONTINUE'}</Text>
            </Wrapper>
        )
    }
}

UserAccountInfo.propTypes = {
    handleFormChange:    PropTypes.func.isRequired,
    isPasswordSecure:    PropTypes.bool.isRequired,
    setAccordionSection: PropTypes.func.isRequired,
    toggleShowPassword:  PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};
UserAccountInfo.defaultProps = {};
UserAccountInfo.componentName = 'UserAccountInfo';

/* Export Component ==================================================================== */
export default UserAccountInfo;