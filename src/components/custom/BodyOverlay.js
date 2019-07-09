/**
 * BodyOverlay
 *
    <BodyOverlay
        bodyParts={[]}
        remainingWidth={(AppSizes.screen.width - (AppSizes.paddingMed + AppSizes.padding))}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image as RNImage, View, } from 'react-native';
import resolveAssetSource from 'resolveAssetSource';

// import third-party libraries
import _ from 'lodash';

// Consts and Libs
import { AppSizes, } from '../../constants';
import { PlanLogic, } from '../../lib';

const ADDITIONAL_MIDDLE_PADDING = AppSizes.paddingSml;

/* Component ==================================================================== */
class BodyOverlay extends Component {
    static propTypes = {
        bodyParts:      PropTypes.array.isRequired,
        remainingWidth: PropTypes.number.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
    }

    componentWillMount = () => {
        let backImage =  require('../../../assets/images/body/body_overlay/body_full_back.png');
        let backImageSource = resolveAssetSource(backImage);
        let frontImage =  require('../../../assets/images/body/body_overlay/body_full_front.png');
        let frontImageSource = resolveAssetSource(frontImage);
        const { remainingWidth, } = this.props;
        let updatedRemainingWidth = (remainingWidth - ADDITIONAL_MIDDLE_PADDING);
        let backImageRatio = ((updatedRemainingWidth / 2) / backImageSource.width);
        let frontImageRatio = ((updatedRemainingWidth / 2) / frontImageSource.width);
        this.setState({
            back:  { height: ((updatedRemainingWidth / 2) / backImageRatio), width: (updatedRemainingWidth / 2), },
            front: { height: ((updatedRemainingWidth / 2) / frontImageRatio), width: (updatedRemainingWidth / 2), },
        });
    }

    _getImageString = image => {
        /* eslint-disable indent */
        let imageName = image === 'Abs.svg' ?
                require('../../../assets/images/body/body_overlay/Abs.png')
            : image === 'L_Hip.svg' ?
                require('../../../assets/images/body/body_overlay/L_Hip.png')
            : image === 'R_Hip.svg' ?
                require('../../../assets/images/body/body_overlay/R_Hip.png')
            : image === 'L_Groin.svg' ?
                require('../../../assets/images/body/body_overlay/L_Groin.png')
            : image === 'R_Groin.svg' ?
                require('../../../assets/images/body/body_overlay/R_Groin.png')
            : image === 'L_Quad.svg' ?
                require('../../../assets/images/body/body_overlay/L_Quad.png')
            : image === 'R_Quad.svg' ?
                require('../../../assets/images/body/body_overlay/R_Quad.png')
            : image === 'L_Knee.svg' ?
                require('../../../assets/images/body/body_overlay/L_Knee.png')
            : image === 'R_Knee.svg' ?
                require('../../../assets/images/body/body_overlay/R_Knee.png')
            : image === 'L_Shin.svg' ?
                require('../../../assets/images/body/body_overlay/L_Shin.png')
            : image === 'R_Shin.svg' ?
                require('../../../assets/images/body/body_overlay/R_Shin.png')
            : image === 'L_Ankle.svg' ?
                require('../../../assets/images/body/body_overlay/L_Ankle.png')
            : image === 'R_Ankle.svg' ?
                require('../../../assets/images/body/body_overlay/R_Ankle.png')
            : image === 'L_Foot.svg' ?
                require('../../../assets/images/body/body_overlay/L_Foot.png')
            : image === 'R_Foot.svg' ?
                require('../../../assets/images/body/body_overlay/R_Foot.png')
            : image === 'L_ITBand.svg' ?
                require('../../../assets/images/body/body_overlay/L_ITBand.png')
            : image === 'R_ITBand.svg' ?
                require('../../../assets/images/body/body_overlay/R_ITBand.png')
            : image === 'LowBack.svg' ?
                require('../../../assets/images/body/body_overlay/LowBack.png')
            : image === 'L_Glute.svg' ?
                require('../../../assets/images/body/body_overlay/L_Glute.png')
            : image === 'R_Glute.svg' ?
                require('../../../assets/images/body/body_overlay/R_Glute.png')
            : image === 'L_Hamstring.svg' ?
                require('../../../assets/images/body/body_overlay/L_Hamstring.png')
            : image === 'R_Hamstring.svg' ?
                require('../../../assets/images/body/body_overlay/R_Hamstring.png')
            : image === 'L_Calf.svg' ?
                require('../../../assets/images/body/body_overlay/L_Calf.png')
            : image === 'R_Calf.svg' ?
                require('../../../assets/images/body/body_overlay/R_Calf.png')
            : image === 'L_Achilles.svg' ?
                require('../../../assets/images/body/body_overlay/L_Achilles.png')
            : image === 'R_Achilles.svg' ?
                require('../../../assets/images/body/body_overlay/R_Achilles.png')
            : image === 'UpperBackNeck.svg' ?
                require('../../../assets/images/body/body_overlay/UpperBackNeck.png')
            : image === 'L_Shoulder.svg' ?
                require('../../../assets/images/body/body_overlay/L_Shoulder.png')
            : image === 'R_Shoulder.svg' ?
                require('../../../assets/images/body/body_overlay/R_Shoulder.png')
            : image === 'L_Elbow.svg' ?
                require('../../../assets/images/body/body_overlay/L_Elbow.png')
            : image === 'R_Elbow.svg' ?
                require('../../../assets/images/body/body_overlay/R_Elbow.png')
            : image === 'L_Lats.svg' ?
                require('../../../assets/images/body/body_overlay/L_Lats.png')
            : image === 'R_Lats.svg' ?
                require('../../../assets/images/body/body_overlay/R_Lats.png')
            : image === 'L_Wrist.svg' ?
                require('../../../assets/images/body/body_overlay/L_Wrist.png')
            : image === 'R_Wrist.svg' ?
                require('../../../assets/images/body/body_overlay/R_Wrist.png')
            : image === 'L_Pec.svg' ?
                require('../../../assets/images/body/body_overlay/L_Pec.png')
            : image === 'R_Pec.svg' ?
                require('../../../assets/images/body/body_overlay/R_Pec.png')
            :
                require('../../../assets/images/body/body_overlay/Abs.png');
        return imageName;
    }

    render = () => {
        const { bodyParts, } = this.props;
        const { back, front, } = this.state;
        let { filteredBackBodyParts, filteredFrontBodyParts, } = PlanLogic.handleBodyOverlayRenderLogic(bodyParts, this._getImageString);
        return (
            <View style={{flexDirection: 'row',}}>
                <View style={{marginRight: ADDITIONAL_MIDDLE_PADDING,}}>
                    <RNImage
                        resizeMode={'contain'}
                        source={require('../../../assets/images/body/body_overlay/body_full_front.png')}
                        style={{height: front.height, width: front.width,}}
                    />
                    {_.map(filteredFrontBodyParts, (bodyPart, i) =>
                        <RNImage
                            key={i}
                            resizeMode={'contain'}
                            source={bodyPart.imageSource}
                            style={{height: front.height, position: 'absolute', tintColor: bodyPart.tintColor, width: front.width,}}
                        />
                    )}
                </View>
                <View>
                    <RNImage
                        resizeMode={'contain'}
                        source={require('../../../assets/images/body/body_overlay/body_full_back.png')}
                        style={{height: back.height, width: back.width,}}
                    />
                    {_.map(filteredBackBodyParts, (bodyPart, i) =>
                        <RNImage
                            key={i}
                            resizeMode={'contain'}
                            source={bodyPart.imageSource}
                            style={{height: back.height, position: 'absolute', tintColor: bodyPart.tintColor,  width: back.width,}}
                        />
                    )}
                </View>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default BodyOverlay;
