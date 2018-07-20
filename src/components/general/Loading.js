/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:27:15 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 16:48:55
 */

/**
 * Loading Screen
 *
     <Loading text={'Server is down'} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';

// Consts and Libs
import { AppStyles } from '@constants';

// Components
import { Spacer, Text } from '@custom';

/* Component ==================================================================== */
const Loading = ({ text, transparent }) => (
    <View
        style={[
            AppStyles.container,
            AppStyles.containerCentered,
            transparent && { backgroundColor: 'rgba(255,255,255,0.75)' },
        ]}
    >
        <ActivityIndicator
            animating
            size={'large'}
            color={transparent ? '#000' : '#AAA'}
        />

        <Spacer />

        {!!text && <Text>{text}</Text>}
    </View>
);

Loading.propTypes = { text: PropTypes.string, transparent: PropTypes.bool };
Loading.defaultProps = { text: null, transparent: false };
Loading.componentName = 'Loading';

/* Export Component ==================================================================== */
export default Loading;
