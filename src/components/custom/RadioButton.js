import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors } from '../../constants';
import { FormLabel, Text } from './';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    textWrapper: {
        alignItems:      'center',
        backgroundColor: AppColors.primary.grey.thirtyPercent,
        height:          50,
        justifyContent:  'center',
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
class RadioButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { label, onChange, options, value } = this.props;
        return (
            <View style={[styles.view]}>
                <FormLabel>{label}</FormLabel>
                { options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            onChange(option.value);
                        }}
                        style={[
                            styles.textWrapper,
                            {width: `${100/options.length}%`},
                            [
                                value === option.value ?
                                    {backgroundColor: '#000'}
                                    :
                                    {}
                            ],
                        ]}
                    >
                        <Text style={
                            value === option.value ?
                                {backgroundColor: '#000', color: '#fff'}
                                :
                                {}
                        }>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }
}

RadioButton.propTypes = {
    label:    PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options:  PropTypes.array.isRequired,
    value:    PropTypes.bool.isRequired,
};
RadioButton.defaultProps = {};
RadioButton.componentName = 'RadioButton';

/* Export Component ==================================================================== */
export default RadioButton;