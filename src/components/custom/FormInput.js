/**
 * Text Input
 *
     <FormInput></FormInput>
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, } from 'react-native-elements';

// Consts and Libs
import { AppColors, AppFonts, } from '../../constants';

/* Component ==================================================================== */
class FormInput extends Component {
    static propTypes = {
        containerStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
        inputStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
    }

    static defaultProps = {
        containerStyle: [],
        inputStyle:     [],
    }

    inputProps = () => {
        // Defaults
        const props = {
            ...this.props,
            selectionColor: AppColors.zeplin.yellow,
            containerStyle: [{
                borderBottomColor: AppColors.zeplin.light,
                borderBottomWidth: 1,
                backgroundColor:   AppColors.transparent,
                marginLeft:        20,
                marginRight:       20,
            }],
            inputContainerStyle: [{
                borderBottomWidth: 0,
            }],
            inputStyle: [{
                ...AppFonts.robotoRegular,
                color:             AppColors.black,
                fontSize:          AppFonts.scaleFont(16),
                paddingHorizontal: 10,
                paddingVertical:   3,
            }],
            ref: this.props.inputRef,
        };

        if (this.props.containerStyle) {
            props.containerStyle.push(this.props.containerStyle);
        }

        if (this.props.inputStyle) {
            props.inputStyle.push(this.props.inputStyle);
        }

        return props;
    }

    render = () => <Input {...this.inputProps()} />
}

/* Export Component ==================================================================== */
export default FormInput;
