/**
 * UserType
 *
    <UserType
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
import { AppColors, AppSizes } from '../../../constants';
import { Text } from '../../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    cardWrapper: {
        alignItems:      'center',
        backgroundColor: AppColors.primary.grey.thirtyPercent,
        borderRadius:    5,
        height:          AppSizes.screen.heightTwentieth,
        justifyContent:  'center',
        marginBottom:    15,
        position:        'relative',
        width:           '100%',
    },
    overlay: {
        alignItems:      'center',
        backgroundColor: AppColors.primary.grey.thirtyPercent,
        borderRadius:    5,
        height:          '100%',
        justifyContent:  'center',
        position:        'absolute',
        width:           '100%',
    },
    text: {
        fontWeight: 'bold',
        fontSize:   15,
    },
    textWrapper: {
        paddingBottom: 50,
        paddingTop:    50,
        paddingRight:  30,
        paddingLeft:   30,
    },
    title: {
        fontSize:   20,
        fontWeight: 'bold',
        textAlign:  'center',
    },
    wrapper: {
        padding: 20,
    },
});

/* Component ==================================================================== */
const UserType = ({ componentStep, currentStep, handleClick, user }) => (
    <View style={[styles.wrapper, [componentStep === currentStep ? {} : {display: 'none'}] ]}>
        <View style={[styles.textWrapper]}>
            <Text style={[styles.title]}>{'Which one of the follow describes you the best?'}</Text>
        </View>
        <TouchableOpacity onPress={() => handleClick('type', 'athlete')} style={[styles.cardWrapper]}>
            <Text style={[styles.text]}>{'ATHLETE'}</Text>
            { user.type === 'athlete' ?
                <View style={[styles.overlay]}>
                    <Image source={require('../../../constants/assets/images/checkmark.png')} />
                </View>
                :
                null
            }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleClick('type', 'parent')} style={[styles.cardWrapper]}>
            <Text style={[styles.text]}>{'ATHLETE\'S PARENT'}</Text>
            { user.type === 'parent' ?
                <View style={[styles.overlay]}>
                    <Image source={require('../../../constants/assets/images/checkmark.png')} />
                </View>
                :
                null
            }
        </TouchableOpacity>
    </View>
);

UserType.propTypes = {
    componentStep: PropTypes.number.isRequired,
    currentStep:   PropTypes.number.isRequired,
    handleClick:   PropTypes.func.isRequired,
    user:          PropTypes.object.isRequired,
};
UserType.defaultProps = {};
UserType.componentName = 'UserType';

/* Export Component ==================================================================== */
export default UserType;
