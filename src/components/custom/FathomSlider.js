/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 13:30:00
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:25:01
 */

/**
 * Fathom Slider
 *
    <FathomSlider
        handleFormChange={this._handleFormChange}
        maximumValue={9}
        minimumValue={0}
        name={'string'}
        value={value}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

// import third-party libraries
import { Slider, } from 'react-native-elements';
import _ from 'lodash';

// import constants
import { AppColors, AppFonts, AppSizes, MyPlan as MyPlanConstants, } from '../../constants';
import { Text, } from './';

/* Component ==================================================================== */
const FathomSlider = ({
    bodyPart,
    handleFormChange,
    maximumValue,
    minimumValue,
    name,
    orientation,
    step,
    thumbTintColor,
    value,
}) => (
    <View style={{flex: 1, flexDirection: 'row',}}>
        <View style={{alignItems: 'flex-end', flex: 4, justifyContent: 'space-between',}}>
            <Text style={{color: AppColors.white, fontSize: AppFonts.scaleFont(12),}}>{' '}</Text>
            { _.map(MyPlanConstants.postSessionFeel, (val, key) => (
                <Text
                    oswaldMedium
                    key={val+key}
                    style={{
                        color:    key === value ? AppColors.zeplin.yellow : AppColors.zeplin.darkGrey,
                        fontSize: AppFonts.scaleFont(key === value ? 22 : 12),
                    }}
                >
                    {key}
                </Text>
            ))}
        </View>
        <View style={{flex: 2, justifyContent: 'center',}}>
            <Slider
                maximumValue={maximumValue}
                minimumTrackTintColor={AppColors.zeplin.yellow}
                minimumValue={minimumValue}
                onSlidingComplete={val => handleFormChange(val)}
                orientation={orientation}
                step={step}
                style={{backgroundColor: 'green',}}
                thumbTintColor={thumbTintColor}
                // thumbTouchSize={{height: 75, width: 75}}
                thumbStyle={{backgroundColor: AppColors.zeplin.yellow,}}
                trackStyle={{backgroundColor: AppColors.border,}}
                value={value}
            />
        </View>
        <View style={{flex: 4, justifyContent: 'space-between',}}>
            <Text style={{color: AppColors.white, fontSize: AppFonts.scaleFont(12),}}>{' '}</Text>
            { _.map(MyPlanConstants.postSessionFeel, (val, key) => (
                <Text
                    oswaldMedium
                    key={val+key}
                    style={{
                        color:    key === value ? AppColors.zeplin.yellow : AppColors.zeplin.darkGrey,
                        fontSize: AppFonts.scaleFont(key === value ? 22 : 12),
                    }}
                >
                    {val.toUpperCase()}
                </Text>
            ))}
        </View>
    </View>
);

FathomSlider.propTypes = {
    bodyPart:         PropTypes.number,
    handleFormChange: PropTypes.func.isRequired,
    maximumValue:     PropTypes.number.isRequired,
    minimumValue:     PropTypes.number.isRequired,
    name:             PropTypes.string.isRequired,
    orientation:      PropTypes.string,
    step:             PropTypes.number,
    thumbTintColor:   PropTypes.string,
    value:            PropTypes.number.isRequired,
};

FathomSlider.defaultProps = {
    orientation:    'vertical',
    step:           1,
    thumbTintColor: AppColors.zeplin.yellow,
};

/* Export Component ==================================================================== */
export default FathomSlider;
