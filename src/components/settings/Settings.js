/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 16:40:29
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:43:33
 */

/**
 * Settings View
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppSizes, AppStyles } from '@constants';

// Components
import { View, Platform, BackHandler } from 'react-native';
import { ListItem } from '@custom';


/* Component ==================================================================== */
class Settings extends Component {
    static componentName = 'SettingsView';
    static propTypes = {
        logout: PropTypes.func.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
    }

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    render = () => {
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1}}>
                <ListItem
                    chevronColor={AppColors.black}
                    containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding}}
                    leftIcon={{color: AppColors.black, name: 'bluetooth', size: 24}}
                    onPress={() => Actions.kitManagement()}
                    title='PAIR WITH A NEW SENSOR'
                    titleStyle={{color: AppColors.black}}
                />
                <ListItem
                    chevronColor={AppColors.black}
                    containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding}}
                    leftIcon={{color: AppColors.black, name: 'power-settings-new', size: 24}}
                    onPress={() => Promise.resolve(this.props.logout()).then(() => Actions.login())}
                    title='LOGOUT'
                    titleStyle={{color: AppColors.black}}
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Settings;
