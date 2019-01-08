/**
 * ExerciseCompletionModal
 *
    <ExerciseCompletionModal
        completedExercises={completedExercises}
        exerciseList={exerciseList}
        isModalOpen={this.state.isModalOpen}
        onClose={this._closePrepareSessionsCompletionModal}
        onComplete={this._completePrepareExerciseCompletionModal}
        user={user}
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

const modalWidth = (AppSizes.screen.width * 0.9);
const thickness = 5;
let sessionIconWidth = ((modalWidth / 3) - 5);
let iconViewWrapperWidth = (sessionIconWidth - (thickness * 2));

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
class ExerciseCompletionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalStyle: {
                height: 200,
            },
            progressCounters: {},
        };
        this.animation = [];
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps.isModalOpen !== this.props.isModalOpen) {
            _.delay(() => {
                const completionModalExerciseList = MyPlanConstants.completionModalExerciseList(this.props.exerciseList, this.props.completedExercises);
                let newProgressCounters = _.cloneDeep(this.state.progressCounters);
                _.map(completionModalExerciseList, (exerciseGroup, group) => {
                    newProgressCounters[group] = (exerciseGroup.completed / exerciseGroup.total);
                    this.setState(
                        { progressCounters: newProgressCounters, },
                        () => { if(this.state.progressCounters[group] === 1 && this.animation[group] && this.animation[group].play) { this.animation[group].play(); } }
                    )
                });
            }, 1000);
        }
    }

    componentWillMount = () => {
        const completionModalExerciseList = MyPlanConstants.completionModalExerciseList(this.props.exerciseList, this.props.completedExercises);
        let newProgressCounters = _.cloneDeep(this.state.progressCounters);
        _.map(completionModalExerciseList, (exerciseGroup, group) => {
            newProgressCounters[group] = 0;
            this.setState({
                progressCounters: newProgressCounters,
            })
        });
    }

    _resizeModal = ev => {
        let oldHeight = this.state.modalStyle.height;
        let newHeight = parseInt(ev.nativeEvent.layout.height, 10);
        if(oldHeight !== newHeight) {
            this.setState({ modalStyle: {height: newHeight} });
        }
    }

    _closeModal = callback => {
        this.setState(
            {
                modalStyle: {
                    height: 200,
                },
                progressCounters: {},
            },
            () => {
                this.animation = [];
                callback();
            }
        );
    }

    render = () => {
        const {
            completedExercises,
            exerciseList,
            isFS,
            isModalOpen,
            onClose,
            onComplete,
            user,
        } = this.props;
        const { modalStyle, progressCounters, } = this.state;
        const isCompleted = completedExercises.length === exerciseList.totalLength;
        const completionModalExerciseList = MyPlanConstants.completionModalExerciseList(exerciseList, completedExercises);
        if(Object.keys(completionModalExerciseList).length === 1 || Object.keys(completionModalExerciseList).length === 2) {
            sessionIconWidth = (modalWidth * 0.50);
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
                                {_.map(completionModalExerciseList, (exerciseGroup, group) => {
                                    return(
                                        <View
                                            key={group}
                                            style={{alignItems: 'center', justifyContent: 'center', width: sessionIconWidth,}}
                                        >
                                            <ProgressCircle
                                                animated={true}
                                                borderWidth={0}
                                                children={
                                                    <View style={{flex: 1, width: iconViewWrapperWidth,}}>
                                                        <LottieView
                                                            loop={false}
                                                            ref={animation => {
                                                                this.animation[group] = animation;
                                                            }}
                                                            source={require('../../../../assets/animation/stars.json')}
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
                                                color={isFS ? AppColors.zeplin.seaBlue : AppColors.zeplin.success}
                                                indeterminate={false}
                                                progress={progressCounters[group]}
                                                showsText={false}
                                                size={(sessionIconWidth - AppSizes.paddingLrg)}
                                                strokeCap={'round'}
                                                textStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(40),}}
                                                thickness={thickness}
                                                unfilledColor={AppColors.zeplin.slate}
                                            />
                                            <Spacer size={AppSizes.paddingSml} />
                                            <Text oswaldMedium style={{color: isFS ? AppColors.zeplin.seaBlue : AppColors.zeplin.success, fontSize: AppFonts.scaleFont(13),}}>
                                                {group}
                                            </Text>
                                        </View>
                                    )
                                })}
                            </View>
                            <Text oswaldRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(30), textAlign: 'center',}}>
                                {`${isCompleted ? 'GREAT WORK' : 'ALMOST DONE'} ${user.personal_data.first_name.toUpperCase()}!`}
                            </Text>
                            <Spacer size={AppSizes.padding} />
                            { !isCompleted ?
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
                                    onPress={() => this._closeModal(() => onClose())}
                                    raised={false}
                                    rightIcon={{
                                        color: AppColors.white,
                                        name:  'chevron-right',
                                        size:  AppFonts.scaleFont(24),
                                        style: {flex: 1,},
                                    }}
                                    textStyle={{ flex: 8, fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                                    title={'Finish what I started'}
                                />
                                :
                                null
                            }
                            <Spacer size={isCompleted ? 0 : AppSizes.padding} />
                            <Button
                                backgroundColor={isCompleted ? AppColors.zeplin.yellow : AppColors.transparent}
                                buttonStyle={{alignSelf: 'center', borderRadius: 5, width: (modalWidth - (AppSizes.padding * 2)),}}
                                containerViewStyle={{marginLeft: 0, marginRight: 0}}
                                color={isCompleted ? AppColors.white : AppColors.zeplin.yellow}
                                fontFamily={AppStyles.robotoBold.fontFamily}
                                fontWeight={AppStyles.robotoBold.fontWeight}
                                leftIcon={{
                                    color: AppColors.transparent,
                                    name:  'chevron-right',
                                    size:  AppFonts.scaleFont(24),
                                    style: {flex: 1,},
                                }}
                                outline={isCompleted ? false : true}
                                onPress={() => this._closeModal(() => onComplete())}
                                raised={false}
                                rightIcon={{
                                    color: isCompleted ? AppColors.white : AppColors.transparent,
                                    name:  'chevron-right',
                                    size:  AppFonts.scaleFont(24),
                                    style: {flex: 1,},
                                }}
                                textStyle={{ flex: 8, fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                                title={'Complete'}
                            />
                            <Spacer size={AppSizes.paddingXLrg} />
                        </View>
                    </LinearGradient>
                </View>
            </Modal>
        )
    }
}

ExerciseCompletionModal.propTypes = {
    completedExercises: PropTypes.array.isRequired,
    exerciseList:       PropTypes.object.isRequired,
    isFS:               PropTypes.bool,
    isModalOpen:        PropTypes.bool.isRequired,
    onClose:            PropTypes.func.isRequired,
    onComplete:         PropTypes.func.isRequired,
    user:               PropTypes.object.isRequired,
};

ExerciseCompletionModal.defaultProps = {
    isFS: false,
};

ExerciseCompletionModal.componentName = 'ExerciseCompletionModal';

/* Export Component ================================================================== */
export default ExerciseCompletionModal;