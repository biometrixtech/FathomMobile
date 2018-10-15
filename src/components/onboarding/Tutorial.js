/**
 * Sensor Onboarding Educational Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, Platform, View, } from 'react-native';

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
import { Spacer, Text, } from '../custom/';

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
            loading:        false,
            showSkipButton: false,
            slides:         onboardingUtils.getTutorialSlides(),
            uniqueValue:    0,
        }
        this._players = {};
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

    _onDone = () => {
        this.setState({ loading: true, });
        let payload = {};
        payload.onboarding_status = 'tutorial-tutorial';
        this.props.updateUser(payload, this.props.user.id)
            .then(userRes => {
                this.setState({ loading: false, });
                AppUtil.routeOnLogin(userRes);
            })
            .catch(err => {
                this.setState({ loading: false, });
                AppUtil.handleAPIErrorAlert(ErrorMessages.updatingUser);
            });
    }

    _onSkip = () => {
        Actions.myPlan();
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
            backgroundColor: props.backgroundColor ? props.backgroundColor : AppColors.white,
            flex:            1,
            height:          props.height,
            paddingBottom:   props.bottomSpacer,
            paddingTop:      props.topSpacer,
            width:           props.width,
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
                <View style={{flex: props.videoLink ? 2 : props.image ? 5 : 9, justifyContent: props.image ? 'flex-start' : 'center', paddingTop: props.image ? AppSizes.padding : 0, width: AppSizes.screen.widthTwoThirds,}}>
                    <Text
                        oswaldMedium
                        style={[AppStyles.textCenterAligned, {fontSize: AppFonts.scaleFont(28),}]}
                    >
                        {props.title}
                    </Text>
                    { props.text ?
                        <View>
                            <Spacer size={20} />
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
                            <Spacer size={20} />
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
                </View>
                { props.videoLink ?
                    <View style={{flex: 8, paddingVertical: Platform.OS === 'ios' ? 0 : AppSizes.padding,}}>
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
                    activeDotStyle={{backgroundColor: AppColors.zeplin.darkGrey}}
                    buttonTextStyle={{color: AppColors.zeplin.darkGrey,}}
                    doneLabel={'done'}
                    dotStyle={{backgroundColor: AppColors.zeplin.lightGrey}}
                    nextLabel={'next'}
                    onDone={this._onDone}
                    onSkip={this._onSkip}
                    onSlideChange={(index, lastIndex) => this._handleVideoPlayback(index, lastIndex, this.state.slides)}
                    renderItem={this._renderItem}
                    showSkipButton={this.state.showSkipButton}
                    skipLabel={'skip'}
                    slides={this.state.slides}
                />
                { this.state.loading ?
                    <ActivityIndicator
                        color={AppColors.primary.yellow.hundredPercent}
                        size={'large'}
                        style={[AppStyles.activityIndicator]}
                    /> : null
                }
            </View>
        )
    }
}

/* Export Component ==================================================================== */
export default Tutorial;
