/*
 * @Author: Vir Desai 
 * @Date: 2017-10-13 15:17:33 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 23:51:52
 */

/**
 * StackedBarChart
 *
     <StackedBarChart data={x: [], y1: [], y2: []} xAxis={'Time'} yAxis={'Cookies eaten'} width={100} height={100} />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TouchableHighlight, View, ActivityIndicator, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import Svg, { Rect, G } from 'react-native-svg';

// Consts and Libs
import { AppStyles, AppSizes, AppFonts } from '../../theme/';
import { AppUtil } from '../../../lib/';
import { Roles, Thresholds, AppColors } from '../../../constants/';

// Components
import { Axis, Spacer, Text, Calendar } from './';
import { Placeholder } from '../general/';

const TAB_NAVIGATOR_HEIGHT = 50;

const styles = StyleSheet.create({
    subtext: {
        ...AppStyles.subtext,
        lineHeight: parseInt(AppFonts.base.lineHeight, 10),
    }
});


/* Component ==================================================================== */
class StackedBarChart extends Component {
    static propTypes = {
        xAxis:               PropTypes.string,
        yAxis:               PropTypes.string,
        width:               PropTypes.number,
        height:              PropTypes.number,
        tabOffset:           PropTypes.number,
        tabbarHeight:        PropTypes.number,
        preprocessingHeight: PropTypes.number,
        max:                 PropTypes.number,
        graphNum:            PropTypes.number,
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
        max:                0,
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

    getColor = (value) => {
        let color = AppColors.primary.grey.hundredPercent;
        let thresholds = Thresholds.acwr;
        let colorIndex = typeof value === 'number' ? thresholds.findIndex(colorThreshold => colorThreshold.max > value && colorThreshold.min <= value) : -1;
        if (colorIndex !== -1) {
            color = thresholds[colorIndex].color;
        }
        return color;
    };

    getTickPoints (start, end, numTicks, length) {
        let res = [];
        let ticksEvery = Math.floor(length / (numTicks - 1));
        for (let cur = start; cur <= end; cur += ticksEvery) { res.push(cur); }
        return res;
    }

    renderBar = (width, height, y1, y2, index) => {
        let array = this.getTickPoints(3 * this.props.margin.horizontal, width + 6 * this.props.margin.horizontal, 7, width);
        return <G key={index}>
            <Rect
                x={array[index] + AppSizes.tickSize+1.5}
                y={height - (y1 + 0.5)}
                width={8}
                height={y1}
                fill={AppColors.secondary.blue.hundredPercent}
            />
            <Rect
                x={array[index] + AppSizes.tickSize+1.5}
                y={height - (y2 + 0.5)}
                width={8}
                height={y2}
                fill={AppColors.primary.yellow.hundredPercent}
            />
        </G>
    };

    render = () => {
        let {xAxis, yAxis, width, height, margin, data, tabOffset, user, max, resetVisibleStates, startRequest, stopRequest, getTeamStats, tabbarHeight, preprocessingHeight} = this.props;
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
        let yScale = AppUtil.createScaleY(0, max, height - 2 * margin.vertical, margin.vertical);

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
                    !userData || !userData.stats || !data.x.length ? <View style={{ height: AppSizes.screen.usableHeight - 10 - chartHeaderHeight - tabbarHeight - preprocessingHeight - TAB_NAVIGATOR_HEIGHT }}><Placeholder text={'No data to show for this range...'} /></View> :
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
                                    ticks={11}
                                    startVal={0}
                                    endVal={max}
                                    scale={yScale}
                                    vertical />
                                {
                                    data.x.map((xValues, index) => this.renderBar(width - margin.horizontal, height - 2 * margin.vertical, yScale(max-data.y1[index])-yScale(max), yScale(max-data.y2[index])-yScale(max), index))
                                }
                            </Svg>
                            <Spacer size={20}/>
                            <View style={{ zIndex: 1, flexDirection: 'row', backgroundColor: AppColors.white }} onLayout={ev => this.setState({ listHeaderHeight: ev.nativeEvent.layout.height })}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 2 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={[styles.subtext]}>7day</Text>
                                        <Text style={[styles.subtext]}>ACWR</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={[styles.subtext]}>CHRONIC</Text>
                                        <Text style={[styles.subtext]}>DAILY AVG</Text>
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
                                return user.loading ? null : startRequest()
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

    compareChronicDailyAverage = (a, b) => {
        return this.props.graphNum === 1 ? b.chronicGRF - a.chronicGRF : b.chronicTotalAccel - a.chronicTotalAccel;
    }

    chartList = () => {
        let { user, graphNum } = this.props;

        let team = user.teams[user.teamIndex];
        let stats = team.stats;
        let athleteData = stats.AthleteMovementQualityData;

        if (!athleteData || !athleteData.length) {
            return null;
        }

        if (user.role === Roles.athlete) {
            athleteData = athleteData.sort(this.compareChronicDailyAverage);
            let athleteStatsIndex = athleteData.findIndex(athlete => athlete.userId === user.id);
            let athleteStats = athleteStatsIndex > -1 ? athleteData[athleteStatsIndex] : null;
            let trainingGroups = team.training_groups.filter(teamTrainingGroup => teamTrainingGroup.active && teamTrainingGroup.id !== 1 && teamTrainingGroup.users.some(teamTrainingGroupUser => teamTrainingGroupUser.id === user.id));
            trainingGroups = trainingGroups.map(trainingGroup => {
                let trainingGroupUsers = trainingGroup.users.map(trainingGroupUser => {
                    let trainingGroupAthleteStats = athleteData.find(athlete => athlete.userId === trainingGroupUser.id);
                    trainingGroupUser = Object.assign({}, trainingGroupUser, {
                        ...trainingGroupAthleteStats
                    });
                    return trainingGroupUser;
                });
                trainingGroupUsers = trainingGroupUsers.sort(this.compareChronicDailyAverage);
                trainingGroup.users = trainingGroupUsers;
                return trainingGroup;
            });
            return athleteStats ? <ScrollView style={{ zIndex: 0, backgroundColor: AppColors.secondary.light_blue.hundredPercent, height: AppSizes.screen.usableHeight - (this.props.height + this.state.chartHeaderHeight + this.state.listHeaderHeight + 10 + TAB_NAVIGATOR_HEIGHT) }} scrollEnabled={true} contentContainerStyle={{ height: 220 }}>
                <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: AppColors.primary.grey.thirtyPercent }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                        <Text style={[AppStyles.subtext, { color: this.getColor(graphNum === 1 ? athleteStats.acwrGRF7 : athleteStats.acwrTotalAccel7) }]}>{graphNum === 1 ? athleteStats.acwrGRF7 || '-' : athleteStats.acwrTotalAccel7 || '-'}</Text>
                        <Text style={[AppStyles.subtext, { color: AppColors.primary.grey.hundredPercent }]}>{graphNum === 1 ? athleteStats.chronicGRF : athleteStats.chronicTotalAccel}</Text>
                    </View>
                    <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                        <Text style={{ color: this.getColor(athleteStats.acwrGRF7) }}>{user.first_name} {user.last_name}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: AppColors.white }}>
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

        return <ScrollView style={{ zIndex: 0, backgroundColor: AppColors.secondary.light_blue.hundredPercent, height: AppSizes.screen.usableHeight - (this.props.height + this.state.chartHeaderHeight + this.state.listHeaderHeight + 10 + TAB_NAVIGATOR_HEIGHT) }} scrollEnabled={true} contentContainerStyle={{ height: (stats.AthleteMovementQualityData ? stats.AthleteMovementQualityData.length + 1 : 0) * 55 }}>
            <TouchableHighlight key={-1} onPress={() => this.props.setStatsCategory(false, null)}>
                <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: user.selectedStats.athlete ? AppColors.white : AppColors.primary.grey.thirtyPercent }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                        <Text style={[AppStyles.subtext, { color: this.getColor(graphNum === 1 ? stats.acwrGRF7 : stats.acwrTotalAccel7) }]}>{graphNum === 1 ? stats.acwrGRF7 || '-' : stats.acwrTotalAccel7 || '-'}</Text>
                        <Text style={[AppStyles.subtext, { color: AppColors.primary.grey.hundredPercent }]}>{graphNum === 1 ? stats.chronicGRF : stats.chronicTotalAccel}</Text>
                    </View>
                    <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                        <Text style={{ color: this.getColor(graphNum === 1 ? stats.acwrGRF7 : stats.acwrTotalAccel7) }}>Team Avg</Text>
                    </View>
                </View>
            </TouchableHighlight>
            {
                stats.AthleteMovementQualityData && stats.AthleteMovementQualityData.length
                    ? stats.AthleteMovementQualityData.map((athleteMovementQualityData, index) => {
                        let athlete = team.users_with_training_groups.find(userInGroup => userInGroup.id === athleteMovementQualityData.userId);
                        return athlete
                            ? <TouchableHighlight key={index} onPress={() => this.props.setStatsCategory(true, athlete.id)}>
                                <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: user.selectedStats.athlete && user.selectedStats.athleteId === athlete.id ? AppColors.primary.grey.thirtyPercent : AppColors.white }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                                        <Text style={[AppStyles.subtext, { color: this.getColor(graphNum === 1 ? athleteMovementQualityData.acwrGRF7 : athleteMovementQualityData.acwrTotalAccel7) }]}>{graphNum === 1 ? athleteMovementQualityData.acwrGRF7 || '-' : athleteMovementQualityData.acwrTotalAccel7 || '-'}</Text>
                                        <Text style={[AppStyles.subtext, { color: AppColors.primary.grey.hundredPercent }]}>{graphNum === 1 ? athleteMovementQualityData.chronicGRF : athleteMovementQualityData.chronicTotalAccel}</Text>
                                    </View>
                                    <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                                        <Text style={{ color: this.getColor(graphNum === 1 ? athleteMovementQualityData.acwrGRF7 : athleteMovementQualityData.acwrTotalAccel7) }}>{athlete.first_name} {athlete.last_name}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                            : null;
                    })
                    : null
            }
        </ScrollView>
    };
}

/* Export Component ==================================================================== */
export default StackedBarChart;
