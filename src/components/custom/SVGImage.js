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
        firstTimeExperience={firstTimeExperience}
        handleUpdateFirstTimeExperience={handleUpdateFirstTimeExperience}
        image={bodyPartMap.image[0] ? bodyPartMap.image[0] : bodyPartMap.image[2]}
        selected={true}
        style={{width: 100, height: 100}}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { Spacer, Text, Tooltip, } from './';

const TooltipContent = ({ handleTooltipClose, text, }) => (
    <View style={{padding: AppSizes.padding,}}>
        <Text robotoLight style={{color: AppColors.black, fontSize: AppFonts.scaleFont(15),}}>
            {text}
        </Text>
        <Spacer size={20} />
        <TouchableOpacity
            onPress={handleTooltipClose}
            style={{alignSelf: 'flex-end',}}
        >
            <Text
                robotoMedium
                style={{
                    color:    AppColors.zeplin.yellow,
                    fontSize: AppFonts.scaleFont(15),
                }}
            >
                {'GOT IT'}
            </Text>
        </TouchableOpacity>
    </View>
);

/* Component ==================================================================== */
class SVGImage extends Component {
    static propTypes = {
        firstTimeExperience:             PropTypes.array,
        handleUpdateFirstTimeExperience: PropTypes.func,
        isBlue:                          PropTypes.bool,
        image:                           PropTypes.string.isRequired,
        overlay:                         PropTypes.bool,
        overlayText:                     PropTypes.string,
        selected:                        PropTypes.bool,
        style:                           PropTypes.object.isRequired,
    }

    static defaultProps = {
        firstTimeExperience:             [],
        handleUpdateFirstTimeExperience: null,
        isBlue:                          false,
        overlay:                         false,
        overlayText:                     null,
        selected:                        false,
    }

    constructor(props) {
        super(props);
        this.state = {
            isTooltipOpen: false,
        };
    }

    imageString = () => {
        // Defaults
        const { isBlue, image, } = this.props;
        if(isBlue) {
            /* eslint-disable indent */
            let imageName = image === 'Abs.svg' ?
                    require('../../../assets/images/body/blue_Abs.png')
                : image === 'Hip.svg' ?
                    require('../../../assets/images/body/blue_Hip.png')
                : image === 'L_Hip.svg' ?
                    require('../../../assets/images/body/blue_L_Hip.png')
                : image === 'R_Hip.svg' ?
                    require('../../../assets/images/body/blue_R_Hip.png')
                : image === 'Groin.svg' ?
                    require('../../../assets/images/body/blue_Groin.png')
                : image === 'L_Groin.svg' ?
                    require('../../../assets/images/body/blue_L_Groin.png')
                : image === 'R_Groin.svg' ?
                    require('../../../assets/images/body/blue_R_Groin.png')
                : image === 'Quad.svg' ?
                    require('../../../assets/images/body/blue_Quad.png')
                : image === 'L_Quad.svg' ?
                    require('../../../assets/images/body/blue_L_Quad.png')
                : image === 'R_Quad.svg' ?
                    require('../../../assets/images/body/blue_R_Quad.png')
                : image === 'Knee.svg' ?
                    require('../../../assets/images/body/blue_Knee.png')
                : image === 'L_Knee.svg' ?
                    require('../../../assets/images/body/blue_L_Knee.png')
                : image === 'R_Knee.svg' ?
                    require('../../../assets/images/body/blue_R_Knee.png')
                : image === 'Shin.svg' ?
                    require('../../../assets/images/body/blue_Shin.png')
                : image === 'L_Shin.svg' ?
                    require('../../../assets/images/body/blue_L_Shin.png')
                : image === 'R_Shin.svg' ?
                    require('../../../assets/images/body/blue_R_Shin.png')
                : image === 'Ankle.svg' ?
                    require('../../../assets/images/body/blue_Ankle.png')
                : image === 'L_Ankle.svg' ?
                    require('../../../assets/images/body/blue_L_Ankle.png')
                : image === 'R_Ankle.svg' ?
                    require('../../../assets/images/body/blue_R_Ankle.png')
                : image === 'Foot.svg' ?
                    require('../../../assets/images/body/blue_Foot.png')
                : image === 'L_Foot.svg' ?
                    require('../../../assets/images/body/blue_L_Foot.png')
                : image === 'R_Foot.svg' ?
                    require('../../../assets/images/body/blue_R_Foot.png')
                : image === 'ITBand.svg' ?
                    require('../../../assets/images/body/blue_ITBand.png')
                : image === 'L_ITBand.svg' ?
                    require('../../../assets/images/body/blue_L_ITBand.png')
                : image === 'R_ITBand.svg' ?
                    require('../../../assets/images/body/blue_R_ITBand.png')
                : image === 'LowBack.svg' ?
                    require('../../../assets/images/body/blue_LowBack.png')
                : image === 'Glute.svg' ?
                    require('../../../assets/images/body/blue_Glute.png')
                : image === 'L_Glute.svg' ?
                    require('../../../assets/images/body/blue_L_Glute.png')
                : image === 'R_Glute.svg' ?
                    require('../../../assets/images/body/blue_R_Glute.png')
                : image === 'Hamstring.svg' ?
                    require('../../../assets/images/body/blue_Hamstring.png')
                : image === 'L_Hamstring.svg' ?
                    require('../../../assets/images/body/blue_L_Hamstring.png')
                : image === 'R_Hamstring.svg' ?
                    require('../../../assets/images/body/blue_R_Hamstring.png')
                : image === 'Calf.svg' ?
                    require('../../../assets/images/body/blue_Calf.png')
                : image === 'L_Calf.svg' ?
                    require('../../../assets/images/body/blue_L_Calf.png')
                : image === 'R_Calf.svg' ?
                    require('../../../assets/images/body/blue_R_Calf.png')
                : image === 'Achilles.svg' ?
                    require('../../../assets/images/body/blue_Achilles.png')
                : image === 'L_Achilles.svg' ?
                    require('../../../assets/images/body/blue_L_Achilles.png')
                : image === 'R_Achilles.svg' ?
                    require('../../../assets/images/body/blue_R_Achilles.png')
                : image === 'UpperBackNeck.svg' ?
                    require('../../../assets/images/body/blue_UpperBackNeck.png')
                : image === 'Shoulder.svg' ?
                    require('../../../assets/images/body/blue_Shoulder.png')
                : image === 'L_Shoulder.svg' ?
                    require('../../../assets/images/body/blue_L_Shoulder.png')
                : image === 'R_Shoulder.svg' ?
                    require('../../../assets/images/body/blue_R_Shoulder.png')
                : image === 'Elbow.svg' ?
                    require('../../../assets/images/body/blue_Elbow.png')
                : image === 'L_Elbow.svg' ?
                    require('../../../assets/images/body/blue_L_Elbow.png')
                : image === 'R_Elbow.svg' ?
                    require('../../../assets/images/body/blue_R_Elbow.png')
                : image === 'Lats.svg' ?
                    require('../../../assets/images/body/blue_Lats.png')
                : image === 'L_Lats.svg' ?
                    require('../../../assets/images/body/blue_L_Lats.png')
                : image === 'R_Lats.svg' ?
                    require('../../../assets/images/body/blue_R_Lats.png')
                : image === 'Wrist.svg' ?
                    require('../../../assets/images/body/blue_Wrist.png')
                : image === 'L_Wrist.svg' ?
                    require('../../../assets/images/body/blue_L_Wrist.png')
                : image === 'R_Wrist.svg' ?
                    require('../../../assets/images/body/blue_R_Wrist.png')
                : image === 'Pec.svg' ?
                    require('../../../assets/images/body/blue_Pec.png')
                : image === 'L_Pec.svg' ?
                    require('../../../assets/images/body/blue_L_Pec.png')
                : image === 'R_Pec.svg' ?
                    require('../../../assets/images/body/blue_R_Pec.png')
                : image === 'Bicep.svg' ?
                    require('../../../assets/images/body/blue_Bicep.png')
                : image === 'R_Bicep.svg' ?
                    require('../../../assets/images/body/blue_R_Bicep.png')
                : image === 'L_Bicep.svg' ?
                    require('../../../assets/images/body/blue_L_Bicep.png')
                : image === 'Tricep.svg' ?
                    require('../../../assets/images/body/blue_Tricep.png')
                : image === 'R_Tricep.svg' ?
                    require('../../../assets/images/body/blue_R_Tricep.png')
                : image === 'L_Tricep.svg' ?
                    require('../../../assets/images/body/blue_L_Tricep.png')
                :
                    require('../../../assets/images/body/blue_Abs.png');
            return imageName;
        }
        /* eslint-disable indent */
        let imageName = image === 'Abs.svg' ?
                require('../../../assets/images/body/Abs.png')
            : image === 'Hip.svg' ?
                require('../../../assets/images/body/Hip.png')
            : image === 'L_Hip.svg' ?
                require('../../../assets/images/body/L_Hip.png')
            : image === 'R_Hip.svg' ?
                require('../../../assets/images/body/R_Hip.png')
            : image === 'Groin.svg' ?
                require('../../../assets/images/body/Groin.png')
            : image === 'L_Groin.svg' ?
                require('../../../assets/images/body/L_Groin.png')
            : image === 'R_Groin.svg' ?
                require('../../../assets/images/body/R_Groin.png')
            : image === 'Quad.svg' ?
                require('../../../assets/images/body/Quad.png')
            : image === 'L_Quad.svg' ?
                require('../../../assets/images/body/L_Quad.png')
            : image === 'R_Quad.svg' ?
                require('../../../assets/images/body/R_Quad.png')
            : image === 'Knee.svg' ?
                require('../../../assets/images/body/Knee.png')
            : image === 'L_Knee.svg' ?
                require('../../../assets/images/body/L_Knee.png')
            : image === 'R_Knee.svg' ?
                require('../../../assets/images/body/R_Knee.png')
            : image === 'Shin.svg' ?
                require('../../../assets/images/body/Shin.png')
            : image === 'L_Shin.svg' ?
                require('../../../assets/images/body/L_Shin.png')
            : image === 'R_Shin.svg' ?
                require('../../../assets/images/body/R_Shin.png')
            : image === 'Ankle.svg' ?
                require('../../../assets/images/body/Ankle.png')
            : image === 'L_Ankle.svg' ?
                require('../../../assets/images/body/L_Ankle.png')
            : image === 'R_Ankle.svg' ?
                require('../../../assets/images/body/R_Ankle.png')
            : image === 'Foot.svg' ?
                require('../../../assets/images/body/Foot.png')
            : image === 'L_Foot.svg' ?
                require('../../../assets/images/body/L_Foot.png')
            : image === 'R_Foot.svg' ?
                require('../../../assets/images/body/R_Foot.png')
            : image === 'ITBand.svg' ?
                require('../../../assets/images/body/ITBand.png')
            : image === 'L_ITBand.svg' ?
                require('../../../assets/images/body/L_ITBand.png')
            : image === 'R_ITBand.svg' ?
                require('../../../assets/images/body/R_ITBand.png')
            : image === 'LowBack.svg' ?
                require('../../../assets/images/body/LowBack.png')
            : image === 'Glute.svg' ?
                require('../../../assets/images/body/Glute.png')
            : image === 'L_Glute.svg' ?
                require('../../../assets/images/body/L_Glute.png')
            : image === 'R_Glute.svg' ?
                require('../../../assets/images/body/R_Glute.png')
            : image === 'Hamstring.svg' ?
                require('../../../assets/images/body/Hamstring.png')
            : image === 'L_Hamstring.svg' ?
                require('../../../assets/images/body/L_Hamstring.png')
            : image === 'R_Hamstring.svg' ?
                require('../../../assets/images/body/R_Hamstring.png')
            : image === 'Calf.svg' ?
                require('../../../assets/images/body/Calf.png')
            : image === 'L_Calf.svg' ?
                require('../../../assets/images/body/L_Calf.png')
            : image === 'R_Calf.svg' ?
                require('../../../assets/images/body/R_Calf.png')
            : image === 'Achilles.svg' ?
                require('../../../assets/images/body/Achilles.png')
            : image === 'L_Achilles.svg' ?
                require('../../../assets/images/body/L_Achilles.png')
            : image === 'R_Achilles.svg' ?
                require('../../../assets/images/body/R_Achilles.png')
            : image === 'UpperBackNeck.svg' ?
                require('../../../assets/images/body/UpperBackNeck.png')
            : image === 'Shoulder.svg' ?
                require('../../../assets/images/body/Shoulder.png')
            : image === 'L_Shoulder.svg' ?
                require('../../../assets/images/body/L_Shoulder.png')
            : image === 'R_Shoulder.svg' ?
                require('../../../assets/images/body/R_Shoulder.png')
            : image === 'Elbow.svg' ?
                require('../../../assets/images/body/Elbow.png')
            : image === 'L_Elbow.svg' ?
                require('../../../assets/images/body/L_Elbow.png')
            : image === 'R_Elbow.svg' ?
                require('../../../assets/images/body/R_Elbow.png')
            : image === 'Lats.svg' ?
                require('../../../assets/images/body/Lats.png')
            : image === 'L_Lats.svg' ?
                require('../../../assets/images/body/L_Lats.png')
            : image === 'R_Lats.svg' ?
                require('../../../assets/images/body/R_Lats.png')
            : image === 'Wrist.svg' ?
                require('../../../assets/images/body/Wrist.png')
            : image === 'L_Wrist.svg' ?
                require('../../../assets/images/body/L_Wrist.png')
            : image === 'R_Wrist.svg' ?
                require('../../../assets/images/body/R_Wrist.png')
            : image === 'Pec.svg' ?
                require('../../../assets/images/body/Pec.png')
            : image === 'L_Pec.svg' ?
                require('../../../assets/images/body/L_Pec.png')
            : image === 'R_Pec.svg' ?
                require('../../../assets/images/body/R_Pec.png')
            :
                require('../../../assets/images/body/Abs.png');
        return imageName;
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(this.props.selected !== prevProps.selected && this.props.selected && !this.props.firstTimeExperience.includes('all_good_body_part_tooltip')) {
            this.setState({ isTooltipOpen: true, });
        }
    }

    render = () => (
        <Tooltip
            animated
            content={
                <TooltipContent
                    handleTooltipClose={() => this.setState(
                        { isTooltipOpen: false, },
                        () => this.props.handleUpdateFirstTimeExperience ? this.props.handleUpdateFirstTimeExperience('all_good_body_part_tooltip') : {},
                    )}
                    text={MyPlanConstants.allGoodBodyPartMessage()}
                />
            }
            isVisible={this.state.isTooltipOpen}
            onClose={() => {}}
            tooltipStyle={{left: 30, width: (AppSizes.screen.width - 60),}}
        >
            <View style={{
                alignItems:     'center',
                borderColor:    this.props.isBlue ? AppColors.zeplin.splashLight : this.props.selected ? AppColors.zeplin.yellow : AppColors.white,
                borderRadius:   AppSizes.screen.widthQuarter + 5,
                borderWidth:    this.props.isBlue ? 2 : Platform.OS === 'ios' ? 5 : 6,
                height:         this.props.style.height ? this.props.style.height : (AppSizes.screen.widthQuarter + 5),
                justifyContent: 'center',
                overflow:       'hidden',
                width:          this.props.style.width ? this.props.style.width : (AppSizes.screen.widthQuarter + 5),
            }}>
                <Image
                    resizeMode={'contain'}
                    source={this.imageString()}
                    style={this.props.style}
                />
                { this.props.selected && this.props.overlay ?
                    <View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            alignItems:      'center',
                            backgroundColor: 'rgba(8, 24, 50, 0.5)',
                            borderRadius:    AppSizes.screen.widthQuarter + 5,
                            flex:            1,
                            height:          '100%',
                            justifyContent:  'center',
                            width:           '100%',
                        }}
                    >
                        { this.props.overlayText ?
                            <Text
                                oswaldRegular
                                style={[
                                    AppStyles.textCenterAligned,
                                    {
                                        color:    AppColors.white,
                                        fontSize: AppFonts.scaleFont(15),
                                    }
                                ]}
                            >
                                {this.props.overlayText}
                            </Text>
                            :
                            null
                        }
                    </View>
                    :
                    null
                }
            </View>
        </Tooltip>
    );
}

/* Export Component ==================================================================== */
export default SVGImage;
