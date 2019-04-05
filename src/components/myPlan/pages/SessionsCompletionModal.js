/**
 * SessionsCompletionModal
 *
    <SessionsCompletionModal
        isModalOpen={this.state.isModalOpen}
        onClose={this._closePrepareSessionsCompletionModal}
        sessions={[]}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StyleSheet, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

// // Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, FathomModal, ProgressCircle, Spacer, Text, } from '../../custom';

const modalText = MyPlanConstants.randomizeSessionsCompletionModalText();
const modalWidth = (AppSizes.screen.width * 0.9);
const thickness = 5;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    iconRowWrapper: {
        alignItems:     'center',
        flexDirection:  'row',
        flexWrap:       'wrap',
        justifyContent: 'space-evenly',
        paddingBottom:  AppSizes.paddingLrg,
        width:          modalWidth,
    },
    linearGradientStyle: {
        alignItems:        'center',
        alignSelf:         'stretch',
        borderRadius:      4,
        overflow:          'visible',
        paddingHorizontal: 50,
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { height: 10, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  15,
    },
});

/* Component ==================================================================== */
class SessionsCompletionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressCounters: [],
        };
        this.animation = {};
        this.animation2 = {};
        this.animation3 = {};
        this.iconTimers = [];
        this.mainTimer = {};
    }

    componentWillUnmount = () => {
        // clear timers
        clearInterval(this.mainTimer);
        _.map(this.iconTimers, (timer, i) => clearInterval(this.iconTimers[i]));
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps.isModalOpen !== this.props.isModalOpen) {
            let filteredIconSessions = _.filter(this.props.sessions, session => {
                return (session.sport_name || session.sport_name === 0) ||
                    (session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0);
            });
            this.mainTimer = _.delay(() => {
                let newProgressCounters = _.cloneDeep(this.state.progressCounters);
                _.map(filteredIconSessions, (session, i) => {
                    this.iconTimers[i] = _.delay(() => {
                        newProgressCounters[i] = 1;
                        this.setState(
                            { progressCounters: newProgressCounters, },
                            () => {
                                if(this.state.progressCounters.length === (i + 1)) {
                                    if(this.animation && this.animation.play) {
                                        this.animation.play();
                                    }
                                    if(this.animation2 && this.animation2.play) {
                                        this.animation2.play();
                                    }
                                    if(this.animation3 && this.animation3.play) {
                                        this.animation3.play();
                                    }
                                }
                            }
                        );
                    }, 500 * i);
                });
            }, 1500);
        }
    }

    componentWillMount = () => {
        let filteredIconSessions = _.filter(this.props.sessions, session => {
            return (session.sport_name || session.sport_name === 0) ||
                (session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0);
        });
        let newProgressCounters = _.cloneDeep(this.state.progressCounters);
        _.map(filteredIconSessions, (session, i) => {
            newProgressCounters[i] = 0;
            this.setState({ progressCounters: newProgressCounters, });
        });
    }

    _onClose = () => {
        const { onClose, } = this.props;
        let filteredIconSessions = _.filter(this.props.sessions, session => {
            return (session.sport_name || session.sport_name === 0) ||
                (session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0);
        });
        _.map(filteredIconSessions, (session, i) => {
            this.setState(
                { progressCounters: [], },
                () => {
                    if(this.animation && this.animation.reset) { this.animation.reset(); }
                    if(this.animation2 && this.animation2.reset) { this.animation2.reset(); }
                    if(this.animation3 && this.animation3.reset) { this.animation3.reset(); }
                }
            );
        });
        onClose();
    }

    render = () => {
        const {
            isModalOpen,
            sessions,
        } = this.props;
        const { progressCounters, } = this.state;
        let filteredIconSessions = _.filter(sessions, session => {
            return (session.sport_name || session.sport_name === 0) ||
                (session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0);
        });
        let iconSize = AppFonts.scaleFont(60);
        let sessionIconWidth = (modalWidth / 3);
        if(filteredIconSessions.length === 1 || filteredIconSessions.length === 2) {
            sessionIconWidth = (modalWidth * 0.50);
            iconSize = AppFonts.scaleFont(90);
        }
        return(
            <FathomModal
                isVisible={isModalOpen}
                style={[AppStyles.containerCentered, {backgroundColor: AppColors.transparent, margin: 0,}]}
            >
                <View style={{backgroundColor: AppColors.transparent, flex: 1, justifyContent: 'center', width: modalWidth,}}>
                    <LinearGradient
                        colors={[AppColors.zeplin.lightNavy, AppColors.zeplin.darkBlue, AppColors.zeplin.darkNavy, AppColors.black]}
                        start={{x: 0.0, y: 0.0}}
                        end={{x: 1, y: 1}}
                        style={[styles.linearGradientStyle]}
                    >
                        <View style={[Platform.OS === 'ios' ? styles.shadowEffect : {elevation: 2}]}>
                            <Spacer size={AppSizes.paddingXLrg} />
                            <View style={[styles.iconRowWrapper]}>
                                {_.map(filteredIconSessions, (session, i) => {
                                    let selectedSession = session.sport_name || session.sport_name === 0 ?
                                        _.filter(MyPlanConstants.teamSports, ['index', session.sport_name])[0]
                                        :
                                        _.filter(MyPlanConstants.strengthConditioningTypes, ['index', session.strength_and_conditioning_type])[0];
                                    return(
                                        <View
                                            key={i}
                                            style={[
                                                {alignItems: 'center', justifyContent: 'center', width: sessionIconWidth,},
                                                i === 3 ?
                                                    {marginTop: AppSizes.paddingSml, marginLeft: filteredIconSessions.length === 5 ? (sessionIconWidth / 2) : 0,}
                                                    : i === 4 ?
                                                        {marginTop: AppSizes.paddingSml, marginRight: filteredIconSessions.length === 5 ? (sessionIconWidth / 2) : 0,}
                                                        :
                                                        {},
                                            ]}
                                        >
                                            <ProgressCircle
                                                animated={true}
                                                borderWidth={0}
                                                children={
                                                    <View style={{alignItems: 'center', justifyContent: 'center',}}>
                                                        <Image
                                                            source={selectedSession.imagePath}
                                                            style={{
                                                                height:    iconSize,
                                                                tintColor: progressCounters[i] === 1 ? AppColors.zeplin.yellow : AppColors.white,
                                                                width:     iconSize,
                                                            }}
                                                        />
                                                    </View>
                                                }
                                                childrenViewStyle={{
                                                    alignItems:     'center',
                                                    bottom:         0,
                                                    justifyContent: 'center',
                                                    left:           0,
                                                    position:       'absolute',
                                                    right:          0,
                                                    top:            0,
                                                }}
                                                color={AppColors.zeplin.seaBlue}
                                                indeterminate={false}
                                                progress={progressCounters[i]}
                                                showsText={false}
                                                size={(sessionIconWidth - AppSizes.paddingLrg)}
                                                strokeCap={'round'}
                                                textStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(40),}}
                                                thickness={thickness}
                                                unfilledColor={AppColors.zeplin.slate}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                            <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(25), textAlign: 'center',}}>{modalText.header}</Text>
                            <Spacer size={AppSizes.paddingSml} />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), paddingHorizontal: AppSizes.paddingLrg, textAlign: 'center',}}>{modalText.subtext}</Text>
                            <Spacer size={AppSizes.padding} />
                            <LottieView
                                loop={false}
                                ref={animation => {this.animation = animation;}}
                                source={require('../../../../assets/animation/confetti.json')}
                            />
                            <LottieView
                                loop={false}
                                ref={animation => {this.animation2 = animation;}}
                                source={require('../../../../assets/animation/confetti.json')}
                                speed={2}
                            />
                            <LottieView
                                loop={false}
                                ref={animation => {this.animation3 = animation;}}
                                source={require('../../../../assets/animation/confetti.json')}
                                speed={3}
                            />
                            <Button
                                buttonStyle={{alignSelf: 'center', backgroundColor: AppColors.zeplin.yellow, width: (modalWidth - (AppSizes.padding * 2)),}}
                                containerStyle={{marginLeft: 0, marginRight: 0, zIndex: 10,}}
                                onPress={() => this._onClose()}
                                title={'Continue'}
                                titleStyle={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                            />
                            <Spacer size={AppSizes.paddingXLrg} />
                        </View>
                    </LinearGradient>
                </View>
            </FathomModal>
        )
    }
}

SessionsCompletionModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    onClose:     PropTypes.func.isRequired,
    sessions:    PropTypes.array.isRequired,
};

SessionsCompletionModal.defaultProps = {};

SessionsCompletionModal.componentName = 'SessionsCompletionModal';

/* Export Component ================================================================== */
export default SessionsCompletionModal;