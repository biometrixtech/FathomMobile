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
    let filteredBodyPartMap = _.filter(MyPlanConstants.bodyPartMapping, (u, i) => _.findIndex(soreBodyParts, o => o.body_part === i) === -1);
    let newBodyPartMap = _.filter(filteredBodyPartMap, o => {
        let itemStateFiltered = _.filter(soreBodyParts.body_parts, {body_part: o.index});
        return o.order &&
            _.findIndex(soreBodyParts.body_parts, u => u.body_part === o.index && u.side === 0) === -1 &&
            (itemStateFiltered.length === 1 || itemStateFiltered.length === 0);
    });
    newBodyPartMap = _.orderBy(newBodyPartMap, ['order'], ['asc']);
    let areaOfSorenessClicked = _.filter(soreBodyPartsState, bodyPartState => _.findIndex(soreBodyParts.body_parts, bodyPartProp => bodyPartProp.body_part === bodyPartState.body_part && bodyPartProp.side === bodyPartState.side) === -1);
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
                    let bodyImage = body.image[0] || body.image[2];
                    let bodyIndexInState = _.findIndex(soreBodyParts.body_parts, a => a.body_part === body.index);
                    if(body.bilateral && bodyIndexInState > -1) {
                        let newBodyImageIndex = soreBodyParts.body_parts[bodyIndexInState].side === 1 ? 2 : 1;
                        bodyImage = body.image[newBodyImageIndex];
                    }
                    return(
                        <TouchableOpacity
                            activeOpacity={0.5}
                            key={`AreasOfSoreness0${index}`}
                            onPress={() => handleAreaOfSorenessClick(body)}
                            style={[AppStyles.paddingSml]}
                        >
                            <SVGImage
                                image={bodyImage}
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