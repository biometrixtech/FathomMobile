/**
 * JoinATeamModal
 *
     <JoinATeamModal
        code={this.state.form_values.code}
        handleFormChange={this._handleFormChange()}
        handleFormSubmit={this._handleFormSubmit()}
        handleToggleModal={() => this._toggleJoinATeamModal()}
        isFormSubmitting={this.state.isFormSubmitting}
        isOpen={this.state.isJoinATeamModalOpen}
        resultMsg={this.state.resultMsg}
        teamName={this.state.teamName}
     />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

// import third-party libraries
import Modal from 'react-native-modalbox';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Alerts, Button, FormInput, ProgressCircle, Spacer, TabIcon, Text, } from '../../custom';

/* Component ==================================================================== */
const JoinATeamModal = ({
    code,
    handleFormChange,
    handleFormSubmit,
    handleToggleModal,
    isFormSubmitting,
    isOpen,
    resultMsg,
    teamName,
}) => (
    <Modal
        backdropColor={AppColors.black}
        backdropOpacity={0.8}
        backdropPressToClose={false}
        coverScreen={true}
        isOpen={isOpen}
        position={'center'}
        style={[AppStyles.containerCentered, { backgroundColor: AppColors.transparent, }]}
        swipeToClose={false}
    >
        <View>
            <View style={[AppStyles.containerCentered, AppStyles.paddingVerticalSml, {backgroundColor: AppColors.white, width: (AppSizes.screen.width * 0.9),}]}>
                <TabIcon
                    containerStyle={[{alignSelf: 'flex-end', paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.padding, paddingTop: (AppSizes.paddingSml),}]}
                    icon={'close'}
                    iconStyle={[{color: AppColors.black, opacity: 0.5,}]}
                    onPress={isFormSubmitting ? null : handleToggleModal}
                    reverse={false}
                    size={30}
                    type={'material-community'}
                />
                { isFormSubmitting ?
                    <View style={[AppStyles.containerCentered]}>
                        <ProgressCircle
                            borderWidth={5}
                            color={AppColors.primary.yellow.hundredPercent}
                            formatText={'Verifying'}
                            indeterminate={true}
                            showsText={true}
                            size={AppSizes.screen.widthTwoThirds}
                            textStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(40),}}
                        />
                        <Spacer size={50} />
                    </View>
                    : teamName.length > 0 ?
                        <View style={[AppStyles.containerCentered]}>
                            <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(40),}]}>{'Success!'}</Text>
                            <Spacer size={40} />
                            <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14),}]}>{'Return to App'}</Text>
                            <Spacer size={10} />
                            <TabIcon
                                icon={'arrow-right-circle'}
                                iconStyle={[{color: AppColors.primary.yellow.hundredPercent,}]}
                                onPress={isFormSubmitting ? null : handleToggleModal}
                                reverse={false}
                                size={45}
                                type={'simple-line-icon'}
                            />
                            <Spacer size={50} />
                        </View>
                        :
                        <View style={[AppStyles.containerCentered]}>
                            <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(20),}]}>{'ENTER INVITE CODE'}</Text>
                            <Spacer size={10} />
                            <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(16),}]}>{'to join Fathom as a part of\na team'}</Text>
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
                                inputStyle = {[{color: AppColors.primary.yellow.hundredPercent, textAlign: 'center', width: AppSizes.screen.widthTwoThirds,paddingTop: 25}]}
                                keyboardType={'default'}
                                onChangeText={(text) => handleFormChange('code', text)}
                                placeholder={'code'}
                                placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                                returnKeyType={'done'}
                                value={code}
                            />
                            <Spacer size={10} />
                            <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(12), opacity: 0.5,}]}>{'case sensitive'}</Text>
                            <Spacer size={30} />
                            <Button
                                backgroundColor={AppColors.primary.yellow.hundredPercent}
                                buttonStyle={[AppStyles.paddingVerticalSml, AppStyles.paddingHorizontal, {borderRadius: 0, justifyContent: 'center', width: '85%',}]}
                                containerViewStyle={{ alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf, }}
                                fontFamily={AppStyles.robotoBold.fontFamily}
                                fontWeight={AppStyles.robotoBold.fontWeight}
                                onPress={() => handleFormSubmit()}
                                raised={false}
                                textColor={AppColors.white}
                                textStyle={{ fontSize: AppFonts.scaleFont(18), textAlign: 'center', width: '100%', }}
                                title={'Join'}
                            />
                            <Spacer size={50} />
                        </View>
                }
            </View>
        </View>
    </Modal>
);

JoinATeamModal.propTypes = {
    code:              PropTypes.string.isRequired,
    handleFormChange:  PropTypes.func.isRequired,
    handleFormSubmit:  PropTypes.func.isRequired,
    handleToggleModal: PropTypes.func.isRequired,
    isFormSubmitting:  PropTypes.bool.isRequired,
    isOpen:            PropTypes.bool.isRequired,
    resultMsg:         PropTypes.object.isRequired,
    teamName:          PropTypes.string.isRequired,
};

JoinATeamModal.defaultProps = {};

JoinATeamModal.componentName = 'JoinATeamModal';

/* Export Component ================================================================== */
export default JoinATeamModal;