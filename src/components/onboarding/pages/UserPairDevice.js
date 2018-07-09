/**
 * UserPairDevice
 *
    <UserPairDevice
        componentStep={8}
        currentStep={step}
        handleFormChange={this._handleUserFormChange}
        user={form_fields.user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

// Consts, Libs, and Utils
// import { AppColors, AppFonts, AppStyles, UserAccount as UserAccountConstants } from '../../../constants';
import { AppStyles } from '../../../constants';
// import { onboardingUtils } from '../../../constants/utils';
// import { Text, FormLabel } from '../../custom';
import { Coach, Text } from '../../custom';

// import third-party libraries
// import _ from 'lodash';
// import { ButtonGroup } from 'react-native-elements';
// import RNPickerSelect from 'react-native-picker-select';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: 20,
        paddingTop:    10,
        paddingRight:  10,
        paddingLeft:   10,
    },
});

/* Component ==================================================================== */
class UserPairDevice extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render = () => {
        const {
            componentStep,
            currentStep,
            user,
        } = this.props;
        return (
            <View style={[styles.wrapper, [componentStep === currentStep ? {} : {display: 'none'}] ]}>
                <Coach
                    text={'Now let\'s pair with your sensor. Your sensor will only sync data with one phone, so be sure this is the device you\'ll be using daily.'}
                />
                <Text>To enter setup, hold both buttons until the sensor light begins to breath blue.</Text>
                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <Image style={{resizeMode: 'contain', width: 400, height: 400}} source={require('../../../constants/assets/images/kit-activation.png')}/>
                </View>
                <TouchableOpacity onPress={() => console.log("HI")} style={[AppStyles.nextButtonWrapper]}>
                    <Text style={[AppStyles.nextButtonText]}>{'Next Step'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

UserPairDevice.propTypes = {
    componentStep:    PropTypes.number.isRequired,
    currentStep:      PropTypes.number.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    user:             PropTypes.object.isRequired,
};
UserPairDevice.defaultProps = {};
UserPairDevice.componentName = 'UserPairDevice';

/* Export Component ==================================================================== */
export default UserPairDevice;
