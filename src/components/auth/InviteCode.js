/**
 * Invite Code Screen
 *  - Validate Invite Code
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View, } from 'react-native';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';

// Components
import { Alerts, Button, FormInput, ProgressCircle, Spacer, TabIcon, Text, } from '../custom';

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

const Wrapper = props => Platform.OS === 'ios' ?
    (
        <KeyboardAvoidingView behavior={'padding'} style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            <ImageBackground
                source={require('../../../assets/images/standard/start.png')}
                style={[AppStyles.containerCentered, styles.imageBackground]}
            >
                {props.children}
            </ImageBackground>
        </KeyboardAvoidingView>
    ) :
    (
        <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            <ImageBackground
                source={require('../../../assets/images/standard/start.png')}
                style={[AppStyles.containerCentered, styles.imageBackground]}
            >
                {props.children}
            </ImageBackground>
        </View>
    );

/* Component ==================================================================== */
class InviteCode extends Component {
    static componentName = 'InviteCode';

    static propTypes = {
        checkAccountCode: PropTypes.func.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            account:              '',
            isSuccessModalOpen:   false,
            isVerifyingModalOpen: false,
            resultMsg:            {
                error:   '',
                status:  '',
                success: '',
            },
            form_values: {
                code: '',
            },
        };
    }

    _handleFormChange = (name, value) => {
        let newFormFields = _.update( this.state.form_values, name, () => value);
        this.setState({
            ['form_values']: newFormFields,
        });
    }

    _handleUpdateResultMsg = (name, value) => {
        let newFormFields = _.update( this.state.resultMsg, name, () => value);
        this.setState({
            ['resultMsg']: newFormFields,
        });
    }

    _handleFormSubmit = () => {
        let code = this.state.form_values.code;
        // close keyboard
        Keyboard.dismiss();
        if(code.length > 0) {
            this.setState(
                { isVerifyingModalOpen: true, },
                () => {
                    this.props.checkAccountCode(code)
                        .then(res => {
                            this.setState(
                                { isVerifyingModalOpen: false, account: res.account, },
                                () => _.delay(() => this.setState({ isSuccessModalOpen: true, }), 500)
                            );
                        })
                        .catch(err => {
                            this.setState({ isVerifyingModalOpen: false, });
                            this._handleUpdateResultMsg('error', 'invalid code, please try again');
                        });
                }
            );
        } else {
            this._handleUpdateResultMsg('error', 'please enter a valid code');
        }
    }

    render = () => {
        return(
            <Wrapper>
                <View style={[AppStyles.containerCentered, styles.imageBackground, styles.contentWrapper,]}>
                    { this.state.isVerifyingModalOpen || this.state.isSuccessModalOpen ?
                        null
                        :
                        <TabIcon
                            containerStyle={[{position: 'absolute', top: (20 + AppSizes.statusBarHeight), left: 10}]}
                            icon={'arrow-left'}
                            iconStyle={[{color: AppColors.white,}]}
                            onPress={() => Actions.accountType()}
                            reverse={false}
                            size={26}
                            type={'simple-line-icon'}
                        />
                    }
                    <Image
                        resizeMode={'contain'}
                        source={require('../../../assets/images/standard/fathom_logo_color_stacked.png')}
                        style={styles.mainLogo}
                    />
                    { this.state.isVerifyingModalOpen ?
                        <View style={[AppStyles.containerCentered]}>
                            <ProgressCircle
                                borderWidth={5}
                                color={AppColors.primary.yellow.hundredPercent}
                                formatText={'Verifying'}
                                indeterminate={true}
                                showsText={true}
                                size={AppSizes.screen.widthTwoThirds}
                                textStyle={{...AppStyles.oswaldMedium, color: AppColors.white, fontSize: AppFonts.scaleFont(40),}}
                            />
                            <Spacer size={50} />
                        </View>
                        : this.state.isSuccessModalOpen ?
                            <View style={[AppStyles.containerCentered,]}>
                                <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.white, fontSize: AppFonts.scaleFont(40),}]}>{'Success!'}</Text>
                                <Spacer size={20} />
                                <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.white, fontSize: AppFonts.scaleFont(14),}]}>{'Continue to Create Account'}</Text>
                                <Spacer size={5} />
                                <TabIcon
                                    containerStyle={[{paddingVertical: AppSizes.paddingLrg,}]}
                                    icon={'arrow-right-circle'}
                                    iconStyle={[{color: AppColors.primary.yellow.hundredPercent,}]}
                                    onPress={() => this.setState({ isSuccessModalOpen: false, }, () => Actions.onboarding({ accountCode: this.state.account.code, }))}
                                    reverse={false}
                                    size={45}
                                    type={'simple-line-icon'}
                                />
                                <Spacer size={50} />
                            </View>
                            :
                            <View style={[AppStyles.containerCentered,]}>
                                <Spacer size={this.state.resultMsg.error.length > 0 ? 0 : 20} />
                                <Alerts
                                    status={this.state.resultMsg.status}
                                    success={this.state.resultMsg.success}
                                    error={this.state.resultMsg.error}
                                />
                                <Spacer size={this.state.resultMsg.error.length > 0 ? 15 : 0} />
                                <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(20),}}>{'ENTER INVITE CODE'}</Text>
                                <Spacer size={5} />
                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), opacity: 0.8,}}>{'to join Fathom as a part of a team'}</Text>
                                <Spacer size={20} />
                                <FormInput
                                    autoCapitalize={'none'}
                                    blurOnSubmit={true}
                                    clearButtonMode={'while-editing'}
                                    inputStyle = {[{color: AppColors.primary.yellow.hundredPercent, textAlign: 'center', width: AppSizes.screen.widthTwoThirds,paddingTop: 25}]}
                                    keyboardType={'default'}
                                    onChangeText={(text) => this._handleFormChange('code', text)}
                                    placeholder={'code'}
                                    placeholderTextColor={AppColors.primary.yellow.hundredPercent}
                                    returnKeyType={'done'}
                                    value={this.state.form_values.code}
                                />
                                <Spacer size={40} />
                                <Button
                                    backgroundColor={AppColors.white}
                                    buttonStyle={[AppStyles.paddingVerticalSml, AppStyles.paddingHorizontal, {borderRadius: 0, justifyContent: 'center', width: '85%',}]}
                                    containerViewStyle={{ alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf, }}
                                    fontFamily={AppStyles.robotoBold.fontFamily}
                                    fontWeight={AppStyles.robotoBold.fontWeight}
                                    onPress={() => this._handleFormSubmit()}
                                    raised={false}
                                    textColor={AppColors.primary.yellow.hundredPercent}
                                    textStyle={{ fontSize: AppFonts.scaleFont(18), textAlign: 'center', width: '100%', }}
                                    title={'Join'}
                                />
                                <Spacer size={20} />
                                <Text onPress={() => Actions.onboarding()} robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), opacity: 0.7, textDecorationLine: 'none',}}>{'I do not have an invite code.'}</Text>
                            </View>
                    }
                </View>
            </Wrapper>
        );
    }
}

/* Export Component ==================================================================== */
export default InviteCode;