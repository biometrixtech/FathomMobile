/**
 * UserAccountAbout
 *
    <UserAccountAbout
        clearCoachContent={this._clearCoachContent}
        handleFormChange={handleFormChange}
        isUpdatingUser={isUpdatingUser}
        setAccordionSection={handleFormSubmit}
        updateErrorMessage={this._updateErrorMessage}
        user={user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, UserAccount as UserAccountConstants, } from '../../../constants';
import { FathomPicker, FormInput, FormLabel, Spacer, Text, } from '../../custom';
import { onboardingUtils, } from '../../../constants/utils';

// import third-party libraries
import DatePicker from 'react-native-datepicker';

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

    focusNextField = id => {
        this.inputs[id].focus();
    }

    render = () => {
        const {
            clearCoachContent,
            handleFormChange,
            isUpdatingUser,
            setAccordionSection,
            updateErrorMessage,
            user,
        } = this.props;
        return(
            <View style={[{borderTopWidth: 1, borderTopColor: AppColors.border,}]}>
                <FormLabel>{user.personal_data.birth_date.length > 0 ?'DATE OF BIRTH' : ' '}</FormLabel>
                <DatePicker
                    cancelBtnText={'Cancel'}
                    confirmBtnText={'Confirm'}
                    customStyles={{
                        dateInput:       styles.reusableCustomSpacing,
                        dateText:        {...AppFonts.robotoRegular, color: AppColors.black, fontSize: AppFonts.scaleFont(16),},
                        placeholderText: {color: AppColors.zeplin.lightGrey, fontSize: AppFonts.scaleFont(16), ...AppFonts.robotoRegular, },
                        btnTextConfirm:  {color: AppColors.zeplin.yellow},
                    }}
                    date={user.personal_data.birth_date || ''}
                    format={'MM/DD/YYYY'}
                    mode={'date'}
                    onDateChange={date => clearCoachContent('', () => handleFormChange('personal_data.birth_date', date))}
                    placeholder={'Date of Birth'}
                    ref={input => {
                        this.inputs.birth_date = input;
                    }}
                    showIcon={false}
                    style={{width: '100%'}}
                />
                <FormLabel>{user.biometric_data.mass.lb.length > 0 ? 'WEIGHT (LBS)' : ' '}</FormLabel>
                <FormInput
                    blurOnSubmit={ true }
                    containerStyle={{marginLeft: 0, paddingLeft: 10}}
                    keyboardType={'number-pad'}
                    onChangeText={text => clearCoachContent('', () => handleFormChange('biometric_data.mass.lb', text))}
                    placeholder={'Weight (lbs)'}
                    placeholderTextColor={AppColors.zeplin.lightGrey}
                    returnKeyType={'done'}
                    textInputRef={input => {
                        this.inputs.mass = input;
                    }}
                    value={user.biometric_data.mass.lb}
                />
                <FormLabel>{user.biometric_data.sex.length > 0 ? 'SEX' : ' '}</FormLabel>
                <FathomPicker
                    hideIcon={true}
                    items={UserAccountConstants.possibleGenders}
                    onValueChange={value => value ? clearCoachContent('', () => handleFormChange('biometric_data.sex', value)) : null}
                    placeholder={{
                        color: AppColors.zeplin.darkSlate,
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
            </View>
        )
    }
}

UserAccountAbout.propTypes = {
    handleFormChange:    PropTypes.func.isRequired,
    setAccordionSection: PropTypes.func.isRequired,
    updateErrorMessage:  PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};
UserAccountAbout.defaultProps = {};
UserAccountAbout.componentName = 'UserAccountAbout';

/* Export Component ==================================================================== */
export default UserAccountAbout;