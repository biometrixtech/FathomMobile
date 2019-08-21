/*
 * @Author: Mazen Chami
 * @Date: 2018-07-13 17:42:00
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-21 16:43:35
 */

/**
 * Checkbox Icon
 *
    <Checkbox
        checked={checked}
        checkedColor={'green'}
        checkedIcon={'check-square'}
        containerStyle={{backgroundColor: AppColors.white, borderWidth: 0}}
        onPress={onPress}
        size={24}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';

// import third-party libraries
import { CheckBox } from 'react-native-elements';

// Consts and Libs
import { AppColors, } from '../../constants';

/* Component ==================================================================== */
const Checkbox = ({
    checked,
    checkedColor,
    checkedIcon,
    containerStyle,
    iconType,
    onPress,
    size,
    uncheckedColor,
    uncheckedIcon,
}) => (
    <CheckBox
        checked={checked}
        checkedColor={checkedColor}
        checkedIcon={checkedIcon}
        containerStyle={containerStyle}
        iconType={iconType}
        onPress={onPress}
        size={size}
        uncheckedColor={uncheckedColor}
        uncheckedIcon={uncheckedIcon}
    />
);

Checkbox.propTypes = {
    checked:        PropTypes.bool.isRequired,
    checkedColor:   PropTypes.string,
    checkedIcon:    PropTypes.string,
    containerStyle: PropTypes.object,
    iconType:       PropTypes.string,
    onPress:        PropTypes.func.isRequired,
    size:           PropTypes.number,
    uncheckedColor: PropTypes.string,
    uncheckedIcon:  PropTypes.string,
};
Checkbox.defaultProps = {
    checkedColor:   AppColors.zeplin.yellow,
    checkedIcon:    'ios-checkbox',
    containerStyle: {},
    iconType:       'ionicon',
    size:           24,
    uncheckedColor: AppColors.zeplin.slateXLight,
    uncheckedIcon:  'ios-checkbox-outline',
};

/* Export Component ==================================================================== */
export default Checkbox;
