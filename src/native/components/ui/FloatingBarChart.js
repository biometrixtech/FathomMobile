/*
 * @Author: Vir Desai 
 * @Date: 2017-10-16 14:59:35 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-12 01:01:44
 */

/**
 * FloatingBarChart
 *
     <FloatingBarChart data={x: [], y1: [], y2: []} xAxis={'Time'} yAxis={'Cookies eaten'} width={100} height={100} />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TouchableHighlight, View, ActivityIndicator, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import Svg, { Rect, G, Polygon } from 'react-native-svg';

// Consts and Libs
import { AppColors, AppStyles, AppSizes, AppFonts } from '../../theme/';
import { AppUtil } from '../../lib/';
import { Roles, Thresholds } from '../../constants/';

// Components
import { Axis, Spacer, Text, Calendar } from './';
import { Placeholder } from '../general/';

const styles = StyleSheet.create({
    subtext: {
        ...AppStyles.subtext,
        lineHeight: parseInt(AppFonts.base.lineHeight, 10),
    }
});


/* Component ==================================================================== */
class FloatingBarChart extends Component {
    static propTypes = {
        xAxis:               PropTypes.string,
        yAxis:               PropTypes.string,
        width:               PropTypes.number,
        height:              PropTypes.number,
        tabOffset:           PropTypes.number,
        tabbarHeight:        PropTypes.number,
        preprocessingHeight: PropTypes.number,
        margin:              PropTypes.shape({
            horizontal: PropTypes.number,
            vertical:   PropTypes.number
        }),
        data: PropTypes.shape({
            x:  PropTypes.array,
            y1: PropTypes.array, // total
            y2: PropTypes.array, // irregular
        }),
        user:               PropTypes.object,
        setStatsCategory:   PropTypes.func.isRequired,
        getTeamStats:       PropTypes.func.isRequired,
        startRequest:       PropTypes.func,
        stopRequest:        PropTypes.func,
        resetVisibleStates: PropTypes.func,
    }

    static defaultProps = {
        xAxis:              null,
        yAxis:              null,
        width:              0,
        height:             0,
        tabOffset:          0,
        margin:             {},
        data:               null,
        resetVisibleStates: () => {}
    }

    constructor(props) {
        super(props);
        let date = new Date();
        this.state = {
            chartHeaderHeight: 0,
            listHeaderHeight:  0,
            calendarVisible:   false,
            startDate:         `${date.getFullYear()}-${AppUtil.formatDate(date.getMonth()+1)}-${AppUtil.formatDate(date.getDate())}`,
            endDate:           `${date.getFullYear()}-${AppUtil.formatDate(date.getMonth()+1)}-${AppUtil.formatDate(date.getDate())}`,
        };
    }

    getBarColor = (percOptimal, fatigue) => {
        if (!percOptimal || typeof percOptimal !== 'number' || !fatigue || typeof fatigue !== 'number') {
            return AppColors.secondary.blue.hundredPercent;
        }
        let colorIndex = Thresholds.movementQualityScore.findIndex(colorThreshold => colorThreshold.max >= percOptimal && colorThreshold.min < percOptimal);
        let colorIndex2 = Thresholds.fatigueRateSingleDay.findIndex(colorThreshold => colorThreshold.max >= fatigue && colorThreshold.min <= fatigue);
        if (colorIndex !== -1 && colorIndex2 !== -1) {
            colorIndex = colorIndex > colorIndex2 ? colorIndex2 : colorIndex;
        } else if (colorIndex2 !== -1) {
            colorIndex = colorIndex2;
        } else if ( colorIndex === -1 && colorIndex === -1) {
            colorIndex = null;
        }
        return typeof colorIndex === 'number' ? Thresholds.movementQualityScore[colorIndex].color : AppColors.secondary.blue.hundredPercent;
    };

    getTextColor = (weekValue, dayValue) => {
        let color = AppColors.primary.grey.hundredPercent;
        let colorIndex = typeof weekValue === 'number' ? Thresholds.fatigueRateAcrossDays.findIndex(colorThreshold => colorThreshold.max >= weekValue && colorThreshold.min < weekValue) : -1;
        let colorIndex2 =  typeof dayValue === 'number' ? Thresholds.fatigueRateSingleDay.findIndex(colorThreshold => colorThreshold.max >= dayValue && colorThreshold.min <= dayValue): -1;
        if (colorIndex !== -1 && colorIndex2 !== -1) {
            color = Thresholds.fatigueRateAcrossDays[colorIndex > colorIndex2 ? colorIndex2 : colorIndex].color;
        } else if (colorIndex2 !== -1) {
            color = Thresholds.fatigueRateAcrossDays[colorIndex2].color;
        } else if ( colorIndex !== -1) {
            color = Thresholds.fatigueRateAcrossDays[colorIndex].color;
        }
        return color;
    };

    getTickPoints (start, end, numTicks, length) {
        let res = [];
        let ticksEvery = Math.floor(length / (numTicks - 1));
        for (let cur = start; cur <= end; cur += ticksEvery) { res.push(cur); }
        return res;
    }

    renderBar = (width, y1, y2, index, color, positive) => {
        if(typeof(positive) === typeof(true)) {
            let array = this.getTickPoints(3 * this.props.margin.horizontal, width + 6 * this.props.margin.horizontal, 7, width);
            let x = array[index] + AppSizes.tickSize + 1.5;
            let pointsString = `${x + 0.75},${positive ? y1 + Math.abs(y2): y1} ${x + 3.85},${positive ? y1 : y1 + Math.abs(y2)}, ${x + 6.95},${positive ? y1 + Math.abs(y2): y1}`;
            return <G key={index}>
                {/* <Rect
                    x={x}
                    y={positive ? y1 + Math.abs(y2) * 0.5 : y1}
                    width={8}
                    height={Math.abs(y2) * 0.5}
                    fill={color}
                /> */}
                <Polygon
                    strokeWidth={1}
                    stroke={color}
                    fill={color}
                    points={pointsString}
                />
            </G>
        }
        return null;
    };

    render = () => {
        let {xAxis, yAxis, width, height, margin, data, tabOffset, user, resetVisibleStates, getTeamStats, startRequest, stopRequest, tabbarHeight, preprocessingHeight} = this.props;
        let { startDate, endDate, chartHeaderHeight } = this.state;

        let userData = user.teams[user.teamIndex];
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
        let xScale = data ? data.x[0] instanceof Date ? AppUtil.createTimeScaleX(data.x[0], data.x[data.x.length - 1], width - 2 * margin.horizontal) : AppUtil.createScaleX(data.x[0], data.x[data.x.length - 1], width - 2 * margin.horizontal) : null;
        let minY = data ? Math.floor(data.yMin / 5) * 5 : 0;
        let yScale = AppUtil.createScaleY(minY < 0 ? 0 : minY, 100, height - 2 * margin.vertical, margin.vertical);

        return (
            <View>
                <Spacer />
                <View style={[AppStyles.row]} onLayout={ev => this.setState({ chartHeaderHeight: ev.nativeEvent.layout.height })}>
                    <Icon
                        containerStyle={[AppStyles.containerCentered, AppStyles.flex1]}
                        name={'arrow-back'}
                        color={AppColors.primary.grey.fiftyPercent}
                        onPress={() => {
                            if (userData && !user.loading) {
                                let { newStartDate, newEndDate } = AppUtil.getStartEndDate(user.weekOffset - 1);
                                this.setState({ startDate: newStartDate, endDate: newEndDate });
                                return startRequest().then(() => getTeamStats(user, -1)).then(() => resetVisibleStates()).then(() => stopRequest());
                            }
                            return null;
                        }}
                    />
                    <TouchableWithoutFeedback onPress={() => userData && !user.loading ? this.setState({ calendarVisible: !this.state.calendarVisible }) : null}>
                        <View style={[AppStyles.containerCentered, AppStyles.flex2]}>
                            <Text style={{ color: AppColors.primary.grey.fiftyPercent }}>
                                {`${startDateComponents[1]}/${startDateComponents[2]}/${startDateComponents[0].substring(2)}`}-{`${endDateComponents[1]}/${endDateComponents[2]}/${endDateComponents[0].substring(2)}`}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <Icon
                        containerStyle={[AppStyles.containerCentered, AppStyles.flex1]}
                        name={'arrow-forward'}
                        color={AppColors.primary.grey.fiftyPercent}
                        onPress={() => {
                            if (userData && !user.loading) {
                                let { newStartDate, newEndDate } = AppUtil.getStartEndDate(user.weekOffset + 1);
                                this.setState({ startDate: newStartDate, endDate: newEndDate });
                                return startRequest().then(() => getTeamStats(user, 1)).then(() => resetVisibleStates()).then(() => stopRequest());
                            }
                            return null;
                        }}
                    />
                </View>
                {
                    !userData || !userData.stats || !data.x.length ? <View style={{ height: AppSizes.screen.usableHeight - 10 - chartHeaderHeight - tabbarHeight - preprocessingHeight }}><Placeholder text={'No data to show for this range...'} /></View> :
                        <View>
                            { xAxis ? <Text style={[AppStyles.h7, { position: 'absolute', left: -4 * margin.horizontal - tabOffset * AppSizes.tickSize, top: height*9/20, transform: [{ rotate: '270deg' }] }]}>{xAxis}</Text> : null }
                            { yAxis ? <Text style={[AppStyles.subtext, { position: 'absolute', left: width/2, top: height + margin.vertical }]}>{yAxis}</Text> : null }
                            <Svg width={width + 3 * margin.horizontal} height={height}>
                                <Axis
                                    length={width - margin.horizontal}
                                    x={3 * margin.horizontal}
                                    y={height - 2 * margin.vertical}
                                    ticks={7}
                                    startVal={data.x[0]}
                                    endVal={data.x[data.x.length - 1]}
                                    scale={xScale} />
                                <Axis
                                    length={height - 3 * margin.vertical}
                                    x={3 * margin.horizontal}
                                    y={height - 2 * margin.vertical}
                                    ticks={6}
                                    startVal={minY < 0 ? 0 : minY}
                                    endVal={100}
                                    scale={yScale}
                                    vertical />
                                {
                                    data.x.map((xValues, index) => this.renderBar(width - margin.horizontal, data.y2[index] > 0 ? yScale(data.y1[index]+data.y2[index]) : yScale(data.y1[index]), yScale(data.y1[index])-yScale(data.y1[index]+data.y2[index]), index, this.getBarColor(data.y1[index], Math.abs(data.y2[index])), data.y2[index] ? data.y2[index] > 0 : null))
                                }
                            </Svg>
                            <Spacer size={20}/>
                            <View style={{ flexDirection: 'row' }} onLayout={ev => this.setState({ listHeaderHeight: ev.nativeEvent.layout.height })}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <View>
                                        <Text style={[styles.subtext]}>RATE OF CHANGE</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={[styles.subtext]}>WEEKLY</Text>
                                            <Text style={[styles.subtext]}>DAILY</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}/>
                            </View>
                            { this.chartList() }
                        </View>
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
                                return  user.loading ? null : startRequest()
                                    .then(() => getTeamStats(user, weekChange))
                                    .then(() => resetVisibleStates())
                                    .then(() => stopRequest())
                                    .then(() => this.setState({ calendarVisible: false }));
                            }}
                            markedDates={markedDates}
                            markingType={'period'}
                        /> : null
                }
                {
                    user.loading ? <ActivityIndicator style={[AppStyles.activityIndicator, { height: AppSizes.screen.usableHeight - 10 - chartHeaderHeight - tabbarHeight - preprocessingHeight }]} size={'large'} color={'#C1C5C8'}/> : null
                }
            </View>
        );
    };

    compareRatesOfChange = (a, b) => {
        return b.avgFatigue - a.avgFatigue;
    }

    chartList = () => {
        let { user, setStatsCategory, height } = this.props;

        let team = user.teams[user.teamIndex];
        let stats = team.stats;
        let athleteData = stats.AthleteMovementQualityData;

        let paddingLeft = AppSizes.padding
        let paddingRight = AppSizes.padding;

        if (!athleteData || !athleteData.length) {
            return null;
        }

        if (user.role === Roles.athlete) {
            athleteData = athleteData.sort(this.compareRatesOfChange);
            let athleteStatsIndex = athleteData.findIndex(athlete => athlete.userId === user.id);
            let athleteStats = athleteData[athleteStatsIndex];
            let trainingGroups = team.training_groups.filter(teamTrainingGroup => teamTrainingGroup.active && teamTrainingGroup.id !== 1 && teamTrainingGroup.users.some(teamTrainingGroupUser => teamTrainingGroupUser.id === user.id));
            trainingGroups = trainingGroups.map(trainingGroup => {
                let trainingGroupUsers = trainingGroup.users.map(trainingGroupUser => {
                    let trainingGroupAthleteStats = athleteData.find(athlete => athlete.userId === trainingGroupUser.id);
                    trainingGroupUser = Object.assign({}, trainingGroupUser, {
                        ...trainingGroupAthleteStats
                    });
                    return trainingGroupUser;
                });
                trainingGroupUsers = trainingGroupUsers.sort(this.compareRatesOfChange);
                trainingGroup.users = trainingGroupUsers;
                return trainingGroup;
            });
            return athleteStats ? <ScrollView style={{ backgroundColor: AppColors.secondary.light_blue.hundredPercent, height: AppSizes.screen.usableHeight - (height + this.state.chartHeaderHeight + this.state.listHeaderHeight + 10) }} scrollEnabled={true} contentContainerStyle={{ height: 220 }}>
                <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: AppColors.primary.grey.thirtyPercent }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                        <Text style={[AppStyles.subtext, { paddingLeft, color: this.getTextColor(athleteStats.fatigueRateOfChange, null) }]}>{athleteStats.fatigueRateOfChange}</Text>
                        <Text style={[AppStyles.subtext, { paddingRight, color: this.getTextColor(null, athleteStats.avgFatigue) }]}>{athleteStats.avgFatigue}</Text>
                    </View>
                    <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                        <Text style={{ color: this.getTextColor(athleteStats.fatigueRateOfChange, athleteStats.avgFatigue) }}>{user.first_name} {user.last_name}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: 'white' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                        <Text style={[AppStyles.subtext, { color: AppColors.primary.grey.hundredPercent }]}>{`${athleteStatsIndex + 1} of ${athleteData.length}`}</Text>
                    </View>
                    <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                        <Text style={{ color: AppColors.primary.grey.hundredPercent }}>Team Avg</Text>
                    </View>
                </View>
                {
                    trainingGroups ? trainingGroups.map((trainingGroup, index) => <View key={index} style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: AppColors.white }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                            <Text style={[AppStyles.subtext, { color: AppColors.primary.grey.hundredPercent }]}>{`${trainingGroup.users.findIndex(trainingGroupUser => trainingGroupUser.id === user.id) + 1} of ${trainingGroup.users.length}`}</Text>
                        </View>
                        <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                            <Text style={{ color: AppColors.primary.grey.hundredPercent }}>{trainingGroup.name}</Text>
                        </View>
                    </View>
                    ) : null
                }
            </ScrollView>
                : null;
        }

        return <ScrollView style={{ backgroundColor: AppColors.secondary.light_blue.hundredPercent, height: AppSizes.screen.usableHeight - (height + this.state.chartHeaderHeight + this.state.listHeaderHeight + 10) }} scrollEnabled={true} contentContainerStyle={{ height: (athleteData.length + 1) * 55 }}>
            <TouchableHighlight key={-1} onPress={() => setStatsCategory(false, null)}>
                <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: user.selectedStats.athlete ? AppColors.white : AppColors.primary.grey.thirtyPercent }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                        <Text style={[AppStyles.subtext, { paddingLeft, color: this.getTextColor(stats.fatigueRateOfChange, null) }]}>{stats.fatigueRateOfChange}</Text>
                        <Text style={[AppStyles.subtext, { paddingRight, color: this.getTextColor(null, stats.avgFatigue) }]}>{stats.avgFatigue}</Text>
                    </View>
                    <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                        <Text style={{ color: this.getTextColor(stats.fatigueRateOfChange, stats.avgFatigue) }}>Team Avg</Text>
                    </View>
                </View>
            </TouchableHighlight>
            {
                athleteData.map((athleteMovementQualityData, index) => {
                    let athlete = team.users_with_training_groups.find(userInGroup => userInGroup.id === athleteMovementQualityData.userId);
                    return athlete
                        ? <TouchableHighlight key={index} onPress={() => setStatsCategory(true, athlete.id)}>
                            <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: user.selectedStats.athlete && user.selectedStats.athleteId === athlete.id ? AppColors.primary.grey.thirtyPercent : AppColors.white }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                                    <Text style={[AppStyles.subtext, { paddingLeft, color: this.getTextColor(athleteMovementQualityData.fatigueRateOfChange, null) }]}>{athleteMovementQualityData.fatigueRateOfChange}</Text>
                                    <Text style={[AppStyles.subtext, { paddingRight, color: this.getTextColor(null, athleteMovementQualityData.avgFatigue) }]}>{athleteMovementQualityData.avgFatigue}</Text>
                                </View>
                                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                                    <Text style={{ color: this.getTextColor(athleteMovementQualityData.fatigueRateOfChange, athleteMovementQualityData.avgFatigue) }}>{athlete.first_name} {athlete.last_name}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        : null;
                })
            }
        </ScrollView>
    };
}

/* Export Component ==================================================================== */
export default FloatingBarChart;
