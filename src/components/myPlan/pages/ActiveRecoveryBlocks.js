/**
 * ActiveRecoveryBlocks
 *
    <ActiveRecoveryBlocks
        after={true}
        isCalculating={true}
        recoveryObj={recoveryObj}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../../constants';
import { Text, } from '../../custom';

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
    recoverBlocksDisabledWrapper: {
        backgroundColor: AppColors.white,
        borderColor:     AppColors.zeplin.lightGrey,
        borderRadius:    5,
        borderWidth:     1,
        flex:            1,
        marginRight:     9,
        paddingBottom:   10,
        paddingLeft:     10,
        paddingTop:      7,
    },
    recoverBlocksActiveWrapper: {
        backgroundColor: AppColors.zeplin.superLight,
        borderColor:     AppColors.zeplin.superLight,
        borderRadius:    5,
        borderWidth:     1,
        flex:            1,
        marginRight:     9,
        paddingBottom:   10,
        paddingLeft:     10,
        paddingTop:      7,
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { height: 3, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  4,
    },
});

/* Component ==================================================================== */
const ActiveRecoveryBlocks = ({
    after,
    isCalculating,
    isFunctionalStrength,
    recoveryObj,
}) => {
    if(isFunctionalStrength) {
        return(
            <View style={{flexDirection: 'row',}}>
                <View style={[customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {paddingLeft: 13,}]}>
                    <Text oswaldMedium style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), paddingBottom: 5,}}>{'WHEN'}</Text>
                    <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(20),}}>{'ANYTIME DURING THE DAY'}</Text>
                </View>
                <View style={[customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {marginRight: 10, paddingLeft: 13,}]}>
                    <Text oswaldMedium style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), paddingBottom: 5,}}>{'ACTIVE TIME'}</Text>
                    <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                        <View style={{backgroundColor: AppColors.transparent, borderRadius: 3,}}>
                            <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(28),}}>{`${parseFloat(recoveryObj.minutes_duration).toFixed(1)}`}</Text>
                        </View>
                        <View style={{alignItems: 'flex-start', flex: 1, paddingBottom: AppSizes.paddingXSml, paddingLeft: AppSizes.paddingSml,}}>
                            <Text oswaldMedium style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(12),}}>{'MINS'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
    let isDisabled = !recoveryObj && !recoveryObj.minutes_duration && !recoveryObj.impact_score;
    return(
        <View style={{flexDirection: 'row',}}>
            <View style={isDisabled ? [customStyles.recoverBlocksDisabledWrapper] : [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), paddingBottom: 5,}}>{'WHEN'}</Text>
                <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>{`ANYTIME\n${after ? 'AFTER' : 'BEFORE'}\nTRAINING`}</Text>
            </View>
            <View style={isDisabled ? [customStyles.recoverBlocksDisabledWrapper] : [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), paddingBottom: 5,}}>{'ACTIVE TIME'}</Text>
                <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                    <View style={{backgroundColor: isDisabled ? AppColors.zeplin.light : AppColors.transparent, borderRadius: 3,}}>
                        <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(28),}}>
                            {isDisabled ? '00' : `${recoveryObj && recoveryObj.minutes_duration ? parseFloat(recoveryObj.minutes_duration).toFixed(1) : '0'}`}
                        </Text>
                    </View>
                    <View style={{alignItems: 'flex-start', flex: 1, paddingBottom: isDisabled ? 0 : AppSizes.paddingXSml, paddingLeft: AppSizes.paddingSml,}}>
                        <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(12),}}>{'MINS'}</Text>
                    </View>
                </View>
            </View>
            <View style={isDisabled ? [customStyles.recoverBlocksDisabledWrapper, {marginRight: 10,}] : [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, {marginRight: 10,}, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                <Text oswaldMedium style={{ color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, paddingBottom: 5, fontSize: AppFonts.scaleFont(14),}}>{'IMPACT SCORE'}</Text>
                <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                    <View style={{backgroundColor: isDisabled ? AppColors.zeplin.light : AppColors.transparent, borderRadius: 3,}}>
                        <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(28),}}>
                            {isDisabled ? '00' : `${recoveryObj && recoveryObj.impact_score ? parseFloat(recoveryObj.impact_score).toFixed(1) : '0'}`}
                        </Text>
                    </View>
                    <View style={{alignItems: 'flex-start', flex: 1, paddingBottom: isDisabled ? 0 : AppSizes.paddingXSml, paddingLeft: AppSizes.paddingSml,}}>
                        <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(12),}}>{'/ 5'}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

ActiveRecoveryBlocks.propTypes = {
    after:                PropTypes.bool,
    isCalculating:        PropTypes.bool,
    isFunctionalStrength: PropTypes.bool,
    recoveryObj:          PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool,
    ]),
};

ActiveRecoveryBlocks.defaultProps = {
    after:                false,
    isCalculating:        false,
    isFunctionalStrength: false,
    recoveryObj:          false,
};

ActiveRecoveryBlocks.componentName = 'ActiveRecoveryBlocks';

/* Export Component ================================================================== */
export default ActiveRecoveryBlocks;
