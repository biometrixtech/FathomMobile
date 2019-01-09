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
import { FathomSlider, SVGImage, Spacer, TabIcon, Text, Tooltip, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { ScaleButton } from './';

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
            isToolTipOpen: false,
            type:          '',
            value:         null,
        };
    }

    render = () => {
        const {
            bodyPart,
            bodyPartSide,
            firstTimeExperience,
            handleFormChange,
            handleUpdateFirstTimeExperience,
            index,
            isPrevSoreness,
            surveyObject,
            toggleSlideUpPanel,
        } = this.props;
        let {
            bodyPartMap,
            bodyPartName,
            bodyPartGroup,
            helpingVerb,
            sorenessPainMapping,
        } = PlanLogic.handleSoreBodyPartRenderLogic(bodyPart, bodyPartSide, this.state.type);
        let showScaleButtons = bodyPartGroup && (this.state.type === 'soreness' || this.state.type === 'pain' || bodyPartGroup === 'joint');
        let showWhatsTheDifferenceLink = bodyPartGroup && bodyPartGroup === 'muscle';
        let isBodyPartJoint = bodyPartGroup === 'joint';
        return(
            <View>
                { bodyPart.isClearCandidate ?
                    <View style={[AppStyles.paddingVerticalSml]}>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}]}>
                            {'You have\'t mentioned '}
                            <Text robotoMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}}>{bodyPart.pain ? 'pain' : 'soreness'}</Text>
                            {' in your '}
                            <Text robotoMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(18),}}>{bodyPartName}</Text>
                            {' recently.'}
                        </Text>
                        <Spacer size={AppSizes.padding} />
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22),}]}>
                            {'How has it felt the last '}
                            <Text robotoMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22),}}>
                                {`${bodyPart.status.includes('acute') ? 'few days' : 'week'}?`}
                            </Text>
                        </Text>
                    </View>
                    : isPrevSoreness ?
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22),}]}>
                            {`How ${helpingVerb} your `}
                            <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22),}]}>
                                {bodyPartName}
                            </Text>
                            {' felt?'}
                        </Text>
                        :
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(25),}]}>
                            {'My '}
                            <Text robotoMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(25),}}>
                                {bodyPartName}
                            </Text>
                            {` ${bodyPartName === 'Abdominals' ? 'feel...' : 'feels..'}`}
                        </Text>
                }
                <View style={[AppStyles.containerCentered]}>
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
                    <View style={{backgroundColor: this.state.isToolTipOpen ? AppColors.white : AppColors.transparent, flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.padding,}}>
                        { isPrevSoreness || bodyPartMap.bilateral ?
                            <View>
                                <TabIcon
                                    containerStyle={[{alignSelf: 'center', justifyContent: 'center', height: 50, paddingHorizontal: AppSizes.padding,}]}
                                    icon={this.state.type === 'all-good' ? 'check-circle' : 'checkbox-blank-circle-outline'}
                                    iconStyle={[{color: this.state.type === 'all-good' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent}]}
                                    onPress={() => {
                                        if(!this.state.isToolTipOpen) {
                                            this.setState({
                                                type:  this.state.type === 'all-good' ? '' : 'all-good',
                                                value: null,
                                            }, () => {
                                                let value = this.state.type === 'all-good' ? 0 : null;
                                                handleFormChange('soreness', value, this.state.type === 'pain', bodyPartMap.index, bodyPartSide, value === 0 ? true : false);
                                            });
                                        }
                                    }}
                                    reverse={false}
                                    size={45}
                                    type={'material-community'}
                                />
                                <Text
                                    oswaldMedium
                                    style={[
                                        AppStyles.textCenterAligned,
                                        {
                                            color:           this.state.type === 'all-good' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                            fontSize:        AppFonts.scaleFont(12),
                                            paddingVertical: AppSizes.paddingSml,
                                        }
                                    ]}
                                >
                                    {'ALL GOOD'}
                                </Text>
                            </View>
                            :
                            null
                        }
                        { isBodyPartJoint ?
                            null
                            :
                            <View>
                                <TabIcon
                                    containerStyle={[{alignSelf: 'center', justifyContent: 'center', height: 50, paddingHorizontal: AppSizes.padding,}]}
                                    icon={this.state.type === 'soreness' ? 'check-circle' : 'checkbox-blank-circle-outline'}
                                    iconStyle={[{color: this.state.type === 'soreness' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent}]}
                                    onPress={() => {
                                        if(!this.state.isToolTipOpen) {
                                            this.setState({
                                                type:  this.state.type === 'soreness' ? '' : 'soreness',
                                                value: null,
                                            }, () => {
                                                if(this.state.type === 'soreness' && !firstTimeExperience.includes('soreness_pain_tooltip')) {
                                                    this.setState({ isToolTipOpen: true, });
                                                }
                                                handleFormChange('soreness', null, this.state.type === 'pain', bodyPartMap.index, bodyPartSide);
                                            });
                                        }
                                    }}
                                    reverse={false}
                                    size={45}
                                    type={'material-community'}
                                />
                                <Text
                                    oswaldMedium
                                    style={[
                                        AppStyles.textCenterAligned,
                                        {
                                            color:           this.state.type === 'soreness' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                            fontSize:        AppFonts.scaleFont(12),
                                            paddingVertical: AppSizes.paddingSml,
                                        }
                                    ]}
                                >
                                    {'SORE'}
                                </Text>
                            </View>
                        }
                        { isBodyPartJoint ?
                            null
                            :
                            <View>
                                <TabIcon
                                    containerStyle={[{alignSelf: 'center', justifyContent: 'center', height: 50, paddingHorizontal: AppSizes.padding,}]}
                                    icon={this.state.type === 'pain' ? 'check-circle' : 'checkbox-blank-circle-outline'}
                                    iconStyle={[{color: this.state.type === 'pain' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent}]}
                                    onPress={() => {
                                        if(!this.state.isToolTipOpen) {
                                            this.setState({
                                                type:  this.state.type === 'pain' ? '' : 'pain',
                                                value: null,
                                            }, () => {
                                                if(this.state.type === 'pain' && !firstTimeExperience.includes('soreness_pain_tooltip')) {
                                                    this.setState({ isToolTipOpen: true, });
                                                }
                                                handleFormChange('soreness', null, this.state.type === 'pain', bodyPartMap.index, bodyPartSide);
                                            });
                                        }
                                    }}
                                    reverse={false}
                                    size={45}
                                    type={'material-community'}
                                />
                                <Text
                                    oswaldMedium
                                    style={[
                                        AppStyles.textCenterAligned,
                                        {
                                            color:           this.state.type === 'pain' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                            fontSize:        AppFonts.scaleFont(12),
                                            paddingVertical: AppSizes.paddingSml,
                                        }
                                    ]}
                                >
                                    {'PAINFUL'}
                                </Text>
                            </View>
                        }
                    </View>
                </Tooltip>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.padding}}>
                    { showScaleButtons ?
                        _.map(sorenessPainMapping, (value, key) => {
                            if(key === 0) { return; }
                            let sorenessPainScaleMappingValue = (
                                isBodyPartJoint
                            ) ?
                                MyPlanConstants.sorenessPainScaleMapping(false, key, true)
                                :
                                MyPlanConstants.sorenessPainScaleMapping(this.state.type, key);

                            let isSelected = this.state.value === key;
                            let opacity = isSelected ? 1 : (key * 0.2);
                            /*eslint consistent-return: 0*/
                            return(
                                <ScaleButton
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
                </View>
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
    isPrevSoreness:                  PropTypes.bool,
    surveyObject:                    PropTypes.object,
};

SoreBodyPart.defaultProps = {
    bodyPartSide:   0,
    index:          null,
    isPrevSoreness: false,
    surveyObject:   {},
};

SoreBodyPart.componentName = 'SoreBodyPart';

/* Export Component ================================================================== */
export default SoreBodyPart;