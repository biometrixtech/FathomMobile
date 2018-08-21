/**
 * SoreBodyPart
 *
    <SoreBodyPart
        bodyPart={bodyPart}
        bodyPartSide={bodyPartSide}
        handleFormChange={handleFormChange}
        index={i+3}
        surveyObject={surveyObject}
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
            type: ''
        };
    }

    render = () => {
        const { bodyPart, bodyPartSide, handleFormChange, index, surveyObject, } = this.props;
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
        let severityValue = surveyObject.soreness[bodyPartSorenessIndex] ? surveyObject.soreness[bodyPartSorenessIndex].severity || 0 : 0;
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
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.paddingLrg,}}>
                    <View>
                        <TabIcon
                            containerStyle={[{alignSelf: 'center', justifyContent: 'center', height: 40, paddingHorizontal: AppSizes.padding,}]}
                            icon={this.state.type === 'soreness' ? 'check-circle' : 'circle-thin'}
                            iconStyle={[{color: this.state.type === 'soreness' ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent}]}
                            onPress={() => this.state.type === 'soreness' ? this.setState({ type: '' }) : this.setState({ type: 'soreness' })}
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
                            onPress={() => this.state.type === 'pain' ? this.setState({ type: '' }) : this.setState({ type: 'pain' })}
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
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.paddingLrg, paddingHorizontal: AppSizes.paddingLrg}}>
                    { this.state.type === 'soreness' || this.state.type === 'pain' && bodyPartGroup ?
                        _.map(sorenessPainMapping, (value, key) => {
                            if(key === 0) { return; }
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
                                                color:             severityValue === key ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                                flex:              1,
                                                fontSize:          AppFonts.scaleFont(12),
                                                paddingHorizontal: AppSizes.paddingXSml,
                                                paddingVertical:   AppSizes.paddingSml,
                                            }
                                        ]}
                                    >
                                        {value}
                                    </Text>
                                    <TouchableOpacity
                                        style={{
                                            alignSelf:       'center',
                                            backgroundColor: severityValue === key ? AppColors.primary.yellow.hundredPercent : AppColors.primary.white.hundredPercent,
                                            borderColor:     severityValue === key ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                                            borderRadius:    35 / 2,
                                            borderWidth:     1,
                                            height:          35,
                                            justifyContent:  'center',
                                            width:           35,
                                        }}

                                        onPress={() => handleFormChange('soreness', key, bodyPartMap.index, bodyPartSide)}
                                    >
                                        <Text
                                            style={[
                                                AppStyles.textCenterAligned,
                                                {
                                                    color:    severityValue === key ? AppColors.white : AppColors.primary.grey.fiftyPercent,
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
                {/*<View style={[AppStyles.row, AppStyles.paddingVerticalSml, {justifyContent: 'space-between'}]}>
                    <Text oswaldBold style={[AppStyles.paddingHorizontal, {color: AppColors.black}]}>
                        {bodyPartName}
                    </Text>
                    <Text oswaldBold style={[AppStyles.paddingHorizontal, AppStyles.textRightAligned, {color: AppColors.slider[severityValue]}]}>
                        {severityString.length > 0 ? `${severityValue}: ${severityString}` : ''}
                    </Text>
                </View>
                <FathomSlider
                    bodyPart={bodyPartMap.index}
                    handleFormChange={handleFormChange}
                    maximumValue={5}
                    minimumValue={0}
                    name={'soreness'}
                    side={bodyPartSide}
                    thumbTintColor={AppColors.slider[severityValue]}
                    value={severityValue}
                />*/}
            </View>
        )
    }
}

SoreBodyPart.propTypes = {
    bodyPart:         PropTypes.object.isRequired,
    bodyPartSide:     PropTypes.number,
    handleFormChange: PropTypes.func.isRequired,
    index:            PropTypes.number,
    surveyObject:     PropTypes.object,
};
SoreBodyPart.defaultProps = {
    bodyPartSide: 0,
    index:        null,
    surveyObject: {},
};
SoreBodyPart.componentName = 'SoreBodyPart';

/* Export Component ================================================================== */
export default SoreBodyPart;