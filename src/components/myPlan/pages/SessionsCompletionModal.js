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
import Modal from 'react-native-modalbox';

// // Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, ProgressCircle, Spacer, Text, } from '../../custom';

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
            isConfettiAnimationVisible:  true,
            isConfettiAnimation2Visible: true,
            isConfettiAnimation3Visible: true,
            progressCounters:            {},
        };
        this.animation = {};
        this.animation2 = {};
        this.animation3 = {};
    }

    componentDidMount = () => {
        let filteredIconSessions = _.filter(this.props.sessions, session => {
            return (session.sport_name || session.sport_name === 0) ||
                (session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0);
        });
        _.delay(() => {
            let newProgressCounters = _.cloneDeep(this.state.progressCounters);
            _.map(filteredIconSessions, (session, i) => {
                _.delay(() => {
                    newProgressCounters[i] = 1;
                    this.setState(
                        { progressCounters: newProgressCounters, },
                        () => {
                            let isLast = Object.keys(this.state.progressCounters).length === (i + 1);
                            if(
                                isLast &&
                                this.animation &&
                                this.animation.play &&
                                this.animation2 &&
                                this.animation2.play &&
                                this.animation3 &&
                                this.animation3.play
                            ) {
                                this.animation.play();
                                this.animation2.play();
                                this.animation3.play();
                            }
                        }
                    );
                }, 500 * i);
            });
        }, 1500);
    }

    componentWillMount = () => {
        let filteredIconSessions = _.filter(this.props.sessions, session => {
            return (session.sport_name || session.sport_name === 0) ||
                (session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0);
        });
        let newProgressCounters = _.cloneDeep(this.state.progressCounters);
        _.map(filteredIconSessions, (session, i) => {
            newProgressCounters[i] = 0;
            this.setState({
                progressCounters: newProgressCounters,
            });
        });
    }

    _onClose = () => {
        const { onClose, } = this.props;
        let filteredIconSessions = _.filter(this.props.sessions, session => {
            return (session.sport_name || session.sport_name === 0) ||
                (session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0);
        });
        let newProgressCounters = _.cloneDeep(this.state.progressCounters);
        _.map(filteredIconSessions, (session, i) => {
            newProgressCounters[i] = 0;
            this.setState(
                {
                    isConfettiAnimationVisible:  true,
                    isConfettiAnimation2Visible: true,
                    isConfettiAnimation3Visible: true,
                    progressCounters:            {},
                },
                () => {
                    this.animation = {};
                    this.animation2 = {};
                    this.animation3 = {};
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
        const {
            isConfettiAnimationVisible,
            isConfettiAnimation2Visible,
            isConfettiAnimation3Visible,
            progressCounters,
        } = this.state;
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
            <Modal
                backdropColor={AppColors.zeplin.darkNavy}
                backdropOpacity={0.8}
                backdropPressToClose={false}
                coverScreen={true}
                isOpen={isModalOpen}
                position={'top'}
                style={[AppStyles.containerCentered, { backgroundColor: AppColors.transparent, }]}
                swipeToClose={false}
                useNativeDriver={false}
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
                            { isConfettiAnimationVisible ?
                                <LottieView
                                    loop={false}
                                    onAnimationFinish={() => this.setState({ isConfettiAnimationVisible: false, })}
                                    ref={animation => {this.animation = animation;}}
                                    source={require('../../../../assets/animation/confetti.json')}
                                />
                                :
                                null
                            }
                            { isConfettiAnimation2Visible ?
                                <LottieView
                                    loop={false}
                                    onAnimationFinish={() => this.setState({ isConfettiAnimation2Visible: false, })}
                                    ref={animation => {this.animation2 = animation;}}
                                    source={require('../../../../assets/animation/confetti.json')}
                                    speed={2}
                                />
                                :
                                null
                            }
                            { isConfettiAnimation3Visible ?
                                <LottieView
                                    loop={false}
                                    onAnimationFinish={() => this.setState({ isConfettiAnimation3Visible: false, })}
                                    ref={animation => {this.animation3 = animation;}}
                                    source={require('../../../../assets/animation/confetti.json')}
                                    speed={3}
                                />
                                :
                                null
                            }
                            <Button
                                backgroundColor={AppColors.zeplin.yellow}
                                buttonStyle={{alignSelf: 'center', borderRadius: 5, width: (modalWidth - (AppSizes.padding * 2)),}}
                                containerViewStyle={{marginLeft: 0, marginRight: 0, zIndex: 10,}}
                                color={AppColors.white}
                                fontFamily={AppStyles.robotoBold.fontFamily}
                                fontWeight={AppStyles.robotoBold.fontWeight}
                                leftIcon={{
                                    color: AppColors.zeplin.yellow,
                                    name:  'chevron-right',
                                    size:  AppFonts.scaleFont(24),
                                    style: {flex: 1,},
                                }}
                                outlined={false}
                                onPress={() => this._onClose()}
                                raised={false}
                                rightIcon={{
                                    color: AppColors.white,
                                    name:  'chevron-right',
                                    size:  AppFonts.scaleFont(24),
                                    style: {flex: 1,},
                                }}
                                textStyle={{ flex: 8, fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                                title={'Continue'}
                            />
                            <Spacer size={AppSizes.paddingXLrg} />
                        </View>
                    </LinearGradient>
                </View>
            </Modal>
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