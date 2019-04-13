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
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

// // Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, FathomModal, ProgressCircle, Spacer, Text, } from '../../custom';

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
class ExerciseCompletionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressCounters: {},
        };
        this.animation = [];
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
            this.mainTimer = _.delay(() => {
                const completionModalExerciseList = MyPlanConstants.completionModalExerciseList(this.props.exerciseList, this.props.completedExercises, this.props.isFS);
                let newProgressCounters = _.cloneDeep(this.state.progressCounters);
                let index = 0;
                _.map(completionModalExerciseList, (exerciseGroup, group) => {
                    this.iconTimers[group] = _.delay(() => {
                        newProgressCounters[group] = (exerciseGroup.completed / exerciseGroup.total);
                        this.setState(
                            { progressCounters: newProgressCounters, },
                            () => { if(this.state.progressCounters[group] === 1 && this.animation[group] && this.animation[group].play) { this.animation[group].play(); } }
                        );
                    }, 500 * index);
                    index = index + 1;
                });
            }, 1000);
        }
    }

    componentWillMount = () => {
        const completionModalExerciseList = MyPlanConstants.completionModalExerciseList(this.props.exerciseList, this.props.completedExercises, this.props.isFS);
        let newProgressCounters = _.cloneDeep(this.state.progressCounters);
        _.map(completionModalExerciseList, (exerciseGroup, group) => {
            newProgressCounters[group] = 0;
            this.setState({
                progressCounters: newProgressCounters,
            });
        });
    }

    _closeModal = callback => {
        const completionModalExerciseList = MyPlanConstants.completionModalExerciseList(this.props.exerciseList, this.props.completedExercises, this.props.isFS);
        let newProgressCounters = _.cloneDeep(this.state.progressCounters);
        _.map(completionModalExerciseList, (exerciseGroup, group) => {
            newProgressCounters[group] = 0;
            this.setState(
                { progressCounters: newProgressCounters, },
                () => { if(this.animation[group] && this.animation[group].reset) { this.animation[group].reset(); } }
            );
        });
        callback();
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
        const { progressCounters, } = this.state;
        const isCompleted = completedExercises.length === exerciseList.totalLength;
        const completionModalExerciseList = MyPlanConstants.completionModalExerciseList(exerciseList, completedExercises, this.props.isFS);
        let sessionIconWidth = ((modalWidth / 3) - 5);
        let iconViewWrapperWidth = (sessionIconWidth - (thickness * 2));
        if(Object.keys(completionModalExerciseList).length === 1 || Object.keys(completionModalExerciseList).length === 2) {
            sessionIconWidth = (modalWidth * 0.50);
        }
        let userFirstName = user && user.personal_data && user.personal_data.first_name && user.personal_data.first_name.length > 0 ?
            user.personal_data.first_name.toUpperCase()
            :
            '';
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
                                                            ref={animation => {this.animation[group] = animation;}}
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
                                {`${isCompleted ? 'GREAT WORK' : 'ALMOST DONE'} ${userFirstName}!`}
                            </Text>
                            <Spacer size={AppSizes.padding} />
                            { !isCompleted ?
                                <Button
                                    buttonStyle={{alignSelf: 'center', backgroundColor: AppColors.zeplin.yellow, width: (modalWidth - (AppSizes.padding * 2)),}}
                                    containerStyle={{marginLeft: 0, marginRight: 0,}}
                                    onPress={() => this._closeModal(() => onClose())}
                                    title={'Finish what I started'}
                                    titleStyle={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                                />
                                :
                                null
                            }
                            <Spacer size={isCompleted ? 0 : AppSizes.padding} />
                            <Button
                                buttonStyle={{alignSelf: 'center', backgroundColor: isCompleted ? AppColors.zeplin.yellow : AppColors.transparent, borderColor: isCompleted ? AppColors.transparent : AppColors.zeplin.yellow, width: (modalWidth - (AppSizes.padding * 2)),}}
                                containerStyle={{marginLeft: 0, marginRight: 0,}}
                                onPress={() => this._closeModal(() => onComplete())}
                                title={'Complete'}
                                titleStyle={{color: isCompleted ? AppColors.white : AppColors.zeplin.yellow, flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}
                                type={isCompleted ? 'solid' : 'outline'}
                            />
                            <Spacer size={AppSizes.paddingXLrg} />
                        </View>
                    </LinearGradient>
                </View>
            </FathomModal>
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