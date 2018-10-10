/**
 * Account Details Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppStyles, AppSizes, } from '../../constants';

// Components
import { Spacer, TabIcon, Text, } from '../custom/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.white,
        flex:            1,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
});

/* Component ==================================================================== */
class AccountDetails extends Component {
    static componentName = 'AccountDetails';

    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    static defaultProps = {}

    _handleNextButtonClicked = () => {
        if(this.props.user.onboarding_status && this.props.user.onboarding_status.includes('account_setup')) {
            Actions.myPlan();
        } else {
            Actions.onboarding();
        }
    }

    _handleResendButtonClicked = () => {
        // TODO: API CALL HERE FIRST
        Actions.resendEmail();
    }

    _handleChangeButtonClicked = () => {
        Actions.changeEmail();
    }

    render = () => {
        // TODO: UPDATE VARIABLES
        const isEmailVerified = false;
        const buyerName = 'Mazen Chami';
        return (
            <View style={[AppStyles.containerCentered, styles.background,]}>
                <View style={{flex: 1, justifyContent: 'space-between', width: AppSizes.screen.widthTwoThirds,}}>
                    <View style={{flex: 4, justifyContent: 'flex-end', paddingBottom: AppSizes.paddingXLrg,}}>
                        <Text
                            robotoBold
                            style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(20),}]}
                        >
                            {'Your Account\nhas been upgraded'}
                        </Text>
                        <Spacer size={15} />
                        <Text
                            robotoRegular
                            style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14),}]}
                        >
                            {`You\'re linked to a basic subscription\npayed by ${buyerName}.`}
                        </Text>
                    </View>
                    <View style={{flex: 4, justifyContent: 'center',}}>
                        <TabIcon
                            color={isEmailVerified ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.lightGrey}
                            icon={'arrow-right-circle'}
                            onPress={() => isEmailVerified ? this._handleNextButtonClicked() : null}
                            size={44}
                            type={'simple-line-icon'}
                        />
                        <Spacer size={15} />
                        { isEmailVerified ?
                            null
                            :
                            <Text
                                robotoMedium
                                style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(15),}]}
                            >
                                {'Verify your email before\ncontinuing to onboarding.'}
                            </Text>
                        }
                    </View>
                    <View style={{flex: 2, justifyContent: 'center',}}>
                        { isEmailVerified ?
                            null
                            :
                            <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                <Text
                                    onPress={() => this._handleResendButtonClicked()}
                                    robotoMedium
                                    style={[AppStyles.textCenterAligned, {color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(14), textDecorationLine: 'none',}]}
                                >
                                    {'resend email'}
                                </Text>
                                <Text
                                    onPress={() => this._handleChangeButtonClicked()}
                                    robotoMedium
                                    style={[AppStyles.textCenterAligned, {color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(14), textDecorationLine: 'none',}]}
                                >
                                    {'change email'}
                                </Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default AccountDetails;
