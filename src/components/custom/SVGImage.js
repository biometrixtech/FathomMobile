/*
 * @Author: Vir Desai
 * @Date: 2018-07-12 18:48:09
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:38:41
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
import { Platform, View } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes } from '../../constants';
import data_uri from '../../../assets/images/body/data_uri';

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
        let imageName = Platform.OS === 'ios' ?
        image === 'Abs.svg' ?
            require('../../../assets/images/body/Abs.svg')
          : image === 'Hip.svg' ?
            require('../../../assets/images/body/Hip.svg')
          : image === 'L_Hip.svg' ?
            require('../../../assets/images/body/L_Hip.svg')
          : image === 'R_Hip.svg' ?
            require('../../../assets/images/body/R_Hip.svg')
          : image === 'Groin.svg' ?
            require('../../../assets/images/body/Groin.svg')
          : image === 'L_Groin.svg' ?
            require('../../../assets/images/body/L_Groin.svg')
          : image === 'R_Groin.svg' ?
            require('../../../assets/images/body/R_Groin.svg')
          : image === 'Quad.svg' ?
            require('../../../assets/images/body/Quad.svg')
          : image === 'L_Quad.svg' ?
            require('../../../assets/images/body/L_Quad.svg')
          : image === 'R_Quad.svg' ?
            require('../../../assets/images/body/R_Quad.svg')
          : image === 'Knee.svg' ?
            require('../../../assets/images/body/Knee.svg')
          : image === 'L_Knee.svg' ?
            require('../../../assets/images/body/L_Knee.svg')
          : image === 'R_Knee.svg' ?
            require('../../../assets/images/body/R_Knee.svg')
          : image === 'Shin.svg' ?
            require('../../../assets/images/body/Shin.svg')
          : image === 'L_Shin.svg' ?
            require('../../../assets/images/body/L_Shin.svg')
          : image === 'R_Shin.svg' ?
            require('../../../assets/images/body/R_Shin.svg')
          : image === 'Ankle.svg' ?
            require('../../../assets/images/body/Ankle.svg')
          : image === 'L_Ankle.svg' ?
            require('../../../assets/images/body/L_Ankle.svg')
          : image === 'R_Ankle.svg' ?
            require('../../../assets/images/body/R_Ankle.svg')
          : image === 'Foot.svg' ?
            require('../../../assets/images/body/Foot.svg')
          : image === 'L_Foot.svg' ?
            require('../../../assets/images/body/L_Foot.svg')
          : image === 'R_Foot.svg' ?
            require('../../../assets/images/body/R_Foot.svg')
          : image === 'ITBand.svg' ?
            require('../../../assets/images/body/ITBand.svg')
          : image === 'L_ITBand.svg' ?
            require('../../../assets/images/body/L_ITBand.svg')
          : image === 'R_ITBand.svg' ?
            require('../../../assets/images/body/R_ITBand.svg')
          : image === 'LowBack.svg' ?
            require('../../../assets/images/body/LowBack.svg')
          : image === 'Glute.svg' ?
            require('../../../assets/images/body/Glute.svg')
          : image === 'L_Glute.svg' ?
            require('../../../assets/images/body/L_Glute.svg')
          : image === 'R_Glute.svg' ?
            require('../../../assets/images/body/R_Glute.svg')
          : image === 'Hamstring.svg' ?
            require('../../../assets/images/body/Hamstring.svg')
          : image === 'L_Hamstring.svg' ?
            require('../../../assets/images/body/L_Hamstring.svg')
          : image === 'R_Hamstring.svg' ?
            require('../../../assets/images/body/R_Hamstring.svg')
          : image === 'Calf.svg' ?
            require('../../../assets/images/body/Calf.svg')
          : image === 'L_Calf.svg' ?
            require('../../../assets/images/body/L_Calf.svg')
          : image === 'R_Calf.svg' ?
            require('../../../assets/images/body/R_Calf.svg')
          : image === 'Achilles.svg' ?
            require('../../../assets/images/body/Achilles.svg')
          : image === 'L_Achilles.svg' ?
            require('../../../assets/images/body/L_Achilles.svg')
          : image === 'R_Achilles.svg' ?
            require('../../../assets/images/body/R_Achilles.svg')
          :
            require('../../../assets/images/body/Abs.svg')
        :
        image === 'Abs.svg' ?
            data_uri.Abs
          : image === 'Hip.svg' ?
            data_uri.Hip
          : image === 'L_Hip.svg' ?
            data_uri.L_Hip
          : image === 'R_Hip.svg' ?
            data_uri.R_Hip
          : image === 'Groin.svg' ?
            data_uri.Groin
          : image === 'L_Groin.svg' ?
            data_uri.L_Groin
          : image === 'R_Groin.svg' ?
            data_uri.R_Groin
          : image === 'Quad.svg' ?
            data_uri.Quad
          : image === 'L_Quad.svg' ?
            data_uri.L_Quad
          : image === 'R_Quad.svg' ?
            data_uri.R_Quad
          : image === 'Knee.svg' ?
            data_uri.Knee
          : image === 'L_Knee.svg' ?
            data_uri.L_Knee
          : image === 'R_Knee.svg' ?
            data_uri.R_Knee
          : image === 'Shin.svg' ?
            data_uri.Shin
          : image === 'L_Shin.svg' ?
            data_uri.L_Shin
          : image === 'R_Shin.svg' ?
            data_uri.R_Shin
          : image === 'Ankle.svg' ?
            data_uri.Ankle
          : image === 'L_Ankle.svg' ?
            data_uri.L_Ankle
          : image === 'R_Ankle.svg' ?
            data_uri.R_Ankle
          : image === 'Foot.svg' ?
            data_uri.Foot
          : image === 'L_Foot.svg' ?
            data_uri.L_Foot
          : image === 'R_Foot.svg' ?
            data_uri.R_Foot
          : image === 'ITBand.svg' ?
            data_uri.ITBand
          : image === 'L_ITBand.svg' ?
            data_uri.L_ITBand
          : image === 'R_ITBand.svg' ?
            data_uri.R_ITBand
          : image === 'LowBack.svg' ?
            data_uri.LowBack
          : image === 'Glute.svg' ?
            data_uri.Glute
          : image === 'L_Glute.svg' ?
            data_uri.L_Glute
          : image === 'R_Glute.svg' ?
            data_uri.R_Glute
          : image === 'Hamstring.svg' ?
            data_uri.Hamstring
          : image === 'L_Hamstring.svg' ?
            data_uri.L_Hamstring
          : image === 'R_Hamstring.svg' ?
            data_uri.R_Hamstring
          : image === 'Calf.svg' ?
            data_uri.Calf
          : image === 'L_Calf.svg' ?
            data_uri.L_Calf
          : image === 'R_Calf.svg' ?
            data_uri.R_Calf
          : image === 'Achilles.svg' ?
            data_uri.Achilles
          : image === 'L_Achilles.svg' ?
            data_uri.L_Achilles
          : image === 'R_Achilles.svg' ?
            data_uri.R_Achilles
          :
            data_uri.Abs;
        return imageName;
    }

    render = () => (
        <View style={{
            height:         AppSizes.screen.widthQuarter + 5,
            width:          AppSizes.screen.widthQuarter + 5,
            borderRadius:   AppSizes.screen.widthQuarter + 5,
            borderWidth:    3,
            borderColor:    this.props.selected ? AppColors.secondary.blue.hundredPercent : AppColors.white,
            justifyContent: 'center',
            alignItems:     'center',
            overflow:       'hidden'
        }}>
          <Image
            source={ Platform.OS ==='ios' ? this.imageString(): { uri: this.imageString() } }
            style={this.props.style}
            resizeMode={'contain'}
          />
        </View>
    );
}

/* Export Component ==================================================================== */
export default SVGImage;
