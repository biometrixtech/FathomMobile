/**
 * HealthKitWorkouts
 *
    <HealthKitWorkouts
        handleHealthDataFormChange={handleHealthDataFormChange}
        handleNextStep={() => this._checkNextStep(0)}
        handleTogglePostSessionSurvey={handleTogglePostSessionSurvey}
        handleToggleSurvey={handleTogglePostSessionSurvey}
        resetFirstPage={resetHealthKitFirstPage}
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
import { Loading, } from '../../general';

// import third-party libraries
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import AppleHealthKit from 'rn-apple-healthkit';
import SlidingUpPanel from 'rn-sliding-up-panel';
import moment from 'moment';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  {  height: 3, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  6,
    },
    activeWorkoutListDetailWrapper: {
        backgroundColor: AppColors.zeplin.superLight,
        borderColor:     AppColors.zeplin.superLight,
        borderWidth:     2,
    },
    deletedWorkoutListDetailWrapper: {
        backgroundColor: AppColors.transparent,
        borderColor:     AppColors.zeplin.slateXLight,
        borderStyle:     'dashed',
        borderWidth:     2,
    },
    workoutListDetailWrapper: {
        alignItems:      'center',
        backgroundColor: AppColors.transparent,
        flexDirection:   'row',
        marginBottom:    AppSizes.paddingSml,
        paddingVertical: AppSizes.paddingMed,
    },
});

/* Component ==================================================================== */
const WorkoutListDetail = ({
    handleHealthDataFormChange,
    workout,
}) => {
    if(!workout) {
        return(null);
    }
    let { sportImage, sportName, sportStartTime, } = PlanLogic.handleHealthKitWorkoutPageRenderLogic(workout);
    return(
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
    )
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

    _deleteAllWorkouts = () => {
        const { handleHealthDataFormChange, workouts, } = this.props;
        let i = 0;
        _.map(workouts, (workout, index) => {
            _.delay(() => handleHealthDataFormChange(index, 'deleted', true), 200 * i);
            i = i + 1;
        });
    }

    _editDuration = index => {
        this.textInput[index].focus();
        this.setState({ isEditingDuration: true, });
    }

    _handleHeartRateDataCheck = currentPage => {
        const { isHKRetrieveChecked, } = this.state;
        const { handleHealthDataFormChange, workouts, } = this.props;
        if(isHKRetrieveChecked) {
            return this.setState(
                { isHKRetrieveModalOpen: true, },
                async () => {
                    let appleHealthKitPerms = AppUtil._getAppleHealthKitPerms();
                    return await Promise.all(
                        _.map(workouts, (workout, index) => {
                            return AppUtil._getHeartRateSamples(
                                appleHealthKitPerms,
                                moment(workout.event_date.replace('Z', ''), 'YYYY-MM-DDThh:mm:ss.SSS').subtract(1, 'minutes').toISOString(),
                                moment(workout.end_date.replace('Z', ''), 'YYYY-MM-DDThh:mm:ss.SSS').add(1, 'minutes').toISOString(),
                                workout.deleted,
                                AppleHealthKit
                            );
                        })
                    )
                        .then(res =>
                            _.map(workouts, (workout, index) => {
                                handleHealthDataFormChange(index, 'hr_data', res[index], () => index === (workouts.length - 1) ?
                                    this.setState(
                                        { isHKRetrieveModalOpen: false, },
                                        () => _.delay(() => this._renderNextPage(currentPage), 250),
                                    )
                                    :
                                    null
                                );
                            })
                        );
                }
            );
        }
        return this._renderNextPage(currentPage);
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
        const { handleHealthDataFormChange, handleTogglePostSessionSurvey, isPostSession, user, workouts, } = this.props;
        const { isEditingDuration, isHKRetrieveChecked, isHKRetrieveModalOpen, pageIndex, showAddContinueBtns, showRPEPicker, } = this.state;
        let pillsHeight = (AppSizes.statusBarHeight + AppSizes.progressPillsHeight);
        return(
            <View style={{flex: 1,}}>

                <ProgressPill
                    currentStep={1}
                    onBack={pageIndex > 0 && !isHKRetrieveModalOpen ? () => this._updateBackPageIndex(pageIndex - 1) : null}
                    onClose={isHKRetrieveModalOpen || !isPostSession ? null : () => handleTogglePostSessionSurvey()}
                    totalSteps={3}
                />

                <Pages
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
                        /*eslint no-return-assign: 0*/
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
                    ref={ref => this._hkPanel = ref}
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