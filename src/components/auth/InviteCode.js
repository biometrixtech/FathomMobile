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
        setAccountCode:   PropTypes.func.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            account:         '',
            isSuccessOpen:   false,
            isVerifyingOpen: false,
            resultMsg:       {
                error:   '',
                status:  '',
                success: '',
            },
            form_values: {
                code: '',
                role: '',
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
                { isVerifyingOpen: true, },
                () => {
                    this.props.checkAccountCode(code)
                        .then(res => {
                            let role = res.account && res.account.codes && res.account.codes.coach === code ? 'coach' : 'athlete';
                            let newAccount = _.cloneDeep(res.account);
                            newAccount.code = code;
                            newAccount.role = role;
                            this.setState({ isSuccessOpen: true, isVerifyingOpen: false, account: newAccount, });
                        })
                        .catch(err => {
                            this.setState({ isVerifyingOpen: false, });
                            this._handleUpdateResultMsg('error', err.message);
                        });
                }
            );
        } else {
            this._handleUpdateResultMsg('error', 'please enter a valid account code.');
        }
    }

    _handleOnSuccesClicked = () => {
        this.setState(
            { isSuccessOpen: false, },
            () => {
                this.props.setAccountCode(this.state.account.code, this.state.account.role)
                    .then(res => Actions.onboarding({ accountCode: this.state.account.code, }));
            }
        );
    }

    render = () => {
        return(
            <Wrapper>
                <View style={[styles.contentWrapper, styles.imageBackground]}>
                    { this.state.isVerifyingOpen || this.state.isSuccessOpen ?
                        null
                        :
                        <TabIcon
                            containerStyle={[{position: 'absolute', top: (20 + AppSizes.statusBarHeight), left: 10}]}
                            icon={'arrow-left'}
                            iconStyle={[{color: AppColors.white,}]}
                            onPress={() => Actions.pop()}
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
                    { this.state.isVerifyingOpen ?
                        <View style={[AppStyles.containerCentered, {flex: 7,}]}>
                            <ProgressCircle
                                borderWidth={5}
                                color={AppColors.zeplin.yellow}
                                formatText={'Verifying'}
                                indeterminate={true}
                                showsText={true}
                                size={AppSizes.screen.widthTwoThirds}
                                textStyle={{...AppStyles.oswaldMedium, color: AppColors.white, fontSize: AppFonts.scaleFont(40),}}
                            />
                            <Spacer size={50} />
                        </View>
                        : this.state.isSuccessOpen ?
                            <View style={[AppStyles.containerCentered, {flex: 7,}]}>
                                <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.white, fontSize: AppFonts.scaleFont(40),}]}>{'Success!'}</Text>
                                <Spacer size={20} />
                                <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.white, fontSize: AppFonts.scaleFont(14),}]}>{'Continue to Create Account'}</Text>
                                <Spacer size={10} />
                                <TabIcon
                                    icon={'arrow-right-circle'}
                                    iconStyle={[{color: AppColors.zeplin.yellow,}]}
                                    onPress={() => this._handleOnSuccesClicked()}
                                    reverse={false}
                                    size={45}
                                    type={'simple-line-icon'}
                                />
                                <Spacer size={50} />
                            </View>
                            :
                            <View style={[AppStyles.containerCentered, {flex: 7,}]}>
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
                                    containerStyle={{width: AppSizes.screen.widthTwoThirds,}}
                                    inputStyle = {[{color: AppColors.zeplin.yellow, paddingTop: 25, textAlign: 'center',}]}
                                    keyboardType={'default'}
                                    onChangeText={(text) => this._handleFormChange('code', text)}
                                    onSubmitEditing={() => this._handleFormSubmit()}
                                    placeholder={'code'}
                                    placeholderTextColor={AppColors.zeplin.yellow}
                                    returnKeyType={'done'}
                                    value={this.state.form_values.code}
                                />
                                <Spacer size={10} />
                                <Text robotoRegular style={[AppStyles.textCenterAligned, {color: AppColors.white, fontSize: AppFonts.scaleFont(15), opacity: 0.7,}]}>{'case sensitive'}</Text>
                                <Spacer size={30} />
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.white, alignSelf: 'center', paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: '85%',}}
                                    onPress={() => this._handleFormSubmit()}
                                    title={'Join'}
                                    titleStyle={{ color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(18), }}
                                />
                                <Spacer size={20} />
                                <Text onPress={() => Actions.onboarding()} robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), opacity: 0.7, textDecorationLine: 'none',}}>{'I do not have an invite code.'}</Text>
                            </View>
                    }
                    <View style={{flex: 3,}} />
                </View>
            </Wrapper>
        );
    }
}

/* Export Component ==================================================================== */
export default InviteCode;