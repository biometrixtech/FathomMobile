/**
 * UserRole
 *
    <UserRole
        componentStep={1}
        currentStep={step}
        handleFormChange={this._handleUserFormChange}
        user={form_fields.user}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles } from '@constants';
import { Text } from '@custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    cardWrapper: {
        height:       AppSizes.screen.heightQuarter,
        marginBottom: 15,
        position:     'relative',
        width:        '100%',
    },
    overlay: {
        backgroundColor: AppColors.primary.grey.hundredPercent,
        opacity:         0.75,
        position:        'absolute',
    },
});

/* Component ==================================================================== */
const UserRole = ({ componentStep, currentStep, handleFormChange, user }) => (
    <View style={[AppStyles.paddingHorizontalSml, [componentStep === currentStep ? {} : {display: 'none'}] ]}>
        <View style={[AppStyles.paddingVerticalXLrg, AppStyles.paddingHorizontalXLrg]}>
            <Text style={[AppFonts.h2, AppStyles.bold, AppStyles.textCenterAligned, {color: AppColors.primary.grey.hundredPercent}]}>{'Which one of the follow describes you the best?'}</Text>
        </View>
        <TouchableOpacity onPress={() => handleFormChange('role', 'athlete')} style={[AppStyles.containerCentered, styles.cardWrapper]}>
            <ImageBackground
                source={require('@images/athlete.jpg')}
                style={[AppStyles.containerCentered, AppStyles.fullHeightWeight]}
            >
                <Text style={[AppFonts.h2, AppStyles.bold, {color: AppColors.white}]}>{'ATHLETE'}</Text>
            </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFormChange('role', 'manager')} style={[AppStyles.containerCentered, styles.cardWrapper]}>
            <ImageBackground
                source={require('@images/parent.jpg')}
                style={[AppStyles.containerCentered, AppStyles.fullHeightWeight]}
            >
                <Text style={[AppFonts.h2, AppStyles.bold, {color: AppColors.white}]}>{'ATHLETE\'S PARENT'}</Text>
            </ImageBackground>
        </TouchableOpacity>
    </View>
);

UserRole.propTypes = {
    componentStep:    PropTypes.number.isRequired,
    currentStep:      PropTypes.number.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    user:             PropTypes.object.isRequired,
};
UserRole.defaultProps = {};
UserRole.componentName = 'UserRole';

/* Export Component ==================================================================== */
export default UserRole;
