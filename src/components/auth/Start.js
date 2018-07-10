/**
 * Start Screen
 *  - Get Started -> onboarding steps
 *  - Already a memeber? -> login
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';

// Components
import { Button, Spacer, Text } from '../custom/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({

});

/* Component ==================================================================== */
class Start extends Component {
    static componentName = 'Start';

    constructor(props) {
        super(props);
    }

    _routeToLogin = () => {
        Actions.login();
    }

    _routeToOnboarding = () => {
        Actions.onboarding();
    }

    render = () => {
        return (
            <View>
                <ImageBackground
                    source={require('../../constants/assets/images/start.png')}
                    style={[AppStyles.containerCentered, {height: AppSizes.screen.heightTwoThirds, width: AppSizes.screen.width,}]}
                >
                    <Text style={[AppStyles.paddingVertical, {
                        color:      AppColors.white,
                        fontFamily: AppFonts.base.family,
                        fontSize:   AppFonts.h1.size,
                        fontWeight: 'bold',
                        lineHeight: AppFonts.h1.lineHeight,
                    }]}>{'Join Fathom'}</Text>
                    <Text style={[AppStyles.paddingBottom, {
                        color: AppColors.white,
                    }]}>{'Create your account'}</Text>
                    <Button
                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                        large
                        onPress={this._routeToOnboarding}
                        textColor={AppColors.white}
                        title={'Get Started'}
                    />
                </ImageBackground>
                <Spacer size={5} />
                <TouchableOpacity
                    onPress={this._routeToLogin}
                    style={[AppStyles.containerCentered, {height: AppSizes.screen.heightOneThird, width: AppSizes.screen.width,}]}
                >
                    <Text style={[AppStyles.paddingBottom, {
                        color:      AppColors.black,
                        fontFamily: AppFonts.base.family,
                        fontSize:   AppFonts.h1.size,
                        fontWeight: 'bold',
                        lineHeight: AppFonts.h1.lineHeight,
                    }]}>{'Already a memeber?'}</Text>
                    <Text style={{
                        color: AppColors.primary.yellow.hundredPercent,
                    }}>{'Login now.'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Start;
