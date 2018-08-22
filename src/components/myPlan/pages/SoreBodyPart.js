/**
 * SoreBodyPart
 *
    <SoreBodyPart
        bodyPart={bodyPart}
        bodyPartSide={bodyPart.side}
        handleFormChange={handleFormChange}
        index={i+3}
        isPrevSoreness={true}
        key={i}
        surveyObject={dailyReadiness}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { FathomSlider, SVGImage, TabIcon, Text, } from '../../custom';

// import third-party libraries
import _ from 'lodash';

/* Component ==================================================================== */
class SoreBodyPart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type:  '',
            value: null,
        };
    }

    render = () => {
        const { bodyPart, bodyPartSide, handleFormChange, index, isPrevSoreness, surveyObject, } = this.props;
        let bodyPartSorenessIndex = _.findIndex(surveyObject.soreness, o => (o.body_part === bodyPart.body_part || o.body_part === bodyPart.index) && o.side === bodyPartSide);
        let bodyPartMap = bodyPart.body_part ? MyPlanConstants.bodyPartMapping[bodyPart.body_part] : MyPlanConstants.bodyPartMapping[bodyPart.index];
        let bodyPartGroup = bodyPartMap ? bodyPartMap.group : false;
        let sorenessPainMapping = bodyPartGroup && this.state.type.length > 0 ?
            bodyPartGroup === 'muscle' ?
                MyPlanConstants.muscleLevels[this.state.type]
                : bodyPartGroup === 'joint' ?
                    MyPlanConstants.jointLevels[this.state.type]
                    :
                    []
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
        let bodyPartName = `${bodyPartMap.bilateral && bodyPartSide === 1 ? 'Left ' : bodyPartMap.bilateral && bodyPartSide === 2 ? 'Right ' : ''}${mainBodyPartName}`;
        return(
            <View style={{paddingBottom: AppSizes.padding}}>
                { index ?
                    <View>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {index}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`How ${helpingVerb} your ${bodyPartName} feeling?`}
                        </Text>
                        <View style={[AppStyles.containerCentered]}>
                            { bodyPartMap ?
                                <SVGImage
                                    image={bodyPartMap.image[bodyPartSide]}
                                    style={{width: 100, height: 100}}
                                />
                                :
                                null
                            }
                        </View>
                    </View>
                    :
                    <Text oswaldRegular style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(18),}]}>
                        {'I FEEL'}
                        <Text oswaldMedium style={{fontSize: AppFonts.scaleFont(18),}}>
                            {` ${bodyPartName.toUpperCase()}...`}
                        </Text>
                    </Text>
                }
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.padding,}}>
                    { isPrevSoreness ?
                        <View>
                            <TabIcon
                                containerStyle={[{alignSelf: 'center', justifyContent: 'center', height: 40, paddingHorizontal: AppSizes.padding,}]}
                                icon={this.state.type === 'all-good' ? 'check-circle' : 'circle-thin'}
                                iconStyle={[{color: this.state.type === 'all-good' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent}]}
                                onPress={() => {
                                    this.setState({
                                        type:  this.state.type === 'all-good' ? '' : 'all-good',
                                        value: null,
                                    }, () => {
                                        handleFormChange('soreness', 0, bodyPartMap.index, bodyPartSide);
                                    });
                                }}
                                reverse={false}
                                size={35}
                                type={'font-awesome'}
                            />
                            <Text
                                oswaldRegular
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
                    <View>
                        <TabIcon
                            containerStyle={[{alignSelf: 'center', justifyContent: 'center', height: 40, paddingHorizontal: AppSizes.padding,}]}
                            icon={this.state.type === 'soreness' ? 'check-circle' : 'circle-thin'}
                            iconStyle={[{color: this.state.type === 'soreness' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent}]}
                            onPress={() => {
                                this.setState({
                                    type:  this.state.type === 'soreness' ? '' : 'soreness',
                                    value: null,
                                }, () => {
                                    handleFormChange('soreness', 0, bodyPartMap.index, bodyPartSide);
                                });
                            }}
                            reverse={false}
                            size={35}
                            type={'font-awesome'}
                        />
                        <Text
                            oswaldRegular
                            style={[
                                AppStyles.textCenterAligned,
                                {
                                    color:           this.state.type === 'soreness' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                    fontSize:        AppFonts.scaleFont(12),
                                    paddingVertical: AppSizes.paddingSml,
                                }
                            ]}
                        >
                            {'SORENESS'}
                        </Text>
                    </View>
                    <View>
                        <TabIcon
                            containerStyle={[{alignSelf: 'center', justifyContent: 'center', height: 40, paddingHorizontal: AppSizes.padding,}]}
                            icon={this.state.type === 'pain' ? 'check-circle' : 'circle-thin'}
                            iconStyle={[{color: this.state.type === 'pain' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent}]}
                            onPress={() => {
                                this.setState({
                                    type:  this.state.type === 'pain' ? '' : 'pain',
                                    value: null,
                                }, () => {
                                    handleFormChange('soreness', 0, bodyPartMap.index, bodyPartSide);
                                });
                            }}
                            reverse={false}
                            size={35}
                            type={'font-awesome'}
                        />
                        <Text
                            oswaldRegular
                            style={[
                                AppStyles.textCenterAligned,
                                {
                                    color:           this.state.type === 'pain' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                    fontSize:        AppFonts.scaleFont(12),
                                    paddingVertical: AppSizes.paddingSml,
                                }
                            ]}
                        >
                            {'PAIN'}
                        </Text>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}>
                    { this.state.type === 'soreness' || this.state.type === 'pain' && bodyPartGroup ?
                        _.map(sorenessPainMapping, (value, key) => {
                            if(key === 0) { return; }
                            let sorenessPainScaleMappingValue = MyPlanConstants.sorenessPainScaleMapping(this.state.type, key);
                            /*eslint consistent-return: 0*/
                            return(
                                <View
                                    key={value+key}
                                    style={{justifyContent: 'center', width: (AppSizes.screen.width - (AppSizes.paddingLrg * 2)) / (sorenessPainMapping.length - 1)}}
                                >
                                    <Text
                                        oswaldRegular
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:             this.state.value === key ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                                flex:              1,
                                                fontSize:          AppFonts.scaleFont(12),
                                                paddingHorizontal: AppSizes.paddingXSml,
                                                paddingVertical:   AppSizes.paddingSml,
                                                textAlignVertical: 'bottom',
                                            }
                                        ]}
                                    >
                                        {value}
                                    </Text>
                                    <TouchableOpacity
                                        style={[AppStyles.sorenessPainValues, {
                                            backgroundColor: this.state.value === key ? AppColors.primary.yellow.hundredPercent : AppColors.primary.white.hundredPercent,
                                            borderColor:     this.state.value === key ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                        }]}
                                        onPress={() => {
                                            this.setState({
                                                value: key,
                                            }, () => {
                                                handleFormChange('soreness', sorenessPainScaleMappingValue, bodyPartMap.index, bodyPartSide);
                                            });
                                        }}
                                    >
                                        <Text
                                            oswaldRegular
                                            style={[
                                                AppStyles.textCenterAligned,
                                                {
                                                    color:    this.state.value === key ? AppColors.white : AppColors.primary.grey.fiftyPercent,
                                                    fontSize: AppFonts.scaleFont(14),
                                                }
                                            ]}
                                        >
                                            {key}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                        :
                        null
                    }
                </View>
            </View>
        )
    }
}

SoreBodyPart.propTypes = {
    bodyPart:         PropTypes.object.isRequired,
    bodyPartSide:     PropTypes.number,
    handleFormChange: PropTypes.func.isRequired,
    index:            PropTypes.number,
    isPrevSoreness:   PropTypes.bool,
    surveyObject:     PropTypes.object,
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