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
import { Actions, } from 'react-native-router-flux';
import Toast, { DURATION, } from 'react-native-easy-toast';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, UserAccount, } from '../../constants';
import { bleUtils, } from '../../constants/utils';
import { ListItem, TabIcon, } from '../custom';
import { AppUtil, } from '../../lib';
import { ble as BLEActions, user as UserActions, } from '../../actions';

// Components
import { Animated, Alert, BackHandler, Easing, Platform, View, } from 'react-native';

/* Component ==================================================================== */
class Settings extends Component {
    static componentName = 'SettingsView';
    static propTypes = {
        accessoryData:                  PropTypes.object.isRequired,
        deleteUserSensorData:           PropTypes.func.isRequired,
        deleteAllSingleSensorPractices: PropTypes.func.isRequired,
        logout:                         PropTypes.func.isRequired,
        network:                        PropTypes.object.isRequired,
        user:                           PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            isUnpairing: false,
        };
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

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
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
                        style: 'cancel',
                    },
                    {
                        text:    'Unpair',
                        onPress: () => {
                            this.setState(
                                { isUnpairing: !this.state.isUnpairing, },
                                () => {
                                    return this._handleBLEUnpair()
                                        .then(res => {
                                            this.setState({ isUnpairing: false, });
                                            this.refs.toast.show(res, (DURATION.LENGTH_SHORT * 2));
                                        })
                                        .catch(err => {
                                            this.setState({ isUnpairing: false, });
                                            this.refs.toast.show(err, (DURATION.LENGTH_SHORT * 2));
                                        });
                                },
                            );
                        },
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

    _resetAccountData = () => {
        Alert.alert(
            'Warning!',
            'Are you sure you want to reset this account?',
            [
                {
                    text:    'Yes',
                    onPress: () => {
                        return UserActions.clearUserData()
                            .catch(err => this._alertResetError(err));
                    }
                },
                {
                    text:  'No',
                    style: 'cancel'
                },
            ],
            { cancelable: true }
        )
    }

    _alertResetError = err => {
        Alert.alert(
            'Error!',
            'Ooops! Something went wrong with reset. Please try again.',
            [
                {
                    text:  'OK',
                    style: 'cancel'
                },
            ],
            { cancelable: true }
        )
    }

    _handleBLEUnpair = () => {
        let sensorPid = this.props.accessoryData.sensor_pid;
        return BLEActions.getSingleSensorStatus(sensorPid)
            .catch(err => {
                // not connected, try connecting again
                return BLEActions.startConnection(sensorPid)
                    .then(() => BLEActions.getSingleSensorStatus(sensorPid));
            })
            .catch(() => {
                // cannot connect to sensor
                return this.props.deleteUserSensorData(sensorPid)
                    .catch(() => Promise.reject('Failed to UNPAIR from sensor'))
                    .then(() => BLEActions.startDisconnection(sensorPid))
                    .catch(() => BLEActions.startDisconnection(sensorPid))
                    .then(() => Promise.resolve('Successfully UNPAIRED from sensor'))
                    .catch(() => Promise.resolve('Successfully UNPAIRED from sensor'));
            })
            .then(res => {
                // sensor available, fetch data first and then complete unpair (toast message success)
                const validFetchStates = [1, 2, 3];
                if(res.numberOfPractices > 0 && validFetchStates.includes(res.systemStatus)) {
                    return this._handlePractices(res.numberOfPractices, this.props.user.id, sensorPid)
                        .then(() => {
                            return AppUtil._retrieveAsyncStorageData(this.props.user.id);
                        })
                        .then(response => {
                            return bleUtils.finalizeBleData(response.practices, this.props.user.id);
                        })
                        .then(() => this.props.deleteUserSensorData(sensorPid))
                        .catch(() => Promise.reject('Failed to UNPAIR from sensor'))
                        .then(() => BLEActions.startDisconnection(sensorPid))
                        .catch(() => BLEActions.startDisconnection(sensorPid))
                        .then(() => Promise.resolve('Successfully UNPAIRED from sensor'))
                        .catch(err => Promise.resolve('Successfully UNPAIRED from sensor'));
                }
                return this.props.deleteUserSensorData(sensorPid)
                    .catch(() => Promise.reject('Failed to UNPAIR from sensor'))
                    .then(() => BLEActions.startDisconnection(sensorPid))
                    .catch(() => BLEActions.startDisconnection(sensorPid))
                    .then(() => Promise.resolve('Successfully UNPAIRED from sensor'))
                    .catch(() => Promise.resolve('Successfully UNPAIRED from sensor'));
            })
            .catch(err => Promise.reject('Failed to UNPAIR from sensor'));
    }

    /*eslint consistent-return: 0*/
    _handlePractices = async (numberOfPractices, userId, sensorPid) => {
        let shouldExit = false;
        let errMsg = '';
        for (let i = 0; i < numberOfPractices; i += 1) {
            if(shouldExit) {
                return Promise.reject(errMsg);
            }
            await bleUtils.processPractices(sensorPid, userId)
                /*eslint no-loop-func: 0*/
                /*eslint-env es6*/
                .catch(err => {
                    this.refs.toast.show(err, (DURATION.LENGTH_SHORT * 2));
                    shouldExit = true;
                    errMsg = err;
                });
        }
    }

    _handleLogoutAlert = (err) => {
        Alert.alert(
            'Error!',
            'Ooops! Something went wrong while trying to logout. Please try again.',
            [
                {
                    text:  'OK',
                    style: 'cancel'
                },
            ],
            { cancelable: true }
        )
    }

    render = () => {
        const userEmail = this.props.user.personal_data ? this.props.user.personal_data.email : '';
        const userObj = this.props.user ? this.props.user : false;
        const possibleSystemTypes = userObj ? UserAccount.possibleSystemTypes.map(systemTypes => systemTypes.value) : false; // ['1-sensor', '3-sensor'];
        const userHasSensorSystem = possibleSystemTypes ? possibleSystemTypes.includes(userObj.system_type) : false;
        // set animated values
        const spinValue = new Animated.Value(0);
        // First set up animation
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    duration:        3000,
                    easing:          Easing.linear,
                    toValue:         1,
                    useNativeDriver: true,
                }
            )
        ).start();
        // Second interpolate beginning and end values (in this case 0 and 1)
        const spin = spinValue.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1}}>
                { userHasSensorSystem ?
                    <ListItem
                        chevronColor={AppColors.black}
                        containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding}}
                        leftIcon={ this.state.isUnpairing ?
                            <Animated.View
                                style={{transform: [{rotate: spin}],}}
                            >
                                <TabIcon
                                    color={AppColors.black}
                                    icon={'loading'}
                                    size={24}
                                    type={'material-community'}
                                />
                            </Animated.View>
                            :
                            <TabIcon
                                color={AppColors.black}
                                icon={'bluetooth'}
                                size={24}
                            />
                        }
                        onPress={() => this.props.accessoryData.sensor_pid ? this._disconnectFromSingleSensor() : Actions.bluetoothConnect()
                        }
                        title={this.props.accessoryData.sensor_pid ? 'UNPAIR SENSOR' : 'PAIR WITH A NEW SENSOR'}
                        titleStyle={{color: AppColors.black, paddingLeft: AppSizes.paddingSml,}}
                    />
                    :
                    null
                }
                <ListItem
                    chevronColor={AppColors.black}
                    containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding}}
                    leftIcon={
                        <TabIcon
                            color={AppColors.black}
                            icon={'power-settings-new'}
                            size={24}
                        />
                    }
                    onPress={() =>
                        this.props.logout(this.props.user.id)
                            .then(() => {Actions.start(); this.props.clearMyPlanData();})
                            .catch(err => this._handleLogoutAlert(err))
                    }
                    title={'LOGOUT'}
                    titleStyle={{color: AppColors.black, paddingLeft: AppSizes.paddingSml,}}
                />
                {
                    /hello[+]demo[1-5]@fathomai.com/g.test(userEmail) ||
                    /amina[+]mvp@fathomai.com/g.test(userEmail) ||
                    /chrisp[+]mvp@fathomai.com/g.test(userEmail) ||
                    /chrisp[+]droidtest@fathomai.com/g.test(userEmail) ||
                    /dipesh[+]mvp@fathomai.com/g.test(userEmail) ||
                    /gabby[+]mvp@fathomai.com/g.test(userEmail) ||
                    /ivonna[+]mvp@fathomai.com/g.test(userEmail) ||
                    /maria[+]mvp@fathomai.com/g.test(userEmail) ||
                    /mazen[+]mvp@fathomai.com/g.test(userEmail) ||
                    /melissa[+]mvp@fathomai.com/g.test(userEmail) ||
                    /paul[+]mvp@fathomai.com/g.test(userEmail) ||
                    /dipesh@fathomai.com/g.test(userEmail) ||
                    /mazen@fathomai.com/g.test(userEmail) ?
                        <ListItem
                            chevronColor={AppColors.black}
                            containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding}}
                            leftIcon={
                                <TabIcon
                                    color={AppColors.black}
                                    icon={'lock-reset'}
                                    size={24}
                                    type={'material-community'}
                                />
                            }
                            onPress={() => this._resetAccountData()}
                            title={'RESET ACCOUNT DATA'}
                            titleStyle={{color: AppColors.black, paddingLeft: AppSizes.paddingSml,}}
                        />
                        :
                        null
                }
                <Toast
                    position={'bottom'}
                    ref={'toast'}
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Settings;
