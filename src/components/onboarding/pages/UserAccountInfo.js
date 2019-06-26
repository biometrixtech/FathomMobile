/**
 * UserAccountInfo
 *
    <UserAccountInfo
        handleFormChange={handleFormChange}
        isUpdatingUser={isUpdatingUser}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, StyleSheet, View, findNodeHandle, } from 'react-native';

// import third-party libraries
import { KeyboardAwareScrollView, } from 'react-native-keyboard-aware-scroll-view';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { FormInput, TabIcon, Text, } from '../../custom';
import { onboardingUtils, } from '../../../constants/utils';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    inputLabel: {
        ...AppFonts.robotoRegular,
        color:       AppColors.white,
        fontSize:    AppFonts.scaleFont(12),
        paddingLeft: AppSizes.paddingSml,
        paddingTop:  AppSizes.paddingSml,
    },
});

/* Component ==================================================================== */
class UserAccountInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmPasswordEditedOnce: false,
            isConfirmPasswordSecure:     true,
            isPasswordSecure:            true,
            isPasswordEditedOnce:        false,
            showPasswordErrorText:       false,
        };
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
        this.scrollViewRef = {};
    }

    focusNextField = id => {
        this.inputs[id].focus();
    }

    _scrollToInput = reactNode => {
        this.scrollViewRef.props.scrollToFocusedInput(reactNode, (75 + AppSizes.paddingLrg));
    }

    _toggleShowPassword = isConfirmPassword => {
        if(isConfirmPassword) {
            this.setState({ isConfirmPasswordSecure: !this.state.isConfirmPasswordSecure, });
        } else {
            this.setState({ isPasswordSecure: !this.state.isPasswordSecure, });
        }
    };

    render = () => {
        const {
            handleFormChange,
            isUpdatingUser,
            user,
        } = this.props;
        const {
            isConfirmPasswordEditedOnce,
            isConfirmPasswordSecure,
            isPasswordEditedOnce,
            isPasswordSecure,
            showPasswordErrorText,
        } = this.state;
        /*eslint no-return-assign: 0*/
        return(
            <KeyboardAwareScrollView
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center',}}
                innerRef={ref => {this.scrollViewRef = ref;}}
            >
                <FormInput
                    autoCapitalize={'none'}
                    autoCompleteType={'name'}
                    blurOnSubmit={false}
                    containerStyle={[AppStyles.onboardingInputContainer,]}
                    inputRef={ref => this.inputs.first_name = ref}
                    inputStyle={[AppStyles.onboardingInputStyle, user.personal_data.first_name.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {}]}
                    label={user.personal_data.first_name.length > 0 ? 'First name' : null}
                    labelStyle={[styles.inputLabel,]}
                    onChangeText={text => handleFormChange('personal_data.first_name', text)}
                    onFocus={event => this._scrollToInput(findNodeHandle(event.target))}
                    onSubmitEditing={() => this.focusNextField('last_name')}
                    placeholder={'First name'}
                    placeholderTextColor={AppColors.white}
                    returnKeyType={'next'}
                    value={user.personal_data.first_name}
                />
                <FormInput
                    autoCapitalize={'none'}
                    autoCompleteType={'name'}
                    blurOnSubmit={false}
                    containerStyle={[AppStyles.onboardingInputContainer,]}
                    inputRef={ref => this.inputs.last_name = ref}
                    inputStyle={[AppStyles.onboardingInputStyle, user.personal_data.last_name.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {}]}
                    label={user.personal_data.last_name.length > 0 ? 'Last name' : null}
                    labelStyle={[styles.inputLabel,]}
                    onChangeText={text => handleFormChange('personal_data.last_name', text)}
                    onFocus={event => this._scrollToInput(findNodeHandle(event.target))}
                    onSubmitEditing={() => !isUpdatingUser ? this.focusNextField('email') : Keyboard.dismiss()}
                    placeholder={'Last name'}
                    placeholderTextColor={AppColors.white}
                    returnKeyType={'next'}
                    value={user.personal_data.last_name}
                />
                {!isUpdatingUser ?
                    <View>
                        <FormInput
                            autoCapitalize={'none'}
                            autoCompleteType={'username'}
                            blurOnSubmit={false}
                            containerStyle={[AppStyles.onboardingInputContainer,]}
                            editable={!isUpdatingUser}
                            inputRef={ref => this.inputs.email = ref}
                            inputStyle={[AppStyles.onboardingInputStyle, user.personal_data.email.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {}]}
                            keyboardType={'email-address'}
                            label={user.personal_data.email.length > 0 ? 'E-mail address' : null}
                            labelStyle={[styles.inputLabel,]}
                            onChangeText={text => handleFormChange('personal_data.email', text)}
                            onFocus={event => this._scrollToInput(findNodeHandle(event.target))}
                            onSubmitEditing={() => this.focusNextField('password')}
                            placeholder={'E-mail'}
                            placeholderTextColor={AppColors.white}
                            returnKeyType={'next'}
                            value={user.personal_data.email}
                        />
                        <FormInput
                            autoCapitalize={'none'}
                            autoCompleteType={'password'}
                            blurOnSubmit={true}
                            containerStyle={[AppStyles.onboardingInputContainer,]}
                            errorMessage={showPasswordErrorText ? '8+ characters, 1 number' : ''}
                            errorStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(12), paddingBottom: AppSizes.paddingXSml, paddingLeft: AppSizes.paddingXSml,}}
                            inputRef={ref => this.inputs.password = ref}
                            inputStyle={[AppStyles.onboardingInputStyle, user.password.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {}]}
                            label={user.password.length > 0 ? 'Password' : null}
                            labelStyle={[styles.inputLabel,]}
                            onChangeText={text => handleFormChange('password', text)}
                            onEndEditing={() => this.setState({ showPasswordErrorText: false, isPasswordEditedOnce: true, })}
                            onFocus={event => {
                                this.setState({ showPasswordErrorText: true, });
                                this._scrollToInput(findNodeHandle(event.target));
                            }}
                            onSubmitEditing={() => this.focusNextField('confirm_password')}
                            placeholder={'Password'}
                            placeholderTextColor={AppColors.white}
                            returnKeyType={'next'}
                            rightIcon={
                                <View style={{flexDirection: 'row',}}>
                                    <TabIcon
                                        color={AppColors.white}
                                        containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                                        icon={isPasswordSecure ? 'visibility-off' : 'visibility'}
                                        onPress={() => this._toggleShowPassword()}
                                        size={24}
                                    />
                                    <TabIcon
                                        color={
                                            isPasswordEditedOnce ?
                                                onboardingUtils.isPasswordValid(user.password).isValid ?
                                                    AppColors.zeplin.success
                                                    :
                                                    AppColors.zeplin.error
                                                :
                                                AppColors.white
                                        }
                                        icon={onboardingUtils.isPasswordValid(user.password).isValid ? 'check' : 'close'}
                                        size={24}
                                    />
                                </View>
                            }
                            rightIconContainerStyle={{justifyContent: user.password.length > 0 ? 'flex-start' : 'center',}}
                            secureTextEntry={isPasswordSecure}
                            value={user.password}
                        />
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={true}
                            containerStyle={[AppStyles.onboardingInputContainer,]}
                            inputRef={ref => this.inputs.confirm_password = ref}
                            inputStyle={[AppStyles.onboardingInputStyle, user.confirm_password.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {}]}
                            label={user.confirm_password.length > 0 ? 'Confirm Password' : null}
                            labelStyle={[styles.inputLabel,]}
                            onChangeText={text => handleFormChange('confirm_password', text)}
                            onEndEditing={() => this.setState({ isConfirmPasswordEditedOnce: true, })}
                            onFocus={event => this._scrollToInput(findNodeHandle(event.target))}
                            placeholder={'Confirm Password'}
                            placeholderTextColor={AppColors.white}
                            returnKeyType={'done'}
                            rightIcon={
                                <View style={{flexDirection: 'row',}}>
                                    <TabIcon
                                        color={AppColors.white}
                                        containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                                        icon={isConfirmPasswordSecure ? 'visibility-off' : 'visibility'}
                                        onPress={() => this._toggleShowPassword(true)}
                                        size={24}
                                    />
                                    <TabIcon
                                        color={
                                            isConfirmPasswordEditedOnce ?
                                                onboardingUtils.isPasswordValid(user.password).isValid &&
                                                onboardingUtils.isPasswordValid(user.confirm_password).isValid &&
                                                user.password === user.confirm_password ?
                                                    AppColors.zeplin.success
                                                    :
                                                    AppColors.zeplin.error
                                                :
                                                AppColors.white
                                        }
                                        icon={onboardingUtils.isPasswordValid(user.password).isValid && onboardingUtils.isPasswordValid(user.confirm_password).isValid && user.password === user.confirm_password ? 'check' : 'close'}
                                        size={24}
                                    />
                                </View>
                            }
                            rightIconContainerStyle={{justifyContent: user.confirm_password.length > 0 ? 'flex-start' : 'center',}}
                            secureTextEntry={isConfirmPasswordSecure}
                            value={user.confirm_password}
                        />
                    </View>
                    :
                    null
                }
            </KeyboardAwareScrollView>
        )
    }
}

UserAccountInfo.propTypes = {
    handleFormChange: PropTypes.func.isRequired,
    isUpdatingUser:   PropTypes.bool.isRequired,
    user:             PropTypes.object.isRequired,
};
UserAccountInfo.defaultProps = {};
UserAccountInfo.componentName = 'UserAccountInfo';

/* Export Component ==================================================================== */
export default UserAccountInfo;