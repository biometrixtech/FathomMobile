/**
 * Settings View
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Animated, Alert, BackHandler, Easing, Image, Platform, StatusBar, Switch, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import AppleHealthKit from 'rn-apple-healthkit';
import Toast, { DURATION, } from 'react-native-easy-toast';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, UserAccount, } from '../../constants';
import { bleUtils, } from '../../constants/utils';
import { ListItem, Spacer, TabIcon, Text, } from '../custom';
import { PrivacyPolicyModal, } from '../general';
import { AppUtil, } from '../../lib';
import { ble as BLEActions, user as UserActions, } from '../../actions';
import { store, } from '../../store';

// Components
import { JoinATeamModal, } from './pages';

const ICON_SIZE = 24;

/* Component ==================================================================== */
const SettingsNavBar = () => (
    <View>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={{backgroundColor: AppColors.white, borderBottomColor: AppColors.zeplin.slateXLight, borderBottomWidth: 1, flexDirection: 'row', height: AppSizes.navbarHeight, marginTop: AppSizes.statusBarHeight,}}>
            <View style={{flex: 1, justifyContent: 'center',}} />
            <View style={{flex: 8, justifyContent: 'center',}}>
                <Text oswaldMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(20), textAlign: 'center',}}>{'SETTINGS'}</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center',}} />
        </View>
    </View>
);

class Settings extends Component {
    static componentName = 'SettingsView';
    static propTypes = {
        accessoryData:                  PropTypes.object.isRequired,
        deleteUserSensorData:           PropTypes.func.isRequired,
        deleteAllSingleSensorPractices: PropTypes.func.isRequired,
        logout:                         PropTypes.func.isRequired,
        network:                        PropTypes.object.isRequired,
        user:                           PropTypes.object.isRequired,
        updateUser:                     PropTypes.func.isRequired,
        userJoinAccount:                PropTypes.func.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            isJoinATeamFormSubmitting: false,
            isJoinATeamModalOpen:      false,
            isLogoutBtnDisabled:       false,
            isPrivacyPolicyOpen:       false,
            isUnpairing:               false,
            resultMsg:                 {
                error:   '',
                status:  '',
                success: '',
            },
            form_values: {
                code: '',
            },
            teamName: false,
        };
        this.defaultState = {
            isJoinATeamFormSubmitting: false,
            isJoinATeamModalOpen:      false,
            isUnpairing:               false,
            resultMsg:                 {
                error:   '',
                status:  '',
                success: '',
            },
            form_values: {
                code: '',
            },
            teamName: false,
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

    _toggleHealthKitSwitch = value => {
        if(value) {
            AppUtil.initAppleHealthKit();
            // setup variables
            let newUserPayloadObj = {};
            newUserPayloadObj.health_enabled = true;
            let newUserObj = _.cloneDeep(this.props.user);
            newUserObj.health_enabled = true;
            // update reducer as API might take too long to return a value
            store.dispatch({
                type: DispatchActions.USER_REPLACE,
                data: newUserObj
            });
            // update user object
            this.props.updateUser(newUserPayloadObj, this.props.user.id);
        } else {
            Alert.alert(
                'Apple Health',
                'You can manage Apple Health settings in the Health app under the Sources tab.',
                [
                    {
                        text:  'OK',
                        style: 'cancel',
                    },
                ],
                { cancelable: true, }
            );
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
                { cancelable: true, }
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
                { cancelable: true, }
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
                            .then(res => this.refs.toast.show('Your account has been reset!', (DURATION.LENGTH_SHORT * 2)))
                            .catch(err => this._alertResetError(err));
                    }
                },
                {
                    text:  'No',
                    style: 'cancel'
                },
            ],
            { cancelable: true, }
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
            { cancelable: true, }
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

    _handleLogoutAlert = err => {
        Alert.alert(
            'Error!',
            'Ooops! Something went wrong while trying to logout. Please try again.',
            [
                {
                    text:  'OK',
                    style: 'cancel'
                },
            ],
            { cancelable: true, }
        )
    }

    _toggleJoinATeamModal = () => {
        let newState = _.cloneDeep(this.defaultState);
        newState.isJoinATeamModalOpen = !this.state.isJoinATeamModalOpen;
        this.setState(newState);
    }

    _handleFormChange = (name, value) => {
        let newFormFields = _.update( this.state.form_values, name, () => value);
        this.setState({
            ['form_values']: newFormFields,
        });
    }

    _handleUpdateResultMsg = (name, value) => {
        let newFormFields = _.update( this.state.resultMsg, name, () => value);
        this.setState({
            ['resultMsg']: newFormFields,
        });
    }

    _handleFormSubmit = () => {
        let code = this.state.form_values.code;
        if(code.length > 0) {
            this.setState(
                { isJoinATeamFormSubmitting: true, },
                () => {
                    this.props.userJoinAccount(this.props.user.id, { account_code: code, })
                        .then(res => {
                            this.setState({ isJoinATeamFormSubmitting: false, teamName: res.account.name, });
                        })
                        .catch(err => {
                            this.setState({ isJoinATeamFormSubmitting: false, });
                            this._handleUpdateResultMsg('error', 'invalid code, please try again');
                        });
                }
            );
        } else {
            this._handleUpdateResultMsg('error', 'please enter a valid code');
        }
    }

    render = () => {
        const userEmail = this.props.user.personal_data ? this.props.user.personal_data.email : '';
        const userObj = this.props.user ? this.props.user : false;
        const userHasSingleSensorSystem = userObj && userObj.system_type && userObj.system_type === '1-sensor';
        const userHas3SensorSystem = userObj && userObj.sensor_data && userObj.sensor_data.system_type && userObj.sensor_data.system_type === '3-sensor';
        const has3SensorConnected = userObj && userObj.sensor_data && userObj.sensor_data.mobile_udid && userObj.sensor_data.sensor_pid;
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
                <SettingsNavBar />
                <ListItem
                    containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding}}
                    leftIcon={{
                        color:     AppColors.zeplin.splash,
                        iconStyle: { shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                        name:      'account-group',
                        size:      ICON_SIZE,
                        type:      'material-community',
                    }}
                    onPress={() => this._toggleJoinATeamModal()}
                    rightIcon={{
                        color: AppColors.zeplin.slate,
                        name:  'chevron-right',
                        size:  ICON_SIZE,
                    }}
                    title={'JOIN A TEAM'}
                    titleStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                />
                <Spacer isDivider />
                {
                    /hello[+]demo[1-5]@fathomai.com/g.test(userEmail) ||
                    /amina[+]mvp@fathomai.com/g.test(userEmail) ||
                    /chrisp[+]mvp@fathomai.com/g.test(userEmail) ||
                    /chrisp[+]droidtest@fathomai.com/g.test(userEmail) ||
                    /chrisp[+]test3@fathomai.com/g.test(userEmail) ||
                    /dipesh[+]mvp@fathomai.com/g.test(userEmail) ||
                    /gabby[+]mvp@fathomai.com/g.test(userEmail) ||
                    /ivonna[+]mvp@fathomai.com/g.test(userEmail) ||
                    /maria[+]mvp@fathomai.com/g.test(userEmail) ||
                    /mazen[+]mvp@fathomai.com/g.test(userEmail) ||
                    /melissa[+]mvp@fathomai.com/g.test(userEmail) ||
                    /paul[+]mvp@fathomai.com/g.test(userEmail) ||
                    /dipesh@fathomai.com/g.test(userEmail) ||
                    /mazen@fathomai.com/g.test(userEmail) ?
                        <View>
                            <ListItem
                                containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding,}}
                                leftIcon={{
                                    color:     AppColors.zeplin.splash,
                                    iconStyle: { shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                                    name:      'lock-reset',
                                    size:      ICON_SIZE,
                                    type:      'material-community',
                                }}
                                onPress={() => this._resetAccountData()}
                                rightIcon={{
                                    color: AppColors.zeplin.slate,
                                    name:  'chevron-right',
                                    size:  ICON_SIZE,
                                }}
                                title={'RESET ACCOUNT DATA'}
                                titleStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                            />
                            <Spacer isDivider />
                        </View>
                        :
                        null
                }
                { Platform.OS === 'ios' && userObj.role !== 'coach' &&
                    <View>
                        <ListItem
                            containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding,}}
                            leftIcon={{
                                color:     AppColors.zeplin.splash,
                                iconStyle: { shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                                name:      'heart',
                                size:      ICON_SIZE,
                                type:      'material-community',
                            }}
                            rightIcon={
                                <Switch
                                    ios_backgroundColor={AppColors.zeplin.slateLight}
                                    onValueChange={value => this._toggleHealthKitSwitch(value)}
                                    trackColor={{false: AppColors.zeplin.slateLight, true: AppColors.zeplin.success,}}
                                    value={this.props.user.health_enabled}
                                />
                            }
                            title={'APPLE HEALTH'}
                            titleStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                        />
                        <Spacer isDivider />
                    </View>
                }
                { userHas3SensorSystem &&
                    <View>
                        <ListItem
                            containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding,}}
                            leftIcon={
                                <View style={{alignItems: 'center', height: ICON_SIZE, justifyContent: 'center', width: ICON_SIZE,}}>
                                    <Image
                                        resizeMode={'contain'}
                                        source={require('../../../assets/images/sensor/sensor_slate.png')}
                                        style={{height: 20, shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, tintColor: AppColors.zeplin.splash, width: 20,}}
                                    />
                                </View>
                            }
                            onPress={has3SensorConnected ? () => Actions.sensorFiles() : () => Actions.bluetoothConnect()}
                            rightIcon={{
                                color: AppColors.zeplin.slate,
                                name:  'chevron-right',
                                size:  ICON_SIZE,
                            }}
                            title={has3SensorConnected ? 'MANAGE FATHOM PRO KIT' : 'SET UP FATHOM PRO KIT'}
                            titleStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                        />
                        <Spacer isDivider />
                    </View>
                }
                <ListItem
                    containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding,}}
                    leftIcon={{
                        color:     AppColors.zeplin.splash,
                        iconStyle: { shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                        name:      'gavel',
                        size:      ICON_SIZE,
                    }}
                    onPress={() => this.setState({ isPrivacyPolicyOpen: !this.state.isPrivacyPolicyOpen, })}
                    rightIcon={{
                        color: AppColors.zeplin.slate,
                        name:  'chevron-right',
                        size:  ICON_SIZE,
                    }}
                    title={'TERMS & PRIVACY'}
                    titleStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                />
                <Spacer isDivider />
                <ListItem
                    containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding,}}
                    disabled={this.state.isLogoutBtnDisabled}
                    leftIcon={{
                        color:     AppColors.zeplin.splash,
                        iconStyle: { shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                        name:      'power-settings-new',
                        size:      ICON_SIZE,
                    }}
                    onPress={() =>
                        this.setState(
                            { isLogoutBtnDisabled: true, },
                            () => this.props.logout(this.props.user.id)
                                .then(() => {
                                    this.setState({ isLogoutBtnDisabled: false, });
                                    Actions.reset('key1');
                                })
                                .catch(err => {
                                    this.setState({ isLogoutBtnDisabled: false, });
                                    this._handleLogoutAlert(err);
                                })
                        )
                    }
                    rightIcon={{
                        color: AppColors.zeplin.slate,
                        name:  'chevron-right',
                        size:  ICON_SIZE,
                    }}
                    title={'LOGOUT'}
                    titleStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                />
                <Spacer isDivider />
                <Toast
                    position={'bottom'}
                    ref={'toast'}
                />
                <JoinATeamModal
                    code={this.state.form_values.code}
                    handleFormChange={this._handleFormChange}
                    handleFormSubmit={() => this._handleFormSubmit()}
                    handleToggleModal={() => this._toggleJoinATeamModal()}
                    isFormSubmitting={this.state.isJoinATeamFormSubmitting}
                    isFormSuccessful={this.state.teamName && this.state.teamName.length > 0}
                    isOpen={this.state.isJoinATeamModalOpen}
                    resultMsg={this.state.resultMsg}
                />
                <PrivacyPolicyModal
                    handleModalToggle={() => this.setState({ isPrivacyPolicyOpen: !this.state.isPrivacyPolicyOpen, })}
                    isPrivacyPolicyOpen={this.state.isPrivacyPolicyOpen}
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Settings;
