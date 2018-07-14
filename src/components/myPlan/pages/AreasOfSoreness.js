/**
 * AreasOfSoreness
 *
    <AreasOfSoreness
        handleAreaOfSorenessClick={handleAreaOfSorenessClick}
        handleFormChange={handleFormChange}
        soreBodyParts={soreBodyParts}
        soreBodyPartsState={soreBodyPartsState}
        surveyObject={surveyObject}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants } from '../../../constants';
import { SVGImage, Text } from '../../custom';

// import third-party libraries
import _ from 'lodash';

// Components
import { SoreBodyPart } from './';

/* Component ==================================================================== */
const AreasOfSoreness = ({
    handleAreaOfSorenessClick,
    handleFormChange,
    soreBodyParts,
    soreBodyPartsState,
    surveyObject,
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
                    let isSelected = false;
                    _.map(areaOfSorenessClicked, area => {
                        if(area.body_part === body.index) {
                            isSelected = true;
                        }
                    });
                    return(
                        <TouchableOpacity
                            activeOpacity={0.5}
                            key={`AreasOfSoreness0${index}`}
                            onPress={() => handleAreaOfSorenessClick(body)}
                            style={[AppStyles.paddingSml]}
                        >
                            <SVGImage
                                image={body.image[0] || body.image[2]}
                                selected={isSelected}
                                style={{width: 100, height: 100}}
                            />
                        </TouchableOpacity>
                    )
                })}
            </View>
            {_.map(areaOfSorenessClicked, (area, i) => {
                return(
                    <View key={`AreasOfSoreness1${i}`} style={[AppStyles.paddingVertical]}>
                        <SoreBodyPart
                            bodyPart={MyPlanConstants.bodyPartMapping[area.body_part]}
                            bodyPartSide={area.side}
                            handleFormChange={handleFormChange}
                            surveyObject={surveyObject}
                        />
                    </View>
                )
            })}
        </View>
    )
};

AreasOfSoreness.propTypes = {
    handleAreaOfSorenessClick: PropTypes.func.isRequired,
    handleFormChange:          PropTypes.func.isRequired,
    soreBodyParts:             PropTypes.object.isRequired,
    soreBodyPartsState:        PropTypes.array.isRequired,
    surveyObject:              PropTypes.object,
};
AreasOfSoreness.defaultProps = {};
AreasOfSoreness.componentName = 'AreasOfSoreness';

/* Export Component ================================================================== */
export default AreasOfSoreness;