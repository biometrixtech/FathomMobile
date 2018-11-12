/**
 * SoreBodyPart
 *
    <SoreBodyPart
        bodyPart={bodyPart}
        bodyPartSide={bodyPart.side}
        firstTimeExperience={user.firstTimeExperience}
        handleFormChange={handleFormChange}
        handleUpdateFirstTimeExperience={(name, value) => handleUpdateFirstTimeExperience(name, value)}
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
import { ScaleButton } from './';

// import third-party libraries
import _ from 'lodash';
// import Tooltip from 'react-native-walkthrough-tooltip';

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
        let bodyPartSorenessIndex = _.findIndex(surveyObject.soreness, o => (o.body_part === bodyPart.body_part || o.body_part === bodyPart.index) && o.side === bodyPartSide);
        let bodyPartMap = bodyPart.body_part ? MyPlanConstants.bodyPartMapping[bodyPart.body_part] : MyPlanConstants.bodyPartMapping[bodyPart.index];
        let bodyPartGroup = bodyPartMap ? bodyPartMap.group : false;
        let sorenessPainMapping =
            bodyPartGroup && bodyPartGroup === 'muscle' && this.state.type.length > 0 ?
                MyPlanConstants.muscleLevels[this.state.type]
                : bodyPartGroup && bodyPartGroup === 'joint' ?
                    MyPlanConstants.jointLevels
                    :
                    [];
        let helpingVerb = bodyPartMap ? bodyPartMap.helping_verb : '';
        let mainBodyPartName = bodyPartMap ? bodyPartMap.label : '';
        if (mainBodyPartName.slice(-1) === 's' && bodyPartMap.bilateral && !!bodyPartSide) {
            if (mainBodyPartName === 'Achilles') {
                // do nothing
            } else if (mainBodyPartName === 'Calves') {
                mainBodyPartName = 'Calf';
            } else {
                mainBodyPartName = mainBodyPartName.slice(0, -1);
            }
            helpingVerb = 'is';
        }
        let bodyPartName = `${bodyPartMap.bilateral && bodyPartSide === 1 ? 'left ' : bodyPartMap.bilateral && bodyPartSide === 2 ? 'right ' : ''}${mainBodyPartName.toLowerCase()}`;
        return(
            <View>
                { index ?
                    <View>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {index}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`How ${helpingVerb} your `}
                            <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                {bodyPartName}
                            </Text>
                            {' feeling?'}
                        </Text>
                        <View style={[AppStyles.containerCentered]}>
                            { bodyPartMap ?
                                <SVGImage
                                    firstTimeExperience={firstTimeExperience}
                                    handleUpdateFirstTimeExperience={handleUpdateFirstTimeExperience}
                                    image={bodyPartMap.image[bodyPartSide]}
                                    style={{width: 100, height: 100}}
                                />
                                :
                                null
                            }
                        </View>
                    </View>
                    :
                    <Text oswaldLight style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(18),}]}>
                        {'MY'}
                        <Text oswaldMedium style={{fontSize: AppFonts.scaleFont(18),}}>
                            {` ${bodyPartName === 'abdominals' ? bodyPartName.slice(0, -1).toUpperCase() : bodyPartName.toUpperCase()}`}
                        </Text>
                        {' FEELS...'}
                    </Text>
                }
                <Tooltip
                    animated
                    content={
                        <TooltipContent
                            handleTooltipClose={() => this.setState(
                                { isToolTipOpen: false, },
                                () => handleUpdateFirstTimeExperience('sorenessPainTooltip', true)
                            )}
                            text={MyPlanConstants.painSorenessMessage()}
                            toggleSlideUpPanel={() => this.setState(
                                { isToolTipOpen: false, },
                                () => { toggleSlideUpPanel(); handleUpdateFirstTimeExperience('sorenessPainTooltip', true);}
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
                                    containerStyle={[{alignSelf: 'center', justifyContent: 'center', height: 40, paddingHorizontal: AppSizes.padding,}]}
                                    icon={this.state.type === 'all-good' ? 'check-circle' : 'checkbox-blank-circle-outline'}
                                    iconStyle={[{color: this.state.type === 'all-good' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent}]}
                                    onPress={() => {
                                        if(!this.state.isToolTipOpen) {
                                            this.setState({
                                                type:  this.state.type === 'all-good' ? '' : 'all-good',
                                                value: null,
                                            }, () => {
                                                handleFormChange('soreness', 0, this.state.type === 'pain', bodyPartMap.index, bodyPartSide, true);
                                            });
                                        }
                                    }}
                                    reverse={false}
                                    size={35}
                                    type={'material-community'}
                                />
                                <Text
                                    oswaldRegular
                                    style={[
                                        AppStyles.textCenterAligned,
                                        {
                                            color:           this.state.type === 'all-good' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                            fontSize:        AppFonts.scaleFont(14),
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
                        { bodyPartGroup === 'joint' ?
                            null
                            :
                            <View>
                                <TabIcon
                                    containerStyle={[{alignSelf: 'center', justifyContent: 'center', height: 40, paddingHorizontal: AppSizes.padding,}]}
                                    icon={this.state.type === 'soreness' ? 'check-circle' : 'checkbox-blank-circle-outline'}
                                    iconStyle={[{color: this.state.type === 'soreness' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent}]}
                                    onPress={() => {
                                        if(!this.state.isToolTipOpen) {
                                            this.setState({
                                                type:  this.state.type === 'soreness' ? '' : 'soreness',
                                                value: null,
                                            }, () => {
                                                if(this.state.type === 'soreness' && !firstTimeExperience.sorenessPainTooltip) {
                                                    this.setState({ isToolTipOpen: true, });
                                                }
                                                handleFormChange('soreness', null, this.state.type === 'pain', bodyPartMap.index, bodyPartSide);
                                            });
                                        }
                                    }}
                                    reverse={false}
                                    size={35}
                                    type={'material-community'}
                                />
                                <Text
                                    oswaldRegular
                                    style={[
                                        AppStyles.textCenterAligned,
                                        {
                                            color:           this.state.type === 'soreness' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                            fontSize:        AppFonts.scaleFont(14),
                                            paddingVertical: AppSizes.paddingSml,
                                        }
                                    ]}
                                >
                                    {'SORE'}
                                </Text>
                            </View>
                        }
                        { bodyPartGroup === 'joint' ?
                            null
                            :
                            <View>
                                <TabIcon
                                    containerStyle={[{alignSelf: 'center', justifyContent: 'center', height: 40, paddingHorizontal: AppSizes.padding,}]}
                                    icon={this.state.type === 'pain' ? 'check-circle' : 'checkbox-blank-circle-outline'}
                                    iconStyle={[{color: this.state.type === 'pain' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent}]}
                                    onPress={() => {
                                        if(!this.state.isToolTipOpen) {
                                            this.setState({
                                                type:  this.state.type === 'pain' ? '' : 'pain',
                                                value: null,
                                            }, () => {
                                                if(this.state.type === 'pain' && !firstTimeExperience.sorenessPainTooltip) {
                                                    this.setState({ isToolTipOpen: true, });
                                                }
                                                handleFormChange('soreness', null, this.state.type === 'pain', bodyPartMap.index, bodyPartSide);
                                            });
                                        }
                                    }}
                                    reverse={false}
                                    size={35}
                                    type={'material-community'}
                                />
                                <Text
                                    oswaldRegular
                                    style={[
                                        AppStyles.textCenterAligned,
                                        {
                                            color:           this.state.type === 'pain' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                            fontSize:        AppFonts.scaleFont(14),
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
                    { bodyPartGroup && (this.state.type === 'soreness' || this.state.type === 'pain' || bodyPartGroup === 'joint') ?
                        _.map(sorenessPainMapping, (value, key) => {
                            if(key === 0) { return; }
                            let sorenessPainScaleMappingValue = (
                                bodyPartGroup === 'joint'
                            ) ?
                                MyPlanConstants.sorenessPainScaleMapping(false, key, true)
                                :
                                MyPlanConstants.sorenessPainScaleMapping(this.state.type, key);
                            /*eslint consistent-return: 0*/
                            return(
                                <ScaleButton
                                    isSelected={this.state.value === key}
                                    key={value+key}
                                    keyLabel={key}
                                    sorenessPainMappingLength={sorenessPainMapping.length}
                                    updateStateAndForm={() => {
                                        let newType = this.state.type === 'all-good' ? '' : this.state.type;
                                        let newKey = sorenessPainScaleMappingValue === this.state.value ? null : key;
                                        sorenessPainScaleMappingValue = sorenessPainScaleMappingValue === this.state.value ? null : sorenessPainScaleMappingValue;
                                        this.setState({
                                            type:  newType,
                                            value: newKey,
                                        }, () => {
                                            handleFormChange('soreness', sorenessPainScaleMappingValue, this.state.type === 'pain' ,bodyPartMap.index, bodyPartSide, true);
                                        });
                                    }}
                                    valueLabel={value}
                                />
                            )
                        })
                        :
                        <Text
                            onPress={() => toggleSlideUpPanel(false)}
                            robotoLight
                            style={{color: AppColors.primary.yellow.hundredPercent, textDecorationLine: 'underline',}}
                        >
                            {'What\'s the difference?'}
                        </Text>
                    }
                </View>
            </View>
        )
    }
}

SoreBodyPart.propTypes = {
    bodyPart:            PropTypes.object.isRequired,
    bodyPartSide:        PropTypes.number,
    firstTimeExperience: PropTypes.object.isRequired,
    handleFormChange:    PropTypes.func.isRequired,
    index:               PropTypes.number,
    isPrevSoreness:      PropTypes.bool,
    surveyObject:        PropTypes.object,
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