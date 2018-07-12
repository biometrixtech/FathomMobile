/**
 * SoreBodyPart
 *
    <SoreBodyPart
        bodyPart={bodyPart}
        dailyReadiness={dailyReadiness}
        handleFormChange={handleFormChange}
        index={i+3}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants } from '../../../constants';
import { FathomSlider, Text } from '../../custom';

// import third-party libraries
import _ from 'lodash';

/* Component ==================================================================== */
const SoreBodyPart = ({
    bodyPart,
    dailyReadiness,
    handleFormChange,
    index,
}) => {
    let bodyPartSorenessIndex = _.findIndex(dailyReadiness.soreness, (o) => o.body_part === bodyPart.body_part);
    let severityValue = dailyReadiness.soreness[bodyPartSorenessIndex] ? dailyReadiness.soreness[bodyPartSorenessIndex].severity : 0;
    let bodyPartMap = MyPlanConstants.bodyPartMapping[bodyPart.body_part];
    let bodyPartGroup = bodyPartMap ? bodyPartMap.group : false;
    let severityString = '';
    if(bodyPartGroup === 'joint') {
        severityString = MyPlanConstants.jointLevels[severityValue].toUpperCase();
    } else if (bodyPartGroup === 'muscle') {
        severityString = MyPlanConstants.muscleLevels[severityValue].toUpperCase();
    }
    // let bodyPartImage;
    // try {
    //     bodyPartImage = require(`../../../constants/assets/images/body/${bodyPartMap.image[bodyPart.side]}`);
    // } catch (e) {
    //     bodyPartImage = require(`../../../constants/assets/images/body/${bodyPartMap.image[2]}`);
    // }
    return(
        <View>
            <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.primary.grey.thirtyPercent}]}>
                {index}
            </Text>
            <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.h3, AppStyles.bold, {color: AppColors.black}]}>
                {`Is/are your ${bodyPartMap ? bodyPartMap.label.toUpperCase() : ''} bothering you today?`}
            </Text>
            <View style={[AppStyles.containerCentered]}>
                {/*<Image
                    source={bodyPartImage}
                    style={{width: 100, height: 100, backgroundColor: 'yellow'}}
                />*/}
            </View>
            <View style={[AppStyles.row, AppStyles.paddingVerticalSml, {justifyContent: 'space-between'}]}>
                <Text style={[AppStyles.paddingHorizontal, AppStyles.bold, {color: AppColors.black}]}>
                    {bodyPartMap ? bodyPartMap.label.toUpperCase() : ''}
                </Text>
                <Text style={[AppStyles.paddingHorizontal, AppStyles.textRightAligned, AppStyles.bold, {color: AppColors.slider[severityValue]}]}>
                    {severityString.length > 0 ? `${severityValue}: ${severityString}` : ''}
                </Text>
            </View>
            <FathomSlider
                bodyPart={bodyPart.body_part}
                handleFormChange={handleFormChange}
                maximumValue={5}
                minimumValue={0}
                name={'soreness'}
                thumbTintColor={AppColors.slider[severityValue]}
                value={severityValue}
            />
        </View>
    )
};

SoreBodyPart.propTypes = {
    handleFormChange: PropTypes.func.isRequired,
    dailyReadiness:   PropTypes.object,
    bodyPart:         PropTypes.object.isRequired,
    index:            PropTypes.number.isRequired,
};
SoreBodyPart.defaultProps = {};
SoreBodyPart.componentName = 'SoreBodyPart';

/* Export Component ================================================================== */
export default SoreBodyPart;