/**
 * ScaleButton
 *
     <ScaleButton
         isSelected={isSelected}
         scale={value}
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
import { StyleSheet, TouchableHighlight, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Text, } from '../../custom';

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
    buttonWrapper: {
        flex: 1,
    },
    textWrapper: {
        alignItems:     'flex-start',
        flex:           1,
        paddingLeft:    AppSizes.padding,
        justifyContent: 'center',
    },
    wrapper: {
        flex:           1,
        flexDirection:  'row',
        justifyContent: 'center',
        marginBottom:   AppSizes.paddingMed,
    },
});

/* Component ==================================================================== */
const ScaleButton = ({
    isSelected,
    scale,
    updateStateAndForm,
}) => (
    <View style={[customStyles.wrapper,]}>
        <View style={[customStyles.buttonWrapper,]}>
            <TouchableHighlight
                onPress={updateStateAndForm}
                style={[
                    AppStyles.sorenessPainButtons,
                    AppStyles.scaleButtonShadowEffect,
                    {
                        alignSelf:       'flex-end',
                        backgroundColor: isSelected ? AppColors.zeplin.yellow : AppColors.white,
                    }
                ]}
                underlayColor={AppColors.transparent}
            >
                <Text
                    oswaldMedium
                    style={[
                        AppStyles.textCenterAligned,
                        {
                            color:    isSelected ? AppColors.white : AppColors.zeplin.slate,
                            fontSize: AppFonts.scaleFont(18),
                        }
                    ]}
                >
                    {scale.index}
                </Text>
            </TouchableHighlight>
        </View>
        <View style={[customStyles.textWrapper,]}>
            <Text robotoMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}>{scale.label}</Text>
            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11),}}>{scale.subtitle}</Text>
        </View>
    </View>
);

ScaleButton.propTypes = {
    isSelected:         PropTypes.bool.isRequired,
    scale:              PropTypes.object.isRequired,
    updateStateAndForm: PropTypes.func.isRequired,
};

ScaleButton.defaultProps = {};

ScaleButton.componentName = 'ScaleButton';

/* Export Component ================================================================== */
export default ScaleButton;