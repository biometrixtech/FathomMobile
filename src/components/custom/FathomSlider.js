/**
 * Fathom Slider
 *
    <FathomSlider
        handleFormChange={this._handleFormChange}
        isValid={true}
        maximumValue={9}
        minimumValue={0}
        name={'string'}
        value={value}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// import third-party libraries
import { Slider, } from 'react-native-elements';

// import constants
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { Text, } from '../custom';
import { PlanLogic, } from '../../lib';

const THUMB_SIZE = 40;

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
    textStyle: (isValid, isLeft) => ({
        color:     isValid ? AppColors.zeplin.slateLight : AppColors.zeplin.slateXLight,
        fontSize:  AppFonts.scaleFont(12),
        textAlign: isLeft ? 'left' : 'right',
    }),
    thumbStyle: isValid => ({
        ...AppStyles.scaleButtonShadowEffect,
        backgroundColor: isValid ? AppColors.zeplin.splashLight : AppColors.zeplin.slateXLight,
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
    step,
    thumbTintColor,
    value,
}) => (
    <View>
        <Slider
            animateTransitions={true}
            animationType={'spring'}
            disabled={disabled}
            maximumTrackTintColor={AppColors.zeplin.superLight}
            maximumValue={maximumValue}
            minimumTrackTintColor={`${AppColors.zeplin.splashLight}${PlanLogic.returnHexOpacity(0.5)}`}
            minimumValue={minimumValue}
            onSlidingComplete={val => handleFormChange(val)}
            orientation={orientation}
            step={step}
            thumbTintColor={thumbTintColor}
            thumbTouchSize={{height: THUMB_SIZE, width: THUMB_SIZE,}}
            thumbStyle={[customStyles.thumbStyle(!disabled),]}
            value={value}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingXSml, paddingTop: AppSizes.paddingMed,}}>
            <Text robotoRegular style={[customStyles.textStyle(isValid, true),]}>{'None'}</Text>
            <Text robotoRegular style={[customStyles.textStyle(isValid, false),]}>{'Max'}</Text>
        </View>
    </View>
);

FathomSlider.propTypes = {
    bodyPart:         PropTypes.number,
    disabled:         PropTypes.bool,
    handleFormChange: PropTypes.func.isRequired,
    isValid:          PropTypes.bool,
    maximumValue:     PropTypes.number.isRequired,
    minimumValue:     PropTypes.number.isRequired,
    name:             PropTypes.string,
    orientation:      PropTypes.string,
    step:             PropTypes.number,
    thumbTintColor:   PropTypes.string,
    value:            PropTypes.number.isRequired,
};

FathomSlider.defaultProps = {
    disabled:       false,
    isValid:        false,
    name:           '',
    orientation:    'vertical',
    step:           1,
    thumbTintColor: AppColors.zeplin.yellow,
};

/* Export Component ==================================================================== */
export default FathomSlider;
