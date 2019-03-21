/**
 * SoreBodyPart
 *
    <SoreBodyPart
        bodyPart={bodyPart}
        bodyPartSide={bodyPart.side}
        firstTimeExperience={user.firstTimeExperience}
        handleFormChange={handleFormChange}
        handleUpdateFirstTimeExperience={name => handleUpdateFirstTimeExperience(name)}
        index={i+3}
        isFirst={i === 0}
        isLast={i === (newSoreBodyParts.length - 1)}
        isPrevSoreness={true}
        surveyObject={dailyReadiness}
        toggleSlideUpPanel={this._toggleSlideUpPanel}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { SVGImage, Spacer, TabIcon, Text, Tooltip, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { SoreBodyPartScaleButton, } from './';

// import third-party libraries
import _ from 'lodash';

const TooltipContent = ({ handleTooltipClose, text, toggleSlideUpPanel, }) => (
    <View style={{padding: AppSizes.padding,}}>
        <Text robotoMedium style={{color: AppColors.black, fontSize: AppFonts.scaleFont(15),}}>
            {text[0]}
            <Text robotoLight style={{color: AppColors.black, fontSize: AppFonts.scaleFont(15),}}>{text[1]}</Text>
            <Text robotoMedium style={{color: AppColors.black, fontSize: AppFonts.scaleFont(15),}}>{text[2]}</Text>
        </Text>
        <Spacer size={20} />
        <View style={{flex: 1, flexDirection: 'row',}}>
            <View style={{flex: 2,}}></View>
            <TouchableOpacity
                onPress={toggleSlideUpPanel}
                style={{flex: 6,}}
            >
                <Text
                    robotoMedium
                    style={{
                        color:    AppColors.primary.yellow.hundredPercent,
                        fontSize: AppFonts.scaleFont(15),
                    }}
                >
                    {'LEARN MORE'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleTooltipClose}
                style={{flex: 2,}}
            >
                <Text
                    robotoMedium
                    style={{
                        color:    AppColors.primary.yellow.hundredPercent,
                        fontSize: AppFonts.scaleFont(15),
                    }}
                >
                    {'GOT IT'}
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

/* Component ==================================================================== */
class SoreBodyPart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isToolTipOpen:     false,
            movementValue:     null,
            painSorenessValue: null,
            type:              '',
        };
    }

    _handleAllGoodBtnPressed = bodyPartMap => {
        const { bodyPart, bodyPartSide, handleFormChange, } = this.props;
        if(!this.state.isToolTipOpen) {
            this.setState({
                movementValue:     null,
                painSorenessValue: null,
                type:              this.state.type === 'all-good' ? '' : 'all-good',
            }, () => {
                let value = this.state.type === 'all-good' ? 0 : null;
                let isPain = this.state.type === 'pain';
                if(bodyPart.isClearCandidate) {
                    isPain = bodyPart.pain;
                }
                handleFormChange('soreness', value, isPain, bodyPartMap.index, bodyPartSide, value === 0 ? true : false);
            });
        }
    }

    _handleSoreBtnPressed = bodyPartMap => {
        const { bodyPartSide, firstTimeExperience, handleFormChange, } = this.props;
        if(!this.state.isToolTipOpen) {
            this.setState({
                movementValue:     null,
                painSorenessValue: null,
                type:              this.state.type === 'soreness' ? '' : 'soreness',
            }, () => {
                if(this.state.type === 'soreness' && !firstTimeExperience.includes('soreness_pain_tooltip')) {
                    this.setState({ isToolTipOpen: true, });
                }
                handleFormChange('soreness', null, this.state.type === 'pain', bodyPartMap.index, bodyPartSide);
            });
        }
    }

    _handlePainBtnPressed = bodyPartMap => {
        const { bodyPartSide, firstTimeExperience, handleFormChange, } = this.props;
        if(!this.state.isToolTipOpen) {
            this.setState({
                movementValue:     null,
                painSorenessValue: null,
                type:              this.state.type === 'pain' ? '' : 'pain',
            }, () => {
                if(this.state.type === 'pain' && !firstTimeExperience.includes('soreness_pain_tooltip')) {
                    this.setState({ isToolTipOpen: true, });
                }
                handleFormChange('soreness', null, this.state.type === 'pain', bodyPartMap.index, bodyPartSide);
            });
        }
    }

    _handlePainSorenessValueBtnPressed = (bodyPartMap, key) => {
        const { bodyPart, bodyPartSide, handleFormChange, } = this.props;
        let newType = this.state.type === 'all-good' ? '' : this.state.type;
        let newKey = key === this.state.painSorenessValue ? null : key;
        let isPain = bodyPartMap.group === 'joint' || this.state.type === 'pain';
        if(bodyPart.isClearCandidate) {
            isPain = bodyPart.pain;
        }
        this.setState({
            movementValue:     null,
            painSorenessValue: newKey,
            type:              newType,
        }, () => {
            handleFormChange('soreness', newKey, isPain, bodyPartMap.index, bodyPartSide);
        });
    }

    _handleMovementValueBtnPressed = (bodyPartMap, key) => {
        const { bodyPart, bodyPartSide, handleFormChange, } = this.props;
        let newType = this.state.type === 'all-good' ? '' : this.state.type;
        let newKey = key === this.state.movementValue ? null : key;
        let isPain = bodyPartMap.group === 'joint' || this.state.type === 'pain';
        if(bodyPart.isClearCandidate) {
            isPain = bodyPart.pain;
        }
        this.setState({
            movementValue: key,
            type:          newType,
        }, () => {
            handleFormChange('soreness', newKey, isPain, bodyPartMap.index, bodyPartSide, newKey === null ? false : true, true);
        });
    }

    render = () => {
        const {
            bodyPart,
            bodyPartSide,
            firstTimeExperience,
            handleUpdateFirstTimeExperience,
            isFirst,
            isLast,
            isPrevSoreness,
            toggleSlideUpPanel,
        } = this.props;
        let {
            backNextHeight,
            bodyPartMap,
            bodyPartName,
            helpingVerb,
            isBodyPartJoint,
            pillsHeight,
            showScaleButtons,
            sorenessPainMapping,
        } = PlanLogic.handleSoreBodyPartRenderLogic(bodyPart, bodyPartSide, this.state.type);
        return(
            <View
                style={{
                    height: (isFirst && isLast) || (!isFirst && isLast) ?
                        (AppSizes.screen.height - (pillsHeight + backNextHeight))
                        :
                        (AppSizes.screen.height - pillsHeight),
                    justifyContent: 'center',
                }}
            >
                { bodyPart.isClearCandidate && isPrevSoreness &&
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalMed, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}]}>
                        {'You have\'t mentioned '}
                        <Text robotoMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}}>{bodyPart.pain ? 'pain' : 'soreness'}</Text>
                        {' in your '}
                        <Text robotoMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}}>{bodyPartName}</Text>
                        {' recently.'}
                    </Text>
                }
                <View style={[AppStyles.containerCentered,]}>
                    { bodyPartMap ?
                        <SVGImage
                            firstTimeExperience={firstTimeExperience}
                            handleUpdateFirstTimeExperience={handleUpdateFirstTimeExperience}
                            image={bodyPartMap.image[bodyPartSide]}
                            style={{width: 150, height: 150}}
                        />
                        :
                        null
                    }
                </View>
                { bodyPart.isClearCandidate && isPrevSoreness ?
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalMed, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(25),}]}>
                        {'How has it felt the last '}
                        <Text robotoMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(25),}}>
                            {`${bodyPart.status.includes('acute') ? 'few days' : 'week'}?`}
                        </Text>
                    </Text>
                    : isPrevSoreness ?
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalMed, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(25),}]}>
                            {`How ${helpingVerb} your `}
                            <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalMed, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(25),}]}>
                                {bodyPartName}
                            </Text>
                            {' felt?'}
                        </Text>
                        :
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalMed, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(25),}]}>
                            {'My '}
                            <Text robotoMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(25),}}>
                                {bodyPartName}
                            </Text>
                            {` ${bodyPartName === 'Abdominals' ? 'feel...' : 'feels..'}`}
                        </Text>
                }
                <Tooltip
                    animated
                    content={
                        <TooltipContent
                            handleTooltipClose={() => this.setState(
                                { isToolTipOpen: false, },
                                () => handleUpdateFirstTimeExperience('soreness_pain_tooltip')
                            )}
                            text={MyPlanConstants.painSorenessMessage()}
                            toggleSlideUpPanel={() => this.setState(
                                { isToolTipOpen: false, },
                                () => { toggleSlideUpPanel(); handleUpdateFirstTimeExperience('soreness_pain_tooltip');}
                            )}
                        />
                    }
                    isVisible={this.state.isToolTipOpen}
                    onClose={() => {}}
                    tooltipStyle={{left: 30, width: (AppSizes.screen.width - 60),}}
                >
                    <View style={{backgroundColor: this.state.isToolTipOpen ? AppColors.white : AppColors.transparent, flexDirection: 'row', justifyContent: 'center', paddingVertical: AppSizes.padding,}}>
                        <SoreBodyPartScaleButton
                            extraStyles={{marginRight: AppSizes.padding,}}
                            isSelected={this.state.type === 'all-good'}
                            label={'ALL\nGOOD'}
                            updateStateAndForm={() => this._handleAllGoodBtnPressed(bodyPartMap)}
                        />
                        { !isBodyPartJoint &&
                            <SoreBodyPartScaleButton
                                extraStyles={{marginRight: AppSizes.padding,}}
                                isSelected={this.state.type === 'soreness'}
                                label={'SORE'}
                                updateStateAndForm={() => this._handleSoreBtnPressed(bodyPartMap)}
                            />
                        }
                        <SoreBodyPartScaleButton
                            isSelected={this.state.type === 'pain'}
                            label={'PAINFUL'}
                            updateStateAndForm={() => this._handlePainBtnPressed(bodyPartMap)}
                        />
                    </View>
                </Tooltip>
                { showScaleButtons ?
                    <View style={[AppStyles.paddingVerticalMed,]}>
                        <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(22),}]}>
                            {'My '}
                            <Text robotoMedium>{this.state.type}</Text>
                            {' is...'}
                        </Text>
                        <View style={[AppStyles.paddingVerticalMed, {flexDirection: 'row', justifyContent: 'center',}]}>
                            {_.map(sorenessPainMapping.soreness, (value, key) => {
                                let isSelected = this.state.painSorenessValue === key;
                                let extraStyles = key === 0 || key === 1 ? {marginRight: AppSizes.padding,} : {};
                                return(
                                    <SoreBodyPartScaleButton
                                        extraStyles={extraStyles}
                                        isSelected={isSelected}
                                        key={key}
                                        label={value}
                                        updateStateAndForm={() => this._handlePainSorenessValueBtnPressed(bodyPartMap, key)}
                                    />
                                );
                            })}
                        </View>
                        <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(22),}]}>
                            {'My '}
                            <Text robotoMedium>{'range of motion'}</Text>
                            {' is...'}
                        </Text>
                        <View style={[AppStyles.paddingVerticalMed, {flexDirection: 'row', justifyContent: 'center',}]}>
                            {_.map(sorenessPainMapping.movement, (value, key) => {
                                let isSelected = this.state.movementValue === key;
                                let extraStyles = key === 0 || key === 1 ? {marginRight: AppSizes.padding,} : {};
                                return(
                                    <SoreBodyPartScaleButton
                                        extraStyles={extraStyles}
                                        isSelected={isSelected}
                                        key={key}
                                        label={value}
                                        updateStateAndForm={() => this._handleMovementValueBtnPressed(bodyPartMap, key)}
                                    />
                                );
                            })}
                        </View>
                    </View>
                    :
                    <Text
                        onPress={() => toggleSlideUpPanel(false)}
                        robotoLight
                        style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalMed, {color: AppColors.zeplin.yellow, textDecorationLine: 'underline',}]}
                    >
                        {'What\'s the difference?'}
                    </Text>
                }
                {/*<View style={{flexDirection: 'row', justifyContent: 'center', paddingHorizontal: AppSizes.padding}}>
                    { showScaleButtons ?
                        _.map(sorenessPainMapping., (value, key) => {
                            if(key === 0) { return; }
                            let sorenessPainScaleMappingValue = (
                                isBodyPartJoint
                            ) ?
                                MyPlanConstants.sorenessPainScaleMapping(false, key, true)
                                :
                                MyPlanConstants.sorenessPainScaleMapping(this.state.type, key);

                            let isSelected = this.state.value === key;
                            let opacity = isSelected ? 1 : (key * 0.2);
                            /*eslint consistent-return: 0*
                            return(
                                <SoreBodyPartScaleButton
                                    isSelected={isSelected}
                                    key={value+key}
                                    keyLabel={key}
                                    opacity={opacity}
                                    sorenessPainMappingLength={sorenessPainMapping.length}
                                    updateStateAndForm={() => {
                                        let newType = this.state.type === 'all-good' ? '' : this.state.type;
                                        let newKey = sorenessPainScaleMappingValue === this.state.value ? null : key;
                                        sorenessPainScaleMappingValue = sorenessPainScaleMappingValue === this.state.value ? null : sorenessPainScaleMappingValue;
                                        let isPain = bodyPartMap.group === 'joint' || this.state.type === 'pain';
                                        if(bodyPart.isClearCandidate) {
                                            isPain = bodyPart.pain;
                                        }
                                        this.setState({
                                            type:  newType,
                                            value: newKey,
                                        }, () => {
                                            handleFormChange('soreness', sorenessPainScaleMappingValue, isPain, bodyPartMap.index, bodyPartSide, sorenessPainScaleMappingValue === null ? false : true);
                                        });
                                    }}
                                    valueLabel={value}
                                />
                            )
                        })
                        : showWhatsTheDifferenceLink ?
                            <Text
                                onPress={() => toggleSlideUpPanel(false)}
                                robotoLight
                                style={{color: AppColors.primary.yellow.hundredPercent, textDecorationLine: 'underline',}}
                            >
                                {'What\'s the difference?'}
                            </Text>
                            :
                            null
                    }
                </View>*/}
                <Spacer size={isFirst && !isLast && !showScaleButtons ? pillsHeight : 0} />
            </View>
        )
    }
}

SoreBodyPart.propTypes = {
    bodyPart:                        PropTypes.object.isRequired,
    bodyPartSide:                    PropTypes.number,
    firstTimeExperience:             PropTypes.array.isRequired,
    handleFormChange:                PropTypes.func.isRequired,
    handleUpdateFirstTimeExperience: PropTypes.func.isRequired,
    index:                           PropTypes.number,
    isFirst:                         PropTypes.bool,
    isLast:                          PropTypes.bool,
    isPrevSoreness:                  PropTypes.bool,
    surveyObject:                    PropTypes.object,
    toggleSlideUpPanel:              PropTypes.func.isRequired,
};

SoreBodyPart.defaultProps = {
    bodyPartSide:   0,
    index:          null,
    isFirst:        false,
    isLast:         false,
    isPrevSoreness: false,
    surveyObject:   {},
};

SoreBodyPart.componentName = 'SoreBodyPart';

/* Export Component ================================================================== */
export default SoreBodyPart;