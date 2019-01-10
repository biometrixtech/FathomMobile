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
            isAllGoodTooltipOpen: false,
        };
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { isSessionsModalOpen, user, } = this.props;
        if(!this.state.isAllGoodTooltipOpen && user) {
            if(user && !user.first_time_experience.includes('active_time_tooltip') && !isSessionsModalOpen) {
                _.delay(() => {
                    this.setState({ isAllGoodTooltipOpen: true, });
                }, 500);
            }
        }
    }

    _handleTooltipClose = () => {
        const { handleUpdateFirstTimeExperience, toggleActiveTimeSlideUpPanel, } = this.props;
        handleUpdateFirstTimeExperience('active_time_tooltip');
        this.setState(
            { isAllGoodTooltipOpen: false, },
            () => {
                toggleActiveTimeSlideUpPanel();
            }
        );
    }

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
        return(
            <View style={{flexDirection: 'row',}}>
                <View style={isDisabled ? [customStyles.recoverBlocksDisabledWrapper] : [customStyles.recoverBlocksActiveWrapper, customStyles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}]}>
                    <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(14), paddingBottom: 5,}}>{'WHEN'}</Text>
                    <Text oswaldMedium style={{color: isDisabled ? AppColors.zeplin.light : AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(14),}}>{`ANYTIME\n${after ? 'AFTER' : 'BEFORE'}\nTRAINING`}</Text>
                </View>
                <Tooltip
                    animated
                    childrenViewStyle={
                        isDisabled ?
                            [customStyles.recoverBlocksDisabledWrapper]
                            :
                            [
                                customStyles.recoverBlocksActiveWrapper,
                                customStyles.shadowEffect,
                                Platform.OS === 'ios' ? {} : {elevation: 2,}
                            ]
                    }
                    content={
                        <TooltipContent
                            handleTooltipClose={() => this._handleTooltipClose()}
                            text={MyPlanConstants.userSelectedActiveTimeMessage()}
                        />
                    }
                    isVisible={this.state.isAllGoodTooltipOpen}
                    onClose={() => {}}
                    tooltipStyle={{left: 30, width: (AppSizes.screen.width - 60),}}
                >
                    <TouchableHighlight
                        onPress={() => toggleActiveTimeSlideUpPanel ? toggleActiveTimeSlideUpPanel() : null}
                        style={[
                            this.state.isAllGoodTooltipOpen ?
                                [
                                    customStyles.recoverBlocksActiveWrapper,
                                    customStyles.shadowEffect,
                                    Platform.OS === 'ios' ? {} : {elevation: 2,}
                                ]
                                :
                                {flex: 1,}
                        ]}
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
                                        iconStyle={[{paddingLeft: AppSizes.paddingSml,}]}
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
                </Tooltip>
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
