/**
 * ActiveRecoveryBlocks
 *
    <ActiveRecoveryBlocks
        after={true}
        isFunctionalStrength={true}
        recoveryObj={recoveryObj}
        toggleActiveTimeSlideUpPanel={this._toggleActiveTimeSlideUpPanel}
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
        padding:         10,
    },
    recoverBlocksActiveWrapper: {
        backgroundColor: AppColors.zeplin.superLight,
        borderColor:     AppColors.zeplin.superLight,
        borderRadius:    5,
        borderWidth:     1,
        padding:         10,
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
                        {`${equipmentRequired[2].toUpperCase()} ${equipmentRequired.length > 3 ? '...' : ''}`}
                    </Text>
                );
            }
        } else {
            equipmentText.push(<Text key={0} oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>{'FOAM ROLLER'}</Text>);
            equipmentText.push(<Text key={1} oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>{'BAND'}</Text>);
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
        let isDisabled = !recoveryObj && !recoveryObj.minutes_duration;
        let { equipmentRequired, } = MyPlanConstants.cleanExerciseList(recoveryObj);
        if(isFunctionalStrength) {
            return(
                <View style={{flex: 1, flexDirection: 'row', marginRight: 9,}}>
                    <View
                        style={[
                            isDisabled ?
                                [customStyles.recoverBlocksDisabledWrapper, {flex: 1, paddingRight: 10,}]
                                :
                                [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {flex: 1, paddingLeft: 13,}],
                            {marginRight: 9,}
                        ]}
                    >
                        <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), paddingBottom: 5,}}>{'WHAT'}</Text>
                        <View style={{backgroundColor: isDisabled ? AppColors.zeplin.superLight : AppColors.transparent,}}>
                            <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.superLight : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>{'DYNAMIC MOVEMENTS\nTO IMPROVE STRENGTH\n& POWER EFFICIENCY'}</Text>
                        </View>
                    </View>
                    <View
                        style={[
                            isDisabled ?
                                [customStyles.recoverBlocksDisabledWrapper, {flex: 1, marginRight: 9, paddingRight: 10,}]
                                :
                                [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {flex: 1, paddingLeft: 13,}]
                        ]}
                    >
                        <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), paddingBottom: 5,}}>
                            {(recoveryObj && recoveryObj.minutes_duration) || !recoveryObj ? 'ACTIVE TIME' : 'WHEN'}
                        </Text>
                        <View style={{alignItems: 'flex-end', backgroundColor: isDisabled ? AppColors.zeplin.superLight : AppColors.transparent, flex: 1, flexDirection: 'row',}}>
                            { recoveryObj && recoveryObj.minutes_duration ?
                                <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                                    <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(32),}}>{`${parseFloat(recoveryObj.minutes_duration).toFixed(1)}`}</Text>
                                    <View style={{alignItems: 'flex-start', flex: 1, paddingBottom: AppSizes.paddingXSml, paddingLeft: AppSizes.paddingSml,}}>
                                        <Text oswaldMedium style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(15),}}>{'MINS'}</Text>
                                    </View>
                                </View>
                                : !recoveryObj ?
                                    <Text>{' '}</Text>
                                    :
                                    <View style={{flex: 1,}}>
                                        <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                                            <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(32),}}>{'10-15'}</Text>
                                            <View style={{alignItems: 'flex-start', flex: 1, paddingBottom: AppSizes.paddingXSml, paddingLeft: AppSizes.paddingSml,}}>
                                                <Text oswaldMedium style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(15),}}>{'MINS'}</Text>
                                            </View>
                                        </View>
                                        <Text oswaldMedium style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14),}}>{'TWICE PER WEEK'}</Text>
                                    </View>
                            }
                        </View>
                    </View>
                </View>
            );
        }
        return(
            <View style={{flex: 1, flexDirection: 'row', marginRight: 9,}}>

                <View
                    style={[
                        isDisabled ?
                            [customStyles.recoverBlocksDisabledWrapper]
                            :
                            [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}],
                        {flex: 2.5,},
                    ]}
                >
                    <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), paddingBottom: 5,}}>{'WHEN'}</Text>
                    <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                        <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>{`ANYTIME\n${after ? 'AFTER' : 'BEFORE'}\nTRAINING`}</Text>
                    </View>
                </View>

                <View style={{flex: 0.25,}} />

                <TouchableHighlight
                    onPress={() => toggleActiveTimeSlideUpPanel ? toggleActiveTimeSlideUpPanel() : null}
                    style={[
                        isDisabled ?
                            [customStyles.recoverBlocksDisabledWrapper]
                            :
                            [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}],
                        {flex: 3.5, paddingBottom: 5,},
                    ]}
                    underlayColor={isDisabled ? AppColors.white : AppColors.zeplin.superLight}
                >
                    <View style={{flex: 1,}}>
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',}}>
                            <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14),}}>{'ACTIVE TIME'}</Text>
                            { isDisabled && !toggleActiveTimeSlideUpPanel ?
                                null
                                :
                                <TabIcon
                                    color={recoveryObj.completed ? AppColors.zeplin.lightSlate : AppColors.zeplin.yellow}
                                    icon={'pencil'}
                                    size={20}
                                    type={'material-community'}
                                />
                            }
                        </View>
                        <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row',}}>
                            <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(32),}}>
                                {isDisabled ? '15' : `${recoveryObj && recoveryObj.minutes_duration ? recoveryObj.minutes_duration : '0'}`}
                            </Text>
                            <View style={{alignItems: 'flex-start', flex: 1, paddingBottom: AppSizes.paddingXSml, paddingLeft: AppSizes.paddingSml,}}>
                                <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(15),}}>{'MINS'}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>

                <View style={{flex: 0.25,}} />

                <TouchableHighlight
                    onPress={isDisabled || !toggleActiveTimeSlideUpPanel ? null : () => this.setState({ isEquipmentTooltipOpen: true, },)}
                    style={{flex: 3.5,}}
                    underlayColor={AppColors.transparent}
                >
                    <Tooltip
                        animated
                        childrenViewStyle={{flex: 1,}}
                        content={
                            <TooltipContent
                                handleTooltipClose={() => this.setState({ isEquipmentTooltipOpen: false, })}
                                text={tooltipText}
                            />
                        }
                        isVisible={this.state.isEquipmentTooltipOpen}
                        onClose={() => {}}
                        parentViewStyle={{flex: 1,}}
                        tooltipStyle={{left: 30, width: (AppSizes.screen.width - 60),}}
                    >
                        <View
                            style={[
                                isDisabled ?
                                    [customStyles.recoverBlocksDisabledWrapper,]
                                    :
                                    [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}],
                                {flex: 1, paddingBottom: 5,},
                            ]}
                        >
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',}}>
                                <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14),}}>{'EQUIPMENT'}</Text>
                                { isDisabled && !toggleActiveTimeSlideUpPanel ?
                                    null
                                    :
                                    <TabIcon
                                        color={recoveryObj.completed ? AppColors.zeplin.lightSlate : AppColors.zeplin.yellow}
                                        icon={'help'}
                                        size={20}
                                        type={'material'}
                                    />
                                }
                            </View>
                            <View style={{alignItems: 'flex-end', flex: 1, flexDirection: 'row', paddingBottom: AppSizes.paddingXSml,}}>
                                <View style={{flex: 1,}}>
                                    {this._displayEquipmentText(equipmentRequired, isDisabled)}
                                </View>
                            </View>
                        </View>
                    </Tooltip>
                </TouchableHighlight>

            </View>
        );
    }
}

ActiveRecoveryBlocks.propTypes = {
    after:                PropTypes.bool,
    isFunctionalStrength: PropTypes.bool,
    recoveryObj:          PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool,
    ]),
    toggleActiveTimeSlideUpPanel: PropTypes.func,
};

ActiveRecoveryBlocks.defaultProps = {
    after:                        false,
    isFunctionalStrength:         false,
    recoveryObj:                  false,
    toggleActiveTimeSlideUpPanel: null,
};

ActiveRecoveryBlocks.componentName = 'ActiveRecoveryBlocks';

/* Export Component ================================================================== */
export default ActiveRecoveryBlocks;
