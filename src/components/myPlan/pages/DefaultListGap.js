/**
 * Default List Gap
 *
    <DefaultListGap
        size={10}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, } from '../../../constants';
import { Spacer, } from '../../custom';

/* Component ==================================================================== */
const DefaultListGap = ({
    size,
}) => (
    <View style={{flexDirection: 'row',}}>
        <View
            style={{
                borderRightColor: AppColors.primary.grey.thirtyPercent,
                borderRightWidth: 1,
                width:            AppFonts.scaleFont(24) / 2}}
        />
        <Spacer size={size} />
    </View>
);

DefaultListGap.propTypes = {
    size: PropTypes.number,
};

DefaultListGap.defaultProps = {
    size: 10,
};

DefaultListGap.componentName = 'DefaultListGap';

/* Export Component ================================================================== */
export default DefaultListGap;
