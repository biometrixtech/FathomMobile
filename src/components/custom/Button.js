/**
 * Buttons
 *
     <Button text={'Server is down'} />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Button, } from 'react-native-elements';

// Consts and Libs
import { AppFonts, } from '../../constants';

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

        props.buttonStyle = { borderRadius: 4, ...props.buttonStyle, };
        props.titleStyle = { textAlign: 'center', ...props.titleStyle, ...AppFonts.robotoMedium, };

        if(props.type === 'outline') {
            props.buttonStyle.borderWidth = 1;
        }

        props.titleProps = { allowFontScaling: false, };

        return props;
    }

    render = () => <Button {...this.buttonProps()} />;
}

/* Export Component ==================================================================== */
export default CustomButton;
