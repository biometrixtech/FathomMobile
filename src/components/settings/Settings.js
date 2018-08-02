/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 16:40:29
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:14:28
 */

/**
 * Settings View
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';


// import third-party libraries
import { Actions } from 'react-native-router-flux';
import Toast, { DURATION } from 'react-native-easy-toast';

// Consts and Libs
import { AppColors, AppSizes, AppStyles } from '../../constants';
import { ListItem } from '../custom';
import { AppUtil } from '../../lib';

// Components
import { Alert, BackHandler, Platform, View, } from 'react-native';

/* Component ==================================================================== */
class Settings extends Component {
    static componentName = 'SettingsView';
    static propTypes = {
        accessoryData:              PropTypes.object.isRequired,
        deleteUserSensorData:       PropTypes.func.isRequired,
        disconnectFromSingleSensor: PropTypes.func.isRequired,
        logout:                     PropTypes.func.isRequired,
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

    _disconnectFromSingleSensor = () => {
        const uniqueId = AppUtil.getDeviceUUID();
        if(uniqueId === this.props.accessoryData.mobile_udid) {
            Alert.alert(
                'Warning!',
                'Are you sure you want to UNPAIR your sensor? You will need to pair it with a mobile device before your next session.',
                [
                    {
                        text:  'Cancel',
                        style: 'cancel'
                    },
                    {
                        text:    'Unpair',
                        onPress: () => {
                            this.props.disconnectFromSingleSensor(this.props.accessoryData.sensor_pid)
                                .catch(err => this.props.deleteUserSensorData(this.props.accessoryData.sensor_pid))
                                .then(() => this.props.deleteUserSensorData(this.props.accessoryData.sensor_pid))
                                .then(() => this.refs.toast.show('Successfully UNPAIRED from sensor', DURATION.LENGTH_LONG))
                                .catch(err => {
                                    this.refs.toast.show('Failed to UNPAIR from sensor', DURATION.LENGTH_LONG);
                                    console.log('error while disconnecting from single sensor',err);
                                });
                        }
                    },
                ],
                { cancelable: true }
            )
        } else {
            Alert.alert(
                'Warning!',
                'This isn\'t the device that you initially paired with your sensor. Please UNPAIR the sensor using your original device.',
                [
                    {
                        text:  'OK',
                        style: 'cancel'
                    },
                ],
                { cancelable: true }
            )
        }
    }

    render = () => {
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1}}>
                <ListItem
                    chevronColor={AppColors.black}
                    containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding}}
                    leftIcon={{color: AppColors.black, name: 'bluetooth', size: 24}}
                    onPress={() => this.props.accessoryData.sensor_pid ? this._disconnectFromSingleSensor() : Actions.bluetoothConnect()}
                    title={this.props.accessoryData.sensor_pid ? 'UNPAIR SENSOR' : 'PAIR WITH A NEW SENSOR'}
                    titleStyle={{color: AppColors.black}}
                />
                <ListItem
                    chevronColor={AppColors.black}
                    containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding}}
                    leftIcon={{color: AppColors.black, name: 'power-settings-new', size: 24}}
                    onPress={() => this.props.logout().then(() => Actions.start())}
                    title={'LOGOUT'}
                    titleStyle={{color: AppColors.black}}
                />
                <Toast
                    position={'top'}
                    ref={'toast'}
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Settings;
