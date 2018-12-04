/**
 * ScaleButton
 *
     <ScaleButton
         isSelected={this.state.value === key}
         key={value+key}
         keyLabel={key}
         opacity={0.25}
         sorenessPainMappingLength={sorenessPainMapping.length}
         updateStateAndForm={this._updateStateAndForm}
         valueLabel={value}
     />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Spacer, Text, } from '../../custom';

/* Component ==================================================================== */
const ScaleButton = ({
    isSelected,
    keyLabel,
    opacity,
    sorenessPainMappingLength,
    updateStateAndForm,
    valueLabel,
}) => (
    <View
        style={{flex: 1, justifyContent: 'center',}}
    >
        <TouchableHighlight
            onPress={updateStateAndForm}
            style={[AppStyles.sorenessPainValues, {
                backgroundColor: isSelected ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.scaleButton,
                borderColor:     isSelected ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.scaleButton,
                opacity:         opacity,
            }]}
            underlayColor={AppColors.transparent}
        >
            <Text
                oswaldMedium
                style={[
                    AppStyles.textCenterAligned,
                    {
                        color:    isSelected ? AppColors.white : AppColors.primary.grey.fiftyPercent,
                        fontSize: AppFonts.scaleFont(15),
                    }
                ]}
            >
                {keyLabel}
            </Text>
        </TouchableHighlight>
        { valueLabel ?
            <Text
                oswaldMedium
                style={[
                    AppStyles.textCenterAligned,
                    {
                        color:             AppColors.primary.grey.fiftyPercent,
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
    opacity:                   PropTypes.number,
    sorenessPainMappingLength: PropTypes.number.isRequired,
    updateStateAndForm:        PropTypes.func.isRequired,
    valueLabel:                PropTypes.string,
};

ScaleButton.defaultProps = {
    opacity:    1,
    valueLabel: null,
};

ScaleButton.componentName = 'ScaleButton';

/* Export Component ================================================================== */
export default ScaleButton;