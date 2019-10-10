/**
 * BodyPartSelector
 *
    <BodyPartSelector
        areaOfSorenessClicked={areaOfSorenessClicked}
        handleBodyPartClick={body => handleAreaOfSorenessClick(body)}
        handleFormChange={handleFormChange}
        isBodyOverlayFront={isBodyOverlayFront}
        newSoreBodyParts={newSoreBodyParts}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Animated, Image as RNImage, StyleSheet, TouchableOpacity, View, } from 'react-native';
import resolveAssetSource from 'resolveAssetSource';

// import third-party libraries
import _ from 'lodash';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, MyPlan as MyPlanConstants, } from '../../../constants';
import { BodyOverlay, Spacer, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { SymptomIntake, } from './';

const REMAINING_SCREEN_WIDTH = (AppSizes.screen.width - AppSizes.paddingLrg);
const NUMBER_OF_OVERLAY_GRIDS_HEIGHT = 30;
const NUMBER_OF_OVERLAY_GRIDS_WIDTH = 20;

let BODY_PART_MAPPING = [];

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    flipCard: {
        backfaceVisibility: 'hidden',
    },
    flipCardBack: {
        position: 'absolute',
    }
});

/* Component ==================================================================== */
class BodyPartSelector extends Component {
    constructor(props) {
        super(props);
        BODY_PART_MAPPING = PlanLogic.returnBodyOverlapMapping(props.newSoreBodyParts);
        this.state = {
            back: {
                height: 0,
                width:  0,
            },
            front: {
                height: 0,
                width:  0,
            },
            isModalOpen:         false,
            selectedBodyPartObj: {},
        };
        this.animatedValue = new Animated.Value(0);
        this.backInterpolate = null;
        this.frontInterpolate = null;
        this.value = 0;
    }

    componentDidUpdate = prevProps => {
        if(prevProps.isBodyOverlayFront !== this.props.isBodyOverlayFront) {
            if(this.value >= 90) {
                Animated.timing(this.animatedValue, {
                    duration: 800,
                    toValue:  0,
                }).start();
            } else {
                Animated.timing(this.animatedValue, {
                    duration: 800,
                    toValue:  180,
                }).start();
            }
        }
    }

    componentWillMount = () => {
        this._handleImageSizing();
        this.animatedValue.addListener(({ value, }) => {
            this.value = value;
        });
        this.backInterpolate = this.animatedValue.interpolate({
            inputRange:  [0, 180],
            outputRange: ['180deg', '360deg'],
        });
        this.frontInterpolate = this.animatedValue.interpolate({
            inputRange:  [0, 180],
            outputRange: ['0deg', '180deg'],
        });
    }

    _getImageString = image => {
        /* eslint-disable indent */
        let imageName = image === 'Abs.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/Abs.png')
            : image === 'L_Hip.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Hip.png')
            : image === 'R_Hip.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Hip.png')
            : image === 'L_Groin.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Groin.png')
            : image === 'R_Groin.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Groin.png')
            : image === 'L_Quad.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Quad.png')
            : image === 'R_Quad.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Quad.png')
            : image === 'L_Knee.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Knee.png')
            : image === 'R_Knee.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Knee.png')
            : image === 'L_Shin.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Shin.png')
            : image === 'R_Shin.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Shin.png')
            : image === 'L_Ankle.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Ankle.png')
            : image === 'R_Ankle.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Ankle.png')
            : image === 'L_Foot.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Foot.png')
            : image === 'R_Foot.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Foot.png')
            : image === 'L_ITBand.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_ITBand.png')
            : image === 'R_ITBand.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_ITBand.png')
            : image === 'LowBack.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/LowBack.png')
            : image === 'L_Glute.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Glute.png')
            : image === 'R_Glute.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Glute.png')
            : image === 'L_Hamstring.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Hamstring.png')
            : image === 'R_Hamstring.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Hamstring.png')
            : image === 'L_Calf.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Calf.png')
            : image === 'R_Calf.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Calf.png')
            : image === 'L_Achilles.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Achilles.png')
            : image === 'R_Achilles.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Achilles.png')
            : image === 'UpperBackNeck.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/UpperBackNeck.png')
            : image === 'L_Shoulder.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Shoulder.png')
            : image === 'R_Shoulder.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Shoulder.png')
            : image === 'L_Elbow.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Elbow.png')
            : image === 'R_Elbow.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Elbow.png')
            : image === 'L_Lats.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Lats.png')
            : image === 'R_Lats.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Lats.png')
            : image === 'L_Wrist.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Wrist.png')
            : image === 'R_Wrist.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Wrist.png')
            : image === 'L_Pec.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Pec.png')
            : image === 'R_Pec.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Pec.png')
            : image === 'R_Bicep.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Bicep.png')
            : image === 'L_Bicep.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Bicep.png')
            // : image === 'R_Tricep.svg' ?
            //     require('../../../../assets/images/body/body_overlay_selector/R_Tricep.png')
            // : image === 'L_Tricep.svg' ?
            //     require('../../../../assets/images/body/body_overlay_selector/L_Tricep.png')
            // : image === 'L_Forearm.svg' ?
            //     require('../../../../assets/images/body/body_overlay_selector/L_Forearm.png')
            // : image === 'R_Forearm.svg' ?
            //     require('../../../../assets/images/body/body_overlay_selector/R_Forearm.png')
            // : image === 'CoreStabilizers.svg' ?
            //     require('../../../../assets/images/body/body_overlay_selector/CoreStabilizers.png')
            // : image === 'ErectorSpinae.svg' ?
            //     require('../../../../assets/images/body/body_overlay_selector/ErectorSpinae.png')
            :
                require('../../../../assets/images/body/body_overlay_selector/Abs.png');
        return imageName;
    }

    _handleContinue = () => {
        const { areaOfSorenessClicked, handleBodyPartClick, } = this.props;
        const { selectedBodyPartObj, } = this.state;
        let foundSelectedBodyPartInReducer = _.find(areaOfSorenessClicked, ['body_part', selectedBodyPartObj.index]);
        let selectedBodyPart = _.find(MyPlanConstants.bodyPartMapping, ['index', selectedBodyPartObj.index]);
        this.setState(
            { isModalOpen: false, selectedBodyPartObj: {}, },
            () => foundSelectedBodyPartInReducer && (!foundSelectedBodyPartInReducer.severity || foundSelectedBodyPartInReducer.severity === 0) ?
                handleBodyPartClick(selectedBodyPart, foundSelectedBodyPartInReducer.side)
                :
                null,
        );
    }

    _handleGridLongPress = key => {
        const { areaOfSorenessClicked, handleBodyPartClick, isBodyOverlayFront, } = this.props;
        let clickedBodyPart = _.find(BODY_PART_MAPPING, o => o.index.includes(key) && isBodyOverlayFront === o.isFront);
        let selectedBodyPart = clickedBodyPart ? _.find(MyPlanConstants.bodyPartMapping, ['index', clickedBodyPart.cleanedKey]) : false;
        if(selectedBodyPart) {
            let mergedBodyParts = _.concat(areaOfSorenessClicked);
            let foundSelectedBodyPartInReducer = _.find(mergedBodyParts, {body_part: clickedBodyPart.cleanedKey, side: clickedBodyPart.side,});
            if(foundSelectedBodyPartInReducer) {
                handleBodyPartClick(selectedBodyPart, foundSelectedBodyPartInReducer.side);
            }
        }
    }

    _handleGridPress = key => {
        const { areaOfSorenessClicked, handleBodyPartClick, isBodyOverlayFront, } = this.props;
        let clickedBodyPart = _.find(BODY_PART_MAPPING, o => o.index.includes(key) && isBodyOverlayFront === o.isFront);
        let selectedBodyPart = clickedBodyPart ? _.find(MyPlanConstants.bodyPartMapping, ['index', clickedBodyPart.cleanedKey]) : false;
        if(selectedBodyPart) {
            let mergedBodyParts = _.concat(areaOfSorenessClicked);
            let foundSelectedBodyPartInReducer = _.find(mergedBodyParts, {body_part: clickedBodyPart.cleanedKey, side: clickedBodyPart.side,});
            let newSelectedBodyPartObj = {
                bodyImage:  selectedBodyPart.image[clickedBodyPart.side],
                index:      selectedBodyPart.index,
                isJoint:    (selectedBodyPart.group === 'joint'),
                nameString: selectedBodyPart.label,
                side:       clickedBodyPart.side,
                sideString: clickedBodyPart.side === 2 ? 'Right' : clickedBodyPart.side === 1 ? 'Left' : '',
                value:      foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.severity ? foundSelectedBodyPartInReducer.severity : 0,
            };
            if(foundSelectedBodyPartInReducer) {
                this.setState({ isModalOpen: true, selectedBodyPartObj: newSelectedBodyPartObj, });
            } else {
                handleBodyPartClick(selectedBodyPart, clickedBodyPart.side, () => {
                    mergedBodyParts = _.concat(areaOfSorenessClicked);
                    foundSelectedBodyPartInReducer = _.find(mergedBodyParts, ['body_part', clickedBodyPart.cleanedKey]);
                    newSelectedBodyPartObj.value = foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.severity ? foundSelectedBodyPartInReducer.severity : 0;
                    this.setState({ isModalOpen: true, selectedBodyPartObj: newSelectedBodyPartObj, });
                });
            }
        }
    }

    _handleImageSizing = () => {
        let backImage =  require('../../../../assets/images/body/body_overlay_selector/body_full_back.png');
        let backImageSource = resolveAssetSource(backImage);
        let frontImage =  require('../../../../assets/images/body/body_overlay_selector/body_full_front.png');
        let frontImageSource = resolveAssetSource(frontImage);
        let newBackImageHeight = backImageSource.height * (REMAINING_SCREEN_WIDTH / backImageSource.width);
        let newFrontImageHeight = frontImageSource.height * (REMAINING_SCREEN_WIDTH / frontImageSource.width);
        this.setState({
            back:  { height: newBackImageHeight, width: REMAINING_SCREEN_WIDTH, },
            front: { height: newFrontImageHeight, width: REMAINING_SCREEN_WIDTH, },
        });
    }

    render = () => {
        const { areaOfSorenessClicked, handleFormChange, isBodyOverlayFront, } = this.props;
        const { front, isModalOpen, selectedBodyPartObj, } = this.state;
        let gridRange = _.range(1, ((NUMBER_OF_OVERLAY_GRIDS_HEIGHT * NUMBER_OF_OVERLAY_GRIDS_WIDTH) + 1));
        const backAnimatedStyle = {
            transform: [
                { rotateY: this.backInterpolate, }
            ],
        };
        const frontAnimatedStyle = {
            transform: [
                { rotateY: this.frontInterpolate, }
            ],
        };
        let mergedBodyParts = _.concat(areaOfSorenessClicked);
        let backBodyParts = _.filter(mergedBodyParts, o => _.find(MyPlanConstants.bodyPartMapping, { index: o.body_part, front: false, }));
        let frontBodyParts = _.filter(mergedBodyParts, o => _.find(MyPlanConstants.bodyPartMapping, { index: o.body_part, front: true, }));
        return (
            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>

                <View style={{alignSelf: 'stretch', flex: 1, flexDirection: 'row', justifyContent: 'space-between', left: 0, paddingHorizontal: AppSizes.paddingLrg, position: 'absolute', right: 0, top: AppSizes.padding,}}>
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(15),}}>{`${isBodyOverlayFront ? 'Right': 'Left'}\nside`}</Text>
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(15),}}>{`${isBodyOverlayFront ? 'Left': 'Right'}\nside`}</Text>
                </View>

                <View>
                    <Animated.View style={[styles.flipCard, frontAnimatedStyle,]}>
                        <RNImage
                            resizeMode={'contain'}
                            source={require('../../../../assets/images/body/body_overlay_selector/body_full_front.png')}
                            style={{height: front.height, tintColor: AppColors.zeplin.slateXLight, width: front.width,}}
                        />
                        <View style={{height: front.height, position: 'absolute', width: front.width,}}>
                            {_.map(frontBodyParts, (body, index) => {
                                let selectedBodyPart = _.find(MyPlanConstants.bodyPartMapping, ['index', body.body_part]);
                                if(!selectedBodyPart) {
                                    return (null);
                                }
                                let areasOfSorenessBodyPart = PlanLogic.handleAreasOfSorenessBodyPart(areaOfSorenessClicked, selectedBodyPart, []);
                                let cleanedImageString = `${body.side === 2 ? 'R_' : body.side === 1 ? 'L_' : ''}${areasOfSorenessBodyPart.bodyImage}`;
                                let bodyImage = this._getImageString(cleanedImageString);
                                return (
                                    <RNImage
                                        key={index}
                                        resizeMode={'contain'}
                                        source={bodyImage}
                                        style={{height: front.height, position: 'absolute', tintColor: AppColors.zeplin.yellow, width: front.width,}}
                                    />
                                );
                            })}
                        </View>
                    </Animated.View>
                    <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack,]}>
                        <RNImage
                            resizeMode={'contain'}
                            source={require('../../../../assets/images/body/body_overlay/body_full_back.png')}
                            style={{height: front.height, width: front.width,}}
                        />
                        <View style={{height: front.height, position: 'absolute', width: front.width,}}>
                            {_.map(backBodyParts, (body, index) => {
                                let selectedBodyPart = _.find(MyPlanConstants.bodyPartMapping, ['index', body.body_part]);
                                if(!selectedBodyPart) {
                                    return (null);
                                }
                                let areasOfSorenessBodyPart = PlanLogic.handleAreasOfSorenessBodyPart(areaOfSorenessClicked, selectedBodyPart, []);
                                let cleanedImageString = `${body.side === 2 ? 'R_' : body.side === 1 ? 'L_' : ''}${areasOfSorenessBodyPart.bodyImage}`;
                                let bodyImage = this._getImageString(cleanedImageString);
                                return (
                                    <RNImage
                                        key={index}
                                        resizeMode={'contain'}
                                        source={bodyImage}
                                        style={{height: front.height, position: 'absolute', tintColor: AppColors.zeplin.yellow, width: front.width,}}
                                    />
                                );
                            })}
                        </View>
                    </Animated.View>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', height: front.height, position: 'absolute', width: front.width,}}>
                        {_.map(gridRange, key => (
                            <TouchableOpacity
                                key={key}
                                onLongPress={() => this._handleGridLongPress(key)}
                                onPress={() => this._handleGridPress(key)}
                                style={{
                                    height: _.round(front.height / NUMBER_OF_OVERLAY_GRIDS_HEIGHT),
                                    width:  _.round(front.width / NUMBER_OF_OVERLAY_GRIDS_WIDTH),
                                }}
                            />
                        ))}
                    </View>
                </View>

                <Spacer size={(AppSizes.padding + AppSizes.paddingXLrg)} />

                <SymptomIntake
                    handleContinue={this._handleContinue}
                    handleFormChange={handleFormChange}
                    isModalOpen={isModalOpen}
                    selectedBodyPart={selectedBodyPartObj}
                />

            </View>
        );
    }
}

BodyPartSelector.propTypes = {
    areaOfSorenessClicked: PropTypes.array.isRequired,
    handleBodyPartClick:   PropTypes.func.isRequired,
    handleFormChange:      PropTypes.func.isRequired,
    isBodyOverlayFront:    PropTypes.bool.isRequired,
    newSoreBodyParts:      PropTypes.array.isRequired,
};

BodyPartSelector.defaultProps = {};

BodyPartSelector.componentName = 'BodyPartSelector';

/* Export Component ================================================================== */
export default BodyPartSelector;