/**
 * UserRole
 *
    <UserRole
        componentStep={1}
        currentStep={step}
        handleClick={this._handleUserFormChange}
        user={form_fields.user}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles } from '../../../constants';
import { Text } from '../../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    cardWrapper: {
        backgroundColor: AppColors.primary.grey.thirtyPercent,
        borderRadius:    5,
        height:          AppSizes.screen.heightTwentieth,
        marginBottom:    15,
        position:        'relative',
        width:           '100%',
    },
    overlay: {
        backgroundColor: AppColors.primary.grey.hundredPercent,
        borderRadius:    5,
        height:          '100%',
        opacity:         0.75,
        position:        'absolute',
        width:           '100%',
    },
});

/* Component ==================================================================== */
const UserRole = ({ componentStep, currentStep, handleClick, user }) => (
    <View style={[AppStyles.padding, [componentStep === currentStep ? {} : {display: 'none'}] ]}>
        <View style={[AppStyles.paddingVerticalXLrg, AppStyles.paddingHorizontalLrg]}>
            <Text style={[AppFonts.h1, AppStyles.bold, AppStyles.textCenterAligned]}>{'Which one of the follow describes you the best?'}</Text>
        </View>
        <TouchableOpacity onPress={() => handleClick('role', 'athlete')} style={[AppStyles.containerCentered, styles.cardWrapper]}>
            <Text style={[AppFonts.h1, AppStyles.bold]}>{'ATHLETE'}</Text>
            { user.role === 'athlete' ?
                <View style={[AppStyles.containerCentered, styles.overlay]}>
                    <Image source={require('../../../constants/assets/images/checkmark.png')} />
                </View>
                :
                null
            }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleClick('role', 'manager')} style={[AppStyles.containerCentered, styles.cardWrapper]}>
            <Text style={[AppFonts.h1, AppStyles.bold]}>{'ATHLETE\'S PARENT'}</Text>
            { user.role === 'manager' ?
                <View style={[AppStyles.containerCentered, styles.overlay]}>
                    <Image source={require('../../../constants/assets/images/checkmark.png')} />
                </View>
                :
                null
            }
        </TouchableOpacity>
    </View>
);

UserRole.propTypes = {
    componentStep: PropTypes.number.isRequired,
    currentStep:   PropTypes.number.isRequired,
    handleClick:   PropTypes.func.isRequired,
    user:          PropTypes.object.isRequired,
};
UserRole.defaultProps = {};
UserRole.componentName = 'UserRole';

/* Export Component ==================================================================== */
export default UserRole;
