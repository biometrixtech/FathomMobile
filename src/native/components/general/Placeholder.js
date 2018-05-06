/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:27:49 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 22:57:25
 */

/**
 * Placeholder Scene
 *
    <Placeholder text={"Hello World"} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

// Consts and Libs
import { AppStyles } from '../../theme/';

// Components
import { Text } from '../custom/';

/* Component ==================================================================== */
const Placeholder = ({ text }) => (
    <View style={[AppStyles.activityIndicator]}>
        <Text>{text}</Text>
    </View>
);

Placeholder.propTypes = { text: PropTypes.string };
Placeholder.defaultProps = { text: 'Coming soon...' };
Placeholder.componentName = 'Placeholder';

/* Export Component ==================================================================== */
export default Placeholder;
