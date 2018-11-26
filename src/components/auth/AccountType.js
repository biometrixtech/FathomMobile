/**
 * Account Type Screen
 *  - Entry screen when 'Create Account' button clicked
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, StyleSheet, TouchableHighlight, View, } from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';

// Components
import { Spacer, TabIcon, Text, } from '../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    contentWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    imageBackground: {
        height: AppSizes.screen.height,
        width:  AppSizes.screen.width,
    },
    mainLogo: {
        alignSelf: 'center',
        width:     AppSizes.screen.widthThird,
    },
});

/* Component ==================================================================== */
class AccountType extends Component {
    static componentName = 'AccountType';

    static propTypes = {};

    static defaultProps = {};

    render = () => {
        return(
            <View style={{flex: 1,}}>
                <ImageBackground
                    source={require('../../../assets/images/standard/start.png')}
                    style={[AppStyles.containerCentered, styles.imageBackground]}
                >
                    <View style={[styles.imageBackground, styles.contentWrapper,]}>
                        <TabIcon
                            containerStyle={[{position: 'absolute', top: (20 + AppSizes.statusBarHeight), left: 10}]}
                            icon={'arrow-left'}
                            iconStyle={[{color: AppColors.white,}]}
                            onPress={() => Actions.pop()}
                            reverse={false}
                            size={26}
                            type={'simple-line-icon'}
                        />
                        <Image
                            resizeMode={'contain'}
                            source={require('../../../assets/images/standard/fathom_logo_color_stacked.png')}
                            style={styles.mainLogo}
                        />
                        <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.white, fontSize: AppFonts.scaleFont(15),}]}>{'Choose account type:'}</Text>
                        <Spacer size={15} />
                        <TouchableHighlight onPress={() => Actions.inviteCode()} underlayColor={'rgba(0, 0, 0, 0)'}>
                            <View style={[AppStyles.containerCentered]}>
                                <TabIcon
                                    color={AppColors.white}
                                    containerStyle={[{borderColor: AppColors.white, borderRadius: (80 / 2), borderWidth: 2, height: 80, width: 80,}]}
                                    icon={'people'}
                                    size={40}
                                />
                                <Spacer size={15} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.primary.white.hundredPercent, fontSize: AppFonts.scaleFont(15),}]}>{'Team Athlete'}</Text>
                                <Spacer size={2} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.primary.white.hundredPercent, fontSize: AppFonts.scaleFont(12),}]}>{'I\'m joining FATHOM\nas a part of a team'}</Text>
                                <Spacer size={2} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(12),}]}>{'I have an invite code'}</Text>
                            </View>
                        </TouchableHighlight>
                        <Spacer size={35} />
                        <TouchableHighlight onPress={() => Actions.onboarding()} underlayColor={'rgba(0, 0, 0, 0)'}>
                            <View style={[AppStyles.containerCentered]}>
                                <TabIcon
                                    color={AppColors.white}
                                    containerStyle={[{borderColor: AppColors.white, borderRadius: (80 / 2), borderWidth: 2, height: 80, width: 80,}]}
                                    icon={'person'}
                                    size={40}
                                />
                                <Spacer size={15} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.primary.white.hundredPercent, fontSize: AppFonts.scaleFont(15),}]}>{'Individual Athlete'}</Text>
                                <Spacer size={2} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.primary.white.hundredPercent, fontSize: AppFonts.scaleFont(12),}]}>{'I\'m not joining FATHOM\nas a part of a team'}</Text>
                                <Spacer size={2} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(12),}]}>{'I do not have an invite code'}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default AccountType;