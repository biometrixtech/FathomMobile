/*
 * @Author: Mazen Chami
 * @Date: 2018-06-29 11:28:39
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:25:47
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
const ProgressBar = ({ currentStep, totalSteps, }) => (
    <View
        style={{
            backgroundColor: AppColors.primary.grey.thirtyPercent,
            width:           AppSizes.screen.width,
        }}
    >
        <View
            style={{
                backgroundColor: AppColors.zeplin.yellow,
                height:          AppSizes.screen.progressBarHeight,
                width:           `${(currentStep / totalSteps) * 100}%`,
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
