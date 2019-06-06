/**
 * UserAccountInfo
 *
    <UserAccountInfo
        clearCoachContent={this._clearCoachContent}
        handleFormChange={handleFormChange}
        isConfirmPasswordSecure={this.state.isConfirmPasswordSecure}
        isPasswordSecure={this.state.isPasswordSecure}
        isUpdatingUser={isUpdatingUser}
        scrollToInput={this._scrollToInput}
        setAccordionSection={this._setAccordionSection}
        toggleShowPassword={this._toggleShowPassword}
        updateErrorMessage={this._updateErrorMessage}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, findNodeHandle, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { FormInput, Spacer, TabIcon, Text, } from '../../custom';
import { onboardingUtils, } from '../../../constants/utils';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    inputLabel: {
        ...AppFonts.robotoRegular,
        color:       AppColors.zeplin.slate,
        fontSize:    AppFonts.scaleFont(11),
        paddingLeft: AppSizes.paddingSml,
        paddingTop:  AppSizes.paddingSml,
    },
    leftItem: {
        flex: 1,
    },
    rightItem: {
        borderLeftWidth: 1,
        borderLeftColor: AppColors.zeplin.slateXLight,
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
            scrollToInput,
            setAccordionSection,
            toggleShowPassword,
            updateErrorMessage,
            user,
        } = this.props;
        const { isConfirmPasswordEditedOnce, isPasswordEditedOnce, showPasswordErrorText, } = this.state;
        /*eslint no-return-assign: 0*/
        return(
            <View>
                <View style={{borderTopColor: AppColors.zeplin.slateXLight, borderTopWidth: 1, flexDirection: 'row',}}>
                    <View style={[styles.leftItem,]}>
                        <FormInput
                            blurOnSubmit={false}
                            containerStyle={{marginLeft: 0, paddingLeft: AppSizes.paddingSml,}}
                            inputRef={ref => this.inputs.first_name = ref}
                            inputStyle={{color: AppColors.zeplin.slate,}}
                            label={user.personal_data.first_name.length > 0 ? 'First name' : ' '}
                            labelStyle={[styles.inputLabel]}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('personal_data.first_name', text))}
                            onFocus={event => scrollToInput(findNodeHandle(event.target))}
                            onSubmitEditing={() => this.focusNextField('last_name')}
                            placeholder={'First name'}
                            placeholderTextColor={AppColors.zeplin.slateXLight}
                            returnKeyType={'next'}
                            value={user.personal_data.first_name}
                        />
                    </View>
                    <View style={[styles.rightItem,]}>
                        <FormInput
                            blurOnSubmit={false}
                            containerStyle={{marginLeft: 0, paddingLeft: AppSizes.paddingSml,}}
                            inputRef={ref => this.inputs.last_name = ref}
                            inputStyle={{color: AppColors.zeplin.slate,}}
                            label={user.personal_data.last_name.length > 0 ? 'Last name' : ' '}
                            labelStyle={[styles.inputLabel]}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('personal_data.last_name', text))}
                            onFocus={event => scrollToInput(findNodeHandle(event.target))}
                            onSubmitEditing={() => isUpdatingUser ? setAccordionSection(0, 1) : this.focusNextField('email')}
                            placeholder={'Last name'}
                            placeholderTextColor={AppColors.zeplin.slateXLight}
                            returnKeyType={'next'}
                            value={user.personal_data.last_name}
                        />
                    </View>
                </View>
                {!isUpdatingUser ?
                    <View>
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={false}
                            containerStyle={{marginLeft: 0, paddingLeft: AppSizes.paddingSml,}}
                            editable={!isUpdatingUser}
                            inputRef={ref => this.inputs.email = ref}
                            inputStyle={{color: AppColors.zeplin.slate,}}
                            keyboardType={'email-address'}
                            label={user.personal_data.email.length > 0 ? 'E-mail address' : ' '}
                            labelStyle={[styles.inputLabel]}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('personal_data.email', text))}
                            onFocus={event => scrollToInput(findNodeHandle(event.target))}
                            onSubmitEditing={() => this.focusNextField('password')}
                            placeholder={'E-mail address'}
                            placeholderTextColor={AppColors.zeplin.slateXLight}
                            returnKeyType={'next'}
                            value={user.personal_data.email}
                        />
                        <FormInput
                            blurOnSubmit={true}
                            containerStyle={{marginLeft: 0, paddingLeft: AppSizes.paddingSml,}}
                            errorMessage={showPasswordErrorText ? '8+ characters, 1 number' : ''}
                            errorStyle={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), paddingLeft: AppSizes.paddingXSml,}}
                            inputRef={ref => this.inputs.password = ref}
                            inputStyle={{color: AppColors.zeplin.slate,}}
                            label={user.password.length > 0 ? 'Password' : ' '}
                            labelStyle={[styles.inputLabel]}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('password', text))}
                            onEndEditing={() => this.setState({ showPasswordErrorText: false, isPasswordEditedOnce: true, })}
                            onFocus={event => {
                                this.setState({ showPasswordErrorText: true, });
                                scrollToInput(findNodeHandle(event.target));
                            }}
                            onSubmitEditing={() => this.focusNextField('confirm_password')}
                            placeholder={'Password'}
                            placeholderTextColor={AppColors.zeplin.slateXLight}
                            returnKeyType={'next'}
                            rightIcon={
                                <View style={{flexDirection: 'row',}}>
                                    <TabIcon
                                        color={AppColors.zeplin.slateLight}
                                        containerStyle={[{paddingRight: AppSizes.paddingMed,}]}
                                        icon={isPasswordSecure ? 'visibility-off' : 'visibility'}
                                        onPress={() => toggleShowPassword()}
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
                            secureTextEntry={isPasswordSecure}
                            value={user.password}
                        />
                        <FormInput
                            blurOnSubmit={true}
                            containerStyle={{marginLeft: 0, paddingLeft: AppSizes.paddingSml,}}
                            inputRef={ref => this.inputs.confirm_password = ref}
                            inputStyle={{color: AppColors.zeplin.slate,}}
                            label={user.confirm_password.length > 0 ? 'Confirm password' : ' '}
                            labelStyle={[styles.inputLabel]}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('confirm_password', text))}
                            onEndEditing={() => this.setState({ isConfirmPasswordEditedOnce: true, })}
                            onFocus={event => scrollToInput(findNodeHandle(event.target))}
                            onSubmitEditing={() => onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).isValid ? setAccordionSection(0, 1) : updateErrorMessage()}
                            placeholder={'Confirm password'}
                            placeholderTextColor={AppColors.zeplin.slateXLight}
                            returnKeyType={'done'}
                            rightIcon={
                                <View style={{flexDirection: 'row',}}>
                                    <TabIcon
                                        color={AppColors.zeplin.slateLight}
                                        containerStyle={[{paddingRight: AppSizes.paddingMed,}]}
                                        icon={isConfirmPasswordSecure ? 'visibility-off' : 'visibility'}
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
                                                    AppColors.zeplin.error
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
    scrollToInput:           PropTypes.func.isRequired,
    setAccordionSection:     PropTypes.func.isRequired,
    toggleShowPassword:      PropTypes.func.isRequired,
    updateErrorMessage:      PropTypes.func.isRequired,
    user:                    PropTypes.object.isRequired,
};
UserAccountInfo.defaultProps = {};
UserAccountInfo.componentName = 'UserAccountInfo';

/* Export Component ==================================================================== */
export default UserAccountInfo;