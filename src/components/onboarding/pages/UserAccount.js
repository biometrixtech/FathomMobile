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
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

// Consts, Libs, and Utils
import { AppColors, AppSizes } from '../../../constants';
import { onboardingUtils } from '../../../constants/utils';
import { Text } from '../../custom';

// import components
import { UserAccountAbout, UserAccountInfo, UserSports } from './';

// import third-party libraries
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    // cardWrapper: {
    //     alignItems:      'center',
    //     backgroundColor: AppColors.primary.grey.thirtyPercent,
    //     borderRadius:    5,
    //     height:          AppSizes.screen.height / 5,
    //     justifyContent:  'center',
    //     marginBottom:    15,
    //     position:        'relative',
    //     width:           '100%',
    // },
    coachText: {
        flex:     1,
        flexWrap: 'wrap'
    },
    coachWrapper: {
        backgroundColor: AppColors.primary.grey.thirtyPercent,
        borderRadius:    5,
        flexDirection:   'row',
        marginBottom:    5,
        padding:         20,
    },
    headerWrapper: {
        flexDirection: 'row',
        paddingTop:    10,
    },
    // overlay: {
    //     alignItems:      'center',
    //     backgroundColor: 'rgba(117, 117, 117, 0.8)',
    //     borderRadius:    5,
    //     height:          '100%',
    //     justifyContent:  'center',
    //     position:        'absolute',
    //     width:           '100%',
    // },
    // text: {
    //     fontWeight: 'bold',
    //     fontSize:   15,
    // },
    textWrapper: {
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
                    <Image
                        source={isFormValid ?
                            require('../../../constants/assets/images/checked-circle.png')
                            :
                            require('../../../constants/assets/images/unchecked-circle.png')
                        }
                        style={{width: 20, height: 20, marginRight: 10}}
                    />
                    <Text style={[styles.title]}>{section.header}</Text>
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
                    <View style={[styles.coachWrapper]}>
                        <Image
                            source={require('../../../constants/assets/images/coach-avatar.png')}
                            style={{width: 30, height: 30, marginRight: 10}}
                        />
                        <Text style={[styles.coachText]}>{section.subtitle}</Text>
                    </View>
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
        let newSportsArray = user.sports;
        newSportsArray[i][name] = value;
        handleFormChange('sports', newSportsArray);
    };

    _handleSeasonChange = (i, name, value) => {
        const { handleFormChange, user } = this.props;
        let newSportsArray = user.sports;
        newSportsArray[i.sport].seasons[i.season][name] = value;
        handleFormChange('sports', newSportsArray);
    };

    _addAnotherSport = (index) => {
        const { handleFormChange, user } = this.props;
        // TODO: check if current sport is valid
        const newSeason = {
            levelOfPlay:     '',
            positions:       [],
            seasonEndDate:   null,
            seasonStartDate: null,
        };
        const newUserSport = {
            seasons:      [newSeason],
            sport:        '',
            yearsInSport: null,
        };
        let newSportsArray = user.sports;
        newSportsArray.push(newUserSport);
        handleFormChange('sports', newSportsArray);
        /*const sportValidation = onboardingUtils.isSportValid(user.sports[index]);
        if(sportValidation.isValid) {
            console.log('TRUE');
        } else {
            // TODO: ERROR NOTIFICATION HERE
            console.log('NOT TRUE');
        }*/
    };

    _addAnotherSeason = (index) => {
        const { handleFormChange, user } = this.props;
        // TODO: check if current season is valid
        const newSeason = {
            levelOfPlay:     '',
            positions:       [],
            seasonEndDate:   null,
            seasonStartDate: null,
        };
        let newSeasonsArray = user.sports[index].seasons;
        newSeasonsArray.push(newSeason);
        handleFormChange('seasons', newSeasonsArray);
        // console.log(index, user.seasons[index]);
        // const sportValidation = onboardingUtils.isSportValid(user.sports[index].season);
        // if(sportValidation.isValid) {
        //     console.log('TRUE');
        // } else {
        //     // TODO: ERROR NOTIFICATION HERE
        //     console.log('NOT TRUE');
        // }
    };

    render = () => {
        const {
            componentStep
            , currentStep
            , handleFormChange
            , heightPressed
            , user
        } = this.props;
        // Accordion sections
        const SECTIONS = [
            {
                content: <UserAccountInfo
                    handleFormChange={handleFormChange}
                    user={user}
                />,
                header:   'Account Information',
                index:    1,
                subtitle: 'Let\'s start with creating your account, then we\'ll be ready to develop your routine.',
            },
            {
                content: <UserAccountAbout
                    handleFormChange={handleFormChange}
                    heightPressed={heightPressed}
                    user={user}
                />,
                header:   'Tell us about you',
                index:    2,
                subtitle: 'Now, let\'s understand how you train and how we can help you to get better!',
            },
            {
                content: <UserSports
                    addAnotherSeason={this._addAnotherSeason}
                    addAnotherSport={this._addAnotherSport}
                    handleFormChange={this._handleSportsFormChange}
                    handleSeasonChange={this._handleSeasonChange}
                    sports={user.sports}
                />,
                header: 'Sport Details',
                index:  3,
            },
        ];
        return (
            <View style={[styles.wrapper, [componentStep === currentStep ? {} : {display: 'none'}] ]}>
                <View style={[styles.textWrapper]}>
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
