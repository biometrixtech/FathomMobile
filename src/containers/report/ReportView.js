/*
 * @Author: Vir Desai 
 * @Date: 2018-03-14 02:31:05 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-06 00:49:35
 */

import React, { Component } from 'react';
import { ScrollView, View, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { ButtonGroup, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { Roles, Thresholds, ErrorMessages } from '@constants/';
import { AppUtil } from '@lib/';

// Components
import { ListItem, Text, CircularProgress, DailyLoadChart, Spacer, Card, Calendar } from '@ui/';
import { Placeholder } from '@general/';

const noData = 'No data to show for this range...';

const DAY_OF_WEEK_MAP = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];

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
        let date = new Date();
        this.state = {
            // selectedIndex:                    1,
            nameHeight:                       0,
            chartHeaderHeight:                0,
            preprocessingHeight:              0,
            preprocessing_upload_visible:     true,
            preprocessing_processing_visible: true,
            preprocessing_error_visible:      true,
            calendarVisible:                  false,
            startDate:                        `${date.getFullYear()}-${AppUtil.formatDate(date.getMonth()+1)}-${AppUtil.formatDate(date.getDate())}`,
            endDate:                          `${date.getFullYear()}-${AppUtil.formatDate(date.getMonth()+1)}-${AppUtil.formatDate(date.getDate())}`,
        };
    }

    componentWillMount = () => {
        return this.props.startRequest()
            .then(() => this.props.getTeams(this.props.user))
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
            text = text.replace('X', String(uploadArray.length));
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
            text = text.replace('X', String(processingArray.length));
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
            text = text.replace('X', String(errorArray.length));
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

    preprocessingMessages = (userData, user, role) => {
        if (!userData) {
            return null;
        }
        let currentUserTeam = user.teams.find(team => team.users_with_training_groups.some(currentTeamUser => currentTeamUser.id === userData.id));
        if (!currentUserTeam) {
            return null;
        }
        return <View onLayout={ev => this.setState({ preprocessingHeight: ev.nativeEvent.layout.height })}>
            { this.state.preprocessing_upload_visible && currentUserTeam.preprocessing && currentUserTeam.preprocessing.UPLOAD_IN_PROGRESS  ? this.preprocessingUpload(currentUserTeam.preprocessing.UPLOAD_IN_PROGRESS.filter(preprocessingEvent => preprocessingEvent.user_id === userData.id), role) : null }
            { this.state.preprocessing_processing_visible && currentUserTeam.preprocessing && currentUserTeam.preprocessing.PROCESSING_IN_PROGRESS  ? this.preprocessingProcessing(currentUserTeam.preprocessing.PROCESSING_IN_PROGRESS.filter(preprocessingEvent => preprocessingEvent.user_id === userData.id), role) : null }
            { this.state.preprocessing_error_visible && currentUserTeam.preprocessing && currentUserTeam.preprocessing.PROCESSING_FAILED ? this.preprocessingError(currentUserTeam.preprocessing.PROCESSING_FAILED.filter(preprocessingEvent => preprocessingEvent.user_id === userData.id), role) : null }
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
        let acwrTotalAccel7ColorIndex = typeof(acwrTotalAccel7) === 'number' ? Thresholds.chart.acwrTotalAccel7.findIndex(colorThreshold => colorThreshold.max > acwrTotalAccel7 && colorThreshold.min <= acwrTotalAccel7) : -1;
        let acwrGRF7ColorIndex = typeof(acwrGRF7) === 'number' ? Thresholds.chart.acwrGRF7.findIndex(colorThreshold => colorThreshold.max > acwrGRF7 && colorThreshold.min <= acwrGRF7) : -1;
        let minColorIndex = Math.min(...[fatigueRateOfChangeColorIndex, avgFatigueColorIndex, acwrTotalAccel7ColorIndex, acwrGRF7ColorIndex].filter(value => value !== -1), Number.POSITIVE_INFINITY);
        let color = minColorIndex === Number.POSITIVE_INFINITY ? AppColors.secondary.blue : Thresholds.chart.acwrTotalAccel7[minColorIndex].color;

        if (fatigueRateOfChangeColorIndex !== -1 && avgFatigueColorIndex !== -1) {
            cards.push(Thresholds.chart.fatigueRateAcrossDays[fatigueRateOfChangeColorIndex < avgFatigueColorIndex ? fatigueRateOfChangeColorIndex : avgFatigueColorIndex]);
        } else if (fatigueRateOfChangeColorIndex !== -1) {
            cards.push(Thresholds.chart.fatigueRateAcrossDays[fatigueRateOfChangeColorIndex]);
        } else if (avgFatigueColorIndex !== -1) {
            cards.push(Thresholds.chart.fatigueRateAcrossDays[avgFatigueColorIndex]);
        }

        if (acwrTotalAccel7ColorIndex !== -1) {
            cards.push(Thresholds.chart.acwrTotalAccel7[acwrTotalAccel7ColorIndex]);
        } else if (acwrGRF7ColorIndex !== -1) {
            cards.push(Thresholds.chart.acwrGRF7[acwrGRF7ColorIndex]);
        }

        return ({color, cards});
    };

    getDailyBubbleData = ({fatigue, percLRGRFDiff, percLeftGRF, symmetry, hipSymmetry, ankleSymmetry, control, controlLF, controlRF, hipControl, ankleControl}) => {
        let cards = [];
        
        let fatigueColorIndex = typeof(fatigue) === 'number' ? Thresholds.chart.fatigueRateSingleDay.findIndex(colorThreshold => colorThreshold.max >= fatigue && colorThreshold.min <= fatigue) : -1;
        
        let percLRGRFDiffColorIndex = typeof(percLRGRFDiff) === 'number' ? Thresholds.chart.gfrDist.findIndex(colorThreshold => colorThreshold.max >= percLRGRFDiff && colorThreshold.min <= percLRGRFDiff) : -1;
        
        let symmetryColorIndex = typeof(symmetry) === 'number' ? Thresholds.chart.symmetry.findIndex(colorThreshold => colorThreshold.max >= symmetry && colorThreshold.min <= symmetry) : -1;
        let hipSymmetryColorIndex = typeof(hipSymmetry) === 'number' ? Thresholds.chart.hipSymmetry.findIndex(colorThreshold => colorThreshold.max >= hipSymmetry && colorThreshold.min <= hipSymmetry) : -1;
        let ankleSymmetryColorIndex = typeof(ankleSymmetry) === 'number' ? Thresholds.chart.ankleSymmetry.findIndex(colorThreshold => colorThreshold.max >= ankleSymmetry && colorThreshold.min <= ankleSymmetry) : -1;
        
        let controlColorIndex = typeof(control) === 'number' ? Thresholds.chart.control.findIndex(colorThreshold => colorThreshold.max >= control && colorThreshold.min <= control) : -1;
        let controlLFColorIndex = typeof(controlLF) === 'number' ? Thresholds.chart.controlLF.findIndex(colorThreshold => colorThreshold.max >= controlLF && colorThreshold.min <= controlLF) : -1;
        let controlRFColorIndex = typeof(controlRF) === 'number' ? Thresholds.chart.controlRF.findIndex(colorThreshold => colorThreshold.max >= controlRF && colorThreshold.min <= controlRF) : -1;
        let hipControlColorIndex = typeof(hipControl) === 'number' ? Thresholds.chart.hipControl.findIndex(colorThreshold => colorThreshold.max >= hipControl && colorThreshold.min <= hipControl) : -1;
        let ankleControlColorIndex = typeof(ankleControl) === 'number' ? Thresholds.chart.ankleControl.findIndex(colorThreshold => colorThreshold.max >= ankleControl && colorThreshold.min <= ankleControl) : -1;

        let minColorIndex = Math.min(...[fatigueColorIndex, percLRGRFDiffColorIndex, symmetryColorIndex, hipSymmetryColorIndex, ankleSymmetryColorIndex, controlColorIndex, controlLFColorIndex, controlRFColorIndex, hipControlColorIndex, ankleControlColorIndex].filter(value => value !== -1), Number.POSITIVE_INFINITY);
        let color = minColorIndex === Number.POSITIVE_INFINITY ? AppColors.secondary.blue : Thresholds.chart.fatigueRateSingleDay[minColorIndex].color;

        if (fatigueColorIndex !== -1) {
            cards.push(Thresholds.chart.fatigueRateSingleDay[fatigueColorIndex]);
        }

        if (percLRGRFDiffColorIndex !== -1) {
            let card = Thresholds.chart.gfrDist[percLRGRFDiffColorIndex];
            card.detectionResponse = card.detectionResponse.replace('[left/right]', percLeftGRF > 50 ? 'left' : 'right');
            card.detectionResponse = card.detectionResponse.replace('[right/left]', percLeftGRF > 50 ? 'right' : 'left');
            card.detectionResponse = card.detectionResponse.replace('[x%]', Math.round(Math.abs(percLeftGRF - 50)));
            cards.push(card);
        }

        if (hipSymmetryColorIndex !== -1 && ankleSymmetryColorIndex !== -1) {
            if (symmetryColorIndex !== -1) {
                let card = Thresholds.chart.symmetry[symmetryColorIndex];
                let tempMinColorIndex = Math.min(...[symmetryColorIndex, hipSymmetryColorIndex, ankleSymmetryColorIndex]);
                card.cardColor = Thresholds.chart.symmetry[tempMinColorIndex].cardColor;
                cards.push(card);
            }
        } else if (hipSymmetryColorIndex !== -1) {
            cards.push(Thresholds.chart.hipSymmetry[hipSymmetryColorIndex]);
        } else if (ankleSymmetryColorIndex !== -1) {
            cards.push(Thresholds.chart.ankleSymmetry[ankleSymmetryColorIndex]);
        }

        if (hipControlColorIndex !== -1) {
            if (controlLFColorIndex !== -1 && controlRFColorIndex !== -1) {
                if (controlColorIndex !== -1) {
                    let card = Thresholds.chart.control[controlColorIndex];
                    let tempMinColorIndex = Math.min(...[controlColorIndex, controlLFColorIndex, controlRFColorIndex, hipControlColorIndex]);
                    card.cardColor = Thresholds.chart.control[tempMinColorIndex].cardColor;
                    cards.push(card);
                }
            } else {
                cards.push(Thresholds.chart.hipControl[hipControlColorIndex]);
                if (controlLFColorIndex !== -1) {
                    cards.push(Thresholds.chart.controlLF[controlLFColorIndex]);
                }
                if (controlRFColorIndex !== -1) {
                    cards.push(Thresholds.chart.controlRF[controlRFColorIndex]);
                }
            }
        } else {
            if (controlLFColorIndex !== -1 && controlRFColorIndex !== -1) {
                if (ankleControlColorIndex !== -1) {
                    let card = Thresholds.chart.ankleControl[ankleControlColorIndex];
                    let tempMinColorIndex = Math.min(...[controlLFColorIndex, controlRFColorIndex, ankleControlColorIndex]);
                    card.cardColor = Thresholds.chart.ankleControl[tempMinColorIndex].cardColor;
                    cards.push(card);
                }
            } else {
                if (controlLFColorIndex !== -1) {
                    cards.push(Thresholds.chart.controlLF[controlLFColorIndex]);
                }
                if (controlRFColorIndex !== -1) {
                    cards.push(Thresholds.chart.controlRF[controlRFColorIndex]);
                }
            }
        }

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

        let previousWeekTrainingLoad = previousWeekStats && previousWeekStats.AthleteMovementQualityData && previousWeekStats.AthleteMovementQualityData.length 
            ? previousWeekStats.AthleteMovementQualityData.reduce((total, athleteData) => {
                let dayOfWeek = (new Date(athleteData.eventDate)).getDay();
                weekData[DAY_OF_WEEK_MAP[dayOfWeek]].previousWeek = weekData[DAY_OF_WEEK_MAP[dayOfWeek]].previousWeek ? weekData[DAY_OF_WEEK_MAP[dayOfWeek]].previousWeek + athleteData.totalAccel : athleteData.totalAccel;
                return total + athleteData.totalAccel;
            },0) : 0;

        let focusedWeekTrainingLoad = focusedWeekStats && focusedWeekStats.AthleteMovementQualityData && focusedWeekStats.AthleteMovementQualityData.length
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
                let previousWeekTillCurrentDayOfWeekTotalAccel = previousWeekStats && previousWeekStats.AthleteMovementQualityData && previousWeekStats.AthleteMovementQualityData.length
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
        let daysDifferent = Math.floor(msDifference / AppUtil.MS_IN_DAY);
        return daysDifferent >= 7 && daysDifferent < 14; 
    };

    isSameDayInPreviousWeek = (checkDate) => {
        if (!checkDate) {
            return false;
        }
        let checkDateMs = (new Date(checkDate)).getTime();
        let currentDateMs = (new Date()).getTime();
        let msDifference = currentDateMs - checkDateMs;
        let daysDifferent = Math.floor(msDifference / AppUtil.MS_IN_DAY);
        return daysDifferent === 7;
    };

    render() {
        let { user, startRequest, stopRequest, getTeamStats, selectGraph } = this.props;
        let { startDate, endDate, chartHeaderHeight, nameHeight, preprocessingHeight } = this.state;
        let userData = user.users[user.userIndex];
        let currentUserTeam = user.teams.find(team => team.users_with_training_groups.some(currentTeamUser => currentTeamUser.id === userData.id));
        if (userData) {
            if (!currentUserTeam) {
                userData.stats = null;
                userData.previousWeekStats = null;
            } else {
                userData.stats = currentUserTeam.stats ? currentUserTeam.stats.AthleteMovementQualityData.find(athleteData => athleteData.userId === userData.id) : null;
                userData.previousWeekStats = currentUserTeam.previousWeekStats ? currentUserTeam.previousWeekStats.AthleteMovementQualityData.find(athleteData => athleteData.userId === userData.id) : null;
            }
        }
        let role = user.role;
        let startDateComponents = user.statsStartDate ? user.statsStartDate.split('-') : startDate.split('-');
        let endDateComponents = user.statsEndDate ? user.statsEndDate.split('-') : endDate.split('-');
        let markedDates = {};
        if (user.loading) {
            let markedStartDate = new Date(startDate);
            let markedEndDate = new Date(endDate);
            markedDates[startDate] = { startingDay: true, color: AppColors.secondary.blue.thirtyPercent };
            markedDates[endDate] = { endingDay: true, color: AppColors.secondary.blue.thirtyPercent };
            for (let d = markedStartDate.setDate(markedStartDate.getDate() + 1); d < markedEndDate;) {
                markedDates[(new Date(d)).toISOString().split('T')[0]] = { color: AppColors.secondary.blue.thirtyPercent };
                d = (new Date(d)).setDate((new Date(d)).getDate() + 1);
            }
        } else {
            if (user.statsStartDate && user.statsEndDate) {
                let markedStartDate = new Date(user.statsStartDate);
                let markedEndDate = new Date(user.statsEndDate);
                markedDates[user.statsStartDate] = { startingDay: true, color: AppColors.secondary.blue.thirtyPercent };
                markedDates[user.statsEndDate] = { endingDay: true, color: AppColors.secondary.blue.thirtyPercent };
                for (let d = markedStartDate.setDate(markedStartDate.getDate() + 1); d < markedEndDate;) {
                    markedDates[(new Date(d)).toISOString().split('T')[0]] = { color: AppColors.secondary.blue.thirtyPercent };
                    d = (new Date(d)).setDate((new Date(d)).getDate() + 1);
                }
            }
        }
        let isCurrentWeekFocused = this.isCurrentWeekFocused(startDateComponents, endDateComponents);
        let { focusedWeekComparisionPercentageOverall = null, focusedWeekComparisionPercentageToDate = null, weekData = null, progressData = null } = userData ? this.getGraphData(userData, isCurrentWeekFocused) : {};
        let selectedCards = typeof(user.selectedGraphIndex) === 'number' ? weekData[DAY_OF_WEEK_MAP[user.selectedGraphIndex]].cards : progressData ? progressData.cards : null;
        let preprocessingMessages = this.preprocessingMessages(userData, user, role);
        return (
            <View>
                {
                    !userData || !userData.stats ? 
                        <View>
                            { preprocessingMessages }
                            <Spacer size={20}/>
                            {
                                user.users.length === 1 ? null :
                                    <View style={[AppStyles.row]} onLayout={ev => this.setState({ nameHeight: ev.nativeEvent.layout.height })}>
                                        <View style={{ flex: 1 }}/>
                                        <Text style={[AppStyles.textCenterAligned, { flex: 1, fontWeight: 'bold' }]}>
                                            {`${userData ? userData.first_name : ''} ${userData ? userData.last_name : ''}`}
                                        </Text>
                                        <View style={{ flex: 1 }}/>
                                    </View>
                            }
                            {
                                user.users.length === 1 ? null : <Spacer />
                            }
                            <View style={{ flexDirection: 'row' }} onLayout={ev => this.setState({ chartHeaderHeight: ev.nativeEvent.layout.height })}>
                                <Icon
                                    style={[AppStyles.containerCentered, AppStyles.flex1]}
                                    name={'arrow-back'}
                                    color={AppColors.primary.grey.fiftyPercent}
                                    onPress={() => {
                                        if (userData && !user.loading) {
                                            let { newStartDate, newEndDate } = AppUtil.getStartEndDate(user.weekOffset - 1);
                                            this.setState({ startDate: newStartDate, endDate: newEndDate });
                                            return startRequest().then(() => getTeamStats(user, -1)).then(() => this.resetVisibleStates()).then(() => stopRequest());
                                        }
                                        return null;
                                    }}
                                />
                                <TouchableWithoutFeedback onPress={() => this.setState({ calendarVisible: !this.state.calendarVisible })}>
                                    <View style={[AppStyles.containerCentered, AppStyles.flex2]}>
                                        <Text style={{ color: AppColors.primary.grey.fiftyPercent }}>
                                            {`${startDateComponents[1]}/${startDateComponents[2]}/${startDateComponents[0].substring(2)}`}-{`${endDateComponents[1]}/${endDateComponents[2]}/${endDateComponents[0].substring(2)}`}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Icon
                                    style={[AppStyles.containerCentered, AppStyles.flex1]}
                                    name={'arrow-forward'}
                                    color={AppColors.primary.grey.fiftyPercent}
                                    onPress={() => {
                                        if (userData && !user.loading) {
                                            let { newStartDate, newEndDate } = AppUtil.getStartEndDate(user.weekOffset + 1);
                                            this.setState({ startDate: newStartDate, endDate: newEndDate });
                                            return startRequest().then(() => getTeamStats(user, 1)).then(() => this.resetVisibleStates()).then(() => stopRequest());
                                        }
                                        return null;
                                    }}
                                />
                            </View>
                            <View style={{ height: AppSizes.screen.usableHeight - 30 - chartHeaderHeight - nameHeight - preprocessingHeight }}><Placeholder text={noData} /></View> 
                        </View>
                        :
                        <ScrollView stickyHeaderIndices={[preprocessingMessages ? 7 : 6]} style={{ height: AppSizes.screen.usableHeight - 10 }}>
                            { preprocessingMessages }
                            <Spacer size={20}/>
                            {
                                user.users.length === 1 ? null :
                                    <View style={[AppStyles.row]}>
                                        <View style={{ flex: 1 }}/>
                                        <Text style={[AppStyles.textCenterAligned, { flex: 1, fontWeight: 'bold' }]}>
                                            {`${userData ? userData.first_name : ''} ${userData ? userData.last_name : ''}`}
                                        </Text>
                                        <View style={{ flex: 1 }}/>
                                    </View>
                            }
                            {
                                user.users.length === 1 ? null : <Spacer />
                            }
                            <View style={{ flexDirection: 'row' }}>
                                <Icon
                                    style={[AppStyles.containerCentered, AppStyles.flex1]}
                                    name={'arrow-back'}
                                    color={AppColors.primary.grey.fiftyPercent}
                                    onPress={() => user && !user.loading ? startRequest().then(() => getTeamStats(user, -1)).then(() => this.resetVisibleStates()).then(() => stopRequest()) : null}
                                />
                                <TouchableWithoutFeedback onPress={() => this.setState({ calendarVisible: !this.state.calendarVisible })}>
                                    <View style={[AppStyles.containerCentered, AppStyles.flex2]}>
                                        <Text style={{ color: AppColors.primary.grey.fiftyPercent }}>
                                            {`${startDateComponents[1]}/${startDateComponents[2]}/${startDateComponents[0].substring(2)}`}-{`${endDateComponents[1]}/${endDateComponents[2]}/${endDateComponents[0].substring(2)}`}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Icon
                                    style={[AppStyles.containerCentered, AppStyles.flex1]}
                                    name={'arrow-forward'}
                                    color={AppColors.primary.grey.fiftyPercent}
                                    onPress={() => user && !user.loading ? startRequest().then(() => getTeamStats(user, 1)).then(() => this.resetVisibleStates()).then(() => stopRequest()) : null}
                                />
                            </View>
                            <CircularProgress
                                percentageOverall={focusedWeekComparisionPercentageOverall}
                                percentageToDate={focusedWeekComparisionPercentageToDate}
                                progressColor={progressData.color}
                                startRequest={this.props.startRequest}
                                stopRequest={this.props.stopRequest}
                                resetVisibleStates={this.resetVisibleStates}
                            />
                            <Spacer size={30}/>
                            <View style={{ backgroundColor: AppColors.white }}>
                                <View style={[AppStyles.row, AppStyles.containerCentered]}>
                                    <Text h6 style={[AppStyles.textCenterAligned, { flex: 1, fontWeight: 'bold', color: AppColors.primary.grey.hundredPercent }]}>
                                        {'DAILY LOAD'}
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
                                <DailyLoadChart
                                    selectGraph={selectGraph}
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
                                <View>
                                    {
                                        selectedCards.map((card, index) =>
                                            <Card
                                                key={index}
                                                containerStyle={{ backgroundColor: card.cardColor, alignSelf: 'center', borderRadius: 5, borderColor: AppColors.transparent }}
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
                                </View> : null
                            }
                        </ScrollView>
                }
                {
                    this.state.calendarVisible ?
                        <Calendar
                            style={{ position: 'absolute', width: AppSizes.screen.width }}
                            firstDay={1}
                            current={!user.loading ? user.statsStartDate : startDate}
                            onPressTitle={() => this.setState({ calendarVisible: false })}
                            onDayPress={day => {
                                let currentDateMs = (user.statsStartDate ? new Date(user.statsStartDate) : new Date()).getTime();
                                let checkDateMs = (new Date(day.dateString)).getTime();
                                let msDifference = checkDateMs - currentDateMs;
                                let weekChange =  Math.floor(msDifference / AppUtil.MS_IN_WEEK);
                                let { newStartDate, newEndDate } = AppUtil.getStartEndDate(user.weekOffset + weekChange);
                                this.setState({ startDate: newStartDate, endDate: newEndDate });
                                return user.loading ? null : startRequest()
                                    .then(() => getTeamStats(user, weekChange))
                                    .then(() => this.resetVisibleStates())
                                    .then(() => stopRequest())
                                    .then(() => this.setState({ calendarVisible: false }));
                            }}
                            markedDates={markedDates}
                            markingType={'period'}
                        /> : null
                }
                {
                    user.loading ? <ActivityIndicator style={[AppStyles.activityIndicator, { height: AppSizes.screen.usableHeight - 30 - chartHeaderHeight - nameHeight - preprocessingHeight }]} size={'large'} color={'#C1C5C8'}/> : null
                }
            </View>
        );
    }
}


/* Export Component ==================================================================== */
export default TrainingReport;
