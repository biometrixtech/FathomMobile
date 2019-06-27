/**
 * Sensor Onboarding Educational Screen
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, Platform, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import AppIntroSlider from 'react-native-app-intro-slider';
import PushNotification from 'react-native-push-notification';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppStyles, AppSizes, } from '../../constants';
import { AppUtil, } from '../../lib';
import { onboardingUtils, } from '../../constants/utils';

// Components
import { Button, TabIcon, Text, } from '../custom/';

/* Component ==================================================================== */
class Tutorial extends Component {
    static componentName = 'Tutorial';

    static propTypes = {
        step:       PropTypes.string.isRequired,
        updateUser: PropTypes.func.isRequired,
        user:       PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            activeDotStyle:  {backgroundColor: AppColors.zeplin.yellow,},
            buttonTextStyle: {color: AppColors.white,},
            doneLabel:       'next',
            dotStyle:        {backgroundColor: AppColors.white,},
            showSkipButton:  false,
            slides:          onboardingUtils.getTutorialSlides(),
        }
        this._players = {};
        this._appIntroSlider = {};
    }

    componentDidMount = () => {
        // setup constants
        const step = this.props.step;
        const slides = onboardingUtils.getTutorialSlides(step).slides;
        const showSkipButton = onboardingUtils.getTutorialSlides(step).showSkipButton;
        this.setState({
            ...this.state,
            showSkipButton,
            slides,
        });
    }

    _onDone = () => {
        AppUtil.pushToScene('onboarding');
    }

    _renderItem = props => {
        // setup variables
        const style = {
            backgroundColor: props.backgroundColor ? props.backgroundColor : AppColors.white,
            flex:            1,
        };
        // render item
        return(
            <View style={[AppStyles.containerCentered, style]}>
                <ImageBackground
                    source={props.backgroundImage}
                    style={{flex: 1, flexDirection: 'column', width: AppSizes.screen.width,}}
                >
                    <View style={{flexDirection: 'row', marginHorizontal: AppSizes.padding, marginTop: AppSizes.statusBarHeight,}}>
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                            { props.key === 'tutorial-1' &&
                                <TabIcon
                                    color={AppColors.white}
                                    icon={'chevron-left'}
                                    onPress={() => Actions.pop()}
                                    size={40}
                                    type={'material-community'}
                                />
                            }
                        </View>
                        { props.icon &&
                            <Image
                                source={props.icon}
                                style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
                            />
                        }
                        <View style={{flex: 1,}} />
                    </View>
                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', marginBottom: 16 + 26 + (AppSizes.isIphoneX ? 34 : 0), marginHorizontal: AppSizes.paddingLrg,}}>
                        { props.title &&
                            <Text style={[props.titleStyle,]}>{props.title}</Text>
                        }
                        { props.image &&
                            <Image
                                source={props.image}
                                style={[props.imageStyle,]}
                            />
                        }
                        { props.showEnableBtn &&
                            <Button
                                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthTwoThirds,}}
                                onPress={() => Platform.OS === 'ios' ?
                                    PushNotification
                                        .requestPermissions()
                                        .then(grant => this._onDone())
                                        .catch(err => this._onDone())
                                    :
                                    this._onDone()
                                }
                                raised={true}
                                title={'Enable Notifications'}
                                titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                            />
                        }
                        { props.text &&
                            props.text
                        }
                    </View>
                </ImageBackground>
            </View>
        );
    }

    _onSlideChange = (index, lastIndex, slides) => {
        // update done label
        let doneLabel = slides[index].doneLabel ? slides[index].doneLabel : 'next';
        this.setState({ doneLabel: doneLabel, });
    }

    render = () => {
        // render page
        return(
            <View style={{flex: 1,}}>
                <AppIntroSlider
                    activeDotStyle={this.state.activeDotStyle}
                    buttonTextStyle={this.state.buttonTextStyle}
                    doneLabel={this.state.doneLabel}
                    dotStyle={this.state.dotStyle}
                    nextLabel={'next'}
                    onDone={this._onDone}
                    onSlideChange={(index, lastIndex) => this._onSlideChange(index, lastIndex, this.state.slides)}
                    prevLabel={'back'}
                    ref={ref => {this._appIntroSlider = ref;}}
                    renderItem={this._renderItem}
                    showPrevButton={true}
                    showSkipButton={this.state.showSkipButton}
                    skipLabel={'skip'}
                    slides={this.state.slides}
                />
            </View>
        )
    }
}

/* Export Component ==================================================================== */
export default Tutorial;
