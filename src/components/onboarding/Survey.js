/**
 * Sensor Onboarding Educational Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, TouchableHighlight, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppUtil, } from '../../lib';

// Components
import { Button, FormInput, Spacer, Text, } from '../custom/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.white,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
    imageBackgroundStyle: {
        alignItems:      'center',
        alignSelf:       'stretch',
        backgroundColor: AppColors.transparent,
        flex:            1,
        justifyContent:  'center',
    },
    linearGradientStyle: {
        alignItems:        'center',
        alignSelf:         'stretch',
        flex:              1,
        overflow:          'visible',
        paddingHorizontal: AppSizes.paddingLrg,
        paddingVertical:   AppSizes.paddingLrg,
    },
});

/* Component ==================================================================== */
const Wrapper = props => Platform.OS === 'ios' ?
    (
        <KeyboardAvoidingView behavior={'padding'} style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            <ImageBackground
                source={require('../../../assets/images/standard/start_page_background.png')}
                style={[styles.imageBackgroundStyle]}
            >
                {props.children}
            </ImageBackground>
        </KeyboardAvoidingView>
    ) :
    (
        <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
            <ImageBackground
                source={require('../../../assets/images/standard/start_page_background.png')}
                style={[styles.imageBackgroundStyle]}
            >
                {props.children}
            </ImageBackground>
        </View>
    );

class Survey extends Component {
    static componentName = 'Survey';

    static propTypes = {
        postSurvey: PropTypes.func.isRequired,
        updateUser: PropTypes.func.isRequired,
        user:       PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            form_values: {
                typical_weekly_sessions: null,
                wearable_devices:        [],
            },
            otherField:    '',
            showTextInput: false,
        }
    }

    _handleFormChange = (name, value) => {
        let newFormFields;
        if(name === 'form_values.wearable_devices') {
            if(value === 'No') {
                newFormFields = _.update( this.state, name, () => [value]);
            } else {
                let newValue = _.cloneDeep(this.state.form_values.wearable_devices);
                if(newValue.includes(value)) {
                    newValue = _.without(newValue, value);
                } else {
                    newValue.push(value);
                }
                newValue = _.without(newValue, 'No');
                newFormFields = _.update( this.state, name, () => newValue);
            }
        } else {
            newFormFields = _.update( this.state, name, () => value);
        }
        this.setState(newFormFields);
    }

    _onDone = () => {
        let payload = _.cloneDeep(this.state.form_values);
        if(this.state.otherField.length > 0 && !payload.wearable_devices.includes('No')) {
            payload.wearable_devices.push(this.state.otherField);
        }
        let newUserObj = _.cloneDeep(this.props.user);
        newUserObj.onboarding_status.push('survey-questions');
        AppUtil.routeOnLogin(newUserObj);
        this.props.postSurvey(this.props.user.id, payload)
            .then(() => {
                let userPayload = {};
                userPayload.onboarding_status = ['survey-questions'];
                this.props.updateUser(userPayload, this.props.user.id);
            });
    }

    render = () => {
        const { form_values, otherField, showTextInput, } = this.state;
        let isValid = form_values.typical_weekly_sessions && (form_values.wearable_devices.length > 0 || otherField.length > 0);
        // render page
        return(
            <Wrapper>
                <LinearGradient
                    colors={['#ffffff00', 'white']}
                    start={{x: 0.0, y: 0.0}}
                    end={{x: 0.0, y: 0.25}}
                    style={[styles.linearGradientStyle]}
                >
                    { !form_values.typical_weekly_sessions ?
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                            <Text oswaldMedium style={{color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{'HOW ACTIVE ARE YOU NOW?'}</Text>
                            <Spacer size={AppSizes.padding} />
                            <Text robotoLight style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{'We\'ll use this info to determine how often you should Mobilize and Recover!'}</Text>
                            <Spacer size={AppSizes.padding} />
                            <TouchableHighlight
                                onPress={() => this._handleFormChange('form_values.typical_weekly_sessions', '0-1')}
                                style={{backgroundColor: form_values.typical_weekly_sessions === '0-1' ? AppColors.zeplin.yellow : AppColors.zeplin.superLight, borderRadius: 5, paddingVertical: AppSizes.padding, width: AppSizes.screen.widthThreeQuarters,}}
                                underlayColor={AppColors.transparent}
                            >
                                <Text robotoRegular style={{color: form_values.typical_weekly_sessions === '0-1' ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'0-1 workouts/week'}</Text>
                            </TouchableHighlight>
                            <Spacer size={AppSizes.paddingSml} />
                            <TouchableHighlight
                                onPress={() => this._handleFormChange('form_values.typical_weekly_sessions', '2-4')}
                                style={{backgroundColor: form_values.typical_weekly_sessions === '2-4' ? AppColors.zeplin.yellow : AppColors.zeplin.superLight, borderRadius: 5, paddingVertical: AppSizes.padding, width: AppSizes.screen.widthThreeQuarters,}}
                                underlayColor={AppColors.transparent}
                            >
                                <Text robotoRegular style={{color: form_values.typical_weekly_sessions === '2-4' ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'2-4 workouts/week'}</Text>
                            </TouchableHighlight>
                            <Spacer size={AppSizes.paddingSml} />
                            <TouchableHighlight
                                onPress={() => this._handleFormChange('form_values.typical_weekly_sessions', '5+')}
                                style={{backgroundColor: form_values.typical_weekly_sessions === '5+' ? AppColors.zeplin.yellow : AppColors.zeplin.superLight, borderRadius: 5, paddingVertical: AppSizes.padding, width: AppSizes.screen.widthThreeQuarters,}}
                                underlayColor={AppColors.transparent}
                            >
                                <Text robotoRegular style={{color: form_values.typical_weekly_sessions === '5+' ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'5+ workouts/week'}</Text>
                            </TouchableHighlight>
                        </View>
                        :
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                            <Text oswaldMedium style={{color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{'DO YOU USE A WEARABLE DEVICE WHILE TRAINING?'}</Text>
                            <Spacer size={AppSizes.padding} />
                            <Text robotoLight style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{'We will soon sync with your device to log activity & monitor training volume!'}</Text>
                            <Spacer size={AppSizes.padding} />
                            <Text robotoMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{'Select all that apply'}</Text>
                            <Spacer size={AppSizes.padding} />
                            <View style={{flexDirection: 'row', justifyContent: 'space-evenly',}}>
                                <TouchableHighlight
                                    onPress={() => this._handleFormChange('form_values.wearable_devices', 'No')}
                                    style={{backgroundColor: form_values.wearable_devices.includes('No') ? AppColors.zeplin.yellow : AppColors.zeplin.superLight, borderRadius: 5, flex: 4, paddingVertical: AppSizes.padding,}}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text robotoRegular style={{color: form_values.wearable_devices.includes('No') ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'No'}</Text>
                                </TouchableHighlight>
                                <View style={{flex: 0.5,}} />
                                <TouchableHighlight
                                    onPress={() => this._handleFormChange('form_values.wearable_devices', 'Apple Watch')}
                                    style={{backgroundColor: form_values.wearable_devices.includes('Apple Watch') ? AppColors.zeplin.yellow : AppColors.zeplin.superLight, borderRadius: 5, flex: 4, paddingVertical: AppSizes.padding,}}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text robotoRegular style={{color: form_values.wearable_devices.includes('Apple Watch') ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'Apple Watch'}</Text>
                                </TouchableHighlight>
                            </View>
                            <Spacer size={AppSizes.paddingSml} />
                            <View style={{flexDirection: 'row', justifyContent: 'space-evenly',}}>
                                <TouchableHighlight
                                    onPress={() => this._handleFormChange('form_values.wearable_devices', 'Garmin')}
                                    style={{backgroundColor: form_values.wearable_devices.includes('Garmin') ? AppColors.zeplin.yellow : AppColors.zeplin.superLight, borderRadius: 5, flex: 4, paddingVertical: AppSizes.padding,}}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text robotoRegular style={{color: form_values.wearable_devices.includes('Garmin') ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'Garmin'}</Text>
                                </TouchableHighlight>
                                <View style={{flex: 0.5,}} />
                                <TouchableHighlight
                                    onPress={() => this._handleFormChange('form_values.wearable_devices', 'Fitbit')}
                                    style={{backgroundColor: form_values.wearable_devices.includes('Fitbit') ? AppColors.zeplin.yellow : AppColors.zeplin.superLight, borderRadius: 5, flex: 4, paddingVertical: AppSizes.padding,}}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text robotoRegular style={{color: form_values.wearable_devices.includes('Fitbit') ? AppColors.white : AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'Fitbit'}</Text>
                                </TouchableHighlight>
                            </View>
                            <Spacer size={AppSizes.paddingSml} />
                            { showTextInput && !form_values.wearable_devices.includes('No') ?
                                <FormInput
                                    autoCapitalize={'none'}
                                    blurOnSubmit={true}
                                    clearButtonMode={'never'}
                                    containerStyle={[{borderBottomColor: AppColors.zeplin.darkSlate, paddingBottom: AppSizes.paddingXSml,}]}
                                    inputStyle={[{color: AppColors.zeplin.yellow, textAlign: 'center', width: AppSizes.screen.widthTwoThirds,}]}
                                    keyboardType={'default'}
                                    onChangeText={(text) => this._handleFormChange('otherField', text)}
                                    placeholder={'other'}
                                    placeholderTextColor={AppColors.zeplin.darkSlate}
                                    returnKeyType={'done'}
                                    value={otherField}
                                />
                                :
                                <TouchableHighlight
                                    onPress={() => this.setState({ showTextInput: true, })}
                                    style={{backgroundColor: AppColors.zeplin.superLight, borderRadius: 5, paddingVertical: AppSizes.padding, width: (AppSizes.screen.width - (AppSizes.paddingLrg * 2)),}}
                                    underlayColor={AppColors.transparent}
                                >
                                    <Text robotoRegular style={{color: AppColors.zeplin.blueGrey, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'Other'}</Text>
                                </TouchableHighlight>
                            }
                            <Spacer size={AppSizes.paddingSml} />
                            <Button
                                backgroundColor={AppColors.zeplin.yellow}
                                buttonStyle={{alignSelf: 'center', borderRadius: 5, width: '100%',}}
                                containerViewStyle={{marginLeft: 0, marginRight: 0, width: '100%',}}
                                color={AppColors.white}
                                disabled={!isValid}
                                disabledStyle={{backgroundColor: AppColors.white, borderColor: AppColors.zeplin.shadow, borderWidth: 1,}}
                                disabledTextStyle={{color: AppColors.zeplin.shadow,}}
                                fontFamily={AppStyles.robotoMedium.fontFamily}
                                fontWeight={AppStyles.robotoMedium.fontWeight}
                                outlined={false}
                                onPress={() => this._onDone()}
                                raised={false}
                                textStyle={{ flex: 1, fontSize: AppFonts.scaleFont(18), textAlign: 'center', }}
                                title={'Submit'}
                            />
                        </View>
                    }
                </LinearGradient>
            </Wrapper>
        )
    }
}

/* Export Component ==================================================================== */
export default Survey;
