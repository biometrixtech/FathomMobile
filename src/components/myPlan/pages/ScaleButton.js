/**
 * ScaleButton
 *
     <ScaleButton
        isSelected={isSelected}
        keyLabel={key}
        opacity={opacity}
        updateStateAndForm={() => {
            handleFormChange('post_session_survey.RPE', key);
            if(key === 0 || key >= 1) {
                this._scrollToBottom();
            }
        }}
     />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppStyles, } from '../../../constants';
import { Text, } from '../../custom';

/* Component ==================================================================== */
const ScaleButton = ({
    isSelected,
    keyLabel,
    opacity,
    updateStateAndForm,
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
    </View>
);

ScaleButton.propTypes = {
    isSelected:         PropTypes.bool.isRequired,
    keyLabel:           PropTypes.number.isRequired,
    opacity:            PropTypes.number.isRequired,
    updateStateAndForm: PropTypes.func.isRequired,
};

ScaleButton.defaultProps = {};

ScaleButton.componentName = 'ScaleButton';

/* Export Component ================================================================== */
export default ScaleButton;