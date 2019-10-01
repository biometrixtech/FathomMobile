/**
 * ChangePasswordModal
 *
     <ChangePasswordModal
         currentPassword={this.state.form_values.currentPassword}
         handleFormChange={this._handleFormChange}
         handleFormSubmit={() => this._handleChangePasswordFormSubmit()}
         handleToggleModal={() => this._toggleChangePasswordModal()}
         isFormSuccessful={this.state.isChangePasswordSuccessful}
         isFormSubmitting={this.state.isChangePasswordFormSubmitting}
         isOpen={this.state.isChangePasswordModalOpen}
         newPassword={this.state.form_values.newPassword}
         newPasswordConfirm={this.state.form_values.newPasswordConfirm}
         resultMsg={this.state.resultMsg}
     />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Alerts, Button, FathomModal, FormInput, ProgressCircle, Spacer, TabIcon, Text, } from '../../custom';

/* Component ==================================================================== */
const ModalData = ({
    currentPassword,
    handleFormChange,
    handleFormSubmit,
    handleToggleModal,
    isConfirmNewPasswordSecure,
    isCurrentPasswordSecure,
    isNewPasswordSecure,
    isSuccessful,
    isSubmitting,
    newPassword,
    newPasswordConfirm,
    resultMsg,
    toggleShowPassword,
}) => isSubmitting ? (
    <View style={[AppStyles.containerCentered]}>
        <ProgressCircle
            borderWidth={5}
            color={AppColors.zeplin.yellow}
            formatText={'Verifying'}
            indeterminate={true}
            showsText={true}
            size={AppSizes.screen.widthTwoThirds}
            textStyle={{...AppStyles.robotoMedium, color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(40),}}
        />
        <Spacer size={50} />
    </View>
)
    : isSuccessful ? (
        <View style={[AppStyles.containerCentered]}>
            <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(40),}]}>{'Success!'}</Text>
            <Spacer size={40} />
            <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(14),}]}>{'Return to App'}</Text>
            <Spacer size={10} />
            <TabIcon
                icon={'arrow-right-circle'}
                iconStyle={[{color: AppColors.zeplin.yellow,}]}
                onPress={handleToggleModal}
                reverse={false}
                size={45}
                type={'simple-line-icon'}
            />
            <Spacer size={50} />
        </View>
    )
        :
        (
            <View style={[AppStyles.containerCentered]}>
                <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(20),}]}>{'Change Password'}</Text>
                <Spacer size={3} />
                <Spacer size={resultMsg.error.length > 0 ? 20 : 0} />
                <Alerts
                    error={resultMsg.error}
                    status={resultMsg.status}
                    success={resultMsg.success}
                />
                <Spacer size={resultMsg.error.length > 0 ? 20 : 0} />
                <FormInput
                    autoCapitalize={'none'}
                    autoCompleteType={'password'}
                    blurOnSubmit={true}
                    containerStyle={{paddingTop: 25, width: AppSizes.screen.widthTwoThirds,}}
                    inputStyle={{color: AppColors.zeplin.slate,}}
                    keyboardType={'default'}
                    onChangeText={text => handleFormChange('currentPassword', text)}
                    onSubmitEditing={() => handleFormSubmit()}
                    placeholder={'current password'}
                    placeholderTextColor={AppColors.zeplin.slate}
                    returnKeyType={'next'}
                    rightIcon={
                        <View style={{flexDirection: 'row',}}>
                            <TabIcon
                                color={AppColors.zeplin.slateLight}
                                containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                                icon={isCurrentPasswordSecure ? 'visibility-off' : 'visibility'}
                                onPress={() => toggleShowPassword('current-password')}
                                size={24}
                            />
                        </View>
                    }
                    secureTextEntry={isCurrentPasswordSecure}
                    value={currentPassword}
                />
                <Spacer size={5} />
                <FormInput
                    autoCapitalize={'none'}
                    blurOnSubmit={true}
                    containerStyle={{paddingTop: 25, width: AppSizes.screen.widthTwoThirds,}}
                    inputStyle={{color: AppColors.zeplin.slate,}}
                    keyboardType={'default'}
                    onChangeText={text => handleFormChange('newPassword', text)}
                    onSubmitEditing={() => handleFormSubmit()}
                    placeholder={'new password'}
                    placeholderTextColor={AppColors.zeplin.slate}
                    returnKeyType={'next'}
                    rightIcon={
                        <View style={{flexDirection: 'row',}}>
                            <TabIcon
                                color={AppColors.zeplin.slateLight}
                                containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                                icon={isNewPasswordSecure ? 'visibility-off' : 'visibility'}
                                onPress={() => toggleShowPassword('new-password')}
                                size={24}
                            />
                        </View>
                    }
                    secureTextEntry={isNewPasswordSecure}
                    value={newPassword}
                />
                <Spacer size={3} />
                <View style={{paddingLeft: (AppSizes.padding + AppSizes.paddingXSml), width: AppSizes.screen.widthTwoThirds,}}>
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>{'8 + characters, 1 number'}</Text>
                </View>
                <FormInput
                    autoCapitalize={'none'}
                    blurOnSubmit={true}
                    containerStyle={{paddingTop: 25, width: AppSizes.screen.widthTwoThirds,}}
                    inputStyle={{color: AppColors.zeplin.slate,}}
                    keyboardType={'default'}
                    onChangeText={text => handleFormChange('newPasswordConfirm', text)}
                    onSubmitEditing={() => handleFormSubmit()}
                    placeholder={'confirm new password'}
                    placeholderTextColor={AppColors.zeplin.slate}
                    returnKeyType={'done'}
                    rightIcon={
                        <View style={{flexDirection: 'row',}}>
                            <TabIcon
                                color={AppColors.zeplin.slateLight}
                                containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                                icon={isConfirmNewPasswordSecure ? 'visibility-off' : 'visibility'}
                                onPress={() => toggleShowPassword('confirm-password')}
                                size={24}
                            />
                        </View>
                    }
                    secureTextEntry={isConfirmNewPasswordSecure}
                    value={newPasswordConfirm}
                />
                <Spacer size={40} />
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, justifyContent: 'center', paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml,}}
                    containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                    onPress={() => handleFormSubmit()}
                    title={'Submit'}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), textAlign: 'center', width: '100%',}}
                />
                <Spacer size={50} />
            </View>
        );

class ChangePasswordModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmNewPasswordSecure: true,
            isCurrentPasswordSecure:    true,
            isNewPasswordSecure:        true,
        };
    }

    _toggleShowPassword = whatField => {
        if(whatField && whatField === 'confirm-password') {
            this.setState({ isConfirmNewPasswordSecure: !this.state.isConfirmNewPasswordSecure, });
        } else if(whatField && whatField === 'new-password') {
            this.setState({ isNewPasswordSecure: !this.state.isNewPasswordSecure, });
        } else if(whatField && whatField === 'current-password') {
            this.setState({ isCurrentPasswordSecure: !this.state.isCurrentPasswordSecure, });
        }
    }

    render = () => {
        const {
            currentPassword,
            handleFormChange,
            handleFormSubmit,
            handleToggleModal,
            isFormSuccessful,
            isFormSubmitting,
            isOpen,
            newPassword,
            newPasswordConfirm,
            resultMsg,
        } = this.props;
        const {
            isConfirmNewPasswordSecure,
            isCurrentPasswordSecure,
            isNewPasswordSecure,
        } = this.state;
        return (
            <FathomModal
                isVisible={isOpen}
                style={[AppStyles.containerCentered, {backgroundColor: AppColors.transparent,}]}
            >
                <View style={[AppStyles.containerCentered, AppStyles.paddingVerticalSml, AppStyles.modalShadowEffect, {backgroundColor: AppColors.white, borderRadius: 12, width: (AppSizes.screen.width * 0.9),}]}>
                    <TabIcon
                        containerStyle={[{alignSelf: 'flex-end', paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.padding, paddingTop: (AppSizes.paddingSml),}]}
                        icon={'close'}
                        iconStyle={[{color: AppColors.black, opacity: 0.5,}]}
                        onPress={isFormSubmitting ? null : handleToggleModal}
                        reverse={false}
                        size={30}
                        type={'material-community'}
                    />
                    <ModalData
                        currentPassword={currentPassword}
                        handleFormChange={handleFormChange}
                        handleFormSubmit={handleFormSubmit}
                        handleToggleModal={handleToggleModal}
                        isConfirmNewPasswordSecure={isConfirmNewPasswordSecure}
                        isCurrentPasswordSecure={isCurrentPasswordSecure}
                        isNewPasswordSecure={isNewPasswordSecure}
                        isSuccessful={isFormSuccessful}
                        isSubmitting={isFormSubmitting}
                        newPassword={newPassword}
                        newPasswordConfirm={newPasswordConfirm}
                        resultMsg={resultMsg}
                        toggleShowPassword={this._toggleShowPassword}
                    />
                </View>
            </FathomModal>
        );
    }
}

ChangePasswordModal.propTypes = {
    currentPassword:    PropTypes.string.isRequired,
    handleFormChange:   PropTypes.func.isRequired,
    handleFormSubmit:   PropTypes.func.isRequired,
    handleToggleModal:  PropTypes.func.isRequired,
    isFormSuccessful:   PropTypes.bool.isRequired,
    isFormSubmitting:   PropTypes.bool.isRequired,
    isOpen:             PropTypes.bool.isRequired,
    newPassword:        PropTypes.string.isRequired,
    newPasswordConfirm: PropTypes.string.isRequired,
    resultMsg:          PropTypes.object.isRequired,
};

ChangePasswordModal.defaultProps = {};

ChangePasswordModal.componentName = 'ChangePasswordModal';

/* Export Component ================================================================== */
export default ChangePasswordModal;
