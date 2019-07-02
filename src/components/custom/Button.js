/**
 * Buttons
 *
     <Button text={'Server is down'} />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';

// import third-party libraries
import { Button, } from 'react-native-elements';

// Consts and Libs
import { AppFonts, AppSizes, AppStyles, } from '../../constants';

/* Component ==================================================================== */
class CustomButton extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        title:   PropTypes.string.isRequired,
    }

    static defaultProps = {};

    buttonProps = () => {
        // Defaults
        const props = { ...this.props, };

        props.buttonStyle = { borderRadius: AppSizes.paddingLrg, ...props.buttonStyle, };
        props.titleStyle = { textAlign: 'center', ...props.titleStyle, ...AppFonts.robotoMedium, };

        if(props.type === 'outline') {
            props.buttonStyle.borderWidth = 1;
        }

        props.titleProps = { allowFontScaling: false, };

        if(props.raised) {
            props.raised = false;
            props.containerStyle = { ...AppStyles.scaleButtonShadowEffect, ...props.containerStyle, };
        }

        return props;
    }

    render = () => <Button {...this.buttonProps()} />;
}

/* Export Component ==================================================================== */
export default CustomButton;
