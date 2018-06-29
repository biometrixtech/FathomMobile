/**
 * UserAccountAbout
 *
    <UserAccountAbout
        handleFormChange={handleFormChange}
        heightPressed={heightPressed}
        user={user}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, UserAccount as UserAccountConstants } from '../../../constants';
import { FormInput, FormLabel, RadioButton, Text } from '../../custom';

// import third-party libraries
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    pickerSelectAndroid: {},
    pickerSelectIOS:     {
        height:         40,
        justifyContent: 'center',
    },
    reusableCustomSpacing: {
        alignItems:        'flex-start',
        borderBottomWidth: 1,
        borderColor:       AppColors.primary.grey.thirtyPercent,
        borderLeftWidth:   0,
        borderRightWidth:  0,
        borderTopWidth:    0,
        marginRight:       20,
        paddingLeft:       20,
    },
    wrapper: {
        // paddingTop: 10,
    },
});

/* Component ==================================================================== */
const UserAccountAbout = ({ handleFormChange, heightPressed, user }) => (
    <KeyboardAvoidingView behavior={'padding'} style={[styles.wrapper]}>
        <FormLabel>{'Date of Birth'}</FormLabel>
        <DatePicker
            cancelBtnText={'Cancel'}
            confirmBtnText={'Confirm'}
            customStyles={{dateInput: styles.reusableCustomSpacing}}
            date={user.dob ? user.dob : ''}
            format={'YYYY-MM-DD'}
            maxDate={new Date()}
            mode={'date'}
            onDateChange={(date) => handleFormChange('dob', date)}
            showIcon={false}
            style={{width: '100%'}}
        />
        <FormLabel>{'Height'}</FormLabel>
        <TouchableOpacity onPress={heightPressed} style={[styles.reusableCustomSpacing, {height: 40, justifyContent: 'center'}]}>
            <Text>{Math.floor(user.height / 12) + '\'' + user.height % 12 + '"'}</Text>
        </TouchableOpacity>
        <FormLabel>{'Weight (lbs)'}</FormLabel>
        <FormInput
            containerStyle={{marginLeft: 0, paddingLeft: 20}}
            keyboardType={'numeric'}
            onChangeText={(text) => handleFormChange('weight', text)}
            returnKeyType={'next'}
            value={user.weight}
        />
        <FormLabel>{'Injury Status'}</FormLabel>
        <RNPickerSelect
            hideIcon={true}
            items={UserAccountConstants.possibleInjuryStatuses}
            onValueChange={(value) => handleFormChange('injuryStatus', value)}
            placeholder={{
                label: 'Select an Injury Status...',
                value: null,
            }}
            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
            value={user.injuryStatus}
        />
        <FormLabel>{'System Type'}</FormLabel>
        <RNPickerSelect
            hideIcon={true}
            items={UserAccountConstants.possibleSystemTypes}
            onValueChange={(value) => handleFormChange('systemType', value)}
            placeholder={{
                label: 'Select a System Type...',
                value: null,
            }}
            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
            value={user.systemType}
        />
        <RadioButton
            label={'Have you missed any game or practice time in the past due to injury?'}
            onChange={(option) => handleFormChange('missedDueToInjury', option)}
            options={UserAccountConstants.missedDueToInjuryOptions}
            value={user.missedDueToInjury}
        />
    </KeyboardAvoidingView>
);

UserAccountAbout.propTypes = {
    handleFormChange: PropTypes.func.isRequired,
    heightPressed:    PropTypes.func.isRequired,
    user:             PropTypes.object.isRequired,
};
UserAccountAbout.defaultProps = {};
UserAccountAbout.componentName = 'UserAccountAbout';

/* Export Component ==================================================================== */
export default UserAccountAbout;
