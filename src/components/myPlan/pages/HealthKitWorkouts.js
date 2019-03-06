/**
 * HealthKitWorkouts
 *
    <HealthKitWorkouts
        handleHealthDataFormChange={handleHealthDataFormChange}
        handleNextStep={() => this._checkNextStep(0)}
        handleTogglePostSessionSurvey={handleTogglePostSessionSurvey}
        handleToggleSurvey={handleTogglePostSessionSurvey}
        workouts={healthKitWorkouts}
    />
 *
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, Keyboard, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, FormInput, Pages, Spacer, TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { BackNextButtons, ProgressPill, ScaleButton, } from './';

// import third-party libraries
import _ from 'lodash';
import SlidingUpPanel from 'rn-sliding-up-panel';

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
        borderColor:     AppColors.zeplin.light,
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
                    style={{height: 50, tintColor: workout.deleted ? AppColors.zeplin.light : AppColors.zeplin.seaBlue, width: 50,}}
                />
            </View>
            <View style={{flex: 4, paddingLeft: AppSizes.paddingSml,}}>
                <Text robotoMedium style={{color: workout.deleted ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(18),}}>{sportName}</Text>
            </View>
            <View style={{flex: 2, paddingLeft: AppSizes.paddingXSml,}}>
                <Text robotoMedium style={{color: workout.deleted ? AppColors.zeplin.light : AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(15),}}>{sportStartTime}</Text>
            </View>
            <TabIcon
                containerStyle={[{flex: 1,}]}
                color={AppColors.zeplin.lightSlate}
                icon={workout.deleted ? 'add' : 'close'}
                onPress={() => handleHealthDataFormChange(!workout.deleted)}
                reverse={false}
                size={30}
                type={'material'}
            />
        </View>
    )
};

class HealthKitWorkouts extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            delayTimerId:       null,
            isEditingDuration:  false,
            isSlideUpPanelOpen: false,
            pageIndex:          0,
            showRPEPicker:      false,
        };
        this._activityRPERef = {};
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

    _resetStep = pageIndex => {
        const { handleHealthDataFormChange, } = this.props;
        this.setState(
            { showRPEPicker: false, },
            () => {
                if(pageIndex > 0) {
                    handleHealthDataFormChange(pageIndex, 'deleted', false, () => {
                        handleHealthDataFormChange(pageIndex, 'post_session_survey.RPE', null);
                    });
                }
                this.setState({
                    delayTimerId: _.delay(() => this._scrollTo({x: 0, y: 0}), 500),
                });
            }
        );
    }

    _renderNextPage = currentPage => {
        Keyboard.dismiss();
        let numberOfNonDeletedWorkouts = _.filter(this.props.workouts, ['deleted', false]);
        if(numberOfNonDeletedWorkouts.length === 0) {
            this.props.handleToggleSurvey(true);
        } else if(currentPage === this.props.workouts.length || (currentPage + 1) > numberOfNonDeletedWorkouts.length) {
            this.props.handleNextStep(true);
        } else {
            this.pages.scrollToPage(currentPage + 1);
            this.setState({
                delayTimerId: _.delay(() => {
                    this.setState({
                        isEditingDuration: false,
                        pageIndex:         (currentPage + 1),
                        showRPEPicker:     false,
                    });
                    this._scrollTo({x: 0, y: 0});
                }, 500)
            });
        }
    }

    _editDuration = index => {
        this.textInput[index].focus();
        this.setState({ isEditingDuration: true, });
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

    _deleteAllWorkouts = () => {
        const { handleHealthDataFormChange, workouts, } = this.props;
        let i = 0;
        _.map(workouts, (workout, index) => {
            _.delay(() => handleHealthDataFormChange(index, 'deleted', true), 200 * i);
            i = i + 1;
        });
    }

    _updateBackPageIndex = pageIndex => {
        this.pages.scrollToPage(pageIndex);
        this.setState(
            { pageIndex: pageIndex, },
            () => this.state.pageIndex === 0 ? null : this._resetStep(this.state.pageIndex),
        );
    }

    render = () => {
        const { handleHealthDataFormChange, handleTogglePostSessionSurvey, isPostSession, workouts, } = this.props;
        const { isEditingDuration, isSlideUpPanelOpen, pageIndex, showRPEPicker, } = this.state;
        let pillsHeight = (AppSizes.statusBarHeight + AppSizes.progressPillsHeight);
        let filteredWorkouts = _.filter(workouts, ['deleted', false]);
        return(
            <View style={{flex: 1,}}>

                <ProgressPill
                    currentStep={1}
                    onBack={pageIndex > 0 ? () => this._updateBackPageIndex(pageIndex - 1) : null}
                    onClose={handleTogglePostSessionSurvey}
                    totalSteps={isPostSession ? 2 : 3}
                />

                <Pages
                    indicatorPosition={'none'}
                    ref={pages => { this.pages = pages; }}
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
                                        <Text robotoLight style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(30), textAlign: 'center',}}>{'We detected the following workouts from Apple Health:'}</Text>
                                    </View>
                                    <View style={{flex: 1,}}>
                                        <TabIcon
                                            color={AppColors.zeplin.light}
                                            icon={'help'}
                                            onPress={() => this.setState({ isSlideUpPanelOpen: !this.state.isSlideUpPanelOpen, })}
                                            reverse={false}
                                            size={20}
                                            type={'material'}
                                        />
                                    </View>
                                </View>
                                {_.map(workouts, (workout, index) =>
                                    <WorkoutListDetail
                                        handleHealthDataFormChange={isDeleted => handleHealthDataFormChange(index, 'deleted', isDeleted)}
                                        key={index}
                                        workout={workout}
                                    />
                                )}
                            </View>
                            <View>
                                <BackNextButtons
                                    addBtnText={'Delete all sessions'}
                                    handleFormSubmit={() => this._renderNextPage(pageIndex)}
                                    isValid={true}
                                    onBackClick={() => this._deleteAllWorkouts()}
                                    showAddBtn={true}
                                    showAddBtnDisabledStyle={true}
                                    showBackIcon={false}
                                    showSubmitBtn={true}
                                    submitBtnText={'Accept'}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    { filteredWorkouts && filteredWorkouts.length > 0 ? _.map(filteredWorkouts, (workout, index) => {
                        let { sportDuration, sportImage, sportName, sportText, } = PlanLogic.handleHealthKitWorkoutPageRenderLogic(workout);
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
                                                style={[styles.shadowEffect, {height: AppSizes.screen.widthThird, tintColor: AppColors.zeplin.seaBlue, width: AppSizes.screen.widthThird,}]}
                                            />
                                        </View>
                                        <FormInput
                                            autoCapitalize={'none'}
                                            blurOnSubmit={true}
                                            clearButtonMode={'while-editing'}
                                            containerStyle={[{display: 'none',}]}
                                            inputStyle={[{display: 'none',}]}
                                            keyboardType={'numeric'}
                                            onChangeText={value => handleHealthDataFormChange((pageIndex - 1), 'duration', parseInt(value, 10))}
                                            onEndEditing={() => this.setState({ isEditingDuration: false, })}
                                            placeholder={''}
                                            placeholderTextColor={AppColors.transparent}
                                            returnKeyType={'done'}
                                            textInputRef={input => {this.textInput[index] = input;}}
                                            value={''}
                                        />
                                        <Spacer size={AppSizes.paddingSml} />
                                        <Text robotoLight style={{color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(28), paddingHorizontal: AppSizes.padding, textAlign: 'center',}}>
                                            {'Was your '}
                                            <Text robotoBold>{sportText}</Text>
                                        </Text>
                                        <Text oswaldMedium style={{color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>
                                            <Text oswaldMedium style={[isEditingDuration ? {color: AppColors.zeplin.light,} : {}, {textDecorationLine: 'underline',}]}>{sportDuration}</Text>
                                            {' MINUTES?'}
                                        </Text>
                                        <Spacer size={AppSizes.padding} />
                                        <TouchableOpacity
                                            onPress={() => this._editDuration(index)}
                                            style={{alignSelf: 'center', borderColor: AppColors.zeplin.lightSlate, borderWidth: 1, borderRadius: 5, flexDirection: 'row', marginBottom: AppSizes.paddingSml, padding: AppSizes.paddingSml, width: AppSizes.screen.widthHalf,}}
                                        >
                                            <TabIcon
                                                containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                                                color={AppColors.zeplin.lightSlate}
                                                icon={'clock-outline'}
                                                reverse={false}
                                                size={20}
                                                type={'material-community'}
                                            />
                                            <Text robotoRegular style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(17),}}>{'Edit time'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleHealthDataFormChange((pageIndex - 1), 'deleted', true, () => {
                                                    this._renderNextPage(pageIndex);
                                                });
                                            }}
                                            style={{alignSelf: 'center', borderColor: AppColors.zeplin.lightSlate, borderWidth: 1, borderRadius: 5, flexDirection: 'row', padding: AppSizes.paddingSml, width: AppSizes.screen.widthHalf,}}
                                        >
                                            <TabIcon
                                                containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                                                color={AppColors.zeplin.lightSlate}
                                                icon={'close'}
                                                reverse={false}
                                                size={20}
                                                type={'material'}
                                            />
                                            <Text robotoRegular style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(17),}}>{'No, delete session'}</Text>
                                        </TouchableOpacity>
                                        <Spacer size={AppSizes.padding} />
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.setState(
                                                    { showRPEPicker: true, },
                                                    () => this._scrollTo(this._activityRPERef, this.scrollViewHealthKitRef[index]),
                                                )
                                            }
                                            style={{alignSelf: 'center', backgroundColor: AppColors.zeplin.yellow, borderRadius: 5, padding: AppSizes.paddingSml, width: AppSizes.screen.widthTwoThirds,}}
                                        >
                                            <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{'Yes'}</Text>
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
                                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                                {'How was your '}
                                                <Text robotoMedium>{`${sportName.toLowerCase()} workout?`}</Text>
                                            </Text>
                                            <View style={{flex: 1, paddingTop: AppSizes.paddingSml,}}>
                                                { _.map(MyPlanConstants.postSessionFeel, (value, key) => {
                                                    let isSelected = workout.post_session_survey.RPE === key;
                                                    let opacity = isSelected ? 1 : (key * 0.1);
                                                    return(
                                                        <TouchableHighlight
                                                            key={value+key}
                                                            onPress={() => {
                                                                handleHealthDataFormChange((pageIndex - 1), 'post_session_survey.RPE', key);
                                                                this._renderNextPage(pageIndex);
                                                            }}
                                                            underlayColor={AppColors.transparent}
                                                        >
                                                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingVertical: AppSizes.paddingXSml,}}>
                                                                <View style={{alignItems: 'flex-end', alignSelf: 'center', flex: 4, justifyContent: 'center',}}>
                                                                    <ScaleButton
                                                                        isSelected={isSelected}
                                                                        keyLabel={key}
                                                                        opacity={opacity}
                                                                        sorenessPainMappingLength={MyPlanConstants.postSessionFeel.length}
                                                                        updateStateAndForm={() => {
                                                                            handleHealthDataFormChange((pageIndex - 1), 'post_session_survey.RPE', key);
                                                                            if(filteredWorkouts.length !== pageIndex) {
                                                                                this._renderNextPage(pageIndex);
                                                                            } else {
                                                                                this._scrollToBottom(this.scrollViewHealthKitRef[index]);
                                                                            }
                                                                        }}
                                                                    />
                                                                </View>
                                                                <View style={{flex: 6, justifyContent: 'center', paddingLeft: AppSizes.padding,}}>
                                                                    <Text
                                                                        oswaldMedium
                                                                        style={{
                                                                            color:    isSelected ? AppColors.primary.yellow.hundredPercent : AppColors.zeplin.darkGrey,
                                                                            fontSize: AppFonts.scaleFont(isSelected ? 22 : 14),
                                                                        }}
                                                                    >
                                                                        {value.toUpperCase()}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </TouchableHighlight>
                                                    )
                                                })}
                                            </View>
                                            <Spacer size={40} />
                                        </View>
                                        :
                                        null
                                    }
                                </View>

                                { filteredWorkouts.length === pageIndex && showRPEPicker ?
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
                    startCollapsed={true}
                    visible={isSlideUpPanelOpen}
                >
                    <View style={{flex: 1, flexDirection: 'column',}}>
                        <View style={{flex: 1,}} />
                        <View style={{backgroundColor: AppColors.white,}}>
                            <View style={{backgroundColor: AppColors.zeplin.superLight, flexDirection: 'row', padding: AppSizes.padding,}}>
                                <Text oswaldMedium style={{color: AppColors.zeplin.seaBlue, flex: 9, fontSize: AppFonts.scaleFont(22),}}>{'AUTO-DETECTED WORKOUTS'}</Text>
                                <TabIcon
                                    containerStyle={[{flex: 1,}]}
                                    icon={'close'}
                                    iconStyle={[{color: AppColors.black, opacity: 0.3,}]}
                                    onPress={() => this.setState({ isSlideUpPanelOpen: !this.state.isSlideUpPanelOpen, })}
                                    reverse={false}
                                    size={30}
                                    type={'material-community'}
                                />
                            </View>
                            <View style={{padding: AppSizes.paddingLrg,}}>
                                <Text robotoRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(16), lineHeight: AppFonts.scaleFont(22),}}>
                                    {'Fathom syncs with Apple Health to automatically log your workouts.\n'}
                                </Text>
                                <Text robotoRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(16), lineHeight: AppFonts.scaleFont(22),}}>
                                    {'Today we found the following activities! '}
                                    <Text robotoBold>{'Tap "Accept"'}</Text>
                                    {' to add them to your Fathom training history or '}
                                    <Text robotoBold>{'tap "X"'}</Text>
                                    {' to delete.\n'}
                                </Text>
                                <Text robotoRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(16), lineHeight: AppFonts.scaleFont(22),}}>
                                    {'If you\'d like to manually add another activity, you can do so later.'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </SlidingUpPanel>

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
    workouts:                      PropTypes.array.isRequired,
};

HealthKitWorkouts.defaultProps = {
    handleTogglePostSessionSurvey: null,
    isPostSession:                 false,
};

HealthKitWorkouts.componentName = 'HealthKitWorkouts';

/* Export Component ================================================================== */
export default HealthKitWorkouts;