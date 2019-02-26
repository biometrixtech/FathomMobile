/**
 * ActiveRecoveryBlocks
 *
    <ActiveRecoveryBlocks
        after={true}
        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
        isCalculating={true}
        isSessionsModalOpen={this.state.isPrepareSessionsCompletionModalOpen}
        recoveryObj={recoveryObj}
        toggleActiveTimeSlideUpPanel={this._toggleActiveTimeSlideUpPanel}
        user={user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, TouchableHighlight, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, MyPlan as MyPlanConstants, } from '../../../constants';
import { Spacer, TabIcon, Text, Tooltip, } from '../../custom';

const tooltipText = 'Don’t have a foam roller? You can use a water bottle or tennis ball instead!';

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

/* Components ==================================================================== */
const TooltipContent = ({ handleTooltipClose, text, }) => (
    <View style={{padding: AppSizes.paddingSml,}}>
        <Text robotoLight style={{color: AppColors.black, fontSize: AppFonts.scaleFont(18),}}>
            {text}
        </Text>
        <Spacer size={AppSizes.paddingSml} />
        <TouchableOpacity
            onPress={handleTooltipClose}
            style={{alignSelf: 'flex-end',}}
        >
            <Text
                robotoMedium
                style={{
                    color:    AppColors.zeplin.yellow,
                    fontSize: AppFonts.scaleFont(15),
                }}
            >
                {'GOT IT'}
            </Text>
        </TouchableOpacity>
    </View>
);

class ActiveRecoveryBlocks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEquipmentTooltipOpen: false,
        };
    }

    _displayEquipmentText = (equipmentRequired , isDisabled) => {
        let equipmentText = [];
        if(equipmentRequired && equipmentRequired.length >= 3 && this.state.isEquipmentTooltipOpen) {
            _.map(equipmentRequired, (item, i) =>
                equipmentText.push(
                    <Text key={i} oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>
                        {item.toUpperCase()}
                    </Text>
                )
            )
        } else if(equipmentRequired && equipmentRequired.length > 0) {
            if(equipmentRequired[0]) {
                equipmentText.push(
                    <Text key={0} oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>
                        {equipmentRequired[0].toUpperCase()}
                    </Text>
                );
            }
            if(equipmentRequired[1]) {
                equipmentText.push(
                    <Text key={1} oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>
                        {equipmentRequired[1].toUpperCase()}
                    </Text>
                );
            }
            if(equipmentRequired[2]) {
                equipmentText.push(
                    <Text key={2} oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>
                        {equipmentRequired[2].toUpperCase() + '...'}
                    </Text>
                );
            }
        } else {
            equipmentText.push(<Text key={0} oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(28),}}>{' '}</Text>);
        }
        return equipmentText;
    };

    render = () => {
        const {
            after,
            isFunctionalStrength,
            recoveryObj,
            toggleActiveTimeSlideUpPanel,
        } = this.props;
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
        let { equipmentRequired, } = MyPlanConstants.cleanExerciseList(recoveryObj);
        return(
            <View style={{flexDirection: 'row',}}>
                <View style={isDisabled ? [customStyles.recoverBlocksDisabledWrapper, {flex: 3,}] : [customStyles.recoverBlocksActiveWrapper, {flex: 3,}, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                    <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), paddingBottom: 5,}}>{'WHEN'}</Text>
                    <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                        <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>{`ANYTIME\n${after ? 'AFTER' : 'BEFORE'}\nTRAINING`}</Text>
                    </View>
                </View>
                <View
                    style={
                        isDisabled ?
                            [customStyles.recoverBlocksDisabledWrapper, {flex: 3.5,}]
                            :
                            [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, {flex: 3.5,}, Platform.OS === 'ios' ? {} : {elevation: 2,}]
                    }
                >
                    <TouchableHighlight
                        onPress={() => toggleActiveTimeSlideUpPanel ? toggleActiveTimeSlideUpPanel() : null}
                        style={{flex: 1,}}
                        underlayColor={isDisabled ? AppColors.white : AppColors.zeplin.superLight}
                    >
                        <View style={{flex: 1,}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingRight: AppSizes.paddingSml,}}>
                                <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), }}>{'ACTIVE TIME'}</Text>
                                { isDisabled && !toggleActiveTimeSlideUpPanel ?
                                    null
                                    :
                                    <TabIcon
                                        color={recoveryObj.completed ? AppColors.zeplin.lightSlate : AppColors.zeplin.yellow}
                                        icon={'pencil'}
                                        iconStyle={[{marginLeft: AppSizes.paddingXSml,}]}
                                        size={24}
                                        type={'material-community'}
                                    />
                                }
                            </View>
                            <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                                <View style={{backgroundColor: isDisabled ? AppColors.zeplin.light : AppColors.transparent, borderRadius: 3,}}>
                                    <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(28),}}>
                                        {isDisabled ? '00' : `${recoveryObj && recoveryObj.minutes_duration ? recoveryObj.minutes_duration : '0'}`}
                                    </Text>
                                </View>
                                <View style={{alignItems: 'flex-start', flex: 1, paddingBottom: isDisabled ? 0 : AppSizes.paddingXSml, paddingLeft: AppSizes.paddingSml,}}>
                                    <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(12),}}>{'MINS'}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
                <Tooltip
                    animated
                    childrenViewStyle={[{flex: 3.5,}]}
                    content={
                        <TooltipContent
                            handleTooltipClose={() => this.setState({ isEquipmentTooltipOpen: false, })}
                            text={tooltipText}
                        />
                    }
                    isVisible={this.state.isEquipmentTooltipOpen}
                    onClose={() => {}}
                    tooltipStyle={{left: 30, width: (AppSizes.screen.width - 60),}}
                >
                    <View style={
                        isDisabled ?
                            [customStyles.recoverBlocksDisabledWrapper,]
                            :
                            [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]
                    }>
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5, paddingRight: AppSizes.paddingSml,}}>
                            <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14),}}>{'EQUIPMENT'}</Text>
                            { isDisabled && !toggleActiveTimeSlideUpPanel ?
                                null
                                :
                                <TabIcon
                                    color={recoveryObj.completed ? AppColors.zeplin.lightSlate : AppColors.zeplin.yellow}
                                    icon={'help'}
                                    iconStyle={[{marginLeft: AppSizes.paddingXSml,}]}
                                    onPress={() => this.setState({ isEquipmentTooltipOpen: true, },)}
                                    size={24}
                                    type={'material'}
                                />
                            }
                        </View>
                        <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                            <View style={[isDisabled ? {flex: 1, marginRight: 10,} : {}, {backgroundColor: isDisabled ? AppColors.zeplin.light : AppColors.transparent, borderRadius: 3,}]}>
                                {this._displayEquipmentText(equipmentRequired, isDisabled)}
                            </View>
                        </View>
                    </View>
                </Tooltip>
            </View>
        )
    }
}

ActiveRecoveryBlocks.propTypes = {
    after:                           PropTypes.bool,
    handleUpdateFirstTimeExperience: PropTypes.func,
    isCalculating:                   PropTypes.bool,
    isFunctionalStrength:            PropTypes.bool,
    isSessionsModalOpen:             PropTypes.bool,
    recoveryObj:                     PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool,
    ]),
    toggleActiveTimeSlideUpPanel: PropTypes.func,
    user:                         PropTypes.object,
};

ActiveRecoveryBlocks.defaultProps = {
    after:                           false,
    handleUpdateFirstTimeExperience: null,
    isCalculating:                   false,
    isFunctionalStrength:            false,
    isSessionsModalOpen:             false,
    recoveryObj:                     false,
    toggleActiveTimeSlideUpPanel:    null,
    user:                            null,
};

ActiveRecoveryBlocks.componentName = 'ActiveRecoveryBlocks';

/* Export Component ================================================================== */
export default ActiveRecoveryBlocks;
