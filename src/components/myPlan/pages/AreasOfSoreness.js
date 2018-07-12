/**
 * AreasOfSoreness
 *
    <AreasOfSoreness
        handleAreaOfSorenessClick={handleAreaOfSorenessClick}
        soreBodyParts={soreBodyParts}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants } from '../../../constants';
import { FathomSlider, Text } from '../../custom';

// import third-party libraries
import _ from 'lodash';

/* Component ==================================================================== */
const AreasOfSoreness = ({
    handleAreaOfSorenessClick,
    soreBodyParts,
}) => {
    let filteredBodyPartMap = _.filter(MyPlanConstants.bodyPartMapping, (u, i) => {
        return _.findIndex(soreBodyParts, (o) => o.body_part === i) === -1;
    });
    let newBodyPartMap = _.filter(filteredBodyPartMap, o => o.order);
    newBodyPartMap = _.orderBy(newBodyPartMap, ['order'], ['asc']);
    console.log('newBodyPartMap',newBodyPartMap);
    return(
        <View style={[AppStyles.row, AppStyles.containerCentered, {flexWrap: 'wrap'}]}>
            {_.map(newBodyPartMap, (body, index) => {
                return(
                    <TouchableOpacity activeOpacity={0.5} key={index} onPress={() => handleAreaOfSorenessClick(body.index, 2)}>
                        <Image
                            source={require('../../../constants/assets/images/body/R_Quad.svg')}
                            style={{margin: 10, width: 100, height: 100, backgroundColor: 'yellow'}}
                        />
                    </TouchableOpacity>
                )
            })}
        </View>
    )
};

AreasOfSoreness.propTypes = {
    handleAreaOfSorenessClick: PropTypes.func.isRequired,
    soreBodyParts:             PropTypes.array.isRequired,
};
AreasOfSoreness.defaultProps = {};
AreasOfSoreness.componentName = 'AreasOfSoreness';

/* Export Component ================================================================== */
export default AreasOfSoreness;