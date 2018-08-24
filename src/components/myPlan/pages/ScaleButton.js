/**
 * ScaleButton
 *
     <ScaleButton
         isSelected={this.state.value === key}
         key={value+key}
         keyLabel={key}
         sorenessPainMappingLength={sorenessPainMapping.length}
         updateStateAndForm={this._updateStateAndForm}
         valueLabel={value}
     />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Spacer, Text, } from '../../custom';

/* Component ==================================================================== */
const ScaleButton = ({
    isSelected,
    keyLabel,
    sorenessPainMappingLength,
    updateStateAndForm,
    valueLabel,
}) => (
    <View
        style={{flex: 1, justifyContent: 'center',}}
    >
        <TouchableOpacity
            style={[AppStyles.sorenessPainValues, {
                backgroundColor: isSelected ? AppColors.primary.yellow.hundredPercent : AppColors.primary.white.hundredPercent,
                borderColor:     isSelected ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
            }]}
            onPress={updateStateAndForm}
        >
            <Text
                oswaldRegular
                style={[
                    AppStyles.textCenterAligned,
                    {
                        color:    isSelected ? AppColors.white : AppColors.primary.grey.fiftyPercent,
                        fontSize: AppFonts.scaleFont(14),
                    }
                ]}
            >
                {keyLabel}
            </Text>
        </TouchableOpacity>
        { valueLabel ?
            <Text
                oswaldRegular
                style={[
                    AppStyles.textCenterAligned,
                    {
                        color:             isSelected ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                        flex:              1,
                        fontSize:          AppFonts.scaleFont(12),
                        paddingHorizontal: AppSizes.paddingXSml,
                        paddingVertical:   AppSizes.paddingSml,
                    }
                ]}
            >
                {valueLabel.toUpperCase()}
            </Text>
            :
            <Spacer size={10} />
        }
    </View>
);

ScaleButton.propTypes = {
    isSelected:                PropTypes.bool.isRequired,
    keyLabel:                  PropTypes.number.isRequired,
    sorenessPainMappingLength: PropTypes.number.isRequired,
    updateStateAndForm:        PropTypes.func.isRequired,
    valueLabel:                PropTypes.string,
};
ScaleButton.defaultProps = {
    valueLabel: null,
};
ScaleButton.componentName = 'ScaleButton';

/* Export Component ================================================================== */
export default ScaleButton;