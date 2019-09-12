/**
 * Onboarding Screen
 *  - Steps through the multiple steps
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    BackHandler,
    ImageBackground,
    Keyboard,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import moment from 'moment';

// Consts, Libs, and Utils
import { AppAPI, AppUtil, } from '../../lib';
import { AppColors, AppFonts, AppStyles, AppSizes, } from '../../constants';
import { onboardingUtils, } from '../../constants/utils';

// Components
import { Alerts, Button, TabIcon, ProgressBar, Text, } from '../custom/';
import { EnableAppleHealthKit, Loading, PrivacyPolicyModal, } from '../general';
import { UserAccountAbout, UserAccountInfo, } from './pages/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.white,
        flex:            1,
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
const TopNav = ({ formFields, isUpdatingUser, onBack, resultMsg, surveyValues, title, }) => (
    <View style={{marginTop: AppSizes.statusBarHeight,}}>
        <View style={{flexDirection: 'row', paddingVertical: AppSizes.paddingSml,}}>
            <View style={{flex: 1,}}>
                { !isUpdatingUser &&
                    <TabIcon
                        color={AppColors.zeplin.slate}
                        icon={'chevron-left'}
                        onPress={() => onBack()}
                        size={30}
                        type={'material-community'}
                    />
                }
            </View>
            <View style={{flex: 8,}}>
                <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{title}</Text>
            </View>
            <View style={{flex: 1,}} />
        </View>
        <ProgressBar
            currentStep={onboardingUtils.getCurrentStep(formFields.user, surveyValues, isUpdatingUser)}
            totalSteps={onboardingUtils.getTotalSteps(formFields.user)}
        />
        <Alerts
            error={(resultMsg && resultMsg.error && resultMsg.error.length > 0) ? resultMsg.error : ''}
        />
    </View>
);

class Onboarding extends Component {
    static componentName = 'Onboarding';

    static propTypes = {
        accountCode:    PropTypes.string.isRequired,
        accountRole:    PropTypes.string.isRequired,
        authorizeUser:  PropTypes.func.isRequired,
        createUser:     PropTypes.func.isRequired,
        finalizeLogin:  PropTypes.func.isRequired,
        getMyPlan:      PropTypes.func.isRequired,
        getSensorFiles: PropTypes.func.isRequired,
        lastOpened:     PropTypes.object.isRequired,
        network:        PropTypes.object.isRequired,
        onFormSubmit:   PropTypes.func.isRequired,
        postSurvey:     PropTypes.func.isRequired,
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
            isHealthKitModalOpen: !this.props.user.id && Platform.OS === 'ios' && this.props.accountRole === 'athlete',
            isKeyboardOpen:       false,
            isPage1Valid:         false,
            isPage2Valid:         false,
            isPrivacyPolicyOpen:  false,
            modalStyle:           {},
            pageIndex:            0,
            resultMsg:            {
                error:   [],
                status:  '',
                success: '',
            },
            survey_values: {
                typical_weekly_sessions: '',
                wearable_devices:        '',
            },
            loading: false,
        };
        this._pages = null;
    }

    componentDidMount = () => {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        // for current users
        if(this.props.user) {
            let errorsArray = this._validateForm();
            this.setState({ isPage1Valid: errorsArray && errorsArray.length === 0 ? true : false, });
            if(this.props.user.health_enabled) {
                this._updateStateFromHealthKit();
            }
        }
    }

    componentWillUnmount = () => {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
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

    _handleFormSubmit = () => {
        let newUser = _.cloneDeep(this.state.form_fields.user);
        // validation
        let errorsArray = this._validateForm(true);
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
        } else if(_.toNumber(newUser.biometric_data.mass.lb) < 50 || _.toNumber(newUser.biometric_data.mass.lb) > 1000) {
            let newResultMsgFields = _.update( this.state.resultMsg, 'error', () => ['Please enter a valid Weight']);
            newResultMsgFields = _.update( this.state.resultMsg, 'status', () => '');
            newResultMsgFields = _.update( this.state.resultMsg, 'success', () => '');
            this.setState({ resultMsg: newResultMsgFields, });
        } else {
            this._handlePasswordSpacesCheck(newUser, false, errorsArray);
        }
    }

    _handleLoginFinalize = (userObj, userResponse, surveyPayload) => {
        let credentials = {
            Email:    userObj.personal_data.email,
            Password: userObj.password,
        };
        return this.props.onFormSubmit({
            email:    userObj.personal_data.email,
            password: userObj.password,
        }, false)
            .then(response => {
                let { authorization, user, } = response;
                return this.props.registerDevice(this.props.certificate, this.props.device, user)
                    .then(() => {
                        let clearMyPlan = (
                            this.props.lastOpened && this.props.lastOpened.userId && this.props.lastOpened.date &&
                            user && user.id &&
                            (
                                this.props.lastOpened.userId !== user.id ||
                                moment(this.props.lastOpened.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
                            )
                        ) ?
                            true
                            :
                            false;
                        return this.props.getMyPlan(user.id, moment().format('YYYY-MM-DD'), false, clearMyPlan)
                            .then(res => {
                                this.props.setAppLogs(user.id);
                                if(user.health_enabled) {
                                    return AppUtil.getAppleHealthKitDataPrevious(user, user.health_sync_date, user.historic_health_sync_date)
                                        .then(() => AppUtil.getAppleHealthKitData(user, user.health_sync_date, user.historic_health_sync_date));
                                }
                                return res;
                            })
                            .catch(error => {
                                const err = AppAPI.handleError(error);
                                return this.setState({ loading: false, resultMsg: { err }, });
                            });
                    })
                    .then(() => this.props.postSurvey(userResponse.id, surveyPayload))
                    .then(() => this.props.finalizeLogin(user, credentials, authorization))
                    .then(() => user && user.sensor_data && user.sensor_data.mobile_udid && user.sensor_data.sensor_pid ? this.props.getSensorFiles(user) : user);
            })
            .then(userRes => this.setState({
                resultMsg: { success: 'Success, now loading your data!' },
            }, () => {
                this.setState({ loading: false, });
                return AppUtil.routeOnLogin(userRes, true);
            })).catch((err) => {
                const error = AppAPI.handleError(err);
                return this.setState({ loading: false, resultMsg: { error }, });
            });
    }

    _handleOnboardingFieldSetup = (newUser, clearedToPlay, errorsArray) => {
        // reset error and set loading state
        this.setState({
            loading:   true,
            resultMsg: { error: '', },
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
        // setup logic & make calls
        let surveyPayload = _.cloneDeep(this.state.survey_values);
        // create or update, if no errors
        if(errorsArray.length === 0) {
            if(this.props.user.id) {
                let userResponse = {};
                return this.props.updateUser(userObj, this.props.user.id)
                    .then(userData => {
                        userResponse = userData.user;
                        return this.props.postSurvey(userData.user.id, surveyPayload);
                    })
                    .then(() => {
                        this.setState({ loading: false });
                        return AppUtil.routeOnLogin(userResponse, true);
                    })
                    .catch(err => {
                        const error = AppAPI.handleError(err);
                        return this.setState({ resultMsg: { error }, loading: false });
                    });
            }
            return this.props.createUser(userObj)
                .then(response => this._handleLoginFinalize(userObj, response.user, surveyPayload))
                .catch(err => {
                    const error = AppAPI.handleError(err);
                    return this.setState({ resultMsg: { error }, loading: false });
                });
        }
        return this.setState({ resultMsg: { error: 'Unexpected error occurred, please try again!' }, loading: false });
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

    _handleUserFormChange = (name, value, isSurvey) => {
        // This let's us change arbitrarily nested objects with one pass
        let newResultMsgFields = _.update( this.state.resultMsg, 'error', () => []);
        newResultMsgFields = _.update( this.state.resultMsg, 'status', () => '');
        newResultMsgFields = _.update( this.state.resultMsg, 'success', () => '');
        if(isSurvey) {
            let newFormFields = _.update( this.state.survey_values, name, () => value);
            this.setState({
                survey_values: newFormFields,
                resultMsg:     newResultMsgFields,
            }, () => {
                let errorsArray = this._validateForm();
                this.setState({
                    isPage1Valid: this.state.pageIndex === 0 ? errorsArray && errorsArray.length === 0 : false,
                    isPage2Valid: this.state.pageIndex === 1 ? errorsArray && errorsArray.length === 0 : false,
                });
            });
        } else {
            let newFormFields = _.update( this.state.form_fields.user, name, () => value);
            this.setState({
                form_fields: { user: newFormFields, },
                resultMsg:   newResultMsgFields,
            }, () => {
                let errorsArray = this._validateForm();
                this.setState({
                    isPage1Valid: this.state.pageIndex === 0 ? errorsArray && errorsArray.length === 0 : false,
                    isPage2Valid: this.state.pageIndex === 1 ? errorsArray && errorsArray.length === 0 : false,
                });
            });
        }
    }

    _keyboardDidShow = () => this.setState({ isKeyboardOpen: true, })

    _keyboardDidHide = () => this.setState({ isKeyboardOpen: false, })

    _renderNextPage = () => {
        let nextPageIndex = (this.state.pageIndex + 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    _renderPreviousPage = () => {
        let nextPageIndex = (this.state.pageIndex - 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    _togglePrivacyPolicyWebView = () => {
        this.setState({ isPrivacyPolicyOpen: !this.state.isPrivacyPolicyOpen, });
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

    _validateForm = isLastCheck => {
        let isUpdatingUser = this.props.user.id ? true : false;
        const { form_fields, pageIndex, survey_values, } = this.state;
        let errorsArray = [];
        if(pageIndex === 0) {
            errorsArray = onboardingUtils.isUserAccountInformationValid(form_fields.user, isUpdatingUser).errorsArray;
        } else {
            if(isLastCheck) {
                errorsArray = _.concat(
                    onboardingUtils.isUserAccountInformationValid(form_fields.user, isUpdatingUser).errorsArray,
                    onboardingUtils.isUserAboutValid(form_fields.user).errorsArray,
                    onboardingUtils.isSurveyValid(survey_values).errorsArray
                );
            } else {
                errorsArray = _.concat(
                    onboardingUtils.isUserAboutValid(form_fields.user).errorsArray,
                    onboardingUtils.isSurveyValid(survey_values).errorsArray
                );
            }
        }
        return errorsArray;
    }

    _validateWholeForm = callback => {
        let isUpdatingUser = this.props.user.id ? true : false;
        const { form_fields, survey_values, } = this.state;
        let informationErrorsArray = onboardingUtils.isUserAccountInformationValid(form_fields.user, isUpdatingUser).errorsArray;
        let aboutSurveyErrorsArray = _.concat(
            onboardingUtils.isUserAboutValid(form_fields.user).errorsArray,
            onboardingUtils.isSurveyValid(survey_values).errorsArray
        );
        this.setState({
            isPage1Valid: informationErrorsArray && informationErrorsArray.length === 0 ? true : false,
            isPage2Valid: aboutSurveyErrorsArray && aboutSurveyErrorsArray.length === 0 ? true : false,
        }, () => callback && callback());
    }

    render = () => {
        const {
            form_fields,
            isHealthKitModalOpen,
            isKeyboardOpen,
            isPage1Valid,
            isPage2Valid,
            isPrivacyPolicyOpen,
            pageIndex,
            resultMsg,
            survey_values,
        } = this.state;
        return (
            <View style={[styles.background,]}>
                <ImageBackground
                    source={require('../../../assets/images/standard/tutorial_background_white.png')}
                    style={{flex: 1,}}
                >
                    <TopNav
                        formFields={form_fields}
                        isUpdatingUser={this.props.user.id ? true : false}
                        onBack={pageIndex === 0 ? () => Actions.pop() : () => this._validateWholeForm(() => this._renderPreviousPage())}
                        resultMsg={resultMsg}
                        surveyValues={survey_values}
                        title={pageIndex === 0 ? 'CREATE YOUR ACCOUNT' : 'ABOUT YOU'}
                    />

                    <Pages
                        containerStyle={{flex: 1,}}
                        indicatorPosition={'none'}
                        ref={pages => { this._pages = pages; }}
                        scrollEnabled={false}
                        startPage={pageIndex}
                    >

                        <View style={{flex: 1, marginBottom: AppSizes.iphoneXBottomBarPadding,}}>
                            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                                <UserAccountInfo
                                    handleFormChange={this._handleUserFormChange}
                                    isUpdatingUser={this.props.user.id ? true : false}
                                    user={form_fields.user}
                                />
                            </View>
                            { isKeyboardOpen && Platform.OS === 'android' ?
                                <View />
                                :
                                <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: AppSizes.padding,}}>
                                    <Button
                                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                        containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthTwoThirds,}}
                                        disabled={!isPage1Valid}
                                        disabledStyle={{backgroundColor: AppColors.zeplin.slateXLight,}}
                                        disabledTitleStyle={{color: AppColors.white,}}
                                        onPress={() => this._validateWholeForm(() => this._renderNextPage())}
                                        raised={true}
                                        title={'Continue'}
                                        titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                                    />
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => this._togglePrivacyPolicyWebView()}
                                        style={[{marginHorizontal: AppSizes.padding, marginTop: AppSizes.padding,}]}
                                    >
                                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>
                                            {'By signing up you agree to our '}
                                            <Text robotoBold>{'Terms of Use.'}</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>

                        <View style={{flex: 1, marginBottom: AppSizes.iphoneXBottomBarPadding,}}>
                            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                                <UserAccountAbout
                                    handleFormChange={this._handleUserFormChange}
                                    surveyValues={survey_values}
                                    user={form_fields.user}
                                />
                            </View>
                            { isKeyboardOpen && Platform.OS === 'android' ?
                                <View />
                                :
                                <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: AppSizes.padding,}}>
                                    <Button
                                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                        containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthTwoThirds,}}
                                        disabled={!isPage2Valid}
                                        disabledStyle={{backgroundColor: AppColors.zeplin.slateXLight,}}
                                        disabledTitleStyle={{color: AppColors.white,}}
                                        onPress={() => this._handleFormSubmit()}
                                        raised={true}
                                        title={'Create Account'}
                                        titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                                    />
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => this._togglePrivacyPolicyWebView()}
                                        style={[{marginTop: AppSizes.padding,}]}
                                    >
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>
                                            {'By signing up you agree to our '}
                                            <Text robotoBold>{'Terms of Use.'}</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>

                    </Pages>
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
                        isPrivacyPolicyOpen={isPrivacyPolicyOpen}
                    />
                </ImageBackground>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Onboarding;
