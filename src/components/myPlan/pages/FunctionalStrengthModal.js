/**
 * Functional Strength Modal
 *
     <FunctionalStrengthModal
          isFirstFunctionalStrength={isFirstFunctionalStrength}
          isSecondFunctionalStrength={isSecondFunctionalStrength}
          user={this.props.user}
     />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import Modal from 'react-native-modalbox';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Spacer, TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

const step0CircleSize = ((AppSizes.screen.width - (AppSizes.padding * 6)) / 3);

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    lockIconStyle: {
        alignSelf:      'center',
        justifyContent: 'center',
    },
    lockIconWrapperStyle: {
        alignItems:      'center',
        alignSelf:       'center',
        backgroundColor: AppColors.zeplin.seaBlue,
        borderRadius:    AppFonts.scaleFont(40) / 2,
        height:          AppFonts.scaleFont(40),
        justifyContent:  'center',
        width:           AppFonts.scaleFont(40),
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 3 },
        shadowRadius:  6,
        shadowOpacity: 1,
    },
    step0Circle: {
        alignSelf:         'center',
        backgroundColor:   AppColors.zeplin.superLight,
        borderRadius:      step0CircleSize / 2,
        height:            step0CircleSize,
        justifyContent:    'center',
        marginBottom:      20,
        paddingHorizontal: AppSizes.paddingSml,
        width:             step0CircleSize,
    },
});

/* Component ==================================================================== */
const FunctionalStrengthModal = ({
    dailyReadiness,
    functionalStrengthTodaySubtext,
    handleFormChange,
    isFirstFunctionalStrength,
    isSecondFunctionalStrength,
    selectedSportPositions,
    typicalSessions,
    user,
}) => (
    <Modal style={{flex: 1,}}>
        { isFirstFunctionalStrength ?
            <ScrollView
                bounces={false}
                nestedScrollEnabled={true}
                overScrollMode={'never'}
                ref={ref => {this.scrollViewActivityTargetRef = ref}}
                style={{flex: 1,}}
            >
                { isFirstFunctionalStrength &&
                    <View style={{flex: 1,}}>
                        <Spacer size={50} />
                        <View style={[styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {alignSelf: 'center', backgroundColor: AppColors.white, borderRadius: 5, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingMed, width: AppSizes.screen.widthFourFifths,}]}>
                            <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(32),}]}>{`CONGRATS ${user.personal_data.first_name.toUpperCase()}!`}</Text>
                            <Spacer size={15} />
                            <TabIcon
                                color={AppColors.white}
                                containerStyle={[styles.lockIconWrapperStyle,]}
                                icon={'lock-open-outline'}
                                iconStyle={[styles.lockIconStyle,]}
                                raised={false}
                                size={AppFonts.scaleFont(26)}
                                type={'material-community'}
                            />
                            <Spacer size={15} />
                            <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(22),}]}>{'You\'ve unlocked\nFunctional Strength!'}</Text>
                        </View>
                        <Spacer size={60} />
                        <View>
                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                {'What activity would you like to target?'}
                            </Text>
                            <Spacer size={10} />
                            <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: AppSizes.padding, paddingHorizontal: AppSizes.paddingSml,}}>
                                { _.map(typicalSessions, (session, i) => {
                                    let FSOptions = PlanLogic.handleFunctionalStrengthOptions(session);
                                    let isSport = FSOptions.isSport;
                                    let isStrengthConditioning = FSOptions.isStrengthConditioning;
                                    let sessionName = FSOptions.sessionName;
                                    let isSelected = false;
                                    if(isSport) {
                                        isSelected = dailyReadiness.current_sport_name === session.sport_name;
                                    } else if(isStrengthConditioning) {
                                        isSelected = dailyReadiness.current_sport_name === null && dailyReadiness.current_position === session.strength_and_conditioning_type;
                                    }
                                    return(
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => {
                                                if(isSport) {
                                                    if(isSelected) {
                                                        handleFormChange('current_sport_name', null);
                                                        handleFormChange('current_position', null);
                                                    } else {
                                                        handleFormChange('current_sport_name', session.sport_name);
                                                        handleFormChange('current_position', null);
                                                        let currentSportPositions = _.find(MyPlanConstants.teamSports, o => o.index === session.sport_name).positions;
                                                        if(currentSportPositions && currentSportPositions.length > 0) {
                                                            this._scrollTo(this.positionsComponents[0], this.scrollViewActivityTargetRef);
                                                        } else {
                                                            this._scrollTo(this.myActivityTargetComponents[0], this.scrollViewActivityTargetRef);
                                                        }
                                                    }
                                                } else if(isStrengthConditioning) {
                                                    if(isSelected) {
                                                        handleFormChange('current_sport_name', null);
                                                        handleFormChange('current_position', null);
                                                    } else {
                                                        handleFormChange('current_sport_name', null);
                                                        handleFormChange('current_position', session.strength_and_conditioning_type);
                                                        this._scrollToBottom(this.scrollViewActivityTargetRef);
                                                    }
                                                }
                                            }}
                                            style={[
                                                styles.step0Circle,
                                                styles.shadowEffect,
                                                Platform.OS === 'ios' ? {} : {elevation: 2,},
                                                ((i + 1) % 3 === 0) ? {} : {marginRight: AppSizes.padding,},
                                                isSelected ? {backgroundColor: AppColors.zeplin.yellow,} : {},
                                            ]}
                                        >
                                            <Text oswaldMedium style={{color: isSelected ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>
                                                {sessionName.toUpperCase()}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                        <View onLayout={event => {this.positionsComponents[0] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y}}}>
                            { dailyReadiness.current_sport_name !== null && selectedSportPositions && selectedSportPositions.length > 0 ?
                                <View>
                                    <Spacer size={70} />
                                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                        {'What is your primary position in '}
                                        <Text robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                            {PlanLogic.handleFunctionalStrengthOptions({ sport_name: dailyReadiness.current_sport_name, }).sessionName.toLowerCase()}
                                        </Text>
                                        {'?'}
                                    </Text>
                                    <Spacer size={10} />
                                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: AppSizes.padding, paddingHorizontal: AppSizes.paddingSml,}}>
                                        { _.map(selectedSportPositions, (position, i) => {
                                            let isSelected = dailyReadiness.current_position === i;
                                            return(
                                                <TouchableOpacity
                                                    key={i}
                                                    onPress={() => {
                                                        handleFormChange('current_position', i);
                                                        this._scrollToBottom(this.scrollViewActivityTargetRef);
                                                    }}
                                                    style={[
                                                        styles.step0Circle,
                                                        styles.shadowEffect,
                                                        Platform.OS === 'ios' ? {} : {elevation: 2,},
                                                        ((i + 1) % 3 === 0) ? {} : {marginRight: AppSizes.padding,},
                                                        isSelected ? {backgroundColor: AppColors.zeplin.yellow,} : {},
                                                    ]}
                                                >
                                                    <Text oswaldMedium style={{color: isSelected ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>
                                                        {position.toUpperCase()}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                                :
                                null
                            }
                        </View>
                        <View onLayout={event => {this.myActivityTargetComponents[0] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y, height: event.nativeEvent.layout.height,}}}>
                            <Spacer size={100} />
                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                {'Would you like to add functional strength to your training plan today?'}
                            </Text>
                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}]}>
                                {functionalStrengthTodaySubtext}
                            </Text>
                            <Spacer size={10} />
                            <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: AppSizes.padding, paddingHorizontal: AppSizes.paddingSml,}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleFormChange('wants_functional_strength', true);
                                        this._checkNextStep(1);
                                    }}
                                    style={[
                                        styles.step0Circle,
                                        styles.shadowEffect,
                                        Platform.OS === 'ios' ? {} : {elevation: 2,},
                                        {marginRight: AppSizes.padding,},
                                        dailyReadiness.wants_functional_strength ? {backgroundColor: AppColors.zeplin.yellow,} : {},
                                    ]}
                                >
                                    <Text oswaldMedium style={{color: dailyReadiness.wants_functional_strength ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                                        {'YES'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleFormChange('wants_functional_strength', false);
                                        this._checkNextStep(1);
                                    }}
                                    style={[
                                        styles.step0Circle,
                                        styles.shadowEffect,
                                        Platform.OS === 'ios' ? {} : {elevation: 2,},
                                        dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? {} : {backgroundColor: AppColors.zeplin.yellow,},
                                    ]}
                                >
                                    <Text oswaldMedium style={{color: dailyReadiness.wants_functional_strength || dailyReadiness.wants_functional_strength === null ? AppColors.zeplin.blueGrey : AppColors.white, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                                        {'NO'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Spacer size={50} />
                    </View>
                }
            </ScrollView>
            :
            null
        }
        { isSecondFunctionalStrength ?
            <View style={{flex: 1,}}>
                <ProgressPill currentStep={2} totalSteps={3} />
                <View style={[AppStyles.containerCentered, {flex: 1, paddingHorizontal: AppSizes.paddingXLrg,}]}>
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                        {'Would you like to add Functional Strength to your training plan today?'}
                    </Text>
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}]}>
                        {functionalStrengthTodaySubtext}
                    </Text>
                    <Spacer size={20} />
                    <View
                        style={{
                            flexDirection:  'row',
                            justifyContent: 'space-between',
                            width:          220,
                        }}
                    >
                        <TouchableHighlight
                            onPress={() => {
                                handleFormChange('wants_functional_strength', true);
                                this._checkNextStep(6);
                            }}
                            style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                backgroundColor: dailyReadiness.wants_functional_strength === true ? AppColors.zeplin.yellow : AppColors.primary.white.hundredPercent,
                            }]}
                            underlayColor={AppColors.transparent}
                        >
                            <Text
                                oswaldMedium
                                style={[
                                    AppStyles.textCenterAligned,
                                    {
                                        color:    dailyReadiness.wants_functional_strength === true ? AppColors.white : AppColors.zeplin.blueGrey,
                                        fontSize: AppFonts.scaleFont(27),
                                    }
                                ]}
                            >
                                {'YES'}
                            </Text>
                        </TouchableHighlight>
                        <Spacer size={20} />
                        <TouchableHighlight
                            onPress={() => {
                                handleFormChange('wants_functional_strength', false);
                                this._checkNextStep(6);
                            }}
                            style={[AppStyles.xxLrgCircle, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2,}, {
                                backgroundColor: dailyReadiness.wants_functional_strength === false ? AppColors.zeplin.yellow : AppColors.primary.white.hundredPercent,
                            }]}
                            underlayColor={AppColors.transparent}
                        >
                            <Text
                                oswaldMedium
                                style={[
                                    AppStyles.textCenterAligned,
                                    {
                                        color:    dailyReadiness.wants_functional_strength === false ? AppColors.white : AppColors.zeplin.blueGrey,
                                        fontSize: AppFonts.scaleFont(27),
                                    }
                                ]}
                            >
                                {'NO'}
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
            :
            null
        }
    </Modal>
);

FunctionalStrengthModal.propTypes = {};

FunctionalStrengthModal.defaultProps = {};

FunctionalStrengthModal.componentName = 'FunctionalStrengthModal';

/* Export Component ================================================================== */
export default FunctionalStrengthModal;