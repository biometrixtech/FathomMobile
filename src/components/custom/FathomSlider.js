/**
 * Fathom Slider
 *
    <FathomSlider
        handleFormChange={this._handleFormChange}
        isValid={true}
        maximumValue={9}
        minimumValue={0}
        name={'string'}
        sliderValue={sliderValue}
        value={value}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, StyleSheet, View, } from 'react-native';

// import third-party libraries
import { Slider, } from 'react-native-elements';

// import constants
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { Text, } from '../custom';
import { PlanLogic, } from '../../lib';

const THUMB_SIZE = 40;
const noneValues = [0];
const mildValues = [1, 2, 3];
const moderateValues = [4, 5, 6];
const severeValues = [7, 8, 9, 10];

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
    severityTextWrapper: {
        flexDirection:     'row',
        justifyContent:    'space-between',
        paddingBottom:     AppSizes.paddingMed,
        paddingHorizontal: AppSizes.paddingXSml,
    },
    textStyle: (isValid, isSelected) => ({
        color:    isSelected ? AppColors.zeplin.yellow : isValid ? AppColors.zeplin.slateLight : AppColors.zeplin.slateXLight,
        fontSize: AppFonts.scaleFont(12),
    }),
    thumbStyle: isValid => ({
        ...AppStyles.scaleButtonShadowEffect,
        backgroundColor: isValid ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight,
        borderRadius:    (THUMB_SIZE / 2),
        height:          THUMB_SIZE,
        width:           THUMB_SIZE,
    }),
});

/* Component ==================================================================== */
const FathomSlider = ({
    bodyPart,
    disabled,
    handleFormChange,
    isValid,
    maximumValue,
    minimumValue,
    name,
    orientation,
    sliderValue,
    step,
    thumbTintColor,
    value,
}) => {
    let updatedValue = sliderValue || 0;
    return (
        <View>
            <View style={[customStyles.severityTextWrapper,]}>
                <Text
                    style={[
                        (!disabled && noneValues.includes(updatedValue)) ? {...AppStyles.robotoBold} : {...AppStyles.robotoRegular},
                        customStyles.textStyle(isValid, (!disabled && noneValues.includes(updatedValue))),
                    ]}
                >
                    {'None'}
                </Text>
                <Text
                    style={[
                        mildValues.includes(updatedValue) ? {...AppStyles.robotoBold} : {...AppStyles.robotoRegular},
                        customStyles.textStyle(isValid, mildValues.includes(updatedValue)),
                    ]}
                >
                    {'Mild'}
                </Text>
                <Text
                    style={[
                        moderateValues.includes(updatedValue) ? {...AppStyles.robotoBold} : {...AppStyles.robotoRegular},
                        customStyles.textStyle(isValid, moderateValues.includes(updatedValue)),
                    ]}
                >
                    {'Moderate'}
                </Text>
                <Text
                    style={[
                        severeValues.includes(updatedValue) ? {...AppStyles.robotoBold} : {...AppStyles.robotoRegular},
                        customStyles.textStyle(isValid, severeValues.includes(updatedValue)),
                    ]}
                >
                    {'Severe'}
                </Text>
                <Text
                    robotoRegular
                    style={[
                        customStyles.textStyle(isValid, updatedValue),
                    ]}
                >
                    {''}
                </Text>
            </View>
            <ImageBackground
                source={disabled ? require('../../../assets/images/standard/tickmarks-disabled.png') : require('../../../assets/images/standard/tickmarks.png')}
                style={{width: (AppSizes.screen.width - (AppSizes.paddingLrg * 2)),}}
            >
                <Slider
                    animateTransitions={true}
                    animationType={'spring'}
                    disabled={disabled}
                    maximumTrackTintColor={AppColors.zeplin.superLight}
                    maximumValue={maximumValue}
                    minimumTrackTintColor={`${AppColors.zeplin.yellow}${PlanLogic.returnHexOpacity(0.5)}`}
                    minimumValue={minimumValue}
                    onSlidingComplete={val => handleFormChange(val)}
                    orientation={orientation}
                    step={step}
                    thumbTintColor={thumbTintColor}
                    thumbTouchSize={{height: THUMB_SIZE, width: THUMB_SIZE,}}
                    thumbStyle={[customStyles.thumbStyle(!disabled),]}
                    trackStyle={{borderRadius: 10, height: 10,}}
                    value={updatedValue}
                />
            </ImageBackground>
        </View>
    );
}

FathomSlider.propTypes = {
    bodyPart:         PropTypes.number,
    disabled:         PropTypes.bool,
    handleFormChange: PropTypes.func.isRequired,
    isValid:          PropTypes.bool,
    maximumValue:     PropTypes.number.isRequired,
    minimumValue:     PropTypes.number.isRequired,
    name:             PropTypes.string,
    orientation:      PropTypes.string,
    sliderValue:      PropTypes.number,
    step:             PropTypes.number,
    thumbTintColor:   PropTypes.string,
    value:            PropTypes.number.isRequired,
};

FathomSlider.defaultProps = {
    disabled:       false,
    isValid:        false,
    name:           '',
    orientation:    'vertical',
    sliderValue:    0,
    step:           1,
    thumbTintColor: AppColors.zeplin.yellow,
};

/* Export Component ==================================================================== */
export default FathomSlider;
