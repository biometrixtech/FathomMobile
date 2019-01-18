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
import { StyleSheet, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, MyPlan as MyPlanConstants, } from '../../../constants';
import { Spacer, Text, } from '../../custom';
import { ExercisesExercise, } from './';
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
    <View style={[styles.progressPillsWrapper, availableSectionsCount === 2 ? {paddingHorizontal: AppSizes.paddingLrg,} : {}]}>
        {_.map(cleanedExerciseList, (exerciseList, index) => {
            let progressLength = (_.filter(exerciseList, o => completedExercises.indexOf(`${o.library_id}-${o.set_number}`) > -1).length / exerciseList.length);
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
            currentSlideIndex: 0,
            timers:            [],
        };
        this._carousel = {};
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount = () => {
        _.delay(() => {
            this.setState({ currentSlideIndex: this._carousel.currentIndex, });
        }, 750);
    }

    _renderItem = ({item, index}, nextItem) => {
        const { closeModal, completedExercises, handleCompleteExercise, handleUpdateFirstTimeExperience, user, } = this.props;
        const { currentSlideIndex, } = this.state;
        const exercise = MyPlanConstants.cleanExercise(item);
        const nextExercise = nextItem ? MyPlanConstants.cleanExercise(nextItem) : null;
        const { number_of_sets, pre_start_time, seconds_per_set, switch_sides_time, up_next_interval, } = PlanLogic.handleExercisesTimerLogic(exercise);
        let timer = { number_of_sets, pre_start_time, seconds_per_set, switch_sides_time, up_next_interval };
        return(
            <ExercisesExercise
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
                user={user}
            />
        );
    }

    render = () => {
        const { completedExercises, exerciseList, selectedExercise, } = this.props;
        let {
            availableSectionsCount,
            cleanedExerciseList,
            firstItem,
            flatListExercises,
        } = PlanLogic.handleExercisesRenderLogic(exerciseList, selectedExercise);
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
                        onSnapToItem={slideIndex => this.setState({ currentSlideIndex: slideIndex, })}
                        ref={c => {this._carousel = c;}}
                        removeClippedSubviews={true}
                        renderItem={obj => this._renderItem(obj, flatListExercises[(obj.index + 1)])}
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