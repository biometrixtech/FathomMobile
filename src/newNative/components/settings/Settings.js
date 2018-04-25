/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 16:40:29 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-25 01:27:13
 */

/**
 * Settings View
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppColors } from '../../../constants/';

// Components
import { View, Platform, BackHandler } from 'react-native';
import { ListItem } from '../custom/';


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
            BackHandler.addEventListener('hardwareBackPress', () => null);
        }
    }

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    render = () => {
        return (
            <View style={{ backgroundColor: AppColors.white }} >
                <ListItem
                    leftIcon={{ name: 'phonelink', color: AppColors.primary.grey.hundredPercent }}
                    onPress={() => Actions.kitManagement()}
                    title='Kit Management'
                />
                <ListItem
                    leftIcon={{ name: 'power-settings-new', color: AppColors.primary.grey.hundredPercent }}
                    onPress={() => Promise.resolve(this.props.logout()).then(() => Actions.authorize())}
                    title='Logout'
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Settings;
