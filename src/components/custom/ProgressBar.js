/*
 * @Author: Mazen Chami
 * @Date: 2018-06-29 11:28:39
 * @Last Modified by: Mazen Chami
 * @Last Modified time: 2018-07-02 16:54:00
 */

/**
 * ProgressBar
 *
    <ProgressBar
        currentStep={step}
        totalSteps={totalSteps}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes } from '../../constants';

/* Component ==================================================================== */
const ProgressBar = ({ currentStep, totalSteps }) => (
    <View
        style={{
            backgroundColor: AppColors.primary.grey.thirtyPercent,
            width:           AppSizes.screen.width,
        }}
    >
        <View
            style={{
                backgroundColor: AppColors.primary.grey.hundredPercent,
                width:           (currentStep / totalSteps) * 100,
                height:          10,
            }}
        />
    </View>
);

ProgressBar.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps:  PropTypes.number.isRequired,
};
ProgressBar.defaultProps = {};
ProgressBar.componentName = 'ProgressBar';

/* Export Component ==================================================================== */
export default ProgressBar;
