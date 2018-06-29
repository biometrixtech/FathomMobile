/**
 * Start Screen
 *  - Get Started -> onboarding steps
 *  - Already a memeber? -> login
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppSizes } from '../../constants';

// Components
import { Button, Spacer, Text } from '../custom/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    cardBackground: {
        alignItems:      'center',
        backgroundColor: AppColors.primary.grey.fiftyPercent,
        height:          AppSizes.screen.heightHalf,
        justifyContent:  'center',
        width:           AppSizes.screen.width,
    },
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
                <View style={[styles.cardBackground]}>
                    <Text style={{
                        color:         '#000',
                        fontSize:      30,
                        fontWeight:    'bold',
                        lineHeight:    30,
                        paddingBottom: 10,
                    }}>{'Join the FathomAI Team'}</Text>
                    <Text style={{
                        color:         AppColors.primary.grey.thirtyPercent,
                        paddingBottom: 10,
                    }}>{'Create your account within minutes.'}</Text>
                    <Button
                        backgroundColor={'#fff'}
                        large
                        onPress={this._routeToOnboarding}
                        textColor='#000'
                        title={'Get Started'}
                    />
                </View>
                <Spacer size={5} />
                <TouchableOpacity onPress={this._routeToLogin} style={[styles.cardBackground]}>
                    <Text style={{
                        color:         '#000',
                        fontSize:      20,
                        fontWeight:    'bold',
                        lineHeight:    30,
                        paddingBottom: 10,
                    }}>{'Already a memeber?'}</Text>
                    <Text style={{
                        color: AppColors.primary.grey.thirtyPercent,
                    }}>{'Let\'s login now.'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Start;
