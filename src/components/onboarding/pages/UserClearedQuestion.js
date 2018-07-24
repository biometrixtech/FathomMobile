/**
 * UserClearedQuestion
 *
   <UserClearedQuestion
      componentStep={7}
      currentStep={step}
      handleFormChange={this._handleUserFormChange}
      isFormValid={isFormValid}
      isPPOpen={isPPOpen}
      isTOUOpen={isTOUOpen}
      nextStep={this._nextStep}
      notClearedBtnPressed={this._notClearedBtnPressed}
      togglePPWebView={this._togglePPWebView}
      toggleTOUWebView={this._toggleTOUWebView}
      user={form_fields.user}
   />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles } from '../../../constants';
import { TabIcon, Text } from '../../custom';

// import third-party libraries
import { CheckBox } from 'react-native-elements';
import moment from 'moment';

/* Component ==================================================================== */
const UserClearedQuestion = ({
    componentStep,
    currentStep,
    handleFormChange,
    isFormValid,
    isPPOpen,
    isTOUOpen,
    nextStep,
    notClearedBtnPressed,
    togglePPWebView,
    toggleTOUWebView,
    user,
}) => (
    <View style={[componentStep === currentStep ? {flex: 1} : {display: 'none'}]}>
        <View style={[AppStyles.paddingHorizontalSml]}>
            <Text style={[AppSizes.h2, AppStyles.textCenterAligned, AppStyles.textBold]}>{'You need to be cleared to run by a doctor to start training'}</Text>
            <Text style={[AppSizes.h2, AppStyles.textCenterAligned]}>{'Do you confirm that you are eligable to start training?'}</Text>
        </View>
        <View style={{position: 'absolute', left: 0, right: 0, bottom: 0,}}>
            <View style={[AppStyles.containerCentered, {flexDirection: 'row'}]}>
                <View style={{width: '90%', marginRight: 5}}>
                    <CheckBox
                        title={'I accept the Terms of Use'}
                        checked={user.agreed_terms_of_use ? true : false}
                        onPress={() => handleFormChange('agreed_terms_of_use', user.agreed_terms_of_use ? null : moment().format())}
                    />
                </View>
                <View style={{width: '10%',}}>
                    <TabIcon
                        icon={'link'}
                        onPress={toggleTOUWebView}
                    />
                </View>
            </View>
            <View style={[AppStyles.containerCentered, {flexDirection: 'row', paddingBottom: 20}]}>
                <View style={{width: '90%', marginRight: 5}}>
                    <CheckBox
                        title={'I accept the Privacy Policy'}
                        checked={user.agreed_privacy_policy ? true : false}
                        onPress={() => handleFormChange('agreed_privacy_policy', user.agreed_privacy_policy ? null : moment().format())}
                    />
                </View>
                <View style={{width: '10%',}}>
                    <TabIcon
                        icon={'link'}
                        onPress={togglePPWebView}
                    />
                </View>
            </View>
            { isFormValid ?
                <View>
                    <TouchableOpacity onPress={() => {nextStep(); handleFormChange('cleared_to_play', moment().format());}} style={[AppStyles.nextButtonWrapper]}>
                        <Text style={[AppStyles.nextButtonText]}>{'Yes, I confirm'}</Text>
                    </TouchableOpacity>
                    { user.injury_status === 'healthy' ?
                        null
                        :
                        <TouchableOpacity onPress={() => {notClearedBtnPressed(); handleFormChange('cleared_to_play', moment().format());}} style={[AppStyles.nextButtonWrapper, {backgroundColor: AppColors.primary.grey.thirtyPercent}]}>
                            <Text style={[AppStyles.nextButtonText, {color: AppColors.black}]}>{'No, I haven\'t been seen by a doctor'}</Text>
                        </TouchableOpacity>
                    }
                </View>
                :
                null
            }
        </View>
    </View>
);

UserClearedQuestion.propTypes = {
    componentStep:        PropTypes.number.isRequired,
    currentStep:          PropTypes.number.isRequired,
    handleFormChange:     PropTypes.func.isRequired,
    isFormValid:          PropTypes.bool.isRequired,
    isPPOpen:             PropTypes.bool.isRequired,
    isTOUOpen:            PropTypes.bool.isRequired,
    nextStep:             PropTypes.func.isRequired,
    notClearedBtnPressed: PropTypes.func.isRequired,
    togglePPWebView:      PropTypes.func.isRequired,
    toggleTOUWebView:     PropTypes.func.isRequired,
    user:                 PropTypes.object.isRequired,
};
UserClearedQuestion.defaultProps = {};
UserClearedQuestion.componentName = 'UserClearedQuestion';

/* Export Component ==================================================================== */
export default UserClearedQuestion;
