/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 13:30:00
 * @Last Modified by: Mazen Chami
 * @Last Modified time: 2018-07-12 14:05:00
 */

/**
 * Fathom Slider
 *
    <FathomSlider
        handleFormChange={this._handleFormChange}
        maximumValue={9}
        minimumValue={0}
        name={'string'}
        value={value}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'react-native-elements';

import { AppColors } from '../../constants/';

/* Component ==================================================================== */
const FathomSlider = ({
    bodyPart,
    handleFormChange,
    maximumValue,
    minimumValue,
    name,
    step,
    thumbTintColor,
    value,
}) => (
    <Slider
        maximumValue={maximumValue}
        minimumValue={minimumValue}
        onSlidingComplete={val => handleFormChange(name, val, bodyPart)}
        step={step}
        thumbTintColor={thumbTintColor}
        value={value}
    />
);

FathomSlider.propTypes = {
    bodyPart:         PropTypes.number,
    handleFormChange: PropTypes.func.isRequired,
    maximumValue:     PropTypes.number.isRequired,
    minimumValue:     PropTypes.number.isRequired,
    name:             PropTypes.string.isRequired,
    step:             PropTypes.number,
    thumbTintColor:   PropTypes.string,
    value:            PropTypes.number.isRequired,
};
FathomSlider.defaultProps = {
    step:           1,
    thumbTintColor: AppColors.secondary.blue.hundredPercent,
};

/* Export Component ==================================================================== */
export default FathomSlider;
