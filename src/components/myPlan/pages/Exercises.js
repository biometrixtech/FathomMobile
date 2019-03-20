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
import { Platform, StyleSheet, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
import KeepAwake from 'react-native-keep-awake';
import Video from 'react-native-video';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, MyPlan as MyPlanConstants, } from '../../../constants';
import { Spacer, TabIcon, Text, } from '../../custom';
import { ExercisesExercise, TimedExercise, } from './';
import { PlanLogic, } from '../../../lib';
import { Error, } from '../../general';

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
const ProgressPills = ({ availableSectionsCount, cleanedExerciseList, completedExercises, listLength, }) => (
    <View style={[styles.progressPillsWrapper, availableSectionsCount === 2 ? {paddingHorizontal: AppSizes.paddingLrg,} : {}]}>
        {_.map(cleanedExerciseList, (exerciseList, index) => {
            let progressLength = (_.filter(exerciseList, o => completedExercises.indexOf(`${o.library_id}-${o.set_number}`) > -1).length / exerciseList.length);
            let progressWidth = progressLength ? parseInt(progressLength * 100, 10) : 0;
            let wrapperWidth = (exerciseList.length / listLength);
            return(
                exerciseList.length > 0 ?
                    <View
                        key={index}
                        style={{
                            alignItems: 'center',
                            flex:       wrapperWidth,
                        }}
                    >
                        <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(12),}}>{index}</Text>
                        <Spacer size={AppSizes.paddingXSml} />
                        <View style={[styles.progressPill, {width: '90%',}]}>
                            <View style={[styles.progressPill, {backgroundColor: AppColors.zeplin.seaBlue, width: `${progressWidth}%`,}]} />
                        </View>
                    </View>
                    :
                    null
            );
        })}
    </View>
);

class Exercises extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentSlideIndex:   null,
            isScrollEnabled:     true,
            progressPillsHeight: 0,
            selectedExercise:    this.props.selectedExercise,
            // timer related state items
            timer:               null,
        };
        this._carousel = {};
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount = () => {
        KeepAwake.activate();
        this.setState({ currentSlideIndex: this._carousel.currentIndex, });
    }

    componentWillUnmount = () => {
        KeepAwake.deactivate();
        clearInterval(this.state.timer);
    }

    _renderItem = ({item, index}, nextItem, progressPillsHeight) => {
        const { closeModal, completedExercises, handleCompleteExercise, handleUpdateFirstTimeExperience, user, } = this.props;
        const { currentSlideIndex, } = this.state;
        const exercise = MyPlanConstants.cleanExercise(item);
        const nextExercise = nextItem ? MyPlanConstants.cleanExercise(nextItem) : null;
        const { number_of_sets, pre_start_time, seconds_per_set, switch_sides_time, up_next_interval, } = PlanLogic.handleExercisesTimerLogic(exercise);
        let timer = { number_of_sets, pre_start_time, seconds_per_set, switch_sides_time, up_next_interval };
        if(
            !currentSlideIndex &&
            currentSlideIndex !== index &&
            (currentSlideIndex - 1) !== index &&
            (currentSlideIndex + 1) !== index
        ) {
            return(null);
        }
        return(
            <View style={{backgroundColor: AppColors.transparent, flex: 1, justifyContent: 'center',}}>
                <View style={{backgroundColor: AppColors.white, borderRadius: 4,}}>
                    <Spacer size={5} />
                    <TabIcon
                        containerStyle={[{right: 10, position: 'absolute', top: 10, width: 26, zIndex: 100,}]}
                        color={AppColors.zeplin.lightSlate}
                        icon={'close'}
                        onPress={() => {clearInterval(this.state.timer); closeModal();}}
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
                        <Error type={'Video coming soon...'} />
                    }
                    { currentSlideIndex === index ?
                        <TimedExercise
                            closeModal={closeModal}
                            completedExercises={completedExercises}
                            currentSlideIndex={currentSlideIndex}
                            exercise={exercise}
                            exerciseTimer={timer && timer.seconds_per_set ? timer : null}
                            handleCompleteExercise={(exerciseId, setNumber, nextExerciseObj) => {
                                handleCompleteExercise(exerciseId, setNumber, nextExerciseObj, !completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`));
                                _.delay(() => {
                                    if(nextExercise && !completedExercises.includes(`${exercise.library_id}-${exercise.set_number}`)) {
                                        this._carousel.snapToNext();
                                    }
                                }, 250);
                            }}
                            handleUpdateFirstTimeExperience={handleUpdateFirstTimeExperience}
                            index={index}
                            nextExercise={nextExercise}
                            progressPillsHeight={progressPillsHeight}
                            toggleScrollStatus={() => this.setState({ isScrollEnabled: !this.state.isScrollEnabled, })}
                            user={user}
                        />
                        :
                        <ExercisesExercise
                            completedExercises={completedExercises}
                            exercise={exercise}
                            exerciseTimer={timer && timer.seconds_per_set ? timer : null}
                            progressPillsHeight={progressPillsHeight}
                        />
                    }
                </View>
            </View>
        );
    }

    _resizeModal = ev => {
        let oldHeight = this.state.progressPillsHeight;
        let newHeight = parseInt(ev.nativeEvent.layout.height, 10);
        if(oldHeight !== newHeight) {
            this.setState({
                progressPillsHeight: newHeight,
            });
        }
    }

    render = () => {
        const { completedExercises, exerciseList, } = this.props;
        const { isScrollEnabled, selectedExercise, } = this.state;
        let {
            availableSectionsCount,
            cleanedExerciseList,
            flatListExercises,
            firstItemIndex,
        } = PlanLogic.handleExercisesRenderLogic(exerciseList, selectedExercise);
        return(
            <View style={{backgroundColor: AppColors.transparent, flex: 1, flexDirection: 'column',}}>
                <View
                    onLayout={ev => this._resizeModal(ev)}
                    style={{flex: 1,}}
                >
                    <ProgressPills
                        availableSectionsCount={availableSectionsCount}
                        cleanedExerciseList={cleanedExerciseList}
                        completedExercises={completedExercises}
                        listLength={flatListExercises.length}
                    />
                </View>
                <View style={{flex: 9,}}>
                    <Carousel
                        data={flatListExercises}
                        firstItem={firstItemIndex}
                        initialNumToRender={flatListExercises.length}
                        itemWidth={AppSizes.screen.width * 0.85}
                        lockScrollWhileSnapping={true}
                        maxToRenderPerBatch={flatListExercises.length}
                        onSnapToItem={slideIndex =>
                            this.setState({
                                currentSlideIndex: slideIndex,
                                selectedExercise:  flatListExercises[slideIndex],
                            })
                        }
                        ref={c => {this._carousel = c;}}
                        removeClippedSubviews={true}
                        renderItem={obj => this._renderItem(obj, flatListExercises[(obj.index + 1)], this.state.progressPillsHeight)}
                        scrollEnabled={isScrollEnabled}
                        sliderWidth={AppSizes.screen.width}
                        windowSize={flatListExercises.length}
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