/**
 * Resend Email Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppStyles, AppSizes, } from '../../constants';

// Components
import { Spacer, Text, } from '../custom/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        alignItems:      'center',
        backgroundColor: AppColors.white,
        flex:            1,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
});

/* Component ==================================================================== */
class ResendEmail extends Component {
    static componentName = 'ResendEmail';

    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    static defaultProps = {}

    render = () => {
        return (
            <View style={[styles.background,]}>
                <View style={{backgroundColor: AppColors.zeplin.shadow, height: 2, width: AppSizes.screen.width,}} />
                <View style={{width: AppSizes.screen.widthTwoThirds,}}>
                    <Spacer size={25} />
                    <Text
                        robotoBold
                        style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(20),}]}
                    >
                        {'Confirmation Email has been re-sent to email@email.com'}
                    </Text>
                    <Spacer size={25} />
                    <Text
                        robotoRegular
                        style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}]}
                    >
                        {'Check you inbox and spam folders for an email from Fathom. This may take a few minutes.'}
                    </Text>
                </View>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default ResendEmail;
