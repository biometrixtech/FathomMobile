/**
 * Exercises Exercise
 *
    <ExercisesExercise
        closeModal={closeModal}
        completedExercises={completedExercises}
        currentSlideIndex={currentSlideIndex}
        exercise={exercise}
        exerciseTimer={timers[index] && timers[index].seconds_per_set ? timers[index] : null}
        handleCompleteExercise={handleCompleteExercise}
        handleUpdateFirstTimeExperience={handleUpdateFirstTimeExperience}
        index={index}
        nextExercise={nextExercise}
        user={user}
    />
 *
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import TimerCountdown from 'react-native-timer-countdown';
import Video from 'react-native-video';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { ProgressCircle, Spacer, TabIcon, Text, Tooltip, } from '../../custom';
import { Error, } from '../../general';

/* Component ==================================================================== */
const TooltipContent = ({ handleTooltipClose, text, }) => (
    <View style={{backgroundColor: AppColors.zeplin.success, padding: AppSizes.paddingSml,}}>
        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(13),}}>{text}</Text>
        <Spacer size={10} />
        <View style={{flex: 1, flexDirection: 'row',}}>
            <View style={{flex: 2,}} />
            <View style={{flex: 6,}} />
            <TouchableOpacity
                onPress={handleTooltipClose}
                style={{flex: 2,}}
            >
                <Text
                    robotoMedium
                    style={{
                        color:    AppColors.white,
                        fontSize: AppFonts.scaleFont(15),
                    }}
                >
                    {'GOT IT'}
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

class ExercisesExercise extends PureComponent {
    constructor(props) {
        super(props);
        const { completedExercises, exercise, } = this.props;
        this.state = {
            areAllTimersCompleted:     completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? true : false,
            isDescriptionToolTipOpen:  false,
            preExerciseTime:           0,
            startFirstSet:             false,
            startPreExerciseCountdown: false,
            startSecondSet:            false,
            startSwitchSidesInterval:  false,
            switchSideTime:            0,
        };
    }

    componentDidMount = () => {
        const { user, } = this.props;
        _.delay(() => {
            if(!user.first_time_experience.includes('exercise_description_tooltip')) {
                this.setState({ isDescriptionToolTipOpen: true, });
            }
        }, 750);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { completedExercises, currentSlideIndex, exercise, index, user, } = this.props;
        if(
            prevProps.currentSlideIndex !== currentSlideIndex &&
            currentSlideIndex !== index &&
            user.first_time_experience.includes('exercise_description_tooltip')
        ) {
            // reset timer
            this._resetTimer();
        } else if(
            prevProps.currentSlideIndex !== currentSlideIndex &&
            currentSlideIndex === index &&
            !completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) &&
            user.first_time_experience.includes('exercise_description_tooltip')
        ) {
            // start timer
            this._startTimer();
        } else if(
            prevProps.currentSlideIndex !== currentSlideIndex &&
            currentSlideIndex === index &&
            completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) &&
            user.first_time_experience.includes('exercise_description_tooltip')
        ) {
            // timer should be in done state
            this.setState({ areAllTimersCompleted: true, });
        }
    }

    _startTimer = () => {
        _.delay(() => {
            this.setState(
                { startPreExerciseCountdown: true, },
                () => this._startPreExerciseCountdown(),
            );
        }, 1000);
    }

    _resetTimer = (restartTimer = false) => {
        this.setState(
            {
                areAllTimersCompleted:     false,
                isDescriptionToolTipOpen:  false,
                preExerciseTime:           0,
                startFirstSet:             false,
                startPreExerciseCountdown: false,
                startSecondSet:            false,
                startSwitchSidesInterval:  false,
                switchSideTime:            0,
            },
            () => {
                this.setState(
                    { startPreExerciseCountdown: restartTimer, },
                    () => { if(restartTimer) { this._startPreExerciseCountdown(); } },
                );
            },
        );
    }

    _startPreExerciseCountdown = () => {
        const { exerciseTimer, } = this.props;
        _.delay(() => {
            this.setState(
                { preExerciseTime: (this.state.preExerciseTime + 1 / exerciseTimer.pre_start_time), },
                () => {
                    if((this.state.preExerciseTime * exerciseTimer.pre_start_time) !== exerciseTimer.pre_start_time) {
                        this._startPreExerciseCountdown();
                    } else {
                        _.delay(() => this.setState({ startFirstSet: true, startPreExerciseCountdown: false, }), 500);
                    }
                },
            );
        }, 1000);
    }

    _startSwitchSideCountdown = () => {
        const { exerciseTimer, } = this.props;
        _.delay(() => {
            this.setState(
                { switchSideTime: (this.state.switchSideTime + 1 / exerciseTimer.switch_sides_time), },
                () => {
                    if((this.state.switchSideTime * exerciseTimer.switch_sides_time) !== exerciseTimer.switch_sides_time) {
                        this._startSwitchSideCountdown();
                    } else {
                        _.delay(() => this.setState({ startSwitchSidesInterval: false, startSecondSet: true, }), 500);
                    }
                },
            );
        }, 1000);
    }

    render = () => {
        const {
            closeModal,
            completedExercises,
            currentSlideIndex,
            exercise,
            exerciseTimer,
            handleCompleteExercise,
            handleUpdateFirstTimeExperience,
            index,
            nextExercise,
            user,
        } = this.props;
        const {
            areAllTimersCompleted,
            isDescriptionToolTipOpen,
            preExerciseTime,
            startFirstSet,
            startPreExerciseCountdown,
            startSecondSet,
            startSwitchSidesInterval,
            switchSideTime,
        } = this.state;
        return(
            <View style={{backgroundColor: AppColors.transparent, flex: 1, justifyContent: 'center',}}>
                <View style={{backgroundColor: AppColors.white, borderRadius: 4,}}>
                    <Spacer size={5} />
                    <TabIcon
                        containerStyle={[{left: 10, position: 'absolute', top: 10, width: 20, zIndex: 100,}]}
                        color={AppColors.zeplin.lightSlate}
                        icon={'close'}
                        onPress={() => closeModal()}
                        raised={false}
                        size={20}
                        type={'material-community'}
                    />
                    { exercise.videoUrl.length > 0 ?
                        <Video
                            paused={currentSlideIndex === index ? false : true}
                            repeat={true}
                            resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                            source={{uri: exercise.videoUrl}}
                            style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: (AppSizes.screen.width * 0.85), width: (AppSizes.screen.width * 0.85),}]}
                        />
                        :
                        <Error type={'URL not defined.'} />
                    }
                    <View style={{paddingHorizontal: AppSizes.paddingMed, width: AppSizes.screen.width * 0.85,}}>
                        <Spacer size={10} />
                        <View style={{alignSelf: 'flex-end',}}>
                            <Tooltip
                                animated
                                backgroundColor={AppColors.transparent}
                                content={
                                    <TooltipContent
                                        handleTooltipClose={() =>
                                            this.setState(
                                                { isDescriptionToolTipOpen: false, },
                                                () => {
                                                    if(!user.first_time_experience.includes('exercise_description_tooltip')) {
                                                        handleUpdateFirstTimeExperience('exercise_description_tooltip');
                                                    }
                                                    this._startTimer();
                                                }
                                            )
                                        }
                                        text={exercise.description}
                                    />
                                }
                                contentStyle={{backgroundColor: AppColors.zeplin.success,}}
                                isVisible={isDescriptionToolTipOpen && currentSlideIndex === index}
                                onClose={() => this.setState({ isDescriptionToolTipOpen: false, })}
                                tooltipStyle={{left: 0, width: AppSizes.screen.widthThreeQuarters,}}
                            >
                                <TabIcon
                                    color={AppColors.zeplin.shadow}
                                    icon={'help'}
                                    iconStyle={[{marginHorizontal: AppSizes.paddingSml,}]}
                                    onPress={() => this.setState({ isDescriptionToolTipOpen: true, })}
                                    reverse={false}
                                    type={'material'}
                                />
                            </Tooltip>
                        </View>
                        <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(28),}]}>
                            {exercise.displayName}
                        </Text>
                        <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(14),}]}>
                            {exercise.longDosage.toUpperCase()}
                        </Text>
                        <Spacer size={10} />
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly',}}>
                            { exerciseTimer ?
                                areAllTimersCompleted ?
                                    <TabIcon
                                        color={AppColors.zeplin.shadow}
                                        icon={'restore'}
                                        onPress={() => this._resetTimer(true)}
                                        reverse={false}
                                        size={AppFonts.scaleFont(40)}
                                        type={'material'}
                                    />
                                    :
                                    null
                                :
                                null
                            }
                            { exerciseTimer ?
                                startPreExerciseCountdown ?
                                    <ProgressCircle
                                        animated={true}
                                        borderWidth={0}
                                        color={AppColors.zeplin.seaBlue}
                                        formatText={`${parseInt(preExerciseTime * exerciseTimer.pre_start_time, 10)}`}
                                        indeterminate={false}
                                        progress={preExerciseTime}
                                        showsText={true}
                                        size={(AppFonts.scaleFont(56) + (AppSizes.padding * 2))}
                                        strokeCap={'round'}
                                        textStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(56),}}
                                        thickness={5}
                                        unfilledColor={AppColors.zeplin.superLight}
                                    />
                                    : startFirstSet ?
                                        <TimerCountdown
                                            initialSecondsRemaining={1000*exerciseTimer.seconds_per_set}
                                            onTimeElapsed={() =>
                                                _.delay(() =>
                                                    this.setState(
                                                        { startFirstSet: false, startSwitchSidesInterval: exerciseTimer.number_of_sets === 2, areAllTimersCompleted: exerciseTimer.number_of_sets === 1, },
                                                        () => {
                                                            if(exerciseTimer.number_of_sets === 2) { this._startSwitchSideCountdown(); }
                                                        }
                                                    )
                                                , 500)
                                            }
                                            style={{ ...AppFonts.oswaldMedium, color: AppColors.darkBlue, fontSize: AppFonts.scaleFont(56), }}
                                        />
                                        : startSwitchSidesInterval ?
                                            <ProgressCircle
                                                animated={true}
                                                borderWidth={0}
                                                color={AppColors.zeplin.seaBlue}
                                                formatText={'SWITCH\nSIDES'}
                                                indeterminate={false}
                                                progress={switchSideTime}
                                                showsText={true}
                                                size={(AppFonts.scaleFont(56) + (AppSizes.padding * 2))}
                                                strokeCap={'round'}
                                                textStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}
                                                thickness={5}
                                                unfilledColor={AppColors.zeplin.superLight}
                                            />
                                            : startSecondSet ?
                                                <TimerCountdown
                                                    initialSecondsRemaining={1000*exerciseTimer.seconds_per_set}
                                                    onTimeElapsed={() => _.delay(() => this.setState({ areAllTimersCompleted: true, startSecondSet: false, }), 500)}
                                                    style={{ ...AppFonts.oswaldMedium, color: AppColors.darkBlue, fontSize: AppFonts.scaleFont(56), }}
                                                />
                                                : areAllTimersCompleted ?
                                                    <Text oswaldMedium style={{color: AppColors.darkBlue, fontSize: AppFonts.scaleFont(56),}}>{'00:00'}</Text>
                                                    :
                                                    null
                                :
                                null
                            }
                            <TabIcon
                                containerStyle={[{alignSelf: 'center',}]}
                                icon={completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? 'ios-checkbox' : 'ios-checkbox-outline'}
                                iconStyle={[{color: completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? AppColors.zeplin.yellow : AppColors.zeplin.light,}]}
                                onPress={() => {
                                    this._resetTimer();
                                    handleCompleteExercise(exercise.library_id, exercise.set_number, nextExercise);
                                }}
                                reverse={false}
                                size={50}
                                type={'ionicon'}
                            />
                        </View>
                        <Spacer size={10} />
                        {/* nextExercise ?
                            <View style={{alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: AppSizes.paddingSml,}}>
                                <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(12), paddingRight: AppSizes.paddingSml,}}>{`UP NEXT: ${nextExercise.displayName}`}</Text>
                                <Image
                                    resizeMode={'contain'}
                                    source={{uri: nextExercise.thumbnailUrl}}
                                    style={{height: 50, width: 50,}}
                                />
                            </View>
                            :
                            null
                        */}
                    </View>
                </View>
            </View>
        )
    }
}

ExercisesExercise.propTypes = {
    closeModal:                      PropTypes.func.isRequired,
    completedExercises:              PropTypes.array.isRequired,
    currentSlideIndex:               PropTypes.number.isRequired,
    exercise:                        PropTypes.object.isRequired,
    exerciseTimer:                   PropTypes.object,
    handleCompleteExercise:          PropTypes.func.isRequired,
    handleUpdateFirstTimeExperience: PropTypes.func.isRequired,
    index:                           PropTypes.number.isRequired,
    nextExercise:                    PropTypes.object,
    user:                            PropTypes.object.isRequired,
};

ExercisesExercise.defaultProps = {
    exerciseTimer: null,
    nextExercise:  null,
};

ExercisesExercise.componentName = 'ExercisesExercise';

/* Export Component ================================================================== */
export default ExercisesExercise;