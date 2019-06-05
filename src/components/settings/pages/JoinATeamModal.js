/**
 * JoinATeamModal
 *
     <JoinATeamModal
        code={this.state.form_values.code}
        handleFormChange={this._handleFormChange()}
        handleFormSubmit={this._handleFormSubmit()}
        handleToggleModal={() => this._toggleJoinATeamModal()}
        isFormSubmitting={this.state.isFormSubmitting}
        isFormSuccessful={this.state.teamName && this.state.teamName.length > 0}
        isOpen={this.state.isJoinATeamModalOpen}
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
    code,
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
                <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(20),}]}>{'ENTER INVITE CODE'}</Text>
                <Spacer size={10} />
                <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(16),}]}>{'to join Fathom as a part of\na team'}</Text>
                <Spacer size={resultMsg.error.length > 0 ? 20 : 0} />
                <Alerts
                    status={resultMsg.status}
                    success={resultMsg.success}
                    error={resultMsg.error}
                />
                <Spacer size={resultMsg.error.length > 0 ? 20 : 40} />
                <FormInput
                    autoCapitalize={'none'}
                    blurOnSubmit={true}
                    clearButtonMode={'while-editing'}
                    containerStyle={{paddingTop: 25, width: AppSizes.screen.widthTwoThirds,}}
                    inputStyle={{color: AppColors.zeplin.yellow, textAlign: 'center',}}
                    keyboardType={'default'}
                    onChangeText={text => handleFormChange('code', text)}
                    onSubmitEditing={() => this.handleFormSubmit()}
                    placeholder={'code'}
                    placeholderTextColor={AppColors.zeplin.yellow}
                    returnKeyType={'done'}
                    value={code}
                />
                <Spacer size={10} />
                <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(12), opacity: 0.5,}]}>{'case sensitive'}</Text>
                <Spacer size={30} />
                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, justifyContent: 'center', paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml,}}
                    containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                    onPress={() => handleFormSubmit()}
                    title={'Join'}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), textAlign: 'center', width: '100%',}}
                />
                <Spacer size={50} />
            </View>
        );

const JoinATeamModal = ({
    code,
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
                code={code}
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

JoinATeamModal.propTypes = {
    code:              PropTypes.string.isRequired,
    handleFormChange:  PropTypes.func.isRequired,
    handleFormSubmit:  PropTypes.func.isRequired,
    handleToggleModal: PropTypes.func.isRequired,
    isFormSubmitting:  PropTypes.bool.isRequired,
    isFormSuccessful:  PropTypes.bool.isRequired,
    isOpen:            PropTypes.bool.isRequired,
    resultMsg:         PropTypes.object.isRequired,
};

JoinATeamModal.defaultProps = {};

JoinATeamModal.componentName = 'JoinATeamModal';

/* Export Component ================================================================== */
export default JoinATeamModal;