/**
 * Onboarding Screen
 *  - Steps through the multiple steps
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Alert, BackHandler, Platform, ScrollView, StyleSheet, View, } from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import moment from 'moment';

// Consts, Libs, and Utils
import { AppAPI, AppUtil, } from '../../lib';
import { AppColors, AppStyles, AppSizes, } from '../../constants';
import { onboardingUtils, } from '../../constants/utils';

// Components
import { ProgressBar, } from '../custom/';
import { EnableAppleHealthKit, Loading, PrivacyPolicyModal, } from '../general';
import { UserAccount, } from './pages/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.white,
        flex:            1,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
    carouselBanner: {
        height:            AppSizes.navbarHeight,
        paddingTop:        20,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    carouselCustomStyles: {
        alignItems:     'center',
        justifyContent: 'center',
    },
    carouselTick: {
        borderLeftColor: AppColors.border,
        borderLeftWidth: 1,
        width:           '20%',
    },
    errorWrapper: {
        paddingHorizontal: 10,
        paddingVertical:   10,
    }
});

/* Component ==================================================================== */
class Onboarding extends Component {
    static componentName = 'Onboarding';

    static propTypes = {
        accountCode:    PropTypes.string.isRequired,
        accountRole:    PropTypes.string.isRequired,
        authorizeUser:  PropTypes.func.isRequired,
        createUser:     PropTypes.func.isRequired,
        finalizeLogin:  PropTypes.func.isRequired,
        getMyPlan:      PropTypes.func.isRequired,
        lastOpened:     PropTypes.object.isRequired,
        network:        PropTypes.object.isRequired,
        onFormSubmit:   PropTypes.func.isRequired,
        registerDevice: PropTypes.func.isRequired,
        setAccountCode: PropTypes.func.isRequired,
        setAppLogs:     PropTypes.func.isRequired,
        updateUser:     PropTypes.func.isRequired,
        user:           PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);

        const sportArray = {
            competition_level:  '',
            end_date:           '', // 'MM/DD/YYYY' or 'current'
            name:               '',
            positions:          [],
            season_end_month:   '',
            season_start_month: '',
            start_date:         '',
        };
        const user = _.cloneDeep(this.props.user);
        this.state = {
            form_fields: {
                user: {
                    // agreed_terms_of_use:   false, // boolean
                    // agreed_privacy_policy: false, // boolean
                    account_code:   this.props.accountCode,
                    biometric_data: {
                        height: {
                            in: user.biometric_data && user.biometric_data.height.ft_in ?
                                ((user.biometric_data.height.ft_in[0] * 12) + user.biometric_data.height.ft_in[1]).toString()
                                : user.biometric_data && user.biometric_data.height.m ?
                                    onboardingUtils.metersToInches(user.biometric_data.height.m).toString()
                                    :
                                    0
                        },
                        mass: {
                            lb: user.biometric_data && user.biometric_data.mass.lb ?
                                user.biometric_data.mass.lb.toString()
                                : user.biometric_data && user.biometric_data.mass.kg ?
                                    onboardingUtils.kgsToLbs(user.biometric_data.mass.kg).toString()
                                    :
                                    ''
                        },
                        sex: user.biometric_data && user.biometric_data.sex ? user.biometric_data.sex : '',
                    },
                    cleared_to_play:       false, // boolean
                    confirm_password:      '',
                    first_time_experience: user.first_time_experience ? user.first_time_experience : [],
                    health_enabled:        user.health_enabled ? user.health_enabled : false,
                    injuries:              {}, // COMING SOON
                    injury_status:         user.injury_status ? user.injury_status : '',
                    onboarding_status:     user.onboarding_status ? user.onboarding_status : [], // 'account_setup', 'sport_schedule', 'activities', 'injuries', 'cleared_to_play', 'pair_device', 'completed'
                    password:              '',
                    personal_data:         {
                        account_status: 'active', // 'active', 'pending', 'past_due', 'expired'
                        account_type:   'free', // 'paid', 'free'
                        birth_date:     user.personal_data && user.personal_data.birth_date ? moment(user.personal_data.birth_date, 'MM/DD/YYYY').format('MM/DD/YYYY') : '',
                        email:          user.personal_data && user.personal_data.email ? user.personal_data.email : '',
                        first_name:     user.personal_data && user.personal_data.first_name ? user.personal_data.first_name : '',
                        last_name:      user.personal_data && user.personal_data.last_name ? user.personal_data.last_name : '',
                        phone_number:   user.personal_data && user.personal_data.phone_number ? user.personal_data.phone_number : '',
                        zip_code:       user.personal_data && user.personal_data.zip_code ? user.personal_data.zip_code : '',
                    },
                    role:                           this.props.accountRole,
                    sports:                         [sportArray],
                    // system_type:                    '1-sensor', // '1-sensor', '3-sensor'
                    training_groups:                [], // COMING SOON
                    training_schedule:              {},
                    training_strength_conditioning: {
                        activities:     [],
                        days:           [],
                        durations:      '',
                        totalDurations: '',
                    },
                    workout_outside_practice: null,
                }
            },
            isFormValid:          false,
            isHealthKitModalOpen: !this.props.user.id && Platform.OS === 'ios' && this.props.accountRole === 'athlete',
            isPrivacyPolicyOpen:  false,
            isTermsOpen:          false,
            modalStyle:           {},
            resultMsg:            {
                error:   [],
                status:  '',
                success: '',
            },
            step:       2, // TODO: UPDATE THIS VALUE BACK TO '1'
            totalSteps: 1,
            loading:    false,
        };
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        // for current users
        if(this.props.user) {
            let errorsArray = this._validateForm();
            this.setState({
                isFormValid: errorsArray.length === 0 ? true : false,
            });
            if(this.props.user.health_enabled) {
                this._updateStateFromHealthKit();
            }
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

    _toggleTermsWebView = () => {
        this.setState({ isTermsOpen: !this.state.isTermsOpen, });
    }

    _togglePrivacyPolicyWebView = () => {
        this.setState({ isPrivacyPolicyOpen: !this.state.isPrivacyPolicyOpen, });
    }

    _handleUserFormChange = (name, value) => {
        /**
          * This let's us change arbitrarily nested objects with one pass
          */
        let newFormFields = _.update( this.state.form_fields.user, name, () => value);
        let newResultMsgFields = _.update( this.state.resultMsg, 'error', () => []);
        newResultMsgFields = _.update( this.state.resultMsg, 'status', () => '');
        newResultMsgFields = _.update( this.state.resultMsg, 'success', () => '');
        let errorsArray = this._validateForm();
        this.setState({
            form_fields: { user: newFormFields, },
            isFormValid: errorsArray.length === 0 ? true : false,
            resultMsg:   newResultMsgFields,
        });
        if(name === 'role') {
            this._nextStep();
        }
    }

    _validateForm = () => {
        let isUpdatingUser = this.props.user.id ? true : false
        const { form_fields, step, } = this.state;
        let errorsArray = [];
        if(step === 2) { // enter user information
            errorsArray = _.concat(onboardingUtils.isUserAccountInformationValid(form_fields.user, isUpdatingUser).errorsArray, onboardingUtils.isUserAboutValid(form_fields.user).errorsArray);
        }
        return errorsArray;
    }

    _previousStep = () => {
        const { form_fields, step } = this.state;
        // validation
        let errorsArray = this._validateForm();
        if(step === 1) {
            Actions.start();
        } else {
            let newStep = step - 1;
            if (
                newStep === 4
                && !form_fields.user.workout_outside_practice
            ) {
                if(
                    form_fields.user.injury_status === 'healthy'
                ) { // if user is health and they don't workout outside of practice
                    newStep = step + 3;
                } else { // if the user doesn't workout outside of practice
                    newStep = step + 2;
                }
            }
            this.setState({
                isFormValid: errorsArray.length === 0 ? true : false,
                step:        newStep,
            });
        }
    }

    _nextStep = () => {
        // validation
        let errorsArray = this._validateForm();
        this.setState({
            ['resultMsg.error']: errorsArray,
        });
    }

    _notClearedBtnPressed = () => {
        Alert.alert(
            'Warning!',
            'You will be using this app at your own risk!',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Continue', onPress: this._nextStep},
            ],
            { cancelable: true }
        )
    }

    _handleFormSubmit = () => {
        let newUser = _.cloneDeep(this.state.form_fields.user);
        // validation
        let errorsArray = this._validateForm();
        this.setState({
            ['resultMsg.error']: errorsArray,
        });

        if(newUser.injury_status === 'returning_from_injury' || newUser.injury_status === 'returning_from_acute_injury') {
            Alert.alert(
                '',
                'You must be cleared for running by a doctor before using the Fathom system',
                [
                    {text: 'Cleared', onPress: () => this._handlePasswordSpacesCheck(newUser, true, errorsArray)},
                    {text: 'Not Cleared', onPress: () => this._handlePasswordSpacesCheck(newUser, false, errorsArray)},
                ],
            );
        } else {
            this._handlePasswordSpacesCheck(newUser, false, errorsArray);
        }
    }

    _handlePasswordSpacesCheck = (newUser, clearedToPlay, errorsArray) => {
        const passwordHasWhiteSpaces = onboardingUtils.hasWhiteSpaces(newUser.password);
        if(passwordHasWhiteSpaces) {
            Alert.alert(
                '',
                'Your Password has a whitespace, is this intended?',
                [
                    {text: 'Yes, Continue', onPress: () => this._handleOnboardingFieldSetup(newUser, clearedToPlay, errorsArray)},
                    {text: 'No, Let me fix it', style: 'cancel'},
                ],
                { cancelable: true }
            );
        } else {
            this._handleOnboardingFieldSetup(newUser, clearedToPlay, errorsArray);
        }
    }

    _handleOnboardingFieldSetup = (newUser, clearedToPlay, errorsArray) => {
        // reset error and set loading state
        this.setState({
            loading:   true,
            resultMsg: { error: '' },
        });
        // only submit required fields
        let userObj = {};
        if(!this.props.user.id) {
            userObj.password = newUser.password;
        }
        userObj.role = newUser.role;
        if(newUser.system_type) {
            userObj.system_type = newUser.system_type;
        }
        // userObj.injury_status = newUser.injury_status;
        // userObj.cleared_to_play = clearedToPlay;
        if(!newUser.onboarding_status.includes('account_setup')) {
            userObj.onboarding_status = ['account_setup'];
        }
        userObj.biometric_data = {};
        if(newUser.biometric_data.height.in > 0) {
            userObj.biometric_data.height = {};
            userObj.biometric_data.height.m = +(onboardingUtils.inchesToMeters(parseFloat(newUser.biometric_data.height.in))) + 0.1;
            userObj.biometric_data.height.ft_in = [Math.floor(newUser.biometric_data.height.in / 12), newUser.biometric_data.height.in % 12];
        }
        userObj.biometric_data.mass = {};
        userObj.biometric_data.mass.kg = +(onboardingUtils.lbsToKgs(parseFloat(newUser.biometric_data.mass.lb))) + 0.1;
        userObj.biometric_data.mass.lb = +(parseFloat(newUser.biometric_data.mass.lb).toFixed(2)) + 0.1;
        userObj.biometric_data.sex = newUser.biometric_data.sex;
        userObj.personal_data = {};
        if(!this.props.user.id) {
            userObj.personal_data.email = _.toLower(newUser.personal_data.email);
        }
        userObj.personal_data.birth_date = newUser.personal_data.birth_date;
        userObj.personal_data.first_name = _.trim(newUser.personal_data.first_name);
        userObj.personal_data.last_name = _.trim(newUser.personal_data.last_name);
        // userObj.personal_data.phone_number = newUser.personal_data.phone_number;
        userObj.personal_data.account_type = newUser.personal_data.account_type;
        userObj.personal_data.account_status = newUser.personal_data.account_status;
        // userObj.personal_data.zip_code = newUser.personal_data.zip_code;
        if(newUser.account_code && newUser.account_code.length > 0) {
            userObj.account_code = newUser.account_code.toUpperCase();
        }
        userObj.health_enabled = newUser.health_enabled;
        if(newUser.first_time_experience.length > 0) {
            userObj.first_time_experience = newUser.first_time_experience;
        }
        // clear account code reducer
        this.props.setAccountCode('');
        // create or update, if no errors
        if(errorsArray.length === 0) {
            if(this.props.user.id) {
                return this.props.updateUser(userObj, this.props.user.id)
                    .then(response => {
                        this.setState({ loading: false });
                        return AppUtil.routeOnLogin(response.user, true);
                    })
                    .catch(err => {
                        const error = AppAPI.handleError(err);
                        return this.setState({ resultMsg: { error }, loading: false });
                    });
            }
            return this.props.createUser(userObj)
                .then(response => this._handleLoginFinalize(userObj))
                .catch(err => {
                    const error = AppAPI.handleError(err);
                    return this.setState({ resultMsg: { error }, loading: false });
                });
        }
        return this.setState({ resultMsg: { error: 'Unexpected error occurred, please try again!' }, loading: false });
    }

    _handleLoginFinalize = (userObj) => {
        let credentials = {
            Email:    userObj.personal_data.email,
            Password: userObj.password,
        };
        return this.props.onFormSubmit({
            email:    userObj.personal_data.email,
            password: userObj.password,
        }, false)
            .then(response => {
                let { authorization, user } = response;
                return this.props.registerDevice(this.props.certificate, this.props.device, user)
                    .then(() => {
                        let clearMyPlan = (
                            this.props.lastOpened.userId !== user.id ||
                            moment(this.props.lastOpened.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
                        ) ?
                            true
                            :
                            false;
                        return this.props.getMyPlan(user.id, moment().format('YYYY-MM-DD'), false, clearMyPlan)
                            .then(res => {
                                this.props.setAppLogs();
                                if(user.health_enabled) {
                                    return AppUtil.getAppleHealthKitDataPrevious(user.id, user.health_sync_date, user.historic_health_sync_date)
                                        .then(() => AppUtil.getAppleHealthKitData(user.id, user.health_sync_date, user.historic_health_sync_date));
                                }
                                return res;
                            })
                            .catch(error => {
                                const err = AppAPI.handleError(error);
                                return this.setState({ loading: false, resultMsg: { err }, });
                            });
                    })
                    .then(() => this.props.finalizeLogin(user, credentials, authorization));
            })
            .then(userRes => this.setState({
                resultMsg: { success: 'Success, now loading your data!' },
            }, () => {
                this.setState({ loading: false, });
                return AppUtil.routeOnLogin(userRes, true);
            })).catch((err) => {
                console.log('err',err);
                const error = AppAPI.handleError(err);
                return this.setState({ loading: false, resultMsg: { error }, });
            });
    }

    _handleEnableAppleHealthKit = (firstTimeExperienceValue, healthKitFlag) => {
        this.setState(
            { isHealthKitModalOpen: false, },
            () => {
                this._handleUserFormChange('health_enabled', healthKitFlag);
                this._handleUserFormChange('first_time_experience', [firstTimeExperienceValue]);
                if(healthKitFlag) {
                    this._updateStateFromHealthKit();
                }
            },
        );
    }

    _updateStateFromHealthKit = () => {
        let personalDataPromises = AppUtil.getAppleHealthKitPersonalData();
        // [0] = height, [1] = weight, [2] = dob, [3] = sex
        Promise
            .all(_.map(personalDataPromises, (values, i) => {
                values
                    .then(value => {
                        let newUser = _.cloneDeep(this.state.form_fields.user);
                        if(i === 0 && value.value && value.value > 0) {
                            newUser.biometric_data.height.in = value.value.toString();
                        }
                        if(i === 1 && value.value && value.value > 0) {
                            newUser.biometric_data.mass.lb = _.round(value.value).toString();
                        }
                        if(i === 2 && value.value && value.value.length > 0 && value.age && value.age > 0) {
                            newUser.personal_data.birth_date = moment(value.value).format('MM/DD/YYYY');
                        }
                        if(
                            i === 3 &&
                            value.value &&
                            value.value.length > 0 &&
                            (value.value === 'male' || value.value === 'female' || value.value === 'other')
                        ) {
                            newUser.biometric_data.sex = value.value;
                        }
                        this.setState({ form_fields: { user: newUser, } });
                    })
                    .catch(err => console.log(i,err));
            }));
    }

    render = () => {
        const {
            form_fields,
            isFormValid,
            isHealthKitModalOpen,
            isPrivacyPolicyOpen,
            isTermsOpen,
            resultMsg,
            step,
            totalSteps,
        } = this.state;
        return (
            <View style={[styles.background]}>
                <ProgressBar
                    currentStep={onboardingUtils.getCurrentStep(form_fields.user)}
                    totalSteps={onboardingUtils.getTotalSteps(form_fields.user)}
                />
                <ScrollView contentContainerStyle={{flex: 1,}}>
                    <UserAccount
                        componentStep={2}
                        currentStep={step}
                        error={resultMsg.error}
                        handleFormChange={this._handleUserFormChange}
                        handleFormSubmit={this._handleFormSubmit}
                        isFormValid={isFormValid}
                        isUpdatingUser={this.props.user.id ? true : false}
                        togglePrivacyPolicyWebView={this._togglePrivacyPolicyWebView}
                        user={form_fields.user}
                    />
                </ScrollView>
                { this.state.loading ?
                    <Loading />
                    :
                    null
                }
                <EnableAppleHealthKit
                    handleSkip={() => this._handleEnableAppleHealthKit('apple_healthkit', false)}
                    handleEnableAppleHealthKit={this._handleEnableAppleHealthKit}
                    isModalOpen={isHealthKitModalOpen}
                />
                <PrivacyPolicyModal
                    handleModalToggle={this._togglePrivacyPolicyWebView}
                    isPrivacyPolicyOpen={this.state.isPrivacyPolicyOpen}
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Onboarding;
