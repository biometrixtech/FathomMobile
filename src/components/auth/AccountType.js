/**
 * Account Type Screen
 *  - Entry screen when 'Create Account' button clicked
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, StyleSheet, TouchableHighlight, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';

// Components
import { Spacer, TabIcon, Text, } from '../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    contentWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    iconContainerStyle: {
        borderColor:    AppColors.white,
        borderRadius:   (80 / 2),
        borderWidth:    2,
        height:         80,
        justifyContent: 'center',
        width:          80,
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

    static propTypes = {
        setAccountCode: PropTypes.func.isRequired,
    };

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
                        <TouchableHighlight onPress={() => Actions.inviteCode()} underlayColor={AppColors.transparent}>
                            <View style={[AppStyles.containerCentered]}>
                                <TabIcon
                                    color={AppColors.white}
                                    containerStyle={[styles.iconContainerStyle]}
                                    icon={'people'}
                                    size={40}
                                />
                                <Spacer size={15} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.white, fontSize: AppFonts.scaleFont(15),}]}>{'Team'}</Text>
                                <Spacer size={2} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.white, fontSize: AppFonts.scaleFont(12),}]}>{'I\'m joining FATHOM\nas a part of a team'}</Text>
                                <Spacer size={2} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(12),}]}>{'I have an invite code'}</Text>
                            </View>
                        </TouchableHighlight>
                        <Spacer size={35} />
                        <TouchableHighlight onPress={() => {this.props.setAccountCode(''); Actions.onboarding();}} underlayColor={AppColors.transparent}>
                            <View style={[AppStyles.containerCentered]}>
                                <TabIcon
                                    color={AppColors.white}
                                    containerStyle={[styles.iconContainerStyle]}
                                    icon={'person'}
                                    size={40}
                                />
                                <Spacer size={15} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.white, fontSize: AppFonts.scaleFont(15),}]}>{'Individual'}</Text>
                                <Spacer size={2} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.white, fontSize: AppFonts.scaleFont(12),}]}>{'I\'m not joining FATHOM\nas a part of a team'}</Text>
                                <Spacer size={2} />
                                <Text robotoMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(12),}]}>{'I do not have an invite code'}</Text>
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