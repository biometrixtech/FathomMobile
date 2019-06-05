/**
 * UserAccount
 *
    <UserAccount
        componentStep={1}
        currentStep={step}
        error={this.state.resultMsg.error}
        handleFormChange={this._handleUserFormChange}
        handleFormSubmit={this._handleFormSubmit}
        isFormValid={this.state.isFormValid}
        isUpdatingUser={this.props.user.id ? true : false}
        togglePrivacyPolicyWebView={this._togglePrivacyPolicyWebView}
        user={form_fields.user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, TouchableHighlight, View, } from 'react-native';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { onboardingUtils, } from '../../../constants/utils';
import { Alerts, Button, Spacer, TabIcon, Text, } from '../../custom';

// import components
import { UserAccountAbout, UserAccountInfo, } from './';

// import third-party libraries
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Accordion from 'react-native-collapsible/Accordion';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
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
        fontSize:    AppFonts.scaleFont(18),
        paddingLeft: AppSizes.paddingSml,
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
            accordionSection:        [0],
            coachContent:            '',
            isAboutFormValid:        false,
            isConfirmPasswordSecure: true,
            isInfoFormValid:         false,
            isPasswordSecure:        true,
        };
        this.scrollViewRef = {};
    }

    _renderHeader = (section) => {
        const { isAboutFormValid, isInfoFormValid, } = this.state;
        let isFormValid = section.index === 1 ? isInfoFormValid : section.index === 2 ? isAboutFormValid : false;
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
                                {color: AppColors.zeplin.yellow}
                                : (this.state.accordionSection + 1) === section.index ?
                                    {color: AppColors.black}
                                    :
                                    {color: AppColors.zeplin.slateLight}
                        ]}
                        size={10}
                        type={'material-community'}
                    />
                    <Text
                        oswaldMedium
                        style={[
                            styles.title,
                            isFormValid ?
                                {color: AppColors.zeplin.yellow}
                                : (this.state.accordionSection + 1) === section.index ?
                                    {color: AppColors.black}
                                    :
                                    {color: AppColors.zeplin.slate},
                        ]}
                    >
                        {section.header}
                    </Text>
                </View>
                { (section.index === 1 && this.state.accordionSection.includes(0)) || (section.index === 2 && this.state.accordionSection.includes(1)) ?
                    <View
                        style={{
                            borderColor:     AppColors.zeplin.slateXLight,
                            borderLeftWidth: 1,
                            height:          20,
                            marginLeft:      10,
                        }}
                    />
                    : (section.index === 1 && (this.state.accordionSection.includes(1) || this.state.accordionSection.length === 0)) ?
                        <View
                            style={{
                                borderColor:     AppColors.zeplin.slateXLight,
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
                <View style={{borderColor: AppColors.zeplin.slateXLight, borderLeftWidth: 1, marginLeft: 10,}}>
                    <Alerts
                        leftAlignText
                        error={errorMsg}
                    />
                    {section.content}
                </View>
            </View>
        )
    };

    _setAccordionSection = (section, nextStep) => {
        const { isUpdatingUser, user, } = this.props;
        let isAboutFormValid = false;
        let isInfoFormValid = false;
        let errorsArray = [];
        if(nextStep) {
            // Validation to make sure we can go to the next step
            if(section === 0) {
                errorsArray = onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).errorsArray;
                isInfoFormValid = errorsArray.length > 0 ? false : true;
                isAboutFormValid = onboardingUtils.isUserAboutValid(user).errorsArray.length > 0 ? false : true;
            } else if(section === 1) {
                errorsArray = onboardingUtils.isUserAboutValid(user).errorsArray;
                isAboutFormValid = errorsArray.length > 0 ? false : true;
            }
            this.setState({
                accordionSection: [nextStep],
                coachContent:     errorsArray.length > 0 ? errorsArray : '',
                isAboutFormValid,
                isInfoFormValid,
            });
        } else {
            let coachesMessage = '';
            let isAccountInfoValid = onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser);
            let isAccountAboutValid = onboardingUtils.isUserAboutValid(user);
            if(section === 1 && !isAccountInfoValid.isValid) {
                coachesMessage = 'The ACCOUNT INFORMATION section has invalid fields. Please complete first and try agian.';
                errorsArray = errorsArray.concat(isAccountInfoValid.errorsArray);
            } else if(section === 2 && !isAccountAboutValid.isValid) {
                coachesMessage = 'The TELL US ABOUT YOU section has invalid fields. Please complete first and try agian.';
                errorsArray = errorsArray.concat(isAccountAboutValid.errorsArray);
            }
            this.setState({
                accordionSection: section,
                coachContent:     errorsArray.length > 0 ? coachesMessage : '',
                isAboutFormValid: isAccountAboutValid.isValid,
                isInfoFormValid:  isAccountInfoValid.isValid,
            });
        }
    };

    _toggleShowPassword = isConfirmPassword => {
        if(isConfirmPassword) {
            this.setState({ isConfirmPasswordSecure: !this.state.isConfirmPasswordSecure, });
        } else {
            this.setState({ isPasswordSecure: !this.state.isPasswordSecure, });
        }
    };

    _updateErrorMessage = (isAbout) => {
        this.scrollViewRef.scrollTo({x: 0, y: 0, animated: true});
        let validationObj = isAbout ? onboardingUtils.isUserAboutValid(this.props.user) : onboardingUtils.isUserAccountInformationValid(this.props.user, this.props.isUpdatingUser);
        let isAboutFormValid = isAbout ? validationObj.isValid : this.state.isAboutFormValid;
        let isInfoFormValid = isAbout ? this.state.isInfoFormValid : validationObj.isValid;
        this.setState({
            coachContent: validationObj.errorsArray,
            isAboutFormValid,
            isInfoFormValid,
        });
    };

    _clearCoachContent = (string, callback) => {
        if(this.state.coachContent === '') {
            callback();
        } else {
            this.setState(
                { coachContent: string, },
                () => callback()
            );
        }
    }

    _scrollToInput = reactNode => {
        this.scrollViewRef.props.scrollToFocusedInput(reactNode, (75 + AppSizes.paddingLrg));
    }

    render = () => {
        const {
            componentStep,
            currentStep,
            handleFormChange,
            handleFormSubmit,
            isFormValid,
            isUpdatingUser,
            togglePrivacyPolicyWebView,
            user,
        } = this.props;
        // Accordion sections
        const SECTIONS = [
            {
                content: <UserAccountInfo
                    clearCoachContent={this._clearCoachContent}
                    handleFormChange={handleFormChange}
                    isConfirmPasswordSecure={this.state.isConfirmPasswordSecure}
                    isPasswordSecure={this.state.isPasswordSecure}
                    isUpdatingUser={isUpdatingUser}
                    scrollToInput={this._scrollToInput}
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
                    clearCoachContent={this._clearCoachContent}
                    handleFormChange={handleFormChange}
                    isUpdatingUser={isUpdatingUser}
                    scrollToInput={this._scrollToInput}
                    setAccordionSection={handleFormSubmit}
                    updateErrorMessage={this._updateErrorMessage}
                    user={user}
                />,
                header:   'ABOUT YOU',
                index:    2,
                subtitle: 'Now, let\'s understand how you train and how we can help you to get better!',
            },
        ];
        return (
            <View style={{flex: 1,}}>
                <View style={[styles.wrapper, [componentStep === currentStep ? {flex: 1,} : {display: 'none',}],]}>
                    <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1,}} innerRef={ref => {this.scrollViewRef = ref}}>
                        <Accordion
                            activeSections={this.state.accordionSection}
                            onChange={this._setAccordionSection}
                            onHeaderClicked={this._onAccordionHeaderClicked}
                            renderContent={this._renderContent}
                            renderHeader={this._renderHeader}
                            sections={SECTIONS}
                            underlayColor={AppColors.transparent}
                        />
                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'column', justifyContent: 'flex-end', paddingVertical: AppSizes.padding,}}>
                            <Button
                                buttonStyle={{backgroundColor: isFormValid ? AppColors.zeplin.yellow : AppColors.white, borderColor: isFormValid ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight, borderWidth: 1, width: '75%',}}
                                containerStyle={{alignItems: 'center',}}
                                icon={isFormValid ? {
                                    color: AppColors.white,
                                    name:  'chevron-right',
                                    size:  AppFonts.scaleFont(24),
                                    style: {width: '25%',},
                                } : null}
                                iconRight={true}
                                onPress={() => isFormValid ? handleFormSubmit() : {}}
                                title={`${this.props.user.id ? 'Update' : 'Create'} Account`}
                                titleStyle={{color: isFormValid ? AppColors.white : AppColors.zeplin.slateXLight, fontSize: AppFonts.scaleFont(16), width: isFormValid ? '75%' : '100%',}}
                                type={'outline'}
                            />
                            <TouchableHighlight
                                onPress={() => togglePrivacyPolicyWebView()}
                                style={[{marginTop: AppSizes.padding,}]}
                                underlayColor={AppColors.transparent}
                            >
                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>
                                    {'By signing up you agree to our '}
                                    <Text robotoBold>{'Terms of Use.'}</Text>
                                </Text>
                            </TouchableHighlight>
                        </View>
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
    handleFormChange:           PropTypes.func.isRequired,
    handleFormSubmit:           PropTypes.func.isRequired,
    isFormValid:                PropTypes.bool.isRequired,
    isUpdatingUser:             PropTypes.bool.isRequired,
    togglePrivacyPolicyWebView: PropTypes.func.isRequired,
    user:                       PropTypes.object.isRequired,
};
UserAccount.defaultProps = {
    error: null,
};
UserAccount.componentName = 'UserAccount';

/* Export Component ==================================================================== */
export default UserAccount;