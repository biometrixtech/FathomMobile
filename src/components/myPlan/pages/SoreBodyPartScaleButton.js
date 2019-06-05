/**
 * SoreBodyPartScaleButton
 *
    <SoreBodyPartScaleButton
        extraStyles={{marginRight: AppSizes.padding,}}
        isSelected={isSelected}
        label={text}
        updateStateAndForm={() => this._updateStateAndForm()}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, TouchableHighlight, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppStyles, } from '../../../constants';
import { Text, } from '../../custom';

/* Component ==================================================================== */
const SoreBodyPartScaleButton = ({
    extraStyles,
    isSelected,
    label,
    updateStateAndForm,
}) => (
    <TouchableHighlight
        onPress={updateStateAndForm}
        style={[
            AppStyles.scaleButtonShadowEffect,
            AppStyles.sorenessPainButtons,
            Platform.OS === 'ios' ? {} : {elevation: 2,},
            extraStyles,
            { backgroundColor: isSelected ? AppColors.zeplin.yellow : AppColors.zeplin.superLight, }
        ]}
        underlayColor={AppColors.transparent}
    >
        <Text
            oswaldMedium
            style={[
                AppStyles.textCenterAligned,
                {
                    color:    isSelected ? AppColors.white : AppColors.zeplin.slate,
                    fontSize: AppFonts.scaleFont(13),
                }
            ]}
        >
            {label}
        </Text>
    </TouchableHighlight>
);

SoreBodyPartScaleButton.propTypes = {
    extraStyles:        PropTypes.object,
    isSelected:         PropTypes.bool.isRequired,
    label:              PropTypes.string.isRequired,
    updateStateAndForm: PropTypes.func.isRequired,
};

SoreBodyPartScaleButton.defaultProps = {
    extraStyles: {},
};

SoreBodyPartScaleButton.componentName = 'SoreBodyPartScaleButton';

/* Export Component ================================================================== */
export default SoreBodyPartScaleButton;