/**
 * UserAccountInfo
 *
    <UserAccountInfo
        handleClick={this._handleUserFormChange}
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
import { FormInput, FormLabel, Text } from '../../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.secondary.blue.hundredPercent,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
    inlineWrapper: {
        flexDirection: 'row',
    },
    leftItem: {
        width: '50%',
    },
    rightItem: {
        borderLeftWidth: 1,
        borderLeftColor: AppColors.primary.grey.thirtyPercent,
        width:           '50%',
    },
    text: {
        fontWeight: 'bold',
        fontSize:   15,
    },
    wrapper: {
        // padding: 5,
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
const UserAccountInfo = ({ handleFormChange, user }) => (
    <Wrapper>
        <View style={[styles.inlineWrapper]}>
            <View style={[styles.leftItem]}>
                <FormLabel>{'First Name'}</FormLabel>
                <FormInput
                    containerStyle={{marginLeft: 0, marginRight: 0, paddingLeft: 20}}
                    onChangeText={(text) => handleFormChange('firstName', text)}
                    returnKeyType={'next'}
                    value={user.firstName}
                />
            </View>
            <View style={[styles.rightItem]}>
                <FormLabel>{'Last Name'}</FormLabel>
                <FormInput
                    containerStyle={{marginLeft: 0, paddingLeft: 20}}
                    onChangeText={(text) => handleFormChange('lastName', text)}
                    returnKeyType={'next'}
                    value={user.lastName}
                />
            </View>
        </View>
        <FormLabel>{'Email'}</FormLabel>
        <FormInput
            containerStyle={{marginLeft: 0, paddingLeft: 20}}
            onChangeText={(text) => handleFormChange('email', text)}
            keyboardType={'email-address'}
            returnKeyType={'next'}
            value={user.email}
        />
        <FormLabel>{'Password'}</FormLabel>
        <FormInput
            containerStyle={{marginLeft: 0, paddingLeft: 20}}
            onChangeText={(text) => handleFormChange('password', text)}
            returnKeyType={'done'}
            secureTextEntry={true}
            value={user.password}
        />
    </Wrapper>
);

UserAccountInfo.propTypes = {
    handleFormChange: PropTypes.func.isRequired,
    user:             PropTypes.object.isRequired,
};
UserAccountInfo.defaultProps = {};
UserAccountInfo.componentName = 'UserAccountInfo';

/* Export Component ==================================================================== */
export default UserAccountInfo;
