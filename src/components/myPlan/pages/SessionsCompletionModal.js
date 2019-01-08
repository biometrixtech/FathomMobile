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
import { Platform, StyleSheet, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modalbox';

// // Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, ProgressCircle, Spacer, TabIcon, Text, } from '../../custom';

const modalText = MyPlanConstants.randomizeSessionsCompletionModalText();
const modalWidth = (AppSizes.screen.width * 0.9);
let sessionIconWidth = (modalWidth / 3);

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
        flex:              1,
        overflow:          'visible',
        paddingHorizontal: 50,
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 10 },
        shadowRadius:  15,
        shadowOpacity: 1,
    },
});

/* Component ==================================================================== */
class SessionsCompletionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalStyle: {
                height: 200,
            },
            progressCounter: 0,
        };
        this.animation = [];
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps.isModalOpen !== this.props.isModalOpen) {
            let filteredIconSessions = _.filter(this.props.sessions, session => {
                return (session.sport_name || session.sport_name === 0) ||
                    (session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0);
            });
            _.delay(() => {
                this.setState(
                    { progressCounter: 1, },
                    () => {
                        _.map(filteredIconSessions, (session, i) => {
                            if(this.state.progressCounter === 1 && this.animation[i] && this.animation[i].play) {
                                this.animation[i].play();
                            }
                        })
                    }
                );
            }, 1000);
        }
    }

    _resizeModal = ev => {
        let oldHeight = this.state.modalStyle.height;
        let newHeight = parseInt(ev.nativeEvent.layout.height, 10);
        if(oldHeight !== newHeight) {
            this.setState({ modalStyle: {height: newHeight} });
        }
    }

    render = () => {
        const {
            isModalOpen,
            onClose,
            sessions,
        } = this.props;
        const { modalStyle, progressCounter, } = this.state;
        let filteredIconSessions = _.filter(sessions, session => {
            return (session.sport_name || session.sport_name === 0) ||
                (session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0);
        });
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
            >
                <View
                    style={[
                        modalStyle,
                        Platform.OS === 'ios' ? styles.shadowEffect : {elevation: 2},
                        {backgroundColor: AppColors.transparent, width: modalWidth,}
                    ]}
                >
                    <LinearGradient
                        colors={[AppColors.zeplin.lightNavy, AppColors.zeplin.darkBlue, AppColors.zeplin.darkNavy, AppColors.black]}
                        start={{x: 0.0, y: 0.0}}
                        end={{x: 1, y: 1}}
                        style={[styles.linearGradientStyle]}
                    >
                        <View onLayout={ev => this._resizeModal(ev)}>
                            <Spacer size={AppSizes.paddingXLrg} />
                            <View style={[styles.iconRowWrapper]}>
                                {_.map(filteredIconSessions, (session, i) => {
                                    let selectedSession = session.sport_name || session.sport_name === 0 ?
                                        _.filter(MyPlanConstants.teamSports, ['index', session.sport_name])[0]
                                        :
                                        _.filter(MyPlanConstants.strengthConditioningTypes, ['index', session.strength_and_conditioning_type])[0];
                                    let thickness = 5;
                                    let iconViewWrapperWidth = (sessionIconWidth - (thickness * 2));
                                    let iconSize = AppFonts.scaleFont(60);
                                    if(filteredIconSessions.length === 1 || filteredIconSessions.length === 2) {
                                        sessionIconWidth = (modalWidth * 0.50);
                                        iconSize = AppFonts.scaleFont(90);
                                    }
                                    return(
                                        <View
                                            key={i}
                                            style={[
                                                {alignItems: 'center', justifyContent: 'center', width: sessionIconWidth,},
                                                i === 3 ?
                                                    {marginTop: AppSizes.paddingSml, marginLeft: (sessionIconWidth / 2),}
                                                    : i === 4 ?
                                                        {marginTop: AppSizes.paddingSml, marginRight: (sessionIconWidth / 2),}
                                                        :
                                                        {},
                                            ]}
                                        >
                                            <ProgressCircle
                                                animated={true}
                                                borderWidth={0}
                                                children={
                                                    <View style={{alignItems: 'center', justifyContent: 'center', width: iconViewWrapperWidth,}}>
                                                        <TabIcon
                                                            color={progressCounter === 1 ? AppColors.zeplin.yellow : AppColors.white}
                                                            icon={selectedSession.icon}
                                                            size={iconSize}
                                                            type={selectedSession.iconType}
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
                                                progress={progressCounter}
                                                showsText={false}
                                                size={(sessionIconWidth - AppSizes.paddingLrg)}
                                                strokeCap={'round'}
                                                textStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(40),}}
                                                thickness={thickness}
                                                unfilledColor={AppColors.zeplin.slate}
                                            />
                                            <LottieView
                                                loop={false}
                                                ref={animation => {
                                                    this.animation[i] = animation;
                                                }}
                                                source={require('../../../../assets/animation/confetti.json')}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                            <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(25), textAlign: 'center',}}>{modalText.header}</Text>
                            <Spacer size={AppSizes.paddingSml} />
                            <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), paddingHorizontal: AppSizes.paddingLrg, textAlign: 'center',}}>{modalText.subtext}</Text>
                            <Spacer size={AppSizes.padding} />
                            <Button
                                backgroundColor={AppColors.zeplin.yellow}
                                buttonStyle={{alignSelf: 'center', borderRadius: 5, width: (modalWidth - (AppSizes.padding * 2)),}}
                                containerViewStyle={{marginLeft: 0, marginRight: 0}}
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
                                onPress={() => onClose()}
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