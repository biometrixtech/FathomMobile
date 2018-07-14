/**
 * SoreBodyPart
 *
    <SoreBodyPart
        bodyPart={bodyPart}
        bodyPartSide={bodyPartSide}
        dailyReadiness={dailyReadiness}
        handleFormChange={handleFormChange}
        index={i+3}
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
    dailyReadiness,
    handleFormChange,
    index,
}) => {
    let bodyPartMap = MyPlanConstants.bodyPartMapping[bodyPart.body_part];
    let bodyPartSorenessIndex = _.findIndex(dailyReadiness.soreness, (o) => o.body_part === bodyPart.body_part && o.side === bodyPartSide);
    let severityValue = dailyReadiness.soreness[bodyPartSorenessIndex] ? dailyReadiness.soreness[bodyPartSorenessIndex].severity : 0;
    let bodyPartGroup = bodyPartMap ? bodyPartMap.group : false;
    let severityString = '';
    if(bodyPartGroup === 'joint') {
        severityString = MyPlanConstants.jointLevels[severityValue].toUpperCase();
    } else if (bodyPartGroup === 'muscle') {
        severityString = MyPlanConstants.muscleLevels[severityValue].toUpperCase();
    }
    let bodyPartString = bodyPartMap ?
        (bodyPartMap.bilateral ? (bodyPartSide === 1 || bodyPart.side === 1) ? 'LEFT ' : (bodyPartSide === 2 || bodyPart.side === 2) ? 'RIGHT ' : '' : '')
            +
            bodyPartMap.label.toUpperCase()
        :
        '';
    return(
        <View>
            { index ?
                <View>
                    <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.primary.grey.thirtyPercent}]}>
                        {index}
                    </Text>
                    <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.h3, AppStyles.bold, {color: AppColors.black}]}>
                        {`Is/are your ${bodyPartString} bothering you today?`}
                    </Text>
                    <View style={[AppStyles.containerCentered]}>
                        <SVGImage
                            image={bodyPartMap.image[0] ? bodyPartMap.image[0] : bodyPartMap.image[2]}
                            style={{width: 100, height: 100}}
                        />
                    </View>
                </View>
                :
                null
            }
            <View style={[AppStyles.row, AppStyles.paddingVerticalSml, {justifyContent: 'space-between'}]}>
                <Text style={[AppStyles.paddingHorizontal, AppStyles.bold, {color: AppColors.black}]}>
                    {bodyPartString}
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
    dailyReadiness:   PropTypes.object,
    handleFormChange: PropTypes.func.isRequired,
    index:            PropTypes.number,
};
SoreBodyPart.defaultProps = {
    bodyPartSide:   0,
    dailyReadiness: {},
    index:          null,
};
SoreBodyPart.componentName = 'SoreBodyPart';

/* Export Component ================================================================== */
export default SoreBodyPart;