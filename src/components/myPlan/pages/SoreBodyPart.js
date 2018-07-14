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
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants } from '../../../constants';
import { FathomSlider, SVGImage, Text } from '../../custom';

// import third-party libraries
import _ from 'lodash';

/* Component ==================================================================== */
const SoreBodyPart = ({
    bodyPart,
    bodyPartSide,
    handleFormChange,
    index,
    surveyObject,
}) => {
    console.log(bodyPart,
        bodyPartSide,
        index,
        surveyObject,);
    let bodyPartSorenessIndex = _.findIndex(surveyObject.soreness, (o) => o.body_part === bodyPart.body_part && o.side === bodyPartSide);
    let severityValue = surveyObject.soreness[bodyPartSorenessIndex] ? surveyObject.soreness[bodyPartSorenessIndex].severity || 0 : 0;
    let bodyPartMap = MyPlanConstants.bodyPartMapping[bodyPart.body_part];
    let bodyPartGroup = bodyPartMap ? bodyPartMap.group : false;
    let severityString = '';
    if(bodyPartGroup === 'joint') {
        severityString = MyPlanConstants.jointLevels[severityValue].toUpperCase();
    } else if (bodyPartGroup === 'muscle') {
        severityString = MyPlanConstants.muscleLevels[severityValue].toUpperCase();
    }
    let helpingVerb = bodyPartMap ? bodyPartMap.helping_verb : '';
    let mainBodyPartName = bodyPartMap ? bodyPartMap.label.toUpperCase() : '';
    if (mainBodyPartName.slice(-1) === 'S' && bodyPartMap.bilateral && bodyPartSide !== 0) {
        if (mainBodyPartName === 'ACHILLES') {
            // do nothing
        } else if (mainBodyPartName === 'CALVES') {
            mainBodyPartName = 'CALF';
        } else {
            mainBodyPartName = mainBodyPartName.slice(0, -1);
        }
        helpingVerb = 'is';
    }
    let bodyPartName = `${bodyPartMap.bilateral && bodyPartSide === 1 ? 'LEFT ' : bodyPartMap.bilateral && bodyPartSide === 2 ? 'RIGHT ' : ''}${mainBodyPartName}`;
    return(
        <View>
            { index ?
                <View>
                    <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.primary.grey.thirtyPercent}]}>
                        {index}
                    </Text>
                    <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.h3, AppStyles.bold, {color: AppColors.black}]}>
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
                null
            }
            <View style={[AppStyles.row, AppStyles.paddingVerticalSml, {justifyContent: 'space-between'}]}>
                <Text style={[AppStyles.paddingHorizontal, AppStyles.bold, {color: AppColors.black}]}>
                    {bodyPartName}
                </Text>
                <Text style={[AppStyles.paddingHorizontal, AppStyles.textRightAligned, AppStyles.bold, {color: AppColors.slider[severityValue]}]}>
                    {severityString.length > 0 ? `${severityValue}: ${severityString}` : ''}
                </Text>
            </View>
            <FathomSlider
                bodyPart={bodyPart.index}
                handleFormChange={handleFormChange}
                maximumValue={5}
                minimumValue={0}
                name={'soreness'}
                side={bodyPartSide}
                thumbTintColor={AppColors.slider[severityValue]}
                value={severityValue}
            />
        </View>
    )
};

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