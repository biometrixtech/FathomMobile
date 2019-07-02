/**
 * BodyOverlay
 *
    <BodyOverlay />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image as RNImage, View, } from 'react-native';

// Consts and Libs
import { AppColors, } from '../../constants';

// NOTE: https://css-tricks.com/8-digit-hex-codes/

/* Component ==================================================================== */
class BodyOverlay extends Component {
    static propTypes = {}

    static defaultProps = {}

    constructor(props) {
        super(props);
    }

    render = () => (
        <View>
            {/*<RNImage
                resizeMode={'contain'}
                source={require('../../../assets/images/body/aaa_body_full.png')}
                style={{height: 200, width: 200,}}
            />
            <RNImage
                resizeMode={'contain'}
                source={require('../../../assets/images/body/aaa_abdominals.png')}
                style={{height: 200, position: 'absolute', tintColor: `${AppColors.zeplin.error}80`, width: 200,}}
            />
            <RNImage
                resizeMode={'contain'}
                source={require('../../../assets/images/body/aaa_left_quad.png')}
                style={{height: 200, position: 'absolute', tintColor: `${AppColors.zeplin.error}33`, width: 200,}}
            />*/}
        </View>
    );
}

/* Export Component ==================================================================== */
export default BodyOverlay;
