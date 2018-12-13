/**
 * ProgressPill
 *
    <ProgressPill
        currentStep={1}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, } from '../../../constants';

const progressPillHeight = AppSizes.screen.height * 0.08;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    progressPill: {
        backgroundColor: AppColors.border,
        borderRadius:    5,
        height:          10,
        width:           35,
    },
    progressPillCurrent: {
        backgroundColor: AppColors.primary.yellow.hundredPercent,
    },
    progressPillWrapper: {
        alignItems:     'center',
        flex:           1,
        flexDirection:  'row',
        height:         progressPillHeight,
        justifyContent: 'center',
    },
});

/* Component ==================================================================== */
const ProgressPill = ({
    currentStep,
    totalSteps,
}) => {
    let pills = [];
    for (let i = 0; i < totalSteps; i += 1) {
        pills.push(
            <View
                key={i}
                style={
                    [
                        styles.progressPill,
                        (i + 1) === totalSteps ? {} : {marginRight: 2},
                        currentStep >= (i + 1) ? styles.progressPillCurrent : {}
                    ]
                }
            />
        );
    }
    return(
        <View style={{backgroundColor: AppColors.zeplin.progressPillBackground, height: (progressPillHeight + AppSizes.statusBarHeight),}}>
            <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
            <View style={[styles.progressPillWrapper]}>
                {pills}
            </View>
        </View>
    )
};

ProgressPill.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps:  PropTypes.number.isRequired,
};

ProgressPill.defaultProps = {};

ProgressPill.componentName = 'ProgressPill';

/* Export Component ================================================================== */
export default ProgressPill;