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
import { AppUtil, } from '../../lib';
import { TabIcon, Text, } from './';

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

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        StatusBar.setBarStyle('dark-content');
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor(AppColors.primary.grey.twentyPercent);
        }
    }

    _renderLeft = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', paddingLeft: AppSizes.paddingXSml,}}>
                { this.props.routeName === 'onboarding' && !this.props.user.id ?
                    <TabIcon
                        icon={'arrow-left'}
                        iconStyle={[{color: AppColors.black,}]}
                        onPress={Actions.currentParams.onLeft}
                        reverse={false}
                        size={26}
                        type={'simple-line-icon'}
                    />
                    : Actions.currentParams.onLeft && this.props.routeName === 'coachesDashboard' ?
                        <TabIcon
                            icon={'settings'}
                            iconStyle={[{color: AppColors.black,}]}
                            onPress={Actions.currentParams.onLeft}
                            reverse={false}
                            size={26}
                            type={'material-community'}
                        />
                        : Actions.currentParams.onLeft && this.props.routeName !== 'onboarding' ?
                            <TabIcon
                                icon={'arrow-left'}
                                iconStyle={[{color: AppColors.black,}]}
                                onPress={Actions.currentParams.onLeft}
                                reverse={false}
                                size={26}
                                type={'simple-line-icon'}
                            />
                            :
                            null
                }
            </View>
        )
    }

    _renderMiddle = () => {
        if(this.props.routeName === 'coachesDashboard') {
            return (
                <Image
                    source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                    style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
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
        return(<View style={{flex: 1}}></View>)
    }

    render = () => {
        return (
            <View>
                <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
                <View style={[styles.container, this.props.routeName === 'settings' ? {borderBottomColor: AppColors.border, borderBottomWidth: 2,} : {}]}>
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
