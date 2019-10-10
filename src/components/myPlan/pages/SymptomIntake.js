/**
 * SymptomIntake
 *
    <SymptomIntake
        handleContinue={this._handleContinue}
        handleFormChange={handleFormChange}
        isModalOpen={isModalOpen}
        selectedBodyPart={selectedBodyPartObj}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { FathomModal, FathomSlider, SVGImage, Spacer, TabIcon, Text, } from '../../custom';

// import third-party libraries
import _ from 'lodash';

const DEFAULT_PILLS = [
    { index: 0, isSelected: false, text: 'Tight', value: null, },
    { index: 1, isSelected: false, text: 'Knots', value: null, },
    { index: 2, isSelected: false, text: 'Ache', value: null, },
    { index: 3, isSelected: false, text: 'Sharp', value: null, },
];

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
    continueBtnWrapper: isValid => ({
        alignSelf:         'flex-end',
        backgroundColor:   isValid ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight,
        borderRadius:      100,
        paddingHorizontal: AppSizes.paddingLrg,
        paddingVertical:   AppSizes.paddingMed,
    }),
    pillWrapper: isSelected => ({
        backgroundColor:   isSelected ? AppColors.zeplin.splashLight : AppColors.white,
        borderRadius:      20,
        elevation:         2,
        marginRight:       AppSizes.padding,
        marginVertical:    AppSizes.paddingSml,
        paddingHorizontal: AppSizes.paddingMed,
        paddingVertical:   AppSizes.paddingXSml,
        shadowColor:       'rgba(0, 0, 0, 0.16)',
        shadowOffset:      { height: 3, width: 0, },
        shadowOpacity:     1,
        shadowRadius:      6,
    }),
    textStyle: isSelected => ({
        color:    isSelected ? AppColors.white : AppColors.zeplin.slate,
        fontSize: AppFonts.scaleFont(20),
    }),
});

/* Component ==================================================================== */
class SymptomIntake extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isBtnValid:  false,
            isValid:     false,
            pills:       DEFAULT_PILLS,
            sliderValue: null,
        };
    }

    _handleContinue = () => {
        const { handleContinue, } = this.props;
        this.setState(
            {
                isBtnValid:  false,
                isValid:     false,
                pills:       DEFAULT_PILLS,
                sliderValue: null,
            },
            () => handleContinue(),
        );
    }

    _handlePillClick = index => {
        const { handleFormChange, selectedBodyPart, } = this.props;
        // update values of pills - make sure to also grab value as user can click after slider was changed
        let newPills = _.cloneDeep(this.state.pills);
        newPills[index].isSelected = !newPills[index].isSelected;
        newPills[index].value = newPills[index].isSelected ? this.state.sliderValue : null;
        let newPillsState = _.update(this.state, 'pills', () => newPills);
        // update state
        this.setState(
            {
                isBtnValid:  this._validateForm(true),
                isValid:     this._validateForm(),
                pills:       newPillsState.pills,
                sliderValue: !this._validateForm() ? null : this.state.sliderValue,
            },
            () => {
                if(!this._validateForm()) {
                    handleFormChange('soreness', 0, false, selectedBodyPart.index, selectedBodyPart.side, true);
                    handleFormChange('soreness', null, false, selectedBodyPart.index, selectedBodyPart.side, false, true); // set movement to null
                }
            }
        );
    }

    _handleSliderChange = value => {
        const { handleFormChange, selectedBodyPart, } = this.props;
        // update values of pills
        let newPills = _.cloneDeep(this.state.pills);
        newPills = _.map(newPills, pill => {
            let newPill = _.cloneDeep(pill);
            newPill.value = pill.isSelected ? value : null;
            return newPill;
        });
        let newPillsState = _.update(this.state, 'pills', () => newPills);
        // update state
        this.setState(
            {
                isBtnValid:  this._validateForm(true),
                isValid:     this._validateForm(),
                pills:       newPillsState.pills,
                sliderValue: value,
            },
            () => {
                // TODO: ACTUALLY SEND OVER PILL DETAILS!
                handleFormChange('soreness', value, false, selectedBodyPart.index, selectedBodyPart.side, value === 0 ? true : false);
                handleFormChange('soreness', null, false, selectedBodyPart.index, selectedBodyPart.side, false, true); // set movement to null
            }
        );
    }

    _validateForm = validateBtn => {
        const { pills, } = this.state;
        if(validateBtn) {
            let numberOfPillsWithValue = _.filter(pills, p => p.isSelected && p.value && p.value > 0).length;
            return numberOfPillsWithValue > 0;
        }
        let numberOfSelectedPills = _.filter(pills, ['isSelected', true]).length;
        return numberOfSelectedPills > 0;
    }

    render = () => {
        const { isModalOpen, selectedBodyPart, } = this.props;
        const { isBtnValid, isValid, pills, } = this.state;
        return (
            <FathomModal
                isVisible={isModalOpen}
                onBackdropPress={this._handleContinue}
                style={{justifyContent: 'flex-end',}}
            >
                <View
                    style={{
                        backgroundColor:      AppColors.white,
                        borderTopLeftRadius:  12,
                        borderTopRightRadius: 12,
                        paddingHorizontal:    AppSizes.paddingLrg,
                        paddingBottom:        AppSizes.iphoneXBottomBarPadding > 0 ? (AppSizes.iphoneXBottomBarPadding + AppSizes.paddingLrg) : AppSizes.paddingLrg,
                    }}
                >
                    <View
                        style={{alignItems: 'flex-start', flexDirection: 'row', height: AppSizes.paddingXLrg, justifyContent: 'space-between', overflow: 'visible',}}
                    >
                        <TabIcon
                            containerStyle={[{alignSelf: 'flex-end',}]}
                            color={AppColors.white}
                            icon={'close'}
                            reverse={false}
                            size={30}
                            type={'material'}
                        />
                        <View style={{alignItems: 'center', backgroundColor: AppColors.white, borderRadius: (AppSizes.paddingXLrg), height: (AppSizes.paddingXLrg * 2), justifyContent: 'center', position: 'relative', top: -AppSizes.paddingXLrg, width: (AppSizes.paddingXLrg * 2),}}>
                            { (selectedBodyPart && selectedBodyPart.bodyImage) &&
                                <SVGImage
                                    image={selectedBodyPart.bodyImage}
                                    style={{height: (AppSizes.paddingXLrg * 2), width: (AppSizes.paddingXLrg * 2),}}
                                />
                            }
                        </View>
                        <TabIcon
                            containerStyle={[{alignSelf: 'flex-end',}]}
                            color={AppColors.zeplin.slateLight}
                            icon={'close'}
                            onPress={this._handleContinue}
                            reverse={false}
                            size={30}
                            type={'material'}
                        />
                    </View>
                    <Spacer size={AppSizes.paddingMed} />
                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                        {'My '}
                        <Text robotoBold>
                            {selectedBodyPart.sideString && selectedBodyPart.sideString.length > 0 ?
                                `${selectedBodyPart.sideString} ${selectedBodyPart.nameString}`
                                :
                                selectedBodyPart.nameString
                            }
                        </Text>
                        {' discomfort feels:'}
                    </Text>
                    <Spacer size={AppSizes.paddingXSml} />
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>
                        {'(Select all that apply)'}
                    </Text>
                    <Spacer size={AppSizes.padding} />
                    <View style={{alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',}}>
                        {_.map(pills, pill => (selectedBodyPart.isJoint && pill.text === 'Knots') ?
                            null
                            :
                            <TouchableOpacity
                                key={pill.index}
                                onPress={() => this._handlePillClick(pill.index)}
                                style={[customStyles.pillWrapper(pill.isSelected),]}
                            >
                                <Text robotoRegular style={[customStyles.textStyle(pill.isSelected),]}>{pill.text}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Spacer size={AppSizes.paddingLrg} />
                    <Text robotoRegular style={{color: isValid ? AppColors.zeplin.slate : AppColors.zeplin.slateXLight, fontSize: AppFonts.scaleFont(20), textAlign: 'center',}}>{'What\'s the severity of your discomfort?'}</Text>
                    <Spacer size={AppSizes.paddingLrg} />
                    <FathomSlider
                        disabled={!isValid}
                        handleFormChange={value => this._handleSliderChange(value)}
                        isValid={isValid}
                        maximumValue={10}
                        minimumValue={0}
                        orientation={'horizontal'}
                        value={selectedBodyPart.value || 0}
                    />
                    <Spacer size={AppSizes.padding} />
                    <View style={{justifyContent: 'flex-end',}}>
                        <TouchableOpacity
                            onPress={isBtnValid ? () => this._handleContinue() : () => null}
                            style={[customStyles.continueBtnWrapper(isBtnValid),]}
                        >
                            <Text robotoRegular style={{color: isBtnValid ? AppColors.white : AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'Continue'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </FathomModal>
        );
    }
}

SymptomIntake.propTypes = {
    handleContinue:   PropTypes.func.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    isModalOpen:      PropTypes.bool.isRequired,
    selectedBodyPart: PropTypes.object.isRequired,
};

SymptomIntake.defaultProps = {};

SymptomIntake.componentName = 'SymptomIntake';

/* Export Component ================================================================== */
export default SymptomIntake;