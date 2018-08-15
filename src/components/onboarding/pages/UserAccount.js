/**
 * UserAccount
 *
    <UserAccount
        componentStep={1}
        currentStep={step}
        displayCoach={resultMsg.error && resultMsg.error.length > 0}
        handleFormChange={this._handleUserFormChange}
        handleFormSubmit={this._handleFormSubmit}
        isUpdatingUser={this.props.user.id ? true : false}
        user={form_fields.user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View, } from 'react-native';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppSizes, AppStyles } from '../../../constants';
import { onboardingUtils } from '../../../constants/utils';
import { Coach, Spacer, TabIcon, Text } from '../../custom';

// import components
import { UserAccountAbout, UserAccountInfo, UserSports } from './';

// import third-party libraries
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import _ from 'lodash';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        // width: AppSizes.screen.width,
    },
    headerWrapper: {
        alignItems:    'center',
        flexDirection: 'row',
    },
    iconContainer: {
        backgroundColor: AppColors.transparent,
        height:          AppFonts.scaleFont(18),
        marginLeft:      0,
    },
    iconStyle: {
        fontSize: 20,
    },
    title: {
        ...AppStyles.oswaldBold,
        fontSize: AppFonts.scaleFont(18),
    },
    wrapper: {
        paddingHorizontal: 10,
        paddingVertical:   10,
    },
});

/* Component ==================================================================== */
class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accordionSection: 0,
            coachContent:     '',
            isFormValid:      false,
            isPasswordSecure: true,
        };

        this.scrollViewRef = {};
    }

    _renderHeader = (section) => {
        const { user } = this.props;
        let isFormValid = false;
        if (section.index === 1) {
            isFormValid = onboardingUtils.isUserAccountInformationValid(user).isValid;
        } else if (section.index === 2) {
            isFormValid = onboardingUtils.isUserAboutValid(user).isValid;
        } else if (section.index === 3) {
            isFormValid = onboardingUtils.areSportsValid(user.sports).isValid;
        }
        return(
            <View>
                <Spacer size={10} />
                <View style={[styles.headerWrapper,]}>
                    <TabIcon
                        containerStyle={[styles.iconContainer]}
                        icon={
                            isFormValid ?
                                'check-circle'
                                : (this.state.accordionSection + 1) === section.index ?
                                    'circle'
                                    :
                                    'circle-outline'
                        }
                        iconStyle={[
                            styles.iconStyle,
                            isFormValid ?
                                {color: AppColors.primary.yellow.hundredPercent}
                                : (this.state.accordionSection + 1) === section.index ?
                                    {color: AppColors.black}
                                    :
                                    {color: AppColors.zeplin.lightGrey}
                        ]}
                        reverse={true}
                        size={10}
                        type={'material-community'}
                    />
                    <Text
                        oswaldMedium
                        style={[
                            styles.title,
                            isFormValid ?
                                {color: AppColors.primary.yellow.hundredPercent}
                                : (this.state.accordionSection + 1) === section.index ?
                                    {color: AppColors.black}
                                    :
                                    {color: AppColors.zeplin.lightGrey},
                            {fontSize: AppFonts.scaleFont(18)},
                        ]}
                    >
                        {section.header}
                    </Text>
                </View>
                { section.index === 1 || (section.index === 2 && this.state.accordionSection === 1) ?
                    <View
                        style={{
                            borderColor:     AppColors.border,
                            borderLeftWidth: 1,
                            height:          20,
                            marginLeft:      10,
                        }}
                    />
                    :
                    null
                }
            </View>
        )
    };

    _renderContent = (section) => {
        return(
            <View>
                <View style={{marginLeft: 10, borderLeftWidth: 1, borderColor: AppColors.border,}}>
                    {section.content}
                </View>
            </View>
        )
    };

    _handleSportsFormChange = (i, name, value) => {
        this.setState({ coachContent: '' });
        const { handleFormChange, user } = this.props;
        let newSportsArray = _.cloneDeep(user.sports);
        newSportsArray[i][name] = value;
        handleFormChange('sports', newSportsArray);
        if(name === 'name') {
            let newTrainingScheduleArray = user.training_schedule;
            newTrainingScheduleArray[value] = {};
            newTrainingScheduleArray[value].practice = {days_of_week: '', duration_minutes: ''};
            newTrainingScheduleArray[value].competition = {days_of_week: ''};
            handleFormChange('training_schedule', newTrainingScheduleArray);
        }
    };

    _addAnotherSport = (index) => {
        const { handleFormChange, user } = this.props;
        const sportValidation = onboardingUtils.isSportValid(user.sports[index]);
        if(sportValidation.isValid) {
            this.setState({ coachContent: '' });
            const newSportArray = {
                competition_level:  '',
                end_date:           '', // 'MM/DD/YYYY' or 'current'
                name:               '',
                positions:          [],
                season_end_month:   '',
                season_start_month: '',
                start_date:         '',
            };
            let newSportsArray = _.cloneDeep(user.sports);
            newSportsArray.push(newSportArray);
            handleFormChange('sports', newSportsArray);
        } else {
            this.setState({ coachContent: 'Please make sure to fill out all the sports related information before trying to add a new one!' });
        }
    };

    _removeSport = (index) => {
        const { handleFormChange, user } = this.props;
        if(index > 0) {
            this.setState({ coachContent: '' });
            let newSportsArray = _.cloneDeep(user.sports);
            newSportsArray.splice(index, 1);
            handleFormChange('sports', newSportsArray);
        } else {
            this.setState({ coachContent: 'You cannot remove your first sport, at least one sport is required!' });
        }
    };

    _setAccordionSection = (section, nextStep) => {
        const { user } = this.props;
        let errorsArray = [];
        if(nextStep) {
            // Validation to make sure we can go to the next step
            if(section === 0) {
                errorsArray = onboardingUtils.isUserAccountInformationValid(user).errorsArray;
            } else if(section === 1) {
                errorsArray = onboardingUtils.isUserAboutValid(user).errorsArray;
            } else if(section === 2) {
                errorsArray = onboardingUtils.areSportsValid(user.sports).errorsArray;
            }
            if(errorsArray.length > 0) {
                this.setState({
                    coachContent: errorsArray,
                    isFormValid:  false,
                });
            } else {
                this.setState({
                    accordionSection: nextStep,
                    isFormValid:      false,
                });
            }
        } else {
            let coachesMessage = '';
            errorsArray = errorsArray.concat(onboardingUtils.isUserAccountInformationValid(user).errorsArray);
            errorsArray = errorsArray.concat(onboardingUtils.isUserAboutValid(user).errorsArray);
            if(section === 1) {
                coachesMessage = 'The ACCOUNT INFORMATION section has invalid fields. Please complete first and try agian.';
            } else if(section === 2) {
                coachesMessage = 'The TELL US ABOUT YOU section has invalid fields. Please complete first and try agian.';
            }
            if(errorsArray.length > 0) {
                this.setState({
                    coachContent: coachesMessage,
                    isFormValid:  false,
                });
            } else {
                this.setState({
                    accordionSection: section,
                    coachContent:     '',
                    isFormValid:      true,
                });
            }
        }
    };

    _toggleShowPassword = () => {
        this.setState({ isPasswordSecure: !this.state.isPasswordSecure});
    };

    _updateErrorMessage = () => {
        this.scrollViewRef.scrollTo({x: 0, y: 0, animated: true});
        this.setState({
            coachContent: onboardingUtils.isUserAccountInformationValid(this.props.user).errorsArray,
            isFormValid:  false,
        });
    };

    render = () => {
        const {
            componentStep,
            currentStep,
            displayCoach,
            handleFormChange,
            handleFormSubmit,
            heightPressed,
            isUpdatingUser,
            user,
        } = this.props;
        // Accordion sections
        const SECTIONS = [
            {
                content: <UserAccountInfo
                    handleFormChange={handleFormChange}
                    isPasswordSecure={this.state.isPasswordSecure}
                    isUpdatingUser={isUpdatingUser}
                    setAccordionSection={this._setAccordionSection}
                    toggleShowPassword={this._toggleShowPassword}
                    updateErrorMessage={this._updateErrorMessage}
                    user={user}
                />,
                header:   'ACCOUNT INFORMATION',
                index:    1,
                subtitle: 'Let\'s start with creating your account, then we\'ll be ready to develop your routine.',
            },
            {
                content: <UserAccountAbout
                    handleFormChange={handleFormChange}
                    heightPressed={heightPressed}
                    setAccordionSection={handleFormSubmit}
                    user={user}
                />,
                header:   'ABOUT YOU',
                index:    2,
                subtitle: 'Now, let\'s understand how you train and how we can help you to get better!',
            },
            /*{
                content: <UserSports
                    addAnotherSport={this._addAnotherSport}
                    handleFormChange={this._handleSportsFormChange}
                    removeSport={this._removeSport}
                    sports={user.sports}
                />,
                header: 'TRAINING DETAILS',
                index:  3,
            },*/
        ];
        return (
            <View style={{flex: 1}}>
                <View style={[styles.wrapper, [componentStep === currentStep ? {flex: 1} : {display: 'none'}] ]}>
                    <KeyboardAwareScrollView ref={ref => {this.scrollViewRef = ref}}>
                        { displayCoach && this.state.coachContent.length > 0 ?
                            <Coach
                                text={this.state.coachContent}
                            />
                            : displayCoach && this.state.accordionSection !== false && _.find(SECTIONS, section => section.index === this.state.accordionSection + 1).subtitle ?
                                <Coach
                                    text={_.find(SECTIONS, section => section.index === this.state.accordionSection + 1).subtitle}
                                />
                                :
                                null
                        }
                        <Accordion
                            activeSection={this.state.accordionSection}
                            onChange={this._setAccordionSection}
                            onHeaderClicked={this._onAccordionHeaderClicked}
                            renderContent={this._renderContent}
                            renderHeader={this._renderHeader}
                            sections={SECTIONS}
                        />
                        { this.state.accordionSection === false ?
                            <View style={{marginLeft: 10, borderLeftWidth: 1, borderColor: AppColors.border,}}>
                                <Spacer size={40} />
                                <Text
                                    oswaldRegular
                                    onPress={() => this.state.isFormValid ? handleFormSubmit() : this._setAccordionSection(0, 1)}
                                    style={[AppStyles.continueButton,
                                        {
                                            fontSize:      AppFonts.scaleFont(16),
                                            paddingBottom: AppSizes.padding,
                                        },
                                    ]}
                                >{'CONTINUE...'}</Text>
                            </View>
                            :
                            null
                        }
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }
}

UserAccount.propTypes = {
    componentStep:    PropTypes.number.isRequired,
    currentStep:      PropTypes.number.isRequired,
    displayCoach:     PropTypes.bool.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    heightPressed:    PropTypes.func.isRequired,
    isUpdatingUser:   PropTypes.bool.isRequired,
    user:             PropTypes.object.isRequired,
};
UserAccount.defaultProps = {};
UserAccount.componentName = 'UserAccount';

/* Export Component ==================================================================== */
export default UserAccount;