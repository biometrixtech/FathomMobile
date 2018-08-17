/**
 * UserAccountAbout
 *
    <UserAccountAbout
        handleFormChange={handleFormChange}
        heightPressed={heightPressed}
        setAccordionSection={this._setAccordionSection}
        updateErrorMessage={this._updateErrorMessage}
        user={user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import {
    AppColors,
    AppFonts,
    AppSizes,
    AppStyles,
    UserAccount as UserAccountConstants,
} from '../../../constants';
import { FormInput, FormLabel, RadioButton, Spacer, Text } from '../../custom';
import { onboardingUtils } from '../../../constants/utils';

// import third-party libraries
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    androidViewContainer: {
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
        height:            40,
        justifyContent:    'center',
        marginRight:       20,
        paddingLeft:       11,
    },
    background: {
        width: AppSizes.screen.width,
    },
    pickerSelectAndroid: {
        color: AppColors.black,
    },
    pickerSelectIOS: {
        ...AppFonts.robotoRegular,
        color:          AppColors.black,
        fontSize:       AppFonts.scaleFont(16),
        height:         40,
        justifyContent: 'center',
        paddingLeft:    10,
    },
    reusableCustomSpacing: {
        alignItems:        'flex-start',
        borderBottomWidth: 1,
        borderColor:       AppColors.border,
        borderLeftWidth:   0,
        borderRightWidth:  0,
        borderTopWidth:    0,
        marginRight:       20,
        paddingLeft:       20,
    },
});

/* Component ==================================================================== */
class UserAccountAbout extends Component {
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
            handleFormChange,
            heightPressed,
            setAccordionSection,
            updateErrorMessage,
            user,
        } = this.props;
        return(
            <View style={[{borderTopWidth: 1, borderTopColor: AppColors.border,}]}>
                <FormLabel labelStyle={{color: AppColors.black}}>{user.personal_data.birth_date.length > 0 ?'Date of Birth' : ' '}</FormLabel>
                <DatePicker
                    cancelBtnText={'Cancel'}
                    confirmBtnText={'Confirm'}
                    customStyles={{
                        dateInput:       styles.reusableCustomSpacing,
                        dateText:        {...AppFonts.robotoRegular, color: AppColors.black, fontSize: AppFonts.scaleFont(16),},
                        placeholderText: {color: AppColors.zeplin.lightGrey, fontSize: AppFonts.scaleFont(16), ...AppFonts.robotoRegular, },
                        btnTextConfirm:  {color: AppColors.primary.yellow.hundredPercent},
                    }}
                    date={user.personal_data.birth_date || ''}
                    format={'MM/DD/YYYY'}
                    maxDate={new Date()}
                    mode={'date'}
                    onDateChange={date => handleFormChange('personal_data.birth_date', date)}
                    placeholder={'Date of Birth'}
                    ref={input => {
                        this.inputs.birth_date = input;
                    }}
                    showIcon={false}
                    style={{width: '100%'}}
                />
                <FormLabel labelStyle={{color: AppColors.black}}>{user.injury_status.length > 0 ? 'Health Status' : ' '}</FormLabel>
                <RNPickerSelect
                    hideIcon={true}
                    items={UserAccountConstants.possibleInjuryStatuses}
                    onValueChange={value => value ? handleFormChange('injury_status', value) : null}
                    placeholder={{
                        label: 'Health Status',
                        value: null,
                    }}
                    style={{
                        inputAndroid:     [styles.pickerSelectAndroid],
                        inputIOS:         [styles.pickerSelectIOS],
                        placeholderColor: AppColors.zeplin.lightGrey,
                        viewContainer:    [styles.androidViewContainer],
                    }}
                    value={user.injury_status}
                />
                <FormLabel labelStyle={{color: AppColors.black}}>{user.personal_data.zip_code.length > 0 ? 'Zip Code' : ' '}</FormLabel>
                <FormInput
                    blurOnSubmit={ true }
                    containerStyle={{marginLeft: 0, paddingLeft: 10}}
                    keyboardType={'number-pad'}
                    maxLength={5}
                    onChangeText={text => handleFormChange('personal_data.zip_code', text)}
                    placeholder={'Zip Code'}
                    placeholderTextColor={AppColors.zeplin.lightGrey}
                    returnKeyType={'next'}
                    textInputRef={input => {
                        this.inputs.zip_code = input;
                    }}
                    value={user.personal_data.zip_code}
                />
                <FormLabel labelStyle={{color: AppColors.black}}>{user.biometric_data.height.in ? 'Height' : ' '}</FormLabel>
                <RNPickerSelect
                    hideIcon={true}
                    items={UserAccountConstants.heights}
                    onValueChange={value => value ? handleFormChange('biometric_data.height.in', value) : null}
                    placeholder={{
                        label: 'Height',
                        value: null,
                    }}
                    style={{
                        inputAndroid:     [styles.pickerSelectAndroid],
                        inputIOS:         [styles.pickerSelectIOS],
                        placeholderColor: AppColors.zeplin.lightGrey,
                        viewContainer:    [styles.androidViewContainer],
                    }}
                    value={parseInt(user.biometric_data.height.in, 10) || null}
                />
                {/*<TouchableOpacity onPress={heightPressed} style={[styles.reusableCustomSpacing, {height: 40, justifyContent: 'center'}]}>
                    { user.biometric_data.height.in > 0 ?
                        <Text>{Math.floor(user.biometric_data.height.in / 12) + '\'' + user.biometric_data.height.in % 12 + '"'}</Text>
                        :
                        <Text style={{color: AppColors.zeplin.lightGrey}}>{'Height'}</Text>
                    }
                </TouchableOpacity>*/}
                <FormLabel labelStyle={{color: AppColors.black}}>{user.biometric_data.mass.lb.length > 0 ? 'Weight (lbs)' : ' '}</FormLabel>
                <FormInput
                    blurOnSubmit={ true }
                    containerStyle={{marginLeft: 0, paddingLeft: 10}}
                    keyboardType={'number-pad'}
                    onChangeText={text => handleFormChange('biometric_data.mass.lb', text)}
                    placeholder={'Weight (lbs)'}
                    placeholderTextColor={AppColors.zeplin.lightGrey}
                    returnKeyType={'done'}
                    textInputRef={input => {
                        this.inputs.mass = input;
                    }}
                    value={user.biometric_data.mass.lb}
                />
                <FormLabel labelStyle={{color: AppColors.black}}>{user.biometric_data.sex.length > 0 ? 'Sex' : ' '}</FormLabel>
                <RNPickerSelect
                    hideIcon={true}
                    items={UserAccountConstants.possibleGenders}
                    onValueChange={value => value ? handleFormChange('biometric_data.sex', value) : null}
                    placeholder={{
                        label: 'Sex',
                        value: null,
                    }}
                    style={{
                        inputAndroid:     [styles.pickerSelectAndroid],
                        inputIOS:         [styles.pickerSelectIOS],
                        placeholderColor: AppColors.zeplin.lightGrey,
                        viewContainer:    [styles.androidViewContainer],
                    }}
                    value={user.biometric_data.sex}
                />
                {/*<FormLabel labelStyle={{color: AppColors.black}}>{user.system_type.length > 0 ? 'System Type' : ' '}</FormLabel>
                <RNPickerSelect
                    disabled={true}
                    hideIcon={true}
                    items={UserAccountConstants.possibleSystemTypes}
                    onValueChange={value => handleFormChange('system_type', value)}
                    placeholder={{
                        label: 'Select a System Type...',
                        value: null,
                    }}
                    style={{
                        inputAndroid:     [styles.pickerSelectAndroid],
                        inputIOS:         [styles.reusableCustomSpacing, styles.pickerSelectIOS],
                        placeholderColor: AppColors.zeplin.lightGrey,
                        viewContainer:    [styles.androidViewContainer],
                    }}
                    value={user.system_type}
                />*/}
                <Spacer size={50} />
                <Text
                    oswaldRegular
                    onPress={() => onboardingUtils.isUserAboutValid(user).isValid ? setAccordionSection() : updateErrorMessage(true)}
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

UserAccountAbout.propTypes = {
    handleFormChange:    PropTypes.func.isRequired,
    heightPressed:       PropTypes.func.isRequired,
    setAccordionSection: PropTypes.func.isRequired,
    updateErrorMessage:  PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};
UserAccountAbout.defaultProps = {};
UserAccountAbout.componentName = 'UserAccountAbout';

/* Export Component ==================================================================== */
export default UserAccountAbout;