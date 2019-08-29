/**
 * Text Input
 *
     <FormInput></FormInput>
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Input, } from 'react-native-elements';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../constants';

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
                borderBottomColor: AppColors.zeplin.slateXLight,
                borderBottomWidth: 1,
                backgroundColor:   AppColors.transparent,
                marginHorizontal:  AppSizes.padding,
            }],
            inputContainerStyle: [{
                borderBottomWidth: 0,
            }],
            inputStyle: [{
                ...AppFonts.robotoRegular,
                color:             AppColors.black,
                fontSize:          AppFonts.scaleFont(16),
                paddingHorizontal: AppSizes.paddingSml,
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

        props.allowFontScaling = false;
        props.errorProps = { allowFontScaling: false, };
        props.labelProps = { allowFontScaling: false, };

        return props;
    }

    render = () => <Input {...this.inputProps()} />
}

/* Export Component ==================================================================== */
export default FormInput;
