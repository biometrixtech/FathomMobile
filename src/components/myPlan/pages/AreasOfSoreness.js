/**
 * AreasOfSoreness
 *
    <AreasOfSoreness
        dailyReadiness={dailyReadiness}
        handleAreaOfSorenessClick={handleAreaOfSorenessClick}
        handleFormChange={handleFormChange}
        soreBodyParts={soreBodyParts}
        soreBodyPartsState={soreBodyPartsState}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants } from '../../../constants';
import { FathomSlider, SVGImage, Text } from '../../custom';

// import third-party libraries
import _ from 'lodash';

// Components
import { SoreBodyPart } from './';

/* Component ==================================================================== */
const AreasOfSoreness = ({
    dailyReadiness,
    handleAreaOfSorenessClick,
    handleFormChange,
    soreBodyParts,
    soreBodyPartsState,
}) => {
    let filteredBodyPartMap = _.filter(MyPlanConstants.bodyPartMapping, (u, i) => {
        return _.findIndex(soreBodyParts, (o) => o.body_part === i) === -1;
    });
    let newBodyPartMap = _.filter(filteredBodyPartMap, o => o.order);
    newBodyPartMap = _.orderBy(newBodyPartMap, ['order'], ['asc']);
    let areaOfSorenessClicked = _.filter(soreBodyPartsState, (u, i) => {
        return _.findIndex(soreBodyParts, (o) => o.body_part === u.body_part) === -1;
    }) || [];
    return(
        <View>
            <View style={[AppStyles.row, AppStyles.containerCentered, {flexWrap: 'wrap'}]}>
                {_.map(newBodyPartMap, (body, index) => {
                    return(
                        <TouchableOpacity
                            activeOpacity={0.5}
                            key={index}
                            onPress={() => handleAreaOfSorenessClick(body.index, 2)}
                            style={[AppStyles.paddingMed]}
                        >
                            <SVGImage
                                image={body.image[0] || body.image[2]}
                                style={{width: 100, height: 100}}
                            />
                        </TouchableOpacity>
                    )
                })}
            </View>
            {_.map(areaOfSorenessClicked, (area, i) => {
                return(
                    <View key={i} style={[AppStyles.paddingVertical]}>
                        <SoreBodyPart
                            bodyPart={MyPlanConstants.bodyPartMapping[area.body_part]}
                            dailyReadiness={dailyReadiness}
                            handleFormChange={handleFormChange}
                        />
                    </View>
                )
            })}
        </View>
    )
};

AreasOfSoreness.propTypes = {
    dailyReadiness:            PropTypes.object,
    handleAreaOfSorenessClick: PropTypes.func.isRequired,
    handleFormChange:          PropTypes.func.isRequired,
    soreBodyParts:             PropTypes.object.isRequired,
    soreBodyPartsState:        PropTypes.array.isRequired,
};
AreasOfSoreness.defaultProps = {};
AreasOfSoreness.componentName = 'AreasOfSoreness';

/* Export Component ================================================================== */
export default AreasOfSoreness;