/**
 * Onboarding Screen
 *  - Steps through the multiple steps
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import Carousel from 'react-native-snap-carousel';
import Modal from 'react-native-modalbox';

// Consts, Libs, and Utils
import { AppAPI } from '../../lib/';
import { APIConfig, AppColors, AppStyles, AppSizes, UserAccount as UserAccountConstants } from '../../constants';
import { onboardingUtils } from '../../constants/utils';

// Components
import { Alerts, Button, Card, ListItem, ProgressBar, Spacer, Text } from '../custom/';
import { UserAccount, UserRole } from './pages/';

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
        borderBottomColor: '#000',
    },
    carouselCustomStyles: {
        alignItems:     'center',
        justifyContent: 'center',
    },
    carouselTick: {
        borderLeftColor: '#000',
        borderLeftWidth: 1,
        width:           '20%',
    },
    nextButtonText: {
        color:         '#fff',
        fontWeight:    'bold',
        paddingBottom: 20,
        paddingTop:    20,
    },
    nextButtonWrapper: {
        alignItems:      'center',
        backgroundColor: '#000',
        justifyContent:  'center',
        width:           AppSizes.screen.width ,
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
                    email:          '',
                    password:       '',
                    biometric_data: {
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
                        zip_code:       '', // STRING
                        first_name:     '',
                        last_name:      '',
                        phone_number:   '', // STRING
                        account_type:   'paid', // "paid", "free"
                        account_status: 'active', // "active", "pending", "past_due", "expired"
                    },
                    role:              '',
                    system_type:       '1-sensor',
                    injury_status:     '',
                    injuries:          {}, // COMING SOON
                    training_groups:   [], // COMING SOON
                    training_schedule: [ // TODO: STILL NEED TO BUILD OUT
                        {
                            practice: {
                                days_of_week:     'Mon,Tue,Wed,Thu,Fri,Sat',
                                duration_minutes: 90,
                            },
                            competition: {
                                days_of_week:     'Sun',
                                duration_minutes: 60,
                            }
                        }
                    ],
                    training_strength_conditioning: [ // TODO: STILL NEED TO BUILD OUT
                        {
                            activity:         'weight_lifting', // "endurance", "running", "sprinting", "cycling", "swimming", "rowing", "cardio", "interval_training", "weight_lifting", "yoga"
                            days_of_week:     'Tue,Thu',
                            duration_minutes: 30
                        },
                        {
                            activity:         'yoga',
                            days_of_week:     'Fri',
                            duration_minutes: 60
                        }
                    ],
                    sports: [sportArray],
                }
            },
            isFormValid:       false,
            isHeightModalOpen: false,
            modalStyle:        {},
            resultMsg:         {
                error:   [],
                status:  '',
                success: '',
            },
            step:       1,
            totalSteps: 5,
        };
    }

    _handleUserFormChange = (name, value) => {
        const { form_fields } = this.state;
        const newFormFields = form_fields;
        newFormFields.user[name] = value;
        let errorsArray = this._validateForm();
        this.setState({
            form_fields: newFormFields,
            isFormValid: errorsArray.length === 0 ? true : false,
        });
    }

    _handleUserHeightFormChange = (index) => {
        const f = UserAccountConstants.heights[index].title;
        const rex = /^(\d+)'(\d+)(?:''|")$/;
        let match = rex.exec(f);
        let feet, inches, feetToInches, totalInches;
        if (match) {
            feet = parseInt(match[1], 10);
            inches = parseInt(match[2], 10);
        }
        feetToInches = feet * 12;
        totalInches = feetToInches + inches;
        this._handleUserFormChange('biometric_data.height.in', totalInches);
    }

    _validateForm = () => {
        const { form_fields, step } = this.state;
        let errorsArray = [];
        if(step === 1) { // select a user role
            errorsArray = onboardingUtils.isUserRoleValid(form_fields.user.role).errorsArray;
        } else if(step === 2) { // enter user information
            errorsArray = onboardingUtils.isUserAccountInformationValid(form_fields.user).errorsArray;
            errorsArray = onboardingUtils.isUserAboutValid(form_fields.user).errorsArray;
            errorsArray = onboardingUtils.areSportsValid(form_fields.user.sports).errorsArray;
        } else if(step === 3) { //

        } else if(step === 4) { //

        } else if(step === 5) { //

        }
        return errorsArray;
    }

    _previousStep = () => {
        const { step } = this.state;
        // validation
        let errorsArray = this._validateForm();
        if(step === 1) {
            // Actions.();
        } else {
            this.setState({
                isFormValid: errorsArray.length === 0 ? true : false,
                step:        step - 1,
            });
        }
    }

    _nextStep = () => {
        const { resultMsg, step } = this.state;
        // validation
        let errorsArray = this._validateForm();
        // should we save it as a draft at this point so the user can always come back to it?
        this.setState({
            [resultMsg.error]: errorsArray,
            isFormValid:       false,//errorsArray.length === 0 ? true : false,
            step:              step + 1,
        });
    }

    _heightPressed = () => {
        this.setState({ isHeightModalOpen: !this.state.isHeightModalOpen });
    }

    _renderHeightItem = ({item, index}) => {
        return (
            <View style={[styles.carouselCustomStyles, {height: AppSizes.screen.height / 3}]}>
                <View style={[styles.carouselCustomStyles, {height: '50%', width: '100%'}]}>
                    <Text style={{fontSize: 35, lineHeight: 35}}>{ item.title }</Text>
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

    render = () => {
        const {
            form_fields,
            isFormValid,
            isHeightModalOpen,
            resultMsg,
            step,
            totalSteps,
        } = this.state;
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
                <ScrollView>
                    <UserRole
                        componentStep={1}
                        currentStep={step}
                        handleClick={this._handleUserFormChange}
                        user={form_fields.user}
                    />
                    <UserAccount
                        componentStep={2}
                        currentStep={step}
                        handleFormChange={this._handleUserFormChange}
                        heightPressed={this._heightPressed}
                        user={form_fields.user}
                    />
                </ScrollView>
                { isFormValid ?
                    <TouchableOpacity onPress={this._nextStep} style={[styles.nextButtonWrapper]}>
                        <Text style={[styles.nextButtonText]}>{step === totalSteps ? 'Done' : 'Next Step'}</Text>
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
                        <Text style={{fontWeight: 'bold'}}>{'Height'}</Text>
                    </View>
                    <Carousel
                        activeSlideAlignment={'center'}
                        contentContainerCustomStyle={[styles.carouselCustomStyles]}
                        data={UserAccountConstants.heights}
                        firstItem={47}
                        inactiveSlideOpacity={0.7}
                        inactiveSlideScale={0.9}
                        itemWidth={AppSizes.screen.width / 3}
                        loop={false}
                        onSnapToItem={index => this._handleUserHeightFormChange(index)}
                        renderItem={this._renderHeightItem}
                        sliderWidth={AppSizes.screen.width}
                    />
                    <TouchableOpacity onPress={this._heightPressed} style={[styles.nextButtonWrapper]}>
                        <Text style={[styles.nextButtonText]}>{'Done'}</Text>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Onboarding;
