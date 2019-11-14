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
import DeviceInfo from 'react-native-device-info';
import Toast, { DURATION, } from 'react-native-easy-toast';
import moment from 'moment';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { ListItem, Spacer, TabIcon, Text, } from '../custom';
import { PrivacyPolicyModal, } from '../general';
import { AppUtil, } from '../../lib';
import { user as UserActions, } from '../../actions';
import { store, } from '../../store';

// Components
import { ChangePasswordModal, JoinATeamModal, } from './pages';

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
        accessoryData:   PropTypes.object.isRequired,
        logout:          PropTypes.func.isRequired,
        network:         PropTypes.object.isRequired,
        updateUser:      PropTypes.func.isRequired,
        userJoinAccount: PropTypes.func.isRequired,
        user:            PropTypes.object.isRequired,
        changePassword:  PropTypes.func.isRequired
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            isChangePasswordFormSubmitting: false,
            isChangePasswordModalOpen:      false,
            isChangePasswordSuccessful:     false,
            isJoinATeamFormSubmitting:      false,
            isJoinATeamModalOpen:           false,
            isLogoutBtnDisabled:            false,
            isPrivacyPolicyOpen:            false,
            isUnpairing:                    false,
            resultMsg:                      {
                error:   '',
                status:  '',
                success: '',
            },
            form_values: {
                code:               '',
                currentPassword:    '',
                newPassword:        '',
                newPasswordConfirm: '',
            },
            teamName: false,
        };
        this.defaultState = {
            isChangePasswordFormSubmitting: false,
            isChangePasswordModalOpen:      false,
            isChangePasswordSuccessful:     false,
            isJoinATeamFormSubmitting:      false,
            isJoinATeamModalOpen:           false,
            isUnpairing:                    false,
            resultMsg:                      {
                error:   '',
                status:  '',
                success: '',
            },
            form_values: {
                code:               '',
                currentPassword:    '',
                newPasswordConfirm: '',
                newPassword:        '',
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

    _resetAccountData = () => {
        Alert.alert(
            'Warning!',
            'Are you sure you want to reset this account?',
            [
                {
                    text:    'Yes',
                    onPress: () => {
                        return UserActions.clearUserData(this.props.user.id)
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

    _toggleChangePasswordModal = () => {
        let newState = _.cloneDeep(this.defaultState);
        newState.isChangePasswordModalOpen = !this.state.isChangePasswordModalOpen;
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

    _hasNumber = (myString) => {
        return /\d/.test(myString);
    }

    _validateNewPassword = (currentPassword, newPassword, newPasswordConfirm) => {
        if (currentPassword === newPassword) {
            this._handleUpdateResultMsg('error', 'New Password must be different from current password. Please try again.');
            return false;
        }
        if (newPassword.length < 8 || currentPassword.length < 8) {
            this._handleUpdateResultMsg('error', 'New Password must be 8 characters or longer. Please try again.');
            return false;
        }
        if (!this._hasNumber(newPassword)) {
            this._handleUpdateResultMsg('error', 'New Password must contain a number. Please try again.');
            return false;
        }
        if (newPassword !== newPasswordConfirm) {
            this._handleUpdateResultMsg('error', 'New Password fields do not match. Please try again.');
            return false;
        }
        return true;
    }

    _handleChangePasswordFormSubmit = () => {
        let { currentPassword, newPassword, newPasswordConfirm } = this.state.form_values;
        if (!this._validateNewPassword(currentPassword, newPassword, newPasswordConfirm)) {
            return;
        }
        this.setState(
            { isChangePasswordFormSubmitting: true, },
            () => {
                this.props.changePassword(this.props.user.id, {
                    newPassword:  newPassword,
                    oldPassword:  currentPassword,
                    sessionToken: this.props.sessionToken,
                }).then(res => {
                    this.setState({
                        isChangePasswordFormSubmitting: false,
                        isChangePasswordSuccessful:     true,
                    });
                }).catch(err => {
                    this._handleUpdateResultMsg(
                        'error',
                        err.status && err.status === 'NotAuthorizedException' ?
                            'The current password is incorrect. Please try again.' // incorrect password
                            : err.status && err.status === 'LimitExceededException' ?
                                'You’ve exceeded the password reset limit. Please try again later.' // exceeded attempts
                                :
                                'Error changing password. Please try again.'
                    );
                    this.setState({
                        isChangePasswordFormSubmitting: false,
                        isChangePasswordSuccessful:     false,
                    });
                });
            },
        );
    }

    render = () => {
        const userEmail = this.props.user.personal_data ? this.props.user.personal_data.email : '';
        const userObj = this.props.user ? this.props.user : false;
        const has3SensorConnected = userObj && userObj.sensor_data && userObj.sensor_data.mobile_udid && userObj.sensor_data.sensor_pid;
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1}}>
                <SettingsNavBar />
                {/* // NOTE: IF THIS PIECE COMES BACK, MAKE PAGE A SCROLLVIEW
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
                    title={'Join a team'}
                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                />
                <Spacer isDivider />*/}
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
                    /evan[+]mvp@fathomai.com/g.test(userEmail) ||
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
                                title={'Reset account data'}
                                titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
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
                            title={'Apple Health'}
                            titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                        />
                        <Spacer isDivider />
                    </View>
                }
                <View>
                    <ListItem
                        containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding,}}
                        leftIcon={
                            <View style={{alignItems: 'center', height: ICON_SIZE, justifyContent: 'center', width: ICON_SIZE,}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/standard/kitactive.png')}
                                    style={{height: 15, shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, tintColor: AppColors.zeplin.splash, width: 35,}}
                                />
                            </View>
                        }
                        onPress={has3SensorConnected ? () => Actions.sensorFiles() : () => Actions.bluetoothConnect()}
                        rightIcon={{
                            color: AppColors.zeplin.slate,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={has3SensorConnected ? 'Manage Fathom PRO' : 'Connect Fathom PRO'}
                        titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                    />
                    <Spacer isDivider />
                </View>
                <ListItem
                    containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding}}
                    leftIcon={{
                        color:     AppColors.zeplin.splash,
                        iconStyle: { shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                        name:      'textbox-password',
                        size:      ICON_SIZE,
                        type:      'material-community',
                    }}
                    onPress={() => this._toggleChangePasswordModal()}
                    rightIcon={{
                        color: AppColors.zeplin.slate,
                        name:  'chevron-right',
                        size:  ICON_SIZE,
                    }}
                    title={'Change Password'}
                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                />
                <Spacer isDivider />
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
                    title={'Terms & Privacy'}
                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
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
                    title={'Logout'}
                    titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                />
                <Spacer isDivider />
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>
                        {`Version ${Platform.OS === 'ios' ? DeviceInfo.getBuildNumber() : DeviceInfo.getVersion()}`}
                    </Text>
                    <Spacer size={AppSizes.padding} />
                </View>
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
                <ChangePasswordModal
                    currentPassword={this.state.form_values.currentPassword}
                    handleFormChange={this._handleFormChange}
                    handleFormSubmit={() => this._handleChangePasswordFormSubmit()}
                    handleToggleModal={() => this._toggleChangePasswordModal()}
                    isFormSubmitting={this.state.isChangePasswordFormSubmitting}
                    isFormSuccessful={this.state.isChangePasswordSuccessful}
                    isOpen={this.state.isChangePasswordModalOpen}
                    newPassword={this.state.form_values.newPassword}
                    newPasswordConfirm={this.state.form_values.newPasswordConfirm}
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
