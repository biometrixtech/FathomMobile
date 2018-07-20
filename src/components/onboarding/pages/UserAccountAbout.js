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
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// Consts and Libs
import {
    AppColors,
    AppSizes,
    AppStyles,
    UserAccount as UserAccountConstants,
} from '@constants';
import { FormInput, FormLabel, RadioButton, Text } from '@custom';

// import third-party libraries
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        height: AppSizes.screen.height,
        width:  AppSizes.screen.width,
    },
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
});

const Wrapper = props => Platform.OS === 'ios' ?
    (
        <KeyboardAvoidingView behavior={'padding'} style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            {props.children}
        </KeyboardAvoidingView>
    ) :
    (
        <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            {props.children}
        </View>
    );

/* Component ==================================================================== */
const UserAccountAbout = ({ handleFormChange, heightPressed, user }) => (
    <Wrapper>
        <FormLabel>{'Date of Birth'}</FormLabel>
        <DatePicker
            cancelBtnText={'Cancel'}
            confirmBtnText={'Confirm'}
            customStyles={{dateInput: styles.reusableCustomSpacing}}
            date={user.personal_data.birth_date ? user.personal_data.birth_date : ''}
            format={'MM/DD/YYYY'}
            maxDate={new Date()}
            mode={'date'}
            onDateChange={(date) => handleFormChange('personal_data.birth_date', date)}
            showIcon={false}
            style={{width: '100%'}}
        />
        <FormLabel>{'Phone Number'}</FormLabel>
        <FormInput
            containerStyle={{marginLeft: 0, paddingLeft: 20}}
            keyboardType={'numeric'}
            maxLength={5}
            onChangeText={(text) => handleFormChange('personal_data.phone_number', text)}
            returnKeyType={'next'}
            value={user.personal_data.phone_number}
        />
        <FormLabel>{'Gender'}</FormLabel>
        <RNPickerSelect
            hideIcon={true}
            items={UserAccountConstants.possibleGenders}
            onValueChange={(value) => handleFormChange('biometric_data.gender', value)}
            placeholder={{
                label: 'Select a Gender...',
                value: null,
            }}
            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
            value={user.biometric_data.gender}
        />
        <FormLabel>{'Height'}</FormLabel>
        <TouchableOpacity onPress={heightPressed} style={[styles.reusableCustomSpacing, {height: 40, justifyContent: 'center'}]}>
            <Text>{Math.floor(user.biometric_data.height.in / 12) + '\'' + user.biometric_data.height.in % 12 + '"'}</Text>
        </TouchableOpacity>
        <FormLabel>{'Weight (lbs)'}</FormLabel>
        <FormInput
            containerStyle={{marginLeft: 0, paddingLeft: 20}}
            keyboardType={'numeric'}
            onChangeText={(text) => handleFormChange('biometric_data.mass.lb', text)}
            returnKeyType={'next'}
            value={user.biometric_data.mass.lb}
        />
        <FormLabel>{'Injury Status'}</FormLabel>
        <RNPickerSelect
            hideIcon={true}
            items={UserAccountConstants.possibleInjuryStatuses}
            onValueChange={(value) => handleFormChange('injury_status', value)}
            placeholder={{
                label: 'Select an Injury Status...',
                value: null,
            }}
            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
            value={user.injury_status}
        />
        <FormLabel>{'System Type'}</FormLabel>
        <RNPickerSelect
            hideIcon={true}
            items={UserAccountConstants.possibleSystemTypes}
            onValueChange={(value) => handleFormChange('system_type', value)}
            placeholder={{
                label: 'Select a System Type...',
                value: null,
            }}
            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
            value={user.system_type}
        />
    </Wrapper>
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
