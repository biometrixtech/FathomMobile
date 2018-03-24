/*
 * @Author: Vir Desai 
 * @Date: 2018-03-14 02:31:05 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-23 23:39:36
 */

import React, { Component } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { ButtonGroup, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { Roles, Thresholds, ErrorMessages } from '@constants/';

// Components
import { ListItem, Text, CircularProgress, DailyLoadChart, Spacer, Card } from '@ui/';
import { Placeholder } from '@general/';

const noPastData = 'Data history not present to calculate target weekly load';
const noData = 'No data to show for this range...';

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const DAY_OF_WEEK_MAP = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
const GRAPH_INDEX_MAP = { CIRCULAR_PROGRESS: 0, DAILY_LOAD_CHART: 1 };

/* Component ==================================================================== */
class TrainingReport extends Component {
    static componentName = 'ReportView';
    
    static propTypes = {
        user:         PropTypes.object,
        getTeams:     PropTypes.func.isRequired,
        getTeamStats: PropTypes.func.isRequired,
        startRequest: PropTypes.func.isRequired,
        stopRequest:  PropTypes.func.isRequired,
        selectGraph:  PropTypes.func.isRequired,
    }
    
    static defaultProps = {
        user: {
            teamIndex: 0
        },
    }

    constructor(props) {
        super(props);
        this.state = {
            // selectedIndex:                    1,
            preprocessing_upload_visible:     true,
            preprocessing_processing_visible: true,
            preprocessing_error_visible:      true,
            circularProgressHeight:           0,
            dailyLoadChartHeight:             0,
            textHeight:                       0,
        };
    }

    componentWillMount = () => {
        return this.props.startRequest()
            .then(() => this.props.getTeams(this.props.user.statsStartDate, this.props.user.statsEndDate, this.props.user.weekOffset))
            .then(() => this.props.stopRequest());
    }

    preprocessingUpload = (uploadArray, role) => {
        if (!uploadArray || !uploadArray.length) {
            return null;
        }
        let red = AppColors.secondary.red.hundredPercent;
        let grey = AppColors.primary.white.hundredPercent;
        let text = '';
        if (role === Roles.athlete) {
            text = ErrorMessages.ATHLETE_PREPROCESSING_UPLOADING;
        } else {
            text = uploadArray.length === 1 ? ErrorMessages.SINGLE_PREPROCESSING_UPLOADING : ErrorMessages.MULTIPLE_PREPROCESSING_UPLOADING;
            text.replace('X', String(uploadArray.length));
        }
        return <ListItem
            title={null}
            subtitle={text}
            subtitleStyle={{ color: grey }}
            subtitleNumberOfLines={null}
            containerStyle={{ backgroundColor: red }}
            rightIcon={{ name: 'clear', color: grey }}
            onPressRightIcon={() => this.setState({ preprocessing_upload_visible: false })}
        />
    }

    preprocessingProcessing = (processingArray, role) => {
        if (!processingArray || !processingArray.length) {
            return null;
        }
        let red = AppColors.secondary.red.hundredPercent;
        let grey = AppColors.primary.white.hundredPercent;
        let text = '';
        if (role === Roles.athlete) {
            text = ErrorMessages.ATHLETE_PREPROCESSING_PROCESSING;
        } else {
            text = processingArray.length === 1 ? ErrorMessages.SINGLE_PREPROCESSING_PROCESSING : ErrorMessages.MULTIPLE_PREPROCESSING_PROCESSING;
            text.replace('X', String(processingArray.length));
        }
        return <ListItem
            title={null}
            subtitle={text}
            subtitleStyle={{ color: grey }}
            subtitleNumberOfLines={null}
            containerStyle={{ backgroundColor: red }}
            rightIcon={{ name: 'clear', color: grey }}
            onPressRightIcon={() => this.setState({ preprocessing_processing_visible: false })}
        />
    }

    preprocessingError = (errorArray, role) => {
        if (!errorArray || !errorArray.length) {
            return null;
        }
        let red = AppColors.secondary.red.hundredPercent;
        let grey = AppColors.primary.white.hundredPercent;
        let text = '';
        if (role === Roles.athlete) {
            text = ErrorMessages.ATHLETE_PREPROCESSING_ERROR;
        } else {
            text = errorArray.length === 1 ? ErrorMessages.SINGLE_PREPROCESSING_ERROR : ErrorMessages.MULTIPLE_PREPROCESSING_ERROR;
            text.replace('X', String(errorArray.length));
        }
        return <ListItem
            title={null}
            subtitle={text}
            subtitleStyle={{ color: grey }}
            subtitleNumberOfLines={null}
            containerStyle={{ backgroundColor: red }}
            rightIcon={{ name: 'clear', color: grey }}
            onPressRightIcon={() => this.setState({ preprocessing_error_visible: false })}
        />
    }

    preprocessingMessages = (preprocessing, role) => {
        if (!preprocessing) {
            return null;
        }
        return <View>
            { this.state.preprocessing_upload_visible ? this.preprocessingUpload(preprocessing.UPLOAD_IN_PROGRESS, role) : null }
            { this.state.preprocessing_processing_visible ? this.preprocessingProcessing(preprocessing.PROCESSING_IN_PROGRESS, role) : null }
            { this.state.preprocessing_error_visible ? this.preprocessingError(preprocessing.PROCESSING_FAILED, role) : null }
        </View>
    }

    resetVisibleStates = () => {
        this.setState({
            preprocessing_upload_visible:     true,
            preprocessing_processing_visible: true,
            preprocessing_error_visible:      true
        })
    };

    getProgressData = ({fatigueRateOfChange, avgFatigue, acwrTotalAccel7, acwrGRF7}) => {
        let cards = [];
        let fatigueRateOfChangeColorIndex = typeof(fatigueRateOfChange) === 'number' ? Thresholds.chart.fatigueRateAcrossDays.findIndex(colorThreshold => colorThreshold.max >= fatigueRateOfChange && colorThreshold.min < fatigueRateOfChange) : -1;
        let avgFatigueColorIndex = typeof(avgFatigue) === 'number' ? Thresholds.chart.fatigueRateAcrossDays.findIndex(colorThreshold => colorThreshold.max >= avgFatigue && colorThreshold.min < avgFatigue) : -1;
        let acwrTotalAccel7ColorIndex = typeof(acwrTotalAccel7) === 'number' ? Thresholds.chart.acwr.findIndex(colorThreshold => colorThreshold.max > acwrTotalAccel7 && colorThreshold.min <= acwrTotalAccel7) : -1;
        let acwrGRF7ColorIndex = typeof(acwrTotalAccel7) === 'number' ? Thresholds.chart.acwr.findIndex(colorThreshold => colorThreshold.max > acwrGRF7 && colorThreshold.min <= acwrGRF7) : -1;
        let minColorIndex = Math.min(...[fatigueRateOfChangeColorIndex, avgFatigueColorIndex, acwrTotalAccel7ColorIndex, acwrGRF7ColorIndex].filter(value => value !== -1), Number.POSITIVE_INFINITY);
        let color = minColorIndex === Number.POSITIVE_INFINITY ? AppColors.secondary.blue : Thresholds.chart.acwr[minColorIndex].color;
        if (fatigueRateOfChangeColorIndex !== -1 && avgFatigueColorIndex !== -1) {
            cards.push(Thresholds.chart.fatigueRateAcrossDays[fatigueRateOfChangeColorIndex < avgFatigueColorIndex ? fatigueRateOfChangeColorIndex : avgFatigueColorIndex]);
        } else if (fatigueRateOfChangeColorIndex !== -1) {
            cards.push(Thresholds.chart.fatigueRateAcrossDays[fatigueRateOfChangeColorIndex]);
        } else if (avgFatigueColorIndex !== -1) {
            cards.push(Thresholds.chart.fatigueRateAcrossDays[avgFatigueColorIndex]);
        }
        if (acwrTotalAccel7ColorIndex !== -1 && acwrGRF7ColorIndex !== -1) {
            cards.push(Thresholds.chart.acwr[acwrTotalAccel7ColorIndex < acwrGRF7ColorIndex ? acwrTotalAccel7ColorIndex : acwrGRF7ColorIndex]);
        } else if (acwrTotalAccel7ColorIndex !== -1) {
            cards.push(Thresholds.chart.acwr[acwrTotalAccel7ColorIndex]);
        } else if (acwrGRF7ColorIndex !== -1) {
            cards.push(Thresholds.chart.acwr[acwrGRF7ColorIndex]);
        }

        return ({color, cards});
    };

    getDailyBubbleData = ({fatigue, percOptimal, percLRGRFDiff, percLeftGRF, symmetry, hipSymmetry, ankleSymmetry, control, controlLF, controlRF, hipControl, ankleControl}) => {
        let cards = [];
        
        let fatigueColorIndex = typeof(fatigue) === 'number' ? Thresholds.chart.fatigueRateSingleDay.findIndex(colorThreshold => colorThreshold.max >= fatigue && colorThreshold.min <= fatigue) : -1;
        
        let percOptimalColorIndex = typeof(percOptimal) === 'number' ? Thresholds.chart.movementQualityScore.findIndex(colorThreshold => colorThreshold.max >= percOptimal && colorThreshold.min <= percOptimal) : -1;
        let percLRGRFDiffColorIndex = typeof(percLRGRFDiff) === 'number' ? Thresholds.chart.gfrDist.findIndex(colorThreshold => colorThreshold.max >= percLRGRFDiff && colorThreshold.min <= percLRGRFDiff) : -1;
        let percLeftGRFColorIndex = typeof(percLeftGRF) === 'number' ? Thresholds.chart.gfrDist.findIndex(colorThreshold => colorThreshold.max >= percLeftGRF && colorThreshold.min <= percLeftGRF) : -1;
        
        let symmetryColorIndex = typeof(symmetry) === 'number' ? Thresholds.chart.symmetry.findIndex(colorThreshold => colorThreshold.max >= symmetry && colorThreshold.min <= symmetry) : -1;
        let hipSymmetryColorIndex = typeof(hipSymmetry) === 'number' ? Thresholds.chart.symmetry.findIndex(colorThreshold => colorThreshold.max >= hipSymmetry && colorThreshold.min <= hipSymmetry) : -1;
        let ankleSymmetryColorIndex = typeof(ankleSymmetry) === 'number' ? Thresholds.chart.symmetry.findIndex(colorThreshold => colorThreshold.max >= ankleSymmetry && colorThreshold.min <= ankleSymmetry) : -1;
        
        let controlColorIndex = typeof(control) === 'number' ? Thresholds.chart.control.findIndex(colorThreshold => colorThreshold.max >= control && colorThreshold.min <= control) : -1;
        let controlLFColorIndex = typeof(controlLF) === 'number' ? Thresholds.chart.control.findIndex(colorThreshold => colorThreshold.max >= controlLF && colorThreshold.min <= controlLF) : -1;
        let controlRFColorIndex = typeof(controlRF) === 'number' ? Thresholds.chart.control.findIndex(colorThreshold => colorThreshold.max >= controlRF && colorThreshold.min <= controlRF) : -1;
        let hipControlColorIndex = typeof(hipControl) === 'number' ? Thresholds.chart.control.findIndex(colorThreshold => colorThreshold.max >= hipControl && colorThreshold.min <= hipControl) : -1;
        let ankleControlColorIndex = typeof(ankleControl) === 'number' ? Thresholds.chart.control.findIndex(colorThreshold => colorThreshold.max >= ankleControl && colorThreshold.min <= ankleControl) : -1;
        
        let minColorIndex = Math.min(...[fatigueColorIndex, percOptimalColorIndex, percLRGRFDiffColorIndex, percLeftGRFColorIndex, symmetryColorIndex, hipSymmetryColorIndex, ankleSymmetryColorIndex, controlColorIndex, controlLFColorIndex, controlRFColorIndex, hipControlColorIndex, ankleControlColorIndex].filter(value => value !== -1), Number.POSITIVE_INFINITY);
        let color = minColorIndex === Number.POSITIVE_INFINITY ? AppColors.secondary.blue : Thresholds.chart.fatigueRateSingleDay[minColorIndex].color;

        if (fatigueColorIndex !== -1) {
            cards.push(Thresholds.chart.fatigueRateSingleDay[fatigueColorIndex]);
        }

        if (percOptimalColorIndex !== -1) {
            cards.push(Thresholds.chart.movementQualityScore[percOptimalColorIndex]);
        }

        if (percLRGRFDiffColorIndex !== -1 && percLeftGRFColorIndex !== -1) {
            cards.push(Thresholds.chart.gfrDist[percLRGRFDiffColorIndex < percLeftGRFColorIndex ? percLRGRFDiffColorIndex : percLeftGRFColorIndex]);
        } else if (percLRGRFDiffColorIndex !== -1) {
            cards.push(Thresholds.chart.gfrDist[percLRGRFDiffColorIndex]);
        } else if (percLeftGRFColorIndex !== -1) {
            cards.push(Thresholds.chart.gfrDist[percLeftGRFColorIndex]);
        }

        if (symmetryColorIndex !== -1 || hipSymmetryColorIndex !== -1 || ankleSymmetryColorIndex !== -1) {
            let indexOfMinValue = [symmetryColorIndex, hipSymmetryColorIndex, ankleSymmetryColorIndex].reduce((iMin, x, i, arr) => x !== -1 && x < arr[iMin] ? i : iMin, 0);
            cards.push(Thresholds.chart.symmetry[indexOfMinValue]);
        }
        // if (symmetryColorIndex !== -1) {
        //     cards.push(Thresholds.chart.symmetry[symmetryColorIndex]);
        // } else if (hipSymmetryColorIndex !== -1) {
        //     cards.push(Thresholds.chart.symmetry[hipSymmetryColorIndex]);
        // } else if (ankleSymmetryColorIndex !== -1) {
        //     cards.push(Thresholds.chart.symmetry[ankleSymmetryColorIndex]);
        // }

        if (controlColorIndex !== -1 || controlLFColorIndex !== -1 || controlRFColorIndex !== -1 || hipControlColorIndex !== -1 || ankleControlColorIndex !== -1) {
            let indexOfMinValue = [controlColorIndex, controlLFColorIndex, controlRFColorIndex, hipControlColorIndex, ankleControlColorIndex].reduce((iMin, x, i, arr) => x !== -1 && x < arr[iMin] ? i : iMin, 0);
            cards.push(Thresholds.chart.control[indexOfMinValue]);
        }
        // if (controlColorIndex !== -1) {
        //     cards.push(Thresholds.chart.control[controlColorIndex]);
        // } else if (controlLFColorIndex !== -1) {
        //     cards.push(Thresholds.chart.control[controlLFColorIndex]);
        // } else if (controlRFColorIndex !== -1) {
        //     cards.push(Thresholds.chart.control[controlRFColorIndex]);
        // } else if (hipControlColorIndex !== -1) {
        //     cards.push(Thresholds.chart.control[hipControlColorIndex]);
        // } else if (ankleControlColorIndex !== -1) {
        //     cards.push(Thresholds.chart.control[ankleControlColorIndex]);
        // }

        return ({color, cards});
    };

    getGraphData = (userData, isCurrentWeekFocused) => {
        let focusedWeekComparisionPercentageOverall = 0;
        let focusedWeekComparisionPercentageToDate = 0;
        let color = AppColors.secondary.blue;
        let cards = [];
        let weekData = { M: {}, Tu: {}, W: {}, Th: {}, F: {}, Sa: {}, Su: {} };

        let focusedWeekStats = userData.stats;
        let previousWeekStats = userData.previousWeekStats;

        let previousWeekTrainingLoad = previousWeekStats && previousWeekStats.AthleteMovementQualityData.length 
            ? previousWeekStats.AthleteMovementQualityData.reduce((total, athleteData) => {
                let dayOfWeek = (new Date(athleteData.eventDate)).getDay();
                weekData[DAY_OF_WEEK_MAP[dayOfWeek]].previousWeek = weekData[DAY_OF_WEEK_MAP[dayOfWeek]].previousWeek ? weekData[DAY_OF_WEEK_MAP[dayOfWeek]].previousWeek + athleteData.totalAccel : athleteData.totalAccel;
                return total + athleteData.totalAccel;
            },0) : 0;

        let focusedWeekTrainingLoad = focusedWeekStats && focusedWeekStats.AthleteMovementQualityData.length
            ? focusedWeekStats.AthleteMovementQualityData.reduce((total, athleteData) => {
                let dayOfWeek = (new Date(athleteData.eventDate)).getDay();
                weekData[DAY_OF_WEEK_MAP[dayOfWeek]].focusedWeek = weekData[DAY_OF_WEEK_MAP[dayOfWeek]].focusedWeek ? weekData[DAY_OF_WEEK_MAP[dayOfWeek]].focusedWeek + athleteData.totalAccel : athleteData.totalAccel;
                let dayBubbleData = this.getDailyBubbleData(athleteData);
                weekData[DAY_OF_WEEK_MAP[dayOfWeek]].color = dayBubbleData.color;
                weekData[DAY_OF_WEEK_MAP[dayOfWeek]].cards = dayBubbleData.cards;
                return total + athleteData.totalAccel;
            }, 0) : 0;

        if (previousWeekTrainingLoad && focusedWeekTrainingLoad) {
            focusedWeekComparisionPercentageOverall = Math.round((focusedWeekTrainingLoad / previousWeekTrainingLoad) * 100);
            if (isCurrentWeekFocused) {
                let previousWeekTillCurrentDayOfWeekTotalAccel = previousWeekStats && previousWeekStats.AthleteMovementQualityData.length
                    ? previousWeekStats.AthleteMovementQualityData.reduce((total, athleteData) => {
                        return total + this.isInPreviousWeekBeforeCurrentDayOfWeek(athleteData.eventDate) ? athleteData.totalAccel : 0;
                    }, 0) : 0;
                focusedWeekComparisionPercentageToDate = Math.round((previousWeekTillCurrentDayOfWeekTotalAccel / previousWeekTrainingLoad) * 100);
            }

            // Figure out progress graph color
            let progressData = this.getProgressData(focusedWeekStats);
            color = progressData.color;
            cards = progressData.cards;
        }

        return ({ focusedWeekComparisionPercentageOverall, focusedWeekComparisionPercentageToDate, weekData, progressData: { color, cards } });
    };

    isCurrentWeekFocused = (startComponents, endComponents) => {
        let currentWeekComponents = (new Date()).toLocaleDateString().split('/');
        if (parseInt(startComponents[0], 10) <= parseInt(currentWeekComponents[2], 10) && parseInt(endComponents[0], 10) >= parseInt(currentWeekComponents[2], 10)) {
            if (parseInt(startComponents[1], 10) <= parseInt(currentWeekComponents[0], 10) && parseInt(endComponents[1], 10) >= parseInt(currentWeekComponents[0], 10)) {
                if (parseInt(startComponents[2], 10) <= parseInt(currentWeekComponents[1], 10) && parseInt(endComponents[2], 10) >= parseInt(currentWeekComponents[1], 10)) {
                    return true;
                }
                return false;
            }
            return false;
        }
        return false;
    };

    isInPreviousWeekBeforeCurrentDayOfWeek = (checkDate) => {
        if (!checkDate) {
            return false;
        }
        let checkDateMs = (new Date(checkDate)).getTime();
        let currentDateMs = (new Date()).getTime();
        let msDifference = currentDateMs - checkDateMs;
        let daysDifferent = Math.floor(msDifference / MS_IN_DAY);
        return daysDifferent >= 7 && daysDifferent < 14; 
    };

    isSameDayInPreviousWeek = (checkDate) => {
        if (!checkDate) {
            return false;
        }
        let checkDateMs = (new Date(checkDate)).getTime();
        let currentDateMs = (new Date()).getTime();
        let msDifference = currentDateMs - checkDateMs;
        let daysDifferent = Math.floor(msDifference / MS_IN_DAY);
        return daysDifferent === 7;
    };

    render() {
        let { user, startRequest, stopRequest, getTeamStats, selectGraph } = this.props;
        let { circularProgressHeight, dailyLoadChartHeight, textHeight } = this.state;
        let userData = user.users[user.userIndex];
        let preprocessing = userData ? userData.preprocessing : null;
        let role = user.role;
        let startDateComponents = user.statsStartDate ? user.statsStartDate.split('-') : (new Date()).toLocaleDateString().split('/');
        let endDateComponents = user.statsEndDate ? user.statsEndDate.split('-') : (new Date()).toLocaleDateString().split('/');
        let isCurrentWeekFocused = this.isCurrentWeekFocused(startDateComponents, endDateComponents);
        let { focusedWeekComparisionPercentageOverall = null, focusedWeekComparisionPercentageToDate = null, weekData = null, progressData = null } = userData ? this.getGraphData(userData, isCurrentWeekFocused) : {};
        let selectedCards = typeof(user.selectedGraph) === 'number' && typeof(user.selectedGraphIndex) === 'number' ? user.selectedGraph === GRAPH_INDEX_MAP.CIRCULAR_PROGRESS ? progressData.cards : weekData[DAY_OF_WEEK_MAP[user.selectedGraphIndex]].cards : null;
        return (
            <View>
                { this.preprocessingMessages(preprocessing, role) }
                <Spacer size={20}/>
                <View style={[AppStyles.row]}>
                    <View style={{ flex: 1 }}/>
                    <Text style={[AppStyles.textCenterAligned, { flex: 1, fontWeight: 'bold' }]}>
                        {`${userData ? userData.first_name : ''} ${userData ? userData.last_name : ''}`}
                    </Text>
                    <View style={{ flex: 1 }}/>
                </View>
                <Spacer />
                <View style={{ flexDirection: 'row' }}>
                    <Icon
                        style={[AppStyles.containerCentered, AppStyles.flex1]}
                        name={'arrow-back'}
                        color={AppColors.primary.grey.fiftyPercent}
                        onPress={() => user && !user.loading ? startRequest().then(() => getTeamStats(user.teams, user.weekOffset, -1)).then(() => this.resetVisibleStates()).then(() => stopRequest()) : null}
                    />
                    <View style={[AppStyles.containerCentered, { flex: 2 }]}>
                        <Text style={{ color: AppColors.primary.grey.fiftyPercent }}>
                            {`${startDateComponents[1]}/${startDateComponents[2]}/${startDateComponents[0].substring(2)}`}-{`${endDateComponents[1]}/${endDateComponents[2]}/${endDateComponents[0].substring(2)}`}
                        </Text>
                    </View>
                    <Icon
                        style={[AppStyles.containerCentered, AppStyles.flex1]}
                        name={'arrow-forward'}
                        color={AppColors.primary.grey.fiftyPercent}
                        onPress={() => user && !user.loading ? startRequest().then(() => getTeamStats(user.teams, user.weekOffset, 1)).then(() => this.resetVisibleStates()).then(() => stopRequest()) : null}
                    />
                </View>
                {
                    !userData || !userData.stats ? <View style={{ alignSelf: 'center' }}><Placeholder text={noData} /></View> :
                        <View>
                            <View onLayout={ev => this.setState({ circularProgressHeight: ev.nativeEvent.layout.height })}>
                                <CircularProgress
                                    graphIndex={GRAPH_INDEX_MAP.CIRCULAR_PROGRESS}
                                    selectGraph={selectGraph}
                                    isGraphSelected={user.selectedGraph === GRAPH_INDEX_MAP.CIRCULAR_PROGRESS}
                                    percentageOverall={focusedWeekComparisionPercentageOverall}
                                    percentageToDate={focusedWeekComparisionPercentageToDate}
                                    progressColor={progressData.color}
                                    startRequest={this.props.startRequest}
                                    stopRequest={this.props.stopRequest}
                                    resetVisibleStates={this.resetVisibleStates}
                                />
                            </View>
                            <Spacer size={30}/>
                            <View onLayout={ev => this.setState({ textHeight: ev.nativeEvent.layout.height })} style={[AppStyles.row, AppStyles.containerCentered]}>
                                <Text h6 style={[AppStyles.textCenterAligned, { flex: 1, fontWeight: 'bold', color: AppColors.primary.grey.hundredPercent }]}>
                                    {'DAILY LOAD COMPARED TO PREVIOUS WEEK'}
                                </Text>
                                {/* <View style={{ flex: 1 }}>
                                    <ButtonGroup
                                        textStyle={[AppStyles.h6]}
                                        selectedTextStyle={[AppStyles.h6, { fontWeight: 'bold' }]}
                                        selectedBackgroundColor={AppColors.primary.grey.hundredPercent}
                                        // onPress={selectedIndex => this.setState({ selectedIndex })}
                                        selectedIndex={this.state.selectedIndex}
                                        buttons={['TEAM', 'TARGET']}
                                    />
                                </View> */}
                            </View>
                            <Spacer size={20}/>
                            <View onLayout={ev => this.setState({ dailyLoadChartHeight: ev.nativeEvent.layout.height })}>
                                <DailyLoadChart
                                    graphIndex={GRAPH_INDEX_MAP.DAILY_LOAD_CHART}
                                    selectGraph={selectGraph}
                                    isGraphSelected={user.selectedGraph === GRAPH_INDEX_MAP.DAILY_LOAD_CHART}
                                    selectedGraphIndex={user.selectedGraphIndex}
                                    user={user}
                                    data={weekData}
                                    getTeamStats={this.props.getTeamStats}
                                    startRequest={this.props.startRequest}
                                    stopRequest={this.props.stopRequest}
                                    resetVisibleStates={this.resetVisibleStates}
                                />
                            </View>
                            { selectedCards ?
                                <ScrollView style={{ backgroundColor: AppColors.secondary.light_blue.hundredPercent, height: AppSizes.screen.usableHeight - (60 + circularProgressHeight + dailyLoadChartHeight + textHeight + (selectedCards ? selectedCards.length * 14 : 0)) }}>
                                    {
                                        selectedCards.map((card, index) =>
                                            <Card
                                                key={index}
                                                containerStyle={{ backgroundColor: card.cardColor, alignSelf: 'center', borderRadius: 0, borderColor: AppColors.transparent }}
                                            >
                                                <Text style={[AppStyles.h3, { color: AppColors.primary.grey.hundredPercent, fontWeight: 'bold', marginBottom: 15 }]}>
                                                    {card.title}
                                                </Text>
                                                <Text style={{ color: AppColors.white }}>
                                                    {card.detectionResponse}
                                                </Text>
                                                <View
                                                    style={{
                                                        borderBottomColor: AppColors.primary.grey.hundredPercent,
                                                        borderBottomWidth: 1,
                                                        margin:            5,
                                                    }}
                                                />
                                                <Text style={{ color: AppColors.white }}>
                                                    {card.recommedationResponse}
                                                </Text>
                                            </Card>
                                        )
                                    }
                                    <Spacer />
                                </ScrollView> : null
                            }
                        </View>
                }
                {
                    user.loading ? <ActivityIndicator style={[AppStyles.activityIndicator]} size={'large'} color={'#C1C5C8'}/> : null
                }
            </View>
        );
    }
}


/* Export Component ==================================================================== */
export default TrainingReport;
