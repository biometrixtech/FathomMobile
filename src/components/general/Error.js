/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:26:38
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:22:27
 */

/**
 * Error Screen
 *
    <Error text={'Server is down'} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

// import third-party libraries
import { Icon, } from 'react-native-elements';

// Consts and Libs
import { AppStyles, } from '../../constants';

// Components
import { Button, Spacer, Text, } from '../custom';

/* Component ==================================================================== */
const Error = ({ text, tryAgain }) => (
    <View style={[AppStyles.container, AppStyles.containerCentered]}>
        <Icon color={'#ccc'} name={'alert-circle-outline'} size={50} type={'material-community'} />

        <Spacer size={10} />

        <Text style={AppStyles.textCenterAligned}>{text}</Text>

        <Spacer size={20} />

        {!!tryAgain &&
          <Button
              small
              outlined
              title={'Try again'}
              onPress={tryAgain}
          />
        }
    </View>
);

Error.propTypes = { text: PropTypes.string, tryAgain: PropTypes.func };
Error.defaultProps = { text: 'Woops, Something went wrong.', tryAgain: null };
Error.componentName = 'Error';

/* Export Component ==================================================================== */
export default Error;
