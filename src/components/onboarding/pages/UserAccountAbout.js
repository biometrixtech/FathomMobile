/**
 * UserAccountAbout
 *
    <UserAccountAbout
        handleFormChange={handleFormChange}
        surveyValues={survey_values}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, findNodeHandle, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, UserAccount as UserAccountConstants, } from '../../../constants';
import { FormInput, FathomPicker, Text, } from '../../custom';

// import third-party libraries
import { KeyboardAwareScrollView, } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-datepicker';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    androidViewContainer: {
        height:         40,
        justifyContent: 'center',
    },
    inputLabel: {
        ...AppFonts.robotoRegular,
        color:       AppColors.white,
        fontSize:    AppFonts.scaleFont(12),
        paddingLeft: AppSizes.paddingSml,
        paddingTop:  AppSizes.paddingSml,
    },
    pickerSelectAndroid: {
        color: AppColors.white,
    },
    pickerSelectIOS: {
        ...AppFonts.robotoRegular,
        color:          AppColors.white,
        fontSize:       AppFonts.scaleFont(16),
        height:         40,
        justifyContent: 'center',
    },
    reusableCustomSpacing: {
        alignItems:        'flex-start',
        borderBottomWidth: 0,
        borderLeftWidth:   0,
        borderRightWidth:  0,
        borderTopWidth:    0,
        paddingLeft:       AppSizes.paddingSml,
    },
});

/* Component ==================================================================== */
class UserAccountAbout extends Component {
    constructor(props) {
        super(props);
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
        this.scrollViewRef = {};
    }

    focusNextField = (id, isPicker, isModal) => {
        if(isModal) {
            this.inputs[id].onPressDate();
        } else if(isPicker) {
            this.inputs[id].togglePicker();
        } else {
            this.inputs[id].focus();
        }
    }

    _scrollToInput = reactNode => {
        this.scrollViewRef.props.scrollToFocusedInput(reactNode, (75 + AppSizes.paddingLrg));
    }

    render = () => {
        const {
            handleFormChange,
            surveyValues,
            user,
        } = this.props;
        /*eslint no-return-assign: 0*/
        return(
            <KeyboardAwareScrollView
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center',}}
                innerRef={ref => {this.scrollViewRef = ref;}}
                scrollEnabled={false}
            >
                <View style={[AppStyles.onboardingInputContainer, {paddingLeft: AppSizes.paddingSml, paddingVertical: AppSizes.paddingXSml,}]}>
                    { user.personal_data.birth_date.length > 0 &&
                        <Text style={[styles.inputLabel, user.personal_data.birth_date.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {}]}>
                            {'Date of birth'}
                        </Text>
                    }
                    <DatePicker
                        allowFontScaling={false}
                        cancelBtnText={'Cancel'}
                        confirmBtnText={'Confirm'}
                        customStyles={{
                            dateInput:       [styles.reusableCustomSpacing, AppStyles.onboardingInputStyle, user.personal_data.birth_date.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {paddingVertical: AppSizes.paddingSml,}],
                            dateText:        {...AppFonts.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(20),},
                            placeholderText: {...AppFonts.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(20),},
                            btnTextConfirm:  {color: AppColors.zeplin.yellow,},
                        }}
                        date={user.personal_data.birth_date || ''}
                        format={'MM/DD/YYYY'}
                        mode={'date'}
                        onCloseModal={() => this.focusNextField('sex', true)}
                        onDateChange={date => handleFormChange('personal_data.birth_date', date)}
                        placeholder={'Date of birth'}
                        ref={input => {this.inputs.birth_date = input;}}
                        showIcon={false}
                        style={{width: '100%',}}
                    />
                </View>
                <View style={[AppStyles.onboardingInputContainer, {paddingLeft: AppSizes.paddingSml,}, user.biometric_data.sex.length > 0 ? {} : {paddingVertical: AppSizes.paddingXSml,}]}>
                    { user.biometric_data.sex.length > 0 &&
                        <Text style={[styles.inputLabel, user.biometric_data.sex.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {}]}>
                            {'Sex'}
                        </Text>
                    }
                    <FathomPicker
                        hideIcon={true}
                        items={UserAccountConstants.possibleGenders}
                        onDownArrow={() => this.focusNextField('mass')}
                        onUpArrow={() => this.focusNextField('birth_date', false, true)}
                        onValueChange={value => value ? handleFormChange('biometric_data.sex', value) : null}
                        placeholder={{
                            color: AppColors.white,
                            label: 'Sex',
                            value: null,
                        }}
                        ref={ref => this.inputs.sex = ref}
                        style={{
                            inputAndroid:  [styles.pickerSelectAndroid, AppStyles.onboardingInputStyle, user.biometric_data.sex.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {paddingVertical: AppSizes.paddingSml,}],
                            inputIOS:      [styles.pickerSelectIOS, AppStyles.onboardingInputStyle, user.biometric_data.sex.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {paddingVertical: AppSizes.paddingSml,}],
                            viewContainer: [styles.androidViewContainer, Platform.OS === 'ios' ? {paddingLeft: AppSizes.paddingSml,} : {}],
                        }}
                        value={user.biometric_data.sex}
                    />
                </View>
                <FormInput
                    blurOnSubmit={true}
                    containerStyle={[AppStyles.onboardingInputContainer,]}
                    inputRef={ref => this.inputs.mass = ref}
                    inputStyle={[AppStyles.onboardingInputStyle, user.biometric_data.mass.lb.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {}]}
                    keyboardType={'number-pad'}
                    label={user.biometric_data.mass.lb.length > 0 ? 'Weight (lbs)' : null}
                    labelStyle={[styles.inputLabel,]}
                    onChangeText={text => handleFormChange('biometric_data.mass.lb', text)}
                    onFocus={event => this._scrollToInput(findNodeHandle(event.target))}
                    onSubmitEditing={() => this.focusNextField('typical_weekly_sessions', true)}
                    placeholder={'Weight (lbs)'}
                    placeholderTextColor={AppColors.white}
                    returnKeyType={'done'}
                    value={user.biometric_data.mass.lb}
                />
                <View style={[AppStyles.onboardingInputContainer, {paddingLeft: AppSizes.paddingSml,}, surveyValues.typical_weekly_sessions.length > 0 ? {} : {paddingVertical: AppSizes.paddingXSml,}]}>
                    { surveyValues.typical_weekly_sessions.length > 0 &&
                        <Text style={[styles.inputLabel, surveyValues.typical_weekly_sessions.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {}]}>
                            {'Activity Level'}
                        </Text>
                    }
                    <FathomPicker
                        hideIcon={true}
                        items={UserAccountConstants.activityLevels}
                        onDownArrow={() => this.focusNextField('wearable_devices', true)}
                        onDonePress={() => this.focusNextField('wearable_devices', true)}
                        onUpArrow={() => this.focusNextField('mass')}
                        onValueChange={value => value ? handleFormChange('typical_weekly_sessions', value, true) : null}
                        placeholder={{
                            color: AppColors.white,
                            label: 'Activity Level',
                            value: null,
                        }}
                        ref={ref => this.inputs.typical_weekly_sessions = ref}
                        style={{
                            inputAndroid:     [AppStyles.onboardingInputStyle, surveyValues.typical_weekly_sessions.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {paddingVertical: AppSizes.paddingSml,}],
                            inputIOS:         [AppStyles.onboardingInputStyle, surveyValues.typical_weekly_sessions.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {paddingVertical: AppSizes.paddingSml,}],
                            placeholderColor: AppColors.white,
                            viewContainer:    [styles.androidViewContainer, Platform.OS === 'ios' ? {paddingLeft: AppSizes.paddingSml,} : {},],
                        }}
                        value={surveyValues.typical_weekly_sessions}
                    />
                </View>
                <View style={[AppStyles.onboardingInputContainer, {paddingLeft: AppSizes.paddingSml,}, surveyValues.wearable_devices.length > 0 ? {} : {paddingVertical: AppSizes.paddingXSml,}]}>
                    { surveyValues.wearable_devices.length > 0 &&
                        <Text style={[styles.inputLabel, surveyValues.wearable_devices.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {}]}>
                            {'Wearable Device'}
                        </Text>
                    }
                    <FathomPicker
                        hideIcon={true}
                        items={UserAccountConstants.wearableDevices}
                        onUpArrow={() => this.focusNextField('typical_weekly_sessions', true)}
                        onValueChange={value => value ? handleFormChange('wearable_devices', value, true) : null}
                        placeholder={{
                            color: AppColors.white,
                            label: 'Wearable Device',
                            value: null,
                        }}
                        ref={ref => this.inputs.wearable_devices = ref}
                        style={{
                            inputAndroid:     [styles.pickerSelectAndroid, AppStyles.onboardingInputStyle, surveyValues.wearable_devices.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {paddingVertical: AppSizes.paddingSml,}],
                            inputIOS:         [styles.pickerSelectIOS, AppStyles.onboardingInputStyle, surveyValues.wearable_devices.length > 0 ? {paddingTop: AppSizes.paddingXSml,} : {paddingVertical: AppSizes.paddingSml,}],
                            placeholderColor: AppColors.white,
                            viewContainer:    [styles.androidViewContainer, Platform.OS === 'ios' ? {paddingLeft: AppSizes.paddingSml,} : {}],
                        }}
                        value={surveyValues.wearable_devices}
                    />
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

UserAccountAbout.propTypes = {
    handleFormChange: PropTypes.func.isRequired,
    surveyValues:     PropTypes.object.isRequired,
    user:             PropTypes.object.isRequired,
};
UserAccountAbout.defaultProps = {};
UserAccountAbout.componentName = 'UserAccountAbout';

/* Export Component ==================================================================== */
export default UserAccountAbout;