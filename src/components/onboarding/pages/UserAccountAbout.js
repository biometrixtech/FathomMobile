/**
 * UserAccountAbout
 *
    <UserAccountAbout
        handleFormChange={handleFormChange}
        heightPressed={heightPressed}
        setAccordionSection={this._setAccordionSection}
        user={user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

// Consts and Libs
import {
    AppColors,
    AppFonts,
    AppSizes,
    AppStyles,
    UserAccount as UserAccountConstants,
} from '../../../constants';
import { FormInput, FormLabel, RadioButton, Text } from '../../custom';
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
        paddingLeft:       10,
    },
    background: {
        width: AppSizes.screen.width,
    },
    pickerSelectAndroid: {
        ...AppFonts.oswaldMedium,
        color:    AppColors.black,
        fontSize: AppFonts.base.size,
    },
    pickerSelectIOS: {
        ...AppFonts.oswaldMedium,
        color:          AppColors.black,
        fontSize:       AppFonts.base.size,
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

const Wrapper = props => Platform.OS === 'ios' ?
    (
        <KeyboardAvoidingView behavior={'padding'} style={[styles.background]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View>
                    {props.children}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    ) :
    (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.background]}>
                {props.children}
            </View>
        </TouchableWithoutFeedback>
    );

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
            user,
        } = this.props;
        return(
            <Wrapper>
                <FormLabel labelStyle={{color: AppColors.black}}>{user.personal_data.birth_date.length > 0 ?'Date of Birth' : ' '}</FormLabel>
                <DatePicker
                    cancelBtnText={'Cancel'}
                    confirmBtnText={'Confirm'}
                    customStyles={{
                        dateInput:       styles.reusableCustomSpacing,
                        dateText:        {...AppFonts.oswaldMedium, color: AppColors.black, fontSize: AppFonts.scaleFont(18),},
                        placeholderText: {color: AppColors.zeplin.lightGrey, fontSize: AppFonts.base.size, ...AppFonts.oswaldMedium, },
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
                    onValueChange={value => handleFormChange('injury_status', value)}
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
                    keyboardType={'numeric'}
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
                    onValueChange={value => handleFormChange('biometric_data.height.in', value)}
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
                    keyboardType={'numeric'}
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
                    onValueChange={value => handleFormChange('biometric_data.sex', value)}
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
                <Text
                    onPress={() => onboardingUtils.isUserAboutValid(user).isValid ? setAccordionSection() : null}
                    style={[AppStyles.paddingVertical, AppStyles.continueButton,
                        onboardingUtils.isUserAboutValid(user).isValid ?
                            {}
                            :
                            {color: AppColors.zeplin.lightGrey}
                    ]}
                >{'CONTINUE'}</Text>
            </Wrapper>
        )
    }
}

UserAccountAbout.propTypes = {
    handleFormChange:    PropTypes.func.isRequired,
    heightPressed:       PropTypes.func.isRequired,
    setAccordionSection: PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};
UserAccountAbout.defaultProps = {};
UserAccountAbout.componentName = 'UserAccountAbout';

/* Export Component ==================================================================== */
export default UserAccountAbout;