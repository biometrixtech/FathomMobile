/**
 * UserAccountInfo
 *
    <UserAccountInfo
        clearCoachContent={this._clearCoachContent}
        handleFormChange={handleFormChange}
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
import { Image, Platform, StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles } from '../../../constants';
import { FormInput, FormLabel, Spacer, TabIcon, Text } from '../../custom';
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
            clearCoachContent,
            handleFormChange,
            isPasswordSecure,
            isUpdatingUser,
            setAccordionSection,
            toggleShowPassword,
            updateErrorMessage,
            user,
        } = this.props;
        return(
            <View>
                <View style={[{borderTopWidth: 1, borderTopColor: AppColors.border, flexDirection: 'row',}]}>
                    <View style={[styles.leftItem]}>
                        <FormLabel labelStyle={{color: AppColors.black}}>{user.personal_data.first_name.length > 0 ? 'FIRST NAME' : ' '}</FormLabel>
                        <FormInput
                            blurOnSubmit={ false }
                            containerStyle={{marginLeft: 0, marginRight: 0, paddingLeft: 10}}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('personal_data.first_name', text))}
                            onSubmitEditing={() => {
                                this.focusNextField('last_name');
                            }}
                            placeholder={'First Name'}
                            placeholderTextColor={AppColors.zeplin.lightGrey}
                            returnKeyType={'next'}
                            textInputRef={input => {
                                this.inputs.first_name = input;
                            }}
                            value={user.personal_data.first_name}
                        />
                    </View>
                    <View style={[styles.rightItem]}>
                        <FormLabel labelStyle={{color: AppColors.black}}>{user.personal_data.last_name.length > 0 ? 'LAST NAME' : ' '}</FormLabel>
                        <FormInput
                            blurOnSubmit={ false }
                            containerStyle={{marginLeft: 0, paddingLeft: 10}}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('personal_data.last_name', text))}
                            onSubmitEditing={() =>
                                isUpdatingUser ?
                                    setAccordionSection(0, 1)
                                    :
                                    this.focusNextField('email')
                            }
                            placeholder={'Last Name'}
                            placeholderTextColor={AppColors.zeplin.lightGrey}
                            returnKeyType={'next'}
                            textInputRef={input => {
                                this.inputs.last_name = input;
                            }}
                            value={user.personal_data.last_name}
                        />
                    </View>
                </View>
                {!isUpdatingUser ?
                    <View>
                        <FormLabel labelStyle={{color: AppColors.black}}>{user.personal_data.email.length > 0 ? 'E-MAIL ADDRESS' : ' '}</FormLabel>
                        <FormInput
                            autoCapitalize={'none'}
                            blurOnSubmit={ false }
                            containerStyle={{marginLeft: 0, paddingLeft: 10}}
                            editable={!isUpdatingUser}
                            onChangeText={(text) => clearCoachContent('', () => handleFormChange('personal_data.email', text))}
                            onSubmitEditing={() => {
                                this.focusNextField('password');
                            }}
                            keyboardType={'email-address'}
                            placeholder={'E-mail Address'}
                            placeholderTextColor={AppColors.zeplin.lightGrey}
                            returnKeyType={'next'}
                            textInputRef={input => {
                                this.inputs.email = input;
                            }}
                            value={user.personal_data.email}
                        />
                    </View>
                    :
                    null
                }
                {!isUpdatingUser ?
                    <View>
                        <FormLabel labelStyle={{color: AppColors.black}}>{user.password.length > 0 ? 'PASSWORD' : ' '}</FormLabel>
                        <View style={[{flexDirection: 'row',}]}>
                            <FormInput
                                blurOnSubmit={ true }
                                containerStyle={{marginLeft: 0, paddingLeft: 10}}
                                onChangeText={(text) => clearCoachContent('', () => handleFormChange('password', text))}
                                onSubmitEditing={() => {
                                    if(onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).isValid) {
                                        setAccordionSection(0, 1);
                                    } else {
                                        updateErrorMessage();
                                    }
                                }}
                                placeholder={'Password'}
                                placeholderTextColor={AppColors.zeplin.lightGrey}
                                returnKeyType={'done'}
                                secureTextEntry={isPasswordSecure}
                                textInputRef={input => {
                                    this.inputs.password = input;
                                }}
                                value={user.password}
                            />
                            <TabIcon
                                color={AppColors.zeplin.lightGrey}
                                containerStyle={[{height: '100%', position: 'absolute', right: Platform.OS === 'ios' ? 10 : 20, top: 0,}]}
                                icon={isPasswordSecure ? 'visibility' : 'visibility-off'}
                                onPress={toggleShowPassword}
                                size={24}
                            />
                        </View>
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
    handleFormChange:    PropTypes.func.isRequired,
    isPasswordSecure:    PropTypes.bool.isRequired,
    isUpdatingUser:      PropTypes.bool.isRequired,
    setAccordionSection: PropTypes.func.isRequired,
    toggleShowPassword:  PropTypes.func.isRequired,
    updateErrorMessage:  PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};
UserAccountInfo.defaultProps = {};
UserAccountInfo.componentName = 'UserAccountInfo';

/* Export Component ==================================================================== */
export default UserAccountInfo;