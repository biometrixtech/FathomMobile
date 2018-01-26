/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:27:49 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-11-09 14:26:42
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
import { AppStyles, AppSizes } from '@theme/';

// Components
import { Text } from '@ui/';

/* Component ==================================================================== */
const Placeholder = ({ text }) => (
    <View style={[AppStyles.container, AppStyles.containerCentered, { alignSelf: 'center', width: AppSizes.screen.width }]}>
        <Text>{text}</Text>
    </View>
);

Placeholder.propTypes = { text: PropTypes.string };
Placeholder.defaultProps = { text: 'Coming soon...' };
Placeholder.componentName = 'Placeholder';

/* Export Component ==================================================================== */
export default Placeholder;
