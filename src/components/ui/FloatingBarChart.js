/*
 * @Author: Vir Desai 
 * @Date: 2017-10-16 14:59:35 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-23 11:24:09
 */

/**
 * FloatingBarChart
 *
     <FloatingBarChart data={x: [], y1: [], y2: []} xAxis={'Time'} yAxis={'Cookies eaten'} width={100} height={100} />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { AppUtil } from '@lib/';

// Components
import { Axis, Spacer, Text } from '@ui/';
import { Placeholder } from '@general/';

const thresholdBar = [
    { max: 50, min: Number.NEGATIVE_INFINITY, differenceMax: Number.POSITIVE_INFINITY, differenceMin: 30, color: AppColors.brand.red },
    { max: 65, min: 51, differenceMax: 29.99, differenceMin: 20, color: AppColors.brand.yellow },
];

const thresholdAcrossDays = [
    { max: -5, min: Number.NEGATIVE_INFINITY, color: AppColors.brand.red },
    { max: -0.01, min: -4.99, color: AppColors.brand.yellow },
];

const thresholdSingleDay = [
    { max: -20, min: Number.NEGATIVE_INFINITY, color: AppColors.brand.red },
    { max: -10, min: -19.99, color: AppColors.brand.yellow },
];


/* Component ==================================================================== */
class FloatingBarChart extends Component {
    static propTypes = {
        xAxis:     PropTypes.string,
        yAxis:     PropTypes.string,
        width:     PropTypes.number,
        height:    PropTypes.number,
        tabOffset: PropTypes.number,
        margin:    PropTypes.shape({
            horizontal: PropTypes.number,
            vertical:   PropTypes.number
        }),
        data: PropTypes.shape({
            x:  PropTypes.array,
            y1: PropTypes.array, // total
            y2: PropTypes.array, // irregular
        }),
        user:             PropTypes.object,
        setStatsCategory: PropTypes.func.isRequired,
        getTeamStats:     PropTypes.func.isRequired
    }

    static defaultProps = {
        xAxis:     null,
        yAxis:     null,
        width:     0,
        height:    0,
        tabOffset: 0,
        margin:    {},
        data:      null,
    }

    constructor(props) {
        super(props);
        this.state = {
            chartHeaderHeight: 0,
            listHeaderHeight:  0,
        };
    }

    getBarColor = (percOptimal, fatigue) => {
        if (!percOptimal || typeof percOptimal !== 'number' || !fatigue || typeof fatigue !== 'number') {
            return AppColors.brand.fogGrey;
        }
        let colorIndex = thresholdBar.findIndex(colorThreshold => colorThreshold.max >= percOptimal && colorThreshold.min <= percOptimal);
        let colorIndex2 = thresholdBar.findIndex(colorThreshold => colorThreshold.differenceMax >= fatigue && colorThreshold.differenceMin <= fatigue);
        if (colorIndex !== -1 && colorIndex2 !== -1) {
            colorIndex = colorIndex > colorIndex2 ? colorIndex2 : colorIndex;
        } else if (colorIndex2 !== -1) {
            colorIndex = colorIndex2;
        } else if ( colorIndex === -1 && colorIndex === -1) {
            colorIndex = null;
        }
        return typeof colorIndex === 'number' ? thresholdBar[colorIndex].color : AppColors.brand.fogGrey;
    }

    getTextColor = (weekValue, dayValue) => {
        let color = AppColors.greyText;
        let colorIndex = typeof weekValue === 'number' ? thresholdAcrossDays.findIndex(colorThreshold => colorThreshold.max >= weekValue && colorThreshold.min <= weekValue) : -1;
        let colorIndex2 =  typeof dayValue === 'number' ? thresholdSingleDay.findIndex(colorThreshold => colorThreshold.max >= dayValue && colorThreshold.min <= dayValue): -1;
        if (colorIndex !== -1 && colorIndex2 !== -1) {
            color = thresholdAcrossDays[colorIndex > colorIndex2 ? colorIndex2 : colorIndex].color;
        } else if (colorIndex2 !== -1) {
            color = thresholdAcrossDays[colorIndex2].color;
        } else if ( colorIndex !== -1) {
            color = thresholdAcrossDays[colorIndex].color;
        }
        return color;
    }

    getTickPoints (start, end, numTicks, length) {
        let res = [];
        let ticksEvery = Math.floor(length / (numTicks - 1));
        for (let cur = start; cur <= end; cur += ticksEvery) { res.push(cur); }
        return res;
    }

    renderBar = (width, y1, y2, index, color) => {
        let array = this.getTickPoints(3 * this.props.margin.horizontal, width + 6 * this.props.margin.horizontal, 7, width);
        return <G key={index}>
            <Rect
                x={array[index] + AppSizes.tickSize+1.5}
                y={y1}
                width={8}
                height={Math.abs(y2)}
                fill={color}
            />
        </G>
    }

    render = () => {
        let {xAxis, yAxis, width, height, margin, data, tabOffset, user} = this.props;

        let startDateComponents = user.statsStartDate ? user.statsStartDate.split('-') : (new Date()).toLocaleDateString().split('/');
        let endDateComponents = user.statsEndDate ? user.statsEndDate.split('-') : (new Date()).toLocaleDateString().split('/');
        let xScale = data ? data.x[0] instanceof Date ? AppUtil.createTimeScaleX(data.x[0], data.x[data.x.length - 1], width - 2 * margin.horizontal) : AppUtil.createScaleX(data.x[0], data.x[data.x.length - 1], width - 2 * margin.horizontal) : null;
        let yScale = AppUtil.createScaleY(0, 100, height - 2 * margin.vertical, margin.vertical);
        let paddingLeft = AppSizes.padding
        let paddingRight = AppSizes.padding;

        return (
            <View>
                <View style={{ flexDirection: 'row' }} onLayout={ev => this.setState({ chartHeaderHeight: ev.nativeEvent.layout.height })}>
                    <TouchableWithoutFeedback onPress={() => user.teams[user.teamIndex] ? this.props.getTeamStats(user.teams[user.teamIndex].id, user.weekOffset-1) : null}>
                        <View style={[AppStyles.containerCentered, { flex: 1 }]}><Spacer /><Text h3>{'<'}</Text><Spacer /></View>
                    </TouchableWithoutFeedback>
                    <View style={[AppStyles.containerCentered, { flex: 2 }]}>
                        <Text>{`${startDateComponents[1]}/${startDateComponents[2]}/${startDateComponents[0].substring(2)}`}-{`${endDateComponents[1]}/${endDateComponents[2]}/${endDateComponents[0].substring(2)}`}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => user.teams[user.teamIndex] ? this.props.getTeamStats(user.teams[user.teamIndex].id, user.weekOffset+1) : null}>
                        <View style={[AppStyles.containerCentered, { flex: 1 }]}><Spacer /><Text h3>{'>'}</Text><Spacer /></View>
                    </TouchableWithoutFeedback>
                </View>
                {
                    !user.teams[user.teamIndex] || !user.teams[user.teamIndex].stats ? <View style={{ alignSelf: 'center' }}><Placeholder text={'No data to show for this range...'} /></View> :
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
                                    endVal={100}
                                    scale={yScale}
                                    vertical />
                                {
                                    data.x.map((xValues, index) => this.renderBar(width - margin.horizontal, data.y2[index] > 0 ? yScale(data.y1[index]+data.y2[index]) : yScale(data.y1[index]), yScale(data.y1[index])-yScale(data.y1[index]+data.y2[index]), index, this.getBarColor(data.y1[index], Math.abs(data.y2[index]))))
                                }
                            </Svg>
                            <Spacer size={20}/>
                            <View style={{ flexDirection: 'row' }} onLayout={ev => this.setState({ listHeaderHeight: ev.nativeEvent.layout.height })}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <View>
                                        <Text style={AppStyles.subtext}>RATE OF CHANGE</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={AppStyles.subtext}>WEEKLY</Text>
                                            <Text style={AppStyles.subtext}>DAILY</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}/>
                            </View>
                            <ScrollView style={{ backgroundColor: AppColors.brand.light, height: AppSizes.screen.usableHeight - (this.props.height + this.state.chartHeaderHeight + this.state.listHeaderHeight + 10) }} scrollEnabled={true} contentContainerStyle={{ height: (user.teams[user.teamIndex].stats && user.teams[user.teamIndex].stats.AthleteMovementQualityData ? user.teams[user.teamIndex].stats.AthleteMovementQualityData.length + 1 : 0) * 55 }}>
                                <TouchableHighlight key={-1} onPress={() => this.props.setStatsCategory(false, null)}>
                                    <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: user.selectedStats.athlete ? 'white' : AppColors.lightGrey }}>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                                            <Text style={[AppStyles.subtext, { paddingLeft, color: this.getTextColor(user.teams[user.teamIndex].stats ? user.teams[user.teamIndex].stats.fatigueRateOfChange : 0, null) }]}>{user.teams[user.teamIndex].stats ? user.teams[user.teamIndex].stats.fatigueRateOfChange : ''}</Text>
                                            <Text style={[AppStyles.subtext, { paddingRight, color: this.getTextColor(null, user.teams[user.teamIndex].stats ? user.teams[user.teamIndex].stats.avgFatigue : 0) }]}>{user.teams[user.teamIndex].stats ? user.teams[user.teamIndex].stats.avgFatigue : ''}</Text>
                                        </View>
                                        <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                                            <Text style={{ color: this.getTextColor(user.teams[user.teamIndex].stats ? user.teams[user.teamIndex].stats.fatigueRateOfChange : 0, user.teams[user.teamIndex].stats ? user.teams[user.teamIndex].stats.avgFatigue : 0) }}>Team Avg</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                {
                                    user.teams[user.teamIndex].stats && user.teams[user.teamIndex].stats.AthleteMovementQualityData && user.teams[user.teamIndex].stats.AthleteMovementQualityData.length
                                        ? user.teams[user.teamIndex].stats.AthleteMovementQualityData.map((athleteMovementQualityData, index) => {
                                            let athlete = user.teams[user.teamIndex].users_with_training_groups.find(userInGroup => userInGroup.id === athleteMovementQualityData.userId);
                                            return athlete
                                                ? <TouchableHighlight key={index} onPress={() => this.props.setStatsCategory(true, athlete.id)}>
                                                    <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: user.selectedStats.athlete && user.selectedStats.athleteId === athlete.id ? AppColors.lightGrey : 'white' }}>
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
                                        : null
                                }
                            </ScrollView>
                        </View>
                }
            </View>
        );
    };
}

/* Export Component ==================================================================== */
export default FloatingBarChart;
