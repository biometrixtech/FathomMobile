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
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

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
    },
    leftRightHeader: {
        alignSelf:         'stretch',
        flex:              1,
        flexDirection:     'row',
        justifyContent:    'space-between',
        left:              0,
        paddingHorizontal: AppSizes.paddingLrg,
        position:          'absolute',
        right:             0,
    },
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
            isClickLocked:       false,
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
            : image === 'UpperBackNeck_Back.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/UpperBackNeck_Back.png')
            : image === 'L_Shoulder.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Shoulder.png')
            : image === 'R_Shoulder.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Shoulder.png')
            : image === 'L_Shoulder_Back.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Shoulder_Back.png')
            : image === 'R_Shoulder_Back.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Shoulder_Back.png')
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
            : image === 'R_Tricep.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Tricep.png')
            : image === 'L_Tricep.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Tricep.png')
            : image === 'L_Forearm.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Forearm.png')
            : image === 'R_Forearm.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Forearm.png')
            : image === 'L_Forearm_Back.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_Forearm_Back.png')
            : image === 'R_Forearm_Back.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_Forearm_Back.png')
            : image === 'L_OutsideKnee.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/L_OutsideKnee.png')
            : image === 'R_OutsideKnee.svg' ?
                require('../../../../assets/images/body/body_overlay_selector/R_OutsideKnee.png')
            :
                require('../../../../assets/images/body/body_overlay_selector/Abs.png');
        return imageName;
    }

    _handleContinue = () => {
        const { areaOfSorenessClicked, handleBodyPartClick, } = this.props;
        const { selectedBodyPartObj, } = this.state;
        let foundSelectedBodyPartInReducer = _.find(areaOfSorenessClicked, {body_part: selectedBodyPartObj.index, side: selectedBodyPartObj.side,});
        let selectedBodyPart = _.find(MyPlanConstants.bodyPartMapping, ['index', selectedBodyPartObj.index]);
        let hasSeverity = foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.ache && foundSelectedBodyPartInReducer.ache > 0 ||
            foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.sore && foundSelectedBodyPartInReducer.sore > 0 ||
            foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.tender && foundSelectedBodyPartInReducer.tender > 0 ||
            foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.knots && foundSelectedBodyPartInReducer.knots > 0 ||
            foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.sharp && foundSelectedBodyPartInReducer.sharp > 0 ||
            foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.tight && foundSelectedBodyPartInReducer.tight > 0;
        this.setState(
            { isClickLocked: false, isModalOpen: false, selectedBodyPartObj: {}, },
            () => foundSelectedBodyPartInReducer && !hasSeverity ?
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
                return this.setState(
                    { isClickLocked: false, },
                    () => handleBodyPartClick(selectedBodyPart, foundSelectedBodyPartInReducer.side),
                );
            }
            return this.setState({ isClickLocked: false, },);
        }
        return this.setState({ isClickLocked: false, },);
    }

    _handleGridPress = key => {
        const { areaOfSorenessClicked, handleBodyPartClick, isBodyOverlayFront, } = this.props;
        let clickedBodyPart = _.find(BODY_PART_MAPPING, o => o.index.includes(key) && isBodyOverlayFront === o.isFront);
        let selectedBodyPart = clickedBodyPart ? _.find(MyPlanConstants.bodyPartMapping, ['index', clickedBodyPart.cleanedKey]) : false;
        if(selectedBodyPart) {
            const options = {
                enableVibrateFallback:       false,
                ignoreAndroidSystemSettings: false,
            };
            ReactNativeHapticFeedback.trigger('impactMedium', options);
            let mergedBodyParts = _.concat(areaOfSorenessClicked);
            let foundSelectedBodyPartInReducer = _.find(mergedBodyParts, {body_part: clickedBodyPart.cleanedKey, side: clickedBodyPart.side,});
            let severityValue = foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.ache && foundSelectedBodyPartInReducer.ache > 0 ?
                foundSelectedBodyPartInReducer.ache
                : foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.sore && foundSelectedBodyPartInReducer.sore > 0 ?
                    foundSelectedBodyPartInReducer.sore
                    : foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.tender && foundSelectedBodyPartInReducer.tender > 0 ?
                        foundSelectedBodyPartInReducer.tender
                        : foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.knots && foundSelectedBodyPartInReducer.knots > 0 ?
                            foundSelectedBodyPartInReducer.knots
                            : foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.sharp && foundSelectedBodyPartInReducer.sharp > 0 ?
                                foundSelectedBodyPartInReducer.sharp
                                : foundSelectedBodyPartInReducer && foundSelectedBodyPartInReducer.tight && foundSelectedBodyPartInReducer.tight > 0 ?
                                    foundSelectedBodyPartInReducer.tight
                                    :
                                    null;
            let updatedPills = foundSelectedBodyPartInReducer ?
                [
                    { index: 0, isSelected: (foundSelectedBodyPartInReducer.tight && foundSelectedBodyPartInReducer.tight > 0) || false, text: 'Tight', value: severityValue, },
                    { index: 1, isSelected: (foundSelectedBodyPartInReducer.sore && foundSelectedBodyPartInReducer.sore > 0) || false, text: 'Sore', value: severityValue, },
                    { index: 2, isSelected: (foundSelectedBodyPartInReducer.tender && foundSelectedBodyPartInReducer.tender > 0) || false, text: 'Tender', value: severityValue, },
                    { index: 3, isSelected: (foundSelectedBodyPartInReducer.knots && foundSelectedBodyPartInReducer.knots > 0) || false, text: 'Knots', value: severityValue, },
                    { index: 4, isSelected: (foundSelectedBodyPartInReducer.ache && foundSelectedBodyPartInReducer.ache > 0) || false, text: 'Ache', value: severityValue, },
                    { index: 5, isSelected: (foundSelectedBodyPartInReducer.sharp && foundSelectedBodyPartInReducer.sharp > 0) || false, text: 'Sharp', value: severityValue, },
                ]
                :
                null;
            let newSelectedBodyPartObj = {
                bodyImage:  selectedBodyPart.image[clickedBodyPart.side],
                index:      selectedBodyPart.index,
                isJoint:    (selectedBodyPart.group === 'joint'),
                nameString: selectedBodyPart.label,
                pills:      updatedPills,
                side:       clickedBodyPart.side,
                sideString: clickedBodyPart.side === 2 ? 'Right' : clickedBodyPart.side === 1 ? 'Left' : '',
                value:      severityValue,
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
        } else {
            this.setState({ isClickLocked: false, });
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
        const { front, isClickLocked, isModalOpen, selectedBodyPartObj, } = this.state;
        let {
            backAnimatedStyle,
            backBodyParts,
            frontAnimatedStyle,
            frontBodyParts,
            gridRange,
        } = PlanLogic.handleBodyPartSelectorRenderLogic(areaOfSorenessClicked, this.backInterpolate, this.frontInterpolate, BODY_PART_MAPPING, NUMBER_OF_OVERLAY_GRIDS_HEIGHT, NUMBER_OF_OVERLAY_GRIDS_WIDTH);
        return (
            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>

                <View style={[styles.leftRightHeader, {top: AppSizes.padding,}]}>
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(15),}}>{`${isBodyOverlayFront ? 'Right': 'Left'}`}</Text>
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(15),}}>{`${isBodyOverlayFront ? 'Left': 'Right'}`}</Text>
                </View>

                <View>
                    <Animated.View style={[styles.flipCard, frontAnimatedStyle,]}>
                        <RNImage
                            resizeMode={'contain'}
                            source={require('../../../../assets/images/body/body_overlay_selector/body_full_front.png')}
                            style={{height: front.height, width: front.width,}}
                        />
                        <View style={{height: front.height, position: 'absolute', width: front.width,}}>
                            {_.map(frontBodyParts, (body, index) => {
                                let selectedBodyPart = _.find(MyPlanConstants.bodyPartMapping, ['index', body.body_part]);
                                if(!selectedBodyPart) {
                                    return (null);
                                }
                                let {
                                    bodyImage,
                                    tintColor,
                                } = PlanLogic.handleSingleBodyPartSelectorRenderLogic(areaOfSorenessClicked, selectedBodyPart, body, false, this._getImageString);
                                return (
                                    <RNImage
                                        key={index}
                                        resizeMode={'contain'}
                                        source={bodyImage}
                                        style={{
                                            height:    front.height,
                                            position:  'absolute',
                                            tintColor: tintColor,
                                            width:     front.width,
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </Animated.View>
                    <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack,]}>
                        <RNImage
                            resizeMode={'contain'}
                            source={require('../../../../assets/images/body/body_overlay_selector/body_full_back.png')}
                            style={{height: front.height, width: front.width,}}
                        />
                        <View style={{height: front.height, position: 'absolute', width: front.width,}}>
                            {_.map(backBodyParts, (body, index) => {
                                let selectedBodyPart = _.find(MyPlanConstants.bodyPartMapping, ['index', body.body_part]);
                                if(!selectedBodyPart) {
                                    return (null);
                                }
                                let {
                                    bodyImage,
                                    tintColor,
                                } = PlanLogic.handleSingleBodyPartSelectorRenderLogic(areaOfSorenessClicked, selectedBodyPart, body, true, this._getImageString);
                                return (
                                    <RNImage
                                        key={index}
                                        resizeMode={'contain'}
                                        source={bodyImage}
                                        style={{
                                            height:    front.height,
                                            position:  'absolute',
                                            tintColor: tintColor,
                                            width:     front.width,
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </Animated.View>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', height: front.height, position: 'absolute', width: front.width,}}>
                        {_.map(gridRange, key => (
                            <TouchableOpacity
                                key={key}
                                onLongPress={isClickLocked ? () => null : () => this.setState({ isClickLocked: true, }, () => this._handleGridLongPress(key))}
                                onPress={isClickLocked ? () => null : () => this.setState({ isClickLocked: true, }, () => this._handleGridPress(key))}
                                style={{
                                    height: _.round(front.height / NUMBER_OF_OVERLAY_GRIDS_HEIGHT),
                                    width:  _.round(front.width / NUMBER_OF_OVERLAY_GRIDS_WIDTH),
                                }}
                            />
                        ))}
                    </View>
                </View>

                <View style={[styles.leftRightHeader, {bottom: (((AppSizes.padding * 2) + AppSizes.paddingXLrg) * 1.5),}]}>
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(15),}}>{`${isBodyOverlayFront ? 'Right': 'Left'}`}</Text>
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(15),}}>{`${isBodyOverlayFront ? 'Left': 'Right'}`}</Text>
                </View>

                <Spacer size={(AppSizes.padding + AppSizes.paddingXLrg)} />

                <SymptomIntake
                    handleContinue={this._handleContinue}
                    handleFormChange={handleFormChange}
                    isBodyOverlayFront={isBodyOverlayFront}
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