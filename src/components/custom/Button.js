/**
 * Buttons
 *
     <Button text={'Server is down'} />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, } from 'react-native-elements';

// Consts and Libs
// import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppFonts, } from '../../constants';

/* Component ==================================================================== */
class CustomButton extends Component {
    static propTypes = {
        // small:           PropTypes.bool,
        // large:           PropTypes.bool,
        // outlined:        PropTypes.bool,
        // backgroundColor: PropTypes.string,
        onPress: PropTypes.func.isRequired,
        // icon:            PropTypes.shape({
        //     name: PropTypes.string,
        // }),
        // raised: PropTypes.bool,
        title:   PropTypes.string.isRequired,
    }

    static defaultProps = {
        // small:           false,
        // large:           false,
        // outlined:        false,
        // icon:            {},
        // backgroundColor: null,
        // raised:          true,
    }

    buttonProps = () => {
        // Defaults
        const props = {
        //     ...AppFonts.oswaldBold,
        //     title:              this.props.title || 'Coming Soon...',
        //     color:              this.props.textColor || '#fff',
        //     onPress:            this.props.onPress,
        //     fontSize:           AppFonts.base.size,
        //     borderRadius:       AppSizes.borderRadius,
        //     containerViewStyle: { borderRadius: AppSizes.borderRadius },
        //     raised:             this.props.raised,
        //     buttonStyle:        {
        //         padding:     AppFonts.scaleFont(12),
        //         marginLeft:  0,
        //         marginRight: 0,
        //     },
            ...this.props,
        //     backgroundColor: this.props.backgroundColor || AppColors.secondary.blue.hundredPercent,
        //     small:           false,
        //     large:           false,
        //     icon:            (this.props.icon && this.props.icon.name)
        //         ? {
        //             size: AppFonts.scaleFont(14),
        //             ...this.props.icon,
        //         } : null,
        };

        // Overrides
        // Size
        /*if (this.props.small) {
            props.fontSize = AppFonts.scaleFont(12);
            props.buttonStyle.padding = AppFonts.scaleFont(8);

            if (props.icon && props.icon.name) {
                props.icon = {
                    size: AppFonts.scaleFont(14),
                    ...props.icon,
                };
            }
        }
        if (this.props.large) {
            props.fontSize = AppFonts.scaleFont(20);
            props.buttonStyle.padding = AppFonts.scaleFont(15);

            if (props.icon && props.icon.name) {
                props.icon = {
                    size: AppFonts.scaleFont(20),
                    ...props.icon,
                };
            }
        }

        // Outlined
        if (this.props.outlined) {
            props.raised = false;
            props.backgroundColor = this.props.backgroundColor || 'transparent';
            props.color = this.props.color || AppColors.secondary.blue.hundredPercent;
            props.buttonStyle.borderWidth = 1;
            props.buttonStyle.borderColor = this.props.color || AppColors.secondary.blue.hundredPercent;

            if (props.icon && props.icon.name) {
                props.icon = {
                    color: this.props.color || AppColors.secondary.blue.hundredPercent,
                    ...props.icon,
                };
            }
        }*/

        props.buttonStyle = { borderRadius: 4, ...props.buttonStyle, };
        props.titleStyle = { textAlign: 'center', ...props.titleStyle, ...AppFonts.robotoRegular, };

        return props;
    }

    render = () => <Button {...this.buttonProps()} />;
}

/* Export Component ==================================================================== */
export default CustomButton;
