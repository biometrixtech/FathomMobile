/**
 * HealthKitWorkouts
 *
    <HealthKitWorkouts
        handleHealthDataFormChange={handleHealthDataFormChange}
        handleNextStep={() => this._checkNextStep(0)}
        handleTogglePostSessionSurvey={handleTogglePostSessionSurvey}
        handleToggleSurvey={handleTogglePostSessionSurvey}
        resetFirstPage={resetHealthKitFirstPage}
        trainingSessions={trainingSessions}
        user={user}
        workouts={healthKitWorkouts}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image, Keyboard, Platform, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Checkbox, FormInput, Spacer, TabIcon, Text, } from '../../custom';
import { AppUtil, PlanLogic, } from '../../../lib';
import { BackNextButtons, ProgressPill, ScaleButton, } from './';
// import { Loading, } from '../../general';

// import third-party libraries
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import AppleHealthKit from 'rn-apple-healthkit';
// import SlidingUpPanel from 'rn-sliding-up-panel';
import moment from 'moment';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    shadowEffect: {
        elevation:     2,
        shadowColor:   'rgba(111, 124, 139, 0.08)',
        shadowOffset:  {  height: 3, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  16,
    },
    // activeWorkoutListDetailWrapper: {
    //     backgroundColor: AppColors.zeplin.superLight,
    //     borderColor:     AppColors.zeplin.superLight,
    //     borderWidth:     2,
    // },
    // deletedWorkoutListDetailWrapper: {
    //     backgroundColor: AppColors.transparent,
    //     borderColor:     AppColors.zeplin.slateXLight,
    //     borderStyle:     'dashed',
    //     borderWidth:     2,
    // },
    workoutListDetailWrapper: isClickable => ({
        alignItems:        'center',
        backgroundColor:   isClickable ? AppColors.white : AppColors.zeplin.splash,
        borderRadius:      10,
        flexDirection:     'row',
        justifyContent:    'space-between',
        paddingHorizontal: AppSizes.paddingMed,
        paddingVertical:   AppSizes.paddingMed,
    }),
});

/* Component ==================================================================== */
const WorkoutListDetailWrapper = props => props.onPress ?
    (
        <TouchableOpacity
            onPress={props.onPress}
            style={[styles.shadowEffect, styles.workoutListDetailWrapper(props.isSelected),]}
        >
            {props.children}
        </TouchableOpacity>
    ) :
    (
        <View style={[styles.workoutListDetailWrapper(props.isSelected),]}>
            {props.children}
        </View>
    );

const WorkoutListDetail = ({
    handleHealthDataFormChange,
    isSelected = false,
    workout,
}) => {
    let { sportName, sportStartTime, } = PlanLogic.handleHealthKitWorkoutPageRenderLogic(workout);
    // console.log(sportName, sportStartTime);
    let isClickable = handleHealthDataFormChange ? true : false;
    // console.log('WorkoutListDetail',handleHealthDataFormChange,isSelected,isClickable,workout);
    // TODO: make top level view a wrapper to be a view or TouchableOpacity!!!
    return (
        <WorkoutListDetailWrapper isSelected={(isClickable && !isSelected)} onPress={handleHealthDataFormChange}>
            <View style={{alignItems: 'center', flexDirection: 'row',}}>
                { isClickable &&
                    <Checkbox
                        containerStyle={{margin: 0, marginRight: AppSizes.paddingMed, padding: 0,}}
                        checked={isSelected}
                        checkedColor={AppColors.white}
                        onPress={handleHealthDataFormChange}
                    />
                }
                <Image
                    source={workout.source === 3 ?
                        require('../../../../assets/images/sensor/sensor_slate.png')
                        : workout.source === 0 ?
                            require('../../../../assets/images/standard/app-logo-512.png')
                            :
                            require('../../../../assets/images/standard/health-kit.png')
                    }
                    style={[workout.source === 3 ? {tintColor: AppColors.white,} : {}, {height: 25, marginRight: AppSizes.paddingSml, width: 25,}]}
                />
                <Text robotoRegular style={{color: (isClickable && !isSelected) ? AppColors.zeplin.slate : AppColors.white, fontSize: AppFonts.scaleFont(18),}}>{sportName}</Text>
            </View>
            <View style={{alignItems: 'center', flexDirection: 'row',}}>
                <TabIcon
                    color={(isClickable && !isSelected) ? AppColors.zeplin.slateLight : AppColors.white}
                    containerStyle={[{marginRight: AppSizes.paddingXSml,}]}
                    icon={'clock-outline'}
                    reverse={false}
                    size={20}
                    type={'material-community'}
                />
                <Text robotoLight style={{color: (isClickable && !isSelected) ? AppColors.zeplin.slateLight : AppColors.white, fontSize: AppFonts.scaleFont(12),}}>{sportStartTime}</Text>
            </View>
        </WorkoutListDetailWrapper>
    );
    /*return(
        <View style={[styles.workoutListDetailWrapper, workout.deleted ? styles.deletedWorkoutListDetailWrapper : styles.activeWorkoutListDetailWrapper,]}>
            <View style={{paddingHorizontal: AppSizes.paddingMed,}}>
                <Image
                    source={sportImage}
                    style={{height: 50, tintColor: workout.deleted ? AppColors.zeplin.slateXLight : AppColors.zeplin.splash, width: 50,}}
                />
            </View>
            <View style={{flex: 4, paddingLeft: AppSizes.paddingSml,}}>
                <Text robotoMedium style={{color: workout.deleted ? AppColors.zeplin.slateXLight : AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18),}}>{sportName}</Text>
            </View>
            <View style={{flex: 2, paddingLeft: AppSizes.paddingXSml,}}>
                <Text robotoMedium style={{color: workout.deleted ? AppColors.zeplin.slateXLight : AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}>{sportStartTime}</Text>
            </View>
            <TabIcon
                containerStyle={[{flex: 1,}]}
                color={AppColors.zeplin.slateLight}
                icon={workout.deleted ? 'add' : 'close'}
                onPress={() => handleHealthDataFormChange(!workout.deleted)}
                reverse={false}
                size={30}
                type={'material'}
            />
        </View>
    );*/
};

class HealthKitWorkouts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delayTimerId:          null,
            isEditingDuration:     false,
            isHKRetrieveChecked:   Platform.OS === 'ios',
            isHKRetrieveModalOpen: false,
            pageIndex:             0,
            showAddContinueBtns:   false,
            showRPEPicker:         false,
        };
        this._activityRPERef = {};
        this._hkPanel = {};
        this.pages = {};
        this.scrollViewHealthKitOverviewRef = {};
        this.scrollViewHealthKitRef = [];
        this.scrollViewHealthKitSingleRef = {};
        this.textInput = [];
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(prevProps.resetFirstPage !== this.props.resetFirstPage && this.props.resetFirstPage) {
            this._resetStep(this.state.pageIndex);
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.state.delayTimerId);
    }

    _deleteAllWorkouts = (index, callback) => {
        const { handleHealthDataFormChange, workouts, } = this.props;
        if(index) {
            handleHealthDataFormChange(index, 'deleted', true);
            if(callback) {
                callback();
            }
        } else {
            let i = 0;
            _.map(workouts, (workout, key) => {
                _.delay(() => handleHealthDataFormChange(key, 'deleted', true), 200 * i);
                i = i + 1;
            });
            if(callback) {
                _.delay(() => callback(), (200 * (workouts.length)));
            }
        }
    }

    _editDuration = index => {
        this.textInput[index].focus();
        this.setState({ isEditingDuration: true, });
    }

    _handleHeartRateDataCheck = currentPage => {
        this._handleNextStepCheck(() => {
            console.log('HIII');
            // TODO: FIX ME PLEASE TO GRAB HR DATA
            // if(Platform.OS === 'android') {
            //     return _.delay(() => this._renderNextPage(currentPage), 250);
            // }
            // const { isHKRetrieveChecked, } = this.state;
            // const { handleHealthDataFormChange, workouts, } = this.props;
            // if(isHKRetrieveChecked) {
            //     return this.setState(
            //         { isHKRetrieveModalOpen: true, },
            //         async () => {
            //             let appleHealthKitPerms = AppUtil._getAppleHealthKitPerms();
            //             return await Promise.all(
            //                 _.map(workouts, (workout, index) => {
            //                     return AppUtil._getHeartRateSamples(
            //                         appleHealthKitPerms,
            //                         moment(workout.event_date.replace('Z', ''), 'YYYY-MM-DDThh:mm:ss.SSS').subtract(1, 'minutes').toISOString(),
            //                         moment(workout.end_date.replace('Z', ''), 'YYYY-MM-DDThh:mm:ss.SSS').add(1, 'minutes').toISOString(),
            //                         workout.deleted,
            //                         AppleHealthKit
            //                     );
            //                 })
            //             )
            //                 .then(res =>
            //                     // _.map(workouts, (workout, index) => {
            //                     //     handleHealthDataFormChange(index, 'hr_data', res[index], () => index === (workouts.length - 1) ?
            //                     //         this.setState(
            //                     //             { isHKRetrieveModalOpen: false, },
            //                     //             () => _.delay(() => this._renderNextPage(currentPage), 250),
            //                     //         )
            //                     //         :
            //                     //         null
            //                     //     );
            //                     // })
            //                 );
            //         }
            //     );
            // }
            // return this._renderNextPage(currentPage);
        });
    }

    _handleNextStepCheck = callback => {
        this.setState(
            { isHKRetrieveModalOpen: true, },
            () => {
                const { trainingSessions, workouts, } = this.props;
                const { pageIndex, } = this.state;
                let currentWorkout = workouts[pageIndex];
                let updatedWorkouts = _.cloneDeep(workouts);
                updatedWorkouts = _.filter(updatedWorkouts, o =>
                    (o.session_id && currentWorkout.session_id && o.session_id !== currentWorkout.session_id) ||
                    (o.apple_health_kit_ids && currentWorkout.apple_health_kit_id && !o.apple_health_kit_ids.includes(currentWorkout.apple_health_kit_id))
                );
                let manuallyLoggedSessions = _.filter(trainingSessions, o => o.source === 0);
                let remainingWorkouts = _.concat(updatedWorkouts, manuallyLoggedSessions);
                remainingWorkouts = _.filter(remainingWorkouts, o =>
                    o.session_id ?
                        !currentWorkout.is_merged_with.includes(o.session_id)
                        :
                        !currentWorkout.is_merged_with.includes(o.apple_health_kit_id)
                );
                let allWorkouts = _.concat(workouts, manuallyLoggedSessions);
                let hasRPE = _.find(allWorkouts, o => o.post_session_survey && o.post_session_survey.RPE);
                if(remainingWorkouts.length === 0 && hasRPE) {
                    // time to trigger merge API
                    let mergePayload = {
                        hk_data:      [],
                        ids_to_merge: [],
                        session_id:   '',
                    };
                    // 1. find workout id to merge into (3s > manual)
                    let parentSensorWorkout = _.find(allWorkouts, ['source', 3]);
                    let parentManualWorkout = _.find(allWorkouts, ['source', 0]);
                    mergePayload.session_id = parentSensorWorkout ? parentSensorWorkout.sensor_id : parentManualWorkout ? parentManualWorkout.session_id : null;
                    // 2. collect required data from other workout details, including ids
                    let sessionsToMerge = _.filter(allWorkouts, o => o.session_id !== mergePayload.session_id);
                    _.map(sessionsToMerge, async (session, key) => {
                        mergePayload.ids_to_merge.push(session.session_id ? session.session_id : session.apple_health_kit_id);
                        if(session.apple_health_kit_id && session.source === 1) {
                            mergePayload.hk_data.push(session);
                        }
                    });
                    // {
                    //     session_id:  'xyz',
                    //     id_to_merge: ['abc, 'def',],
                    //     hk_data:     [{ start_time: '', end_time: '', hr_data: [], ... },{ start_time: '', end_time: '', hr_data: [], ... },]
                    // }
                    console.log('mergePayload',mergePayload);
                } else {
                    // continue along in the survey
                    // NOTE: MIGHT have to do some payload cleanup first here...
                }
                // callback();
            }
        );
    }

    _renderNextPage = currentPage => {
        const { handleNextStep, handleToggleSurvey, workouts, } = this.props;
        Keyboard.dismiss();
        let numberOfNonDeletedWorkouts = _.filter(workouts, ['deleted', false]);
        if(numberOfNonDeletedWorkouts.length === 0) { // if all workouts are cancelled, handle next step
            handleToggleSurvey(true);
        } else if(currentPage === workouts.length || (currentPage + 1) > numberOfNonDeletedWorkouts.length) { // render next page, out of HK Workouts
            handleNextStep(true);
        } else { // render next non-deleted HK workout
            let nextNonDeletedWorkout = (_.findIndex(workouts, (workout, i) => !workout.deleted && (currentPage - 1) < i) + 1);
            let moreNonDeletedWorkouts = _.filter(workouts, (workout, i) => !workout.deleted && (nextNonDeletedWorkout - 1) < i);
            this.pages.scrollToPage(nextNonDeletedWorkout);
            this.setState({
                delayTimerId: _.delay(() => {
                    this.setState({
                        isEditingDuration:   false,
                        pageIndex:           nextNonDeletedWorkout,
                        showAddContinueBtns: moreNonDeletedWorkouts.length === 0,
                        showRPEPicker:       false,
                    });
                    this._scrollTo({x: 0, y: 0});
                }, 500)
            });
        }
    }

    _resetStep = pageIndex => {
        const { handleHealthDataFormChange, } = this.props;
        this.setState(
            { showRPEPicker: false, },
            () => {
                if(pageIndex > 0) {
                    handleHealthDataFormChange((pageIndex - 1), 'deleted', false, () => {
                        handleHealthDataFormChange((pageIndex - 1), 'post_session_survey.RPE', null);
                    });
                }
                this.setState({
                    delayTimerId: _.delay(() => this._scrollTo({x: 0, y: 0}), 500),
                });
            }
        );
    }

    _scrollTo = (myComponentsLocation, scrollViewRef) => {
        if(myComponentsLocation) {
            this.setState({
                delayTimerId: _.delay(() => {
                    if(scrollViewRef) {
                        scrollViewRef.scrollTo({
                            x:        myComponentsLocation.x,
                            y:        myComponentsLocation.y,
                            animated: true,
                        });
                    } else {
                        this.scrollViewHealthKitOverviewRef.scrollTo({
                            x:        myComponentsLocation.x,
                            y:        myComponentsLocation.y,
                            animated: true,
                        });
                    }
                }, 500)
            });
        }
    }

    _scrollToBottom = scrollViewRef => {
        if(scrollViewRef) {
            this.setState({ delayTimerId: _.delay(() => scrollViewRef.scrollToEnd({ animated: true, }), 500) });
        }
    }

    _updateBackPageIndex = pageIndex => {
        this.pages.scrollToPage(pageIndex);
        this.setState(
            { pageIndex: pageIndex, },
            () => this.state.pageIndex === 0 ? null : this._resetStep(this.state.pageIndex),
        );
    }

    render = () => {
        const { handleHealthDataFormChange, handleTogglePostSessionSurvey, isPostSession, trainingSessions, user, workouts, } = this.props;
        const { isEditingDuration, isHKRetrieveChecked, isHKRetrieveModalOpen, pageIndex, showAddContinueBtns, showRPEPicker, } = this.state;
        let pillsHeight = (AppSizes.statusBarHeight + AppSizes.progressPillsHeight);
        // console.log('workouts',workouts);
        let { sportImage, sportStartTime, sportText, } = PlanLogic.handleSingleHealthKitWorkoutPageRenderLogic(workouts);
        // console.log('trainingSessions',trainingSessions);
        let manuallyLoggedSessions = _.filter(trainingSessions, o => o.source === 0);
        // console.log('manuallyLoggedSessions',manuallyLoggedSessions);
        let isSingleWorkout = (workouts.length + manuallyLoggedSessions.length) === 1;
        let remainingWorkouts = [];
        if(!isSingleWorkout) {
            let currentWorkout = workouts[pageIndex];
            // console.log('currentWorkout',currentWorkout);
            remainingWorkouts = _.concat(workouts, manuallyLoggedSessions);
            // console.log('remainingWorkouts-1',remainingWorkouts);
            remainingWorkouts = _.filter(remainingWorkouts, o => {
                // console.log('o',o);
                // NOTE: CANNOT MERGE 3S INTO 3S WORKOUT
                return (o.session_id && currentWorkout.session_id && o.session_id !== currentWorkout.session_id) ||
                (o.apple_health_kit_ids && currentWorkout.apple_health_kit_id && !o.apple_health_kit_ids.includes(currentWorkout.apple_health_kit_id));
            });
            // console.log('remainingWorkouts-2',remainingWorkouts);
        }
        return(
            <View style={{flex: 1,}}>

                <ProgressPill
                    currentStep={1}
                    onBack={pageIndex > 0 && !isHKRetrieveModalOpen ? () => this._updateBackPageIndex(pageIndex - 1) : null}
                    onClose={isHKRetrieveModalOpen || !isPostSession ? null : () => handleTogglePostSessionSurvey()}
                    totalSteps={3}
                />

                { isSingleWorkout ?
                    <ScrollView
                        nestedScrollEnabled={true}
                        ref={ref => {this.scrollViewHealthKitSingleRef = ref;}}
                    >
                        <View style={{flex: 1,}}>
                            <View style={{paddingHorizontal: AppSizes.paddingLrg,}}>
                                <View style={{alignItems: 'center', marginVertical: AppSizes.paddingMed,}}>
                                    <Image
                                        source={sportImage}
                                        style={[styles.shadowEffect, {height: AppSizes.screen.widthThird, tintColor: AppColors.zeplin.splash, width: AppSizes.screen.widthThird,}]}
                                    />
                                </View>
                                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(26), textAlign: 'center',}}>
                                    {sportText[0]}
                                    <Text robotoMedium>{sportText[1]}</Text>
                                    {sportText[2]}
                                </Text>
                            </View>
                            <Spacer size={AppSizes.padding} />
                            { _.map(MyPlanConstants.postSessionFeel, (scale, key) => {
                                let RPEValue = workouts[0].post_session_survey.RPE;
                                let isSelected = RPEValue === scale.value;
                                return(
                                    <ScaleButton
                                        isSelected={isSelected}
                                        key={key}
                                        scale={scale}
                                        updateStateAndForm={() => {
                                            handleHealthDataFormChange(0, 'post_session_survey.RPE', scale.value);
                                            this._scrollToBottom(this.scrollViewHealthKitSingleRef);
                                        }}
                                    />
                                )
                            })}
                            { (Platform.OS === 'ios' && user.health_enabled) &&
                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                    <Checkbox
                                        checked={isHKRetrieveChecked}
                                        onPress={() => isHKRetrieveModalOpen ? {} : this.setState({ isHKRetrieveChecked: !this.state.isHKRetrieveChecked, })}
                                    />
                                    <Text robotoMedium style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>{'Retrieve Heart Rate Data if available'}</Text>
                                </View>
                            }
                            { (workouts[0] && workouts[0].post_session_survey && workouts[0].post_session_survey.RPE) &&
                                <BackNextButtons
                                    addBtnText={'Delete Session'}
                                    handleFormSubmit={() => isHKRetrieveModalOpen ? {} : this._handleHeartRateDataCheck(0)}
                                    isSubmitBtnSubmitting={isHKRetrieveModalOpen}
                                    isValid={true}
                                    onBackClick={() => isHKRetrieveModalOpen ? {} : this._deleteAllWorkouts(false, () => this._renderNextPage(0))}
                                    showAddBtn={true}
                                    showAddBtnDisabledStyle={false}
                                    showBackIcon={false}
                                    showSubmitBtn={true}
                                    submitBtnText={isHKRetrieveModalOpen ? 'Loading...' : 'Continue'}
                                />
                            }
                        </View>
                    </ScrollView>
                    :
                    <Pages
                        indicatorPosition={'none'}
                        ref={pages => {this.pages = pages;}}
                        scrollEnabled={false}
                        startPage={pageIndex}
                    >

                        { _.map(workouts, (workout, index) =>
                            <ScrollView
                                contentContainerStyle={{flexGrow: 1,}}
                                key={index}
                                nestedScrollEnabled={true}
                                ref={ref => {this.scrollViewHealthKitRef[index] = ref;}}
                            >

                                <View style={{height: (AppSizes.screen.height - pillsHeight), justifyContent: 'space-between',}}>
                                    <View style={{backgroundColor: 'green', flexGrow: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingMed,}}>
                                        { workout.source === 3 ?
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(25), textAlign: 'center',}}>
                                                {'Let\'s wrap up your '}
                                                <Text robotoMedium>{'Run with Fathom Pro'}</Text>
                                                {` at ${sportStartTime}?`}
                                            </Text>
                                            :
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(25), textAlign: 'center',}}>
                                                {`${workout.apple_health_kit_source_names[0]} Workout Detected`}
                                            </Text>
                                        }
                                        <Spacer size={AppSizes.padding} />
                                        <WorkoutListDetail
                                            isSelected={false}
                                            workout={workout}
                                        />
                                        <Spacer size={AppSizes.paddingLrg} />
                                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{'Tap to merge with other workouts.'}</Text>
                                        <Spacer size={AppSizes.paddingMed} />
                                        <View style={{paddingHorizontal: AppSizes.paddingMed,}}>
                                            {/*TODO: pug me in smart ScrollView*/}
                                            { _.map(remainingWorkouts, (remainingWorkout, key) =>
                                                <WorkoutListDetail
                                                    handleHealthDataFormChange={() => {
                                                        let newMergedWithArray = _.cloneDeep(workout.is_merged_with || []);
                                                        let remainingWorkoutId = remainingWorkout.session_id ? remainingWorkout.session_id : remainingWorkout.apple_health_kit_id;
                                                        if(newMergedWithArray.includes(remainingWorkoutId)) {
                                                            let spliceIndex = newMergedWithArray.indexOf(remainingWorkoutId);
                                                            newMergedWithArray.splice(spliceIndex, 1);
                                                        } else {
                                                            newMergedWithArray.push(remainingWorkoutId);
                                                        }
                                                        return isHKRetrieveModalOpen ?
                                                            null
                                                            :
                                                            handleHealthDataFormChange(index, 'is_merged_with', newMergedWithArray);
                                                    }}
                                                    isSelected={workout.is_merged_with && workout.is_merged_with.includes(remainingWorkout.session_id ? remainingWorkout.session_id : remainingWorkout.apple_health_kit_id)}
                                                    key={key}
                                                    workout={remainingWorkout}
                                                />
                                            )}
                                        </View>
                                    </View>
                                    <View style={{backgroundColor: 'red', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}>
                                        { (Platform.OS === 'ios' && user.health_enabled) &&
                                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                                <Checkbox
                                                    checked={isHKRetrieveChecked}
                                                    onPress={() => isHKRetrieveModalOpen ? {} : this.setState({ isHKRetrieveChecked: !this.state.isHKRetrieveChecked, })}
                                                />
                                                <Text robotoMedium style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>{'Retrieve Heart Rate Data if available'}</Text>
                                            </View>
                                        }
                                        <BackNextButtons
                                            addBtnText={'Delete Session'}
                                            handleFormSubmit={() => isHKRetrieveModalOpen ? {} : this._handleHeartRateDataCheck(index)}
                                            isSubmitBtnSubmitting={isHKRetrieveModalOpen}
                                            isValid={true}
                                            onBackClick={() => isHKRetrieveModalOpen ? {} : this._deleteAllWorkouts(index, () => this._renderNextPage(index))}
                                            showAddBtn={true}
                                            showAddBtnDisabledStyle={false}
                                            showBackIcon={false}
                                            showSubmitBtn={true}
                                            submitBtnText={isHKRetrieveModalOpen ? 'Loading...' : 'Continue'}
                                        />
                                    </View>
                                </View>

                                {/*<View
                                    onLayout={event => {
                                        let yLocation = (event.nativeEvent.layout.y);
                                        this._activityRPERef = {x: event.nativeEvent.layout.x, y: yLocation,}
                                    }}
                                    style={{flex: 1,}}
                                >
                                    { showRPEPicker ? null : null }
                                </View>*/}

                            </ScrollView>
                        )}

                    </Pages>
                }

                {/*<Pages
                    indicatorPosition={'none'}
                    ref={pages => { this.pages = pages; }}
                    scrollEnabled={false}
                    startPage={pageIndex}
                >

                    <ScrollView
                        contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                        keyboardShouldPersistTaps={'always'}
                        nestedScrollEnabled={true}
                        ref={ref => {this.scrollViewHealthKitOverviewRef = ref;}}
                    >
                        <View style={{flexGrow: 1, justifyContent: 'space-between',}}>
                            <View style={{flexGrow: 1, justifyContent: 'center',}}>
                                <View style={[workouts && workouts.length >= 6 ? {marginVertical: AppSizes.paddingLrg,} : {marginBottom: AppSizes.paddingLrg,}, {alignItems: 'center', flexDirection: 'row',}]}>
                                    <View style={{flex: 1,}} />
                                    <View style={{flex: 8,}}>
                                        <Text robotoLight style={{color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(30), textAlign: 'center',}}>{'We detected the following workouts from Apple Health:'}</Text>
                                    </View>
                                    <View style={{flex: 1,}}>
                                        <TabIcon
                                            color={AppColors.zeplin.slateXLight}
                                            icon={'help'}
                                            onPress={() => isHKRetrieveModalOpen ? {} : this._hkPanel.show()}
                                            reverse={false}
                                            size={20}
                                            type={'material'}
                                        />
                                    </View>
                                </View>
                                {_.map(workouts, (workout, index) =>
                                    <WorkoutListDetail
                                        handleHealthDataFormChange={isDeleted => isHKRetrieveModalOpen ? {} : handleHealthDataFormChange(index, 'deleted', isDeleted)}
                                        key={index}
                                        workout={workout}
                                    />
                                )}
                            </View>
                            <View>
                                { (Platform.OS === 'ios' && user.health_enabled) &&
                                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                        <Checkbox
                                            checked={isHKRetrieveChecked}
                                            onPress={() => isHKRetrieveModalOpen ? {} : this.setState({ isHKRetrieveChecked: !this.state.isHKRetrieveChecked, })}
                                        />
                                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>{'Retrieve Heart Rate Data if available'}</Text>
                                    </View>
                                }
                                <BackNextButtons
                                    addBtnText={'Delete all sessions'}
                                    handleFormSubmit={() => isHKRetrieveModalOpen ? {} : this._handleHeartRateDataCheck(pageIndex)}
                                    isSubmitBtnSubmitting={isHKRetrieveModalOpen}
                                    isValid={true}
                                    onBackClick={() => isHKRetrieveModalOpen ? {} : this._deleteAllWorkouts()}
                                    showAddBtn={true}
                                    showAddBtnDisabledStyle={true}
                                    showBackIcon={false}
                                    showSubmitBtn={true}
                                    submitBtnText={isHKRetrieveModalOpen ? 'Loading...' : 'Accept'}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    { workouts && workouts.length > 0 ? _.map(workouts, (workout, index) => {
                        if(workout.deleted) {
                            return(<View key={index} />)
                        }
                        let { sportDuration, sportImage, sportName, sportText, } = PlanLogic.handleHealthKitWorkoutPageRenderLogic(workout);
                        /*eslint no-return-assign: 0*//*
                        return(
                            <ScrollView
                                contentContainerStyle={{flexGrow: 1,}}
                                key={index}
                                keyboardShouldPersistTaps={'always'}
                                nestedScrollEnabled={true}
                                ref={ref => {this.scrollViewHealthKitRef[index] = ref;}}
                            >

                                <View style={{height: (AppSizes.screen.height - pillsHeight), justifyContent: 'center',}}>
                                    <View>
                                        <View style={{alignItems: 'center',}}>
                                            <Image
                                                source={sportImage}
                                                style={[styles.shadowEffect, {height: AppSizes.screen.widthThird, tintColor: AppColors.zeplin.splash, width: AppSizes.screen.widthThird,}]}
                                            />
                                        </View>
                                        <FormInput
                                            autoCapitalize={'none'}
                                            blurOnSubmit={true}
                                            clearButtonMode={'never'}
                                            clearTextOnFocus={true}
                                            containerStyle={{display: 'none',}}
                                            inputRef={ref => this.textInput[index] = ref}
                                            inputStyle={{display: 'none',}}
                                            keyboardType={'numeric'}
                                            onChangeText={value => handleHealthDataFormChange((pageIndex - 1), 'duration', parseInt(value, 10))}
                                            onEndEditing={() => this.setState({ isEditingDuration: false, })}
                                            placeholder={''}
                                            placeholderTextColor={AppColors.transparent}
                                            returnKeyType={'done'}
                                            value={''}
                                        />
                                        <Spacer size={AppSizes.paddingSml} />
                                        <Text robotoLight style={{color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(28), paddingHorizontal: AppSizes.padding, textAlign: 'center',}}>
                                            {'Was your '}
                                            <Text robotoBold>{sportText}</Text>
                                        </Text>
                                        <Text oswaldMedium style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>
                                            <Text oswaldMedium style={[isEditingDuration ? {color: AppColors.zeplin.slateXLight,} : {}, {textDecorationLine: 'underline',}]}>{sportDuration}</Text>
                                            {' MINUTES?'}
                                        </Text>
                                        <Spacer size={AppSizes.padding} />
                                        <TouchableOpacity
                                            onPress={() => this._editDuration(index)}
                                            style={{alignSelf: 'center', borderColor: AppColors.zeplin.slateLight, borderWidth: 1, borderRadius: AppSizes.paddingLrg, flexDirection: 'row', marginBottom: AppSizes.paddingSml, padding: AppSizes.paddingSml, width: AppSizes.screen.widthHalf,}}
                                        >
                                            <TabIcon
                                                containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                                                color={AppColors.zeplin.slateLight}
                                                icon={'clock-outline'}
                                                reverse={false}
                                                size={20}
                                                type={'material-community'}
                                            />
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(17),}}>{'Edit time'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleHealthDataFormChange((pageIndex - 1), 'deleted', true, () => {
                                                    this._renderNextPage(pageIndex);
                                                });
                                            }}
                                            style={{alignSelf: 'center', borderColor: AppColors.zeplin.slateLight, borderWidth: 1, borderRadius: AppSizes.paddingLrg, flexDirection: 'row', padding: AppSizes.paddingSml, width: AppSizes.screen.widthHalf,}}
                                        >
                                            <TabIcon
                                                containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                                                color={AppColors.zeplin.slateLight}
                                                icon={'close'}
                                                reverse={false}
                                                size={20}
                                                type={'material'}
                                            />
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(17),}}>{'No, delete session'}</Text>
                                        </TouchableOpacity>
                                        <Spacer size={AppSizes.padding} />
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.setState(
                                                    { showRPEPicker: true, },
                                                    () => this._scrollTo(this._activityRPERef, this.scrollViewHealthKitRef[index]),
                                                )
                                            }
                                            style={{alignSelf: 'center', backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, padding: AppSizes.paddingSml, width: AppSizes.screen.widthTwoThirds,}}
                                        >
                                            <Text robotoMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'Yes'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View
                                    onLayout={event => {
                                        let yLocation = (event.nativeEvent.layout.y);
                                        this._activityRPERef = {x: event.nativeEvent.layout.x, y: yLocation,}
                                    }}
                                    style={{flex: 1,}}
                                >
                                    { showRPEPicker ?
                                        <View>
                                            <Spacer size={20} />
                                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(32),}]}>
                                                {'How was your '}
                                                <Text robotoMedium>{`${sportName.toLowerCase()} workout?`}</Text>
                                            </Text>
                                            <View style={{paddingVertical: AppSizes.paddingSml,}}>
                                                { _.map(MyPlanConstants.postSessionFeel, (scale, key) => {
                                                    let RPEValue = workout.post_session_survey.RPE;
                                                    let isSelected = RPEValue === scale.value;
                                                    return(
                                                        <ScaleButton
                                                            isSelected={isSelected}
                                                            key={key}
                                                            scale={scale}
                                                            updateStateAndForm={() => {
                                                                handleHealthDataFormChange((pageIndex - 1), 'post_session_survey.RPE', scale.value);
                                                                if(showAddContinueBtns) {
                                                                    this._scrollToBottom(this.scrollViewHealthKitRef[index]);
                                                                } else {
                                                                    this._renderNextPage(pageIndex);
                                                                }
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </View>
                                            <Spacer size={40} />
                                        </View>
                                        :
                                        null
                                    }
                                </View>

                                { showAddContinueBtns && showRPEPicker && workouts[(pageIndex - 1)] && workouts[(pageIndex - 1)].post_session_survey && workouts[(pageIndex - 1)].post_session_survey.RPE ?
                                    <View>
                                        <BackNextButtons
                                            addBtnText={'Add another session'}
                                            handleFormSubmit={() => this.props.handleNextStep(true, 'continue')}
                                            isValid={true}
                                            onBackClick={() => this.props.handleNextStep(true, 'add_session')}
                                            showAddBtn={true}
                                            showBackIcon={true}
                                            showSubmitBtn={true}
                                            submitBtnText={'Continue'}
                                        />
                                    </View>
                                    :
                                    null
                                }

                            </ScrollView>
                        )
                    }) : <View />}

                </Pages>

                <SlidingUpPanel
                    allowDragging={false}
                    backdropOpacity={0.8}
                    ref={ref => {this._hkPanel = ref;}}
                >
                    <View style={{flex: 1, flexDirection: 'column',}}>
                        <View style={{flex: 1,}} />
                        <View style={{backgroundColor: AppColors.white,}}>
                            <View style={{backgroundColor: AppColors.zeplin.superLight, flexDirection: 'row', padding: AppSizes.padding,}}>
                                <Text oswaldMedium style={{color: AppColors.zeplin.splash, flex: 9, fontSize: AppFonts.scaleFont(22),}}>{'AUTO-DETECTED WORKOUTS'}</Text>
                                <TabIcon
                                    containerStyle={[{flex: 1,}]}
                                    icon={'close'}
                                    iconStyle={[{color: AppColors.black, opacity: 0.3,}]}
                                    onPress={() => this._hkPanel.hide()}
                                    reverse={false}
                                    size={30}
                                    type={'material-community'}
                                />
                            </View>
                            <View style={{padding: AppSizes.paddingLrg,}}>
                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16), lineHeight: AppFonts.scaleFont(22),}}>
                                    {'Fathom syncs with Apple Health to automatically log your workouts.\n'}
                                </Text>
                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16), lineHeight: AppFonts.scaleFont(22),}}>
                                    {'Today we found the following activities! '}
                                    <Text robotoBold>{'Tap "Accept"'}</Text>
                                    {' to add them to your Fathom training history or '}
                                    <Text robotoBold>{'tap "X"'}</Text>
                                    {' to delete.\n'}
                                </Text>
                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16), lineHeight: AppFonts.scaleFont(22),}}>
                                    {'If you\'d like to manually add another activity, you can do so later.'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </SlidingUpPanel>

                {/* isHKRetrieveModalOpen &&
                    <Loading
                        text={'Processing Heart Rate Data...'}
                    />
                */}

            </View>
        )
    }
}

HealthKitWorkouts.propTypes = {
    handleHealthDataFormChange:    PropTypes.func.isRequired,
    handleNextStep:                PropTypes.func.isRequired,
    handleTogglePostSessionSurvey: PropTypes.func,
    handleToggleSurvey:            PropTypes.func.isRequired,
    isPostSession:                 PropTypes.bool,
    resetFirstPage:                PropTypes.bool,
    trainingSessions:              PropTypes.array.isRequired,
    user:                          PropTypes.object.isRequired,
    workouts:                      PropTypes.array.isRequired,
};

HealthKitWorkouts.defaultProps = {
    handleTogglePostSessionSurvey: null,
    isPostSession:                 false,
    resetFirstPage:                false,
};

HealthKitWorkouts.componentName = 'HealthKitWorkouts';

/* Export Component ================================================================== */
export default HealthKitWorkouts;