/**
 * Sensor Onboarding Educational Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import AppIntroSlider from 'react-native-app-intro-slider';
import Video from 'react-native-video';

// Consts, Libs, and Utils
import { AppColors, AppFonts, AppStyles, AppSizes, ErrorMessages, } from '../../constants';
import { AppUtil, } from '../../lib';
import { onboardingUtils, } from '../../constants/utils';

// Components
import { Spacer, TabIcon, Text, } from '../custom/';

/* Component ==================================================================== */
class Tutorial extends Component {
    static componentName = 'Tutorial';

    static propTypes = {
        updateUser: PropTypes.func.isRequired,
        user:       PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            activeDotStyle:  {backgroundColor: AppColors.zeplin.darkGrey,},
            buttonTextStyle: {color: AppColors.zeplin.darkGrey,},
            dotStyle:        {backgroundColor: AppColors.zeplin.lightGrey,},
            showSkipButton:  false,
            slides:          onboardingUtils.getTutorialSlides(),
            uniqueValue:     0,
        }
        this._players = {};
        this._appIntroSlider = {};
    }

    componentDidMount = () => {
        // NOTE: this seems to be needed to 'refresh' the page to get new router information :(
        this.setState(
            {
                uniqueValue: this.state.uniqueValue + 1,
            },
            () => {
                // setup constants
                const step = Actions.currentParams.step;
                const slides = onboardingUtils.getTutorialSlides(step).slides;
                const showSkipButton = onboardingUtils.getTutorialSlides(step).showSkipButton;
                let videoPlaybackOptions = {};
                _.map(slides, slide => {
                    if(slide.videoLink) {
                        videoPlaybackOptions[slide.key] = {};
                        videoPlaybackOptions[slide.key].paused = true;
                    }
                });
                this.setState({
                    ...this.state,
                    showSkipButton,
                    slides,
                    videoPlaybackOptions,
                });
            },
        );
    }

    _handleIconClick = goToPage => {
        if(goToPage) {
            this._appIntroSlider.goToSlide(goToPage);
        } else {
            this._onDone();
        }
    }

    _onDone = () => {
        let payload = {};
        payload.onboarding_status = [Actions.currentParams.step];
        this.props.updateUser(payload, this.props.user.id);
        let newUserObj = _.cloneDeep(this.props.user);
        newUserObj.onboarding_status.push(Actions.currentParams.step);
        AppUtil.routeOnLogin(newUserObj, true);
    }

    _onSkip = () => {
        Actions.myPlan();
    }

    _onSlideChange = (index, lastIndex, slides) => {
        this._handleVideoPlayback(index, lastIndex, slides);
        let newButtonTextStyle = slides[index].buttonTextStyle;
        this.setState({ buttonTextStyle: newButtonTextStyle || {color: AppColors.zeplin.darkGrey,}, });
    }

    _handleVideoPlayback = (index, lastIndex, slides) => {
        // if we have a video on this slide, we want to:
        // (1) start this video
        // (2) pause and restart the previous video
        const currentSlide = slides[index];
        const lastSlide = slides[lastIndex];
        let newVideoPlaybackOptions = _.cloneDeep(this.state.videoPlaybackOptions);
        if(newVideoPlaybackOptions[currentSlide.key]) {
            newVideoPlaybackOptions[currentSlide.key].paused = false;
        }
        if(newVideoPlaybackOptions[lastSlide.key]) {
            newVideoPlaybackOptions[lastSlide.key].paused = true;
        }
        this.setState(
            {
                ...this.state,
                videoPlaybackOptions: newVideoPlaybackOptions,
            },
            () => {
                if(this._players[lastSlide.key]) {
                    this._players[lastSlide.key].seek(0);
                }
            },
        );
    }

    _renderItem = props => {
        // setup variables
        const videoPlaybackOptions = this.state.videoPlaybackOptions[props.key];
        const style = {
            backgroundColor:   props.backgroundColor ? props.backgroundColor : AppColors.white,
            flex:              1,
            height:            props.height,
            paddingBottom:     props.bottomSpacer,
            paddingHorizontal: AppSizes.paddingLrg,
            paddingTop:        props.topSpacer,
            width:             props.width,
        }
        // render item
        return(
            <View style={[style, AppStyles.containerCentered]}>
                <View style={{flex: props.videoLink ? 0 : props.image ? 4 : 0, overflow: 'hidden',}}>
                    { props.image && props.imageRight ?
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                            <View style={[props.imageLeftWrapperStyles ? props.imageLeftWrapperStyles : {alignItems: 'flex-end', width: AppSizes.screen.widthHalf,}]}>
                                <Image
                                    resizeMode={'contain'}
                                    source={props.image}
                                    style={{flex: 1, width: AppSizes.screen.widthFourFifths,}}
                                />
                            </View>
                            <View style={[props.imageRightWrapperStyles]}>
                                <Image
                                    resizeMode={'contain'}
                                    source={props.imageRight}
                                    style={[props.imageRightStyles]}
                                />
                            </View>
                        </View>
                        : props.image ?
                            <View style={{justifyContent: 'center',}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={props.image}
                                    style={{width: AppSizes.screen.widthFourFifths,}}
                                />
                            </View>
                            :
                            null
                    }
                </View>
                <View style={{flex: props.videoLink ? 1 : props.image ? 5 : 9, justifyContent: props.image ? 'flex-start' : props.videoLink ? 'flex-end' : 'center', paddingTop: props.image ? AppSizes.padding : 0,}}>
                    { props.title ?
                        <Text
                            oswaldMedium
                            style={props.titleStyle ? [props.titleStyle] : [AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(28),}]}
                        >
                            {props.title}
                        </Text>
                        :
                        null
                    }
                    { props.text ?
                        <View>
                            <Spacer size={props.title && props.title.length > 0 ? 20 : 0} />
                            <Text
                                robotoRegular
                                style={props.textStyle ? [props.textStyle] : [AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(16),}]}
                            >
                                {props.text}
                            </Text>
                        </View>
                        :
                        null
                    }
                    { props.subtext ?
                        <View>
                            <Spacer size={props.text && props.text.length > 0 ? 20 : 0} />
                            <Text
                                robotoRegular
                                style={props.subtextStyle ? [props.subtextStyle] : [AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(16),}]}
                            >
                                {props.subtext}
                            </Text>
                        </View>
                        :
                        null
                    }
                    { props.icon ?
                        <TabIcon
                            containerStyle={[{paddingVertical: AppSizes.paddingLrg,}]}
                            icon={props.icon.icon}
                            iconStyle={[{color: props.icon.color,}]}
                            onPress={() => this._handleIconClick(props.icon.goToPage)}
                            reverse={false}
                            size={45}
                            type={props.icon.type}
                        />
                        :
                        null
                    }
                </View>
                { props.videoLink ?
                    <View style={{flex: 9, paddingVertical: Platform.OS === 'ios' ? 0 : AppSizes.padding,}}>
                        <Video
                            paused={videoPlaybackOptions.paused}
                            ref={ref => {this._players[props.key] = ref;}}
                            repeat={true}
                            resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                            source={{uri: props.videoLink}}
                            style={{flex: 1, width: AppSizes.screen.widthTwoThirds,}}
                        />
                    </View>
                    :
                    null
                }
                { props.linkText ?
                    <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: AppSizes.padding,}}>
                        <Text onPress={this._routeToNextPage} style={[props.linkStyle]}>{props.linkText}</Text>
                    </View>
                    :
                    null
                }
            </View>
        );
    }

    render = () => {
        // render page
        return(
            <View style={{flex: 1,}}>
                <AppIntroSlider
                    activeDotStyle={this.state.activeDotStyle}
                    buttonTextStyle={this.state.buttonTextStyle}
                    doneLabel={'done'}
                    dotStyle={this.state.dotStyle}
                    nextLabel={'next'}
                    onDone={this._onDone}
                    onSkip={this._onSkip}
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
