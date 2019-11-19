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

    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps.remainingWidth !== this.props.remainingWidth) {
            this._handleImageSizing();
        }
    }

    componentWillMount = () => {
        this._handleImageSizing();
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
            : image === 'L_Foot_Back.svg' ?
                require('../../../assets/images/body/body_overlay/L_Foot_Back.png')
            : image === 'R_Foot_Back.svg' ?
                require('../../../assets/images/body/body_overlay/R_Foot_Back.png')
            : image === 'L_ITBand.svg' ?
                require('../../../assets/images/body/body_overlay/L_ITBand.png')
            : image === 'R_ITBand.svg' ?
                require('../../../assets/images/body/body_overlay/R_ITBand.png')
            : image === 'L_ITBand_Back.svg' ?
                require('../../../assets/images/body/body_overlay/L_ITBand_Back.png')
            : image === 'R_ITBand_Back.svg' ?
                require('../../../assets/images/body/body_overlay/R_ITBand_Back.png')
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
            : image === 'R_Bicep.svg' ?
                require('../../../assets/images/body/body_overlay/R_Bicep.png')
            : image === 'L_Bicep.svg' ?
                require('../../../assets/images/body/body_overlay/L_Bicep.png')
            : image === 'R_Tricep.svg' ?
                require('../../../assets/images/body/body_overlay/R_Tricep.png')
            : image === 'L_Tricep.svg' ?
                require('../../../assets/images/body/body_overlay/L_Tricep.png')
            : image === 'L_Forearm.svg' ?
                require('../../../assets/images/body/body_overlay/L_Forearm.png')
            : image === 'R_Forearm.svg' ?
                require('../../../assets/images/body/body_overlay/R_Forearm.png')
            : image === 'L_Forearm_Back.svg' ?
                require('../../../assets/images/body/body_overlay/L_Forearm_Back.png')
            : image === 'R_Forearm_Back.svg' ?
                require('../../../assets/images/body/body_overlay/R_Forearm_Back.png')
            : image === 'CoreStabilizers.svg' ?
                require('../../../assets/images/body/body_overlay/CoreStabilizers.png')
            : image === 'L_CoreStabilizers.svg' ?
                require('../../../assets/images/body/body_overlay/L_CoreStabilizers.png')
            : image === 'R_CoreStabilizers.svg' ?
                require('../../../assets/images/body/body_overlay/R_CoreStabilizers.png')
            : image === 'L_OutsideKnee.svg' ?
                require('../../../assets/images/body/body_overlay/L_OuterKnee.png')
            : image === 'R_OutsideKnee.svg' ?
                require('../../../assets/images/body/body_overlay/R_OuterKnee.png')
            : image === 'R_ErectorSpinae.svg' ?
                require('../../../assets/images/body/body_overlay/R_ErectorSpinea.png')
            : image === 'L_ErectorSpinae.svg' ?
                require('../../../assets/images/body/body_overlay/L_ErectorSpinea.png')
            : image === 'L_Obliques.svg' ?
                require('../../../assets/images/body/body_overlay/L_Obliques.png')
            : image === 'R_Obliques.svg' ?
                require('../../../assets/images/body/body_overlay/R_Obliques.png')
            : image === 'L_AntTib.svg' ?
                require('../../../assets/images/body/body_overlay/L_AntTib.png')
            : image === 'R_AntTib.svg' ?
                require('../../../assets/images/body/body_overlay/R_AntTib.png')
            : image === 'L_Peroneals.svg' ?
                require('../../../assets/images/body/body_overlay/L_Peroneals.png')
            : image === 'R_Peroneals.svg' ?
                require('../../../assets/images/body/body_overlay/R_Peroneals.png')
            : image === 'L_PostTib.svg' ?
                require('../../../assets/images/body/body_overlay/L_PostTib.png')
            : image === 'R_PostTib.svg' ?
                require('../../../assets/images/body/body_overlay/R_PostTib.png')
            : image === 'L_Soleus.svg' ?
                require('../../../assets/images/body/body_overlay/L_Soleus.png')
            : image === 'R_Soleus.svg' ?
                require('../../../assets/images/body/body_overlay/R_Soleus.png')
            : image === 'L_MedialGastroc.svg' ?
                require('../../../assets/images/body/body_overlay/L_MedialGastroc.png')
            : image === 'R_MedialGastroc.svg' ?
                require('../../../assets/images/body/body_overlay/R_MedialGastroc.png')
            : image === 'L_BicepFemorisLong.svg' ?
                require('../../../assets/images/body/body_overlay/L_BicepFemorisLong.png')
            : image === 'R_BicepFemorisLong.svg' ?
                require('../../../assets/images/body/body_overlay/R_BicepFemorisLong.png')
            : image === 'L_BicepFemorisShort.svg' ?
                require('../../../assets/images/body/body_overlay/L_BicepFemorisShort.png')
            : image === 'R_BicepFemorisShort.svg' ?
                require('../../../assets/images/body/body_overlay/R_BicepFemorisShort.png')
            : image === 'L_Gracilis.svg' ?
                require('../../../assets/images/body/body_overlay/L_Gracilis.png')
            : image === 'R_Gracilis.svg' ?
                require('../../../assets/images/body/body_overlay/R_Gracilis.png')
            : image === 'L_Gracilis_Back.svg' ?
                require('../../../assets/images/body/body_overlay/L_Gracilis_Back.png')
            : image === 'R_Gracilis_Back.svg' ?
                require('../../../assets/images/body/body_overlay/R_Gracilis_Back.png')
            : image === 'L_Pectineus.svg' ?
                require('../../../assets/images/body/body_overlay/L_Pectineus.png')
            : image === 'R_Pectineus.svg' ?
                require('../../../assets/images/body/body_overlay/R_Pectineus.png')
            : image === 'L_VastusLateralis.svg' ?
                require('../../../assets/images/body/body_overlay/L_VastusLateralis.png')
            : image === 'R_VastusLateralis.svg' ?
                require('../../../assets/images/body/body_overlay/R_VastusLateralis.png')
            : image === 'L_VastusMedialis.svg' ?
                require('../../../assets/images/body/body_overlay/L_VastusMedialis.png')
            : image === 'R_VastusMedialis.svg' ?
                require('../../../assets/images/body/body_overlay/R_VastusMedialis.png')
            : image === 'L_TFL.svg' ?
                require('../../../assets/images/body/body_overlay/L_TFL.png')
            : image === 'R_TFL.svg' ?
                require('../../../assets/images/body/body_overlay/R_TFL.png')
            : image === 'L_LateralGastroc.svg' ?
                require('../../../assets/images/body/body_overlay/L_LateralGastroc.png')
            : image === 'R_LateralGastroc.svg' ?
                require('../../../assets/images/body/body_overlay/R_LateralGastroc.png')
            : image === 'L_GluteMax.svg' ?
                require('../../../assets/images/body/body_overlay/L_GluteMax.png')
            : image === 'R_GluteMax.svg' ?
                require('../../../assets/images/body/body_overlay/R_GluteMax.png')
            : image === 'L_HipRotator.svg' ?
                require('../../../assets/images/body/body_overlay/L_HipRotator.png')
            : image === 'R_HipRotator.svg' ?
                require('../../../assets/images/body/body_overlay/R_HipRotator.png')
            : image === 'L_QuadLumb.svg' ?
                require('../../../assets/images/body/body_overlay/L_QuadLumb.png')
            : image === 'R_QuadLumb.svg' ?
                require('../../../assets/images/body/body_overlay/R_QuadLumb.png')
            : image === 'L_Transverse.svg' ?
                require('../../../assets/images/body/body_overlay/L_Transverse.png')
            : image === 'R_Transverse.svg' ?
                require('../../../assets/images/body/body_overlay/R_Transverse.png')
            : image ==='RectusAbs.svg' ?
                require('../../../assets/images/body/body_overlay/RectusAbs.png')
            : image === 'L_LowerTraps.svg' ?
                require('../../../assets/images/body/body_overlay/L_LowerTraps.png')
            : image === 'R_LowerTraps.svg' ?
                require('../../../assets/images/body/body_overlay/R_LowerTraps.png')
            : image === 'L_AntDeltoid.svg' ?
                require('../../../assets/images/body/body_overlay/L_AntDeltoid.png')
            : image === 'R_AntDeltoid.svg' ?
                require('../../../assets/images/body/body_overlay/R_AntDeltoid.png')
            : image === 'L_LatDeltoid.svg' ?
                require('../../../assets/images/body/body_overlay/L_LatDeltoid.png')
            : image === 'R_LatDeltoid.svg' ?
                require('../../../assets/images/body/body_overlay/R_LatDeltoid.png')
            : image === 'L_PostDeltoid.svg' ?
                require('../../../assets/images/body/body_overlay/L_PostDeltoid.png')
            : image === 'R_PostDeltoid.svg' ?
                require('../../../assets/images/body/body_overlay/R_PostDeltoid.png')
            : image === 'L_Semi.svg' ?
                require('../../../assets/images/body/body_overlay/L_Semi.png')
            : image === 'R_Semi.svg' ?
                require('../../../assets/images/body/body_overlay/R_Semi.png')
            : image === 'L_AntAdductor.svg' ?
                require('../../../assets/images/body/body_overlay/L_AntAdductor.png')
            : image === 'R_AntAdductor.svg' ?
                require('../../../assets/images/body/body_overlay/R_AntAdductor.png')
            : image === 'L_RectusFemoris.svg' ?
                require('../../../assets/images/body/body_overlay/L_RectusFemoris.png')
            : image === 'R_RectusFemoris.svg' ?
                require('../../../assets/images/body/body_overlay/R_RectusFemoris.png')
            : image === 'L_GluteMed.svg' ?
                require('../../../assets/images/body/body_overlay/L_GluteMed.png')
            : image === 'R_GluteMed.svg' ?
                require('../../../assets/images/body/body_overlay/R_GluteMed.png')
            : image === 'L_UpperBackNeck_Back.svg' ?
                require('../../../assets/images/body/body_overlay/L_UpperBackNeck_Back.png')
            : image === 'R_UpperBackNeck_Back.svg' ?
                require('../../../assets/images/body/body_overlay/R_UpperBackNeck_Back.png')
            : image === 'L_UpperBackNeck.svg' ?
                require('../../../assets/images/body/body_overlay/L_UpperBackNeck.png')
            : image === 'R_UpperBackNeck.svg' ?
                require('../../../assets/images/body/body_overlay/R_UpperBackNeck.png')
            : image === 'L_MiddleTraps.svg' ?
                require('../../../assets/images/body/body_overlay/L_MiddleTraps.png')
            : image === 'R_MiddleTraps.svg' ?
                require('../../../assets/images/body/body_overlay/R_MiddleTraps.png')
            : image === 'L_Pec.svg' ?
                require('../../../assets/images/body/body_overlay/L_Pec.png')
            : image === 'R_Pec.svg' ?
                require('../../../assets/images/body/body_overlay/R_Pec.png')
            : image === 'L_HipFlexor.svg' ?
                require('../../../assets/images/body/body_overlay/L_HipFlexor.png')
            : image === 'R_HipFlexor.svg' ?
                require('../../../assets/images/body/body_overlay/R_HipFlexor.png')
            :
                require('../../../assets/images/body/body_overlay/Abs.png');
        return imageName;
    }

    _handleImageSizing = () => {
        let backImage =  require('../../../assets/images/body/body_overlay/body_full_back.png');
        let backImageSource = resolveAssetSource(backImage);
        let frontImage =  require('../../../assets/images/body/body_overlay/body_full_front.png');
        let frontImageSource = resolveAssetSource(frontImage);
        const { remainingWidth, } = this.props;
        let updatedRemainingWidth = (remainingWidth - ADDITIONAL_MIDDLE_PADDING);
        let newBackImageHeight = backImageSource.height * ((updatedRemainingWidth / 2) / backImageSource.width);
        let newFrontImageHeight = frontImageSource.height * ((updatedRemainingWidth / 2) / frontImageSource.width);
        this.setState({
            back:  { height: newBackImageHeight, width: (updatedRemainingWidth / 2), },
            front: { height: newFrontImageHeight, width: (updatedRemainingWidth / 2), },
        });
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
