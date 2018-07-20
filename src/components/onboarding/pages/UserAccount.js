/**
 * UserAccount
 *
    <UserAccount
        componentStep={1}
        currentStep={step}
        handleFormChange={this._handleUserFormChange}
        user={form_fields.user}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Image, StyleSheet, View } from 'react-native';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppSizes, AppStyles } from '@constants';
import { onboardingUtils } from '@constants/utils';
import { Coach, TabIcon, Text } from '@custom';

// import components
import { UserAccountAbout, UserAccountInfo, UserSports } from './';

// import third-party libraries
import _ from 'lodash';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    headerWrapper: {
        flexDirection: 'row',
        paddingTop:    10,
    },
    iconContainer: {
        backgroundColor: AppColors.transparent, //AppColors.black,
        marginBottom:    0,
        marginLeft:      0,
        marginRight:     10,
        marginTop:       0,
        padding:         0,
    },
    iconStyle: {
        fontSize: 20,
    },
    title: {
        fontSize:   15,
        fontWeight: 'bold',
    },
    wrapper: {
        paddingBottom: 20,
        paddingTop:    10,
        paddingRight:  10,
        paddingLeft:   10,
    },
});

/* Component ==================================================================== */
class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                <View style={[styles.headerWrapper]}>
                    <TabIcon
                        containerStyle={[styles.iconContainer]}
                        icon={isFormValid ? 'check-circle' : 'circle-outline'}
                        iconStyle={[styles.iconStyle, isFormValid ? {color: AppColors.primary.yellow.hundredPercent} : {color: AppColors.black}]}
                        reverse={true}
                        size={10}
                        type={'material-community'}
                    />
                    <Text style={[styles.title, isFormValid ? {color: AppColors.primary.yellow.hundredPercent} : {color: AppColors.black}]}>{section.header}</Text>
                </View>
                { section.index === 1 || section.index === 2 ?
                    <Text style={{width: 20, height: 20, textAlign: 'center', color: AppColors.primary.grey.thirtyPercent,}}>|</Text>
                    :
                    null
                }
            </View>
        )
    };

    _renderContent = (section) => {
        return(
            <View>
                { section.subtitle ?
                    <Coach
                        text={section.subtitle}
                    />
                    :
                    null
                }
                <View style={{marginLeft: 10, borderLeftWidth: 1, borderColor: AppColors.primary.grey.thirtyPercent,}}>
                    <View>{section.content}</View>
                </View>
            </View>
        )
    };

    _handleSportsFormChange = (i, name, value) => {
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
            Alert.alert(
                'Error',
                'Please make sure to fill out all the sports related information before trying to add a new one!',
                [
                    {text: 'Try Again', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: true }
            )
        }
    };

    _removeSport = (index) => {
        const { handleFormChange, user } = this.props;
        if(index > 0) {
            let newSportsArray = _.cloneDeep(user.sports);
            newSportsArray.splice(index, 1);
            handleFormChange('sports', newSportsArray);
        } else {
            Alert.alert(
                'Error',
                'You cannot remove your first sport, at least one sport is required!',
                [
                    {text: 'Try Again', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: true }
            )
        }
    };

    render = () => {
        const {
            componentStep,
            currentStep,
            handleFormChange,
            heightPressed,
            user,
        } = this.props;
        // Accordion sections
        const SECTIONS = [
            {
                content: <UserAccountInfo
                    handleFormChange={handleFormChange}
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
                    user={user}
                />,
                header:   'TELL US ABOUT YOU',
                index:    2,
                subtitle: 'Now, let\'s understand how you train and how we can help you to get better!',
            },
            {
                content: <UserSports
                    addAnotherSport={this._addAnotherSport}
                    handleFormChange={this._handleSportsFormChange}
                    removeSport={this._removeSport}
                    sports={user.sports}
                />,
                header: 'SPORT DETAILS',
                index:  3,
            },
        ];
        return (
            <View style={[styles.wrapper, [componentStep === currentStep ? {} : {display: 'none'}] ]}>
                <View>
                    <Accordion
                        renderContent={this._renderContent}
                        renderHeader={this._renderHeader}
                        sections={SECTIONS}
                    />
                </View>
            </View>
        );
    }
}

UserAccount.propTypes = {
    componentStep:    PropTypes.number.isRequired,
    currentStep:      PropTypes.number.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    heightPressed:    PropTypes.func.isRequired,
    user:             PropTypes.object.isRequired,
};
UserAccount.defaultProps = {};
UserAccount.componentName = 'UserAccount';

/* Export Component ==================================================================== */
export default UserAccount;
