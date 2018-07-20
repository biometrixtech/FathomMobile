/*
 * @Author: Mazen Chami
 * @Date: 2018-07-13 17:42:00
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:49:56
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
import { CheckBox } from 'react-native-elements';

/* Component ==================================================================== */
const Checkbox = ({
    checked,
    checkedColor,
    checkedIcon,
    containerStyle,
    onPress,
    size,
}) => (
    <CheckBox
        checked={checked}
        checkedColor={checkedColor}
        checkedIcon={checkedIcon}
        containerStyle={containerStyle}
        onPress={onPress}
        size={size}
    />
);

Checkbox.propTypes = {
    checked:        PropTypes.bool.isRequired,
    checkedColor:   PropTypes.string,
    checkedIcon:    PropTypes.string,
    containerStyle: PropTypes.object,
    onPress:        PropTypes.func.isRequired,
    size:           PropTypes.number,
};
Checkbox.defaultProps = {
    checkedColor:   'green',
    checkedIcon:    'check-square',
    containerStyle: {},
    size:           24,
};

/* Export Component ==================================================================== */
export default Checkbox;
