/**
 * CustomNavBar
 *
     <CustomNavBar />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StatusBar, StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, } from '../../constants';
import { TabIcon, Text, } from './';
import { store } from '../../store';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.white,
        flexDirection:   'row',
        height:          AppSizes.navbarHeight,
    },
});

/* Component ==================================================================== */
class CustomNavBar extends Component {
    static propTypes = {}

    static defaultProps = {}

    componentDidMount = () => {
        StatusBar.setBarStyle('dark-content');
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor(AppColors.primary.grey.twentyPercent);
        }
    }

    _renderLeft = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', paddingLeft: AppSizes.paddingXSml}}>
                { Actions.currentParams.onLeft && (Actions.currentParams.routeName === 'onboarding' && !store.getState().user.id) ?
                    <TabIcon
                        icon={Actions.currentScene === 'home' ? 'settings' : 'arrow-left'}
                        iconStyle={[{color: AppColors.black,}]}
                        onPress={Actions.currentParams.onLeft}
                        reverse={false}
                        size={26}
                        type={Actions.currentScene === 'home' ? 'material-community' : 'simple-line-icon'}
                    />
                    :
                    null
                }
            </View>
        )
    }

    _renderMiddle = () => {
        if(Actions.currentScene === 'home') {
            return (
                <Image
                    source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                    style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center'}]}
                />
            )
        }
        return (
            <View style={{flex: 8, justifyContent: 'center',}}>
                <Text style={[AppStyles.h3, {color: AppColors.black, textAlign: 'center'}]}>{Actions.currentParams.title}</Text>
            </View>
        )
    }

    _renderRight = () => {
        if(Actions.currentScene === 'home') {
            return (
                <View style={{flex: 1, justifyContent: 'center',}}></View>
            )
        }
        return(<View style={{flex: 1}}></View>)
    }

    render = () => {
        return (
            <View>
                <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
                <View style={[styles.container , Actions.currentScene === 'settings' ? {borderBottomColor: AppColors.border, borderBottomWidth: 2,} : {}]}>
                    {this._renderLeft()}
                    {this._renderMiddle()}
                    {this._renderRight()}
                </View>
            </View>
        );
    }

}

/* Export Component ==================================================================== */
export default CustomNavBar;
