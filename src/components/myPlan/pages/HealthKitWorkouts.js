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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Keyboard, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, FormInput, Spacer, TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { ProgressPill, ScaleButton, } from './';

// import third-party libraries
import _ from 'lodash';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  {  height: 3, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  6,
    },
});

/* Component ==================================================================== */
class HealthKitWorkouts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditingDuration: false,
            pageIndex:         0,
            showRPEPicker:     false,
        };
        this._activityRPERef = {};
        this.scrollViewHealthKitRef = {};
        this.textInput = {};
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(prevProps.resetFirstPage !== this.props.resetFirstPage) {
            this._resetStep(this.state.pageIndex);
        }
    }

    _resetStep = pageIndex => {
        const { handleHealthDataFormChange, } = this.props;
        this.setState(
            { showRPEPicker: false, },
            () => {
                handleHealthDataFormChange(pageIndex, 'deleted', false);
                handleHealthDataFormChange(pageIndex, 'post_session_survey.RPE', null);
                _.delay(() => this._scrollTo({x: 0, y: 0}), 500);
            }
        );
    }

    _renderNextPage = currentPage => {
        Keyboard.dismiss();
        let numberOfNonDeletedWorkouts = _.filter(this.props.workouts, ['deleted', false]);
        if(numberOfNonDeletedWorkouts.length === 0) {
            this.props.handleToggleSurvey(true);
        } else if((currentPage + 1) === this.props.workouts.length) {
            this.props.handleNextStep(true);
        } else {
            _.delay(() => {
                this.setState({
                    isEditingDuration: false,
                    pageIndex:         (currentPage + 1),
                    showRPEPicker:     false,
                });
                this._scrollTo({x: 0, y: 0});
            }, 500);
        }
    }

    _editDuration = () => {
        this.textInput.focus();
        this.setState({ isEditingDuration: true, });
    }

    _scrollTo = myComponentsLocation => {
        if(myComponentsLocation) {
            _.delay(() => {
                this.scrollViewHealthKitRef.scrollTo({
                    x:        myComponentsLocation.x,
                    y:        myComponentsLocation.y,
                    animated: true,
                });
            }, 500);
        }
    }

    render = () => {
        const { handleHealthDataFormChange, handleTogglePostSessionSurvey, isPostSession, workouts, } = this.props;
        const { isEditingDuration, pageIndex, showRPEPicker, } = this.state;
        let { partOfDay, sportDuration, sportImage, sportText, } = PlanLogic.handleHealthKitWorkoutPageRenderLogic(workouts[pageIndex]);
        let pillsHeight = (AppSizes.statusBarHeight + AppSizes.progressPillsHeight + AppSizes.paddingLrg);
        return(
            <ScrollView
                contentContainerStyle={{flexGrow: 1,}}
                keyboardShouldPersistTaps={'always'}
                ref={ref => {this.scrollViewHealthKitRef = ref;}}
                stickyHeaderIndices={[0]}
            >
                <ProgressPill
                    currentStep={1}
                    onBack={isPostSession && pageIndex > 0 ? () => this.setState({ pageIndex: (pageIndex - 1), }, () => this._resetStep(pageIndex)) : null}
                    onClose={handleTogglePostSessionSurvey}
                    totalSteps={isPostSession ? 2 : 3}
                />
                <Spacer size={20} />
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
                    onChangeText={value => handleHealthDataFormChange(pageIndex, 'duration', parseInt(value, 10))}
                    onEndEditing={() => this.setState({ isEditingDuration: false, })}
                    placeholder={''}
                    placeholderTextColor={AppColors.transparent}
                    returnKeyType={'done'}
                    textInputRef={input => {this.textInput = input;}}
                    value={''}
                />
                <Spacer size={AppSizes.paddingSml} />
                <Text robotoLight style={{color: AppColors.zeplin.darkNavy, fontSize: AppFonts.scaleFont(28), paddingHorizontal: AppSizes.padding, textAlign: 'center',}}>{`Did you do a ${sportText} workout this ${partOfDay} for`}</Text>
                <Text oswaldMedium style={{color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>
                    <Text oswaldMedium style={[isEditingDuration ? {color: AppColors.zeplin.light,} : {}]}>{sportDuration}</Text>
                    {' MINUTES?'}
                </Text>
                <Spacer size={AppSizes.padding} />
                <TouchableOpacity
                    onPress={() => this._editDuration()}
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
                        handleHealthDataFormChange(pageIndex, 'deleted', true, () => {
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
                <Button
                    backgroundColor={AppColors.zeplin.yellow}
                    buttonStyle={{width: AppSizes.screen.widthTwoThirds,}}
                    containerViewStyle={{alignItems: 'center', flex: 1, margin: 0,}}
                    color={AppColors.white}
                    fontFamily={AppStyles.robotoBold.fontFamily}
                    fontWeight={AppStyles.robotoBold.fontWeight}
                    outlined={false}
                    onPress={() =>
                        this.setState(
                            { showRPEPicker: true, },
                            () => this._scrollTo(this._activityRPERef),
                        )
                    }
                    raised={false}
                    textStyle={{ flex: 1, fontSize: AppFonts.scaleFont(22), textAlign: 'center', }}
                    title={'Yes'}
                />
                <Spacer size={30} />
                <View
                    onLayout={event => {
                        let yLocation = (event.nativeEvent.layout.y - pillsHeight);
                        this._activityRPERef = {x: event.nativeEvent.layout.x, y: yLocation,}
                    }}
                    style={{flex: 1,}}
                >
                    { showRPEPicker ?
                        <View>
                            <Spacer size={20} />
                            <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                {'How was your '}
                                <Text robotoMedium>{`${sportText} workout?`}</Text>
                            </Text>
                            <View style={{flex: 1, paddingTop: AppSizes.paddingSml,}}>
                                { _.map(MyPlanConstants.postSessionFeel, (value, key) => {
                                    let isSelected = workouts[pageIndex].post_session_survey.RPE === key;
                                    let opacity = isSelected ? 1 : (key * 0.1);
                                    return(
                                        <TouchableHighlight
                                            key={value+key}
                                            onPress={() => {
                                                handleHealthDataFormChange(pageIndex, 'post_session_survey.RPE', key);
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
                                                            handleHealthDataFormChange(pageIndex, 'post_session_survey.RPE', key);
                                                            this._renderNextPage(pageIndex);
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
                        </View>
                        :
                        null
                    }
                </View>
                <Spacer size={40} />
            </ScrollView>
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