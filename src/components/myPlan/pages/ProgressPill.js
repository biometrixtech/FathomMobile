/**
 * ProgressPill
 *
    <ProgressPill
        currentStep={1}
        onBack={() => {}}
        onClose={() => {}}
        onNext={() => {}}
        totalSteps={3}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, } from '../../../constants';
import { TabIcon, } from '../../custom';

const progressPillHeight = AppSizes.progressPillsHeight;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    mainWrapper: {
        backgroundColor: AppColors.zeplin.progressPillBackground,
        height:          (progressPillHeight + AppSizes.statusBarHeight),
    },
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
        flex:           8,
        flexDirection:  'row',
        height:         progressPillHeight,
        justifyContent: 'center',
    },
});

/* Component ==================================================================== */
const ProgressPill = ({
    currentStep,
    onBack,
    onClose,
    onNext,
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
        <View
            style={[styles.mainWrapper,]}
        >
            <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
            <View style={{flex: 1, flexDirection: 'row',}}>
                <View style={{flex: 1, justifyContent: 'center',}}>
                    { onBack ?
                        <TabIcon
                            containerStyle={[{paddingLeft: AppSizes.paddingMed,}]}
                            color={AppColors.zeplin.blueGrey}
                            icon={'arrow-left'}
                            onPress={() => onBack()}
                            raised={false}
                            type={'simple-line-icon'}
                        />
                        :
                        null
                    }
                </View>
                <View style={[styles.progressPillWrapper]}>
                    {pills}
                </View>
                <View style={{flex: 1, justifyContent: 'center',}}>
                    { onClose ?
                        <TabIcon
                            containerStyle={[{paddingRight: AppSizes.paddingMed,}]}
                            color={AppColors.zeplin.blueGrey}
                            icon={'close'}
                            onPress={() => onClose()}
                            raised={false}
                            type={'material-community'}
                        />
                        : onNext ?
                            <TabIcon
                                containerStyle={[{paddingRight: AppSizes.paddingMed,}]}
                                color={AppColors.zeplin.blueGrey}
                                icon={'arrow-right'}
                                onPress={() => onNext()}
                                raised={false}
                                type={'simple-line-icon'}
                            />
                            :
                            null
                    }
                </View>
            </View>
        </View>
    )
};

ProgressPill.propTypes = {
    currentStep: PropTypes.number.isRequired,
    onBack:      PropTypes.func,
    onClose:     PropTypes.func,
    onNext:      PropTypes.func,
    totalSteps:  PropTypes.number.isRequired,
};

ProgressPill.defaultProps = {
    onBack:  null,
    onClose: null,
    onNext:  null,
};

ProgressPill.componentName = 'ProgressPill';

/* Export Component ================================================================== */
export default ProgressPill;