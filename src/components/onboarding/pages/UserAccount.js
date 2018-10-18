/**
 * UserAccount
 *
    <UserAccount
        componentStep={1}
        currentStep={step}
        error={this.state.resultMsg.error}
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
import { Alerts, Spacer, TabIcon, Text } from '../../custom';

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
        const { isUpdatingUser, user, } = this.props;
        let isFormValid = false;
        if (section.index === 1) {
            isFormValid = onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).isValid;
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
        let errorMsg = this.props.error && this.props.error.length > 0 ? this.props.error : this.state.coachContent && this.state.coachContent.length > 0 ? this.state.coachContent : '';
        return(
            <View>
                <View style={{marginLeft: 10, borderLeftWidth: 1, borderColor: AppColors.border,}}>
                    <Alerts
                        leftAlignText
                        error={errorMsg}
                    />
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
        const { isUpdatingUser, user, } = this.props;
        let errorsArray = [];
        if(nextStep) {
            // Validation to make sure we can go to the next step
            if(section === 0) {
                errorsArray = onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).errorsArray;
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
                    coachContent:     '',
                    isFormValid:      false,
                });
            }
        } else {
            let coachesMessage = '';
            errorsArray = errorsArray.concat(onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).errorsArray);
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

    _updateErrorMessage = (isAbout) => {
        this.scrollViewRef.scrollTo({x: 0, y: 0, animated: true});
        let coachesMessage = isAbout ? onboardingUtils.isUserAboutValid(this.props.user).errorsArray : onboardingUtils.isUserAccountInformationValid(this.props.user, this.props.isUpdatingUser).errorsArray;
        this.setState({
            coachContent: coachesMessage,
            isFormValid:  false,
        });
    };

    render = () => {
        const {
            componentStep,
            currentStep,
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
                    handleFormChange={(name, text) => this.setState({ coachContent: '', }, () => handleFormChange(name, text))}
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
                    updateErrorMessage={this._updateErrorMessage}
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
                        <Accordion
                            activeSection={this.state.accordionSection}
                            onChange={this._setAccordionSection}
                            onHeaderClicked={this._onAccordionHeaderClicked}
                            renderContent={this._renderContent}
                            renderHeader={this._renderHeader}
                            sections={SECTIONS}
                            underlayColor={AppColors.transparent}
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
    componentStep: PropTypes.number.isRequired,
    currentStep:   PropTypes.number.isRequired,
    error:         PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
    ]),
    handleFormChange: PropTypes.func.isRequired,
    heightPressed:    PropTypes.func.isRequired,
    isUpdatingUser:   PropTypes.bool.isRequired,
    user:             PropTypes.object.isRequired,
};
UserAccount.defaultProps = {
    error: null,
};
UserAccount.componentName = 'UserAccount';

/* Export Component ==================================================================== */
export default UserAccount;