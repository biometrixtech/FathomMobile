/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:30:13
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 16:47:31
 */

/**
 * Spacer
 *
    <Spacer size={10} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

// import third-party libraries
import { Divider, } from 'react-native-elements';

// Consts and Libs
import { AppColors, } from '../../constants';

/* Component ==================================================================== */
const Spacer = ({ isDivider, size }) => isDivider ?
    <Divider style={{backgroundColor: AppColors.zeplin.slateXLight, height: 1,}} />
    :
    <View
        style={{
            left:      0,
            right:     0,
            height:    1,
            marginTop: size - 1,
        }}
    />;

Spacer.propTypes = {
    isDivider: PropTypes.bool,
    size:      PropTypes.number,
};
Spacer.defaultProps = {
    isDivider: false,
    size:      10,
};
Spacer.componentName = 'Spacer';

/* Export Component ==================================================================== */
export default Spacer;
