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
import { Platform, StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, UserAccount as UserAccountConstants, } from '../../../constants';
import { FathomInput, FathomPicker, Spacer, Text, } from '../../custom';
import { onboardingUtils, } from '../../../constants/utils';

// import third-party libraries
import DatePicker from 'react-native-datepicker';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    androidViewContainer: {
        borderBottomWidth: 1,
        borderBottomColor: AppColors.zeplin.light,
        height:            40,
        justifyContent:    'center',
    },
    inputLabel: {
        ...AppFonts.robotoRegular,
        color:       AppColors.zeplin.lightSlate,
        fontSize:    AppFonts.scaleFont(11),
        margin:      0,
        paddingLeft: AppSizes.paddingSml,
        paddingTop:  AppSizes.paddingSml,
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
    },
    reusableCustomSpacing: {
        alignItems:        'flex-start',
        borderBottomWidth: 1,
        borderColor:       AppColors.zeplin.light,
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
            <View style={[{borderTopColor: AppColors.zeplin.light, borderTopWidth: 1,}]}>
                <Text style={[styles.inputLabel]}>{user.personal_data.birth_date.length > 0 ?'Date of birth' : ' '}</Text>
                <DatePicker
                    cancelBtnText={'Cancel'}
                    confirmBtnText={'Confirm'}
                    customStyles={{
                        dateInput:       styles.reusableCustomSpacing,
                        dateText:        {...AppFonts.robotoRegular, color: AppColors.black, fontSize: AppFonts.scaleFont(16),},
                        placeholderText: {color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(16), ...AppFonts.robotoRegular, },
                        btnTextConfirm:  {color: AppColors.zeplin.yellow},
                    }}
                    date={user.personal_data.birth_date || ''}
                    format={'MM/DD/YYYY'}
                    mode={'date'}
                    onDateChange={date => clearCoachContent('', () => handleFormChange('personal_data.birth_date', date))}
                    placeholder={'Date of birth'}
                    ref={input => {this.inputs.birth_date = input;}}
                    showIcon={false}
                    style={{width: '100%'}}
                />
                <FathomInput
                    blurOnSubmit={true}
                    inputContainerStyle={{paddingLeft: AppSizes.paddingSml,}}
                    keyboardType={'number-pad'}
                    onChangeText={text => clearCoachContent('', () => handleFormChange('biometric_data.mass.lb', text))}
                    label={user.biometric_data.mass.lb.length > 0 ? 'Weight (lbs)' : ' '}
                    labelStyle={[styles.inputLabel]}
                    placeholder={'Weight (lbs)'}
                    placeholderTextColor={AppColors.zeplin.lightSlate}
                    ref={input => {this.inputs.mass = input;}}
                    returnKeyType={'done'}
                    value={user.biometric_data.mass.lb}
                />
                <Text style={[styles.inputLabel]}>{user.biometric_data.sex.length > 0 ? 'Sex' : ' '}</Text>
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
                        placeholderColor: AppColors.zeplin.lightSlate,
                        viewContainer:    [styles.androidViewContainer, Platform.OS === 'ios' ? {paddingLeft: AppSizes.paddingSml,} : {}],
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