/**
 * Exercises
 *
    <Exercises
        closeModal={() => this._singleExerciseItemRef.close()}
        completedExercises={completedExercises}
        exerciseList={exerciseList}
        handleCompleteExercise={this._handleCompleteExercise}
        handleUpdateFirstTimeExperience={this._handleUpdateFirstTimeExperience}
        selectedExercise={this.state.selectedExercise}
        user={this.props.user}
    />
 *
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
import Video from 'react-native-video';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Checkbox, Spacer, TabIcon, Text, Tooltip, } from '../../custom';
import { Error, } from '../../general';
import { PlanLogic, } from '../../../lib';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    progressPillsWrapper: {
        alignItems:        'flex-end',
        flex:              1,
        flexDirection:     'row',
        justifyContent:    'space-between',
        paddingHorizontal: AppSizes.padding,
    },
    progressPill: {
        backgroundColor: AppColors.zeplin.superLight,
        borderRadius:    5,
        height:          AppSizes.paddingSml,
    }
});

/* Component ==================================================================== */
const ProgressPills = ({ availableSectionsCount, cleanedExerciseList, completedExercises, }) => (
    <View style={[styles.progressPillsWrapper,]}>
        {_.map(cleanedExerciseList, (exerciseList, index) => {
            let progressLength = (_.filter(exerciseList, o => completedExercises.indexOf(o.library_id) > -1).length / exerciseList.length);
            let progressWidth = progressLength ? parseInt(progressLength * 100, 10) : 0;
            return(
                exerciseList.length > 0 ?
                    <View
                        key={index}
                        style={{
                            alignItems: 'center',
                            flex:       availableSectionsCount === 1 ? 10 : availableSectionsCount === 2 ? 5 : 3,
                        }}
                    >
                        <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(12),}}>{index}</Text>
                        <Spacer size={AppSizes.paddingXSml} />
                        <View style={[styles.progressPill, {width: '90%',}]}>
                            <View style={[styles.progressPill, {backgroundColor: AppColors.zeplin.seaBlue, width: `${progressWidth}%`,}]} />
                        </View>
                        <Spacer size={AppSizes.paddingSml} />
                    </View>
                    :
                    null
            );
        })}
    </View>
);

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

class Exercises extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentSlideIndex:        0,
            isDescriptionToolTipOpen: false,
            timers:                   [],
        };
        this._carousel = {};
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount = () => {
        const { exerciseList, selectedExercise, user, } = this.props;
        let { flatListExercises, } = PlanLogic.handleExercisesRenderLogic(exerciseList, selectedExercise);
        _.map(flatListExercises, (exercise, index) => {
            const { number_of_sets, pre_start_time, seconds_per_set, switch_sides_time, up_next_interval, } = PlanLogic.handleExercisesTimerLogic(exercise);
            let newTimer = {};
            newTimer.number_of_sets = number_of_sets;
            newTimer.pre_start_time = pre_start_time;
            newTimer.seconds_per_set = seconds_per_set;
            newTimer.switch_sides_time = switch_sides_time;
            newTimer.up_next_interval = up_next_interval;
            let newTimers = this.state.timers;
            newTimers.push(newTimer);
            _.delay(() => {
                this.setState({ timers: newTimers, });
            }, 500 * index);
        });
        _.delay(() => {
            this.setState({ currentSlideIndex: this._carousel.currentIndex, });
            if(!user.first_time_experience.includes('exercise_description_tooltip')) {
                this.setState({ isDescriptionToolTipOpen: true, });
            }
        }, 750);
    }

    _renderItem = ({item, index}, nextItem) => {
        const { closeModal, completedExercises, handleCompleteExercise, handleUpdateFirstTimeExperience, user, } = this.props;
        const { currentSlideIndex, timers, } = this.state;
        const exercise = MyPlanConstants.cleanExercise(item);
        const nextExercise = nextItem ? MyPlanConstants.cleanExercise(nextItem) : null;
        if(timers[index] && timers[index].seconds_per_set) {
            // console.log(timers[index]);
            // timer
        } else {
            // no timers
        }
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
                                                }
                                            )
                                        }
                                        text={exercise.description}
                                    />
                                }
                                contentStyle={{backgroundColor: AppColors.zeplin.success,}}
                                isVisible={this.state.isDescriptionToolTipOpen && currentSlideIndex === index}
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
                        <TabIcon
                            containerStyle={[{alignSelf: 'center',}]}
                            icon={completedExercises.includes(exercise.library_id) ? 'ios-checkbox' : 'ios-checkbox-outline'}
                            iconStyle={[{color: completedExercises.includes(exercise.library_id) ? AppColors.zeplin.yellow : AppColors.zeplin.light,}]}
                            onPress={() => {
                                handleCompleteExercise(exercise.library_id, nextExercise);
                                _.delay(() => {
                                    if(nextExercise && !completedExercises.includes(exercise.library_id)) {
                                        this._carousel.snapToNext();
                                    }
                                }, 500);
                            }}
                            reverse={false}
                            size={50}
                            type={'ionicon'}
                        />
                        <Spacer size={10} />
                        { nextExercise ?
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
                        }
                    </View>
                </View>
            </View>
        );
    }

    render = () => {
        const { completedExercises, exerciseList, selectedExercise, } = this.props;
        let {
            availableSectionsCount,
            cleanedExerciseList,
            // exercise,
            // exercisesTotalLength,
            firstItem,
            flatListExercises,
        } = PlanLogic.handleExercisesRenderLogic(exerciseList, selectedExercise);
        // console.log('cleanedExerciseList',cleanedExerciseList);
        // console.log('exercise',exercise);
        // console.log('exercisesTotalLength',exercisesTotalLength);
        // console.log('flatListExercises',flatListExercises);
        return(
            <View style={{backgroundColor: AppColors.transparent, flex: 1, flexDirection: 'column',}}>
                <View style={{flex: 1,}}>
                    <ProgressPills
                        availableSectionsCount={availableSectionsCount}
                        cleanedExerciseList={cleanedExerciseList}
                        completedExercises={completedExercises}
                    />
                </View>
                <View style={{flex: 9,}}>
                    <Carousel
                        data={flatListExercises}
                        firstItem={firstItem}
                        initialNumToRender={10}
                        itemWidth={AppSizes.screen.width * 0.85}
                        lockScrollWhileSnapping={true}
                        maxToRenderPerBatch={10}
                        onBeforeSnapToItem={slideIndex => {
                            console.log('slideIndex-onBeforeSnapToItem',slideIndex,this.state.currentSlideIndex);
                        }}
                        onSnapToItem={slideIndex => {
                            console.log('slideIndex-onSnapToItem',slideIndex,this.state.currentSlideIndex);
                            this.setState({ currentSlideIndex: slideIndex, });
                        }}
                        ref={c => {this._carousel = c;}}
                        removeClippedSubviews={true}
                        renderItem={obj => this._renderItem(obj, flatListExercises[(obj.index + 1)])}
                        // scrollEnabled={false}
                        sliderWidth={AppSizes.screen.width}
                        windowSize={10}
                    />
                </View>
            </View>
        )
    }
}

Exercises.propTypes = {
    closeModal:                      PropTypes.func.isRequired,
    completedExercises:              PropTypes.array.isRequired,
    exerciseList:                    PropTypes.object.isRequired,
    handleCompleteExercise:          PropTypes.func.isRequired,
    handleUpdateFirstTimeExperience: PropTypes.func.isRequired,
    selectedExercise:                PropTypes.object.isRequired,
    user:                            PropTypes.object.isRequired,
};

Exercises.defaultProps = {};

Exercises.componentName = 'Exercises';

/* Export Component ================================================================== */
export default Exercises;