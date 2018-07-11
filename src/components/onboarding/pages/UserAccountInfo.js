/**
 * UserAccountInfo
 *
    <UserAccountInfo
        handleClick={this._handleUserFormChange}
        isPasswordSecure={this.state.isPasswordSecure}
        setAccordionSection={this._setAccordionSection}
        toggleShowPassword={this._toggleShowPassword}
        user={form_fields.user}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles } from '../../../constants';
import { FormInput, FormLabel, TabIcon, Text } from '../../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        width: AppSizes.screen.width,
    },
    leftItem: {
        width: '50%',
    },
    rightItem: {
        borderLeftWidth: 1,
        borderLeftColor: AppColors.border,
        width:           '50%',
    },
});

const Wrapper = props => Platform.OS === 'ios' ?
    (
        <KeyboardAvoidingView behavior={'padding'} style={[styles.background]}>
            {props.children}
        </KeyboardAvoidingView>
    ) :
    (
        <View style={[styles.background]}>
            {props.children}
        </View>
    );

/* Component ==================================================================== */
const UserAccountInfo = ({ handleFormChange, isPasswordSecure, setAccordionSection, toggleShowPassword, user }) => (
    <Wrapper>
        <View style={[AppStyles.row, {borderTopWidth: 1, borderTopColor: AppColors.border,}]}>
            <View style={[styles.leftItem]}>
                <FormLabel labelStyle={{color: AppColors.border}}>{'First Name'}</FormLabel>
                <FormInput
                    containerStyle={{marginLeft: 0, marginRight: 0, paddingLeft: 20}}
                    onChangeText={(text) => handleFormChange('personal_data.first_name', text)}
                    returnKeyType={'next'}
                    value={user.personal_data.first_name}
                />
            </View>
            <View style={[styles.rightItem]}>
                <FormLabel labelStyle={{color: AppColors.border}}>{'Last Name'}</FormLabel>
                <FormInput
                    containerStyle={{marginLeft: 0, paddingLeft: 20}}
                    onChangeText={(text) => handleFormChange('personal_data.last_name', text)}
                    returnKeyType={'next'}
                    value={user.personal_data.last_name}
                />
            </View>
        </View>
        <FormLabel labelStyle={{color: AppColors.border}}>{'Email'}</FormLabel>
        <FormInput
            containerStyle={{marginLeft: 0, paddingLeft: 20}}
            onChangeText={(text) => handleFormChange('email', text)}
            keyboardType={'email-address'}
            returnKeyType={'next'}
            value={user.email}
        />
        <FormLabel labelStyle={{color: AppColors.border}}>{'Password'}</FormLabel>
        <View>
            <FormInput
                containerStyle={{marginLeft: 0, paddingLeft: 20}}
                onChangeText={(text) => handleFormChange('password', text)}
                returnKeyType={'done'}
                secureTextEntry={isPasswordSecure}
                value={user.password}
            />
            <TabIcon
                color={AppColors.border}
                containerStyle={[{position: 'absolute', top: 15, right: 25, width: '10%'}]}
                icon={isPasswordSecure ? 'visibility' : 'visibility-off'}
                onPress={toggleShowPassword}
                size={24}
            />
        </View>
        <Text
            onPress={() => setAccordionSection(0, 1)}
            style={[AppStyles.paddingVertical, AppStyles.continueButton]}
        >{'CONTINUE'}</Text>
    </Wrapper>
);

UserAccountInfo.propTypes = {
    handleFormChange:    PropTypes.func.isRequired,
    isPasswordSecure:    PropTypes.bool.isRequired,
    setAccordionSection: PropTypes.func.isRequired,
    toggleShowPassword:  PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};
UserAccountInfo.defaultProps = {};
UserAccountInfo.componentName = 'UserAccountInfo';

/* Export Component ==================================================================== */
export default UserAccountInfo;
