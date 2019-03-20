/**
 * UserAccountInfo
 *
    <UserAccountInfo
        clearCoachContent={this._clearCoachContent}
        handleFormChange={handleFormChange}
        isConfirmPasswordSecure={this.state.isConfirmPasswordSecure}
        isPasswordSecure={this.state.isPasswordSecure}
        isUpdatingUser={isUpdatingUser}
        setAccordionSection={this._setAccordionSection}
        toggleShowPassword={this._toggleShowPassword}
        updateErrorMessage={this._updateErrorMessage}
        user={user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { FathomInput, Spacer, TabIcon, Text, } from '../../custom';
import { onboardingUtils, } from '../../../constants/utils';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    inputLabel: {
        ...AppFonts.robotoRegular,
        color:       AppColors.zeplin.lightSlate,
        fontSize:    AppFonts.scaleFont(11),
        paddingLeft: AppSizes.paddingSml,
        paddingTop:  AppSizes.paddingSml,
    },
    leftItem: {
        flex: 1,
    },
    rightItem: {
        borderLeftWidth: 1,
        borderLeftColor: AppColors.zeplin.light,
        flex:            1,
    },
});

/* Component ==================================================================== */
class UserAccountInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmPasswordEditedOnce: false,
            isPasswordEditedOnce:        false,
            showPasswordErrorText:       false,
        };
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
    }

    focusNextField = id => {
        this.inputs[id].focus();
    }

    render = () => {
        const {
            clearCoachContent,
            handleFormChange,
            isConfirmPasswordSecure,
            isPasswordSecure,
            isUpdatingUser,
            setAccordionSection,
            toggleShowPassword,
            updateErrorMessage,
            user,
        } = this.props;
        const { isConfirmPasswordEditedOnce, isPasswordEditedOnce, showPasswordErrorText, } = this.state;
        return(
            <View>
                <View style={{borderTopColor: AppColors.zeplin.light, borderTopWidth: 1, flexDirection: 'row',}}>
                    <View style={[styles.leftItem]}>
                        <FathomInput
                            blurOnSubmit={false}
                            containerStyle={{marginHorizontal: 0,}}
                            inputContainerStyle={{marginHorizontal: 0, paddingLeft: AppSizes.paddingSml,}}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('personal_data.first_name', text))}
                            onSubmitEditing={() => this.focusNextField('last_name')}
                            label={user.personal_data.first_name.length > 0 ? 'First name' : ' '}
                            labelStyle={[styles.inputLabel]}
                            placeholder={'First name'}
                            placeholderTextColor={AppColors.zeplin.lightSlate}
                            ref={input => {this.inputs.first_name = input;}}
                            returnKeyType={'next'}
                            value={user.personal_data.first_name}
                        />
                    </View>
                    <View style={[styles.rightItem]}>
                        <FathomInput
                            blurOnSubmit={false}
                            containerStyle={{marginHorizontal: 0,}}
                            inputContainerStyle={{marginLeft: 0, paddingLeft: AppSizes.paddingSml,}}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('personal_data.last_name', text))}
                            onSubmitEditing={() => isUpdatingUser ? setAccordionSection(0, 1) : this.focusNextField('email')}
                            label={user.personal_data.last_name.length > 0 ? 'Last name' : ' '}
                            labelStyle={[styles.inputLabel]}
                            placeholder={'Last name'}
                            placeholderTextColor={AppColors.zeplin.lightSlate}
                            ref={input => {this.inputs.last_name = input;}}
                            returnKeyType={'next'}
                            value={user.personal_data.last_name}
                        />
                    </View>
                </View>
                {!isUpdatingUser ?
                    <View>
                        <FathomInput
                            autoCapitalize={'none'}
                            blurOnSubmit={false}
                            inputContainerStyle={{marginLeft: 0, paddingLeft: AppSizes.paddingSml,}}
                            editable={!isUpdatingUser}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('personal_data.email', text))}
                            onSubmitEditing={() => this.focusNextField('password')}
                            keyboardType={'email-address'}
                            label={user.personal_data.email.length > 0 ? 'E-mail address' : ' '}
                            labelStyle={[styles.inputLabel]}
                            placeholder={'E-mail address'}
                            placeholderTextColor={AppColors.zeplin.lightSlate}
                            ref={input => {this.inputs.email = input;}}
                            returnKeyType={'next'}
                            value={user.personal_data.email}
                        />
                        <FathomInput
                            blurOnSubmit={true}
                            errorMessage={showPasswordErrorText ? '8+ characters, 1 number' : ''}
                            errorStyle={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(13), paddingLeft: AppSizes.paddingXSml,}}
                            inputContainerStyle={{marginLeft: 0, paddingLeft: AppSizes.paddingSml,}}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('password', text))}
                            onEndEditing={() => this.setState({ showPasswordErrorText: false, isPasswordEditedOnce: true, })}
                            onFocus={() => this.setState({ showPasswordErrorText: true, })}
                            onSubmitEditing={() => this.focusNextField('confirm_password')}
                            label={user.password.length > 0 ? 'Password' : ' '}
                            labelStyle={[styles.inputLabel]}
                            placeholder={'Password'}
                            placeholderTextColor={AppColors.zeplin.lightSlate}
                            ref={input => {this.inputs.password = input;}}
                            returnKeyType={'next'}
                            rightIcon={
                                <View style={{flexDirection: 'row',}}>
                                    <TabIcon
                                        color={AppColors.zeplin.lightSlate}
                                        containerStyle={[{paddingRight: AppSizes.paddingMed,}]}
                                        icon={isPasswordSecure ? 'visibility' : 'visibility-off'}
                                        onPress={() => toggleShowPassword()}
                                        size={24}
                                    />
                                    <TabIcon
                                        color={
                                            isPasswordEditedOnce ?
                                                onboardingUtils.isPasswordValid(user.password).isValid ?
                                                    AppColors.zeplin.success
                                                    :
                                                    AppColors.zeplin.coachesDashError
                                                :
                                                AppColors.white
                                        }
                                        icon={onboardingUtils.isPasswordValid(user.password).isValid ? 'check' : 'close'}
                                        size={24}
                                    />
                                </View>
                            }
                            secureTextEntry={isPasswordSecure}
                            value={user.password}
                        />
                        <FathomInput
                            blurOnSubmit={true}
                            inputContainerStyle={{marginLeft: 0, paddingLeft: AppSizes.paddingSml,}}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('confirm_password', text))}
                            onEndEditing={() => this.setState({ isConfirmPasswordEditedOnce: true, })}
                            onSubmitEditing={() => onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).isValid ? setAccordionSection(0, 1) : updateErrorMessage()}
                            label={user.confirm_password.length > 0 ? 'Confirm password' : ' '}
                            labelStyle={[styles.inputLabel]}
                            placeholder={'Confirm password'}
                            placeholderTextColor={AppColors.zeplin.lightSlate}
                            ref={input => {this.inputs.confirm_password = input;}}
                            returnKeyType={'done'}
                            rightIcon={
                                <View style={{flexDirection: 'row',}}>
                                    <TabIcon
                                        color={AppColors.zeplin.lightSlate}
                                        containerStyle={[{paddingRight: AppSizes.paddingMed,}]}
                                        icon={isConfirmPasswordSecure ? 'visibility' : 'visibility-off'}
                                        onPress={() => toggleShowPassword(true)}
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
                                                    AppColors.zeplin.coachesDashError
                                                :
                                                AppColors.white
                                        }
                                        icon={onboardingUtils.isPasswordValid(user.password).isValid && onboardingUtils.isPasswordValid(user.confirm_password).isValid && user.password === user.confirm_password ? 'check' : 'close'}
                                        size={24}
                                    />
                                </View>
                            }
                            secureTextEntry={isConfirmPasswordSecure}
                            value={user.confirm_password}
                        />
                    </View>
                    :
                    null
                }
                <Spacer size={40} />
                <Text
                    oswaldRegular
                    onPress={() => onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).isValid ? setAccordionSection(0, 1) : updateErrorMessage()}
                    style={[AppStyles.continueButton,
                        {
                            fontSize:      AppFonts.scaleFont(16),
                            paddingBottom: AppSizes.padding,
                        },
                    ]}
                >{'CONTINUE...'}</Text>
            </View>
        )
    }
}

UserAccountInfo.propTypes = {
    handleFormChange:        PropTypes.func.isRequired,
    isConfirmPasswordSecure: PropTypes.bool.isRequired,
    isPasswordSecure:        PropTypes.bool.isRequired,
    isUpdatingUser:          PropTypes.bool.isRequired,
    setAccordionSection:     PropTypes.func.isRequired,
    toggleShowPassword:      PropTypes.func.isRequired,
    updateErrorMessage:      PropTypes.func.isRequired,
    user:                    PropTypes.object.isRequired,
};
UserAccountInfo.defaultProps = {};
UserAccountInfo.componentName = 'UserAccountInfo';

/* Export Component ==================================================================== */
export default UserAccountInfo;