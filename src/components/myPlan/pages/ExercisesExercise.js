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
        progressPillsHeight={progressPillsHeight}
        user={user}
    />
 *
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LottieView from 'lottie-react-native';
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
            isMounted:                 false,
            isPaused:                  false,
            modalHeight:               0,
            preExerciseTime:           0,
            showAnimation:             false,
            startFirstSet:             false,
            startPreExerciseCountdown: false,
            startSecondSet:            false,
            startSwitchSidesInterval:  false,
            switchSideTime:            0,
            timer:                     null,
            timerSeconds:              5,
        };
        this._cleanTime = this._cleanTime.bind(this);
        this._firstSetTick = this._firstSetTick.bind(this);
        this._preExerciseTick = this._preExerciseTick.bind(this);
        this._resetTimer = this._resetTimer.bind(this);
        this._secondSetTick = this._secondSetTick.bind(this);
        this._startPreExerciseCountdown = this._startPreExerciseCountdown.bind(this);
        this._startSwitchSideCountdown = this._startSwitchSideCountdown.bind(this);
        this._startTimer = this._startTimer.bind(this);
        this._switchSidesTick = this._switchSidesTick.bind(this);
        this.animation = {};
    }

    componentDidMount = () => {
        const { completedExercises, exercise, user, } = this.props;
        if(!user.first_time_experience.includes('exercise_description_tooltip')) {
            // show tooltip, that'll then start timer
            this.setState({ isDescriptionToolTipOpen: true, });
        }
        this.setState({
            areAllTimersCompleted:     completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? true : false,
            isMounted:                 true,
            startPreExerciseCountdown: !completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? true : false,
        });
    }

    componentWillUnmount = () => {
        clearInterval(this.state.timer);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { completedExercises, currentSlideIndex, exercise, exerciseTimer, index, user, } = this.props;
        const { showAnimation, } = this.state;
        if(
            exerciseTimer &&
            user.first_time_experience.includes('exercise_description_tooltip')
        ) {
            if(
                prevProps.currentSlideIndex !== currentSlideIndex &&
                currentSlideIndex !== index
            ) {
                // reset timer
                this._resetTimer();
            } else if(
                prevProps.currentSlideIndex !== currentSlideIndex &&
                currentSlideIndex === index &&
                !completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`)
            ) {
                // start timer
                this._startTimer();
            } else if(
                prevProps.currentSlideIndex !== currentSlideIndex &&
                currentSlideIndex === index &&
                completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`)
            ) {
                // timer should be in done state
                this.setState({ areAllTimersCompleted: true, startPreExerciseCountdown: false, });
            }
            if(
                prevState.showAnimation !== showAnimation &&
                showAnimation
            ) {
                // pulse checkbox
                _.delay(() => {
                    this.animation.play();
                }, 500);
            }
        }
    }

    _firstSetTick = () => {
        const { timer, timerSeconds, } = this.state;
        const { exerciseTimer, } = this.props;
        if(timerSeconds === 0) {
            _.delay(() => {
                this.setState(
                    {
                        areAllTimersCompleted:    exerciseTimer.number_of_sets === 1,
                        startFirstSet:            false,
                        startSwitchSidesInterval: exerciseTimer.number_of_sets === 2,
                        timerSeconds:             exerciseTimer.switch_sides_time,
                        showAnimation:            exerciseTimer.number_of_sets === 2 ? false: true,
                    },
                    () => {
                        if(exerciseTimer.number_of_sets === 2) { this._startSwitchSideCountdown(); }
                    }
                );
                clearInterval(timer);
            }, 500);
        } else {
            this.setState({ timerSeconds: (timerSeconds - 1), });
        }
    }

    _secondSetTick = () => {
        const { timer, timerSeconds, } = this.state;
        if(timerSeconds === 0) {
            _.delay(() => {
                this.setState({
                    areAllTimersCompleted: true,
                    showAnimation:         true,
                    startSecondSet:        false,
                    timerSeconds:          0,
                });
                clearInterval(timer);
            }, 500);
        } else {
            this.setState({ timerSeconds: (timerSeconds - 1), });
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

    _resetTimer = (restartTimer = false, shouldCloseModal = false) => {
        const { closeModal, completedExercises, exercise, } = this.props;
        clearInterval(this.state.timer);
        this.setState(
            {
                areAllTimersCompleted:     completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? true : false,
                isDescriptionToolTipOpen:  false,
                isPaused:                  false,
                modalHeight:               0,
                preExerciseTime:           0,
                showAnimation:             false,
                startFirstSet:             false,
                startPreExerciseCountdown: restartTimer,
                startSecondSet:            false,
                startSwitchSidesInterval:  false,
                switchSideTime:            0,
                timer:                     null,
                timerSeconds:              5,
            },
            () => {
                if(restartTimer) { this._startPreExerciseCountdown(); }
                if(shouldCloseModal) { closeModal(); }
            },
        );
    }

    _startPreExerciseCountdown = () => {
        let timer = setInterval(this._preExerciseTick, 1000);
        this.setState({ timer, });
    }

    _preExerciseTick = () => {
        const { preExerciseTime, timer, timerSeconds, } = this.state;
        const { exerciseTimer, } = this.props;
        let preStartTime = exerciseTimer && exerciseTimer.pre_start_time ? exerciseTimer.pre_start_time : 0;
        if((preExerciseTime * preStartTime) !== preStartTime) {
            this.setState({ preExerciseTime: (this.state.preExerciseTime + 1 / preStartTime), timerSeconds: (timerSeconds - 1), });
        } else {
            clearInterval(timer);
            _.delay(() => {
                let firstTickTimer = setInterval(this._firstSetTick, 1000);
                this.setState({
                    startFirstSet:             true,
                    startPreExerciseCountdown: false,
                    timer:                     firstTickTimer,
                    timerSeconds:              exerciseTimer.seconds_per_set,
                });
            }, 500);
        }
    }

    _startSwitchSideCountdown = () => {
        let timer = setInterval(this._switchSidesTick, 1000);
        this.setState({ timer, });
    }

    _switchSidesTick = () => {
        const { switchSideTime, timer, timerSeconds, } = this.state;
        const { exerciseTimer, } = this.props;
        let switchSidesTime = exerciseTimer && exerciseTimer.switch_sides_time ? exerciseTimer.switch_sides_time : 0;
        if((switchSideTime * switchSidesTime) !== switchSidesTime) {
            this.setState({ switchSideTime: (this.state.switchSideTime + 1 / switchSidesTime), timerSeconds: (timerSeconds + 1), });
        } else {
            clearInterval(timer);
            _.delay(() => {
                let switchSidesTimer = setInterval(this._secondSetTick, 1000);
                this.setState({
                    startSwitchSidesInterval: false,
                    startSecondSet:           true,
                    timer:                    switchSidesTimer,
                    timerSeconds:             exerciseTimer.seconds_per_set,
                });
            }, 500);
        }
    }

    _pauseTimer = (shouldPause, openTooltip = false) => {
        const { startFirstSet, startPreExerciseCountdown, startSecondSet, startSwitchSidesInterval, timer, } = this.state;
        clearInterval(timer);
        this.setState({
            isDescriptionToolTipOpen: openTooltip,
            isPaused:                 shouldPause,
        }, () => {
            _.delay(() => {
                let newTimer = timer;
                if(!shouldPause) {
                    if(startFirstSet) {
                        newTimer = setInterval(this._firstSetTick, 1000);
                    } else if(startSecondSet) {
                        newTimer = setInterval(this._secondSetTick, 1000);
                    } else if(startPreExerciseCountdown) {
                        newTimer = setInterval(this._preExerciseTick, 1000);
                    } else if(startSwitchSidesInterval) {
                        newTimer = setInterval(this._switchSidesTick, 1000);
                    }
                }
                this.setState({ timer: newTimer, });
            }, 500);
        });
    }

    _cleanTime = seconds => {
        let sec_num = parseInt(seconds, 10);
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let secs = sec_num - (hours * 3600) - (minutes * 60);
        if (hours < 10) {hours = '0'+hours;}
        if (minutes < 10) {minutes = '0'+minutes;}
        if (secs < 10) {secs = '0'+secs;}
        return minutes+':'+secs;
    }

    _resizeModal = ev => {
        let oldHeight = this.state.modalHeight;
        let newHeight = parseInt(ev.nativeEvent.layout.height, 10);
        if(oldHeight !== newHeight) {
            this.setState({
                modalHeight: newHeight,
            });
        }
    }

    render = () => {
        const {
            completedExercises,
            currentSlideIndex,
            exercise,
            exerciseTimer,
            handleCompleteExercise,
            handleUpdateFirstTimeExperience,
            index,
            nextExercise,
            progressPillsHeight,
            user,
        } = this.props;
        const {
            areAllTimersCompleted,
            isDescriptionToolTipOpen,
            isPaused,
            modalHeight,
            preExerciseTime,
            showAnimation,
            startFirstSet,
            startPreExerciseCountdown,
            startSecondSet,
            startSwitchSidesInterval,
            switchSideTime,
            timerSeconds,
        } = this.state;
        let displayNameFontSize = ((progressPillsHeight + modalHeight) === AppSizes.screen.height) ? AppFonts.scaleFont(22) : AppFonts.scaleFont(28);
        return(
            <View style={{backgroundColor: AppColors.transparent, flex: 1, justifyContent: 'center',}}>
                <View
                    onLayout={ev => this._resizeModal(ev)}
                    style={{backgroundColor: AppColors.white, borderRadius: 4,}}
                >
                    <Spacer size={5} />
                    <TabIcon
                        containerStyle={[{right: 10, position: 'absolute', top: 10, width: 26, zIndex: 100,}]}
                        color={AppColors.zeplin.lightSlate}
                        icon={'close'}
                        onPress={() => this._resetTimer(false, true)}
                        raised={false}
                        size={26}
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
                        <View style={{flexDirection: 'row',}}>
                            <View style={{flex: 1,}} />
                            <View style={{flex: 8,}}>
                                <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkNavy, fontSize: displayNameFontSize,}]}>
                                    {exercise.displayName}
                                </Text>
                            </View>
                            <View style={{flex: 1,}}>
                                <Tooltip
                                    animated
                                    backgroundColor={AppColors.transparent}
                                    content={
                                        <TooltipContent
                                            handleTooltipClose={() => {
                                                this._pauseTimer(false, false);
                                                if(!user.first_time_experience.includes('exercise_description_tooltip')) {
                                                    handleUpdateFirstTimeExperience('exercise_description_tooltip');
                                                }
                                            }}
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
                                        onPress={() => this._pauseTimer(true, true)}
                                        reverse={false}
                                        type={'material'}
                                    />
                                </Tooltip>
                            </View>
                        </View>
                        <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(14),}]}>
                            {exercise.longDosage.toUpperCase()}
                        </Text>
                        <Spacer size={10} />
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',}}>
                            <View>
                                { exerciseTimer ?
                                    areAllTimersCompleted ?
                                        <TabIcon
                                            color={AppColors.zeplin.shadow}
                                            containerStyle={[{alignSelf: 'center', margin: AppSizes.padding,}]}
                                            icon={'restore'}
                                            onPress={() => this._resetTimer(true)}
                                            reverse={false}
                                            size={AppFonts.scaleFont(40)}
                                            type={'material'}
                                        />
                                        : isPaused ?
                                            <TabIcon
                                                color={AppColors.zeplin.shadow}
                                                containerStyle={[{alignSelf: 'center', margin: AppSizes.padding,}]}
                                                icon={'play-arrow'}
                                                onPress={() => this._pauseTimer(false)}
                                                reverse={false}
                                                size={AppFonts.scaleFont(40)}
                                                type={'material'}
                                            />
                                            : !isPaused && (startPreExerciseCountdown || startFirstSet || startSwitchSidesInterval || startSecondSet) ?
                                                <TabIcon
                                                    color={AppColors.zeplin.shadow}
                                                    containerStyle={[{alignSelf: 'center', margin: AppSizes.padding,}]}
                                                    icon={'pause'}
                                                    onPress={() => this._pauseTimer(true)}
                                                    reverse={false}
                                                    size={AppFonts.scaleFont(40)}
                                                    type={'material'}
                                                />
                                                :
                                                <TabIcon
                                                    color={AppColors.zeplin.shadow}
                                                    containerStyle={[{alignSelf: 'center', margin: AppSizes.padding,}]}
                                                    icon={'play-arrow'}
                                                    // onPress={() => this._pauseTimer(false)}
                                                    reverse={false}
                                                    size={AppFonts.scaleFont(40)}
                                                    type={'material'}
                                                />
                                    :
                                    null
                                }
                            </View>
                            <View>
                                { exerciseTimer ?
                                    isPaused && !startPreExerciseCountdown && !startSwitchSidesInterval ?
                                        <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(56),}}>{this._cleanTime(timerSeconds)}</Text>
                                        : startPreExerciseCountdown ?
                                            <ProgressCircle
                                                animated={true}
                                                borderWidth={0}
                                                color={AppColors.zeplin.seaBlue}
                                                formatText={`${timerSeconds === 0 ? 'GO' : timerSeconds}`}
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
                                                <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(56),}}>{this._cleanTime(timerSeconds)}</Text>
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
                                                        <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(56),}}>{this._cleanTime(timerSeconds)}</Text>
                                                        : areAllTimersCompleted ?
                                                            <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(56),}}>{'00:00'}</Text>
                                                            :
                                                            <ProgressCircle
                                                                animated={true}
                                                                borderWidth={0}
                                                                color={AppColors.zeplin.seaBlue}
                                                                formatText={'5'}
                                                                indeterminate={false}
                                                                progress={0}
                                                                showsText={true}
                                                                size={(AppFonts.scaleFont(56) + (AppSizes.padding * 2))}
                                                                strokeCap={'round'}
                                                                textStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(56),}}
                                                                thickness={5}
                                                                unfilledColor={AppColors.zeplin.superLight}
                                                            />
                                    :
                                    null
                                }
                            </View>
                            <View>
                                { showAnimation ?
                                    <LottieView
                                        loop={true}
                                        ref={animation => {
                                            this.animation = animation;
                                        }}
                                        source={require('../../../../assets/animation/pulse-darksimple.json')}
                                    />
                                    :
                                    null
                                }
                                <TabIcon
                                    color={completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? AppColors.zeplin.yellow : AppColors.zeplin.light}
                                    containerStyle={[{alignSelf: 'center', margin: AppSizes.padding,}]}
                                    icon={completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`) ? 'ios-checkbox' : 'ios-checkbox-outline'}
                                    onPress={() => {
                                        this._resetTimer();
                                        handleCompleteExercise(exercise.library_id, exercise.set_number, nextExercise);
                                        this.setState({ areAllTimersCompleted: true, startPreExerciseCountdown: false, });
                                    }}
                                    reverse={false}
                                    size={50}
                                    type={'ionicon'}
                                />
                            </View>
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
    currentSlideIndex:               PropTypes.number,
    exercise:                        PropTypes.object.isRequired,
    exerciseTimer:                   PropTypes.object,
    handleCompleteExercise:          PropTypes.func.isRequired,
    handleUpdateFirstTimeExperience: PropTypes.func.isRequired,
    index:                           PropTypes.number.isRequired,
    nextExercise:                    PropTypes.object,
    user:                            PropTypes.object.isRequired,
};

ExercisesExercise.defaultProps = {
    currentSlideIndex: null,
    exerciseTimer:     null,
    nextExercise:      null,
};

ExercisesExercise.componentName = 'ExercisesExercise';

/* Export Component ================================================================== */
export default ExercisesExercise;