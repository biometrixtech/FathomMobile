/*
 * @Author: Vir Desai
 * @Date: 2018-07-12 18:48:09
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-13 17:43:57
 */

/**
 * SVGImage
 *
    <SVGImage
        image={bodyPartMap.image[0] ? bodyPartMap.image[0] : bodyPartMap.image[2]}
        selected={true}
        style={{width: 100, height: 100}}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes } from '../../constants';

// import third-party libraries
import Image from 'react-native-remote-svg';

/* Component ==================================================================== */
class SVGImage extends Component {
    static propTypes = {
        image:    PropTypes.string.isRequired,
        selected: PropTypes.bool,
        style:    PropTypes.object.isRequired,
    }

    static defaultProps = {
        selected: false,
    }

    imageString = () => {
        // Defaults
        const { image } = this.props;
        /* eslint-disable indent */
        let imageName = image === 'Abs.svg' ?
            require('../../constants/assets/images/body/Abs.svg')
          : image === 'Hip.svg' ?
            require('../../constants/assets/images/body/Hip.svg')
          : image === 'L_Hip.svg' ?
            require('../../constants/assets/images/body/L_Hip.svg')
          : image === 'R_Hip.svg' ?
            require('../../constants/assets/images/body/R_Hip.svg')
          : image === 'Groin.svg' ?
            require('../../constants/assets/images/body/Groin.svg')
          : image === 'L_Groin.svg' ?
            require('../../constants/assets/images/body/L_Groin.svg')
          : image === 'R_Groin.svg' ?
            require('../../constants/assets/images/body/R_Groin.svg')
          : image === 'Quad.svg' ?
            require('../../constants/assets/images/body/Quad.svg')
          : image === 'L_Quad.svg' ?
            require('../../constants/assets/images/body/L_Quad.svg')
          : image === 'R_Quad.svg' ?
            require('../../constants/assets/images/body/R_Quad.svg')
          : image === 'Knee.svg' ?
            require('../../constants/assets/images/body/Knee.svg')
          : image === 'L_Knee.svg' ?
            require('../../constants/assets/images/body/L_Knee.svg')
          : image === 'R_Knee.svg' ?
            require('../../constants/assets/images/body/R_Knee.svg')
          : image === 'Shin.svg' ?
            require('../../constants/assets/images/body/Shin.svg')
          : image === 'L_Shin.svg' ?
            require('../../constants/assets/images/body/L_Shin.svg')
          : image === 'R_Shin.svg' ?
            require('../../constants/assets/images/body/R_Shin.svg')
          : image === 'Ankle.svg' ?
            require('../../constants/assets/images/body/Ankle.svg')
          : image === 'L_Ankle.svg' ?
            require('../../constants/assets/images/body/L_Ankle.svg')
          : image === 'R_Ankle.svg' ?
            require('../../constants/assets/images/body/R_Ankle.svg')
          : image === 'Foot.svg' ?
            require('../../constants/assets/images/body/Foot.svg')
          : image === 'L_Foot.svg' ?
            require('../../constants/assets/images/body/L_Foot.svg')
          : image === 'R_Foot.svg' ?
            require('../../constants/assets/images/body/R_Foot.svg')
          : image === 'ITBand.svg' ?
            require('../../constants/assets/images/body/ITBand.svg')
          : image === 'L_ITBand.svg' ?
            require('../../constants/assets/images/body/L_ITBand.svg')
          : image === 'R_ITBand.svg' ?
            require('../../constants/assets/images/body/R_ITBand.svg')
          : image === 'LowBack.svg' ?
            require('../../constants/assets/images/body/LowBack.svg')
          : image === 'Glute.svg' ?
            require('../../constants/assets/images/body/Glute.svg')
          : image === 'L_Glute.svg' ?
            require('../../constants/assets/images/body/L_Glute.svg')
          : image === 'R_Glute.svg' ?
            require('../../constants/assets/images/body/R_Glute.svg')
          : image === 'Hamstring.svg' ?
            require('../../constants/assets/images/body/Hamstring.svg')
          : image === 'L_Hamstring.svg' ?
            require('../../constants/assets/images/body/L_Hamstring.svg')
          : image === 'R_Hamstring.svg' ?
            require('../../constants/assets/images/body/R_Hamstring.svg')
          : image === 'Calf.svg' ?
            require('../../constants/assets/images/body/Calf.svg')
          : image === 'L_Calf.svg' ?
            require('../../constants/assets/images/body/L_Calf.svg')
          : image === 'R_Calf.svg' ?
            require('../../constants/assets/images/body/R_Calf.svg')
          : image === 'Achilles.svg' ?
            require('../../constants/assets/images/body/Achilles.svg')
          : image === 'L_Achilles.svg' ?
            require('../../constants/assets/images/body/L_Achilles.svg')
          : image === 'R_Achilles.svg' ?
            require('../../constants/assets/images/body/R_Achilles.svg')
          :
            require('../../constants/assets/images/body/Abs.svg');
        return imageName;
    }

    render = () => (
        <View style={{
            height:       AppSizes.screen.widthQuarter,
            width:        AppSizes.screen.widthQuarter,
            borderRadius: AppSizes.screen.widthQuarter,
            borderWidth:  4,
            borderColor:  this.props.selected ? AppColors.secondary.blue.hundredPercent : AppColors.white
        }}>
            <Image
                source={this.imageString()}
                style={this.props.style}
            />
        </View>
    );
}

/* Export Component ==================================================================== */
export default SVGImage;
