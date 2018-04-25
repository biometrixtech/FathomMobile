/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:30:13 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:30:13 
 */

/**
 * Spacer
 *
    <Spacer size={10} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

/* Component ==================================================================== */
const Spacer = ({ size }) => (
    <View
        style={{
            left:      0,
            right:     0,
            height:    1,
            marginTop: size - 1,
        }}
    />
);

Spacer.propTypes = { size: PropTypes.number };
Spacer.defaultProps = { size: 10 };
Spacer.componentName = 'Spacer';

/* Export Component ==================================================================== */
export default Spacer;
