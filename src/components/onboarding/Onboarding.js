/**
 * Onboarding Screen
 *  - Steps through the multiple steps
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
import Modal from 'react-native-modalbox';

// Consts, Libs, and Utils
import { AppAPI } from '../../lib/';
import {
    APIConfig,
    AppColors,
    AppStyles,
    AppSizes,
    UserAccount as UserAccountConstants,
} from '../../constants';
import { onboardingUtils } from '../../constants/utils';

// Components
import {
    Alerts,
    ProgressBar,
    Text,
    WebViewPage,
} from '../custom/';
import {
    UserAccount,
    UserActivities,
    UserClearedQuestion,
    UserRole,
    UserSportSchedule,
    UserWorkoutQuestion,
} from './pages/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.primary.white.hundredPercent,
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
});

/* Component ==================================================================== */
class Onboarding extends Component {
    static componentName = 'Onboarding';

    static propTypes = {}

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

        this.state = {
            form_fields: {
                user: {
                    // agreed_terms_of_use:   null,
                    // agreed_privacy_policy: null,
                    cleared_to_play:   null,
                    onboarding_status: [], // 'account_setup', 'sport_schedule', 'activities', 'injuries', 'cleared_to_play', 'pair_device', 'completed'
                    email:             '',
                    password:          '',
                    biometric_data:    {
                        gender: '',
                        height: {
                            in: 71
                        },
                        mass: {
                            lb: ''
                        }
                    },
                    personal_data: {
                        birth_date:     '',
                        first_name:     '',
                        last_name:      '',
                        phone_number:   '',
                        account_type:   'free', // 'paid', 'free'
                        account_status: 'active', // 'active', 'pending', 'past_due', 'expired'
                    },
                    role:                           '',
                    system_type:                    '1-sensor',
                    injury_status:                  '',
                    injuries:                       {}, // COMING SOON
                    training_groups:                [], // COMING SOON
                    training_schedule:              {},
                    training_strength_conditioning: {
                        activities:     [],
                        days:           [],
                        durations:      '',
                        totalDurations: '',
                    },
                    sports:                   [sportArray],
                    workout_outside_practice: null,
                }
            },
            isFormValid:         false,
            isHeightModalOpen:   false,
            isPrivacyPolicyOpen: false,
            isTermsOpen:         false,
            modalStyle:          {},
            resultMsg:           {
                error:   [],
                status:  '',
                success: '',
            },
            step:                1, // TODO: UPDATE THIS VALUE BACK TO '1'
            totalSteps:          4,
            heightsCarouselData: [],
        };
    }

    _toggleTermsWebView = () => {
        this.setState({ isTermsOpen: !this.state.isTermsOpen })
    }

    _togglePrivacyPolicyWebView = () => {
        this.setState({ isPrivacyPolicyOpen: !this.state.isPrivacyPolicyOpen })
    }

    _handleUserFormChange = (name, value) => {
        /**
          * This let's us change arbitrarily nested objects with one pass
          */
        let newFormFields = _.update( this.state.form_fields.user, name, () => value);
        let errorsArray = this._validateForm();
        this.setState({
            ['form_fields.user']: newFormFields,
            isFormValid:          errorsArray.length === 0 ? true : false,
        });
        if(name === 'role') {
            this._nextStep();
        }
    }

    _handleUserHeightFormChange = (index) => {
        // set height in inches
        const f = this.state.heightsCarouselData[index].title;
        const rex = /^(\d+)'(\d+)(?:''|")$/;
        let match = rex.exec(f);
        let feet, inches, feetToInches, totalInches;
        if (match) {
            feet = parseInt(match[1], 10);
            inches = parseInt(match[2], 10);
        }
        feetToInches = feet * 12;
        totalInches = feetToInches + inches;
        this._handleUserFormChange('biometric_data.height.in', totalInches.toString());
        // update carousel data
        this._handleHeightsArray(f);
    }

    _handleHeightsArray = (title, index = 47) => {
        const wholeHeightsArray = UserAccountConstants.heights;
        index = title ? _.findIndex(wholeHeightsArray, {title: title}) : index;
        let newHeightsArray = _.cloneDeep(wholeHeightsArray);
        if(title && index > 47) {
            let newIndexLength = ((index + 4) - 47) + 1;
            let objToAddToEnd = newHeightsArray.splice(47, newIndexLength);
            newHeightsArray = _.unionBy(this.state.heightsCarouselData, objToAddToEnd, 'title');
        } else if(title && index < 47) {
            let newIndex = (index - 4);
            let objToAddToFront = newHeightsArray.splice(newIndex, 1);
            newHeightsArray = _.unionBy(objToAddToFront, this.state.heightsCarouselData, 'title');
        } else if(!title) {
            newHeightsArray = newHeightsArray.splice(index - 4, 9);
        }
        this.setState({
            heightsCarouselData: newHeightsArray
        });
    }

    _validateForm = () => {
        const { form_fields, step } = this.state;
        let errorsArray = [];
        if(step === 1) { // select a user role
            errorsArray = errorsArray.concat(onboardingUtils.isUserRoleValid(form_fields.user.role).errorsArray);
        } else if(step === 2) { // enter user information
            errorsArray = errorsArray.concat(onboardingUtils.isUserAccountInformationValid(form_fields.user).errorsArray);
            errorsArray = errorsArray.concat(onboardingUtils.isUserAboutValid(form_fields.user).errorsArray);
            errorsArray = errorsArray.concat(onboardingUtils.areSportsValid(form_fields.user.sports).errorsArray);
        } else if(step === 3) { // sport(s) schedule
            errorsArray = errorsArray.concat(onboardingUtils.areTrainingSchedulesValid(form_fields.user.training_schedule).errorsArray);
        } else if(step === 4) { // workout outside of practice?
            errorsArray = errorsArray.concat(onboardingUtils.isWorkoutOutsidePracticeValid(form_fields.user.workout_outside_practice).errorsArray);
        } else if(step === 5) { // activities
            errorsArray = errorsArray.concat(onboardingUtils.isActivitiesValid(form_fields.user.training_strength_conditioning).errorsArray);
        } else if(step === 6) { // injury
        } else if(step === 7) { // cleared?
            errorsArray = errorsArray.concat(onboardingUtils.isUserClearedValid(form_fields.user).errorsArray);
        } else if(step === 8) { // pair device
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
        const { form_fields, step } = this.state;
        // validation
        let errorsArray = this._validateForm();
        /*let newStep;
        if (
            step === 4
            && !form_fields.user.workout_outside_practice
        ) {
            if(
                form_fields.user.injury_status === 'healthy'
            ) { // if user is health and they don't workout outside of practice
                newStep = step + 3;
            } else { // if the user doesn't workout outside of practice
                newStep = step + 2;
            }
        } else {
            newStep = step + 1;
        }*/
        let newStep = step + 1;
        this.setState({
            ['resultMsg.error']: errorsArray,
            // isFormValid:         false,
            // step:                newStep,
        });
        // save or update, if no errors
        if(errorsArray.length === 0) {
            this._handleUpdateForm();
        }
    }

    _handleUpdateForm = () => {

    }

    _heightPressed = () => {
        this._handleHeightsArray();
        this.setState({ isHeightModalOpen: !this.state.isHeightModalOpen });
    }

    _renderHeightItem = ({item, index}) => {
        return (
            <View style={[styles.carouselCustomStyles, {height: AppSizes.screen.height / 3}]}>
                <View style={[styles.carouselCustomStyles, {height: '50%', width: '100%'}]}>
                    <Text style={[AppStyles.h1]}>{ item.title }</Text>
                </View>
                <View style={[styles.carouselCustomStyles, {flexDirection: 'row', height: '50%', width: '100%', margin: 'auto'}]}>
                    <View style={[styles.carouselTick, {height: '50%'}]} />
                    <View style={[styles.carouselTick, {height: '50%'}]} />
                    <View style={[styles.carouselTick, {height: '100%'}]} />
                    <View style={[styles.carouselTick, {height: '50%'}]} />
                    <View style={[styles.carouselTick, {height: '50%'}]} />
                </View>
            </View>
        );
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

    render = () => {
        const {
            form_fields,
            heightsCarouselData,
            isFormValid,
            isHeightModalOpen,
            isPrivacyPolicyOpen,
            isTermsOpen,
            resultMsg,
            step,
            totalSteps,
        } = this.state;
        console.log(form_fields.user);
        return (
            <View style={[styles.background]}>
                <ProgressBar
                    currentStep={step}
                    totalSteps={totalSteps}
                />
                { resultMsg.error && resultMsg.error.length === 0 ?
                    <View style={styles.errorWrapper}>
                        { resultMsg.error.map((error, i) =>
                            <Text style={styles.errorText} key={i}>{error}</Text>
                        )}
                    </View>
                    :
                    null
                }
                <UserRole
                    componentStep={1}
                    currentStep={step}
                    handleFormChange={this._handleUserFormChange}
                    user={form_fields.user}
                />
                <UserAccount
                    componentStep={2}
                    currentStep={step}
                    handleFormChange={this._handleUserFormChange}
                    heightPressed={this._heightPressed}
                    user={form_fields.user}
                />
                <UserSportSchedule
                    componentStep={3}
                    currentStep={step}
                    handleFormChange={this._handleUserFormChange}
                    user={form_fields.user}
                />
                {/*<UserWorkoutQuestion
                    componentStep={4}
                    currentStep={step}
                    handleFormChange={this._handleUserFormChange}
                    user={form_fields.user}
                />
                <UserActivities
                    componentStep={5}
                    currentStep={step}
                    handleFormChange={this._handleUserFormChange}
                    user={form_fields.user}
                />*/}
                <UserClearedQuestion
                    componentStep={4}
                    currentStep={step}
                    handleFormChange={this._handleUserFormChange}
                    isFormValid={isFormValid}
                    isPrivacyPolicyOpen={isPrivacyPolicyOpen}
                    isTermsOpen={isTermsOpen}
                    nextStep={this._nextStep}
                    notClearedBtnPressed={this._notClearedBtnPressed}
                    togglePrivacyPolicyWebView={this._togglePrivacyPolicyWebView}
                    toggleTermsWebView={this._toggleTermsWebView}
                    user={form_fields.user}
                />
                { isFormValid && step > 1 && step !== 7 ?
                    <TouchableOpacity onPress={this._nextStep} style={[AppStyles.nextButtonWrapper]}>
                        <Text style={[AppStyles.nextButtonText]}>{step === totalSteps ? 'Done' : 'Next Step'}</Text>
                    </TouchableOpacity>
                    :
                    null
                }
                <Modal
                    backdropPressToClose={false}
                    coverScreen={true}
                    isOpen={isHeightModalOpen}
                    swipeToClose={false}
                >
                    <View style={[styles.carouselCustomStyles, styles.carouselBanner]}>
                        <Text style={[AppStyles.textBold, AppStyles.h2]}>{'HEIGHT'}</Text>
                    </View>
                    <Carousel
                        activeSlideAlignment={'center'}
                        contentContainerCustomStyle={[styles.carouselCustomStyles]}
                        data={heightsCarouselData}
                        firstItem={4}
                        inactiveSlideOpacity={0.7}
                        inactiveSlideScale={0.9}
                        itemWidth={AppSizes.screen.width / 3}
                        loop={false}
                        onSnapToItem={index => this._handleUserHeightFormChange(index)}
                        renderItem={this._renderHeightItem}
                        sliderWidth={AppSizes.screen.width}
                    />
                    <TouchableOpacity onPress={this._heightPressed} style={[AppStyles.nextButtonWrapper]}>
                        <Text style={[AppStyles.nextButtonText]}>{'Done'}</Text>
                    </TouchableOpacity>
                </Modal>
                <Modal
                    backdropPressToClose={false}
                    coverScreen={true}
                    isOpen={isTermsOpen}
                    swipeToClose={false}
                >
                    <WebViewPage
                        source={'https://www.fathomai.com/'}
                    />
                    <TouchableOpacity onPress={this._toggleTermsWebView} style={[AppStyles.nextButtonWrapper]}>
                        <Text style={[AppStyles.nextButtonText]}>{'Done'}</Text>
                    </TouchableOpacity>
                </Modal>
                <Modal
                    backdropPressToClose={false}
                    coverScreen={true}
                    isOpen={isPrivacyPolicyOpen}
                    swipeToClose={false}
                >
                    <WebViewPage
                        source={'https://www.fathomai.com/'}
                    />
                    <TouchableOpacity onPress={this._togglePrivacyPolicyWebView} style={[AppStyles.nextButtonWrapper]}>
                        <Text style={[AppStyles.nextButtonText]}>{'Done'}</Text>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Onboarding;
