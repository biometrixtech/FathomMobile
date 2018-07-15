/*
 * @Author: Mazen Chami
 * @Date: 2018-07-13 17:42:00
 * @Last Modified by: Mazen Chami
 * @Last Modified time: 2018-07-13 17:42:00
 */

/**
 * Checkbox Icon
 *
    <Checkbox
        checked={checked}
        containerStyle={{backgroundColor: AppColors.white, borderWidth: 0}}
        onPress={onPress}
        size={24}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { CheckBox } from 'react-native-elements';

import { AppColors } from '../../constants/';

/* Component ==================================================================== */
const Checkbox = ({
    checked,
    containerStyle,
    onPress,
    size,
}) => (
    <CheckBox
        checked={checked}
        containerStyle={containerStyle}
        onPress={onPress}
        size={size}
    />
);

Checkbox.propTypes = {
    checked:        PropTypes.bool.isRequired,
    containerStyle: PropTypes.object,
    onPress:        PropTypes.func.isRequired,
    size:           PropTypes.number,
};
Checkbox.defaultProps = {
    containerStyle: {},
    size:           24,
};

/* Export Component ==================================================================== */
export default Checkbox;
