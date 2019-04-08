import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles } from '../../constants';
import { Text } from './';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    textWrapper: {
        backgroundColor: AppColors.primary.grey.thirtyPercent,
        height:          50,
        marginTop:       20,
        width:           '100%',
    },
    view: {
        flexDirection:  'row',
        flexWrap:       'wrap',
        justifyContent: 'center',
        marginLeft:     0,
        width:          '100%',

    },
});

/* Component ==================================================================== */
const RadioButton = ({ label, onChange, options, textStyle, value, }) => (
    <View style={[styles.view]}>
        <Text style={textStyle}>{label}</Text>
        { options.map((option, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    onChange(option.value);
                }}
                style={[
                    AppStyles.containerCentered,
                    styles.textWrapper,
                    {width: `${100/options.length}%`},
                    [
                        value === option.value ?
                            {backgroundColor: AppColors.secondary.blue.eightyPercent}
                            :
                            {}
                    ],
                ]}
            >
                <Text style={
                    value === option.value ?
                        {backgroundColor: AppColors.transparent, color: AppColors.white}
                        :
                        {}
                }>
                    {option.label}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

RadioButton.propTypes = {
    label:     PropTypes.string.isRequired,
    onChange:  PropTypes.func.isRequired,
    options:   PropTypes.array.isRequired,
    textStyle: PropTypes.object,
    value:     PropTypes.bool,
};
RadioButton.defaultProps = {
    textStyle: {},
    value:     null,
};
RadioButton.componentName = 'RadioButton';

/* Export Component ==================================================================== */
export default RadioButton;