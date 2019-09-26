/**
 * ChangePasswordModal
 *
     <ChangePasswordModal
         code={this.state.form_values.code}
         handleFormChange={this._handleFormChange}
         handleFormSubmit={() => this._handleChangePasswordFormSubmit()}
         handleToggleModal={() => this._toggleChangePasswordModal()}
         isFormSubmitting={this.state.isChangePasswordFormSubmitting}
         isFormSuccessful={this.state.isChangePasswordSuccessful}
         isOpen={this.state.isChangePasswordModalOpen}
         resultMsg={this.state.resultMsg}
     />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Alerts, Button, FathomModal, FormInput, ProgressCircle, Spacer, TabIcon, Text, } from '../../custom';

/* Component ==================================================================== */
const ModalData = ({
    oldPassword,
    newPassword,
    newPasswordConfirm,
    handleFormChange,
    handleFormSubmit,
    handleToggleModal,
    isSubmitting,
    isSuccessful,
    resultMsg,
}) =>  isSubmitting ? (
    <View style={[AppStyles.containerCentered]}>
        <ProgressCircle
            borderWidth={5}
            color={AppColors.zeplin.yellow}
            formatText={'Verifying'}
            indeterminate={true}
            showsText={true}
            size={AppSizes.screen.widthTwoThirds}
            textStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(40),}}
        />
        <Spacer size={50} />
    </View>
)
    : isSuccessful ? (
        <View style={[AppStyles.containerCentered]}>
            <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(40),}]}>{'Success!'}</Text>
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
                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(20),}]}>{'Change Password'}</Text>
                <Spacer size={3} />
                <Spacer size={resultMsg.error.length > 0 ? 20 : 0} />
                <Alerts
                    status={resultMsg.status}
                    success={resultMsg.success}
                    error={resultMsg.error}
                />
                <Spacer size={resultMsg.error.length > 0 ? 20 : 0} />
                <FormInput
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    blurOnSubmit={true}
                    clearButtonMode={'while-editing'}
                    containerStyle={{paddingTop: 25, width: AppSizes.screen.widthTwoThirds,}}
                    inputStyle={{color: AppColors.zeplin.yellow, textAlign: 'center',}}
                    keyboardType={'default'}
                    onChangeText={text => handleFormChange('oldPassword', text)}
                    onSubmitEditing={() => handleFormSubmit()}
                    placeholder={'old password'}
                    placeholderTextColor={AppColors.zeplin.yellow}
                    returnKeyType={'next'}
                    value={oldPassword}
                />
                <Spacer size={5} />
                <FormInput
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    blurOnSubmit={true}
                    clearButtonMode={'while-editing'}
                    containerStyle={{paddingTop: 25, width: AppSizes.screen.widthTwoThirds,}}
                    inputStyle={{color: AppColors.zeplin.yellow, textAlign: 'center',}}
                    keyboardType={'default'}
                    onChangeText={text => handleFormChange('newPassword', text)}
                    onSubmitEditing={() => handleFormSubmit()}
                    placeholder={'new password'}
                    placeholderTextColor={AppColors.zeplin.yellow}
                    returnKeyType={'next'}
                    value={newPassword}
                />
                <Spacer size={3} />
                <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(12), opacity: 0.5,}]}>{'8 + characters, 1 number'}</Text>
                <FormInput
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    blurOnSubmit={true}
                    clearButtonMode={'while-editing'}
                    containerStyle={{paddingTop: 25, width: AppSizes.screen.widthTwoThirds,}}
                    inputStyle={{color: AppColors.zeplin.yellow, textAlign: 'center',}}
                    keyboardType={'default'}
                    onChangeText={text => handleFormChange('newPasswordConfirm', text)}
                    onSubmitEditing={() => handleFormSubmit()}
                    placeholder={'confirm new password'}
                    placeholderTextColor={AppColors.zeplin.yellow}
                    returnKeyType={'done'}
                    value={newPasswordConfirm}
                />
              <Spacer size={40} />
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, justifyContent: 'center', paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml,}}
                    containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                    onPress={() => handleFormSubmit()}
                    title={'Finish'}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), textAlign: 'center', width: '100%',}}
                />
                <Spacer size={50} />
            </View>
        );

const ChangePasswordModal = ({
    oldPassword,
    newPassword,
    newPasswordConfirm,
    handleFormChange,
    handleFormSubmit,
    handleToggleModal,
    isFormSubmitting,
    isFormSuccessful,
    isOpen,
    resultMsg,
}) => (
    <FathomModal
        isVisible={isOpen}
        style={[AppStyles.containerCentered, {backgroundColor: AppColors.transparent,}]}
    >
        <View style={[AppStyles.containerCentered, AppStyles.paddingVerticalSml, AppStyles.modalShadowEffect, {backgroundColor: AppColors.white, width: (AppSizes.screen.width * 0.9),}]}>
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
                oldPassword={oldPassword}
                newPassword={newPassword}
                newPasswordConfirm={newPasswordConfirm}
                handleFormChange={handleFormChange}
                handleFormSubmit={handleFormSubmit}
                handleToggleModal={handleToggleModal}
                isSubmitting={isFormSubmitting}
                isSuccessful={isFormSuccessful}
                resultMsg={resultMsg}
            />
        </View>
    </FathomModal>
);

ChangePasswordModal.propTypes = {
    oldPassword:          PropTypes.string.isRequired,
    newPassword:          PropTypes.string.isRequired,
    newPasswordConfirm:   PropTypes.string.isRequired,
    handleFormChange:     PropTypes.func.isRequired,
    handleFormSubmit:     PropTypes.func.isRequired,
    handleToggleModal:    PropTypes.func.isRequired,
    isFormSubmitting:     PropTypes.bool.isRequired,
    isFormSuccessful:     PropTypes.bool.isRequired,
    isOpen:               PropTypes.bool.isRequired,
    resultMsg:            PropTypes.object.isRequired,
};

ChangePasswordModal.defaultProps = {};

ChangePasswordModal.componentName = 'ChangePasswordModal';

/* Export Component ================================================================== */
export default ChangePasswordModal;
