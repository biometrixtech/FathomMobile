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
import { Text, } from '../../custom';

/* Component ==================================================================== */
const ScaleButton = ({
    isSelected,
    keyLabel,
    opacity,
    sorenessPainMappingLength,
    updateStateAndForm,
    valueLabel,
}) => (
    <View style={{flex: 1, justifyContent: 'flex-start',}}>
        <TouchableHighlight
            onPress={updateStateAndForm}
            style={[AppStyles.sorenessPainValuesLrg, {
                backgroundColor: isSelected ? `rgba(235, 186, 45, ${opacity})` : `rgba(226, 226, 226, ${opacity})`,
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
                        color:             isSelected ? AppColors.primary.yellow.hundredPercent : AppColors.primary.grey.fiftyPercent,
                        fontSize:          AppFonts.scaleFont(12),
                        paddingHorizontal: AppSizes.paddingXSml,
                        paddingVertical:   AppSizes.paddingSml,
                    }
                ]}
            >
                {valueLabel.toUpperCase()}
            </Text>
            :
            null
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